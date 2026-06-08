import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function mapApiProperty(p) {
  return {
    id: p.id,
    title: p.titulo,
    description: p.descricao || '',
    type: p.tipo,
    dealType: p.transacao,
    price: p.preco,
    neighborhood: p.bairro,
    city: p.cidade || '',
    cep: p.cep || '',
    area: p.area || 0,
    bedrooms: p.quartos || 0,
    suites: p.suites || 0,
    bathrooms: p.banheiros || 0,
    garages: p.vagas || 0,
    images: p.imagem ? [p.imagem] : [],
    features: [],
    badgeType: null,
    lat: p.latitude || null,
    lng: p.longitude || null,
  };
}

const AppContext = createContext(null);

/* eslint-disable react-refresh/only-export-components */
export function AppProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState(() =>
    loadFromLocalStorage('broker_leads', [])
  );
  const [isLoading, setIsLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      const token = localStorage.getItem('broker_admin_token');
      return !!token;
    } catch { return false; }
  });
  const [adminToken, setAdminToken] = useState(() => {
    try { return localStorage.getItem('broker_admin_token'); } catch { return null; }
  });

  const [favorites, setFavorites] = useState(() =>
    loadFromLocalStorage('broker_favorites', [])
  );
  const [visits, setVisits] = useState(() =>
    loadFromLocalStorage('broker_visits', [])
  );

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalPropriedades, setTotalPropriedades] = useState(0);

  const fetchLeads = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (!res.ok) return;
      const leadsData = await res.json();
      setLeads(leadsData.leads.map(l => ({
        id: l.id,
        nome: l.nome,
        telefone: l.telefone,
        email: l.email || '',
        mensagem: l.mensagem || '',
        id_imovel: l.id_imovel,
        createdAt: l.data_criacao || new Date().toISOString(),
      })));
    } catch {
      // silêncio
    }
  }, [adminToken]);

  const fetchProperties = useCallback(async (page = 1, append = false) => {
    setPropertiesLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/imoveis?limite=12&pagina=${page}`);
      if (!res.ok) throw new Error(`Erro ao buscar imóveis: ${res.status}`);
      const data = await res.json();
      const mapped = data.imoveis.map(mapApiProperty);
      setProperties(prev => append ? [...prev, ...mapped] : mapped);
      setPagina(data.pagina);
      setTotalPaginas(data.total_paginas);
      setTotalPropriedades(data.total);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setApiError(null);

      try {
        const imoveisRes = await fetch(`${API_BASE}/imoveis?limite=100&pagina=1`);

        if (!imoveisRes.ok) throw new Error(`Erro ao buscar imóveis: ${imoveisRes.status}`);

        const imoveisData = await imoveisRes.json();

        if (!cancelled) {
          setProperties(imoveisData.imoveis.map(mapApiProperty));
          setPagina(imoveisData.pagina);
          setTotalPaginas(imoveisData.total_paginas);
          setTotalPropriedades(imoveisData.total);
        }

        if (isAdminAuthenticated) {
          try {
            const leadsRes = await fetch(`${API_BASE}/leads`, {
              headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
            });
            if (leadsRes.ok && !cancelled) {
              const leadsData = await leadsRes.json();
              setLeads(leadsData.leads.map(l => ({
                id: l.id,
                nome: l.nome,
                telefone: l.telefone,
                email: l.email || '',
                mensagem: l.mensagem || '',
                id_imovel: l.id_imovel,
                createdAt: l.data_criacao || new Date().toISOString(),
              })));
            }
          } catch {
            /* silêncio */
          }
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
        if (!cancelled) setPropertiesLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    saveToLocalStorage('broker_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    saveToLocalStorage('broker_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    saveToLocalStorage('broker_leads', JSON.stringify(leads));
  }, [leads]);

  const handleLogin = useCallback(async (passcode) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (!res.ok) throw new Error('Código de acesso incorreto');
    const data = await res.json();
    setAdminToken(data.access_token);
    setIsAdminAuthenticated(true);
    try { localStorage.setItem('broker_admin_token', data.access_token); } catch { /* ignore */ }
    fetchLeads();
    return true;
  }, [fetchLeads]);

  const handleLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    setAdminToken(null);
    try {
      localStorage.removeItem('broker_admin_token');
      localStorage.removeItem('broker_admin_auth');
    } catch { /* ignore */ }
  }, []);

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const addLead = useCallback(async (lead) => {
    const payload = {
      nome: lead.nome || lead.name || '',
      telefone: lead.telefone || lead.phone || '',
      email: lead.email || '',
      mensagem: lead.mensagem || lead.message || '',
      id_imovel: lead.id_imovel || lead.propertyId || '',
    };

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Erro ao cadastrar lead: ${res.status}`);
      }
      const data = await res.json();

      setLeads(prev => [{
        id: data.id,
        nome: payload.nome,
        telefone: payload.telefone,
        email: payload.email,
        mensagem: payload.mensagem,
        id_imovel: payload.id_imovel,
        createdAt: new Date().toISOString(),
      }, ...prev]);

      return data;
    } catch (err) {
      console.error('Falha ao cadastrar lead:', err);
      throw err;
    }
  }, []);

  const addVisit = useCallback((visit) => {
    setVisits(prev => [visit, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      properties, setProperties,
      isAdminAuthenticated, setIsAdminAuthenticated,
      adminToken,
      favorites, setFavorites,
      leads, setLeads,
      visits, setVisits,
      handleLogin, handleLogout, toggleFavorite, addLead, addVisit,
      isLoading, propertiesLoading, apiError,
      fetchProperties, fetchLeads, pagina, totalPaginas, totalPropriedades,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
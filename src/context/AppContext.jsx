import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { initialProperties } from '../data/mockProperties';

const AppContext = createContext(null);

/* eslint-disable react-refresh/only-export-components */
export function AppProvider({ children }) {
  const [properties, setProperties] = useState(() => {
    const data = loadFromLocalStorage('broker_properties', initialProperties);
    if (!Array.isArray(data) || !initialProperties.length) return data;
    return data.map(p => {
      if (p.lat && p.lng) return p;
      const mock = initialProperties.find(m => m.id === p.id);
      return mock?.lat && mock?.lng ? { ...p, lat: mock.lat, lng: mock.lng } : p;
    });
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try { return localStorage.getItem('broker_admin_auth') === 'true'; } catch { return false; }
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState(() =>
    loadFromLocalStorage('broker_favorites', [])
  );
  const [leads, setLeads] = useState(() =>
    loadFromLocalStorage('broker_leads', [])
  );
  const [visits, setVisits] = useState(() =>
    loadFromLocalStorage('broker_visits', [])
  );

  useEffect(() => {
    saveToLocalStorage('broker_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    saveToLocalStorage('broker_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    saveToLocalStorage('broker_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    saveToLocalStorage('broker_visits', JSON.stringify(visits));
  }, [visits]);

  const handleLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    try { localStorage.removeItem('broker_admin_auth'); } catch { /* ignore */ }
  }, []);

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const addLead = useCallback((lead) => {
    setLeads(prev => [lead, ...prev]);
  }, []);

  const addVisit = useCallback((visit) => {
    setVisits(prev => [visit, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      properties, setProperties,
      isAdminAuthenticated, setIsAdminAuthenticated,
      selectedProperty, setSelectedProperty,
      favorites, setFavorites,
      leads, setLeads,
      visits, setVisits,
      handleLogout, toggleFavorite, addLead, addVisit,
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

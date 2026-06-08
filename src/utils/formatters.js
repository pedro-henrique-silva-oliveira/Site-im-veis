export const predefinedFeatures = [
  "Piscina", "Churrasqueira", "Varanda Gourmet", "Academia", "Ar Condicionado",
  "Mobiliado", "Condomínio Fechado", "Portaria 24h", "Elevador", "Salão de Festas",
  "Segurança 24h", "Permite Pets", "Armários Embutidos", "Aquecimento Central", "Quintal"
];

export function formatPrice(value, type) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  }).format(value);
  return type === 'aluguel' ? `${formatted}/mês` : formatted;
}

export function generatePropertyUrl(id) {
  return `/imovel/${id}`;
}

export function geocodeCEP(cep) {
  const cleanCep = cep.replace(/\D/g, '');
  if (!cleanCep || cleanCep.length < 8) return Promise.reject(new Error('CEP inválido'));
  return fetch(`https://cep.awesomeapi.com.br/json/${cleanCep}`)
    .then(r => r.json())
    .then(data => {
      if (data.lat && data.lng) {
        return { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
      }
      throw new Error('AwesomeAPI sem coordenadas');
    });
}

export function geocodeProperty(property) {
  const query = `${property.neighborhood}, ${property.city}, Brasil`;
  return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
    .then(r => r.json())
    .then(data => {
      if (data?.[0]) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      throw new Error('Não encontrado');
    });
}

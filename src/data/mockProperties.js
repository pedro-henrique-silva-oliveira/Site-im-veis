export const initialProperties = [
  {
    id: "1",
    title: "Apartamento de Alto Padrão no Jardins",
    description: "Excelente apartamento reformado com acabamento impecável. Sala ampla com 3 ambientes integrada a uma varanda gourmet espaçosa com vista para a copa das árvores. Copa-cozinha planejada repleta de armários de excelente qualidade, área de serviço completa e dependência de funcionário.",
    type: "apartamento",
    dealType: "venda",
    price: 2450000,
    neighborhood: "Jardins",
    city: "São Paulo",
    cep: "01414-001",
    area: 180,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    garages: 2,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Varanda Gourmet", "Mobiliado", "Ar Condicionado", "Portaria 24h", "Academia", "Piscina"],
    lat: -23.5703,
    lng: -46.6623
  },
  {
    id: "2",
    title: "Casa de Luxo com Piscina e Área Gourmet",
    description: "Maravilhosa casa contemporânea em condomínio fechado. Living com pé direito duplo, totalmente integrado à área de lazer. Cozinha gourmet equipada, piscina com borda infinita, churrasqueira, forno de pizza e um lindo projeto de paisagismo.",
    type: "casa",
    dealType: "venda",
    price: 4890000,
    neighborhood: "Alphaville",
    city: "Barueri",
    cep: "06401-000",
    area: 450,
    bedrooms: 4,
    suites: 4,
    bathrooms: 6,
    garages: 4,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Condomínio Fechado", "Piscina", "Espaço Gourmet", "Pé Direito Duplo", "Churrasqueira", "Energia Solar"],
    lat: -23.4963,
    lng: -46.8525
  },
  {
    id: "3",
    title: "Cobertura Duplex Dupla Vista Mar",
    description: "Espetacular cobertura duplex totalmente reformada por arquiteto renomado. Primeiro pavimento com salão, varanda integrada, 2 suítes, copa-cozinha moderna. Segundo pavimento com suíte master de tirar o fôlego, terraço com jacuzzi e vista cinematográfica para o mar.",
    type: "apartamento",
    dealType: "venda",
    price: 8500000,
    neighborhood: "Ipanema",
    city: "Rio de Janeiro",
    cep: "22411-000",
    area: 310,
    bedrooms: 3,
    suites: 3,
    bathrooms: 5,
    garages: 3,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Cobertura", "Frente Mar", "Jacuzzi", "Segurança 24h", "Terraço", "Reformado"],
    lat: -22.9838,
    lng: -43.2087
  },
  {
    id: "4",
    title: "Lindo Studio Mobiliado e Moderno",
    description: "Perfeito para investimento ou moradia, próximo ao metrô. Studio totalmente mobiliado com marcenaria planejada inteligente para otimização de espaço. Ar condicionado instalado, eletrodomésticos novos na cozinha e fechadura eletrônica. Prédio com lazer completo na cobertura.",
    type: "apartamento",
    dealType: "aluguel",
    price: 3200,
    neighborhood: "Pinheiros",
    city: "São Paulo",
    cep: "05422-001",
    area: 38,
    bedrooms: 1,
    suites: 1,
    bathrooms: 1,
    garages: 1,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Mobiliado", "Próximo ao Metrô", "Lazer no Rooftop", "Academia", "Lavanderia no Prédio", "Portaria Virtual"],
    lat: -23.5652,
    lng: -46.6827
  },
  {
    id: "5",
    title: "Sobrado Moderno em Bairro Nobre",
    description: "Excelente sobrado com acabamento refinado. 3 dormitórios amplos, quintal espaçoso com churrasqueira e vaga para dois carros. Cozinha americana integrada, piso em porcelanato na área social e laminado de alta resistência nos quartos. Localização privilegiada em rua tranquila.",
    type: "casa",
    dealType: "venda",
    price: 980000,
    neighborhood: "Moema",
    city: "São Paulo",
    cep: "04521-001",
    area: 160,
    bedrooms: 3,
    suites: 1,
    bathrooms: 3,
    garages: 2,
    images: [
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Churrasqueira", "Quintal", "Portão Eletrônico", "Rua Tranquila", "Perto de Parque"],
    lat: -23.6081,
    lng: -46.6649
  },
  {
    id: "6",
    title: "Casa de Condomínio Moderna e Integrada",
    description: "Excelente sobrado para locação em condomínio com infraestrutura completa de lazer e segurança. Casa com 4 dormitórios amplos, escritório, sala de TV e área gourmet integrada à piscina aquecida.",
    type: "casa",
    dealType: "aluguel",
    price: 15000,
    neighborhood: "Grama",
    city: "Campinas",
    cep: "13080-000",
    area: 320,
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    garages: 4,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Condomínio Fechado", "Piscina Aquecida", "Churrasqueira", "Escritório", "Segurança 24h"],
    lat: -22.9068,
    lng: -47.0618
  }
];

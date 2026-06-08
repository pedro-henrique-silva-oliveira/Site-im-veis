# Pedro H. Corretor — Portal Imobiliário Full-Stack

Portal imobiliário SPA moderno e responsivo com **backend em FastAPI + SQLite e frontend em React 19 + Vite + Tailwind CSS**. Inclui vitrine de imóveis, mapa interativo, painel administrativo com autenticação JWT, calculadora de financiamento com análise de crédito via CPF, captura de leads e mais.

---

## Índice

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Build para Produção](#build-para-produção)
- [Deploy no PythonAnywhere](#deploy-no-pythonanywhere)
- [API Endpoints](#api-endpoints)
- [Configuração](#configuração)
- [Páginas e Rotas](#páginas-e-rotas)
- [Componentes](#componentes)
- [Contexto Global (AppContext)](#contexto-global-appcontext)
- [Painel Administrativo](#painel-administrativo)
- [Calculadora de Financiamento e Crédito](#calculadora-de-financiamento-e-crédito)
- [Geocodificação](#geocodificação)
- [SEO](#seo)
- [Leads e Agendamentos](#leads-e-agendamentos)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## Tecnologias

### Frontend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| **React** | ^19.2.6 | Biblioteca principal de UI |
| **Vite** | ^8.0.12 | Bundler e dev server |
| **React Router DOM** | ^7.16.0 | Roteamento SPA |
| **Tailwind CSS** | ^4.3.0 | Estilização utilitária |
| **Leaflet / React-Leaflet** | ^1.9.4 / ^5.0.0 | Mapas interativos (OpenStreetMap) |
| **Lucide React** | ^1.17.0 | Ícones SVG |
| **React Helmet Async** | ^3.0.0 | Gerenciamento de &lt;head&gt; (SEO) |

### Backend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| **FastAPI** | ^0.110.0 | Framework REST |
| **Uvicorn** | ^0.29.0 | Servidor ASGI |
| **SQLAlchemy** | ^2.0.0 | ORM |
| **SQLite** | — | Banco de dados |
| **Jose** (python-jose) | ^3.3.0 | JWT (autenticação admin) |
| **Python Dotenv** | ^1.0.0 | Variáveis de ambiente |
| **A2WSGI** | ^1.10.0 | Deploy WSGI (PythonAnywhere) |

**Frontend:** JavaScript (JSX) / **Backend:** Python 3.12+

---

## Arquitetura

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  React SPA  │────▶│  FastAPI     │────▶│  SQLite  │
│  (Vite)     │     │  (Uvicorn)   │     │  .db     │
└─────────────┘     └──────────────┘     └──────────┘
       │                    │
       ▼                    ▼
   localStorage     JWT Auth (admin)
  (favoritos,       POST /auth/login
   visitas)         Bearer token
```

- O frontend consome a API REST via `fetch()` com prefixo `/api`
- Em desenvolvimento, o Vite proxy redireciona `/api` para `localhost:8000`
- Em produção, o WSGI roteia `/api/*` para o FastAPI e serve o SPA para as demais rotas
- Autenticação admin via JWT armazenado no `localStorage`
- Leads salvos tanto no backend (SQLite) quanto no `localStorage` (fallback)

---

## Funcionalidades

### Vitrine de Imóveis
- **Home Page** com grid responsivo (3 colunas) e paginação
- **Busca com filtros:** texto (bairro/cidade), tipo de transação (venda/aluguel), tipo de imóvel, faixa de preço, quartos
- **Ordenação:** mais recentes, menor preço, maior preço, maior área
- **"Carregar mais"** com paginação incremental
- **Filtro de favoritos** para exibir apenas imóveis salvos
- **Fallback de imagem** quando a URL falha (ícone de erro)

### Página de Detalhes (`/imovel/:id`)
- Galeria de imagens com lightbox e navegação por teclado
- Grid de especificações: área, quartos, suítes, banheiros, vagas
- Descrição completa
- Características do imóvel com checkmarks
- Mapa incorporado do Google Maps (baseado no CEP)
- Sidebar sticky com:
  - Preço formatado
  - Botão "Falar no WhatsApp"
  - Botão de favoritar
- Formulário de agendamento de visita
- **Calculadora de financiamento + análise de crédito via CPF**
- Link para simular na Caixa Econômica Federal
- Imóveis relacionados
- JSON-LD com schema.org para SEO

### Mapa Interativo (`/mapa`)
- Leaflet com OpenStreetMap
- Marcadores customizados para imóveis com coordenadas
- Popups com foto, título, preço e link
- Sidebar com lista de imóveis (verdes = no mapa, cinza = sem coordenadas)
- Geocodificação automática via Nominatim

### Painel Administrativo (`/admin`)
- **Login com JWT** (backend valida senha via `POST /auth/login`)
- **Dashboard** com estatísticas (total, venda, locação)
- **CRUD completo** com paginação via API
- **Upload de imagens** por arquivo (base64) ou URL externa
- **Gerenciamento de leads** (nome, telefone, email, data, imóvel, mensagem)
- Acesso exclusivamente pela URL `/admin` (sem links no header/footer)

### Análise de Crédito
- Campo de CPF com máscara `###.###.###-##`
- Opção de informar a renda mensal
- Consulta ao backend que valida o CPF e simula aprovação
- Regra dos 30%: parcela não pode exceder 30% da renda
- Resultado visual: verde (aprovado) ou vermelho (reprovado)
- Mensagem explicativa com valores máximos
- Link direto para o simulador oficial da Caixa

### Leads e Agendamentos
- Formulário de contato salva lead no backend + abre WhatsApp
- Formulário de agendamento de visita com validação de data
- Persistência no backend e fallback no `localStorage`

### Favoritos
- Botão coração em cada card
- Alterna favorito/não favorito
- Persistência no `localStorage`
- Filtro na home para exibir apenas favoritos

### SEO
- Meta tags dinâmicas via `React Helmet Async`
- Open Graph tags para redes sociais
- JSON-LD com schema.org/RealEstateListing
- Admin com `noindex, nofollow`

### Design Responsivo
- Layout adaptável para mobile, tablet e desktop
- Tailwind CSS com paleta slate/indigo/emerald
- Interface limpa com bordas arredondadas e transições suaves

---

## Estrutura do Projeto

```
├── .env                          # Variáveis de ambiente (raiz)
├── vite.config.js                # Configuração do Vite + proxy /api
├── package.json
├── PADEploy.md                   # Instruções de deploy PythonAnywhere
├── dist/                         # Build de produção (gerado)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Rotas (React.lazy + Suspense)
│   ├── index.css                 # Tailwind + Leaflet + custom scrollbar
│   ├── context/
│   │   └── AppContext.jsx        # Estado global (properties, auth, leads, favoritos)
│   ├── utils/
│   │   ├── formatters.js         # formatPrice, geocodeCEP, geocodeProperty
│   │   └── localStorage.js       # saveToLocalStorage, loadFromLocalStorage
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx       # Busca e filtros
│   │   ├── PropertyCard.jsx      # Card com fallback de imagem
│   │   ├── FavoritesButton.jsx
│   │   ├── ContactForm.jsx       # Lead + WhatsApp
│   │   ├── ScheduleVisit.jsx     # Agendamento
│   │   ├── FinanceCalculator.jsx # Price + CPF + crédito + link Caixa
│   │   ├── ImageLightbox.jsx
│   │   ├── RelatedProperties.jsx
│   │   ├── BenefitsSection.jsx
│   │   ├── AdminLogin.jsx        # Login JWT
│   │   ├── AdminDashboard.jsx    # CRUD + leads + visitas
│   │   └── CRUDForm.jsx          # Modal cadastro/edição
│   └── pages/
│       ├── HomePage.jsx
│       ├── PropertyPage.jsx
│       ├── AdminPage.jsx
│       └── MapPage.jsx
└── backend/
    ├── main.py                   # FastAPI app (todas as rotas)
    ├── models.py                 # SQLAlchemy models (Imovel, Lead)
    ├── database.py               # Engine + SessionLocal + Base
    ├── wsgi.py                   # Entry point PythonAnywhere
    ├── .env                      # ADMIN_PASSCODE, JWT_SECRET_KEY, CORS_ORIGINS
    ├── requirements.txt          # Dependências Python
    └── imobiliaria.db            # SQLite (gerado automaticamente)
```

---

## Como Executar

### Pré-requisitos
- Node.js 18+ e npm
- Python 3.12+

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
npm install
npm run dev
```

O frontend será iniciado em `http://localhost:5173` com proxy para o backend em `http://localhost:8000`.

---

## Build para Produção

```bash
# Build do frontend (sem VITE_API_URL = usa /api relativo)
$env:VITE_API_URL=""; npm run build   # Windows PowerShell
VITE_API_URL="" npm run build          # Linux/Mac

# Preview local
npm run preview
```

O build será gerado na pasta `dist/`.

---

## Deploy no PythonAnywhere

Consulte o arquivo [`PADEploy.md`](PADEploy.md) com o passo a passo completo.

Resumo:
1. Crie conta em [pythonanywhere.com](https://www.pythonanywhere.com)
2. Clone o repositório no console Bash
3. Crie virtualenv e instale dependências
4. Configure Web App (Manual config → Python 3.12 → WSGI: `backend/wsgi.py`)
5. Mapeie `/assets/` → `dist/assets/` como arquivos estáticos
6. Execute `npm run build` (sem `VITE_API_URL`)
7. Ajuste `backend/.env` com o domínio do PythonAnywhere
8. Recarregue o web app

---

## API Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/` | — | Health check |
| `POST` | `/auth/login` | — | Login admin (retorna JWT) |
| `GET` | `/imoveis` | — | Listar imóveis (paginado, filtrável) |
| `GET` | `/imoveis/{id}` | — | Obter imóvel por ID |
| `POST` | `/imoveis` | JWT | Criar imóvel |
| `PUT` | `/imoveis/{id}` | JWT | Atualizar imóvel |
| `DELETE` | `/imoveis/{id}` | JWT | Deletar imóvel |
| `POST` | `/leads` | — | Cadastrar lead |
| `GET` | `/leads` | JWT | Listar leads |
| `POST` | `/simular/credito` | — | Simular análise de crédito |

### Parâmetros de listagem (`GET /imoveis`)

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `limite` | int (1-100) | Resultados por página (padrão 12) |
| `pagina` | int (≥1) | Número da página (padrão 1) |
| `bairro` | string | Filtro por bairro |
| `cidade` | string | Filtro por cidade |
| `preco_min` | float | Preço mínimo |
| `preco_max` | float | Preço máximo |
| `quartos` | int | Mínimo de quartos |
| `tipo` | enum | `casa`, `apartamento`, `terreno`, `comercial` |
| `transacao` | enum | `venda`, `aluguel` |

### Simular Crédito (`POST /simular/credito`)

```json
{
  "cpf": "52998224725",
  "valor_financiamento": 200000,
  "renda_mensal": null,
  "taxa_juros": 9.5,
  "prazo_meses": 360
}
```

Retorno:
```json
{
  "aprovado": true,
  "mensagem": "CPF aprovado! Renda estimada: R$ 8.800...",
  "renda_estimada": 8800.0,
  "parcela_simulada": 1681.71,
  "valor_maximo_parcela": 2640.0,
  "valor_maximo_financiamento": 313966.44
}
```

---

## Configuração

### Variáveis de Ambiente (`backend/.env`)

```env
ADMIN_PASSCODE=1234
JWT_SECRET_KEY=super-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://meusite.pythonanywhere.com
```

| Variável | Descrição | Padrão |
|---|---|---|
| `ADMIN_PASSCODE` | Senha para login admin | `1234` |
| `JWT_SECRET_KEY` | Chave secreta para assinar JWT | `super-secret-key-change-in-production` |
| `CORS_ORIGINS` | Origens permitidas (separadas por vírgula) | `http://localhost:5173` |

### Variáveis de Ambiente (`.env` — raiz)

```env
VITE_API_URL=http://localhost:8000
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API (vazio = usa `/api` relativo) | `http://localhost:8000` |

> **Importante:** No build de produção, `VITE_API_URL` deve estar vazio para usar o prefixo relativo `/api`.

---

## Páginas e Rotas

| Rota | Página | Descrição |
|---|---|---|
| `/` | HomePage | Grid com busca, filtros, ordenação, paginação |
| `/imovel/:id` | PropertyPage | Detalhes + financiamento + crédito + agendamento |
| `/admin` | AdminPage | Login JWT + dashboard CRUD |
| `/mapa` | MapPage | Mapa interativo Leaflet |
| `*` | — | Redireciona para `/` |

---

## Componentes

| Componente | Descrição |
|---|---|
| **Header** | Logo + CRECI + navegação (sem link admin) |
| **Footer** | 3 colunas: marca, links rápidos, contato |
| **HeroSection** | Banner + barra de busca + filtros avançados |
| **PropertyCard** | Card com fallback de imagem em caso de erro |
| **FavoritesButton** | Botão coração (ícone only ou com texto) |
| **ContactForm** | Lead + abertura do WhatsApp |
| **ScheduleVisit** | Agendamento com validação de data |
| **FinanceCalculator** | Price + CPF + análise de crédito + link Caixa |
| **ImageLightbox** | Overlay fullscreen com navegação |
| **RelatedProperties** | Até 3 imóveis relacionados |
| **BenefitsSection** | 3 cards de benefícios |
| **AdminLogin** | Input de senha → JWT |
| **AdminDashboard** | Estatísticas + CRUD + leads + visitas |
| **CRUDForm** | Modal com todos os campos + lat/lng |

---

## Contexto Global (AppContext)

O `AppProvider` em `src/context/AppContext.jsx` gerencia o estado global via React Context.

### Estado disponível via `useApp()` hook:

| Propriedade | Tipo | Descrição |
|---|---|---|
| `properties` | Array | Lista de imóveis |
| `setProperties` | Function | Atualiza lista |
| `adminToken` | String/null | Token JWT admin |
| `isAdminAuthenticated` | Boolean | Status da autenticação |
| `favorites` | Array | IDs favoritos |
| `leads` | Array | Lista de leads |
| `visits` | Array | Lista de visitas |
| `isLoading` | Boolean | Loading inicial |
| `propertiesLoading` | Boolean | Loading de imóveis |
| `apiError` | String/null | Erro da API |
| `pagina` | Number | Página atual |
| `totalPaginas` | Number | Total de páginas |
| `totalPropriedades` | Number | Total de imóveis |
| `handleLogin` | Function | Login (JWT) |
| `handleLogout` | Function | Logout |
| `toggleFavorite` | Function | Alterna favorito |
| `addLead` | Function | Adiciona lead |
| `addVisit` | Function | Adiciona visita |
| `fetchProperties` | Function | Busca imóveis (paginado) |
| `fetchLeads` | Function | Busca leads (admin) |

---

## Painel Administrativo

### Acesso
1. Acesse `/admin` diretamente pela URL
2. Digite a senha configurada em `ADMIN_PASSCODE` no `backend/.env`
3. O backend retorna um JWT válido por 8 horas
4. A sessão fica ativa até logout ou expiração do token

### Funcionalidades
- **3 cards de estatísticas:** total, venda, locação
- **Aba "Imóveis":** tabela paginada com buscar/editar/excluir + botão "Cadastrar"
- **Aba "Leads":** lista de leads com nome, telefone, email, data, imóvel, mensagem
- **Botão "Ver Site Público"** abre o site em nova aba

### CRUDForm
- **Básicas:** título, transação, tipo, preço, bairro, cidade, CEP, lat/lng
- **Dimensões:** área, quartos, suítes, banheiros, vagas
- **Descrição:** textarea livre
- **Características:** 15 features toggle + campo customizado
- **Fotos:** upload por arquivo (base64) ou URL, com preview e remoção
- **Geocódigo:** botão "Buscar" preenche lat/lng automaticamente pelo CEP

---

## Calculadora de Financiamento e Crédito

### Simulação Price
- Sliders: entrada (10–80%), taxa anual (5–15%, step 0.5), prazo (5–35 anos)
- Cálculo pela tabela Price (Sistema Francês de Amortização)
- Exibe: valor financiado, parcela mensal, total de juros, total a pagar

### Análise de Crédito via CPF
- Input de CPF com máscara automática
- Opção de informar renda mensal
- Consulta ao endpoint `POST /simular/credito`
- Backend valida CPF (algoritmo dos dígitos verificadores)
- Renda estimada deterministicamente pelos dígitos do CPF
- Regra dos 30%: parcela ≤ 30% da renda
- Resultado visual (verde ✓ / vermelho ✗) com valores máximos

### Link para Caixa
- Abre o simulador oficial da Caixa Econômica Federal em nova aba

---

## Geocodificação

Duas estratégias para obter coordenadas:

1. **Por CEP** (`geocodeCEP`): API pública [AwesomeAPI CEP](https://cep.awesomeapi.com.br)
2. **Por endereço** (`geocodeProperty`): [Nominatim OpenStreetMap](https://nominatim.openstreetmap.org)

Usado no:
- **CRUDForm:** botão "Buscar" preenche lat/lng automaticamente
- **MapPage:** geocodifica imóveis sem coordenadas (delay 300ms)

---

## SEO

Gerenciado pelo `React Helmet Async`:

- **HomePage:** title + Open Graph tags
- **PropertyPage:** title dinâmico + description + JSON-LD (schema.org/RealEstateListing)
- **AdminPage:** `noindex, nofollow`
- **index.html:** meta tags base

---

## Leads e Agendamentos

### Lead (ContactForm)
1. Salva no backend (`POST /leads`) e no `localStorage`
2. Abre WhatsApp com mensagem personalizada

### Visita (ScheduleVisit)
1. Valida data ≥ hoje
2. Salva no `localStorage`
3. Exibe confirmação

---

## Scripts Disponíveis

### Frontend
| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |

### Backend
| Comando | Descrição |
|---|---|
| `uvicorn main:app --reload --port 8000` | Servidor de desenvolvimento |
| `uvicorn main:app --host 0.0.0.0 --port 8000` | Servidor de produção |

---

## Licença

Projeto privado — todos os direitos reservados.

# Deploy no PythonAnywhere

## Pré-requisitos
- Conta gratuita em [pythonanywhere.com](https://www.pythonanywhere.com)
- Repositório no GitHub (ou upload manual dos arquivos)

## 1. Upload do projeto

### Via Git (recomendado)
No console Bash do PythonAnywhere:
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git teste
cd teste
```

### Via upload manual
- Faça upload de todo o projeto (exceto `node_modules/`) pelo menu **Files**

## 2. Criar virtualenv

No console Bash:
```bash
mkvirtualenv --python=python3.12 portal
pip install -r backend/requirements.txt
```

## 3. Configurar Web App

1. Menu **Web** → **Add new web app**
2. Escolha **Manual configuration** → **Python 3.12**
3. Em **Code**:
   - **Working directory**: `/home/SEU_USUARIO/teste`
   - **WSGI configuration file**: `/home/SEU_USUARIO/teste/backend/wsgi.py`
4. Em **Virtualenv**: `/home/SEU_USUARIO/.virtualenvs/portal`

## 4. Configurar arquivos estáticos

Em **Static files**:
| URL | Directory |
|-----|-----------|
| `/assets/` | `/home/SEU_USUARIO/teste/dist/assets/` |

## 5. Construir o frontend

No console Bash:
```bash
cd ~/teste
npm install
npm run build
```

> **Importante:** `VITE_API_URL` **não** deve estar definida durante o build.
> O comando `npm run build` sem `VITE_API_URL` faz o frontend usar `/api` como prefixo,
> que é roteado para o backend pelo wsgi.py.

## 6. Ajustar CORS e senha

Edite `backend/.env`:
```
ADMIN_PASSCODE=1234
JWT_SECRET_KEY=troque-por-uma-chave-segura-aqui
CORS_ORIGINS=https://SEU_USUARIO.pythonanywhere.com
```

## 7. Recarregar

Clique em **Reload** no topo da página Web.

## 8. Pronto!

Seu site estará em `https://SEU_USUARIO.pythonanywhere.com`

---

## Problemas comuns

### Erro 500 — Internal Server Error
Verifique os logs em **Web** → **Error log**.
Geralmente é falta de dependência no virtualenv.

### Banco de dados não criado
O SQLite é criado automaticamente na primeira execução.
Se precisar resetar: delete `backend/imobiliaria.db` e recarregue.

### API retornando 404
Verifique se as rotas `/api/*` estão sendo roteadas corretamente no `wsgi.py`.
O log de debug do uvicorn aparece em **Web** → **Error log**.

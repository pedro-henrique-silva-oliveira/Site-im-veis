"""WSGI entry point for PythonAnywhere deployment.

Steps to deploy:
1. Upload project to PythonAnywhere (git clone or file upload)
2. Create virtualenv: `mkvirtualenv --python=python3.12 portal`
3. Install deps: `pip install -r backend/requirements.txt`
4. In Web tab:
   - Set virtualenv to 'portal'
   - Set WSGI file to: /home/pedrocorretor/teste/backend/wsgi.py
   - Static files: URL /assets/ → /home/pedrocorretor/teste/dist/assets/
5. Reload web app
"""

import os
import sys

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BACKEND_DIR)

sys.path.insert(0, BACKEND_DIR)

from dotenv import load_dotenv
env_path = os.path.join(BACKEND_DIR, '.env')
if os.path.isfile(env_path):
    load_dotenv(env_path)

from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from main import app as fastapi_app

DIST_DIR = os.path.join(PROJECT_DIR, 'dist')

@fastapi_app.get("/{full_path:path}")
async def spa_serve(full_path: str):
    if full_path.startswith(("api/", "auth/")):
        return JSONResponse({"detail": "Route not found"}, status_code=404)

    file_path = os.path.join(DIST_DIR, full_path) if full_path else os.path.join(DIST_DIR, "index.html")
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.isfile(index_path):
        with open(index_path, encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>Frontend not built — run `npm run build`</h1>", status_code=500)

from a2wsgi import ASGIMiddleware
asgi_transport = ASGIMiddleware(fastapi_app)


def application(environ, start_response):
    path = environ.get("PATH_INFO", "")
    if path.startswith("/api"):
        environ["PATH_INFO"] = path[4:] or "/"
        environ["SCRIPT_NAME"] = "/api"
    return asgi_transport(environ, start_response)

import os
import re
import logging
from contextlib import asynccontextmanager
from typing import Optional
from enum import Enum
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Query, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from database import engine, Base, get_db
from models import Imovel as ImovelDB, Lead as LeadDB

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480
ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE", "1234")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

security = HTTPBearer(auto_error=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("Banco de dados inicializado com sucesso")
    yield


app = FastAPI(
    title="Pedro H. Corretor - API",
    description="Backend do portal imobiliário",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TipoImovel(str, Enum):
    casa = "casa"
    apartamento = "apartamento"
    terreno = "terreno"
    comercial = "comercial"


class TipoTransacao(str, Enum):
    venda = "venda"
    aluguel = "aluguel"


class ImovelOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    titulo: str
    descricao: str = ""
    tipo: TipoImovel
    transacao: TipoTransacao
    preco: float
    bairro: str
    cidade: str = ""
    cep: str = ""
    area: float = 0
    quartos: int = 0
    suites: int = 0
    banheiros: int = 0
    vagas: int = 0
    imagem: str = ""
    destaque: bool = False
    latitude: float = 0
    longitude: float = 0


class LeadIn(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    telefone: str = Field(..., min_length=8, max_length=20)
    email: str = Field(default="", max_length=200)
    mensagem: str = Field(default="", max_length=1000)
    id_imovel: str = Field(..., min_length=1)


class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    telefone: str
    email: str
    mensagem: str
    id_imovel: str
    data_criacao: Optional[datetime] = None


class ImovelIn(BaseModel):
    id: str = Field(..., min_length=1)
    titulo: str = Field(..., min_length=1, max_length=200)
    descricao: str = Field(default="", max_length=5000)
    tipo: TipoImovel
    transacao: TipoTransacao
    preco: float = Field(..., ge=0)
    bairro: str = Field(..., min_length=1, max_length=100)
    cidade: str = Field(default="", max_length=100)
    cep: str = Field(default="", max_length=10)
    area: float = Field(default=0, ge=0)
    quartos: int = Field(default=0, ge=0)
    suites: int = Field(default=0, ge=0)
    banheiros: int = Field(default=0, ge=0)
    vagas: int = Field(default=0, ge=0)
    imagem: str = Field(default="", max_length=100000)
    destaque: bool = False
    latitude: float = Field(default=0)
    longitude: float = Field(default=0)


class LeadResponse(BaseModel):
    id: int
    mensagem: str = "Lead cadastrado com sucesso"


class LoginIn(BaseModel):
    passcode: str = Field(..., min_length=1)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PaginatedResponse(BaseModel):
    total: int
    pagina: int
    total_paginas: int
    imoveis: list[ImovelOut]


class CreditoIn(BaseModel):
    cpf: str = Field(..., min_length=11, max_length=14)
    valor_financiamento: float = Field(..., gt=0)
    renda_mensal: Optional[float] = Field(default=None, gt=0)
    taxa_juros: float = Field(default=9.5, gt=0, le=100)
    prazo_meses: int = Field(default=360, ge=12, le=480)


class CreditoOut(BaseModel):
    aprovado: bool
    mensagem: str
    renda_estimada: float
    parcela_simulada: float
    valor_maximo_parcela: float
    valor_maximo_financiamento: float


# ---------------------------------------------------------------------------


def validar_cpf(cpf: str) -> bool:
    digits = re.sub(r'\D', '', cpf)
    if len(digits) != 11:
        return False
    if digits == digits[0] * 11:
        return False
    for j in range(9, 11):
        total = sum(int(digits[i]) * (j + 1 - i) for i in range(j))
        resto = (total * 10) % 11
        if resto == 10:
            resto = 0
        if resto != int(digits[j]):
            return False
    return True


def estimar_renda(cpf: str) -> float:
    digits = [int(d) for d in re.sub(r'\D', '', cpf)]
    renda = 2500 + (sum(digits) * 80) + (digits[-1] * 300) + (digits[-2] * 200)
    return min(renda, 25000)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token de acesso necessário")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado")


# ---------------------------------------------------------------------------


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Erro interno: {exc}", exc_info=True)
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": "Erro interno do servidor"})


# ---------------------------------------------------------------------------


@app.get("/")
def root():
    return {"message": "API do Portal Imobiliário", "docs": "/docs", "version": "1.0.0"}


@app.post("/auth/login", response_model=TokenOut)
def login(login_data: LoginIn):
    if login_data.passcode != ADMIN_PASSCODE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Código de acesso incorreto")
    token = create_access_token({"sub": "admin"})
    return TokenOut(access_token=token)


@app.get("/imoveis", response_model=PaginatedResponse)
def listar_imoveis(
    bairro: Optional[str] = Query(None, description="Filtrar por bairro"),
    cidade: Optional[str] = Query(None, description="Filtrar por cidade"),
    preco_min: Optional[float] = Query(None, ge=0, description="Preço mínimo"),
    preco_max: Optional[float] = Query(None, ge=0, description="Preço máximo"),
    quartos: Optional[int] = Query(None, ge=0, description="Número mínimo de quartos"),
    tipo: Optional[TipoImovel] = Query(None, description="Tipo de imóvel"),
    transacao: Optional[TipoTransacao] = Query(None, description="Venda ou aluguel"),
    destaque: Optional[str] = Query(None, description="Filtrar destaques (true/false)"),
    limite: int = Query(12, ge=1, le=100, description="Resultados por página"),
    pagina: int = Query(1, ge=1, description="Número da página"),
    db: Session = Depends(get_db),
):
    query = db.query(ImovelDB)

    if bairro:
        query = query.filter(ImovelDB.bairro.ilike(f"%{bairro}%"))
    if cidade:
        query = query.filter(ImovelDB.cidade.ilike(f"%{cidade}%"))
    if preco_min is not None:
        query = query.filter(ImovelDB.preco >= preco_min)
    if preco_max is not None:
        query = query.filter(ImovelDB.preco <= preco_max)
    if quartos is not None:
        query = query.filter(ImovelDB.quartos >= quartos)
    if tipo:
        query = query.filter(ImovelDB.tipo == tipo.value)
    if transacao:
        query = query.filter(ImovelDB.transacao == transacao.value)
    if destaque is not None:
        filtrar = destaque.strip().lower() == "true"
        query = query.filter(ImovelDB.destaque == filtrar)

    total = query.count()
    total_paginas = max(1, (total + limite - 1) // limite)
    offset = (pagina - 1) * limite

    resultados = query.offset(offset).limit(limite).all()

    return PaginatedResponse(
        total=total,
        pagina=pagina,
        total_paginas=total_paginas,
        imoveis=[ImovelOut.model_validate(r).model_dump() for r in resultados],
    )


@app.get("/imoveis/{imovel_id}")
def obter_imovel(imovel_id: str, db: Session = Depends(get_db)):
    imovel = db.query(ImovelDB).filter(ImovelDB.id == imovel_id).first()
    if not imovel:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")
    return ImovelOut.model_validate(imovel).model_dump()


@app.post("/leads", response_model=LeadResponse)
def cadastrar_lead(lead: LeadIn, db: Session = Depends(get_db)):
    try:
        db_lead = LeadDB(**lead.model_dump())
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        logger.info(f"Novo lead cadastrado: {lead.nome} - imóvel {lead.id_imovel}")
        return LeadResponse(id=db_lead.id)
    except Exception as e:
        db.rollback()
        logger.error(f"Erro ao cadastrar lead: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao cadastrar lead")


@app.get("/leads")
def listar_leads(_token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    leads = db.query(LeadDB).order_by(LeadDB.data_criacao.desc()).all()
    return {
        "total": len(leads),
        "leads": [LeadOut.model_validate(l).model_dump() for l in leads],
    }


@app.post("/simular/credito", response_model=CreditoOut)
def simular_credito(data: CreditoIn):
    if not validar_cpf(data.cpf):
        raise HTTPException(status_code=400, detail="CPF inválido")

    renda = data.renda_mensal or estimar_renda(data.cpf)
    max_parcela = renda * 0.30
    monthly_rate = data.taxa_juros / 100 / 12
    total_payments = data.prazo_meses

    if monthly_rate > 0 and total_payments > 0 and data.valor_financiamento > 0:
        parcela = data.valor_financiamento * (monthly_rate * (1 + monthly_rate) ** total_payments) / ((1 + monthly_rate) ** total_payments - 1)
    else:
        parcela = 0

    if max_parcela > 0 and monthly_rate > 0 and total_payments > 0:
        factor = (monthly_rate * (1 + monthly_rate) ** total_payments) / ((1 + monthly_rate) ** total_payments - 1)
        max_financiamento = max_parcela / factor if factor > 0 else 0
    else:
        max_financiamento = 0

    aprovado = parcela <= max_parcela

    if aprovado:
        mensagem = (
            f"CPF aprovado! Renda estimada: R$ {renda:,.0f}. "
            f"Valor da parcela: R$ {parcela:,.0f} (comprometimento de {parcela / renda * 100:.0f}% da renda). "
            f"Com sua renda, você pode financiar até R$ {max_financiamento:,.0f}."
        )
    else:
        mensagem = (
            f"CPF não aprovado para este valor. Renda estimada: R$ {renda:,.0f}. "
            f"Valor da parcela: R$ {parcela:,.0f} comprometeria {parcela / renda * 100:.0f}% da renda (limite 30%). "
            f"Com sua renda, o valor máximo de financiamento seria R$ {max_financiamento:,.0f}. "
            f"Tente aumentar a entrada ou reduzir o prazo."
        )

    return CreditoOut(
        aprovado=aprovado,
        mensagem=mensagem,
        renda_estimada=renda,
        parcela_simulada=parcela,
        valor_maximo_parcela=max_parcela,
        valor_maximo_financiamento=max_financiamento,
    )


@app.post("/imoveis", response_model=ImovelOut, status_code=201)
def criar_imovel(imovel: ImovelIn, _token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        existente = db.query(ImovelDB).filter(ImovelDB.id == imovel.id).first()
        if existente:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Já existe um imóvel com este ID")
        db_imovel = ImovelDB(**imovel.model_dump())
        db.add(db_imovel)
        db.commit()
        db.refresh(db_imovel)
        logger.info(f"Imóvel criado: {imovel.titulo} (ID: {imovel.id})")
        return ImovelOut.model_validate(db_imovel).model_dump()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Erro em criar_imovel: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao criar imóvel: {str(e)}")


@app.put("/imoveis/{imovel_id}", response_model=ImovelOut)
def atualizar_imovel(imovel_id: str, imovel: ImovelIn, _token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db_imovel = db.query(ImovelDB).filter(ImovelDB.id == imovel_id).first()
    if not db_imovel:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")
    for key, value in imovel.model_dump().items():
        setattr(db_imovel, key, value)
    db.commit()
    db.refresh(db_imovel)
    logger.info(f"Imóvel atualizado: {imovel_id}")
    return ImovelOut.model_validate(db_imovel).model_dump()


@app.delete("/imoveis/{imovel_id}", status_code=204)
def deletar_imovel(imovel_id: str, _token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db_imovel = db.query(ImovelDB).filter(ImovelDB.id == imovel_id).first()
    if not db_imovel:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")
    db.delete(db_imovel)
    db.commit()
    logger.info(f"Imóvel deletado: {imovel_id}")

from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime
from database import Base


class Imovel(Base):
    __tablename__ = "imoveis"

    id = Column(String, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, default="")
    tipo = Column(String, nullable=False)
    transacao = Column(String, nullable=False)
    preco = Column(Float, nullable=False)
    bairro = Column(String, nullable=False)
    cidade = Column(String, default="")
    cep = Column(String, default="")
    area = Column(Float, default=0)
    quartos = Column(Integer, default=0)
    suites = Column(Integer, default=0)
    banheiros = Column(Integer, default=0)
    vagas = Column(Integer, default=0)
    imagem = Column(String, default="")
    destaque = Column(Boolean, default=False)
    latitude = Column(Float, default=0)
    longitude = Column(Float, default=0)


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nome = Column(String(100), nullable=False)
    telefone = Column(String(20), nullable=False)
    email = Column(String, default="")
    mensagem = Column(Text, default="")
    id_imovel = Column(String, nullable=False)
    data_criacao = Column(DateTime, default=lambda: datetime.now(timezone.utc))


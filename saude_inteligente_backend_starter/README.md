
# Saúde Inteligente — Backend (FastAPI)

Backend em **Python + FastAPI** com:
- Auth (registro/login com JWT)
- Upload de exames (arquivo) 
- Endpoint de análise simulada (mock) que retorna **Bom / Regular / Ruim**
- SQLite + SQLAlchemy
- Estrutura pronta para evoluir com IA

## Requisitos
- Python 3.10+
- (Opcional) `python -m venv .venv && source .venv/bin/activate` (Windows: `.venv\Scripts\activate`)

## Instalação
```bash
pip install -r requirements.txt
cp .env.example .env  # edite as chaves
```

## Rodar
```bash
uvicorn app.main:app --reload
# Docs interativas: http://127.0.0.1:8000/docs
```

## Estrutura
```
app/
  __init__.py
  main.py
  config.py
  database.py
  models.py
  schemas.py
  auth.py
  analysis.py
  routers/
    __init__.py
    auth_router.py
    exams_router.py
uploads/
```

## Próximos passos
- Trocar `analysis.py` por seu modelo real (IA/heurísticas).
- Substituir SQLite por PostgreSQL em produção.
- Integrar com o frontend (ex.: Next.js/React) chamando a API.

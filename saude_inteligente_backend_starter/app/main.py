from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from .database import Base, engine
from . import models
from .routers import auth_router, exams_router

# cria tabelas
Base.metadata.create_all(bind=engine)

# app
app = FastAPI(title="Saúde Inteligente API", version="0.1.0")

# ✅ Enable CORS (allow your frontend to communicate)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later, e.g. ["http://localhost:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# rotas
app.include_router(auth_router.router)
app.include_router(exams_router.router)

@app.get("/health")
def health():
    return {"status": "ok"}

# --- Swagger: habilitar botão "Authorize" (JWT) ---
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Saúde Inteligente API",
        version="0.1.0",
        description="API para upload e análise de exames",
        routes=app.routes,
    )

    # Define o esquema de segurança Bearer/JWT
    openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})
    openapi_schema["components"]["securitySchemes"]["BearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }

    # Aplica segurança por padrão em todos os endpoints, exceto /auth/*
    for path, methods in openapi_schema["paths"].items():
        if path.startswith("/auth"):
            continue
        for method in methods.values():
            method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
# --- fim Swagger ---
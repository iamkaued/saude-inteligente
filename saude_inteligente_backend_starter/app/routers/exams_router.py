import os
import json
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..config import settings
from .. import models
from ..schemas import ExamOut
from ..auth import get_current_user
from ..analysis import analyze_file

# 🔹 Define o roteador de exames
router = APIRouter(prefix="/exams", tags=["exams"])


@router.post("/upload")
async def upload_exam(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    dest_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(dest_path, "wb") as f:
        f.write(await file.read())

    exam = models.Exam(
        filename=file.filename,
        status="received",
        user_id=user.id
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)

    # Simulação da IA
    result = {
        "status": "processado",
        "resultado": {
            "nivel_risco": "Baixo",
            "mensagem": "Exame dentro da normalidade."
        },
        "sumario": "Análise concluída automaticamente pela API Saúde Inteligente."
    }

    import json
    exam.status = "processed"
    exam.result = json.dumps(result, ensure_ascii=False)
    db.commit()
    db.refresh(exam)

    return {
        "mensagem": "Exame analisado com sucesso!",
        "usuario": user.email,
        "arquivo": file.filename,
        "analise": result,
        "sumario": result["sumario"]
    }


@router.get("/mine", response_model=list[ExamOut])
def list_my_exams(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Lista os exames enviados pelo usuário autenticado."""
    exams = (
        db.query(models.Exam)
        .filter(models.Exam.user_id == user.id)
        .order_by(models.Exam.uploaded_at.desc())
        .all()
    )
    return exams
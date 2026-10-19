from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Artifact
from app.schemas import ArtifactResponse, ArtifactListResponse

router = APIRouter(prefix="/artifacts", tags=["artifacts"])


@router.get("", response_model=ArtifactListResponse)
def get_artifacts(
    category: Optional[str] = None,
    room_code: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Lấy danh sách hiện vật có hỗ trợ lọc theo thể loại, phòng, nổi bật"""
    query = db.query(Artifact)
    if category:
        query = query.filter(Artifact.category == category)
    if room_code:
        query = query.filter(Artifact.room_code == room_code)
    if featured is not None:
        query = query.filter(Artifact.is_featured == featured)

    items = query.all()
    return {"artifacts": items, "total": len(items)}


@router.get("/{code}", response_model=ArtifactResponse)
def get_artifact_by_code(code: str, db: Session = Depends(get_db)):
    """Lấy chi tiết một hiện vật theo mã (ví dụ: A01, A02)"""
    artifact = db.query(Artifact).filter(
        (Artifact.code == code) | (Artifact.code == code.upper())
    ).first()
    if not artifact:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy hiện vật với mã {code}")
    return artifact

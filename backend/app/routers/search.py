from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import ArtifactResponse
from app.services.search import search_artifacts

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=List[ArtifactResponse])
def search(
    q: str = Query(..., description="Từ khóa tìm kiếm không dấu hoặc có dấu"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Tìm kiếm hiện vật hỗ trợ tiếng Việt không dấu (unaccent / fuzzy match)"""
    results = search_artifacts(db, q, limit=limit)
    return results

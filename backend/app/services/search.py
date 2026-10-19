import unicodedata
import re
from typing import List
from sqlalchemy.orm import Session
from app.models import Artifact


def remove_diacritics(text: str) -> str:
    """Loại bỏ dấu tiếng Việt để tìm kiếm không dấu"""
    if not text:
        return ""
    text = unicodedata.normalize('NFD', text)
    text = re.sub(r'[\u0300-\u036f]', '', text)
    text = text.replace('đ', 'd').replace('Đ', 'D')
    return text.lower().strip()


def search_artifacts(db: Session, query: str, limit: int = 10) -> List[Artifact]:
    """Tìm kiếm hiện vật theo tên, mô tả, thể loại, phòng với hỗ trợ tiếng Việt không dấu"""
    all_artifacts = db.query(Artifact).all()
    if not query:
        return all_artifacts[:limit]

    q_norm = remove_diacritics(query)
    q_words = [w for w in q_norm.split() if w]

    scored_results = []
    for art in all_artifacts:
        name_norm = remove_diacritics(art.name)
        desc_norm = remove_diacritics(art.description or "")
        cat_norm = remove_diacritics(art.category or "")
        room_norm = remove_diacritics(art.room_code or "")
        code_norm = remove_diacritics(art.code or "")

        score = 0
        if q_norm == code_norm or q_norm == room_norm:
            score += 100
        if q_norm in name_norm:
            score += 50
        if q_norm in cat_norm:
            score += 30
        if q_norm in desc_norm:
            score += 20

        # Word matching
        for word in q_words:
            if word in name_norm:
                score += 15
            elif word in cat_norm or word in desc_norm:
                score += 5

        if score > 0:
            scored_results.append((score, art))

    scored_results.sort(key=lambda x: x[0], reverse=True)
    return [art for _, art in scored_results[:limit]]

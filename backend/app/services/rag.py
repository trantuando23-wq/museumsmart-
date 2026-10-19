from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models import Artifact, DocumentChunk
from app.services.search import remove_diacritics


def retrieve_relevant_contexts(
    db: Session,
    question: str,
    artifact_code: str = None,
    limit: int = 4
) -> Tuple[List[str], List[Artifact]]:
    """
    RAG Retrieval: Lấy các đoạn tài liệu và danh sách hiện vật nguồn liên quan nhất.
    """
    sources: List[Artifact] = []
    contexts: List[str] = []

    # 1. Nếu người dùng hỏi trực tiếp từ một trang hiện vật cụ thể
    target_artifact = None
    if artifact_code:
        target_artifact = db.query(Artifact).filter(Artifact.code == artifact_code).first()
        if target_artifact:
            sources.append(target_artifact)
            contexts.append(
                f"[Tài liệu chính: {target_artifact.name} ({target_artifact.code})]\n"
                f"- Thời kỳ / Niên đại: {target_artifact.era} (Năm {target_artifact.year})\n"
                f"- Thể loại: {target_artifact.category} | Chất liệu: {target_artifact.material}\n"
                f"- Vị trí: {target_artifact.location} (Phòng {target_artifact.room_code})\n"
                f"- Mô tả: {target_artifact.description}\n"
                f"- Điển tích / Lịch sử chi tiết: {target_artifact.detailed_story}\n"
            )

    # 2. Tìm kiếm trong DocumentChunk
    all_chunks = db.query(DocumentChunk).all()
    q_norm = remove_diacritics(question)
    q_words = [w for w in q_norm.split() if len(w) > 2]

    scored_chunks = []
    for chunk in all_chunks:
        # Nếu đã có target_artifact và chunk thuộc artifact khác thì giảm ưu tiên
        chunk_text = f"{chunk.title} {chunk.content} {chunk.keywords or ''}"
        chunk_norm = remove_diacritics(chunk_text)
        
        score = 0
        if target_artifact and chunk.artifact_code == target_artifact.code:
            score += 50

        for word in q_words:
            if word in chunk_norm:
                score += 10

        if score > 0:
            scored_chunks.append((score, chunk))

    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    for _, ch in scored_chunks[:limit]:
        contexts.append(f"[{ch.title}]\n{ch.content}")
        if ch.artifact_code:
            art = db.query(Artifact).filter(Artifact.code == ch.artifact_code).first()
            if art and art not in sources:
                sources.append(art)

    # 3. Nếu chưa đủ nguồn, tìm thêm từ Artifacts
    if len(sources) < 2:
        other_artifacts = db.query(Artifact).all()
        for art in other_artifacts:
            if art not in sources:
                art_norm = remove_diacritics(f"{art.name} {art.category} {art.description}")
                for word in q_words:
                    if word in art_norm:
                        sources.append(art)
                        contexts.append(f"[{art.name} - {art.era}]: {art.description}")
                        break
            if len(sources) >= limit:
                break

    return contexts, sources

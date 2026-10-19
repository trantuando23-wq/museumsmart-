from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import ChatRequest, ChatResponse, ChatSource
from app.services.rag import retrieve_relevant_contexts
from app.services.llm import generate_chat_stream, synthesize_smart_answer

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/stream")
async def chat_stream(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Streaming Chatbot RAG: Trả về câu trả lời dần dần qua SSE (Server-Sent Events) kèm nguồn trích dẫn
    """
    contexts, sources = retrieve_relevant_contexts(
        db,
        question=req.message,
        artifact_code=req.artifact_code,
        limit=4
    )

    return StreamingResponse(
        generate_chat_stream(req.message, contexts, sources),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.post("", response_model=ChatResponse)
async def chat_standard(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Hỏi đáp RAG thông thường (trả về full JSON) với AI Docent thông minh đa dạng ý định
    """
    contexts, sources = retrieve_relevant_contexts(
        db,
        question=req.message,
        artifact_code=req.artifact_code,
        limit=4
    )

    core_answer = synthesize_smart_answer(req.message, contexts, sources)

    sources_response = [
        ChatSource(
            code=s.code,
            name=s.name,
            era=s.era,
            room_code=s.room_code
        )
        for s in sources
    ]

    return ChatResponse(answer=core_answer, sources=sources_response)

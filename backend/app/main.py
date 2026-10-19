from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import engine, Base, SessionLocal
from app.models import Artifact
from app.routers import artifacts, search, chat
import json
import os

# Tự động tạo bảng cơ sở dữ liệu nếu chưa có
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Hệ thống Backend Bảo tàng Thông minh với A* Pathfinding và RAG Chatbot",
    version=settings.VERSION,
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các Router
app.include_router(artifacts.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.on_event("startup")
def init_data_if_empty():
    """Tự động nạp dữ liệu ban đầu nếu bảng artifacts đang trống"""
    db = SessionLocal()
    try:
        count = db.query(Artifact).count()
        if count == 0:
            data_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "artifacts.json")
            if os.path.exists(data_file):
                with open(data_file, "r", encoding="utf-8") as f:
                    content = json.load(f)
                    for item in content.get("artifacts", []):
                        art = Artifact(
                            code=item.get("code", f"A{item.get('id'):02d}"),
                            name=item.get("name"),
                            description=item.get("description"),
                            detailed_story=item.get("detailed_story", ""),
                            era=item.get("era"),
                            year=item.get("year", 0),
                            category=item.get("category"),
                            location=item.get("location"),
                            room_code=item.get("room_code", "A1"),
                            node_id=item.get("node_id", "N_A1"),
                            material=item.get("material", ""),
                            dimensions=item.get("dimensions", ""),
                            image_url=item.get("image_url"),
                            is_featured=item.get("is_featured", False),
                            suggested_questions=item.get("suggested_questions", []),
                            model_type=item.get("model_type", "generic")
                        )
                        db.add(art)
                    db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "🏛️ Smart Museum API đang hoạt động ổn định",
        "docs_url": "/docs"
    }

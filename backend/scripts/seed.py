import os
import sys
import json

# Thêm thư mục backend vào sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from app.db import SessionLocal, engine, Base
from app.models import Artifact

def seed():
    print("🌱 Đang khởi tạo cơ sở dữ liệu...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "artifacts.json"))
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    artifacts = data.get("artifacts", [])
    print(f"📦 Đang nạp {len(artifacts)} hiện vật vào Database...")
    
    for item in artifacts:
        existing = db.query(Artifact).filter(Artifact.code == item.get("code")).first()
        if existing:
            # Cập nhật
            existing.name = item.get("name")
            existing.description = item.get("description")
            existing.detailed_story = item.get("detailed_story", "")
            existing.era = item.get("era")
            existing.year = item.get("year", 0)
            existing.category = item.get("category")
            existing.location = item.get("location")
            existing.room_code = item.get("room_code", "A1")
            existing.node_id = item.get("node_id", "N_A1")
            existing.material = item.get("material", "")
            existing.dimensions = item.get("dimensions", "")
            existing.image_url = item.get("image_url")
            existing.is_featured = item.get("is_featured", False)
            existing.suggested_questions = item.get("suggested_questions", [])
            existing.model_type = item.get("model_type", "generic")
        else:
            new_art = Artifact(
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
            db.add(new_art)

    db.commit()
    db.close()
    print("✅ Đã hoàn tất nạp hiện vật thành công!")

if __name__ == "__main__":
    seed()

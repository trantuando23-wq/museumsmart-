from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(
    title="Smart Museum API",
    description="API cho hệ thống bảo tàng thông minh",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_json(filename: str):
    """Load dữ liệu JSON từ thư mục data/"""
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", filename)
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/")
def root():
    return {"message": "Smart Museum API đang hoạt động 🏛️"}


@app.get("/api/artifacts")
def get_artifacts():
    """Lấy danh sách hiện vật"""
    try:
        data = load_json("artifacts.json")
        return data
    except FileNotFoundError:
        return {"artifacts": [], "message": "Chưa có dữ liệu hiện vật"}


@app.get("/api/exhibitions")
def get_exhibitions():
    """Lấy danh sách triển lãm"""
    try:
        data = load_json("exhibitions.json")
        return data
    except FileNotFoundError:
        return {"exhibitions": [], "message": "Chưa có dữ liệu triển lãm"}

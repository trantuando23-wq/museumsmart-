# 🏛️ Smart Museum

Hệ thống bảo tàng thông minh - Smart Museum Management System

## 📁 Cấu trúc dự án

```
smart-museum/
├── frontend/          # React + TypeScript (Vite)
├── backend/           # FastAPI (Python)
├── data/              # Dữ liệu JSON mẫu
├── docker-compose.yml # Docker orchestration
├── .gitignore
└── README.md
```

## 🚀 Bắt đầu

### Yêu cầu
- Node.js >= 18
- Python >= 3.10
- Docker & Docker Compose (tùy chọn)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker
```bash
docker-compose up --build
```

## 👥 Team
- Trần Tuấn Đô (Owner)

## 📄 License
MIT

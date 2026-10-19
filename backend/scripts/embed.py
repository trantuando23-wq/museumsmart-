import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from app.db import SessionLocal, Base, engine
from app.models import Artifact, DocumentChunk

DOCUMENT_KNOWLEDGE = [
    {
        "artifact_code": "A01",
        "title": "Bí mật kỹ thuật đúc Trống đồng Đông Sơn",
        "category": "Kỹ nghệ cổ",
        "keywords": "trống đồng đúc đồng khuôn ba mang hoa văn chim lạc mặt trời",
        "content": (
            "Trống đồng Đông Sơn được đúc bằng phương pháp khuôn đất sét nhiều mang (khuôn 3 mang). "
            "Hợp kim đồng Đông Sơn gồm đồng, thiếc và chì với tỷ lệ vàng giúp kim loại nóng chảy lấp đầy các rãnh hoa văn siêu mảnh. "
            "Hoa văn hình học và ngôi sao 14 cánh trên mặt trống phản ánh tín ngưỡng thờ thần Mặt Trời và lịch nông nghiệp lúa nước sơ khai."
        )
    },
    {
        "artifact_code": "A02",
        "title": "Biểu tượng quyền lực của Ấn vàng Sắc mệnh chi bảo",
        "category": "Bảo vật hoàng cung",
        "keywords": "ấn vàng kim bảo triều nguyễn minh mạng sắc phong rồng",
        "content": (
            "Ấn vàng Sắc mệnh chi bảo nặng 8,3 kg vàng ròng mười tuổi. Dưới thời vua Minh Mạng, "
            "ấn chỉ được dùng để đóng vào các bản sắc phong ban thưởng danh hiệu cho tướng lĩnh có công và thần linh hộ quốc. "
            "Hình tượng quai rồng uốn 7 khúc biểu trưng cho quyền uy thiên tử tuyệt đối."
        )
    },
    {
        "artifact_code": "A03",
        "title": "Triết lý Phật giáo của Tượng Quan Âm nghìn mắt nghìn tay",
        "category": "Mỹ thuật Phật giáo",
        "keywords": "quan âm bồ tát nghìn tay nghìn mắt chùa bút tháp trương thọ nam lê trung hưng",
        "content": (
            "Kiệt tác tượng Phật Bà Quan Âm tại chùa Bút Tháp do nghệ nhân Trương Thọ Nam tạc năm 1656. "
            "Nghìn mắt tượng trưng cho trí tuệ vô biên soi thấu mọi khổ ải trần gian; nghìn cánh tay biểu trưng cho hành động từ bi cứu vớt muôn loài. "
            "Kỹ thuật sơn son thếp vàng kết hợp chất liệu gỗ mít dẻo dai giúp bức tượng trường tồn gần 400 năm."
        )
    },
    {
        "artifact_code": "A04",
        "title": "Hành trình vươn tầm thế giới của gốm hoa lam Chu Đậu",
        "category": "Gốm sứ cổ",
        "keywords": "gốm chu đậu hoa lam men tro trấu tàu đắm cù lao chàm thiên nga",
        "content": (
            "Gốm Chu Đậu thế kỷ 14-15 nổi tiếng với men tro trấu tự nhiên màu trắng ngà và nét vẽ lam cobalt phóng khoáng. "
            "Bình gốm vẽ bốn con thiên nga được tìm thấy từ xác tàu cổ Cù Lao Chàm, khẳng định vị thế hải thương thịnh vượng của Đại Việt thời Lê sơ."
        )
    },
    {
        "artifact_code": "A05",
        "title": "Quy chế phẩm phục và mũ quan triều Nguyễn",
        "category": "Nghi lễ cung đình",
        "keywords": "mũ quan nhất phẩm triều nguyễn lông đuôi ngựa vàng khảm ngọc",
        "content": (
            "Mũ quan văn võ nhất phẩm triều Nguyễn được làm từ lông đuôi ngựa đan sợi kép siêu nhỏ, thông thoáng nhưng định hình vững chãi. "
            "Số lượng bác sơn bằng vàng và hạt ngọc đính trên mũ biểu thị chính xác cấp bậc quan lại trong Đại Nam Thực Lục."
        )
    },
    {
        "artifact_code": None,
        "title": "Hướng dẫn tham quan và di chuyển trong bảo tàng",
        "category": "Tiện ích",
        "keywords": "bản đồ lối đi sơ đồ chỉ đường phòng triển lãm a1 b2 c1 d3",
        "content": (
            "Bảo tàng gồm 4 khu trưng bày chính: Phòng A1 (Văn hóa Tiền sử & Đông Sơn), Phòng B2 - B3 (Cổ vật & Nghi lễ Triều Nguyễn), "
            "Phòng C1 (Mỹ thuật Phật giáo cổ truyền), và Phòng D3 (Gốm sứ cổ thương mại). Du khách có thể sử dụng tính năng 'Chỉ đường' trên bản đồ "
            "để được hệ thống dẫn đường ngắn nhất qua từng điểm mốc."
        )
    }
]

def embed():
    print("🧠 Đang xử lý phân đoạn tài liệu và lập chỉ mục RAG...")
    db = SessionLocal()
    
    # Xóa chunks cũ nếu có
    db.query(DocumentChunk).delete()
    
    for item in DOCUMENT_KNOWLEDGE:
        chunk = DocumentChunk(
            artifact_code=item.get("artifact_code"),
            title=item.get("title"),
            category=item.get("category"),
            keywords=item.get("keywords"),
            content=item.get("content")
        )
        db.add(chunk)
        
    db.commit()
    count = db.query(DocumentChunk).count()
    db.close()
    print(f"✅ Đã lập chỉ mục {count} tài liệu kiến thức chuyên sâu vào RAG database!")

if __name__ == "__main__":
    embed()

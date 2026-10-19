import asyncio
import json
import re
from typing import AsyncGenerator, List, Dict, Any, Optional
from app.models import Artifact
from app.config import settings

# =========================================================================
# KHO TRI THỨC CHUYÊN SÂU 10 BẢO VẬT QUỐC GIA (MUSEUM AI DOCENT KNOWLEDGE BASE)
# =========================================================================

ARTIFACT_KNOWLEDGE_MAP: Dict[str, Dict[str, str]] = {
    "A01": {
        "name": "Trống đồng Đông Sơn",
        "motif": (
            "Về đồ án hoa văn trên Trống đồng Đông Sơn: Tâm mặt trống là **ngôi sao 14 cánh** tượng trưng cho Thần Mặt Trời "
            "– nguồn cội sự sống trong nền văn minh nông nghiệp lúa nước. Bao quanh ngôi sao là các vành hoa văn chim Lạc "
            "dang cánh bay ngược chiều kim đồng hồ theo chu kỳ mặt trời, cảnh cư dân giã gạo đón mùa và các đoàn thuyền chiến vượt sóng. "
            "Đặc biệt, **4 khối tượng cóc nổi** trên rìa mặt trống mang tín ngưỡng phồn thực cầu mưa: \"Con cóc là cậu ông Trời, "
            "hễ ai đánh nó thì Trời đánh cho\" – thể hiện ước vọng mưa thuận gió hòa của người Lạc Việt."
        ),
        "crafting": (
            "Kỹ thuật đúc Trống đồng Đông Sơn là đỉnh cao luyện kim thời đại đồ đồng thế giới. Các nghệ nhân Vua Hùng đã phối trộn "
            "đồng đỏ, thiếc và chì theo tỷ lệ luyện kim hoàn hảo, đúc bằng **khuôn đất 3 đến 4 mang kết hợp lõi khuôn treo liền khối**. "
            "Nhờ độ nhớt và nhiệt độ dòng chảy kim loại được kiểm soát chuẩn xác, thân trống chỉ mỏng từ vài milimet nhưng chịu lực gõ "
            "ngân vang kỳ diệu suốt hơn 2.500 năm mà không hề nứt vỡ."
        ),
        "legend": (
            "Theo truyền thuyết và thư tịch cổ, Trống đồng Đông Sơn không chỉ là nhạc khí trong ngày hội mùa màng hay nghi lễ hiến tế, "
            "mà còn là **linh vật truyền lệnh quân cơ và biểu tượng uy quyền tối thượng của các Lạc hầu, Lạc tướng thời Hùng Vương**. "
            "Khi có giặc giã hay hội thề, âm vang trầm hùng như sấm rền của trống đồng có thể lan xa hàng chục dặm, hiệu triệu toàn thể bộ tộc đoàn kết chống ngoại xâm."
        ),
        "era": (
            "Hiện vật thuộc **Văn hóa Đông Sơn, sơ kỳ Thời đại Đồ sắt**, có niên đại cách ngày nay khoảng 2.500 năm (khoảng thế kỷ V đến III TCN). "
            "Trống được phát hiện bên bờ sông Mã tại làng Đông Sơn, Thanh Hóa vào năm 1924, là minh chứng đanh thép cho một nền văn minh nông nghiệp phát triển rực rỡ và độc lập."
        ),
        "dimensions": (
            "Trống có kích thước cực kỳ bề thế: **Đường kính mặt 79.3 cm, Chiều cao 63 cm, Vành chân xòe 82 cm**, tổng khối lượng lên tới khoảng **86 kg đồng đỏ nguyên khối**."
        ),
        "significance": (
            "Trống đồng Đông Sơn được công nhận là **Bảo vật Quốc gia Hạng Nhất (Đợt 1, 2012)**. Đây là biểu tượng thiêng liêng nhất cho cội nguồn dân tộc Việt Nam."
        ),
        "visual3d": (
            "Trên mô hình 3D, bạn hãy phóng to vào **tâm mặt trống** để chiêm ngưỡng ngôi sao 14 cánh sắc nét; sau đó xoay góc nhìn nghiêng để thấy **4 con cóc đúc nổi 3D** "
            "và **4 quai kép bím thừng bện** vô cùng sống động ở phần tang trống."
        ),
        "comparison": (
            "So với các dòng trống đồng Đông Sơn loại Heger I khác, chiếc trống này còn nguyên vẹn đến 98% hoa văn, các đường chỉ khắc sắc sảo không hề bị bọt khí hay xô lệch, đạt độ tinh xảo vượt trội."
        )
    },
    "A02": {
        "name": "Ấn vàng Sắc mệnh chi bảo",
        "motif": (
            "Mặt ấn vàng \"Sắc mệnh chi bảo\" đúc nổi 4 chữ Triện thư cổ: **\"Sắc Mệnh Chi Bảo\"** (敕命之寶). Núm ấn là một kiệt tác điêu khắc hoàng gia: "
            "**Tượng Rồng cuộn đứng uy nghi**, đầu ngẩng cao, 2 sừng dài, mắt tròn lồi nhìn về phía trước, đuôi xòe 9 dải như ngọn lửa thiêng, "
            "4 chân 5 móng sắc nhọn tì vững chắc trên lưng ấn – biểu thị vương quyền tối thượng của Thiên tử."
        ),
        "crafting": (
            "Ấn được đúc bằng phương pháp **khuôn sáp chảy (lost-wax casting) với vàng ròng 10 tuổi nguyên khối** (kim trọng 223 lạng 6 đồng, tương đương 8.38 kg). "
            "Bề mặt vàng bóng loáng không tì vết, các nét chữ Triện đáy ấn được khắc chìm tinh vi đòi hỏi kỹ thuật đục vàng đỉnh cao của Ngự xưởng Thượng Bảo triều Nguyễn."
        ),
        "legend": (
            "Ấn được đúc vào tháng 10 năm Đinh Hợi (1827), triều Vua Minh Mạng. Trong điển chế triều Nguyễn, đây là **bảo ấn chuyên dùng để đóng lên các sắc phong ban tước "
            "cho quan lại, phong thần cho các đền miếu và ban bố mệnh lệnh tối cao của Hoàng đế** ra khắp thiên hạ."
        ),
        "era": (
            "Hiện vật có niên đại chuẩn xác vào **năm 1827 (Minh Mạng thứ 8)**. Đây là thời kỳ vương triều Nguyễn đạt đến đỉnh cao về cải cách hành chính, xác lập chủ quyền lãnh thổ."
        ),
        "dimensions": (
            "Ấn có mặt vuông: **14 cm x 14 cm, Chiều cao: 11 cm**, khối lượng lên tới **8.38 kg vàng ròng nguyên khối**."
        ),
        "significance": (
            "Là **Bảo vật Quốc gia đặc biệt**, ấn vàng \"Sắc mệnh chi bảo\" là báu vật truyền quốc phản ánh đỉnh cao quyền lực của vương triều phong kiến triều Nguyễn."
        ),
        "visual3d": (
            "Bạn hãy xoay mô hình 3D nhìn từ trên xuống để ngắm quai rồng uốn lượn 5 móng, và lật đáy ấn lên để thấy 4 chữ Triện \"Sắc Mệnh Chi Bảo\" được khắc sâu sắc nét."
        ),
        "comparison": (
            "Trong số hơn 100 kim bảo ngọc tỷ của triều Nguyễn, \"Sắc mệnh chi bảo\" là một trong số ít ấn vàng nặng nhất và có tần suất sử dụng thực tế cao nhất trên các văn bản hành chính lưu trữ quốc gia."
        )
    },
    "A03": {
        "name": "Tượng Phật Quan Âm nghìn mắt nghìn tay",
        "motif": (
            "Tượng Phật Bà Quan Âm nghìn mắt nghìn tay là đỉnh cao của triết lý Bồ Tát đạo: **\"Nghìn mắt để nhìn thấu nỗi thống khổ của chúng sinh, nghìn tay để kịp thời cứu vớt muôn loài\"**. "
            "Tượng tọa thiền trên đài sen nở, phía sau là vầng hào quang đan lồng bởi hàng trăm cánh tay phụ tỏa tròn tựa vầng thái dương."
        ),
        "crafting": (
            "Tượng được tạc từ **gỗ mít nguyên khối kết hợp kỹ thuật sơn thếp vàng son truyền thống**. Gỗ mít mềm dẻo, không mối mọt, cho phép nghệ nhân chạm khắc những đường nét uốn lượn mềm mại từ ngón tay thon thả đến nếp áo cà sa buông rủ."
        ),
        "legend": (
            "Tượng gắn liền với kiệt tác của nghệ nhân Trương Tiên Thảo thế kỷ 17 tại chùa Bút Tháp (Bắc Ninh). Tác phẩm thể hiện lòng từ bi bao la cứu khổ cứu nạn của đạo Phật hòa quyện với tâm hồn hiền hậu, bao dung của người phụ nữ Việt Nam."
        ),
        "era": (
            "Niên đại thuộc **thế kỷ XVII (Thời Lê Trung Hưng, năm 1656)**. Đây là giai đoạn nghệ thuật điêu khắc tượng gỗ Phật giáo Đại Việt đạt tới đỉnh cao rực rỡ nhất về tính biểu cảm tâm linh."
        ),
        "dimensions": (
            "Chiều cao tượng đạt gần **3.7 mét (bao gồm cả đài sen và bệ đỡ rồng)**, dang rộng tay hơn 2 mét với 42 tay lớn và 952 tay nhỏ."
        ),
        "significance": (
            "Tượng được xếp hạng **Bảo vật Quốc gia**, là biểu tượng vĩ đại cho lòng từ bi và tài năng tạc tượng gỗ sơn son thếp vàng vô song của dân tộc."
        ),
        "visual3d": (
            "Bạn hãy phóng to vào khuôn mặt Quan Âm với nét cười trầm mặc, sau đó xoay góc nhìn phía sau để quan sát cách bố trí hàng trăm bàn tay đan kết thành vầng hào quang kỳ ảo."
        ),
        "comparison": (
            "Khác với các pho tượng Quan Âm phong cách Ấn Độ hay Trung Hoa, tượng Việt Nam mang nét đẹp phúc hậu, gần gũi như người mẹ hiền dân dã."
        )
    },
    "A04": {
        "name": "Bình gốm hoa lam vẽ thiên nga",
        "motif": (
            "Bình gốm hoa lam Chu Đậu nổi bật với đồ án **vẽ đôi thiên nga sải cánh bay giữa làn mây trắng**. Lớp men lam cô-ban (cobalt blue) huyền ảo kết hợp với họa tiết hoa cúc dây, cánh sen cách điệu tạo nên phong vị tao nhã, thanh thoát đặc trưng của mỹ thuật thời Lê sơ."
        ),
        "crafting": (
            "Được chế tác từ **đất sét trắng trầm tích sông Thái Bình lọc mịn**, phủ lớp men tro trấu tự nhiên độc bản và nung ở nhiệt độ cao 1.250°C. Kỹ thuật vẽ dưới men (underglaze blue) bằng bút lông nét thanh nét đậm đòi hỏi người thợ gốm phải vẽ một mạch chuẩn xác trước khi nung."
        ),
        "legend": (
            "Chiếc bình được trục vớt từ **con tàu đắm cổ thế kỷ 15 tại vùng biển Cù Lao Chàm**. Phát hiện khảo cổ này chấn động thế giới, chứng minh gốm Chu Đậu từng tung hoành trên Con đường Tơ lụa trên biển, xuất khẩu tới tận Trung Đông và châu Âu."
        ),
        "era": (
            "Hiện vật có niên đại vào **thế kỷ XV (Thời Lê sơ)** – kỷ nguyên vàng son của gốm sứ Đại Việt với sự nở rộ của các làng nghề Chu Đậu (Hải Dương)."
        ),
        "dimensions": (
            "Chiều cao: **56.5 cm, Đường kính bụng: 38 cm**, dáng bình củ tỏi cân đối hoàn mỹ."
        ),
        "significance": (
            "Bảo vật Quốc gia minh chứng cho bàn tay tài hoa của nghệ nhân Việt và vị thế cường quốc xuất khẩu gốm sứ của Đại Việt trên trường quốc tế."
        ),
        "visual3d": (
            "Hãy xoay 360 độ để ngắm nhìn đàn thiên nga uốn lượn quanh thân bình và nước men lam óng ả phản chiếu ánh sáng."
        ),
        "comparison": (
            "So với gốm hoa lam thời Minh, gốm Chu Đậu Việt Nam phóng khoáng hơn về nét vẽ, màu men có độ trong sâu và gắn liền với đời sống thiên nhiên đồng bằng Bắc Bộ."
        )
    },
    "A05": {
        "name": "Mũ quan nhất phẩm Triều Nguyễn",
        "motif": (
            "Mũ quan nhất phẩm triều Nguyễn là đỉnh cao của điển chế mũ mão cung đình: Đính **4 con rồng vàng (lưỡng long chầu hoa cúc)**, 4 con phượng hoàng bằng vàng ròng, điểm xuyết các hạt ngọc trai thiên nhiên và đá quý màu đỏ thắm."
        ),
        "crafting": (
            "Thân mũ được đan kết vô cùng tỉ mỉ bằng **lông đuôi ngựa màu đen tạo thành mạng lưới thoáng khí mà bền chắc**. Các hoa văn rồng mây bằng vàng ròng dát mỏng như cánh ve được gắn kết tinh vi bằng dây chỉ vàng."
        ),
        "legend": (
            "Chiếc mũ từng lưu lạc ra nước ngoài qua biến thiên lịch sử chiến tranh và được nhà đấu giá quốc tế định giá hàng trăm nghìn USD trước khi được các nhà hảo tâm đấu giá thành công và hiến tặng lại cho Bảo tàng Lịch sử."
        ),
        "era": (
            "Niên đại vào **cuối thế kỷ XIX đến đầu thế kỷ XX (Thời Nguyễn)**, thuộc về một vị đại thần hàng Chánh nhất phẩm triều đình Huế."
        ),
        "dimensions": (
            "Chiều cao: **22 cm, Đường kính lọt lòng: 18.5 cm**, trọng lượng khoảng 650 gram (trong đó có hơn 2 lượng vàng ròng trang trí)."
        ),
        "significance": (
            "Hiện vật là chiếc mũ quan văn nhất phẩm duy nhất còn bảo tồn nguyên vẹn các chi tiết vàng ngọc cho đến ngày nay tại Việt Nam."
        ),
        "visual3d": (
            "Hãy phóng to vào hai cánh chuồn đan bằng chỉ vàng và các hạt ngọc trai đính trên trán mũ để cảm nhận độ tinh xảo của ngự xưởng kim hoàn Huế."
        ),
        "comparison": (
            "So với mũ quan thời Thanh, mũ quan triều Nguyễn kế thừa đậm nét kiểu thức mũ Phốc đầu thời Lê, thể hiện tính độc lập và bản sắc điển chế Đại Nam."
        )
    },
    "A06": {
        "name": "Kiếm Thuận Thiên Hoàng Gia",
        "motif": (
            "Lưỡi kiếm rèn từ thép thiên thạch ánh thép xanh lạnh, chuôi kiếm bọc vàng ròng chạm khắc hoa văn rồng cuộn thời Lê sơ, đốc kiếm nạm viên đá mắt hổ tượng trưng cho vương quyền và sức mạnh chính nghĩa."
        ),
        "crafting": (
            "Áp dụng kỹ thuật rèn thép gấp nhiều lớp (Damascus cổ truyền) kết hợp kỹ thuật tôi luyện bằng nước giếng ngọc núi Lam Sơn, tạo nên lưỡi gươm chém sắt như chém bùn mà thân kiếm vẫn dẻo dai."
        ),
        "legend": (
            "Gắn liền với huyền tích **Rùa Vàng trao gươm báu tại Hồ Tả Vọng (Hồ Hoàn Kiếm)** cho Bình Định Vương Lê Lợi đánh tan 15 vạn giặc Minh, sau khi thái bình thiên hạ thì hoàn trả gươm thần cho thần Kim Quy."
        ),
        "era": (
            "Thế kỷ **XV (Thời Lê sơ, khoảng năm 1428)**, hiện vật gắn liền với khởi nghĩa Lam Sơn oanh liệt giành lại độc lập cho giang sơn xã tắc."
        ),
        "dimensions": (
            "Chiều dài tổng thể: **98 cm, Chiều dài lưỡi kiếm: 78 cm, Bề rộng: 3.8 cm, Khối lượng: 1.4 kg**."
        ),
        "significance": (
            "Bảo vật Quốc gia thiêng liêng biểu trưng cho ý chí độc lập, tinh thần quật cường và khát vọng hòa bình muôn thuở của dân tộc Việt Nam."
        ),
        "visual3d": (
            "Bạn hãy xoay nghiêng lưỡi kiếm dưới ánh đèn sân khấu 3D để quan sát đường vân thép rèn cuộn sóng và hoa văn chữ 'Thuận Thiên' khắc chìm."
        ),
        "comparison": (
            "Khác với thanh kiếm katana Nhật Bản hay trường kiếm Châu Âu, bảo kiếm Đại Việt cân đối giữa độ cong chém và mũi nhọn đâm, phù hợp chiến thuật thủy lục chiến."
        )
    },
    "A07": {
        "name": "Đại Hồng Chung Chùa Thiên Mụ",
        "motif": (
            "Quai chuông đúc hình Bồ Lao hai đầu rồng ngậm ngọc; thân chuông chia làm 4 ô ngăn cách bởi các dải hồi văn sấm sét, khắc bài minh văn chữ Hán ca ngợi cảnh sắc xứ Huế và lời chú Phật pháp cầu quốc thái dân an."
        ),
        "crafting": (
            "Đúc bằng đồng đỏ nguyên chất pha hợp kim thiếc, chì và vàng bạc do chúa Nguyễn Phúc Chu cúng dường; kỹ thuật đúc chuông cân đối âm học giúp tiếng chuông ngân vang xa hàng chục dặm dọc sông Hương."
        ),
        "legend": (
            "Mỗi hồi chuông Thiên Mụ buông xuống lúc sớm mai hay hoàng hôn đã trở thành linh hồn của xứ Huế thơ mộng: 'Gió đưa cành trúc la đà / Tiếng chuông Thiên Mụ, canh gà Thọ Xương'."
        ),
        "era": (
            "Được đúc vào năm **Canh Dần (1710)** thời chúa Nguyễn Phúc Chu (thời các Chúa Nguyễn cai quản Đàng Trong)."
        ),
        "dimensions": (
            "Chiều cao: **2.16 mét, Đường kính miệng chuông: 1.57 mét, Khối lượng: 1.985 kg (gần 2 tấn đồng)**."
        ),
        "significance": (
            "Bảo vật Quốc gia tiêu biểu cho đỉnh cao kỹ thuật đúc đồng âm học và đời sống Phật giáo Đàng Trong thế kỷ 18."
        ),
        "visual3d": (
            "Hãy xoay quanh thân chuông để đọc các bài minh văn khắc chìm và quan sát 4 núm gõ đúc nổi hình đóa sen mãn khai."
        ),
        "comparison": (
            "Chuông Thiên Mụ có tỷ lệ chiều cao và đường kính miệng lý tưởng, tạo tần số âm bass trầm ấm ngân dài hơn hẳn các quả chuông cùng niên đại ở Đông Á."
        )
    },
    "A08": {
        "name": "Ngọc tỷ Hoàng đế chi bảo",
        "motif": (
            "Núm ấn đúc hình **Rồng uốn khúc 5 móng nhô cao**, trán có khắc chữ 'Vương', vảy lưng sắc nét. Mặt ấn khắc 4 chữ Triện nổi: **'Hoàng Đế Chi Bảo'** (皇帝之寶) trang trọng uy nghiêm."
        ),
        "crafting": (
            "Chế tác từ khối **ngọc bích (nephrite jade) xanh thuần khiết không tì vết**, được các bậc thầy gọt ngọc cung đình đục đẽo và đánh bóng bằng bột kim cương qua hàng nghìn giờ công."
        ),
        "legend": (
            "Là ngọc tỷ truyền quốc tối thượng, chứng kiến thời khắc lịch sử ngày 30/8/1945 khi vua Bảo Đại trao ấn kiếm cho phái đoàn chính phủ Việt Nam Dân chủ Cộng hòa tại Ngọ Môn Huế, chấm dứt chế độ phong kiến ngàn năm."
        ),
        "era": (
            "Được tạc vào **năm 1823 (Minh Mạng thứ 4)**, là ngọc tỷ quyền lực nhất của vương triều Nguyễn."
        ),
        "dimensions": (
            "Mặt ấn vuông: **13.8 cm x 13.8 cm, Chiều cao: 10.5 cm, Khối lượng: 2.8 kg ngọc bích nguyên khối**."
        ),
        "significance": (
            "Bảo vật Quốc gia vô giá, biểu tượng cho sự chuyển giao chính quyền lịch sử và chủ quyền quốc gia bất khả xâm phạm."
        ),
        "visual3d": (
            "Bật chế độ xuyên sáng trên 3D để chiêm ngưỡng độ trong và vân ngọc xanh ngọc bích tự nhiên tuyệt đẹp bên trong thân ấn."
        ),
        "comparison": (
            "So với ngọc tỷ các triều đại trước, ngọc tỷ triều Nguyễn sử dụng chất ngọc bích xanh thẫm hiếm có với kỹ thuật chạm rồng 5 móng mang đậm bản sắc hoàng gia Đại Nam."
        )
    },
    "A09": {
        "name": "Tượng Nữ thần Apsara Champa",
        "motif": (
            "Vũ nữ Apsara trong tư thế múa uốn ba khúc Tribhanga duyên dáng, bầu ngực căng tràn sức sống, khuôn mặt thanh tú với nụ cười bí ẩn Champa, trang sức vòng cổ và thắt lưng chạm cánh hoa tinh xảo."
        ),
        "crafting": (
            "Được đục đẽo trực tiếp từ một khối **sa thạch hồng (pink sandstone)** Trà Kiệu bằng đục sắt thô sơ nhưng đạt độ mềm mại uyển chuyển như da thịt sống."
        ),
        "legend": (
            "Theo thần thoại Hindu, Apsara là những tiên nữ sinh ra từ cuộc khuấy biển sữa, chuyên múa hát dâng lên các vị thần Shiva và Brahma trên đỉnh núi thiêng Meru."
        ),
        "era": (
            "Thế kỷ **X (Thời kỳ phong cách Trà Kiệu, Vương quốc Champa cổ)** – giai đoạn rực rỡ nhất của nghệ thuật điêu khắc sa thạch Champa."
        ),
        "dimensions": (
            "Chiều cao: **86 cm, Chiều rộng: 52 cm, Chiều dày: 28 cm, Khối lượng: 75 kg**."
        ),
        "significance": (
            "Bảo vật Quốc gia minh chứng cho sự giao thoa văn hóa Ấn Độ - Đông Nam Á và tài hoa tạc đá bậc thầy của cư dân cổ Champa."
        ),
        "visual3d": (
            "Xoay mô hình sang góc nghiêng 45 độ để ngắm nhìn đường cong chữ S tuyệt mỹ của thân hình và các nếp váy mỏng manh như lụa."
        ),
        "comparison": (
            "Khác với tượng Apsara Angkor Wat của người Khmer với nụ cười Bayon trầm mặc, Apsara Trà Kiệu của Champa rực rỡ sức sống và tràn đầy sự gợi cảm phóng khoáng."
        )
    },
    "A10": {
        "name": "Đầu rồng thời Lý đất nung",
        "motif": (
            "Đầu rồng đất nung thời Lý với miệng ngậm ngọc minh châu, mũi dạng sống trâu uốn cong như cánh sen, bờm dài lượn sóng bay ngược về sau, râu rồng uốn khúc mềm mại như ngọn lửa thiêng."
        ),
        "crafting": (
            "Nặn bằng đất sét sông Hồng lọc sạch tạp chất, tạo hình bằng tay kết hợp dập khuôn gỗ, tráng lớp men men ngọc nhạt và nung trong lò rơm đạt nhiệt độ hơn 1.100°C."
        ),
        "legend": (
            "Hiện vật gắn liền với sự kiện vua Lý Thái Tổ dời đô từ Hoa Lư về Đại La năm 1010, nhìn thấy rồng vàng bay lên nên đổi tên thành Thăng Long; đầu rồng từng ngự trên đỉnh mái ngói Điện Kính Thiên."
        ),
        "era": (
            "Thế kỷ **XI - XII (Thời Nhà Lý)**, khai quật tại Khu di tích Hoàng thành Thăng Long (Hà Nội)."
        ),
        "dimensions": (
            "Chiều cao: **62 cm, Chiều dài: 74 cm, Bề ngang: 32 cm, Khối lượng: 34 kg**."
        ),
        "significance": (
            "Bảo vật Quốc gia biểu tượng cho nền độc lập tự chủ phục hưng và mỹ thuật thanh thoát, bác ái thời Lý."
        ),
        "visual3d": (
            "Hãy nhìn từ góc nghiêng phía trước để cảm nhận độ há rộng của hàm rồng ngậm ngọc và các dải bờm rồng uốn lượn nhịp nhàng như mây gió."
        ),
        "comparison": (
            "Rồng thời Lý mang thân hình giun uốn khúc nhịp nhàng, hiền hòa và thanh thoát, hoàn toàn khác biệt với vẻ dữ dằn, uy quyền áp chế của rồng thời Minh hay Thanh."
        )
    }
}

from app.services.search import remove_diacritics

def has_keywords(text: str, keywords: List[str]) -> bool:
    """Kiểm tra từ khóa chính xác có word boundary để tránh trùng từ con như 'rong' trong 'trong'"""
    for kw in keywords:
        if ' ' in kw:
            if kw in text:
                return True
        else:
            if re.search(r'\b' + re.escape(kw) + r'\b', text):
                return True
    return False

# =========================================================================
# BỘ XỬ LÝ PHÂN LOẠI Ý ĐỊNH & SINH CÂU TRẢ LỜI ĐA DẠNG (INTENT SYNTHESIZER)
# =========================================================================

def synthesize_smart_answer(question: str, contexts: List[str], sources: List[Artifact]) -> str:
    """
    Phân tích câu hỏi và sinh câu trả lời chuyên sâu, tự nhiên, không rập khuôn công thức.
    Hỗ trợ cả tiếng Việt có dấu và không dấu.
    """
    q_norm = remove_diacritics(question)
    lead_source = sources[0] if sources else None
    art_code = lead_source.code if lead_source else None

    # Tìm mã hiện vật nếu được nhắc trong câu hỏi
    for code, info in ARTIFACT_KNOWLEDGE_MAP.items():
        name_norm = remove_diacritics(info["name"])
        if code.lower() in q_norm or name_norm in q_norm or any(w in q_norm for w in name_norm.split() if len(w) > 3):
            art_code = code
            break

    knowledge = ARTIFACT_KNOWLEDGE_MAP.get(art_code) if art_code else None

    # 1. Câu chào hỏi giao tiếp
    if re.search(r'\b(chao|hello|hi|xin chao)\b', q_norm):
        if knowledge:
            return (
                f"Xin chào quý khách! Rất vui được đồng hành cùng bạn tìm hiểu về **{knowledge['name']}** ({art_code}). "
                f"Hiện vật quý giá này có rất nhiều câu chuyện hấp dẫn về hoa văn, kỹ thuật đúc cổ truyền và các điển tích lịch sử. "
                f"Bạn muốn khám phá khía cạnh nào trước?"
            )
        return (
            "Xin chào quý khách! Tôi là Hướng dẫn viên AI của Bảo tàng Lịch sử Thông minh. "
            "Tôi có thể thuyết minh chi tiết cho bạn về 10 Bảo vật Quốc gia, ý nghĩa hoa văn, kỹ thuật đúc cổ truyền và chỉ đường 3D trực tiếp trong bảo tàng. "
            "Bạn đang quan tâm đến hiện vật nào hôm nay?"
        )

    # Nếu có bảo vật cụ thể trong kho tri thức
    if knowledge:
        # 2. Kỹ thuật chế tác, chất liệu, đúc đồng, lò nung, dát vàng (ưu tiên nếu hỏi về kỹ thuật)
        if has_keywords(q_norm, ['ky thuat', 'che tac', 'luyen kim', 'duc', 'khuon', 'chat lieu', 'lam bang gi', 'vang rong', 'go mit', 'men', 'nung', 'ren']):
            return f"**Về kỹ thuật chế tác đỉnh cao của {knowledge['name']}:**\n\n{knowledge['crafting']}\n\nĐộ tinh xảo này là minh chứng cho trình độ bậc thầy của tiền nhân thời bấy giờ."

        # 3. Hoa văn, họa tiết, biểu tượng, ý nghĩa hình tượng
        if has_keywords(q_norm, ['hoa van', 'hoa tiet', 'bieu tuong', 'y nghia', 'con coc', 'mat troi', 'chim lac', 'rong', 'num an', 'chu trien', 'thien nga', 'canh tay']):
            return f"**Về ý nghĩa hoa văn & biểu tượng của {knowledge['name']}:**\n\n{knowledge['motif']}\n\n💡 Bạn có thể bật chế độ xoay 3D để quan sát các chi tiết đồ án này cận cảnh!"

        # 4. Điển tích, truyền thuyết, sự tích, công dụng, dùng làm gì
        if has_keywords(q_norm, ['dien tich', 'truyen thuyet', 'su tich', 'cau chuyen', 'dung lam gi', 'nghi le', 'muc dich', 'chuc nang', 'le loi', 'bao dai', 'thien mu']):
            return f"**Về điển tích & chức năng lịch sử của {knowledge['name']}:**\n\n{knowledge['legend']}"

        # 5. Niên đại, thời kỳ, tìm thấy ở đâu, khai quật, bao nhiêu năm
        if has_keywords(q_norm, ['nien dai', 'thoi ky', 'nam nao', 'trieu dai', 'bao nhieu nam', 'tim thay', 'o dau', 'khai quat', 'phat hien', 'the ky']):
            return f"**Về niên đại & lịch sử phát hiện {knowledge['name']}:**\n\n{knowledge['era']}"

        # 6. Kích thước, trọng lượng, nặng bao nhiêu, cao bao nhiêu
        if has_keywords(q_norm, ['kich thuoc', 'trong luong', 'nang', 'bao nhieu kg', 'dai', 'cao', 'rong', 'duong kinh', 'nang bao nhieu']):
            return f"**Thông số kích thước & khối lượng của {knowledge['name']}:**\n\n{knowledge.get('dimensionWeightAnswer', knowledge.get('dimensions', ''))}"

        # 7. Hướng dẫn xem 3D, góc nhìn đẹp
        if has_keywords(q_norm, ['xem 3d', '3d', 'xoay', 'goc nhin', 'phong to', 'zoom', 'nhin']):
            return f"**Gợi ý góc nhìn 3D tuyệt đẹp của {knowledge['name']}:**\n\n{knowledge['visual3d']}"

        # 8. So sánh với các hiện vật khác
        if has_keywords(q_norm, ['so sanh', 'khac gi', 'dac biet', 'noi bat', 'doc dao', 'khac biet']):
            return f"**Điểm độc bản & so sánh của {knowledge['name']}:**\n\n{knowledge['comparison']}"

        # 9. Giá trị bảo vật quốc gia
        if has_keywords(q_norm, ['bao vat', 'quoc gia', 'gia tri', 'y nghia lich su', 'tai sao quy']):
            return f"**Giá trị di sản vô giá của {knowledge['name']}:**\n\n{knowledge['significance']}\n\n{knowledge['legend']}"

        # 10. Câu hỏi tổng quát về hiện vật -> kết hợp ngắn gọn, linh hoạt
        return (
            f"**{knowledge['name']} ({art_code})** là một trong những bảo vật tiêu biểu nhất tại bảo tàng:\n\n"
            f"• **Niên đại:** {knowledge['era']}\n"
            f"• **Kích thước:** {knowledge['dimensions']}\n\n"
            f"{knowledge['motif']}\n\n"
            f"💡 *Bạn có thể hỏi thêm tôi về: 'Kỹ thuật đúc hiện vật này', 'Ý nghĩa hình tượng rồng/cóc/thiên nga', hoặc 'Điển tích trao kiếm/ấn vàng' nhé!*"
        )

    # Nếu không trúng 10 bảo vật trên, dùng RAG Context
    if contexts:
        return (
            f"Dựa trên tư liệu lưu trữ của Bảo tàng Lịch sử:\n\n"
            f"{contexts[0]}\n\n"
            f"💡 *Bạn có thể nhấn nút **'Chỉ đường'** trên bản đồ 3D để được dẫn lối đến tận nơi trưng bày, "
            f"hoặc nhấn **'Xem 3D'** để xoay ngắm hiện vật.*"
        )

    return (
        "Chào bạn! Tôi có thể giải đáp chi tiết về 10 Bảo vật Quốc gia của bảo tàng, bao gồm: "
        "Trống đồng Đông Sơn, Ấn vàng Sắc mệnh chi bảo, Tượng Phật Quan Âm, Bình gốm hoa lam Chu Đậu, "
        "Mũ quan nhất phẩm, Kiếm Thuận Thiên, Chuông Thiên Mụ, Ngọc tỷ Hoàng đế chi bảo, Tượng Apsara và Đầu rồng Thăng Long. "
        "Bạn muốn tìm hiểu hiện vật nào?"
    )


# =========================================================================
# STREAMING SSE CHATBOT GENERATOR
# =========================================================================

async def generate_chat_stream(
    question: str,
    contexts: List[str],
    sources: List[Artifact]
) -> AsyncGenerator[str, None]:
    """
    Sinh câu trả lời dạng Streaming SSE (Server-Sent Events) kết hợp tri thức sâu không lặp khuôn.
    """
    full_text = synthesize_smart_answer(question, contexts, sources)
    words = full_text.split(" ")

    for i, word in enumerate(words):
        chunk = word + (" " if i < len(words) - 1 else "")
        payload = json.dumps({"type": "token", "content": chunk}, ensure_ascii=False)
        yield f"data: {payload}\n\n"
        await asyncio.sleep(0.025)

    # Gửi kèm danh sách nguồn trích dẫn
    sources_payload = [
        {
            "code": s.code,
            "name": s.name,
            "era": s.era,
            "room_code": s.room_code
        }
        for s in sources
    ]
    done_payload = json.dumps({"type": "done", "sources": sources_payload}, ensure_ascii=False)
    yield f"data: {done_payload}\n\n"

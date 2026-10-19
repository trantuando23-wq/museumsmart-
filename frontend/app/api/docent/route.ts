import { NextRequest, NextResponse } from 'next/server'
import { MUSEUM_ARTIFACTS, Artifact3D } from '@/data/museumData'

interface DocentRequestBody {
  artifactId: string
  userQuestion: string
  chatHistory?: Array<{ sender: 'user' | 'assistant'; content: string }>
}

// BỘ DỮ LIỆU CHUYÊN SÂU & GIẢI ĐÁP LINH HOẠT TỪNG BẢO VẬT QUỐC GIA
interface ArtifactQAKnowledge {
  motifAnswer: string
  craftingAnswer: string
  legendStoryAnswer: string
  historyEraAnswer: string
  dimensionWeightAnswer: string
  significanceAnswer: string
  visual3dAnswer: string
  comparativeAnswer: string
}

const ARTIFACT_KNOWLEDGE_MAP: Record<string, ArtifactQAKnowledge> = {
  A01: {
    motifAnswer:
      'Về đồ án hoa văn trên Trống đồng Đông Sơn: Tâm mặt trống là **ngôi sao 14 cánh** tượng trưng cho Thần Mặt Trời – nguồn cội sự sống trong nền văn minh nông nghiệp lúa nước. Bao quanh ngôi sao là các vành hoa văn chim Lạc dang cánh bay ngược chiều kim đồng hồ theo chu kỳ mặt trời, cảnh cư dân giã gạo đón mùa và các đoàn thuyền chiến vượt sóng. Đặc biệt, **4 khối tượng cóc nổi** trên rìa mặt trống mang tín ngưỡng phồn thực cầu mưa: "Con cóc là cậu ông Trời, hễ ai đánh nó thì Trời đánh cho" – thể hiện ước vọng mưa thuận gió hòa của người Lạc Việt.',
    craftingAnswer:
      'Kỹ thuật đúc Trống đồng Đông Sơn là đỉnh cao luyện kim thời đại đồ đồng thế giới. Các nghệ nhân Vua Hùng đã phối trộn đồng đỏ, thiếc và chì theo tỷ lệ luyện kim hoàn hảo, đúc bằng **khuôn đất 3 đến 4 mang kết hợp lõi khuôn treo liền khối**. Nhờ độ nhớt và nhiệt độ dòng chảy kim loại được kiểm soát chuẩn xác, thân trống chỉ mỏng từ vài milimet nhưng chịu lực gõ ngân vang kỳ diệu suốt hơn 2.500 năm mà không hề nứt vỡ.',
    legendStoryAnswer:
      'Theo truyền thuyết và thư tịch cổ, Trống đồng Đông Sơn không chỉ là nhạc khí trong ngày hội mùa màng hay nghi lễ hiến tế, mà còn là **linh vật truyền lệnh quân cơ và biểu tượng uy quyền tối thượng của các Lạc hầu, Lạc tướng thời Hùng Vương**. Khi có giặc giã hay hội thề, âm vang trầm hùng như sấm rền của trống đồng có thể lan xa hàng chục dặm, hiệu triệu toàn thể bộ tộc đoàn kết chống ngoại xâm.',
    historyEraAnswer:
      'Hiện vật thuộc **Văn hóa Đông Sơn, sơ kỳ Thời đại Đồ sắt**, có niên đại cách ngày nay khoảng 2.500 năm (khoảng thế kỷ V đến III TCN). Trống được phát hiện bên bờ sông Mã tại làng Đông Sơn, Thanh Hóa vào năm 1924, là minh chứng đanh thép cho một nền văn minh nông nghiệp phát triển rực rỡ và độc lập trước thời Bắc thuộc.',
    dimensionWeightAnswer:
      'Trống có kích thước cực kỳ bề thế: **Đường kính mặt 79.3 cm, Chiều cao 63 cm, Vành chân xòe 82 cm**, tổng khối lượng lên tới khoảng **86 kg đồng đỏ nguyên khối**.',
    significanceAnswer:
      'Trống đồng Đông Sơn được công nhận là **Bảo vật Quốc gia Hạng Nhất (Đợt 1, 2012)**. Đây là biểu tượng thiêng liêng nhất cho cội nguồn dân tộc Việt Nam, niềm tự hào về trí tuệ và bàn tay tài hoa của tổ tiên buổi đầu dựng nước.',
    visual3dAnswer:
      'Trên mô hình 3D, quý khách hãy phóng to vào **tâm mặt trống** để chiêm ngưỡng ngôi sao 14 cánh sắc nét; sau đó xoay góc nhìn nghiêng để thấy **4 con cóc đúc nổi 3D** và **4 quai kép bím thừng bện** vô cùng sống động ở phần tang trống.',
    comparativeAnswer:
      'So với các dòng trống đồng Đông Sơn loại Heger I khác, chiếc trống này còn nguyên vẹn đến 98% hoa văn, các đường chỉ khắc sắc sảo không hề bị bọt khí hay xô lệch, đạt độ tinh xảo vượt trội so với các hiện vật cùng thời kỳ ở Đông Nam Á.',
  },
  A02: {
    motifAnswer:
      'Mặt ấn vàng "Sắc mệnh chi bảo" đúc nổi 4 chữ Triện thư cổ: **"Sắc Mệnh Chi Bảo"** (敕命之寶). Núm ấn là một kiệt tác điêu khắc hoàng gia: **Tượng Rồng cuộn đứng uy nghi**, đầu ngẩng cao, 2 sừng dài, mắt tròn lồi nhìn về phía trước, đuôi xòe 9 dải như ngọn lửa thiêng, 4 chân 5 móng sắc nhọn tì vững chắc trên lưng ấn – biểu thị vương quyền tối thượng của Thiên tử.',
    craftingAnswer:
      'Ấn được đúc bằng phương pháp **khuôn sáp chảy (lost-wax casting) với vàng ròng 10 tuổi nguyên khối** (kim trọng 223 lạng 6 đồng, tương đương 8.38 kg). Bề mặt vàng bóng loáng không tì vết, các nét chữ Triện đáy ấn được khắc chìm tinh vi đòi hỏi kỹ thuật đục vàng đỉnh cao của Ngự xưởng Thượng Bảo triều Nguyễn.',
    legendStoryAnswer:
      'Ấn được đúc vào tháng 10 năm Đinh Hợi (1827), triều Vua Minh Mạng. Trong điển chế triều Nguyễn, đây là **bảo ấn chuyên dùng để đóng lên các sắc phong ban tước cho quan lại, phong thần cho các đền miếu và ban bố mệnh lệnh tối cao của Hoàng đế** ra khắp thiên hạ.',
    historyEraAnswer:
      'Hiện vật có niên đại chuẩn xác vào **năm 1827 (Minh Mạng thứ 8)**. Đây là thời kỳ vương triều Nguyễn đạt đến đỉnh cao về cải cách hành chính, xác lập chủ quyền lãnh thổ và hoàn thiện thể chế nhà nước tập quyền.',
    dimensionWeightAnswer:
      'Ấn có mặt vuông: **14 cm x 14 cm, Chiều cao: 11 cm**, khối lượng lên tới **8.38 kg vàng ròng nguyên khối**.',
    significanceAnswer:
      'Là **Bảo vật Quốc gia đặc biệt**, ấn vàng "Sắc mệnh chi bảo" là báu vật truyền quốc phản ánh đỉnh cao quyền lực của vương triều phong kiến cuối cùng trong lịch sử Việt Nam.',
    visual3dAnswer:
      'Quý khách hãy xoay mô hình 3D nhìn từ trên xuống để ngắm quai rồng uốn lượn 5 móng, và lật đáy ấn lên để thấy 4 chữ Triện "Sắc Mệnh Chi Bảo" được khắc sâu sắc nét.',
    comparativeAnswer:
      'Trong số hơn 100 kim bảo ngọc tỷ của triều Nguyễn, "Sắc mệnh chi bảo" là một trong số ít ấn vàng nặng nhất và có tần suất sử dụng thực tế cao nhất trên các văn bản hành chính lưu trữ quốc gia.',
  },
  A03: {
    motifAnswer:
      'Tượng Phật Bà Quan Âm nghìn mắt nghìn tay là đỉnh cao của triết lý Bồ Tát đạo: **"Nghìn mắt để nhìn thấu nỗi thống khổ của chúng sinh, nghìn tay để kịp thời cứu vớt muôn loài"**. Tượng tọa thiền trên đài sen nở, phía sau là vầng hào quang đan lồng bởi hàng trăm cánh tay phụ tỏa tròn tựa vầng thái dương.',
    craftingAnswer:
      'Tượng được tạc từ **gỗ mít nguyên khối kết hợp kỹ thuật sơn thếp vàng son truyền thống**. Gỗ mít mềm dẻo, không mối mọt, cho phép nghệ nhân chạm khắc những đường nét uốn lượn mềm mại từ ngón tay thon thả đến nếp áo cà sa buông rủ.',
    legendStoryAnswer:
      'Tượng gắn liền với kiệt tác của nghệ nhân Trương Tiên Thảo thế kỷ 17 tại chùa Bút Tháp (Bắc Ninh). Tác phẩm thể hiện lòng từ bi bao la cứu khổ cứu nạn của đạo Phật hòa quyện với tâm hồn hiền hậu, bao dung của người phụ nữ Việt Nam.',
    historyEraAnswer:
      'Niên đại thuộc **thế kỷ XVII (Thời Lê Trung Hưng)**. Đây là giai đoạn nghệ thuật điêu khắc tượng gỗ Phật giáo Đại Việt đạt tới đỉnh cao rực rỡ nhất về tính biểu cảm tâm linh.',
    dimensionWeightAnswer:
      'Chiều cao tượng đạt gần **3 mét (bao gồm cả đài sen và bệ đỡ rồng)**, dang rộng tay hơn 2 mét.',
    significanceAnswer:
      'Tượng được xếp hạng **Bảo vật Quốc gia**, là biểu tượng vĩ đại cho lòng từ bi và tài năng tạc tượng gỗ sơn son thếp vàng vô song của dân tộc.',
    visual3dAnswer:
      'Quý khách hãy phóng to vào khuôn mặt Quan Âm với nét cười trầm mặc, sau đó xoay góc nhìn phía sau để quan sát cách bố trí hàng trăm bàn tay đan kết thành vầng hào quang kỳ ảo.',
    comparativeAnswer:
      'Khác với các pho tượng Quan Âm phong cách Ấn Độ hay Trung Hoa, tượng Việt Nam mang nét đẹp phúc hậu, gần gũi như người mẹ hiền dân dã.',
  },
  A04: {
    motifAnswer:
      'Bình gốm hoa lam Chu Đậu nổi bật với đồ án **vẽ đôi thiên nga sải cánh bay giữa làn mây trắng**. Lớp men lam cô-ban (cobalt blue) huyền ảo kết hợp với họa tiết hoa cúc dây, cánh sen cách điệu tạo nên phong vị tao nhã, thanh thoát đặc trưng của mỹ thuật thời Lê sơ.',
    craftingAnswer:
      'Được chế tác từ **đất sét trắng trầm tích sông Thái Bình lọc mịn**, phủ lớp men tro trấu tự nhiên độc bản và nung ở nhiệt độ cao 1.250°C. Kỹ thuật vẽ dưới men (underglaze blue) bằng bút lông nét thanh nét đậm đòi hỏi người thợ gốm phải vẽ một mạch chuẩn xác trước khi nung.',
    legendStoryAnswer:
      'Chiếc bình được trục vớt từ **con tàu đắm cổ thế kỷ 15 tại vùng biển Cù Lao Chàm**. Phát hiện khảo cổ này chấn động thế giới, chứng minh gốm Chu Đậu từng tung hoành trên Con đường Tơ lụa trên biển, xuất khẩu tới tận Trung Đông và châu Âu.',
    historyEraAnswer:
      'Hiện vật có niên đại vào **thế kỷ XV (Thời Lê sơ)** – kỷ nguyên vàng son của gốm sứ Đại Việt với sự nở rộ của các làng nghề Chu Đậu (Hải Dương).',
    dimensionWeightAnswer:
      'Chiều cao: **54 cm, Đường kính bụng: 42 cm**, dáng bình củ tỏi cân đối hoàn mỹ.',
    significanceAnswer:
      'Bảo vật Quốc gia minh chứng cho bàn tay tài hoa của nghệ nhân Việt và vị thế cường quốc xuất khẩu gốm sứ của Đại Việt trên trường quốc tế.',
    visual3dAnswer:
      'Hãy xoay 360 độ để ngắm nhìn đàn thiên nga uốn lượn quanh thân bình và nước men lam óng ả phản chiếu ánh sáng.',
    comparativeAnswer:
      'So với gốm hoa lam thời Minh, gốm Chu Đậu Việt Nam phóng khoáng hơn về nét vẽ, màu men có độ trong sâu và gắn liền với đời sống thiên nhiên đồng bằng Bắc Bộ.',
  },
  A05: {
    motifAnswer:
      'Mũ quan nhất phẩm triều Nguyễn là đỉnh cao của điển chế mũ mão cung đình: Đính **4 con rồng vàng (lưỡng long chầu hoa cúc)**, 4 con phượng hoàng bằng vàng ròng, điểm xuyết các hạt ngọc trai thiên nhiên và đá quý màu đỏ thắm.',
    craftingAnswer:
      'Thân mũ được đan kết vô cùng tỉ mỉ bằng **lông đuôi ngựa màu đen tạo thành mạng lưới thoáng khí mà bền chắc**. Các hoa văn rồng mây bằng vàng ròng dát mỏng như cánh ve được gắn kết tinh vi bằng dây chỉ vàng.',
    legendStoryAnswer:
      'Mũ thuộc về một vị đại thần Văn ban Nhất phẩm triều Nguyễn, chỉ được đội trong các dịp lễ tiết trọng đại như Lễ Tế Nam Giao, Lễ Đăng quang của Hoàng đế hay đại triều tại điện Thái Hòa.',
    historyEraAnswer:
      'Niên đại thuộc **thế kỷ XIX - đầu thế kỷ XX (Triều Nguyễn)**. Mũ được bảo tồn nguyên vẹn gần như 100%, là hiện vật cung đình cực kỳ hiếm hoi còn lại.',
    dimensionWeightAnswer:
      'Chiều cao: **25 cm, Hai cánh chuồn xòe rộng: 38 cm**, kết cấu nhẹ nhàng nhưng lộng lẫy uy nghiêm.',
    significanceAnswer:
      'Bảo vật Quốc gia độc bản về phục trang triều đình, là cứ liệu lịch sử vô giá để phục dựng chính xác lễ phục cung đình Việt Nam.',
    visual3dAnswer:
      'Hãy xoay góc nhìn từ trên cao xuống để ngắm 4 rồng vàng ngậm ngọc và hai cánh chuồn đan chỉ vàng bay bổng.',
    comparativeAnswer:
      'Đây là chiếc mũ quan văn nhất phẩm duy nhất của triều Nguyễn còn nguyên vẹn cả các đồ kim hoàn đính kèm tại bảo tàng Việt Nam.',
  },
  A06: {
    motifAnswer:
      'Kiếm Thuận Thiên gắn với điển tích thần kỳ: Lưỡi kiếm rèn từ thép gấp lượn sóng sáng bóng, chuôi kiếm bọc vàng ròng chạm hình **rồng cuộn ôm ngọc quý**, bao kiếm nạm ngọc bích biểu thị cho thanh bảo kiếm trao sứ mệnh "Thuận theo Ý Trời" dẹp tan giặc Minh.',
    craftingAnswer:
      'Kỹ thuật **rèn thép gấp nhiều lớp (damascus Đại Việt)** kết hợp tôi luyện bí truyền tạo độ cứng tuyệt đối ở lưỡi sắc nhưng dẻo dai ở sống kiếm, có rãnh huyết kép dọc thân giúp giảm trọng lượng và thoát khí khi đâm chém.',
    legendStoryAnswer:
      'Gắn với huyền tích Vua Lê Lợi khởi nghĩa Lam Sơn. Sau 10 năm gian khổ đánh tan 15 vạn quân Minh giành lại độc lập, khi dạo thuyền rồng trên hồ Tả Vọng, Rùa Vàng nổi lên ngậm thanh kiếm lặn xuống đáy hồ – từ đó hồ đổi tên thành **Hồ Hoàn Kiếm**.',
    historyEraAnswer:
      'Gắn với **Khởi nghĩa Lam Sơn và triều Lê sơ (Thế kỷ XV - năm 1428)**, thời đại phục hưng hào hùng của Đại Việt.',
    dimensionWeightAnswer:
      'Chiều dài toàn thân kiếm: **98 cm, Lưỡi kiếm dài: 76 cm, Trọng lượng: 1.45 kg**.',
    significanceAnswer:
      'Biểu tượng thiêng liêng cho khát vọng hòa bình của dân tộc: Rút gươm bảo vệ non sông, thái bình trả gươm xây dựng đất nước.',
    visual3dAnswer:
      'Hãy phóng to chuôi kiếm bọc vàng nạm ngọc và lưỡi thép rực ánh kim loại sắc lạnh.',
    comparativeAnswer:
      'Khác với đoản đao thông thường, gươm Thuận Thiên mang dáng dấp của bảo kiếm chỉ huy tối cao, dung hòa giữa mỹ thuật vương giả và uy lực quân sự.',
  },
  A07: {
    motifAnswer:
      'Quai chuông Đại Hồng Chung chùa Thiên Mụ tạo hình **con Bồ Lao** (thần thú biển thích tiếng gầm rống) hai đầu uốn cong chịu lực. Thân chuông đúc nổi bài minh văn bằng chữ Hán gồm **1.640 chữ** do chính Chúa Nguyễn Phúc Chu ngự bút ca ngợi cảnh sắc xứ Huế và giáo lý nhà Phật.',
    craftingAnswer:
      'Kỹ thuật đúc chuông liền khối bằng **đồng đỏ pha vàng quỳ và thiếc nguyên chất**. Để nấu chảy hơn 2 tấn đồng rót đầy khuôn đất trong một lần đòi hỏi sự phối hợp nhịp nhàng của hàng trăm thợ đúc đồng phường Đúc xứ Huế năm 1710.',
    legendStoryAnswer:
      'Chúa Nguyễn Phúc Chu đúc chuông để cầu nguyện cho giang sơn xứ Đàng Trong mưa thuận gió hòa, muôn dân no ấm. Tiếng chuông Thiên Mụ trầm hùng ngân vang giữa mây nước sông Hương, trở thành linh hồn âm thanh của xứ Huế suốt hơn 300 năm.',
    historyEraAnswer:
      'Đúc vào **năm Canh Dần 1710 (Thời Chúa Nguyễn ở Đàng Trong)**, thời kỳ mở mang bờ cõi phương Nam.',
    dimensionWeightAnswer:
      'Chiều cao: **2.5 mét, Đường kính miệng: 1.4 mét, Trọng lượng: 2.052 kg (hơn 2 tấn đồng)**.',
    significanceAnswer:
      'Bảo vật Quốc gia về nghệ thuật đúc đồng đại bác và chuông chùa khổng lồ, là di sản âm thanh biểu tượng của Cố đô Huế.',
    visual3dAnswer:
      'Hãy xoay quanh thân chuông để đọc các ô chữ khắc bài minh văn và quan sát 4 núm gõ chày kình tròn nhẵn.',
    comparativeAnswer:
      'Chuông Thiên Mụ là một trong những quả đại hồng chung cổ lớn nhất và có âm ngân xa nhất còn lưu giữ nguyên vẹn tại miền Trung.',
  },
  A08: {
    motifAnswer:
      'Ấn ngọc bích "Hoàng đế chi bảo" được tạc từ một khối **ngọc bích xanh ngọc lục bảo (Imperial Jadeite) tự nhiên nguyên khối**. Núm ấn tạc hình Rồng 5 móng ngẩng cao đầu uy nghiêm, mặt ấn khắc sâu 4 chữ Triện thư cổ: **"Hoàng Đế Chi Bảo"**.',
    craftingAnswer:
      'Nghệ nhân cung đình đã mài gọt khối ngọc bích có độ cứng cao suốt nhiều năm ròng bằng bột kim cương và cát thạch anh. Từng chiếc vảy rồng, móng vuốt và nét chữ Triện đều sắc nét, bóng bẩy như gương soi.',
    legendStoryAnswer:
      'Tạc năm 1823 dưới triều Vua Minh Mạng. Chiếc ấn ngọc này cùng ấn vàng tượng trưng cho Hoàng quyền tối cao. Đến tháng 8 năm 1945, Vua Bảo Đại đã chọn chính bộ ấn kiếm này để **bàn giao cho đại diện Chính phủ Cách mạng Lâm thời**, đánh dấu sự chấm dứt của chế độ phong kiến nghìn năm.',
    historyEraAnswer:
      'Niên đại: **Năm 1823 (Minh Mạng thứ 4)**, triều Nguyễn.',
    dimensionWeightAnswer:
      'Mặt ấn vuông: **13.8 cm x 13.8 cm, Cao: 9.9 cm, Khối lượng: 6.8 kg ngọc bích nguyên khối**.',
    significanceAnswer:
      'Bảo vật Quốc gia độc bản mang giá trị lịch sử chuyển giao thời đại đặc biệt của dân tộc Việt Nam trong Cách mạng Tháng Tám 1945.',
    visual3dAnswer:
      'Hãy xoay góc nhìn ngang để ngắm sắc xanh biếc huyền ảo của ngọc bích dưới ánh đèn rọi tủ kính.',
    comparativeAnswer:
      'Đây là bảo ấn ngọc bích lớn nhất và hoàn mỹ nhất trong toàn bộ sưu tập ngọc tỷ triều Nguyễn.',
  },
  A09: {
    motifAnswer:
      'Tượng vũ nữ Apsara thể hiện dáng múa **Tribhanga (uốn ba khúc)** quyến rũ kinh điển: Đầu nghiêng, ngực nở, eo thon thắt đáy lưng ong và hông nở uyển chuyển. Nụ cười Chăm Pa huyền bí phảng phất nét an lạc giải thoát trên đôi môi thanh tú.',
    craftingAnswer:
      'Tạc trực tiếp trên chất liệu **sa thạch hồng (pink sandstone) Mỹ Sơn**. Nghệ nhân Chăm Pa cổ xưa đã biến chất đá sa thạch thô cứng thành những đường cong mềm mại tựa da thịt sống động.',
    legendStoryAnswer:
      'Apsara là tiên nữ múa hát trên thiên giới trong thần thoại Hindu, sinh ra từ cuộc khuấy biển sữa Amrita. Nàng nhảy múa dâng hiến cho các đấng thần linh Shiva, Brahma, xua tan u muội trần thế.',
    historyEraAnswer:
      'Niên đại thuộc **thế kỷ X (Phong cách nghệ thuật Trà Kiệu)** – giai đoạn hoàng kim của nghệ thuật điêu khắc vương quốc Chăm Pa cổ.',
    dimensionWeightAnswer:
      'Chiều cao: **86 cm, Rộng: 45 cm, Chất liệu sa thạch hồng nặng khoảng 65 kg**.',
    significanceAnswer:
      'Bảo vật Quốc gia tiêu biểu cho giao lưu văn hóa Ấn Độ - Đông Nam Á và đỉnh cao nghệ thuật tạc tượng đá Chăm Pa.',
    visual3dAnswer:
      'Hãy ngắm đường cong eo thon và vòng trang sức hạt chuỗi tinh xảo quanh cổ nàng tiên Apsara.',
    comparativeAnswer:
      'Khác với phong cách Angkor Khmer khỏe khoắn, vũ nữ Apsara Trà Kiệu Việt Nam mang vẻ đẹp thanh thoát, duyên dáng và tràn đầy sức sống nữ tính.',
  },
  A10: {
    motifAnswer:
      'Tượng rồng thời Lý trên mái ngói điện Kính Thiên: Thân rồng uốn lượn nhịp nhàng **hình sóng nước mềm mại hình sin thắt túi**, không vảy sừng dữ tợn mà hiền hòa, thanh thoát, ngậm ngọc báu – biểu tượng cho vương quyền gắn liền với nhân nghĩa và Phật giáo thời Lý.',
    craftingAnswer:
      'Chế tác từ **đất nung tráng men ngọc bích (celadon glaze)**, nung ở nhiệt độ cao để men chảy đều bao bọc lấy cốt gốm mịn màng. Kỹ thuật đắp nổi hoa văn tinh vi chịu đựng mưa nắng ngàn năm trên mái cung điện.',
    legendStoryAnswer:
      'Gắn với sự kiện lịch sử năm 1010 khi Vua Lý Thái Tổ dời đô từ Hoa Lư về Đại La, nhìn thấy rồng vàng bay lên nên đặt tên kinh đô là **Thăng Long** (Rồng bay lên). Bức tượng ngói ngự trên nóc điện Kính Thiên che chở cho hoàng thành trường tồn.',
    historyEraAnswer:
      'Niên đại thuộc **thế kỷ XI - XII (Thời Lý)**, tìm thấy trong các hố khai quật tại Hoàng thành Thăng Long (Hà Nội).',
    dimensionWeightAnswer:
      'Chiều cao: **78 cm, Dài: 95 cm, Khối lượng đất nung khoảng 38 kg**.',
    significanceAnswer:
      'Bảo vật Quốc gia biểu tượng cho hào khí Thăng Long nghìn năm văn hiến và bản sắc kiến trúc cung điện Đại Việt.',
    visual3dAnswer:
      'Hãy quan sát lớp men ngọc bích bóng loáng và những đường lượn sóng nhịp nhàng của thân rồng.',
    comparativeAnswer:
      'Rồng thời Lý là tạo hình rồng độc đáo nhất trong lịch sử mỹ thuật châu Á: Thân tròn trơn mềm mại như dải lụa bay, hoàn toàn khác biệt với rồng hung dữ thời Minh - Thanh.',
  },
}

// BỘ TỔNG HỢP CÂU TRẢ LỜI TỰ NHIÊN, KHÔNG RẬP KHUÔN CHO THUYẾT MINH VIÊN AI
function generateSmartDocentAnswer(artifact: Artifact3D, question: string): string {
  const q = question.toLowerCase().trim()
  const kb = ARTIFACT_KNOWLEDGE_MAP[artifact.id] || ARTIFACT_KNOWLEDGE_MAP['A01']

  // 1. Chào hỏi hoặc câu hỏi xã giao
  if (/^(xin\s+)?chào\b/i.test(q) || /^(hello|hi|hey)\b/i.test(q) || q === 'bạn là ai' || q === 'giới thiệu bản thân') {
    return `Kính chào quý khách! Tôi là **Tiến sĩ Di sản - Thuyết minh viên AI** của Bảo tàng Lịch sử Thông minh. Tôi luôn túc trực tại gian trưng bày này để đồng hành cùng quý khách khám phá mọi bí ẩn lịch sử, kỹ thuật tạo tác và điển tích ngàn đời của bảo vật **"${artifact.name}"**. Quý khách quan tâm đến hoa văn, niên đại, câu chuyện lịch sử hay muốn tôi hướng dẫn chiêm ngưỡng góc 3D nào? Xin mời quý khách cứ thoải mái đặt câu hỏi!`
  }

  // 2. Hỏi về hoa văn, biểu tượng, hình vẽ, con vật trên hiện vật
  if (q.includes('hoa văn') || q.includes('biểu tượng') || q.includes('hình tượng') || q.includes('vẽ gì') || q.includes('con cóc') || q.includes('ngôi sao') || q.includes('chim lạc') || q.includes('mặt trời') || q.includes('rồng') || q.includes('phượng') || q.includes('thiên nga')) {
    return `Chào quý khách! Về hệ thống hoa văn và biểu tượng của **${artifact.name}**:

${kb.motifAnswer}

Các đồ án mỹ thuật này là kết tinh của nhân sinh quan và tư duy thẩm mỹ đỉnh cao của tiền nhân thời **${artifact.era}**.`
  }

  // 3. Hỏi về kỹ thuật đúc, làm từ gì, chất liệu, cách chế tác
  if (q.includes('kỹ thuật') || q.includes('đúc') || q.includes('chế tác') || q.includes('làm bằng') || q.includes('chất liệu') || q.includes('nung') || q.includes('rèn') || q.includes('mài')) {
    return `Về quy trình tạo tác và đỉnh cao kỹ thuật của hiện vật:

${kb.craftingAnswer}

Được làm từ **${artifact.material}**, bảo vật đến nay vẫn giữ được **${artifact.preservationStatus}** – một minh chứng sống động cho bàn tay tài hoa của các bậc tiền nhân.`
  }

  // 4. Hỏi về truyền thuyết, câu chuyện, sự tích, tại sao có tên gọi đó
  if (q.includes('truyền thuyết') || q.includes('sự tích') || q.includes('câu chuyện') || q.includes('lịch sử') || q.includes('điển tích') || q.includes('lê lợi') || q.includes('nguyễn phúc chu') || q.includes('minh mạng') || q.includes('bảo đại') || q.includes('tại sao')) {
    return `Đây là một điển tích vô cùng hấp dẫn gắn liền với **${artifact.name}**:

${kb.legendStoryAnswer}

Chính câu chuyện lịch sử sâu sắc này đã biến hiện vật thành một **chứng nhân lịch sử vô giá**, vượt qua giá trị của một cổ vật thông thường.`
  }

  // 5. Hỏi về niên đại, thời nào, bao nhiêu tuổi, năm nào, tìm thấy ở đâu
  if (q.includes('niên đại') || q.includes('năm nào') || q.includes('thời nào') || q.includes('bao nhiêu tuổi') || q.includes('khai quật') || q.includes('tìm thấy') || q.includes('ở đâu')) {
    return `Về lai lịch khảo cổ và niên đại của bảo vật:

${kb.historyEraAnswer}

* **Niên đại ước tính:** ${artifact.yearApprox}
* **Thời kỳ văn hóa:** ${artifact.era}
* **Địa điểm phát hiện / nguồn gốc:** ${artifact.excavationOrigin}`
  }

  // 6. Hỏi về kích thước, cân nặng, to bao nhiêu, nặng bao nhiêu
  if (q.includes('nặng') || q.includes('kích thước') || q.includes('cao bao nhiêu') || q.includes('to bao nhiêu') || q.includes('trọng lượng') || q.includes('khối lượng') || q.includes('dài')) {
    return `Thông số khảo cổ học chính xác của **${artifact.name}**:

${kb.dimensionWeightAnswer}

* **Tình trạng hiện tại:** ${artifact.preservationStatus}
* **Phân hạng di sản:** Thuộc danh mục **${artifact.nationalTreasureRank}**.`
  }

  // 7. Hỏi về ý nghĩa, giá trị, tại sao là bảo vật quốc gia
  if (q.includes('ý nghĩa') || q.includes('giá trị') || q.includes('tại sao là bảo vật') || q.includes('quan trọng')) {
    return `Ý nghĩa trường tồn của **${artifact.name}** trong dòng chảy văn hóa dân tộc:

${kb.significanceAnswer}

> "${artifact.significance}"`
  }

  // 8. Hỏi về góc nhìn 3D, chi tiết thú vị trên mô hình 3D
  if (q.includes('3d') || q.includes('xem') || q.includes('nhìn') || q.includes('quan sát') || q.includes('góc nhìn') || q.includes('chi tiết')) {
    return `Gợi ý đắt giá để quý khách tự mình chiêm ngưỡng trên mô hình 3D tương tác bên trên:

${kb.visual3dAnswer}

💡 **Mẹo:** Quý khách có thể kéo rê chuột để xoay 360°, lăn con trỏ để zoom cận cảnh từng đường nét hoặc bật nút **"Tự động xoay"** để ngắm toàn cảnh!`
  }

  // 9. So sánh hoặc hỏi điểm đặc biệt nhất
  if (q.includes('so sánh') || q.includes('khác gì') || q.includes('đặc biệt nhất') || q.includes('độc bản')) {
    return `Điểm độc bản làm nên danh tiếng của **${artifact.name}**:

${kb.comparativeAnswer}

Đây chính là lý do vì sao Hội đồng Di sản Quốc gia đã xếp hiện vật này vào hàng **${artifact.nationalTreasureRank}**.`
  }

  // 10. Trả lời câu hỏi tổng hợp mở
  return `Cảm ơn quý khách đã quan tâm đến câu hỏi: *"${question}"*.

Về cổ vật **${artifact.name}** (${artifact.era}):
${artifact.shortDescription}

${artifact.fullStory}

* **Gợi ý của Tiến sĩ Di sản:** Quý khách có thể hỏi sâu hơn về **hoa văn bí ẩn**, **kỹ thuật đúc/chế tác**, hoặc các **điển tích lịch sử** gắn liền với bảo vật này!`
}

export async function POST(req: NextRequest) {
  try {
    const body: DocentRequestBody = await req.json()
    const { artifactId, userQuestion } = body

    if (!userQuestion || !userQuestion.trim()) {
      return NextResponse.json(
        { error: 'Câu hỏi không được để trống.' },
        { status: 400 }
      )
    }

    const targetArtifact = MUSEUM_ARTIFACTS.find(
      (a) => a.id.toUpperCase() === (artifactId || '').toUpperCase() || a.code.toUpperCase() === (artifactId || '').toUpperCase()
    ) || MUSEUM_ARTIFACTS[0]

    // 1. Kiểm tra nếu có API Key ngoài (Gemini hoặc OpenAI)
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (geminiKey) {
      try {
        const kb = ARTIFACT_KNOWLEDGE_MAP[targetArtifact.id] || ARTIFACT_KNOWLEDGE_MAP['A01']
        const promptText = `Bạn là Tiến sĩ Di sản - Thuyết minh viên trưởng của Bảo tàng Lịch sử Thông minh. Hãy trả lời câu hỏi của khách tham quan một cách TỰ NHIÊN, GIÀU TRI THỨC, TRỰC TIẾP và CUỐN HÚT (tuyệt đối KHÔNG trả lời theo khuôn mẫu số thứ tự 1-2-3-4 cứng nhắc). Trả lời bằng tiếng Việt lịch sự, thân thiện và học thuật.
Thông tin cổ vật đang xem:
Tên: ${targetArtifact.name} (${targetArtifact.code})
Thời kỳ: ${targetArtifact.era} (${targetArtifact.yearApprox})
Chất liệu: ${targetArtifact.material}
Kích thước: ${targetArtifact.dimensions}
Ý nghĩa: ${targetArtifact.significance}
Kỹ thuật: ${targetArtifact.craftingTechnique}
Câu chuyện: ${targetArtifact.fullStory}
Kiến thức hoa văn & lịch sử sâu: ${kb.motifAnswer} | ${kb.legendStoryAnswer}
Câu hỏi của du khách: "${userQuestion}"`

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
            }),
          }
        )

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json()
          const answerText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
          if (answerText) {
            return NextResponse.json({
              answer: answerText,
              artifactId: targetArtifact.id,
              artifactName: targetArtifact.name,
              docentName: 'Tiến sĩ Di sản - Thuyết minh viên trưởng',
              timestamp: new Date().toISOString(),
              suggestedNextQuestions: targetArtifact.suggestedQuestions,
            })
          }
        }
      } catch (gemErr) {
        console.warn('Gemini API call failed, falling back to smart engine:', gemErr)
      }
    }

    if (openaiKey) {
      try {
        const promptText = `Bạn là Tiến sĩ Di sản - Thuyết minh viên trưởng của Bảo tàng Lịch sử Thông minh. Hãy trả lời câu hỏi của khách tham quan một cách TỰ NHIÊN, GIÀU TRI THỨC, TRỰC TIẾP và CUỐN HÚT (tuyệt đối KHÔNG trả lời theo khuôn mẫu số thứ tự 1-2-3-4 cứng nhắc). Trả lời bằng tiếng Việt lịch sự, thân thiện và học thuật.
Cổ vật: ${targetArtifact.name} (${targetArtifact.era})
Câu chuyện: ${targetArtifact.fullStory}
Kỹ thuật: ${targetArtifact.craftingTechnique}
Ý nghĩa: ${targetArtifact.significance}
Câu hỏi: "${userQuestion}"`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptText }],
            temperature: 0.7,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const answerText = data.choices?.[0]?.message?.content
          if (answerText) {
            return NextResponse.json({
              answer: answerText,
              artifactId: targetArtifact.id,
              artifactName: targetArtifact.name,
              docentName: 'Tiến sĩ Di sản - Thuyết minh viên trưởng',
              timestamp: new Date().toISOString(),
              suggestedNextQuestions: targetArtifact.suggestedQuestions,
            })
          }
        }
      } catch (externalErr) {
        console.warn('OpenAI fallback to smart engine:', externalErr)
      }
    }

    // 2. Engine thuyết minh viên AI tự nhiên, linh hoạt và đa dạng câu trả lời
    const answer = generateSmartDocentAnswer(targetArtifact, userQuestion)

    return NextResponse.json({
      answer,
      artifactId: targetArtifact.id,
      artifactName: targetArtifact.name,
      docentName: 'Tiến sĩ Di sản - Thuyết minh viên trưởng',
      timestamp: new Date().toISOString(),
      suggestedNextQuestions: targetArtifact.suggestedQuestions,
    })
  } catch (error: any) {
    console.error('Docent API Error:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra sự cố khi kết nối với Thuyết minh viên AI.', details: error.message },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { MUSEUM_ARTIFACTS, Artifact3D } from '@/data/museumData'

interface DocentRequestBody {
  artifactId: string
  userQuestion: string
  chatHistory?: Array<{ sender: 'user' | 'assistant'; content: string }>
}

// BỘ TỪ ĐIỂN CHUẨN HÓA KHÔNG DẤU ĐỂ TÌM KIẾM TỪ KHÓA CHUẨN XÁC
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim()
}

// HÀM KIỂM TRA TỪ KHÓA AN TOÀN
function checkKeywords(normText: string, keywords: string[]): boolean {
  return keywords.some((kw) => {
    const normKw = normalizeText(kw)
    if (normKw.includes(' ')) {
      return normText.includes(normKw)
    }
    const regex = new RegExp(`\\b${normKw}\\b`, 'i')
    return regex.test(normText)
  })
}

// NHẬN DIỆN HIỆN VẬT ĐƯỢC NHẮC TỚI TRONG CÂU HỎI (AUTO SWITCH ARTIFACT)
function detectMentionedArtifact(question: string): Artifact3D | null {
  const qNorm = normalizeText(question)

  const patterns: Array<{ id: string; keywords: string[] }> = [
    { id: 'A01', keywords: ['trong dong', 'dong son', 'ngoc lu', 'ngoi sao 14 canh', 'chim lac', 'con coc tren trong'] },
    { id: 'A02', keywords: ['an vang', 'sac menh chi bao', 'kim bao', 'vua minh mang', 'an sac menh'] },
    { id: 'A03', keywords: ['quan am', 'nghin mat nghin tay', 'chua but thap', 'truong tien thao', 'bo tat'] },
    { id: 'A04', keywords: ['chu dau', 'binh gom', 'hoa lam', 'thien nga', 'cu lao cham', 'gom chu dau'] },
    { id: 'A05', keywords: ['mu quan', 'nhat pham', 'mu quan nhat pham', 'canh chuon', 'long duoi ngua'] },
    { id: 'A06', keywords: ['kiem thuan thien', 'thuan thien', 'le loi', 'ho guom', 'hoan kiem', 'rua vang tra kiem'] },
    { id: 'A07', keywords: ['chuong thien mu', 'dai hong chung', 'nguyen phuc chu', 'chuong chua thien mu', 'bo lao'] },
    { id: 'A08', keywords: ['an ngoc', 'hoang de chi bao', 'ngoc bich', 'bao dai', 'thoai vi 1945', 'ngoc ty'] },
    { id: 'A09', keywords: ['apsara', 'vu nu', 'cham pa', 'champa', 'tra kieu', 'sa thach hong', 'tribhanga'] },
    { id: 'A10', keywords: ['dau rong', 'rong thoi ly', 'dien kinh thien', 'thang long', 'dat nung', 'rong ly'] },
  ]

  for (const p of patterns) {
    if (checkKeywords(qNorm, p.keywords)) {
      return MUSEUM_ARTIFACTS.find((a) => a.id === p.id) || null
    }
  }

  return null
}

// TRẢ LỜI CÁC CÂU HỎI TOÀN BẢO TÀNG HOẶC SO SÁNH GIỮA CÁC BẢO VẬT
function handleMuseumWideQuestions(qNorm: string): string | null {
  // 1. Hỏi về số lượng bảo vật trong bảo tàng
  if (checkKeywords(qNorm, ['bao nhieu mon', 'bao nhieu do co', 'bao nhieu hien vat', 'co may mon', 'danh sach bao vat'])) {
    return `Hiện tại gian trưng bày 3D tương tác của bảo tàng sở hữu **10 Bảo vật Quốc gia đỉnh cao**, đại diện cho các thời kỳ vàng son trong lịch sử dựng nước và giữ nước:
1. 🪘 **Trống đồng Đông Sơn** (A01 - 2.500 năm tuổi)
2. 👑 **Ấn vàng "Sắc mệnh chi bảo"** (A02 - Triều Nguyễn 1827)
3. 🪷 **Tượng Phật Quan Âm nghìn mắt nghìn tay** (A03 - Thế kỷ 17)
4. 🏺 **Bình gốm hoa lam Chu Đậu** (A04 - Thế kỷ 15)
5. 🎩 **Mũ quan nhất phẩm triều Nguyễn** (A05 - Thế kỷ 19)
6. ⚔️ **Kiếm Thuận Thiên** (A06 - Vua Lê Lợi thế kỷ 15)
7. 🔔 **Đại Hồng Chung chùa Thiên Mụ** (A07 - Nặng hơn 2 tấn)
8. 🟩 **Ấn ngọc "Hoàng đế chi bảo"** (A08 - Ngọc bích nguyên khối)
9. 💃 **Tượng vũ nữ Apsara Champa** (A09 - Sa thạch hồng thế kỷ 10)
10. 🐉 **Đầu rồng thời Lý đất nung** (A10 - Hoàng thành Thăng Long)

💡 *Quý khách muốn tìm hiểu sâu về bảo vật nào trước? Hãy chọn trên thanh trượt bên dưới hoặc hỏi trực tiếp tôi nhé!*`
  }

  // 2. Hiện vật nào nặng nhất?
  if (checkKeywords(qNorm, ['nang nhat', 'khoi luong lon nhat', 'to nhat'])) {
    return `Hiện vật nặng nhất trong bộ sưu tập là **Đại Hồng Chung chùa Thiên Mụ (A07)** với khối lượng lên tới **2.052 kg (hơn 2 tấn đồng đỏ nguyên chất)**!
Được đúc vào năm 1710 dưới thời Chúa Nguyễn Phúc Chu, đây là kiệt tác đúc đồng đồ sộ bậc nhất miền Trung.

💡 *Hiện vật nặng thứ hai là Trống đồng Đông Sơn (86 kg), tiếp đến là Tượng vũ nữ Apsara (65 kg).*`
  }

  // 3. Hiện vật nào lâu đời nhất / cổ nhất?
  if (checkKeywords(qNorm, ['lau doi nhat', 'co nhat', 'gia nhat', 'nhieu tuoi nhat', 'thoi hung vuong'])) {
    return `Hiện vật có niên đại cổ xưa nhất là **Trống đồng Đông Sơn (A01)**, ra đời cách ngày nay khoảng **2.500 năm (khoảng thế kỷ V đến III TCN)** thời các Vua Hùng dựng nước Văn Lang.
Đây là minh chứng đỉnh cao cho nền văn minh lúa nước và nghệ thuật luyện kim đồ đồng rực rỡ của tổ tiên Lạc Việt.`
  }

  // 4. Có những hiện vật nào làm bằng vàng?
  if (checkKeywords(qNorm, ['bang vang', 'chat lieu vang', 'co vang khong', 'do vang'])) {
    return `Trong bộ sưu tập có 3 bảo vật liên quan đến vàng ròng quý giá:
1. 👑 **Ấn vàng "Sắc mệnh chi bảo" (A02):** Đúc bằng **8.38 kg vàng ròng 10 tuổi nguyên khối** triều Vua Minh Mạng năm 1827.
2. 🎩 **Mũ quan nhất phẩm triều Nguyễn (A05):** Đính **4 con rồng và 4 chim phượng bằng vàng ròng dát mỏng**, cùng các dải chỉ vàng và ngọc trai.
3. ⚔️ **Kiếm Thuận Thiên (A06):** Toàn bộ chuôi gươm được **bọc vàng ròng chạm hình rồng cuộn ôm ngọc** sang trọng.`
  }

  // 5. Hiện vật nào làm bằng ngọc?
  if (checkKeywords(qNorm, ['bang ngoc', 'chat lieu ngoc', 'ngoc bich'])) {
    return `Hiện vật bằng ngọc quý hiếm nhất là **Ấn ngọc "Hoàng đế chi bảo" (A08)**, được điêu khắc từ một khối **ngọc bích Imperial Jadeite tự nhiên nguyên khối nặng 6.8 kg**, màu xanh lục bảo trong vắt tuyệt mỹ dưới triều Vua Minh Mạng (1823).`
  }

  // 6. Hiện vật nào trục vớt từ dưới biển?
  if (checkKeywords(qNorm, ['duoi bien', 'truc vot', 'tau dam', 'bien cu lao cham'])) {
    return `Hiện vật kỳ diệu được trục vớt từ đáy biển là **Bình gốm hoa lam Chu Đậu (A04)**. Chiếc bình nằm trong xác con tàu buôn cổ bị đắm từ thế kỷ 15 tại vùng biển Cù Lao Chàm (Hội An). Dù ngâm dưới đáy biển sâu suốt hơn 500 năm, lớp men lam tro trấu vẫn bóng mịn hoàn hảo!`
  }

  // 7. Hiện vật nào thuộc văn hóa Champa?
  if (checkKeywords(qNorm, ['champa', 'cham pa', 'my son', 'tra kieu'])) {
    return `Đó chính là **Tượng vũ nữ Apsara (A09)**, kiệt tác điêu khắc sa thạch hồng phong cách Trà Kiệu thế kỷ 10 của vương quốc Champa cổ, khắc họa vũ nữ thiên giới với điệu múa uốn ba khúc Tribhanga quyến rũ.`
  }

  return null
}

// =========================================================================
// BỘ TRI THỨC ĐA TẦNG CHO TỪNG BẢO VẬT (GRANULAR ARTIFACT KNOWLEDGE)
// =========================================================================

interface DetailedArtifactQA {
  // Trả lời cụ thể từng chi tiết hoa văn / tạo hình
  motifs: Record<string, string>
  // Trả lời cụ thể về kỹ thuật & chất liệu
  crafting: Record<string, string>
  // Trả lời về kích thước, cân nặng
  specs: string
  // Trả lời về địa điểm, niên đại phát hiện
  excavation: string
  // Trả lời về điển tích, nhân vật lịch sử, công dụng
  history: Record<string, string>
  // Trả lời so sánh & điểm độc bản
  uniqueness: string
  // Gợi ý góc nhìn 3D
  view3d: string
  // Tóm tắt mở rộng đa năng
  general: string
}

const GRANULAR_KNOWLEDGE: Record<string, DetailedArtifactQA> = {
  // 1. TRỐNG ĐỒNG ĐÔNG SƠN (A01)
  A01: {
    motifs: {
      con_coc:
        'Về **4 khối tượng cóc nổi** trên rìa mặt trống: Trong tâm thức cư dân nông nghiệp lúa nước Lạc Việt, con cóc là linh vật cầu mưa linh thiêng ("Con cóc là cậu ông Trời, hễ ai đánh nó thì Trời đánh cho"). Bốn chú cóc ngồi quay ngược chiều kim đồng hồ quanh mặt trống tượng trưng cho sự vận hành của 4 mùa và ước vọng mưa thuận gió hòa, mùa màng bội thu.',
      ngoi_sao:
        'Về **ngôi sao 14 cánh ở tâm mặt trống**: Đây là biểu tượng tối cao của **Thần Mặt Trời** – nguồn cội ánh sáng và sự sống trong nền văn minh nông nghiệp. 14 cánh sao tượng trưng cho chu kỳ thời gian và các tiết khí trong năm, xen giữa các cánh sao là hoa văn lông công và họa tiết tam giác cách điệu tuyệt mỹ.',
      chim_lac:
        'Về **đồ án chim Lạc**: Những cánh chim Lạc dang rộng sải cánh bay ngược chiều kim đồng hồ theo chu kỳ nhật thực và tuần hoàn mặt trời. Chim Lạc là vật tổ (totem) thiêng liêng của người Việt cổ, biểu tượng cho khát vọng chinh phục bầu trời và vươn tới sự trường tồn bất diệt.',
      thuyen_chien_gia_gao:
        'Về **cảnh thuyền chiến và giã gạo**: Tang trống khắc họa sống động đoàn thuyền chiến mũi cong chở các chiến binh cầm giáo mác, cung tên, cùng cảnh đôi nam nữ giã gạo chày đôi mừng mùa. Đây là bức tranh chân thực tái hiện đời sống sinh hoạt, lễ hội cầu mùa và tinh thần thượng võ bảo vệ lãnh thổ của người Lạc Việt.',
      tong_quat_hoa_van:
        'Hệ thống hoa văn Trống đồng Đông Sơn là đỉnh cao mỹ thuật đồ đồng thế giới: Tâm là ngôi sao 14 cánh Thần Mặt Trời, xung quanh là vành chim Lạc bay, cảnh giã gạo đón mùa, đoàn thuyền chiến vượt sóng và 4 tượng cóc phồn thực cầu mưa.',
    },
    crafting: {
      chat_lieu:
        'Trống được đúc từ **hợp kim đồng đỏ phối trộn thiếc và chì theo tỷ lệ luyện kim hoàn hảo**. Tỷ lệ này giúp kim loại nóng chảy dễ len lỏi vào từng kẽ khuôn tinh vi mà khi nguội lại đạt độ cứng cao và tiếng ngân vang trầm hùng.',
      khuon_duc:
        'Nghệ nhân Hùng Vương đã sử dụng kỹ thuật **khuôn đất nhiều mang (3 đến 4 mang) kết hợp lõi treo liền khối**. Nhờ kiểm soát độ nhớt dòng chảy cực tốt, vỏ trống chỉ dày từ vài milimet nhưng không hề có bọt khí hay rỗ nứt suốt hơn 2.500 năm qua.',
    },
    specs:
      'Trống đồng Đông Sơn có kích thước bề thế: **Đường kính mặt 79.3 cm, Chiều cao 63 cm, Vành chân xòe 82 cm**, tổng khối lượng đạt khoảng **86 kg đồng đỏ nguyên khối**.',
    excavation:
      'Trống được phát hiện tình cờ vào **năm 1924 bên bờ sông Mã tại làng Đông Sơn, tỉnh Thanh Hóa**. Phát hiện khảo cổ học này đã định danh cho cả một nền văn hóa rực rỡ: **Nền Văn hóa Đông Sơn** thời đại đồ sắt sớm.',
    history: {
      cong_dung:
        'Trống đồng Đông Sơn giữ vai trò đa năng thiêng liêng: Vừa là **nhạc khí tối cao trong các nghi lễ hiến tế mùa màng**, vừa là **khí cụ quân cơ phát lệnh xuất quân**, đồng thời là **biểu tượng vương quyền quyền uy của các Lạc hầu, Lạc tướng** thời Hùng Vương.',
      y_nghia:
        'Trống đồng Đông Sơn được công nhận là **Bảo vật Quốc gia Đợt 1 (năm 2012)**. Đây là biểu tượng thiêng liêng và tự hào nhất cho cội nguồn dựng nước Văn Lang của dân tộc Việt Nam.',
    },
    uniqueness:
      'Khác với các dòng trống loại Heger I khác ở Đông Nam Á, chiếc trống này còn nguyên vẹn đến 98% hoa văn, các đường chỉ khắc sắc sảo không hề bị xô lệch khuôn, đạt độ tinh xảo vô song.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy phóng to vào **tâm mặt trống** để soi rõ ngôi sao 14 cánh; sau đó xoay góc nghiêng để chiêm ngưỡng 4 con cóc đúc nổi 3D và 4 quai kép bện bím thừng ở thân trống!',
    general:
      'Trống đồng Đông Sơn (niên đại khoảng 2.500 năm) là báu vật đỉnh cao của thời đại Hùng Vương dựng nước. Trống hội tụ trí tuệ luyện kim siêu việt và thế giới quan nông nghiệp phong phú của người Lạc Việt cổ.',
  },

  // 2. ẤN VÀNG SẮC MỆNH CHI BẢO (A02)
  A02: {
    motifs: {
      chu_khac:
        'Đáy ấn vàng được khắc nổi sắc sảo 4 chữ Triện thư cổ: **"Sắc Mệnh Chi Bảo"** (敕命之寶). Viền ấn dày dặn, các nét chữ khắc sâu và vuông vức, thể hiện sự trang nghiêm tuyệt đối của chiếu mệnh hoàng gia.',
      quai_rong:
        'Núm ấn là một tuyệt tác điêu khắc ngự xưởng: **Hình tượng Rồng cuộn đứng uy phong**, đầu ngẩng cao, hai sừng dài vươn ngược, mắt tròn lồi nhìn thẳng phía trước, sống lưng uốn lượn, đuôi xòe 9 dải như ngọn lửa thiêng, 4 chân tì vững chắc trên lưng ấn.',
      tai_sao_5_mong:
        'Tượng rồng trên ấn có **5 móng sắc nhọn**. Theo điển chế triều Nguyễn, rồng 5 móng là biểu tượng độc quyền tuyệt đối của **Hoàng đế (Thiên tử)**. Quan lại và hoàng thân quốc thích chỉ được dùng rồng 4 móng hoặc hình tượng Giao long, Kỳ lân.',
      tong_quat_hoa_van:
        'Ấn vàng gây ấn tượng với núm rồng 5 móng cuộn đứng dũng mãnh trên lưng ấn vuông, mặt dưới khắc nổi 4 chữ Triện "Sắc Mệnh Chi Bảo" uyển chuyển và chuẩn xác.',
    },
    crafting: {
      chat_lieu:
        'Ấn được đúc bằng **vàng ròng 10 tuổi nguyên khối** (kim trọng 223 lạng 6 đồng, tương đương **8.38 kg vàng nguyên chất**). Bề mặt vàng bóng loáng rực rỡ, không có vết nứt hay tạp chất.',
      khuon_duc:
        'Được chế tác bằng phương pháp **khuôn sáp chảy (lost-wax casting)** kết hợp chạm khắc thủ công tinh xảo bởi bàn tay của các nghệ nhân tài ba nhất thuộc Ngự xưởng Thượng Bảo triều Nguyễn.',
    },
    specs:
      'Ấn có mặt vuông kích thước: **14 cm x 14 cm, Chiều cao: 11 cm**, tổng khối lượng lên tới **8.38 kg vàng ròng nguyên khối**.',
    excavation:
      'Ấn được đúc vào **tháng 10 năm Đinh Hợi (1827)**, dưới triều Vua Minh Mạng (năm Minh Mạng thứ 8) tại kinh đô Huế, là báu vật truyền quốc lưu giữ trong kho nội phủ triều đình.',
    history: {
      cong_dung:
        'Trong điển chế nhà Nguyễn, "Sắc mệnh chi bảo" là bảo ấn tối quan trọng, chuyên dùng để **đóng lên các sắc phong ban tước cho quan lại, phong thần cho các đền miếu đình làng khắp cả nước, và ban bố các mệnh lệnh tối cao của Hoàng đế**.',
      y_nghia:
        'Ấn được xếp hạng **Bảo vật Quốc gia đặc biệt**, là minh chứng đỉnh cao cho quyền lực vương triều và trình độ kim hoàn hoàng gia triều Nguyễn thời kỳ thịnh trị nhất.',
    },
    uniqueness:
      'Trong số hơn 100 kim bảo ngọc tỷ của triều Nguyễn, đây là chiếc ấn vàng nặng nhất và có tần suất sử dụng thực tế cao nhất trên các văn bản sắc phong lịch sử còn lưu lại.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay mô hình nhìn từ trên xuống để chiêm ngưỡng đầu rồng ngẩng cao và 5 móng rồng bám chặt; sau đó lật đáy ấn lên để thấy rõ 4 chữ Triện khắc nổi!',
    general:
      'Ấn vàng "Sắc mệnh chi bảo" (1827) đúc từ 8.38 kg vàng ròng, là biểu tượng quyền lực tối cao của Hoàng đế Minh Mạng dùng để ban bố sắc phong và mệnh lệnh cai trị giang sơn.',
  },

  // 3. TƯỢNG PHẬT BÀ QUAN ÂM NGHÌN MẮT NGHÌN TAY (A03)
  A03: {
    motifs: {
      so_tay_mat:
        'Tượng có tổng cộng **42 cánh tay lớn** kết ấn và cầm các pháp bảo (bình cam lộ, hoa sen, tràng hạt...), cùng **952 cánh tay nhỏ** tỏa ra phía sau tạo thành vầng hào quang thái dương khổng lồ. Trong mỗi lòng bàn tay đều được chạm khắc **một con mắt tuệ nhãn**, tổng cộng lên tới **994 cánh tay mang mắt**!',
      y_nghia:
        'Triết lý tạo tác tượng gửi gắm thông điệp từ bi vô lượng của Bồ Tát: **"Nghìn mắt để nhìn thấu mọi nỗi khổ đau của chúng sinh trần thế, nghìn tay để kịp thời dang rộng cứu vớt muôn loài"**.',
      khuon_mat:
        'Khuôn mặt tượng mang vẻ đẹp thuần khiết Á Đông: Vầng trán cao rộng, đôi mắt khép hờ nhìn xuống cõi trần với nét cười an lạc trầm mặc, toát lên lòng bao dung và phúc hậu của người mẹ Việt Nam.',
      dai_sen_be_rong:
        'Tượng ngự tọa thiền trên một đài sen nở rộ, phía dưới là bệ đỡ tạo hình **con rồng nhô lên từ sóng nước biển khơi**, biểu hiện cho năng lực thuần hóa sức mạnh tự nhiên của Phật pháp.',
    },
    crafting: {
      chat_lieu:
        'Tượng được tạc hoàn toàn từ **gỗ mít nguyên khối kết hợp kỹ thuật sơn son thếp vàng truyền thống**. Gỗ mít mềm dẻo, bền bỉ, không mối mọt và có thớ mịn cho phép điêu khắc các chi tiết ngón tay mềm mại như nhung.',
      nghe_nhan:
        'Tác phẩm là kiệt tác của nghệ nhân bậc thầy **Trương Tiên Thảo**, được hoàn thành vào mùa thu năm Bính Thân (1656) dưới thời vua Lê Thần Tông.',
    },
    specs:
      'Tượng có chiều cao đồ sộ đạt **3.7 mét** (bao gồm đài sen và bệ rồng), vầng hào quang tay tỏa rộng hơn **2.1 mét**, nặng hàng trăm kilôgam gỗ mít sơn son.',
    excavation:
      'Tượng được tôn trí tại **chùa Bút Tháp (Ninh Phúc Tự), huyện Thuận Thành, tỉnh Bắc Ninh** từ năm 1656 đến nay.',
    history: {
      hoan_canh:
        'Tượng được tạo tác vào thời Lê Trung Hưng (1656) do Hoàng thái hậu Trịnh Thị Ngọc Trúc và chúa Trịnh Tráng phát tâm hưng công trùng tu chùa Bút Tháp.',
      y_nghia:
        'Tượng được công nhận là **Bảo vật Quốc gia**, được đánh giá là **pho tượng gỗ Quan Âm đẹp nhất trong lịch sử mỹ thuật Phật giáo Việt Nam**.',
    },
    uniqueness:
      'Khác với tượng phong cách Trung Hoa hay Tây Tạng thường nhiều đầu dữ tợn, tượng Quan Âm Bút Tháp chỉ có một đầu thanh tú, dáng ngồi vững chãi kết hợp vầng tay phụ tỏa tròn tạo nên sự hài hòa kỳ diệu giữa hình khối và tâm linh.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay vòng ra phía sau lưng tượng để chiêm ngưỡng kết cấu đan cài hình nan quạt của 952 bàn tay phụ tạo thành vầng mặt trời kỳ ảo!',
    general:
      'Tượng Quan Âm nghìn mắt nghìn tay chùa Bút Tháp (1656) là đỉnh cao nghệ thuật tạc tượng gỗ sơn thếp Đại Việt, biểu tượng cho lòng từ bi vô hạn và trí tuệ thấu suốt muôn loài.',
  },

  // 4. BÌNH GỐM HOA LAM CHU ĐẬU (A04)
  A04: {
    motifs: {
      hinh_ve_thien_nga:
        'Hoa văn chủ đạo trên thân bình là **đồ án vẽ đôi thiên nga sải cánh bay lượn giữa làn mây trắng**. Nét vẽ bằng bút lông nét thanh nét đậm phóng khoáng, biểu thị cho tình yêu đôi lứa chung thủy và khát vọng thanh cao.',
      hoa_cuc_canh_sen:
        'Xung quanh cổ bình và chân bình là các dải hoa cúc dây uốn lượn nhịp nhàng, cánh sen cách điệu và sóng nước viền quanh mang đậm hồn cốt thiên nhiên làng quê đồng bằng Bắc Bộ thời Lê sơ.',
      tong_quat:
        'Bình gốm nổi bật với sắc lam cô-ban trầm ấm vẽ dưới men, bố cục chia tầng lớp hài hòa từ miệng bình hình củ tỏi xuống đến chân đế thoai thoải.',
    },
    crafting: {
      chat_dat:
        'Bình được vuốt nặn từ **đất sét trắng trầm tích sông Thái Bình lọc kỹ**, phủ lớp men tro trấu tự nhiên độc bản của làng gốm Chu Đậu (Hải Dương).',
      nhiet_do_men:
        'Sử dụng kỹ thuật **vẽ màu lam dưới men (underglaze blue)** bằng oxit cô-ban, sau đó nung trong lò rơm ở nhiệt độ cao **1.250°C** tạo nên lớp men trong sâu, bóng mượt không rạn.',
    },
    specs:
      'Bình có kích thước chuẩn mực: **Chiều cao 54 cm, Đường kính bụng 42 cm, Đường kính miệng 12 cm**, dáng bình củ tỏi thanh thoát cân đối.',
    excavation:
      'Chiếc bình được các nhà khảo cổ học trục vớt từ **xác con tàu đắm cổ thế kỷ 15 tại vùng biển Cù Lao Chàm (Hội An, Quảng Nam)** vào giai đoạn 1997 - 2000.',
    history: {
      con_duong_to_lua:
        'Bảo vật là bằng chứng đanh thép chứng minh gốm Chu Đậu của Đại Việt từng là mặt hàng xuất khẩu chủ lực trên **Con đường Tơ lụa trên biển**, vươn tới tận Trung Đông, Thổ Nhĩ Kỳ và châu Âu từ thế kỷ 15.',
      y_nghia:
        'Được công nhận là **Bảo vật Quốc gia**, chiếc bình là niềm kiêu hãnh cho bàn tay tài hoa của người thợ gốm xứ Đông (Hải Dương) buổi đầu thời Lê.',
    },
    uniqueness:
      'Dù bị ngâm dưới đáy biển sâu suốt hơn 500 năm, men gốm và nét vẽ hoa lam vẫn giữ độ sáng bóng nguyên vẹn, không hề bị muối biển ăn mòn.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay tròn 360 độ quanh thân bình để ngắm nhìn toàn cảnh đôi thiên nga đang sải cánh bay lượn giữa các đám mây lam mềm mại!',
    general:
      'Bình gốm hoa lam Chu Đậu (thế kỷ 15) trục vớt từ tàu đắm Cù Lao Chàm là báu vật gốm sứ Đại Việt lừng danh, minh chứng cho thời kỳ hoàng kim xuất khẩu gốm sứ ra thế giới.',
  },

  // 5. MŨ QUAN NHẤT PHẨM TRIỀU NGUYỄN (A05)
  A05: {
    motifs: {
      rong_phuong_vang:
        'Trên thân mũ được đính kết tinh xảo: **4 con rồng vàng ròng (lưỡng long chầu cúc)**, **4 con phượng hoàng bằng vàng** dát mỏng như cánh ve, điểm xuyết hàng chục viên ngọc trai tự nhiên và đá quý đỏ thắm.',
      canh_chuon:
        'Hai cánh chuồn phía sau xòe ngang cân đối rộng 38cm, khung viền bọc kim loại cứng cáp và đan chỉ vàng óng ánh, thể hiện sự đĩnh đạc và nghiêm cẩn của quan văn.',
      tong_quat:
        'Mũ thiết kế theo dáng Phác Đầu (mũ cánh chuồn), kết hợp hài hòa giữa màu đen nhánh của mạng lưới lông đuôi ngựa và ánh hoàng kim lộng lẫy của rồng phượng vàng ròng.',
    },
    crafting: {
      long_duoi_ngua:
        'Thân mũ được đan kết thủ công bằng **lông đuôi ngựa đen tuyển chọn**. Sợi lông đuôi ngựa rất dai, nhẹ, thông thoáng mồ hôi và giữ phom dáng cứng cáp suốt hàng trăm năm mà không bị ẩm mốc hay biến dạng.',
      dinh_kim_hoan:
        'Các đồ kim hoàn đính trên mũ được nghệ nhân Ngự xưởng triều Nguyễn dát vàng mỏng, đục lỗ li ti rồi dùng dây chỉ vàng luồn buộc cố định vào thân mũ.',
    },
    specs:
      'Kích thước mũ: **Chiều cao 25 cm, Hai cánh chuồn xòe ngang 38 cm, Trọng lượng khoảng 650 gram** (cực kỳ nhẹ và êm ái khi đội lên đầu).',
    excavation:
      'Mũ có niên đại vào **thế kỷ XIX - đầu thế kỷ XX (Triều Nguyễn)** tại kinh đô Huế, được triều đình cấp phát cho đại thần Văn ban.',
    history: {
      ai_duoc_doi:
        'Mũ chỉ dành riêng cho các quan đại thần hàm **Văn ban Chánh Nhất phẩm** (như Cần Chánh điện Đại học sĩ, Văn Minh điện Đại học sĩ, Cơ mật viện Đại thần).',
      doi_khi_nao:
        'Mũ được đội trong các dịp lễ tiết quốc gia trọng đại nhất: **Lễ Tế Nam Giao, Lễ Đăng quang của Hoàng đế, Tiết Vạn Thọ (sinh nhật vua) và các buổi Đại triều tại điện Thái Hòa**.',
    },
    uniqueness:
      'Đây là chiếc mũ quan văn nhất phẩm duy nhất của triều đình phong kiến nhà Nguyễn còn nguyên vẹn 100% cả thân mũ lẫn hệ thống trang sức vàng ngọc đính kèm tại bảo tàng Việt Nam.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay góc nhìn từ trên cao xuống để ngắm nhìn 4 chú rồng vàng uốn khúc và lớp lưới đan lông đuôi ngựa tinh vi bên dưới!',
    general:
      'Mũ quan nhất phẩm triều Nguyễn đan bằng lông đuôi ngựa đính rồng phượng vàng ròng là bảo vật cung đình độc bản, đại diện cho đỉnh cao điển chế phục trang triều đình phong kiến Việt Nam.',
  },

  // 6. KIẾM THUẬN THIÊN (A06)
  A06: {
    motifs: {
      chuoi_kiem_rong:
        'Chuôi kiếm được bọc bằng **vàng ròng nguyên chất chạm trổ hình rồng cuộn ôm ngọc**, đốc kiếm gắn đá quý mang lại uy lực dũng mãnh cho người cầm gươm chỉ huy.',
      bao_kiem:
        'Vỏ bao kiếm làm bằng gỗ quý nạm ngọc bích viền đồng mạ vàng, chạm khắc hoa văn mây lượn sóng tượng trưng cho sự bao bọc của sông núi đất trời.',
      luoi_thep_hoa_van:
        'Lưỡi kiếm rèn bằng kỹ thuật thép gấp nhiều lớp tạo nên **vân sóng nước (damascus Đại Việt)** sáng quắc, dọc thân kiếm có rãnh thoát khí kép giúp tăng độ cứng và giảm trọng lượng khi vung chém.',
    },
    crafting: {
      ky_thuat_ren:
        'Được rèn từ loại thép sắt chọn lọc qua hàng nghìn lần gập búa và tôi luyện trong nước suối bí truyền. Lưỡi kiếm đạt độ cứng sắc bén tuyệt đối ở phần rìa nhưng lại giữ được sự dẻo dai ở phần sống kiếm.',
    },
    specs:
      'Chiều dài tổng thể: **98 cm, Chiều dài lưỡi kiếm: 76 cm, Bề rộng lưỡi: 3.8 cm, Khối lượng: 1.45 kg**.',
    excavation:
      'Gắn với cuộc **Khởi nghĩa Lam Sơn (1418 - 1427)** và triều đại Lê sơ (Thế kỷ XV) tại vùng đất Lam Sơn (Thanh Hóa) và Đông Kinh (Hà Nội).',
    history: {
      su_tich_ho_guom:
        'Theo truyền thuyết, sau 10 năm gian khổ đánh tan 15 vạn quân Minh giành lại độc lập, Vua Lê Lợi dạo thuyền trên hồ Tả Vọng. Rùa Vàng nổi lên ngậm thanh gươm thần lặn xuống đáy nước. Từ đó hồ mang tên **Hồ Hoàn Kiếm (Hồ Trả Gươm)**.',
      y_nghia_thuan_thien:
        'Tên gọi **"Thuận Thiên"** có nghĩa là **"Thuận theo Ý Trời"**. Thanh gươm thần biểu thị cho sứ mệnh chính nghĩa bảo vệ đất nước, dẹp tan ách đô hộ và đem lại cuộc sống thái bình.',
    },
    uniqueness:
      'Khác với đoản đao thông thường, gươm Thuận Thiên mang dáng dấp của bảo kiếm quân vương: Vừa là vũ khí chiến trận uy lực vừa là biểu tượng chuyển hóa từ chiến tranh sang hòa bình xây dựng đất nước.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy phóng to vào chuôi kiếm vàng rực hình rồng và xoay nghiêng lưỡi kiếm để thấy ánh thép damascus phản chiếu!',
    general:
      'Kiếm Thuận Thiên gắn liền với Vua Lê Lợi và huyền tích Hồ Hoàn Kiếm là biểu tượng bất diệt cho ý chí độc lập, tinh thần thượng võ và khát vọng hòa bình ngàn đời của dân tộc.',
  },

  // 7. ĐẠI HỒNG CHUNG CHÙA THIÊN MỤ (A07)
  A07: {
    motifs: {
      con_bo_lao:
        'Quai chuông được tạo tác hình **thần thú Bồ Lao hai đầu uốn cong**. Theo truyền thuyết, Bồ Lao là loài rồng biển rất thích tiếng gầm rống và sợ cá kình; khi bị cá kình đuổi thì gầm to như sấm. Vì thế cổ nhân đúc Bồ Lao làm quai chuông để tiếng chuông ngân vang xa nhất.',
      minh_van_chu_han:
        'Khắp 4 mặt thân chuông đúc nổi một bài **minh văn bằng chữ Hán gồm 1.640 chữ** do chính Chúa Nguyễn Phúc Chu ngự bút ca ngợi cảnh sắc sông Hương núi Ngự và triết lý phổ độ của đạo Phật.',
      num_go:
        'Thân chuông có 4 núm gõ hình tròn dẹt phẳng nhẵn, xung quanh viền họa tiết hoa sen nở và sóng nước cách điệu.',
    },
    crafting: {
      chat_lieu_dong:
        'Được đúc bằng hợp kim **đồng đỏ pha vàng quỳ và thiếc nguyên chất**. Để rót đầy khuôn chuông khổng lồ nặng hơn 2 tấn đồng nóng chảy trong một lần đòi hỏi sự phối hợp tuyệt đối của hàng trăm thợ phường Đúc xứ Huế.',
    },
    specs:
      'Chuông có kích thước khổng lồ: **Chiều cao 2.5 mét, Đường kính miệng chuông 1.4 mét, Khối lượng: 2.052 kg (hơn 2 tấn đồng)**.',
    excavation:
      'Chuông được đúc vào **năm Canh Dần (1710)** dưới thời Quốc Chúa Nguyễn Phúc Chu, treo tại tháp chuông chùa Thiên Mụ bên bờ sông Hương, thành phố Huế.',
    history: {
      y_nghia_am_thanh:
        'Tiếng chuông Thiên Mụ ngân vang giữa sương sớm sông Hương đã đi vào ca dao lịch sử ("Gió đưa cành trúc la đà / Tiếng chuông Thiên Mụ, canh gà Thọ Xương"), là linh hồn tâm linh của Cố đô Huế suốt hơn 3 thế kỷ.',
      nguoi_chi_dao:
        'Do chính Quốc Chúa Nguyễn Phúc Chu (vị chúa Nguyễn thứ 6 xứ Đàng Trong) chỉ đạo đúc để cầu cho quốc thái dân an, mưa thuận gió hòa.',
    },
    uniqueness:
      'Đây là quả đại hồng chung cổ thời các Chúa Nguyễn lớn nhất và có âm thanh ngân vang xa nhất còn nguyên vẹn tại Việt Nam.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay góc nhìn từ dưới lên để cảm nhận miệng chuông khổng lồ rộng 1.4m và quan sát quai rồng Bồ Lao hai đầu ở đỉnh chuông!',
    general:
      'Đại Hồng Chung chùa Thiên Mụ (1710) nặng hơn 2 tấn đồng do Chúa Nguyễn Phúc Chu đúc là kiệt tác nghệ thuật đúc đồng đại bác và là di sản âm thanh biểu tượng của xứ Huế mộng mơ.',
  },

  // 8. ẤN NGỌC HOÀNG ĐẾ CHI BẢO (A08)
  A08: {
    motifs: {
      num_rong_ngoc:
        'Núm ấn được chạm khắc hình **tượng Rồng 5 móng cuộn đứng uy nghi**, đầu rồng ngẩng cao ngậm ngọc, sừng dài vươn về sau, 4 chân 5 móng sắc nhọn tì vững vàng trên lưng khối ngọc vuông.',
      chu_trien_day_an:
        'Mặt dưới đáy ấn khắc sâu 4 chữ Triện thư cổ: **"Hoàng Đế Chi Bảo"** (皇帝之寶) với nét đục tròn trịa, dứt khoát và bóng láng không một vết gợn ráp.',
    },
    crafting: {
      chat_ngoc_bich:
        'Được tạc từ một khối **ngọc bích xanh ngọc lục bảo (Imperial Jadeite) tự nhiên nguyên khối quý hiếm**. Khối ngọc có độ trong sâu, màu xanh mướt mát bóng bẩy như nước hồ thu.',
      ky_thuat_tac:
        'Để gọt giũa khối ngọc có độ cứng rất cao thành hình rồng uốn lượn, nghệ nhân hoàng cung phải mài tỉ mỉ nhiều tháng ròng bằng bột kim cương và cát thạch anh.',
    },
    specs:
      'Mặt ấn vuông vức: **13.8 cm x 13.8 cm, Chiều cao: 9.9 cm, Khối lượng: 6.8 kg ngọc bích nguyên khối**.',
    excavation:
      'Ấn được tạc vào **năm Quý Mùi (1823)**, dưới triều Vua Minh Mạng (năm Minh Mạng thứ 4) tại kinh thành Huế.',
    history: {
      su_kien_thoai_vi_1945:
        'Chiều ngày **30 tháng 8 năm 1945**, tại lầu Ngọ Môn (Huế), Vua Bảo Đại đã long trọng trao ấn ngọc này cùng kiếm báu cho phái đoàn Chính phủ Cách mạng Lâm thời, tuyên bố thoái vị với câu nói nổi tiếng: **"Trẫm thà làm dân một nước độc lập hơn làm vua một nước nô lệ"**. Sự kiện này chính thức chấm dứt chế độ phong kiến nghìn năm.',
      y_nghia_lich_su:
        'Bảo ấn là chứng nhân lịch sử chuyển giao thời đại vĩ đại của dân tộc Việt Nam từ thời kỳ quân chủ sang kỷ nguyên độc lập tự do dân chủ.',
    },
    uniqueness:
      'Đây là bảo ấn bằng ngọc bích tự nhiên lớn nhất, tinh xảo nhất và mang ý nghĩa lịch sử sâu sắc nhất trong toàn bộ sưu tập ngọc tỷ triều Nguyễn.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay ngang thân ấn để thấy ánh sáng xuyên qua lớp ngọc bích xanh biếc và ngắm nhìn từng chiếc vảy rồng được chạm trổ!',
    general:
      'Ấn ngọc "Hoàng đế chi bảo" (1823) nặng 6.8 kg ngọc bích là báu vật truyền quốc triều Nguyễn, nhân chứng của sự kiện thoái vị lịch sử mở ra kỷ nguyên mới cho dân tộc năm 1945.',
  },

  // 9. TƯỢNG VŨ NỮ APSARA (A09)
  A09: {
    motifs: {
      dieu_mua_tribhanga:
        'Tượng thể hiện dáng múa kinh điển **Tribhanga (uốn ba khúc)** của vũ nữ thiên giới: Cổ nghiêng một bên, lồng ngực căng nở, eo thon thắt đáy lưng ong uốn lượn và hông nở lắc nhẹ tạo thành đường cong chữ S tuyệt mỹ.',
      nu_cuoi_cham:
        'Khuôn mặt tượng mang nụ cười Champa huyền bí: Đôi môi dày mọng mỉm cười nhẹ nhõm, mắt mở to thanh thoát toát lên vẻ an lạc giải thoát khỏi trần tục.',
      trang_suc:
        'Nàng tiên đeo vòng kiềng đính chuỗi hạt cườm quanh cổ, ngực trần gợi cảm, thắt lưng đeo dải yếm lụa mỏng manh buông rủ tôn vinh vẻ đẹp hình thể nữ tính.',
    },
    crafting: {
      chat_lieu_sa_thach:
        'Tạc trực tiếp trên một khối **sa thạch hồng (pink sandstone) vùng Trà Kiệu - Mỹ Sơn**. Sa thạch ban đầu thô cứng nhưng qua bàn tay đục đẽo tài hoa của nghệ nhân Champa cổ đã biến thành những đường cong mềm mại tựa da thịt sống.',
    },
    specs:
      'Kích thước tượng: **Chiều cao: 86 cm, Chiều rộng: 45 cm, Chiều dày: 28 cm, Khối lượng: khoảng 65 kg đá sa thạch hồng**.',
    excavation:
      'Tượng được khai quật tại **Kinh đô Trà Kiệu (Simhapura - Quảng Nam)**, có niên đại thuộc **thế kỷ X (Thời kỳ phong cách Trà Kiệu, Vương quốc Champa cổ)**.',
    history: {
      than_thoai:
        'Trong thần thoại Hindu, Apsara là những tiên nữ xinh đẹp sinh ra từ cuộc khuấy biển sữa Amrita giữa các vị thần và quỷ asura. Nàng chuyên múa hát dâng lên các vị thần tối cao Shiva và Brahma.',
      y_nghia:
        'Bảo vật Quốc gia minh chứng cho sự thăng hoa của nghệ thuật điêu khắc đá Champa cổ và sự giao lưu văn hóa Ấn Độ - Đông Nam Á.',
    },
    uniqueness:
      'Khác với vũ nữ Apsara Angkor Wat (Khmer) có nét mặt trầm mặc, vũ nữ Apsara Trà Kiệu của Champa tràn đầy sức sống thanh xuân, phóng khoáng và nồng nàn nữ tính.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay mô hình nghiêng góc 45 độ để chiêm ngưỡng trọn vẹn đường cong uốn ba khúc hình chữ S quyến rũ của nàng tiên Apsara!',
    general:
      'Tượng vũ nữ Apsara Champa (thế kỷ 10) tạc bằng sa thạch hồng Trà Kiệu là kiệt tác điêu khắc đá cổ, biểu tượng cho sắc đẹp thiên giới và điệu múa thiêng liêng.',
  },

  // 10. ĐẦU RỒNG THỜI LÝ ĐẤT NUNG (A10)
  A10: {
    motifs: {
      ngam_ngoc_chau:
        'Miệng rồng há rộng ngậm một **viên minh châu sáng ngời**, biểu tượng cho trí tuệ sáng suốt, đức hạnh thanh cao và sự bảo hộ của Phật pháp đối với vương triều.',
      bo_bom_rau_rong:
        'Bờm rồng dài uốn lượn nhịp nhàng bay ngược về phía sau như ngọn lửa thiêng, mũi dạng sống trâu uốn cong như cánh sen, râu rồng uốn khúc hình sin thanh thoát.',
      than_rong_thoi_ly:
        'Rồng thời Lý mang đặc trưng độc nhất vô nhị: Thân trơn mềm mại như dải lụa bay, **uốn khúc hình sin thắt túi**, hoàn toàn không có vảy sừng gai góc hay móng vuốt dữ tợn như rồng thời Minh - Thanh.',
    },
    crafting: {
      dat_nung_men_ngoc:
        'Chế tác từ **đất sét mịn phù sa sông Hồng nặn tay kết hợp dập khuôn gỗ**, tráng lớp men ngọc nhạt (celadon glaze) và nung trong lò nung rơm ở nhiệt độ cao hơn **1.100°C**.',
    },
    specs:
      'Kích thước hiện vật: **Chiều cao: 78 cm, Chiều dài: 95 cm, Bề ngang: 36 cm, Khối lượng: khoảng 38 kg đất nung**.',
    excavation:
      'Được khai quật từ các hố khảo cổ học tại **Khu di tích Hoàng thành Thăng Long (Hà Nội)**, có niên đại vào **thế kỷ XI - XII (Thời Nhà Lý)**.',
    history: {
      vi_tri_kinh_thien:
        'Đầu rồng này từng được gắn ngự trên **bờ mái nóc Điện Kính Thiên** - trung tâm quyền lực tối cao của Hoàng thành Thăng Long, mang sứ mệnh trấn trạch và xua đuổi tà khí che chở hoàng cung.',
      gan_voi_doi_do_1010:
        'Gắn liền với sự kiện lịch sử năm 1010 khi Vua Lý Thái Tổ dời đô từ Hoa Lư về Đại La, thấy rồng vàng bay lên nên đổi tên kinh đô thành **Thăng Long** (Rồng bay lên).',
    },
    uniqueness:
      'Tạo hình rồng thời Lý là đỉnh cao mỹ thuật Đại Việt: Thân rồng mềm mại, hiền hòa, đậm tinh thần từ bi và nhân nghĩa của triều đại lấy đạo Phật làm quốc giáo.',
    view3d:
      '💡 **Mẹo xem 3D:** Quý khách hãy xoay góc nghiêng phía trước để quan sát hàm rồng ngậm ngọc và bờm rồng bay ngược đầy khí thế Thăng Long nghìn năm!',
    general:
      'Đầu rồng thời Lý đất nung ngự trên mái điện Kính Thiên là biểu tượng hào hùng cho kinh đô Thăng Long phục hưng và bản sắc mỹ thuật Đại Việt thời Lý.',
  },
}

// BỘ TRẢ LỜI CÂU HỎI THÔNG MINH, KHÔNG BAO GIỜ TRẢ LỜI CÙNG MỘT CÂU
function generateSmartDocentAnswer(
  artifact: Artifact3D,
  question: string,
  chatHistory?: Array<{ sender: 'user' | 'assistant'; content: string }>
): string {
  const qNorm = normalizeText(question)

  // 1. Chào hỏi giao tiếp lịch sự
  if (/^(xin\s+)?chao\b/i.test(qNorm) || /^(hello|hi|hey)\b/i.test(qNorm) || qNorm === 'ban la ai' || qNorm === 'gioi thieu ban than') {
    return `Kính chào quý khách! Tôi là **Tiến sĩ Di sản - Thuyết minh viên AI** của Bảo tàng Lịch sử Thông minh. Tôi luôn túc trực tại gian trưng bày này để đồng hành cùng quý khách giải mã những bí mật ngàn đời của bảo vật **"${artifact.name}"** (${artifact.era}).

Quý khách quan tâm đến **hoa văn biểu tượng**, **kỹ thuật đúc/tạo tác**, **kích thước cân nặng** hay **điển tích lịch sử** nào? Xin mời quý khách cứ thoải mái đặt câu hỏi!`
  }

  // 2. Kiểm tra câu hỏi toàn bảo tàng / so sánh
  const museumWideAnswer = handleMuseumWideQuestions(qNorm)
  if (museumWideAnswer) {
    return museumWideAnswer
  }

  const kb = GRANULAR_KNOWLEDGE[artifact.id] || GRANULAR_KNOWLEDGE['A01']

  // 3. Phân nhánh câu hỏi về HOA VĂN / BIỂU TƯỢNG CỤ THỂ
  if (checkKeywords(qNorm, ['con coc', 'coc', 'cau mua', 'phon thuc'])) {
    if (kb.motifs.con_coc) return `${kb.motifs.con_coc}\n\n💡 *Quý khách có muốn tìm hiểu thêm về biểu tượng chim Lạc hay ngôi sao 14 cánh trên mặt trống không?*`
  }

  if (checkKeywords(qNorm, ['ngoi sao', 'mat troi', 'canh sao', '14 canh'])) {
    if (kb.motifs.ngoi_sao) return `${kb.motifs.ngoi_sao}\n\n💡 *Quý khách có thể phóng to tâm mô hình 3D để ngắm nhìn rõ nét ngôi sao 14 cánh này!*`
  }

  if (checkKeywords(qNorm, ['chim lac', 'chim', 'bay', 'totem'])) {
    if (kb.motifs.chim_lac) return `${kb.motifs.chim_lac}\n\n💡 *Chim Lạc dang cánh bay ngược chiều kim đồng hồ còn xuất hiện trên nhiều cổ vật Đông Sơn khác.*`
  }

  if (checkKeywords(qNorm, ['thuyen', 'gia gao', 'chien binh', 'san ban', 'cu dan'])) {
    if (kb.motifs.thuyen_chien_gia_gao) return `${kb.motifs.thuyen_chien_gia_gao}`
  }

  if (checkKeywords(qNorm, ['chu khac', 'chu gi', 'chu trien', 'day an', 'khac gi'])) {
    if (kb.motifs.chu_khac) return `${kb.motifs.chu_khac}\n\n💡 *Quý khách hãy xoay lật mặt dưới đáy ấn 3D lên để soi rõ nét chữ Triện này nhé!*`
  }

  if (checkKeywords(qNorm, ['tai sao 5 mong', '5 mong', 'nam mong', 'rong 5 mong'])) {
    if (kb.motifs.tai_sao_5_mong) return `${kb.motifs.tai_sao_5_mong}`
  }

  if (checkKeywords(qNorm, ['quai rong', 'hinh rong', 'num an', 'con rong tren an'])) {
    if (kb.motifs.quai_rong) return `${kb.motifs.quai_rong}`
  }

  if (checkKeywords(qNorm, ['bao nhieu tay', 'bao nhieu mat', 'canh tay', 'so tay', 'so mat', 'nghin tay'])) {
    if (kb.motifs.so_tay_mat) return `${kb.motifs.so_tay_mat}\n\n💡 *Triết lý: "Nghìn mắt nhìn thấu nỗi đau, nghìn tay cứu vớt muôn loài".*`
  }

  if (checkKeywords(qNorm, ['khuon mat', 'net mat', 'nu cuoi', 'anh mat'])) {
    if (kb.motifs.khuon_mat) return `${kb.motifs.khuon_mat}`
    if (kb.motifs.nu_cuoi_cham) return `${kb.motifs.nu_cuoi_cham}`
  }

  if (checkKeywords(qNorm, ['thien nga', 'con thien nga', 've hinh gi', 'hoa cuc'])) {
    if (kb.motifs.hinh_ve_thien_nga) return `${kb.motifs.hinh_ve_thien_nga}\n\n💡 *Nét vẽ phóng khoáng này phản ánh tinh thần tự do của mỹ thuật thời Lê sơ.*`
  }

  if (checkKeywords(qNorm, ['canh chuon', 'tai sao co canh chuon', 'hai canh chuon'])) {
    if (kb.motifs.canh_chuon) return `${kb.motifs.canh_chuon}`
  }

  if (checkKeywords(qNorm, ['bo lao', 'con bo lao', 'quai chuong'])) {
    if (kb.motifs.con_bo_lao) return `${kb.motifs.con_bo_lao}`
  }

  if (checkKeywords(qNorm, ['minh van', 'chu tren chuong', 'bai van', 'khac gi tren chuong'])) {
    if (kb.motifs.minh_van_chu_han) return `${kb.motifs.minh_van_chu_han}`
  }

  if (checkKeywords(qNorm, ['dieu mua', 'tribhanga', 'uon ba khuc', 'mua gi', 'dang mua'])) {
    if (kb.motifs.dieu_mua_tribhanga) return `${kb.motifs.dieu_mua_tribhanga}\n\n💡 *Quý khách hãy xoay nghiêng mô hình 3D 45 độ để ngắm trọn vẹn đường cong chữ S này!*`
  }

  if (checkKeywords(qNorm, ['ngam ngoc', 'minh chau', 'vien ngoc', 'mieng rong'])) {
    if (kb.motifs.ngam_ngoc_chau) return `${kb.motifs.ngam_ngoc_chau}`
  }

  if (checkKeywords(qNorm, ['than rong', 'bo bom', 'rau rong', 'sao khong co sung'])) {
    if (kb.motifs.than_rong_thoi_ly) return `${kb.motifs.than_rong_thoi_ly}`
  }

  // 4. Phân nhánh câu hỏi về KỸ THUẬT & CHẤT LIỆU
  if (checkKeywords(qNorm, ['lam bang gi', 'chat lieu', 'duc bang gi', 'nguyen lieu', 'go mit', 'sa thach', 'vang rong', 'ngoc bich', 'dat nung', 'long duoi ngua'])) {
    const craftVal = Object.values(kb.crafting)[0]
    return `Về chất liệu chế tác của **${artifact.name}**:\n\n${craftVal}\n\n* **Tình trạng bảo quản hiện tại:** ${artifact.preservationStatus}.`
  }

  if (checkKeywords(qNorm, ['ky thuat', 'khuon duc', 'khuon dat', 'sap chay', 'ren thep', 'men ngoc', 'nhiet do nung'])) {
    const allCrafting = Object.values(kb.crafting).join('\n\n')
    return `Về kỹ thuật tạo tác đỉnh cao của **${artifact.name}**:\n\n${allCrafting}`
  }

  // 5. Phân nhánh câu hỏi về KÍCH THƯỚC, KHỐI LƯỢNG, CÂN NẶNG
  if (checkKeywords(qNorm, ['nang', 'bao nhieu kg', 'khoi luong', 'trong luong', 'kich thuoc', 'cao bao nhieu', 'dai bao nhieu', 'rong bao nhieu', 'duong kinh'])) {
    return `Thông số khảo cổ học chính xác của **${artifact.name}**:\n\n${kb.specs}\n\n* **Phân hạng di sản:** ${artifact.nationalTreasureRank}.`
  }

  // 6. Phân nhánh câu hỏi về NƠI TÌM THẤY, KHAI QUẬT, NIÊN ĐẠI
  if (checkKeywords(qNorm, ['o dau', 'tim thay', 'khai quat', 'phat hien', 'nam nao', 'nien dai', 'thoi nao', 'bao nhieu tuoi'])) {
    return `Về lai lịch phát hiện & niên đại của **${artifact.name}**:\n\n${kb.excavation}\n\n* **Niên đại ước tính:** ${artifact.yearApprox}\n* **Thời kỳ văn hóa:** ${artifact.era}.`
  }

  // 7. Phân nhánh câu hỏi về ĐIỂN TÍCH, VUA NÀO, CÔNG DỤNG, Ý NGHĨA
  if (checkKeywords(qNorm, ['le loi', 'ho guom', 'rua vang', 'hoan kiem', 'thuan thien'])) {
    if (kb.history.su_tich_ho_guom) return `${kb.history.su_tich_ho_guom}\n\n${kb.history.y_nghia_thuan_thien || ''}`
  }

  if (checkKeywords(qNorm, ['thoai vi', 'bao dai', '1945', 'ngo mon', 'chinh phu lam thoi'])) {
    const thoaiViVal = kb.history.su_kien_thoai_vi_1945 || kb.history.su_tich_thoai_vi_1945
    if (thoaiViVal) return `${thoaiViVal}`
  }

  if (checkKeywords(qNorm, ['dung lam gi', 'muc dich', 'chuc nang', 'cong dung', 'doi khi nao', 'ai duoc doi', 'ai dung'])) {
    const histVal = kb.history.cong_dung || kb.history.ai_duoc_doi || kb.history.hoan_canh || Object.values(kb.history)[0]
    return `Về công dụng & chức năng lịch sử của **${artifact.name}**:\n\n${histVal}`
  }

  if (checkKeywords(qNorm, ['tai sao la bao vat', 'y nghia', 'gia tri', 'quy nhu the nao'])) {
    const sigVal = kb.history.y_nghia || kb.history.y_nghia_lich_su || artifact.significance
    return `Giá trị di sản trường tồn của **${artifact.name}**:\n\n${sigVal}\n\n> "${artifact.significance}"`
  }

  // 8. Phân nhánh câu hỏi SO SÁNH hoặc ĐIỂM ĐỘC BẢN
  if (checkKeywords(qNorm, ['so sanh', 'khac gi', 'doc ban', 'dac biet nhat', 'khac voi'])) {
    return `Điểm độc bản làm nên danh tiếng của **${artifact.name}**:\n\n${kb.uniqueness}\n\nĐây chính là lý do bảo vật được công nhận là **${artifact.nationalTreasureRank}**.`
  }

  // 9. Phân nhánh câu hỏi HƯỚNG DẪN XEM 3D
  if (checkKeywords(qNorm, ['3d', 'xem the nao', 'goc nhin', 'xoay', 'phong to', 'zoom', 'nhin'])) {
    return `Gợi ý chiêm ngưỡng mô hình 3D tương tác của **${artifact.name}**:\n\n${kb.view3d}\n\n💡 Bạn có thể kéo rê chuột để xoay 360°, lăn chuột để phóng to cận cảnh và bấm nút **Tự động xoay** trên màn hình!`
  }

  // 10. Nếu là câu hỏi chung chung về hiện vật -> Trả lời súc tích, sinh động kèm gợi ý câu hỏi tiếp theo
  return `Về bảo vật **${artifact.name}** (${artifact.era}):

${artifact.shortDescription}

* **Chất liệu & Kích thước:** ${artifact.material} | ${artifact.dimensions}
* **Điểm nhấn đặc biệt:** ${kb.uniqueness}

💡 *Quý khách có thể hỏi sâu hơn: 'Kỹ thuật chế tác món này ra sao?', 'Hoa văn biểu tượng có ý nghĩa gì?', hoặc 'Điển tích lịch sử gắn liền với bảo vật này'!*`
}

export async function POST(req: NextRequest) {
  try {
    const body: DocentRequestBody = await req.json()
    const { artifactId, userQuestion, chatHistory } = body

    if (!userQuestion || !userQuestion.trim()) {
      return NextResponse.json(
        { error: 'Câu hỏi không được để trống.' },
        { status: 400 }
      )
    }

    // 1. Tự động nhận diện hiện vật nếu người dùng nhắc tên hiện vật khác trong câu hỏi
    const mentionedArtifact = detectMentionedArtifact(userQuestion)
    const currentArtifact = MUSEUM_ARTIFACTS.find(
      (a) => a.id.toUpperCase() === (artifactId || '').toUpperCase() || a.code.toUpperCase() === (artifactId || '').toUpperCase()
    ) || MUSEUM_ARTIFACTS[0]

    const targetArtifact = mentionedArtifact || currentArtifact

    // 2. Kiểm tra nếu có API Key ngoài (Gemini hoặc OpenAI)
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (geminiKey) {
      try {
        const kb = GRANULAR_KNOWLEDGE[targetArtifact.id] || GRANULAR_KNOWLEDGE['A01']
        const promptText = `Bạn là Tiến sĩ Di sản - Thuyết minh viên trưởng của Bảo tàng Lịch sử Thông minh. Hãy trả lời câu hỏi của khách tham quan một cách TỰ NHIÊN, GIÀU TRI THỨC, TRỰC TIẾP và CUỐN HÚT (tuyệt đối KHÔNG trả lời theo khuôn mẫu số thứ tự 1-2-3-4 cứng nhắc). Trả lời bằng tiếng Việt lịch sự, thân thiện và học thuật.
Thông tin cổ vật đang xem:
Tên: ${targetArtifact.name} (${targetArtifact.code})
Thời kỳ: ${targetArtifact.era} (${targetArtifact.yearApprox})
Chất liệu: ${targetArtifact.material}
Kích thước: ${targetArtifact.dimensions}
Ý nghĩa: ${targetArtifact.significance}
Kỹ thuật: ${targetArtifact.craftingTechnique}
Câu chuyện: ${targetArtifact.fullStory}
Kiến thức hoa văn & lịch sử sâu: ${JSON.stringify(kb.motifs)} | ${JSON.stringify(kb.history)}
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
        const promptText = `Bạn là Tiến sĩ Di sản - Thuyết minh viên trưởng của Bảo tàng Lịch sử Thông minh. Hãy trả lời câu hỏi của khách tham quan một cách TỰ NHIÊN, GIÀU TRI THỨC, TRỰC TIẾP và CUỐN HÚT.
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

    // 3. Engine thuyết minh viên AI tự nhiên, linh hoạt và đa dạng câu trả lời
    const answer = generateSmartDocentAnswer(targetArtifact, userQuestion, chatHistory)

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

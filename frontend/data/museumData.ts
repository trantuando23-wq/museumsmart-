export interface RoomZone {
  id: string
  code: string
  name: string
  nameEn: string
  theme: string
  color: string
  floor: 1
  polygon: string // 2D layout representation
  x: number
  y: number
  width: number
  height: number
  doorX: number
  doorY: number
  centerX: number
  centerY: number
  description: string
  wing: 'west' | 'east' | 'north' | 'center' | 'entrance'
}

export interface AmenityFacility {
  id: string
  code: string
  name: string
  nameEn: string
  category: 'ticket' | 'toilet' | 'cafe' | 'shop' | 'locker' | 'entrance'
  icon: string
  x: number
  y: number
  nodeId: string
  description: string
  walkTime: string
}

export interface Artifact3D {
  id: string
  code: string
  name: string
  nameEn: string
  roomCode: string
  roomName: string
  era: string
  yearApprox: string
  material: string
  dimensions: string
  weight?: string
  excavationOrigin: string
  preservationStatus: string
  nationalTreasureRank: string
  model3D: string
  image: string
  audioIntro: string
  audioDuration: number // seconds
  narrator: string
  walkTime: string // e.g. "1-2 phút"
  walkDistanceMeters: number
  tags: string[]
  shortDescription: string
  fullStory: string
  significance: string
  craftingTechnique: string
  modelVisualHints: string[]
  suggestedQuestions: string[]
  nodeId: string
  modelType:
    | 'bronze_drum'
    | 'golden_seal'
    | 'buddha_statue'
    | 'blue_white_vase'
    | 'court_hat'
    | 'sword'
    | 'bell'
    | 'jade_seal'
    | 'apsara_statue'
    | 'dragon_terracotta'
}

export interface WaypointNode {
  id: string
  name: string
  x: number
  y: number
  type: 'entrance' | 'hallway' | 'room_door' | 'junction' | 'amenity'
  floor: 1
}

export interface WaypointEdge {
  from: string
  to: string
  distance?: number
}

// 1. DANH SÁCH 10 PHÒNG TRƯNG BÀY & KHU VỰC KIẾN TRÚC MẶT BẰNG BẢO TÀNG LỊCH SỬ
export const MUSEUM_ROOMS: RoomZone[] = [
  // SẢNH TRUNG TÂM BÁT GIÁC (OCTAGONAL ROTUNDA HALL)
  {
    id: 'room-rotunda',
    code: 'ROTUNDA',
    name: 'Sảnh Bát Giác Trung Tâm & Đón Tiếp',
    nameEn: 'Central Octagonal Rotunda',
    theme: 'Trái tim kiến trúc bảo tàng, không gian phân luồng đón tiếp',
    color: '#06B6D4',
    floor: 1,
    polygon: '540,540 660,540 740,620 740,740 660,820 540,820 460,740 460,620',
    x: 460,
    y: 540,
    width: 280,
    height: 280,
    doorX: 600,
    doorY: 820,
    centerX: 600,
    centerY: 680,
    description: 'Kiến trúc bát giác tráng lệ xây dựng từ thập niên 1920, nối liền các dãy hành lang trưng bày Đông Tây.',
    wing: 'center',
  },

  // CÁNH TÂY (WEST WING - NỐI TỚI CỔNG 2 NGUYỄN BỈNH KHIÊM)
  {
    id: 'room-a1',
    code: 'A1',
    name: 'Gian Đông Sơn - Bình Minh Dân Tộc',
    nameEn: 'Dong Son Bronze Culture Gallery',
    theme: 'Văn hóa Đông Sơn, thời đại Hùng Vương dựng nước',
    color: '#F59E0B',
    floor: 1,
    polygon: '80,540 280,540 280,700 80,700',
    x: 80,
    y: 540,
    width: 200,
    height: 160,
    doorX: 280,
    doorY: 620,
    centerX: 180,
    centerY: 620,
    description: 'Nơi lưu giữ Trống đồng Đông Sơn tuyệt mỹ, các loại rìu chiến đồng găm và thạp đồng thiêng liêng.',
    wing: 'west',
  },
  {
    id: 'room-c1',
    code: 'C1',
    name: 'Gian Phật Giáo - Nghệ Thuật Cổ Truyền',
    nameEn: 'Buddhist Art & Sculptures',
    theme: 'Điêu khắc tượng pháp Phật giáo thời Lý - Trần - Lê',
    color: '#10B981',
    floor: 1,
    polygon: '80,730 280,730 280,890 80,890',
    x: 80,
    y: 730,
    width: 200,
    height: 160,
    doorX: 280,
    doorY: 810,
    centerX: 180,
    centerY: 810,
    description: 'Trưng bày tượng Phật Quan Âm nghìn mắt nghìn tay Bút Tháp và tượng các vị thiền sư.',
    wing: 'west',
  },
  {
    id: 'room-c2',
    code: 'C2',
    name: 'Gian Chuông & Khí Cụ Âm Vang',
    nameEn: 'Sacred Temple Bells & Bronze Sounds',
    theme: 'Đại hồng chung, khánh đá và nhạc cụ tế lễ cổ truyền',
    color: '#14B8A6',
    floor: 1,
    polygon: '80,350 280,350 280,510 80,510',
    x: 80,
    y: 350,
    width: 200,
    height: 160,
    doorX: 280,
    doorY: 430,
    centerX: 180,
    centerY: 430,
    description: 'Không gian trầm mặc với Đại Hồng Chung chùa Thiên Mụ nặng hơn 2 tấn âm vang qua 3 thế kỷ.',
    wing: 'west',
  },

  // CÁNH TRUNG TÂM & BẮC (NORTH & COURTYARD SURROUNDING)
  {
    id: 'room-b2',
    code: 'B2',
    name: 'Gian Hoàng Gia - Bảo Vật Đế Vương',
    nameEn: 'Imperial Court Treasures',
    theme: 'Kim bảo, kim sách, ngọc điệp và vương quyền triều Nguyễn',
    color: '#EC4899',
    floor: 1,
    polygon: '320,540 440,540 440,700 320,700',
    x: 320,
    y: 540,
    width: 120,
    height: 160,
    doorX: 440,
    doorY: 620,
    centerX: 380,
    centerY: 620,
    description: 'Trưng bày kim bảo Ấn vàng "Sắc mệnh chi bảo" đúc bằng vàng ròng 10 tuổi nguyên khối.',
    wing: 'center',
  },
  {
    id: 'room-b2b',
    code: 'B2B',
    name: 'Gian Ngọc Ấn & Mật Chỉ Cung Đình',
    nameEn: 'Jade Seals & Royal Decrees',
    theme: 'Ngọc tỷ hoàng đế bích ngọc và châu phê bí mật triều đình',
    color: '#D946EF',
    floor: 1,
    polygon: '320,730 440,730 440,890 320,890',
    x: 320,
    y: 730,
    width: 120,
    height: 160,
    doorX: 440,
    doorY: 810,
    centerX: 380,
    centerY: 810,
    description: 'Trưng bày bảo ấn ngọc bích xanh nguyên khối "Hoàng đế chi bảo" uy nghi với quai rồng 5 móng.',
    wing: 'center',
  },
  {
    id: 'room-b3',
    code: 'B3',
    name: 'Gian Cung Đình - Điển Chế & Lễ Phục',
    nameEn: 'Court Attire & Imperial Regalia',
    theme: 'Mũ mão, triều phục đại triều, ngọc bội hoàng thân',
    color: '#8B5CF6',
    floor: 1,
    polygon: '760,540 880,540 880,700 760,700',
    x: 760,
    y: 540,
    width: 120,
    height: 160,
    doorX: 760,
    doorY: 620,
    centerX: 820,
    centerY: 620,
    description: 'Mũ quan nhất phẩm triều Nguyễn nguyên vẹn đan bằng lông đuôi ngựa khảm vàng ròng lộng lẫy.',
    wing: 'center',
  },
  {
    id: 'room-e1',
    code: 'E1',
    name: 'Gian Anh Hùng - Chiến Công Lam Sơn',
    nameEn: 'Heroic Valor & National Sovereignty',
    theme: 'Bảo kiếm Thuận Thiên, vũ khí và hào khí vệ quốc',
    color: '#EF4444',
    floor: 1,
    polygon: '420,100 780,100 780,240 420,240',
    x: 420,
    y: 100,
    width: 360,
    height: 140,
    doorX: 600,
    doorY: 240,
    centerX: 600,
    centerY: 170,
    description: 'Tôn vinh chiến thắng chống ngoại xâm oanh liệt với thanh Kiếm Thuận Thiên tương truyền trao cho Lê Lợi.',
    wing: 'north',
  },

  // CÁNH ĐÔNG (EAST WING)
  {
    id: 'room-d3',
    code: 'D3',
    name: 'Gian Lịch Sử - Con Đường Gốm Sứ',
    nameEn: 'Ceramic Heritage & Chu Dau Ware',
    theme: 'Gốm Chu Đậu, Bát Tràng và thương mại biển quốc tế',
    color: '#3B82F6',
    floor: 1,
    polygon: '920,540 1120,540 1120,700 920,700',
    x: 920,
    y: 540,
    width: 200,
    height: 160,
    doorX: 920,
    doorY: 620,
    centerX: 1020,
    centerY: 620,
    description: 'Chiêm ngưỡng Bình gốm hoa lam vẽ thiên nga thế kỷ 15 từ con tàu đắm hải trình Cù Lao Chàm.',
    wing: 'east',
  },
  {
    id: 'room-f1',
    code: 'F1',
    name: 'Gian Chăm Pa - Điêu Khắc Đá Sa Thạch',
    nameEn: 'Champa Classical Sculptures',
    theme: 'Điêu khắc đá Mỹ Sơn, Đồng Dương và tượng thần Hindu',
    color: '#6366F1',
    floor: 1,
    polygon: '920,350 1120,350 1120,510 920,510',
    x: 920,
    y: 350,
    width: 200,
    height: 160,
    doorX: 920,
    doorY: 430,
    centerX: 1020,
    centerY: 430,
    description: 'Tượng vũ nữ Apsara dáng múa uốn ba khúc Tribhanga bằng sa thạch hồng thanh thoát.',
    wing: 'east',
  },
  {
    id: 'room-g1',
    code: 'G1',
    name: 'Gian Thăng Long - Rồng Bay Kinh Đô',
    nameEn: 'Imperial Thang Long Heritage',
    theme: 'Đất nung, ngói rồng, phượng hoàng cung điện Kính Thiên',
    color: '#059669',
    floor: 1,
    polygon: '920,730 1120,730 1120,890 920,890',
    x: 920,
    y: 730,
    width: 200,
    height: 160,
    doorX: 920,
    doorY: 810,
    centerX: 1020,
    centerY: 810,
    description: 'Tượng rồng đất nung tráng men ngọc bích từ mái Điện Kính Thiên Hoàng thành Thăng Long.',
    wing: 'east',
  },
]

// 2. KHU VỰC TIỆN ÍCH DỊCH VỤ CÔNG CỘNG (AMENITIES)
export const MUSEUM_FACILITIES: AmenityFacility[] = [
  {
    id: 'amenity-ticket-gate1',
    code: 'TICKET-1',
    name: 'Quầy Bán Vé & Đón Tiếp Cổng 1',
    nameEn: 'Main Ticket Booth (Gate 1)',
    category: 'ticket',
    icon: '🎟️',
    x: 520,
    y: 890,
    nodeId: 'NODE_TICKET_1',
    description: 'Quầy mua vé tham quan chính, phát tờ rơi sơ đồ, thiết bị audio guide và hướng dẫn viên trực tiếp.',
    walkTime: 'Ngay tại Cổng 1',
  },
  {
    id: 'amenity-ticket-gate2',
    code: 'TICKET-2',
    name: 'Quầy Vé & Cổng 2 (Phố Nguyễn Bỉnh Khiêm)',
    nameEn: 'Ticket Booth & Gate 2 (Nguyen Binh Khiem St.)',
    category: 'ticket',
    icon: '🎫',
    x: 30,
    y: 430,
    nodeId: 'NODE_TICKET_2',
    description: 'Cổng phụ số 2 đón khách đoàn và du khách đi từ mặt đường Nguyễn Bỉnh Khiêm vào nhanh chóng.',
    walkTime: '1-2 phút',
  },
  {
    id: 'amenity-wc-west',
    code: 'WC-WEST',
    name: 'Khu Vệ Sinh Tây (Restroom)',
    nameEn: 'West Wing Restrooms (Accessible)',
    category: 'toilet',
    icon: '🚻',
    x: 320,
    y: 350,
    nodeId: 'NODE_WC_W',
    description: 'Nhà vệ sinh tiêu chuẩn hiện đại, có phòng riêng cho người khuyết tật và trẻ em.',
    walkTime: '1-2 phút',
  },
  {
    id: 'amenity-wc-east',
    code: 'WC-EAST',
    name: 'Khu Vệ Sinh Đông (Restroom)',
    nameEn: 'East Wing Restrooms',
    category: 'toilet',
    icon: '🚻',
    x: 880,
    y: 350,
    nodeId: 'NODE_WC_E',
    description: 'Nhà vệ sinh sạch sẽ, trang bị máy sấy tay tự động và vòi nước cảm ứng.',
    walkTime: '2 phút',
  },
  {
    id: 'amenity-cafe',
    code: 'CAFE',
    name: 'Quầy Nước & Museum Café Sân Vườn',
    nameEn: 'Courtyard Garden Refreshment & Café',
    category: 'cafe',
    icon: '☕',
    x: 600,
    y: 380,
    nodeId: 'NODE_CAFE',
    description: 'Không gian thư giãn rợp bóng cây xanh tại sân vườn trung tâm, phục vụ cà phê, trà giải khát và máy bán nước tự động.',
    walkTime: '1-2 phút',
  },
  {
    id: 'amenity-souvenir',
    code: 'SHOP',
    name: 'Cửa Hàng Quà Lưu Niệm & Sách Văn Hóa',
    nameEn: 'Museum Souvenir & Heritage Bookshop',
    category: 'shop',
    icon: '🎁',
    x: 680,
    y: 890,
    nodeId: 'NODE_SHOP',
    description: 'Bán mô hình thu nhỏ trống đồng, bưu thiếp, sách nghiên cứu lịch sử mỹ thuật và đồ thủ công mỹ nghệ.',
    walkTime: 'Ngay tại Sảnh vào',
  },
  {
    id: 'amenity-locker',
    code: 'LOCKER',
    name: 'Tủ Gửi Đồ & An Ninh Bảo Tàng',
    nameEn: 'Free Cloakroom & Luggage Lockers',
    category: 'locker',
    icon: '🧳',
    x: 440,
    y: 890,
    nodeId: 'NODE_LOCKER',
    description: 'Tủ khóa điện tử bảo quản ba lô, hành lý cồng kềnh miễn phí cho du khách trước khi vào tham quan.',
    walkTime: 'Ngay tại Cổng 1',
  },
]

// 3. TOÀN BỘ 10 CỔ VẬT TRƯNG BÀY (A01 - A10) KÈM DỮ LIỆU ĐẦY ĐỦ VÀ 3D MODEL
export const MUSEUM_ARTIFACTS: Artifact3D[] = [
  {
    id: 'A01',
    code: 'A01',
    name: 'Trống đồng Đông Sơn',
    nameEn: 'Dong Son Bronze Drum',
    roomCode: 'A1',
    roomName: 'Gian Đông Sơn - Bình Minh Dân Tộc',
    era: 'Văn hóa Đông Sơn (Thế kỷ V - III TCN)',
    yearApprox: 'Khoảng 2.500 năm trước (Thời đại Hùng Vương)',
    material: 'Đồng đỏ pha thiếc và chì theo tỷ lệ luyện kim hoàn hảo',
    dimensions: 'Đường kính mặt: 79.3 cm, Chiều cao: 63 cm, Vành chân: 82 cm',
    weight: 'Khoảng 86 kg',
    excavationOrigin: 'Khai quật tại bờ sông Mã, làng Đông Sơn, Thanh Hóa năm 1924.',
    preservationStatus: 'Bảo vật Quốc gia Đợt 1 (2012), giữ nguyên vẹn 98% hoa văn bề mặt và tiếng ngân vang trầm ấm.',
    nationalTreasureRank: 'Bảo vật Quốc gia Hạng Nhất',
    model3D: '/models/trong_dong.glb',
    image: '/images/trong-dong.jpg',
    audioIntro:
      'Kính chào quý khách! Trước mắt quý khách là Trống đồng Đông Sơn, biểu tượng tối cao cho quyền lực thủ lĩnh và vũ trụ quan nông nghiệp sông Hồng. Mặt trống tỏa sáng ngôi sao 14 cánh đại diện cho Thần Mặt Trời, xung quanh là đoàn chim Lạc bay ngược chiều kim đồng hồ, cảnh giã gạo đón mùa và thuyền chiến vượt sóng.',
    audioDuration: 80,
    narrator: 'TS. Nguyễn Văn Hào (Viện Khảo Cổ Học)',
    walkTime: '2 phút',
    walkDistanceMeters: 45,
    tags: ['Bảo vật Quốc gia', 'Đông Sơn', 'Luyện kim', 'Trống đồng', 'Đồ đồng'],
    shortDescription: 'Đỉnh cao nghệ thuật luyện kim và thế giới quan nông nghiệp sông Hồng của người Việt cổ.',
    fullStory:
      'Trống đồng Đông Sơn không chỉ là một nhạc khí trong lễ hội cầu mưa, mùa màng hay lễ nghi phồn thực, mà còn là linh vật truyền lệnh quân cơ và biểu tượng uy quyền thủ lĩnh thời các Vua Hùng. Âm vang của trống tựa tiếng sấm rền đánh thức đất trời, kết nối con người với thần linh. Hợp kim đồng - thiếc - chì với tỷ lệ luyện kim thần kỳ cho phép đúc nên thân trống mỏng tang nhưng chịu lực rung ngân kỳ diệu suốt hàng nghìn năm.',
    significance:
      'Khẳng định nền văn minh nông nghiệp lúa nước rực rỡ và bản sắc văn hóa tự chủ của người Lạc Việt trước thời Bắc thuộc.',
    craftingTechnique:
      'Đúc bằng khuôn đất nhiều mang (3 đến 4 mang) kết hợp lõi khuôn treo liền khối. Hoa văn chìm nổi được chạm trực tiếp trên lòng khuôn bằng bút khắc kim loại cực kỳ chuẩn xác.',
    modelVisualHints: [
      'Ngôi sao 14 cánh sắc nhọn ở trung tâm mặt trống tỏa hào quang thái dương.',
      'Đoàn chim Lạc dang rộng cánh bay ngược chiều kim đồng hồ theo chu kỳ mặt trời.',
      'Bốn khối tượng cóc nổi trên mặt trống mang tín ngưỡng cầu mưa thuận gió hòa.',
      'Bốn quai kép đúc nổi hình bím thừng bện đối xứng trên tang trống.',
    ],
    suggestedQuestions: [
      'Tại sao người Đông Sơn lại đúc hình 4 con cóc trên mặt trống?',
      'Ngôi sao 14 cánh ở tâm trống tượng trưng cho điều gì trong thiên văn cổ?',
      'Người Việt cổ đã làm khuôn đúc chiếc trống khổng lồ nặng 86kg này như thế nào?',
      'Trống đồng được sử dụng trong các nghi lễ nào của bộ tộc?',
    ],
    nodeId: 'NODE_A1',
    modelType: 'bronze_drum',
  },
  {
    id: 'A02',
    code: 'A02',
    name: 'Ấn vàng Sắc mệnh chi bảo',
    nameEn: 'Gold Imperial Seal - Sac Menh Chi Bao',
    roomCode: 'B2',
    roomName: 'Gian Hoàng Gia - Bảo Vật Đế Vương',
    era: 'Triều Nguyễn (Năm Minh Mạng thứ 8 - 1827)',
    yearApprox: '1827 (Triều Vua Minh Mạng)',
    material: 'Vàng ròng 10 tuổi nguyên khối (Kim trọng 223 lạng 6 đồng)',
    dimensions: 'Cạnh vuông: 14 cm x 14 cm, Chiều cao: 11 cm',
    weight: '8.38 kg vàng ròng nguyên khối',
    excavationOrigin: 'Chế tác tại Ngự công xưởng Cục Thượng Bảo triều Nguyễn tại Cố đô Huế.',
    preservationStatus: 'Bảo vật Quốc gia độc bản vô giá, nước vàng sáng bóng, các góc cạnh triện thư sắc nét tuyệt đối.',
    nationalTreasureRank: 'Bảo vật Quốc gia Đặc biệt',
    model3D: '/models/an_vang.glb',
    image: '/images/an-vang.jpg',
    audioIntro:
      'Ấn vàng "Sắc mệnh chi bảo" đúc vào năm Minh Mạng thứ 8 (1827). Đây là một trong những bảo ấn hoàng gia quyền lực nhất triều Nguyễn, chuyên dùng đóng trên các chiếu chỉ, sắc phong quan lại và ban thưởng công thần trên toàn bờ cõi giang sơn.',
    audioDuration: 75,
    narrator: 'ThS. Lê Hoàng Mai (Bảo tàng Cố cung Huế)',
    walkTime: '1-2 phút',
    walkDistanceMeters: 38,
    tags: ['Triều Nguyễn', 'Bảo vật Quốc gia', 'Kim bảo', 'Đế vương', 'Vàng ròng'],
    shortDescription: 'Bảo ấn bằng vàng ròng 8.38kg với núm rồng 5 móng oai nghiêm của Hoàng đế triều Nguyễn.',
    fullStory:
      'Dưới triều vua Minh Mạng - vị hoàng đế có tầm nhìn quản trị hành chính quy củ bậc nhất lịch sử Việt Nam, việc chế định ấn tín đạt đến đỉnh cao điển chế. Núm ấn đúc nổi hình rồng cuộn 5 móng oai phong, vảy rồng tỉa rực rỡ, hai sừng nhọn vươn cao, mắt rồng đăm chiêu quan sát giang sơn. Dọc sống lưng rồng khắc rõ niên hiệu đúc và trọng lượng thực tế do Cục Thượng Bảo xác nhận.',
    significance:
      'Đại diện cho quyền lực tối thượng và tính chính thống của vương triều phong kiến tập quyền Việt Nam thế kỷ 19.',
    craftingTechnique:
      'Kỹ thuật đúc vàng khối sáp chảy (lost-wax casting) kết hợp chạm khắc thủ công vi tế. Mặt ấn khắc 4 chữ triện "Sắc mệnh chi bảo" với nét chữ uyển chuyển cương nghị.',
    modelVisualHints: [
      'Núm ấn hình rồng cuộn 5 móng uy nghi với vảy rồng chạm nổi tinh xảo.',
      'Bốn chữ Triện thư cổ "Sắc Mệnh Chi Bảo" đúc chìm đảo ngược dưới đáy ấn.',
      'Khắc chữ nhỏ ở hai bên sống lưng rồng ghi niên hiệu "Minh Mạng bát niên tạo".',
      'Độ bóng gương và màu vàng ánh kim 10 tuổi thuần khiết.',
    ],
    suggestedQuestions: [
      'Ấn Sắc mệnh chi bảo được dùng vào những dịp nào trong triều đình?',
      'Hình tượng rồng 5 móng trên ấn có ý nghĩa gì đối với ngôi vua?',
      'Trọng lượng hơn 8.3kg vàng ròng của bảo ấn tượng trưng cho điều gì?',
      'Lịch sử bảo quản và hành trình hồi hương của các kim bảo triều Nguyễn?',
    ],
    nodeId: 'NODE_B2',
    modelType: 'golden_seal',
  },
  {
    id: 'A03',
    code: 'A03',
    name: 'Tượng Phật Quan Âm nghìn mắt nghìn tay',
    nameEn: 'Thousand-Armed Avalokiteshvara Buddha',
    roomCode: 'C1',
    roomName: 'Gian Phật Giáo - Nghệ Thuật Cổ Truyền',
    era: 'Thời Lê Trung Hưng (Năm 1656)',
    yearApprox: '1656 (Chùa Bút Tháp, Bắc Ninh)',
    material: 'Gỗ mít già sơn son thếp vàng cổ truyền',
    dimensions: 'Chiều cao toàn bộ: 3.7 m (tượng cao 2.35m, đài sen và bệ rồng 1.35m)',
    weight: 'Khoảng 1.200 kg',
    excavationOrigin: 'Tạo tác trực tiếp tại chùa Ninh Phúc (Chùa Bút Tháp, Thuận Thành, Bắc Ninh) bởi nghệ nhân Trương Thọ Nam.',
    preservationStatus: 'Bảo vật Quốc gia, đỉnh cao điêu khắc gỗ cổ điển Đông Nam Á, nước sơn son và vàng quỳ còn nguyên sắc ấm.',
    nationalTreasureRank: 'Bảo vật Quốc gia Số 1 về Điêu khắc Gỗ',
    model3D: '/models/quan_am.glb',
    image: '/images/quan-am.jpg',
    audioIntro:
      'Tác phẩm tượng Phật Bà Quan Âm nghìn mắt nghìn tay tạc năm 1656 bởi danh nhân điêu khắc Trương Thọ Nam tại chùa Bút Tháp. Pho tượng có 42 cánh tay lớn kết thủ ấn thiêng liêng và 958 cánh tay nhỏ kết thành vầng hào quang bát ngát, trong mỗi lòng bàn tay đều mở một con mắt từ bi nhìn thấu nỗi khổ trần gian.',
    audioDuration: 85,
    narrator: 'Đại đức Thích Minh Trí',
    walkTime: '2-3 phút',
    walkDistanceMeters: 75,
    tags: ['Phật giáo', 'Bảo vật Quốc gia', 'Chùa Bút Tháp', 'Điêu khắc gỗ', 'Thế kỷ 17'],
    shortDescription: 'Tuyệt tác điêu khắc gỗ sơn son thếp vàng biểu trưng cho lòng đại từ bi cứu khổ cứu nạn.',
    fullStory:
      'Pho tượng là sự dung hòa hoàn mỹ giữa giáo lý Phật giáo Đại thừa Mật tông với tâm hồn nhân ái của người Việt. Bồ Tát ngự trên tòa sen do đầu rồng đen dâng lên từ lòng biển cả sâu thẳm. Trên đầu Ngài là các tầng tượng Phật A Di Đà chỉ dẫn giải thoát. Mỗi cánh tay nhỏ xếp theo hình nan quạt tựa như dòng hào quang tỏa sáng vô biên ra khắp vũ trụ.',
    significance:
      'Thể hiện ước vọng hòa bình, tình thương bao la và triết lý dung thứ cứu độ muôn loài giữa thời tao loạn thế kỷ 17.',
    craftingTechnique:
      'Ghép các khối gỗ mít nguyên tảng bằng mộng gỗ cổ truyền không dùng đinh kim loại, phủ lớp sơn ta luyện qua nhiều công đoạn kỳ công rồi dát vàng lá mỏng.',
    modelVisualHints: [
      'Vầng hào quang phía sau kết bởi 958 bàn tay nhỏ mang con mắt trí tuệ soi thấu nhân gian.',
      '42 cánh tay lớn kết các thủ ấn: ấn chuẩn đề, ấn thiền định, cầm hoa sen, bình cam lộ.',
      'Khuôn mặt Đức Bồ Tát tĩnh tại, bao dung, đôi mắt khép hờ nhìn xuống thế gian.',
      'Bệ tượng chạm khắc hình thủy tộc và rồng nâng tòa sen trang nghiêm.',
    ],
    suggestedQuestions: [
      'Ý nghĩa của 1.000 cánh tay và 1.000 con mắt là gì trong kinh điển Phật giáo?',
      'Nghệ nhân Trương Thọ Nam đã ghép các khối gỗ mít tinh xảo như thế nào?',
      'Tại sao người xưa chọn chất liệu gỗ mít để tạc tượng Phật thờ ngàn năm?',
      'Hình tượng đầu rồng đen trồi lên từ biển nâng đài sen biểu thị điều gì?',
    ],
    nodeId: 'NODE_C1',
    modelType: 'buddha_statue',
  },
  {
    id: 'A04',
    code: 'A04',
    name: 'Bình gốm hoa lam vẽ thiên nga',
    nameEn: 'Blue-and-White Swan Ceramic Jar',
    roomCode: 'D3',
    roomName: 'Gian Lịch Sử - Con Đường Gốm Sứ',
    era: 'Thời Lê Sơ (Thế kỷ XV)',
    yearApprox: 'Khoảng năm 1450',
    material: 'Gốm men lam Chu Đậu (Hải Dương cổ), men tro trấu tự nhiên',
    dimensions: 'Cao: 56.5 cm, Đường kính miệng: 23.8 cm, Chu vi thân: 135 cm',
    weight: '8.5 kg',
    excavationOrigin: 'Trục vớt từ xác tàu cổ đắm dưới đáy biển sâu vùng Cù Lao Chàm (Quảng Nam) năm 1997 - 2000.',
    preservationStatus: 'Bảo vật Quốc gia nguyên vẹn 100%, lớp men bóng ngọc không hề bị nước biển ăn mòn.',
    nationalTreasureRank: 'Bảo vật Quốc gia Độc bản Gốm Chu Đậu',
    model3D: '/models/binh_gom.glb',
    image: '/images/binh-gom.jpg',
    audioIntro:
      'Chiếc bình gốm hoa lam vẽ thiên nga thế kỷ 15 được vớt từ xác tàu đắm Cù Lao Chàm. Thân bình tròn nở căng tràn sức sống, được chia thành nhiều băng hoa văn men lam coban huyền ảo, trong đó nổi bật là đồ án 4 chú thiên nga đang sải cánh bơi lội giữa hồ sen thanh khiết mang đậm hồn quê Việt.',
    audioDuration: 70,
    narrator: 'Nghệ nhân Nhân dân Trần Độ',
    walkTime: '2 phút',
    walkDistanceMeters: 60,
    tags: ['Gốm Chu Đậu', 'Bảo vật Quốc gia', 'Lê Sơ', 'Hoa lam', 'Hải trình tơ lụa'],
    shortDescription: 'Đại diện tiêu biểu cho đỉnh cao gốm men lam xuất khẩu thời Lê Sơ trên con đường tơ lụa biển.',
    fullStory:
      'Gốm Chu Đậu từng thất truyền hàng trăm năm cho đến khi bức thông điệp của nhà ngoại giao Nhật Bản Makoto Anabuki vào năm 1980 kích hoạt các cuộc khai quật khảo cổ chấn động. Chiếc bình gốm hoa lam vẽ thiên nga này chứng minh kỹ thuật làm gốm và nghệ thuật vẽ phóng bút của thợ gốm Việt Nam thế kỷ 15 không hề thua kém, thậm chí còn tự do, phóng khoáng và đẫm chất dân dã hơn gốm men Minh của Trung Hoa.',
    significance:
      'Dấu mốc vàng son của thương mại hàng hải quốc tế Đại Việt, khẳng định vị thế trung tâm sản xuất gốm mỹ nghệ cao cấp Đông Á.',
    craftingTechnique:
      'Bàn xoay thủ công kết hợp kỹ nghệ vẽ men lam coban nhập khẩu từ Tây Á dưới lớp men tro trấu tự nhiên độc đáo nung ở nhiệt độ 1.250°C.',
    modelVisualHints: [
      'Băng hoa văn chủ đạo vẽ bốn con thiên nga ở bốn tư thế sinh động: vỗ cánh, rỉa lông, bơi lội và ngoái đầu.',
      'Băng vai bình vẽ họa tiết hoa sen cách điệu và dải cánh sen úp đặc trưng đời Lê.',
      'Màu men lam coban chìm sâu dưới lớp men thủy tinh trong suốt óng ả.',
      'Đế bình mộc màu đất nung xám có thoa nước sắt gỉ bảo vệ.',
    ],
    suggestedQuestions: [
      'Hình tượng bốn chú thiên nga mang thông điệp gì trong văn hóa dân gian?',
      'Bình gốm được trục vớt từ xác tàu đắm Cù Lao Chàm trong hoàn cảnh nào?',
      'Men tro trấu Chu Đậu có đặc tính độc đáo gì giúp bền bỉ ngâm trong nước biển 500 năm?',
      'Con đường tơ lụa trên biển đã đưa gốm Việt Nam đến những quốc gia nào?',
    ],
    nodeId: 'NODE_D3',
    modelType: 'blue_white_vase',
  },
  {
    id: 'A05',
    code: 'A05',
    name: 'Mũ quan nhất phẩm Triều Nguyễn',
    nameEn: 'First-Rank Mandarin Court Hat',
    roomCode: 'B3',
    roomName: 'Gian Cung Đình - Điển Chế & Lễ Phục',
    era: 'Thời Nguyễn (Thế kỷ XIX)',
    yearApprox: 'Khoảng năm 1850 - 1880',
    material: 'Vàng ròng, bạc mạ vàng, lông đuôi ngựa dệt mắt cáo, đồi mồi, san hô đỏ',
    dimensions: 'Chiều cao: 25 cm, Đường kính vành: 22 cm, Chiều dài cánh chuồn: 30 cm',
    weight: 'Khoảng 750 gram',
    excavationOrigin: 'Chế tác tại Ngự công tượng viện cung đình Huế, được đấu giá hồi hương về Việt Nam năm 2022.',
    preservationStatus: 'Bảo vật cung đình vô giá nguyên vẹn, các chi tiết vàng dát hoa văn rồng vờn mây còn nguyên độ bóng óng ả.',
    nationalTreasureRank: 'Bảo vật Quốc gia Cung đình',
    model3D: '/models/mu_quan.glb',
    image: '/images/mu-quan.jpg',
    audioIntro:
      'Chiếc mũ Phốc Đầu của vị Đại thần chánh nhất phẩm triều Nguyễn là hiện vật nguyên vẹn hiếm hoi còn lưu giữ được đầy đủ hệ thống sức đính vàng bạc, họa tiết rồng vờn mây và hoa cúc đá quý biểu thị phẩm hàm tối cao phục vụ các đại lễ tại Điện Thái Hòa.',
    audioDuration: 72,
    narrator: 'Nhà nghiên cứu Vũ Kim Lộc',
    walkTime: '1-2 phút',
    walkDistanceMeters: 42,
    tags: ['Triều Nguyễn', 'Trang phục cung đình', 'Mũ quan', 'Đá quý', 'Bảo vật hồi hương'],
    shortDescription: 'Hiện vật phục trang cung đình đỉnh cao với các chi tiết vàng bạc dệt tinh xảo trên cốt lông đuôi ngựa.',
    fullStory:
      'Theo Khâm định Đại Nam hội điển sự lệ, mũ cánh chuồn đại triều của quan Văn Nhất phẩm quy định phải có kết sức vàng, gắn 7 con rồng (giao long), hoa mẫu đơn và giao thoa với hai cánh chuồn dài vươn ngang. Sau các biến cố thăng trầm của lịch sử đầu thế kỷ 20, chiếc mũ quý báu này từng trôi dạt ra nước ngoài và được đấu giá hồi hương thành công về Việt Nam trong niềm xúc động của giới khảo cổ học.',
    significance:
      'Minh chứng vật chất tối thượng cho điển chế phục sức nghiêm cẩn và nghệ thuật kim hoàn đỉnh cao của các ngự công xưởng triều Nguyễn.',
    craftingTechnique:
      'Dệt lông bờm ngựa thủ công tạo cốt mũ nhẹ và thoáng khí, sau đó khảm các lá vàng rập nổi hình mây rồng và kết nối bằng chỉ vàng kim tuyến.',
    modelVisualHints: [
      'Hai cánh chuồn dài gắn ngang hai bên vành mũ vươn lên kiêu hãnh.',
      'Bộ trang sức Bác Sơn bằng vàng chạm nổi hình long mã và hoa cúc dây.',
      'Đỉnh mũ gắn ngọc đỏ và các ngôi sao vàng óng ánh.',
      'Cốt mũ dệt đan hình mắt cáo cực kỳ đều đặn từ sợi lông đuôi ngựa.',
    ],
    suggestedQuestions: [
      'Điểm gì trên mũ quan chứng minh chủ nhân là vị Đại thần Nhất phẩm?',
      'Hành trình chiếc mũ hồi hương từ châu Âu về Việt Nam diễn ra thế nào?',
      'Cốt mũ đan bằng lông đuôi ngựa có ưu điểm gì so với các chất liệu khác?',
      'Sự khác biệt giữa mũ cánh chuồn của quan Văn và quan Võ triều Nguyễn?',
    ],
    nodeId: 'NODE_B3',
    modelType: 'court_hat',
  },
  {
    id: 'A06',
    code: 'A06',
    name: 'Kiếm vàng Thuận Thiên - Vua Lê Lợi',
    nameEn: 'Thuan Thien Imperial Sword of King Le Loi',
    roomCode: 'E1',
    roomName: 'Gian Anh Hùng - Chiến Công Lam Sơn',
    era: 'Thời Lê Sơ (Thế kỷ XV)',
    yearApprox: 'Năm 1428 (Sau chiến thắng chống giặc Minh)',
    material: 'Thép luyện rèn vân gấm, chuôi kiếm vàng ròng chạm lộng, nạm ngọc bích và hồng ngọc',
    dimensions: 'Tổng chiều dài: 120 cm, Chiều rộng lưỡi: 4.5 cm, Độ dày sống kiếm: 0.8 cm',
    weight: '2.1 kg',
    excavationOrigin: 'Lưu giữ trong kho tàng vũ khí hoàng gia Lam Sơn - Thăng Long.',
    preservationStatus: 'Bảo vật Quốc gia Quân sự, lưỡi thép còn sáng loáng không han gỉ, các viên đá quý nguyên vẹn.',
    nationalTreasureRank: 'Bảo vật Quốc gia Lịch sử',
    model3D: '/models/kiem_vang.glb',
    image: '/images/kiem-vang.jpg',
    audioIntro:
      'Thanh bảo kiếm Thuận Thiên gắn liền với cuộc khởi nghĩa Lam Sơn oanh liệt của Bình Định Vương Lê Lợi. Tương truyền, thanh kiếm mang mệnh trời giúp nghĩa quân đánh tan 15 vạn quân xâm lược nhà Minh, giành lại độc lập cho non sông Đại Việt.',
    audioDuration: 76,
    narrator: 'PGS. TS. Trần Đức Cường (Hội Khoa Học Lịch Sử)',
    walkTime: '3 phút',
    walkDistanceMeters: 85,
    tags: ['Thời Lê Sơ', 'Vũ khí hoàng gia', 'Khởi nghĩa Lam Sơn', 'Bảo vật Quốc gia', 'Lê Lợi'],
    shortDescription: 'Biểu tượng của ý chí quật cường và sự nghiệp giải phóng dân tộc thế kỷ 15.',
    fullStory:
      'Theo truyền thuyết và sử liệu Đại Việt Sử Ký Toàn Thư, trong những ngày đầu gian khó của khởi nghĩa Lam Sơn, ngư phủ Lê Thận kéo lưới được lưỡi kiếm sáng loáng, sau đó Lê Lợi tìm được chuôi kiếm nạm ngọc trong hốc cây cổ thụ. Khi tra lưỡi vào chuôi, thanh kiếm vừa khít và phát sáng dòng chữ "Thuận Thiên" (Thuận theo ý trời). Dưới ngọn cờ chính nghĩa, nghĩa quân đánh đâu thắng đó. Sau khi lên ngôi hoàng đế năm 1428, trên thuyền rồng ngắm cảnh hồ Tả Vọng, Rùa Vàng nổi lên nhận lại gươm thần, từ đó hồ mang tên Hồ Hoàn Kiếm.',
    significance:
      'Biểu tượng thiêng liêng của tinh thần yêu chuộng hòa bình: rút kiếm bảo vệ bờ cõi, thái bình trả gươm xây dựng đất nước.',
    craftingTechnique:
      'Kỹ thuật rèn thép gấp nhiều lớp (damascus Việt) tạo các đường vân lượn sóng chịu lực chém cực mạnh, chuôi kiếm chạm rồng vàng cuộn ôm lấy viên ngọc quý.',
    modelVisualHints: [
      'Lưỡi thép sáng bóng khắc chìm hai chữ Hán "Thuận Thiên" tinh xảo gần cán.',
      'Chuôi kiếm bọc vàng ròng chạm hình rồng uốn lượn ôm ngọc ruby đỏ thắm.',
      'Bao kiếm khảm vàng và nạm các viên ngọc bích xanh tự nhiên sang trọng.',
      'Sống kiếm dày dặn với rãnh huyết kép chống gãy cong khi va chạm.',
    ],
    suggestedQuestions: [
      'Ý nghĩa biểu tượng của tích trả gươm cho Rùa Thần ở Hồ Hoàn Kiếm?',
      'Kỹ thuật luyện thép và đúc vàng thời Lê sơ đạt trình độ như thế nào?',
      'Kiếm lệnh đóng vai trò gì trong việc chỉ huy quân đội Đại Việt xưa?',
      'Những bằng chứng khảo cổ học nào minh chứng cho vũ khí thời Lam Sơn?',
    ],
    nodeId: 'NODE_E1',
    modelType: 'sword',
  },
  {
    id: 'A07',
    code: 'A07',
    name: 'Chuông Đại Hồng Chung Thiên Mụ',
    nameEn: 'Dai Hong Chung Sacred Bell of Thien Mu Pagoda',
    roomCode: 'C2',
    roomName: 'Gian Chuông & Khí Cụ Âm Vang',
    era: 'Thời Chúa Nguyễn (Năm Canh Dần - 1710)',
    yearApprox: '1710 (Chúa Nguyễn Phúc Chu)',
    material: 'Đồng đỏ pha vàng quỳ và thiếc nguyên chất',
    dimensions: 'Chiều cao: 2.5 mét, Đường kính miệng chuông: 1.4 mét, Chu vi thân: 3.8 mét',
    weight: '2.052 kg (Hơn 2 tấn đồng)',
    excavationOrigin: 'Đúc trực tiếp tại phường Đúc, kinh đô Phú Xuân (Huế) dưới sự chỉ đạo của chúa Nguyễn Phúc Chu.',
    preservationStatus: 'Bảo vật Quốc gia, còn nguyên bài minh văn 1.640 chữ Hán khắc sâu sắc nét, âm ngân vang xa hàng chục dặm.',
    nationalTreasureRank: 'Bảo vật Quốc gia Đồ Đồng',
    model3D: '/models/chuong_dong.glb',
    image: '/images/chuong-dong.jpg',
    audioIntro:
      'Đại hồng chung chùa Thiên Mụ đúc năm 1710 nặng hơn 2 tấn đồng đỏ. Tiếng chuông trầm hùng ngân vang giữa mây nước sông Hương, trở thành thanh âm linh thiêng gắn liền với tâm hồn xứ Huế suốt hơn 300 năm lịch sử.',
    audioDuration: 74,
    narrator: 'Nhà nghiên cứu Huế Nguyễn Đắc Xuân',
    walkTime: '2 phút',
    walkDistanceMeters: 55,
    tags: ['Chúa Nguyễn', 'Bảo vật Quốc gia', 'Đồ đồng', 'Chùa Thiên Mụ', 'Âm thanh di sản'],
    shortDescription: 'Kiệt tác đúc đồng khổng lồ với bài minh văn chữ Hán cầu quốc thái dân an của Chúa Nguyễn.',
    fullStory:
      'Chúa Quốc chúa Nguyễn Phúc Chu là một Phật tử thuần thành mang pháp danh Hưng Long. Để cầu nguyện cho mưa thuận gió hòa, bách tính an cư lạc nghiệp, ngài đã huy động những nghệ nhân luyện kim tài hoa nhất xứ Huế đúc nên quả đại hồng chung này. Thân chuông khắc bài minh do chính chúa ngự bút gồm 1.640 chữ, ca ngợi cảnh đẹp chùa Thiên Mụ và triết lý Phật pháp nhiệm màu. Khi đánh chuông, âm ba cộng hưởng trầm bổng vang xa tận ngọn đồi Kim Phụng.',
    significance:
      'Minh chứng đỉnh cao cho kỹ thuật đúc đồng đại bác và chuông khổng lồ của xứ Đàng Trong thế kỷ 18.',
    craftingTechnique:
      'Phương pháp đúc liền khối sử dụng khuôn đất sét pha trấu và cát mịn. Miệng chuông dày được tính toán âm học tỉ mỉ để tạo nốt ngân trầm lan tỏa.',
    modelVisualHints: [
      'Quai chuông tạo hình con Bồ Lao (rồng biển hai đầu) uốn cong chịu lực treo 2 tấn.',
      'Thân chuông chia 8 ô chữ nhật chạm nổi hình mây rồng, bát quái và bài minh 1.640 chữ.',
      'Bốn núm chuông tròn nhẵn nhụi là vị trí gõ chày kình truyền lực âm vang.',
      'Gờ miệng chuông đúc dải sóng nước và hoa sen nở nâng đỡ toàn bộ khối chuông.',
    ],
    suggestedQuestions: [
      'Bài minh văn 1.640 chữ khắc trên chuông ghi chép những thông điệp gì của Chúa Nguyễn?',
      'Làm thế nào các nghệ nhân Huế thế kỷ 18 có thể nấu chảy hơn 2 tấn đồng để đúc liền khối?',
      'Hình tượng con Bồ Lao trên quai chuông mang ý nghĩa gì trong thần thoại?',
      'Tại sao tiếng chuông chùa Thiên Mụ lại có khả năng ngân vang xa đến hàng chục km?',
    ],
    nodeId: 'NODE_C2',
    modelType: 'bell',
  },
  {
    id: 'A08',
    code: 'A08',
    name: 'Ngọc ấn Hoàng đế chi bảo',
    nameEn: 'Imperial Jade Seal - Hoang De Chi Bao',
    roomCode: 'B2B',
    roomName: 'Gian Ngọc Ấn & Mật Chỉ Cung Đình',
    era: 'Triều Nguyễn (Năm Minh Mạng thứ 4 - 1823)',
    yearApprox: '1823 (Vua Minh Mạng)',
    material: 'Ngọc bích xanh ngọc lục bảo (Imperial Jadeite) nguyên khối tự nhiên',
    dimensions: 'Mặt ấn vuông: 13.8 cm x 13.8 cm, Chiều cao: 9.9 cm',
    weight: '6.8 kg ngọc bích nguyên khối',
    excavationOrigin: 'Chế tác từ khối ngọc bích cống nạp quý hiếm của vùng biên viễn, lưu giữ tại điện Cần Chánh.',
    preservationStatus: 'Bảo vật Quốc gia Độc bản, ngọc trong suốt ánh biếc, các chi tiết vảy rồng và nét chữ triện mài gọt bóng loáng.',
    nationalTreasureRank: 'Bảo vật Quốc gia Cung đình Đặc biệt',
    model3D: '/models/ngoc_an.glb',
    image: '/images/ngoc-an.jpg',
    audioIntro:
      'Ngọc ấn "Hoàng đế chi bảo" tạc năm 1823 dưới triều Minh Mạng từ một khối ngọc bích xanh lục tuyệt mỹ. Đây là bảo ngọc tối thượng của hoàng triều, tượng trưng cho thiên mệnh và phẩm đức trong sáng của bậc đế vương.',
    audioDuration: 70,
    narrator: 'TS. Phan Thanh Hải (Giám đốc Sở VHTT Thừa Thiên Huế)',
    walkTime: '1-2 phút',
    walkDistanceMeters: 40,
    tags: ['Triều Nguyễn', 'Bảo vật Quốc gia', 'Ngọc ấn', 'Ngọc bích', 'Vương triều'],
    shortDescription: 'Tuyệt tác bảo ngọc bích nguyên khối với hình tượng rồng ngọc 5 móng quý tộc của hoàng triều.',
    fullStory:
      'Nếu ấn vàng tượng trưng cho quyền uy ban hành sắc lệnh hành chính, thì ngọc ấn tượng trưng cho sự thánh thiện, uy nghi thiên mệnh và phẩm cách trong sạch như ngọc của Hoàng đế. Khối ngọc bích xanh không tì vết được nghệ nhân cung đình mài dũa suốt nhiều năm ròng bằng bột kim cương. Núm ấn khắc hình con rồng 5 móng uốn lượn uyển chuyển giữa tầng mây, mặt ấn khắc sâu bốn chữ Triện thư cổ "Hoàng Đế Chi Bảo".',
    significance:
      'Biểu tượng tối thượng cho tính vĩnh cửu và sự tôn quý thanh cao của quốc gia Đại Nam thời kỳ cực thịnh.',
    craftingTechnique:
      'Nghệ thuật chạm khắc ngọc (jade carving) thủ công đòi hỏi sự kiên nhẫn phi thường. Từng đường vảy rồng, móng vuốt và nét chữ triện đều được mài bóng gương tinh khiết.',
    modelVisualHints: [
      'Núm rồng ngọc 5 móng uốn mình mềm mại với chất ngọc xanh lục bảo phát quang nhẹ.',
      'Mặt đáy ấn khắc chìm dòng chữ Hán triện thư cổ "Hoàng Đế Chi Bảo".',
      'Độ bóng kính hoàn hảo cho phép ánh sáng xuyên qua khối ngọc tạo màu biếc kỳ ảo.',
      'Đường chỉ viền đế ấn vuông vức sắc lẹm chuẩn mực hoàng gia.',
    ],
    suggestedQuestions: [
      'Ngọc ấn khác với ấn vàng như thế nào về công năng sử dụng trong triều đình?',
      'Khối ngọc bích xanh khổng lồ 6.8kg này có nguồn gốc xuất xứ từ đâu?',
      'Kỹ thuật chạm khắc ngọc bích thời cổ đại đòi hỏi những công cụ và kỹ năng gì?',
      'Tại sao bảo ấn này lại được coi là chứng nhân chuyển giao lịch sử năm 1945?',
    ],
    nodeId: 'NODE_B2B',
    modelType: 'jade_seal',
  },
  {
    id: 'A09',
    code: 'A09',
    name: 'Tượng Vũ nữ Chăm Pa múa Apsara',
    nameEn: 'Champa Sandstone Apsara Dancing Goddess',
    roomCode: 'F1',
    roomName: 'Gian Chăm Pa - Điêu Khắc Đá Sa Thạch',
    era: 'Vương quốc Chăm Pa (Thế kỷ X - Thời kỳ Trà Kiệu)',
    yearApprox: 'Khoảng năm 950 - 1000',
    material: 'Đá sa thạch hồng (Pink sandstone) khai thác từ vùng núi Quảng Nam',
    dimensions: 'Chiều cao: 110 cm, Chiều rộng bệ: 45 cm, Độ dày: 35 cm',
    weight: 'Khoảng 180 kg',
    excavationOrigin: 'Phát hiện tại quần thể đền tháp Trà Kiệu - Mỹ Sơn (Quảng Nam), được đưa về bảo tồn năm 1935.',
    preservationStatus: 'Bảo vật Quốc gia Điêu khắc Chăm, bề mặt đá giữ được các đường viền trang sức và nét mặt mỉm cười thanh tao.',
    nationalTreasureRank: 'Bảo vật Quốc gia Điêu khắc Đá',
    model3D: '/models/tuong_cham.glb',
    image: '/images/tuong-cham.jpg',
    audioIntro:
      'Chiêm ngưỡng pho tượng vũ nữ Apsara bằng đá sa thạch hồng thế kỷ 10 từ kinh đô Trà Kiệu. Tư thế uốn thân ba khúc Tribhanga duyên dáng cùng nụ cười huyền bí Chăm Pa đã làm say đắm biết bao thế hệ yêu nghệ thuật điêu khắc cổ.',
    audioDuration: 75,
    narrator: 'TS. Ngô Văn Doanh (Chuyên gia Văn hóa Chăm)',
    walkTime: '2-3 phút',
    walkDistanceMeters: 68,
    tags: ['Chăm Pa', 'Bảo vật Quốc gia', 'Điêu khắc đá', 'Apsara', 'Mỹ Sơn'],
    shortDescription: 'Tuyệt tác điêu khắc sa thạch hồng thể hiện vẻ đẹp nữ thần thanh thoát và điệu múa cung đình Chăm Pa.',
    fullStory:
      'Trong thần thoại Hindu giáo, Apsara là những vũ nữ thiên giới sinh ra từ cuộc khuấy biển sữa tìm thuốc trường sinh. Điệu múa của Apsara dâng lên các vị thần biểu hiện cho sự sinh sôi, niềm hoan lạc và vẻ đẹp vĩnh cửu của vũ trụ. Nghệ nhân Chăm Pa với đôi bàn tay tài hoa đã thổi hồn vào khối đá sa thạch vô tri, tạc nên bộ ngực căng tròn, vòng eo thắt đáy lưng ong, đôi chân uyển chuyển và chuỗi hạt cườm ngọc đung đưa theo từng nhịp múa.',
    significance:
      'Đại diện kiệt xuất cho phong cách Trà Kiệu - đỉnh cao của nền điêu khắc đá cổ điển vương quốc Chăm Pa.',
    craftingTechnique:
      'Đục đẽo nguyên khối từ đá sa thạch hồng bằng búa và đục sắt, sau đó dùng cát mịn và nước mài bóng bề mặt tạo cảm giác da thịt mềm mại.',
    modelVisualHints: [
      'Dáng múa Tribhanga kinh điển với thân trên ngả sang phải, hông đưa sang trái và đầu nghiêng nhẹ.',
      'Bộ trang phục váy mỏng Sampot xếp nếp uốn lượn giữa hai đùi.',
      'Khuôn mặt tròn trịa, đôi mắt hạnh nhân mở to và nụ cười mỉm Champa huyền bí.',
      'Vòng hoa cài trên búi tóc nhọn Kirita Mukuta và đôi vòng tay chạm trổ hoa văn.',
    ],
    suggestedQuestions: [
      'Điệu múa Tribhanga có ý nghĩa triết lý gì trong nghệ thuật điêu khắc Hindu?',
      'Chất liệu sa thạch hồng giúp nghệ nhân Chăm Pa thể hiện đường nét cơ thể như thế nào?',
      'Mối liên hệ giữa điêu khắc Chăm Pa tại Trà Kiệu với nghệ thuật Angkor và Ấn Độ?',
      'Các vũ nữ Apsara đóng vai trò gì trong nghi lễ tại các đền tháp Mỹ Sơn xưa?',
    ],
    nodeId: 'NODE_F1',
    modelType: 'apsara_statue',
  },
  {
    id: 'A10',
    code: 'A10',
    name: 'Rồng đất nung Hoàng Thành Thăng Long',
    nameEn: 'Terracotta Imperial Dragon of Thang Long Citadel',
    roomCode: 'G1',
    roomName: 'Gian Thăng Long - Rồng Bay Kinh Đô',
    era: 'Thời Lê Sơ (Thế kỷ XV)',
    yearApprox: 'Khoảng năm 1428 - 1460 (Điện Kính Thiên)',
    material: 'Đất nung phủ men xanh lục (Green celadon glaze) và men vàng thổ hoàng',
    dimensions: 'Chiều dài: 1.8 mét, Chiều cao: 0.65 mét, Chiều dày thân: 0.28 mét',
    weight: 'Khoảng 95 kg',
    excavationOrigin: 'Khai quật tại tầng văn hóa thời Lê ở khu di tích Trung tâm Hoàng thành Thăng Long (Hà Nội).',
    preservationStatus: 'Bảo vật Quốc gia Kiến trúc, lớp men ngọc xanh lục óng ánh, từng đường viền mào lửa vảy rồng sắc nét.',
    nationalTreasureRank: 'Bảo vật Quốc gia Kiến trúc Cung đình',
    model3D: '/models/rong_dat_nung.glb',
    image: '/images/rong-dat-nung.jpg',
    audioIntro:
      'Tượng rồng đất nung tráng men ngọc thời Lê sơ từng ngự trên đỉnh mái ngói Điện Kính Thiên - nơi vua thiết triều tại Hoàng thành Thăng Long. Thân rồng uốn lượn hình sin mạnh mẽ, đầu ngẩng cao uy dũng, biểu trưng cho quyền lực tối thượng của quân vương Đại Việt.',
    audioDuration: 72,
    narrator: 'TS. Bùi Minh Trí (Viện Nghiên Cứu Kinh Thành)',
    walkTime: '2-3 phút',
    walkDistanceMeters: 72,
    tags: ['Hoàng thành Thăng Long', 'Thời Lê Sơ', 'Bảo vật Quốc gia', 'Đất nung', 'Rồng Thăng Long'],
    shortDescription: 'Hiện vật đất nung cung đình đỉnh cao trang trí nóc điện ngọc Kính Thiên thế kỷ 15.',
    fullStory:
      'Kế thừa hình tượng rồng giun thanh thoát thời Lý - Trần, rồng thời Lê sơ mang khí phách hùng tráng, uy dũng của một vương triều vừa đánh tan giặc ngoại xâm. Thân rồng uốn lượn nhấp nhô như sóng lượn, chân có 5 móng vuốt sắc nhọn quặp chặt lấy mây trời, đầu rồng có sừng ngắn, mắt lồi uy nghiêm, bờm và mào lửa bay ngược về phía sau tạo nên cảm giác chuyển động dữ dội giữa không trung.',
    significance:
      'Minh chứng vật chất sống động cho kiến trúc hoàng cung tráng lệ và kỹ nghệ nung gạch ngói tráng men tuyệt đỉnh thời Lê sơ.',
    craftingTechnique:
      'Nặn tay kết hợp dập khuôn đất sét sông Hồng lọc sạch tạp chất, tráng men chì màu xanh ngọc lục bảo và nung ở nhiệt độ cao 1.150°C để men chảy bám đều.',
    modelVisualHints: [
      'Thân rồng uốn khúc hình sin nhấp nhô với hàng vảy rồng chạm nổi đều đặn.',
      'Đầu rồng ngẩng cao với mào lửa cuộn trào và đôi mắt thần mở to uy nghi.',
      'Màu men xanh lục celadon cổ điển óng ánh dưới ánh sáng đèn chiếu bảo tàng.',
      'Bệ ngói úp hình bán nguyệt bên dưới chân rồng gắn liền với kết cấu mái cung điện.',
    ],
    suggestedQuestions: [
      'Hình tượng rồng thời Lê sơ có điểm gì khác biệt so với rồng thời Lý - Trần?',
      'Công nghệ nung đất tráng men xanh lục của các lò gốm cung đình Thăng Long xưa?',
      'Vị trí của tượng rồng này trên nóc Điện Kính Thiên có ý nghĩa phong thủy gì?',
      'Các phát hiện khảo cổ học dưới lòng đất Hoàng thành Thăng Long đã hé lộ điều gì?',
    ],
    nodeId: 'NODE_G1',
    modelType: 'dragon_terracotta',
  },
]

// 4. HỆ THỐNG NÚT ĐỒ THỊ BẢN ĐỒ & PATHFINDING GRAPH DẪN ĐƯỜNG TOÀN DIỆN
export const MUSEUM_GRAPH_NODES: Record<string, WaypointNode> = {
  // LỐI VÀO CỔNG 1 (CHÍNH - MẶT ĐƯỜNG / THẢO CẦM VIÊN)
  NODE_ENTRANCE: { id: 'NODE_ENTRANCE', name: 'Cổng 1 - Lối Vào Chính (Bạn ở đây)', x: 600, y: 920, type: 'entrance', floor: 1 },
  NODE_TICKET_1: { id: 'NODE_TICKET_1', name: 'Quầy Bán Vé Cổng 1', x: 520, y: 890, type: 'amenity', floor: 1 },
  NODE_SHOP:     { id: 'NODE_SHOP',     name: 'Cửa Hàng Quà Lưu Niệm', x: 680, y: 890, type: 'amenity', floor: 1 },
  NODE_LOCKER:   { id: 'NODE_LOCKER',   name: 'Tủ Gửi Đồ Miễn Phí', x: 440, y: 890, type: 'amenity', floor: 1 },

  // CỔNG 2 (PHỐ NGUYỄN BỈNH KHIÊM) & QUẦY VÉ 2
  NODE_GATE_2:   { id: 'NODE_GATE_2',   name: 'Cổng 2 (Phố Nguyễn Bỉnh Khiêm)', x: 30, y: 430, type: 'entrance', floor: 1 },
  NODE_TICKET_2: { id: 'NODE_TICKET_2', name: 'Quầy Vé Cổng 2', x: 50, y: 490, type: 'amenity', floor: 1 },

  // SẢNH BÁT GIÁC TRUNG TÂM (ROTUNDA)
  NODE_LOBBY:      { id: 'NODE_LOBBY',      name: 'Bậc Thềm Sảnh Bát Giác', x: 600, y: 820, type: 'junction', floor: 1 },
  NODE_ROTUNDA:    { id: 'NODE_ROTUNDA',    name: 'Tâm Sảnh Bát Giác', x: 600, y: 680, type: 'junction', floor: 1 },
  NODE_ROTUNDA_W:  { id: 'NODE_ROTUNDA_W',  name: 'Hành Lang Tây Sảnh Bát Giác', x: 460, y: 680, type: 'hallway', floor: 1 },
  NODE_ROTUNDA_E:  { id: 'NODE_ROTUNDA_E',  name: 'Hành Lang Đông Sảnh Bát Giác', x: 740, y: 680, type: 'hallway', floor: 1 },

  // HÀNH LANG TÂY (WEST CORRIDOR)
  NODE_HALL_W_MAIN: { id: 'NODE_HALL_W_MAIN', name: 'Ngã Ba Hành Lang Tây', x: 300, y: 620, type: 'junction', floor: 1 },
  NODE_HALL_W_S:    { id: 'NODE_HALL_W_S',    name: 'Hành Lang Tây Nam', x: 300, y: 810, type: 'hallway', floor: 1 },
  NODE_HALL_W_N:    { id: 'NODE_HALL_W_N',    name: 'Hành Lang Tây Bắc', x: 300, y: 430, type: 'hallway', floor: 1 },

  // HÀNH LANG ĐÔNG (EAST CORRIDOR)
  NODE_HALL_E_MAIN: { id: 'NODE_HALL_E_MAIN', name: 'Ngã Ba Hành Lang Đông', x: 900, y: 620, type: 'junction', floor: 1 },
  NODE_HALL_E_S:    { id: 'NODE_HALL_E_S',    name: 'Hành Lang Đông Nam', x: 900, y: 810, type: 'hallway', floor: 1 },
  NODE_HALL_E_N:    { id: 'NODE_HALL_E_N',    name: 'Hành Lang Đông Bắc', x: 900, y: 430, type: 'hallway', floor: 1 },

  // SÂN VƯỜN TRUNG TÂM & QUẦY NƯỚC (COURTYARD GARDEN & REFRESHMENT)
  NODE_COURTYARD_S: { id: 'NODE_COURTYARD_S', name: 'Lối Vào Sân Vườn Giếng Trời', x: 600, y: 520, type: 'junction', floor: 1 },
  NODE_CAFE:        { id: 'NODE_CAFE',        name: 'Quầy Nước & Museum Café Sân Vườn', x: 600, y: 380, type: 'amenity', floor: 1 },
  NODE_COURTYARD_N: { id: 'NODE_COURTYARD_N', name: 'Hành Lang Phía Bắc Sân Vườn', x: 600, y: 260, type: 'junction', floor: 1 },

  // KHU VỆ SINH (WC)
  NODE_WC_W: { id: 'NODE_WC_W', name: 'Khu Vệ Sinh Tây (WC)', x: 320, y: 350, type: 'amenity', floor: 1 },
  NODE_WC_E: { id: 'NODE_WC_E', name: 'Khu Vệ Sinh Đông (WC)', x: 880, y: 350, type: 'amenity', floor: 1 },

  // CỬA VÀO 10 PHÒNG TRƯNG BÀY
  NODE_A1:  { id: 'NODE_A1',  name: 'Cửa Phòng A1 (Trống Đồng Đông Sơn)', x: 280, y: 620, type: 'room_door', floor: 1 },
  NODE_C1:  { id: 'NODE_C1',  name: 'Cửa Phòng C1 (Tượng Phật Quan Âm)', x: 280, y: 810, type: 'room_door', floor: 1 },
  NODE_C2:  { id: 'NODE_C2',  name: 'Cửa Phòng C2 (Chuông Thiên Mụ)', x: 280, y: 430, type: 'room_door', floor: 1 },

  NODE_B2:  { id: 'NODE_B2',  name: 'Cửa Phòng B2 (Ấn Vàng Sắc Mệnh)', x: 440, y: 620, type: 'room_door', floor: 1 },
  NODE_B2B: { id: 'NODE_B2B', name: 'Cửa Phòng B2B (Ngọc Ấn Hoàng Đế)', x: 440, y: 810, type: 'room_door', floor: 1 },
  NODE_B3:  { id: 'NODE_B3',  name: 'Cửa Phòng B3 (Mũ Quan Nhất Phẩm)', x: 760, y: 620, type: 'room_door', floor: 1 },
  NODE_E1:  { id: 'NODE_E1',  name: 'Cửa Phòng E1 (Kiếm Thuận Thiên Lê Lợi)', x: 600, y: 240, type: 'room_door', floor: 1 },

  NODE_D3:  { id: 'NODE_D3',  name: 'Cửa Phòng D3 (Bình Gốm Hoa Lam)', x: 920, y: 620, type: 'room_door', floor: 1 },
  NODE_F1:  { id: 'NODE_F1',  name: 'Cửa Phòng F1 (Tượng Vũ Nữ Chăm Pa)', x: 920, y: 430, type: 'room_door', floor: 1 },
  NODE_G1:  { id: 'NODE_G1',  name: 'Cửa Phòng G1 (Rồng Đất Nung Thăng Long)', x: 920, y: 810, type: 'room_door', floor: 1 },
}

export const MUSEUM_GRAPH_EDGES: WaypointEdge[] = [
  // CỔNG 1 VÀO SẢNH
  { from: 'NODE_ENTRANCE', to: 'NODE_TICKET_1' },
  { from: 'NODE_ENTRANCE', to: 'NODE_SHOP' },
  { from: 'NODE_ENTRANCE', to: 'NODE_LOCKER' },
  { from: 'NODE_TICKET_1', to: 'NODE_LOBBY' },
  { from: 'NODE_SHOP',     to: 'NODE_LOBBY' },
  { from: 'NODE_LOCKER',   to: 'NODE_LOBBY' },
  { from: 'NODE_ENTRANCE', to: 'NODE_LOBBY' },

  // CỔNG 2 NỐI HÀNH LANG TÂY
  { from: 'NODE_GATE_2',   to: 'NODE_TICKET_2' },
  { from: 'NODE_TICKET_2', to: 'NODE_HALL_W_N' },
  { from: 'NODE_GATE_2',   to: 'NODE_HALL_W_N' },

  // SẢNH BÁT GIÁC
  { from: 'NODE_LOBBY',     to: 'NODE_ROTUNDA' },
  { from: 'NODE_ROTUNDA',   to: 'NODE_ROTUNDA_W' },
  { from: 'NODE_ROTUNDA',   to: 'NODE_ROTUNDA_E' },
  { from: 'NODE_ROTUNDA',   to: 'NODE_COURTYARD_S' },

  // NỐI ROTUNDA SANG CÁC PHÒNG TRUNG TÂM
  { from: 'NODE_ROTUNDA_W', to: 'NODE_B2' },
  { from: 'NODE_ROTUNDA_W', to: 'NODE_HALL_W_MAIN' },
  { from: 'NODE_ROTUNDA_E', to: 'NODE_B3' },
  { from: 'NODE_ROTUNDA_E', to: 'NODE_HALL_E_MAIN' },

  // TRỤC HÀNH LANG TÂY (A1, C1, C2, B2B, WC TÂY)
  { from: 'NODE_HALL_W_MAIN', to: 'NODE_A1' },
  { from: 'NODE_HALL_W_MAIN', to: 'NODE_HALL_W_S' },
  { from: 'NODE_HALL_W_MAIN', to: 'NODE_HALL_W_N' },
  { from: 'NODE_HALL_W_S',    to: 'NODE_C1' },
  { from: 'NODE_HALL_W_S',    to: 'NODE_B2B' },
  { from: 'NODE_HALL_W_N',    to: 'NODE_C2' },
  { from: 'NODE_HALL_W_N',    to: 'NODE_WC_W' },

  // TRỤC HÀNH LANG ĐÔNG (D3, G1, F1, WC ĐÔNG)
  { from: 'NODE_HALL_E_MAIN', to: 'NODE_D3' },
  { from: 'NODE_HALL_E_MAIN', to: 'NODE_HALL_E_S' },
  { from: 'NODE_HALL_E_MAIN', to: 'NODE_HALL_E_N' },
  { from: 'NODE_HALL_E_S',    to: 'NODE_G1' },
  { from: 'NODE_HALL_E_N',    to: 'NODE_F1' },
  { from: 'NODE_HALL_E_N',    to: 'NODE_WC_E' },

  // SÂN VƯỜN GIẾNG TRỜI & CAFE NỐI VỚI GIAN BẮC (E1)
  { from: 'NODE_COURTYARD_S', to: 'NODE_CAFE' },
  { from: 'NODE_CAFE',        to: 'NODE_COURTYARD_N' },
  { from: 'NODE_COURTYARD_N', to: 'NODE_E1' },
  { from: 'NODE_WC_W',        to: 'NODE_COURTYARD_N' },
  { from: 'NODE_WC_E',        to: 'NODE_COURTYARD_N' },
]

// THUẬT TOÁN A* DẪN ĐƯỜNG CHÍNH XÁC
export function calculateShortestPath(
  startNodeId: string,
  endNodeId: string
): { pathNodes: WaypointNode[]; totalDistanceMeters: number; stepInstructions: string[] } | null {
  const start = MUSEUM_GRAPH_NODES[startNodeId]
  const end = MUSEUM_GRAPH_NODES[endNodeId]
  if (!start || !end) return null

  if (startNodeId === endNodeId) {
    return {
      pathNodes: [start],
      totalDistanceMeters: 0,
      stepInstructions: ['Quý khách đang ở ngay tại vị trí này.'],
    }
  }

  // Adjacency Map
  const adj: Record<string, string[]> = {}
  Object.keys(MUSEUM_GRAPH_NODES).forEach((k) => (adj[k] = []))
  MUSEUM_GRAPH_EDGES.forEach(({ from, to }) => {
    if (adj[from] && adj[to]) {
      adj[from].push(to)
      adj[to].push(from)
    }
  })

  const distance = (a: WaypointNode, b: WaypointNode) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const openSet = new Set<string>([startNodeId])
  const cameFrom: Record<string, string> = {}
  const gScore: Record<string, number> = {}
  const fScore: Record<string, number> = {}

  Object.keys(MUSEUM_GRAPH_NODES).forEach((id) => {
    gScore[id] = Infinity
    fScore[id] = Infinity
  })
  gScore[startNodeId] = 0
  fScore[startNodeId] = distance(start, end)

  while (openSet.size > 0) {
    let currentId = ''
    let lowestF = Infinity
    openSet.forEach((id) => {
      if (fScore[id] < lowestF) {
        lowestF = fScore[id]
        currentId = id
      }
    })

    if (currentId === endNodeId) {
      const pathNodes: WaypointNode[] = []
      let curr = currentId
      while (curr) {
        pathNodes.unshift(MUSEUM_GRAPH_NODES[curr])
        curr = cameFrom[curr]
      }

      const stepInstructions: string[] = []
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const fromNode = pathNodes[i]
        const toNode = pathNodes[i + 1]
        stepInstructions.push(`Từ ${fromNode.name} → đi tiếp đến ${toNode.name}`)
      }

      const totalPixels = gScore[endNodeId]
      const totalDistanceMeters = Math.max(12, Math.round(totalPixels / 9))

      return {
        pathNodes,
        totalDistanceMeters,
        stepInstructions,
      }
    }

    openSet.delete(currentId)
    const neighbors = adj[currentId] || []
    for (const neighborId of neighbors) {
      const neighborNode = MUSEUM_GRAPH_NODES[neighborId]
      const tentativeG = gScore[currentId] + distance(MUSEUM_GRAPH_NODES[currentId], neighborNode)
      if (tentativeG < gScore[neighborId]) {
        cameFrom[neighborId] = currentId
        gScore[neighborId] = tentativeG
        fScore[neighborId] = tentativeG + distance(neighborNode, end)
        openSet.add(neighborId)
      }
    }
  }

  return null
}

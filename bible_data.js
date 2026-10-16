/**
 * MAGNIFICATEDU - BIBLE & CATECHISM INTERACTIVE GAME DATABASE
 * Trích xuất & tổng hợp từ: Kinh Thánh Trọn Bộ Cựu Ước & Tân Ước
 * Nhóm Phiên Dịch Các Giờ Kinh Phụng Vụ (NPD-CGKPV)
 * Dành riêng cho hệ thống Giáo Lý Công Giáo & Thiếu Nhi Thánh Thể
 */

window.BIBLE_GAME_DATA = {
  meta: {
    source: "Kinh Thánh Trọn Bộ Cựu Ước & Tân Ước (73 Sách)",
    translator: "Nhóm Phiên Dịch Các Giờ Kinh Phụng Vụ",
    totalBooks: 73,
    oldTestamentCount: 46,
    newTestamentCount: 27,
    version: "2026.1.0"
  },

  // 73 SÁCH KINH THÁNH CÔNG GIÁO
  books: [
    // NGŨ THƯ (5 SÁCH)
    { id: 'st', name: 'Sáng Thế', abbr: 'St', testament: 'old', group: 'Ngũ Thư', chapters: 50, icon: 'fa-earth-americas' },
    { id: 'xh', name: 'Xuất Hành', abbr: 'Xh', testament: 'old', group: 'Ngũ Thư', chapters: 40, icon: 'fa-person-walking-luggage' },
    { id: 'lv', name: 'Lê-vi', abbr: 'Lv', testament: 'old', group: 'Ngũ Thư', chapters: 27, icon: 'fa-fire-burner' },
    { id: 'ds', name: 'Dân Số', abbr: 'Ds', testament: 'old', group: 'Ngũ Thư', chapters: 36, icon: 'fa-users' },
    { id: 'dnl', name: 'Đệ Nhị Luật', abbr: 'Đnl', testament: 'old', group: 'Ngũ Thư', chapters: 34, icon: 'fa-scroll' },
    // LỊCH SỬ (16 SÁCH)
    { id: 'gs', name: 'Giô-suê', abbr: 'Gs', testament: 'old', group: 'Lịch Sử', chapters: 24, icon: 'fa-shield-halved' },
    { id: 'tl', name: 'Thủ Lãnh', abbr: 'Tl', testament: 'old', group: 'Lịch Sử', chapters: 21, icon: 'fa-gavel' },
    { id: 'rt', name: 'Rút', abbr: 'Rt', testament: 'old', group: 'Lịch Sử', chapters: 4, icon: 'fa-wheat-awn' },
    { id: '1sm', name: '1 Sa-mu-en', abbr: '1Sm', testament: 'old', group: 'Lịch Sử', chapters: 31, icon: 'fa-crown' },
    { id: '2sm', name: '2 Sa-mu-en', abbr: '2Sm', testament: 'old', group: 'Lịch Sử', chapters: 24, icon: 'fa-landmark' },
    { id: '1v', name: '1 Vua', abbr: '1V', testament: 'old', group: 'Lịch Sử', chapters: 22, icon: 'fa-gem' },
    { id: '2v', name: '2 Vua', abbr: '2V', testament: 'old', group: 'Lịch Sử', chapters: 25, icon: 'fa-chess-rook' },
    { id: '1sb', name: '1 Sử Biên Niên', abbr: '1Sb', testament: 'old', group: 'Lịch Sử', chapters: 29, icon: 'fa-book-atlas' },
    { id: '2sb', name: '2 Sử Biên Niên', abbr: '2Sb', testament: 'old', group: 'Lịch Sử', chapters: 36, icon: 'fa-feather' },
    { id: 'er', name: 'Ét-ra', abbr: 'Er', testament: 'old', group: 'Lịch Sử', chapters: 10, icon: 'fa-archway' },
    { id: 'nk', name: 'Nơ-khe-mi-a', abbr: 'Nk', testament: 'old', group: 'Lịch Sử', chapters: 13, icon: 'fa-trowel-bricks' },
    { id: 'tb', name: 'Tô-bi-a', abbr: 'Tb', testament: 'old', group: 'Lịch Sử', chapters: 14, icon: 'fa-eye' },
    { id: 'gd', name: 'Giu-đi-tha', abbr: 'Gđ', testament: 'old', group: 'Lịch Sử', chapters: 16, icon: 'fa-hand-fist' },
    { id: 'et', name: 'Ét-te', abbr: 'Et', testament: 'old', group: 'Lịch Sử', chapters: 10, icon: 'fa-ribbon' },
    { id: '1mcb', name: '1 Ma-ca-bê', abbr: '1Mcb', testament: 'old', group: 'Lịch Sử', chapters: 16, icon: 'fa-torah' },
    { id: '2mcb', name: '2 Ma-ca-bê', abbr: '2Mcb', testament: 'old', group: 'Lịch Sử', chapters: 15, icon: 'fa-fire' },
    // KHÔN NGOAN & THÁNH VỊNH (7 SÁCH)
    { id: 'gp', name: 'Gióp', abbr: 'G', testament: 'old', group: 'Khôn Ngoan', chapters: 42, icon: 'fa-person-praying' },
    { id: 'tv', name: 'Thánh Vịnh', abbr: 'Tv', testament: 'old', group: 'Khôn Ngoan', chapters: 150, icon: 'fa-music' },
    { id: 'cn', name: 'Châm Ngôn', abbr: 'Cn', testament: 'old', group: 'Khôn Ngoan', chapters: 31, icon: 'fa-lightbulb' },
    { id: 'gv', name: 'Giảng Viên', abbr: 'Gv', testament: 'old', group: 'Khôn Ngoan', chapters: 12, icon: 'fa-hourglass-half' },
    { id: 'dc', name: 'Diễm Ca', abbr: 'Dc', testament: 'old', group: 'Khôn Ngoan', chapters: 8, icon: 'fa-heart' },
    { id: 'kn', name: 'Khôn Ngoan', abbr: 'Kn', testament: 'old', group: 'Khôn Ngoan', chapters: 19, icon: 'fa-compass' },
    { id: 'hc', name: 'Huấn Ca', abbr: 'Hc', testament: 'old', group: 'Khôn Ngoan', chapters: 51, icon: 'fa-chalkboard-user' },
    // NGÔN SỨ (18 SÁCH)
    { id: 'is', name: 'I-sai-a', abbr: 'Is', testament: 'old', group: 'Ngôn Sứ', chapters: 66, icon: 'fa-sun' },
    { id: 'gr', name: 'Giê-rê-mi-a', abbr: 'Gr', testament: 'old', group: 'Ngôn Sứ', chapters: 52, icon: 'fa-droplet' },
    { id: 'ac', name: 'Ai Ca', abbr: 'Ac', testament: 'old', group: 'Ngôn Sứ', chapters: 5, icon: 'fa-face-sad-tear' },
    { id: 'br', name: 'Ba-rúc', abbr: 'Br', testament: 'old', group: 'Ngôn Sứ', chapters: 6, icon: 'fa-scroll' },
    { id: 'ez', name: 'Ê-dê-ki-en', abbr: 'Ed', testament: 'old', group: 'Ngôn Sứ', chapters: 48, icon: 'fa-dove' },
    { id: 'dn', name: 'Đa-ni-en', abbr: 'Đn', testament: 'old', group: 'Ngôn Sứ', chapters: 14, icon: 'fa-shield-cat' },
    { id: 'hs', name: 'Hô-sê', abbr: 'Hs', testament: 'old', group: 'Ngôn Sứ', chapters: 14, icon: 'fa-heart-circle-bolt' },
    { id: 'ge', name: 'Gió-en', abbr: 'Ge', testament: 'old', group: 'Ngôn Sứ', chapters: 4, icon: 'fa-cloud-showers-heavy' },
    { id: 'am', name: 'A-mốt', abbr: 'Am', testament: 'old', group: 'Ngôn Sứ', chapters: 9, icon: 'fa-scale-balanced' },
    { id: 'ob', name: 'Ô-va-đi-a', abbr: 'Ôv', testament: 'old', group: 'Ngôn Sứ', chapters: 1, icon: 'fa-mountain' },
    { id: 'gn', name: 'Giô-na', abbr: 'Gn', testament: 'old', group: 'Ngôn Sứ', chapters: 4, icon: 'fa-fish' },
    { id: 'mi', name: 'Mi-kha', abbr: 'Mk', testament: 'old', group: 'Ngôn Sứ', chapters: 7, icon: 'fa-star' },
    { id: 'na', name: 'Na-khum', abbr: 'Na', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-bolt' },
    { id: 'kb', name: 'Kha-ba-cúc', abbr: 'Kb', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-mountain-sun' },
    { id: 'xp', name: 'Xô-phô-ni-a', abbr: 'Xp', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-bullhorn' },
    { id: 'kg', name: 'Khác-gai', abbr: 'Kg', testament: 'old', group: 'Ngôn Sứ', chapters: 2, icon: 'fa-church' },
    { id: 'dc_ns', name: 'Da-ca-ri-a', abbr: 'Dcr', testament: 'old', group: 'Ngôn Sứ', chapters: 14, icon: 'fa-hands-holding-circle' },
    { id: 'ml', name: 'Ma-la-khi', abbr: 'Ml', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-fire-flame-curved' },

    // TÂN ƯỚC (27 SÁCH)
    // 4 PHÚC ÂM & TÔNG ĐỒ CÔNG VỤ
    { id: 'mt', name: 'Mát-thêu', abbr: 'Mt', testament: 'new', group: 'Tin Mừng', chapters: 28, icon: 'fa-cross' },
    { id: 'mc', name: 'Mác-cô', abbr: 'Mc', testament: 'new', group: 'Tin Mừng', chapters: 16, icon: 'fa-shield-halved' },
    { id: 'lc', name: 'Lu-ca', abbr: 'Lc', testament: 'new', group: 'Tin Mừng', chapters: 24, icon: 'fa-heart' },
    { id: 'ga', name: 'Gio-an', abbr: 'Ga', testament: 'new', group: 'Tin Mừng', chapters: 21, icon: 'fa-dove' },
    { id: 'cv', name: 'Tông Đồ Công Vụ', abbr: 'Cv', testament: 'new', group: 'Lịch Sử HT', chapters: 28, icon: 'fa-fire' },
    // THƯ THÁNH PHAOLÔ (14 THƯ)
    { id: 'rm', name: 'Rô-ma', abbr: 'Rm', testament: 'new', group: 'Thư Phaolô', chapters: 16, icon: 'fa-envelope' },
    { id: '1cr', name: '1 Cô-rin-tô', abbr: '1Cr', testament: 'new', group: 'Thư Phaolô', chapters: 16, icon: 'fa-hand-holding-heart' },
    { id: '2cr', name: '2 Cô-rin-tô', abbr: '2Cr', testament: 'new', group: 'Thư Phaolô', chapters: 13, icon: 'fa-envelope-open-text' },
    { id: 'gl', name: 'Ga-lát', abbr: 'Gl', testament: 'new', group: 'Thư Phaolô', chapters: 6, icon: 'fa-feather' },
    { id: 'ep', name: 'Ê-phê-xô', abbr: 'Ep', testament: 'new', group: 'Thư Phaolô', chapters: 6, icon: 'fa-shield' },
    { id: 'pl', name: 'Phi-líp-phê', abbr: 'Pl', testament: 'new', group: 'Thư Phaolô', chapters: 4, icon: 'fa-face-smile' },
    { id: 'cl', name: 'Cô-lô-xê', abbr: 'Cl', testament: 'new', group: 'Thư Phaolô', chapters: 4, icon: 'fa-link' },
    { id: '1ts', name: '1 Thê-xa-lô-ni-ca', abbr: '1Ts', testament: 'new', group: 'Thư Phaolô', chapters: 5, icon: 'fa-bell' },
    { id: '2ts', name: '2 Thê-xa-lô-ni-ca', abbr: '2Ts', testament: 'new', group: 'Thư Phaolô', chapters: 3, icon: 'fa-hourglass' },
    { id: '1tm', name: '1 Ti-mô-thê', abbr: '1Tm', testament: 'new', group: 'Thư Phaolô', chapters: 6, icon: 'fa-user-tie' },
    { id: '2tm', name: '2 Ti-mô-thê', abbr: '2Tm', testament: 'new', group: 'Thư Phaolô', chapters: 4, icon: 'fa-medal' },
    { id: 'tt', name: 'Ti-tô', abbr: 'Tt', testament: 'new', group: 'Thư Phaolô', chapters: 3, icon: 'fa-clipboard-check' },
    { id: 'plm', name: 'Phi-lê-môn', abbr: 'Plm', testament: 'new', group: 'Thư Phaolô', chapters: 1, icon: 'fa-handshake' },
    { id: 'dt', name: 'Do-thái', abbr: 'Dt', testament: 'new', group: 'Thư Phaolô', chapters: 13, icon: 'fa-place-of-worship' },
    // THƯ CHUNG (7 THƯ)
    { id: 'gc', name: 'Gia-cô-bê', abbr: 'Gc', testament: 'new', group: 'Thư Chung', chapters: 5, icon: 'fa-hands' },
    { id: '1pr', name: '1 Phê-rô', abbr: '1Pr', testament: 'new', group: 'Thư Chung', chapters: 5, icon: 'fa-key' },
    { id: '2pr', name: '2 Phê-rô', abbr: '2Pr', testament: 'new', group: 'Thư Chung', chapters: 3, icon: 'fa-anchor' },
    { id: '1ga', name: '1 Gio-an', abbr: '1Ga', testament: 'new', group: 'Thư Chung', chapters: 5, icon: 'fa-heart' },
    { id: '2ga', name: '2 Gio-an', abbr: '2Ga', testament: 'new', group: 'Thư Chung', chapters: 1, icon: 'fa-heart-pulse' },
    { id: '3ga', name: '3 Gio-an', abbr: '3Ga', testament: 'new', group: 'Thư Chung', chapters: 1, icon: 'fa-hands-holding-child' },
    { id: 'gd_tc', name: 'Giu-đa', abbr: 'Gđ', testament: 'new', group: 'Thư Chung', chapters: 1, icon: 'fa-shield-halved' },
    // KHẢI HUYỀN (1 SÁCH)
    { id: 'kh', name: 'Khải Huyền', abbr: 'Kh', testament: 'new', group: 'Khải Huyền', chapters: 22, icon: 'fa-city' }
  ],

  // CÁC CÂU LỜI CHÚA VÀNG (GOLDEN BIBLE VERSES)
  verses: [
    {
      ref: "Ga 3, 16",
      text: "Thiên Chúa yêu thế gian đến nỗi đã ban Con Một, để ai tin vào Con của Người thì khỏi phải chết, nhưng được sống muôn đời.",
      theme: "Tình Yêu Cứu Độ"
    },
    {
      ref: "Ga 14, 6",
      text: "Thầy là con đường, là sự thật và là sự sống. Không ai đến với Chúa Cha mà không qua Thầy.",
      theme: "Chúa Giê-su"
    },
    {
      ref: "Tv 23, 1",
      text: "Chúa là mục tử chăn dắt tôi, tôi chẳng thiếu thốn gì.",
      theme: "Mục Tử Nhân Lành"
    },
    {
      ref: "Mt 11, 28",
      text: "Tất cả những ai đang vất vả mang gánh nặng nề, hãy đến cùng tôi, tôi sẽ cho nghỉ ngơi bồi dưỡng.",
      theme: "Bình An & An Nghỉ"
    },
    {
      ref: "1 Cr 13, 13",
      text: "Hiện nay đức tin, đức cậy, đức mến, cả ba đều tồn tại, nhưng cao trọng hơn cả là đức mến.",
      theme: "Đức Mến"
    },
    {
      ref: "Pl 4, 13",
      text: "Với Đấng ban sức mạnh cho tôi, tôi chịu được hết mọi sự.",
      theme: "Sức Mạnh & Niềm Tin"
    },
    {
      ref: "Mt 5, 8",
      text: "Phúc thay ai có tâm hồn trong sạch, vì họ sẽ được nhìn thấy Thiên Chúa.",
      theme: "Bát Phúc"
    },
    {
      ref: "Mt 28, 20",
      text: "Và đây, Thầy ở cùng anh em mọi ngày cho đến tận thế.",
      theme: "Lời Hứa Của Chúa"
    },
    {
      ref: "Ga 15, 12",
      text: "Đây là điều răn của Thầy: anh em hãy yêu thương nhau như Thầy đã yêu thương anh em.",
      theme: "Giới Răn Yêu Thương"
    },
    {
      ref: "Lc 1, 38",
      text: "Vâng, tôi đây là nữ tỳ của Chúa, xin Chúa cứ làm cho tôi như lời sứ thần nói.",
      theme: "Đức Mẹ Xin Vâng"
    }
  ],

  // BỘ CÂU HỎI TRẮC NGHIỆM ĐỐ VUI KINH THÁNH & GIÁO LÝ
  // Thiết kế chuyên biệt cho Game Camera AI Nghiêng Đầu (A - Trái vs B - Phải)
  tiltQuestions: [
    {
      id: 1,
      category: "Cựu Ước",
      question: "Ai là người đã vâng lệnh Chúa đóng con tàu lớn để cứu gia đình và các loài vật khỏi nạn hồng thủy?",
      optionA: "Ông Nô-ê",
      optionB: "Ông Môi-sê",
      correct: "A",
      explanation: "Chính ông Nô-ê đã đóng con tàu lớn theo lệnh Thiên Chúa (Sáng Thế 6)."
    },
    {
      id: 2,
      category: "Cựu Ước",
      question: "Cậu bé mục đồng Đa-vít đã dùng vũ khí gì để hạ gục tên khổng lồ Gô-li-át?",
      optionA: "Cung tên lửa",
      optionB: "Cái ná và viên sỏi",
      correct: "B",
      explanation: "Đa-vít chỉ dùng một cái ná ném đá và viên sỏi nhỏ để hạ Gô-li-át (1 Sa-mu-en 17)."
    },
    {
      id: 3,
      category: "Tân Ước",
      question: "Chúa Giê-su sinh ra tại thành phố nào?",
      optionA: "Bê-lem",
      optionB: "Na-da-rét",
      correct: "A",
      explanation: "Chúa Giê-su sinh ra tại Belem miền Giu-đê (Mát-thêu 2, 1)."
    },
    {
      id: 4,
      category: "Tân Ước",
      question: "Phép lạ đầu tiên Chúa Giê-su thực hiện là gì?",
      optionA: "Đi trên mặt nước",
      optionB: "Hóa nước thành rượu tại tiệc cưới Ca-na",
      correct: "B",
      explanation: "Theo lời chuyển cầu của Mẹ Maria, Chúa hóa nước thành rượu tại tiệc cưới Ca-na (Gioan 2)."
    },
    {
      id: 5,
      category: "Bí Tích",
      question: "Bí tích nào là cửa ngõ dẫn vào Hội Thánh, xóa bỏ tội tổ tông?",
      optionA: "Bí tích Rửa Tội",
      optionB: "Bí tích Thêm Sức",
      correct: "A",
      explanation: "Bí tích Rửa Tội là bí tích khai tâm đầu tiên, tẩy sạch tội tổ tông và đón nhận ta làm con Chúa."
    },
    {
      id: 6,
      category: "Bí Tích",
      question: "Chúa Giê-su đã thiết lập Bí tích Thánh Thể trong dịp nào?",
      optionA: "Bữa tiệc ly trước cuộc khổ nạn",
      optionB: "Sau khi sống lại bên bờ hồ",
      correct: "A",
      explanation: "Chúa thiết lập Bí tích Thánh Thể và Chức Linh Mục trong Bữa Tiệc Ly (Lu-ca 22)."
    },
    {
      id: 7,
      category: "Kinh Thánh",
      question: "Kinh Thánh Công Giáo trọn bộ có tất cả bao nhiêu cuốn sách?",
      optionA: "66 cuốn",
      optionB: "73 cuốn (46 Cựu Ước & 27 Tân Ước)",
      correct: "B",
      explanation: "Kinh Thánh Công Giáo gồm 73 cuốn sách (46 Cựu Ước và 27 Tân Ước)."
    },
    {
      id: 8,
      category: "Phúc Âm",
      question: "Bốn Thánh Sử viết 4 sách Tin Mừng là những vị nào?",
      optionA: "Mát-thêu, Mác-cô, Lu-ca, Gio-an",
      optionB: "Phê-rô, Phao-lô, Gia-cô-bê, Giu-đa",
      correct: "A",
      explanation: "Bốn Thánh sử là: Mát-thêu, Mác-cô, Lu-ca và Gio-an."
    },
    {
      id: 9,
      category: "Cựu Ước",
      question: "Thiên Chúa đã ban 10 Điều Răn cho dân Do Thái qua ai trên núi Si-nai?",
      optionA: "Ông Áp-ra-ham",
      optionB: "Ông Môi-sê",
      correct: "B",
      explanation: "Thiên Chúa ban Hai Bia Đá ghi Mười Điều Răn qua ông Môi-sê trên núi Si-nai (Xuất Hành 20)."
    },
    {
      id: 10,
      category: "Tân Ước",
      question: "Ai là Tông Đồ trưởng được Chúa Giê-su trao chìa khóa Nước Trời?",
      optionA: "Thánh Phê-rô",
      optionB: "Thánh Phao-lô",
      correct: "A",
      explanation: "Chúa nói: 'Con là Đá, trên đá này Thầy sẽ xây Hội Thánh của Thầy... Thầy trao chìa khóa Nước Trời cho con' (Mt 16, 18-19)."
    },
    {
      id: 11,
      category: "Đức Mẹ",
      question: "Sứ thần nào đã đến truyền tin cho Đức Mẹ rằng Người sẽ cưu mang Con Thiên Chúa?",
      optionA: "Sứ thần Mi-ca-e",
      optionB: "Sứ thần Gáp-ri-en",
      correct: "B",
      explanation: "Sứ thần Gáp-ri-en được Thiên Chúa sai đến thành Na-da-rét gặp trinh nữ Maria (Lu-ca 1, 26)."
    },
    {
      id: 12,
      category: "Giáo Lý",
      question: "Điều răn lớn nhất trong Đạo Công Giáo tóm lại là gì?",
      optionA: "Kính Chúa và Yêu Người",
      optionB: "Giữ chay và Đọc kinh",
      correct: "A",
      explanation: "Mến Chúa trên hết mọi sự và yêu người như chính mình là cốt lõi của Lề Luật (Mt 22, 37-39)."
    },
    {
      id: 13,
      category: "Phép Lạ",
      question: "Khi thấy đám đông đói lả nơi hoang địa, Chúa Giê-su đã hóa bánh ra nhiều từ bao nhiêu chiếc bánh và con cá?",
      optionA: "5 chiếc bánh và 2 con cá",
      optionB: "7 chiếc bánh và 5 con cá",
      correct: "A",
      explanation: "Chúa tạ ơn, bẻ ra từ 5 chiếc bánh và 2 con cá cho hơn 5000 người ăn no nê (Mt 14)."
    },
    {
      id: 14,
      category: "Thánh Thể",
      question: "Bánh và Rượu trong Thánh Lễ sau lời truyền phép sẽ trở thành gì?",
      optionA: "Biểu tượng thánh thiện",
      optionB: "Thịt và Máu thật của Chúa Giê-su",
      correct: "B",
      explanation: "Bí tích Thánh Thể biến đổi bản thể bánh rượu trở thành Mình và Máu thật của Đức Kitô."
    },
    {
      id: 15,
      category: "Cựu Ước",
      question: "Ai được tôn xưng là 'Người Cha của các kẻ tin'?",
      optionA: "Tổ phụ Áp-ra-ham",
      optionB: "Vua Sa-lô-môn",
      correct: "A",
      explanation: "Áp-ra-ham đã tuyệt đối vâng phục và tin cậy Thiên Chúa nên được gọi là Cha của kẻ tin."
    },
    {
      id: 16,
      category: "Tân Ước",
      question: "Ai là vị ngôn sứ đã làm phép rửa cho Chúa Giê-su tại sông Gio-đan?",
      optionA: "Thánh Gio-an Tẩy Giả",
      optionB: "Thánh Cả Giu-se",
      correct: "A",
      explanation: "Gioan Tiền Hô đã làm phép rửa cho Chúa Giê-su tại sông Gio-đan (Mt 3, 13)."
    },
    {
      id: 17,
      category: "Mùa Phụng Vụ",
      question: "Màu áo lễ trắng trong Phụng vụ biểu hiện cho điều gì?",
      optionA: "Niềm vui mừng, chiến thắng và sự phục sinh vinh hiển",
      optionB: "Sự sám hối, ăn năn và hy sinh",
      correct: "A",
      explanation: "Màu trắng dùng trong mùa Giáng Sinh, Phục Sinh biểu lộ niềm vui mừng và sự sống mới."
    },
    {
      id: 18,
      category: "Giáo Lý",
      question: "Hội Thánh Công Giáo có tất cả bao nhiêu Bí Tích?",
      optionA: "7 Bí Tích",
      optionB: "10 Bí Tích",
      correct: "A",
      explanation: "Bảy Bí tích: Rửa Tội, Thêm Sức, Thánh Thể, Giao Hòa, Xức Dầu Bệnh Nhân, Truyền Chức Thánh, Hôn Phối."
    },
    {
      id: 19,
      category: "TNTT",
      question: "Khẩu hiệu nền tảng của Phong trào Thiếu Nhi Thánh Thể là gì?",
      optionA: "Cầu nguyện - Rước Lễ - Hy sinh - Làm Tông đồ",
      optionB: "Học tập - Vui chơi - Rèn luyện - Tiến bước",
      correct: "A",
      explanation: "Bốn tôn chỉ của Thiếu Nhi Thánh Thể: Cầu nguyện, Rước Lễ, Hy sinh và Làm Tông đồ."
    },
    {
      id: 20,
      category: "Tân Ước",
      question: "Sau khi sống lại, Chúa Giê-su đã hiện ra và ở lại với các Tông Đồ bao nhiêu ngày trước khi lên trời?",
      optionA: "40 ngày",
      optionB: "50 ngày",
      correct: "A",
      explanation: "Chúa phục sinh hiện ra trong suốt 40 ngày dạy dỗ các Tông Đồ rồi Người lên trời (Cv 1, 3)."
    }
  ],

  // THẺ BÀI CHIBI CÔNG GIÁO CHO GAME LẬT HÌNH TRÍ NHỚ (BIBLE MEMORY PAIRS)
  memoryCards: [
    {
      id: 'jesus',
      name: 'Chúa Giê-su Mục Tử',
      title: 'Mục Tử Nhân Lành',
      quote: 'Tôi là mục tử nhân lành. Tôi biết chiên của tôi và chiên của tôi biết tôi. (Ga 10, 14)',
      icon: 'fa-cross',
      color: '#eab308'
    },
    {
      id: 'mary',
      name: 'Đức Mẹ Maria',
      title: 'Mẹ Hằng Cứu Giúp',
      quote: 'Linh hồn tôi ngợi khen Đức Chúa, thần trí tôi hớn hở vui mừng. (Lc 1, 46)',
      icon: 'fa-star',
      color: '#0284c7'
    },
    {
      id: 'joseph',
      name: 'Thánh Cả Giu-se',
      title: 'Bạn Trăm Năm Đức Mẹ',
      quote: 'Người công chính, luôn âm thầm gìn giữ Thánh Gia Thất.',
      icon: 'fa-hammer',
      color: '#d97706'
    },
    {
      id: 'angel',
      name: 'Sứ Thần Gáp-ri-en',
      title: 'Thiên Thần Truyền Tin',
      quote: 'Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà! (Lc 1, 28)',
      icon: 'fa-feather-pointed',
      color: '#38bdf8'
    },
    {
      id: 'dove',
      name: 'Bồ Câu Thánh Thần',
      title: 'Ơn Chúa Thánh Thần',
      quote: 'Bình an cho anh em. Như Chúa Cha đã sai Thầy, Thầy cũng sai anh em. (Ga 20, 21)',
      icon: 'fa-dove',
      color: '#ec4899'
    },
    {
      id: 'chalice',
      name: 'Chén Thánh & Bánh Thánh',
      title: 'Bí Tích Thánh Thể',
      quote: 'Ai ăn thịt và uống máu tôi, thì được sống muôn đời. (Ga 6, 54)',
      icon: 'fa-wine-glass',
      color: '#f59e0b'
    },
    {
      id: 'noah_ark',
      name: 'Con Tàu Nô-ê',
      title: 'Cứu Độ Muôn Loài',
      quote: 'Chiếc tàu là hình bóng ơn cứu rỗi Thiên Chúa dành cho người công chính.',
      icon: 'fa-ship',
      color: '#10b981'
    },
    {
      id: 'david',
      name: 'Cậu Bé Đa-vít',
      title: 'Chiến Binh Lòng Tin',
      quote: 'Ta đến cùng ngươi nhân danh Đức Chúa các đạo binh! (1Sm 17, 45)',
      icon: 'fa-shield-halved',
      color: '#8b5cf6'
    }
  ],

  // CÁC CHIẾC THUYỀN / LINH VẬT ĐUA CHO GAME CON TÀU NÔ-Ê (NOAH'S ARK RACE)
  noahRacers: [
    { id: 'sheep', name: 'Chiên Con Ngoan Đạo', avatar: '🐑', color: '#f8fafc', quote: 'Lắng nghe tiếng Chúa' },
    { id: 'dove', name: 'Bồ Câu Hòa Bình', avatar: '🕊️', color: '#38bdf8', quote: 'Ngậm cành ô-liu báo tin vui' },
    { id: 'lion', name: 'Sư Tử Chi Tộc Giu-đa', avatar: '🦁', color: '#f59e0b', quote: 'Dũng cảm làm chứng tá' },
    { id: 'giraffe', name: 'Hươu Vươn Cao Niềm Tin', avatar: '🦒', color: '#fb923c', quote: 'Hướng lòng về Nước Trời' },
    { id: 'elephant', name: 'Voi Bền Vững Đức Tin', avatar: '🐘', color: '#94a3b8', quote: 'Kiên trung vững vàng' },
    { id: 'fish', name: 'Cá Biển Phép Lạ', avatar: '🐟', color: '#06b6d4', quote: 'Ngư phủ lưới người' },
    { id: 'boat_peter', name: 'Thuyền Đánh Cá Phê-rô', avatar: '⛵', color: '#3b82f6', quote: 'Chèo ra chỗ nước sâu' },
    { id: 'bear', name: 'Gấu Bác Ái Tốt Lành', avatar: '🐻', color: '#a16207', quote: 'Thương giúp bạn bè' }
  ]
};

console.log("✅ BIBLE_GAME_DATA loaded successfully with 73 books and rich Catholic quiz content!");

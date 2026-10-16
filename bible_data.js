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
    { id: 'st', name: 'Sáng Thế', abbr: 'St', testament: 'old', group: 'Ngũ Thư', chapters: 50, icon: 'fa-earth-americas', theme: "Khởi nguyên vũ trụ, con người và Giao ước cứu độ", author: "Truyền thống Môi-sê", summary: "Kể về công trình tạo dựng của Thiên Chúa, sự sa ngã của con người, nạn hồng thủy và con tàu Nô-ê, ơn gọi của tổ phụ Áp-ra-ham, I-xa-ác, Gia-cóp và Giu-se tại Ai Cập.", goldenVerse: "Lúc khởi đầu, Thiên Chúa sáng tạo trời đất... Thiên Chúa thấy mọi sự Người đã làm ra quả là rất tốt đẹp. (St 1, 1.31)" },
    { id: 'xh', name: 'Xuất Hành', abbr: 'Xh', testament: 'old', group: 'Ngũ Thư', chapters: 40, icon: 'fa-person-walking-luggage', theme: "Cuộc giải thoát khỏi ách nô lệ Ai Cập và Giao ước Si-nai", author: "Truyền thống Môi-sê", summary: "Thiên Chúa gọi ông Môi-sê, thi hành 10 tai ương, dẫn dân vượt qua Biển Đỏ, ban Man-na nơi hoang địa và trao ban Mười Điều Răn trên núi Si-nai.", goldenVerse: "Đức Chúa phán với ông Môi-sê: Ta là Đấng Hiện Hữu... Ta đã thấy rõ nỗi khổ cực của dân Ta bên Ai Cập và Ta xuống giải thoát chúng. (Xh 3, 7.14)" },
    { id: 'lv', name: 'Lê-vi', abbr: 'Lv', testament: 'old', group: 'Ngũ Thư', chapters: 27, icon: 'fa-fire-burner', theme: "Sự thánh thiện của Thiên Chúa và phụng tự của dân thánh", author: "Hàng tư tế Lê-vi", summary: "Quy định về các lễ tế, chức tư tế của A-rôn, các luật thanh sạch và ngày Lễ Xá Tội (Yom Kippur). Kêu gọi dân sống thánh thiện.", goldenVerse: "Các ngươi hãy sống thánh thiện, vì Ta, Đức Chúa, Thiên Chúa của các ngươi, Ta là Đấng Thánh. (Lv 19, 2)" },
    { id: 'ds', name: 'Dân Số', abbr: 'Ds', testament: 'old', group: 'Ngũ Thư', chapters: 36, icon: 'fa-users', theme: "Hành trình 40 năm vượt qua sa mạc về Đất Hứa", author: "Truyền thống Môi-sê", summary: "Kiểm tra dân số các chi tộc, những lần dân kêu trách và sự kiên nhẫn của Thiên Chúa, con rắn đồng nơi hoang địa và chuẩn bị tiến vào Đất Hứa.", goldenVerse: "Nguyện Đức Chúa chúc lành và gìn giữ anh em! Nguyện Đức Chúa tươi nét mặt nhìn đến anh em và ban bình an cho anh em! (Ds 6, 24-26)" },
    { id: 'dnl', name: 'Đệ Nhị Luật', abbr: 'Đnl', testament: 'old', group: 'Ngũ Thư', chapters: 34, icon: 'fa-scroll', theme: "Lời trăn trối của Môi-sê và nhắc lại Giao ước yêu thương", author: "Truyền thống Môi-sê", summary: "Bài giảng tâm huyết của ông Môi-sê trước khi qua đời bên bờ sông Gio-đan. Nhắc nhở dân kính sợ Thiên Chúa và tuân giữ Lề Luật bằng cả trái tim.", goldenVerse: "Nghe đây, hỡi Ít-ra-en! Đức Chúa, Thiên Chúa chúng ta, là Đức Chúa duy nhất. Hãy yêu mến Đức Chúa hết lòng, hết linh hồn, hết sức lực anh em. (Đnl 6, 4-5)" },
    // LỊCH SỬ (16 SÁCH)
    { id: 'gs', name: 'Giô-suê', abbr: 'Gs', testament: 'old', group: 'Lịch Sử', chapters: 24, icon: 'fa-shield-halved', theme: "Chinh phục và phân chia Đất Hứa Ca-na-an", author: "Giô-suê / Biên soạn lịch sử", summary: "Giô-suê kế vị Môi-sê dẫn dân vượt sông Gio-đan, hạ thành Giê-ri-cô và phân chia bờ cõi cho 12 chi tộc Ít-ra-en.", goldenVerse: "Hãy mạnh bạo lên và can đảm! Đừng sợ hãi, vì Đức Chúa, Thiên Chúa của ngươi, ở với ngươi bất cứ nơi nào ngươi đi tới. (Gs 1, 9)" },
    { id: 'tl', name: 'Thủ Lãnh', abbr: 'Tl', testament: 'old', group: 'Lịch Sử', chapters: 21, icon: 'fa-gavel', theme: "Thời kỳ các anh hùng cứu thoát dân khỏi quân thù", author: "Lịch sử Đệ Nhị Luật", summary: "Vòng lặp tội lỗi - chịu phạt - kêu cầu - được cứu thoát qua các vị thủ lãnh: Đê-vô-ra, Ghi-đê-on, Sam-son...", goldenVerse: "Thời ấy, trong dân Ít-ra-en không có vua: ai nấy cứ làm theo điều mình coi là phải. (Tl 21, 25)" },
    { id: 'rt', name: 'Rút', abbr: 'Rt', testament: 'old', group: 'Lịch Sử', chapters: 4, icon: 'fa-wheat-awn', theme: "Lòng hiếu thảo và trung tín của người phụ nữ ngoại giáo", author: "Khuyết danh", summary: "Bà Rút người Mô-áp một lòng theo mẹ chồng Na-o-mi về Bê-lem, kết hôn với ông Bô-át và trở thành bà cố nội của Vua Đa-vít.", goldenVerse: "Mẹ đi đâu, con đi đó; mẹ ở đâu, con ở đó; dân của mẹ là dân của con, Thiên Chúa của mẹ là Thiên Chúa của con. (Rt 1, 16)" },
    { id: '1sm', name: '1 Sa-mu-en', abbr: '1Sm', testament: 'old', group: 'Lịch Sử', chapters: 31, icon: 'fa-crown', theme: "Chuyển giao sang chế độ vương quyền: Sa-mu-en, Sau-lơ và Đa-vít", author: "Các ngôn sứ", summary: "Ngôn sứ Sa-mu-en xức dầu tấn phong vua đầu tiên là Sau-lơ, rồi đến cậu bé mục đồng Đa-vít hạ gục tên khổng lồ Gô-li-át.", goldenVerse: "Thiên Chúa không nhìn theo kiểu người phàm: người phàm chỉ thấy điều trước mắt, còn Đức Chúa nhìn thấu tận đáy lòng. (1Sm 16, 7)" },
    { id: '2sm', name: '2 Sa-mu-en', abbr: '2Sm', testament: 'old', group: 'Lịch Sử', chapters: 24, icon: 'fa-landmark', theme: "Triều đại vinh hiển của Vua Đa-vít và Giao ước vương triều", author: "Các ký lục hoàng gia", summary: "Đa-vít thống nhất đất nước, đưa Hòm Bia về Giê-ru-sa-lem, nhận lời hứa Đấng Mê-si-a xuất thân từ dòng dõi mình.", goldenVerse: "Nhà của ngươi và vương quyền của ngươi sẽ tồn tại muôn đời trước mặt Ta; ngai vàng của ngươi sẽ vững bền mãi mãi. (2Sm 7, 16)" },
    { id: '1v', name: '1 Vua', abbr: '1V', testament: 'old', group: 'Lịch Sử', chapters: 22, icon: 'fa-gem', theme: "Sự khôn ngoan của Sa-lô-môn, Đền Thờ và đất nước bị chia đôi", author: "Các sử gia Đệ Nhị Luật", summary: "Vua Sa-lô-môn xây Đền Thờ Giê-ru-sa-lem. Sau đó đất nước chia đôi thành Vương quốc Bắc (Ít-ra-en) và Nam (Giu-đa). Ngôn sứ Ê-li-a thi thố quyền năng.", goldenVerse: "Xin ban cho tôi tớ Chúa đây một tâm hồn biết lắng nghe, để xét xử dân Chúa và phân biệt phải trái. (1V 3, 9)" },
    { id: '2v', name: '2 Vua', abbr: '2V', testament: 'old', group: 'Lịch Sử', chapters: 25, icon: 'fa-chess-rook', theme: "Sự sụp đổ của hai vương quốc và cuộc lưu đày Ba-by-lon", author: "Các sử gia Đệ Nhị Luật", summary: "Ngôn sứ Ê-li-sa kế vị Ê-li-a. Vương quốc Bắc sụp đổ năm 722 TCN, Giê-ru-sa-lem bị phá hủy năm 587 TCN và dân bị lưu đày.", goldenVerse: "Đức Chúa đã dùng mọi ngôn sứ và mọi thị nhân mà cảnh cáo Ít-ra-en và Giu-đa: Hãy từ bỏ các con đường xấu xa của các ngươi! (2V 17, 13)" },
    { id: '1sb', name: '1 Sử Biên Niên', abbr: '1Sb', testament: 'old', group: 'Lịch Sử', chapters: 29, icon: 'fa-book-atlas', theme: "Gia phả dân tộc và chân dung lý tưởng của Vua Đa-vít", author: "Nhà Ký Lục / Tư tế", summary: "Tóm tắt lịch sử từ A-đam, tập trung vào đức tin, tổ chức phụng tự và ca vịnh của Vua Đa-vít chuẩn bị xây Đền Thờ.", goldenVerse: "Lạy Đức Chúa, Ngài cao cả, quyền năng, vinh quang, rực rỡ và oai nghiêm, vì muôn vật trên trời dưới đất đều là của Ngài! (1Sb 29, 11)" },
    { id: '2sb', name: '2 Sử Biên Niên', abbr: '2Sb', testament: 'old', group: 'Lịch Sử', chapters: 36, icon: 'fa-feather', theme: "Các vua triều Giu-đa và việc bảo tồn Đền Thờ", author: "Nhà Ký Lục", summary: "Sa-lô-môn cung hiến Đền Thờ, lịch sử các vua Giu-đa, và sắc chỉ vua Cy-rô cho dân hồi hương tái thiết Đền Thờ.", goldenVerse: "Nếu dân Ta biết hạ mình xuống cầu nguyện và từ bỏ các con đường tội lỗi, thì Ta từ trời sẽ nghe và chữa lành đất nước họ. (2Sb 7, 14)" },
    { id: 'er', name: 'Ét-ra', abbr: 'Er', testament: 'old', group: 'Lịch Sử', chapters: 10, icon: 'fa-archway', theme: "Hồi hương sau lưu đày và tái thiết Đền Thờ Giê-ru-sa-lem", author: "Thầy tư tế Ét-ra", summary: "Dân Do Thái hồi hương từ Ba-by-lon, xây lại bàn thờ và Đền Thờ dưới sự dẫn dắt của Dơ-rúp-ba-ven và Ét-ra chấn hưng Lề Luật.", goldenVerse: "Họ cùng nhau ca tụng và tạ ơn Đức Chúa: Vì Người nhân hậu, vì tình thương của Người bền vững muôn đời! (Er 3, 11)" },
    { id: 'nk', name: 'Nơ-khe-mi-a', abbr: 'Nk', testament: 'old', group: 'Lịch Sử', chapters: 13, icon: 'fa-trowel-bricks', theme: "Tái thiết tường thành Giê-ru-sa-lem và cải cách tôn giáo", author: "Nơ-khe-mi-a", summary: "Nơ-khe-mi-a lãnh đạo dân vượt qua nghèo khó và sự chống phá, hoàn thành xây dựng tường thành Giê-ru-sa-lem trong 52 ngày.", goldenVerse: "Đừng buồn rầu, vì niềm vui của Đức Chúa là thành trì bảo vệ anh em! (Nk 8, 10)" },
    { id: 'tb', name: 'Tô-bi-a', abbr: 'Tb', testament: 'old', group: 'Lịch Sử', chapters: 14, icon: 'fa-eye', theme: "Lòng hiếu thảo, bác ái và sự đồng hành của Sứ thần Ra-pha-en", author: "Khuyết danh", summary: "Ông Tô-bít luôn chôn xác kẻ chết và làm việc từ thiện. Con trai Tô-bi-a được Tổng lãnh Thiên Thần Ra-pha-en dẫn đường chữa lành mù lòa cho cha.", goldenVerse: "Ai làm phúc bố thí thì thoát chết và được tẩy sạch mọi tội lỗi. Những kẻ thực thi bác ái sẽ được đầy tràn sự sống. (Tb 12, 9)" },
    { id: 'gd', name: 'Giu-đi-tha', abbr: 'Gđ', testament: 'old', group: 'Lịch Sử', chapters: 16, icon: 'fa-hand-fist', theme: "Lòng can đảm và đức tin cứu thoát dân tộc khỏi đại họa", author: "Khuyết danh", summary: "Bà góa Giu-đi-tha xinh đẹp và mộ đạo đã tin tưởng vào quyền năng Chúa, tiến vào trại tướng địch Hô-lô-phéc-nê giải cứu thành Bê-ti-lu-a.", goldenVerse: "Lạy Chúa là Thiên Chúa của tổ phụ con, xin nghe lời kẻ góa bụa này... Quyền năng của Ngài không dựa vào số đông, nhưng Ngài là Đấng cứu vớt kẻ ngã lòng! (Gđ 9, 4.11)" },
    { id: 'et', name: 'Ét-te', abbr: 'Et', testament: 'old', group: 'Lịch Sử', chapters: 10, icon: 'fa-ribbon', theme: "Sự quan phòng mầu nhiệm của Chúa cứu người Do Thái khỏi nạn diệt chủng", author: "Khuyết danh", summary: "Hoàng hậu Ét-te liều mình vào diện kiến vua Ba Tư A-suê-rô, lật tẩy âm mưu của Hác-man, khai sinh lễ nang Pu-rim tạ ơn Thiên Chúa.", goldenVerse: "Biết đâu chính vì một thời điểm như thế này mà em đã được lên ngôi hoàng hậu! (Et 4, 14)" },
    { id: '1mcb', name: '1 Ma-ca-bê', abbr: '1Mcb', testament: 'old', group: 'Lịch Sử', chapters: 16, icon: 'fa-torah', theme: "Cuộc nổi dậy vì đức tin bảo vệ Đền Thờ và Lề Luật", author: "Khuyết danh Do Thái", summary: "Gia đình Giu-đa Ma-ca-bê lãnh đạo cuộc khởi nghĩa chống lại bạo chúa An-ti-ô-khô bắt dân bỏ đạo, tái thánh hiến Đền Thờ (Lễ Ánh Sáng Hanukkah).", goldenVerse: "Chiến thắng trong chiến trận không hệ tại đạo quân đông đảo, nhưng sức mạnh đến từ Trời! (1Mcb 3, 19)" },
    { id: '2mcb', name: '2 Ma-ca-bê', abbr: '2Mcb', testament: 'old', group: 'Lịch Sử', chapters: 15, icon: 'fa-fire', theme: "Đức tin vào sự sống lại của kẻ chết và lời cầu cho người quá cố", author: "Khuyết danh", summary: "Tấm gương tử đạo kiên cường của cụ già Ê-lê-a-da và người mẹ cùng 7 người con, khẳng định niềm tin mãnh liệt vào sự phục sinh.", goldenVerse: "Vua vũ trụ sẽ cho chúng tôi sống lại để hưởng sự sống muôn đời, vì chúng tôi chết cho lề luật của Người! (2Mcb 7, 9)" },
    // KHÔN NGOAN & THÁNH VỊNH (7 SÁCH)
    { id: 'gp', name: 'Gióp', abbr: 'G', testament: 'old', group: 'Khôn Ngoan', chapters: 42, icon: 'fa-person-praying', theme: "Mầu nhiệm sự dữ, đau khổ của người công chính và lòng kiên trung", author: "Khuyết danh thi sĩ", summary: "Ông Gióp mất hết của cải, con cái và thân thể ung nhọt nhưng vẫn kiên trung không nguyền rủa Chúa. Thiên Chúa mặc khải sự siêu việt của Người.", goldenVerse: "Thân trần truồng sinh từ lòng mẹ, tôi sẽ trở về đó cũng trần truồng. Đức Chúa đã ban cho, Đức Chúa lại lấy đi: xin chúc tụng danh Đức Chúa! (G 1, 21)" },
    { id: 'tv', name: 'Thánh Vịnh', abbr: 'Tv', testament: 'old', group: 'Khôn Ngoan', chapters: 150, icon: 'fa-music', theme: "Lời cầu nguyện, chúc tụng, than thở và tạ ơn của Dân Chúa (150 bài)", author: "Vua Đa-vít và các ca trưởng Đền Thờ", summary: "Thánh vịnh là cuốn sách kinh nguyện tuyệt mỹ của toàn thể Hội Thánh, diễn tả mọi cung bậc cảm xúc của con người trước nhan Thiên Chúa.", goldenVerse: "Chúa là mục tử chăn dắt tôi, tôi chẳng thiếu thốn gì... Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi. (Tv 23, 1 & Tv 119, 105)" },
    { id: 'cn', name: 'Châm Ngôn', abbr: 'Cn', testament: 'old', group: 'Khôn Ngoan', chapters: 31, icon: 'fa-lightbulb', theme: "Lời răn dạy sống khôn ngoan, công chính và kính sợ Chúa", author: "Vua Sa-lô-môn và các bậc hiền giả", summary: "Tập hợp các châm ngôn thực tế về gia đình, lời ăn tiếng nói, sự siêng năng, bạn bè và đức hạnh của người nữ.", goldenVerse: "Kính sợ Đức Chúa là đầu mối của sự khôn ngoan; kẻ điên rồ mới khinh chê giáo huấn và kỷ luật. (Cn 1, 7)" },
    { id: 'gv', name: 'Giảng Viên', abbr: 'Gv', testament: 'old', group: 'Khôn Ngoan', chapters: 12, icon: 'fa-hourglass-half', theme: "Mọi sự trần thế đều phù vân, hãy sống đẹp lòng Chúa", author: "Cô-khe-lét (Con trai Đa-vít)", summary: "Suy niệm về tính tạm bợ của danh vọng, của cải trần gian, mời gọi con người biết hưởng niềm vui giản dị trong kính sợ Thiên Chúa.", goldenVerse: "Phù vân, quả là phù vân, mọi sự đều là phù vân... Hãy kính sợ Thiên Chúa và tuân giữ các mệnh lệnh của Người! (Gv 1, 2; 12, 13)" },
    { id: 'dc', name: 'Diễm Ca', abbr: 'Dc', testament: 'old', group: 'Khôn Ngoan', chapters: 8, icon: 'fa-heart', theme: "Tình yêu say đắm giữa Đấng Tình Quân và Tân nương Dân Chúa", author: "Truyền thống Sa-lô-môn", summary: "Khúc ca tình yêu thi vị diễn tả mối liên hệ nồng thắm giữa chàng và nàng, biểu tượng tình yêu Thiên Chúa dành cho dân tộc và Hội Thánh.", goldenVerse: "Tình yêu mạnh hơn sự chết, ngọn lửa tình là ngọn lửa Đức Chúa, nước lũ không dập tắt được tình yêu! (Dc 8, 6-7)" },
    { id: 'kn', name: 'Khôn Ngoan', abbr: 'Kn', testament: 'old', group: 'Khôn Ngoan', chapters: 19, icon: 'fa-compass', theme: "Sự bất tử của linh hồn và ân ban của Đức Khôn Ngoan Thiên Chúa", author: "Hiền giả Do Thái vùng A-lếch-xan-đri-a", summary: "Tuyên xưng linh hồn người công chính ở trong tay Thiên Chúa, khuyến khích tìm kiếm sự khôn ngoan thần linh.", goldenVerse: "Linh hồn người công chính ở trong tay Thiên Chúa, và chẳng cực hình nào chạm tới được họ. Họ được hưởng an bình. (Kn 3, 1.3)" },
    { id: 'hc', name: 'Huấn Ca', abbr: 'Hc', testament: 'old', group: 'Khôn Ngoan', chapters: 51, icon: 'fa-chalkboard-user', theme: "Cẩm nang sống đạo, luân lý và bổn phận gia đình xã hội", author: "Giê-su con ông Xi-rắc", summary: "Lời dạy sâu sắc về lòng hiếu thảo với cha mẹ, sự chân thật với bạn hữu, việc tự chủ bản thân và ca tụng các tổ phụ đức tin.", goldenVerse: "Ai tôn kính cha sẽ bù đắp được lỗi lầm; ai thảo kính mẹ như tìm được kho tàng quý báu. (Hc 3, 3-4)" },
    // NGÔN SỨ (18 SÁCH)
    { id: 'is', name: 'I-sai-a', abbr: 'Is', testament: 'old', group: 'Ngôn Sứ', chapters: 66, icon: 'fa-sun', theme: "Thiên Chúa Chí Thánh và lời loan báo về Đấng Emmanuel / Người Tôi Trung", author: "Ngôn sứ I-sai-a", summary: "Sách tiên tri vĩ đại loan báo về Trinh Nữ sinh Con Đấng Emmanuel, các Bài ca Người Tôi Trung chịu đau khổ để chuộc tội muôn dân.", goldenVerse: "Này đây người trinh nữ sẽ thụ thai và sinh hạ một con trai, và người ta sẽ gọi tên con trẻ là Em-ma-nu-en! (Is 7, 14)" },
    { id: 'gr', name: 'Giê-rê-mi-a', abbr: 'Gr', testament: 'old', group: 'Ngôn Sứ', chapters: 52, icon: 'fa-droplet', theme: "Lời kêu gọi sám hối khẩn thiết và Giao ước Mới ghi tận đáy lòng", author: "Ngôn sứ Giê-rê-mi-a", summary: "Vị ngôn sứ chịu nhiều gian truân cảnh báo sự sụp đổ của Giê-ru-sa-lem, đồng thời loan báo một Giao ước Mới vĩnh cửu được ghi khắc trong trái tim.", goldenVerse: "Ta sẽ đặt Lề Luật của Ta vào tận đáy lòng chúng, sẽ ghi khắc vào tâm khảm chúng. Ta sẽ là Thiên Chúa của chúng, và chúng sẽ là Dân của Ta. (Gr 31, 33)" },
    { id: 'ac', name: 'Ai Ca', abbr: 'Ac', testament: 'old', group: 'Ngôn Sứ', chapters: 5, icon: 'fa-face-sad-tear', theme: "Khóc thương thành Giê-ru-sa-lem và trông cậy lòng từ bi của Chúa", author: "Gắn liền với Giê-rê-mi-a", summary: "5 bài thơ than khóc thảm cảnh thành đô bị thiêu rụi, nhưng vẫn bừng sáng niềm hy vọng vì tình thương Chúa không bao giờ cạn.", goldenVerse: "Tình thương của Đức Chúa không bao giờ vơi, lòng từ bi của Người không khi nào dứt; mỗi sáng mai lại tinh khôi tươi mới! (Ac 3, 22-23)" },
    { id: 'br', name: 'Ba-rúc', abbr: 'Br', testament: 'old', group: 'Ngôn Sứ', chapters: 6, icon: 'fa-scroll', theme: "Lời an ủi gửi đoàn dân lưu đày và lời ngợi khen Đức Khôn Ngoan", author: "Ba-rúc (thư ký của Giê-rê-mi-a)", summary: "Khuyên nhủ dân Do Thái tại Ba-by-lon ăn năn trở về với Lời Chúa, hứa hẹn ngày Giê-ru-sa-lem được phục hưng rạng rỡ.", goldenVerse: "Hỡi Giê-ru-sa-lem, hãy cởi áo tang thương khổ nhục, hãy mặc lấy vẻ rực rỡ vinh quang Thiên Chúa ban cho ngươi muôn đời! (Br 5, 1)" },
    { id: 'ez', name: 'Ê-dê-ki-en', abbr: 'Ed', testament: 'old', group: 'Ngôn Sứ', chapters: 48, icon: 'fa-dove', theme: "Thần Khí Chúa đổi mới tâm hồn và thị kiến thung lũng xương khô sống lại", author: "Ngôn sứ Ê-dê-ki-en", summary: "Thị kiến về ngai tòa vinh hiển của Chúa, lời hứa ban một quả tim mới và một thần khí mới, thung lũng xương khô hồi sinh diệu kỳ.", goldenVerse: "Ta sẽ ban cho các ngươi một quả tim mới, đặt vào lòng các ngươi một thần khí mới; Ta sẽ cất khỏi các ngươi quả tim bằng đá và ban tặng quả tim bằng thịt. (Ed 36, 26)" },
    { id: 'dn', name: 'Đa-ni-en', abbr: 'Đn', testament: 'old', group: 'Ngôn Sứ', chapters: 14, icon: 'fa-shield-cat', theme: "Thiên Chúa làm chủ lịch sử muôn dân và khải hoàn của Nước Trời", author: "Đa-ni-en và các bạn hữu", summary: "Đa-ni-en trong hầm sư tử, ba thanh niên trong lò lửa cháy rực, thị kiến về Con Người đến trên mây trời lãnh nhận vương quyền đời đời.", goldenVerse: "Vương quyền của Người là vương quyền muôn đời không bao giờ mai một; nước của Người sẽ không bao giờ suy vong. (Đn 7, 14)" },
    { id: 'hs', name: 'Hô-sê', abbr: 'Hs', testament: 'old', group: 'Ngôn Sứ', chapters: 14, icon: 'fa-heart-circle-bolt', theme: "Tình yêu tha thứ và thủy chung son sắt của Thiên Chúa như người phối ngẫu", author: "Ngôn sứ Hô-sê", summary: "Dùng hình ảnh người vợ bất trung để diễn tả dân bỏ Chúa, nhưng Chúa vẫn tha thiết tìm cách chuộc lại với tình yêu thương bao la.", goldenVerse: "Ta muốn tình yêu chứ không cần hy lễ, muốn sự hiểu biết Thiên Chúa hơn là lễ toàn thiêu! (Hs 6, 6)" },
    { id: 'ge', name: 'Gió-en', abbr: 'Ge', testament: 'old', group: 'Ngôn Sứ', chapters: 4, icon: 'fa-cloud-showers-heavy', theme: "Ngày của Đức Chúa và ân ban Thần Khí trên mọi xác phàm", author: "Ngôn sứ Gió-en", summary: "Họa châu chấu là lời cảnh tỉnh; tiên báo ngày Chúa tuôn đổ Thánh Thần (được ứng nghiệm vào ngày Lễ Hiện Xuống).", goldenVerse: "Ta sẽ đổ Thần Khí Ta trên hết thảy mọi xác phàm... Ai kêu cầu danh Đức Chúa sẽ được cứu độ! (Ge 3, 1.5)" },
    { id: 'am', name: 'A-mốt', abbr: 'Am', testament: 'old', group: 'Ngôn Sứ', chapters: 9, icon: 'fa-scale-balanced', theme: "Công lý xã hội và sự công chính trước nhan Thiên Chúa", author: "Ngôn sứ A-mốt người chăn cừu", summary: "Lên án mạnh mẽ sự bất công, bóc lột người nghèo khổ và đòi hỏi việc thờ phượng phải đi đôi với đời sống công minh chính trực.", goldenVerse: "Hãy để công lý chảy tuôn như dòng nước, và sự công chính cuồn cuộn như thác ngàn! (Am 5, 24)" },
    { id: 'ob', name: 'Ô-va-đi-a', abbr: 'Ôv', testament: 'old', group: 'Ngôn Sứ', chapters: 1, icon: 'fa-mountain', theme: "Sự xét xử Ê-đôm và sự toàn thắng của Nhà Gia-cóp trên núi Xi-on", author: "Ngôn sứ Ô-va-đi-a", summary: "Sách ngắn nhất Cựu Ước (1 chương), cảnh cáo lòng kiêu ngạo của dân Ê-đôm khi trơ mắt nhìn cảnh anh em mình gặp nạn.", goldenVerse: "Vương quyền sẽ thuộc về Đức Chúa! (Ôv 1, 21)" },
    { id: 'gn', name: 'Giô-na', abbr: 'Gn', testament: 'old', group: 'Ngôn Sứ', chapters: 4, icon: 'fa-fish', theme: "Lòng thương xót vô biên của Chúa dành cho cả các dân tộc ngoại giáo", author: "Khuyết danh kể về Giô-na", summary: "Giô-na trốn lệnh Chúa, bị nuốt vào bụng cá lớn 3 ngày 3 đêm, sau đó đến thành Ni-ni-ve rao giảng sám hối và Chúa đã tha thứ cho toàn thành.", goldenVerse: "Lạy Chúa, con biết Ngài là Thiên Chúa từ bi nhân hậu, chậm giận và giàu tình thương, luôn sẵn lòng tha thứ! (Gn 4, 2)" },
    { id: 'mi', name: 'Mi-kha', abbr: 'Mk', testament: 'old', group: 'Ngôn Sứ', chapters: 7, icon: 'fa-star', theme: "Lời hứa về vị Thủ lãnh sinh ra từ thành Bê-lem nhỏ bé", author: "Ngôn sứ Mi-kha", summary: "Lên án áp bức bất công, báo trước thành Giê-ru-sa-lem bị tàn phá và Đấng Cứu Thế sẽ xuất hiện từ Bê-lem Ép-ra-tha.", goldenVerse: "Người đã chỉ cho ngươi biết điều gì là tốt: Đó là thực thi công lý, chuộng tình bác ái và khiêm nhường bước đi cùng Thiên Chúa! (Mk 6, 8)" },
    { id: 'na', name: 'Na-khum', abbr: 'Na', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-bolt', theme: "Sự sụp đổ của đế quốc tàn bạo Ni-ni-ve và tin mừng giải thoát", author: "Ngôn sứ Na-khum", summary: "Tuyên cáo Thiên Chúa là Đấng công minh bảo vệ kẻ bị áp bức và dẹp tan quyền lực kiêu ngạo của Át-sua.", goldenVerse: "Đức Chúa thật tốt lành, Người là nơi trú ẩn trong ngày gian truân; Người biết những ai nương tựa vào Người. (Na 1, 7)" },
    { id: 'kb', name: 'Kha-ba-cúc', abbr: 'Kb', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-mountain-sun', theme: "Vấn nạn công lý và người công chính sống nhờ đức tin", author: "Ngôn sứ Kha-ba-cúc", summary: "Cuộc đối thoại giữa ngôn sứ với Thiên Chúa về sự thịnh vượng của kẻ dữ; xác quyết người công chính sẽ sống nhờ lòng trung tín.", goldenVerse: "Người công chính sẽ sống nhờ lòng trung tín của mình... Dù cây vả không đơm hoa kết trái, tôi vẫn vui mừng trong Chúa! (Kb 2, 4; 3, 17-18)" },
    { id: 'xp', name: 'Xô-phô-ni-a', abbr: 'Xp', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-bullhorn', theme: "Ngày thịnh nộ thanh tẩy và đoàn dân nghèo khó khiêm hạ", author: "Ngôn sứ Xô-phô-ni-a", summary: "Ngày phán xét mọi tôn thờ ngẫu tượng, hứa ban ơn cho những kẻ nghèo hèn khiêm hạ (Anawim) biết nương tựa danh Chúa.", goldenVerse: "Hãy reo vui, hỡi thiếu nữ Xi-on! Đức Chúa, Vua của Ít-ra-en, đang ngự giữa ngươi, ngươi sẽ không còn sợ tai ương nào nữa! (Xp 3, 14-15)" },
    { id: 'kg', name: 'Khác-gai', abbr: 'Kg', testament: 'old', group: 'Ngôn Sứ', chapters: 2, icon: 'fa-church', theme: "Lời kêu gọi cấp bách tái thiết Đền Thờ Đức Chúa", author: "Ngôn sứ Khác-gai", summary: "Nhắc nhở dân sau khi về từ lưu đày lo xây nhà riêng lộng lẫy mà bỏ phế Nhà Chúa; hứa vinh quang Đền Thờ mới sẽ rực rỡ hơn xưa.", goldenVerse: "Hãy lên núi đem gỗ về xây lại Đền Thờ, Ta sẽ vui lòng ngự ở đó và tỏ vinh quang Ta! (Kg 1, 8)" },
    { id: 'dc_ns', name: 'Da-ca-ri-a', abbr: 'Dcr', testament: 'old', group: 'Ngôn Sứ', chapters: 14, icon: 'fa-hands-holding-circle', theme: "Vị Vua khiêm nhường cỡi lừa tiến vào Giê-ru-sa-lem", author: "Ngôn sứ Da-ca-ri-a", summary: "Thị kiến về sự phục hưng Đền Thờ, loan báo Đấng Mê-si-a khiêm hạ cỡi lừa và nguồn nước thanh tẩy tội lỗi.", goldenVerse: "Này đây Đức Vua của ngươi đang đến cùng ngươi: Người là Đấng Chính Trực và Toàn Thắng, Người khiêm nhường cỡi trên lưng lừa con! (Dcr 9, 9)" },
    { id: 'ml', name: 'Ma-la-khi', abbr: 'Ml', testament: 'old', group: 'Ngôn Sứ', chapters: 3, icon: 'fa-fire-flame-curved', theme: "Sứ giả dọn đường Chúa đến và của lễ tinh tuyền muôn dân", author: "Ngôn sứ Ma-la-khi", summary: "Kêu gọi hàng tư tế canh tân lòng sốt mến, tiên báo ngôn sứ Ê-li-a (Gioan Tẩy Giả) sẽ đến hòa giải cha ông với con cái.", goldenVerse: "Từ đông sang tây, danh Ta thật cao cả giữa chư dân; ở mọi nơi người ta dâng lên danh Ta của lễ tinh tuyền! (Ml 1, 11)" },

    // TÂN ƯỚC (27 SÁCH)
    // 4 PHÚC ÂM & TÔNG ĐỒ CÔNG VỤ
    { id: 'mt', name: 'Mát-thêu', abbr: 'Mt', testament: 'new', group: 'Tin Mừng', chapters: 28, icon: 'fa-cross', theme: "Chúa Giê-su là Đấng Mê-si-a làm trọn mọi lời Kinh Thánh Cựu Ước", author: "Thánh Mát-thêu Tông đồ (Người thu thuế)", summary: "Tin Mừng Mát-thêu tập hợp 5 bài giảng lớn của Chúa Giê-su (khởi đầu bằng Bài Giảng Trên Núi / Tám Mối Phúc Thật), minh chứng Chúa Giê-su là Đấng Con Vua Đa-vít.", goldenVerse: "Phúc thay ai có tâm hồn nghèo khó, vì Nước Trời là của họ... Anh em hãy đi và làm cho muôn dân trở thành môn đệ! (Mt 5, 3; 28, 19)" },
    { id: 'mc', name: 'Mác-cô', abbr: 'Mc', testament: 'new', group: 'Tin Mừng', chapters: 16, icon: 'fa-shield-halved', theme: "Chúa Giê-su là Tôi Tớ Đau Khổ và Con Thiên Chúa hành động quyền uy", author: "Thánh Mác-cô (môn đệ Thánh Phê-rô)", summary: "Sách Tin Mừng ngắn nhất, nhịp điệu nhanh và sống động, tập trung vào các phép lạ quyền năng và cao điểm là cái chết phục sinh của Chúa Giê-su.", goldenVerse: "Thời kỳ đã mãn và Triều Đại Thiên Chúa đã đến gần. Anh em hãy sám hối và tin vào Tin Mừng! (Mc 1, 15)" },
    { id: 'lc', name: 'Lu-ca', abbr: 'Lc', testament: 'new', group: 'Tin Mừng', chapters: 24, icon: 'fa-heart', theme: "Lòng thương xót của Chúa đối với người nghèo, tội nhân và phụ nữ", author: "Thánh Lu-ca (Bác sĩ, bạn đồng hành của Phaolô)", summary: "Bức tranh Tin Mừng tuyệt mỹ về Giáng Sinh, Mẹ Maria, các dụ ngôn bất hủ về lòng thương xót: Người Con Hoang Đàng, Người Samari Nhân Hậu, Giakêu.", goldenVerse: "Con Người đến để tìm và cứu những gì đã hư mất... Thần Khí Chúa ngự trên tôi, Người sai tôi đem tin mừng cho người nghèo khó! (Lc 19, 10; 4, 18)" },
    { id: 'ga', name: 'Gio-an', abbr: 'Ga', testament: 'new', group: 'Tin Mừng', chapters: 21, icon: 'fa-dove', theme: "Ngôi Lời Nhập Thể ban sự sống muôn đời cho ai tin vào Người", author: "Thánh Gio-an Tông đồ (Môn đệ được Chúa yêu)", summary: "Tin Mừng thần học cao sâu mặc khải Chúa Giê-su là Con Thiên Chúa qua 7 dấu lạ vĩ đại và các lời tuyên bố: Ta là Ánh Sáng, Bánh Hằng Sống, Mục Tử Nhân Lành.", goldenVerse: "Lúc khởi đầu đã có Ngôi Lời, và Ngôi Lời là Thiên Chúa... Thiên Chúa yêu thế gian đến nỗi đã ban Con Một Người, để ai tin vào Người thì được sống muôn đời. (Ga 1, 1; 3, 16)" },
    { id: 'cv', name: 'Tông Đồ Công Vụ', abbr: 'Cv', testament: 'new', group: 'Lịch Sử HT', chapters: 28, icon: 'fa-fire', theme: "Chúa Thánh Thần hướng dẫn Hội Thánh sơ khai loan báo Tin Mừng khắp địa cầu", author: "Thánh Lu-ca", summary: "Lễ Hiện Xuống, đời sống cộng đoàn đầu tiên, các phép lạ và hành trình truyền giáo kiên cường của Thánh Phê-rô và Thánh Phao-lô từ Giê-ru-sa-lem đến Rô-ma.", goldenVerse: "Anh em sẽ nhận được sức mạnh của Thánh Thần ngự xuống trên anh em, và anh em sẽ là chứng nhân của Thầy cho đến tận cùng trái đất! (Cv 1, 8)" },
    // THƯ THÁNH PHAOLÔ (14 THƯ)
    { id: 'rm', name: 'Rô-ma', abbr: 'Rm', testament: 'new', group: 'Thư Phaolô', chapters: 16, icon: 'fa-envelope', theme: "Sự công chính hóa nhờ ân sủng đức tin vào Đức Kitô Giê-su", author: "Thánh Phaolô Tông đồ", summary: "Bức thư thần học đồ sộ nhất giải thích mọi người đều phạm tội nhưng được Thiên Chúa cứu chuộc nhưng không qua Đức Tin; không gì tách được ta khỏi tình yêu Chúa.", goldenVerse: "Ai có thể tách chúng ta ra khỏi tình yêu của Đức Kitô? Dù gian truân, khốn khổ, bắt bớ hay gươm giáo... Chúng ta toàn thắng nhờ Đấng đã yêu mến chúng ta! (Rm 8, 35.37)" },
    { id: '1cr', name: '1 Cô-rin-tô', abbr: '1Cr', testament: 'new', group: 'Thư Phaolô', chapters: 16, icon: 'fa-hand-holding-heart', theme: "Giải quyết chia rẽ cộng đoàn, các ân sủng Thánh Thần và Bài ca Đức Ái", author: "Thánh Phaolô", summary: "Hướng dẫn trật tự trong phụng vụ, Bí tích Thánh Thể, các đặc sủng của Thánh Thần, Bài ca Tuyệt đỉnh Đức Mến và giáo lý Chúa Phục Sinh.", goldenVerse: "Hiện nay đức tin, đức cậy, đức mến, cả ba đều tồn tại; nhưng cao trọng hơn cả là đức mến. (1Cr 13, 13)" },
    { id: '2cr', name: '2 Cô-rin-tô', abbr: '2Cr', testament: 'new', group: 'Thư Phaolô', chapters: 13, icon: 'fa-envelope-open-text', theme: "Chức vụ tông đồ và sức mạnh của Chúa tỏ rạng trong sự yếu đuối phàm nhân", author: "Thánh Phaolô", summary: "Tâm tình tha thiết giãi bày nỗi lòng của Phaolô về những thử thách gian nan; kho tàng ơn Chúa được chứa đựng trong những bình sành mỏng dòn.", goldenVerse: "Ơn của Thầy đã đủ cho con, vì sức mạnh của Thầy được biểu lộ trọn vẹn trong sự yếu đuối! (2Cr 12, 9)" },
    { id: 'gl', name: 'Ga-lát', abbr: 'Gl', testament: 'new', group: 'Thư Phaolô', chapters: 6, icon: 'fa-feather', theme: "Tự do đích thực của người Kitô hữu được cứu chuộc nhờ đức tin", author: "Thánh Phaolô", summary: "Bảo vệ Tin Mừng ân sủng; con người không được công chính hóa nhờ luật cắt bì mà nhờ niềm tin vào Thập Giá Đức Kitô và hoa trái Thánh Thần.", goldenVerse: "Tôi sống, nhưng không còn phải là tôi, mà là Đức Kitô sống trong tôi! (Gl 2, 20)" },
    { id: 'ep', name: 'Ê-phê-xô', abbr: 'Ep', testament: 'new', group: 'Thư Phaolô', chapters: 6, icon: 'fa-shield', theme: "Mầu nhiệm Hội Thánh là Thân Thể mầu nhiệm và Hiền Thê của Đức Kitô", author: "Thánh Phaolô", summary: "Ý định nhiệm mầu quy tụ muôn loài dưới một Đầu duy nhất là Đức Kitô; khuyên nhủ con cái sự sáng và mặc lấy áo giáp vũ khí của Thiên Chúa.", goldenVerse: "Chỉ có một Chúa, một đức tin, một phép rửa; chỉ có một Thiên Chúa, Cha của mọi người, Đấng ngự trên mọi người và trong mọi người! (Ep 4, 5-6)" },
    { id: 'pl', name: 'Phi-líp-phê', abbr: 'Pl', testament: 'new', group: 'Thư Phaolô', chapters: 4, icon: 'fa-face-smile', theme: "Bức thư của niềm vui thánh thiện và sự khiêm hạ tự hạ của Đức Kitô", author: "Thánh Phaolô (từ trong chốn lao tù)", summary: "Mời gọi vui mừng luôn mãi trong Chúa; Bài ca ngợi khen Đức Kitô tuy là phận Thiên Chúa đã trút bỏ vinh quang mang lấy thân nô lệ.", goldenVerse: "Anh em hãy vui mừng luôn mãi trong Chúa! Tôi nhắc lại: anh em hãy vui mừng lên!... Tôi có thể làm được mọi sự trong Đấng ban sức mạnh cho tôi! (Pl 4, 4.13)" },
    { id: 'cl', name: 'Cô-lô-xê', abbr: 'Cl', testament: 'new', group: 'Thư Phaolô', chapters: 4, icon: 'fa-link', theme: "Đức Kitô là Đệ Nhất Tối Cao trên mọi loài thọ tạo và là Đầu Hội Thánh", author: "Thánh Phaolô", summary: "Khẳng định sự viên mãn của Thiên Chúa ngự trong Đức Kitô; dẹp bỏ các tà thuyết hư ảo và nhắc nhở hướng lòng về những sự trên trời.", goldenVerse: "Người là hình ảnh của Thiên Chúa vô hình, là trưởng tử sinh ra trước mọi loài thọ tạo... Tất cả đều được tạo dựng nhờ Người và cho Người! (Cl 1, 15-16)" },
    { id: '1ts', name: '1 Thê-xa-lô-ni-ca', abbr: '1Ts', testament: 'new', group: 'Thư Phaolô', chapters: 5, icon: 'fa-bell', theme: "Niềm hy vọng ngày Chúa quang lâm trở lại và lời an ủi kẻ đã an giấc", author: "Thánh Phaolô", summary: "Khen ngợi đức tin kiên vững của tín hữu; giải đáp thắc mắc về ngày Chúa Kitô đến và sự sống lại của người đã qua đời.", goldenVerse: "Hãy cầu nguyện không ngừng, hãy tạ ơn trong mọi hoàn cảnh: vì đó là điều Thiên Chúa muốn trong Đức Kitô Giê-su đối với anh em! (1Ts 5, 17-18)" },
    { id: '2ts', name: '2 Thê-xa-lô-ni-ca', abbr: '2Ts', testament: 'new', group: 'Thư Phaolô', chapters: 3, icon: 'fa-hourglass', theme: "Kiên trì làm việc và tỉnh thức trước ngày Chúa quang lâm", author: "Thánh Phaolô", summary: "Cảnh báo chống lại sự lười biếng hoặc hoang mang trước những tin đồn ngày Chúa đã đến; khuyên chăm chỉ làm việc và giữ vững truyền thống.", goldenVerse: "Ai không chịu làm việc thì cũng đừng ăn!... Nguyện xin chính Chúa bình an ban cho anh em sự bình an trong mọi lúc và mọi nơi! (2Ts 3, 10.16)" },
    { id: '1tm', name: '1 Ti-mô-thê', abbr: '1Tm', testament: 'new', group: 'Thư Phaolô', chapters: 6, icon: 'fa-user-tie', theme: "Hướng dẫn quản trị mục vụ và phẩm trật trong Hội Thánh", author: "Thánh Phaolô gửi học trò Timôthê", summary: "Chỉ dẫn tiêu chuẩn người làm Giám mục, Linh mục, Phó tế; bảo vệ giáo lý chân chính và chăm sóc các thành phần cộng đoàn.", goldenVerse: "Thiên Chúa muốn cho mọi người được cứu độ và nhận biết chân lý! Vì chỉ có một Thiên Chúa và một Đấng Trung Gian là Đức Giê-su Kitô. (1Tm 2, 4-5)" },
    { id: '2tm', name: '2 Ti-mô-thê', abbr: '2Tm', testament: 'new', group: 'Thư Phaolô', chapters: 4, icon: 'fa-medal', theme: "Lời tâm huyết cuối đời của Phaolô gửi môn đệ yêu quý", author: "Thánh Phaolô (trước lúc tử đạo tại Rô-ma)", summary: "Khích lệ Timôthê trung thành với chức vụ, kiên cường làm chứng tá cho Tin Mừng dẫu phải chịu đau khổ như một chiến sĩ trung dũng.", goldenVerse: "Tôi đã chiến đấu trong trận chiến cao đẹp, đã chạy hết chặng đường, đã giữ vững đức tin. Giờ đây triều thiên công chính đã dành sẵn cho tôi! (2Tm 4, 7-8)" },
    { id: 'tt', name: 'Ti-tô', abbr: 'Tt', testament: 'new', group: 'Thư Phaolô', chapters: 3, icon: 'fa-clipboard-check', theme: "Thiết lập trật tự giáo hội tại đảo Cơ-rê-ta và nếp sống thánh thiện", author: "Thánh Phaolô gửi Ti-tô", summary: "Bổ nhiệm các niên trưởng, dạy dỗ nếp sống lành thánh cho người già, người trẻ, nô lệ; tôn trọng chính quyền và làm việc bác ái.", goldenVerse: "Ân sủng của Thiên Chúa đã biểu lộ để đem lại ơn cứu độ cho muôn người; dạy chúng ta từ bỏ nếp sống vô luân để sống chừng mực, công chính! (Tt 2, 11-12)" },
    { id: 'plm', name: 'Phi-lê-môn', abbr: 'Plm', testament: 'new', group: 'Thư Phaolô', chapters: 1, icon: 'fa-handshake', theme: "Tình huynh đệ Kitô giáo vượt lên trên mọi ranh giới chủ và nô lệ", author: "Thánh Phaolô", summary: "Lá thư ngắn đầy tình nghĩa gửi ông Phi-lê-môn xin đón nhận lại người nô lệ trốn chạy Ô-nê-xi-mô như một người anh em rất yêu quý trong Chúa.", goldenVerse: "Anh hãy tiếp đón anh ấy như tiếp đón chính tôi! Giờ đây anh ấy không còn là người nô lệ, mà là một người anh em rất thân mến trong Chúa! (Plm 1, 16-17)" },
    { id: 'dt', name: 'Do-thái', abbr: 'Dt', testament: 'new', group: 'Thư Phaolô', chapters: 13, icon: 'fa-place-of-worship', theme: "Đức Kitô là Thượng Tế Tối Cao đời đời theo phẩm trật Men-ki-xê-đê", author: "Khuyết danh tông đồ", summary: "Bài giảng tuyệt vời chứng minh Đức Kitô vượt trên các thiên thần, Môi-sê; Người dâng chính Mình làm lễ tế duy nhất vĩnh cửu mở đường vào Nơi Cực Thánh.", goldenVerse: "Đức Giê-su Kitô vẫn là một, ngày hôm qua, ngày hôm nay, và mãi mãi muôn đời! (Dt 13, 8)" },
    // THƯ CHUNG (7 THƯ)
    { id: 'gc', name: 'Gia-cô-bê', abbr: 'Gc', testament: 'new', group: 'Thư Chung', chapters: 5, icon: 'fa-hands', theme: "Đức tin chân thật phải thể hiện bằng hành động bác ái cụ thể", author: "Thánh Gia-cô-bê Tông đồ", summary: "Lời dạy thiết thực về việc kiềm chế miệng lưỡi, không phân biệt đối xử người giàu kẻ nghèo, cầu nguyện cho bệnh nhân và sống đức tin hành động.", goldenVerse: "Đức tin không có hành động là đức tin chết!... Anh em hãy thực hành Lời Chúa, chứ đừng chỉ nghe suông mà lừa dối chính mình! (Gc 2, 17; 1, 22)" },
    { id: '1pr', name: '1 Phê-rô', abbr: '1Pr', testament: 'new', group: 'Thư Chung', chapters: 5, icon: 'fa-key', theme: "Niềm hy vọng hằng sống và lòng kiên vững giữa cơn bách hại", author: "Thánh Phê-rô Tông đồ trưởng", summary: "Gửi tín hữu tản mác, nhắc nhở họ là dòng giống được tuyển chọn, hoàng tộc tư tế, dân thánh; khuyên noi gương Đức Kitô kiên nhẫn chịu khổ.", goldenVerse: "Anh em là dòng giống được tuyển chọn, là hàng tư tế vương giả, là dân thánh, dân riêng của Thiên Chúa, để loan truyền những kỳ công của Người! (1Pr 2, 9)" },
    { id: '2pr', name: '2 Phê-rô', abbr: '2Pr', testament: 'new', group: 'Thư Chung', chapters: 3, icon: 'fa-anchor', theme: "Cảnh giác tiên tri giả và sự kiên nhẫn chờ ngày Chúa đến", author: "Thánh Phê-rô Tông đồ", summary: "Nhắc nhở gìn giữ chân lý đức tin, không dao động trước những kẻ nhạo báng; giải thích Chúa chậm chạp vì Người kiên nhẫn chờ mọi người sám hối.", goldenVerse: "Đối với Chúa, một ngày như thể ngàn năm, và ngàn năm như thể một ngày! Người kiên nhẫn vì không muốn ai phải diệt vong! (2Pr 3, 8-9)" },
    { id: '1ga', name: '1 Gio-an', abbr: '1Ga', testament: 'new', group: 'Thư Chung', chapters: 5, icon: 'fa-heart', theme: "Thiên Chúa là Tình Yêu và dấu chỉ đời sống con cái Thiên Chúa", author: "Thánh Gio-an Tông đồ", summary: "Tuyên tín Thiên Chúa là Ánh Sáng và là Tình Yêu; ai yêu thương anh em thì ở trong Thiên Chúa; xua tan nỗi sợ hãi nhờ tình yêu vẹn toàn.", goldenVerse: "Thiên Chúa là Tình Yêu: ai ở lại trong tình yêu thì ở lại trong Thiên Chúa, và Thiên Chúa ở lại trong người ấy! (1Ga 4, 16)" },
    { id: '2ga', name: '2 Gio-an', abbr: '2Ga', testament: 'new', group: 'Thư Chung', chapters: 1, icon: 'fa-heart-pulse', theme: "Sống trong Chân Lý và Giới Răn Yêu Thương", author: "Thánh Gio-an", summary: "Lá thư gửi một cộng đoàn giáo đoàn (Bà Quý Nương), khuyên nhủ hãy giữ giới răn yêu thương nhau và đề phòng kẻ giả danh không tuyên xưng Đức Kitô.", goldenVerse: "Tình yêu là: chúng ta sống theo các mệnh lệnh của Người; đó là giới răn anh em đã nghe ngay từ lúc khởi đầu! (2Ga 1, 6)" },
    { id: '3ga', name: '3 Gio-an', abbr: '3Ga', testament: 'new', group: 'Thư Chung', chapters: 1, icon: 'fa-hands-holding-child', theme: "Lòng hiếu khách và giúp đỡ các sứ giả Tin Mừng", author: "Thánh Gio-an gửi ông Gai-út", summary: "Khen ngợi ông Gai-út đã nhiệt tình đón tiếp và trợ giúp các nhà truyền giáo lữ hành; lên án thói tự tôn kiêu ngạo của Đi-ốt-rê-phết.", goldenVerse: "Không có niềm vui nào lớn hơn cho tôi khi nghe biết con cái tôi đang sống theo chân lý! (3Ga 1, 4)" },
    { id: 'gd_tc', name: 'Giu-đa', abbr: 'Gđ', testament: 'new', group: 'Thư Chung', chapters: 1, icon: 'fa-shield-halved', theme: "Chiến đấu bảo vệ đức tin đã truyền trao một lần cho các thánh", author: "Thánh Giu-đa Tông đồ", summary: "Cảnh giác trước các phần tử đồi trụy lén lút phá hoại Hội Thánh; dâng lời ngợi khen Thiên Chúa duy nhất Đấng gìn giữ ta khỏi vấp ngã.", goldenVerse: "Hãy gìn giữ mình trong tình yêu của Thiên Chúa, trong khi chờ đợi lòng thương xót của Đức Giê-su Kitô để được sống đời đời! (Gđ 1, 21)" },
    // KHẢI HUYỀN (1 SÁCH)
    { id: 'kh', name: 'Khải Huyền', abbr: 'Kh', testament: 'new', group: 'Khải Huyền', chapters: 22, icon: 'fa-city', theme: "Chiên Thiên Chúa khải hoàn toàn thắng và Giê-ru-sa-lem Mới từ trời ngự xuống", author: "Thánh Gio-an Tông đồ (viết tại đảo Pát-mô)", summary: "Sách khải huyền đầy biểu tượng hào hùng: Con Chiên bị sát tế đã chiến thắng Con Rồng; Trời Mới Đất Mới, nơi Thiên Chúa lau sạch mọi giọt lệ và ngự giữa dân Người.", goldenVerse: "Người sẽ lau sạch nước mắt nơi mắt họ; sẽ không còn sự chết, tang tóc, kêu than hay đau khổ nữa!... Lạy Chúa Giê-su, xin ngự đến! (Kh 21, 4; 22, 20)" }
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

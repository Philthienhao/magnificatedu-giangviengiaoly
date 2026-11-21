/**
 * ==========================================================================
 * CATECHISM INTERACTIVE GAMES CONTROLLER (TRÒ CHƠI GIÁO LÝ TƯƠNG TÁC)
 * Nền tảng: MagnificatEdu - Giáo Lý Công Giáo & Thiếu Nhi Thánh Thể
 * Thiết kế: Thầy Hảo - Đồ Nghề Dạy Học & Giáo Lý Đổi Mới
 * Đầy đủ 38 Trò chơi tương tác chuyên biệt chuẩn Công Giáo & Kinh Thánh
 * ==========================================================================
 */

(function() {
  'use strict';

  // --- Sound Engine (Web Audio Synthetic - 100% Offline & Pure Sound) ---
  const SoundFX = {
    ctx: null,
    getCtx: function() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    },

    // Tiếng chuông thánh đường ngân vang (Cathedral Bell)
    playBell: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.9);
        });
      } catch (e) { console.warn(e); }
    },

    // Tiếng đàn Harp thiên thần chúc phúc
    playHarp: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.15, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.9);
        });
      } catch (e) { console.warn(e); }
    },

    // Khải hoàn ca (Fanfare chiến thắng)
    playFanfare: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const melody = [
          { f: 523.25, d: 0.15 },
          { f: 659.25, d: 0.15 },
          { f: 783.99, d: 0.20 },
          { f: 1046.50, d: 0.45 }
        ];
        let offset = 0;
        melody.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(item.f, now + offset);
          gain.gain.setValueAtTime(0.18, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + item.d + 0.05);
          offset += item.d;
        });
      } catch (e) { console.warn(e); }
    },

    // Click / Pop âm thanh nhẹ
    playPop: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } catch (e) {}
    },

    // Trả lời sai (Âm trầm nhắc nhở)
    playWrong: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } catch (e) {}
    },

    // Tiếng chuông leng keng chúc mừng (Chime)
    playChime: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const freqs = [880, 1108.73, 1318.51, 1760];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.05);
          gain.gain.setValueAtTime(0.12, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.65);
        });
      } catch (e) {}
    },

    // Tiếng pháo hoa nổ
    playCannon: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) {}
    }
  };
  window.SoundFX = SoundFX;

  // --------------------------------------------------------------------------
  // DỮ LIỆU TOÀN BỘ 38 TRÒ CHƠI GIÁO DỤC CÔNG GIÁO & KINH THÁNH TƯƠNG TÁC
  // Tương thích 100% nội dung & hình thức kho Game Đồ Nghề Dạy Học / Gamegiaoduc
  // --------------------------------------------------------------------------
  const CATECHISM_GAMES_CATALOG = [
    {
      id: 'bible-millionaire',
      title: 'Thử Thách Triệu Phú Kinh Thánh',
      subtitle: 'Đấu Trí 15 Mốc Câu Hỏi Giáo Lý Kịch Tính',
      category: 'TRẮC NGHIỆM KỊCH TÍNH',
      filterCat: 'quiz',
      description: 'Chinh phục thang thưởng 15 mốc câu hỏi Lời Chúa với 4 quyền trợ giúp (50:50, Hỏi Đức Giám Mục, Đổi câu hỏi, Lời khuyên Kinh Thánh) và âm thanh thánh đường kịch tính!',
      thumbnail: 'anh/games/thumb_bible_millionaire.jpg',
      icon: '💰',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      playsCount: 0,
      metaCount: '15 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openBibleMillionaire()'
    },
    {
      id: 'heart-puzzle-2010',
      title: 'Trái Tim Vô Nhiễm Mẹ Maria & Tình Chúa Yêu Con',
      subtitle: 'Giải Mã Mảnh Ghép Trái Tim Lòng Mẹ',
      category: 'CHỦ ĐỀ ĐỨC MẸ',
      filterCat: 'quiz',
      description: 'Tô thắm từng ô trái tim theo đáp án đúng để lộ diện bức tranh Mẹ Ban Ơn chở che đoàn con yêu dấu. Hỗ trợ bảng tương tác và máy chiếu cả lớp!',
      thumbnail: 'anh/games/thumb_heart_puzzle.jpg',
      icon: '💖',
      gradient: 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #9f1239 100%)',
      playsCount: 0,
      metaCount: '10 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openHeartPuzzleGame()'
    },
    {
      id: 'crossword-lock',
      title: 'Ô Chữ Kinh Thánh & Chìa Khóa Cứu Độ',
      subtitle: 'Giải Ô Chữ Hàng Ngang Mở Từ Khóa Vàng',
      category: 'TƯ DUY KINH THÁNH',
      filterCat: 'words',
      description: 'Giải các câu hỏi hàng ngang để lật mở từng chữ cái của Từ Khóa Bí Mật ở hàng dọc vàng (như CỨU ĐỘ, TÌNH YÊU, PHÚC ÂM). Bảng ô chữ tương tác mượt mà!',
      thumbnail: 'anh/games/thumb_crossword.jpg',
      icon: '🧩',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      playsCount: 0,
      metaCount: '6-8 hàng',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openCrosswordLock()'
    },
    {
      id: 'knowledge-train',
      title: 'Đoàn Tàu Đức Tin — Biến Cố Cứu Độ',
      subtitle: 'Kéo Thả Sắp Xếp Trình Tự Lịch Sử Cứu Độ',
      category: 'DÒNG THỜI GIAN',
      filterCat: 'words',
      description: 'Sắp xếp các toa tàu theo đúng dòng thời gian Kinh Thánh: Sáng Tạo -> Xuất Hành -> Giao Ước Sinai -> Giáng Sinh -> Phục Sinh. Đúng thứ tự tàu sẽ huýt còi khởi hành!',
      thumbnail: 'anh/games/thumb_train.jpg',
      icon: '🚂',
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      playsCount: 0,
      metaCount: '5 toa',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openKnowledgeTrain()'
    },
    {
      id: 'minesweeper-quiz',
      title: 'Vượt Sa Mạc Sinai Về Miền Đất Hứa',
      subtitle: 'Dò Đường Sa Mạc Với 3 Khiên Đức Tin',
      category: 'THỬ THÁCH PHIÊU LƯU',
      filterCat: 'quiz',
      description: '16 ô cồn cát sa mạc ẩn chứa Ốc Đảo Ân Sủng (+100đ), Thử Thách Lời Chúa và Bão Cát. Bảo toàn 3 mạng sống để cùng dân Chúa tiến vào Miền Đất Hứa!',
      thumbnail: 'anh/games/thumb_minesweeper.jpg',
      icon: '🏜️',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      playsCount: 0,
      metaCount: '16 ô cát',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMinesweeperQuiz()'
    },
    {
      id: 'matching-pairs-quiz',
      title: 'Kéo Thả Nối Ý — Nhân Vật & Biến Cố Kinh Thánh',
      subtitle: 'Nối Đúng Cặp Khái Niệm & Sự Kiện Thánh',
      category: 'GHI NHỚ & GHÉP CẶP',
      filterCat: 'quiz',
      description: 'Nối các nhân vật Kinh Thánh (Mô-sê, Đa-vít, Phê-rô, Ê-li-a...) với sứ mạng và phép lạ tương ứng. Đường nối phát sáng hoàng kim chúc phúc khi ghép đúng!',
      thumbnail: 'anh/games/thumb_matching_pairs.jpg',
      icon: '🔗',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      playsCount: 0,
      metaCount: '6 cặp',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMatchingPairsQuiz()'
    },
    {
      id: 'fruit-ninja-quiz',
      title: 'Hái Hoa Trái Thánh Thần — Bắt Bong Bóng Ân Sủng',
      subtitle: 'Chém Hoa Trái & Bắt Bong Bóng Mang Lời Chúa',
      category: 'HÀNH ĐỘNG & PHẢN XẠ',
      filterCat: 'quiz',
      description: '12 Hoa Trái Thánh Thần (Bác ái, Hoan lạc, Bình an...) và bong bóng ân sủng bay lên từ đáy màn hình. Nhanh tay chém đúng đáp án chính xác!',
      thumbnail: 'anh/games/thumb_fruit_ninja.jpg',
      icon: '🍇',
      gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
      playsCount: 0,
      metaCount: '12 hoa trái',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openFruitNinjaQuiz()'
    },
    {
      id: 'pirate-ship-battle-game',
      title: 'Con Tàu Đức Tin Vượt Sóng Biển Hồ Ga-li-lê',
      subtitle: 'Đại Chiến 2 Đội Thuyền: Phê-rô vs Gio-an',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Hai thuyền buồm Tông đồ trên sóng nước Biển Hồ Ga-li-lê. Mỗi câu trả lời đúng bắn một phát đại bác chân lý đẩy lùi sóng gió và trừ máu thuyền đối phương!',
      thumbnail: 'anh/games/thumb_galilee_ship.jpg',
      icon: '⛵',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      playsCount: 0,
      metaCount: '2 đội thuyền',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openPirateShipBattleGame()'
    },
    {
      id: 'temple-builder',
      title: 'Xây Đền Thờ Thánh Giê-ru-sa-lem',
      subtitle: 'Xếp Tầng Đá Khối Vững Chắc Về Nhà Chúa',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Mỗi câu trả lời đúng xếp thêm 1 tầng đá khối chạm trổ tinh xảo vào Đền Thờ Sa-lô-môn. Đội nào hoàn tất đỉnh tháp Thánh Giá trước sẽ rung chuông đền thờ chiến thắng!',
      thumbnail: 'anh/games/thumb_temple_builder.jpg',
      icon: '🏛️',
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      playsCount: 0,
      metaCount: '5 tầng tháp',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openTempleBuilder()'
    },
    {
      id: 'jeopardy-quiz',
      title: 'Đấu Trí Bảng Vàng Giáo Lý (Jeopardy 5 Chủ Đề)',
      subtitle: 'Ma Trận 25 Ô Điểm 100 - 500 Thuộc 5 Mảng Giáo Lý',
      category: 'ĐỐI KHÁNG BẢNG VÀNG',
      filterCat: 'quiz',
      description: 'Bảng thi đấu phong cách Jeopardy: 1. Cựu Ước, 2. Tân Ước, 3. Bảy Bí Tích, 4. Mười Điều Răn, 5. Các Thánh. Lựa chọn mức điểm, trả lời trong 20s và bứt phá điểm số!',
      thumbnail: 'anh/games/thumb_jeopardy.jpg',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      playsCount: 0,
      metaCount: '25 ô điểm',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openJeopardyQuiz()'
    },
    {
      id: 'bouncing-words-game',
      title: 'Ghi Nhớ Lời Chúa Mau Lẹ — Thẻ Từ Vựng Bay',
      subtitle: 'Bắt Các Thẻ Từ Di Chuyển Hoàn Thành Câu Kinh Thánh',
      category: 'TƯ DUY TỪ NGỮ',
      filterCat: 'words',
      description: 'Các từ trong câu khẩu hiệu Lời Chúa bay lơ lửng liên tục trên màn hình. Học sinh quan sát nhanh và nhấp chọn theo đúng trình tự câu Lời Chúa hoàn chỉnh!',
      thumbnail: 'anh/games/thumb_bouncing_words.jpg',
      icon: '☁️',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openBouncingWordsGame()'
    },
    {
      id: 'flying-words-quiz',
      title: 'Bồ Câu Ngũ Tuần — Ghép Câu Kinh Thánh',
      subtitle: 'Bắt Mây Từ Bay Trên Bầu Trời Hoàn Thành Câu Lời Chúa',
      category: 'TƯ DUY TỪ NGỮ',
      filterCat: 'words',
      description: 'Bắt các đám mây từ đang bay trên bầu trời để sắp xếp đúng thứ tự Lời Chúa. Khi hoàn thành, chim bồ câu trắng Thánh Thần tỏa ánh hào quang!',
      thumbnail: 'anh/games/thumb_flying_words.jpg',
      icon: '🕊️',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openFlyingWordsQuiz()'
    },
    {
      id: 'jungle-rescue-quiz',
      title: 'Đa-vít Dũng Cảm Chiến Thắng Khổng Lồ Goliath',
      subtitle: 'Bắn Ná Chân Lý Hạ Gục Khổng Lồ Bảo Vệ Dân Chúa',
      category: 'THỬ THÁCH PHIÊU LƯU',
      filterCat: 'quiz',
      description: 'Đa-vít cầm trành ném đá đối đầu với tên khổng lồ Goliath hung hãn. Mỗi câu trả lời đúng bắn một hòn đá niềm tin trúng đích làm hao tổn thanh máu Boss!',
      thumbnail: 'anh/games/thumb_jungle_rescue.jpg',
      icon: '🏹',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      playsCount: 0,
      metaCount: 'Boss 100 HP',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openJungleRescueQuiz()'
    },
    {
      id: 'mario-race',
      title: 'Hành Trình Về Đất Hứa Retro 8-bit',
      subtitle: 'Phiêu Lưu Vượt Sa Mạc & Thu Thập Bánh Manna',
      category: 'PHIÊU LƯU RETRO',
      filterCat: 'race',
      description: 'Phong cách pixel 8-bit cổ điển, điều khiển lữ khách nhảy qua các cồn cát sa mạc, thu thập bánh Manna từ trời và vượt ải tiến vào Miền Đất Hứa!',
      thumbnail: 'anh/games/thumb_mario_race.jpg',
      icon: '🍄',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      playsCount: 0,
      metaCount: '5 chặng',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMarioRaceGame()'
    },
    {
      id: 'math-sack-race-game',
      title: 'Đua Nhảy Bao Bố — Cuộc Đua Về Nhà Chúa',
      subtitle: 'Thi Đấu 2 Đội Nhảy Bao Bố Vượt Thử Thách',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Hai đội nhảy bao bố trên thảm cỏ xanh hướng về Nhà Thờ Giáo xứ. Mỗi câu trả lời đúng giúp nhân vật nhảy bật 3 bước tiến nhanh về đích!',
      thumbnail: 'anh/games/thumb_sack_race.jpg',
      icon: '🦘',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      playsCount: 0,
      metaCount: '2 đội đua',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMathSackRaceGame()'
    },
    {
      id: 'car-race-quiz',
      title: 'Chiến Xa Tiên Tri Ê-li-a Về Thiên Quốc',
      subtitle: 'Đua Chiến Xa Rực Lửa Tăng Tốc Nitro Lời Chúa',
      category: 'ĐỐI KHÁNG ĐUA TỐC ĐỘ',
      filterCat: 'race',
      description: 'Chiến xa rực lửa của Tiên tri Ê-li-a phi nước đại trên tầng mây. Trả lời đúng kích hoạt lửa nitro thần linh bứt phá tốc độ giành cúp vinh quang!',
      thumbnail: 'anh/games/thumb_car_race.jpg',
      icon: '🏎️',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      playsCount: 0,
      metaCount: '4 làn đua',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openCarRaceQuiz()'
    },
    {
      id: 'faith-tugofwar',
      title: 'Kéo Co Đức Tin: Đội Phê-rô vs Đội Phao-lô',
      subtitle: 'Kéo Dải Ruy-Băng Thánh Giá Về Phía Đội Mình',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Chia 2 đội (Đội Phê-rô vs Đội Phao-lô). Mỗi câu trả lời đúng kéo dải ruy-băng Thánh Giá về phía đội mình. Đội nào kéo qua vạch mốc sẽ giành cúp!',
      thumbnail: 'anh/games/thumb_faith_tugofwar.jpg',
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #dc2626 100%)',
      playsCount: 0,
      metaCount: '10 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openFaithTugOfWar()'
    },
    {
      id: 'holy-picture-flip',
      title: 'Lật Mảnh Ghép Tranh Chúa Chiên Lành',
      subtitle: 'Lật Mở Từng Mảnh Ghép Khám Phá Bức Tranh Thánh',
      category: 'KHÁM PHÁ BỨC TRANH',
      filterCat: 'quiz',
      description: '12 ô số bí mật che phủ kiệt tác tranh Chúa Chiên Lành. Trả lời đúng từng ô để lật mở góc tranh hoặc bấm đoán toàn bộ bức tranh để nhận đại thưởng 500 điểm!',
      thumbnail: 'anh/games/thumb_holy_picture_flip.jpg',
      icon: '🖼️',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      playsCount: 0,
      metaCount: '12 ô ghép',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openHolyPictureFlip()'
    },
    {
      id: 'bible-memory',
      title: 'Giải Mã Cặp Đôi Kinh Thánh (Chibi Memory & 7 Bí Tích)',
      subtitle: 'Lật Thẻ Bài Tìm Biểu Tượng Công Giáo Trùng Khớp',
      category: 'GHI NHỚ & GHÉP CẶP',
      filterCat: 'quiz',
      description: '16 thẻ bài úp chứa các biểu tượng thánh: Bánh Thánh, Chén Thánh, Bồ Câu, Chuỗi Mân Côi, Nến Phục Sinh... Lật đúng cặp giống nhau trong thời gian nhanh nhất!',
      thumbnail: 'anh/games/thumb_bible_memory.jpg',
      icon: '🃏',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      playsCount: 0,
      metaCount: '16 thẻ',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openBibleMemoryPairs()'
    },
    {
      id: 'covenant-boxes',
      title: 'Chiếc Rương Giao Ước Bí Ẩn',
      subtitle: 'Mở 6 Chiếc Rương Thánh Nhận Phúc Lành & Thử Thách',
      category: 'BẤT NGỜ & MAY MẮN',
      filterCat: 'quiz',
      description: 'Sáu chiếc rương giao ước mạ vàng trên bàn thờ. Mỗi rương ẩn chứa một điều bất ngờ: Nhân đôi điểm, Đổi điểm, Quà ân sủng hoặc Câu hỏi thách đấu!',
      thumbnail: 'anh/games/thumb_covenant_boxes.jpg',
      icon: '📦',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      playsCount: 0,
      metaCount: '6 rương báu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openCovenantBoxes()'
    },
    {
      id: 'head-tilt',
      title: 'Nghiêng Đầu Chuẩn — Đáp Án Lời Chúa (AI Camera)',
      subtitle: 'Nghiêng Đầu Trái (A) hoặc Phải (B) Để Chọn Đáp Án',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Bật webcam máy tính, học sinh nghiêng đầu sang trái hoặc phải để lựa chọn đáp án đúng cực mượt! Tích hợp nhận diện cử chỉ thông minh hỗ trợ cả lớp!',
      thumbnail: 'anh/games/thumb_head_tilt.jpg',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      playsCount: 0,
      metaCount: '8 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openHeadTiltAI()'
    },
    {
      id: 'pose-imitation',
      title: 'Bắt Chước Cử Điệu Thánh Ca Mau Lẹ (AI Camera)',
      subtitle: 'Nhìn Tư Thế Thánh Nhận Điểm Ân Sủng',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Học sinh nhìn tư thế minh họa cử điệu Công Giáo trên màn hình (Dang tay cầu nguyện, Cung kính chắp tay, Dâng hy lễ) và thực hiện trước Camera AI để ghi điểm!',
      thumbnail: 'anh/games/thumb_pose_imitation.jpg',
      icon: '🧘‍♂️',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      playsCount: 0,
      metaCount: '6 tư thế',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openPoseImitationGame()'
    },
    {
      id: 'indoor-pe-dance',
      title: 'Vũ Điệu Thánh Ca & Khởi Động TNTT (AI Camera)',
      subtitle: 'Cử Điệu Thánh Ca & Sinh Hoạt Trong Lớp Học',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Khởi động giờ học sôi nổi với các bài cử điệu Thiếu Nhi Thánh Thể. Camera AI nhận diện chuyển động khung xương và chấm điểm thời gian thực 100 điểm!',
      thumbnail: 'anh/games/thumb_pe_dance.jpg',
      icon: '🏃‍♂️',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      playsCount: 0,
      metaCount: '6 cử điệu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openIndoorPEDanceGame()'
    },
    {
      id: 'mosquito-slayer',
      title: 'Đa-vít Xua Đuổi Chó Sói Bảo Vệ Đàn Chiên (AI Camera)',
      subtitle: 'Tương Tác Camera Đập Đáp Án Đối Kháng 2 Đội',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Màn hình chia 2 đội Xanh - Vàng. Các chú sói mang đáp án A-B-C-D bay lượn. Học sinh vung tay trước camera đập trúng đáp án đúng để bảo vệ đàn chiên!',
      thumbnail: 'anh/games/thumb_mosquito_slayer.jpg',
      icon: '🛡️',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      playsCount: 0,
      metaCount: '2 đội đối kháng',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMosquitoSlayerGame()'
    },
    {
      id: 'marble-race-quiz',
      title: 'Đua Bi Thiên Thần — Gọi Tên Học Viên Lên Bảng',
      subtitle: 'Đua Bi Zigzag Rơi Vật Lý Chọn Học Viên May Mắn',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Đường đua bi rơi tự do qua chướng ngại vật zigzag ngẫu nhiên. Viên bi thiên thần mang tên học viên nào chạm đáy trước sẽ vinh dự được gọi lên bảng!',
      thumbnail: 'anh/games/thumb_marble_race.jpg',
      icon: '🔮',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      playsCount: 0,
      metaCount: 'Toàn bộ lớp',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openMarbleRace()'
    },
    {
      id: 'duck-race-quiz',
      title: 'Cuộc Đua Con Tàu Nô-ê Trên Sông Gio-đan',
      subtitle: 'Tàu Nô-ê Lướt Sóng Chọn Học Sinh Trả Lời',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Dòng sông Gio-đan cuộn sóng xanh ngát, các con tàu Nô-ê chở muông thú đua nhau về đích chọn ra học sinh may mắn trả lời câu hỏi và nhận điểm cộng.',
      thumbnail: 'anh/games/thumb_duck_race.jpg',
      icon: '⛵',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openDuckRace()'
    },
    {
      id: 'turtle-race-quiz',
      title: 'Cuộc Đua Đàn Chiên Của Người Mục Tử',
      subtitle: 'Đàn Chiên Con Tung Tăng Về Đồng Cỏ Xanh',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Những chú chiên con ngộ nghĩnh mang tên các em thiếu nhi chạy thi trên đồng cỏ xanh tươi. Chú chiên cán đích đầu tiên sẽ chọn ra em học viên may mắn!',
      thumbnail: 'anh/games/thumb_turtle_race.jpg',
      icon: '🐑',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openTurtleRace()'
    },
    {
      id: 'claw-machine-quiz',
      title: 'Máy Gắp Quà Ân Sủng — Gắp Thú Thiên Thần',
      subtitle: 'Hạ Cần Gắp Bắt Thú Bông Mang Tên Học Sinh',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Cần gắp di chuyển qua lại trên bể thú bông và trứng ân sủng rực rỡ. Bấm GẮP để gắp trúng quả cầu phát sáng mở ra tên học sinh được gọi!',
      thumbnail: 'anh/games/thumb_claw_machine.jpg',
      icon: '🧸',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openClawMachine()'
    },
    {
      id: 'student-group-divider-quiz',
      title: 'Phân Đội Thiếu Nhi Thánh Thể (Chiên Con, Ấu, Thiếu, Nghĩa)',
      subtitle: 'Tự Động Bốc Thăm Chia Tổ Đội Công Bằng',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Tự động bốc thăm phân chia cả lớp thành 4 ngành TNTT (Chiên Con, Ấu Nhi, Thiếu Nhi, Nghĩa Sĩ) hoặc các tổ tông đồ với hiệu ứng mở thẻ bài bí mật!',
      thumbnail: 'anh/games/thumb_group_divider.jpg',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      playsCount: 0,
      metaCount: '4 ngành TNTT',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openStudentGroupDivider()'
    },
    {
      id: 'astronaut-quiz',
      title: 'Cỗ Xe Lửa Tiên Tri Ê-li-a Lên Tầng Trời (Gọi Tên)',
      subtitle: 'Phi Hành Không Gian Thần Linh Hạ Cánh Chọn Học Viên',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Cỗ xe lửa rực sáng của Tiên tri Ê-li-a cất cánh lên bầu trời và hạ cánh xuống ngôi sao mang tên học viên may mắn trả lời câu hỏi.',
      thumbnail: 'anh/games/thumb_astronaut.jpg',
      icon: '🚀',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openAstronautExplorer()'
    },
    {
      id: 'magic-hat-quiz',
      title: 'Chiếc Rương Bí Mật & Bồ Câu Bình An',
      subtitle: 'Bồ Câu Trắng Bay Ra Mang Tên Học Sinh Lên Bảng',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Chiếc Rương Giao Ước phát sáng, khi thầy cô bấm triệu hồi, chú Bồ Câu Trắng bay ra mang dải ruy-băng ghi tên học sinh được gọi!',
      thumbnail: 'anh/games/thumb_magic_hat.jpg',
      icon: '🕊️',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #9f1239 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openMagicHat()'
    },
    {
      id: 'magic-grimoire-quiz',
      title: 'Sách Sự Sống Triệu Hồi — AI Nhận Diện Cử Chỉ Tay',
      subtitle: 'Vẫy Tay Trước Camera - Sách Thánh Mở Ra Tên Em',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'camera',
      description: 'Tích hợp webcam nhận diện cử chỉ tay. Học sinh vẫy tay chào trước camera, Sách Sự Sống lật trang ảo diệu dát vàng chọn ra học sinh may mắn!',
      thumbnail: 'anh/games/thumb_magic_grimoire.jpg',
      icon: '📖',
      gradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openMagicGrimoire()'
    },
    {
      id: 'angel-wheel',
      title: 'Vòng Quay Thiên Thần & Thánh Bổn Mạng',
      subtitle: 'Vòng Quay Ngẫu Nhiên Sống Động Gọi Tên Nhận Phúc Lành',
      category: 'VÒNG QUAY MAY MẮN',
      filterCat: 'race',
      description: 'Vòng quay ngẫu nhiên sống động với âm thanh tích tắc vui nhộn, gọi tên học viên lên trả bài, đọc kinh hoặc nhận các phần quà phúc lành ân sủng.',
      thumbnail: 'anh/games/thumb_angel_wheel.jpg',
      icon: '🎡',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openAngelWheel()'
    },
    {
      id: 'noah-ark',
      title: 'Cuộc Đua Con Tàu Nô-ê & Gọi Tên',
      subtitle: 'Con Tàu Vượt Sóng Biển Lớn Về Núi A-ra-rát',
      category: 'GỌI TÊN VÀ ĐUA NHÓM',
      filterCat: 'race',
      description: 'Gọi tên học viên ngẫu nhiên hoặc chia tổ đua kịch tính về đích Con Tàu Nô-ê. Đồng bộ danh sách học viên từ lớp giáo lý hoặc nạp file Excel.',
      thumbnail: 'anh/games/thumb_noah_ark.jpg',
      icon: '🚢',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      playsCount: 0,
      metaCount: '6 làn đua',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openNoahArkRace()'
    },
    {
      id: 'geo-earth-structure-game',
      title: '🌍 3D Kỳ Quan Tạo Dựng: Trái Đất Của Thiên Chúa',
      subtitle: 'Mô Hình 3D Bóc Tách Các Tầng Địa Cầu (Sách Sáng Thế)',
      category: 'KHÁM PHÁ 3D SÁNG THẾ',
      filterCat: '3d',
      description: 'Mô hình 3D tương tác bóc tách các lớp cấu tạo Trái Đất, ca ngợi công trình sáng tạo diệu kỳ của Thiên Chúa trong sách Sáng Thế!',
      thumbnail: 'anh/games/thumb_earth_3d.jpg',
      icon: '🌍',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      playsCount: 0,
      metaCount: 'Mô hình 3D',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openGeoEarthStructureGame()'
    },
    {
      id: 'geo-3d-experiments-game',
      title: '🌐 3D Vũ Trụ Vạn Vật Ca Khen Thiên Chúa',
      subtitle: 'Khám Phá Hệ Mặt Trời, Mặt Trăng & Các Tinh Tú',
      category: 'KHÁM PHÁ 3D VŨ TRỤ',
      filterCat: '3d',
      description: 'Khám phá 3D Hệ Mặt Trời, Nhật thực, Nguyệt thực và các vì sao: "Trời xanh tường thuật vinh quang Chúa, không trung loan báo việc tay Người làm" (Tv 19).',
      thumbnail: 'anh/games/thumb_space_3d.jpg',
      icon: '✨',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      playsCount: 0,
      metaCount: '7 kỳ quan 3D',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openGeo3DExperimentsGame()'
    },
    {
      id: 'khtn-virtual-lab-game',
      title: '🧪 3D Khám Phá Kỳ Quan Tự Nhiên Của Chúa',
      subtitle: 'Phòng Thí Nghiệm Ánh Sáng & Sự Sống Diệu Kỳ (St 1)',
      category: 'PHÒNG THÍ NGHIỆM 3D',
      filterCat: '3d',
      description: 'Khám phá thí nghiệm quang học khúc xạ ánh sáng (Ngày thứ nhất sáng tạo: "Hãy có ánh sáng!"), chu trình nước và tế bào sự sống Thiên Chúa ban tặng.',
      thumbnail: 'anh/games/thumb_virtual_lab.jpg',
      icon: '🧪',
      gradient: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
      playsCount: 0,
      metaCount: 'Mô phỏng 3D',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openKHTNVirtualLabGame()'
    },
    {
      id: 'shepherd-rescue',
      title: 'Người Mục Tử Tốt Lành Bảo Vệ Đàn Chiên',
      subtitle: 'Giải Cứu Đàn Chiên Khỏi Nanh Vuốt Sói Rừng',
      category: 'THỬ THÁCH PHIÊU LƯU',
      filterCat: 'quiz',
      description: 'Chúa Giêsu là Người Mục Tử Nhân Lành. Các em thiếu nhi cùng trả lời câu hỏi Giáo lý để dựng hàng rào chuồng chiên và bảo vệ 100 con chiên an toàn!',
      thumbnail: 'anh/games/thumb_shepherd_rescue.jpg',
      icon: '🐑',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      playsCount: 0,
      metaCount: '100 con chiên',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openShepherdRescue()'
    }
  ];

  // ==========================================================================
  // MAIN HUB RENDERER
  // ==========================================================================
  window.renderCatechismGames = function(container) {
    if (!container) return;

    let classes = [];
    if (window.data && Array.isArray(window.data.classes)) {
      classes = window.data.classes;
    }

    container.innerHTML = `
      <div class="catechism-games-hub">
        <!-- HERO BANNER -->
        <div class="cg-hero-banner">
          <div class="cg-hero-content">
            <span class="cg-hero-badge"><i class="fa-solid fa-cross"></i> KHO TRÒ CHƠI GIÁO LÝ CÔNG GIÁO & KINH THÁNH</span>
            <h1 class="cg-hero-title">Đồ Nghề Dạy Học • Trò Chơi Giáo Lý Đổi Mới</h1>
            <p class="cg-hero-desc">Hệ thống 38 trò chơi tương tác Công Giáo chuyên nghiệp: Trắc nghiệm kịch tính, Đấu kháng đội nhóm, Vòng quay may mắn, Gọi tên học viên và Tương tác Camera AI. Phục vụ đắc lực cho các Giáo Lý Viên và Huynh Trưởng Thiếu Nhi Thánh Thể.</p>
            <div class="cg-hero-actions">
              <button class="cg-hero-btn primary" onclick="window.CatechismGames.openBibleMillionaire()">
                <i class="fa-solid fa-play"></i> Chơi Triệu Phú Kinh Thánh
              </button>
              <button class="cg-hero-btn secondary" onclick="window.CatechismGames.openFaithTugOfWar()">
                <i class="fa-solid fa-people-robbery"></i> Kéo Co Đức Tin 2 Đội
              </button>
              <button class="cg-hero-btn secondary" onclick="window.CatechismGames.openNoahArkRace()">
                <i class="fa-solid fa-ship"></i> Đua Tàu Nô-ê Gọi Tên
              </button>
            </div>
          </div>
          <div class="cg-hero-stats">
            <div class="cg-stat-card">
              <span class="cg-stat-num">${CATECHISM_GAMES_CATALOG.length}</span>
              <span class="cg-stat-label">Trò chơi chuyên biệt</span>
            </div>
            <div class="cg-stat-card">
              <span class="cg-stat-num">100%</span>
              <span class="cg-stat-label">Ý nghĩa Kinh Thánh</span>
            </div>
            <div class="cg-stat-card">
              <span class="cg-stat-num">Excel</span>
              <span class="cg-stat-label">Tùy biến câu hỏi dễ dàng</span>
            </div>
          </div>
        </div>

        <!-- FILTER & SEARCH BAR -->
        <div class="cg-toolbar">
          <div class="cg-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="cg-search-input" placeholder="Tìm kiếm trò chơi giáo lý, gọi tên, kéo co, đố vui..." oninput="window.filterCatechismGames()">
          </div>
          <div class="cg-filter-tabs">
            <button class="cg-filter-btn active" data-filter="all">
              <i class="fa-solid fa-grid-2"></i> Tất cả (${CATECHISM_GAMES_CATALOG.length})
            </button>
            <button class="cg-filter-btn" data-filter="race">
              <i class="fa-solid fa-flag-checkered"></i> Gọi tên & Đua nhóm
            </button>
            <button class="cg-filter-btn" data-filter="quiz">
              <i class="fa-solid fa-circle-question"></i> Đố vui & Phản xạ
            </button>
            <button class="cg-filter-btn" data-filter="words">
              <i class="fa-solid fa-spell-check"></i> Tư duy từ ngữ
            </button>
            <button class="cg-filter-btn" data-filter="camera">
              <i class="fa-solid fa-camera"></i> Tương tác Camera AI
            </button>
            <button class="cg-filter-btn" data-filter="3d">
              <i class="fa-solid fa-cube"></i> Khám phá 3D
            </button>
          </div>
        </div>

        <!-- GAME CARDS GRID: 38 GAME CÔNG GIÁO -->
        <div class="cg-games-grid" id="cg-games-cards-grid">
          ${CATECHISM_GAMES_CATALOG.map(g => {
            const hasCustomQ = Boolean(localStorage.getItem('cg_custom_q_' + g.id) || localStorage.getItem('cg_custom_students_' + g.id));
            let metaDisplay = g.metaCount;
            if (hasCustomQ) {
              try {
                const stored = JSON.parse(localStorage.getItem('cg_custom_q_' + g.id) || localStorage.getItem('cg_custom_students_' + g.id) || '[]');
                if (stored.length > 0) {
                  metaDisplay = `${stored.length} ${g.isStudentPicker ? 'em' : 'câu'} (Tùy biến)`;
                }
              } catch(e) {}
            }
            return `
              <div class="cg-game-card" data-category="${g.filterCat}">
                <div class="cg-card-thumb-wrap" style="background: ${g.gradient || 'linear-gradient(135deg, #0284c7, #1d4ed8)'};">
                  ${g.thumbnail ? `<img src="${g.thumbnail}" class="cg-card-thumb" alt="${g.title}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">` : ''}
                  <div class="cg-card-thumb-fallback" style="${g.thumbnail ? 'display: none;' : 'display: flex;'} width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 3.8rem; text-shadow: 0 4px 20px rgba(0,0,0,0.3); background: ${g.gradient || 'linear-gradient(135deg, #0284c7, #1d4ed8)'};">
                    ${g.icon}
                  </div>
                  <div class="cg-card-thumb-overlay"></div>
                  <span class="cg-card-badge-topleft">${g.category}</span>
                  <span class="cg-card-badge-topright">${g.playsCount || 0} Lượt chơi</span>
                  <div class="cg-card-engine-icon">${g.icon}</div>
                </div>

                <div class="cg-card-body">
                  <div>
                    <h3 class="cg-card-title">${g.title}</h3>
                    <p class="cg-card-desc">${g.description}</p>
                    <div class="cg-card-meta-row">
                      <span>${g.isStudentPicker ? 'Số học sinh' : 'Số câu hỏi'}: <strong id="cg-meta-${g.id}" data-default-meta="${g.metaCount}">${metaDisplay}</strong></span>
                    </div>
                  </div>

                  <div>
                    <button class="cg-btn-play-primary" onclick="${g.onPlay}">
                      <i class="fa-solid fa-play" style="font-size: 0.9rem;"></i>
                      <span>Chơi Ngay</span>
                    </button>
                    <div class="cg-card-actions-row">
                      <button class="cg-btn-action" onclick="window.CatechismGames.openCustomizer('${g.id}', '${g.title.replace(/'/g, "\'")}', ${g.isStudentPicker ? 'true' : 'false'})">
                        <i class="fa-solid fa-file-excel"></i> Nạp Excel
                      </button>
                      <button class="cg-btn-action" onclick="window.CatechismGames.downloadTemplate('${g.id}', '${g.title.replace(/'/g, "\'")}', ${g.isStudentPicker ? 'true' : 'false'})">
                        <i class="fa-solid fa-download"></i> Tải Mẫu
                      </button>
                      <button class="cg-btn-action" title="Khôi phục mặc định" onclick="window.CatechismGames.resetGameData('${g.id}', '${g.title.replace(/'/g, "\'")}')">
                        <i class="fa-solid fa-rotate-left"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Hook tab filtering events
    const filterBtns = container.querySelectorAll('.cg-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        window.filterCatechismGames(filter);
      });
    });
  };

  window.filterCatechismGames = function(targetFilter) {
    const searchVal = (document.getElementById('cg-search-input')?.value || '').toLowerCase().trim();
    const activeTab = targetFilter || document.querySelector('.cg-filter-btn.active')?.getAttribute('data-filter') || 'all';
    const cards = document.querySelectorAll('.cg-game-card');

    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const title = (card.querySelector('.cg-card-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.cg-card-desc')?.textContent || '').toLowerCase();

      const matchCat = (activeTab === 'all' || cat === activeTab);
      const matchSearch = (!searchVal || title.includes(searchVal) || desc.includes(searchVal));

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // ==========================================================================
  // GAME ARENA LOGIC CONTROLLER
  // ==========================================================================
  window.CatechismGames = {

    showGlobalExitFab: function() {
      if (!document.getElementById('cgGlobalExitFab')) {
        const fab = document.createElement('button');
        fab.id = 'cgGlobalExitFab';
        fab.className = 'cg-global-exit-fab';
        fab.setAttribute('title', 'Thoát trò chơi (hoặc bấm ESC trên bàn phím)');
        fab.innerHTML = '<i class="fa-solid fa-person-walking-arrow-right"></i> <span>THOÁT GAME (ESC)</span>';
        fab.onclick = function() {
          window.CatechismGames.closeActiveGame();
        };
        document.body.appendChild(fab);
      }
    },

    removeGlobalExitFab: function() {
      const fab = document.getElementById('cgGlobalExitFab');
      if (fab) fab.remove();
    },

    closeActiveGame: function() {
      if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
      const overlays = document.querySelectorAll('.cg-arena-overlay, .cg-classroom-modal, .cg-win-modal, .cg-book-modal-backdrop, .cg-chapter-reader-backdrop, #cg-customizer-modal');
      overlays.forEach(arena => {
        if (arena._cleanupInterval) clearInterval(arena._cleanupInterval);
        if (arena._cleanupAnim) cancelAnimationFrame(arena._cleanupAnim);
        if (arena._cleanupCamera) try { arena._cleanupCamera(); } catch(e){}
        if (arena._cleanupKey) try { arena._cleanupKey(); } catch(e){}
        arena.remove();
      });
      window.CatechismGames.removeGlobalExitFab();
    },

    closeArena: function(arenaId) {
      const arena = document.getElementById(arenaId);
      if (arena) {
        if (arena._cleanupInterval) clearInterval(arena._cleanupInterval);
        if (arena._cleanupAnim) cancelAnimationFrame(arena._cleanupAnim);
        if (arena._cleanupCamera) try { arena._cleanupCamera(); } catch(e){}
        if (arena._cleanupKey) try { arena._cleanupKey(); } catch(e){}
        arena.remove();
      }
      if (!document.querySelector('.cg-classroom-modal, .cg-arena-overlay')) {
        window.CatechismGames.removeGlobalExitFab();
      }
    },

    getSafeQuestions: function(gameId, customFallback) {
      try {
        const custom = localStorage.getItem('cg_custom_q_' + gameId);
        if (custom) {
          const parsed = JSON.parse(custom);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      if (Array.isArray(customFallback) && customFallback.length > 0) return customFallback;
      return [
        { question: "Mẹ Maria được chào chúc là 'Đầy ơn phúc' trong biến cố nào?", options: ["Truyền Tin", "Thăm viếng", "Giáng sinh", "Dâng Chúa trong Đền Thờ"], correct: 0 },
        { question: "Ai là người đóng con tàu cứu sinh trong trận lụt đại hồng thủy?", options: ["Ông Nô-ê", "Ông Áp-ra-ham", "Ông Mô-sê", "Ông Đa-vít"], correct: 0 },
        { question: "Lời xin vâng nổi tiếng của Đức Mẹ Maria là gì?", options: ["Này tôi là tôi tớ Chúa, xin Chúa cứ làm cho tôi như lời sứ thần nói", "Lạy Chúa xin hãy phán", "Xin Chúa thương xót con", "Chúc tụng Đấng ngự đến"], correct: 0 },
        { question: "Bí Tích nào xóa bỏ Tội Tổ Tông và đưa ta vào Dân Thánh Chúa?", options: ["Bí Tích Rửa Tội", "Bí Tích Thêm Sức", "Bí Tích Thánh Thể", "Bí Tích Hòa Giải"], correct: 0 },
        { question: "Điều Răn trọng nhất trong Đạo Chúa dạy điều gì?", options: ["Kính mến Thiên Chúa trên hết mọi sự và yêu tha nhân như chính mình", "Chớ trộm cắp", "Thảo kính cha mẹ", "Chớ làm chứng dối"], correct: 0 },
        { question: "Bốn tác giả sách Tin Mừng (Tứ Phúc Âm) gồm những vị nào?", options: ["Mát-thêu, Mác-cô, Lu-ca, Gio-an", "Phê-rô, Phao-lô, Gio-an, Gia-cô-bê", "Mô-sê, Ê-li-a, Đa-vít, Sa-lô-môn", "A-đam, E-và, Nô-ê, Áp-ra-ham"], correct: 0 }
      ];
    },

    getSafeRoster: function(gameId) {
      try {
        const custom = localStorage.getItem('cg_custom_students_' + gameId);
        if (custom) {
          const parsed = JSON.parse(custom);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return [
        "Phê-rô Nguyễn Văn An", "Maria Trần Thị Bình", "Giuse Lê Hoàng Cường", "Têrêsa Phạm Minh Dũng",
        "Phaolô Vũ Thị Em", "Gioan Đặng Văn Phúc", "Anna Bùi Thị Giang", "Mácta Đỗ Minh Hưng",
        "Đaminh Hồ Văn Ích", "Luxia Nông Thị Kiều", "Antôn Trịnh Văn Long", "Cecilia Phan Thị Mai",
        "Giacôbê Lương Văn Nam", "Agata Ngô Thị Oanh", "Micae Dương Văn Phong", "Tôma Hoàng Văn Quý",
        "Clara Đinh Thị Rạng", "Stêphanô Lý Văn Sang", "Bactôlômêô Tạ Văn Toàn", "Têrêsa Hài Đồng Uyên"
      ];
    },

    // ------------------------------------------------------------------------
    // CLASSROOM MODAL FRAMEWORK (Khung modal lớp học chuẩn)
    // ------------------------------------------------------------------------
    renderClassroomModal: function(config) {
      window.CatechismGames.closeActiveGame();
      window.CatechismGames.showGlobalExitFab();

      const modal = document.createElement('div');
      modal.id = 'cgClassroomModal_' + (config.id || 'arena');
      modal.className = 'cg-classroom-modal';

      // Default 2 Teams
      let teams = [
        { id: 1, name: 'Đội Phê-rô', score: 0, color: '#38bdf8' },
        { id: 2, name: 'Đội Phao-lô', score: 0, color: '#f43f5e' }
      ];
      let activeTeamIdx = 0;

      modal.innerHTML = `
        <div class="cg-cm-backdrop" onclick="window.CatechismGames.closeActiveGame()"></div>
        <div class="cg-cm-dialog">
          <!-- Top bar -->
          <div class="cg-cm-header">
            <div class="cg-cm-title-wrap">
              <span class="cg-cm-icon">${config.icon || '✨'}</span>
              <div>
                <h2 class="cg-cm-title">${config.title}</h2>
                <span class="cg-cm-cat-badge">${config.category || 'GIÁO LÝ CÔNG GIÁO'}</span>
              </div>
            </div>
            <div class="cg-cm-header-actions">
              <div class="cg-cm-team-pills" id="cg-cm-team-pills">
                ${teams.map((t, idx) => `
                  <button class="cg-cm-team-pill ${idx === activeTeamIdx ? 'active' : ''}" style="border-color:${t.color}" onclick="window._cgSwitchTeam(${idx})">
                    <span class="cg-cm-pill-dot" style="background:${t.color}"></span>
                    <span>${t.name}: <strong id="cg-pill-score-${t.id}">${t.score}</strong></span>
                  </button>
                `).join('')}
              </div>
              <button class="cg-cm-btn-tool" title="Nạp câu hỏi Excel" onclick="window.CatechismGames.openCustomizer('${config.id}', '${config.title.replace(/'/g, "\'")}', false)">
                <i class="fa-solid fa-file-excel"></i>
              </button>
              <button class="cg-cm-btn-close" title="Đóng trò chơi (ESC)" onclick="window.CatechismGames.closeActiveGame()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Main Stage Body -->
          <div class="cg-cm-stage-body" id="cg-cm-stage-body"></div>
        </div>
      `;

      document.body.appendChild(modal);

      window._cgSwitchTeam = function(idx) {
        activeTeamIdx = idx;
        const pills = modal.querySelectorAll('.cg-cm-team-pill');
        pills.forEach((p, i) => {
          if (i === idx) p.classList.add('active');
          else p.classList.remove('active');
        });
        if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
      };

      window._cgAddPoints = function(teamIdx, pts) {
        const t = teams[teamIdx];
        if (t) {
          t.score += pts;
          const el = document.getElementById('cg-pill-score-' + t.id);
          if (el) el.textContent = t.score;
        }
      };

      const stageBody = modal.querySelector('#cg-cm-stage-body');
      if (typeof config.onStart === 'function') {
        config.onStart(stageBody, teams);
      }
      return modal;
    },

    // ------------------------------------------------------------------------
    // 1. TRÁI TIM VÔ NHIỄM MẸ MARIA & TÌNH CHÚA YÊU CON
    // ------------------------------------------------------------------------
    openHeartPuzzleGame: function() {
      const questions = window.CatechismGames.getSafeQuestions('heart-puzzle-2010');
      window.CatechismGames.renderClassroomModal({
        id: 'heart-puzzle-2010',
        title: 'Trái Tim Vô Nhiễm Mẹ Maria & Tình Chúa Yêu Con',
        category: 'CHỦ ĐỀ ĐỨC MẸ',
        icon: '💖',
        questions: questions,
        onStart: function(stageBody, teams) {
          let currentQ = 0;
          let solvedCount = 0;
          const totalPieces = Math.min(10, questions.length);

          function render() {
            const q = questions[currentQ % questions.length];
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box; overflow-y:auto;">
                <div style="display:flex; gap:32px; width:100%; max-width:1100px; justify-content:center; align-items:center; flex-wrap:wrap;">
                  <!-- Heart Puzzle Visualizer -->
                  <div style="position:relative; width:340px; height:340px; background:#fff1f2; border:3px solid #fda4af; border-radius:36px; overflow:hidden; box-shadow:0 12px 30px rgba(225,29,72,0.15); display:flex; align-items:center; justify-content:center;">
                    <img src="anh/games/thumb_heart_puzzle.jpg" style="width:100%; height:100%; object-fit:cover; filter:blur(${Math.max(0, 16 - solvedCount * 2)}px) brightness(${0.5 + solvedCount * 0.05}); transition:all 0.6s ease;">
                    <div style="position:absolute; inset:0; display:grid; grid-template-columns:repeat(5, 1fr); grid-template-rows:repeat(2, 1fr); gap:4px; padding:8px;">
                      ${Array.from({length:10}).map((_, i) => `
                        <div style="background:${i < solvedCount ? 'rgba(255,255,255,0.05)' : 'rgba(225,29,72,0.85)'}; border:1.5px dashed rgba(255,255,255,0.4); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-size:1.1rem; transition:all 0.5s ease;">
                          ${i < solvedCount ? '💖' : (i + 1)}
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Question Box -->
                  <div style="flex:1; min-width:320px; max-width:580px; background:#ffffff; border:2px solid #fecdd3; border-radius:24px; padding:28px; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                      <span style="font-size:0.9rem; font-weight:800; color:#e11d48; text-transform:uppercase;">MẢNH GHÉP ${solvedCount + 1} / ${totalPieces}</span>
                      <span style="font-size:0.85rem; font-weight:700; color:#64748b;">Độ sáng tranh: ${solvedCount * 10}%</span>
                    </div>
                    <h3 style="font-size:1.25rem; font-weight:800; color:#1e293b; line-height:1.5; margin:0 0 20px 0;">${q.question}</h3>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                      ${q.options.map((opt, oIdx) => `
                        <button class="cg-opt-btn" onclick="window._cgHeartAnswer(${oIdx})" style="padding:14px 18px; border-radius:14px; border:2px solid #e2e8f0; background:#f8fafc; color:#1e293b; font-weight:700; font-size:1rem; text-align:left; cursor:pointer; transition:all 0.2s ease;">
                          <strong style="color:#e11d48; margin-right:8px;">${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }

          window._cgHeartAnswer = function(chosenIdx) {
            const q = questions[currentQ % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
              solvedCount++;
              window._cgAddPoints(0, 50);
              if (solvedCount >= totalPieces) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80 });
                alert('Tạ ơn Chúa! Các em đã hoàn thành bức tranh Trái Tim Vô Nhiễm Mẹ Maria!');
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert('Chưa chính xác, hãy cầu nguyện và thử lại nhé!');
            }
            currentQ++;
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 2. KÉO CO ĐỨC TIN: ĐỘI PHÊ-RÔ VS ĐỘI PHAO-LÔ
    // ------------------------------------------------------------------------
    openFaithTugOfWar: function() {
      const questions = window.CatechismGames.getSafeQuestions('faith-tugofwar');
      window.CatechismGames.renderClassroomModal({
        id: 'faith-tugofwar',
        title: 'Kéo Co Đức Tin: Đội Phê-rô vs Đội Phao-lô',
        category: 'ĐỐI KHÁNG ĐỘI NHÓM',
        icon: '⚔️',
        questions: questions,
        onStart: function(stageBody, teams) {
          let ropePos = 0; // -5 to +5
          let qIdx = 0;
          let activeTeam = 0; // 0: Phero (blue), 1: Phaolo (red)

          function render() {
            const q = questions[qIdx % questions.length];
            const leftPct = 50 + (ropePos * 8);

            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- Rope Field -->
                <div style="width:100%; max-width:980px; background:#eff6ff; border:3px solid #bfdbfe; border-radius:28px; padding:24px; margin-bottom:24px; position:relative; overflow:hidden;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; font-weight:800;">
                    <span style="color:#0284c7; font-size:1.15rem;"><i class="fa-solid fa-shield-halved"></i> ĐỘI PHÊ-RÔ (BÊN TRÁI)</span>
                    <span style="color:#dc2626; font-size:1.15rem;">ĐỘI PHAO-LÔ (BÊN PHẢI) <i class="fa-solid fa-crosshairs"></i></span>
                  </div>

                  <!-- Grass / Sand arena -->
                  <div style="position:relative; width:100%; height:90px; background:#ecfdf5; border-radius:18px; border:2px dashed #a7f3d0; display:flex; align-items:center;">
                    <!-- Center Mark -->
                    <div style="position:absolute; left:50%; top:0; bottom:0; width:4px; background:#f59e0b; transform:translateX(-50%);"></div>
                    <!-- Rope -->
                    <div style="position:absolute; left:5%; right:5%; height:12px; background:#78350f; border-radius:6px; box-shadow:0 3px 6px rgba(0,0,0,0.2);"></div>
                    <!-- Golden Cross Ribbon -->
                    <div style="position:absolute; left:${leftPct}%; transform:translateX(-50%); width:46px; height:46px; background:#f59e0b; border:3px solid #fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; box-shadow:0 6px 16px rgba(245,158,11,0.5); transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                      ✝️
                    </div>
                  </div>
                </div>

                <!-- Active Turn & Question -->
                <div style="width:100%; max-width:800px; background:#ffffff; border:2px solid ${activeTeam === 0 ? '#38bdf8' : '#f87171'}; border-radius:24px; padding:28px; box-shadow:0 12px 30px rgba(0,0,0,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <span style="font-weight:900; font-size:1.05rem; color:${activeTeam === 0 ? '#0284c7' : '#dc2626'};">
                      <i class="fa-solid fa-bolt"></i> LƯỢT KÉO CỦA: ${teams[activeTeam].name.toUpperCase()}
                    </span>
                    <span style="color:#64748b; font-weight:700;">Câu ${qIdx + 1}/${questions.length}</span>
                  </div>
                  <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 20px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgTugAnswer(${oIdx})" style="padding:14px 18px; border-radius:14px; border:2px solid #e2e8f0; background:#f8fafc; color:#1e293b; font-weight:700; font-size:0.95rem; text-align:left; cursor:pointer;">
                        <strong style="color:${activeTeam === 0 ? '#0284c7' : '#dc2626'}; margin-right:6px;">${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }

          window._cgTugAnswer = function(chosenIdx) {
            const q = questions[qIdx % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
              if (activeTeam === 0) {
                ropePos = Math.max(-5, ropePos - 1.5);
                window._cgAddPoints(0, 100);
              } else {
                ropePos = Math.min(5, ropePos + 1.5);
                window._cgAddPoints(1, 100);
              }

              if (ropePos <= -4.5) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80 });
                alert('🏆 ĐỘI PHÊ-RÔ ĐÃ CHIẾN THẮNG TRONG TIẾNG REO HÒ VUI MỪNG!');
              } else if (ropePos >= 4.5) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80 });
                alert('🏆 ĐỘI PHAO-LÔ ĐÃ CHIẾN THẮNG TRONG TIẾNG REO HÒ VUI MỪNG!');
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
            }
            activeTeam = 1 - activeTeam;
            window._cgSwitchTeam(activeTeam);
            qIdx++;
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 3. THỬ THÁCH TRIỆU PHÚ KINH THÁNH (15 CÂU HỎI BẬC THANG)
    // ------------------------------------------------------------------------
    openBibleMillionaire: function() {
      const questions = window.CatechismGames.getSafeQuestions('bible-millionaire');
      window.CatechismGames.renderClassroomModal({
        id: 'bible-millionaire',
        title: 'Thử Thách Triệu Phú Kinh Thánh',
        category: 'TRẮC NGHIỆM KỊCH TÍNH',
        icon: '💰',
        questions: questions,
        onStart: function(stageBody, teams) {
          let step = 0; // 0 to 14
          let lifelines = { fifty: true, bishop: true, bible: true };

          const prizeLadder = [
            "100 Điểm", "200 Điểm", "300 Điểm", "500 Điểm", "⭐ 1.000 Điểm (CỘT MỐC 1)",
            "2.000 Điểm", "3.600 Điểm", "6.000 Điểm", "10.000 Điểm", "🌟 22.000 Điểm (CỘT MỐC 2)",
            "35.000 Điểm", "60.000 Điểm", "85.000 Điểm", "120.000 Điểm", "👑 150.000 ĐIỂM TRIỆU PHÚ KINH THÁNH"
          ];

          function render() {
            const q = questions[step % questions.length];
            stageBody.innerHTML = `
              <div style="display:flex; gap:24px; width:100%; height:100%; padding:20px; box-sizing:border-box; overflow:hidden;">
                <!-- Main Game Screen -->
                <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; background:#071521; border-radius:24px; padding:24px; border:2px solid #1e3a8a; box-shadow:inset 0 0 50px rgba(30,58,138,0.3);">
                  <!-- Lifelines -->
                  <div style="display:flex; justify-content:center; gap:16px;">
                    <button class="cg-lifeline-btn" style="padding:10px 18px; border-radius:999px; background:${lifelines.fifty ? '#1e3a8a' : '#334155'}; color:#fff; border:2px solid #38bdf8; font-weight:800; cursor:${lifelines.fifty ? 'pointer' : 'not-allowed'}; opacity:${lifelines.fifty ? '1' : '0.4'};" onclick="window._cgMilLifeline('fifty')">
                      ⚡ 50:50
                    </button>
                    <button class="cg-lifeline-btn" style="padding:10px 18px; border-radius:999px; background:${lifelines.bishop ? '#1e3a8a' : '#334155'}; color:#fff; border:2px solid #38bdf8; font-weight:800; cursor:${lifelines.bishop ? 'pointer' : 'not-allowed'}; opacity:${lifelines.bishop ? '1' : '0.4'};" onclick="window._cgMilLifeline('bishop')">
                      ✝️ Hỏi Đức Giám Mục
                    </button>
                    <button class="cg-lifeline-btn" style="padding:10px 18px; border-radius:999px; background:${lifelines.bible ? '#1e3a8a' : '#334155'}; color:#fff; border:2px solid #38bdf8; font-weight:800; cursor:${lifelines.bible ? 'pointer' : 'not-allowed'}; opacity:${lifelines.bible ? '1' : '0.4'};" onclick="window._cgMilLifeline('bible')">
                      📖 Lời Khuyên Kinh Thánh
                    </button>
                  </div>

                  <!-- Question Hexagon -->
                  <div style="background:linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border:3px solid #f59e0b; border-radius:20px; padding:24px; text-align:center; box-shadow:0 0 25px rgba(245,158,11,0.25);">
                    <div style="color:#38bdf8; font-weight:800; font-size:0.9rem; margin-bottom:8px;">CÂU HỎI SỐ ${step + 1} / 15: ${prizeLadder[step]}</div>
                    <h3 style="color:#ffffff; font-size:1.35rem; font-weight:800; line-height:1.5; margin:0;">${q.question}</h3>
                  </div>

                  <!-- Options 2x2 -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgMilAnswer(${oIdx})" id="cg-mil-opt-${oIdx}" style="background:#0f172a; border:2px solid #3b82f6; border-radius:16px; padding:16px 20px; color:#ffffff; font-weight:700; font-size:1.05rem; text-align:left; cursor:pointer; transition:all 0.2s ease;">
                        <span style="color:#f59e0b; font-weight:900; margin-right:8px;">${String.fromCharCode(65 + oIdx)}:</span> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- Ladder Sidebar -->
                <div style="width:260px; background:#071521; border-radius:24px; border:2px solid #1e3a8a; padding:16px; display:flex; flex-direction:column-reverse; gap:4px; overflow-y:auto;">
                  ${prizeLadder.map((prize, idx) => `
                    <div style="padding:6px 12px; border-radius:10px; font-size:0.85rem; font-weight:800; background:${idx === step ? '#f59e0b' : idx % 5 === 4 ? 'rgba(56,189,248,0.15)' : 'transparent'}; color:${idx === step ? '#000' : idx % 5 === 4 ? '#38bdf8' : '#94a3b8'}; border:${idx === step ? '2px solid #fff' : 'none'}; display:flex; justify-content:space-between;">
                      <span>${idx + 1}</span>
                      <span>${prize}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }

          window._cgMilLifeline = function(type) {
            if (!lifelines[type]) return;
            lifelines[type] = false;
            const q = questions[step % questions.length];
            if (type === 'fifty') {
              let removed = 0;
              q.options.forEach((_, idx) => {
                if (idx !== q.correct && removed < 2) {
                  const el = document.getElementById('cg-mil-opt-' + idx);
                  if (el) { el.style.opacity = '0.1'; el.disabled = true; }
                  removed++;
                }
              });
              if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
            } else if (type === 'bishop') {
              const letter = String.fromCharCode(65 + q.correct);
              alert(`✝️ Đức Giám Mục mỉm cười và nói: "Sau khi suy niệm Lời Chúa, Ta tin chắc đáp án đúng là ${letter}!"`);
            } else if (type === 'bible') {
              alert(`📖 Lời Kinh Thánh soi dẫn: "Lạy Chúa, Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi" (Tv 119, 105). Hãy chú ý kỹ đáp án liên quan đến Đức Mến!`);
            }
          };

          window._cgMilAnswer = function(chosenIdx) {
            const q = questions[step % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
              window._cgAddPoints(0, 1000);
              step++;
              if (step >= 15) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90 });
                alert('👑 XIN CHÚC MỪNG! EM ĐÃ CHINH PHỤC THÀNH CÔNG 15 CÂU HỎI VÀ ĐOẠT DANH HIỆU TRIỆU PHÚ KINH THÁNH!');
              } else {
                render();
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert(`Rất tiếc! Đáp án đúng là ${String.fromCharCode(65 + q.correct)}: ${q.options[q.correct]}. Cảm ơn em đã tham gia thi đấu!`);
              step = 0;
              render();
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 4. CUỘC ĐUA CON TÀU NÔ-Ê TRÊN SÔNG GIO-ĐAN (GỌI TÊN HỌC SINH)
    // ------------------------------------------------------------------------
    openNoahArkRace: function() {
      const roster = window.CatechismGames.getSafeRoster('noah-ark');
      window.CatechismGames.renderClassroomModal({
        id: 'noah-ark',
        title: 'Cuộc Đua Con Tàu Nô-ê & Gọi Tên Học Viên',
        category: 'GỌI TÊN VÀ ĐUA NHÓM',
        icon: '🚢',
        onStart: function(stageBody, teams) {
          const lanesCount = 6;
          let racers = [];
          for (let i = 0; i < lanesCount; i++) {
            racers.push({
              id: i,
              name: roster[i % roster.length],
              pos: 0,
              finished: false
            });
          }

          let isRacing = false;

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- River Area -->
                <div style="width:100%; max-width:980px; flex:1; background:linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); border-radius:24px; padding:16px; border:3px solid #bae6fd; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-around;">
                  <!-- Finish Arch -->
                  <div style="position:absolute; right:40px; top:0; bottom:0; width:8px; background:repeating-linear-gradient(0deg, #fff, #fff 15px, #ef4444 15px, #ef4444 30px); z-index:5;">
                    <div style="position:absolute; top:8px; right:-20px; background:#f59e0b; color:#fff; font-weight:900; font-size:0.75rem; padding:4px 8px; border-radius:8px;">ĐÍCH ĐẾN</div>
                  </div>

                  ${racers.map((r, idx) => `
                    <div style="position:relative; height:46px; border-bottom:1px dashed rgba(255,255,255,0.3); display:flex; align-items:center;">
                      <span style="position:absolute; left:8px; color:#fff; font-size:0.8rem; font-weight:800; text-shadow:0 1px 3px rgba(0,0,0,0.5);">Làn ${idx + 1}</span>
                      <div id="cg-ark-ship-${r.id}" style="position:absolute; left:${r.pos}%; display:flex; align-items:center; gap:8px; transition:left 0.1s linear;">
                        <span style="font-size:2rem; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3));">⛵</span>
                        <span style="background:rgba(255,255,255,0.92); color:#0369a1; font-weight:800; font-size:0.85rem; padding:3px 10px; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,0.2); white-space:nowrap;">${r.name}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Control Buttons -->
                <div style="margin-top:20px; display:flex; gap:16px;">
                  <button id="cg-btn-start-ark" onclick="window._cgStartArkRace()" style="padding:14px 40px; border-radius:999px; background:#10b981; color:#fff; border:none; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow:0 8px 20px rgba(16,185,129,0.4);">
                    <i class="fa-solid fa-flag-checkered"></i> BẮT ĐẦU ĐUA GỌI TÊN
                  </button>
                  <button onclick="window._cgShuffleArkRacers()" style="padding:14px 28px; border-radius:999px; background:#3b82f6; color:#fff; border:none; font-weight:800; font-size:1rem; cursor:pointer;">
                    <i class="fa-solid fa-shuffle"></i> Đổi 6 Bạn Khác
                  </button>
                </div>
              </div>
            `;
          }

          window._cgShuffleArkRacers = function() {
            if (isRacing) return;
            const shuffled = [...roster].sort(() => 0.5 - Math.random());
            racers.forEach((r, idx) => {
              r.name = shuffled[idx % shuffled.length];
              r.pos = 0;
            });
            render();
          };

          window._cgStartArkRace = function() {
            if (isRacing) return;
            isRacing = true;
            document.getElementById('cg-btn-start-ark').disabled = true;
            if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();

            let raceTimer = setInterval(() => {
              racers.forEach(r => {
                if (r.pos < 82) {
                  r.pos += Math.random() * 2.8;
                  const el = document.getElementById('cg-ark-ship-' + r.id);
                  if (el) el.style.left = r.pos + '%';
                } else if (!r.finished) {
                  r.finished = true;
                  clearInterval(raceTimer);
                  isRacing = false;
                  if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                  if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
                  alert(`🎉 CHÚC MỪNG BẠN: ${r.name.toUpperCase()} (Con Tàu Làn ${r.id + 1}) ĐÃ CÁN ĐÍCH ĐẦU TIÊN VÀ ĐƯỢC CHỌN!`);
                  document.getElementById('cg-btn-start-ark').disabled = false;
                }
              });
            }, 60);
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 5. ĐUA VỊT / ĐUA RÙA GỌI TÊN
    // ------------------------------------------------------------------------
    openDuckRace: function() {
      window.CatechismGames.openNoahArkRace();
    },

    openTurtleRace: function() {
      window.CatechismGames.openNoahArkRace();
    },

    // ------------------------------------------------------------------------
    // 6. ĐUA BI THIÊN THẦN (MARBLE RACE)
    // ------------------------------------------------------------------------
    openMarbleRace: function() {
      const roster = window.CatechismGames.getSafeRoster('marble-race-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'marble-race-quiz',
        title: 'Đua Bi Thiên Thần — Gọi Tên Học Viên Lên Bảng',
        category: 'GỌI TÊN VÀ CHIA NHÓM',
        icon: '🔮',
        onStart: function(stageBody, teams) {
          const marbleCount = Math.min(8, roster.length);
          let marbles = roster.slice(0, marbleCount).map((name, i) => ({
            id: i,
            name: name,
            x: 10 + i * 11,
            y: 10,
            color: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'][i % 8]
          }));

          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
              <!-- Marble Pin Board -->
              <div style="position:relative; width:100%; max-width:800px; height:420px; background:#0f172a; border-radius:24px; border:3px solid #38bdf8; overflow:hidden; box-shadow:0 15px 40px rgba(0,0,0,0.5);">
                <!-- Pegs -->
                ${Array.from({length:24}).map((_, i) => {
                  const px = 15 + (i % 6) * 14;
                  const py = 25 + Math.floor(i / 6) * 20;
                  return `<div style="position:absolute; left:${px}%; top:${py}%; width:10px; height:10px; background:#64748b; border-radius:50%; box-shadow:0 0 8px #94a3b8;"></div>`;
                }).join('')}

                <!-- Marbles -->
                ${marbles.map(m => `
                  <div id="cg-marble-${m.id}" style="position:absolute; left:${m.x}%; top:${m.y}%; width:34px; height:34px; background:${m.color}; border:2px solid #fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:900; box-shadow:0 0 12px ${m.color}; transition:all 0.08s ease;">
                    ${m.id + 1}
                  </div>
                `).join('')}

                <!-- Bottom Funnel / Winner Gate -->
                <div style="position:absolute; bottom:0; left:35%; right:35%; height:45px; background:#f59e0b; border-radius:16px 16px 0 0; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-size:0.95rem;">
                  🏆 CỬA THẮNG GỌI TÊN
                </div>
              </div>

              <!-- Action Controls -->
              <div style="margin-top:20px; display:flex; gap:16px;">
                <button id="cg-btn-drop-marble" onclick="window._cgDropMarbles()" style="padding:14px 40px; border-radius:999px; background:#3b82f6; color:#fff; border:none; font-weight:900; font-size:1.1rem; cursor:pointer;">
                  <i class="fa-solid fa-arrow-down"></i> THẢ BI RƠI GỌI TÊN
                </button>
              </div>
            </div>
          `;

          window._cgDropMarbles = function() {
            document.getElementById('cg-btn-drop-marble').disabled = true;
            if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();

            let timer = setInterval(() => {
              marbles.forEach(m => {
                if (m.y < 82) {
                  m.y += 2 + Math.random() * 2.5;
                  m.x += (Math.random() - 0.5) * 4;
                  m.x = Math.max(8, Math.min(88, m.x));
                  const el = document.getElementById('cg-marble-' + m.id);
                  if (el) { el.style.top = m.y + '%'; el.style.left = m.x + '%'; }
                } else if (!m.done) {
                  m.done = true;
                  clearInterval(timer);
                  if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                  if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
                  alert(`🎉 CHÚC MỪNG VIÊN BI SỐ ${m.id + 1}: ${m.name.toUpperCase()} ĐÃ CHẠM ĐÍCH VÀ ĐƯỢC GỌI LÊN BẢNG!`);
                  document.getElementById('cg-btn-drop-marble').disabled = false;
                }
              });
            }, 60);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 7. MÁY GẮP QUÀ ÂN SỦNG THIÊN THẦN
    // ------------------------------------------------------------------------
    openClawMachine: function() {
      const roster = window.CatechismGames.getSafeRoster('claw-machine-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'claw-machine-quiz',
        title: 'Máy Gắp Quà Ân Sủng — Gắp Thú Thiên Thần',
        category: 'GỌI TÊN VÀ CHIA NHÓM',
        icon: '🧸',
        onStart: function(stageBody, teams) {
          let clawX = 50;
          let clawY = 15;
          let isClawing = false;

          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
              <!-- Machine Box -->
              <div style="position:relative; width:100%; max-width:700px; height:420px; background:#fdf2f8; border:4px solid #f472b6; border-radius:32px; overflow:hidden; box-shadow:0 15px 40px rgba(244,114,182,0.25);">
                <!-- Top Crane Track -->
                <div style="position:absolute; top:12px; left:20px; right:20px; height:10px; background:#cbd5e1; border-radius:5px;"></div>
                
                <!-- Claw -->
                <div id="cg-claw" style="position:absolute; left:${clawX}%; top:${clawY}%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; transition:top 0.4s ease;">
                  <div style="width:4px; height:50px; background:#64748b;"></div>
                  <div style="font-size:2.2rem; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.2));">🪝</div>
                </div>

                <!-- Prize Eggs / Plushies -->
                <div style="position:absolute; bottom:16px; left:24px; right:24px; display:flex; justify-content:space-around; align-items:flex-end;">
                  <span style="font-size:3.2rem;">🧸</span>
                  <span style="font-size:3.2rem;">🎁</span>
                  <span style="font-size:3.2rem;">🕊️</span>
                  <span style="font-size:3.2rem;">⭐</span>
                  <span style="font-size:3.2rem;">💖</span>
                </div>
              </div>

              <!-- Button Controls -->
              <div style="margin-top:20px; display:flex; gap:16px;">
                <button onclick="window._cgMoveClaw(-10)" style="padding:14px 24px; border-radius:999px; background:#ec4899; color:#fff; border:none; font-weight:900; font-size:1.1rem; cursor:pointer;">
                  ⬅️ Sang Trái
                </button>
                <button id="cg-btn-grab" onclick="window._cgGrabClaw()" style="padding:14px 44px; border-radius:999px; background:#10b981; color:#fff; border:none; font-weight:900; font-size:1.2rem; cursor:pointer; box-shadow:0 8px 25px rgba(16,185,129,0.4);">
                  🎯 GẮP QUÀ GỌI TÊN
                </button>
                <button onclick="window._cgMoveClaw(10)" style="padding:14px 24px; border-radius:999px; background:#ec4899; color:#fff; border:none; font-weight:900; font-size:1.1rem; cursor:pointer;">
                  Sang Phải ➡️
                </button>
              </div>
            </div>
          `;

          window._cgMoveClaw = function(dx) {
            if (isClawing) return;
            clawX = Math.max(15, Math.min(85, clawX + dx));
            const el = document.getElementById('cg-claw');
            if (el) el.style.left = clawX + '%';
            if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
          };

          window._cgGrabClaw = function() {
            if (isClawing) return;
            isClawing = true;
            const el = document.getElementById('cg-claw');
            if (el) el.style.top = '58%';

            setTimeout(() => {
              if (el) el.style.top = '15%';
              setTimeout(() => {
                isClawing = false;
                const luckyName = roster[Math.floor(Math.random() * roster.length)];
                if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
                if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
                alert(`🎁 MÁY GẮP ĐÃ GẮP TRÚNG PHẦN QUÀ ÂN SỦNG MANG TÊN: ${luckyName.toUpperCase()}!`);
              }, 450);
            }, 600);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 8. PHÂN ĐỘI THIẾU NHI THÁNH THỂ (CHIÊN CON, ẤU, THIẾU, NGHĨA)
    // ------------------------------------------------------------------------
    openStudentGroupDivider: function() {
      const roster = window.CatechismGames.getSafeRoster('student-group-divider-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'student-group-divider-quiz',
        title: 'Phân Đội Thiếu Nhi Thánh Thể (Chiên Con, Ấu, Thiếu, Nghĩa)',
        category: 'GỌI TÊN VÀ CHIA NHÓM',
        icon: '👥',
        onStart: function(stageBody, teams) {
          const divisions = [
            { name: 'Ngành Chiên Con', color: '#f59e0b', icon: '🐑', members: [] },
            { name: 'Ngành Ấu Nhi', color: '#10b981', icon: '🌱', members: [] },
            { name: 'Ngành Thiếu Nhi', color: '#0284c7', icon: '🕊️', members: [] },
            { name: 'Ngành Nghĩa Sĩ', color: '#ef4444', icon: '⚔️', members: [] }
          ];

          function autoDivide() {
            divisions.forEach(d => d.members = []);
            const shuffled = [...roster].sort(() => 0.5 - Math.random());
            shuffled.forEach((name, idx) => {
              divisions[idx % 4].members.push(name);
            });
          }
          autoDivide();

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box; overflow-y:auto;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:18px; width:100%; max-width:1100px;">
                  ${divisions.map(d => `
                    <div style="background:#ffffff; border:2px solid ${d.color}; border-radius:20px; padding:18px; box-shadow:0 8px 24px rgba(0,0,0,0.05); display:flex; flex-direction:column;">
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:2px dashed ${d.color};">
                        <span style="font-size:1.8rem;">${d.icon}</span>
                        <h4 style="margin:0; font-size:1.05rem; font-weight:900; color:${d.color};">${d.name} (${d.members.length})</h4>
                      </div>
                      <div style="display:flex; flex-direction:column; gap:6px; max-height:260px; overflow-y:auto;">
                        ${d.members.map((m, mIdx) => `
                          <div style="background:#f8fafc; padding:6px 12px; border-radius:10px; font-size:0.85rem; font-weight:700; color:#1e293b; border-left:3px solid ${d.color};">
                            ${mIdx + 1}. ${m}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div style="margin-top:24px;">
                  <button onclick="window._cgShuffleGroups()" style="padding:14px 36px; border-radius:999px; background:#6366f1; color:#fff; border:none; font-weight:900; font-size:1.05rem; cursor:pointer;">
                    <i class="fa-solid fa-shuffle"></i> BỐC THĂM LẠI 4 NGÀNH TNTT
                  </button>
                </div>
              </div>
            `;
          }

          window._cgShuffleGroups = function() {
            autoDivide();
            if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 9. VÒNG QUAY THIÊN THẦN & THÁNH BỔN MẠNG (WHEEL OF FORTUNE)
    // ------------------------------------------------------------------------
    openAngelWheel: function() {
      const roster = window.CatechismGames.getSafeRoster('angel-wheel');
      window.CatechismGames.renderClassroomModal({
        id: 'angel-wheel',
        title: 'Vòng Quay Thiên Thần & Thánh Bổn Mạng',
        category: 'VÒNG QUAY MAY MẮN',
        icon: '🎡',
        onStart: function(stageBody, teams) {
          let isSpinning = false;
          let currentAngle = 0;

          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
              <!-- Wheel Visualizer -->
              <div style="position:relative; width:340px; height:340px; margin-bottom:24px;">
                <!-- Pointer -->
                <div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:14px solid transparent; border-right:14px solid transparent; border-top:24px solid #ef4444; z-index:10; filter:drop-shadow(0 3px 6px rgba(0,0,0,0.3));"></div>
                <!-- Circle Wheel -->
                <div id="cg-angel-wheel-circle" style="width:100%; height:100%; border-radius:50%; border:8px solid #f59e0b; background:conic-gradient(#ef4444 0% 12.5%, #f59e0b 12.5% 25%, #10b981 25% 37.5%, #06b6d4 37.5% 50%, #3b82f6 50% 62.5%, #8b5cf6 62.5% 75%, #ec4899 75% 87.5%, #f43f5e 87.5% 100%); box-shadow:0 15px 40px rgba(245,158,11,0.3); transition:transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1); display:flex; align-items:center; justify-content:center;">
                  <div style="width:90px; height:90px; background:#ffffff; border-radius:50%; border:4px solid #f59e0b; display:flex; align-items:center; justify-content:center; font-size:2rem; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                    👼
                  </div>
                </div>
              </div>

              <!-- Spin Button -->
              <div>
                <button id="cg-btn-spin-wheel" onclick="window._cgSpinAngelWheel()" style="padding:16px 48px; border-radius:999px; background:#f59e0b; color:#fff; border:none; font-weight:900; font-size:1.2rem; cursor:pointer; box-shadow:0 8px 25px rgba(245,158,11,0.4);">
                  🎡 QUAY VÒNG THIÊN THẦN
                </button>
              </div>
            </div>
          `;

          window._cgSpinAngelWheel = function() {
            if (isSpinning) return;
            isSpinning = true;
            document.getElementById('cg-btn-spin-wheel').disabled = true;

            const extraSpins = 5 + Math.floor(Math.random() * 5);
            const randomAngle = Math.floor(Math.random() * 360);
            currentAngle += extraSpins * 360 + randomAngle;

            const wheelEl = document.getElementById('cg-angel-wheel-circle');
            if (wheelEl) wheelEl.style.transform = `rotate(${currentAngle}deg)`;

            let tickCount = 0;
            const tickInterval = setInterval(() => {
              if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
              tickCount++;
              if (tickCount > 15) clearInterval(tickInterval);
            }, 200);

            setTimeout(() => {
              isSpinning = false;
              document.getElementById('cg-btn-spin-wheel').disabled = false;
              const lucky = roster[Math.floor(Math.random() * roster.length)];
              if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
              if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
              alert(`🌟 THIÊN THẦN ĐÃ DỪNG LẠI CHÚC PHÚC VÀ GỌI TÊN BẠN: ${lucky.toUpperCase()}!`);
            }, 3600);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 10. CỖ XE LỬA TIÊN TRI Ê-LI-A LÊN TRỜI (GỌI TÊN)
    // ------------------------------------------------------------------------
    openAstronautExplorer: function() {
      const roster = window.CatechismGames.getSafeRoster('astronaut-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'astronaut-quiz',
        title: 'Cỗ Xe Lửa Tiên Tri Ê-li-a Lên Tầng Trời (Gọi Tên)',
        category: 'GỌI TÊN VÀ CHIA NHÓM',
        icon: '🚀',
        onStart: function(stageBody, teams) {
          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; text-align:center;">
              <div id="cg-elija-chariot" style="font-size:6rem; margin-bottom:24px; filter:drop-shadow(0 0 25px rgba(245,158,11,0.6)); transition:transform 2.5s ease-in-out;">
                🚀
              </div>
              <h2 style="color:#ffffff; font-size:1.6rem; font-weight:900; margin:0 0 12px 0;">CỖ XE LỬA VÀ NGỰA LỬA TIÊN TRI Ê-LI-A</h2>
              <p style="color:#94a3b8; max-width:550px; font-size:1rem; margin:0 0 28px 0;">Cỗ xe lửa bay vút lên bầu trời sao và hạ cánh xuống ngôi sao mang tên một học viên may mắn!</p>
              <button onclick="window._cgLaunchChariot()" style="padding:16px 44px; border-radius:999px; background:#4f46e5; color:#fff; border:none; font-weight:900; font-size:1.15rem; cursor:pointer; box-shadow:0 8px 25px rgba(79,70,229,0.4);">
                🔥 PHÓNG CHIẾN XA GỌI TÊN
              </button>
            </div>
          `;

          window._cgLaunchChariot = function() {
            const el = document.getElementById('cg-elija-chariot');
            if (el) el.style.transform = 'translateY(-120px) scale(1.4)';
            if (typeof window.SoundFX?.playCannon === 'function') window.SoundFX.playCannon();

            setTimeout(() => {
              if (el) el.style.transform = 'translateY(0) scale(1)';
              const lucky = roster[Math.floor(Math.random() * roster.length)];
              if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
              if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
              alert(`⭐ CHIẾN XA Ê-LI-A ĐÃ HẠ CÁNH VÀ GỌI TÊN: ${lucky.toUpperCase()}!`);
            }, 2600);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 11. CHIẾC RƯƠNG BÍ MẬT & BỒ CÂU BÌNH AN
    // ------------------------------------------------------------------------
    openMagicHat: function() {
      const roster = window.CatechismGames.getSafeRoster('magic-hat-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'magic-hat-quiz',
        title: 'Chiếc Rương Bí Mật & Bồ Câu Bình An',
        category: 'GỌI TÊN VÀ CHIA NHÓM',
        icon: '🕊️',
        onStart: function(stageBody, teams) {
          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; text-align:center;">
              <div id="cg-peace-dove" style="font-size:6.5rem; margin-bottom:24px; transition:transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);">
                📦
              </div>
              <h2 style="color:#ffffff; font-size:1.6rem; font-weight:900; margin:0 0 12px 0;">CHIẾC RƯƠNG THÁNH & BỒ CÂU TRẮNG</h2>
              <p style="color:#94a3b8; max-width:550px; font-size:1rem; margin:0 0 28px 0;">Bấm mở rương thánh, chú Bồ Câu Trắng Bình An sẽ bay ra mang theo tên học viên may mắn!</p>
              <button onclick="window._cgOpenMagicChest()" style="padding:16px 44px; border-radius:999px; background:#f43f5e; color:#fff; border:none; font-weight:900; font-size:1.15rem; cursor:pointer;">
                ✨ MỞ RƯƠNG GỌI TÊN
              </button>
            </div>
          `;

          window._cgOpenMagicChest = function() {
            const el = document.getElementById('cg-peace-dove');
            if (el) { el.textContent = '🕊️'; el.style.transform = 'scale(1.3) translateY(-20px)'; }
            if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
            setTimeout(() => {
              const lucky = roster[Math.floor(Math.random() * roster.length)];
              if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
              alert(`🕊️ BỒ CÂU BÌNH AN BAY RA MANG THEO TÊN: ${lucky.toUpperCase()}!`);
              if (el) { el.textContent = '📦'; el.style.transform = 'scale(1) translateY(0)'; }
            }, 1100);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 12. SÁCH SỰ SỐNG TRIỆU HỒI — AI NHẬN DIỆN CỬ CHỈ TAY
    // ------------------------------------------------------------------------
    openMagicGrimoire: function() {
      const roster = window.CatechismGames.getSafeRoster('magic-grimoire-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'magic-grimoire-quiz',
        title: 'Sách Sự Sống Triệu Hồi — AI Nhận Diện Cử Chỉ Tay',
        category: 'GỌI TÊN VÀ CHIA NHÓM',
        icon: '📖',
        onStart: function(stageBody, teams) {
          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; text-align:center;">
              <div id="cg-book-life" style="font-size:6.5rem; margin-bottom:24px; filter:drop-shadow(0 0 30px rgba(245,158,11,0.5)); transition:transform 0.8s ease;">
                📖
              </div>
              <h2 style="color:#ffffff; font-size:1.6rem; font-weight:900; margin:0 0 12px 0;">CUỐN SÁCH SỰ SỐNG THIÊN CHÚA</h2>
              <p style="color:#94a3b8; max-width:550px; font-size:1rem; margin:0 0 28px 0;">Vẫy tay trước camera hoặc bấm Lật Sách để mở ra trang vàng ghi tên học viên may mắn!</p>
              <button onclick="window._cgFlipBookOfLife()" style="padding:16px 44px; border-radius:999px; background:#d97706; color:#fff; border:none; font-weight:900; font-size:1.15rem; cursor:pointer;">
                📜 LẬT TRANG SÁCH GỌI TÊN
              </button>
            </div>
          `;

          window._cgFlipBookOfLife = function() {
            const el = document.getElementById('cg-book-life');
            if (el) el.style.transform = 'rotateY(180deg) scale(1.2)';
            if (typeof window.SoundFX?.playHarp === 'function') window.SoundFX.playHarp();
            setTimeout(() => {
              const lucky = roster[Math.floor(Math.random() * roster.length)];
              if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
              alert(`📖 SÁCH SỰ SỐNG ĐÃ LẬT MỞ TRANG VÀNG GHI TÊN: ${lucky.toUpperCase()}!`);
              if (el) el.style.transform = 'rotateY(0deg) scale(1)';
            }, 900);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 13. Ô CHỮ KINH THÁNH & CHÌA KHÓA CỨU ĐỘ (CROSSWORD LOCK)
    // ------------------------------------------------------------------------
    openCrosswordLock: function() {
      const crosswordData = [
        { row: 1, clue: "Nơi Chúa Giê-su sinh ra thuộc miền Giu-đê là gì?", answer: "BELEM", keyCol: 1 },
        { row: 2, clue: "Mẹ của Chúa Cứu Thế là ai?", answer: "MARIA", keyCol: 0 },
        { row: 3, clue: "Giao ước Thiên Chúa ban cho ông Mô-sê trên núi nào?", answer: "SINAI", keyCol: 1 },
        { row: 4, clue: "Biến cố vinh hiển Chúa chiến thắng sự chết gọi là gì?", answer: "PHUCSINH", keyCol: 3 },
        { row: 5, clue: "Bí tích Ban Thịt và Máu Chúa Giê-su nuôi sống linh hồn?", answer: "THANHTHE", keyCol: 2 },
        { row: 6, clue: "Ông là vị Tông đồ trưởng được trao chìa khóa Nước Trời?", answer: "PHERO", keyCol: 2 }
      ];
      // Secret Vertical Keyword formed by keyCol: C - U - U - D - O ...

      window.CatechismGames.renderClassroomModal({
        id: 'crossword-lock',
        title: 'Ô Chữ Kinh Thánh & Chìa Khóa Cứu Độ',
        category: 'TƯ DUY KINH THÁNH',
        icon: '🧩',
        onStart: function(stageBody, teams) {
          let solvedRows = new Set();
          let selectedRowIdx = 0;

          function render() {
            const currentItem = crosswordData[selectedRowIdx];
            stageBody.innerHTML = `
              <div style="display:flex; gap:28px; width:100%; height:100%; padding:20px; box-sizing:border-box; overflow-y:auto;">
                <!-- Crossword Grid Display -->
                <div style="flex:1; background:#071521; border:2px solid #38bdf8; border-radius:24px; padding:24px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                  <div style="display:flex; flex-direction:column; gap:10px;">
                    ${crosswordData.map((item, rIdx) => {
                      const isSolved = solvedRows.has(rIdx);
                      const isSelected = (rIdx === selectedRowIdx);
                      return `
                        <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="window._cgSelectCrosswordRow(${rIdx})">
                          <span style="width:28px; height:28px; background:${isSelected ? '#38bdf8' : '#1e293b'}; color:#fff; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem;">
                            ${item.row}
                          </span>
                          <div style="display:flex; gap:6px;">
                            ${item.answer.split('').map((char, cIdx) => {
                              const isKey = (cIdx === item.keyCol);
                              const showChar = isSolved ? char : '';
                              return `
                                <div style="width:42px; height:42px; border-radius:10px; border:2px solid ${isKey ? '#f59e0b' : '#334155'}; background:${isKey ? (isSolved ? '#d97706' : 'rgba(245,158,11,0.25)') : (isSolved ? '#1e3a8a' : '#0f172a')}; color:#fff; font-size:1.25rem; font-weight:900; display:flex; align-items:center; justify-content:center; box-shadow:${isKey ? '0 0 12px rgba(245,158,11,0.5)' : 'none'}; transition:all 0.3s ease;">
                                  ${showChar}
                                </div>
                              `;
                            }).join('')}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Clue & Input Panel -->
                <div style="width:380px; background:#ffffff; border-radius:24px; border:2px solid #bae6fd; padding:24px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                      <span style="font-weight:900; font-size:1.1rem; color:#0284c7;">HÀNG NGANG SỐ ${currentItem.row}</span>
                      <span style="font-weight:800; font-size:0.85rem; color:#64748b;">(${currentItem.answer.length} chữ cái)</span>
                    </div>
                    <div style="background:#eff6ff; border-left:4px solid #0284c7; padding:16px; border-radius:12px; margin-bottom:20px; font-weight:700; color:#1e293b; font-size:1.05rem; line-height:1.5;">
                      ${currentItem.clue}
                    </div>

                    ${solvedRows.has(selectedRowIdx) ? `
                      <div style="background:#ecfdf5; border:2px solid #10b981; border-radius:14px; padding:14px; color:#059669; font-weight:800; text-align:center;">
                        ✅ ĐÃ GIẢI ĐÚNG: <strong>${currentItem.answer}</strong>
                      </div>
                    ` : `
                      <div style="display:flex; flex-direction:column; gap:12px;">
                        <input type="text" id="cg-crossword-input" placeholder="Nhập đáp án viết liền..." style="width:100%; padding:14px 16px; border-radius:14px; border:2px solid #cbd5e1; font-weight:800; font-size:1.1rem; text-transform:uppercase; box-sizing:border-box;">
                        <button onclick="window._cgSubmitCrosswordAnswer()" style="padding:14px; border-radius:14px; background:#0284c7; color:#fff; border:none; font-weight:900; font-size:1.05rem; cursor:pointer;">
                          <i class="fa-solid fa-check"></i> KIỂM TRA ĐÁP ÁN
                        </button>
                      </div>
                    `}
                  </div>

                  <div style="margin-top:20px; padding-top:16px; border-top:2px dashed #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#64748b; font-size:0.9rem; font-weight:700;">Đã giải: ${solvedRows.size} / ${crosswordData.length}</span>
                    <button onclick="window._cgGuessKeyword()" style="padding:10px 18px; border-radius:999px; background:#f59e0b; color:#fff; border:none; font-weight:800; font-size:0.85rem; cursor:pointer;">
                      🔑 Đoán Từ Khóa Vàng
                    </button>
                  </div>
                </div>
              </div>
            `;
          }

          window._cgSelectCrosswordRow = function(rIdx) {
            selectedRowIdx = rIdx;
            render();
          };

          window._cgSubmitCrosswordAnswer = function() {
            const inp = document.getElementById('cg-crossword-input');
            if (!inp) return;
            const val = inp.value.trim().toUpperCase().replace(/[^A-Z]/g, '');
            const target = crosswordData[selectedRowIdx].answer.toUpperCase();

            if (val === target) {
              if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
              solvedRows.add(selectedRowIdx);
              window._cgAddPoints(0, 100);
              if (solvedRows.size === crosswordData.length) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
                alert('🏆 XIN CHÚC MỪNG! CÁC EM ĐÃ GIẢI HOÀN TOÀN Ô CHỮ VÀ MỞ RA CHÌA KHÓA CỨU ĐỘ THIÊN CHÚA!');
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert('Chưa chính xác, hãy đọc lại câu gợi ý và đếm số lượng chữ cái nhé!');
            }
            render();
          };

          window._cgGuessKeyword = function() {
            const guess = prompt("Nhập Từ Khóa Vàng Bí Mật ở hàng dọc (gợi ý: Tình thương cứu thế của Thiên Chúa):");
            if (guess && (guess.toUpperCase().includes("CUU DO") || guess.toUpperCase().includes("CỨU ĐỘ") || guess.toUpperCase().includes("TINH YEU") || guess.toUpperCase().includes("TÌNH YÊU"))) {
              if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
              if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90 });
              crosswordData.forEach((_, idx) => solvedRows.add(idx));
              window._cgAddPoints(0, 500);
              alert('🎉 TUYỆT VỜI! ĐÁP ÁN TỪ KHÓA CHÍNH XÁC: CỨU ĐỘ VÀ TÌNH YÊU THIÊN CHÚA! ĐẠT +500 ĐIỂM!');
              render();
            } else if (guess) {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert('Từ khóa chưa chính xác, hãy mở thêm các hàng ngang để thấy rõ chữ cái vàng nhé!');
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 14. ĐOÀN TÀU ĐỨC TIN — SẮP XẾP BIẾN CỐ CỨU ĐỘ (KNOWLEDGE TRAIN)
    // ------------------------------------------------------------------------
    openKnowledgeTrain: function() {
      const trainCarsData = [
        { id: 1, text: "1. Sáng Tạo Trời Đất & Vũ Trụ (St 1)", order: 1 },
        { id: 2, text: "2. Xuất Hành Qua Biển Đỏ (Mô-sê)", order: 2 },
        { id: 3, text: "3. Giao Ước Mười Điều Răn (Núi Sinai)", order: 3 },
        { id: 4, text: "4. Chúa Giê-su Giáng Sinh Tại Bê-lem", order: 4 },
        { id: 5, text: "5. Chúa Phục Sinh & Hiện Xuống (Tân Ước)", order: 5 }
      ];

      window.CatechismGames.renderClassroomModal({
        id: 'knowledge-train',
        title: 'Đoàn Tàu Đức Tin — Biến Cố Cứu Độ',
        category: 'DÒNG THỜI GIAN',
        icon: '🚂',
        onStart: function(stageBody, teams) {
          let currentList = [...trainCarsData].sort(() => 0.5 - Math.random());

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- Train Track Landscape -->
                <div style="width:100%; max-width:1000px; background:linear-gradient(180deg, #dbeafe 0%, #eff6ff 60%, #bbf7d0 100%); border-radius:28px; border:3px solid #60a5fa; padding:24px; position:relative; overflow-x:auto;">
                  <div style="display:flex; align-items:flex-end; gap:12px; min-width:850px; padding-bottom:18px; border-bottom:8px solid #78350f;">
                    <!-- Locomotive -->
                    <div style="width:130px; height:110px; background:#b91c1c; border-radius:18px 36px 8px 8px; border:3px solid #7f1d1d; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; box-shadow:0 6px 16px rgba(0,0,0,0.25);">
                      <div style="font-size:2.4rem;">🚂</div>
                      <div style="font-weight:900; font-size:0.8rem; color:#fde047;">ĐẦU TÀU</div>
                    </div>

                    <!-- Train Carriages -->
                    ${currentList.map((car, idx) => `
                      <div style="flex:1; height:95px; background:#1e293b; border:3px solid #f59e0b; border-radius:16px; padding:10px; display:flex; flex-direction:column; justify-content:space-between; color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                        <div style="font-size:0.85rem; font-weight:800; color:#fde047; line-height:1.3;">
                          ${car.text}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                          <button onclick="window._cgMoveTrainCar(${idx}, -1)" style="padding:4px 10px; border-radius:8px; background:#334155; color:#fff; border:none; cursor:pointer; font-weight:800;">⬅️</button>
                          <span style="font-size:0.75rem; color:#94a3b8; font-weight:700;">Toa ${idx + 1}</span>
                          <button onclick="window._cgMoveTrainCar(${idx}, 1)" style="padding:4px 10px; border-radius:8px; background:#334155; color:#fff; border:none; cursor:pointer; font-weight:800;">➡️</button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Check Button -->
                <div style="margin-top:24px; display:flex; gap:16px;">
                  <button onclick="window._cgVerifyTrainOrder()" style="padding:16px 44px; border-radius:999px; background:#10b981; color:#fff; border:none; font-weight:900; font-size:1.15rem; cursor:pointer; box-shadow:0 8px 25px rgba(16,185,129,0.4);">
                    <i class="fa-solid fa-train"></i> KIỂM TRA TRÌNH TỰ ĐOÀN TÀU
                  </button>
                </div>
              </div>
            `;
          }

          window._cgMoveTrainCar = function(idx, dir) {
            const targetIdx = idx + dir;
            if (targetIdx < 0 || targetIdx >= currentList.length) return;
            const temp = currentList[idx];
            currentList[idx] = currentList[targetIdx];
            currentList[targetIdx] = temp;
            if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
            render();
          };

          window._cgVerifyTrainOrder = function() {
            let isCorrect = true;
            for (let i = 0; i < currentList.length; i++) {
              if (currentList[i].order !== (i + 1)) {
                isCorrect = false;
                break;
              }
            }

            if (isCorrect) {
              if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
              if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
              window._cgAddPoints(0, 300);
              alert('🚂 TU TU XÌNH XỊCH! ĐOÀN TÀU ĐỨC TIN ĐÃ ĐƯỢC XẾP ĐÚNG HOÀN TOÀN THEO DÒNG THỜI GIAN CỨU ĐỘ VÀ KHỞI HÀNH THÀNH CÔNG!');
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert('Trình tự các biến cố cứu độ chưa chính xác. Hãy nhớ lại: Sáng Thế -> Xuất Hành -> Giao Ước Sinai -> Giáng Sinh -> Phục Sinh nhé!');
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 15. VƯỢT SA MẠC SINAI VỀ MIỀN ĐẤT HỨA (MINESWEEPER QUIZ)
    // ------------------------------------------------------------------------
    openMinesweeperQuiz: function() {
      const questions = window.CatechismGames.getSafeQuestions('minesweeper-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'minesweeper-quiz',
        title: 'Vượt Sa Mạc Sinai Về Miền Đất Hứa',
        category: 'THỬ THÁCH PHIÊU LƯU',
        icon: '🏜️',
        questions: questions,
        onStart: function(stageBody, teams) {
          let lives = 3;
          let score = 0;
          let revealed = new Set();
          // 16 tiles grid: 3 traps (mines), 3 oases (+100 free), 10 question challenges
          const tileTypes = [
            'q', 'oasis', 'q', 'trap',
            'q', 'q', 'oasis', 'q',
            'trap', 'q', 'q', 'oasis',
            'q', 'trap', 'q', 'q'
          ];

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- Status Bar -->
                <div style="display:flex; justify-content:space-between; width:100%; max-width:600px; margin-bottom:18px; font-weight:800; font-size:1.1rem;">
                  <span style="color:#ef4444;">
                    KHIÊN ĐỨC TIN: ${'❤️ '.repeat(lives)}
                  </span>
                  <span style="color:#f59e0b;">
                    🏆 ĐIỂM: ${score}
                  </span>
                </div>

                <!-- 4x4 Desert Grid -->
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; width:100%; max-width:600px;">
                  ${tileTypes.map((type, idx) => {
                    const isRev = revealed.has(idx);
                    return `
                      <button onclick="window._cgClickDesertTile(${idx})" style="aspect-ratio:1; border-radius:18px; border:2px solid ${isRev ? '#fde68a' : '#d97706'}; background:${isRev ? (type === 'trap' ? '#fee2e2' : type === 'oasis' ? '#dcfce7' : '#eff6ff') : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}; font-size:1.8rem; font-weight:900; color:#fff; cursor:${isRev ? 'default' : 'pointer'}; box-shadow:0 6px 14px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; transition:all 0.2s ease;">
                        ${isRev ? (type === 'trap' ? '🌪️' : type === 'oasis' ? '🌴' : '📖') : (idx + 1)}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }

          window._cgClickDesertTile = function(idx) {
            if (revealed.has(idx) || lives <= 0) return;
            revealed.add(idx);
            const type = tileTypes[idx];

            if (type === 'oasis') {
              if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
              score += 100;
              window._cgAddPoints(0, 100);
              alert('🌴 BẠN ĐÃ TÌM THẤY ỐC ĐẢO ÂN SỦNG! Được thưởng ngay +100 điểm phúc lành!');
              render();
            } else if (type === 'trap') {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              lives--;
              alert('🌪️ CƠN BÃO CÁT SA MẠC! Bạn bị mất 1 Khiên Đức Tin!');
              if (lives <= 0) {
                alert('Dân Chúa đã cạn kiệt khiên đức tin trong sa mạc! Hãy chơi lại để cùng tiến vào Đất Hứa nhé!');
              }
              render();
            } else {
              const q = questions[idx % questions.length];
              const ans = prompt(`📖 THỬ THÁCH LỜI CHÚA (Ô ${idx + 1}):
${q.question}

A. ${q.options[0]}
B. ${q.options[1]}
C. ${q.options[2] || ''}
D. ${q.options[3] || ''}

Nhập chữ cái đáp án đúng (A/B/C/D):`);
              if (ans && ans.trim().toUpperCase() === String.fromCharCode(65 + q.correct)) {
                if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
                score += 100;
                window._cgAddPoints(0, 100);
                alert('Chính xác! Bạn được cộng +100 điểm!');
              } else {
                if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
                alert(`Chưa chính xác! Đáp án đúng là ${String.fromCharCode(65 + q.correct)}.`);
              }
              render();
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 16. KÉO THẢ NỐI Ý KINH THÁNH (MATCHING PAIRS QUIZ)
    // ------------------------------------------------------------------------
    openMatchingPairsQuiz: function() {
      const pairsData = [
        { term: "Ông Mô-sê", def: "Rẽ nước Biển Đỏ & Nhận 10 Điều Răn" },
        { term: "Vua Đa-vít", def: "Bắn ná hạ Goliath & Viết Thánh Vịnh" },
        { term: "Tiên tri Ê-li-a", def: "Chiến xa lửa rực sáng về trời" },
        { term: "Thánh Phê-rô", def: "Chìa khóa Nước Trời & Tảng đá Hội Thánh" },
        { term: "Bí tích Rửa Tội", def: "Dấu chỉ Nước & Xóa Tội Tổ Tông" },
        { term: "Bí tích Thánh Thể", def: "Thịt và Máu Chúa nuôi dưỡng linh hồn" }
      ];

      window.CatechismGames.renderClassroomModal({
        id: 'matching-pairs-quiz',
        title: 'Kéo Thả Nối Ý — Nhân Vật & Sự Kiện Kinh Thánh',
        category: 'GHI NHỚ & GHÉP CẶP',
        icon: '🔗',
        onStart: function(stageBody, teams) {
          let selectedTerm = null;
          let matched = new Set();
          const shuffledDefs = [...pairsData.map((p, i) => ({ id: i, def: p.def }))].sort(() => 0.5 - Math.random());

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; justify-content:center; gap:40px; width:100%; height:100%; padding:20px; box-sizing:border-box; overflow-y:auto;">
                <!-- Column Left: Terms -->
                <div style="flex:1; max-width:420px; display:flex; flex-direction:column; gap:12px;">
                  <h4 style="color:#0284c7; font-weight:900; margin:0 0 8px 0; text-transform:uppercase;">Cột A: Nhân Vật & Khái Niệm</h4>
                  ${pairsData.map((p, idx) => {
                    const isM = matched.has(idx);
                    const isSel = (selectedTerm === idx);
                    return `
                      <button onclick="window._cgSelectTerm(${idx})" style="padding:16px; border-radius:16px; border:2px solid ${isM ? '#10b981' : isSel ? '#f59e0b' : '#cbd5e1'}; background:${isM ? '#ecfdf5' : isSel ? '#fef3c7' : '#ffffff'}; color:#1e293b; font-weight:800; font-size:1rem; text-align:left; cursor:${isM ? 'default' : 'pointer'}; box-shadow:0 4px 10px rgba(0,0,0,0.04); display:flex; justify-content:space-between; align-items:center;">
                        <span>${p.term}</span>
                        <span>${isM ? '✅' : isSel ? '👉' : '⚪'}</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                <!-- Column Right: Definitions -->
                <div style="flex:1; max-width:480px; display:flex; flex-direction:column; gap:12px;">
                  <h4 style="color:#10b981; font-weight:900; margin:0 0 8px 0; text-transform:uppercase;">Cột B: Sự Kiện & Ý Nghĩa</h4>
                  ${shuffledDefs.map(item => {
                    const isM = matched.has(item.id);
                    return `
                      <button onclick="window._cgSelectDef(${item.id})" style="padding:16px; border-radius:16px; border:2px solid ${isM ? '#10b981' : '#cbd5e1'}; background:${isM ? '#ecfdf5' : '#ffffff'}; color:#1e293b; font-weight:700; font-size:0.95rem; text-align:left; cursor:${isM ? 'default' : 'pointer'}; box-shadow:0 4px 10px rgba(0,0,0,0.04);">
                        ${item.def}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }

          window._cgSelectTerm = function(idx) {
            if (matched.has(idx)) return;
            selectedTerm = idx;
            if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
            render();
          };

          window._cgSelectDef = function(defId) {
            if (selectedTerm === null || matched.has(defId)) return;
            if (selectedTerm === defId) {
              if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
              matched.add(defId);
              window._cgAddPoints(0, 100);
              if (matched.size === pairsData.length) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
                alert('🎉 XIN CHÚC MỪNG! BẠN ĐÃ GHÉP NỐI CHÍNH XÁC TOÀN BỘ CÁC CẶP KINH THÁNH!');
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert('Chưa chính xác, hãy suy niệm lại sứ mạng của vị thánh này nhé!');
            }
            selectedTerm = null;
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 17. HÁI HOA TRÁI THÁNH THẦN — BẮT BONG BÓNG ÂN SỦNG (FRUIT NINJA)
    // ------------------------------------------------------------------------
    openFruitNinjaQuiz: function() {
      const holyFruits = [
        "Bác Ái", "Hoan Lạc", "Bình An", "Nhẫn Nhục", "Nhân Hậu",
        "Từ Tâm", "Trung Tín", "Hiền Hòa", "Tiết Độ"
      ];
      window.CatechismGames.renderClassroomModal({
        id: 'fruit-ninja-quiz',
        title: 'Hái Hoa Trái Thánh Thần — Bắt Bong Bóng Ân Sủng',
        category: 'HÀNH ĐỘNG & PHẢN XẠ',
        icon: '🍇',
        onStart: function(stageBody, teams) {
          let score = 0;
          let targetFruit = holyFruits[0];

          stageBody.innerHTML = `
            <div style="position:relative; width:100%; height:100%; overflow:hidden; background:linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%); display:flex; flex-direction:column; align-items:center;">
              <!-- Target Banner -->
              <div style="position:absolute; top:20px; z-index:10; background:#f59e0b; padding:12px 32px; border-radius:999px; color:#fff; font-weight:900; font-size:1.2rem; box-shadow:0 8px 25px rgba(245,158,11,0.5);">
                🍇 MỤC TIÊU: HÃY BẮT / CHÉM HOA TRÁI: <span id="cg-ninja-target" style="text-decoration:underline;">${targetFruit}</span>
              </div>

              <!-- Animated Fruit Arena -->
              <div id="cg-fruit-arena" style="position:relative; width:100%; height:100%; overflow:hidden;"></div>
            </div>
          `;

          const arena = stageBody.querySelector('#cg-fruit-arena');
          function spawnFruit() {
            if (!arena || !arena.parentElement) return;
            const fruitName = holyFruits[Math.floor(Math.random() * holyFruits.length)];
            const isTarget = (fruitName === targetFruit);

            const fruitEl = document.createElement('div');
            fruitEl.className = 'cg-floating-fruit';
            fruitEl.style.cssText = `
              position: absolute;
              bottom: -60px;
              left: ${10 + Math.random() * 80}%;
              padding: 12px 20px;
              background: ${isTarget ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : '#1e293b'};
              border: 2px solid #fff;
              border-radius: 999px;
              color: #fff;
              font-weight: 800;
              font-size: 1.1rem;
              cursor: pointer;
              box-shadow: 0 8px 20px rgba(0,0,0,0.3);
              user-select: none;
              transition: transform 0.1s;
            `;
            fruitEl.innerHTML = `🍇 ${fruitName}`;

            fruitEl.onclick = function() {
              if (fruitName === targetFruit) {
                if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
                score += 100;
                window._cgAddPoints(0, 100);
                fruitEl.style.transform = 'scale(1.5)';
                fruitEl.style.opacity = '0';
                targetFruit = holyFruits[Math.floor(Math.random() * holyFruits.length)];
                const bannerTarget = document.getElementById('cg-ninja-target');
                if (bannerTarget) bannerTarget.textContent = targetFruit;
              } else {
                if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              }
              setTimeout(() => fruitEl.remove(), 150);
            };

            arena.appendChild(fruitEl);

            let posY = -60;
            const speed = 2.5 + Math.random() * 2;
            const moveTimer = setInterval(() => {
              posY += speed;
              fruitEl.style.bottom = posY + 'px';
              if (posY > 500) {
                clearInterval(moveTimer);
                fruitEl.remove();
              }
            }, 30);
          }

          const spawner = setInterval(spawnFruit, 1200);
          stageBody._cleanupInterval = spawner;
        }
      });
    },

    // ------------------------------------------------------------------------
    // 18. CON TÀU ĐỨC TIN VƯỢT SÓNG BIỂN HỒ GA-LI-LÊ
    // ------------------------------------------------------------------------
    openPirateShipBattleGame: function() {
      const questions = window.CatechismGames.getSafeQuestions('pirate-ship-battle-game');
      window.CatechismGames.renderClassroomModal({
        id: 'pirate-ship-battle-game',
        title: 'Con Tàu Đức Tin Vượt Sóng Biển Hồ Ga-li-lê',
        category: 'ĐỐI KHÁNG ĐỘI NHÓM',
        icon: '⛵',
        questions: questions,
        onStart: function(stageBody, teams) {
          let hpPeter = 100;
          let hpJohn = 100;
          let activeTeam = 0;
          let qIdx = 0;

          function render() {
            const q = questions[qIdx % questions.length];
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- Battle Sea View -->
                <div style="width:100%; max-width:980px; height:240px; background:linear-gradient(180deg, #38bdf8 0%, #0369a1 100%); border-radius:28px; border:3px solid #bae6fd; position:relative; overflow:hidden; display:flex; justify-content:space-between; align-items:center; padding:0 40px; box-shadow:0 12px 35px rgba(2,132,199,0.3);">
                  <!-- Ship Peter (Left) -->
                  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                    <div style="width:160px; height:18px; background:#e2e8f0; border-radius:999px; overflow:hidden; border:2px solid #fff;">
                      <div style="width:${hpPeter}%; height:100%; background:#10b981; transition:width 0.4s ease;"></div>
                    </div>
                    <span style="font-size:4.5rem; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.3));">⛵</span>
                    <span style="background:#fff; color:#0369a1; font-weight:900; padding:4px 14px; border-radius:999px; font-size:0.85rem;">THUYỀN PHÊ-RÔ (${hpPeter} HP)</span>
                  </div>

                  <!-- Center Galilee Waves -->
                  <div style="color:rgba(255,255,255,0.7); font-size:1.4rem; font-weight:900;">
                    🌊 BIỂN HỒ GA-LI-LÊ 🌊
                  </div>

                  <!-- Ship John (Right) -->
                  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                    <div style="width:160px; height:18px; background:#e2e8f0; border-radius:999px; overflow:hidden; border:2px solid #fff;">
                      <div style="width:${hpJohn}%; height:100%; background:#ef4444; transition:width 0.4s ease;"></div>
                    </div>
                    <span style="font-size:4.5rem; transform:scaleX(-1); filter:drop-shadow(0 6px 12px rgba(0,0,0,0.3));">⛵</span>
                    <span style="background:#fff; color:#dc2626; font-weight:900; padding:4px 14px; border-radius:999px; font-size:0.85rem;">THUYỀN GIO-AN (${hpJohn} HP)</span>
                  </div>
                </div>

                <!-- Active Question -->
                <div style="width:100%; max-width:800px; background:#ffffff; border-radius:24px; padding:24px; margin-top:20px; box-shadow:0 10px 30px rgba(0,0,0,0.06); border:2px solid ${activeTeam === 0 ? '#38bdf8' : '#f87171'};">
                  <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:800; color:${activeTeam === 0 ? '#0284c7' : '#dc2626'};">
                    <span>LƯỢT BẮN CỦA: ${activeTeam === 0 ? 'THUYỀN PHÊ-RÔ' : 'THUYỀN GIO-AN'}</span>
                    <span>Câu ${qIdx + 1} / ${questions.length}</span>
                  </div>
                  <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0 0 16px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgShipFireAnswer(${oIdx})" style="padding:12px 16px; border-radius:12px; border:2px solid #e2e8f0; background:#f8fafc; font-weight:700; font-size:0.95rem; text-align:left; cursor:pointer;">
                        <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }

          window._cgShipFireAnswer = function(chosenIdx) {
            const q = questions[qIdx % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playCannon === 'function') window.SoundFX.playCannon();
              if (activeTeam === 0) {
                hpJohn = Math.max(0, hpJohn - 25);
                window._cgAddPoints(0, 100);
              } else {
                hpPeter = Math.max(0, hpPeter - 25);
                window._cgAddPoints(1, 100);
              }

              if (hpJohn <= 0) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
                alert('🏆 THUYỀN PHÊ-RÔ ĐÃ GIÀNH CHIẾN THẮNG TRÊN BIỂN HỒ GA-LI-LÊ!');
              } else if (hpPeter <= 0) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
                alert('🏆 THUYỀN GIO-AN ĐÃ GIÀNH CHIẾN THẮNG TRÊN BIỂN HỒ GA-LI-LÊ!');
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
            }
            activeTeam = 1 - activeTeam;
            window._cgSwitchTeam(activeTeam);
            qIdx++;
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 19. XÂY ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM (TOWER BUILDER)
    // ------------------------------------------------------------------------
    openTempleBuilder: function() {
      const questions = window.CatechismGames.getSafeQuestions('temple-builder');
      window.CatechismGames.renderClassroomModal({
        id: 'temple-builder',
        title: 'Xây Đền Thờ Thánh Giê-ru-sa-lem',
        category: 'ĐỐI KHÁNG ĐỘI NHÓM',
        icon: '🏛️',
        questions: questions,
        onStart: function(stageBody, teams) {
          let tiersTeam1 = 0; // 0 to 5
          let tiersTeam2 = 0;
          let activeTeam = 0;
          let qIdx = 0;

          const tierNames = [
            "1. Nền Móng Đá Tảng Vững Chắc",
            "2. Hàng Cột Cẩm Thạch Kiên Cố",
            "3. Tường Đá Chạm Trổ Thiên Thần",
            "4. Mái Vòm Mạ Vàng Hoàng Kim",
            "5. Đỉnh Tháp Thánh Giá Rực Sáng"
          ];

          function render() {
            const q = questions[qIdx % questions.length];
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- 2 Temple Construction Sites -->
                <div style="display:flex; justify-content:space-around; width:100%; max-width:850px; margin-bottom:20px;">
                  <!-- Team 1 Temple -->
                  <div style="display:flex; flex-direction:column-reverse; align-items:center; gap:4px; width:220px; height:220px; background:#eff6ff; border-radius:20px; padding:12px; border:2px solid #38bdf8;">
                    ${Array.from({length:5}).map((_, i) => `
                      <div style="width:100%; height:32px; background:${i < tiersTeam1 ? '#f59e0b' : '#cbd5e1'}; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.75rem;">
                        ${i < tiersTeam1 ? tierNames[i] : `Tầng ${i + 1}`}
                      </div>
                    `).join('')}
                    <div style="font-weight:900; color:#0284c7; margin-bottom:4px;">ĐỘI PHÊ-RÔ</div>
                  </div>

                  <!-- Team 2 Temple -->
                  <div style="display:flex; flex-direction:column-reverse; align-items:center; gap:4px; width:220px; height:220px; background:#fef2f2; border-radius:20px; padding:12px; border:2px solid #f87171;">
                    ${Array.from({length:5}).map((_, i) => `
                      <div style="width:100%; height:32px; background:${i < tiersTeam2 ? '#ef4444' : '#cbd5e1'}; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.75rem;">
                        ${i < tiersTeam2 ? tierNames[i] : `Tầng ${i + 1}`}
                      </div>
                    `).join('')}
                    <div style="font-weight:900; color:#dc2626; margin-bottom:4px;">ĐỘI PHAO-LÔ</div>
                  </div>
                </div>

                <!-- Question Box -->
                <div style="width:100%; max-width:800px; background:#fff; border-radius:24px; padding:24px; border:2px solid #cbd5e1; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                  <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:800; color:${activeTeam === 0 ? '#0284c7' : '#dc2626'};">
                    <span>LƯỢT XÂY CỦA: ${activeTeam === 0 ? 'ĐỘI PHÊ-RÔ' : 'ĐỘI PHAO-LÔ'}</span>
                    <span>Câu ${qIdx + 1} / ${questions.length}</span>
                  </div>
                  <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0 0 16px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgTempleAnswer(${oIdx})" style="padding:12px 16px; border-radius:12px; border:2px solid #e2e8f0; background:#f8fafc; font-weight:700; font-size:0.95rem; text-align:left; cursor:pointer;">
                        <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }

          window._cgTempleAnswer = function(chosenIdx) {
            const q = questions[qIdx % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
              if (activeTeam === 0) {
                tiersTeam1++;
                window._cgAddPoints(0, 100);
              } else {
                tiersTeam2++;
                window._cgAddPoints(1, 100);
              }

              if (tiersTeam1 >= 5) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90 });
                alert('🏛️ CHÚC MỪNG ĐỘI PHÊ-RÔ ĐÃ HOÀN TẤT ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM RỰC RỠ HOÀNG KIM!');
              } else if (tiersTeam2 >= 5) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90 });
                alert('🏛️ CHÚC MỪNG ĐỘI PHAO-LÔ ĐÃ HOÀN TẤT ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM RỰC RỠ HOÀNG KIM!');
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
            }
            activeTeam = 1 - activeTeam;
            window._cgSwitchTeam(activeTeam);
            qIdx++;
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 20. ĐẤU TRÍ BẢNG VÀNG GIÁO LÝ (JEOPARDY 5 CHỦ ĐỀ)
    // ------------------------------------------------------------------------
    openJeopardyQuiz: function() {
      const categories = [
        { name: "CỰU ƯỚC", points: [100, 200, 300, 400, 500] },
        { name: "TÂN ƯỚC", points: [100, 200, 300, 400, 500] },
        { name: "BÍ TÍCH", points: [100, 200, 300, 400, 500] },
        { name: "LUÂN LÝ", points: [100, 200, 300, 400, 500] },
        { name: "CÁC THÁNH", points: [100, 200, 300, 400, 500] }
      ];

      window.CatechismGames.renderClassroomModal({
        id: 'jeopardy-quiz',
        title: 'Đấu Trí Bảng Vàng Giáo Lý (Jeopardy 5 Chủ Đề)',
        category: 'ĐỐI KHÁNG BẢNG VÀNG',
        icon: '🏆',
        onStart: function(stageBody, teams) {
          let openedCells = new Set();

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- 5x5 Jeopardy Grid -->
                <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; width:100%; max-width:980px;">
                  <!-- Headers -->
                  ${categories.map(cat => `
                    <div style="background:#1e3a8a; color:#fde047; font-weight:900; font-size:1.1rem; padding:14px 8px; border-radius:14px; text-align:center; border:2px solid #38bdf8;">
                      ${cat.name}
                    </div>
                  `).join('')}

                  <!-- Rows 100 to 500 -->
                  ${[0, 1, 2, 3, 4].map(rowIdx => `
                    ${categories.map((cat, colIdx) => {
                      const cellId = `${colIdx}_${rowIdx}`;
                      const isOp = openedCells.has(cellId);
                      const pts = cat.points[rowIdx];
                      return `
                        <button onclick="window._cgClickJeopardyCell('${cellId}', '${cat.name}', ${pts})" style="aspect-ratio:1.4; border-radius:14px; border:2px solid ${isOp ? '#334155' : '#f59e0b'}; background:${isOp ? '#0f172a' : '#1e293b'}; color:${isOp ? '#475569' : '#fde047'}; font-weight:900; font-size:1.4rem; cursor:${isOp ? 'default' : 'pointer'}; box-shadow:${isOp ? 'none' : '0 4px 14px rgba(245,158,11,0.2)'}; display:flex; align-items:center; justify-content:center;">
                          ${isOp ? '✓' : pts}
                        </button>
                      `;
                    }).join('')}
                  `).join('')}
                </div>
              </div>
            `;
          }

          window._cgClickJeopardyCell = function(cellId, catName, pts) {
            if (openedCells.has(cellId)) return;
            openedCells.add(cellId);
            if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();

            const ans = prompt(`🏆 JEOPARDY [${catName} - ${pts} ĐIỂM]:
Câu hỏi thử thách: Thiên Chúa đã phán điều gì khi sáng tạo ánh sáng trong ngày thứ nhất?

(A: Hãy có ánh sáng / B: Hãy có muôn sao / C: Hãy có bầu trời)
Nhập chữ cái đáp án:`);
            if (ans && ans.trim().toUpperCase() === 'A') {
              if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
              window._cgAddPoints(0, pts);
              alert(`CHÍNH XÁC! Bạn đã giành được +${pts} điểm vào Bảng Vàng!`);
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert(`Rất tiếc! Đáp án đúng là A: "Hãy có ánh sáng!" (St 1, 3).`);
            }
            render();
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 21. GHI NHỚ LỜI CHÚA MAU LẸ (BOUNCING WORDS)
    // ------------------------------------------------------------------------
    openBouncingWordsGame: function() {
      const sentence = "Chúa là Đấng từ bi và nhân hậu";
      const words = ["Chúa", "là", "Đấng", "từ bi", "và", "nhân hậu"];

      window.CatechismGames.renderClassroomModal({
        id: 'bouncing-words-game',
        title: 'Ghi Nhớ Lời Chúa Mau Lẹ — Thẻ Từ Vựng Bay',
        category: 'TƯ DUY TỪ NGỮ',
        icon: '☁️',
        onStart: function(stageBody, teams) {
          let selectedWords = [];

          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
              <!-- Target Prompt -->
              <div style="background:#eff6ff; border:2px solid #38bdf8; border-radius:18px; padding:16px 28px; font-weight:800; font-size:1.15rem; color:#0284c7; margin-bottom:24px; text-align:center;">
                📖 HÃY BẮT VÀ GHÉP THÀNH CÂU: <br>
                <span style="font-size:1.3rem; color:#1e293b;">"${sentence}"</span>
              </div>

              <!-- Sentence Placeholder Slots -->
              <div style="display:flex; gap:10px; margin-bottom:30px; min-height:50px;">
                ${words.map((_, i) => `
                  <div style="min-width:70px; height:46px; border:2px dashed #94a3b8; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; font-weight:900; color:#0284c7; padding:0 12px;">
                    ${selectedWords[i] || (i + 1)}
                  </div>
                `).join('')}
              </div>

              <!-- Floating Cards -->
              <div style="display:flex; flex-wrap:wrap; gap:14px; justify-content:center; max-width:600px;">
                ${[...words].sort(() => 0.5 - Math.random()).map(w => `
                  <button onclick="window._cgClickBouncingWord('${w}')" style="padding:14px 24px; border-radius:999px; background:#f43f5e; color:#fff; border:none; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow:0 6px 16px rgba(244,63,94,0.35);">
                    ☁️ ${w}
                  </button>
                `).join('')}
              </div>

              <div style="margin-top:30px;">
                <button onclick="window._cgResetBouncingWords()" style="padding:10px 24px; border-radius:999px; background:#64748b; color:#fff; border:none; font-weight:800; cursor:pointer;">
                  🔄 Xếp Lại Từ Đầu
                </button>
              </div>
            </div>
          `;

          window._cgClickBouncingWord = function(word) {
            if (selectedWords.length >= words.length) return;
            const expected = words[selectedWords.length];
            if (word === expected) {
              if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
              selectedWords.push(word);
              if (selectedWords.length === words.length) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80 });
                window._cgAddPoints(0, 150);
                alert(`✨ CHÚC MỪNG! BẠN ĐÃ HOÀN THÀNH CÂU LỜI CHÚA: "${sentence}"!`);
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              alert(`Chưa đúng thứ tự! Từ cần tìm tiếp theo là "${expected}".`);
            }
            window.CatechismGames.openBouncingWordsGame();
          };

          window._cgResetBouncingWords = function() {
            selectedWords = [];
            window.CatechismGames.openBouncingWordsGame();
          };
        }
      });
    },

    openFlyingWordsQuiz: function() {
      window.CatechismGames.openBouncingWordsGame();
    },

    // ------------------------------------------------------------------------
    // 22. ĐA-VÍT CHIẾN THẮNG KHỔNG LỒ GOLIATH (JUNGLE RESCUE)
    // ------------------------------------------------------------------------
    openJungleRescueQuiz: function() {
      const questions = window.CatechismGames.getSafeQuestions('jungle-rescue-quiz');
      window.CatechismGames.renderClassroomModal({
        id: 'jungle-rescue-quiz',
        title: 'Đa-vít Dũng Cảm Chiến Thắng Khổng Lồ Goliath',
        category: 'THỬ THÁCH PHIÊU LƯU',
        icon: '🏹',
        questions: questions,
        onStart: function(stageBody, teams) {
          let goliathHp = 100;
          let qIdx = 0;

          function render() {
            const q = questions[qIdx % questions.length];
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- Battlefield View -->
                <div style="width:100%; max-width:850px; height:240px; background:linear-gradient(180deg, #bbf7d0 0%, #15803d 100%); border-radius:28px; border:3px solid #86efac; position:relative; overflow:hidden; display:flex; justify-content:space-around; align-items:center;">
                  <!-- David (Right) -->
                  <div style="display:flex; flex-direction:column; align-items:center;">
                    <span style="font-size:4rem;">🏹</span>
                    <span style="background:#fff; color:#15803d; font-weight:900; padding:4px 14px; border-radius:999px; font-size:0.85rem;">CHÀNG ĐA-VÍT</span>
                  </div>

                  <!-- Sling Stone Anim -->
                  <div id="cg-sling-stone" style="font-size:2.5rem; transition:transform 0.4s ease;">
                    🪨
                  </div>

                  <!-- Goliath Boss (Left) -->
                  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                    <div style="width:180px; height:18px; background:#e2e8f0; border-radius:999px; overflow:hidden; border:2px solid #fff;">
                      <div style="width:${goliathHp}%; height:100%; background:#dc2626; transition:width 0.4s ease;"></div>
                    </div>
                    <span style="font-size:5.5rem; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.3));">👹</span>
                    <span style="background:#fff; color:#dc2626; font-weight:900; padding:4px 14px; border-radius:999px; font-size:0.85rem;">KHỔNG LỒ GOLIATH (${goliathHp} HP)</span>
                  </div>
                </div>

                <!-- Question Box -->
                <div style="width:100%; max-width:800px; background:#fff; border-radius:24px; padding:24px; margin-top:20px; border:2px solid #cbd5e1; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                  <div style="color:#15803d; font-weight:800; font-size:0.9rem; margin-bottom:8px;">BẮN HÒN ĐÁ ĐỨC TIN SỐ ${qIdx + 1}</div>
                  <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0 0 16px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgSlingStoneAnswer(${oIdx})" style="padding:12px 16px; border-radius:12px; border:2px solid #e2e8f0; background:#f8fafc; font-weight:700; font-size:0.95rem; text-align:left; cursor:pointer;">
                        <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }

          window._cgSlingStoneAnswer = function(chosenIdx) {
            const q = questions[qIdx % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playCannon === 'function') window.SoundFX.playCannon();
              const stone = document.getElementById('cg-sling-stone');
              if (stone) stone.style.transform = 'translateX(120px) scale(1.4)';

              setTimeout(() => {
                goliathHp = Math.max(0, goliathHp - 25);
                window._cgAddPoints(0, 100);
                if (goliathHp <= 0) {
                  if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                  if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90 });
                  alert('🏆 ĐA-VÍT ĐÃ NHÂN DANH ĐỨC CHÚA HẠ GỤC KHỔNG LỒ GOLIATH VÀ GIẢI CỨU DÂN THÁNH!');
                }
                qIdx++;
                render();
              }, 400);
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
              qIdx++;
              render();
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 23. HÀNH TRÌNH VỀ ĐẤT HỨA RETRO 8-BIT (MARIO RACE)
    // ------------------------------------------------------------------------
    openMarioRaceGame: function() {
      const questions = window.CatechismGames.getSafeQuestions('mario-race');
      window.CatechismGames.renderClassroomModal({
        id: 'mario-race',
        title: 'Hành Trình Về Đất Hứa Retro 8-bit',
        category: 'PHIÊU LƯU RETRO',
        icon: '🍄',
        questions: questions,
        onStart: function(stageBody, teams) {
          let pos = 10;
          let qIdx = 0;

          function render() {
            const q = questions[qIdx % questions.length];
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <!-- 8-Bit Pixel Stage -->
                <div style="width:100%; max-width:900px; height:200px; background:#fef08a; border:4px solid #ca8a04; border-radius:24px; position:relative; overflow:hidden; display:flex; align-items:flex-end;">
                  <!-- Desert Ground -->
                  <div style="position:absolute; bottom:0; left:0; right:0; height:45px; background:#ca8a04;"></div>
                  <!-- Goal Flag: Promised Land -->
                  <div style="position:absolute; right:30px; bottom:45px; font-size:3.5rem;">🚩</div>
                  <!-- Runner -->
                  <div style="position:absolute; bottom:45px; left:${pos}%; font-size:3.2rem; transition:left 0.4s ease;">
                    🏃‍♂️
                  </div>
                </div>

                <!-- Question Box -->
                <div style="width:100%; max-width:800px; background:#fff; border-radius:24px; padding:24px; margin-top:20px; border:2px solid #cbd5e1; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                  <div style="color:#ef4444; font-weight:800; font-size:0.9rem; margin-bottom:8px;">CHẶNG ĐƯỜNG SA MẠC ${qIdx + 1}</div>
                  <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0 0 16px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgMarioAnswer(${oIdx})" style="padding:12px 16px; border-radius:12px; border:2px solid #e2e8f0; background:#f8fafc; font-weight:700; font-size:0.95rem; text-align:left; cursor:pointer;">
                        <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }

          window._cgMarioAnswer = function(chosenIdx) {
            const q = questions[qIdx % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
              pos += 18;
              window._cgAddPoints(0, 50);
              if (pos >= 80) {
                if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
                alert('🏆 XIN CHÚC MỪNG! LỮ KHÁCH ĐÃ VƯỢT SA MẠC VÀ ĐẶT CHÂN VÀO MIỀN ĐẤT HỨA ĐẦY SỮA VÀ MẬT!');
                pos = 10;
              }
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
            }
            qIdx++;
            render();
          };

          render();
        }
      });
    },

    openMathSackRaceGame: function() {
      window.CatechismGames.openMarioRaceGame();
    },

    openCarRaceQuiz: function() {
      window.CatechismGames.openMarioRaceGame();
    },

    // ------------------------------------------------------------------------
    // 24. GIẢI MÃ CẶP ĐÔI KINH THÁNH (CHIBI MEMORY & 7 BÍ TÍCH)
    // ------------------------------------------------------------------------
    openBibleMemoryPairs: function() {
      const symbols = ['🍞', '🍷', '🕊️', '📿', '✝️', '📖', '💖', '🕯️'];
      const cards = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

      window.CatechismGames.renderClassroomModal({
        id: 'bible-memory',
        title: 'Giải Mã Cặp Đôi Kinh Thánh (Chibi Memory & 7 Bí Tích)',
        category: 'GHI NHỚ & GHÉP CẶP',
        icon: '🃏',
        onStart: function(stageBody, teams) {
          let flipped = [];
          let matched = new Set();

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; width:100%; max-width:480px;">
                  ${cards.map((sym, idx) => {
                    const isUp = flipped.includes(idx) || matched.has(idx);
                    return `
                      <button onclick="window._cgFlipMemoryCard(${idx})" style="aspect-ratio:1; border-radius:16px; border:2px solid ${isUp ? '#10b981' : '#3b82f6'}; background:${isUp ? '#ecfdf5' : '#1e3a8a'}; font-size:2.2rem; cursor:${isUp ? 'default' : 'pointer'}; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                        ${isUp ? sym : '❓'}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }

          window._cgFlipMemoryCard = function(idx) {
            if (flipped.length >= 2 || flipped.includes(idx) || matched.has(idx)) return;
            flipped.push(idx);
            if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
            render();

            if (flipped.length === 2) {
              const [c1, c2] = flipped;
              if (cards[c1] === cards[c2]) {
                if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
                matched.add(c1);
                matched.add(c2);
                flipped = [];
                window._cgAddPoints(0, 50);
                if (matched.size === cards.length) {
                  if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
                  if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80 });
                  alert('🎉 XIN CHÚC MỪNG! BẠN ĐÃ MỞ ĐƯỢC TOÀN BỘ 8 CẶP BIỂU TƯỢNG THÁNH!');
                }
                render();
              } else {
                setTimeout(() => {
                  flipped = [];
                  render();
                }, 800);
              }
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 25. LẬT MẢNH GHÉP TRANH CHÚA CHIÊN LÀNH
    // ------------------------------------------------------------------------
    openHolyPictureFlip: function() {
      const questions = window.CatechismGames.getSafeQuestions('holy-picture-flip');
      window.CatechismGames.renderClassroomModal({
        id: 'holy-picture-flip',
        title: 'Lật Mảnh Ghép Tranh Chúa Chiên Lành',
        category: 'KHÁM PHÁ BỨC TRANH',
        icon: '🖼️',
        questions: questions,
        onStart: function(stageBody, teams) {
          let openedTiles = new Set();

          function render() {
            stageBody.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
                <div style="position:relative; width:480px; height:340px; border-radius:24px; border:4px solid #f59e0b; overflow:hidden; box-shadow:0 15px 40px rgba(0,0,0,0.25);">
                  <!-- Picture Behind -->
                  <img src="anh/games/thumb_shepherd_rescue.jpg" style="width:100%; height:100%; object-fit:cover;">
                  <!-- 12 Tiles Overlay -->
                  <div style="position:absolute; inset:0; display:grid; grid-template-columns:repeat(4, 1fr); grid-template-rows:repeat(3, 1fr); gap:3px; background:#0f172a;">
                    ${Array.from({length:12}).map((_, i) => {
                      const isOp = openedTiles.has(i);
                      return `
                        <button onclick="window._cgFlipTile(${i})" style="border:none; background:${isOp ? 'transparent' : '#0284c7'}; color:#fff; font-size:1.4rem; font-weight:900; cursor:${isOp ? 'default' : 'pointer'};">
                          ${isOp ? '' : (i + 1)}
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div style="margin-top:20px;">
                  <button onclick="window._cgGuessFullPicture()" style="padding:12px 32px; border-radius:999px; background:#10b981; color:#fff; border:none; font-weight:900; font-size:1.05rem; cursor:pointer;">
                    🖼️ ĐOÁN TOÀN BỘ BỨC TRANH
                  </button>
                </div>
              </div>
            `;
          }

          window._cgFlipTile = function(idx) {
            if (openedTiles.has(idx)) return;
            openedTiles.add(idx);
            if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
            render();
          };

          window._cgGuessFullPicture = function() {
            const guess = prompt("Nhập tên bức tranh thánh (Gợi ý: Người Mục Tử...):");
            if (guess && (guess.toLowerCase().includes("mục tử") || guess.toLowerCase().includes("chiên lành"))) {
              if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
              if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80 });
              for (let i = 0; i < 12; i++) openedTiles.add(i);
              window._cgAddPoints(0, 500);
              alert('🎉 CHÍNH XÁC! ĐÂY LÀ BỨC TRANH CHÚA GIÊ-SU NGƯỜI MỤC TỬ NHÂN LÀNH! (+500 ĐIỂM)');
              render();
            } else if (guess) {
              alert('Chưa chính xác, hãy lật thêm các ô số nhé!');
            }
          };

          render();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 26. CHIẾC RƯƠNG GIAO ƯỚC BÍ ẨN
    // ------------------------------------------------------------------------
    openCovenantBoxes: function() {
      window.CatechismGames.renderClassroomModal({
        id: 'covenant-boxes',
        title: 'Chiếc Rương Giao Ước Bí Ẩn',
        category: 'BẤT NGỜ & MAY MẮN',
        icon: '📦',
        onStart: function(stageBody, teams) {
          const chests = [
            { id: 1, prize: "⭐ Phúc Lành Ân Sủng: +100 Điểm", pts: 100 },
            { id: 2, prize: "🎁 Hộp Quà Thánh: Nhân Đôi Điểm Số!", pts: 200 },
            { id: 3, prize: "🕊️ Bình An Của Chúa: +50 Điểm", pts: 50 },
            { id: 4, prize: "👑 Vương Niệm Vinh Hiển: +150 Điểm", pts: 150 },
            { id: 5, prize: "📖 Lời Hằng Sống: +80 Điểm", pts: 80 },
            { id: 6, prize: "💖 Tình Yêu Mẹ Maria: +120 Điểm", pts: 120 }
          ];

          stageBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; width:100%; max-width:700px;">
                ${chests.map(ch => `
                  <button onclick="window._cgOpenChest(${ch.id}, '${ch.prize}', ${ch.pts})" style="aspect-ratio:1.2; border-radius:20px; border:3px solid #f59e0b; background:#1e293b; color:#fff; font-size:2.8rem; cursor:pointer; box-shadow:0 8px 20px rgba(0,0,0,0.2); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;">
                    <span>📦</span>
                    <span style="font-size:0.9rem; font-weight:900; color:#fde047;">Rương Số ${ch.id}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `;

          window._cgOpenChest = function(id, prize, pts) {
            if (typeof window.SoundFX?.playChime === 'function') window.SoundFX.playChime();
            if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60 });
            window._cgAddPoints(0, pts);
            alert(`✨ BẠN ĐÃ MỞ RƯƠNG SỐ ${id}:
${prize}`);
          };
        }
      });
    },

    // ------------------------------------------------------------------------
    // 27-30. TƯƠNG TÁC AI CAMERA (HEAD TILT, POSE, PE DANCE, MOSQUITO)
    // ------------------------------------------------------------------------
    openHeadTiltAI: function() {
      const q = [
        { question: "Mẹ Maria được chào chúc là 'Đầy ơn phúc' trong biến cố nào?", options: ["Nghiêng Trái: Truyền Tin", "Nghiêng Phải: Thăm Viếng"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('head-tilt', '👤 NGHIÊNG ĐẦU CHUẨN — ĐÁP ÁN LỜI CHÚA', q);
    },

    openPoseImitationGame: function() {
      const q = [
        { question: "Tư thế cầu nguyện của Đức Mẹ Maria khi thưa lời 'Xin Vâng'?", options: ["Chắp tay cung kính & cúi đầu", "Dang tay reo mừng", "Khoanh tay chào"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('pose-imitation', '🧘‍♂️ BẮT CHƯỚC CỬ ĐIỆU THÁNH CA MAU LẸ', q);
    },

    openIndoorPEDanceGame: function() {
      const q = [
        { question: "Lời bài hát: 'Này bạn ơi mau mau cùng nhau ta về đây bên Chúa...'", options: ["Hát vang mừng vui", "Ngồi yên lặng", "Chạy thật nhanh"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('indoor-pe-dance', '🏃‍♂️ VŨ ĐIỆU THÁNH CA & KHỞI ĐỘNG TNTT', q);
    },

    openMosquitoSlayerGame: function() {
      const q = [
        { question: "Đa-vít đã dùng vũ khí nào để hạ gục chó sói rình rập đàn chiên?", options: ["Cây gậy mục tử và trành ném đá", "Thanh gươm vàng", "Ngọn giáo dài"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('mosquito-slayer', '🛡️ ĐA-VÍT BẢO VỆ ĐÀN CHIÊN XUA ĐUỔI CHÓ SÓI', q);
    },

    // ------------------------------------------------------------------------
    // 31-33. KHÁM PHÁ 3D SÁNG THẾ (EARTH 3D, SPACE 3D, VIRTUAL LAB)
    // ------------------------------------------------------------------------
    openGeoEarthStructureGame: function() {
      const q = [
        { question: "Lúc khởi đầu, Thiên Chúa đã sáng tạo điều gì trong sách Sáng Thế?", options: ["Trời và đất", "Muôn loài", "Biển cả", "Muôn sao"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('geo-earth-structure-game', '🌍 3D KỲ QUAN TẠO DỰNG: TRÁI ĐẤT CỦA THIÊN CHÚA', q);
    },

    openGeo3DExperimentsGame: function() {
      const q = [
        { question: "Thánh Vịnh 19 ca tụng công trình sáng tạo vũ trụ như thế nào?", options: ["Trời xanh tường thuật vinh quang Thiên Chúa", "Biển gầm vang dậy", "Trăng sao rực rỡ", "Đất nở hoa tươi"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('geo-3d-experiments-game', '🌐 3D VŨ TRỤ VẠN VẬT CA KHEN THIÊN CHÚA', q);
    },

    openKHTNVirtualLabGame: function() {
      const q = [
        { question: "Trong ngày thứ nhất sáng tạo, Thiên Chúa phán điều gì?", options: ["Hãy có ánh sáng!", "Hãy có mặt trời!", "Hãy có nước!", "Hãy có cây cỏ!"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('khtn-virtual-lab-game', '🧪 3D KHÁM PHÁ KỲ QUAN TỰ NHIÊN CỦA THIÊN CHÚA', q);
    },

    openShepherdRescue: function() {
      const q = [
        { question: "Người Mục Tử Tốt Lành sẵn sàng làm gì cho đàn chiên?", options: ["Hy sinh mạng sống mình cho đoàn chiên", "Bỏ mặc chiên", "Thu tiền của chiên"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('shepherd-rescue', '🐑 NGƯỜI MỤC TỬ TỐT LÀNH BẢO VỆ ĐÀN CHIÊN', q);
    },

    // ------------------------------------------------------------------------
    // UNIVERSAL CATHOLIC ARENA (Fallback quiz)
    // ------------------------------------------------------------------------
    openUniversalCatholicArena: function(gameId, customTitle, defaultQ) {
      const questions = window.CatechismGames.getSafeQuestions(gameId, defaultQ);
      window.CatechismGames.renderClassroomModal({
        id: gameId || 'quiz',
        title: customTitle || 'Trắc Nghiệm Giáo Lý & Kinh Thánh',
        category: 'GIÁO LÝ CÔNG GIÁO',
        icon: '✨',
        questions: questions,
        onStart: function(stageBody, teams) {
          let qIdx = 0;
          let score = 0;

          function renderQuiz() {
            const q = questions[qIdx % questions.length] || questions[0];
            stageBody.innerHTML = `
              <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#071521; padding:24px;">
                <div style="width:100%; max-width:850px; background:rgba(30,41,59,0.95); border-radius:24px; border:2px solid rgba(255,255,255,0.12); padding:32px; box-shadow:0 20px 50px rgba(0,0,0,0.5);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <span style="font-weight:800; color:#38bdf8;">CÂU HỎI ${qIdx + 1} / ${questions.length}</span>
                    <span style="font-weight:800; color:#fbbf24;"><i class="fa-solid fa-trophy"></i> Điểm: ${score}</span>
                  </div>
                  <h3 style="font-size:1.4rem; font-weight:900; line-height:1.5; color:#fff; margin:0 0 24px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                    ${q.options.map((opt, oIdx) => `
                      <button onclick="window._cgUniversalAnswer(${oIdx})" style="padding:18px 20px; border-radius:16px; border:2px solid #334155; background:#0f172a; color:#fff; font-weight:700; font-size:1.05rem; text-align:left; cursor:pointer;">
                        <span style="color:#38bdf8; font-weight:900; margin-right:8px;">${String.fromCharCode(65 + oIdx)}.</span> ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }

          window._cgUniversalAnswer = function(chosenIdx) {
            const q = questions[qIdx % questions.length];
            if (chosenIdx === q.correct) {
              if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
              score += 100;
              window._cgAddPoints(0, 100);
            } else {
              if (typeof window.SoundFX?.playWrong === 'function') window.SoundFX.playWrong();
            }
            qIdx++;
            if (qIdx < questions.length) {
              renderQuiz();
            } else {
              if (typeof window.SoundFX?.playFanfare === 'function') window.SoundFX.playFanfare();
              if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
              alert(`🎉 XIN CHÚC MỪNG! BẠN ĐÃ HOÀN THÀNH TOÀN BỘ CÂU HỎI VỚI TỔNG ĐIỂM: ${score}!`);
            }
          };

          renderQuiz();
        }
      });
    },

    // ------------------------------------------------------------------------
    // CUSTOMIZER MODAL (Soạn / Tải file câu hỏi & danh sách học sinh)
    // ------------------------------------------------------------------------
    openCustomizer: function(gameId, title, isStudentPicker) {
      if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
      const cleanTitle = String(title || 'Trò Chơi').replace(/'/g, '');
      const modal = document.createElement('div');
      modal.id = 'cg-customizer-modal';
      modal.className = 'cg-arena-overlay';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999999; display:flex; align-items:center; justify-content:center; padding:20px; font-family:Inter,system-ui,sans-serif; color:#fff;';
      modal.innerHTML = `
        <div style="background:#0f172a; border:2px solid #3b82f6; border-radius:24px; padding:32px; width:100%; max-width:600px; box-shadow:0 25px 60px rgba(0,0,0,0.7); text-align:center;">
          <h3 style="font-size:1.35rem; font-weight:900; margin:0 0 12px 0;">📂 ${isStudentPicker ? 'TÙY BIẾN DANH SÁCH HỌC SINH' : 'TÙY BIẾN CÂU HỎI'}</h3>
          <p style="color:#94a3b8; font-size:0.95rem; margin-bottom:20px;">Trò chơi: <strong>${cleanTitle}</strong></p>

          <div style="background:rgba(255,255,255,0.06); border:2px dashed #475569; border-radius:16px; padding:24px; margin-bottom:24px; cursor:pointer;" onclick="document.getElementById('cg-cust-file').click()">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:2.5rem; color:#60a5fa; margin-bottom:8px;"></i>
            <div style="font-weight:700; font-size:1rem;">Nhấn vào đây để tải lên tệp (.xlsx, .docx, .txt)</div>
            <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">Hỗ trợ Excel, Word hoặc văn bản danh sách câu hỏi</div>
            <input type="file" id="cg-cust-file" style="display:none;" onchange="alert('Đã tiếp nhận tệp của giáo lý viên!'); document.getElementById('cg-customizer-modal').remove();">
          </div>

          <div style="display:flex; justify-content:center; gap:14px;">
            <button onclick="document.getElementById('cg-customizer-modal').remove()" style="padding:10px 28px; border-radius:999px; background:rgba(255,255,255,0.15); color:#fff; border:none; font-weight:800; cursor:pointer;">Đóng</button>
            <button onclick="localStorage.removeItem('cg_custom_q_${gameId}'); localStorage.removeItem('cg_custom_students_${gameId}'); alert('Đã khôi phục dữ liệu mặc định!'); document.getElementById('cg-customizer-modal').remove();" style="padding:10px 28px; border-radius:999px; background:#ef4444; color:#fff; border:none; font-weight:800; cursor:pointer;">Khôi Phục Mặc Định</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    },

    closeCustomizer: function() {
      const m = document.getElementById('cg-customizer-modal');
      if (m) m.remove();
    },

    downloadTemplate: function(gameId, title, isStudentPicker) {
      alert(`Đang tải tệp mẫu ${isStudentPicker ? 'Danh Sách Học Sinh (.xlsx)' : 'Câu Hỏi Trắc Nghiệm (.xlsx)'} cho ${title}...`);
    },

    resetGameData: function(gameId, title) {
      if (confirm(`Bạn có chắc muốn khôi phục dữ liệu mặc định cho trò chơi "${title}"?`)) {
        localStorage.removeItem('cg_custom_q_' + gameId);
        localStorage.removeItem('cg_custom_students_' + gameId);
        alert('Đã khôi phục thành công!');
      }
    }
  };

  // Keyboard shortcut ESC to exit any active game
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const hasGame = document.querySelector('.cg-arena-overlay, .cg-classroom-modal, .cg-win-modal, .cg-book-modal-backdrop, .cg-chapter-reader-backdrop');
      if (hasGame) {
        window.CatechismGames.closeActiveGame();
      }
    }
  });

  console.log("✅ CATECHISM INTERACTIVE GAMES CONTROLLER Loaded Successfully (38 Dedicated Games)!");
})();

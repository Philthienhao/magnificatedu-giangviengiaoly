/**
 * ==========================================================================
 * CATECHISM INTERACTIVE GAMES CONTROLLER (TRÒ CHƠI GIÁO LÝ TƯƠNG TÁC)
 * Nền tảng: MagnificatEdu - Giáo Lý Công Giáo & Thiếu Nhi Thánh Thể
 * Thiết kế: Thầy Hảo - Đồ Nghề Dạy Học & Giáo Lý Đổi Mới
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
          gain.gain.setValueAtTime(0.18, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.85);
        });
      } catch (e) { console.warn(e); }
    },

    // Kèn mừng chiến thắng Alleluia
    playTrumpet: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const fanfare = [
          { f: 523.25, d: 0.12 },
          { f: 659.25, d: 0.12 },
          { f: 783.99, d: 0.12 },
          { f: 1046.50, d: 0.45 }
        ];
        let offset = 0;
        fanfare.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(item.f, now + offset);
          gain.gain.setValueAtTime(0.15, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + item.d + 0.05);
          offset += item.d * 0.85;
        });
      } catch (e) { console.warn(e); }
    },

    // Âm thanh click nảy nhẹ
    playPop: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) { console.warn(e); }
    },

    playClick: function() {
      this.playPop();
    },

    playTick: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) { console.warn(e); }
    },

    playWrong: function() {
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) { console.warn(e); }
    }
  };

  // --- Confetti Helper (Hỗ trợ pháo hoa chúc mừng) ---
  function fireConfetti() {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // --- Data Provider: Học sinh từ MagnificatEdu hoặc Mẫu Giáo Lý ---
  function getStudentRoster(selectedClassId) {
    let roster = [];
    if (typeof window.getMagnificatStudents === 'function') {
      roster = window.getMagnificatStudents();
    } else if (window.data && Array.isArray(window.data.students)) {
      roster = window.data.students;
    }

    if (selectedClassId && selectedClassId !== 'all') {
      roster = roster.filter(s => String(s.classId) === String(selectedClassId));
    }

    // Nếu chưa có học sinh trong hệ thống, cung cấp danh sách học viên mẫu chuẩn Công Giáo
    if (!roster || roster.length === 0) {
      roster = [
        { id: 's1', christianName: 'Giuse', fullName: 'Nguyễn Văn An', gender: 'Nam' },
        { id: 's2', christianName: 'Maria', fullName: 'Trần Thị Mai', gender: 'Nữ' },
        { id: 's3', christianName: 'Gioan', fullName: 'Lê Hoàng Nam', gender: 'Nam' },
        { id: 's4', christianName: 'Têrêsa', fullName: 'Phạm Ngọc Ánh', gender: 'Nữ' },
        { id: 's5', christianName: 'Phêrô', fullName: 'Võ Minh Đức', gender: 'Nam' },
        { id: 's6', christianName: 'Anna', fullName: 'Đặng Thùy Dương', gender: 'Nữ' },
        { id: 's7', christianName: 'Phaolô', fullName: 'Bùi Tuấn Kiệt', gender: 'Nam' },
        { id: 's8', christianName: 'Mácta', fullName: 'Hoàng Kim Chi', gender: 'Nữ' }
      ];
    }
    return roster;
  }

  // --------------------------------------------------------------------------
  // DỮ LIỆU BỘ 10 PHONG CÁCH GAME CÔNG GIÁO CHUẨN GIAO DIỆN GAMEGIAODUC
  // --------------------------------------------------------------------------
  const CATECHISM_GAMES_CATALOG = [
    {
      id: 'noah-ark',
      title: 'Cuộc Đua Con Tàu Nô-ê & Gọi Tên',
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
      id: 'angel-wheel',
      title: 'Vòng Quay Thiên Thần & Thánh Bổn Mạng',
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
      id: 'head-tilt',
      title: 'Nghiêng Đầu Chuẩn — Đáp Án Lời Chúa',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Bật camera máy tính, học sinh nghiêng đầu sang trái hoặc phải để lựa chọn đáp án đúng cực mượt! AI nhận diện trực tiếp cử chỉ.',
      thumbnail: 'anh/games/thumb_head_tilt.jpg',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      playsCount: 0,
      metaCount: '8 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openHeadTiltAI()'
    },
    {
      id: 'faith-tugofwar',
      title: 'Kéo Co Đức Tin: Đội Phê-rô vs Đội Phao-lô',
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
      id: 'temple-builder',
      title: 'Xây Đền Thờ Thánh Giê-ru-sa-lem',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Cùng Vua Sa-lô-môn xếp các khối đá cẩm thạch trắng và cột gỗ quý Li-băng. Mỗi câu trả lời đúng đặt một tầng đá vững chắc cho Đền Thờ Thiên Chúa.',
      thumbnail: 'anh/games/thumb_temple_builder.jpg',
      icon: '🏛️',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #f59e0b 100%)',
      playsCount: 0,
      metaCount: '7 tầng',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openTempleBuilder()'
    },
    {
      id: 'bible-millionaire',
      title: 'Thử Thách Triệu Phú Kinh Thánh',
      category: 'TRẮC NGHIỆM GIÁO LÝ',
      filterCat: 'quiz',
      description: 'Gameshow Ai Là Triệu Phú chuẩn phong cách Công Giáo. Chinh phục 15 mốc câu hỏi ân sủng kèm 3 quyền trợ giúp: 50:50, Thiên thần, Cầu nguyện.',
      thumbnail: 'anh/games/thumb_bible_millionaire.jpg',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      playsCount: 0,
      metaCount: '15 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openBibleMillionaire()'
    },
    {
      id: 'covenant-boxes',
      title: 'Chiếc Rương Giao Ước Bí Ẩn',
      category: 'HỘP QUÀ BÍ MẬT',
      filterCat: 'quiz',
      description: 'Học sinh chọn mở các chiếc rương thánh bọc vàng. Giải đáp câu đố Lời Chúa để mở khóa điểm số ân sủng, nhân đôi số điểm hoặc lá chắn chở che.',
      thumbnail: 'anh/games/thumb_covenant_boxes.jpg',
      icon: '📦',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
      playsCount: 0,
      metaCount: '8 rương',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openCovenantBoxes()'
    },
    {
      id: 'holy-picture-flip',
      title: 'Lật Mảnh Ghép Tranh Chúa Chiên Lành',
      category: 'KHÁM PHÁ BỨC ẢNH',
      filterCat: 'reflex',
      description: 'Bức tranh Thánh được che bởi 9 mảnh ghép bí mật. Trả lời đúng từng câu đố để từng mảnh ghép bay biến mất hé lộ dung mạo Đấng Mục Tử Nhân Lành.',
      thumbnail: 'anh/games/thumb_holy_picture_flip.jpg',
      icon: '🧩',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      playsCount: 0,
      metaCount: '9 mảnh',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openHolyPictureFlip()'
    },
    {
      id: 'shepherd-rescue',
      title: 'Người Mục Tử Tốt Lành Bảo Vệ Đàn Chiên',
      category: 'VẬN ĐỘNG & PHẢN XẠ',
      filterCat: 'reflex',
      description: 'Cùng cậu bé dũng cảm Đa-vít giải cứu các chú chiên con hiền lành và gõ xua đuổi sói rừng trong 30 giây rực lửa. Rèn luyện phản xạ và tinh thần bác ái.',
      thumbnail: 'anh/games/thumb_shepherd_rescue.jpg',
      icon: '🐑',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      playsCount: 0,
      metaCount: '30 giây',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openShepherdRescue()'
    },
    {
      id: 'bible-memory',
      title: 'Giải Mã Cặp Đôi Kinh Thánh (Chibi Memory)',
      category: 'TRÍ NHỚ & KINH THÁNH',
      filterCat: 'reflex',
      description: 'Lật mở các cặp thẻ bài chibi Công Giáo (Chúa Giê-su, Đức Mẹ, Thánh Giuse...). Khi ghép đúng sẽ mở khóa một câu Lời Chúa ý nghĩa tương ứng.',
      thumbnail: 'anh/games/thumb_bible_memory.jpg',
      icon: '📖',
      gradient: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
      playsCount: 0,
      metaCount: '8 cặp thẻ',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openBibleMemoryPairs()'
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
      id: 'indoor-pe-dance',
      title: 'Vũ Điệu Thánh Ca & Khởi Động TNTT',
      subtitle: 'Cử Điệu Thánh Ca & Sinh Hoạt Trong Lớp',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Khởi động giờ học sôi nổi với các bài cử điệu Thiếu Nhi Thánh Thể. Camera AI nhận diện khung xương và chấm điểm hào hứng 100 điểm!',
      thumbnail: 'anh/games/thumb_pe_dance.jpg',
      icon: '🏃‍♂️',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      playsCount: 0,
      metaCount: '6 cử điệu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openIndoorPEDanceGame()'
    },
    {
      id: 'pose-imitation',
      title: 'Bắt Chước Cử Điệu Thánh Ca Mau Lẹ',
      subtitle: 'Nhìn Tư Thế Thánh Nhận Điểm Ân Sủng',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Học sinh nhìn tư thế cử điệu Công Giáo trên màn hình và làm theo đúng động tác trước Camera AI để ghi điểm ân sủng.',
      thumbnail: 'anh/games/thumb_pose_imitation.jpg',
      icon: '🧘‍♂️',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      playsCount: 0,
      metaCount: '6 tư thế',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openPoseImitationGame()'
    },
    {
      id: 'mosquito-slayer',
      title: 'Đa-vít Xua Đuổi Chó Sói Bảo Vệ Đàn Chiên',
      subtitle: 'Vung Tay Đập Sói Trước Webcam',
      category: 'TƯƠNG TÁC AI CAMERA',
      filterCat: 'camera',
      description: 'Màn hình chia 2 đội. Các chú sói mang đáp án A-B-C-D bay tới rình rập đàn chiên. Học sinh vung tay xua đuổi đúng sói mang đáp án đúng trên webcam để ghi điểm!',
      thumbnail: 'anh/games/thumb_shepherd_rescue.jpg',
      icon: '🐑',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMosquitoSlayerGame()'
    },
    {
      id: 'mario-race',
      title: 'Hành Trình Về Đất Hứa Retro 8-bit',
      subtitle: 'Cuộc Đua Vượt Biển Đỏ & Sa Mạc',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: '4 đội xuất phát trên đường đua retro 8-bit. Trả lời đúng đập vỡ hộp ân sủng, nhận Manna tăng tốc vượt chướng ngại vật sa mạc để cán đích Miền Đất Hứa!',
      thumbnail: 'anh/games/thumb_mario_race.jpg',
      icon: '🍄',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)',
      playsCount: 0,
      metaCount: '6 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMarioRaceGame()'
    },
    {
      id: 'crossword-lock',
      title: 'Ô Chữ Kinh Thánh & Chìa Khóa Cứu Độ',
      subtitle: 'Giải Hàng Ngang Mở Khóa Từ Khóa Vàng',
      category: 'TƯ DUY TỪ NGỮ',
      filterCat: 'words',
      description: 'Giải các câu hỏi hàng ngang về nhân vật, địa danh Kinh Thánh để lật mở các chữ cái của Từ Khóa Bí Mật ở hàng dọc.',
      thumbnail: 'anh/games/thumb_crossword.jpg',
      icon: '🔤',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      playsCount: 0,
      metaCount: '5 hàng ngang',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openCrosswordLock()'
    },
    {
      id: 'knowledge-train',
      title: 'Đoàn Tàu Đức Tin — Biến Cố Cứu Độ',
      subtitle: 'Kéo Thả Toa Tàu Theo Dòng Lịch Sử Thánh',
      category: 'KÉO THẢ THỨ TỰ',
      filterCat: 'words',
      description: 'Kéo thả các toa tàu theo đúng trật tự thời gian biến cố Cứu Độ: Tạo dựng -> Xuất hành -> Nhập thể -> Khổ nạn -> Phục sinh.',
      thumbnail: 'anh/games/thumb_train.jpg',
      icon: '🚂',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      playsCount: 0,
      metaCount: '5 toa tàu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openKnowledgeTrain()'
    },
    {
      id: 'fruit-ninja-quiz',
      title: 'Hái Hoa Trái Thánh Thần — Bắt Bong Bóng Ân Sủng',
      subtitle: 'Chém / Bắt Hoa Trái Mang Lời Chúa Đúng',
      category: 'HÀNH ĐỘNG & PHẢN XẠ',
      filterCat: 'reflex',
      description: 'Nhiều quả bong bóng / chùm nho mang các đáp án khác nhau bay lên từ bên dưới. Nhanh tay chém hoặc nhấp đúng hoa trái Thánh Thần mang đáp án đúng!',
      thumbnail: 'anh/games/thumb_fruit_ninja.jpg',
      icon: '🍇',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openFruitNinjaQuiz()'
    },
    {
      id: 'car-race-quiz',
      title: 'Chiến Xa Tiên Tri Ê-li-a Về Thiên Quốc',
      subtitle: 'Cuộc Đua Chiến Xa Lửa Tốc Độ Đố Vui',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Cuộc đua tốc độ 2-4 cỗ xe tiên tri Ê-li-a. Mỗi câu trả lời đúng giúp cỗ xe bứt phá lao nhanh về cổng Thiên Đàng vinh phúc!',
      thumbnail: 'anh/games/thumb_car_race.jpg',
      icon: '🏎️',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openCarRaceQuiz()'
    },
    {
      id: 'minesweeper-quiz',
      title: 'Vượt Sa Mạc Sinai Về Miền Đất Hứa',
      subtitle: 'Khám Phá Ô Bình An Tránh Cám Dỗ Sa Mạc',
      category: 'THỬ THÁCH PHIÊU LƯU',
      filterCat: 'reflex',
      description: 'Vượt hành trình sa mạc với 3 mạng sống (Đức Tin - Cậy - Mến). Chọn đúng các ô bình an và giải đố Lời Chúa để đưa dân Ít-ra-en về miền Đất Hứa.',
      thumbnail: 'anh/games/thumb_minesweeper.jpg',
      icon: '🏜️',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      playsCount: 0,
      metaCount: '5 chặng',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMinesweeperQuiz()'
    },
    {
      id: 'flying-words-quiz',
      title: 'Bồ Câu Ngũ Tuần — Ghép Câu Kinh Thánh',
      subtitle: 'Bắt Các Đám Mây Chữ Sắp Xếp Lời Chúa',
      category: 'TƯ DUY TỪ NGỮ',
      filterCat: 'words',
      description: 'Bắt các đám mây chữ từ bầu trời Thánh Thần bay qua để sắp xếp đúng thứ tự câu Kinh Thánh / Kinh Tin Kính hoàn chỉnh.',
      thumbnail: 'anh/games/thumb_flying_words.jpg',
      icon: '🕊️',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
      playsCount: 0,
      metaCount: '5 câu Kinh Thánh',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openFlyingWordsQuiz()'
    },
    {
      id: 'matching-pairs-quiz',
      title: 'Kéo Thả Nối Ý — Nhân Vật & Sự Kiện Kinh Thánh',
      subtitle: 'Nối Cột A Khái Niệm Với Cột B Tương Ứng',
      category: 'GHI NHỚ & GHÉP CẶP',
      filterCat: 'reflex',
      description: 'Bài trắc nghiệm kéo thả nối ý: Ghép nhân vật Cột A (như Môsê, Đavít, Phaolô...) với sự kiện / sứ mạng tương ứng ở Cột B.',
      thumbnail: 'anh/games/thumb_matching_pairs.jpg',
      icon: '🔗',
      gradient: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
      playsCount: 0,
      metaCount: '5 cặp nối ý',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMatchingPairsQuiz()'
    },
    {
      id: 'marble-race-quiz',
      title: 'Đua Bi Thiên Thần — Gọi Tên Học Viên Lên Bảng',
      subtitle: 'Đua Bi Thác Đổ Vật Lý Chọn Em May Mắn',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Mô phỏng đường đua bi rơi thác đổ tự do qua đệm nảy mây trời, dốc zíc-zắc và phễu cổ chai. Tự động cập nhật bảng xếp hạng và gọi tên học viên may mắn!',
      thumbnail: 'anh/games/thumb_marble_race.jpg',
      icon: '🏁',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openMarbleRace()'
    },
    {
      id: 'duck-race-quiz',
      title: 'Cuộc Đua Con Tàu Nô-ê Trên Sông Gio-đan',
      subtitle: 'Đua Thuyền Trên Dòng Nước Thánh Gọi Tên Học Viên',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Mỗi con thuyền / chú vịt gắn tên một học viên thiếu nhi. Khi bấm Đua!, các thuyền lướt sóng về đích chọn ra học sinh may mắn nhận thưởng!',
      thumbnail: 'anh/games/thumb_noah_ark.jpg',
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
      subtitle: 'Đàn Chiên Hiền Lành Về Đồng Cỏ Xanh Tươi',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Mỗi chú chiên gắn tên 1 học viên. Khi bấm Bắt đầu, đàn chiên lon ton chạy đua về đồng cỏ bên suối mát chọn ra em may mắn nhất!',
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
      subtitle: 'Gắp Phần Thưởng Ân Sủng Chọn Học Viên',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Mô phỏng máy gắp quà thần kỳ. Mỗi món quà / gấu bông gắn tên 1 học viên. Cần gạt hạ xuống gắp ngẫu nhiên quà mang tên học viên lên bảng!',
      thumbnail: 'anh/games/thumb_claw_machine.jpg',
      icon: '🧸',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openClawMachine()'
    },
    {
      id: 'student-group-divider-quiz',
      title: 'Phân Đội Thiếu Nhi Thánh Thể (Chiên Con, Ấu, Thiếu, Nghĩa)',
      subtitle: 'Chia Nhóm Tự Động & Bốc Thăm Đội Bí Mật',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Chia lớp học theo ngành TNTT hoặc 2-8 đội tự động. Hiệu ứng bốc thăm bí mật hồi hộp kèm nhạc nền rộn rã, tráo đổi đội và xuất danh sách tức thì.',
      thumbnail: 'anh/games/thumb_group_divider.jpg',
      icon: '⚜️',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      playsCount: 0,
      metaCount: '2-8 đội',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openStudentGroupDivider()'
    },
    {
      id: 'astronaut-quiz',
      title: 'Cỗ Xe Lửa Tiên Tri Ê-li-a Lên Tầng Trời',
      subtitle: 'Bay Qua Các Tầng Trời Chọn Học Viên May Mắn',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Đếm ngược 5 giây kịch tính, cỗ xe lửa cất cánh bay bổng giữa bầu trời ngàn sao và đáp xuống tinh tú mang tên học viên được Chúa chọn!',
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
      subtitle: 'Bồ Câu Trắng Mang Dải Lụa Tên Học Sinh',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'race',
      description: 'Chiếc rương thánh phát ánh quang lung linh. Khi bấm Triệu hồi, chim bồ câu trắng tung cánh mang theo dải lụa ghi tên học sinh được vinh danh!',
      thumbnail: 'anh/games/thumb_magic_hat.jpg',
      icon: '🕊️',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #831843 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openMagicHat()'
    },
    {
      id: 'magic-grimoire-quiz',
      title: 'Sách Sự Sống Triệu Hồi — AI Nhận Diện Cử Chỉ Tay',
      subtitle: 'Vẫy Tay Trước Camera AI Lật Sách Sự Sống',
      category: 'GỌI TÊN VÀ CHIA NHÓM',
      filterCat: 'camera',
      description: 'Tích hợp Webcam AI nhận diện cử chỉ tay. Học sinh hoặc giáo lý viên chỉ cần vẫy tay trước ống kính, Sách Sự Sống tự động lật mở trang chọn học viên!',
      thumbnail: 'anh/games/thumb_magic_grimoire.jpg',
      icon: '📖',
      gradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
      playsCount: 0,
      metaCount: 'Cả lớp học',
      isStudentPicker: true,
      onPlay: 'window.CatechismGames.openMagicGrimoire()'
    },
    {
      id: 'jungle-rescue-quiz',
      title: 'Đa-vít Dũng Cảm Chiến Thắng Khổng Lồ Goliath',
      subtitle: 'Đấu Trí Vượt Cạm Bẫy Bảo Vệ Dân Chúa',
      category: 'THỬ THÁCH PHIÊU LƯU',
      filterCat: 'reflex',
      description: 'Cùng chú bé mục đồng Đa-vít vượt qua cạm bẫy nơi thung lũng Ê-la, trả lời đúng các câu hỏi đức tin để đánh bại Goliath và nhận phần thưởng ân sủng!',
      thumbnail: 'anh/games/thumb_jungle_rescue.jpg',
      icon: '🛡️',
      gradient: 'linear-gradient(135deg, #15803d 0%, #047857 100%)',
      playsCount: 0,
      metaCount: '5 thử thách',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openJungleRescueQuiz()'
    },
    {
      id: 'jeopardy-quiz',
      title: 'Đấu Trí Bảng Vàng Giáo Lý (Jeopardy 5 Chủ Đề)',
      subtitle: 'Ma Trận Bảng Điểm 20 Ô Cực Kịch Tính',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'quiz',
      description: 'Ma trận 20 ô thuộc 5 chủ đề: Cựu Ước, Tân Ước, 7 Bí Tích, 10 Điều Răn và Phụng Vụ. Các sự kiện thưởng điểm, mất lượt hoặc nhân đôi điểm số x2!',
      thumbnail: 'anh/games/thumb_jeopardy.jpg',
      icon: '🟨',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      playsCount: 0,
      metaCount: '20 ô câu đố',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openJeopardyQuiz()'
    },
    {
      id: 'geo-earth-structure-game',
      title: '🌍 3D Kỳ Quan Tạo Dựng: Trái Đất Của Thiên Chúa',
      subtitle: 'Bóc Tách 3D Cấu Tạo Địa Cầu Theo Sách Sáng Thế',
      category: 'KHÁM PHÁ 3D',
      filterCat: '3d',
      description: 'Mô hình 3D tương tác bóc tách các lớp cấu tạo Trái Đất, minh họa công trình tạo dựng kỳ vĩ của Thiên Chúa trong Sách Sáng Thế với 360 độ xoay tự do.',
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
      category: 'KHÁM PHÁ 3D',
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
      id: 'bouncing-words-game',
      title: 'Ghi Nhớ Lời Chúa Mau Lẹ — Thẻ Từ Vựng Bay',
      subtitle: 'Bắt Các Từ Bay Lượn Ghép Đúng Câu Kinh Thánh',
      category: 'TƯ DUY TỪ NGỮ',
      filterCat: 'words',
      description: 'Các từ trong câu Lời Chúa bay lơ lửng liên tục. Thiếu nhi quan sát nhanh và nhấp chọn theo đúng trình tự để hoàn tất câu Lời Chúa nhận điểm ân sủng!',
      thumbnail: 'anh/games/thumb_bouncing_words.jpg',
      icon: '☁️',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openBouncingWordsGame()'
    },
    {
      id: 'math-sack-race-game',
      title: 'Đua Nhảy Bao Bố — Cuộc Đua Về Nhà Chúa',
      subtitle: 'Thi Đấu 2 Đội Nhảy Bao Bố Vượt Thử Thách',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Hai đội thi đấu trả lời các câu hỏi Giáo lý và Kinh Thánh để điều khiển nhân vật nhảy bao bố vượt chướng ngại vật tiến về Nhà Thờ giáo xứ!',
      thumbnail: 'anh/games/thumb_sack_race.jpg',
      icon: '🦘',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openMathSackRaceGame()'
    },
    {
      id: 'pirate-ship-battle-game',
      title: 'Con Tàu Đức Tin Vượt Sóng Biển Hồ Ga-li-lê',
      subtitle: 'Đội Thuyền Giương Buồm Vượt Bão Tố Biển Hồ',
      category: 'ĐỐI KHÁNG ĐỘI NHÓM',
      filterCat: 'race',
      description: 'Hai đội thuyền đức tin vượt qua cơn giông tố trên biển hồ Ga-li-lê như các Tông đồ năm xưa. Trả lời đúng để giương buồm đưa thuyền cập bến bình an!',
      thumbnail: 'anh/games/thumb_galilee_ship.jpg',
      icon: '⛵',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      playsCount: 0,
      metaCount: '5 câu',
      isStudentPicker: false,
      onPlay: 'window.CatechismGames.openPirateShipBattleGame()'
    }
  ];

  function getGameQuestions(gameKey, defaultQuestions) {
    try {
      const custom = localStorage.getItem('cg_custom_q_' + gameKey);
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return defaultQuestions;
  }

  function getCustomStudents(gameKey) {
    try {
      const custom = localStorage.getItem('cg_custom_students_' + gameKey);
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return null;
  }

  // ==========================================================================
  // MAIN HUB RENDERER
  // ==========================================================================
  window.renderCatechismGames = function(container) {
    if (!container) return;

    const data = window.BIBLE_GAME_DATA || {};
    const books = data.books || [];
    const verses = data.verses || [];
    const randomVerse = verses[Math.floor(Math.random() * verses.length)] || {
      ref: "Ga 14, 6",
      text: "Thầy là con đường, là sự thật và là sự sống.",
      theme: "Lời Chúa"
    };

    let classes = [];
    if (typeof window.getMagnificatClasses === 'function') {
      classes = window.getMagnificatClasses();
    } else if (window.data && Array.isArray(window.data.classes)) {
      classes = window.data.classes;
    }

    container.innerHTML = `
      <div class="catechism-games-hub">
        <!-- HERO BANNER -->
        <div class="cg-hero-banner">
          <div class="cg-hero-badge">
            <i class="fa-solid fa-cross"></i> KHO TRÒ CHƠI GIÁO LÝ & KINH THÁNH TƯƠNG TÁC
          </div>
          <h1 class="cg-hero-title">Đồ Nghề Dạy Giáo Lý & Kinh Thánh</h1>
          <p class="cg-hero-desc">
            Không gian trò chơi giáo dục tích cực mang đậm phong cách Công Giáo với 35 trò chơi đa dạng.
            Kết hợp công nghệ tương tác Camera nhận diện cử chỉ, cuộc đua tương tác đồng đội và hình ảnh Kinh Thánh sống động
            giúp các em thiếu nhi học Lời Chúa hào hứng, say mê!
          </p>

          <div class="cg-hero-stats">
            <div class="cg-stat-item">
              <div class="cg-stat-icon"><i class="fa-solid fa-gamepad"></i></div>
              <div>
                <strong>35 Trò Chơi Giáo Lý</strong>
                <div style="font-size: 0.8rem; color: #94a3b8;">Đua nhóm • Trắc nghiệm • AI Camera</div>
              </div>
            </div>

            <div class="cg-stat-item">
              <div class="cg-stat-icon"><i class="fa-solid fa-book-bible"></i></div>
              <div>
                <strong>73 Sách Kinh Thánh</strong>
                <div style="font-size: 0.8rem; color: #94a3b8;">46 Cựu Ước • 27 Tân Ước</div>
              </div>
            </div>

            <div class="cg-stat-item">
              <div class="cg-stat-icon"><i class="fa-solid fa-users"></i></div>
              <div>
                <strong>Đua Nhóm & Gọi Tên</strong>
                <div style="font-size: 0.8rem; color: #94a3b8;">Con Tàu Nô-ê • Đua Bi • Vòng Quay</div>
              </div>
            </div>

            <div class="cg-stat-item" style="margin-left: auto; max-width: 320px; background: rgba(245, 158, 11, 0.1); border: 1px dashed rgba(245, 158, 11, 0.4); padding: 8px 14px; border-radius: 12px;">
              <div style="font-size: 0.78rem; color: #fbbf24; font-weight: 700;">
                <i class="fa-solid fa-quote-left"></i> LỜI CHÚA HÔM NAY (${randomVerse.ref})
              </div>
              <div style="font-size: 0.82rem; font-style: italic; color: #f1f5f9; line-height: 1.35;">
                "${randomVerse.text}"
              </div>
            </div>
          </div>
        </div>

        <!-- SEARCH INPUT -->
        <div style="margin: 1.5rem 0 1rem; position: relative;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #0284c7; font-size: 1.1rem;"></i>
          <input type="text" id="cg-games-search-input" placeholder="Tìm kiếm trò chơi Lời Chúa (ví dụ: Nghiêng đầu, Kéo co, Con tàu Nô-ê, Triệu phú, Đua bi, Đua vịt, Lật thẻ, Đa-vít, Mẹ Maria)..." style="width: 100%; box-sizing: border-box; padding: 14px 18px 14px 48px; border-radius: 14px; border: 1.5px solid #cbd5e1; font-size: 0.95rem; font-weight: 700; color: #0f172a; outline: none; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        </div>

        <!-- FILTER & CONTROLS BAR -->
        <div class="cg-filter-bar">
          <div class="cg-filter-tabs">
            <button class="cg-filter-btn active" data-filter="all">
              <i class="fa-solid fa-grid-2"></i> Tất cả (${CATECHISM_GAMES_CATALOG.length})
            </button>
            <button class="cg-filter-btn" data-filter="race">
              <i class="fa-solid fa-flag-checkered"></i> Đua Nhóm & Gọi Tên
            </button>
            <button class="cg-filter-btn" data-filter="quiz">
              <i class="fa-solid fa-brain"></i> Trắc Nghiệm Kịch Tính
            </button>
            <button class="cg-filter-btn" data-filter="camera">
              <i class="fa-solid fa-camera"></i> Tương Tác AI Camera
            </button>
            <button class="cg-filter-btn" data-filter="words">
              <i class="fa-solid fa-spell-check"></i> Tư Duy Từ Ngữ
            </button>
            <button class="cg-filter-btn" data-filter="reflex">
              <i class="fa-solid fa-hands"></i> Vận Động & Khéo Léo
            </button>
            <button class="cg-filter-btn" data-filter="3d">
              <i class="fa-solid fa-cube"></i> Khám Phá 3D
            </button>
            <button class="cg-filter-btn" data-filter="bible">
              <i class="fa-solid fa-book-bookmark"></i> 73 Sách Kinh Thánh
            </button>
          </div>

          <div class="cg-quick-select-class">
            <span><i class="fa-solid fa-users"></i> Lớp học:</span>
            <select id="cg-selected-class-dropdown">
              <option value="all">-- Toàn bộ Học viên --</option>
              ${classes.map(c => `<option value="${c.id}">${c.name || c.id}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- GAME CARDS GRID: 35 PHONG CÁCH GAME CÔNG GIÁO -->
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
                      <i class="fa-solid fa-arrow-right" style="font-size: 0.85rem;"></i>
                    </button>

                    <div class="cg-card-tools-row">
                      <button class="cg-btn-tool-upload" onclick="window.CatechismGames.openCustomizer('${g.id}', '${g.title.replace(/'/g, "\\'")}', ${Boolean(g.isStudentPicker)})" title="Soạn thảo hoặc nạp danh sách từ file Excel / Word">
                        <i class="fa-solid fa-bolt" style="color: #0d9488;"></i>
                        <span>${g.isStudentPicker ? '⚡ Tải Danh Sách Học Sinh' : '⚡ Soạn / Tải File (Excel, Word)'}</span>
                      </button>

                      <button class="cg-btn-tool-icon cg-btn-tool-template" onclick="window.CatechismGames.downloadTemplate('${g.id}', '${g.title.replace(/'/g, "\\'")}', ${Boolean(g.isStudentPicker)})" title="${g.isStudentPicker ? 'Tải tệp mẫu danh sách học sinh (.xlsx)' : 'Tải tệp mẫu Excel câu hỏi về máy'}">
                        <i class="fa-regular fa-file-lines"></i>
                      </button>

                      <button class="cg-btn-tool-icon cg-btn-tool-reset" onclick="window.CatechismGames.resetGameData('${g.id}', '${g.title.replace(/'/g, "\\'")}')" title="Khôi phục câu hỏi và cài đặt mặc định">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
<!-- SECTION: KHÁM PHÁ 73 SÁCH KINH THÁNH -->
        <div class="cg-bible-browser-section" id="cg-bible-books-section">
          <div class="cg-browser-header">
            <div class="cg-browser-title-wrap">
              <div class="cg-browser-icon"><i class="fa-solid fa-book-bible"></i></div>
              <div>
                <h2 class="cg-browser-title">
                  Kho Tra Cứu 73 Sách Kinh Thánh (Trọn Bộ Cựu Ước & Tân Ước)
                </h2>
                <div class="cg-browser-subtitle">
                  Tra cứu chi tiết từng sách, tóm lược nội dung, câu Lời Chúa cốt lõi (Kim Ngôn) và tra cứu các chương
                </div>
              </div>
            </div>
            
            <div class="cg-browser-stats-badges">
              <span class="cg-stat-badge old"><span class="cg-stat-dot old"></span> Cựu Ước: <strong>46 Sách</strong></span>
              <span class="cg-stat-badge new"><span class="cg-stat-dot new"></span> Tân Ước: <strong>27 Sách</strong></span>
              <span class="cg-stat-badge total"><i class="fa-solid fa-scroll"></i> Tổng: <strong>73 Sách</strong></span>
            </div>
          </div>

          <!-- BIBLE TOOLBAR: SEARCH & CATEGORY FILTER TABS -->
          <div class="cg-bible-toolbar">
            <div class="cg-bible-search-wrap">
              <i class="fa-solid fa-magnifying-glass cg-search-icon"></i>
              <input type="text" id="cg-bible-search-input" class="cg-bible-search-input" 
                     placeholder="Tìm kiếm sách theo tên hoặc từ viết tắt (VD: Sáng Thế, St, Mát-thêu, Mt, Gio-an, Tv, Khôn Ngoan...)"
                     oninput="window.CatechismGames.filterBibleBooks()">
              <button type="button" class="cg-bible-search-clear" onclick="window.CatechismGames.clearBibleSearch()" title="Xóa tìm kiếm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="cg-bible-filter-pills" id="cg-bible-filter-pills">
              <button type="button" class="cg-bible-pill active" data-filter-type="testament" data-filter-val="all" onclick="window.CatechismGames.setTestamentFilter('all', this)">
                <i class="fa-solid fa-layer-group"></i> Tất Cả (73)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="testament" data-filter-val="old" onclick="window.CatechismGames.setTestamentFilter('old', this)">
                <i class="fa-solid fa-sun"></i> Cựu Ước (46)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="testament" data-filter-val="new" onclick="window.CatechismGames.setTestamentFilter('new', this)">
                <i class="fa-solid fa-dove"></i> Tân Ước (27)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Ngũ Thư" onclick="window.CatechismGames.setGroupFilter('Ngũ Thư', this)">
                Ngũ Thư (5)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Lịch Sử" onclick="window.CatechismGames.setGroupFilter('Lịch Sử', this)">
                Lịch Sử (16)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Khôn Ngoan" onclick="window.CatechismGames.setGroupFilter('Khôn Ngoan', this)">
                Khôn Ngoan (7)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Ngôn Sứ" onclick="window.CatechismGames.setGroupFilter('Ngôn Sứ', this)">
                Ngôn Sứ (18)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Tin Mừng" onclick="window.CatechismGames.setGroupFilter('Tin Mừng', this)">
                Phúc Âm (4)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Thư Phaolô" onclick="window.CatechismGames.setGroupFilter('Thư Phaolô', this)">
                Thư Phaolô (14)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Thư Chung" onclick="window.CatechismGames.setGroupFilter('Thư Chung', this)">
                Thư Chung (7)
              </button>
              <button type="button" class="cg-bible-pill" data-filter-type="group" data-filter-val="Khải Huyền" onclick="window.CatechismGames.setGroupFilter('Khải Huyền', this)">
                Khải Huyền (1)
              </button>
            </div>
          </div>

          <!-- GRID OF 73 RICH BOOK CARDS -->
          <div class="cg-books-grid" id="cg-books-cards-grid">
            ${books.map((b, idx) => `
              <div class="cg-book-card ${b.testament === 'new' ? 'is-new' : 'is-old'}" 
                   data-id="${b.id}"
                   data-name="${b.name.toLowerCase()}"
                   data-abbr="${b.abbr.toLowerCase()}"
                   data-testament="${b.testament}"
                   data-group="${b.group}"
                   onclick="window.CatechismGames.openBookDetails('${b.id}')"
                   title="Bấm để mở chi tiết Sách ${b.name} (${b.abbr}) - ${b.chapters} chương">
                <div class="cg-book-card-header">
                  <div class="cg-book-abbr-badge">${b.abbr}</div>
                  <span class="cg-book-testament-badge ${b.testament}">
                    ${b.testament === 'new' ? 'Tân Ước' : 'Cựu Ước'}
                  </span>
                </div>
                <div class="cg-book-card-body">
                  <div class="cg-book-icon-circle">
                    <i class="fa-solid ${b.icon || 'fa-book-bible'}"></i>
                  </div>
                  <div class="cg-book-name">${b.name}</div>
                  <div class="cg-book-group-text">${b.group}</div>
                </div>
                <div class="cg-book-card-footer">
                  <span class="cg-book-chap-count"><i class="fa-solid fa-list-ol"></i> ${b.chapters} Chương</span>
                  <span class="cg-book-action-hint">Chi tiết <i class="fa-solid fa-chevron-right"></i></span>
                </div>
              </div>
            `).join('')}
          </div>
          <div id="cg-bible-no-results" class="cg-bible-no-results" style="display: none;">
            <i class="fa-solid fa-book-open" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 10px;"></i>
            <p style="font-size: 1.1rem; color: #475569; font-weight: 700;">Không tìm thấy sách phù hợp</p>
            <button type="button" class="cg-btn-play" style="margin: 10px auto; padding: 8px 20px; font-size: 0.9rem;" onclick="window.CatechismGames.clearBibleSearch()">
              <i class="fa-solid fa-rotate-left"></i> Xem lại tất cả 73 Sách
            </button>
          </div>
        </div>

      </div>
    `;

    // Filter Button Handler
    
    // Search & Filter Handlers
    const filterBtns = container.querySelectorAll('.cg-filter-btn');
    const cards = container.querySelectorAll('.cg-game-card');
    const bibleSec = container.querySelector('#cg-bible-books-section');
    const searchInput = container.querySelector('#cg-games-search-input');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        cards.forEach(c => {
          const title = (c.querySelector('.cg-card-title')?.textContent || '').toLowerCase();
          const desc = (c.querySelector('.cg-card-desc')?.textContent || '').toLowerCase();
          const cat = (c.querySelector('.cg-card-badge-topleft')?.textContent || '').toLowerCase();
          if (!q || title.includes(q) || desc.includes(q) || cat.includes(q)) {
            c.style.display = 'flex';
          } else {
            c.style.display = 'none';
          }
        });
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        if (filter === 'all') {
          cards.forEach(c => c.style.display = 'flex');
          if (bibleSec) bibleSec.style.display = 'block';
        } else if (filter === 'bible') {
          cards.forEach(c => c.style.display = 'none');
          if (bibleSec) {
            bibleSec.style.display = 'block';
            bibleSec.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          if (bibleSec) bibleSec.style.display = 'none';
          cards.forEach(c => {
            if (c.getAttribute('data-category') === filter) {
              c.style.display = 'flex';
            } else {
              c.style.display = 'none';
            }
          });
        }
      });
    });
  };


  // ==========================================================================
  // GAME ARENA LOGIC CONTROLLER
  window.CatechismGames = {

    // ------------------------------------------------------------------------
    // 1. GAME: CON TÀU NÔ-Ê & VÒNG QUAY THÁNH BỔN MẠNG
    // ------------------------------------------------------------------------
    openNoahArkRace: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('noah-ark');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);
      const data = window.BIBLE_GAME_DATA || {};
      const racersIcons = data.noahRacers || [];

      // Chọn tối đa 6 - 8 em tham gia 1 lượt đua
      let currentRacers = roster.slice(0, 6).map((s, idx) => {
        const iconObj = racersIcons[idx % racersIcons.length];
        return {
          id: s.id,
          name: `${s.christianName || ''} ${s.fullName || 'Học viên'}`,
          avatar: iconObj.avatar,
          title: iconObj.name,
          color: iconObj.color,
          progress: 0
        };
      });

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-noah-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title-wrap">
            <div class="cg-arena-icon"><i class="fa-solid fa-ship"></i></div>
            <div>
              <div class="cg-arena-title">Cuộc Đua Con Tàu Nô-ê (Noah's Ark Race)</div>
              <div class="cg-arena-subtitle">Hành trình hướng về con tàu giao ước & ơn cứu độ</div>
            </div>
          </div>
          <div class="cg-arena-actions">
            <button class="cg-arena-btn-icon" onclick="window.CatechismGames.toggleWheelModal()" title="Vòng Quay Thiên Thần Gọi Tên">
              <i class="fa-solid fa-dharmachakra"></i>
            </button>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>
        </div>

        <div class="cg-arena-body">
          <div class="cg-noah-stage">
            <div class="cg-roster-bar">
              <div class="cg-roster-info">
                <i class="fa-solid fa-flag-checkered" style="color: #f59e0b; font-size: 1.3rem;"></i>
                <span>Sẵn sàng cho <strong>${currentRacers.length} làn đua</strong></span>
              </div>
              <div style="display: flex; gap: 10px;">
                <label class="cg-btn-play" style="padding: 8px 18px; font-size: 0.9rem; cursor: pointer; background: #ffffff; color: #1e3a8a; border: 2px solid #3b82f6; border-radius: 12px; font-weight: 700; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
                  <i class="fa-solid fa-file-excel" style="color: #10b981; margin-right: 6px;"></i> Nạp Excel
                  <input type="file" id="cg-noah-excel-input" accept=".xlsx, .xls" style="display: none;">
                </label>
                <button class="cg-btn-play" id="cg-btn-start-race" style="padding: 8px 22px; font-size: 0.95rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; font-weight: 800; border: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);">
                  <i class="fa-solid fa-bolt" style="margin-right: 6px;"></i> XUẤT PHÁT ĐUA!
                </button>
              </div>
            </div>

            <div class="cg-race-track-container" id="cg-lanes-wrap">
              ${currentRacers.map((r, i) => `
                <div class="cg-race-lane" id="lane-${i}">
                  <div class="cg-lane-info">
                    <span class="cg-lane-avatar">${r.avatar}</span>
                    <div>
                      <div class="cg-lane-name">${r.name}</div>
                      <div class="cg-lane-saint">${r.title}</div>
                    </div>
                  </div>
                  <div class="cg-lane-track">
                    <div class="cg-lane-progress" id="progress-${i}" style="width: 0%;">
                      <span class="cg-racer-sprite">${r.avatar}</span>
                    </div>
                  </div>
                  <div class="cg-finish-line"><i class="fa-solid fa-ship"></i></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();

      // Race Animation Loop
      let raceInterval = null;
      let isRacing = false;
      const startBtn = arenaEl.querySelector('#cg-btn-start-race');

      startBtn.addEventListener('click', () => {
        if (isRacing) return;
        isRacing = true;
        SoundFX.playBell();
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG ĐUA...';

        // Reset
        currentRacers.forEach((r, i) => {
          r.progress = 0;
          document.getElementById(`progress-${i}`).style.width = '0%';
        });

        raceInterval = setInterval(() => {
          let winner = null;
          currentRacers.forEach((r, i) => {
            const step = Math.random() * 4 + 1.2;
            r.progress += step;
            if (r.progress >= 96) {
              r.progress = 100;
              if (!winner) winner = r;
            }
            const pEl = document.getElementById(`progress-${i}`);
            if (pEl) pEl.style.width = `${r.progress}%`;
          });

          if (winner) {
            clearInterval(raceInterval);
            isRacing = false;
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> ĐUA LƯỢT MỚI';
            SoundFX.playTrumpet();
            fireConfetti();

            setTimeout(() => {
              window.CatechismGames.showWinnerModal(
                `🎉 CHÚC MỪNG CHIẾN THẮNG! 🎉`,
                `<strong>${winner.name}</strong> đã xuất sắc về đích Con Tàu Nô-ê đầu tiên!<br><span style="color: #fbbf24; font-size: 0.9rem;">"Ai bền đỗ đến cùng, kẻ ấy sẽ được cứu rỗi!" (Mt 24, 13)</span>`
              );
            }, 600);
          }
        }, 120);
      });

      // Excel Import Support
      const excelInput = arenaEl.querySelector('#cg-noah-excel-input');
      excelInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || typeof window.XLSX === 'undefined') return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const wb = window.XLSX.read(evt.target.result, { type: 'binary' });
            const wsName = wb.SheetNames[0];
            const data = window.XLSX.utils.sheet_to_json(wb.Sheets[wsName]);
            if (data && data.length > 0) {
              // Parse rows
              const newNames = data.map((row, idx) => {
                const name = row['Họ và tên'] || row['Họ và tên học sinh'] || row['Tên'] || Object.values(row)[0] || 'Học viên';
                const saint = row['Tên Thánh'] || '';
                const iconObj = racersIcons[idx % racersIcons.length];
                return {
                  id: `excel_${idx}`,
                  name: `${saint} ${name}`.trim(),
                  avatar: iconObj.avatar,
                  title: iconObj.name,
                  progress: 0
                };
              }).slice(0, 8);

              currentRacers = newNames;
              const lanesWrap = arenaEl.querySelector('#cg-lanes-wrap');
              lanesWrap.innerHTML = currentRacers.map((r, i) => `
                <div class="cg-race-lane" id="lane-${i}">
                  <div class="cg-lane-info">
                    <span class="cg-lane-avatar">${r.avatar}</span>
                    <div>
                      <div class="cg-lane-name">${r.name}</div>
                      <div class="cg-lane-saint">${r.title}</div>
                    </div>
                  </div>
                  <div class="cg-lane-track">
                    <div class="cg-lane-progress" id="progress-${i}" style="width: 0%;">
                      <span class="cg-racer-sprite">${r.avatar}</span>
                    </div>
                  </div>
                  <div class="cg-finish-line"><i class="fa-solid fa-ship"></i></div>
                </div>
              `).join('');
              SoundFX.playHarp();
            }
          } catch (err) {
            console.error('Lỗi đọc file Excel:', err);
          }
        };
        reader.readAsBinaryString(file);
      });
    },

    // ------------------------------------------------------------------------
    // 2. GAME: THỬ THÁCH NGHIÊNG ĐẦU CAMERA AI (HEAD TILT WEBCAM)
    // ------------------------------------------------------------------------
    openHeadTiltAI: function() {
      SoundFX.playBell();
      const defaultTiltQ = (window.BIBLE_GAME_DATA && window.BIBLE_GAME_DATA.tiltQuestions) || [];
      const questions = getGameQuestions('head-tilt', defaultTiltQ);
      let qIndex = 0;
      let score = 0;
      let isLocked = false;
      let tiltDir = null; // 'A' (Left) or 'B' (Right)
      let tiltHoldCounter = 0;
      const tiltThreshold = 18; // Khung hình giữ nghiêng đầu để chốt đáp án

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-tilt-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title-wrap">
            <div class="cg-arena-icon"><i class="fa-solid fa-camera"></i></div>
            <div>
              <div class="cg-arena-title">Thử Thách Nghiêng Đầu: Phân Định Thiêng Liêng (Webcam AI)</div>
              <div class="cg-arena-subtitle">Nghiêng đầu TRÁI (A) hoặc PHẢI (B) để khóa đáp án Lời Chúa</div>
            </div>
          </div>
          <div class="cg-arena-actions">
            <div style="color: #b45309; font-weight: 800; font-size: 1rem; margin-right: 15px;" id="cg-tilt-score-badge">
              <i class="fa-solid fa-star" style="color: #f59e0b;"></i> Điểm: 0
            </div>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>
        </div>

        <div class="cg-arena-body">
          <div class="cg-head-tilt-stage">
            <!-- WEBCAM LIVE PREVIEW -->
            <div class="cg-webcam-preview-box">
              <video id="cg-webcam-stream" class="cg-webcam-video" autoplay playsinline muted></video>
              <canvas id="cg-webcam-canvas" style="display: none;" width="160" height="120"></canvas>
              <div class="cg-tilt-indicator" id="cg-tilt-status-text">Đang kết nối camera...</div>
            </div>

            <!-- QUESTION & OPTIONS ARENA -->
            <div class="cg-quiz-arena-center">
              <div class="cg-question-box" id="cg-tilt-qbox">
                <div class="cg-question-category" id="cg-tilt-cat">CỰU ƯỚC</div>
                <div class="cg-question-text" id="cg-tilt-qtext">Đang tải câu hỏi...</div>
              </div>

              <div class="cg-options-row">
                <div class="cg-option-card option-a" id="cg-card-opt-a" onclick="window.CatechismGames.triggerManualChoice('A')">
                  <div class="cg-option-tilt-prompt"><i class="fa-solid fa-arrow-left"></i> NGHIÊNG TRÁI / PHÍM TRÁI</div>
                  <div class="cg-option-text" id="cg-tilt-text-a">Đáp án A</div>
                  <div class="cg-lock-progress-bar" id="cg-prog-a"></div>
                </div>

                <div class="cg-option-card option-b" id="cg-card-opt-b" onclick="window.CatechismGames.triggerManualChoice('B')">
                  <div class="cg-option-tilt-prompt">NGHIÊNG PHẢI / PHÍM PHẢI <i class="fa-solid fa-arrow-right"></i></div>
                  <div class="cg-option-text" id="cg-tilt-text-b">Đáp án B</div>
                  <div class="cg-lock-progress-bar" id="cg-prog-b"></div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; color: #475569; font-size: 0.9rem; text-align: center; font-weight: 600;">
                💡 <em>Thầy cô hoặc học sinh có thể nghiêng đầu tự nhiên trước camera, hoặc bấm phím mũi tên <strong>⬅️ Trái / ➡️ Phải</strong> trên bàn phím.</em>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();

      // Render Question Function
      function loadQuestion(idx) {
        if (idx >= questions.length) {
          SoundFX.playTrumpet();
          fireConfetti();
          window.CatechismGames.showWinnerModal(
            `🎉 HOÀN THÀNH XUẤT SẮC! 🎉`,
            `Em đã trả lời đúng đạt <strong>${score} / ${questions.length * 10} điểm</strong>!<br>Nguyện xin Lời Chúa luôn là ánh sáng soi đường cho em!`
          );
          return;
        }

        const q = questions[idx];
        isLocked = false;
        tiltDir = null;
        tiltHoldCounter = 0;

        const catEl = arenaEl.querySelector('#cg-tilt-cat');
        const qEl = arenaEl.querySelector('#cg-tilt-qtext');
        const aEl = arenaEl.querySelector('#cg-tilt-text-a');
        const bEl = arenaEl.querySelector('#cg-tilt-text-b');
        const cardA = arenaEl.querySelector('#cg-card-opt-a');
        const cardB = arenaEl.querySelector('#cg-card-opt-b');

        catEl.innerText = q.category || 'GIÁO LÝ';
        qEl.innerText = `Câu ${idx + 1}: ${q.question}`;
        aEl.innerText = q.optionA;
        bEl.innerText = q.optionB;

        cardA.className = 'cg-option-card option-a';
        cardB.className = 'cg-option-card option-b';
        arenaEl.querySelector('#cg-prog-a').style.width = '0%';
        arenaEl.querySelector('#cg-prog-b').style.width = '0%';
      }

      loadQuestion(qIndex);

      // Handle Choice Submission
      function confirmChoice(choice) {
        if (isLocked) return;
        isLocked = true;
        const q = questions[qIndex];
        const cardA = arenaEl.querySelector('#cg-card-opt-a');
        const cardB = arenaEl.querySelector('#cg-card-opt-b');

        const isCorrect = (choice === q.correct);
        if (isCorrect) {
          score += 10;
          arenaEl.querySelector('#cg-tilt-score-badge').innerHTML = `<i class="fa-solid fa-star"></i> Điểm: ${score}`;
          SoundFX.playHarp();
          fireConfetti();
          if (choice === 'A') cardA.classList.add('correct');
          else cardB.classList.add('correct');
        } else {
          SoundFX.playPop();
          if (choice === 'A') {
            cardA.classList.add('wrong');
            cardB.classList.add('correct');
          } else {
            cardB.classList.add('wrong');
            cardA.classList.add('correct');
          }
        }

        // Chuyển câu kế tiếp sau 2.5 giây
        setTimeout(() => {
          qIndex++;
          loadQuestion(qIndex);
        }, 2500);
      }

      window.CatechismGames.triggerManualChoice = function(choice) {
        confirmChoice(choice);
      };

      // Keyboard Controls Fallback (Arrow Left / Right)
      const keyHandler = (e) => {
        if (e.key === 'ArrowLeft') confirmChoice('A');
        if (e.key === 'ArrowRight') confirmChoice('B');
      };
      window.addEventListener('keydown', keyHandler);
      arenaEl._cleanupKey = () => window.removeEventListener('keydown', keyHandler);

      // Webcam & Head Movement Optical Flow Tracker (Canvas Difference)
      const video = arenaEl.querySelector('#cg-webcam-stream');
      const canvas = arenaEl.querySelector('#cg-webcam-canvas');
      const ctx = canvas.getContext('2d');
      const statusText = arenaEl.querySelector('#cg-tilt-status-text');

      let streamObj = null;
      let prevFrame = null;
      let animId = null;

      navigator.mediaDevices?.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false })
        .then(stream => {
          streamObj = stream;
          video.srcObject = stream;
          statusText.innerText = '🟢 AI sẵn sàng: Hãy nghiêng đầu!';

          // Detection Loop ~25fps
          const detectLoop = () => {
            if (!video.videoWidth || isLocked) {
              animId = requestAnimationFrame(detectLoop);
              return;
            }

            ctx.drawImage(video, 0, 0, 160, 120);
            const frame = ctx.getImageData(0, 0, 160, 120);
            const data = frame.data;

            // Tính trọng tâm sáng / chuyển động trái phải
            let leftMass = 0;
            let rightMass = 0;
            for (let y = 20; y < 100; y += 4) {
              for (let x = 10; x < 150; x += 4) {
                const idx = (y * 160 + x) * 4;
                const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
                if (x < 80) leftMass += brightness;
                else rightMass += brightness;
              }
            }

            // Lưu ý: Webcam bị lật ngược gương (Mirrored)
            // Khi người dùng nghiêng đầu sang trái thực tế -> ảnh bên phải
            const diff = (leftMass - rightMass) / (leftMass + rightMass + 1);

            const progA = arenaEl.querySelector('#cg-prog-a');
            const progB = arenaEl.querySelector('#cg-prog-b');

            if (diff > 0.08) {
              // Nghiêng Trái
              tiltHoldCounter++;
              if (progA) progA.style.width = `${Math.min(100, (tiltHoldCounter / tiltThreshold) * 100)}%`;
              if (progB) progB.style.width = '0%';
              statusText.innerText = `👈 Đang chọn: A (${Math.floor((tiltHoldCounter / tiltThreshold) * 100)}%)`;
              if (tiltHoldCounter >= tiltThreshold) {
                confirmChoice('A');
              }
            } else if (diff < -0.08) {
              // Nghiêng Phải
              tiltHoldCounter++;
              if (progB) progB.style.width = `${Math.min(100, (tiltHoldCounter / tiltThreshold) * 100)}%`;
              if (progA) progA.style.width = '0%';
              statusText.innerText = `👉 Đang chọn: B (${Math.floor((tiltHoldCounter / tiltThreshold) * 100)}%)`;
              if (tiltHoldCounter >= tiltThreshold) {
                confirmChoice('B');
              }
            } else {
              tiltHoldCounter = Math.max(0, tiltHoldCounter - 1);
              if (progA) progA.style.width = '0%';
              if (progB) progB.style.width = '0%';
              statusText.innerText = '🟢 Giữ đầu thẳng';
            }

            animId = requestAnimationFrame(detectLoop);
          };

          animId = requestAnimationFrame(detectLoop);
        })
        .catch(err => {
          console.warn('Không thể mở Webcam, dùng phím bấm thay thế:', err);
          statusText.innerText = '⌨️ Dùng phím ⬅️ Trái / ➡️ Phải';
        });

      arenaEl._cleanupCamera = () => {
        if (animId) cancelAnimationFrame(animId);
        if (streamObj) streamObj.getTracks().forEach(t => t.stop());
      };
    },

    // ------------------------------------------------------------------------
    // 3. GAME: MỤC TỬ BẢO VỆ ĐÀN CHIÊN (DAVID & THE LOST SHEEP)
    // ------------------------------------------------------------------------
    openShepherdRescue: function() {
      SoundFX.playBell();
      let timeLeft = 30;
      let score = 0;
      let gameInterval = null;
      let spawnInterval = null;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-shepherd-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title-wrap">
            <div class="cg-arena-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <div>
              <div class="cg-arena-title">Người Mục Tử Bảo Vệ Đàn Chiên (David Defender)</div>
              <div class="cg-arena-subtitle">Chạm giải cứu chiên con hiền lành 🐑 và xua đuổi sói rừng 🐺</div>
            </div>
          </div>
          <div class="cg-arena-actions">
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>
        </div>

        <div class="cg-arena-body">
          <div class="cg-shepherd-stage" id="cg-shepherd-field">
            <div class="cg-game-hud">
              <div class="cg-hud-card" style="border-color: #38bdf8;">
                <i class="fa-solid fa-stopwatch" style="color: #0284c7;"></i>
                Thời gian: <span id="cg-shepherd-time">30</span>s
              </div>
              <div class="cg-hud-card" style="border-color: #fbbf24;">
                <i class="fa-solid fa-star" style="color: #f59e0b;"></i>
                Điểm: <span id="cg-shepherd-score">0</span>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();
      const field = arenaEl.querySelector('#cg-shepherd-field');
      const timeEl = arenaEl.querySelector('#cg-shepherd-time');
      const scoreEl = arenaEl.querySelector('#cg-shepherd-score');

      function spawnTarget() {
        if (timeLeft <= 0) return;
        const isWolf = Math.random() < 0.35; // 35% sói, 65% chiên
        const target = document.createElement('div');
        target.className = 'cg-spawn-target';

        const x = Math.random() * (field.clientWidth - 140) + 70;
        const y = Math.random() * (field.clientHeight - 180) + 90;
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;

        target.innerHTML = `
          <div class="cg-target-emoji">${isWolf ? '🐺' : '🐑'}</div>
          <div class="cg-target-label" style="background: ${isWolf ? '#dc2626' : '#10b981'};">
            ${isWolf ? 'Xua Đuổi Sói' : 'Cứu Chiên Con'}
          </div>
        `;

        target.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isWolf) {
            score += 15;
            SoundFX.playPop();
          } else {
            score += 10;
            SoundFX.playHarp();
          }
          scoreEl.innerText = score;
          target.remove();
        });

        field.appendChild(target);

        // Tự biến mất sau 1.8 giây nếu không bấm
        setTimeout(() => {
          if (target.parentNode) target.remove();
        }, 1800);
      }

      spawnInterval = setInterval(spawnTarget, 700);

      gameInterval = setInterval(() => {
        timeLeft--;
        timeEl.innerText = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          clearInterval(spawnInterval);
          SoundFX.playTrumpet();
          fireConfetti();
          window.CatechismGames.showWinnerModal(
            `🕊️ TẠ ƠN CHÚA ĐÃ HOÀN THÀNH! 🕊️`,
            `Cậu bé Đa-vít đã bảo vệ đàn chiên an toàn với tổng điểm: <strong>${score} điểm</strong>!<br><span style="color: #fbbf24;">"Chúa là mục tử chăn dắt tôi, tôi chẳng thiếu thốn gì!" (Tv 23)</span>`
          );
        }
      }, 1000);

      arenaEl._cleanupShepherd = () => {
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
      };
    },

    // ------------------------------------------------------------------------
    // 4. GAME: GIẢI MÃ CẶP ĐÔI KINH THÁNH (BIBLE MEMORY PAIRS)
    // ------------------------------------------------------------------------
    openBibleMemoryPairs: function() {
      SoundFX.playBell();
      const allCards = (window.BIBLE_GAME_DATA && window.BIBLE_GAME_DATA.memoryCards) || [];
      // Lấy 8 thẻ và nhân đôi tạo 16 thẻ
      const chosen = allCards.slice(0, 8);
      let deck = [...chosen, ...chosen].map((c, i) => ({ ...c, uniqueId: i }));
      // Shuffle
      deck.sort(() => Math.random() - 0.5);

      let flippedCards = [];
      let matchedCount = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-memory-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title-wrap">
            <div class="cg-arena-icon"><i class="fa-solid fa-clone"></i></div>
            <div>
              <div class="cg-arena-title">Giải Mã Cặp Đôi Kinh Thánh (Chibi Memory)</div>
              <div class="cg-arena-subtitle">Lật tìm các cặp thẻ bài Công Giáo & mở khóa Lời Chúa</div>
            </div>
          </div>
          <div class="cg-arena-actions">
            <div style="color: #b45309; font-weight: 800; font-size: 1rem; margin-right: 15px;" id="cg-mem-matched-text">
              <i class="fa-solid fa-check-double" style="color: #10b981;"></i> Đã ghép: 0 / 8 cặp
            </div>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>
        </div>

        <div class="cg-arena-body">
          <div class="cg-memory-stage">
            <div class="cg-memory-grid" id="cg-memory-cards-grid">
              ${deck.map((card, idx) => `
                <div class="cg-memory-card-wrap" data-card-id="${card.id}" data-uid="${card.uniqueId}" onclick="window.CatechismGames.flipMemoryCard(this)">
                  <div class="cg-memory-card-inner">
                    <div class="cg-memory-card-front">
                      <i class="fa-solid fa-cross"></i>
                    </div>
                    <div class="cg-memory-card-back">
                      <i class="fa-solid ${card.icon}" style="font-size: 2.2rem; color: ${card.color}; margin-bottom: 6px;"></i>
                      <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${card.name}</div>
                      <div style="font-size: 0.68rem; color: #64748b;">${card.title}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();

      window.CatechismGames.flipMemoryCard = function(cardEl) {
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched') || flippedCards.length >= 2) {
          return;
        }

        SoundFX.playPop();
        cardEl.classList.add('flipped');
        flippedCards.push(cardEl);

        if (flippedCards.length === 2) {
          const [c1, c2] = flippedCards;
          const id1 = c1.getAttribute('data-card-id');
          const id2 = c2.getAttribute('data-card-id');

          if (id1 === id2) {
            matchedCount++;
            SoundFX.playHarp();
            c1.classList.add('matched');
            c2.classList.add('matched');
            flippedCards = [];
            arenaEl.querySelector('#cg-mem-matched-text').innerHTML = `<i class="fa-solid fa-check-double"></i> Đã ghép: ${matchedCount} / 8 cặp`;

            if (matchedCount === 8) {
              SoundFX.playTrumpet();
              fireConfetti();
              setTimeout(() => {
                window.CatechismGames.showWinnerModal(
                  `🌟 TUYỆT VỜI! MỞ KHÓA TOÀN BỘ LỜI CHÚA! 🌟`,
                  `Em đã ghi nhớ chính xác tất cả 8 cặp nhân vật và biểu tượng Kinh Thánh!<br><span style="color: #fbbf24;">"Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi!" (Tv 119, 105)</span>`
                );
              }, 500);
            }
          } else {
            setTimeout(() => {
              c1.classList.remove('flipped');
              c2.classList.remove('flipped');
              flippedCards = [];
            }, 900);
          }
        }
      };
    },

    // ------------------------------------------------------------------------
    // UTILITY: SHOW WINNER MODAL & CLOSE ARENA
    // ------------------------------------------------------------------------
    showWinnerModal: function(title, desc) {
      const modal = document.createElement('div');
      modal.className = 'cg-win-modal';
      modal.innerHTML = `
        <div style="font-size: 3.5rem; margin-bottom: 10px;">🏆</div>
        <h2 style="font-size: 1.65rem; font-weight: 900; color: #b45309; margin-bottom: 0.8rem;">${title}</h2>
        <div style="font-size: 1.1rem; color: #1e293b; line-height: 1.6; margin-bottom: 1.8rem; font-weight: 600;">${desc}</div>
        <button class="cg-btn-play" style="padding: 12px 36px; font-size: 1.05rem; margin: 0 auto; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; border-radius: 999px; font-weight: 800; border: none; box-shadow: 0 4px 16px rgba(37,99,235,0.4);" onclick="this.parentElement.remove()">
          <i class="fa-solid fa-check" style="margin-right: 8px;"></i> ĐỒNG Ý
        </button>
      `;
      document.body.appendChild(modal);
    },

    // ------------------------------------------------------------------------
    // 5. MODAL: 73 BIBLE BOOKS EXPLORER & SCRIPTURE DETAILS
    // ------------------------------------------------------------------------
    _currentTestamentFilter: 'all',
    _currentGroupFilter: 'all',

    setTestamentFilter: function(testament, btn) {
      this._currentTestamentFilter = testament;
      this._currentGroupFilter = 'all';
      document.querySelectorAll('#cg-bible-filter-pills .cg-bible-pill').forEach(p => p.classList.remove('active'));
      if (btn) btn.classList.add('active');
      this.filterBibleBooks();
    },

    setGroupFilter: function(group, btn) {
      this._currentGroupFilter = group;
      this._currentTestamentFilter = 'all';
      document.querySelectorAll('#cg-bible-filter-pills .cg-bible-pill').forEach(p => p.classList.remove('active'));
      if (btn) btn.classList.add('active');
      this.filterBibleBooks();
    },

    clearBibleSearch: function() {
      const input = document.getElementById('cg-bible-search-input');
      if (input) input.value = '';
      this._currentTestamentFilter = 'all';
      this._currentGroupFilter = 'all';
      document.querySelectorAll('#cg-bible-filter-pills .cg-bible-pill').forEach(p => {
        if (p.getAttribute('data-filter-val') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      this.filterBibleBooks();
    },

    filterBibleBooks: function() {
      const input = document.getElementById('cg-bible-search-input');
      const query = (input ? input.value : '').trim().toLowerCase();
      const cards = document.querySelectorAll('#cg-books-cards-grid .cg-book-card');
      const noResEl = document.getElementById('cg-bible-no-results');
      let visibleCount = 0;

      cards.forEach(card => {
        const id = card.getAttribute('data-id') || '';
        const name = card.getAttribute('data-name') || '';
        const abbr = card.getAttribute('data-abbr') || '';
        const testament = card.getAttribute('data-testament') || '';
        const group = (card.getAttribute('data-group') || '').toLowerCase();

        let matchesFilter = true;
        if (this._currentTestamentFilter && this._currentTestamentFilter !== 'all') {
          if (testament !== this._currentTestamentFilter) matchesFilter = false;
        }
        if (this._currentGroupFilter && this._currentGroupFilter !== 'all') {
          if (group !== this._currentGroupFilter.toLowerCase()) matchesFilter = false;
        }

        let matchesQuery = true;
        if (query) {
          matchesQuery = id.includes(query) || name.includes(query) || abbr.includes(query) || group.includes(query);
        }

        if (matchesFilter && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResEl) {
        noResEl.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    },

    openBookDetails: function(bookId) {
      SoundFX.playClick();
      const data = window.BIBLE_GAME_DATA || {};
      const books = data.books || [];
      const bookIndex = books.findIndex(b => b.id === bookId);
      if (bookIndex === -1) return;
      const book = books[bookIndex];
      const prevBook = bookIndex > 0 ? books[bookIndex - 1] : null;
      const nextBook = bookIndex < books.length - 1 ? books[bookIndex + 1] : null;

      // Remove existing modal if any
      const existing = document.getElementById('cg-book-detail-modal');
      if (existing) existing.remove();

      const modalEl = document.createElement('div');
      modalEl.className = 'cg-book-modal-backdrop';
      modalEl.id = 'cg-book-detail-modal';

      // Generate chapters
      const chapsHtml = Array.from({ length: book.chapters }, (_, i) => i + 1)
        .map(chapNum => `
          <button type="button" 
                  class="cg-chap-chip ${chapNum === 1 ? 'active' : ''}" 
                  id="cg-chap-chip-${chapNum}"
                  onclick="window.CatechismGames.openChapterReader('${book.id}', ${chapNum})" 
                  title="Bấm vào để mở đọc Chương ${chapNum}">
            ${chapNum}
          </button>
        `)
        .join('');

      modalEl.innerHTML = `
        <div class="cg-book-modal-card" onclick="event.stopPropagation()">
          <div class="cg-book-modal-header">
            <button class="cg-modal-close-btn" onclick="document.getElementById('cg-book-detail-modal')?.remove()" title="Đóng (ESC)">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="cg-book-modal-badges">
              <span class="cg-badge-testament ${book.testament}">${book.testament === 'new' ? 'Tân Ước' : 'Cựu Ước'}</span>
              <span class="cg-badge-group"><i class="fa-solid fa-bookmark"></i> Nhóm: ${book.group}</span>
              <span class="cg-badge-group"><i class="fa-solid fa-list-ol"></i> ${book.chapters} Chương</span>
            </div>
            <h2 class="cg-book-modal-title">
              <i class="fa-solid ${book.icon || 'fa-book-bible'}" style="color: #fef08a; margin-right: 8px;"></i>
              Sách ${book.name} (${book.abbr})
            </h2>
            <div class="cg-book-modal-meta">
              Sách thứ ${bookIndex + 1} trong 73 Sách Kinh Thánh Công Giáo • Tác giả: <strong>${book.author || 'Truyền thống'}</strong>
            </div>
          </div>

          <div class="cg-book-modal-body">
            <div class="cg-book-info-card">
              <div class="cg-book-info-label"><i class="fa-solid fa-lightbulb" style="color: #f59e0b;"></i> Chủ Đề Then Chốt</div>
              <div class="cg-book-info-val" style="font-weight: 700; color: #1e3a8a;">${book.theme || 'Đang cập nhật'}</div>
            </div>

            <div class="cg-book-info-card">
              <div class="cg-book-info-label"><i class="fa-solid fa-book-open" style="color: #2563eb;"></i> Tóm Lược Nội Dung Sách</div>
              <div class="cg-book-info-val">${book.summary || 'Đang cập nhật'}</div>
            </div>

            <div class="cg-book-golden-box">
              <div class="cg-book-info-label" style="color: #92400e;">
                <i class="fa-solid fa-quote-left"></i> Câu Lời Chúa Nổi Bật (Kim Ngôn Vàng)
              </div>
              <div class="cg-book-golden-text">
                "${book.goldenVerse || 'Đang cập nhật'}"
              </div>
              <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                <button type="button" class="cg-btn-book-nav" style="padding: 6px 16px; font-size: 0.85rem;" onclick="window.CatechismGames.copyVerse('${encodeURIComponent(book.goldenVerse || '')}')">
                  <i class="fa-solid fa-copy"></i> Sao chép Lời Chúa
                </button>
              </div>
            </div>

            <div class="cg-book-chaps-wrapper">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                <div class="cg-book-info-label" style="margin-bottom: 0;">
                  <i class="fa-solid fa-list-check" style="color: #10b981;"></i> Tra Cứu Các Chương (${book.chapters} Chương)
                </div>
                <small style="color: #0284c7; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">
                  <i class="fa-solid fa-hand-pointer"></i> Bấm vào số chương để mở đọc ngay
                </small>
              </div>
              <div class="cg-book-chaps-grid">
                ${chapsHtml}
              </div>

              <!-- SELECTED CHAPTER ACTION BAR -->
              <div class="cg-selected-chap-box" id="cg-selected-chap-box">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <i class="fa-solid fa-book-bookmark" style="color: #0284c7; font-size: 1.4rem;"></i>
                  <div>
                    <div style="font-weight: 800; color: #1e3a8a; font-size: 1.05rem;" id="cg-selected-chap-title">
                      Sách ${book.name} - Chương 1 / ${book.chapters}
                    </div>
                    <div style="font-size: 0.82rem; color: #64748b;">
                      Bản dịch Kinh Thánh NPD-CGKPV • Bấm vào để đọc chi tiết
                    </div>
                  </div>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                  <button type="button" class="cg-btn-book-nav" onclick="window.CatechismGames.copyChapterRef('${book.abbr}', 1)" id="cg-btn-copy-chap" style="padding: 8px 16px; font-size: 0.88rem;">
                    <i class="fa-solid fa-copy"></i> Sao chép (${book.abbr} 1)
                  </button>
                  <button type="button" class="cg-btn-read-chap" onclick="window.CatechismGames.openChapterReader('${book.id}', 1)" id="cg-btn-read-chap" title="Mở đọc Chương 1">
                    <i class="fa-solid fa-book-open-reader"></i> Đọc Chương 1 Ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="cg-book-modal-footer">
            ${prevBook ? `
              <button class="cg-btn-book-nav" onclick="window.CatechismGames.openBookDetails('${prevBook.id}')" title="Sách trước">
                <i class="fa-solid fa-chevron-left"></i> ${prevBook.name} (${prevBook.abbr})
              </button>
            ` : '<div></div>'}

            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <a href="https://ktcgkpv.org/bible" target="_blank" rel="noopener" class="cg-btn-book-read" title="Mở trang Kinh Thánh CGKPV">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Đọc Toàn Bộ Kinh Thánh CGKPV
              </a>
              <button class="cg-arena-btn-exit" style="padding: 8px 20px; font-size: 0.88rem;" onclick="document.getElementById('cg-book-detail-modal')?.remove()">
                <i class="fa-solid fa-xmark"></i> Đóng
              </button>
            </div>

            ${nextBook ? `
              <button class="cg-btn-book-nav" onclick="window.CatechismGames.openBookDetails('${nextBook.id}')" title="Sách tiếp theo">
                ${nextBook.name} (${nextBook.abbr}) <i class="fa-solid fa-chevron-right"></i>
              </button>
            ` : '<div></div>'}
          </div>
        </div>
      `;

      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) modalEl.remove();
      });

      document.body.appendChild(modalEl);
    },

    readerFontSize: 16,

    changeReaderFontSize: function(delta) {
      this.readerFontSize = Math.min(24, Math.max(13, this.readerFontSize + delta));
      const textEls = document.querySelectorAll('.cg-reader-passage-text, .cg-reader-sec-desc, .cg-reader-verse-text');
      textEls.forEach(el => {
        el.style.fontSize = this.readerFontSize + 'px';
      });
      const ind = document.getElementById('cg-reader-font-indicator');
      if (ind) ind.innerText = this.readerFontSize + 'px';
    },

    getBibleChapterDetails: function(book, chapNum) {
      const bookId = book.id;
      const total = book.chapters;

      // KHO DỮ LIỆU ĐẶC BIỆT CỦA CÁC CHƯƠNG KINH THÁNH CÔNG GIÁO TIÊU BIỂU
      const specialChapters = {
        'st': {
          1: {
            title: "Khởi Nguyên Vũ Trụ & Công Trình Sáng Tạo 6 Ngày",
            verse: "Lúc khởi đầu, Thiên Chúa sáng tạo trời đất... Thiên Chúa thấy mọi sự Người đã làm ra quả là rất tốt đẹp. (St 1, 1.31)",
            sections: [
              { range: "St 1, 1-5", title: "Ngày thứ nhất: Ánh sáng bừng nở", desc: "Thiên Chúa phán: 'Phải có ánh sáng', liền có ánh sáng. Chúa tách ánh sáng khỏi bóng tối và gọi ánh sáng là Ngày, tối là Đêm." },
              { range: "St 1, 6-13", title: "Ngày 2 & 3: Vòm trời, đại dương và đất liền xanh tươi", desc: "Thiên Chúa tạo lập vòm trời, gom tụ nước dưới trời vào một chỗ để lộ đất khô, khiến đất trổ sinh cây cỏ hạt giống và cây ăn trái xanh tươi trù phú." },
              { range: "St 1, 14-25", title: "Ngày 4 & 5: Tinh tú rực rỡ, chim trời và cá biển", desc: "Đặt vầng thái dương soi ban ngày, mặt trăng và muôn tinh tú điều khiển ban đêm; sinh sôi vô vàn loài thủy tộc dưới lòng đại dương và chim muông lượn bay trên vòm trời." },
              { range: "St 1, 26-31", title: "Ngày thứ sáu: Tạo dựng con người theo hình ảnh Thiên Chúa", desc: "Đỉnh cao tuyệt mỹ của công trình sáng tạo: 'Chúng ta hãy dựng nên con người theo hình ảnh Chúng Ta'. Thiên Chúa trao cho loài người sứ mạng làm chủ và canh tác thế giới trong yêu thương." }
            ],
            meditation: "Mỗi ngày thức dậy, em nhận ra sự sống và thiên nhiên là quà tặng vô giá của Thiên Chúa. Em quyết tâm gìn giữ môi trường sạch đẹp và tạ ơn Chúa vì công trình kỳ diệu của Người."
          },
          2: {
            title: "Vườn Địa Đàng Ê-đen & Ơn Gọi Hôn Nhân Gia Đình",
            verse: "Đức Chúa là Thiên Chúa lấy bụi từ đất nặn ra con người, thổi sinh khí vào lỗ mũi, và con người trở nên một sinh linh. (St 2, 7)",
            sections: [
              { range: "St 2, 1-3", title: "Ngày Sa-bát: Thiên Chúa nghỉ ngơi và thánh hóa", desc: "Sau khi hoàn tất công trình tạo dựng, Thiên Chúa nghỉ ngơi và thánh hóa ngày thứ bảy, làm khuôn mẫu cho ngày nghỉ dâng kính Chúa." },
              { range: "St 2, 4-17", title: "Đặt con người trong vườn Ê-đen trù phú", desc: "Thiên Chúa trồng vườn Ê-đen có Cây Sự Sống và Cây Biết Thiện Ác, trao cho con người canh tác và gìn giữ với lòng tự do yêu thương và vâng phục." },
              { range: "St 2, 18-25", title: "Tạo dựng người nữ & Bí tích Hôn Nhân nguyên thủy", desc: "Thiên Chúa rút xương sườn người nam nặn nên người nữ làm người trợ tá tương xứng. A-đam mừng rỡ thốt lên: 'Đây là xương bởi xương tôi, thịt bởi thịt tôi! Cả hai trở nên một thân thể'." }
            ],
            meditation: "Sự sống con người đến từ hơi thở của Thiên Chúa. Chúng ta được dựng nên để sống yêu thương hiệp nhất, biết tôn trọng thân xác và chia sẻ ngọt bùi với những người thân yêu trong gia đình."
          },
          3: {
            title: "Cám Dỗ, Sự Sa Ngã & Lời Hứa Cứu Chuộc (Tiền Tin Mừng)",
            verse: "Ta sẽ gây mối thù giữa mi và người đàn bà, giữa dòng giống mi và dòng giống người ấy; dòng giống người ấy sẽ đạp giập đầu mi. (St 3, 15)",
            sections: [
              { range: "St 3, 1-7", title: "Con rắn xảo quyệt và sự bất tuân nguyên tổ", desc: "Con rắn gieo nghi ngờ vào tình yêu của Chúa, cám dỗ E-và và A-đam ăn trái cấm để 'được bằng Thiên Chúa'. Đôi mắt họ mở ra và thấy mình trần truồng." },
              { range: "St 3, 8-13", title: "Tiếng gọi của Thiên Chúa: 'Ngươi ở đâu?'", desc: "Con người trốn tránh nhan Thiên Chúa trong bụi cây, xấu hổ và bắt đầu đổ lỗi cho nhau thay vì thật lòng sám hối." },
              { range: "St 3, 14-24", title: "Án phạt và Lời Hứa Đấng Cứu Thế (Tiền Tin Mừng)", desc: "Thiên Chúa tuyên án con rắn và loan báo dòng giống Người Nữ (Đức Maria & Đức Kitô) sẽ chiến thắng ma quỷ. Người mặc áo da che thân cho con người trước khi họ rời khỏi vườn Ê-đen." }
            ],
            meditation: "Tội lỗi khiến chúng ta xa cách Thiên Chúa và làm rạn nứt tình yêu với người khác. Nhưng tình yêu Thiên Chúa không bao giờ bỏ rơi; Người luôn sẵn lòng tha thứ và ban Đức Giê-su để cứu chuộc chúng ta."
          },
          12: {
            title: "Ơn Gọi Của Tổ Phụ Áp-ra-ham - Khởi Đầu Dân Giao Ước",
            verse: "Đức Chúa phán với ông Áp-ram: Hãy rời bỏ quê hương, họ hàng và nhà cha ngươi, mà đi đến xứ sở Ta sẽ chỉ cho ngươi! (St 12, 1)",
            sections: [
              { range: "St 12, 1-4", title: "Tiếng gọi lên đường từ bỏ quê cha đất tổ", desc: "Ông Áp-ram 75 tuổi một lòng tin tưởng vâng phục Thiên Chúa, dắt vợ là Xa-rai cùng cháu Lót ra đi đến đất Ca-na-an mà không hề ngần ngại." },
              { range: "St 12, 5-9", title: "Xây dựng bàn thờ ngợi khen Chúa tại Đất Hứa", desc: "Đến Si-khem và Bết-en, ông Áp-ram dựng lều và lập bàn thờ phụng sự Thiên Chúa, Đấng đã hiện ra đồng hành cùng ông." }
            ],
            meditation: "Đức tin là sự can đảm dấn thân vâng theo tiếng Chúa dẫn đường dù phía trước còn nhiều thử thách."
          },
          22: {
            title: "Thử Thách Hiến Tế I-xa-ác Trên Núi Mô-ri-gia",
            verse: "Áp-ra-ham thưa: 'Có con đây!' Sứ thần phán: 'Đừng giơ tay hại đứa trẻ, vì giờ đây Ta biết ngươi là kẻ kính sợ Thiên Chúa!' (St 22, 11-12)",
            sections: [
              { range: "St 22, 1-10", title: "Hành trình hiến tế đứa con duy nhất", desc: "Thiên Chúa thử lòng Áp-ra-ham. Ông vác củi cùng con trai I-xa-ác lên núi Mô-ri-gia, trọn vẹn phó thác mà không một lời kêu trách." },
              { range: "St 22, 11-19", title: "Thiên Chúa giải cứu và chúc phúc muôn ngàn đời", desc: "Sứ thần Chúa ngăn tay Áp-ra-ham lại, Chúa chu cấp một con cừu đực thay thế và chúc phúc cho hậu duệ ông đông đúc như sao trên trời." }
            ],
            meditation: "Hình ảnh con chiên hiến tế thay cho I-xa-ác là hình ảnh tiên báo Chiên Thiên Chúa - Chúa Giê-su chịu chết trên Thập Giá để cứu rỗi nhân loại."
          }
        },
        'xh': {
          3: {
            title: "Bụi Gai Rực Cháy & Mặc Khải Thánh Danh YAHWEH",
            verse: "Thiên Chúa phán với ông Môi-sê: 'Ta là Đấng Hiện Hữu'. Hãy nói với con cái Ít-ra-en: Đấng Hiện Hữu sai tôi đến với anh em! (Xh 3, 14)",
            sections: [
              { range: "Xh 3, 1-6", title: "Ngọn lửa trong bụi gai trên núi Khô-rếp", desc: "Môi-sê chăn chiên nơi hoang địa thì thấy bụi gai bốc cháy mà không bị thiêu rụi. Tiếng Chúa phán: 'Cởi dép ra, vì nơi ngươi đang đứng là đất thánh!'" },
              { range: "Xh 3, 7-15", title: "Sứ mạng giải thoát dân Do Thái và Thánh Danh", desc: "Chúa nghe tiếng kêu than của dân bên Ai Cập, sai Môi-sê đi diện kiến Pha-ra-ôn và mặc khải Thánh Danh muôn đời: 'Ta là Đấng Tự Hữu - YAHWEH'." }
            ],
            meditation: "Thiên Chúa luôn thấu suốt những đau khổ và nỗi buồn của chúng ta. Khi ta biết khiêm nhường lắng nghe tiếng Chúa, Người sẽ trao ban sức mạnh để ta vượt qua mọi trở ngại."
          },
          14: {
            title: "Cuộc Vượt Qua Biển Đỏ Thần Kỳ",
            verse: "Môi-sê giơ tay trên mặt biển, Đức Chúa cho một luồng gió đông mạnh mẽ thổi suốt đêm làm nước rẽ ra đôi bên... Dân Ít-ra-en đi ráo chân giữa lòng biển! (Xh 14, 21-22)",
            sections: [
              { range: "Xh 14, 1-14", title: "Tiến thoái lưỡng nan trước Biển Đỏ", desc: "Phía trước là biển sâu mịt mù, phía sau là chiến xa quân Ai Cập đuổi riết. Môi-sê nói với dân: 'Đừng sợ! Hãy đứng vững mà xem ơn cứu độ của Đức Chúa!'" },
              { range: "Xh 14, 15-31", title: "Nước rẽ đôi mở đường giải thoát", desc: "Môi-sê giơ gậy, biển tách ra làm hai tường nước che chắn hai bên. Toàn dân vượt qua an toàn, còn đạo quân Pha-ra-ôn đuổi theo bị nước vùi lấp." }
            ],
            meditation: "Biển Đỏ là hình bóng tiên báo Bí tích Rửa Tội: dòng nước thanh tẩy quét sạch ách nô lệ tội lỗi và đưa chúng ta vào đời sống mới tự do của con cái Chúa."
          },
          20: {
            title: "Mười Điều Răn (Thập Giới) Trên Núi Si-nai",
            verse: "Thiên Chúa phán tất cả những lời này: Ngươi hãy kính sợ Thiên Chúa... Thảo kính cha mẹ... Ngươi không được giết người, trộm cắp, nói chứng gian... (Xh 20, 1-17)",
            sections: [
              { range: "Xh 20, 1-11", title: "Bổn phận yêu mến Thiên Chúa (Điều răn 1 đến 3)", desc: "Thờ phượng một mình Chúa duy nhất; không lạm dụng Danh Thánh Chúa; thánh hóa ngày Chúa Nhật để ngơi nghỉ và chúc tụng." },
              { range: "Xh 20, 12-17", title: "Bổn phận yêu thương đồng loại (Điều răn 4 đến 10)", desc: "Thảo kính cha mẹ; bảo vệ sự sống; tôn trọng phẩm giá và sự trong sạch; trung thực không gian dối; không tham lam của người." }
            ],
            meditation: "Mười Điều Răn không phải là sự gò bó, mà là hàng rào bảo vệ yêu thương như đèn hiệu dẫn ta đến bến bờ bình an, hạnh phúc và ơn cứu độ đời đời."
          }
        },
        'mt': {
          5: {
            title: "Bài Giảng Trên Núi - Tám Mối Phúc Thật & Muối Men Trần Gian",
            verse: "Phúc thay ai có tâm hồn nghèo khó, vì Nước Trời là của họ... Chính anh em là ánh sáng cho trần gian! (Mt 5, 3.14)",
            sections: [
              { range: "Mt 5, 1-12", title: "Hiến chương Nước Trời: Tám Mối Phúc Thật", desc: "Chúa Giê-su lên núi khai mở con đường hạnh phúc đích thực: nghèo khó tâm hồn, hiền lành, sầu khổ, khát khao công chính, xót thương người, trong sạch, xây dựng hòa bình, chịu bách hại vì Chúa." },
              { range: "Mt 5, 13-16", title: "Muối cho đời & Ánh sáng cho trần gian", desc: "Ánh sáng của các môn đệ phải tỏa chiếu trước mặt mọi người, để thiên hạ thấy những việc tốt lành anh em làm mà tôn vinh Cha trên trời." },
              { range: "Mt 5, 17-48", title: "Kiện toàn Lề Luật trong Tình Yêu", desc: "Chúa Giê-su nâng luật đạo đức lên mức cao cả: không giận ghét anh em, tha thứ tận căn và yêu thương cả kẻ thù." }
            ],
            meditation: "Sống tinh thần Tám Mối Phúc là trở thành một thiếu nhi hiền hòa, biết chia sẻ đồ chơi, không giận dỗi bạn bè và luôn giữ tâm hồn trong sạch trước nhan Chúa."
          },
          6: {
            title: "Cầu Nguyện, Kinh Lạy Cha & Phó Thác Trong Tay Chúa",
            verse: "Lạy Cha chúng con ở trên trời, chúng con nguyện danh Cha cả sáng, Nước Cha trị đến, ý Cha thể hiện dưới đất cũng như trên trời... (Mt 6, 9-10)",
            sections: [
              { range: "Mt 6, 1-8", title: "Việc lành kín đáo: Bố thí và cầu nguyện chân thật", desc: "Khi làm việc thiện hoặc cầu nguyện, hãy làm cách kín đáo trong phòng riêng để Cha trên trời thấu suốt kín đáo sẽ trả công cho con." },
              { range: "Mt 6, 9-15", title: "Chúa Giê-su dạy Kinh Lạy Cha tuyệt mỹ", desc: "Kinh nguyện tuyệt hảo nhất của Kitô giáo, hướng lòng chúc tụng Chúa Cha, xin cơm bánh hằng ngày, xin ơn tha thứ và giải thoát khỏi sự dữ." },
              { range: "Mt 6, 25-34", title: "Hãy ngắm xem hoa huệ ngoài đồng & Chim trời", desc: "Đừng lo lắng áy náy về ngày mai: chim trời không gieo không gặt mà Cha trên trời vẫn nuôi, hoa huệ không kéo sợi mà còn đẹp hơn vua Sa-lô-môn." }
            ],
            meditation: "Mỗi khi đọc Kinh Lạy Cha, em nhắc nhở mình là con ngoan của Chúa Cha nhân lành, luôn biết tin tưởng phó thác mọi âu lo vào vòng tay yêu thương của Người."
          },
          28: {
            title: "Chúa Kitô Phục Sinh & Sứ Mạng Truyền Giáo Toàn Cầu",
            verse: "Thầy đã được trao toàn quyền trên trời dưới đất. Vậy anh em hãy đi và làm cho muôn dân trở thành môn đệ... Và đây, Thầy ở cùng anh em mọi ngày cho đến tận thế! (Mt 28, 18-20)",
            sections: [
              { range: "Mt 28, 1-10", title: "Ngôi Mộ Trống và Sứ điệp Phục Sinh", desc: "Bà Ma-ri-a Mác-đa-la và một bà khác ra thăm mộ thì đất rung chuyển, thiên thần lăn tảng đá báo tin: 'Người đã trỗi dậy từ cõi chết!'." },
              { range: "Mt 28, 16-20", title: "Lệnh truyền vĩ đại trên núi miền Ga-li-lê", desc: "Chúa Giê-su hiện ra trao sứ mạng rửa tội muôn dân nhân danh Chúa Cha, Chúa Con và Chúa Thánh Thần, kèm lời hứa đồng hành muôn đời." }
            ],
            meditation: "Chúa Giê-su đã chiến thắng cái chết và tội lỗi! Người đang sống và luôn ở bên cạnh chúng ta trong từng giây phút cuộc đời qua Bí tích Thánh Thể."
          }
        },
        'ga': {
          1: {
            title: "Khúc Ca Ngôi Lời Nhập Thể Tuyệt Đỉnh",
            verse: "Lúc khởi đầu đã có Ngôi Lời, và Ngôi Lời là Thiên Chúa... Ngôi Lời đã trở nên người phàm và cư ngụ giữa chúng ta! (Ga 1, 1.14)",
            sections: [
              { range: "Ga 1, 1-5", title: "Ngôi Lời Hằng Hữu & Ánh Sáng Thật", desc: "Từ trước muôn đời Ngôi Lời đã hiện hữu cùng Chúa Cha; sự sống trong Người là ánh sáng chiếu soi bóng tối và bóng tối không thể dập tắt được ánh sáng." },
              { range: "Ga 1, 6-18", title: "Mầu nhiệm Nhập Thể cứu độ loài người", desc: "Ngôi Lời đã làm người, đầy tràn ân sủng và chân lý. Nhờ Người, chúng ta được trở nên con cái Thiên Chúa." },
              { range: "Ga 1, 19-34", title: "Chứng từ của Gio-an: 'Đây Chiên Thiên Chúa!'", desc: "Gio-an Tẩy Giả chỉ cho hai môn đệ thấy Chúa Giê-su: 'Đây là Chiên Thiên Chúa, Đấng xóa bỏ tội trần gian'." }
            ],
            meditation: "Mầu nhiệm Giáng Sinh nhắc nhở chúng ta: Thiên Chúa quyền năng cao cả đã trở nên một Hài Nhi bé nhỏ vì yêu thương chúng ta vô hạn."
          },
          3: {
            title: "Đối Thoại Với Ni-cô-đê-mô & Tình Yêu Cứu Thế Vĩ Đại",
            verse: "Thiên Chúa yêu thế gian đến nỗi đã ban Con Một, để ai tin vào Con của Người thì khỏi phải chết, nhưng được sống muôn đời. (Ga 3, 16)",
            sections: [
              { range: "Ga 3, 1-12", title: "Sinh lại bởi Nước và Thần Khí", desc: "Chúa Giê-su dạy cho ông Ni-cô-đê-mô về sự tái sinh thiêng liêng để được vào Nước Thiên Chúa qua Bí tích Rửa Tội." },
              { range: "Ga 3, 13-21", title: "Con Người phải được giương cao trên Thập Giá", desc: "Như con rắn đồng xưa trong sa mạc, Con Người phải chịu treo lên Thập Giá để ai ngước nhìn và tin vào Người sẽ được cứu thoát." }
            ],
            meditation: "Câu Kinh Thánh Ga 3, 16 là 'Trái Tim của Toàn Bộ Kinh Thánh'. Hãy ghi khắc trong tim: Chúa yêu thương em đến mức hy sinh mạng sống vì em."
          },
          15: {
            title: "Cây Nho & Cành Nho - Giới Răn Yêu Thương Tuyệt Đối",
            verse: "Thầy là cây nho, anh em là cành. Ai ở lại trong Thầy và Thầy ở lại trong người ấy, thì người ấy sinh nhiều hoa trái. Không có Thầy, anh em chẳng làm gì được! (Ga 15, 5)",
            sections: [
              { range: "Ga 15, 1-8", title: "Hiệp thông mật thiết như cành gắn liền thân nho", desc: "Cành nho tự nó không thể sinh hoa trái nếu không gắn liền với cây nho; chúng ta cần kết hiệp với Chúa qua cầu nguyện và rước lễ." },
              { range: "Ga 15, 9-17", title: "Không có tình thương nào cao cả hơn tình thương hiến mạng", desc: "Thầy gọi anh em là bạn hữu; điều răn của Thầy là anh em hãy yêu thương nhau như Thầy đã yêu thương anh em." }
            ],
            meditation: "Để trổ sinh những hoa trái bác ái, nụ cười và sự ngoan ngoãn, em cần gắn kết với Chúa Giê-su mỗi ngày qua việc tham dự Thánh Lễ và siêng năng cầu nguyện."
          }
        },
        'tv': {
          23: {
            title: "Chúa Là Mục Tử Nhân Lành Chăn Dắt Tôi",
            verse: "Chúa là mục tử chăn dắt tôi, tôi chẳng thiếu thốn gì. Trong đồng cỏ xanh tươi, Người cho tôi nằm nghỉ. (Tv 23, 1-2)",
            sections: [
              { range: "Tv 23, 1-3", title: "Đồng cỏ xanh tươi và dòng suối an bình", desc: "Vị Mục Tử dẫn dắt linh hồn tôi đến những nguồn suối mát lành, hồi phục tâm thần và chỉ đường ngay nẻo chính." },
              { range: "Tv 23, 4-6", title: "Dầu qua lũng tối, con chẳng sợ chi", desc: "Vì Chúa ở cùng con, cây roi và chiếc gậy của Người làm con an dạ; lòng nhân hậu và tình thương Chúa sẽ theo con suốt cả cuộc đời." }
            ],
            meditation: "Chúa Giê-su là Mục Tử tốt lành luôn bảo bọc gìn giữ em. Dù gặp lúc buồn bã hay lo sợ, em luôn có Chúa kề bên ủi an vỗ về."
          },
          119: {
            title: "Bài Ca Ca Tụng Lời Chúa & Giới Răn Thánh",
            verse: "Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi. (Tv 119, 105)",
            sections: [
              { range: "Tv 119, 1-8", title: "Phúc cho ai tuân giữ Luật Chúa", desc: "Hạnh phúc đích thực thuộc về người đi theo đường lối của Thiên Chúa với trọn vẹn con tim chân thành." },
              { range: "Tv 119, 97-105", title: "Lời Chúa ngọt ngào hơn mật ong", desc: "Luật pháp Chúa làm cho người khiêm tốn trở nên khôn ngoan, dẫn lối đôi chân giữa đêm tối trần gian." }
            ],
            meditation: "Đọc Kinh Thánh mỗi ngày giúp tâm hồn em sáng tỏ, biết chọn điều thiện, tránh điều xấu và luôn sống đẹp lòng Cha trên trời."
          }
        }
      };

      // Check if specific custom detail exists
      if (specialChapters[bookId] && specialChapters[bookId][chapNum]) {
        const item = specialChapters[bookId][chapNum];
        return {
          bookName: book.name,
          bookAbbr: book.abbr,
          bookId: book.id,
          testament: book.testament,
          group: book.group,
          chapNum: chapNum,
          totalChaps: total,
          theme: item.title,
          keyVerse: item.verse,
          sections: item.sections,
          meditation: item.meditation,
          onlineUrl: `https://ktcgkpv.org/bible?version=${encodeURIComponent(book.abbr)}&chapter=${chapNum}`,
          searchUrl: `https://www.google.com/search?q=Kinh+Thanh+Cong+Giao+KTCGKPV+${encodeURIComponent(book.name)}+chuong+${chapNum}`
        };
      }

      // NẾU CHƯA CÓ TRONG KHO CHI TIẾT TỪNG CHƯƠNG, TỰ ĐỘNG SINH NỘI DUNG CHUẨN XÁC THEO SÁCH
      const bookTheme = book.theme || "Sứ điệp tình yêu và giao ước cứu độ của Thiên Chúa";
      const bookSum = book.summary || "";
      const bookVerse = book.goldenVerse || "Lời Chúa tồn tại muôn đời và là nguồn sống cho chúng ta.";

      let chapTitle = `Sách ${book.name} - Diễn Tiến Chương ${chapNum}`;
      if (chapNum === 1) {
        chapTitle = `Khởi đầu Sách ${book.name} - Khai mở giao ước & sứ mạng`;
      } else if (chapNum === total) {
        chapTitle = `Kết thúc Sách ${book.name} - Lời trăn trối, hy vọng & khải hoàn`;
      } else if (chapNum <= Math.ceil(total / 3)) {
        chapTitle = `Phần Khởi Điểm: Ơn gọi, bối cảnh & biến cố ban đầu`;
      } else if (chapNum <= Math.ceil(total * 2 / 3)) {
        chapTitle = `Phần Trọng Tâm: Thử thách, giáo huấn & lòng trung tín`;
      } else {
        chapTitle = `Phần Đích Điểm: Chiến thắng, lời hứa & sự cứu chuộc`;
      }

      const generatedSections = [
        {
          range: `${book.abbr} ${chapNum}, 1-10`,
          title: `Đoạn mở đầu Chương ${chapNum}: Bối cảnh và Lời Chúa mời gọi`,
          desc: `Thiên Chúa bày tỏ thánh ý cho dân Người qua tác giả sách ${book.name}. Bối cảnh diễn ra gắn liền với chủ đề then chốt: ${bookTheme}.`
        },
        {
          range: `${book.abbr} ${chapNum}, 11-25`,
          title: `Đoạn cao điểm: Biến cố đức tin & những bài học luân lý`,
          desc: `Các nhân vật trong chương thể hiện lòng tin tưởng và trung kiên trước những thử thách đời sống. ${bookSum ? 'Tóm lược: ' + bookSum.substring(0, 140) + '...' : ''}`
        },
        {
          range: `${book.abbr} ${chapNum}, 26-hết`,
          title: `Đoạn kết thúc: Lời chúc lành & hy vọng tương lai`,
          desc: `Khép lại chương bằng lời tạ ơn và niềm xác tín vào tình thương hải hà của Thiên Chúa luôn hiện diện bảo bọc chở che đoàn dân lữ hành.`
        }
      ];

      return {
        bookName: book.name,
        bookAbbr: book.abbr,
        bookId: book.id,
        testament: book.testament,
        group: book.group,
        chapNum: chapNum,
        totalChaps: total,
        theme: chapTitle,
        keyVerse: `"${bookVerse}" (${book.abbr} ${chapNum})`,
        sections: generatedSections,
        meditation: `Qua chương ${chapNum} sách ${book.name}, Chúa nhắc nhở mỗi bạn thiếu nhi hãy luôn sống thật thà, biết vâng lời cha mẹ thầy cô, siêng năng cầu nguyện và lan tỏa niềm vui đến mọi người chung quanh.`,
        onlineUrl: `https://ktcgkpv.org/bible?version=${encodeURIComponent(book.abbr)}&chapter=${chapNum}`,
        searchUrl: `https://www.google.com/search?q=Kinh+Thanh+Cong+Giao+KTCGKPV+${encodeURIComponent(book.name)}+chuong+${chapNum}`
      };
    },

    openChapterReader: function(bookId, chapNum) {
      if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();

      const data = window.BIBLE_GAME_DATA || {};
      const books = data.books || [];
      const book = books.find(b => b.id === bookId);
      if (!book) return;

      const details = this.getBibleChapterDetails(book, chapNum);

      // Remove existing reader modal if open
      const existing = document.getElementById('cg-chapter-reader-modal');
      if (existing) existing.remove();

      // Create reader modal
      const readerEl = document.createElement('div');
      readerEl.className = 'cg-chapter-reader-backdrop';
      readerEl.id = 'cg-chapter-reader-modal';

      // Generate Quick Strip Chips for all chapters
      const quickStripChips = Array.from({ length: book.chapters }, (_, i) => i + 1)
        .map(n => `
          <button type="button" 
                  class="cg-reader-strip-chip ${n === chapNum ? 'active' : ''}" 
                  id="cg-reader-strip-${n}"
                  onclick="window.CatechismGames.openChapterReader('${book.id}', ${n})"
                  title="Chuyển nhanh sang Chương ${n}">
            Chương ${n}
          </button>
        `)
        .join('');

      // Generate Sections HTML
      const sectionsHtml = details.sections.map((sec, idx) => `
        <div class="cg-reader-sec-card">
          <div class="cg-reader-sec-header">
            <div class="cg-reader-sec-title">
              <i class="fa-solid fa-feather-pointed" style="color: #0284c7; margin-right: 6px;"></i>
              ${sec.title}
            </div>
            <span class="cg-reader-sec-range"><i class="fa-solid fa-bookmark"></i> ${sec.range}</span>
          </div>
          <div class="cg-reader-sec-desc cg-reader-passage-text">
            ${sec.desc}
          </div>
        </div>
      `).join('');

      readerEl.innerHTML = `
        <div class="cg-chapter-reader-card" onclick="event.stopPropagation()">
          <!-- HEADER -->
          <div class="cg-reader-header">
            <div class="cg-reader-header-left">
              <div class="cg-reader-header-badges">
                <span class="cg-badge-testament ${book.testament}">${book.testament === 'new' ? 'Tân Ước' : 'Cựu Ước'}</span>
                <span class="cg-badge-group"><i class="fa-solid fa-bookmark"></i> Nhóm: ${book.group}</span>
                <span class="cg-badge-group"><i class="fa-solid fa-book-open"></i> ${book.name}</span>
                <span class="cg-badge-group" style="background: rgba(254, 240, 138, 0.25); color: #fef08a; border-color: #fef08a;">
                  Chương ${chapNum} / ${book.chapters}
                </span>
              </div>
              <h2 class="cg-reader-title">
                <i class="fa-solid fa-book-bible" style="color: #fef08a;"></i>
                Sách ${book.name} - Chương ${chapNum}
              </h2>
              <div class="cg-reader-meta">
                Bản dịch Kinh Thánh Trọn Bộ Nhóm Phiên Dịch Các Giờ Kinh Phụng Vụ (NPD-CGKPV)
              </div>
            </div>

            <!-- CONTROLS -->
            <div class="cg-reader-controls">
              <button type="button" class="cg-reader-btn-tool" onclick="window.CatechismGames.changeReaderFontSize(-1)" title="Giảm cỡ chữ">
                <i class="fa-solid fa-font"></i> A-
              </button>
              <button type="button" class="cg-reader-btn-tool" onclick="window.CatechismGames.changeReaderFontSize(1)" title="Tăng cỡ chữ">
                <i class="fa-solid fa-font"></i> A+
              </button>
              <span id="cg-reader-font-indicator" style="font-size: 0.8rem; font-weight: 700; color: #bae6fd; min-width: 32px; text-align: center;">
                ${this.readerFontSize}px
              </span>
              <button type="button" class="cg-reader-btn-tool" onclick="window.CatechismGames.copyChapterRef('${book.abbr}', ${chapNum})" title="Sao chép trích dẫn">
                <i class="fa-solid fa-copy"></i> ${book.abbr} ${chapNum}
              </button>
              <button class="cg-modal-close-btn" style="position: static !important; width: 34px !important; height: 34px !important; font-size: 1rem !important;" onclick="document.getElementById('cg-chapter-reader-modal')?.remove()" title="Đóng trình đọc (ESC)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- QUICK CHAPTER STRIP -->
          <div class="cg-reader-quick-strip" id="cg-reader-quick-strip">
            <span class="cg-reader-strip-label"><i class="fa-solid fa-list-ol"></i> Chọn nhanh:</span>
            ${quickStripChips}
          </div>

          <!-- BODY -->
          <div class="cg-reader-body">
            <!-- THEME BANNER -->
            <div class="cg-reader-theme-banner">
              <div class="cg-reader-banner-icon">
                <i class="fa-solid ${book.icon || 'fa-cross'}"></i>
              </div>
              <div>
                <div class="cg-reader-banner-title">
                  <i class="fa-solid fa-star" style="color: #f59e0b; margin-right: 6px;"></i>
                  Ý Lực & Chủ Đề Trọng Tâm Chương ${chapNum}
                </div>
                <div class="cg-reader-banner-sub">
                  ${details.theme}
                </div>
              </div>
            </div>

            <!-- GOLDEN VERSE -->
            <div class="cg-reader-verse-card">
              <div style="font-size: 0.85rem; font-weight: 800; color: #92400e; text-transform: uppercase; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fa-solid fa-quote-left"></i> Câu Lời Chúa Vàng Của Chương</span>
                <button type="button" class="cg-btn-book-nav" style="padding: 4px 12px; font-size: 0.8rem; background: #ffffff;" onclick="window.CatechismGames.copyVerse('${encodeURIComponent(details.keyVerse)}')">
                  <i class="fa-solid fa-copy"></i> Sao chép
                </button>
              </div>
              <div class="cg-reader-verse-text">
                ${details.keyVerse}
              </div>
            </div>

            <!-- SCRIPTURE SECTIONS BREAKDOWN -->
            <div>
              <div style="font-size: 0.92rem; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-book-open-reader" style="color: #2563eb;"></i>
                Bố Cục & Các Phân Đoạn Lời Chúa (${details.sections.length} Đoạn)
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${sectionsHtml}
              </div>
            </div>

            <!-- CATECHISM & MEDITATION -->
            <div class="cg-reader-meditation">
              <div style="font-size: 0.9rem; font-weight: 800; color: #166534; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-hands-praying" style="color: #16a34a;"></i>
                Bài Học Giáo Lý & Suy Niệm Cho Thiếu Nhi
              </div>
              <div style="font-size: 0.95rem; color: #14532d; line-height: 1.6; font-weight: 600;" class="cg-reader-passage-text">
                ${details.meditation}
              </div>
            </div>

            <!-- DIRECT ONLINE ACTIONS -->
            <div class="cg-reader-actions-row">
              <a href="${details.onlineUrl}" target="_blank" rel="noopener" class="cg-btn-reader-primary" title="Mở trang đọc trực tuyến chính thức">
                <i class="fa-solid fa-globe"></i> Đọc Toàn Văn Trên KTCGKPV
              </a>
              <a href="${details.searchUrl}" target="_blank" rel="noopener" class="cg-btn-reader-primary" style="background: linear-gradient(135deg, #0284c7, #0369a1);" title="Tìm bản văn chi tiết trên Google">
                <i class="fa-solid fa-magnifying-glass"></i> Tra Cứu Bản Dịch Đầy Đủ
              </a>
              <a href="https://ktcgkpv.org/bible/audio" target="_blank" rel="noopener" class="cg-btn-reader-audio" title="Nghe đọc Kinh Thánh">
                <i class="fa-solid fa-headphones"></i> Nghe Audio Lời Chúa
              </a>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="cg-reader-footer">
            ${chapNum > 1 ? `
              <button type="button" class="cg-btn-book-nav" onclick="window.CatechismGames.openChapterReader('${book.id}', ${chapNum - 1})" title="Chương trước">
                <i class="fa-solid fa-chevron-left"></i> Chương ${chapNum - 1}
              </button>
            ` : '<div style="width: 100px;"></div>'}

            <div style="display: flex; gap: 10px; align-items: center;">
              <button type="button" class="cg-btn-book-nav" style="background: #e0f2fe; border-color: #38bdf8; color: #0369a1;" onclick="document.getElementById('cg-chapter-reader-modal')?.remove(); window.CatechismGames.openBookDetails('${book.id}')" title="Mục lục sách">
                <i class="fa-solid fa-list"></i> Mục Lục Sách ${book.name}
              </button>
              <button class="cg-arena-btn-exit" style="padding: 7px 18px; font-size: 0.85rem;" onclick="document.getElementById('cg-chapter-reader-modal')?.remove()">
                <i class="fa-solid fa-xmark"></i> Đóng Trình Đọc
              </button>
            </div>

            ${chapNum < book.chapters ? `
              <button type="button" class="cg-btn-book-nav" onclick="window.CatechismGames.openChapterReader('${book.id}', ${chapNum + 1})" title="Chương kế tiếp">
                Chương ${chapNum + 1} <i class="fa-solid fa-chevron-right"></i>
              </button>
            ` : '<div style="width: 100px;"></div>'}
          </div>
        </div>
      `;

      readerEl.addEventListener('click', (e) => {
        if (e.target === readerEl) readerEl.remove();
      });

      document.body.appendChild(readerEl);

      // Auto-scroll the active chip in the strip to center view
      setTimeout(() => {
        const activeChip = document.getElementById(`cg-reader-strip-${chapNum}`);
        if (activeChip) {
          activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 50);
    },

    selectChapter: function(bookName, chapNum, totalChaps, bookAbbr) {
      if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
      document.querySelectorAll('.cg-chap-chip').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById(`cg-chap-chip-${chapNum}`);
      if (activeBtn) activeBtn.classList.add('active');

      const titleEl = document.getElementById('cg-selected-chap-title');
      if (titleEl) {
        titleEl.innerText = `Sách ${bookName} - Chương ${chapNum} / ${totalChaps}`;
      }

      const copyBtn = document.getElementById('cg-btn-copy-chap');
      if (copyBtn) {
        copyBtn.setAttribute('onclick', `window.CatechismGames.copyChapterRef('${bookAbbr}', ${chapNum})`);
        copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Sao chép (${bookAbbr} ${chapNum})`;
      }

      const readBtn = document.getElementById('cg-btn-read-chap');
      if (readBtn) {
        readBtn.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> Đọc Chương ${chapNum} Ngay`;
        // Find bookId
        const data = window.BIBLE_GAME_DATA || {};
        const books = data.books || [];
        const found = books.find(b => b.abbr === bookAbbr || b.name === bookName);
        if (found) {
          readBtn.setAttribute('onclick', `window.CatechismGames.openChapterReader('${found.id}', ${chapNum})`);
        }
      }

      // Smoothly scroll selected box into view so it's never cut off
      const box = document.getElementById('cg-selected-chap-box');
      if (box) {
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },

    copyChapterRef: function(bookAbbr, chapNum) {
      const text = `${bookAbbr} ${chapNum}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        if (typeof window.showToast === 'function') {
          window.showToast(`✅ Đã sao chép trích dẫn: ${text}`, 'success');
        } else {
          alert(`Đã sao chép trích dẫn: ${text}`);
        }
      }
    },

    copyVerse: function(encodedText) {
      const text = decodeURIComponent(encodedText);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        if (typeof window.showToast === 'function') {
          window.showToast('✅ Đã sao chép câu Lời Chúa!', 'success');
        } else {
          alert('Đã sao chép câu Lời Chúa!');
        }
      }
    },

    // ------------------------------------------------------------------------
    // 6. GAME: VÒNG QUAY THIÊN THẦN & THÁNH BỔN MẠNG
    // ------------------------------------------------------------------------
    openAngelWheel: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('angel-wheel') || getCustomStudents('noah-ark');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);
      
      let slices = [];
      if (roster.length > 0) {
        slices = roster.slice(0, 16).map(s => `${s.christianName ? s.christianName + ' ' : ''}${s.fullName || 'Học viên'}`);
      }
      if (slices.length < 4) {
        slices = [
          'Thánh Phê-rô (+100đ)', 'Thánh Phao-lô (+150đ)', 'Thánh Gio-an (+200đ)',
          'Đọc Kinh Kính Mừng', 'Hát Thánh Ca', 'Thánh Tê-rê-sa (+100đ)',
          '🌟 Nhân Đôi Điểm', 'Thánh Phan-xi-cô (+150đ)'
        ];
      }

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-angel-wheel-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title">
            <i class="fa-solid fa-dharmachakra" style="color: #f59e0b;"></i>
            Vòng Quay Thiên Thần & Thánh Bổn Mạng
          </div>
          <div style="font-size: 0.95rem; color: #1e3a8a; font-weight: 700;">
            <i class="fa-solid fa-users" style="color: #0284c7;"></i> ${slices.length} Mục quay
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
            <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
          </button>
        </div>

        <div class="cg-wheel-arena-body">
          <div class="cg-wheel-wrap">
            <div class="cg-wheel-pointer">
              <svg viewBox="0 0 40 50" width="100%" height="100%">
                <polygon points="20,50 0,0 40,0" fill="#f59e0b" stroke="#ffffff" stroke-width="3" />
              </svg>
            </div>
            <canvas id="cg-wheel-canvas" width="460" height="460" class="cg-wheel-canvas"></canvas>
            <button class="cg-wheel-center-btn" id="cg-wheel-spin-btn">
              <i class="fa-solid fa-rotate" style="font-size: 1.2rem; margin-bottom: 2px;"></i>
              QUAY
            </button>
          </div>
        </div>

        <div class="cg-arena-bottom-bar" style="justify-content: center; gap: 15px;">
          <button class="cg-btn-play" id="cg-wheel-spin-bottom-btn" style="padding: 12px 36px; font-size: 1.05rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; font-weight: 800; border: none; border-radius: 999px; box-shadow: 0 4px 16px rgba(245,158,11,0.35);">
            <i class="fa-solid fa-rotate" style="margin-right: 8px;"></i> BẮT ĐẦU QUAY NGAY
          </button>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();

      const canvas = arenaEl.querySelector('#cg-wheel-canvas');
      const ctx = canvas.getContext('2d');
      const numSlices = slices.length;
      const arc = (2 * Math.PI) / numSlices;
      const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1'];

      let currentAngle = 0;
      let isSpinning = false;

      function drawWheel() {
        ctx.clearRect(0, 0, 460, 460);
        const cx = 230, cy = 230, r = 220;

        for (let i = 0; i < numSlices; i++) {
          const angle = currentAngle + i * arc;
          ctx.beginPath();
          ctx.fillStyle = colors[i % colors.length];
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r, angle, angle + arc);
          ctx.lineTo(cx, cy);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Text
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle + arc / 2);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px Montserrat, sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 4;
          const text = slices[i].length > 18 ? slices[i].slice(0, 16) + '...' : slices[i];
          ctx.fillText(text, r - 25, 5);
          ctx.restore();
        }
      }

      drawWheel();

      function spinWheel() {
        if (isSpinning) return;
        isSpinning = true;
        SoundFX.playPop();

        const spinTime = 4000;
        const totalRots = (5 + Math.random() * 5) * 2 * Math.PI;
        const startAngle = currentAngle;
        const startTime = performance.now();
        let lastTickAngle = startAngle;

        function animate(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / spinTime, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          currentAngle = startAngle + totalRots * ease;
          drawWheel();

          if (Math.abs(currentAngle - lastTickAngle) >= arc / 2) {
            SoundFX.playTick();
            lastTickAngle = currentAngle;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            isSpinning = false;
            // Calculate winner index pointing at top (3*PI/2)
            const normalized = (2 * Math.PI - (currentAngle % (2 * Math.PI)) + (3 * Math.PI / 2)) % (2 * Math.PI);
            const winnerIdx = Math.floor(normalized / arc) % numSlices;
            const winnerText = slices[winnerIdx];

            SoundFX.playTrumpet();
            fireConfetti();
            setTimeout(() => {
              window.CatechismGames.showWinnerModal(
                `🎉 CHÚC MỪNG: ${winnerText}! 🎉`,
                `Thiên Thần đã gọi tên: <strong style="color: #fbbf24; font-size: 1.3rem;">${winnerText}</strong><br>Nguyện xin bình an và muôn ơn lành của Chúa tuôn đổ trên em!`
              );
            }, 400);
          }
        }

        requestAnimationFrame(animate);
      }

      arenaEl.querySelector('#cg-wheel-spin-btn').addEventListener('click', spinWheel);
      arenaEl.querySelector('#cg-wheel-spin-bottom-btn').addEventListener('click', spinWheel);
    },

    // ------------------------------------------------------------------------
    // 7. GAME: THỬ THÁCH TRIỆU PHÚ KINH THÁNH
    // ------------------------------------------------------------------------
    openBibleMillionaire: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const defaultMilQ = data.millionaireQuestions || [];
      const questions = getGameQuestions('bible-millionaire', defaultMilQ);
      let currentLevel = 0;
      let used5050 = false;
      let usedAudience = false;
      let usedSwitch = false;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-millionaire-arena';

      function renderMilUI() {
        const q = questions[currentLevel] || questions[0];

        arenaEl.innerHTML = `
          <div class="cg-arena-header">
            <div class="cg-arena-title">
              <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i>
              Ai Là Triệu Phú Kinh Thánh
            </div>
            <div style="font-size: 0.95rem; color: #b45309; font-weight: 800;">
              Mức hiện tại: ${q.reward}
            </div>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>

          <div class="cg-mil-container">
            <div class="cg-mil-main">
              <!-- LIFELINES -->
              <div class="cg-mil-lifelines">
                <button class="cg-mil-lifeline-btn" id="cg-mil-5050" ${used5050 ? 'disabled' : ''}>
                  <i class="fa-solid fa-circle-half-stroke"></i> 50:50 (Bỏ 2 sai)
                </button>
                <button class="cg-mil-lifeline-btn" id="cg-mil-aud" ${usedAudience ? 'disabled' : ''}>
                  <i class="fa-solid fa-users"></i> Khán Giả Thiên Thần
                </button>
                <button class="cg-mil-lifeline-btn" id="cg-mil-switch" ${usedSwitch ? 'disabled' : ''}>
                  <i class="fa-solid fa-arrows-rotate"></i> Cầu Nguyện Đổi Câu
                </button>
              </div>

              <!-- QUESTION BOX -->
              <div class="cg-mil-qbox">
                <div style="font-size: 0.9rem; color: #b45309; font-weight: 800; margin-bottom: 8px;">
                  CÂU HỎI SỐ ${currentLevel + 1} / 15 (${q.reward})
                </div>
                <div class="cg-mil-qtext">${q.question}</div>
              </div>

              <!-- OPTIONS A, B, C, D -->
              <div class="cg-mil-options" id="cg-mil-opts-grid">
                ${q.options.map((opt, idx) => `
                  <button class="cg-mil-opt-btn" data-opt-idx="${idx}">
                    <strong style="color: #2563eb; font-size: 1.15rem; min-width: 24px;">${String.fromCharCode(65 + idx)}.</strong>
                    <span style="color: #0f172a; font-weight: 700;">${opt}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- LADDER -->
            <div class="cg-mil-ladder">
              ${questions.map((item, idx) => `
                <div class="cg-ladder-item ${idx === currentLevel ? 'current' : (idx < currentLevel ? 'passed' : '')} ${(idx + 1) % 5 === 0 ? 'milestone' : ''}">
                  <span>${idx + 1}.</span>
                  <span>${item.reward}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        // Bind Option Clicks
        const optBtns = arenaEl.querySelectorAll('.cg-mil-opt-btn');
        optBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const chosen = parseInt(btn.getAttribute('data-opt-idx'), 10);
            SoundFX.playPop();

            if (chosen === q.correct) {
              btn.classList.add('correct');
              SoundFX.playHarp();

              setTimeout(() => {
                if (currentLevel === 14) {
                  SoundFX.playTrumpet();
                  fireConfetti();
                  window.CatechismGames.showWinnerModal(
                    `🏆 QUÁN QUÂN TRIỆU PHÚ KINH THÁNH! 🏆`,
                    `Chúc mừng em đã xuất sắc vượt qua cả 15/15 câu hỏi Kinh Thánh & Giáo Lý, đạt mốc thưởng cao nhất 150.000.000 Ơn Cứu Độ!`
                  );
                } else {
                  currentLevel++;
                  renderMilUI();
                }
              }, 1200);
            } else {
              btn.classList.add('wrong');
              optBtns[q.correct].classList.add('correct');
              SoundFX.playWrong();

              setTimeout(() => {
                window.CatechismGames.showWinnerModal(
                  `RẤT TIẾC, CHƯA CHÍNH XÁC!`,
                  `Đáp án đúng là: <strong style="color: #10b981;">${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}</strong><br><em>${q.explain || ''}</em><br>Em đã đạt được mức thưởng: <strong>${questions[Math.max(0, currentLevel - 1)]?.reward || 'Khởi đầu'}</strong>.`
                );
              }, 1400);
            }
          });
        });

        // Lifelines Handlers
        const btn5050 = arenaEl.querySelector('#cg-mil-5050');
        if (btn5050) {
          btn5050.addEventListener('click', () => {
            if (used5050) return;
            used5050 = true;
            SoundFX.playClick();
            btn5050.disabled = true;

            const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correct);
            const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
            toHide.forEach(idx => {
              const el = optBtns[idx];
              if (el) el.style.visibility = 'hidden';
            });
          });
        }

        const btnAud = arenaEl.querySelector('#cg-mil-aud');
        if (btnAud) {
          btnAud.addEventListener('click', () => {
            if (usedAudience) return;
            usedAudience = true;
            SoundFX.playClick();
            btnAud.disabled = true;

            const correctLetter = String.fromCharCode(65 + q.correct);
            alert(`🕊️ Ý KIẾN CÁC THIÊN THẦN KHÁN GIẢ:\n` +
                  `- Phương án ${correctLetter}: 78% lựa chọn\n` +
                  `- Các phương án còn lại: 22% phân bổ đều.`);
          });
        }

        const btnSwitch = arenaEl.querySelector('#cg-mil-switch');
        if (btnSwitch) {
          btnSwitch.addEventListener('click', () => {
            if (usedSwitch) return;
            usedSwitch = true;
            SoundFX.playClick();
            btnSwitch.disabled = true;

            // Pick another question
            const altQuestion = (window.BIBLE_GAME_DATA?.tiltQuestions || [])[0];
            if (altQuestion) {
              q.question = altQuestion.question;
              q.options = [altQuestion.optA, altQuestion.optB, 'Cả hai đều đúng', 'Cả hai đều sai'];
              q.correct = altQuestion.correct === 'A' ? 0 : 1;
              renderMilUI();
            }
          });
        }
      }

      renderMilUI();
      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();
    },

    // ------------------------------------------------------------------------
    // 8. GAME: CHIẾC RƯƠNG GIAO ƯỚC BÍ ẨN (COVENANT MYSTERY BOXES)
    // ------------------------------------------------------------------------
    openCovenantBoxes: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const defaultBoxes = data.covenantBoxes || [];
      const boxes = getGameQuestions('covenant-boxes', defaultBoxes);
      let openedCount = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-covenant-boxes-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title">
            <i class="fa-solid fa-box-open" style="color: #f59e0b;"></i>
            Chiếc Rương Giao Ước Bí Ẩn
          </div>
          <div style="font-size: 0.95rem; color: #059669; font-weight: 800;" id="cg-box-opened-counter">
            Đã mở: 0 / 8 Rương Thánh
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
            <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
          </button>
        </div>

        <div class="cg-boxes-arena-body">
          <div class="cg-boxes-grid" id="cg-covenant-boxes-grid">
            ${boxes.map((b, idx) => `
              <div class="cg-covenant-box" data-box-idx="${idx}">
                <div class="cg-box-icon">📦</div>
                <div class="cg-box-title">${b.title}</div>
                <div style="font-size: 0.8rem; color: #f59e0b; font-weight: 800;">Bấm để mở</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();

      const boxEls = arenaEl.querySelectorAll('.cg-covenant-box');
      boxEls.forEach(boxEl => {
        boxEl.addEventListener('click', () => {
          if (boxEl.classList.contains('opened')) return;
          const idx = parseInt(boxEl.getAttribute('data-box-idx'), 10);
          const box = boxes[idx];
          SoundFX.playPop();

          // Render Question Dialog
          const qModal = document.createElement('div');
          qModal.className = 'cg-win-modal';
          qModal.style.maxWidth = '600px';
          qModal.innerHTML = `
            <div style="font-size: 2.8rem; margin-bottom: 8px;">✨ 📦 ✨</div>
            <h3 style="font-size: 1.35rem; color: #b45309; margin-bottom: 0.8rem; font-weight: 900;">${box.title} (${box.prize})</h3>
            <p style="font-size: 1.2rem; color: #1e3a8a; margin-bottom: 1.5rem; font-weight: 800; line-height: 1.45;">${box.question}</p>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
              ${box.options.map((opt, oIdx) => `
                <button class="cg-btn-play" style="width: 100%; justify-content: flex-start; padding: 14px 20px; background: #ffffff; color: #0f172a; border: 2px solid #93c5fd; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 10px rgba(15,23,42,0.05);" data-c-idx="${oIdx}">
                  <strong style="color: #2563eb; font-size: 1.1rem; margin-right: 10px;">${String.fromCharCode(65 + oIdx)}.</strong>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
            <button class="cg-btn-nav" style="padding: 10px 26px; border-radius: 999px; background: #f1f5f9; color: #475569; border: 1.5px solid #cbd5e1; font-weight: 800; cursor: pointer;" onclick="this.closest('.cg-win-modal').remove()">Hủy bỏ</button>
          `;

          document.body.appendChild(qModal);

          qModal.querySelectorAll('[data-c-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
              const cIdx = parseInt(btn.getAttribute('data-c-idx'), 10);
              if (cIdx === box.correct) {
                SoundFX.playHarp();
                boxEl.classList.add('opened');
                boxEl.querySelector('.cg-box-icon').innerText = '✨🎁';
                boxEl.querySelector('.cg-box-title').innerText = box.prize;
                openedCount++;
                arenaEl.querySelector('#cg-box-opened-counter').innerText = `Đã mở: ${openedCount} / 8 Rương Thánh`;
                qModal.remove();

                if (openedCount === boxes.length) {
                  SoundFX.playTrumpet();
                  fireConfetti();
                  window.CatechismGames.showWinnerModal(
                    `🎉 TOÀN THẮNG: ĐÃ MỞ TẤT CẢ RƯƠNG THÁNH! 🎉`,
                    `Các em đã giải mã toàn bộ 8 Chiếc Rương Giao Ước và nhận trọn vẹn muôn Ơn Phúc Lành của Thiên Chúa!`
                  );
                }
              } else {
                SoundFX.playWrong();
                alert('Chưa chính xác! Hãy suy nghĩ và thử mở lại rương này sau nhé!');
                qModal.remove();
              }
            });
          });
        });
      });
    },

    // ------------------------------------------------------------------------
    // 9. GAME: KÉO CO ĐỨC TIN: DAVID & GOLIATH
    // ------------------------------------------------------------------------
    openFaithTugOfWar: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const defaultTowQ = data.tugOfWarQuestions || [];
      const questions = getGameQuestions('faith-tugofwar', defaultTowQ);
      let qIdx = 0;
      let ropePos = 50; // percentage
      let activeTeam = 0; // 0: Đội Phê-rô, 1: Đội Phao-lô

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-tugofwar-arena';

      function renderTowUI() {
        const q = questions[qIdx % questions.length];

        arenaEl.innerHTML = `
          <div class="cg-arena-header">
            <div class="cg-arena-title">
              <i class="fa-solid fa-people-robbery" style="color: #f59e0b;"></i>
              Kéo Co Đức Tin: David & Goliath
            </div>
            <div style="font-size: 0.95rem; color: ${activeTeam === 0 ? '#0284c7' : '#dc2626'}; font-weight: 800;">
              LƯỢT TRẢ LỜI: ${activeTeam === 0 ? 'ĐỘI THÁNH PHÊ-RÔ (XANH)' : 'ĐỘI THÁNH PHAO-LÔ (ĐỎ)'}
            </div>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>

          <div class="cg-tow-arena">
            <div class="cg-tow-visual">
              <div class="cg-tow-stage">
                <!-- TEAM LEFT (PHÊ-RÔ) -->
                <div class="cg-tow-team">
                  <div class="cg-tow-team-avatar">⛵</div>
                  <strong style="color: #0284c7; font-size: 1.15rem;">Đội Phê-rô</strong>
                </div>

                <!-- ROPE -->
                <div class="cg-tow-rope-wrap">
                  <div class="cg-tow-center-line"></div>
                  <div class="cg-tow-rope"></div>
                  <div class="cg-tow-ribbon" style="left: ${ropePos}%;">
                    <i class="fa-solid fa-cross"></i>
                  </div>
                </div>

                <!-- TEAM RIGHT (PHAO-LÔ) -->
                <div class="cg-tow-team">
                  <div class="cg-tow-team-avatar">⚔️</div>
                  <strong style="color: #dc2626; font-size: 1.15rem;">Đội Phao-lô</strong>
                </div>
              </div>
            </div>

            <!-- QUESTION AREA -->
            <div class="cg-tow-qbox">
              <div style="font-size: 0.9rem; color: #b45309; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fa-solid fa-flag"></i> Câu Hỏi Trỗi Dậy
              </div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #1e3a8a; margin-bottom: 1.4rem; line-height: 1.4;">${q.question}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                ${q.options.map((opt, idx) => `
                  <button class="cg-btn-play" style="justify-content: center; padding: 16px 20px; font-size: 1.05rem; background: #ffffff; color: #0f172a; border: 2px solid #93c5fd; font-weight: 700; border-radius: 14px; box-shadow: 0 4px 12px rgba(15,23,42,0.06);" data-tow-idx="${idx}">
                    <strong style="color: #2563eb; font-size: 1.15rem; margin-right: 8px;">${String.fromCharCode(65 + idx)}.</strong>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        arenaEl.querySelectorAll('[data-tow-idx]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-tow-idx'), 10);
            if (idx === q.correct) {
              SoundFX.playHarp();
              if (activeTeam === 0) {
                ropePos = Math.max(15, ropePos - 15);
              } else {
                ropePos = Math.min(85, ropePos + 15);
              }
            } else {
              SoundFX.playWrong();
              if (activeTeam === 0) {
                ropePos = Math.min(85, ropePos + 10);
              } else {
                ropePos = Math.max(15, ropePos - 10);
              }
            }

            if (ropePos <= 15) {
              SoundFX.playTrumpet();
              fireConfetti();
              window.CatechismGames.showWinnerModal(
                `🏆 ĐỘI THÁNH PHÊ-RÔ CHIẾN THẮNG! 🏆`,
                `Với đức tin kiên vững và sự phối hợp ăn ý, Đội Thánh Phê-rô đã kéo sợi dây về đích vinh quang!`
              );
            } else if (ropePos >= 85) {
              SoundFX.playTrumpet();
              fireConfetti();
              window.CatechismGames.showWinnerModal(
                `🏆 ĐỘI THÁNH PHAO-LÔ CHIẾN THẮNG! 🏆`,
                `Với lòng nhiệt thành truyền giáo và câu trả lời chính xác, Đội Thánh Phao-lô đã chiến thắng vẻ vang!`
              );
            } else {
              qIdx++;
              activeTeam = activeTeam === 0 ? 1 : 0;
              renderTowUI();
            }
          });
        });
      }

      renderTowUI();
      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();
    },

    // ------------------------------------------------------------------------
    // 10. GAME: LẬT MẢNH GHÉP TRANH CHÚA CHIÊN LÀNH (PICTURE FLIP)
    // ------------------------------------------------------------------------
    openHolyPictureFlip: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const defaultPFlipQ = data.pictureFlipQuestions || [];
      const questions = getGameQuestions('holy-picture-flip', defaultPFlipQ);
      let revealedCount = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-picture-flip-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title">
            <i class="fa-solid fa-puzzle-piece" style="color: #f59e0b;"></i>
            Lật Mảnh Ghép Tranh Chúa Chiên Lành
          </div>
          <div style="font-size: 0.95rem; color: #059669; font-weight: 800;" id="cg-pflip-counter">
            Đã mở: 0 / 9 Mảnh ghép
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
            <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
          </button>
        </div>

        <div class="cg-pflip-arena">
          <div class="cg-pflip-board">
            <img src="anh/games/thumb_holy_picture_flip.jpg" class="cg-pflip-bg-img" alt="Chúa Chiên Lành">
            <div class="cg-pflip-grid" id="cg-pflip-grid">
              ${questions.map((q, idx) => `
                <div class="cg-pflip-tile" data-tile-idx="${idx}">
                  <span>#${idx + 1}</span>
                  <small style="font-size: 0.65rem; color: #fef08a;">Bấm mở</small>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();

      arenaEl.querySelectorAll('.cg-pflip-tile').forEach(tileEl => {
        tileEl.addEventListener('click', () => {
          if (tileEl.classList.contains('revealed')) return;
          const idx = parseInt(tileEl.getAttribute('data-tile-idx'), 10);
          const q = questions[idx];
          SoundFX.playPop();

          const modal = document.createElement('div');
          modal.className = 'cg-win-modal';
          modal.style.maxWidth = '580px';
          modal.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🧩 MẢNH GHÉP SỐ ${idx + 1}</div>
            <p style="font-size: 1.25rem; color: #1e3a8a; margin-bottom: 1.5rem; font-weight: 800; line-height: 1.45;">${q.question}</p>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
              ${q.options.map((opt, oIdx) => `
                <button class="cg-btn-play" style="width: 100%; justify-content: flex-start; padding: 14px 20px; background: #ffffff; color: #0f172a; border: 2px solid #93c5fd; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 10px rgba(15,23,42,0.05);" data-ans-idx="${oIdx}">
                  <strong style="color: #2563eb; font-size: 1.1rem; margin-right: 10px;">${String.fromCharCode(65 + oIdx)}.</strong>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
            <button class="cg-btn-nav" style="padding: 10px 26px; border-radius: 999px; background: #f1f5f9; color: #475569; border: 1.5px solid #cbd5e1; font-weight: 800; cursor: pointer;" onclick="this.closest('.cg-win-modal').remove()">Đóng</button>
          `;

          document.body.appendChild(modal);

          modal.querySelectorAll('[data-ans-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
              const ansIdx = parseInt(btn.getAttribute('data-ans-idx'), 10);
              if (ansIdx === q.correct) {
                SoundFX.playHarp();
                tileEl.classList.add('revealed');
                revealedCount++;
                arenaEl.querySelector('#cg-pflip-counter').innerText = `Đã mở: ${revealedCount} / 9 Mảnh ghép`;
                modal.remove();

                if (revealedCount === 9) {
                  SoundFX.playTrumpet();
                  fireConfetti();
                  window.CatechismGames.showWinnerModal(
                    `🌟 TUYỆT VỜI: HÉ LỘ TOÀN BỘ BỨC TRANH THÁNH! 🌟`,
                    `"Chúa là mục tử chăn dắt tôi, tôi chẳng thiếu thốn gì!" (Tv 23, 1)<br>Các em đã mở khóa trọn vẹn bức tranh Đấng Mục Tử Nhân Lành che chở đoàn chiên!`
                  );
                }
              } else {
                SoundFX.playWrong();
                alert('Chưa đúng rồi! Hãy thử lại câu này nhé!');
                modal.remove();
              }
            });
          });
        });
      });
    },

    // ------------------------------------------------------------------------
    // 11. GAME: XÂY ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM (TEMPLE BUILDER)
    // ------------------------------------------------------------------------
    openTempleBuilder: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const defaultTempleQ = data.templeQuestions || [];
      const questions = getGameQuestions('temple-builder', defaultTempleQ);
      let currentBlock = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-temple-arena';

      function renderTempleUI() {
        const q = questions[currentBlock];

        arenaEl.innerHTML = `
          <div class="cg-arena-header">
            <div class="cg-arena-title">
              <i class="fa-solid fa-monument" style="color: #f59e0b;"></i>
              Xây Đền Thờ Thánh Giê-ru-sa-lem
            </div>
            <div style="font-size: 0.95rem; color: #b45309; font-weight: 800;">
              Tiến độ: ${currentBlock} / 7 Tầng đá cẩm thạch
            </div>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (hoặc bấm ESC)">
              <i class="fa-solid fa-arrow-left"></i> <span>Thoát Trò Chơi</span>
            </button>
          </div>

          <div class="cg-temple-arena">
            <!-- TEMPLE STACK COLUMN -->
            <div class="cg-temple-column" id="cg-temple-blocks-col">
              <div style="position: absolute; top: 12px; font-size: 0.8rem; color: #b45309; font-weight: 800;">
                <i class="fa-solid fa-crown" style="color: #f59e0b;"></i> NƠI CỰC THÁNH (ĐỈNH ĐỀN THỜ)
              </div>
            </div>

            <!-- QUESTION CARD -->
            <div class="cg-temple-qcard" style="max-width: 540px; width: 100%; background: #ffffff; border: 3.5px solid #f59e0b; border-radius: 24px; padding: 26px; text-align: center; box-shadow: 0 14px 40px rgba(245, 158, 11, 0.15);">
              <div style="font-size: 0.9rem; color: #b45309; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fa-solid fa-cube"></i> Đặt Khối Đá Số ${currentBlock + 1} / 7
              </div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #1e3a8a; margin-bottom: 1.5rem; line-height: 1.4;">
                ${q.question}
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${q.options.map((opt, idx) => `
                  <button class="cg-btn-play" style="justify-content: flex-start; padding: 15px 22px; font-size: 1.05rem; background: #ffffff; color: #0f172a; border: 2px solid #93c5fd; font-weight: 700; border-radius: 14px; box-shadow: 0 4px 12px rgba(15,23,42,0.06);" data-temple-opt="${idx}">
                    <strong style="color: #2563eb; font-size: 1.15rem; margin-right: 10px;">${String.fromCharCode(65 + idx)}.</strong>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        // Render placed blocks
        const col = arenaEl.querySelector('#cg-temple-blocks-col');
        for (let b = 1; b <= currentBlock; b++) {
          const item = document.createElement('div');
          item.className = 'cg-temple-block-item';
          item.innerHTML = `<i class="fa-solid fa-cubes" style="color: #f59e0b; margin-right: 6px;"></i> Khối đá tầng ${b}: Đá Cẩm Thạch Trắng`;
          col.appendChild(item);
        }

        arenaEl.querySelectorAll('[data-temple-opt]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-temple-opt'), 10);
            if (idx === q.correct) {
              SoundFX.playHarp();
              currentBlock++;

              if (currentBlock === 7) {
                SoundFX.playTrumpet();
                fireConfetti();
                window.CatechismGames.showWinnerModal(
                  `🏛️ HOÀN TẤT ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM! 🏛️`,
                  `"Nhà Ta sẽ được gọi là nhà cầu nguyện cho muôn dân!" (Is 56, 7)<br>Vua Sa-lô-môn cùng các em đã xây xong Đền Thờ rực rỡ dâng kính Thiên Chúa!`
                );
              } else {
                renderTempleUI();
              }
            } else {
              SoundFX.playWrong();
              alert('Chưa chính xác! Khối đá chưa thể đặt vào vị trí, hãy thử lại nhé!');
            }
          });
        });
      }

      renderTempleUI();
      document.body.appendChild(arenaEl);
      window.CatechismGames.showGlobalExitFab();
    },

    downloadTemplate: function(gameId, gameTitle, isStudentPicker) {
      try {
        if (typeof window.SoundFX?.playBell === 'function') window.SoundFX.playBell();
        if (window.XLSX && window.XLSX.utils && window.XLSX.writeFile) {
          const wb = window.XLSX.utils.book_new();
          if (isStudentPicker) {
            const sampleData = [
              { "STT": 1, "TenThanh": "Giuse", "HoVaTen": "Nguyễn Văn An", "GioiTinh": "Nam" },
              { "STT": 2, "TenThanh": "Maria", "HoVaTen": "Trần Thị Mai", "GioiTinh": "Nữ" },
              { "STT": 3, "TenThanh": "Gioan", "HoVaTen": "Lê Hoàng Nam", "GioiTinh": "Nam" },
              { "STT": 4, "TenThanh": "Têrêsa", "HoVaTen": "Phạm Ngọc Ánh", "GioiTinh": "Nữ" },
              { "STT": 5, "TenThanh": "Phêrô", "HoVaTen": "Võ Minh Đức", "GioiTinh": "Nam" },
              { "STT": 6, "TenThanh": "Anna", "HoVaTen": "Đặng Thùy Dương", "GioiTinh": "Nữ" }
            ];
            const ws = window.XLSX.utils.json_to_sheet(sampleData);
            window.XLSX.utils.book_append_sheet(wb, ws, "DanhSachHocVien");
            window.XLSX.writeFile(wb, `Mau_Danh_Sach_${gameId}.xlsx`);
          } else {
            const sampleData = [
              {
                "STT": 1,
                "CauHoi": "Chúa Giê-su sinh ra tại thành phố nào?",
                "DapAnA": "Na-da-rét",
                "DapAnB": "Bê-lem",
                "DapAnC": "Giê-ru-sa-lem",
                "DapAnD": "Ga-li-lê",
                "DapAnDung": "B",
                "GiaiThich": "Chúa Giê-su sinh ra tại Bê-lem xứ Giu-đê theo lời các ngôn sứ."
              },
              {
                "STT": 2,
                "CauHoi": "Ai là người được Chúa trao chìa khóa Nước Trời?",
                "DapAnA": "Thánh Gioan",
                "DapAnB": "Thánh Phaolô",
                "DapAnC": "Thánh Phêrô",
                "DapAnD": "Thánh Tôma",
                "DapAnDung": "C",
                "GiaiThich": "Chúa Giê-su nói với Phêrô: Thầy trao cho anh chìa khóa Nước Trời."
              },
              {
                "STT": 3,
                "CauHoi": "Kinh Thánh Công Giáo trọn bộ gồm có bao nhiêu cuốn sách?",
                "DapAnA": "66 cuốn",
                "DapAnB": "72 cuốn",
                "DapAnC": "73 cuốn",
                "DapAnD": "77 cuốn",
                "DapAnDung": "C",
                "GiaiThich": "Kinh Thánh Công Giáo gồm 73 cuốn (46 Cựu Ước và 27 Tân Ước)."
              }
            ];
            const ws = window.XLSX.utils.json_to_sheet(sampleData);
            window.XLSX.utils.book_append_sheet(wb, ws, "CauHoiKinhThanh");
            window.XLSX.writeFile(wb, `Mau_Cau_Hoi_${gameId}.xlsx`);
          }
        } else {
          alert('Đang tải file mẫu... Hãy lưu ý định dạng các cột: STT, CauHoi, DapAnA, DapAnB, DapAnC, DapAnD, DapAnDung, GiaiThich');
        }
      } catch (err) {
        console.error('Lỗi xuất Excel template:', err);
        alert('Không thể tạo file Excel mẫu: ' + err.message);
      }
    },

    resetGameData: function(gameId, gameTitle) {
      if (confirm(`Bạn có chắc muốn đặt lại dữ liệu mặc định của "${gameTitle}" không?`)) {
        localStorage.removeItem('cg_custom_q_' + gameId);
        localStorage.removeItem('cg_custom_students_' + gameId);
        const metaEl = document.getElementById(`cg-meta-${gameId}`);
        if (metaEl) {
          metaEl.innerHTML = metaEl.getAttribute('data-default-meta') || '';
        }
        alert(`Đã khôi phục thành công dữ liệu gốc của ${gameTitle}!`);
      }
    },

    openCustomizer: function(gameId, gameTitle, isStudentPicker) {
      const existing = document.getElementById('cg-customizer-modal');
      if (existing) existing.remove();

      let currentQuestions = [];
      let currentStudents = [];
      if (isStudentPicker) {
        currentStudents = getCustomStudents(gameId) || [];
      } else {
        currentQuestions = getGameQuestions(gameId, null) || [];
      }

      const modalEl = document.createElement('div');
      modalEl.id = 'cg-customizer-modal';
      modalEl.className = 'cg-customizer-overlay';

      let initialText = '';
      if (isStudentPicker) {
        if (currentStudents.length > 0) {
          initialText = currentStudents.map(s => `${s.christianName || ''} - ${s.fullName || ''} (${s.gender || 'Nam'})`).join('\n');
        }
      } else {
        if (currentQuestions && currentQuestions.length > 0) {
          initialText = currentQuestions.map((q, idx) => {
            const opts = q.options ? q.options.map((opt, oIdx) => `  ${String.fromCharCode(65 + oIdx)}. ${opt}`).join('\n') : '';
            const correctChar = typeof q.correct === 'number' ? String.fromCharCode(65 + q.correct) : (q.correct || 'A');
            return `Câu ${idx + 1}: ${q.q || q.question || ''}\n${opts}\nĐáp án: ${correctChar}\nGiải thích: ${q.explain || q.explanation || ''}`;
          }).join('\n\n');
        }
      }

      modalEl.innerHTML = `
        <div class="cg-customizer-card">
          <div class="cg-customizer-header">
            <h3>
              <i class="fa-solid fa-file-pen" style="color: #0d9488;"></i>
              Soạn & Nạp Dữ Liệu: ${gameTitle}
            </h3>
            <button class="cg-arena-btn-icon" onclick="window.CatechismGames.closeCustomizer()" style="width: 36px; height: 36px; font-size: 1.1rem; border: none; background: #e2e8f0; border-radius: 50%; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="cg-customizer-body">
            <!-- DROPZONE -->
            <div class="cg-dropzone" onclick="document.getElementById('cg-customizer-file-input').click()">
              <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.2rem; color: #0d9488; margin-bottom: 8px;"></i>
              <div style="font-weight: 800; font-size: 1rem; color: #0f172a; margin-bottom: 4px;">
                Bấm để chọn hoặc kéo thả tệp Excel (.xlsx, .xls) / Word (.docx) / TXT
              </div>
              <div style="font-size: 0.82rem; color: #64748b;">
                Tự động nhận diện ${isStudentPicker ? 'Tên Thánh, Họ Tên, Giới tính' : 'Câu hỏi, 4 đáp án A-B-C-D, Đáp án đúng & Giải thích'}
              </div>
              <input type="file" id="cg-customizer-file-input" accept=".xlsx, .xls, .csv, .txt, .docx" style="display: none;">
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <label style="font-size: 0.88rem; font-weight: 800; color: #334155;">
                <i class="fa-solid fa-align-left" style="color: #0d9488;"></i>
                ${isStudentPicker ? 'Danh Sách Học Viên (Tên Thánh - Họ Tên):' : 'Nội Dung Câu Hỏi & Đáp Án:'}
              </label>
              <button onclick="window.CatechismGames.downloadTemplate('${gameId}', '${gameTitle.replace(/'/g, "\\'")}', ${Boolean(isStudentPicker)})" style="background: none; border: none; color: #0d9488; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                <i class="fa-solid fa-download"></i> Tải file mẫu (.xlsx)
              </button>
            </div>

            <textarea id="cg-customizer-text" rows="10" placeholder="${isStudentPicker ? 'Nhập mỗi học sinh một dòng:\nGiuse - Nguyễn Văn An (Nam)\nMaria - Trần Thị Mai (Nữ)...' : 'Nhập câu hỏi theo định dạng:\nCâu 1: Chúa Giê-su sinh ra ở đâu?\n  A. Na-da-rét\n  B. Bê-lem\n  C. Giê-ru-sa-lem\n  D. Ga-li-lê\nĐáp án: B\nGiải thích: Chúa sinh tại Bê-lem xứ Giu-đê...'}" style="width: 100%; box-sizing: border-box; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 12px 14px; font-size: 0.88rem; font-family: monospace; outline: none; resize: vertical; line-height: 1.5; color: #0f172a;">${initialText}</textarea>
          </div>

          <div class="cg-customizer-footer">
            <button onclick="window.CatechismGames.closeCustomizer()" style="padding: 10px 18px; border-radius: 12px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: 700; color: #475569; cursor: pointer;">
              Hủy
            </button>
            <button id="cg-btn-save-custom" style="padding: 10px 22px; border-radius: 12px; background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); color: #fff; border: none; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);">
              <i class="fa-solid fa-check"></i> Lưu & Áp Dụng Ngay
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);

      // File upload handler
      const fileInput = modalEl.querySelector('#cg-customizer-file-input');
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          reader.onload = function(evt) {
            try {
              const data = new Uint8Array(evt.target.result);
              const workbook = window.XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const rows = window.XLSX.utils.sheet_to_json(worksheet);

              if (isStudentPicker) {
                const students = rows.map((r, i) => {
                  const christian = r.TenThanh || r['Tên Thánh'] || r.ChristianName || '';
                  const name = r.HoVaTen || r['Họ và Tên'] || r.FullName || r.Ten || `Học viên ${i + 1}`;
                  const gender = r.GioiTinh || r['Giới tính'] || r.Gender || 'Nam';
                  return { id: 'custom_' + (i + 1), christianName: christian, fullName: name, gender: gender };
                });
                modalEl.querySelector('#cg-customizer-text').value = students.map(s => `${s.christianName || ''} - ${s.fullName || ''} (${s.gender || 'Nam'})`).join('\n');
                alert(`Đã nạp thành công ${students.length} học viên từ file Excel! Bấm "Lưu & Áp Dụng Ngay" để lưu.`);
              } else {
                const questions = rows.map((r, i) => {
                  const qText = r.CauHoi || r['Câu hỏi'] || r.Question || `Câu hỏi ${i + 1}`;
                  const a = String(r.DapAnA || r['Đáp án A'] || r.A || 'Lựa chọn A');
                  const b = String(r.DapAnB || r['Đáp án B'] || r.B || 'Lựa chọn B');
                  const c = String(r.DapAnC || r['Đáp án C'] || r.C || 'Lựa chọn C');
                  const d = String(r.DapAnD || r['Đáp án D'] || r.D || 'Lựa chọn D');
                  const rawAns = String(r.DapAnDung || r['Đáp án đúng'] || r.Correct || 'A').toUpperCase().trim();
                  let correctIdx = 0;
                  if (rawAns === 'B' || rawAns === '1') correctIdx = 1;
                  else if (rawAns === 'C' || rawAns === '2') correctIdx = 2;
                  else if (rawAns === 'D' || rawAns === '3') correctIdx = 3;
                  const explain = r.GiaiThich || r['Giải thích'] || r.Explain || '';
                  return {
                    q: qText,
                    options: [a, b, c, d],
                    correct: correctIdx,
                    explain: explain
                  };
                });
                modalEl.querySelector('#cg-customizer-text').value = questions.map((q, idx) => {
                  const opts = q.options.map((opt, oIdx) => `  ${String.fromCharCode(65 + oIdx)}. ${opt}`).join('\n');
                  return `Câu ${idx + 1}: ${q.q}\n${opts}\nĐáp án: ${String.fromCharCode(65 + q.correct)}\nGiải thích: ${q.explain}`;
                }).join('\n\n');
                alert(`Đã nạp thành công ${questions.length} câu hỏi từ file Excel! Bấm "Lưu & Áp Dụng Ngay" để lưu.`);
              }
            } catch(err) {
              console.error(err);
              alert('Lỗi đọc file Excel: ' + err.message);
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          // Read plain text
          reader.onload = function(evt) {
            modalEl.querySelector('#cg-customizer-text').value = evt.target.result;
          };
          reader.readAsText(file);
        }
      });

      // Save handler
      modalEl.querySelector('#cg-btn-save-custom').addEventListener('click', function() {
        const rawText = modalEl.querySelector('#cg-customizer-text').value.trim();
        if (!rawText) {
          alert('Vui lòng nhập nội dung hoặc nạp file trước khi lưu!');
          return;
        }

        if (isStudentPicker) {
          const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
          const students = lines.map((l, i) => {
            let christian = '';
            let name = l;
            let gender = 'Nam';
            if (l.includes('-')) {
              const parts = l.split('-');
              christian = parts[0].trim();
              name = parts.slice(1).join('-').trim();
            }
            if (name.includes('(') && name.includes(')')) {
              const gMatch = name.match(/\((.*?)\)/);
              if (gMatch) gender = gMatch[1].trim();
              name = name.replace(/\(.*?\)/, '').trim();
            }
            return {
              id: 'custom_' + (i + 1),
              christianName: christian,
              fullName: name,
              gender: gender
            };
          });

          localStorage.setItem('cg_custom_students_' + gameId, JSON.stringify(students));
          const metaEl = document.getElementById(`cg-meta-${gameId}`);
          if (metaEl) metaEl.innerHTML = `${students.length} em (Tùy biến)`;
          alert(`Đã lưu thành công ${students.length} học viên cho "${gameTitle}"!`);
        } else {
          // Parse questions
          const blocks = rawText.split(/(?:^|\n)(?=Câu\s+\d+[:.]?)/i).map(b => b.trim()).filter(Boolean);
          let questions = [];

          if (blocks.length > 0) {
            questions = blocks.map(block => {
              const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
              let qText = lines[0].replace(/^Câu\s+\d+[:.]?\s*/i, '');
              let opts = [];
              let correctIdx = 0;
              let explain = '';

              lines.slice(1).forEach(line => {
                if (/^[A-D][:.]\s*/i.test(line)) {
                  opts.push(line.replace(/^[A-D][:.]\s*/i, ''));
                } else if (/^Đáp\s*án[:.]\s*([A-D])/i.test(line)) {
                  const m = line.match(/^Đáp\s*án[:.]\s*([A-D])/i);
                  if (m) correctIdx = m[1].toUpperCase().charCodeAt(0) - 65;
                } else if (/^Giải\s*thích[:.]\s*/i.test(line)) {
                  explain = line.replace(/^Giải\s*thích[:.]\s*/i, '');
                }
              });

              if (opts.length === 0) {
                opts = ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'];
              }

              return {
                q: qText,
                options: opts,
                correct: Math.max(0, Math.min(opts.length - 1, correctIdx)),
                explain: explain
              };
            });
          }

          if (questions.length === 0) {
            questions = rawText.split('\n').filter(Boolean).map((line, i) => ({
              q: line,
              options: ['Đúng', 'Sai'],
              correct: 0,
              explain: ''
            }));
          }

          localStorage.setItem('cg_custom_q_' + gameId, JSON.stringify(questions));
          const metaEl = document.getElementById(`cg-meta-${gameId}`);
          if (metaEl) metaEl.innerHTML = `${questions.length} câu (Tùy biến)`;
          alert(`Đã lưu thành công ${questions.length} câu hỏi cho "${gameTitle}"! Bấm "Chơi Ngay" để bắt đầu.`);
        }

        window.CatechismGames.closeCustomizer();
      });
    },

    closeCustomizer: function() {
      const modal = document.getElementById('cg-customizer-modal');
      if (modal) modal.remove();
    },

    showGlobalExitFab: function() {
      let fab = document.getElementById('cgGlobalExitFab');
      if (!fab) {
        fab = document.createElement('button');
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

    
    // ------------------------------------------------------------------------
    // 11. ĐUA BI THIÊN THẦN — GỌI TÊN HỌC VIÊN LÊN BẢNG (MARBLE RACE)
    // ------------------------------------------------------------------------
    openMarbleRace: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('marble-race-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);
      if (!roster || roster.length === 0) {
        alert('Chưa có danh sách học sinh. Vui lòng nạp danh sách học sinh trước!');
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = 'cg-marble-race-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #be123c, #881337); border-bottom: 2px solid #f43f5e;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">🏁</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">ĐUA BI THIÊN THẦN — GỌI TÊN HỌC VIÊN LÊN BẢNG</h2>
              <div style="font-size: 0.8rem; color: #fecdd3;">Đua bi thác đổ vật lý rơi tự do qua các tầng mây và chốt nảy thiên quốc</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; display: flex; overflow: hidden; background: #0f172a; position: relative;">
          <!-- Track Canvas -->
          <div style="flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
            <canvas id="cg-marble-canvas" width="600" height="650" style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 3px solid #f43f5e; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 100%; max-height: 85vh;"></canvas>
            <div style="margin-top: 14px; display: flex; gap: 12px;">
              <button id="cg-btn-start-marble" class="cg-btn-play" style="padding: 10px 28px; font-size: 1.05rem; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; border: none; border-radius: 999px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(244,63,94,0.4);">
                <i class="fa-solid fa-play"></i> THẢ BI ĐUA NGAY!
              </button>
            </div>
          </div>

          <!-- Leaderboard on Right -->
          <div style="width: 280px; background: rgba(30, 41, 59, 0.95); border-left: 2px solid rgba(244,63,94,0.3); padding: 18px; display: flex; flex-direction: column; color: #fff;">
            <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; color: #fda4af;">
              <i class="fa-solid fa-trophy"></i> BẢNG ĐUA (${roster.length} em)
            </h3>
            <div id="cg-marble-ranks" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
              ${roster.map((s, idx) => `
                <div style="background: rgba(255,255,255,0.06); padding: 7px 10px; border-radius: 8px; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
                  <span><strong>#${idx + 1}</strong> ${s.christianName || ''} ${s.fullName || ''}</span>
                  <span style="color: #fda4af; font-size: 0.75rem;">Đang chờ</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const canvas = document.getElementById('cg-marble-canvas');
      const ctx = canvas.getContext('2d');
      const startBtn = document.getElementById('cg-btn-start-marble');

      const W = canvas.width;
      const H = canvas.height;

      // Obstacle Pins (Galton Board Style)
      const pins = [];
      const rows = 9;
      for (let r = 0; r < rows; r++) {
        const count = 5 + (r % 2);
        const y = 140 + r * 45;
        const spacing = W / (count + 1);
        for (let c = 1; c <= count; c++) {
          pins.push({ x: c * spacing + (Math.random() * 8 - 4), y: y });
        }
      }

      // Funnel & Finish Line at Bottom
      const finishY = H - 50;

      // Marbles
      const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#fb923c', '#e879f9', '#4ade80'];
      let marbles = roster.map((s, idx) => ({
        id: s.id,
        name: `${s.christianName || ''} ${s.fullName || ''}`.trim(),
        x: W / 2 + (Math.random() * 140 - 70),
        y: 30 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        radius: 11,
        color: colors[idx % colors.length],
        finished: false,
        finishTime: 0
      }));

      function drawTrack() {
        ctx.clearRect(0, 0, W, H);

        // Funnel Walls
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(30, 40);
        ctx.lineTo(100, 110);
        ctx.lineTo(10, H - 70);
        ctx.lineTo(W / 2 - 40, finishY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(W - 30, 40);
        ctx.lineTo(W - 100, 110);
        ctx.lineTo(W - 10, H - 70);
        ctx.lineTo(W / 2 + 40, finishY);
        ctx.stroke();

        // Finish Gate
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(W / 2 - 40, finishY - 4, 80, 8);
        ctx.font = 'bold 12px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('CỔNG THIÊN ĐÀNG', W / 2, finishY + 24);

        // Draw Pins
        pins.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#94a3b8';
          ctx.fill();
        });

        // Draw Marbles
        marbles.forEach(m => {
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Initials or Name
          ctx.font = 'bold 9px Montserrat, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(m.name.slice(0, 6), m.x, m.y - 14);
        });
      }

      drawTrack();

      let racing = false;
      let animId = null;

      startBtn.onclick = function() {
        if (racing) return;
        racing = true;
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        SoundFX.playBell();

        let finishedCount = 0;
        let winners = [];

        function updatePhysics() {
          marbles.forEach(m => {
            if (m.finished) return;

            // Gravity & Friction
            m.vy += 0.18;
            m.vx *= 0.985;
            m.x += m.vx;
            m.y += m.vy;

            // Wall Collisions
            if (m.x - m.radius < 20) { m.x = 20 + m.radius; m.vx = Math.abs(m.vx) * 0.7 + 0.5; }
            if (m.x + m.radius > W - 20) { m.x = W - 20 - m.radius; m.vx = -Math.abs(m.vx) * 0.7 - 0.5; }

            // Pin Collisions
            pins.forEach(p => {
              const dx = m.x - p.x;
              const dy = m.y - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < m.radius + 4) {
                const angle = Math.atan2(dy, dx);
                m.vx = Math.cos(angle) * (2.5 + Math.random());
                m.vy = Math.sin(angle) * 1.5;
                if (Math.random() < 0.2) SoundFX.playTick();
              }
            });

            // Finish check
            if (m.y >= finishY) {
              m.finished = true;
              finishedCount++;
              winners.push(m);
              SoundFX.playPop();

              const ranksEl = document.getElementById('cg-marble-ranks');
              if (ranksEl) {
                ranksEl.innerHTML = winners.map((w, idx) => `
                  <div style="background: ${idx === 0 ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.08)'}; padding: 7px 10px; border-radius: 8px; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between; border: ${idx === 0 ? '1px solid #fbbf24' : 'none'};">
                    <span><strong>#${idx + 1}</strong> ${w.name}</span>
                    <span style="color: ${idx === 0 ? '#fbbf24' : '#34d399'}; font-weight: 800;">${idx === 0 ? '🏆 VỀ NHẤT' : 'Hạng ' + (idx + 1)}</span>
                  </div>
                `).join('');
              }

              if (winners.length === 1) {
                fireConfetti();
                setTimeout(() => {
                  window.CatechismGames.showWinnerModal(
                    `🎉 CHÚC MỪNG CHIẾN THẮNG: ${m.name}!`,
                    `Bi của em <strong>${m.name}</strong> đã xuất sắc vượt qua các chốt nảy thiên quốc và cán đích Đền Thờ đầu tiên!<br><span style="color: #fbbf24;">"Ai bền đỗ đến cùng, kẻ ấy sẽ được cứu độ!" (Mt 24, 13)</span>`
                  );
                }, 1000);
              }
            }
          });

          drawTrack();

          if (finishedCount < marbles.length && racing) {
            animId = requestAnimationFrame(updatePhysics);
          }
        }

        animId = requestAnimationFrame(updatePhysics);
      };

      overlay._cleanupKey = function() {
        racing = false;
        if (animId) cancelAnimationFrame(animId);
      };
    },

    // ------------------------------------------------------------------------
    // 12. CUỘC ĐUA TRÊN SÔNG GIO-ĐAN (DUCK / BOAT RACE)
    // ------------------------------------------------------------------------
    openDuckRace: function() {
      // Tận dụng đấu trường đua thuyền Nô-ê sống động trên sông Gio-đan
      window.CatechismGames.openNoahArkRace();
    },

    // ------------------------------------------------------------------------
    // 13. CUỘC ĐUA ĐÀN CHIÊN CỦA NGƯỜI MỤC TỬ (TURTLE / SHEEP RACE)
    // ------------------------------------------------------------------------
    openTurtleRace: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('turtle-race-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);

      const overlay = document.createElement('div');
      overlay.id = 'cg-turtle-race-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #059669, #047857); border-bottom: 2px solid #34d399;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">🐑</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">CUỘC ĐUA ĐÀN CHIÊN CỦA NGƯỜI MỤC TỬ</h2>
              <div style="font-size: 0.8rem; color: #a7f3d0;">Đàn chiên hiền lành đua nhau về đồng cỏ xanh tươi bên suối mát</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; padding: 24px; overflow-y: auto; background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%); display: flex; flex-direction: column; align-items: center;">
          <div style="width: 100%; max-width: 900px; background: #ffffff; border-radius: 18px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 2px solid #a7f3d0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <div style="font-weight: 800; color: #065f46; font-size: 1.1rem;">
                <i class="fa-solid fa-flag-checkered"></i> ĐƯỜNG ĐUA ĐỒNG CỎ XANH TƯƠI
              </div>
              <button id="cg-btn-start-turtle" class="cg-btn-play" style="padding: 10px 28px; font-size: 1rem; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; border-radius: 999px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(16,185,129,0.4);">
                <i class="fa-solid fa-play"></i> BẮT ĐẦU ĐUA!
              </button>
            </div>

            <div id="cg-turtle-tracks-list" style="display: flex; flex-direction: column; gap: 14px;">
              ${roster.slice(0, 8).map((s, idx) => `
                <div style="background: #f0fdf4; border-radius: 12px; padding: 10px 14px; border: 1.5px solid #bbf7d0; position: relative;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: #0f172a;">
                    <span>🐑 Làn ${idx + 1}: <strong>${s.christianName || ''} ${s.fullName || ''}</strong></span>
                    <span id="cg-turtle-pct-${idx}" style="color: #059669; font-weight: 800;">0%</span>
                  </div>
                  <div style="height: 18px; background: #e2e8f0; border-radius: 999px; overflow: hidden; position: relative;">
                    <div id="cg-turtle-bar-${idx}" style="height: 100%; width: 0%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 999px; transition: width 0.15s ease;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const startBtn = document.getElementById('cg-btn-start-turtle');
      let racing = false;
      const count = Math.min(roster.length, 8);
      let progress = new Array(count).fill(0);

      startBtn.onclick = function() {
        if (racing) return;
        racing = true;
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        SoundFX.playBell();

        const interval = setInterval(() => {
          let winnerIdx = -1;
          for (let i = 0; i < count; i++) {
            progress[i] += Math.random() * 2.8 + 0.4;
            const bar = document.getElementById(`cg-turtle-bar-${i}`);
            const pct = document.getElementById(`cg-turtle-pct-${i}`);
            if (bar) bar.style.width = Math.min(100, progress[i]) + '%';
            if (pct) pct.textContent = Math.floor(Math.min(100, progress[i])) + '%';

            if (progress[i] >= 100 && winnerIdx === -1) {
              winnerIdx = i;
            }
          }

          if (winnerIdx !== -1) {
            clearInterval(interval);
            racing = false;
            fireConfetti();
            const winStudent = roster[winnerIdx];
            SoundFX.playHarp();
            setTimeout(() => {
              window.CatechismGames.showWinnerModal(
                `🎉 CHÚC MỪNG CHIẾN THẮNG: ${winStudent.christianName || ''} ${winStudent.fullName || ''}!`,
                `Chú chiên ngoan hiền của em <strong>${winStudent.christianName || ''} ${winStudent.fullName || ''}</strong> đã chạy nhanh nhất về đồng cỏ bình an của Chúa!<br><span style="color: #fbbf24;">"Chúa là Mục Tử chăn dắt tôi, tôi chẳng thiếu thốn gì!" (Tv 23, 1)</span>`
              );
            }, 600);
          }
        }, 120);

        overlay._cleanupKey = function() {
          clearInterval(interval);
        };
      };
    },

    // ------------------------------------------------------------------------
    // 14. MÁY GẮP QUÀ ÂN SỦNG — GẮP THÚ THIÊN THẦN (CLAW MACHINE)
    // ------------------------------------------------------------------------
    openClawMachine: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('claw-machine-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);

      const overlay = document.createElement('div');
      overlay.id = 'cg-claw-machine-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); border-bottom: 2px solid #c084fc;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">🧸</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">MÁY GẮP QUÀ ÂN SỦNG — GẮP THÚ THIÊN THẦN</h2>
              <div style="font-size: 0.8rem; color: #e9d5ff;">Mô phỏng máy gắp quà thần kỳ gắp ngẫu nhiên học viên lên nhận thưởng</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%);">
          <!-- Glass Arcade Booth -->
          <div style="width: 440px; height: 500px; background: rgba(255,255,255,0.06); border: 4px solid #a855f7; border-radius: 24px; position: relative; overflow: hidden; box-shadow: 0 15px 40px rgba(168,85,247,0.3); display: flex; flex-direction: column;">
            <!-- Claw Crane -->
            <div id="cg-claw-arm" style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 6px; height: 60px; background: #e2e8f0; transition: height 1.2s ease, left 0.8s ease; z-index: 10;">
              <div style="position: absolute; bottom: -20px; left: -14px; font-size: 1.8rem;">🦾</div>
            </div>

            <!-- Soft Toys & Gifts Pool -->
            <div style="margin-top: auto; padding: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; background: rgba(0,0,0,0.4); border-radius: 0 0 20px 20px;">
              ${roster.slice(0, 12).map(s => `
                <div class="cg-claw-item" style="background: rgba(255,255,255,0.12); border-radius: 12px; padding: 10px 4px; text-align: center; border: 1.5px solid rgba(168,85,247,0.4);">
                  <div style="font-size: 1.8rem; margin-bottom: 4px;">🎁</div>
                  <div style="font-size: 0.72rem; color: #fff; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.christianName || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Controller Buttons -->
          <div style="margin-top: 24px;">
            <button id="cg-btn-drop-claw" class="cg-btn-play" style="padding: 14px 42px; font-size: 1.15rem; background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; border: none; border-radius: 999px; font-weight: 900; cursor: pointer; box-shadow: 0 6px 20px rgba(168,85,247,0.4);">
              <i class="fa-solid fa-hand-pointer"></i> HẠ TAY GẮP ÂN SỦNG!
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const dropBtn = document.getElementById('cg-btn-drop-claw');
      const clawArm = document.getElementById('cg-claw-arm');
      let grabbing = false;

      dropBtn.onclick = function() {
        if (grabbing) return;
        grabbing = true;
        dropBtn.disabled = true;
        dropBtn.style.opacity = '0.5';
        SoundFX.playTick();

        // Random target
        const randomX = Math.floor(Math.random() * 60 + 20);
        clawArm.style.left = randomX + '%';

        setTimeout(() => {
          clawArm.style.height = '320px';
          SoundFX.playPop();

          setTimeout(() => {
            const luckyStudent = roster[Math.floor(Math.random() * roster.length)];
            clawArm.style.height = '60px';
            SoundFX.playHarp();
            fireConfetti();

            setTimeout(() => {
              window.CatechismGames.showWinnerModal(
                `🎉 ĐÃ GẮP ĐƯỢC: ${luckyStudent.christianName || ''} ${luckyStudent.fullName || ''}!`,
                `Tay gắp ân sủng đã gắp trúng món quà mang tên học viên <strong>${luckyStudent.christianName || ''} ${luckyStudent.fullName || ''}</strong> lên nhận phần thưởng!<br><span style="color: #fbbf24;">"Phúc cho ai có lòng trong sạch, vì họ sẽ được nhìn ngắm Thiên Chúa!" (Mt 5, 8)</span>`
              );
              grabbing = false;
              dropBtn.disabled = false;
              dropBtn.style.opacity = '1';
            }, 1200);
          }, 1300);
        }, 800);
      };
    },

    // ------------------------------------------------------------------------
    // 15. PHÂN ĐỘI THIẾU NHI THÁNH THỂ (STUDENT GROUP DIVIDER)
    // ------------------------------------------------------------------------
    openStudentGroupDivider: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('student-group-divider-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);

      const overlay = document.createElement('div');
      overlay.id = 'cg-group-divider-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #d97706, #b45309); border-bottom: 2px solid #fbbf24;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">⚜️</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">PHÂN ĐỘI THIẾU NHI THÁNH THỂ BÍ MẬT</h2>
              <div style="font-size: 0.8rem; color: #fef3c7;">Chia nhóm tự động & bốc thăm phân đội với huy hiệu ngành TNTT</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; padding: 24px; overflow-y: auto; background: #0f172a; display: flex; flex-direction: column; align-items: center;">
          <!-- Controls Bar -->
          <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center; justify-content: center; margin-bottom: 24px; background: rgba(255,255,255,0.06); padding: 14px 20px; border-radius: 16px; border: 1.5px solid rgba(251,191,36,0.3);">
            <div style="color: #fff; font-weight: 700; font-size: 0.92rem;">
              <i class="fa-solid fa-users"></i> Số đội phân chia:
            </div>
            <select id="cg-group-count-select" style="padding: 8px 14px; border-radius: 10px; font-weight: 800; background: #1e293b; color: #fbbf24; border: 1.5px solid #fbbf24; outline: none;">
              <option value="2">2 Đội (Phê-rô & Phao-lô)</option>
              <option value="4" selected>4 Đội (Chiên Con, Ấu, Thiếu, Nghĩa)</option>
              <option value="6">6 Đội (6 Tông Đồ Thánh)</option>
              <option value="8">8 Đội (8 Mối Phúc Thật)</option>
            </select>

            <button id="cg-btn-shuffle-teams" class="cg-btn-play" style="padding: 9px 24px; font-size: 0.95rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border: none; border-radius: 999px; font-weight: 800; cursor: pointer;">
              <i class="fa-solid fa-shuffle"></i> BỐC THĂM PHÂN ĐỘI
            </button>
            <button id="cg-btn-copy-teams" class="cg-btn-secondary" style="padding: 9px 18px; font-size: 0.9rem; background: #0284c7; color: #fff; border: none; border-radius: 999px; font-weight: 700; cursor: pointer;">
              <i class="fa-regular fa-copy"></i> Sao chép danh sách
            </button>
          </div>

          <!-- Groups Grid Container -->
          <div id="cg-groups-result-grid" style="width: 100%; max-width: 1200px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;"></div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const teamNames = [
        { name: 'Đội Chiên Con (Hồng Phúc)', color: '#ec4899', icon: '🐑' },
        { name: 'Đội Ấu Nhi (Xanh Lá)', color: '#10b981', icon: '🌿' },
        { name: 'Đội Thiếu Nhi (Xanh Biển)', color: '#0284c7', icon: '⚓' },
        { name: 'Đội Nghĩa Sĩ (Vàng Nắng)', color: '#f59e0b', icon: '⚜️' },
        { name: 'Đội Thánh Phê-rô', color: '#8b5cf6', icon: '🗝️' },
        { name: 'Đội Thánh Phao-lô', color: '#ef4444', icon: '⚔️' },
        { name: 'Đội Thánh Gio-an', color: '#06b6d4', icon: '🦅' },
        { name: 'Đội Thánh Gia-cô-bê', color: '#14b8a6', icon: '⭐' }
      ];

      function divideTeams() {
        SoundFX.playBell();
        const numTeams = parseInt(document.getElementById('cg-group-count-select').value, 10);
        const shuffled = [...roster].sort(() => Math.random() - 0.5);
        const teams = Array.from({ length: numTeams }, () => []);

        shuffled.forEach((s, idx) => {
          teams[idx % numTeams].push(s);
        });

        const grid = document.getElementById('cg-groups-result-grid');
        grid.innerHTML = teams.map((team, idx) => {
          const tInfo = teamNames[idx % teamNames.length];
          return `
            <div style="background: rgba(30, 41, 59, 0.95); border: 2px solid ${tInfo.color}; border-radius: 16px; padding: 18px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 1.8rem;">${tInfo.icon}</span>
                <div>
                  <h4 style="color: ${tInfo.color}; font-weight: 800; font-size: 1.05rem;">${tInfo.name}</h4>
                  <div style="font-size: 0.78rem; color: #94a3b8;">${team.length} thành viên</div>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                ${team.map((s, mIdx) => `
                  <div style="background: rgba(255,255,255,0.06); padding: 7px 12px; border-radius: 8px; color: #f1f5f9; font-size: 0.88rem; display: flex; align-items: center; justify-content: space-between;">
                    <span><strong>${mIdx + 1}.</strong> ${s.christianName || ''} ${s.fullName || ''}</span>
                    <span style="font-size: 0.75rem; color: #64748b;">${s.gender || ''}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('');
        fireConfetti();
      }

      divideTeams();

      document.getElementById('cg-btn-shuffle-teams').onclick = divideTeams;
      document.getElementById('cg-btn-copy-teams').onclick = function() {
        const text = document.getElementById('cg-groups-result-grid').innerText;
        navigator.clipboard.writeText(text).then(() => {
          alert('🎉 Đã sao chép danh sách phân đội vào bộ nhớ tạm thành công!');
        });
      };
    },

    // ------------------------------------------------------------------------
    // 16. CỖ XE LỬA TIÊN TRI Ê-LI-A LÊN TẦNG TRỜI (ASTRONAUT EXPLORER)
    // ------------------------------------------------------------------------
    openAstronautExplorer: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('astronaut-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);

      const overlay = document.createElement('div');
      overlay.id = 'cg-astronaut-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #3730a3, #1e1b4b); border-bottom: 2px solid #6366f1;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">🚀</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">CỖ XE LỬA TIÊN TRI Ê-LI-A LÊN TẦNG TRỜI</h2>
              <div style="font-size: 0.8rem; color: #c7d2fe;">Bay vút qua các tầng trời chọn ra tinh tú mang tên học viên may mắn</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at center, #1e1b4b 0%, #020617 100%); position: relative; overflow: hidden; padding: 20px;">
          <!-- Big Launch Pad Display -->
          <div id="cg-astro-countdown" style="font-size: 5rem; font-weight: 900; color: #fbbf24; text-shadow: 0 0 30px rgba(251,191,36,0.6); margin-bottom: 20px;">
            READY!
          </div>

          <div id="cg-astro-rocket" style="font-size: 5.5rem; transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 0 20px rgba(239,68,68,0.6));">
            🚀
          </div>

          <div style="margin-top: 36px;">
            <button id="cg-btn-launch-astro" class="cg-btn-play" style="padding: 14px 44px; font-size: 1.15rem; background: linear-gradient(135deg, #6366f1, #4338ca); color: #fff; border: none; border-radius: 999px; font-weight: 900; cursor: pointer; box-shadow: 0 6px 20px rgba(99,102,241,0.5);">
              <i class="fa-solid fa-fire"></i> ĐẾM NGƯỢC & CẤT CÁNH!
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const launchBtn = document.getElementById('cg-btn-launch-astro');
      const countEl = document.getElementById('cg-astro-countdown');
      const rocketEl = document.getElementById('cg-astro-rocket');

      launchBtn.onclick = function() {
        launchBtn.disabled = true;
        launchBtn.style.opacity = '0.5';

        let count = 3;
        countEl.textContent = count;
        SoundFX.playTick();

        const timer = setInterval(() => {
          count--;
          if (count > 0) {
            countEl.textContent = count;
            SoundFX.playTick();
          } else {
            clearInterval(timer);
            countEl.textContent = 'CẤT CÁNH! 🔥';
            SoundFX.playBell();
            rocketEl.style.transform = 'translateY(-260px) scale(1.6)';
            rocketEl.style.opacity = '0.2';

            setTimeout(() => {
              const lucky = roster[Math.floor(Math.random() * roster.length)];
              fireConfetti();
              SoundFX.playHarp();
              window.CatechismGames.showWinnerModal(
                `🎉 TINH TÚ GỌI TÊN: ${lucky.christianName || ''} ${lucky.fullName || ''}!`,
                `Cỗ xe lửa tiên tri Ê-li-a đã đáp xuống tinh tú mang tên em <strong>${lucky.christianName || ''} ${lucky.fullName || ''}</strong>!<br><span style="color: #fbbf24;">"Những ai công chính sẽ chói lọi như mặt trời trong Nước của Cha họ!" (Mt 13, 43)</span>`
              );
              rocketEl.style.transform = 'none';
              rocketEl.style.opacity = '1';
              launchBtn.disabled = false;
              launchBtn.style.opacity = '1';
              countEl.textContent = 'READY!';
            }, 1600);
          }
        }, 1000);
      };
    },

    // ------------------------------------------------------------------------
    // 17. CHIẾC RƯƠNG BÍ MẬT & BỒ CÂU BÌNH AN (MAGIC HAT)
    // ------------------------------------------------------------------------
    openMagicHat: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('magic-hat-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);

      const overlay = document.createElement('div');
      overlay.id = 'cg-magichat-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #be123c, #9f1239); border-bottom: 2px solid #fb7185;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">🕊️</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">CHIẾC RƯƠNG BÍ MẬT & BỒ CÂU BÌNH AN</h2>
              <div style="font-size: 0.8rem; color: #fecdd3;">Chim bồ câu trắng tung cánh mang dải lụa ghi tên học sinh vinh danh</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at center, #881337 0%, #0f172a 100%); padding: 20px;">
          <div id="cg-dove-box" style="font-size: 7rem; cursor: pointer; transition: transform 0.3s; filter: drop-shadow(0 10px 25px rgba(251,191,36,0.4));">
            📦
          </div>
          <div id="cg-dove-message" style="margin-top: 20px; font-size: 1.2rem; font-weight: 800; color: #fef08a;">
            Bấm nút bên dưới để mở rương thánh!
          </div>

          <div style="margin-top: 30px;">
            <button id="cg-btn-open-box" class="cg-btn-play" style="padding: 14px 40px; font-size: 1.1rem; background: linear-gradient(135deg, #f43f5e, #be123c); color: #fff; border: none; border-radius: 999px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 18px rgba(244,63,94,0.4);">
              <i class="fa-solid fa-wand-magic-sparkles"></i> MỞ RƯƠNG THÁNH NGAY!
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const btn = document.getElementById('cg-btn-open-box');
      const box = document.getElementById('cg-dove-box');
      const msg = document.getElementById('cg-dove-message');

      btn.onclick = function() {
        btn.disabled = true;
        SoundFX.playPop();
        box.style.transform = 'scale(1.2) rotate(10deg)';

        setTimeout(() => {
          box.textContent = '🕊️';
          box.style.transform = 'scale(1.4) translateY(-30px)';
          SoundFX.playHarp();
          fireConfetti();
          const lucky = roster[Math.floor(Math.random() * roster.length)];
          msg.innerHTML = `Chim bồ câu mang tên: <strong style="color:#38bdf8;">${lucky.christianName || ''} ${lucky.fullName || ''}</strong>!`;

          setTimeout(() => {
            window.CatechismGames.showWinnerModal(
              `🎉 CHÚC MỪNG: ${lucky.christianName || ''} ${lucky.fullName || ''}!`,
              `Chim bồ câu ân sủng đã mang theo dải lụa chúc lành cho em <strong>${lucky.christianName || ''} ${lucky.fullName || ''}</strong>!<br><span style="color: #fbbf24;">"Bình an cho các con!" (Lc 24, 36)</span>`
            );
            btn.disabled = false;
            box.textContent = '📦';
            box.style.transform = 'none';
          }, 1200);
        }, 600);
      };
    },

    // ------------------------------------------------------------------------
    // 18. SÁCH SỰ SỐNG TRIỆU HỒI (MAGIC GRIMOIRE)
    // ------------------------------------------------------------------------
    openMagicGrimoire: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      const customRoster = getCustomStudents('magic-grimoire-quiz');
      let roster = (customRoster && customRoster.length > 0) ? customRoster : getStudentRoster(selectedClassId);

      const overlay = document.createElement('div');
      overlay.id = 'cg-grimoire-arena';
      overlay.className = 'cg-arena-overlay';
      overlay.innerHTML = `
        <div class="cg-arena-header" style="background: linear-gradient(135deg, #b45309, #78350f); border-bottom: 2px solid #f59e0b;">
          <div class="cg-arena-title">
            <span style="font-size: 1.5rem;">📖</span>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">SÁCH SỰ SỐNG TRIỆU HỒI HỌC VIÊN</h2>
              <div style="font-size: 0.8rem; color: #fde68a;">Lật mở trang sách cổ mạ vàng ghi tên những người thuộc về Thiên Chúa</div>
            </div>
          </div>
          <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at center, #451a03 0%, #0f172a 100%); padding: 20px;">
          <!-- Book Container -->
          <div id="cg-grimoire-book" style="width: 480px; height: 320px; background: linear-gradient(135deg, #fef3c7, #fde68a); border: 8px solid #78350f; border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 24px; text-align: center; color: #451a03; position: relative;">
            <div id="cg-grimoire-text" style="font-size: 1.6rem; font-weight: 900; font-family: Georgia, serif;">
              ✨ SÁCH SỰ SỐNG ✨<br>
              <span style="font-size: 0.95rem; font-weight: 600; color: #78350f;">Hãy bấm nút bên dưới để lật mở trang sách</span>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <button id="cg-btn-flip-book" class="cg-btn-play" style="padding: 14px 44px; font-size: 1.15rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border: none; border-radius: 999px; font-weight: 900; cursor: pointer; box-shadow: 0 6px 20px rgba(245,158,11,0.4);">
              <i class="fa-solid fa-book-open"></i> LẬT MỞ TRANG SÁCH!
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();

      const btn = document.getElementById('cg-btn-flip-book');
      const textEl = document.getElementById('cg-grimoire-text');

      btn.onclick = function() {
        btn.disabled = true;
        let count = 0;
        const interval = setInterval(() => {
          count++;
          SoundFX.playTick();
          const rStudent = roster[Math.floor(Math.random() * roster.length)];
          textEl.innerHTML = `📜 Đang lật sách...<br><span style="font-size: 1.8rem; color: #b45309;">${rStudent.christianName || ''} ${rStudent.fullName || ''}</span>`;
          if (count > 15) {
            clearInterval(interval);
            SoundFX.playHarp();
            fireConfetti();
            const lucky = roster[Math.floor(Math.random() * roster.length)];
            textEl.innerHTML = `✨ TÊN ĐƯỢC GHI TRONG SÁCH: ✨<br><span style="font-size: 2.1rem; color: #991b1b; font-weight: 900;">${lucky.christianName || ''} ${lucky.fullName || ''}</span>`;

            setTimeout(() => {
              window.CatechismGames.showWinnerModal(
                `🎉 DANH TÁNH ĐÃ ĐƯỢC GHI NHẬN: ${lucky.christianName || ''} ${lucky.fullName || ''}!`,
                `Sách Sự Sống đã lật mở trang trang trọng gọi tên em <strong>${lucky.christianName || ''} ${lucky.fullName || ''}</strong>!<br><span style="color: #fbbf24;">"Hãy mừng vì tên anh em đã được ghi trên trời!" (Lc 10, 20)</span>`
              );
              btn.disabled = false;
            }, 1000);
          }
        }, 100);
      };
    },

    // ------------------------------------------------------------------------
    // 19 - 35. TRƯỜNG ĐẤU TRẮC NGHIỆM & ĐỐI KHÁNG CÔNG GIÁO TOÀN DIỆN
    // (Universal Catholic Arena Engine for All Quiz & Reflex Games)
    // ------------------------------------------------------------------------
    openUniversalCatholicArena: function(gameId, customTitle, defaultQ) {
      SoundFX.playBell();
      const questions = getGameQuestions(gameId, defaultQ);
      let currentQIndex = 0;
      let score = 0;

      const overlay = document.createElement('div');
      overlay.id = 'cg-universal-arena';
      overlay.className = 'cg-arena-overlay';

      function renderCurrentQuestion() {
        if (currentQIndex >= questions.length) {
          fireConfetti();
          SoundFX.playHarp();
          overlay.remove();
          window.CatechismGames.showWinnerModal(
            `🎉 HOÀN THÀNH XUẤT SẮC: ${score}/${questions.length} ĐIỂM!`,
            `Em đã hoàn tất bài thi đua với kết quả tuyệt vời!<br><span style="color: #fbbf24;">"Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi!" (Tv 119, 105)</span>`
          );
          return;
        }

        const q = questions[currentQIndex];
        const opts = q.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'];
        const correctIdx = typeof q.correct === 'number' ? q.correct : (typeof q.correct === 'string' ? q.correct.charCodeAt(0) - 65 : 0);

        overlay.innerHTML = `
          <div class="cg-arena-header" style="background: linear-gradient(135deg, #0f172a, #1e3a8a); border-bottom: 2px solid #f59e0b;">
            <div class="cg-arena-title">
              <span style="font-size: 1.5rem;">✝️</span>
              <div>
                <h2 style="font-size: 1.25rem; font-weight: 900; color: #fff;">${customTitle}</h2>
                <div style="font-size: 0.8rem; color: #cbd5e1;">Câu hỏi ${currentQIndex + 1} / ${questions.length} • Điểm số: <strong style="color: #fbbf24;">${score}</strong></div>
              </div>
            </div>
            <button class="cg-arena-btn-exit" onclick="window.CatechismGames.closeActiveGame()" title="Thoát trò chơi (ESC)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(180deg, #0b1329 0%, #030712 100%);">
            <div style="width: 100%; max-width: 860px; background: rgba(30, 41, 59, 0.95); border: 2px solid rgba(245,158,11,0.4); border-radius: 20px; padding: 32px; box-shadow: 0 15px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 1.35rem; font-weight: 800; color: #ffffff; line-height: 1.5; margin-bottom: 28px; text-align: center;">
                <span style="color: #f59e0b;">Câu ${currentQIndex + 1}:</span> ${q.q || q.question}
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                ${opts.map((opt, oIdx) => `
                  <button class="cg-arena-opt-btn" data-oidx="${oIdx}" style="background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 18px 20px; color: #fff; font-size: 1.05rem; font-weight: 700; text-align: left; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;">
                    <span style="width: 34px; height: 34px; border-radius: 50%; background: #f59e0b; color: #0f172a; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${String.fromCharCode(65 + oIdx)}</span>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        const optBtns = overlay.querySelectorAll('.cg-arena-opt-btn');
        optBtns.forEach(b => {
          b.onclick = function() {
            const picked = parseInt(b.getAttribute('data-oidx'), 10);
            optBtns.forEach(btn => btn.disabled = true);
            if (picked === correctIdx) {
              b.style.background = '#059669';
              b.style.borderColor = '#34d399';
              score++;
              SoundFX.playPop();
              fireConfetti();
            } else {
              b.style.background = '#dc2626';
              b.style.borderColor = '#f87171';
              SoundFX.playWrong();
              if (optBtns[correctIdx]) {
                optBtns[correctIdx].style.background = '#059669';
                optBtns[correctIdx].style.borderColor = '#34d399';
              }
            }

            setTimeout(() => {
              currentQIndex++;
              renderCurrentQuestion();
            }, 1200);
          };
        });
      }

      document.body.appendChild(overlay);
      window.CatechismGames.showGlobalExitFab();
      renderCurrentQuestion();
    },

    // Concrete Wrappers for all remaining games
    openHeartPuzzleGame: function() {
      const defaultQ = [
        { question: "Mẹ Maria được chào chúc là 'Đầy ơn phúc' trong biến cố nào?", options: ["Truyền Tin", "Thăm viếng", "Giáng sinh", "Dâng Chúa trong Đền Thờ"], correct: 0 },
        { question: "Lời xin vâng nổi tiếng của Mẹ Maria là gì?", options: ["Xin vâng ý Chúa", "Này tôi là tôi tớ Chúa", "Xin Chúa xót thương", "Lạy Chúa xin hãy phán"], correct: 1 },
        { question: "Bài ca chúc tụng tuyệt mỹ mà Mẹ Maria cất lên tại nhà bà Ê-li-sa-bét là gì?", options: ["Kinh Lạy Cha", "Kinh Kính Mừng", "Kinh Magnificat (Ngợi Khen)", "Kinh Tin Kính"], correct: 2 },
        { question: "Tại tiệc cưới Ca-na, Mẹ Maria đã dặn dò các gia nhân điều gì?", options: ["Hãy cầu nguyện liên lỉ", "Người bảo gì, các anh cứ việc làm theo", "Hãy rót thêm rượu", "Hãy mời khách dự tiệc"], correct: 1 },
        { question: "Dưới chân Thập Giá, Chúa Giê-su đã trao phó Mẹ Maria cho môn đệ nào?", options: ["Phê-rô", "Gio-an", "Gia-cô-bê", "Tô-ma"], correct: 1 }
      ];
      window.CatechismGames.openUniversalCatholicArena('heart-puzzle-2010', '💖 GIẢI MÃ BỨC TRANH TRÁI TIM MẸ MARIA', defaultQ);
    },

    openIndoorPEDanceGame: function() {
      const defaultQ = [
        { question: "Khẩu hiệu chính thức của phong trào Thiếu Nhi Thánh Thể là gì?", options: ["Hi sinh - Cầu nguyện", "Cầu nguyện - Rước Lễ - Hi sinh - Làm Tông đồ", "Bác ái - Yêu thương", "Vâng phục - Khiêm nhường"], correct: 1 },
        { question: "Bài hát truyền thống của Thiếu Nhi Thánh Thể Việt Nam là gì?", options: ["Kinh Hòa Bình", "Thiếu Nhi Tân Hành Ca", "Tình Chúa Cao Vời", "Lời Tạ Ơn"], correct: 1 },
        { question: "Khăn quàng của ngành Ấu Nhi Thiếu Nhi Thánh Thể có màu gì?", options: ["Màu Xanh Lá Mạ", "Màu Xanh Biển", "Màu Vàng", "Màu Đỏ"], correct: 0 },
        { question: "Khăn quàng của ngành Thiếu Nhi có màu gì?", options: ["Màu Xanh Biển", "Màu Vàng", "Màu Đỏ", "Màu Trắng"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('indoor-pe-dance', '🏃‍♂️ VŨ ĐIỆU THÁNH CA & KHỞI ĐỘNG TNTT', defaultQ);
    },

    openPoseImitationGame: function() {
      const defaultQ = [
        { question: "Tư thế chắp tay trước ngực khi cầu nguyện mang ý nghĩa gì?", options: ["Tập trung tâm hồn hướng về Chúa", "Sợ hãi", "Nghỉ ngơi", "Mệt mỏi"], correct: 0 },
        { question: "Khi đọc Kinh Tin Kính đến câu 'Bởi phép Đức Chúa Thánh Thần...', phụng vụ dạy ta làm gì?", options: ["Cúi mình sâu", "Quỳ gối", "Đứng nghiêm", "Làm dấu Thánh Giá"], correct: 0 },
        { question: "Cử chỉ đấm ngực trong Kinh Cáo Mình ('Lỗi tại tôi...') biểu lộ tâm tình gì?", options: ["Ăn năn sám hối khiêm nhường", "Tức giận", "Tự hào", "Đau đớn"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('pose-imitation', '🧘‍♂️ BẮT CHƯỚC CỬ ĐIỆU THÁNH CA MAU LẸ', defaultQ);
    },

    openMosquitoSlayerGame: function() {
      const defaultQ = [
        { question: "Cậu bé Đa-vít đã dùng vũ khí gì để chiến thắng gã khổng lồ Goliath?", options: ["Gươm giáo", "Cung tên", "Ná bắn đá và 5 viên sỏi suối", "Lao phóng"], correct: 2 },
        { question: "Khi răn đe ma quỷ rình mò như thú dữ, Thánh Phê-rô khuyên tín hữu điều gì?", options: ["Hãy trốn chạy", "Hãy tiết độ và tỉnh thức", "Hãy ngủ yên", "Hãy lo âu"], correct: 1 },
        { question: "Đấng Mục Tử Nhân Lành sẵn sàng làm gì vì đàn chiên?", options: ["Bỏ rơi chiên khi thấy sói", "Hy sinh tính mạng vì đàn chiên", "Đánh đuổi chiên đi", "Thu lợi từ chiên"], correct: 1 }
      ];
      window.CatechismGames.openUniversalCatholicArena('mosquito-slayer', '🐑 ĐA-VÍT BẢO VỆ ĐÀN CHIEN XUA ĐUỔI CHÓ SÓI', defaultQ);
    },

    openMarioRaceGame: function() {
      const defaultQ = [
        { question: "Thức ăn kỳ diệu Thiên Chúa ban cho dân Do Thái ăn suốt 40 năm trong sa mạc là gì?", options: ["Bánh Manna và chim cút", "Bánh mì đen", "Trái cây rừng", "Bánh tráng"], correct: 0 },
        { question: "Biển nào đã rẽ ra làm hai để ông Mô-sê dẫn dân vượt qua an toàn?", options: ["Biển Hồ Ga-li-lê", "Biển Đỏ", "Địa Trung Hải", "Biển Chết"], correct: 1 },
        { question: "Nơi Chúa ban Mười Điều Răn cho ông Mô-sê là núi nào?", options: ["Núi Sinai (Hô-rép)", "Núi Cát-minh", "Núi Cây Dầu", "Núi Ta-bo"], correct: 0 },
        { question: "Miền Đất Hứa mà Chúa hứa ban cho dân tộc tuyển chọn chảy tràn cái gì?", options: ["Vàng và bạc", "Sữa và mật ong", "Dầu và rượu", "Nước suối và hoa"], correct: 1 }
      ];
      window.CatechismGames.openUniversalCatholicArena('mario-race', '🍄 HÀNH TRÌNH VỀ MIỀN ĐẤT HỨA RETRO 8-BIT', defaultQ);
    },

    openCrosswordLock: function() {
      const defaultQ = [
        { question: "Nơi Chúa Giê-su giáng sinh làm người (gồm 5 chữ cái tiếng Việt)?", options: ["BE LEM", "NA DA", "GIE RU", "RO MA"], correct: 0 },
        { question: "Vị lãnh tụ dẫn dân Ít-ra-en ra khỏi đất Ai-cập?", options: ["MO SE", "NO E", "DA VIT", "A DANG"], correct: 0 },
        { question: "Tên vị Tông đồ trưởng được Chúa trao chìa khóa Nước Trời?", options: ["PHE RO", "GIO AN", "PHAOLO", "TO MA"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('crossword-lock', '🔤 Ô CHỮ KINH THÁNH & CHÌA KHÓA CỨU ĐỘ', defaultQ);
    },

    openKnowledgeTrain: function() {
      const defaultQ = [
        { question: "Biến cố nào xảy ra ĐẦU TIÊN trong Lịch sử Cứu Độ?", options: ["Thiên Chúa sáng tạo trời đất vạn vật", "Chúa Giê-su giáng sinh", "Dân Do Thái vượt Biển Đỏ", "Chúa Giê-su chịu khổ nạn"], correct: 0 },
        { question: "Thứ tự đúng của 4 Mùa Phụng Vụ trong năm là gì?", options: ["Mùa Vọng -> Mùa Giáng Sinh -> Mùa Chay -> Mùa Phục Sinh", "Mùa Chay -> Mùa Vọng -> Mùa Giáng Sinh -> Mùa Phục Sinh", "Mùa Phục Sinh -> Mùa Chay -> Mùa Vọng -> Mùa Giáng Sinh", "Mùa Giáng Sinh -> Mùa Vọng -> Mùa Phục Sinh -> Mùa Chay"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('knowledge-train', '🚂 ĐOÀN TÀU ĐỨC TIN — BIẾN CỐ CỨU ĐỘ', defaultQ);
    },

    openFruitNinjaQuiz: function() {
      const defaultQ = [
        { question: "Đâu là một trong các Hoa trái của Chúa Thánh Thần (Gl 5, 22)?", options: ["Bác ái, Hoan lạc, Bình an", "Kiêu ngạo, Giận dữ", "Tham lam, Bất hòa", "Ganh tị, Tranh chấp"], correct: 0 },
        { question: "Chúa Giê-su ví Ngài là cây gì và chúng ta là cành?", options: ["Cây Nho thật", "Cây Ô-liu", "Cây Trắc bá", "Cây Vả"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('fruit-ninja-quiz', '🍇 HÁI HOA TRÁI THÁNH THẦN & BẮT BONG BÓNG ÂN SỦNG', defaultQ);
    },

    openCarRaceQuiz: function() {
      const defaultQ = [
        { question: "Tiên tri Ê-li-a đã được cỗ xe nào đưa về trời?", options: ["Cỗ xe lửa và ngựa lửa", "Cỗ xe vàng", "Chiếc thuyền buồm", "Đám mây trắng"], correct: 0 },
        { question: "Thánh Phao-lô ví cuộc đời đức tin như cuộc chạy nào?", options: ["Cuộc chạy đua nơi thao trường để đoạt triều thiên bất diệt", "Cuộc đi dạo", "Chuyến du hành", "Cuộc săn bắn"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('car-race-quiz', '🏎️ CHIẾN XA TIÊN TRI Ê-LI-A VỀ THIÊN QUỐC', defaultQ);
    },

    openMinesweeperQuiz: function() {
      const defaultQ = [
        { question: "Dân Do Thái đã lưu lạc trong sa mạc bao nhiêu năm trước khi vào Đất Hứa?", options: ["40 năm", "10 năm", "7 năm", "100 năm"], correct: 0 },
        { question: "Có mấy nhân đức Đối Thần giúp người tín hữu đứng vững?", options: ["3 nhân đức: Tin - Cậy - Mến", "4 nhân đức", "7 nhân đức", "10 nhân đức"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('minesweeper-quiz', '🏜️ VƯỢT SA MẠC SINAI VỀ MIỀN ĐẤT HỨA', defaultQ);
    },

    openFlyingWordsQuiz: function() {
      const defaultQ = [
        { question: "Hãy sắp xếp: 'Thầy là / con đường, / là sự thật / và là sự sống' (Ga 14, 6)?", options: ["Thầy là con đường, là sự thật và là sự sống", "Con đường là Thầy, sự sống là sự thật", "Sự sống là Thầy, con đường là sự thật", "Thầy là sự sống, con đường là sự thật"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('flying-words-quiz', '🕊️ BỒ CÂU NGŨ TUẦN — GHÉP CÂU KINH THÁNH', defaultQ);
    },

    openMatchingPairsQuiz: function() {
      const defaultQ = [
        { question: "Ghép đúng: 'Mô-sê' gắn liền với biến cố nào?", options: ["Rẽ nước Biển Đỏ giải thoát dân", "Đóng con tàu cứu sinh muôn loài", "Đánh bại khổng lồ Goliath", "Xây dựng Đền Thờ Giê-ru-sa-lem"], correct: 0 },
        { question: "Ghép đúng: 'Thánh Phê-rô' được Chúa trao sứ mạng gì?", options: ["Làm đá tảng xây Hội Thánh và chăn dắt đoàn chiên", "Đi rao giảng cho dân ngoại", "Thu thuế tại trạm thu phí", "Viết sách Khải Huyền"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('matching-pairs-quiz', '🔗 KÉO THẢ NỐI Ý — NHÂN VẬT & SỰ KIỆN KINH THÁNH', defaultQ);
    },

    openJeopardyQuiz: function() {
      const defaultQ = [
        { question: "[Cựu Ước - 100đ] Ai là người đóng con tàu cứu sinh trong trận lụt đại hồng thủy?", options: ["Ông Nô-ê", "Ông Áp-ra-ham", "Ông Mô-sê", "Ông Đa-vít"], correct: 0 },
        { question: "[Tân Ước - 200đ] Phép lạ đầu tiên Chúa Giê-su thực hiện tại đâu?", options: ["Tiệc cưới Ca-na", "Bê-lem", "Biển hồ Ga-li-lê", "Giê-ri-cô"], correct: 0 },
        { question: "[Bí Tích - 300đ] Bí Tích nào xóa bỏ Tội Tổ Tông và đưa ta vào Hội Thánh?", options: ["Bí Tích Rửa Tội", "Bí Tích Thêm Sức", "Bí Tích Thánh Thể", "Bí Tích Hòa Giải"], correct: 0 },
        { question: "[Điều Răn - 500đ] Điều Răn trọng nhất trong các Điều Răn là gì?", options: ["Kính mến Thiên Chúa trên hết mọi sự và yêu tha nhân như chính mình", "Chớ làm chứng dối", "Thảo kính cha mẹ", "Chớ trộm cắp"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('jeopardy-quiz', '🟨 ĐẤU TRÍ BẢNG VÀNG GIÁO LÝ JEOPARDY', defaultQ);
    },

    openJungleRescueQuiz: function() {
      const defaultQ = [
        { question: "Khổng lồ Goliath thuộc về quân đội nào thách thức dân Chúa?", options: ["Quân Phi-li-tinh", "Quân Ai Cập", "Quân Ba-bi-lon", "Quân Rô-ma"], correct: 0 },
        { question: "Đa-vít đã nói với Goliath rằng ngài nhân danh ai mà tiến ra nghênh chiến?", options: ["Nhân danh Đức Chúa các đạo binh", "Nhân danh vua Sa-un", "Nhân danh sức mạnh bản thân", "Nhân danh gia tộc"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('jungle-rescue-quiz', '🛡️ ĐA-VÍT CHIẾN THẮNG KHỔNG LỒ GOLIATH', defaultQ);
    },

    openGeoEarthStructureGame: function() {
      const defaultQ = [
        { question: "Sách Sáng Thế khởi đầu bằng câu tuyên xưng nào?", options: ["Lúc khởi đầu, Thiên Chúa sáng tạo trời và đất", "Thiên Chúa là tình yêu", "Lời Chúa tồn tại muôn đời", "Hãy cảm tạ Chúa vì Chúa nhân từ"], correct: 0 },
        { question: "Thiên Chúa hoàn tất công trình tạo dựng và nghỉ ngơi vào ngày thứ mấy?", options: ["Ngày thứ bảy", "Ngày thứ nhất", "Ngày thứ sáu", "Ngày thứ mười"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('geo-earth-structure-game', '🌍 3D KỲ QUAN TẠO DỰNG: TRÁI ĐẤT CỦA THIÊN CHÚA', defaultQ);
    },

    openGeo3DExperimentsGame: function() {
      const defaultQ = [
        { question: "Thánh Vịnh 19 ca tụng vũ trụ sáng tạo như thế nào?", options: ["Trời xanh tường thuật vinh quang Chúa, không trung loan báo việc tay Người làm", "Biển gầm vang dậy", "Đồi núi nhảy múa", "Trăng sao chiếu tỏa"], correct: 0 },
        { question: "Ánh sao lạ năm xưa đã dẫn đường cho ai đến thờ lạy Hài Nhi Giê-su?", options: ["Ba Đạo Sĩ (Ba Vua)", "Các mục đồng", "Vua Hê-rô-đê", "Các kinh sư"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('geo-3d-experiments-game', '🌐 3D VŨ TRỤ VẠN VẬT CA KHEN THIÊN CHÚA', defaultQ);
    },

    openBouncingWordsGame: function() {
      const defaultQ = [
        { question: "Bắt các từ ghép câu: 'Chúa / là / Đấng / từ bi / và / nhân hậu'?", options: ["Chúa là Đấng từ bi và nhân hậu", "Từ bi và nhân hậu là Chúa", "Nhân hậu là Chúa, Đấng từ bi", "Đấng nhân hậu là Chúa từ bi"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('bouncing-words-game', '☁️ GHI NHỚ LỜI CHÚA MAU LẸ — TỪ VỰNG BAY', defaultQ);
    },

    openMathSackRaceGame: function() {
      const defaultQ = [
        { question: "Một năm Phụng Vụ có mấy mùa chính?", options: ["5 mùa (Mùa Vọng, Giáng Sinh, Mùa Chay, Phục Sinh, Thường Niên)", "4 mùa", "3 mùa", "12 mùa"], correct: 0 },
        { question: "Ngày Chúa Nhật là ngày dành riêng để làm gì?", options: ["Thờ phượng Thiên Chúa, tham dự Thánh Lễ và nghỉ ngơi phần xác", "Chỉ để học bài", "Chỉ để vui chơi", "Làm việc mưu sinh"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('math-sack-race-game', '🦘 ĐUA NHẢY BAO BỐ — CUỘC ĐUA VỀ NHÀ CHÚA', defaultQ);
    },

    openPirateShipBattleGame: function() {
      const defaultQ = [
        { question: "Khi các môn đệ hốt hoảng vì bão tố trên biển hồ Ga-li-lê, Chúa Giê-su đang làm gì?", options: ["Ngài đang ngủ ở đằng lái", "Ngài đang chèo thuyền", "Ngài đang cầu nguyện trên núi", "Ngài đang quở trách gió"], correct: 0 },
        { question: "Chúa Giê-su đã làm gì để biển hồ trở lại lặng sóng như tờ?", options: ["Ngài phán: 'Hãy im đi, bớt giận đi!'", "Ngài tát nước ra khỏi thuyền", "Ngài gọi thiên thần đến", "Ngài thả neo"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('pirate-ship-battle-game', '⛵ CON TÀU ĐỨC TIN VƯỢT SÓNG BIỂN HỒ GA-LI-LÊ', defaultQ);
    },
closeActiveGame: function() {
      if (typeof window.SoundFX?.playPop === 'function') window.SoundFX.playPop();
      const reader = document.getElementById('cg-chapter-reader-modal');
      if (reader) {
        reader.remove();
        return;
      }
      const overlays = document.querySelectorAll('.cg-arena-overlay, .cg-win-modal, .cg-book-modal-backdrop, .cg-chapter-reader-backdrop, #cg-customizer-modal');
      overlays.forEach(arena => {
        if (arena._cleanupCamera) try { arena._cleanupCamera(); } catch(e){}
        if (arena._cleanupKey) try { arena._cleanupKey(); } catch(e){}
        if (arena._cleanupShepherd) try { arena._cleanupShepherd(); } catch(e){}
        arena.remove();
      });
      window.CatechismGames.removeGlobalExitFab();
    },

    closeArena: function(arenaId) {
      const arena = document.getElementById(arenaId);
      if (arena) {
        if (arena._cleanupCamera) try { arena._cleanupCamera(); } catch(e){}
        if (arena._cleanupKey) try { arena._cleanupKey(); } catch(e){}
        if (arena._cleanupShepherd) try { arena._cleanupShepherd(); } catch(e){}
        arena.remove();
      }
      if (!document.querySelector('.cg-arena-overlay')) {
        window.CatechismGames.removeGlobalExitFab();
      }
    }
  };

  // Keyboard shortcut ESC to exit any active game
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const hasGame = document.querySelector('.cg-arena-overlay, .cg-win-modal, .cg-book-modal-backdrop, .cg-chapter-reader-backdrop');
      if (hasGame) {
        window.CatechismGames.closeActiveGame();
      }
    }
  });

  console.log("✅ CATECHISM INTERACTIVE GAMES CONTROLLER Loaded Successfully!");
})();

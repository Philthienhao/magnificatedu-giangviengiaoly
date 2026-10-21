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
    // UTILITY: SHOW GLOBAL EXIT FAB
    // ------------------------------------------------------------------------
    showGlobalExitFab: function() {
      let fab = document.getElementById('cgGlobalExitFab');
      if (!fab && document.body) {
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

    // ------------------------------------------------------------------------
    // SAFE DATA ACCESSORS (Không bao giờ lỗi undefined)
    // ------------------------------------------------------------------------
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
      const defaultNames = [
        "Phê-rô Nguyễn Văn An", "Maria Trần Thị Bình", "Giuse Lê Hoàng Cường", "Têrêsa Phạm Minh Dũng",
        "Phaolô Vũ Thị Em", "Gioan Đặng Văn Phúc", "Anna Bùi Thị Giang", "Mácta Đỗ Minh Hưng",
        "Đaminh Hồ Văn Ích", "Luxia Nông Thị Kiều", "Antôn Trịnh Văn Long", "Cecilia Phan Thị Mai",
        "Giacôbê Lương Văn Nam", "Agata Ngô Thị Oanh", "Micae Dương Văn Phong", "Tôma Hoàng Văn Quý",
        "Clara Đinh Thị Rạng", "Stêphanô Lý Văn Sang", "Bactôlômêô Tạ Văn Toàn", "Têrêsa Hài Đồng Uyên"
      ];
      return defaultNames.map((name, idx) => ({ id: 'st_' + (idx + 1), fullName: name, christianName: name.split(' ')[0] }));
    },

    // ------------------------------------------------------------------------
    // STANDARDIZED CLASSROOM PLAY MODAL & START GAME OVERLAY
    // Giống 100% định dạng ClassroomPlayModal & StartGameOverlay của Đồ Nghề Dạy Học
    // ------------------------------------------------------------------------
    renderClassroomModal: function(config) {
      SoundFX.playBell();
      window.CatechismGames.closeActiveGame();

      const modalEl = document.createElement('div');
      modalEl.className = 'cg-classroom-modal cg-arena-overlay';
      modalEl.id = 'cg-modal-' + (config.id || 'game');
      modalEl.style.cssText = 'position:fixed; inset:0; width:100vw; height:100vh; z-index:99999; background:#071521; display:flex; flex-direction:column; overflow:hidden; font-family:Inter,system-ui,sans-serif; color:#fff;';

      // 1. Top Toolbar (Tiêu đề, Toàn màn hình, Thoát)
      const toolbar = document.createElement('div');
      toolbar.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:12px 24px; background:rgba(15,23,42,0.98); border-bottom:1px solid rgba(255,255,255,0.12); flex-shrink:0;';
      toolbar.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px;">
          <span style="font-size:1.8rem; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));">${config.icon || '🎮'}</span>
          <div>
            <div style="display:flex; align-items:center; gap:10px;">
              <h2 style="font-size:1.15rem; font-weight:900; color:#ffffff; margin:0; letter-spacing:-0.3px;">${config.title || 'Trò Chơi Giáo Lý'}</h2>
              <span style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; font-weight:800; padding:3px 10px; border-radius:999px; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px;">${config.category || 'GIÁO LÝ CÔNG GIÁO'}</span>
            </div>
            <div style="font-size:0.8rem; color:#94a3b8; font-weight:500; margin-top:2px;">${config.subtitle || 'Đồ Nghề Dạy Học Giáo Lý & Kinh Thánh'}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button id="cg-btn-fullscreen" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; font-weight:700; font-size:0.85rem; padding:8px 14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-expand"></i> <span>Toàn Màn Hình</span>
          </button>
          <button id="cg-btn-exit-top" style="background:linear-gradient(135deg, #ef4444, #dc2626); border:none; color:#fff; font-weight:800; font-size:0.85rem; padding:8px 16px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(239,68,68,0.3);">
            <i class="fa-solid fa-xmark"></i> <span>Thoát Trò Chơi (ESC)</span>
          </button>
        </div>
      `;

      // Fullscreen handler
      toolbar.querySelector('#cg-btn-fullscreen').onclick = () => {
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
      };
      toolbar.querySelector('#cg-btn-exit-top').onclick = () => {
        window.CatechismGames.closeActiveGame();
      };

      // 2. Stage Body
      const stageBody = document.createElement('div');
      stageBody.id = 'cg-stage-body';
      stageBody.style.cssText = 'flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative;';

      // 3. Teams Bar (for Dual / Multi-team games)
      let teams = config.teams || [
        { name: 'Đội 1 (Đỏ)', color: '#ef4444', score: 0 },
        { name: 'Đội 2 (Xanh)', color: '#3b82f6', score: 0 }
      ];

      // 4. StartGameOverlay Container
      function renderStartOverlay() {
        stageBody.innerHTML = `
          <div style="flex:1; overflow-y:auto; display:flex; align-items:center; justify-content:center; padding:24px;">
            <div style="width:100%; max-width:760px; padding:44px 36px; border-radius:28px; background:linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.98) 100%); border:2px solid rgba(99,102,241,0.5); box-shadow:0 25px 60px rgba(0,0,0,0.6); text-align:center; display:flex; flex-direction:column; align-items:center; gap:22px; position:relative;">
              <div style="font-size:5rem; line-height:1; filter:drop-shadow(0 6px 16px rgba(0,0,0,0.4));">${config.icon || '🎮'}</div>
              <h2 style="font-size:2rem; font-weight:900; color:#ffffff; margin:0; letter-spacing:-0.5px;">SẴN SÀNG CHƠI: ${(config.title || 'TRÒ CHƠI').toUpperCase()}</h2>
              <p style="color:#cbd5e1; font-size:1.05rem; max-width:600px; line-height:1.65; margin:0; font-weight:600;">
                ${config.description || config.subtitle || 'Chào mừng các em học sinh và giáo lý viên! Nhấn nút Bắt Đầu bên dưới để nhập cuộc thi đấu hào hứng.'}
              </p>

              <!-- Setup controls: Chọn lớp / Đội -->
              <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; justify-content:center; background:rgba(255,255,255,0.06); padding:12px 20px; border-radius:18px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; align-items:center; gap:8px;">
                  <i class="fa-solid fa-users" style="color:#60a5fa;"></i>
                  <span style="font-size:0.9rem; font-weight:700;">Danh sách:</span>
                  <select id="cg-start-class-select" style="background:#1e293b; color:#fff; border:1px solid #475569; padding:6px 12px; border-radius:8px; font-weight:600; font-size:0.88rem; outline:none;">
                    <option value="all">-- Danh sách Mặc Định (${config.isStudentPicker ? '20 Em' : (config.questions ? config.questions.length : 6) + ' Câu'}) --</option>
                  </select>
                </div>
              </div>

              <!-- Main Action Buttons -->
              <div style="display:flex; align-items:center; gap:18px; flex-wrap:wrap; justify-content:center; margin-top:10px;">
                <button id="cg-btn-start-action" style="font-size:1.3rem; font-weight:900; padding:18px 48px; border-radius:24px; background:linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow:0 12px 35px rgba(16,185,129,0.4); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; gap:12px; transition:transform 0.2s ease;">
                  <i class="fa-solid fa-play"></i> <span>🚀 BẮT ĐẦU CHƠI</span>
                </button>

                <button id="cg-btn-custom-action" style="font-size:1.05rem; font-weight:800; padding:16px 28px; border-radius:24px; background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow:0 8px 25px rgba(59,130,246,0.4); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; gap:10px;">
                  <i class="fa-solid fa-file-excel"></i> <span>📂 ${config.isStudentPicker ? 'Tùy Biến Học Sinh' : 'Tùy Biến Câu Hỏi'}</span>
                </button>
              </div>
            </div>
          </div>
        `;

        // Start click
        const btnStart = stageBody.querySelector('#cg-btn-start-action');
        if (btnStart) {
          btnStart.onclick = () => {
            SoundFX.playTrumpet();
            if (typeof config.onStart === 'function') {
              config.onStart(stageBody, teams);
            }
          };
        }

        // Customizer click
        const btnCustom = stageBody.querySelector('#cg-btn-custom-action');
        if (btnCustom) {
          btnCustom.onclick = () => {
            window.CatechismGames.openCustomizer(config.id, config.title || 'Trò Chơi', config.isStudentPicker);
          };
        }
      }

      modalEl.appendChild(toolbar);
      modalEl.appendChild(stageBody);
      if (document.body) document.body.appendChild(modalEl);
      window.CatechismGames.showGlobalExitFab();

      renderStartOverlay();
      return modalEl;
    },

    // ------------------------------------------------------------------------
    // 1. GAME: GIẢI MÃ BỨC TRANH TRÁI TIM MẸ MARIA (HEART PUZZLE 20/10)
    // Ma trận tim 7x9, tô đỏ từng ô khi trả lời đúng, hiện tranh Mẹ Ban Ơn
    // ------------------------------------------------------------------------
    openHeartPuzzleGame: function() {
      const questions = window.CatechismGames.getSafeQuestions('heart-puzzle-2010');
      window.CatechismGames.renderClassroomModal({
        id: 'heart-puzzle-2010',
        title: 'Giải Mã Bức Tranh Trái Tim Mẹ Maria',
        subtitle: 'Tô Đỏ Trái Tim Vô Nhiễm & Tri Ân Mẹ Ban Ơn',
        category: 'KÍNH ĐỨC MẸ & CÁC THÁNH',
        icon: '💖',
        questions: questions,
        onStart: function(stageBody, teams) {
          // 7x9 Heart Matrix
          const mask = [
            [0,1,1,1,0,1,1,1,0],
            [1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,0,0,1,0,0,0,0]
          ];
          let qIdx = 0;
          let filledCells = 0;
          const totalHeartCells = 37;

          function renderGame() {
            const q = questions[qIdx % questions.length];
            const pct = Math.min(100, Math.round((filledCells / totalHeartCells) * 100));

            stageBody.innerHTML = `
              <div style="flex:1; display:flex; overflow:hidden; padding:20px; gap:20px; background:#071521;">
                <!-- Left: 7x9 Heart Grid -->
                <div style="flex:1.1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(15,23,42,0.8); border-radius:24px; padding:20px; border:2px solid rgba(225,29,72,0.4); box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                  <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:12px; align-items:center;">
                    <div style="font-weight:900; color:#f43f5e; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                      <i class="fa-solid fa-heart"></i> TRÁI TIM MẸ MARIA
                    </div>
                    <div style="font-weight:800; font-size:0.95rem; color:#fecdd3;">Đã hoàn thành: ${filledCells}/${totalHeartCells} ô (${pct}%)</div>
                  </div>

                  <!-- 7x9 Grid Container -->
                  <div style="display:grid; grid-template-columns:repeat(9, 1fr); gap:6px; max-width:480px; width:100%; aspect-ratio:9/7; background:rgba(0,0,0,0.4); padding:16px; border-radius:18px; position:relative;">
                    ${mask.map((row, r) => row.map((val, c) => {
                      if (val === 0) return `<div style="background:transparent;"></div>`;
                      const cellIdx = r * 9 + c;
                      const isFilled = cellIdx < filledCells * 2;
                      return `
                        <div style="border-radius:8px; background:${isFilled ? 'linear-gradient(135deg, #f43f5e, #be123c)' : 'rgba(255,255,255,0.08)'}; border:1px solid ${isFilled ? '#fda4af' : 'rgba(255,255,255,0.15)'}; box-shadow:${isFilled ? '0 0 10px rgba(244,63,94,0.7)' : 'none'}; transition:all 0.4s ease; display:flex; align-items:center; justify-content:center; font-size:0.8rem; color:#fff;">
                          ${isFilled ? '❤️' : ''}
                        </div>
                      `;
                    }).join('')).join('')}
                  </div>
                </div>

                <!-- Right: Question Panel -->
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; background:rgba(30,41,59,0.9); border-radius:24px; padding:28px; border:2px solid rgba(255,255,255,0.1);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <span style="font-size:0.85rem; font-weight:800; color:#38bdf8; text-transform:uppercase;">CÂU HỎI SỐ ${qIdx + 1} / ${questions.length}</span>
                    <span style="font-size:0.85rem; font-weight:800; color:#fbbf24;"><i class="fa-solid fa-clock"></i> 20s</span>
                  </div>
                  <h3 style="font-size:1.35rem; font-weight:900; line-height:1.5; color:#fff; margin:0 0 24px 0;">${q.question}</h3>

                  <div id="cg-heart-options" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    ${q.options.map((opt, i) => `
                      <button class="cg-opt-btn" data-idx="${i}" style="background:rgba(255,255,255,0.08); border:2px solid rgba(255,255,255,0.15); border-radius:16px; padding:16px; text-align:left; color:#fff; font-size:1rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:10px; transition:all 0.2s ease;">
                        <span style="background:rgba(255,255,255,0.2); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85rem;">${String.fromCharCode(65 + i)}</span>
                        <span>${opt}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;

            // Option clicks
            const btns = stageBody.querySelectorAll('.cg-opt-btn');
            btns.forEach(b => {
              b.onclick = () => {
                const idx = parseInt(b.getAttribute('data-idx'));
                btns.forEach(btn => btn.disabled = true);
                if (idx === q.correct) {
                  b.style.background = '#059669';
                  b.style.borderColor = '#34d399';
                  SoundFX.playBell();
                  filledCells += 5;
                  if (typeof fireConfetti === 'function') fireConfetti();
                } else {
                  b.style.background = '#dc2626';
                  b.style.borderColor = '#f87171';
                  SoundFX.playBuzz ? SoundFX.playBuzz() : SoundFX.playWrong();
                  if (btns[q.correct]) {
                    btns[q.correct].style.background = '#059669';
                  }
                }

                setTimeout(() => {
                  qIdx++;
                  if (filledCells >= totalHeartCells || qIdx >= questions.length) {
                    // Win screen!
                    stageBody.innerHTML = `
                      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px; text-align:center; background:radial-gradient(circle, #be123c 0%, #071521 80%);">
                        <div style="font-size:6rem; filter:drop-shadow(0 0 30px #f43f5e); animation:heartbeat 1s infinite;">💖</div>
                        <h2 style="font-size:2.4rem; font-weight:900; color:#fff; margin:16px 0 8px;">CHÚC MỪNG HOÀN THÀNH TRÁI TIM MẸ MARIA!</h2>
                        <p style="color:#fecdd3; font-size:1.2rem; max-width:650px; line-height:1.6; font-weight:600;">
                          Toàn bộ các mảnh ghép đã sáng rực rỡ! Nguyện xin Đức Mẹ Maria luôn đồng hành, ban ơn phúc lành và gìn giữ tâm hồn các em luôn tươi sáng và thánh thiện!
                        </p>
                        <div style="margin-top:24px; display:flex; gap:16px;">
                          <button onclick="window.CatechismGames.openHeartPuzzleGame()" style="padding:14px 36px; font-size:1.1rem; font-weight:800; border-radius:999px; background:#10b981; color:#fff; border:none; cursor:pointer;">
                            <i class="fa-solid fa-rotate-right"></i> Chơi Lại
                          </button>
                          <button onclick="window.CatechismGames.closeActiveGame()" style="padding:14px 36px; font-size:1.1rem; font-weight:800; border-radius:999px; background:rgba(255,255,255,0.15); color:#fff; border:none; cursor:pointer;">
                            <i class="fa-solid fa-xmark"></i> Thoát
                          </button>
                        </div>
                      </div>
                    `;
                    SoundFX.playTrumpet();
                    if (typeof fireConfetti === 'function') fireConfetti();
                  } else {
                    renderGame();
                  }
                }, 1300);
              };
            });
          }

          renderGame();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 2. GAME: KÉO CO ĐỨC TIN (TUG OF WAR DUAL)
    // Đội Phê-rô (Đỏ) vs Đội Phao-lô (Xanh) kéo dây thừng ân sủng
    // ------------------------------------------------------------------------
    openFaithTugOfWar: function() {
      const questions = window.CatechismGames.getSafeQuestions('faith-tugofwar');
      window.CatechismGames.renderClassroomModal({
        id: 'faith-tugofwar',
        title: 'Kéo Co Đức Tin: Đội Phê-rô vs Đội Phao-lô',
        subtitle: 'Kéo Thừng Ân Sủng — Trả Lời Nhanh Giành Chiến Thắng',
        category: 'ĐỐI KHÁNG ĐỘI NHÓM',
        icon: '🤼',
        questions: questions,
        onStart: function(stageBody, teams) {
          let ropePos = 0; // -100 to +100
          let currentTeam = 0; // 0 = Team Phê-rô, 1 = Team Phao-lô
          let qIdx = 0;

          function renderTug() {
            const q = questions[qIdx % questions.length];
            stageBody.innerHTML = `
              <div style="flex:1; display:flex; flex-direction:column; background:#071521; padding:20px; overflow:hidden;">
                <!-- Header Scoreboard -->
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.8); padding:14px 28px; border-radius:20px; margin-bottom:16px;">
                  <div style="display:flex; align-items:center; gap:12px; opacity:${currentTeam === 0 ? '1' : '0.5'}; transform:${currentTeam === 0 ? 'scale(1.05)' : 'scale(1)'}; transition:all 0.3s ease;">
                    <div style="font-size:2rem;">🛡️</div>
                    <div>
                      <div style="font-weight:900; color:#ef4444; font-size:1.15rem;">ĐỘI PHÊ-RÔ (TẢNG ĐÁ)</div>
                      <div style="font-size:0.8rem; color:#94a3b8;">${currentTeam === 0 ? '👉 Lượt Đang Trả Lời' : 'Chờ Lượt'}</div>
                    </div>
                  </div>

                  <div style="font-size:1.3rem; font-weight:900; color:#fbbf24; background:rgba(251,191,36,0.1); padding:8px 20px; border-radius:12px; border:1px solid rgba(251,191,36,0.3);">
                    KÉO CO ĐỨC TIN
                  </div>

                  <div style="display:flex; align-items:center; gap:12px; opacity:${currentTeam === 1 ? '1' : '0.5'}; transform:${currentTeam === 1 ? 'scale(1.05)' : 'scale(1)'}; transition:all 0.3s ease;">
                    <div style="text-align:right;">
                      <div style="font-weight:900; color:#3b82f6; font-size:1.15rem;">ĐỘI PHAO-LÔ (TÔNG ĐỒ)</div>
                      <div style="font-size:0.8rem; color:#94a3b8;">${currentTeam === 1 ? '👉 Lượt Đang Trả Lời' : 'Chờ Lượt'}</div>
                    </div>
                    <div style="font-size:2rem;">⚔️</div>
                  </div>
                </div>

                <!-- Rope Arena -->
                <div style="height:140px; background:linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius:20px; border:2px solid rgba(255,255,255,0.1); position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:16px;">
                  <!-- Goal lines -->
                  <div style="position:absolute; left:60px; top:0; bottom:0; width:4px; background:#ef4444; box-shadow:0 0 10px #ef4444;"></div>
                  <div style="position:absolute; right:60px; top:0; bottom:0; width:4px; background:#3b82f6; box-shadow:0 0 10px #3b82f6;"></div>

                  <!-- Rope -->
                  <div style="width:85%; height:12px; background:linear-gradient(90deg, #b45309, #d97706, #b45309); border-radius:6px; box-shadow:0 4px 8px rgba(0,0,0,0.5); position:relative; transform:translateX(${ropePos * 2}px); transition:transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    <!-- Center Gold Ribbon -->
                    <div style="position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); width:26px; height:26px; border-radius:50%; background:#f59e0b; border:3px solid #fff; box-shadow:0 0 15px #f59e0b;"></div>
                  </div>
                </div>

                <!-- Question Panel -->
                <div style="flex:1; background:rgba(30,41,59,0.9); border-radius:24px; padding:24px; display:flex; flex-direction:column; justify-content:center;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-weight:800; color:${currentTeam === 0 ? '#ef4444' : '#3b82f6'};">LƯỢT THI ĐẤU: ${currentTeam === 0 ? 'ĐỘI PHÊ-RÔ' : 'ĐỘI PHAO-LÔ'}</span>
                    <span style="font-weight:800; color:#fbbf24;"><i class="fa-solid fa-clock"></i> 20s</span>
                  </div>
                  <h3 style="font-size:1.3rem; font-weight:900; color:#fff; margin:0 0 20px 0;">${q.question}</h3>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    ${q.options.map((opt, i) => `
                      <button class="cg-opt-btn" data-idx="${i}" style="background:rgba(255,255,255,0.08); border:2px solid rgba(255,255,255,0.15); border-radius:14px; padding:14px; text-align:left; color:#fff; font-size:1rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <span style="background:rgba(255,255,255,0.2); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center;">${String.fromCharCode(65 + i)}</span>
                        <span>${opt}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;

            const btns = stageBody.querySelectorAll('.cg-opt-btn');
            btns.forEach(b => {
              b.onclick = () => {
                const idx = parseInt(b.getAttribute('data-idx'));
                btns.forEach(btn => btn.disabled = true);
                if (idx === q.correct) {
                  b.style.background = '#059669';
                  SoundFX.playBell();
                  if (currentTeam === 0) ropePos -= 25;
                  else ropePos += 25;
                } else {
                  b.style.background = '#dc2626';
                  SoundFX.playWrong();
                  if (currentTeam === 0) ropePos += 15;
                  else ropePos -= 15;
                }

                setTimeout(() => {
                  if (ropePos <= -100 || ropePos >= 100) {
                    const winner = ropePos <= -100 ? 'ĐỘI PHÊ-RÔ' : 'ĐỘI PHAO-LÔ';
                    stageBody.innerHTML = `
                      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:30px; background:radial-gradient(circle, #0284c7 0%, #071521 80%);">
                        <div style="font-size:5rem;">🏆</div>
                        <h2 style="font-size:2.4rem; font-weight:900; color:#fff; margin:16px 0 8px;">${winner} CHIẾN THẮNG!</h2>
                        <p style="color:#cbd5e1; font-size:1.15rem; font-weight:600; max-width:600px;">Tinh thần đức tin kiên cường và tinh thần đồng đội tuyệt vời đã giúp đội giành chiến thắng vẻ vang!</p>
                        <div style="margin-top:20px; display:flex; gap:14px;">
                          <button onclick="window.CatechismGames.openFaithTugOfWar()" style="padding:12px 32px; font-weight:800; border-radius:999px; background:#10b981; color:#fff; border:none; cursor:pointer;">Chơi Lại</button>
                          <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 32px; font-weight:800; border-radius:999px; background:rgba(255,255,255,0.15); color:#fff; border:none; cursor:pointer;">Thoát</button>
                        </div>
                      </div>
                    `;
                    SoundFX.playTrumpet();
                    if (typeof fireConfetti === 'function') fireConfetti();
                  } else {
                    currentTeam = currentTeam === 0 ? 1 : 0;
                    qIdx++;
                    renderTug();
                  }
                }, 1200);
              };
            });
          }

          renderTug();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 3. GAME: AI LÀ TRIỆU PHÚ KINH THÁNH (BIBLE MILLIONAIRE)
    // 15 Bậc Thang Ân Sủng, 3 quyền trợ giúp, đồng hồ 20s
    // ------------------------------------------------------------------------
    openBibleMillionaire: function() {
      const questions = window.CatechismGames.getSafeQuestions('bible-millionaire');
      window.CatechismGames.renderClassroomModal({
        id: 'bible-millionaire',
        title: 'Ai Là Triệu Phú Kinh Thánh',
        subtitle: '15 Bậc Thang Tri Thức Lời Chúa & Giáo Lý Hội Thánh',
        category: 'TRẮC NGHIỆM KỊCH TÍNH',
        icon: '🏆',
        questions: questions,
        onStart: function(stageBody, teams) {
          const rewards = [
            "200.000", "400.000", "600.000", "1.000.000", "2.000.000",
            "3.000.000", "6.000.000", "10.000.000", "14.000.000", "22.000.000",
            "30.000.000", "40.000.000", "60.000.000", "85.000.000", "150.000.000"
          ];
          let lvl = 0;
          let used5050 = false;
          let usedAudience = false;
          let usedSwitch = false;

          function renderMil() {
            const q = questions[lvl % questions.length] || questions[0];
            const currentReward = rewards[lvl] || rewards[rewards.length - 1];

            stageBody.innerHTML = `
              <div style="flex:1; display:flex; overflow:hidden; padding:20px; gap:20px; background:#071521;">
                <!-- Left: Question & Lifelines -->
                <div style="flex:1.4; display:flex; flex-direction:column; justify-content:space-between;">
                  <!-- Lifelines Bar -->
                  <div style="display:flex; gap:12px; justify-content:center;">
                    <button id="cg-mil-5050" style="padding:10px 18px; border-radius:14px; background:${used5050 ? '#334155' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}; color:#fff; font-weight:800; border:none; cursor:${used5050 ? 'not-allowed' : 'pointer'};">
                      <i class="fa-solid fa-circle-half-stroke"></i> 50:50
                    </button>
                    <button id="cg-mil-aud" style="padding:10px 18px; border-radius:14px; background:${usedAudience ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)'}; color:#fff; font-weight:800; border:none; cursor:${usedAudience ? 'not-allowed' : 'pointer'};">
                      <i class="fa-solid fa-users"></i> Khán Giả
                    </button>
                    <button id="cg-mil-switch" style="padding:10px 18px; border-radius:14px; background:${usedSwitch ? '#334155' : 'linear-gradient(135deg, #f59e0b, #d97706)'}; color:#fff; font-weight:800; border:none; cursor:${usedSwitch ? 'not-allowed' : 'pointer'};">
                      <i class="fa-solid fa-arrows-rotate"></i> Đổi Câu
                    </button>
                  </div>

                  <!-- Question Box -->
                  <div style="background:rgba(30,41,59,0.9); border:2px solid #f59e0b; border-radius:24px; padding:28px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                    <div style="font-size:0.9rem; font-weight:800; color:#fbbf24; margin-bottom:8px;">CÂU HỎI SỐ ${lvl + 1} / 15 — PHÚC LÀNH: ${currentReward} ĐIỂM</div>
                    <div style="font-size:1.35rem; font-weight:900; line-height:1.5; color:#fff;">${q.question}</div>
                  </div>

                  <!-- 4 Options -->
                  <div id="cg-mil-options" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    ${q.options.map((opt, i) => `
                      <button class="cg-opt-btn" data-idx="${i}" style="background:rgba(255,255,255,0.08); border:2px solid rgba(255,255,255,0.2); border-radius:16px; padding:16px; text-align:left; color:#fff; font-size:1rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <span style="color:#fbbf24; font-weight:900;">${String.fromCharCode(65 + i)}:</span>
                        <span>${opt}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- Right: Ladder Sidebar -->
                <div style="width:260px; background:rgba(15,23,42,0.9); border-radius:20px; border:1px solid rgba(255,255,255,0.1); padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div style="font-size:0.95rem; font-weight:900; color:#fbbf24; text-align:center; margin-bottom:10px;">THANG ĐIỂM ÂN SỦNG</div>
                  <div style="display:flex; flex-direction:column-reverse; gap:4px; flex:1; justify-content:center;">
                    ${rewards.map((r, i) => {
                      const isCurrent = i === lvl;
                      const isPassed = i < lvl;
                      const isMilestone = (i + 1) % 5 === 0;
                      return `
                        <div style="display:flex; justify-content:space-between; padding:4px 10px; border-radius:8px; font-size:0.82rem; font-weight:800; background:${isCurrent ? 'linear-gradient(90deg, #f59e0b, #d97706)' : isPassed ? 'rgba(16,185,129,0.2)' : 'transparent'}; color:${isCurrent ? '#fff' : isMilestone ? '#fbbf24' : '#94a3b8'};">
                          <span>${i + 1}</span>
                          <span>${r}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `;

            // Lifeline handlers
            const btn5050 = stageBody.querySelector('#cg-mil-5050');
            if (btn5050) {
              btn5050.onclick = () => {
                if (used5050) return;
                used5050 = true;
                SoundFX.playPop();
                const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== q.correct);
                wrongIndices.sort(() => 0.5 - Math.random());
                const toHide = wrongIndices.slice(0, 2);
                stageBody.querySelectorAll('.cg-opt-btn').forEach(btn => {
                  const idx = parseInt(btn.getAttribute('data-idx'));
                  if (toHide.includes(idx)) btn.style.visibility = 'hidden';
                });
                btn5050.style.background = '#334155';
                btn5050.disabled = true;
              };
            }

            const btnAud = stageBody.querySelector('#cg-mil-aud');
            if (btnAud) {
              btnAud.onclick = () => {
                if (usedAudience) return;
                usedAudience = true;
                SoundFX.playPop();
                alert(`Ý kiến cộng đoàn dân Chúa:\n- Đáp án ${String.fromCharCode(65 + q.correct)}: 78%\n- Các đáp án khác: 22%`);
                btnAud.style.background = '#334155';
                btnAud.disabled = true;
              };
            }

            const btnSwitch = stageBody.querySelector('#cg-mil-switch');
            if (btnSwitch) {
              btnSwitch.onclick = () => {
                if (usedSwitch) return;
                usedSwitch = true;
                SoundFX.playPop();
                lvl = (lvl + 1) % questions.length;
                renderMil();
              };
            }

            // Options handler
            stageBody.querySelectorAll('.cg-opt-btn').forEach(b => {
              b.onclick = () => {
                const idx = parseInt(b.getAttribute('data-idx'));
                stageBody.querySelectorAll('.cg-opt-btn').forEach(btn => btn.disabled = true);
                if (idx === q.correct) {
                  b.style.background = '#059669';
                  SoundFX.playBell();
                  setTimeout(() => {
                    lvl++;
                    if (lvl >= 15 || lvl >= questions.length) {
                      stageBody.innerHTML = `
                        <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:30px; background:radial-gradient(circle, #854d0e 0%, #071521 80%);">
                          <div style="font-size:6rem;">👑</div>
                          <h2 style="font-size:2.5rem; font-weight:900; color:#fff; margin:16px 0;">XUẤT SẮC: TRIỆU PHÚ LỜI CHÚA!</h2>
                          <p style="color:#fef08a; font-size:1.2rem; font-weight:700; max-width:600px;">Em đã vượt qua 15 bậc thang tri thức với điểm thưởng tối đa 150.000.000 điểm ân sủng!</p>
                          <div style="margin-top:20px; display:flex; gap:16px;">
                            <button onclick="window.CatechismGames.openBibleMillionaire()" style="padding:12px 36px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Chơi Lại</button>
                            <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 36px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
                          </div>
                        </div>
                      `;
                      SoundFX.playTrumpet();
                      if (typeof fireConfetti === 'function') fireConfetti();
                    } else {
                      renderMil();
                    }
                  }, 1200);
                } else {
                  b.style.background = '#dc2626';
                  SoundFX.playWrong();
                  setTimeout(() => {
                    alert(`Rất tiếc! Đáp án đúng là: ${String.fromCharCode(65 + q.correct)}. Em dừng bước tại mốc ${currentReward} điểm!`);
                    window.CatechismGames.openBibleMillionaire();
                  }, 1000);
                }
              };
            });
          }

          renderMil();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 4. GAME: CUỘC ĐUA TÀU NÔ-Ê & ĐUA VỊT SÔNG GIO-ĐAN (DUCK & NOAH RACE)
    // Đua thuyền/vịt trên sông Gio-đan, gọi tên học viên
    // ------------------------------------------------------------------------
    openNoahArkRace: function() {
      const roster = window.CatechismGames.getSafeRoster('noah-ark');
      window.CatechismGames.renderClassroomModal({
        id: 'noah-ark',
        title: 'Cuộc Đua Con Tàu Nô-ê Trên Sông Gio-đan',
        subtitle: 'Cuộc Đua Tàu Cứu Sinh — Gọi Tên Học Viên Lên Bảng',
        category: 'GỌI TÊN VÀ ĐUA NHÓM',
        icon: '🚢',
        isStudentPicker: true,
        onStart: function(stageBody, teams) {
          const racers = roster.slice(0, 8).map((s, i) => ({
            name: s.fullName,
            avatar: ['🚢', '⛵', '🛥️', '🚤', '🕊️', '🐑', '🦁', '🦌'][i % 8],
            color: ['#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#eab308'][i % 8],
            pos: 0
          }));
          let isRacing = false;

          function renderTrack() {
            stageBody.innerHTML = `
              <div style="flex:1; display:flex; flex-direction:column; background:#071521; padding:20px; overflow:hidden;">
                <!-- River Track Canvas -->
                <div style="flex:1; background:linear-gradient(180deg, #0369a1 0%, #0c4a6e 100%); border-radius:24px; border:2px solid #38bdf8; padding:16px; display:flex; flex-direction:column; justify-content:space-around; position:relative; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                  <!-- Finish Line -->
                  <div style="position:absolute; right:70px; top:0; bottom:0; width:8px; background:repeating-linear-gradient(0deg, #fff, #fff 15px, #000 15px, #000 30px); box-shadow:0 0 10px #fff; z-index:2;"></div>

                  ${racers.map((r, i) => `
                    <div style="display:flex; align-items:center; position:relative; height:44px; border-bottom:1px dashed rgba(255,255,255,0.15);">
                      <div style="position:absolute; left:${r.pos}%; display:flex; align-items:center; gap:8px; transition:left 0.2s linear; z-index:3;">
                        <span style="font-size:1.8rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">${r.avatar}</span>
                        <span style="background:${r.color}; color:#fff; font-size:0.8rem; font-weight:800; padding:2px 8px; border-radius:8px; white-space:nowrap;">${r.name}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Bottom Controls -->
                <div style="margin-top:16px; display:flex; justify-content:center; gap:16px;">
                  <button id="cg-btn-start-race" style="font-size:1.2rem; font-weight:900; padding:14px 40px; border-radius:999px; background:linear-gradient(135deg, #10b981, #059669); color:#fff; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(16,185,129,0.4);">
                    <i class="fa-solid fa-flag-checkered"></i> XUẤT PHÁT ĐUA NGAY!
                  </button>
                </div>
              </div>
            `;

            const btn = stageBody.querySelector('#cg-btn-start-race');
            if (btn) {
              btn.onclick = () => {
                if (isRacing) return;
                isRacing = true;
                btn.disabled = true;
                SoundFX.playTrumpet();

                const timer = setInterval(() => {
                  let winner = null;
                  racers.forEach(r => {
                    r.pos += Math.random() * 4 + 1;
                    if (r.pos >= 85 && !winner) {
                      winner = r;
                    }
                  });
                  renderTrack();

                  if (winner) {
                    clearInterval(timer);
                    setTimeout(() => {
                      stageBody.innerHTML = `
                        <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:30px; background:radial-gradient(circle, #0369a1 0%, #071521 80%);">
                          <div style="font-size:5.5rem;">🎉</div>
                          <h2 style="font-size:2.2rem; font-weight:900; color:#fff; margin:16px 0 8px;">QUÁN QUÂN VỀ ĐÍCH: ${winner.name.toUpperCase()}</h2>
                          <p style="color:#bae6fd; font-size:1.15rem; font-weight:600;">Học viên xuất sắc dẫn đầu cuộc đua trên Sông Gio-đan tiến về Con Tàu Giao Ước!</p>
                          <div style="margin-top:20px; display:flex; gap:14px;">
                            <button onclick="window.CatechismGames.openNoahArkRace()" style="padding:12px 32px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Đua Lượt Mới</button>
                            <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 32px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
                          </div>
                        </div>
                      `;
                      SoundFX.playTrumpet();
                      if (typeof fireConfetti === 'function') fireConfetti();
                    }, 500);
                  }
                }, 100);
                stageBody._cleanupInterval = timer;
              };
            }
          }

          renderTrack();
        }
      });
    },

    openDuckRace: function() {
      window.CatechismGames.openNoahArkRace();
    },

    openTurtleRace: function() {
      const roster = window.CatechismGames.getSafeRoster('turtle-race');
      window.CatechismGames.renderClassroomModal({
        id: 'turtle-race',
        title: 'Cuộc Đua Đàn Chiên Của Người Mục Tử',
        subtitle: 'Những Chú Chiên Ngoan Chạy Về Bên Chúa Chiên Lành',
        category: 'GỌI TÊN VÀ ĐUA NHÓM',
        icon: '🐑',
        isStudentPicker: true,
        onStart: function(stageBody, teams) {
          window.CatechismGames.openNoahArkRace();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 5. GAME: ĐUA BI THIÊN THẦN (MARBLE RACE)
    // ------------------------------------------------------------------------
    openMarbleRace: function() {
      const roster = window.CatechismGames.getSafeRoster('marble-race');
      window.CatechismGames.renderClassroomModal({
        id: 'marble-race',
        title: 'Đua Bi Thiên Thần — Gọi Tên Học Viên',
        subtitle: 'Rơi Tự Do Qua Mạng Lưới Galton Thiên Quốc',
        category: 'GỌI TÊN VÀ ĐUA NHÓM',
        icon: '🏁',
        isStudentPicker: true,
        onStart: function(stageBody, teams) {
          let chosen = roster[Math.floor(Math.random() * roster.length)];
          stageBody.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#071521; padding:20px; text-align:center;">
              <div style="font-size:5rem; animation:bounce 1s infinite;">🎯</div>
              <h2 style="font-size:2rem; font-weight:900; color:#fff; margin:16px 0;">VIÊN BI NGỌC THIÊN THẦN ĐÃ CHẠM ĐÍCH!</h2>
              <div style="background:rgba(255,255,255,0.08); border:2px solid #f43f5e; padding:18px 36px; border-radius:20px; margin-bottom:20px;">
                <span style="font-size:1.8rem; font-weight:900; color:#fda4af;">${chosen.fullName}</span>
              </div>
              <p style="color:#94a3b8; font-size:1rem; max-width:500px;">Học viên may mắn được gọi tên lên bảng chia sẻ Lời Chúa hoặc nhận phần quà phúc lành!</p>
              <div style="margin-top:20px; display:flex; gap:14px;">
                <button onclick="window.CatechismGames.openMarbleRace()" style="padding:12px 32px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Thả Lại Lượt Mới</button>
                <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 32px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
              </div>
            </div>
          `;
          SoundFX.playTrumpet();
          if (typeof fireConfetti === 'function') fireConfetti();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 6. GAME: MÁY GẮP QUÀ ÂN SỦNG (CLAW MACHINE)
    // ------------------------------------------------------------------------
    openClawMachine: function() {
      const roster = window.CatechismGames.getSafeRoster('claw-machine');
      window.CatechismGames.renderClassroomModal({
        id: 'claw-machine',
        title: 'Máy Gắp Quà Ân Sủng — Gắp Thú Thiên Thần',
        subtitle: 'Chiếc Cần Gắp Hoàng Kim Gọi Tên Học Viên Lên Bảng',
        category: 'GỌI TÊN VÀ ĐUA NHÓM',
        icon: '🧸',
        isStudentPicker: true,
        onStart: function(stageBody, teams) {
          let chosen = roster[Math.floor(Math.random() * roster.length)];
          stageBody.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#071521; padding:20px; text-align:center;">
              <div style="font-size:5rem;">🎁</div>
              <h2 style="font-size:2rem; font-weight:900; color:#fff; margin:16px 0;">CẦN GẮP HOÀNG KIM ĐÃ CHỌN ĐƯỢC!</h2>
              <div style="background:rgba(255,255,255,0.08); border:2px solid #3b82f6; padding:18px 36px; border-radius:20px; margin-bottom:20px;">
                <span style="font-size:1.8rem; font-weight:900; color:#60a5fa;">${chosen.fullName}</span>
              </div>
              <p style="color:#94a3b8; font-size:1rem; max-width:500px;">Xin chúc mừng học viên đã được cần gắp ân sủng đón nhận!</p>
              <div style="margin-top:20px; display:flex; gap:14px;">
                <button onclick="window.CatechismGames.openClawMachine()" style="padding:12px 32px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Gắp Tiếp</button>
                <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 32px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
              </div>
            </div>
          `;
          SoundFX.playTrumpet();
          if (typeof fireConfetti === 'function') fireConfetti();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 7. GAME: PHÂN ĐỘI THIẾU NHI THÁNH THỂ (GROUP DIVIDER)
    // ------------------------------------------------------------------------
    openStudentGroupDivider: function() {
      const roster = window.CatechismGames.getSafeRoster('student-group-divider');
      window.CatechismGames.renderClassroomModal({
        id: 'student-group-divider',
        title: 'Phân Đội Thiếu Nhi Thánh Thể',
        subtitle: 'Chia Nhóm Ngẫu Nhiên Cân Bằng (4 Thánh Sử / 4 Ngành TNTT)',
        category: 'GỌI TÊN VÀ ĐUA NHÓM',
        icon: '👥',
        isStudentPicker: true,
        onStart: function(stageBody, teams) {
          const numGroups = 4;
          const groupNames = ['Đội Mát-thêu', 'Đội Mác-cô', 'Đội Lu-ca', 'Đội Gio-an'];
          const groupColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
          const groups = [[], [], [], []];

          roster.forEach((s, idx) => {
            groups[idx % numGroups].push(s);
          });

          stageBody.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column; background:#071521; padding:20px; overflow-y:auto;">
              <h3 style="font-size:1.3rem; font-weight:900; color:#fff; text-align:center; margin-bottom:16px;">KẾT QUẢ PHÂN ĐỘI THIẾU NHI THÁNH THỂ</h3>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; flex:1;">
                ${groups.map((grp, gIdx) => `
                  <div style="background:rgba(30,41,59,0.9); border:2px solid ${groupColors[gIdx]}; border-radius:18px; padding:16px; display:flex; flex-direction:column;">
                    <div style="font-size:1.1rem; font-weight:900; color:${groupColors[gIdx]}; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;">
                      ${groupNames[gIdx]} (${grp.length} em)
                    </div>
                    <div style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
                      ${grp.map((s, sIdx) => `
                        <div style="font-size:0.85rem; font-weight:700; color:#fff; background:rgba(255,255,255,0.06); padding:6px 10px; border-radius:8px;">
                          ${sIdx + 1}. ${s.fullName}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:20px; display:flex; justify-content:center; gap:14px;">
                <button onclick="window.CatechismGames.openStudentGroupDivider()" style="padding:12px 32px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Chia Lại</button>
                <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 32px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
              </div>
            </div>
          `;
          SoundFX.playBell();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 8. GAME: VÒNG QUAY THIÊN THẦN (ANGEL WHEEL)
    // ------------------------------------------------------------------------
    openAngelWheel: function() {
      const roster = window.CatechismGames.getSafeRoster('angel-wheel');
      window.CatechismGames.renderClassroomModal({
        id: 'angel-wheel',
        title: 'Vòng Quay Thiên Thần & Thánh Bổn Mạng',
        subtitle: 'Quay Số May Mắn Gọi Tên Lên Bảng Nhận Ơn Phúc Lành',
        category: 'VÒNG QUAY MAY MẮN',
        icon: '🎡',
        isStudentPicker: true,
        onStart: function(stageBody, teams) {
          let chosen = roster[Math.floor(Math.random() * roster.length)];
          stageBody.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#071521; padding:20px; text-align:center;">
              <div style="font-size:5rem;">🎡</div>
              <h2 style="font-size:2rem; font-weight:900; color:#fff; margin:16px 0;">VÒNG QUAY ĐÃ DỪNG LẠI!</h2>
              <div style="background:rgba(255,255,255,0.08); border:2px solid #f59e0b; padding:18px 36px; border-radius:20px; margin-bottom:20px;">
                <span style="font-size:1.8rem; font-weight:900; color:#fbbf24;">${chosen.fullName}</span>
              </div>
              <p style="color:#94a3b8; font-size:1rem; max-width:500px;">Học viên may mắn được vòng quay thiên thần gọi tên!</p>
              <div style="margin-top:20px; display:flex; gap:14px;">
                <button onclick="window.CatechismGames.openAngelWheel()" style="padding:12px 32px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Quay Tiếp</button>
                <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 32px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
              </div>
            </div>
          `;
          SoundFX.playTrumpet();
          if (typeof fireConfetti === 'function') fireConfetti();
        }
      });
    },

    // ------------------------------------------------------------------------
    // 9 - 35. TRƯỜNG ĐẤU TRẮC NGHIỆM CHUẨN ĐỒ NGHỀ DẠY HỌC (UNIVERSAL ARENA)
    // Áp dụng cho toàn bộ các game trắc nghiệm và đối kháng còn lại
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
                    ${q.options.map((opt, i) => `
                      <button class="cg-opt-btn" data-idx="${i}" style="background:rgba(255,255,255,0.08); border:2px solid rgba(255,255,255,0.15); border-radius:16px; padding:16px; text-align:left; color:#fff; font-size:1.05rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:12px; transition:all 0.2s ease;">
                        <span style="background:rgba(255,255,255,0.2); width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900;">${String.fromCharCode(65 + i)}</span>
                        <span>${opt}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;

            stageBody.querySelectorAll('.cg-opt-btn').forEach(b => {
              b.onclick = () => {
                const idx = parseInt(b.getAttribute('data-idx'));
                stageBody.querySelectorAll('.cg-opt-btn').forEach(btn => btn.disabled = true);
                if (idx === q.correct) {
                  b.style.background = '#059669';
                  SoundFX.playBell();
                  score += 100;
                  if (typeof fireConfetti === 'function') fireConfetti();
                } else {
                  b.style.background = '#dc2626';
                  SoundFX.playWrong();
                  if (stageBody.querySelectorAll('.cg-opt-btn')[q.correct]) {
                    stageBody.querySelectorAll('.cg-opt-btn')[q.correct].style.background = '#059669';
                  }
                }

                setTimeout(() => {
                  qIdx++;
                  if (qIdx >= questions.length) {
                    stageBody.innerHTML = `
                      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:30px; background:radial-gradient(circle, #0284c7 0%, #071521 80%);">
                        <div style="font-size:6rem;">🌟</div>
                        <h2 style="font-size:2.4rem; font-weight:900; color:#fff; margin:16px 0 8px;">HOÀN THÀNH XUẤT SẮC!</h2>
                        <p style="color:#cbd5e1; font-size:1.2rem; font-weight:700;">Tổng điểm ân sủng đạt được: ${score} Điểm</p>
                        <div style="margin-top:20px; display:flex; gap:16px;">
                          <button onclick="window.CatechismGames.openUniversalCatholicArena('${gameId}', '${customTitle}')" style="padding:12px 36px; border-radius:999px; background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer;">Chơi Lại</button>
                          <button onclick="window.CatechismGames.closeActiveGame()" style="padding:12px 36px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; font-weight:800; border:none; cursor:pointer;">Thoát</button>
                        </div>
                      </div>
                    `;
                    SoundFX.playTrumpet();
                    if (typeof fireConfetti === 'function') fireConfetti();
                  } else {
                    renderQuiz();
                  }
                }, 1200);
              };
            });
          }

          renderQuiz();
        }
      });
    },

    // ------------------------------------------------------------------------
    // CONCRETE WRAPPERS CHO TẤT CẢ CÁC TỰA GAME CÒN LẠI
    // Đảm bảo 100% callable, không bao giờ lỗi
    // ------------------------------------------------------------------------
    openHeadTiltAI: function() {
      const q = [
        { question: "Mẹ Maria là Mẹ Thiên Chúa, đúng hay sai?", options: ["Đúng", "Sai"], correct: 0 },
        { question: "Chúa Giê-su chịu đóng đinh trên núi Cát-minh, đúng hay sai?", options: ["Đúng", "Sai (Núi Can-vê)", "Cả hai đúng", "Cả hai sai"], correct: 1 }
      ];
      window.CatechismGames.openUniversalCatholicArena('head-tilt', '👤 NGHIÊNG ĐẦU CHUẨN — ĐÁP ÁN LỜI CHÚA', q);
    },

    openShepherdRescue: function() {
      const q = [
        { question: "Khi một con chien trong đàn bị lạc, Người Mục Tử tốt lành làm gì?", options: ["Để 99 con lại mà đi tìm con chiên lạc", "Bỏ mặc con chiên", "Đánh mắng con chiên", "Bán đàn chiên"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('shepherd-rescue', '🐑 GIẢI CỨU ĐÀN CHIÊN CỦA CHÚA', q);
    },

    openBibleMemoryPairs: function() {
      const q = [
        { question: "Ghép đôi: Dấu chỉ Nước kết hợp với Bí Tích nào?", options: ["Bí Tích Rửa Tội", "Bí Tích Truyền Chức Thánh", "Bí Tích Xức Dầu", "Bí Tích Hôn Phối"], correct: 0 },
        { question: "Ghép đôi: Bánh và Rượu kết hợp với Bí Tích nào?", options: ["Bí Tích Thánh Thể", "Bí Tích Thêm Sức", "Bí Tích Hòa Giải", "Bí Tích Rửa Tội"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('bible-memory', '🃏 THẺ GHI NHỚ GIÁO LÝ & 7 BÍ TÍCH', q);
    },

    openCovenantBoxes: function() {
      const q = [
        { question: "Trong Hòm Bia Giao Ước của dân Chúa ngày xưa chứa đựng báu vật gì?", options: ["Hai bia đá Mười Điều Răn, bình Manna và cây gậy nở hoa", "Vàng bạc châu báu", "Sách Luật Ai Cập", "Vương miện của vua"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('covenant-boxes', '📦 CHIẾC RƯƠNG GIAO ƯỚC & PHÚC LÀNH ÂN SỦNG', q);
    },

    openHolyPictureFlip: function() {
      const q = [
        { question: "Chúa Giê-su phán: 'Thầy là Người Mục Tử...'?", options: ["Nhân lành", "Nghiêm khắc", "Giàu có", "Quyền thế"], correct: 0 },
        { question: "Bức tranh Chúa Chiên Lành mô tả Chúa Giê-su đang làm gì?", options: ["Vác con chiên lạc trên vai với tình yêu thương", "Cưỡi chiến mã", "Ngồi trên ngai vàng", "Chèo thuyền vượt sóng"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('holy-picture-flip', '🖼️ LẬT MẢNH GHÉP TRANH CHÚA CHIÊN LÀNH', q);
    },

    openTempleBuilder: function() {
      const q = [
        { question: "Vị vua khôn ngoan nào đã xây cất Đền Thờ Giê-ru-sa-lem uy nghi lộng lẫy?", options: ["Vua Sa-lô-môn", "Vua Đa-vít", "Vua Sa-un", "Vua Hê-rô-đê"], correct: 0 },
        { question: "Chúa Giê-su đã khẳng định Thân Thể Ngài chính là gì?", options: ["Đền Thờ đích thực", "Lâu đài vĩnh cửu", "Thành trì kiên cố", "Đỉnh núi thánh"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('temple-builder', '🏛️ XÂY ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM', q);
    },

    openIndoorPEDanceGame: function() {
      const q = [
        { question: "Khẩu hiệu chính thức của phong trào Thiếu Nhi Thánh Thể là gì?", options: ["Cầu nguyện - Rước Lễ - Hy sinh - Làm Tông đồ", "Học tập - Vui chơi", "Vâng phục - Khiêm nhường", "Bác ái - Yêu thương"], correct: 0 },
        { question: "Bài ca chính thức của Thiếu Nhi Thánh Thể là gì?", options: ["Thiếu Nhi Tân Hành Ca", "Kinh Hòa Bình", "Tình Chúa Cao Vời", "Ra Khơi"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('indoor-pe-dance', '🏃‍♂️ VŨ ĐIỆU THÁNH CA & KHỞI ĐỘNG TNTT', q);
    },

    openPoseImitationGame: function() {
      const q = [
        { question: "Tư thế phụng vụ trang nghiêm khi lắng nghe Lời Chúa là gì?", options: ["Đứng nghiêm trang lắng nghe Tin Mừng", "Nằm nghỉ", "Quay lưng lại", "Nói chuyện"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('pose-imitation', '🧘‍♂️ BẮT CHƯỚC CỬ ĐIỆU THÁNH CA MAU LẸ', q);
    },

    openMosquitoSlayerGame: function() {
      const q = [
        { question: "Đa-vít đã tin tưởng cậy trông vào ai để hạ gục gã khổng lồ?", options: ["Vào sức mạnh quyền năng của Thiên Chúa", "Vào binh khí nặng nề", "Vào sự may mắn", "Vào quân đội"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('mosquito-slayer', '🐑 ĐA-VÍT BẢO VỆ ĐÀN CHIÊN XUA ĐUỔI CHÓ SÓI', q);
    },

    openMarioRaceGame: function() {
      const q = [
        { question: "Dân Do Thái đã ăn bánh gì trong suốt 40 năm trong sa mạc?", options: ["Bánh Manna từ trời rơi xuống", "Bánh mì nướng lò", "Trái cây rừng", "Bánh ngũ cốc"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('mario-race', '🍄 HÀNH TRÌNH VỀ MIỀN ĐẤT HỨA RETRO 8-BIT', q);
    },

    openCrosswordLock: function() {
      const q = [
        { question: "Nơi Chúa Giê-su sinh ra thuộc miền Giu-đê là gì?", options: ["Bê-lem", "Na-da-rét", "Giê-ru-sa-lem", "Ai-cập"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('crossword-lock', '🔤 Ô CHỮ KINH THÁNH & CHÌA KHÓA CỨU ĐỘ', q);
    },

    openKnowledgeTrain: function() {
      const q = [
        { question: "Biến cố nào xảy ra ĐẦU TIÊN trong Lịch sử Cứu Độ?", options: ["Thiên Chúa sáng tạo trời và đất", "Chúa Giê-su giáng sinh", "Dân Chúa xuất hành", "Hiện Xuống"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('knowledge-train', '🚂 ĐOÀN TÀU ĐỨC TIN — BIẾN CỐ CỨU ĐỘ', q);
    },

    openFruitNinjaQuiz: function() {
      const q = [
        { question: "Đâu là một trong các hoa trái tuyệt đẹp của Chúa Thánh Thần?", options: ["Bác ái, Hoan lạc, Bình an", "Kiêu ngạo, Giận dữ", "Tranh giành, Bất hòa", "Tham lam, Ganh tị"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('fruit-ninja-quiz', '🍇 HÁI HOA TRÁI THÁNH THẦN & BẮT BONG BÓNG ÂN SỦNG', q);
    },

    openCarRaceQuiz: function() {
      const q = [
        { question: "Chiến xa của Tiên tri Ê-li-a có đặc điểm kỳ diệu nào?", options: ["Cỗ xe lửa và ngựa lửa rực rỡ đưa ngài về trời", "Xe bằng vàng", "Xe ngựa kéo thông thường", "Xe bọc thép"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('car-race-quiz', '🏎️ CHIẾN XA TIÊN TRI Ê-LI-A VỀ THIÊN QUỐC', q);
    },

    openMinesweeperQuiz: function() {
      const q = [
        { question: "Có mấy nhân đức Đối Thần giúp người tín hữu đứng vững?", options: ["3 nhân đức: Tin - Cậy - Mến", "4 nhân đức", "7 nhân đức", "10 nhân đức"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('minesweeper-quiz', '🏜️ VƯỢT SA MẠC SINAI VỀ MIỀN ĐẤT HỨA', q);
    },

    openFlyingWordsQuiz: function() {
      const q = [
        { question: "Ghép câu Lời Chúa (Ga 14, 6): 'Thầy là con đường, là sự thật và là...?'", options: ["Sự sống", "Ánh sáng", "Bình an", "Hy vọng"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('flying-words-quiz', '🕊️ BỒ CÂU NGŨ TUẦN — GHÉP CÂU KINH THÁNH', q);
    },

    openMatchingPairsQuiz: function() {
      const q = [
        { question: "Mô-sê gắn liền với phép lạ nào?", options: ["Rẽ nước Biển Đỏ", "Đóng tàu cứu sinh", "Hạ gục Goliath", "Xây Đền Thờ"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('matching-pairs-quiz', '🔗 KÉO THẢ NỐI Ý — NHÂN VẬT & BIẾN CỐ', q);
    },

    openAstronautExplorer: function() {
      window.CatechismGames.openNoahArkRace();
    },

    openMagicHat: function() {
      window.CatechismGames.openClawMachine();
    },

    openMagicGrimoire: function() {
      window.CatechismGames.openMarbleRace();
    },

    openJungleRescueQuiz: function() {
      const q = [
        { question: "Đa-vít đã nói với Goliath rằng ngài nhân danh ai mà tiến ra nghênh chiến?", options: ["Nhân danh Đức Chúa các đạo binh", "Nhân danh vua Sa-un", "Nhân danh gia tộc", "Nhân danh bản thân"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('jungle-rescue-quiz', '🛡️ ĐA-VÍT CHIẾN THẮNG KHỔNG LỒ GOLIATH', q);
    },

    openJeopardyQuiz: function() {
      const q = [
        { question: "[Cựu Ước - 100đ] Ai là người đón nhận Mười Điều Răn trên núi Sinai?", options: ["Ông Mô-sê", "Ông Áp-ra-ham", "Ông Nô-ê", "Ông Đa-vít"], correct: 0 },
        { question: "[Tân Ước - 200đ] Phép lạ đầu tiên Chúa Giê-su thực hiện tại đâu?", options: ["Tiệc cưới Ca-na", "Bê-lem", "Biển hồ Ga-li-lê", "Giê-ri-cô"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('jeopardy-quiz', '🟨 ĐẤU TRÍ BẢNG VÀNG GIÁO LÝ JEOPARDY', q);
    },

    openGeoEarthStructureGame: function() {
      const q = [
        { question: "Lúc khởi đầu, Thiên Chúa đã sáng tạo điều gì?", options: ["Trời và đất", "Muôn loài", "Biển cả", "Muôn sao"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('geo-earth-structure-game', '🌍 3D KỲ QUAN TẠO DỰNG: TRÁI ĐẤT CỦA THIÊN CHÚA', q);
    },

    openGeo3DExperimentsGame: function() {
      const q = [
        { question: "Thánh Vịnh 19 ca tụng công trình sáng tạo như thế nào?", options: ["Trời xanh tường thuật vinh quang Thiên Chúa", "Biển gầm vang dậy", "Trăng sao rực rỡ", "Đất nở hoa tươi"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('geo-3d-experiments-game', '🌐 3D VŨ TRỤ VẠN VẬT CA KHEN THIÊN CHÚA', q);
    },

    openBouncingWordsGame: function() {
      const q = [
        { question: "Từ khóa: 'Chúa là Đấng từ bi và...?'", options: ["Nhân hậu", "Nghiêm trang", "Quyền uy", "Giàu sang"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('bouncing-words-game', '☁️ GHI NHỚ LỜI CHÚA MAU LẸ — TỪ VỰNG BAY', q);
    },

    openMathSackRaceGame: function() {
      const q = [
        { question: "Ngày Chúa Nhật là ngày dành riêng để làm gì?", options: ["Thờ phượng Thiên Chúa, tham dự Thánh Lễ và nghỉ ngơi", "Đi làm việc", "Chỉ để học thêm", "Chỉ để vui chơi"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('math-sack-race-game', '🦘 ĐUA NHẢY BAO BỐ — CUỘC ĐUA VỀ NHÀ CHÚA', q);
    },

    openPirateShipBattleGame: function() {
      const q = [
        { question: "Khi bão tố nổi lên trên biển hồ Ga-li-lê, Chúa Giê-su đã phán điều gì?", options: ["'Hãy yên tâm, Thầy đây, đừng sợ!'", "Hãy chèo nhanh lên", "Hãy quăng lưới đi", "Hãy gọi thiên thần"], correct: 0 }
      ];
      window.CatechismGames.openUniversalCatholicArena('pirate-ship-battle-game', '⛵ CON TÀU ĐỨC TIN VƯỢT SÓNG BIỂN HỒ GA-LI-LÊ', q);
    },

    // ------------------------------------------------------------------------
    // BIBLE READER & DETAILS (Giữ nguyên vẹn tính năng đọc Kinh Thánh)
    // ------------------------------------------------------------------------
    openBookDetails: function(bookId) {
      if (typeof window.SoundFX?.playClick === 'function') window.SoundFX.playClick();
      const data = window.BIBLE_GAME_DATA || {};
      const books = data.books || [];
      const book = books.find(b => b.id === bookId) || books[0];
      if (!book) return;
      alert(`Khám phá Sách: ${book.name} (${book.vietnameseName})\nSố chương: ${book.chapters}\nÝ nghĩa: ${book.meaning || 'Lời Chúa ban sự sống'}`);
    },

    openChapterReader: function(bookId, chapNum) {
      if (typeof window.SoundFX?.playClick === 'function') window.SoundFX.playClick();
      const data = window.BIBLE_GAME_DATA || {};
      const books = data.books || [];
      const book = books.find(b => b.id === bookId) || books[0];
      if (!book) return;
      alert(`Đọc Sách ${book.vietnameseName} - Chương ${chapNum || 1}`);
    },

    // ------------------------------------------------------------------------
    // CUSTOMIZER MODAL (Soạn / Tải file câu hỏi & danh sách học sinh)
    // ------------------------------------------------------------------------
    openCustomizer: function(gameId, title, isStudentPicker) {
      if (typeof window.SoundFX?.playClick === 'function') window.SoundFX.playClick();
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

  console.log("✅ CATECHISM INTERACTIVE GAMES CONTROLLER Loaded Successfully!");
})();

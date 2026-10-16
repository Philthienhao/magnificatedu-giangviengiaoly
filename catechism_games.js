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

    // Lấy danh sách lớp
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
            Không gian trò chơi giáo dục tích cực mang đậm phong cách Công Giáo. 
            Kết hợp công nghệ tương tác Camera nhận diện cử chỉ, cuộc đua tương tác đồng đội và hình ảnh Kinh Thánh sống động 
            giúp các em thiếu nhi học Lời Chúa hào hứng, say mê!
          </p>

          <div class="cg-hero-stats">
            <div class="cg-stat-item">
              <div class="cg-stat-icon"><i class="fa-solid fa-book-bible"></i></div>
              <div>
                <strong>73 Sách Kinh Thánh</strong>
                <div style="font-size: 0.8rem; color: #94a3b8;">46 Cựu Ước • 27 Tân Ước</div>
              </div>
            </div>

            <div class="cg-stat-item">
              <div class="cg-stat-icon"><i class="fa-solid fa-video"></i></div>
              <div>
                <strong>Tương Tác Camera</strong>
                <div style="font-size: 0.8rem; color: #94a3b8;">Nghiêng đầu trả lời qua Webcam</div>
              </div>
            </div>

            <div class="cg-stat-item">
              <div class="cg-stat-icon"><i class="fa-solid fa-ship"></i></div>
              <div>
                <strong>Đua Nhóm & Gọi Tên</strong>
                <div style="font-size: 0.8rem; color: #94a3b8;">Con Tàu Nô-ê • Vòng Quay Tên Thánh</div>
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

        <!-- FILTER & CONTROLS BAR -->
        <div class="cg-filter-bar">
          <div class="cg-filter-tabs">
            <button class="cg-filter-btn active" data-filter="all">
              <i class="fa-solid fa-grid-2"></i> Tất cả trò chơi (10)
            </button>
            <button class="cg-filter-btn" data-filter="race">
              <i class="fa-solid fa-flag-checkered"></i> Đua Nhóm & Gọi Tên
            </button>
            <button class="cg-filter-btn" data-filter="quiz">
              <i class="fa-solid fa-brain"></i> Trắc Nghiệm & Triệu Phú
            </button>
            <button class="cg-filter-btn" data-filter="reflex">
              <i class="fa-solid fa-hands"></i> Vận Động & Khéo Léo
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

        <!-- GAME CARDS GRID: 10 PHONG CÁCH GAME CÔNG GIÁO -->
        <div class="cg-games-grid" id="cg-games-cards-grid">
          
          <!-- GAME 1: CON TÀU NÔ-Ê -->
          <div class="cg-game-card" data-category="race">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_noah_ark.jpg" class="cg-card-thumb" alt="Cuộc Đua Con Tàu Nô-ê">
              <div class="cg-card-overlay-badge"><i class="fa-solid fa-ship"></i> ĐUA TỔ & ĐỒNG ĐỘI</div>
              <div class="cg-card-tech-tag"><i class="fa-solid fa-file-excel"></i> HỖ TRỢ EXCEL</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Cuộc Đua Con Tàu Nô-ê & Vòng Quay</h3>
              <p class="cg-card-desc">
                Gọi tên học viên ngẫu nhiên hoặc chia tổ đua kịch tính về đích Con Tàu Nô-ê. 
                Đồng bộ danh sách học viên từ lớp giáo lý hoặc nạp file Excel.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-users-viewfinder"></i> Cả lớp / 8 Làn đua</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openNoahArkRace()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 2: VÒNG QUAY THIÊN THẦN & THÁNH BỔN MẠNG -->
          <div class="cg-game-card" data-category="race">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_angel_wheel.jpg" class="cg-card-thumb" alt="Vòng Quay Thiên Thần">
              <div class="cg-card-overlay-badge" style="background: linear-gradient(135deg, #f59e0b, #d97706);"><i class="fa-solid fa-dharmachakra"></i> VÒNG QUAY MAY MẮN</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #0ea5e9, #0284c7);"><i class="fa-solid fa-gift"></i> GỌI TÊN THÁNH</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Vòng Quay Thiên Thần & Thánh Bổn Mạng</h3>
              <p class="cg-card-desc">
                Vòng quay ngẫu nhiên sống động với âm thanh tích tắc vui nhộn, gọi tên học viên lên trả bài, 
                đọc kinh hoặc nhận các phần quà phúc lành ân sủng.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-rotate"></i> Quay thưởng ngẫu nhiên</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openAngelWheel()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 3: TRIỆU PHÚ KINH THÁNH -->
          <div class="cg-game-card" data-category="quiz">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_bible_millionaire.jpg" class="cg-card-thumb" alt="Triệu Phú Kinh Thánh">
              <div class="cg-card-overlay-badge" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);"><i class="fa-solid fa-trophy"></i> 15 CẤP ĐỘ ÂN SỦNG</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #ef4444, #dc2626);"><i class="fa-solid fa-bell"></i> ÂM THANH KỊCH TÍNH</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Thử Thách Triệu Phú Kinh Thánh</h3>
              <p class="cg-card-desc">
                Gameshow Ai Là Triệu Phú chuẩn phong cách Công Giáo. Chinh phục 15 mốc câu hỏi ân sủng 
                kèm 3 quyền trợ giúp: 50:50, Hỏi ý kiến các thiên thần, Cầu nguyện đổi câu hỏi.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-lightbulb"></i> Kiến thức Kinh Thánh</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openBibleMillionaire()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 4: CHIẾC RƯƠNG GIAO ƯỚC BÍ ẨN -->
          <div class="cg-game-card" data-category="quiz">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_covenant_boxes.jpg" class="cg-card-thumb" alt="Chiếc Rương Giao Ước">
              <div class="cg-card-overlay-badge" style="background: linear-gradient(135deg, #10b981, #059669);"><i class="fa-solid fa-box-open"></i> HỘP QUÀ BÍ MẬT</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #f59e0b, #b45309);"><i class="fa-solid fa-sparkles"></i> PHẦN THƯỞNG BẤT NGỜ</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Chiếc Rương Giao Ước Bí Ẩn</h3>
              <p class="cg-card-desc">
                Học sinh chọn mở các chiếc rương thánh bọc vàng. Giải đáp câu đố Lời Chúa để mở khóa 
                các điểm số ân sủng, nhân đôi số điểm hoặc lá chắn chở che.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-boxes-stacked"></i> 8 Rương Thánh</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openCovenantBoxes()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 5: KÉO CO ĐỨC TIN: DAVID & GOLIATH -->
          <div class="cg-game-card" data-category="race">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_faith_tugofwar.jpg" class="cg-card-thumb" alt="Kéo Co Đức Tin">
              <div class="cg-card-overlay-badge" style="background: linear-gradient(135deg, #dc2626, #991b1b);"><i class="fa-solid fa-people-robbery"></i> THI ĐẤU ĐỐI KHÁNG</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #2563eb, #1d4ed8);"><i class="fa-solid fa-arrows-split-up-and-left"></i> 2 ĐỘI THI ĐUA</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Kéo Co Đức Tin: David & Goliath</h3>
              <p class="cg-card-desc">
                Chia 2 đội (Đội Phê-rô vs Đội Phao-lô). Mỗi câu trả lời đúng sẽ kéo dải ruy-băng Thánh Giá 
                về phía đội mình. Đội nào kéo qua vạch mốc chiến thắng sẽ giành cúp Thánh!
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-users"></i> 2 Đội đối kháng</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openFaithTugOfWar()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 6: LẬT MẢNH GHÉP TRANH CHÚA CHIÊN LÀNH -->
          <div class="cg-game-card" data-category="reflex">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_holy_picture_flip.jpg" class="cg-card-thumb" alt="Lật Mảnh Ghép Tranh Thánh">
              <div class="cg-card-overlay-badge" style="background: linear-gradient(135deg, #d97706, #78350f);"><i class="fa-solid fa-puzzle-piece"></i> MẢNH GHÉP TRANH THÁNH</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #10b981, #059669);"><i class="fa-solid fa-eye"></i> KHÁM PHÁ BÍ MẬT</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Lật Mảnh Ghép Tranh Chúa Chiên Lành</h3>
              <p class="cg-card-desc">
                Bức tranh Thánh được che bởi 9 mảnh ghép bí mật. Trả lời đúng từng câu đố để từng mảnh ghép 
                bay biến mất hé lộ dung mạo Đấng Mục Tử Nhân Lành.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-table-cells"></i> 9 Mảnh ghép</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openHolyPictureFlip()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 7: XÂY ĐỀN THỜ THÁNH GIÊ-RU-SA-LEM -->
          <div class="cg-game-card" data-category="reflex">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_temple_builder.jpg" class="cg-card-thumb" alt="Xây Đền Thờ Giê-ru-sa-lem">
              <div class="cg-card-overlay-badge" style="background: linear-gradient(135deg, #b45309, #78350f);"><i class="fa-solid fa-monument"></i> XÂY DỰNG ĐỀN THỜ</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8);"><i class="fa-solid fa-cube"></i> VUA SA-LÔ-MÔN</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Xây Đền Thờ Thánh Giê-ru-sa-lem</h3>
              <p class="cg-card-desc">
                Cùng Vua Sa-lô-môn xếp các khối đá cẩm thạch trắng và cột gỗ quý Li-băng. Mỗi câu trả lời đúng 
                sẽ đặt một tầng đá vững chắc để hoàn tất Đền Thờ Thiên Chúa.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-layer-group"></i> 7 Tầng đá thánh</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openTempleBuilder()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 8: THỬ THÁCH NGHIÊNG ĐẦU CAMERA -->
          <div class="cg-game-card" data-category="quiz">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_head_tilt.jpg" class="cg-card-thumb" alt="Nghiêng Đầu Trả Lời Trắc Nghiệm">
              <div class="cg-card-overlay-badge"><i class="fa-solid fa-camera"></i> TƯƠNG TÁC CAMERA</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #10b981, #059669);"><i class="fa-solid fa-video"></i> WEBCAM</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Thử Thách Nghiêng Đầu: Phân Định Thiêng Liêng</h3>
              <p class="cg-card-desc">
                Học sinh đứng trước Webcam máy chiếu, nghiêng đầu Trái (A - Thánh Giá) hoặc Phải (B - Bồ Câu) 
                để giải đáp các câu đố Kinh Thánh & Giáo lý hấp dẫn.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-user-check"></i> Cá nhân / Tương tác Web</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openHeadTiltAI()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 9: MỤC TỬ BẢO VỆ ĐÀN CHIÊN (DAVID) -->
          <div class="cg-game-card" data-category="reflex">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_shepherd_rescue.jpg" class="cg-card-thumb" alt="Mục Tử Bảo Vệ Đàn Chiên">
              <div class="cg-card-overlay-badge"><i class="fa-solid fa-shield-halved"></i> VẬN ĐỘNG & PHẢN XẠ</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #f59e0b, #d97706);"><i class="fa-solid fa-stopwatch"></i> PHẢN XẠ 30S</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Người Mục Tử Tốt Lành Bảo Vệ Đàn Chiên</h3>
              <p class="cg-card-desc">
                Cùng cậu bé dũng cảm Đa-vít giải cứu các chú chiên con hiền lành và gõ xua đuổi sói rừng 
                trong 30 giây rực lửa. Rèn luyện phản xạ và tinh thần bác ái.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-hand-pointer"></i> Chạm / Click nhanh</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openShepherdRescue()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 10: GIẢI MÃ CẶP ĐÔI KINH THÁNH (MEMORY) -->
          <div class="cg-game-card" data-category="reflex">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_bible_memory.jpg" class="cg-card-thumb" alt="Giải Mã Cặp Đôi Kinh Thánh">
              <div class="cg-card-overlay-badge"><i class="fa-solid fa-clone"></i> TƯ DUY & GHI NHỚ</div>
              <div class="cg-card-tech-tag" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);"><i class="fa-solid fa-sparkles"></i> LẬT THẺ CHIBI</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Giải Mã Cặp Đôi Kinh Thánh (Chibi Memory)</h3>
              <p class="cg-card-desc">
                Lật mở các cặp thẻ bài chibi Công Giáo (Chúa Giê-su, Đức Mẹ, Thánh Giuse, Chén Thánh...). 
                Khi ghép đúng sẽ mở khóa một câu Lời Chúa ý nghĩa tương ứng.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-brain"></i> Rèn luyện trí nhớ</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openBibleMemoryPairs()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- SECTION: KHÁM PHÁ 73 SÁCH KINH THÁNH -->
        <div class="cg-bible-browser-section" id="cg-bible-books-section">
          <div class="cg-browser-header">
            <h2 class="cg-browser-title">
              <i class="fa-solid fa-book-bible" style="color: #fbbf24;"></i>
              Kho Tra Cứu 73 Sách Kinh Thánh (Trọn Bộ Cựu Ước & Tân Ước)
            </h2>
            <div style="font-size: 0.85rem; color: #94a3b8;">
              <span style="display: inline-block; width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; margin-right: 4px;"></span> Cựu Ước (46)
              &nbsp;&nbsp;
              <span style="display: inline-block; width: 10px; height: 10px; background: #38bdf8; border-radius: 50%; margin-right: 4px;"></span> Tân Ước (27)
            </div>
          </div>

          <div class="cg-books-grid">
            ${books.map(b => `
              <div class="cg-book-chip ${b.testament === 'new' ? 'new-testament' : 'old-testament'}" 
                   onclick="window.CatechismGames.openBookDetails('${b.id}')"
                   title="Bấm để xem chi tiết sách ${b.name} (${b.abbr}) - ${b.chapters} chương">
                <span><i class="fa-solid ${b.icon || 'fa-scroll'}"></i> <strong>${b.abbr}.</strong> ${b.name}</span>
                <small style="color: #94a3b8; font-weight: 700;">${b.chapters}c</small>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Filter Button Handler
    const filterBtns = container.querySelectorAll('.cg-filter-btn');
    const cards = container.querySelectorAll('.cg-game-card');
    const bibleSec = container.querySelector('#cg-bible-books-section');

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
  // ==========================================================================
  window.CatechismGames = {

    // ------------------------------------------------------------------------
    // 1. GAME: CON TÀU NÔ-Ê & VÒNG QUAY THÁNH BỔN MẠNG
    // ------------------------------------------------------------------------
    openNoahArkRace: function() {
      SoundFX.playBell();
      const selectedClassId = document.getElementById('cg-selected-class-dropdown')?.value || 'all';
      let roster = getStudentRoster(selectedClassId);
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
            <button class="cg-arena-btn-icon cg-arena-btn-close" onclick="window.CatechismGames.closeArena('cg-noah-arena')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="cg-arena-body">
          <div class="cg-noah-stage">
            <div class="cg-roster-bar">
              <div class="cg-roster-info">
                <i class="fa-solid fa-flag-checkered" style="color: #fbbf24; font-size: 1.3rem;"></i>
                <span>Sẵn sàng cho <strong>${currentRacers.length} làn đua</strong></span>
              </div>
              <div style="display: flex; gap: 10px;">
                <label class="cg-btn-play" style="padding: 6px 14px; font-size: 0.85rem; cursor: pointer; background: rgba(30, 41, 59, 0.9); color: #fff; border: 1px solid rgba(245, 158, 11, 0.4);">
                  <i class="fa-solid fa-file-excel"></i> Nạp Excel
                  <input type="file" id="cg-noah-excel-input" accept=".xlsx, .xls" style="display: none;">
                </label>
                <button class="cg-btn-play" id="cg-btn-start-race">
                  <i class="fa-solid fa-bolt"></i> XUẤT PHÁT ĐUA!
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
      const questions = (window.BIBLE_GAME_DATA && window.BIBLE_GAME_DATA.tiltQuestions) || [];
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
            <div style="color: #fbbf24; font-weight: 800; font-size: 1rem; margin-right: 15px;" id="cg-tilt-score-badge">
              <i class="fa-solid fa-star"></i> Điểm: 0
            </div>
            <button class="cg-arena-btn-icon cg-arena-btn-close" onclick="window.CatechismGames.closeArena('cg-tilt-arena')">
              <i class="fa-solid fa-xmark"></i>
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

              <div style="margin-top: 1.5rem; color: #94a3b8; font-size: 0.85rem; text-align: center;">
                💡 <em>Thầy cô hoặc học sinh có thể nghiêng đầu tự nhiên trước camera, hoặc bấm phím mũi tên <strong>⬅️ Trái / ➡️ Phải</strong> trên bàn phím.</em>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);

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
            <button class="cg-arena-btn-icon cg-arena-btn-close" onclick="window.CatechismGames.closeArena('cg-shepherd-arena')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="cg-arena-body">
          <div class="cg-shepherd-stage" id="cg-shepherd-field">
            <div class="cg-game-hud">
              <div class="cg-hud-card" style="border-color: #38bdf8;">
                <i class="fa-solid fa-stopwatch" style="color: #38bdf8;"></i>
                Thời gian: <span id="cg-shepherd-time">30</span>s
              </div>
              <div class="cg-hud-card" style="border-color: #fbbf24;">
                <i class="fa-solid fa-star" style="color: #fbbf24;"></i>
                Điểm: <span id="cg-shepherd-score">0</span>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);
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
            <div style="color: #fbbf24; font-weight: 800; font-size: 1rem; margin-right: 15px;" id="cg-mem-matched-text">
              <i class="fa-solid fa-check-double"></i> Đã ghép: 0 / 8 cặp
            </div>
            <button class="cg-arena-btn-icon cg-arena-btn-close" onclick="window.CatechismGames.closeArena('cg-memory-arena')">
              <i class="fa-solid fa-xmark"></i>
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
        <div style="font-size: 3rem; margin-bottom: 10px;">🏆</div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: #fbbf24; margin-bottom: 0.8rem;">${title}</h2>
        <div style="font-size: 1.05rem; color: #e2e8f0; line-height: 1.6; margin-bottom: 1.8rem;">${desc}</div>
        <button class="cg-btn-play" style="padding: 10px 28px; font-size: 1rem; margin: 0 auto;" onclick="this.parentElement.remove()">
          <i class="fa-solid fa-check"></i> ĐỒNG Ý
        </button>
      `;
      document.body.appendChild(modal);
    },

    // ------------------------------------------------------------------------
    // 5. MODAL: 73 BIBLE BOOKS EXPLORER & SCRIPTURE DETAILS
    // ------------------------------------------------------------------------
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
        .map(chapNum => `<button type="button" class="cg-chap-chip" onclick="window.CatechismGames.selectChapter('${book.name}', ${chapNum})" title="Xem Chương ${chapNum}">${chapNum}</button>`)
        .join('');

      modalEl.innerHTML = `
        <div class="cg-book-modal-card" onclick="event.stopPropagation()">
          <div class="cg-book-modal-header">
            <button class="cg-modal-close-btn" onclick="document.getElementById('cg-book-detail-modal')?.remove()" title="Đóng">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="cg-book-modal-badges">
              <span class="cg-badge-testament ${book.testament}">${book.testament === 'new' ? 'Tân Ước' : 'Cựu Ước'}</span>
              <span class="cg-badge-group"><i class="fa-solid fa-bookmark"></i> Nhóm: ${book.group}</span>
              <span class="cg-badge-group"><i class="fa-solid fa-list-ol"></i> ${book.chapters} Chương</span>
            </div>
            <h2 class="cg-book-modal-title">
              <i class="fa-solid ${book.icon || 'fa-book-bible'}" style="color: #fbbf24;"></i>
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
                <i class="fa-solid fa-quote-left"></i> Câu Lời Chúa Nổi Bật (Kim Ngôn)
              </div>
              <div class="cg-book-golden-text">
                "${book.goldenVerse || 'Đang cập nhật'}"
              </div>
              <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                <button type="button" class="cg-btn-book-nav" style="padding: 5px 12px; font-size: 0.78rem;" onclick="window.CatechismGames.copyVerse('${encodeURIComponent(book.goldenVerse || '')}')">
                  <i class="fa-solid fa-copy"></i> Sao chép Lời Chúa
                </button>
              </div>
            </div>

            <div class="cg-book-chaps-wrapper">
              <div class="cg-book-info-label">
                <i class="fa-solid fa-list-check" style="color: #10b981;"></i> Tra Cứu Các Chương (${book.chapters} Chương)
              </div>
              <div class="cg-book-chaps-grid">
                ${chapsHtml}
              </div>
            </div>
          </div>

          <div class="cg-book-modal-footer">
            ${prevBook ? `
              <button class="cg-btn-book-nav" onclick="window.CatechismGames.openBookDetails('${prevBook.id}')" title="Sách trước">
                <i class="fa-solid fa-chevron-left"></i> ${prevBook.name} (${prevBook.abbr})
              </button>
            ` : '<div></div>'}

            <div style="display: flex; gap: 8px;">
              <a href="https://kinhthanh.cgkpv.org/" target="_blank" rel="noopener" class="cg-btn-book-read" title="Mở trang Kinh Thánh CGKPV">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Đọc Kinh Thánh CGKPV
              </a>
              <button class="cg-btn-book-nav" onclick="document.getElementById('cg-book-detail-modal')?.remove()">
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

    selectChapter: function(bookName, chapNum) {
      SoundFX.playClick();
      if (typeof window.showToast === 'function') {
        window.showToast(`📖 Đang chọn Sách ${bookName} - Chương ${chapNum}`, 'info');
      } else {
        alert(`📖 Sách ${bookName} - Chương ${chapNum}`);
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
      let roster = getStudentRoster(selectedClassId);
      
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
            <i class="fa-solid fa-dharmachakra" style="color: #fbbf24;"></i>
            Vòng Quay Thiên Thần & Thánh Bổn Mạng
          </div>
          <div style="font-size: 0.9rem; color: #cbd5e1;">
            <i class="fa-solid fa-users"></i> ${slices.length} Mục quay
          </div>
          <button class="cg-arena-close" onclick="window.CatechismGames.closeArena('cg-angel-wheel-arena')">
            <i class="fa-solid fa-xmark"></i> Thoát
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
          <button class="cg-btn-play" id="cg-wheel-spin-bottom-btn" style="padding: 12px 36px; font-size: 1.05rem;">
            <i class="fa-solid fa-rotate"></i> BẮT ĐẦU QUAY NGAY
          </button>
        </div>
      `;

      document.body.appendChild(arenaEl);

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
      const questions = data.millionaireQuestions || [];
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
              <i class="fa-solid fa-trophy" style="color: #fbbf24;"></i>
              Ai Là Triệu Phú Kinh Thánh
            </div>
            <div style="font-size: 0.95rem; color: #fbbf24; font-weight: 700;">
              Mức hiện tại: ${q.reward}
            </div>
            <button class="cg-arena-close" onclick="window.CatechismGames.closeArena('cg-millionaire-arena')">
              <i class="fa-solid fa-xmark"></i> Thoát
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
                <div style="font-size: 0.85rem; color: #fbbf24; font-weight: 800; margin-bottom: 8px;">
                  CÂU HỎI SỐ ${currentLevel + 1} / 15 (${q.reward})
                </div>
                <div class="cg-mil-qtext">${q.question}</div>
              </div>

              <!-- OPTIONS A, B, C, D -->
              <div class="cg-mil-options" id="cg-mil-opts-grid">
                ${q.options.map((opt, idx) => `
                  <button class="cg-mil-opt-btn" data-opt-idx="${idx}">
                    <strong style="color: #fbbf24; font-size: 1.15rem; min-width: 24px;">${String.fromCharCode(65 + idx)}.</strong>
                    <span>${opt}</span>
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
    },

    // ------------------------------------------------------------------------
    // 8. GAME: CHIẾC RƯƠNG GIAO ƯỚC BÍ ẨN (COVENANT MYSTERY BOXES)
    // ------------------------------------------------------------------------
    openCovenantBoxes: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const boxes = data.covenantBoxes || [];
      let openedCount = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-covenant-boxes-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title">
            <i class="fa-solid fa-box-open" style="color: #fbbf24;"></i>
            Chiếc Rương Giao Ước Bí Ẩn
          </div>
          <div style="font-size: 0.95rem; color: #10b981; font-weight: 700;" id="cg-box-opened-counter">
            Đã mở: 0 / 8 Rương Thánh
          </div>
          <button class="cg-arena-close" onclick="window.CatechismGames.closeArena('cg-covenant-boxes-arena')">
            <i class="fa-solid fa-xmark"></i> Thoát
          </button>
        </div>

        <div class="cg-boxes-arena-body">
          <div class="cg-boxes-grid" id="cg-covenant-boxes-grid">
            ${boxes.map((b, idx) => `
              <div class="cg-covenant-box" data-box-idx="${idx}">
                <div class="cg-box-icon">📦</div>
                <div class="cg-box-title">${b.title}</div>
                <div style="font-size: 0.8rem; color: #fbbf24; font-weight: 700;">Bấm để mở</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);

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
          qModal.style.maxWidth = '580px';
          qModal.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 6px;">✨ 📦 ✨</div>
            <h3 style="font-size: 1.3rem; color: #fbbf24; margin-bottom: 1rem;">${box.title} (${box.prize})</h3>
            <p style="font-size: 1.1rem; color: #f8fafc; margin-bottom: 1.5rem; font-weight: 600;">${box.question}</p>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
              ${box.options.map((opt, oIdx) => `
                <button class="cg-filter-btn" style="width: 100%; justify-content: flex-start; padding: 12px 18px;" data-c-idx="${oIdx}">
                  <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                </button>
              `).join('')}
            </div>
            <button class="cg-btn-nav" onclick="this.closest('.cg-win-modal').remove()">Hủy bỏ</button>
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
      const questions = data.tugOfWarQuestions || [];
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
              <i class="fa-solid fa-people-robbery" style="color: #fbbf24;"></i>
              Kéo Co Đức Tin: David & Goliath
            </div>
            <div style="font-size: 0.95rem; color: ${activeTeam === 0 ? '#38bdf8' : '#f87171'}; font-weight: 800;">
              LƯỢT TRẢ LỜI: ${activeTeam === 0 ? 'ĐỘI THÁNH PHÊ-RÔ (XANH)' : 'ĐỘI THÁNH PHAO-LÔ (ĐỎ)'}
            </div>
            <button class="cg-arena-close" onclick="window.CatechismGames.closeArena('cg-tugofwar-arena')">
              <i class="fa-solid fa-xmark"></i> Thoát
            </button>
          </div>

          <div class="cg-tow-arena">
            <div class="cg-tow-visual">
              <div class="cg-tow-stage">
                <!-- TEAM LEFT (PHÊ-RÔ) -->
                <div class="cg-tow-team">
                  <div class="cg-tow-team-avatar">⛵</div>
                  <strong style="color: #38bdf8; font-size: 1.15rem;">Đội Phê-rô</strong>
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
                  <strong style="color: #f87171; font-size: 1.15rem;">Đội Phao-lô</strong>
                </div>
              </div>
            </div>

            <!-- QUESTION AREA -->
            <div style="max-width: 720px; width: 100%; margin: 0 auto; background: rgba(15, 23, 42, 0.9); border: 2px solid #f59e0b; border-radius: 18px; padding: 20px; text-align: center;">
              <div style="font-size: 0.85rem; color: #fbbf24; font-weight: 700; margin-bottom: 6px;">CÂU HỎI TRỐI DÂY</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-bottom: 1.2rem;">${q.question}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                ${q.options.map((opt, idx) => `
                  <button class="cg-btn-play" style="justify-content: center; padding: 14px; font-size: 1rem;" data-tow-idx="${idx}">
                    <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
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
    },

    // ------------------------------------------------------------------------
    // 10. GAME: LẬT MẢNH GHÉP TRANH CHÚA CHIÊN LÀNH (PICTURE FLIP)
    // ------------------------------------------------------------------------
    openHolyPictureFlip: function() {
      SoundFX.playBell();
      const data = window.BIBLE_GAME_DATA || {};
      const questions = data.pictureFlipQuestions || [];
      let revealedCount = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-picture-flip-arena';

      arenaEl.innerHTML = `
        <div class="cg-arena-header">
          <div class="cg-arena-title">
            <i class="fa-solid fa-puzzle-piece" style="color: #fbbf24;"></i>
            Lật Mảnh Ghép Tranh Chúa Chiên Lành
          </div>
          <div style="font-size: 0.95rem; color: #10b981; font-weight: 700;" id="cg-pflip-counter">
            Đã mở: 0 / 9 Mảnh ghép
          </div>
          <button class="cg-arena-close" onclick="window.CatechismGames.closeArena('cg-picture-flip-arena')">
            <i class="fa-solid fa-xmark"></i> Thoát
          </button>
        </div>

        <div class="cg-pflip-arena">
          <div class="cg-pflip-board">
            <img src="anh/games/thumb_holy_picture_flip.jpg" class="cg-pflip-bg-img" alt="Chúa Chiên Lành">
            <div class="cg-pflip-grid" id="cg-pflip-grid">
              ${questions.map((q, idx) => `
                <div class="cg-pflip-tile" data-tile-idx="${idx}">
                  <span>#${idx + 1}</span>
                  <small style="font-size: 0.65rem; color: #94a3b8;">Bấm mở</small>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(arenaEl);

      arenaEl.querySelectorAll('.cg-pflip-tile').forEach(tileEl => {
        tileEl.addEventListener('click', () => {
          if (tileEl.classList.contains('revealed')) return;
          const idx = parseInt(tileEl.getAttribute('data-tile-idx'), 10);
          const q = questions[idx];
          SoundFX.playPop();

          const modal = document.createElement('div');
          modal.className = 'cg-win-modal';
          modal.style.maxWidth = '540px';
          modal.innerHTML = `
            <div style="font-size: 2.2rem; margin-bottom: 6px;">🧩 MẢNH GHÉP SỐ ${idx + 1}</div>
            <p style="font-size: 1.15rem; color: #f8fafc; margin-bottom: 1.5rem; font-weight: 700;">${q.question}</p>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
              ${q.options.map((opt, oIdx) => `
                <button class="cg-filter-btn" style="width: 100%; justify-content: flex-start; padding: 12px 18px;" data-ans-idx="${oIdx}">
                  <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                </button>
              `).join('')}
            </div>
            <button class="cg-btn-nav" onclick="this.closest('.cg-win-modal').remove()">Đóng</button>
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
      const questions = data.templeQuestions || [];
      let currentBlock = 0;

      const arenaEl = document.createElement('div');
      arenaEl.className = 'cg-arena-overlay';
      arenaEl.id = 'cg-temple-arena';

      function renderTempleUI() {
        const q = questions[currentBlock];

        arenaEl.innerHTML = `
          <div class="cg-arena-header">
            <div class="cg-arena-title">
              <i class="fa-solid fa-monument" style="color: #fbbf24;"></i>
              Xây Đền Thờ Thánh Giê-ru-sa-lem
            </div>
            <div style="font-size: 0.95rem; color: #fbbf24; font-weight: 700;">
              Tiến độ: ${currentBlock} / 7 Tầng đá cẩm thạch
            </div>
            <button class="cg-arena-close" onclick="window.CatechismGames.closeArena('cg-temple-arena')">
              <i class="fa-solid fa-xmark"></i> Thoát
            </button>
          </div>

          <div class="cg-temple-arena">
            <!-- TEMPLE STACK COLUMN -->
            <div class="cg-temple-column" id="cg-temple-blocks-col">
              <div style="position: absolute; top: 12px; font-size: 0.8rem; color: #fbbf24; font-weight: 800;">
                <i class="fa-solid fa-crown"></i> NƠI CỰC THÁNH (ĐỈNH ĐỀN THỜ)
              </div>
            </div>

            <!-- QUESTION CARD -->
            <div style="max-width: 520px; width: 100%; background: rgba(15, 23, 42, 0.9); border: 2px solid #f59e0b; border-radius: 18px; padding: 24px; text-align: center;">
              <div style="font-size: 0.85rem; color: #fbbf24; font-weight: 800; margin-bottom: 8px;">
                ĐẶT KHỐI ĐÁ SỐ ${currentBlock + 1} / 7
              </div>
              <div style="font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-bottom: 1.5rem;">
                ${q.question}
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${q.options.map((opt, idx) => `
                  <button class="cg-btn-play" style="justify-content: flex-start; padding: 14px 20px; font-size: 1rem;" data-temple-opt="${idx}">
                    <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
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
    },

    closeArena: function(arenaId) {
      const arena = document.getElementById(arenaId);
      if (arena) {
        if (arena._cleanupCamera) arena._cleanupCamera();
        if (arena._cleanupKey) arena._cleanupKey();
        if (arena._cleanupShepherd) arena._cleanupShepherd();
        arena.remove();
      }
    }
  };

  console.log("✅ CATECHISM INTERACTIVE GAMES CONTROLLER Loaded Successfully!");
})();

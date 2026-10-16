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
              <i class="fa-solid fa-grid-2"></i> Tất cả trò chơi
            </button>
            <button class="cg-filter-btn" data-filter="noah">
              <i class="fa-solid fa-ship"></i> Đua Nô-ê & Gọi Tên
            </button>
            <button class="cg-filter-btn" data-filter="camera">
              <i class="fa-solid fa-camera"></i> Camera Nghiêng Đầu
            </button>
            <button class="cg-filter-btn" data-filter="reflex">
              <i class="fa-solid fa-hands"></i> Vận Động & Phản Xạ
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

        <!-- GAME CARDS GRID -->
        <div class="cg-games-grid" id="cg-games-cards-grid">
          
          <!-- GAME 1: CON TÀU NÔ-Ê & VÒNG QUAY THÁNH BỔN MẠNG -->
          <div class="cg-game-card" data-category="noah">
            <div class="cg-card-thumb-wrap">
              <img src="anh/games/thumb_noah_ark.jpg" class="cg-card-thumb" alt="Cuộc Đua Con Tàu Nô-ê">
              <div class="cg-card-overlay-badge"><i class="fa-solid fa-ship"></i> GỌI TÊN & ĐUA NHÓM</div>
              <div class="cg-card-tech-tag"><i class="fa-solid fa-file-excel"></i> HỖ TRỢ EXCEL</div>
            </div>
            <div class="cg-card-body">
              <h3 class="cg-card-title">Cuộc Đua Con Tàu Nô-ê & Vòng Quay Thiên Thần</h3>
              <p class="cg-card-desc">
                Gọi tên học viên ngẫu nhiên kèm Tên Thánh hoặc chia tổ đua kịch tính về đích Con Tàu Nô-ê. 
                Tự động đồng bộ danh sách học viên từ lớp giáo lý hoặc nạp file Excel.
              </p>
              <div class="cg-card-footer">
                <div class="cg-card-players"><i class="fa-solid fa-users-viewfinder"></i> Cả lớp / 8 Làn đua</div>
                <button class="cg-btn-play" onclick="window.CatechismGames.openNoahArkRace()">
                  <i class="fa-solid fa-play"></i> BẮT ĐẦU CHƠI
                </button>
              </div>
            </div>
          </div>

          <!-- GAME 2: THỬ THÁCH NGHIÊNG ĐẦU CAMERA -->
          <div class="cg-game-card" data-category="camera">
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

          <!-- GAME 3: MỤC TỬ BẢO VỆ ĐÀN CHIÊN (DAVID) -->
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

          <!-- GAME 4: GIẢI MÃ CẶP ĐÔI KINH THÁNH (MEMORY) -->
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

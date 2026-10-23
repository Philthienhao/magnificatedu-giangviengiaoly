/**
 * ==========================================================================
 * 5 PHÚT LỜI CHÚA MỖI NGÀY - FLIPBOOK CONTROLLER
 * MagnificatEdu - Nền Tảng Giáo Viên Giáo Lý
 * ==========================================================================
 */

(function() {
  'use strict';

  // --- Local / Global State ---
  const state = {
    currentDay: 23, // Default fallback
    theme: localStorage.getItem('daily_word_theme') || 'sepia',
    fontSize: localStorage.getItem('daily_word_font_size') || 'normal',
    viewMode: localStorage.getItem('daily_word_view_mode') || 'flipbook',
    isSoundEnabled: localStorage.getItem('daily_word_sound') !== 'false',
    isTwoPageMode: window.innerWidth > 900,
    isSpeaking: false,
    searchKeyword: '',
    audioCtx: null
  };

  // Determine real calendar today's day of October (1..31)
  function getSystemTodayDay() {
    const now = new Date();
    // In October (month index 9), day is clamped to 1..31
    if (now.getMonth() === 9) {
      return Math.min(31, Math.max(1, now.getDate()));
    }
    // Outside October, fallback to current day or clamped 1..31
    return Math.min(31, Math.max(1, now.getDate()));
  }

  // Real today day number
  const REAL_TODAY_DAY = getSystemTodayDay();
  state.currentDay = REAL_TODAY_DAY;

  // --- Web Audio Synthetic Paper Turn Sound ---
  function playPaperTurnSound() {
    if (!state.isSoundEnabled) return;
    try {
      if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) state.audioCtx = new AudioContext();
      }
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const ctx = state.audioCtx;
      const duration = 0.2;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/White filtered noise for realistic paper rustle
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + duration);
      filter.Q.setValueAtTime(1.6, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // --- Helper: Get Day Data ---
  function getDayData(dayNum) {
    if (!window.DAILY_WORD_DATA || !window.DAILY_WORD_DATA.days) return null;
    return window.DAILY_WORD_DATA.days.find(d => d.day === Number(dayNum)) || null;
  }

  function getAllDays() {
    if (!window.DAILY_WORD_DATA || !window.DAILY_WORD_DATA.days) return [];
    return window.DAILY_WORD_DATA.days;
  }

  // --- Escape HTML Helper ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- Main Page Render Entry ---
  window.renderDailyWordPage = function(container) {
    if (!container) container = document.getElementById('content-area');
    if (!container) return;

    state.isTwoPageMode = window.innerWidth > 900;
    const allDays = getAllDays();
    const currentData = getDayData(state.currentDay) || (allDays[0] || {});

    container.innerHTML = `
      <div class="daily-word-container" id="daily-word-root" data-theme="${state.theme}" data-font-size="${state.fontSize}">
        
        <!-- Hero Liturgical Banner -->
        <div class="dw-hero-header">
          <div class="dw-hero-top">
            <span class="dw-badge-tag">
              <i class="fa-solid fa-cross"></i> 5 Phút Lời Chúa Mỗi Ngày
            </span>
            <span class="dw-hero-verse">
              <i class="fa-solid fa-quote-left"></i> "Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi" (Tv 119, 105)
            </span>
          </div>

          <div class="dw-hero-main">
            <div class="dw-hero-title-group">
              <div class="dw-hero-icon-box">
                <i class="fa-solid fa-book-bible"></i>
              </div>
              <div>
                <h1 class="dw-hero-title">
                  Suy Niệm Lời Chúa Hằng Ngày
                  <span class="badge badge-pill badge-warning" style="font-size: 13px; font-weight: 700; background: rgba(245,158,11,0.25); color: #fde68a;">Tháng 10/2026</span>
                </h1>
                <p class="dw-hero-subtitle">
                  Dành 5 phút mỗi ngày đọc, gẫm và sống Lời Chúa để nuôi dưỡng đời sống đức tin Kitô hữu và tâm hồn phục vụ của người Giáo Lý Viên.
                </p>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="dw-nav-group">
              <button type="button" class="dw-btn dw-btn-primary" onclick="window.dailyWordToday()" title="Nhảy về bài Lời Chúa hôm nay">
                <i class="fa-solid fa-calendar-day"></i> Hôm Nay (${String(REAL_TODAY_DAY).padStart(2, '0')}/10)
              </button>
              <button type="button" class="dw-btn" onclick="window.toggleDailyWordCalendarModal(true)" title="Xem lịch chọn 31 ngày trong tháng">
                <i class="fa-solid fa-calendar-days text-warning"></i> Chọn Ngày Trong Tháng
              </button>
            </div>
          </div>
        </div>

        <!-- Customizer Toolbar -->
        <div class="dw-toolbar">
          
          <!-- Date Navigator Group -->
          <div class="dw-nav-group">
            <button type="button" class="dw-btn" onclick="window.dailyWordPrevDay()" ${state.currentDay <= 1 ? 'disabled' : ''} title="Đọc ngày trước (Phím ←)">
              <i class="fa-solid fa-chevron-left"></i> <span class="d-none d-sm-inline">Ngày trước</span>
            </button>

            <!-- Quick Date Select Dropdown -->
            <div class="dw-date-select-wrap">
              <select class="dw-date-select" id="dw-date-select" onchange="window.dailyWordGoToDay(this.value)" title="Chọn ngày trong tháng">
                ${allDays.map(d => `
                  <option value="${d.day}" ${d.day === state.currentDay ? 'selected' : ''}>
                    Ngày ${String(d.day).padStart(2, '0')}/10 - ${escapeHtml(d.title)}
                  </option>
                `).join('')}
              </select>
              <i class="fa-solid fa-chevron-down dw-select-arrow"></i>
            </div>

            <button type="button" class="dw-btn" onclick="window.dailyWordNextDay()" ${state.currentDay >= 31 ? 'disabled' : ''} title="Đọc ngày sau (Phím →)">
              <span class="d-none d-sm-inline">Ngày sau</span> <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Controls: Theme, Font Size, Audio, Mode, Copy -->
          <div class="dw-controls-group">
            
            <!-- Font Size Adjuster -->
            <div class="dw-nav-group" title="Chỉnh kích cỡ chữ">
              <button type="button" class="dw-btn dw-btn-icon-only" onclick="window.adjustDailyWordFontSize(-1)" title="Thu nhỏ chữ">
                <span style="font-weight: 800; font-size: 11px;">A-</span>
              </button>
              <button type="button" class="dw-btn dw-btn-icon-only" onclick="window.adjustDailyWordFontSize(1)" title="Phóng to chữ">
                <span style="font-weight: 800; font-size: 14px;">A+</span>
              </button>
            </div>

            <div class="dw-tool-divider"></div>

            <!-- Theme Color Selector -->
            <div class="dw-nav-group" title="Chọn màu nền trang đọc">
              <button type="button" class="dw-theme-btn ${state.theme === 'sepia' ? 'active' : ''}" data-theme-choice="sepia" onclick="window.setDailyWordTheme('sepia')" title="Màu Giấy Ngà Ấm Áp (Mặc định)"></button>
              <button type="button" class="dw-theme-btn ${state.theme === 'light' ? 'active' : ''}" data-theme-choice="light" onclick="window.setDailyWordTheme('light')" title="Màu Trắng Sáng Thanh Nhã"></button>
              <button type="button" class="dw-theme-btn ${state.theme === 'dark' ? 'active' : ''}" data-theme-choice="dark" onclick="window.setDailyWordTheme('dark')" title="Màu Tối Ban Đêm (Chống mỏi mắt)"></button>
              <button type="button" class="dw-theme-btn ${state.theme === 'navy' ? 'active' : ''}" data-theme-choice="navy" onclick="window.setDailyWordTheme('navy')" title="Màu Xanh Phụng Vụ Huyền Diệu"></button>
            </div>

            <div class="dw-tool-divider"></div>

            <!-- View Mode Toggle: Flipbook vs Scroll -->
            <button type="button" class="dw-btn" onclick="window.toggleDailyWordViewMode()" title="Chuyển chế độ xem Sách Lật / Đọc Cuộn">
              <i class="fa-solid ${state.viewMode === 'flipbook' ? 'fa-book-open' : 'fa-scroll'} text-primary"></i>
              <span class="d-none d-md-inline">${state.viewMode === 'flipbook' ? 'Sách Lật 3D' : 'Đọc Cuộn'}</span>
            </button>

            <!-- Sound Toggle -->
            <button type="button" class="dw-btn dw-btn-icon-only" id="dw-sound-btn" onclick="window.toggleDailyWordSound()" title="Bật/Tắt âm thanh lật sách">
              <i class="fa-solid ${state.isSoundEnabled ? 'fa-volume-high text-success' : 'fa-volume-xmark text-muted'}"></i>
            </button>

            <!-- Text-To-Speech (Nghe đọc) -->
            <button type="button" class="dw-btn" id="dw-tts-btn" onclick="window.toggleDailyWordSpeech()" title="Nghe đọc bài suy niệm hôm nay">
              <i class="fa-solid fa-headphones text-info"></i>
              <span class="d-none d-lg-inline" id="dw-tts-label">Nghe Đọc</span>
            </button>

            <!-- Copy Reflection to Clipboard (Chia sẻ Zalo/Lớp) -->
            <button type="button" class="dw-btn" onclick="window.copyDailyWordText()" title="Sao chép toàn bộ bài suy niệm để gửi Zalo/Messenger">
              <i class="fa-solid fa-share-nodes text-warning"></i>
              <span class="d-none d-lg-inline">Chia Sẻ</span>
            </button>
          </div>

        </div>

        <!-- STAGE CONTENT AREA -->
        <div id="dw-stage-wrapper">
          ${renderStageHtml(currentData)}
        </div>

      </div>

      <!-- 31-Day Calendar Grid Modal -->
      <div id="dw-calendar-modal" class="dw-modal-backdrop" style="display: none;" onclick="if(event.target === this) window.toggleDailyWordCalendarModal(false)">
        <div class="dw-modal-card">
          <div class="dw-modal-header">
            <h3 class="dw-modal-title">
              <i class="fa-solid fa-calendar-check"></i>
              Chọn Ngày Trong Tháng 10/2026 (31 Ngày)
            </h3>
            <button type="button" class="dw-modal-close-btn" onclick="window.toggleDailyWordCalendarModal(false)" title="Đóng">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="dw-modal-search-wrap">
            <div style="position: relative;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 13px; color: var(--dw-text-muted);"></i>
              <input type="text" class="dw-modal-search-input" id="dw-modal-search" placeholder="Tìm theo tên bài, trích đoạn Tin Mừng hoặc Lễ kính..." oninput="window.filterDailyWordCalendar(this.value)">
            </div>
          </div>

          <div class="dw-modal-body" id="dw-modal-calendar-grid">
            ${renderCalendarGridHtml()}
          </div>
        </div>
      </div>
    `;

    // Bind keyboard navigation & touch swipes
    bindKeyboardAndSwipe();
  };

  // --- Render Flipbook / Scroll Stage HTML ---
  function renderStageHtml(currentData) {
    if (state.viewMode === 'scroll') {
      return `
        <div class="dw-scroll-view">
          ${renderPageContentHtml(currentData, false)}
        </div>
      `;
    }

    // Flipbook Mode
    const dayNum = state.currentDay;
    const allDays = getAllDays();

    let leftDayData = null;
    let rightDayData = null;

    if (state.isTwoPageMode) {
      if (dayNum === 1) {
        // Page 1: Left is decorative cover, Right is Day 1
        leftDayData = 'cover';
        rightDayData = currentData;
      } else if (dayNum % 2 === 0) {
        // Even day on left, next on right
        leftDayData = currentData;
        rightDayData = getDayData(dayNum + 1);
      } else {
        // Odd day on right, previous on left
        leftDayData = getDayData(dayNum - 1);
        rightDayData = currentData;
      }
    } else {
      // Single Page Mode: only right page
      leftDayData = null;
      rightDayData = currentData;
    }

    return `
      <div class="dw-stage">
        <!-- Big Left Navigation Chevron -->
        <button type="button" class="dw-stage-arrow prev" onclick="window.dailyWordPrevDay()" ${state.currentDay <= 1 ? 'disabled' : ''} title="Trang trước (Phím ←)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- 3D Realistic Open Book -->
        <div class="dw-book ${!state.isTwoPageMode ? 'single-mode' : ''}" id="dw-flipbook-book">
          
          <!-- Center 3D Spine & Shadow -->
          <div class="dw-spine"></div>
          
          <!-- Red Liturgical Bookmark Ribbon -->
          <div class="dw-ribbon" title="Dấu sách phụng vụ"></div>

          <!-- Left Sheet -->
          ${state.isTwoPageMode ? `
            <div class="dw-page-sheet dw-sheet-left" id="dw-sheet-left" onclick="window.dailyWordPrevDay()">
              ${leftDayData === 'cover' ? renderBookCoverHtml() : (leftDayData ? renderPageContentHtml(leftDayData, true) : `
                <div style="height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.4;">
                  <i class="fa-solid fa-cross" style="font-size: 48px; color: var(--dw-gold);"></i>
                </div>
              `)}
              <div class="dw-page-curl" title="Bấm để lật về ngày trước"></div>
            </div>
          ` : ''}

          <!-- Right Sheet -->
          <div class="dw-page-sheet dw-sheet-right" id="dw-sheet-right" onclick="window.dailyWordNextDay()">
            ${rightDayData ? renderPageContentHtml(rightDayData, false) : `
              <div style="height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.4;">
                <p>Hết bài đọc</p>
              </div>
            `}
            <div class="dw-page-curl" title="Bấm để lật sang ngày tiếp theo"></div>
          </div>

        </div>

        <!-- Big Right Navigation Chevron -->
        <button type="button" class="dw-stage-arrow next" onclick="window.dailyWordNextDay()" ${state.currentDay >= 31 ? 'disabled' : ''} title="Trang sau (Phím →)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    `;
  }

  // --- Render Book Front Cover for Day 1 Left Spread ---
  function renderBookCoverHtml() {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 100%; padding: 30px 20px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--dw-gold-light); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 2px solid var(--dw-border-gold); box-shadow: 0 4px 16px var(--dw-gold-glow);">
          <i class="fa-solid fa-cross" style="font-size: 38px; color: var(--dw-gold);"></i>
        </div>

        <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--dw-gold); margin-bottom: 8px;">
          Giáo Phận & Ban Giáo Lý
        </span>

        <h2 style="font-family: var(--dw-serif-family); font-size: 26px; font-weight: 900; color: var(--dw-text-primary); margin: 0 0 12px 0; line-height: 1.3;">
          5 PHÚT LỜI CHÚA<br>MỖI NGÀY
        </h2>

        <div class="dw-ornament-divider" style="margin: 8px 0 16px;">
          <i class="fa-solid fa-dove"></i>
        </div>

        <p style="font-size: 14px; font-weight: 600; color: var(--dw-red-liturgy); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 18px;">
          Tuyển Tập Suy Niệm Tháng 10/2026
        </p>

        <div style="background: var(--dw-gold-light); border: 1px dashed var(--dw-border-gold); border-radius: 12px; padding: 14px 18px; max-width: 320px; margin-bottom: 24px;">
          <p style="font-family: var(--dw-serif-family); font-style: italic; font-size: 13.5px; line-height: 1.6; color: var(--dw-text-primary); margin: 0;">
            "Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi."
          </p>
          <span style="font-size: 11.5px; font-weight: 700; color: var(--dw-gold); display: block; margin-top: 6px;">
            (Thánh Vịnh 119, 105)
          </span>
        </div>

        <div style="font-size: 12px; color: var(--dw-text-muted);">
          <i class="fa-solid fa-book-open"></i> MagnificatEdu • Nền Tảng Giáo Viên Giáo Lý
        </div>
      </div>
    `;
  }

  // --- Render Structured Single Page Content for a Day ---
  function renderPageContentHtml(dayData, isLeftPage) {
    if (!dayData) return '';

    return `
      <article class="dw-day-article" id="dw-day-article-${dayData.day}">
        
        <!-- Page Header -->
        <header class="dw-page-header">
          <div class="dw-page-crest">
            <i class="fa-solid fa-cross"></i>
          </div>

          <div class="dw-liturgy-date-row">
            <span class="dw-date-pill">${dayData.displayDate || ('Ngày ' + dayData.day + '/10')}</span>
            <span class="dw-liturgy-title">${escapeHtml(dayData.liturgy)}</span>
          </div>

          ${(dayData.feast || dayData.scripture) ? `
            <div class="dw-feast-row">
              ${dayData.feast ? `<span class="dw-feast-name"><i class="fa-solid fa-crown" style="font-size: 11px; color: var(--dw-gold);"></i> ${escapeHtml(dayData.feast)}</span>` : ''}
              ${dayData.scripture ? `<span class="dw-scripture-badge"><i class="fa-solid fa-book-bible"></i> ${escapeHtml(dayData.scripture)}</span>` : ''}
            </div>
          ` : ''}
        </header>

        <!-- Article Title -->
        <h2 class="dw-article-title">
          ${escapeHtml(dayData.title)}
        </h2>

        <div class="dw-ornament-divider">
          <i class="fa-solid fa-dove"></i>
        </div>

        <!-- Biblical Key Verse Box -->
        ${dayData.quote ? `
          <div class="dw-quote-box">
            <i class="fa-solid fa-quote-right quote-icon"></i>
            <p class="dw-quote-text">${escapeHtml(dayData.quote)}</p>
          </div>
        ` : ''}

        <!-- Suy Niệm (Reflection) -->
        ${dayData.suyNiem ? `
          <div class="dw-section-block">
            <div class="dw-section-label">
              <i class="fa-solid fa-feather-pointed"></i> Suy Niệm
            </div>
            <p class="dw-section-content dw-suy-niem-content">
              ${escapeHtml(dayData.suyNiem)}
            </p>
          </div>
        ` : ''}

        <!-- Mời Bạn / Bạn Thân Mến -->
        ${dayData.moiBan ? `
          <div class="dw-moi-ban-card">
            <div class="dw-section-label">
              <i class="fa-solid fa-hand-holding-heart"></i> Mời Bạn
            </div>
            <p class="dw-section-content">
              ${escapeHtml(dayData.moiBan)}
            </p>
          </div>
        ` : ''}

        <!-- Chia Sẻ (if present) -->
        ${dayData.chiaSe ? `
          <div class="dw-moi-ban-card" style="border-left: 4px solid #10b981;">
            <div class="dw-section-label" style="color: #10b981;">
              <i class="fa-solid fa-comments"></i> Chia Sẻ
            </div>
            <p class="dw-section-content">
              ${escapeHtml(dayData.chiaSe)}
            </p>
          </div>
        ` : ''}

        <!-- Sống Lời Chúa (Action Takeaway) -->
        ${dayData.songLoiChua ? `
          <div class="dw-action-card">
            <div class="dw-section-label">
              <i class="fa-solid fa-compass"></i> Sống Lời Chúa
            </div>
            <p class="dw-section-content" style="font-weight: 600;">
              ${escapeHtml(dayData.songLoiChua)}
            </p>
          </div>
        ` : ''}

        <!-- Cầu Nguyện (Prayer) -->
        ${dayData.cauNguyen ? `
          <div class="dw-prayer-box">
            <div class="dw-section-label">
              <i class="fa-solid fa-hands-praying"></i> Cầu Nguyện
            </div>
            <p class="dw-prayer-text">
              ${escapeHtml(dayData.cauNguyen)}
            </p>
          </div>
        ` : ''}

        <!-- Page Footer Navigation Indicator -->
        <footer class="dw-page-footer">
          <span class="dw-footer-source">
            <i class="fa-solid fa-church"></i> 5 Phút Lời Chúa • Tháng 10/2026
          </span>
          <span class="dw-page-num">
            Trang ${dayData.day} / 31
          </span>
        </footer>

      </article>
    `;
  }

  // --- Render 31-Day Calendar Grid HTML ---
  function renderCalendarGridHtml(filterKw = '') {
    const allDays = getAllDays();
    const kw = (filterKw || '').trim().toLowerCase();

    const filtered = allDays.filter(d => {
      if (!kw) return true;
      return (
        (d.title && d.title.toLowerCase().includes(kw)) ||
        (d.liturgy && d.liturgy.toLowerCase().includes(kw)) ||
        (d.feast && d.feast.toLowerCase().includes(kw)) ||
        (d.scripture && d.scripture.toLowerCase().includes(kw)) ||
        (d.quote && d.quote.toLowerCase().includes(kw)) ||
        (String(d.day) === kw)
      );
    });

    if (filtered.length === 0) {
      return `
        <div style="text-align: center; padding: 40px 20px; color: #64748b;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 32px; margin-bottom: 10px; color: #94a3b8;"></i>
          <p style="font-size: 14px; font-weight: 600;">Không tìm thấy ngày đọc phù hợp với từ khóa "${escapeHtml(filterKw)}"</p>
        </div>
      `;
    }

    const realToday = getSystemTodayDay();

    return `
      <div class="dw-grid-31">
        ${filtered.map(d => {
          const isToday = d.day === realToday;
          const isActive = d.day === state.currentDay;
          const isSunday = (d.liturgy || '').includes('CHÚA NHẬT');
          const hasFeast = !!d.feast;

          let badgeHtml = '';
          if (isToday) {
            badgeHtml = '<span class="dw-today-badge"><i class="fa-solid fa-star"></i> Hôm Nay</span>';
          } else if (isActive) {
            badgeHtml = '<span class="dw-active-badge"><i class="fa-solid fa-eye"></i> Đang đọc</span>';
          }

          return `
            <div class="dw-grid-day-card ${isToday ? 'is-today' : ''} ${isActive ? 'is-active' : ''}" 
                 onclick="window.dailyWordGoToDay(${d.day}); window.toggleDailyWordCalendarModal(false);" 
                 title="${escapeHtml(d.title)} - ${escapeHtml(d.liturgy)}">
              ${hasFeast && !isToday ? '<span class="dw-grid-feast-pill" title="Có lễ kính"></span>' : ''}
              <div class="dw-grid-day-num" style="${isSunday ? 'color: #dc2626;' : ''}">${d.day}</div>
              ${badgeHtml}
              <div class="dw-grid-day-liturgy" style="${isSunday ? 'font-weight: 800;' : ''}">${isSunday ? 'Chúa Nhật' : d.displayDate}</div>
              <div class="dw-grid-day-title">${escapeHtml(d.title)}</div>
              ${d.scripture ? `<span class="badge badge-pill badge-light mt-1" style="font-size: 9.5px; border: 1px solid #cbd5e1; color: #475569;">${escapeHtml(d.scripture)}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- Actions & Methods ---
  window.dailyWordGoToDay = function(dayNum, animDirection = 'next') {
    const target = Math.max(1, Math.min(31, parseInt(dayNum, 10) || 1));
    if (target === state.currentDay && document.getElementById('dw-stage-wrapper')) {
      return;
    }

    state.currentDay = target;
    playPaperTurnSound();

    const stageWrap = document.getElementById('dw-stage-wrapper');
    const bookEl = document.getElementById('dw-flipbook-book');

    if (bookEl) {
      bookEl.classList.remove('dw-flipping-next', 'dw-flipping-prev');
      void bookEl.offsetWidth; // Trigger reflow
      bookEl.classList.add(animDirection === 'prev' ? 'dw-flipping-prev' : 'dw-flipping-next');
    }

    const currentData = getDayData(state.currentDay);
    if (stageWrap) {
      stageWrap.innerHTML = renderStageHtml(currentData);
    }

    // Sync Dropdown Select
    const selectEl = document.getElementById('dw-date-select');
    if (selectEl) selectEl.value = state.currentDay;

    // Stop active speech synthesis if switching days
    if (state.isSpeaking) {
      window.stopDailyWordSpeech();
    }
  };

  window.dailyWordNextDay = function() {
    if (state.currentDay < 31) {
      window.dailyWordGoToDay(state.currentDay + 1, 'next');
    }
  };

  window.dailyWordPrevDay = function() {
    if (state.currentDay > 1) {
      window.dailyWordGoToDay(state.currentDay - 1, 'prev');
    }
  };

  window.dailyWordToday = function() {
    const target = getSystemTodayDay();
    window.dailyWordGoToDay(target);
    if (typeof showToast === 'function') {
      showToast(`Đã chuyển về bài Lời Chúa Hôm Nay (Ngày ${String(target).padStart(2, '0')}/10)`, 'info');
    }
  };

  // --- Customizer Settings ---
  window.setDailyWordTheme = function(themeName) {
    state.theme = themeName;
    localStorage.setItem('daily_word_theme', themeName);

    const root = document.getElementById('daily-word-root');
    if (root) root.setAttribute('data-theme', themeName);

    const modal = document.getElementById('dw-calendar-modal');
    if (modal) modal.setAttribute('data-theme', themeName);

    document.querySelectorAll('.dw-theme-btn').forEach(btn => {
      if (btn.getAttribute('data-theme-choice') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  window.adjustDailyWordFontSize = function(delta) {
    const sizes = ['small', 'normal', 'large', 'xlarge'];
    let idx = sizes.indexOf(state.fontSize);
    if (idx === -1) idx = 1;

    let newIdx = idx + delta;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= sizes.length) newIdx = sizes.length - 1;

    state.fontSize = sizes[newIdx];
    localStorage.setItem('daily_word_font_size', state.fontSize);

    const root = document.getElementById('daily-word-root');
    if (root) root.setAttribute('data-font-size', state.fontSize);

    if (typeof showToast === 'function') {
      const labels = { small: 'Chữ nhỏ (14px)', normal: 'Chữ tiêu chuẩn (15.5px)', large: 'Chữ lớn (17.5px)', xlarge: 'Chữ rất lớn (20px)' };
      showToast('Cỡ chữ: ' + labels[state.fontSize], 'info');
    }
  };

  window.toggleDailyWordSound = function() {
    state.isSoundEnabled = !state.isSoundEnabled;
    localStorage.setItem('daily_word_sound', state.isSoundEnabled);

    const btn = document.getElementById('dw-sound-btn');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid ${state.isSoundEnabled ? 'fa-volume-high text-success' : 'fa-volume-xmark text-muted'}"></i>`;
    }

    if (typeof showToast === 'function') {
      showToast(state.isSoundEnabled ? 'Đã bật âm thanh lật sách' : 'Đã tắt âm thanh', 'info');
    }
  };

  window.toggleDailyWordViewMode = function() {
    state.viewMode = state.viewMode === 'flipbook' ? 'scroll' : 'flipbook';
    localStorage.setItem('daily_word_view_mode', state.viewMode);

    const currentData = getDayData(state.currentDay);
    const stageWrap = document.getElementById('dw-stage-wrapper');
    if (stageWrap) {
      stageWrap.innerHTML = renderStageHtml(currentData);
    }

    // Re-render page button label
    const root = document.getElementById('daily-word-root');
    if (root) {
      window.renderDailyWordPage();
    }
  };

  // --- Calendar Modal ---
  window.toggleDailyWordCalendarModal = function(show) {
    const modal = document.getElementById('dw-calendar-modal');
    if (!modal) return;
    if (show && modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
    modal.setAttribute('data-theme', state.theme);
    modal.style.display = show ? 'flex' : 'none';
    if (show) {
      document.body.style.overflow = 'hidden';
      const search = document.getElementById('dw-modal-search');
      if (search) {
        search.value = '';
        setTimeout(() => search.focus(), 60);
      }
      const grid = document.getElementById('dw-modal-calendar-grid');
      if (grid) grid.innerHTML = renderCalendarGridHtml();
    } else {
      document.body.style.overflow = '';
    }
  };

  window.filterDailyWordCalendar = function(kw) {
    const grid = document.getElementById('dw-modal-calendar-grid');
    if (grid) grid.innerHTML = renderCalendarGridHtml(kw);
  };

  // --- Copy Reflection to Clipboard for Sharing (Zalo, Messenger) ---
  window.copyDailyWordText = function() {
    const d = getDayData(state.currentDay);
    if (!d) return;

    const copyText = `✨ 5 PHÚT LỜI CHÚA - ${d.displayDate.toUpperCase()}
📖 Phụng vụ: ${d.liturgy} ${d.feast ? '(' + d.feast + ')' : ''}
🕊️ Tin Mừng: ${d.scripture}

🌟 CHỦ ĐỀ: ${d.title}
"${d.quote}"

💡 SUY NIỆM:
${d.suyNiem}

❤️ MỜI BẠN:
${d.moiBan}

🧭 SỐNG LỜI CHÚA:
${d.songLoiChua}

🙏 CẦU NGUYỆN:
${d.cauNguyen}

---
🌟 Nền tảng Giáo Viên Giáo Lý - MagnificatEdu
https://giangviengiaoly.vn`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyText).then(() => {
        if (typeof showToast === 'function') {
          showToast('Đã sao chép bài Lời Chúa hôm nay! Bạn có thể dán vào Zalo để gửi nhóm giáo lý.', 'success');
        } else {
          alert('Đã sao chép bài Lời Chúa hôm nay vào clipboard!');
        }
      }).catch(() => fallbackCopy(copyText));
    } else {
      fallbackCopy(copyText);
    }
  };

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (typeof showToast === 'function') {
        showToast('Đã sao chép nội dung Lời Chúa vào clipboard!', 'success');
      }
    } catch (e) {
      // Ignored
    }
    document.body.removeChild(ta);
  }

  // --- Speech Synthesis (Đọc Lời Chúa Tự Động) ---
  window.toggleDailyWordSpeech = function() {
    if (state.isSpeaking) {
      window.stopDailyWordSpeech();
    } else {
      window.speakDailyWord();
    }
  };

  window.speakDailyWord = function() {
    if (!('speechSynthesis' in window)) {
      if (typeof showToast === 'function') {
        showToast('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản tự động.', 'warning');
      }
      return;
    }

    const d = getDayData(state.currentDay);
    if (!d) return;

    window.speechSynthesis.cancel();

    const readText = `Năm phút Lời Chúa mỗi ngày. ${d.displayDate}. ${d.liturgy}. ${d.feast ? d.feast + '.' : ''} Tin Mừng: ${d.scripture}. Chủ đề: ${d.title}. Lời Chúa dạy: ${d.quote}. Suy niệm: ${d.suyNiem}. Mời bạn: ${d.moiBan}. Sống Lời Chúa: ${d.songLoiChua}. Cầu nguyện: ${d.cauNguyen}`;

    const utterance = new SpeechSynthesisUtterance(readText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Slightly slower for solemn reading
    utterance.pitch = 1.0;

    // Find Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.name.includes('Vietnamese'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onstart = function() {
      state.isSpeaking = true;
      const btn = document.getElementById('dw-tts-btn');
      const label = document.getElementById('dw-tts-label');
      if (btn) btn.classList.add('dw-btn-primary');
      if (label) label.textContent = 'Dừng Đọc';
      if (typeof showToast === 'function') {
        showToast('Đang đọc Lời Chúa ngày ' + d.day + '/10...', 'info');
      }
    };

    utterance.onend = function() {
      state.isSpeaking = false;
      const btn = document.getElementById('dw-tts-btn');
      const label = document.getElementById('dw-tts-label');
      if (btn) btn.classList.remove('dw-btn-primary');
      if (label) label.textContent = 'Nghe Đọc';
    };

    utterance.onerror = function() {
      state.isSpeaking = false;
      const btn = document.getElementById('dw-tts-btn');
      const label = document.getElementById('dw-tts-label');
      if (btn) btn.classList.remove('dw-btn-primary');
      if (label) label.textContent = 'Nghe Đọc';
    };

    window.speechSynthesis.speak(utterance);
  };

  window.stopDailyWordSpeech = function() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    state.isSpeaking = false;
    const btn = document.getElementById('dw-tts-btn');
    const label = document.getElementById('dw-tts-label');
    if (btn) btn.classList.remove('dw-btn-primary');
    if (label) label.textContent = 'Nghe Đọc';
  };

  // --- Keyboard & Touch Swipe Binding ---
  let isBound = false;
  function bindKeyboardAndSwipe() {
    if (isBound) return;
    isBound = true;

    // Keyboard Arrow Keys
    window.addEventListener('keydown', function(e) {
      // Only handle if daily-word container is active/visible
      const root = document.getElementById('daily-word-root');
      if (!root || root.offsetParent === null) return;

      // Don't trigger if user is typing in an input
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        window.dailyWordPrevDay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        window.dailyWordNextDay();
      } else if (e.key === 'Escape') {
        window.toggleDailyWordCalendarModal(false);
      }
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', function(e) {
      const root = document.getElementById('daily-word-root');
      if (!root || root.offsetParent === null) return;
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', function(e) {
      const root = document.getElementById('daily-word-root');
      if (!root || root.offsetParent === null) return;
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        // Horizontal swipe threshold
        if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 50) {
          if (deltaX < 0) {
            // Swiped left -> Next day
            window.dailyWordNextDay();
          } else {
            // Swiped right -> Previous day
            window.dailyWordPrevDay();
          }
        }
      }
    }, { passive: true });

    // Handle window resize to toggle two-page mode
    window.addEventListener('resize', function() {
      const isTwo = window.innerWidth > 900;
      if (isTwo !== state.isTwoPageMode) {
        state.isTwoPageMode = isTwo;
        const stageWrap = document.getElementById('dw-stage-wrapper');
        if (stageWrap && state.viewMode === 'flipbook') {
          stageWrap.innerHTML = renderStageHtml(getDayData(state.currentDay));
        }
      }
    });
  }

})();

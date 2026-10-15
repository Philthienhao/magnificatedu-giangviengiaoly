// ==========================================================================
// ACTIVITIES LIBRARY & 3D REALISTIC FLIPBOOK CONTROLLER
// MagnificatEdu - Nền Tảng Quản Lý Giáo Lý Công Giáo
// ==========================================================================

(function() {
  'use strict';

  // --- Global State ---
  const state = {
    currentDoc: null,
    currentPage: 1,
    isTwoPageMode: window.innerWidth > 800,
    isSoundEnabled: true,
    fontSizeLevel: 0, // -1: small, 0: normal, 1: large, 2: xlarge
    activeCategoryFilter: 'all',
    searchKeyword: '',
    audioCtx: null,
    isAnimating: false,
    isFullscreen: false
  };

  // --- Web Audio Synthetic Page Turn Sound ---
  function playPageTurnSound() {
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
      const bufferSize = ctx.sampleRate * 0.18; // 180ms sound
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink/white noise with smooth fade
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to simulate paper rustle
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.18);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // --- Document Retrieval Helpers ---
  function getDocById(docId) {
    if (!window.ACTIVITIES_DOCUMENTS) return null;
    return window.ACTIVITIES_DOCUMENTS.find(d => d.id === docId) || null;
  }

  // --- Render Activities Library View ---
  function renderActivitiesLibrary(container) {
    if (!container) container = document.getElementById('content-area');
    if (!container) return;

    const docs = window.ACTIVITIES_DOCUMENTS || [];
    const categories = window.ACTIVITIES_CATEGORIES || [];

    // Filter documents
    let filteredDocs = docs;
    if (state.activeCategoryFilter && state.activeCategoryFilter !== 'all') {
      filteredDocs = filteredDocs.filter(d => d.category === state.activeCategoryFilter);
    }
    if (state.searchKeyword && state.searchKeyword.trim() !== '') {
      const q = state.searchKeyword.trim().toLowerCase();
      filteredDocs = filteredDocs.filter(d => 
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.subtitle && d.subtitle.toLowerCase().includes(q)) ||
        (d.desc && d.desc.toLowerCase().includes(q)) ||
        (d.categoryName && d.categoryName.toLowerCase().includes(q))
      );
    }

    // Counts by category
    const countTroChoi = docs.filter(d => d.category === 'trochoi').length;
    const countBangReo = docs.filter(d => d.category === 'bangreo').length;
    const countBaiHat = docs.filter(d => d.category === 'baihat').length;

    container.innerHTML = `
      <div class="activities-page-wrapper">
        
        <!-- Hero Banner Header -->
        <div class="activities-hero-banner">
          <div class="activities-hero-content">
            <span class="activities-hero-tag">
              <i class="fa-solid fa-cross"></i> Học Liệu Sinh Hoạt Công Giáo
            </span>
            <h1 class="activities-hero-title">
              <i class="fa-solid fa-icons"></i> Thư Viện Trò Chơi, Bài Hát, Băng Reo
            </h1>
            <p class="activities-hero-desc">
              Kho tài liệu hoạt náo chọn lọc dành riêng cho Giáo Lý Viên & Huynh Trưởng: 
              Bao gồm trò chơi vòng tròn, trò chơi có dụng cụ, tuyển tập 68 băng reo đức tin cử điệu và các ca khúc sinh hoạt hào hứng.
              Xem trực quan dưới dạng <strong>Sách lật 3D siêu tốc độ</strong> và tải về trọn vẹn cả 2 định dạng Word (.docx) hoặc PDF (.pdf).
            </p>
          </div>

          <!-- Quick Statistics Bar -->
          <div class="activities-stats-grid">
            <div class="activities-stat-item">
              <div class="activities-stat-icon trochoi"><i class="fa-solid fa-gamepad"></i></div>
              <div>
                <div class="activities-stat-value">130+</div>
                <div class="activities-stat-label">Trò chơi sinh hoạt</div>
              </div>
            </div>
            <div class="activities-stat-item">
              <div class="activities-stat-icon bangreo"><i class="fa-solid fa-bullhorn"></i></div>
              <div>
                <div class="activities-stat-value">68</div>
                <div class="activities-stat-label">Băng reo Giáo lý</div>
              </div>
            </div>
            <div class="activities-stat-item">
              <div class="activities-stat-icon baihat"><i class="fa-solid fa-music"></i></div>
              <div>
                <div class="activities-stat-value">50+</div>
                <div class="activities-stat-label">Bài hát sinh hoạt</div>
              </div>
            </div>
            <div class="activities-stat-item">
              <div class="activities-stat-icon tongso"><i class="fa-solid fa-book-bookmark"></i></div>
              <div>
                <div class="activities-stat-value">${docs.length}</div>
                <div class="activities-stat-label">Tuyển tập trọn bộ</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Bar & Search Box -->
        <div class="activities-filter-bar">
          <div class="activities-tabs-group" role="tablist">
            <button type="button" class="activities-tab-btn ${state.activeCategoryFilter === 'all' ? 'active' : ''}" onclick="window.filterActivitiesCategory('all')">
              <i class="fa-solid fa-border-all"></i> Tất Cả Tài Liệu
              <span class="tab-badge">${docs.length}</span>
            </button>
            <button type="button" class="activities-tab-btn ${state.activeCategoryFilter === 'trochoi' ? 'active' : ''}" onclick="window.filterActivitiesCategory('trochoi')">
              <i class="fa-solid fa-gamepad"></i> Trò Chơi Sinh Hoạt
              <span class="tab-badge">${countTroChoi}</span>
            </button>
            <button type="button" class="activities-tab-btn ${state.activeCategoryFilter === 'bangreo' ? 'active' : ''}" onclick="window.filterActivitiesCategory('bangreo')">
              <i class="fa-solid fa-bullhorn"></i> Băng Reo Sinh Hoạt
              <span class="tab-badge">${countBangReo}</span>
            </button>
            <button type="button" class="activities-tab-btn ${state.activeCategoryFilter === 'baihat' ? 'active' : ''}" onclick="window.filterActivitiesCategory('baihat')">
              <i class="fa-solid fa-music"></i> Bài Hát Sinh Hoạt
              <span class="tab-badge">${countBaiHat}</span>
            </button>
          </div>

          <div class="activities-search-wrapper">
            <i class="fa-solid fa-magnifying-glass activities-search-icon"></i>
            <input type="text" 
                   id="activities-search-field"
                   class="activities-search-input" 
                   placeholder="Tìm trò chơi, bài hát, băng reo..." 
                   value="${escapeAttr(state.searchKeyword)}"
                   oninput="window.handleActivitiesSearch(this.value)">
          </div>
        </div>

        <!-- Section Title -->
        <div class="activities-sec-title-wrap">
          <h2 class="activities-sec-heading">
            <i class="fa-solid fa-book-open"></i> 
            ${getCategoryHeading(state.activeCategoryFilter)}
          </h2>
          <span class="activities-sec-badge">Hiển thị ${filteredDocs.length} tài liệu</span>
        </div>

        <!-- Documents Grid -->
        ${filteredDocs.length === 0 ? `
          <div class="card" style="padding: 40px; text-align: center; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">
            <i class="fa-solid fa-folder-open" style="font-size: 42px; color: #94a3b8; margin-bottom: 12px;"></i>
            <h4 style="font-weight: 700; color: #1e293b; margin-bottom: 6px;">Không tìm thấy tài liệu phù hợp</h4>
            <p style="font-size: 13.5px; color: #64748b; margin-bottom: 16px;">Vui lòng thử từ khóa tìm kiếm khác hoặc chọn mục danh mục phía trên.</p>
            <button class="btn btn-sm btn-outline-primary" onclick="window.filterActivitiesCategory('all'); document.getElementById('activities-search-field').value='';">
              <i class="fa-solid fa-rotate-left"></i> Xem tất cả tài liệu
            </button>
          </div>
        ` : `
          <div class="activities-cards-grid">
            ${filteredDocs.map(doc => renderDocCardHtml(doc)).join('')}
          </div>
        `}

      </div>
    `;
  }

  function getCategoryHeading(catId) {
    switch (catId) {
      case 'trochoi': return 'Mục 1: Trò Chơi Sinh Hoạt (Thư mục trochoisinhhoat)';
      case 'bangreo': return 'Mục 2: Băng Reo Sinh Hoạt (Thư mục bangreosinhhoat)';
      case 'baihat': return 'Mục 3: Bài Hát Sinh Hoạt (Thư mục baihatsinhhoat)';
      default: return 'Tất Cả Tài Liệu Trò Chơi, Bài Hát & Băng Reo';
    }
  }

  function renderDocCardHtml(doc) {
    const isDocx = doc.format === 'docx';
    const formatClass = isDocx ? 'docx' : 'pdf';
    const formatLabel = isDocx ? 'File Word' : 'File PDF';
    const catClass = doc.category;

    return `
      <div class="activity-card" id="card-${doc.id}">
        <!-- Header -->
        <div class="activity-card-header">
          <div class="activity-card-icon-box ${formatClass}">
            <i class="${doc.icon || (isDocx ? 'fa-solid fa-file-word' : 'fa-solid fa-file-pdf')}"></i>
          </div>
          <div class="activity-card-meta">
            <span class="activity-card-category-tag ${catClass}">${escapeHtml(doc.categoryName)}</span>
            <h3 class="activity-card-title">${escapeHtml(doc.title)}</h3>
            <p class="activity-card-subtitle">${escapeHtml(doc.subtitle || '')}</p>
          </div>
        </div>

        <!-- Body -->
        <div class="activity-card-body">
          <p class="activity-card-desc">${escapeHtml(doc.desc || '')}</p>
          
          <div class="activity-card-badges">
            <span class="activity-pill format-${doc.format}">
              <i class="fa-solid ${isDocx ? 'fa-file-lines' : 'fa-file-pdf'}"></i> ${formatLabel}
            </span>
            <span class="activity-pill">
              <i class="fa-solid fa-box-archive"></i> ${escapeHtml(doc.badge || '')}
            </span>
            <span class="activity-pill">
              <i class="fa-solid fa-hard-drive"></i> ${escapeHtml(doc.fileSize || '')}
            </span>
          </div>

          <!-- Actions -->
          <div class="activity-card-actions">
            <!-- Main Flipbook Button -->
            <button type="button" class="btn-open-flipbook" onclick="window.openActivityFlipbook('${doc.id}')" title="Mở sách lật xem nội dung chi tiết">
              <i class="fa-solid fa-book-open-reader"></i> Mở Sách Lật Trực Quan
            </button>

            <!-- Download 2 Formats: Word & PDF -->
            <div class="activity-download-btn-group">
              <button type="button" class="btn-download-word" onclick="window.downloadDocx('${doc.id}')" title="Tải về định dạng Microsoft Word (.docx)">
                <i class="fa-solid fa-file-word"></i> Tải Word (.docx)
              </button>
              <button type="button" class="btn-download-pdf" onclick="window.downloadPdf('${doc.id}')" title="Tải về định dạng PDF (.pdf)">
                <i class="fa-solid fa-file-pdf"></i> Tải PDF (.pdf)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Filtering & Search Events ---
  window.filterActivitiesCategory = function(catId) {
    state.activeCategoryFilter = catId;
    renderActivitiesLibrary();
  };

  let searchTimeout = null;
  window.handleActivitiesSearch = function(val) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchKeyword = val || '';
      renderActivitiesLibrary();
    }, 200);
  };

  // --- 3D Flipbook Core Functions ---
  window.openActivityFlipbook = function(docId, startPage = 1) {
    const doc = getDocById(docId);
    if (!doc) {
      showToast('Không tìm thấy tài liệu yêu cầu!', 'danger');
      return;
    }

    state.currentDoc = doc;
    state.currentPage = Math.max(1, startPage);
    state.isTwoPageMode = window.innerWidth > 800;

    const modal = document.getElementById('activities-flipbook-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Populate Modal Header Info
    const titleEl = document.getElementById('flipbook-header-title');
    if (titleEl) titleEl.textContent = doc.title;
    const subEl = document.getElementById('flipbook-header-cat');
    if (subEl) subEl.textContent = doc.categoryName + ' • ' + (doc.badge || '');

    // Check mode
    if (doc.pages && doc.pages.length > 0) {
      // Structured Book (Fastest rendering < 50ms)
      renderStructuredBookView();
    } else {
      // PDF Direct View inside Flipbook Modal
      renderPdfBookView();
    }

    // Populate Table of Contents Drawer
    populateTocDrawer();

    // Bind event listeners (Keyboard & Touch)
    bindFlipbookEvents();
  };

  function renderStructuredBookView() {
    const doc = state.currentDoc;
    const stage = document.getElementById('flipbook-stage-content');
    if (!stage) return;

    const totalPages = doc.pages ? doc.pages.length : 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    // Determine left and right page numbers
    let leftPageNum, rightPageNum;
    if (state.isTwoPageMode) {
      if (state.currentPage === 1) {
        // Cover is shown on right or alone
        leftPageNum = null;
        rightPageNum = 1;
      } else if (state.currentPage % 2 === 0) {
        leftPageNum = state.currentPage;
        rightPageNum = state.currentPage + 1 <= totalPages ? state.currentPage + 1 : null;
      } else {
        leftPageNum = state.currentPage - 1;
        rightPageNum = state.currentPage;
      }
    } else {
      leftPageNum = null;
      rightPageNum = state.currentPage;
    }

    const leftPageData = leftPageNum ? doc.pages[leftPageNum - 1] : null;
    const rightPageData = rightPageNum ? doc.pages[rightPageNum - 1] : null;

    const fontSizeClass = state.fontSizeLevel === 1 ? 'font-large' : (state.fontSizeLevel === 2 ? 'font-xlarge' : (state.fontSizeLevel === -1 ? 'font-small' : ''));

    stage.innerHTML = `
      <div class="flipbook-book ${!state.isTwoPageMode ? 'single-page-mode' : ''} ${fontSizeClass}" id="main-flipbook-book">
        
        <!-- Center 3D Spine -->
        <div class="flipbook-spine"></div>

        <!-- Left Page Sheet -->
        <div class="flipbook-sheet-left" id="sheet-left" onclick="window.flipPrevPage()">
          ${leftPageData ? leftPageData.html : `
            <div class="book-cover-page" style="background: #1e293b;">
              <div style="text-align: center; color: #94a3b8; font-size: 13px;">
                <i class="fa-solid fa-book" style="font-size: 32px; margin-bottom: 8px;"></i>
                <div>Trang bìa trước</div>
              </div>
            </div>
          `}
          ${leftPageData ? '<div class="page-corner-curl" title="Bấm để lật về trang trước"></div>' : ''}
        </div>

        <!-- Right Page Sheet -->
        <div class="flipbook-sheet-right" id="sheet-right" onclick="window.flipNextPage()">
          ${rightPageData ? rightPageData.html : `
            <div class="book-cover-page" style="background: #1e293b;">
              <div style="text-align: center; color: #94a3b8; font-size: 13px;">
                <i class="fa-solid fa-bookmark" style="font-size: 32px; margin-bottom: 8px;"></i>
                <div>Hết nội dung</div>
              </div>
            </div>
          `}
          ${rightPageData ? '<div class="page-corner-curl" title="Bấm để lật sang trang sau"></div>' : ''}
        </div>

        <!-- Dynamic 3D Flipping Leaf (Used during transition) -->
        <div class="flipbook-flipping-leaf" id="flipping-leaf">
          <div class="flipbook-leaf-front" id="leaf-front"></div>
          <div class="flipbook-leaf-back" id="leaf-back"></div>
          <div class="flipbook-leaf-shadow" id="leaf-shadow"></div>
        </div>

      </div>
    `;

    updateBottomBar();
  }

  function renderPdfBookView() {
    const doc = state.currentDoc;
    const stage = document.getElementById('flipbook-stage-content');
    if (!stage) return;

    stage.innerHTML = `
      <div class="flipbook-pdf-container">
        <div class="flipbook-pdf-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-file-pdf text-danger" style="font-size: 20px;"></i>
            <div>
              <strong style="color: #ffffff; font-size: 14.5px;">${escapeHtml(doc.title)}</strong>
              <div style="font-size: 12px; color: #94a3b8;">${escapeHtml(doc.badge || 'Tài liệu PDF chuẩn')} • ${escapeHtml(doc.fileSize || '')}</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="flipbook-tool-btn" onclick="window.downloadPdf('${doc.id}')">
              <i class="fa-solid fa-download"></i> Tải PDF
            </button>
            <button class="flipbook-tool-btn" onclick="window.downloadDocx('${doc.id}')">
              <i class="fa-solid fa-file-word"></i> Tải Word (.docx)
            </button>
          </div>
        </div>
        <iframe src="${doc.pdfUrl}" class="flipbook-pdf-iframe" title="${escapeHtml(doc.title)}"></iframe>
      </div>
    `;

    // Update bottom bar for PDF
    const pageInd = document.getElementById('flipbook-page-indicator');
    if (pageInd) pageInd.innerHTML = `Tài liệu PDF: <span>${escapeHtml(doc.badge || '')}</span>`;
    const slider = document.getElementById('flipbook-scrub-slider');
    if (slider) slider.style.display = 'none';
  }

  function updateBottomBar() {
    const doc = state.currentDoc;
    if (!doc || !doc.pages) return;

    const totalPages = doc.pages.length;
    const slider = document.getElementById('flipbook-scrub-slider');
    const indicator = document.getElementById('flipbook-page-indicator');
    const btnPrev = document.getElementById('flipbook-btn-prev');
    const btnNext = document.getElementById('flipbook-btn-next');
    const arrowPrev = document.getElementById('flipbook-arrow-prev');
    const arrowNext = document.getElementById('flipbook-arrow-next');

    if (slider) {
      slider.style.display = 'block';
      slider.min = 1;
      slider.max = totalPages;
      slider.value = state.currentPage;
    }

    if (indicator) {
      if (state.isTwoPageMode && state.currentPage > 1) {
        const pLeft = state.currentPage % 2 === 0 ? state.currentPage : state.currentPage - 1;
        const pRight = pLeft + 1 <= totalPages ? pLeft + 1 : null;
        indicator.innerHTML = `Trang <span>${pLeft}${pRight ? ' - ' + pRight : ''}</span> / ${totalPages}`;
      } else {
        indicator.innerHTML = `Trang <span>${state.currentPage}</span> / ${totalPages}`;
      }
    }

    const isFirst = state.currentPage <= 1;
    const isLast = state.currentPage >= totalPages;

    if (btnPrev) btnPrev.disabled = isFirst;
    if (btnNext) btnNext.disabled = isLast;
    if (arrowPrev) arrowPrev.disabled = isFirst;
    if (arrowNext) arrowNext.disabled = isLast;

    // Highlight active TOC item
    highlightActiveToc();
  }

  // --- Page Flipping Controls ---
  window.flipNextPage = function() {
    const doc = state.currentDoc;
    if (!doc || !doc.pages || state.isAnimating) return;

    const totalPages = doc.pages.length;
    if (state.currentPage >= totalPages) return;

    const step = (state.isTwoPageMode && state.currentPage > 1) ? 2 : (state.currentPage === 1 ? 1 : 1);
    const nextPage = Math.min(totalPages, state.currentPage + step);

    playPageTurnSound();
    animatePageTurn('forward', nextPage);
  };

  window.flipPrevPage = function() {
    const doc = state.currentDoc;
    if (!doc || !doc.pages || state.isAnimating) return;

    if (state.currentPage <= 1) return;

    const step = (state.isTwoPageMode && state.currentPage > 2) ? 2 : 1;
    const prevPage = Math.max(1, state.currentPage - step);

    playPageTurnSound();
    animatePageTurn('backward', prevPage);
  };

  window.flipbookGoToPage = function(pageNum) {
    const doc = state.currentDoc;
    if (!doc || !doc.pages) return;

    const target = Math.max(1, Math.min(doc.pages.length, parseInt(pageNum, 10)));
    if (target === state.currentPage) return;

    const direction = target > state.currentPage ? 'forward' : 'backward';
    playPageTurnSound();
    animatePageTurn(direction, target);
  };

  function animatePageTurn(direction, targetPage) {
    const leaf = document.getElementById('flipping-leaf');
    if (!leaf) {
      state.currentPage = targetPage;
      renderStructuredBookView();
      return;
    }

    state.isAnimating = true;
    const doc = state.currentDoc;
    const frontLeaf = document.getElementById('leaf-front');
    const backLeaf = document.getElementById('leaf-back');

    if (direction === 'forward') {
      // Current right page rotates to left
      const curRightData = state.currentPage <= doc.pages.length ? doc.pages[state.currentPage - 1] : null;
      const targetLeftData = targetPage <= doc.pages.length ? doc.pages[targetPage - 1] : null;

      if (frontLeaf && curRightData) frontLeaf.innerHTML = curRightData.html;
      if (backLeaf && targetLeftData) backLeaf.innerHTML = targetLeftData.html;

      leaf.className = 'flipbook-flipping-leaf turning-forward';
    } else {
      const curLeftData = (state.currentPage - 1 >= 1) ? doc.pages[state.currentPage - 2] : null;
      const targetRightData = targetPage <= doc.pages.length ? doc.pages[targetPage - 1] : null;

      if (frontLeaf && curLeftData) frontLeaf.innerHTML = curLeftData.html;
      if (backLeaf && targetRightData) backLeaf.innerHTML = targetRightData.html;

      leaf.className = 'flipbook-flipping-leaf turning-backward';
    }

    setTimeout(() => {
      state.currentPage = targetPage;
      state.isAnimating = false;
      renderStructuredBookView();
    }, 450);
  }

  // --- Table of Contents Drawer ---
  function populateTocDrawer() {
    const doc = state.currentDoc;
    const listEl = document.getElementById('flipbook-toc-list');
    if (!listEl) return;

    if (!doc || !doc.toc || doc.toc.length === 0) {
      listEl.innerHTML = `
        <li style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">
          Tài liệu này không có bảng mục lục phân mục.
        </li>
      `;
      return;
    }

    listEl.innerHTML = doc.toc.map(item => `
      <li class="toc-drawer-item ${item.page === state.currentPage ? 'active' : ''}" 
          data-page="${item.page}"
          onclick="window.flipbookGoToPage(${item.page}); window.toggleTocDrawer(false);">
        <span class="toc-drawer-item-title">${escapeHtml(item.title)}</span>
        <span class="toc-drawer-item-page">Trang ${item.page}</span>
      </li>
    `).join('');
  }

  function highlightActiveToc() {
    const listEl = document.getElementById('flipbook-toc-list');
    if (!listEl) return;

    const items = listEl.querySelectorAll('.toc-drawer-item');
    items.forEach(el => {
      const p = parseInt(el.getAttribute('data-page'), 10);
      if (p === state.currentPage || (state.isTwoPageMode && (p === state.currentPage || p === state.currentPage + 1))) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  window.toggleTocDrawer = function(forceState) {
    const drawer = document.getElementById('flipbook-toc-drawer');
    if (!drawer) return;
    if (typeof forceState === 'boolean') {
      if (forceState) drawer.classList.add('open');
      else drawer.classList.remove('open');
    } else {
      drawer.classList.toggle('open');
    }
  };

  window.filterTocDrawer = function(query) {
    const listEl = document.getElementById('flipbook-toc-list');
    if (!listEl) return;
    const q = (query || '').toLowerCase().trim();
    const items = listEl.querySelectorAll('.toc-drawer-item');
    items.forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(q) ? 'flex' : 'none';
    });
  };

  // --- Toolbar Controls ---
  window.toggleFlipbookMode = function() {
    state.isTwoPageMode = !state.isTwoPageMode;
    const btn = document.getElementById('flipbook-btn-mode');
    if (btn) {
      btn.innerHTML = state.isTwoPageMode ? '<i class="fa-solid fa-book-open"></i> 2 Trang' : '<i class="fa-solid fa-file"></i> 1 Trang';
    }
    renderStructuredBookView();
  };

  window.adjustFlipbookFontSize = function(delta) {
    if (delta === 0) state.fontSizeLevel = 0;
    else state.fontSizeLevel = Math.max(-1, Math.min(2, state.fontSizeLevel + delta));
    renderStructuredBookView();
  };

  window.toggleFlipbookSound = function() {
    state.isSoundEnabled = !state.isSoundEnabled;
    const btn = document.getElementById('flipbook-btn-sound');
    if (btn) {
      btn.innerHTML = state.isSoundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      btn.title = state.isSoundEnabled ? 'Tắt âm thanh lật sách' : 'Bật âm thanh lật sách';
    }
  };

  window.toggleFlipbookFullscreen = function() {
    const modal = document.getElementById('activities-flipbook-modal');
    if (!modal) return;

    if (!document.fullscreenElement) {
      modal.requestFullscreen().then(() => {
        state.isFullscreen = true;
      }).catch(err => console.warn(err));
    } else {
      document.exitFullscreen().then(() => {
        state.isFullscreen = false;
      }).catch(err => console.warn(err));
    }
  };

  window.closeActivityFlipbook = function() {
    const modal = document.getElementById('activities-flipbook-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    window.toggleTocDrawer(false);
    unbindFlipbookEvents();
  };

  // --- Keyboard & Touch Event Listeners ---
  function handleKeyDown(e) {
    if (document.getElementById('activities-flipbook-modal').style.display === 'none') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      window.flipNextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      window.flipPrevPage();
    } else if (e.key === 'Escape') {
      window.closeActivityFlipbook();
    }
  }

  let touchStartX = 0;
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (diff < -50) window.flipNextPage();
    else if (diff > 50) window.flipPrevPage();
  }

  function bindFlipbookEvents() {
    window.addEventListener('keydown', handleKeyDown);
    const stage = document.getElementById('flipbook-stage-content');
    if (stage) {
      stage.addEventListener('touchstart', handleTouchStart, { passive: true });
      stage.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }

  function unbindFlipbookEvents() {
    window.removeEventListener('keydown', handleKeyDown);
    const stage = document.getElementById('flipbook-stage-content');
    if (stage) {
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchend', handleTouchEnd);
    }
  }

  // --- Download & Export Handlers ---
  window.downloadDocx = function(docId) {
    const doc = getDocById(docId);
    if (!doc) {
      showToast('Tài liệu không hợp lệ!', 'danger');
      return;
    }
    const filename = doc.docxUrl ? doc.docxUrl.split('/').pop() : `${doc.id}.docx`;
    const link = document.createElement('a');
    link.href = doc.docxUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đang tải file Word: ${doc.title}...`, 'success');
  };

  window.downloadPdf = function(docId) {
    const doc = getDocById(docId);
    if (!doc) {
      showToast('Tài liệu không hợp lệ!', 'danger');
      return;
    }

    // Direct download if file exists
    if (doc.pdfUrl) {
      const filename = doc.pdfUrl.split('/').pop();
      const link = document.createElement('a');
      link.href = doc.pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Đang tải file PDF: ${doc.title}...`, 'success');
      return;
    }

    // If docx and needs on-the-fly client generation via print
    window.printActivityBook(docId);
  };

  window.printActivityBook = function(docId) {
    const doc = getDocById(docId || (state.currentDoc ? state.currentDoc.id : null));
    if (!doc) return;

    showToast('Đang chuẩn bị trang in / xuất PDF...', 'info');

    // Build print container
    let printContainer = document.getElementById('flipbook-print-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'flipbook-print-container';
      document.body.appendChild(printContainer);
    }

    if (doc.pages && doc.pages.length > 0) {
      printContainer.innerHTML = doc.pages.map(p => `
        <div class="print-page print-page-break" style="padding: 40px; font-family: 'Montserrat', sans-serif;">
          ${p.html}
        </div>
      `).join('');
    } else {
      printContainer.innerHTML = `
        <div style="padding: 40px; font-family: 'Montserrat', sans-serif; text-align: center;">
          <h2>${escapeHtml(doc.title)}</h2>
          <p>${escapeHtml(doc.subtitle || '')}</p>
          <p>${escapeHtml(doc.desc || '')}</p>
        </div>
      `;
    }

    setTimeout(() => {
      window.print();
    }, 400);
  };

  // --- Utilities ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
  }

  function showToast(msg, type = 'info') {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${msg}`);
    }
  }

  // Export functions to global scope
  window.renderActivitiesLibrary = renderActivitiesLibrary;
  window.downloadCurrentDocx = function() {
    if (state.currentDoc) window.downloadDocx(state.currentDoc.id);
  };
  window.downloadCurrentPdf = function() {
    if (state.currentDoc) window.downloadPdf(state.currentDoc.id);
  };

})();

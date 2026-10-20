/**
 * ==========================================================================
 * CLASS EMULATION & AUTOMATIC MONTHLY HALL OF FAME CONTROLLER
 * Sổ Thi Đua Lớp Chủ Nhiệm & Bảng Vinh Danh Tự Động Thánh Kinh
 * Nền tảng: MagnificatEdu - Giáo Lý Công Giáo & Phong Trào Thiếu Nhi Thánh Thể
 * ==========================================================================
 */

  (function () {
    'use strict';

    // --- 1. Pure Web Audio Synthetic Sound Engine ---
    const EmuSound = {
      ctx: null,
      getCtx: function () {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        return this.ctx;
      },

      // Âm chuông thiên thần khi khen thưởng (+10đ)
      playReward: function () {
        try {
          const ctx = this.getCtx();
          if (!ctx) return;
          const now = ctx.currentTime;
          const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            gain.gain.setValueAtTime(0.18, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.85);
          });
        } catch (e) { }
      },

      // Âm chuông nhắc nhở nhẹ nhàng khi vi phạm (-5đ)
      playReminder: function () {
        try {
          const ctx = this.getCtx();
          if (!ctx) return;
          const now = ctx.currentTime;
          const notes = [440, 392]; // A4, G4
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0.15, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.55);
          });
        } catch (e) { }
      },

      // Đại chuông thánh đường & Khải hoàn khi vinh danh (Hall of Fame)
      playCathedralFanfare: function () {
        try {
          const ctx = this.getCtx();
          if (!ctx) return;
          const now = ctx.currentTime;
          const chord = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
          chord.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 2.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 2.3);
          });
        } catch (e) { }
      }
    };

    // --- 2. Biblical Characters & Catholic Titles Definition ---
    const BIBLICAL_TITLES = [
      {
        minScore: 140,
        title: "Người Quản Gia Trung Tín & Khôn Ngoan",
        verse: "Lc 12, 42 - 'Chủ sẽ đặt người ấy lên coi sóc mọi gia tài'",
        icon: "fa-solid fa-crown",
        color: "#b45309",
        bgClass: "badge-biblical-gold",
        description: "Mẫu mực toàn diện, siêng năng việc Chúa, kính mến thầy cô và giúp đỡ mọi người"
      },
      {
        minScore: 125,
        title: "Chiến Binh Đức Tin như Thánh Đa-vít",
        verse: "1 Sm 17, 45 - 'Nhờ Danh Đức Chúa, ta chiến thắng mọi thử thách'",
        icon: "fa-solid fa-shield-halved",
        color: "#0369a1",
        bgClass: "badge-biblical-silver",
        description: "Dũng cảm chiến thắng cám dỗ, hăng say việc chung với tấm lòng quả cảm"
      },
      {
        minScore: 115,
        title: "Tông Đồ Nhiệt Thành như Thánh Phaolô",
        verse: "Gl 2, 20 - 'Đức Kitô sống trong tôi, hăng say làm chứng tá'",
        icon: "fa-solid fa-dove",
        color: "#1d4ed8",
        bgClass: "badge-biblical-blue",
        description: "Tích cực phát biểu xây dựng bài, nhiệt tình lan tỏa niềm vui Tin Mừng"
      },
      {
        minScore: 105,
        title: "Người Đẹp Lòng Chúa như Samuel",
        verse: "1 Sm 3, 10 - 'Lạy Chúa xin hãy phán, vì tôi tớ Ngài đang lắng nghe'",
        icon: "fa-solid fa-star",
        color: "#7e22ce",
        bgClass: "badge-biblical-purple",
        description: "Ngoan ngoãn, chăm chú lắng nghe Lời Chúa và vâng lời các anh chị Giáo lý viên"
      },
      {
        minScore: 95,
        title: "Chiên Ngoan Của Chúa Giêsu Mục Tử",
        verse: "Ga 10, 14 - 'Tôi là mục tử nhân lành, tôi biết các chiên của tôi'",
        icon: "fa-solid fa-leaf",
        color: "#047857",
        bgClass: "badge-biblical-green",
        description: "Trung thành gìn giữ nề nếp, tham dự Thánh Lễ sốt sắng và chuyên cần"
      },
      {
        minScore: 80,
        title: "Công Chính & Cần Mẫn như Thánh Giuse",
        verse: "Mt 1, 19 - 'Âm thầm, trung tín và chu toàn mọi bổn phận'",
        icon: "fa-solid fa-seedling",
        color: "#d97706",
        bgClass: "badge-biblical-amber",
        description: "Cần mẫn cố gắng mỗi tuần, lặng lẽ rèn luyện để từng bước tiến bộ hơn"
      },
      {
        minScore: -9999,
        title: "Được Chúa Yêu Thương & Nâng Đỡ",
        verse: "Lc 15, 6 - 'Hãy vui mừng với tôi, vì tôi đã tìm thấy con chiên lạc'",
        icon: "fa-solid fa-hand-holding-heart",
        color: "#dc2626",
        bgClass: "badge-biblical-red",
        description: "Chúa và các anh chị Giáo lý viên luôn yêu thương, đồng hành và chờ đón sự hoán cải vươn lên"
      }
    ];

    function getBiblicalTitleForScore(score) {
      for (const item of BIBLICAL_TITLES) {
        if (score >= item.minScore) {
          return item;
        }
      }
      return BIBLICAL_TITLES[BIBLICAL_TITLES.length - 1];
    }

    // --- 3. Preset Reasons for Catholic Education ---
    const PRESET_REWARDS = [
      { text: "Thuộc kinh & bài giáo lý xuất sắc", icon: "fa-solid fa-book-bible", category: "Học tập" },
      { text: "Đi lễ Chúa Nhật & lễ trọng đúng giờ", icon: "fa-solid fa-church", category: "Phụng vụ" },
      { text: "Gương mẫu bác ái & giúp đỡ bạn hữu", icon: "fa-solid fa-hand-holding-heart", category: "Bác ái" },
      { text: "Tích cực phát biểu xây dựng bài giáo lý", icon: "fa-solid fa-hand", category: "Xây dựng bài" },
      { text: "Đọc kinh, hát thánh ca to rõ sốt sắng", icon: "fa-solid fa-music", category: "Sốt sắng" },
      { text: "Tự giác vệ sinh lớp học / nhà thờ sạch sẽ", icon: "fa-solid fa-broom", category: "Kỷ luật" },
      { text: "Làm việc lành hy sinh, chia sẻ sách vở", icon: "fa-solid fa-heart", category: "Đạo đức" }
    ];

    const PRESET_VIOLATIONS = [
      { text: "Đi trễ không có lý do chính đáng", icon: "fa-solid fa-clock", category: "Chuyên cần" },
      { text: "Nói chuyện riêng trong giờ học / giờ lễ", icon: "fa-solid fa-comment-slash", category: "Trật tự" },
      { text: "Quên mang sách Giáo lý / Kinh Thánh / vở ghi", icon: "fa-solid fa-book", category: "Học cụ" },
      { text: "Chưa hoàn thành bài tập giáo lý về nhà", icon: "fa-solid fa-pen-slash", category: "Bài tập" },
      { text: "Chạy nhảy, mất trật tự nơi thánh đường", icon: "fa-solid fa-person-running", category: "Nơi thánh" },
      { text: "Sử dụng điện thoại trong giờ học giáo lý", icon: "fa-solid fa-mobile-screen-button", category: "Kỷ luật" },
      { text: "Thiếu lễ phép với Thầy Cô / Huynh Trưởng", icon: "fa-solid fa-triangle-exclamation", category: "Tác phong" }
    ];

    // --- 4. State Management ---
    const state = {
      selectedClassId: null,
      selectedMonth: getCurrentYearMonth(), // 'YYYY-MM'
      activeTab: 'tracker', // 'tracker' | 'honors'
      searchQuery: '',
      selectedStudentIds: new Set(),
      modalData: {
        actionType: null, // 'reward' | 'violation'
        student: null,
        selectedReason: '',
        customReason: '',
        customPoints: null
      }
    };

    function getCurrentYearMonth() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    }

    function formatMonthDisplay(ymStr) {
      if (!ymStr) return '';
      const parts = ymStr.split('-');
      if (parts.length === 2) {
        return `Tháng ${parseInt(parts[1], 10)} / Năm ${parts[0]}`;
      }
      return ymStr;
    }

    // --- 5. Data Access Helpers ---
    function getEmulationStore() {
      if (!window.appData) window.appData = {};
      if (!window.appData.classEmulations) {
        window.appData.classEmulations = {};
      }
      return window.appData.classEmulations;
    }

    function getMonthEmulationData(classId, monthKey) {
      if (!classId || !monthKey) return { scores: {} };
      const store = getEmulationStore();
      if (!store[classId]) store[classId] = {};
      if (!store[classId][monthKey]) {
        store[classId][monthKey] = {
          scores: {},
          createdAt: new Date().toISOString()
        };
      }
      return store[classId][monthKey];
    }

    /**
     * Lấy bản ghi thi đua của học sinh trong tháng.
     * YÊU CẦU ĐẶC BIỆT: Mỗi bạn đầu tháng được cho sẵn 100 điểm!
     */
    function getStudentMonthScore(classId, monthKey, studentId) {
      const monthData = getMonthEmulationData(classId, monthKey);
      if (!monthData.scores[studentId]) {
        monthData.scores[studentId] = {
          studentId: studentId,
          baseScore: 100, // ĐẦU THÁNG ĐƯỢC CHO 100Đ
          currentScore: 100,
          rewardCount: 0,
          violationCount: 0,
          logs: []
        };
      }
      const record = monthData.scores[studentId];
      // Đảm bảo baseScore luôn chuẩn 100đ
      if (record.baseScore === undefined || record.baseScore === null) {
        record.baseScore = 100;
      }
      if (!Array.isArray(record.logs)) record.logs = [];

      // Recalculate precisely from baseScore + sum(deltas)
      let sumDelta = 0;
      let rCount = 0;
      let vCount = 0;
      record.logs.forEach(l => {
        const d = Number(l.delta) || 0;
        sumDelta += d;
        if (d > 0) rCount++;
        else if (d < 0) vCount++;
      });

      record.currentScore = record.baseScore + sumDelta;
      record.rewardCount = rCount;
      record.violationCount = vCount;

      return record;
    }

    function saveEmulationData(classId) {
      // 1. Save locally via appData persistence
      const uEmail = (window.currentUser && window.currentUser.email ? window.currentUser.email.toLowerCase().trim() : '');
      if (uEmail) {
        const storageKey = 'magnificat_app_data_' + uEmail.replace(/[^a-z0-9]/g, '_');
        try {
          localStorage.setItem(storageKey, JSON.stringify(window.appData));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
        if (window.allCloudUserDataMap) {
          window.allCloudUserDataMap[uEmail] = window.appData;
        }
      }

      // 2. Sync to Co-Teachers
      syncEmulationToCoTeachers(classId);

      // 3. Sync to Supabase Cloud if available
      if (window.supabaseClient && window.currentUser && window.currentUser.email) {
        try {
          window.supabaseClient.from('user_data').upsert({
            email: window.currentUser.email.toLowerCase(),
            data: window.appData,
            updated_at: new Date().toISOString()
          }).then(({ error }) => {
            if (!error) console.log('✅ Synchronized emulation scores to Supabase Cloud');
          });
        } catch (e) { }
      }
    }

    function syncEmulationToCoTeachers(classId) {
      if (!classId) return;
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const cls = classes.find(c => String(c.id) === String(classId));
      if (!cls) return;

      const targetEmails = new Set();
      if (cls.teacherEmail) targetEmails.add(cls.teacherEmail.toLowerCase().trim());
      if (cls.coTeacherEmail) targetEmails.add(cls.coTeacherEmail.toLowerCase().trim());
      if (cls.ownerEmail) targetEmails.add(cls.ownerEmail.toLowerCase().trim());

      const myEmail = (window.currentUser && window.currentUser.email ? window.currentUser.email.toLowerCase().trim() : '');

      targetEmails.forEach(tEmail => {
        if (tEmail === myEmail) return;
        let uData = window.allCloudUserDataMap ? window.allCloudUserDataMap[tEmail] : null;
        if (!uData) {
          try {
            const raw = localStorage.getItem('magnificat_app_data_' + tEmail.replace(/[^a-z0-9]/g, '_'));
            if (raw) uData = JSON.parse(raw);
          } catch (e) { }
        }
        if (uData) {
          if (!uData.classEmulations) uData.classEmulations = {};
          uData.classEmulations[classId] = window.appData.classEmulations[classId];
          if (window.allCloudUserDataMap) window.allCloudUserDataMap[tEmail] = uData;
          try {
            localStorage.setItem('magnificat_app_data_' + tEmail.replace(/[^a-z0-9]/g, '_'), JSON.stringify(uData));
            if (window.supabaseClient) {
              window.supabaseClient.from('user_data').upsert({ email: tEmail, data: uData, updated_at: new Date().toISOString() });
            }
          } catch (e) { }
        }
      });
    }

    // --- 6. Point Transactions ---
    function applyPoints(classId, monthKey, studentId, delta, reason, category = 'Chung') {
      const record = getStudentMonthScore(classId, monthKey, studentId);
      const now = new Date();
      const dateDisplay = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const teacherName = (window.currentUser ? ((window.currentUser.holyName ? window.currentUser.holyName + ' ' : '') + window.currentUser.name) : 'GLV');

      const logEntry = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        type: delta > 0 ? 'reward' : 'violation',
        delta: Number(delta),
        reason: reason || (delta > 0 ? 'Khen thưởng chuyên cần & giáo lý' : 'Nhắc nhở nề nếp'),
        category: category,
        dateDisplay: dateDisplay,
        timestamp: Date.now(),
        recordedBy: teacherName
      };

      record.logs.unshift(logEntry);
      record.currentScore += Number(delta);
      if (delta > 0) record.rewardCount++;
      else record.violationCount++;

      saveEmulationData(classId);

      // Audio cue
      if (delta > 0) EmuSound.playReward();
      else EmuSound.playReminder();

      return logEntry;
    }

    function deleteLog(classId, monthKey, studentId, logId) {
      const record = getStudentMonthScore(classId, monthKey, studentId);
      const idx = record.logs.findIndex(l => l.id === logId);
      if (idx >= 0) {
        const removed = record.logs.splice(idx, 1)[0];
        record.currentScore -= Number(removed.delta);
        if (removed.delta > 0) record.rewardCount = Math.max(0, record.rewardCount - 1);
        else record.violationCount = Math.max(0, record.violationCount - 1);
        saveEmulationData(classId);
        return true;
      }
      return false;
    }

    // --- 7. Float Score Animation ---
    function triggerScoreFloat(element, text, isPlus) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const floatEl = document.createElement('div');
      floatEl.className = `emu-float-score ${isPlus ? 'plus' : 'minus'}`;
      floatEl.textContent = text;
      floatEl.style.left = `${rect.left + rect.width / 2 - 20}px`;
      floatEl.style.top = `${rect.top - 10}px`;
      document.body.appendChild(floatEl);

      setTimeout(() => {
        if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
      }, 1250);
    }

    // --- 8. UI Rendering Engine ---
    function renderClassEmulation(container, initialClassId = null) {
      if (!container) return;

      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      if (classes.length === 0) {
        container.innerHTML = `
        <div class="emulation-container">
          <div class="card" style="text-align: center; padding: 48px 24px; border-radius: 20px;">
            <div style="font-size: 54px; color: var(--emu-gold); margin-bottom: 14px;"><i class="fa-solid fa-award"></i></div>
            <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Chưa Có Lớp Học Nào Để Bắt Đầu Thi Đua</h2>
            <p style="font-size: 14px; color: #64748b; max-width: 520px; margin: 0 auto 20px auto;">
              Bạn cần tạo hoặc được phân công chủ nhiệm ít nhất một lớp học giáo lý để kích hoạt tính năng Thi Đua & Bảng Vinh Danh Thánh Kinh.
            </p>
            <button class="btn btn-primary" onclick="window.navigateTo('classes')"><i class="fa-solid fa-layer-group"></i> Đi Đến Mục Lớp Học</button>
          </div>
        </div>
      `;
        return;
      }

      // Determine active class ID
      if (initialClassId) {
        state.selectedClassId = initialClassId;
      } else if (!state.selectedClassId || !classes.some(c => String(c.id) === String(state.selectedClassId))) {
        state.selectedClassId = String(classes[0].id);
      }

      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const classStudents = allStudents.filter(s => String(s.classId) === String(currentClass.id) || String(s.className) === String(currentClass.name));

      // Calculate class monthly stats
      let totalRewards = 0;
      let totalViolations = 0;
      let highestScore = 100;
      let topStudent = null;

      const studentRanks = classStudents.map(s => {
        const scoreData = getStudentMonthScore(currentClass.id, state.selectedMonth, s.id);
        totalRewards += scoreData.rewardCount;
        totalViolations += scoreData.violationCount;
        if (scoreData.currentScore > highestScore) {
          highestScore = scoreData.currentScore;
          topStudent = s;
        }
        return {
          student: s,
          scoreData: scoreData,
          biblicalTitle: getBiblicalTitleForScore(scoreData.currentScore)
        };
      });

      // Sort by currentScore descending, then by fullName
      studentRanks.sort((a, b) => {
        if (b.scoreData.currentScore !== a.scoreData.currentScore) {
          return b.scoreData.currentScore - a.scoreData.currentScore;
        }
        return (a.student.fullName || '').localeCompare(b.student.fullName || '');
      });

      // Assign rank positions (1, 2, 3...)
      studentRanks.forEach((item, index) => {
        item.rank = index + 1;
      });

      if (!topStudent && studentRanks.length > 0) {
        topStudent = studentRanks[0].student;
        highestScore = studentRanks[0].scoreData.currentScore;
      }

      // Filter for search
      const filteredRanks = studentRanks.filter(item => {
        if (!state.searchQuery) return true;
        const q = state.searchQuery.toLowerCase().trim();
        const s = item.student;
        const full = `${s.holyName || ''} ${s.fullName || s.name || ''} ${s.code || ''}`.toLowerCase();
        return full.includes(q);
      });

      // Generate Month Options (Last 6 months + Next 2 months)
      const monthOptions = [];
      const now = new Date();
      for (let i = -6; i <= 2; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthOptions.push({
          value: ym,
          label: `Tháng ${d.getMonth() + 1} / ${d.getFullYear()} ${i === 0 ? '(Hiện tại)' : ''}`
        });
      }

      container.innerHTML = `
      <div class="emulation-container">
        <!-- HERO BANNER -->
        <div class="emu-hero-banner">
          <div class="emu-hero-badge">
            <i class="fa-solid fa-cross"></i> HOA THIÊNG NHÂN ĐỨC & KHEN THƯỞNG GIÁO LÝ
          </div>
          <h1 class="emu-hero-title">
            <i class="fa-solid fa-trophy" style="color: #fbbf24;"></i> Thi Đua & Bảng Vinh Danh Thánh Kinh
          </h1>
          <p class="emu-hero-subtitle">
            Khởi đầu mỗi tháng, mỗi học sinh được trao ban <strong>100 điểm hồng ân</strong>. 
            Cùng nhau tích lũy điểm qua việc tham dự Thánh Lễ, học bài, việc lành bác ái và vinh danh cuối tháng với các Danh hiệu Kinh Thánh cao quý.
          </p>

          <div class="emu-hero-stats">
            <div class="emu-stat-pill">
              <div class="emu-stat-icon gold"><i class="fa-solid fa-users"></i></div>
              <div>
                <div class="emu-stat-value">${classStudents.length}</div>
                <div class="emu-stat-label">Sĩ số lớp</div>
              </div>
            </div>

            <div class="emu-stat-pill">
              <div class="emu-stat-icon green"><i class="fa-solid fa-star"></i></div>
              <div>
                <div class="emu-stat-value">${totalRewards} lần (+10đ)</div>
                <div class="emu-stat-label">Khen thưởng tháng</div>
              </div>
            </div>

            <div class="emu-stat-pill">
              <div class="emu-stat-icon red"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div>
                <div class="emu-stat-value">${totalViolations} lần (-5đ)</div>
                <div class="emu-stat-label">Nhắc nhở nề nếp</div>
              </div>
            </div>

            <div class="emu-stat-pill">
              <div class="emu-stat-icon blue"><i class="fa-solid fa-crown"></i></div>
              <div>
                <div class="emu-stat-value" style="font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;">
                  ${topStudent ? (topStudent.holyName ? topStudent.holyName + ' ' : '') + (topStudent.fullName || topStudent.name) : '---'}
                </div>
                <div class="emu-stat-label">Dẫn đầu (${highestScore}đ)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTROLS BAR: CLASS SELECTOR & TABS -->
        <div class="emu-controls-card">
          <div class="emu-class-selector">
            <div class="emu-select-group">
              <label><i class="fa-solid fa-layer-group text-primary"></i> Lớp học:</label>
              <select class="emu-select" onchange="window.onEmuChangeClass(this.value)">
                ${classes.map(c => `
                  <option value="${c.id}" ${String(c.id) === String(state.selectedClassId) ? 'selected' : ''}>
                    ${c.name} (${c.teacher || 'Chủ nhiệm'})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="emu-select-group">
              <label><i class="fa-solid fa-calendar-days text-warning"></i> Tháng thi đua:</label>
              <select class="emu-select" onchange="window.onEmuChangeMonth(this.value)">
                ${monthOptions.map(m => `
                  <option value="${m.value}" ${m.value === state.selectedMonth ? 'selected' : ''}>
                    ${m.label}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="emu-tabs">
            <button class="emu-tab-btn ${state.activeTab === 'tracker' ? 'active' : ''}" onclick="window.onEmuSwitchTab('tracker')">
              <i class="fa-solid fa-clipboard-check"></i> Sổ Điểm Thi Đua
            </button>
            <button class="emu-tab-btn gold-active ${state.activeTab === 'honors' ? 'active' : ''}" onclick="window.onEmuSwitchTab('honors')">
              <i class="fa-solid fa-trophy"></i> Bảng Vinh Danh Tự Động
            </button>
          </div>
        </div>

        <!-- VIEW SWITCHER -->
        ${state.activeTab === 'tracker'
          ? renderTrackerView(currentClass, filteredRanks, classStudents)
          : renderHonorsView(currentClass, studentRanks)
        }
      </div>

      <!-- MODALS CONTAINER -->
      <div id="emu-modal-container"></div>
      <div id="emu-print-area"></div>
    `;

      // Attach search event
      const searchInput = document.getElementById('emu-search-input');
      if (searchInput) {
        searchInput.value = state.searchQuery;
        searchInput.focus();
      }
    }

    // --- 9. Sub-View: Tracker (Sổ Điểm & Chấm Điểm) ---
    function renderTrackerView(currentClass, filteredRanks, allClassStudents) {
      return `
      <!-- TOOLS BAR -->
      <div class="emu-tools-bar">
        <div class="emu-search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="emu-search-input" class="emu-search-input" 
                 placeholder="Tìm theo tên học viên, tên thánh, mã số..." 
                 value="${state.searchQuery}"
                 oninput="window.onEmuSearch(this.value)">
        </div>

        <div class="emu-actions-group">
          <button class="btn btn-outline-primary btn-sm" onclick="window.onEmuBatchRewardModal()" title="Khen thưởng nhanh cho cả lớp hoặc nhiều bạn">
            <i class="fa-solid fa-sparkles"></i> Thưởng Nhiều Bạn (+10đ)
          </button>
          <button class="btn btn-outline-warning btn-sm" onclick="window.onEmuQuickResetMonth()" title="Khôi phục lại mốc 100 điểm ban đầu cho cả lớp trong tháng này">
            <i class="fa-solid fa-rotate-left"></i> Đặt Lại 100đ Đầu Tháng
          </button>
        </div>
      </div>

      <!-- TABLE CARD -->
      <div class="emu-table-card">
        ${filteredRanks.length === 0 ? `
          <div style="text-align: center; padding: 48px 20px;">
            <i class="fa-solid fa-user-slash" style="font-size: 40px; color: #cbd5e1; margin-bottom: 12px;"></i>
            <h4 style="font-size: 16px; font-weight: 700; color: #1e293b;">Không tìm thấy học sinh nào</h4>
            <p style="font-size: 13px; color: #64748b;">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc danh sách học viên của lớp.</p>
          </div>
        ` : `
          <div class="table-responsive">
            <table class="emu-table">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">Hạng</th>
                  <th>Học Viên Giáo Lý</th>
                  <th style="text-align: center; width: 100px;">Khởi Đầu</th>
                  <th style="text-align: center; width: 120px;">Thưởng / Phạt</th>
                  <th style="text-align: center; width: 110px;">Điểm Tháng</th>
                  <th>Danh Hiệu Thánh Kinh</th>
                  <th style="text-align: right; width: 280px;">Thao Tác Chấm Điểm</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRanks.map(item => {
        const s = item.student;
        const sc = item.scoreData;
        const title = item.biblicalTitle;
        const rankClass = item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : item.rank === 3 ? 'bronze' : 'other';

        let scoreClass = 'normal';
        if (sc.currentScore >= 130) scoreClass = 'gold';
        else if (sc.currentScore >= 110) scoreClass = 'high';
        else if (sc.currentScore < 90 && sc.currentScore >= 75) scoreClass = 'warning';
        else if (sc.currentScore < 75) scoreClass = 'low';

        return `
                    <tr id="emu-row-${s.id}">
                      <td style="text-align: center;">
                        <span class="emu-rank-pill ${rankClass}">${item.rank}</span>
                      </td>
                      <td>
                        <div class="emu-student-info">
                          ${s.avatar ? `
                            <img src="${s.avatar}" alt="" class="emu-avatar" onerror="this.src='admin_avatar.png'">
                          ` : `
                            <div class="emu-avatar-placeholder">
                              ${(s.holyName || s.fullName || 'H').substring(0, 1).toUpperCase()}
                            </div>
                          `}
                          <div class="emu-student-names">
                            <div class="emu-holy-name">${s.holyName || ''}</div>
                            <div class="emu-full-name">${s.fullName || s.name || 'Chưa đặt tên'}</div>
                            <div class="emu-student-code">${s.code ? 'Mã: ' + s.code : (s.gender || '')}</div>
                          </div>
                        </div>
                      </td>
                      <td style="text-align: center;">
                        <span style="font-weight: 700; color: #64748b; background: #f8fafc; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                          100đ
                        </span>
                      </td>
                      <td style="text-align: center;">
                        <div style="font-size: 12px; font-weight: 700; display: flex; justify-content: center; gap: 8px;">
                          <span style="color: #059669;" title="${sc.rewardCount} lần khen thưởng (+10đ)">
                            <i class="fa-solid fa-star"></i> +${sc.rewardCount * 10}
                          </span>
                          <span style="color: #dc2626;" title="${sc.violationCount} lần nhắc nhở (-5đ)">
                            <i class="fa-solid fa-triangle-exclamation"></i> -${sc.violationCount * 5}
                          </span>
                        </div>
                      </td>
                      <td style="text-align: center;">
                        <span class="emu-score-pill ${scoreClass}">
                          ${sc.currentScore}đ
                        </span>
                      </td>
                      <td>
                        <div class="biblical-badge ${title.bgClass}" 
                             title="${title.verse} - ${title.description}"
                             onclick="window.showBiblicalDetailModal('${s.id}')">
                          <i class="${title.icon}"></i>
                          <span>${title.title}</span>
                        </div>
                      </td>
                      <td style="text-align: right;">
                        <div class="emu-action-btns" style="justify-content: flex-end;">
                          <button class="btn-emu-reward" 
                                  onclick="window.onEmuOpenRewardModal('${s.id}', this)"
                                  title="Cộng 10 điểm khen thưởng nề nếp, học bài, việc bác ái">
                            <i class="fa-solid fa-plus"></i> 10đ Thưởng
                          </button>
                          <button class="btn-emu-penalty" 
                                  onclick="window.onEmuOpenPenaltyModal('${s.id}', this)"
                                  title="Trừ 5 điểm nhắc nhở nề nếp, đi trễ, quên sách vở">
                            <i class="fa-solid fa-minus"></i> 5đ Vi phạm
                          </button>
                          <button class="btn-emu-history" 
                                  onclick="window.onEmuOpenHistoryModal('${s.id}')"
                                  title="Xem lịch sử và nhật ký thi đua của học sinh này">
                            <i class="fa-solid fa-clock-rotate-left"></i> ${sc.logs.length}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
      }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
    }

    // --- 10. Sub-View: Honors / Hall of Fame (Bảng Vinh Danh Tự Động) ---
    function renderHonorsView(currentClass, studentRanks) {
      const top1 = studentRanks.length > 0 ? studentRanks[0] : null;
      const top2 = studentRanks.length > 1 ? studentRanks[1] : null;
      const top3 = studentRanks.length > 2 ? studentRanks[2] : null;

      return `
      <div class="emu-hof-section">
        <!-- HEADER -->
        <div class="emu-hof-header">
          <div class="emu-hof-badge-top">
            <i class="fa-solid fa-crown"></i> BẢNG VÀNG TUYÊN DƯƠNG THÁNH KINH - ${formatMonthDisplay(state.selectedMonth).toUpperCase()}
          </div>
          <h2 class="emu-hof-title">
            Vinh Danh Học Sinh Lớp <span>${currentClass.name}</span>
          </h2>
          <p class="emu-hof-subtitle">
            Tự động tổng hợp và vinh danh những tấm gương nhân đức, chăm chỉ học Lời Chúa, 
            siêng năng tham dự Thánh Lễ và sống bác ái với bạn bè trong suốt tháng.
          </p>

          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 18px; flex-wrap: wrap;">
            <button class="btn btn-warning" onclick="window.triggerHofConfetti()" style="font-weight: 800; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);">
              <i class="fa-solid fa-wand-magic-sparkles"></i> 🎊 Bắn Pháo Hoa Chúc Mừng!
            </button>
            <button class="btn btn-outline-primary" onclick="window.printHonorsBoard()" style="background: #fff;">
              <i class="fa-solid fa-print"></i> 🖨️ In Bảng Vàng A4 Của Lớp
            </button>
            <button class="btn btn-outline-success" onclick="window.copyZaloAnnouncement()" style="background: #fff;">
              <i class="fa-solid fa-share-nodes"></i> 📲 Sao Chép Báo Cáo Zalo Phụ Huynh
            </button>
          </div>
        </div>

        <!-- 3D PODIUM SECTION (TOP 3) -->
        ${top1 ? `
          <div class="emu-podium-container">
            <!-- RANK 2: LEFT -->
            ${top2 ? `
              <div class="emu-podium-card rank-2">
                <div class="emu-podium-medal silver"><i class="fa-solid fa-medal"></i></div>
                <div class="emu-podium-avatar-wrapper">
                  ${top2.student.avatar ? `
                    <img src="${top2.student.avatar}" alt="" class="emu-podium-avatar" onerror="this.src='admin_avatar.png'">
                  ` : `
                    <div class="emu-avatar-placeholder" style="width: 100%; height: 100%; font-size: 24px; background: linear-gradient(135deg, #94a3b8, #475569);">
                      ${(top2.student.holyName || top2.student.fullName || '2').substring(0, 1).toUpperCase()}
                    </div>
                  `}
                </div>
                <div class="emu-podium-holy">${top2.student.holyName || ''}</div>
                <h4 class="emu-podium-name">${top2.student.fullName || top2.student.name}</h4>
                <div class="emu-podium-points">${top2.scoreData.currentScore} <span style="font-size: 15px; font-weight: 600;">điểm</span></div>
                <div class="emu-podium-title" style="color: #0369a1; border: 1px solid #bae6fd; background: #e0f2fe;">
                  <i class="${top2.biblicalTitle.icon}"></i> ${top2.biblicalTitle.title}
                </div>
                <button class="btn btn-sm btn-outline-primary" style="margin-top: 10px; font-size: 11px;" onclick="window.printSingleCertificate('${top2.student.id}')">
                  <i class="fa-solid fa-certificate"></i> In Phiếu Khen
                </button>
                <div class="emu-podium-pedestal">🥈 HẠNG NHÌ</div>
              </div>
            ` : ''}

            <!-- RANK 1: CENTER (TALLL) -->
            <div class="emu-podium-card rank-1">
              <div class="emu-podium-crown"><i class="fa-solid fa-crown"></i></div>
              <div class="emu-podium-medal gold"><i class="fa-solid fa-trophy"></i></div>
              <div class="emu-podium-avatar-wrapper">
                ${top1.student.avatar ? `
                  <img src="${top1.student.avatar}" alt="" class="emu-podium-avatar" onerror="this.src='admin_avatar.png'">
                ` : `
                  <div class="emu-avatar-placeholder" style="width: 100%; height: 100%; font-size: 28px; background: linear-gradient(135deg, #f59e0b, #d97706);">
                    ${(top1.student.holyName || top1.student.fullName || '1').substring(0, 1).toUpperCase()}
                  </div>
                `}
              </div>
              <div class="emu-podium-holy">${top1.student.holyName || ''}</div>
              <h3 class="emu-podium-name" style="font-size: 18px;">${top1.student.fullName || top1.student.name}</h3>
              <div class="emu-podium-points">${top1.scoreData.currentScore} <span style="font-size: 16px; font-weight: 600;">điểm</span></div>
              <div class="emu-podium-title" style="color: #92400e; border: 1px solid #fde68a; background: #fef3c7;">
                <i class="${top1.biblicalTitle.icon}"></i> ${top1.biblicalTitle.title}
              </div>
              <button class="btn btn-sm btn-primary" style="margin-top: 10px; font-size: 11px; background: linear-gradient(135deg, #d97706, #b45309); border: none;" onclick="window.printSingleCertificate('${top1.student.id}')">
                <i class="fa-solid fa-certificate"></i> In Phiếu Khen Quán Quân
              </button>
              <div class="emu-podium-pedestal">🥇 QUÁN QUÂN XUẤT SẮC</div>
            </div>

            <!-- RANK 3: RIGHT -->
            ${top3 ? `
              <div class="emu-podium-card rank-3">
                <div class="emu-podium-medal bronze"><i class="fa-solid fa-award"></i></div>
                <div class="emu-podium-avatar-wrapper">
                  ${top3.student.avatar ? `
                    <img src="${top3.student.avatar}" alt="" class="emu-podium-avatar" onerror="this.src='admin_avatar.png'">
                  ` : `
                    <div class="emu-avatar-placeholder" style="width: 100%; height: 100%; font-size: 24px; background: linear-gradient(135deg, #b45309, #78350f);">
                      ${(top3.student.holyName || top3.student.fullName || '3').substring(0, 1).toUpperCase()}
                    </div>
                  `}
                </div>
                <div class="emu-podium-holy">${top3.student.holyName || ''}</div>
                <h4 class="emu-podium-name">${top3.student.fullName || top3.student.name}</h4>
                <div class="emu-podium-points">${top3.scoreData.currentScore} <span style="font-size: 15px; font-weight: 600;">điểm</span></div>
                <div class="emu-podium-title" style="color: #7c2d12; border: 1px solid #fed7aa; background: #ffedd5;">
                  <i class="${top3.biblicalTitle.icon}"></i> ${top3.biblicalTitle.title}
                </div>
                <button class="btn btn-sm btn-outline-primary" style="margin-top: 10px; font-size: 11px;" onclick="window.printSingleCertificate('${top3.student.id}')">
                  <i class="fa-solid fa-certificate"></i> In Phiếu Khen
                </button>
                <div class="emu-podium-pedestal">🥉 HẠNG BA</div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- FULL RANKING TABLE -->
        <div class="emu-hof-list-card">
          <div class="emu-hof-table-header">
            <div>
              <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">
                <i class="fa-solid fa-list-ol text-primary"></i> Toàn Bộ Bảng Xếp Hạng Thi Đua (${studentRanks.length} học sinh)
              </h3>
              <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">
                Sắp xếp tự động theo tổng điểm thi đua trong ${formatMonthDisplay(state.selectedMonth)}
              </p>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-primary" onclick="window.printAllCertificates()">
                <i class="fa-solid fa-file-arrow-down"></i> In Phiếu Khen Toàn Lớp
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="emu-table">
              <thead>
                <tr>
                  <th style="width: 60px; text-align: center;">Thứ Hạng</th>
                  <th>Học Viên Giáo Lý</th>
                  <th style="text-align: center;">Điểm Xuất Phát</th>
                  <th style="text-align: center;">Khen Thưởng (+10đ)</th>
                  <th style="text-align: center;">Nhắc Nhở (-5đ)</th>
                  <th style="text-align: center;">Tổng Điểm Cuối Tháng</th>
                  <th>Danh Hiệu Thánh Kinh Được Vinh Danh</th>
                  <th style="text-align: right; width: 140px;">Phiếu Khen</th>
                </tr>
              </thead>
              <tbody>
                ${studentRanks.map(item => {
        const s = item.student;
        const sc = item.scoreData;
        const title = item.biblicalTitle;
        const rankPillClass = item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : item.rank === 3 ? 'bronze' : 'other';

        return `
                    <tr>
                      <td style="text-align: center;">
                        <span class="emu-rank-pill ${rankPillClass}">${item.rank}</span>
                      </td>
                      <td>
                        <div class="emu-student-info">
                          ${s.avatar ? `
                            <img src="${s.avatar}" alt="" class="emu-avatar" style="width: 38px; height: 38px;" onerror="this.src='admin_avatar.png'">
                          ` : `
                            <div class="emu-avatar-placeholder" style="width: 38px; height: 38px; font-size: 13px;">
                              ${(s.holyName || s.fullName || 'H').substring(0, 1).toUpperCase()}
                            </div>
                          `}
                          <div class="emu-student-names">
                            <span class="emu-holy-name">${s.holyName || ''}</span>
                            <span class="emu-full-name" style="margin-left: 4px;">${s.fullName || s.name}</span>
                          </div>
                        </div>
                      </td>
                      <td style="text-align: center; color: #64748b; font-weight: 600;">100đ</td>
                      <td style="text-align: center; color: #059669; font-weight: 700;">+${sc.rewardCount * 10}đ (${sc.rewardCount} lần)</td>
                      <td style="text-align: center; color: #dc2626; font-weight: 700;">-${sc.violationCount * 5}đ (${sc.violationCount} lần)</td>
                      <td style="text-align: center;">
                        <strong style="font-size: 16px; color: ${sc.currentScore >= 120 ? '#b45309' : sc.currentScore >= 100 ? '#1d4ed8' : '#dc2626'};">
                          ${sc.currentScore}đ
                        </strong>
                      </td>
                      <td>
                        <div class="biblical-badge ${title.bgClass}">
                          <i class="${title.icon}"></i>
                          <span>${title.title}</span>
                        </div>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-sm btn-outline-warning" 
                                style="color: #b45309; border-color: #fde68a; background: #fffbeb;"
                                onclick="window.printSingleCertificate('${s.id}')">
                          <i class="fa-solid fa-certificate"></i> In Giấy Khen
                        </button>
                      </td>
                    </tr>
                  `;
      }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    }

    // --- 11. Modal Controllers ---

    // Khen thưởng (+10đ)
    window.onEmuOpenRewardModal = function (studentId, btnEl) {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const student = allStudents.find(s => String(s.id) === String(studentId));
      if (!student) return;

      state.modalData = {
        actionType: 'reward',
        student: student,
        selectedReason: PRESET_REWARDS[0].text,
        customReason: '',
        customPoints: 10
      };

      const container = document.getElementById('emu-modal-container');
      if (!container) return;

      container.innerHTML = `
      <div class="emu-modal-backdrop" onclick="if(event.target===this) window.closeEmuModal()">
        <div class="emu-modal-dialog">
          <div class="emu-modal-header reward">
            <h3 class="emu-modal-title">
              <i class="fa-solid fa-sparkles"></i> Khen Thưởng Thi Đua (+10 Điểm)
            </h3>
            <button class="emu-modal-close" onclick="window.closeEmuModal()">&times;</button>
          </div>
          <div class="emu-modal-body">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px 14px; background: #ecfdf5; border-radius: 12px; border: 1px solid #a7f3d0;">
              <i class="fa-solid fa-award" style="font-size: 28px; color: #059669;"></i>
              <div>
                <div style="font-size: 12px; color: #065f46; font-weight: 600;">Ghi nhận thành tích cho học viên:</div>
                <div style="font-size: 16px; font-weight: 800; color: #064e3b;">
                  ${student.holyName ? student.holyName + ' ' : ''}${student.fullName || student.name}
                </div>
              </div>
            </div>

            <label style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; display: block;">
              Chọn lý do khen thưởng chuẩn Giáo lý:
            </label>
            <div class="emu-reasons-grid">
              ${PRESET_REWARDS.map((r, idx) => `
                <button type="button" class="emu-reason-btn reward-btn ${idx === 0 ? 'selected' : ''}" 
                        onclick="window.selectEmuReason(this, '${r.text.replace(/'/g, "\\'")}', 10)">
                  <span><i class="${r.icon}" style="margin-right: 8px; color: #059669;"></i> ${r.text}</span>
                  <span style="color: #059669; font-weight: 800;">+10đ</span>
                </button>
              `).join('')}
            </div>

            <div style="margin-top: 14px;">
              <label style="font-size: 12px; font-weight: 700; color: #475569;">Hoặc nhập lý do khen thưởng khác:</label>
              <input type="text" id="emu-custom-reason-input" class="form-control" 
                     placeholder="Ví dụ: Đạt điểm 10 bài kiểm tra Kinh Thánh, giúp Thầy dọn phòng học..."
                     style="margin-top: 4px; font-size: 13px;">
            </div>
          </div>
          <div class="emu-modal-footer">
            <button class="btn btn-outline-secondary" onclick="window.closeEmuModal()">Hủy Bỏ</button>
            <button class="btn btn-success" onclick="window.confirmEmuAction()">
              <i class="fa-solid fa-check"></i> Xác Nhận Thưởng +10đ
            </button>
          </div>
        </div>
      </div>
    `;
    };

    // Vi phạm (-5đ)
    window.onEmuOpenPenaltyModal = function (studentId, btnEl) {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const student = allStudents.find(s => String(s.id) === String(studentId));
      if (!student) return;

      state.modalData = {
        actionType: 'violation',
        student: student,
        selectedReason: PRESET_VIOLATIONS[0].text,
        customReason: '',
        customPoints: -5
      };

      const container = document.getElementById('emu-modal-container');
      if (!container) return;

      container.innerHTML = `
      <div class="emu-modal-backdrop" onclick="if(event.target===this) window.closeEmuModal()">
        <div class="emu-modal-dialog">
          <div class="emu-modal-header penalty">
            <h3 class="emu-modal-title">
              <i class="fa-solid fa-triangle-exclamation"></i> Nhắc Nhở Nề Nếp (-5 Điểm)
            </h3>
            <button class="emu-modal-close" onclick="window.closeEmuModal()">&times;</button>
          </div>
          <div class="emu-modal-body">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px 14px; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca;">
              <i class="fa-solid fa-user-pen" style="font-size: 28px; color: #dc2626;"></i>
              <div>
                <div style="font-size: 12px; color: #991b1b; font-weight: 600;">Nhắc nhở nề nếp học viên:</div>
                <div style="font-size: 16px; font-weight: 800; color: #7f1d1d;">
                  ${student.holyName ? student.holyName + ' ' : ''}${student.fullName || student.name}
                </div>
              </div>
            </div>

            <label style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; display: block;">
              Chọn lỗi nề nếp cần nhắc nhở yêu thương:
            </label>
            <div class="emu-reasons-grid">
              ${PRESET_VIOLATIONS.map((r, idx) => `
                <button type="button" class="emu-reason-btn penalty-btn ${idx === 0 ? 'selected' : ''}" 
                        onclick="window.selectEmuReason(this, '${r.text.replace(/'/g, "\\'")}', -5)">
                  <span><i class="${r.icon}" style="margin-right: 8px; color: #dc2626;"></i> ${r.text}</span>
                  <span style="color: #dc2626; font-weight: 800;">-5đ</span>
                </button>
              `).join('')}
            </div>

            <div style="margin-top: 14px;">
              <label style="font-size: 12px; font-weight: 700; color: #475569;">Hoặc nhập lý do nhắc nhở khác:</label>
              <input type="text" id="emu-custom-reason-input" class="form-control" 
                     placeholder="Ví dụ: Thiếu trật tự trong giờ kinh tối, quên tập viết..."
                     style="margin-top: 4px; font-size: 13px;">
            </div>
          </div>
          <div class="emu-modal-footer">
            <button class="btn btn-outline-secondary" onclick="window.closeEmuModal()">Hủy Bỏ</button>
            <button class="btn btn-danger" onclick="window.confirmEmuAction()">
              <i class="fa-solid fa-check"></i> Xác Nhận Trừ -5đ
            </button>
          </div>
        </div>
      </div>
    `;
    };

    window.selectEmuReason = function (btn, reasonText, points) {
      document.querySelectorAll('.emu-reason-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.modalData.selectedReason = reasonText;
      state.modalData.customPoints = points;
    };

    window.confirmEmuAction = function () {
      const { actionType, student, selectedReason } = state.modalData;
      if (!student) return;

      const customInput = document.getElementById('emu-custom-reason-input');
      const reason = (customInput && customInput.value.trim()) ? customInput.value.trim() : selectedReason;
      const delta = actionType === 'reward' ? 10 : -5;

      applyPoints(state.selectedClassId, state.selectedMonth, student.id, delta, reason, actionType === 'reward' ? 'Khen thưởng' : 'Nhắc nhở');

      window.closeEmuModal();

      // Trigger toast notification
      if (typeof window.showToast === 'function') {
        window.showToast(`${actionType === 'reward' ? '✨ Đã cộng +10đ khen thưởng' : '⚠️ Đã trừ -5đ nhắc nhở'} cho ${student.holyName || ''} ${student.fullName || student.name}`, actionType === 'reward' ? 'success' : 'warning');
      }

      // Refresh view
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
    };

    window.closeEmuModal = function () {
      const container = document.getElementById('emu-modal-container');
      if (container) container.innerHTML = '';
    };

    // --- 12. History Log Modal ---
    window.onEmuOpenHistoryModal = function (studentId) {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const student = allStudents.find(s => String(s.id) === String(studentId));
      if (!student) return;

      const scoreData = getStudentMonthScore(currentClass.id, state.selectedMonth, student.id);
      const logs = scoreData.logs || [];
      const title = getBiblicalTitleForScore(scoreData.currentScore);

      const container = document.getElementById('emu-modal-container');
      if (!container) return;

      container.innerHTML = `
      <div class="emu-modal-backdrop" onclick="if(event.target===this) window.closeEmuModal()">
        <div class="emu-modal-dialog">
          <div class="emu-modal-header gold">
            <h3 class="emu-modal-title">
              <i class="fa-solid fa-clock-rotate-left"></i> Nhật Ký Thi Đua ${formatMonthDisplay(state.selectedMonth)}
            </h3>
            <button class="emu-modal-close" onclick="window.closeEmuModal()">&times;</button>
          </div>
          <div class="emu-modal-body">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #fffbeb; padding: 14px 16px; border-radius: 14px; border: 1px solid #fde68a; margin-bottom: 16px;">
              <div>
                <div style="font-weight: 800; font-size: 16px; color: #92400e;">
                  ${student.holyName ? student.holyName + ' ' : ''}${student.fullName || student.name}
                </div>
                <div style="font-size: 12px; color: #b45309; margin-top: 2px;">
                  <i class="${title.icon}"></i> ${title.title}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; color: #92400e; font-weight: 600;">Điểm hiện tại:</div>
                <div style="font-size: 24px; font-weight: 900; color: #b45309;">${scoreData.currentScore}đ</div>
              </div>
            </div>

            <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 10px; display: flex; justify-content: space-between;">
              <span>Chi tiết các lần cộng/trừ điểm:</span>
              <span style="font-size: 12px; color: #64748b;">(Gốc đầu tháng: 100đ)</span>
            </div>

            ${logs.length === 0 ? `
              <div style="text-align: center; padding: 30px 10px; color: #64748b;">
                <i class="fa-solid fa-clipboard-check" style="font-size: 32px; color: #cbd5e1; margin-bottom: 8px;"></i>
                <p style="margin: 0; font-size: 13px;">Chưa có lượt ghi nhận cộng hoặc trừ điểm nào trong tháng này.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Học viên đang giữ trọn vẹn 100 điểm xuất phát.</p>
              </div>
            ` : `
              <div style="max-height: 320px; overflow-y: auto;">
                ${logs.map(log => `
                  <div class="emu-log-item ${log.type}">
                    <div class="emu-log-details">
                      <div class="emu-log-reason">
                        <i class="${log.type === 'reward' ? 'fa-solid fa-star text-success' : 'fa-solid fa-triangle-exclamation text-danger'}"></i>
                        ${log.reason}
                      </div>
                      <div class="emu-log-meta">
                        <span><i class="fa-regular fa-clock"></i> ${log.dateDisplay || ''}</span>
                        <span><i class="fa-solid fa-user-pen"></i> ${log.recordedBy || 'GLV'}</span>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="emu-log-points ${log.type}">
                        ${log.delta > 0 ? '+' + log.delta : log.delta}đ
                      </span>
                      <button class="emu-log-del-btn" title="Hoàn tác / Xóa bản ghi này" 
                              onclick="window.onEmuDeleteLog('${student.id}', '${log.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
          <div class="emu-modal-footer">
            <button class="btn btn-primary" onclick="window.closeEmuModal()">Đóng Cửa Sổ</button>
          </div>
        </div>
      </div>
    `;
    };

    window.onEmuDeleteLog = function (studentId, logId) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này? Số điểm của học sinh sẽ được hoàn lại tự động.')) return;
      deleteLog(state.selectedClassId, state.selectedMonth, studentId, logId);
      if (typeof window.showToast === 'function') {
        window.showToast('✅ Đã hoàn tác và cập nhật lại điểm thi đua thành công!', 'info');
      }
      // Refresh modal and view
      window.onEmuOpenHistoryModal(studentId);
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
    };

    // --- 13. Detail Modal for Biblical Character ---
    window.showBiblicalDetailModal = function (studentId) {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const student = allStudents.find(s => String(s.id) === String(studentId));
      if (!student) return;

      const scoreData = getStudentMonthScore(currentClass.id, state.selectedMonth, student.id);
      const title = getBiblicalTitleForScore(scoreData.currentScore);

      const container = document.getElementById('emu-modal-container');
      if (!container) return;

      container.innerHTML = `
      <div class="emu-modal-backdrop" onclick="if(event.target===this) window.closeEmuModal()">
        <div class="emu-modal-dialog" style="max-width: 500px;">
          <div class="emu-modal-header gold">
            <h3 class="emu-modal-title">
              <i class="${title.icon}"></i> Danh Hiệu Thánh Kinh
            </h3>
            <button class="emu-modal-close" onclick="window.closeEmuModal()">&times;</button>
          </div>
          <div class="emu-modal-body" style="text-align: center; padding: 28px 24px;">
            <div style="font-size: 54px; color: ${title.color}; margin-bottom: 12px;">
              <i class="${title.icon}"></i>
            </div>
            <h3 style="font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 6px;">
              ${title.title}
            </h3>
            <div style="font-size: 13px; font-style: italic; color: #b45309; background: #fffbeb; padding: 8px 14px; border-radius: 10px; margin-bottom: 14px; border: 1px solid #fde68a;">
              <i class="fa-solid fa-quote-left"></i> ${title.verse} <i class="fa-solid fa-quote-right"></i>
            </div>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
              ${title.description}
            </p>
            <div style="background: #f8fafc; border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0; font-size: 13px;">
              Học viên <strong>${student.holyName ? student.holyName + ' ' : ''}${student.fullName || student.name}</strong> đạt mốc 
              <strong style="color: ${title.color};">${scoreData.currentScore} điểm</strong> trong ${formatMonthDisplay(state.selectedMonth)}.
            </div>
          </div>
          <div class="emu-modal-footer">
            <button class="btn btn-primary" onclick="window.closeEmuModal()">Đã Hiểu</button>
          </div>
        </div>
      </div>
    `;
    };

    // --- 14. Batch Award Modal (+10đ for multiple) ---
    window.onEmuBatchRewardModal = function () {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const classStudents = allStudents.filter(s => String(s.classId) === String(currentClass.id) || String(s.className) === String(currentClass.name));

      if (classStudents.length === 0) return;

      const container = document.getElementById('emu-modal-container');
      if (!container) return;

      container.innerHTML = `
      <div class="emu-modal-backdrop" onclick="if(event.target===this) window.closeEmuModal()">
        <div class="emu-modal-dialog" style="max-width: 620px;">
          <div class="emu-modal-header reward">
            <h3 class="emu-modal-title">
              <i class="fa-solid fa-sparkles"></i> Thưởng Điểm Hàng Loạt Cho Lớp
            </h3>
            <button class="emu-modal-close" onclick="window.closeEmuModal()">&times;</button>
          </div>
          <div class="emu-modal-body">
            <p style="font-size: 13px; color: #475569; margin-bottom: 12px;">
              Chọn các bạn hoặc toàn bộ lớp để cộng +10 điểm (ví dụ: Cả lớp thuộc kinh bài mới, dọn vệ sinh chung...):
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="font-size: 12px; font-weight: 700; color: #334155;">
                Danh sách học viên (${classStudents.length} bạn):
              </label>
              <button type="button" class="btn btn-sm btn-outline-secondary" onclick="window.toggleSelectAllEmuBatch(this)">
                Chọn Tất Cả Lớp
              </button>
            </div>

            <div style="max-height: 180px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; background: #f8fafc; margin-bottom: 14px;">
              ${classStudents.map(s => `
                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 4px 0; cursor: pointer;">
                  <input type="checkbox" class="emu-batch-student-cb" value="${s.id}" checked>
                  <span><strong>${s.holyName || ''}</strong> ${s.fullName || s.name}</span>
                </label>
              `).join('')}
            </div>

            <label style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px; display: block;">Lý do khen thưởng:</label>
            <input type="text" id="emu-batch-reason" class="form-control" 
                   value="Cả lớp thuộc kinh & bài giáo lý xuất sắc"
                   placeholder="Nhập lý do khen thưởng...">
          </div>
          <div class="emu-modal-footer">
            <button class="btn btn-outline-secondary" onclick="window.closeEmuModal()">Hủy Bỏ</button>
            <button class="btn btn-success" onclick="window.confirmEmuBatchAction()">
              <i class="fa-solid fa-check"></i> Xác Nhận Thưởng (+10đ/bạn)
            </button>
          </div>
        </div>
      </div>
    `;
    };

    window.toggleSelectAllEmuBatch = function (btn) {
      const cbs = document.querySelectorAll('.emu-batch-student-cb');
      const allChecked = Array.from(cbs).every(cb => cb.checked);
      cbs.forEach(cb => cb.checked = !allChecked);
      btn.textContent = allChecked ? 'Chọn Tất Cả' : 'Bỏ Chọn Tất Cả';
    };

    window.confirmEmuBatchAction = function () {
      const cbs = document.querySelectorAll('.emu-batch-student-cb:checked');
      const studentIds = Array.from(cbs).map(cb => cb.value);
      if (studentIds.length === 0) {
        alert('Vui lòng chọn ít nhất một học sinh.');
        return;
      }

      const reasonInput = document.getElementById('emu-batch-reason');
      const reason = (reasonInput && reasonInput.value.trim()) ? reasonInput.value.trim() : 'Khen thưởng tập thể lớp';

      studentIds.forEach(sid => {
        applyPoints(state.selectedClassId, state.selectedMonth, sid, 10, reason, 'Tập thể');
      });

      window.closeEmuModal();
      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Đã khen thưởng +10đ cho ${studentIds.length} học viên thành công!`, 'success');
      }
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
    };

    // --- 15. Quick Reset 100 Points Confirmation ---
    window.onEmuQuickResetMonth = function () {
      if (!confirm(`Bạn có chắc muốn làm mới lại Sổ Điểm của ${formatMonthDisplay(state.selectedMonth)} về đúng 100 điểm xuất phát cho tất cả các bạn trong lớp này?`)) {
        return;
      }
      const store = getEmulationStore();
      if (store[state.selectedClassId] && store[state.selectedClassId][state.selectedMonth]) {
        delete store[state.selectedClassId][state.selectedMonth];
        saveEmulationData(state.selectedClassId);
        if (typeof window.showToast === 'function') {
          window.showToast('✅ Đã làm mới mốc 100 điểm đầu tháng cho toàn bộ lớp học!', 'info');
        }
        const container = document.getElementById('content-area');
        renderClassEmulation(container, state.selectedClassId);
      }
    };

    // --- 16. Confetti & Celebration FX ---
    window.triggerHofConfetti = function () {
      EmuSound.playCathedralFanfare();
      if (typeof window.confetti === 'function') {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };
        function fire(particleRatio, opts) {
          window.confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          }));
        }
        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f59e0b', '#fbbf24', '#ffffff'] });
        fire(0.2, { spread: 60, colors: ['#1d4ed8', '#3b82f6', '#d97706'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#dc2626', '#10b981'] });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }
    };

    // --- 17. Printing & Export Features ---
    // In Bảng Vàng A4 Của Lớp
    window.printHonorsBoard = function () {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const classStudents = allStudents.filter(s => String(s.classId) === String(currentClass.id) || String(s.className) === String(currentClass.name));

      const parishInfo = (window.appData && window.appData.parishInfo) || { name: 'Giáo Xứ', diocese: 'Giáo Phận' };

      const ranks = classStudents.map(s => {
        const sc = getStudentMonthScore(currentClass.id, state.selectedMonth, s.id);
        return {
          student: s,
          scoreData: sc,
          biblicalTitle: getBiblicalTitleForScore(sc.currentScore)
        };
      }).sort((a, b) => b.scoreData.currentScore - a.scoreData.currentScore);

      ranks.forEach((item, idx) => item.rank = idx + 1);

      const printArea = document.getElementById('emu-print-area');
      if (!printArea) return;

      printArea.innerHTML = `
      <div class="emu-print-board">
        <div class="emu-certificate-frame">
          <div class="emu-cert-cross">✝</div>
          <div style="text-align: center; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #475569; font-weight: 700;">
            ${parishInfo.diocese || 'GIÁO PHẬN'} - ${parishInfo.name || 'GIÁO XỨ'}
          </div>
          <div class="emu-cert-header" style="font-size: 26px; margin-top: 6px;">
            BẢNG VÀNG TUYÊN DƯƠNG THÁNH KINH
          </div>
          <div class="emu-cert-sub">
            Thi Đua & Nhân Đức Giáo Lý - ${formatMonthDisplay(state.selectedMonth).toUpperCase()}
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-weight: 800; font-size: 16px; color: #1e3a8a;">Lớp Giáo Lý: ${currentClass.name}</span>
            <span style="margin: 0 10px; color: #cbd5e1;">|</span>
            <span style="font-size: 13px; color: #334155;">GLV Phụ trách: <strong>${currentClass.teacher || (window.currentUser ? window.currentUser.name : '')}</strong></span>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #d97706;">
                <th style="padding: 10px 8px; text-align: center; width: 45px;">Hạng</th>
                <th style="padding: 10px 8px; text-align: left;">Tên Thánh & Họ Tên Học Viên</th>
                <th style="padding: 10px 8px; text-align: center; width: 85px;">Điểm Thi Đua</th>
                <th style="padding: 10px 8px; text-align: left;">Danh Hiệu Thánh Kinh Được Tuyên Dương</th>
              </tr>
            </thead>
            <tbody>
              ${ranks.map(item => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 9px 8px; text-align: center; font-weight: 800; color: ${item.rank <= 3 ? '#b45309' : '#475569'};">
                    ${item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : item.rank}
                  </td>
                  <td style="padding: 9px 8px;">
                    <strong>${item.student.holyName || ''}</strong> ${item.student.fullName || item.student.name}
                  </td>
                  <td style="padding: 9px 8px; text-align: center; font-weight: 800; color: #1d4ed8;">
                    ${item.scoreData.currentScore}đ
                  </td>
                  <td style="padding: 9px 8px; font-weight: 700; color: #047857;">
                    ${item.biblicalTitle.title}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="emu-cert-signatures">
            <div class="emu-cert-sig-block">
              <div class="emu-cert-sig-title">GLV CHỦ NHIỆM LỚP</div>
              <div class="emu-cert-sig-name">${currentClass.teacher || (window.currentUser ? window.currentUser.name : '')}</div>
            </div>
            <div class="emu-cert-sig-block">
              <div style="font-size: 12px; font-style: italic; color: #64748b; margin-bottom: 4px;">Lập ngày ..... tháng ..... năm .....</div>
              <div class="emu-cert-sig-title">LINH MỤC TUYÊN ÚY / QUẢN XỨ</div>
              <div class="emu-cert-sig-name">${parishInfo.pastor || 'Linh mục Quản xứ'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

      setTimeout(() => {
        window.print();
      }, 200);
    };

    // In Phiếu Khen Cá Nhân
    window.printSingleCertificate = function (studentId) {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const student = allStudents.find(s => String(s.id) === String(studentId));
      if (!student) return;

      const scoreData = getStudentMonthScore(currentClass.id, state.selectedMonth, student.id);
      const title = getBiblicalTitleForScore(scoreData.currentScore);
      const parishInfo = (window.appData && window.appData.parishInfo) || { name: 'Giáo Xứ', diocese: 'Giáo Phận' };

      const printArea = document.getElementById('emu-print-area');
      if (!printArea) return;

      printArea.innerHTML = `
      <div class="emu-print-board">
        <div class="emu-certificate-frame" style="padding: 40px 30px;">
          <div class="emu-cert-cross">✝</div>
          <div style="text-align: center; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700;">
            ${parishInfo.diocese || 'GIÁO PHẬN'} - ${parishInfo.name || 'GIÁO XỨ'}
          </div>
          <div class="emu-cert-header" style="font-size: 28px; margin-top: 10px;">
            PHIẾU KHEN THÁNH THIỆN
          </div>
          <div class="emu-cert-sub">
            Tuyên Dương Gương Mẫu Thi Đua & Nhân Đức - ${formatMonthDisplay(state.selectedMonth).toUpperCase()}
          </div>

          <div style="text-align: center; margin: 18px 0; font-size: 14px; color: #475569;">
            Ban Giáo Lý & Thiếu Nhi Thánh Thể hân hoan tuyên dương:
          </div>

          <div class="emu-cert-name">
            ${student.holyName ? student.holyName + ' ' : ''}${student.fullName || student.name}
          </div>

          <div style="text-align: center; font-size: 14px; color: #334155; margin-bottom: 8px;">
            Học viên Lớp Giáo Lý: <strong>${currentClass.name}</strong>
          </div>

          <div class="emu-cert-title" style="font-size: 20px; margin: 16px 0;">
            <i class="${title.icon}"></i> ${title.title}
          </div>

          <div class="emu-cert-desc">
            "${title.verse}"<br>
            Đã hoàn thành xuất sắc tháng thi đua với tổng điểm <strong>${scoreData.currentScore} điểm</strong>, 
            chăm chỉ tham dự Thánh Lễ, thuộc bài giáo lý và sốt sắng sống đức tin.
          </div>

          <div class="emu-cert-signatures" style="margin-top: 50px;">
            <div class="emu-cert-sig-block">
              <div class="emu-cert-sig-title">GIÁO LÝ VIÊN CHỦ NHIỆM</div>
              <div class="emu-cert-sig-name">${currentClass.teacher || (window.currentUser ? window.currentUser.name : '')}</div>
            </div>
            <div class="emu-cert-sig-block">
              <div style="font-size: 11px; font-style: italic; color: #64748b; margin-bottom: 4px;">Giáo xứ, ngày ..... tháng ..... năm .....</div>
              <div class="emu-cert-sig-title">LINH MỤC TUYÊN ÚY / QUẢN XỨ</div>
              <div class="emu-cert-sig-name">${parishInfo.pastor || 'Linh mục Quản xứ'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

      setTimeout(() => {
        window.print();
      }, 200);
    };

    // In Phiếu Khen Toàn Bộ Lớp
    window.printAllCertificates = function () {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const classStudents = allStudents.filter(s => String(s.classId) === String(currentClass.id) || String(s.className) === String(currentClass.name));
      const parishInfo = (window.appData && window.appData.parishInfo) || { name: 'Giáo Xứ', diocese: 'Giáo Phận' };

      const printArea = document.getElementById('emu-print-area');
      if (!printArea) return;

      printArea.innerHTML = `
      <div class="emu-print-board">
        ${classStudents.map((student, idx) => {
        const scoreData = getStudentMonthScore(currentClass.id, state.selectedMonth, student.id);
        const title = getBiblicalTitleForScore(scoreData.currentScore);
        return `
            <div class="emu-certificate-frame" style="padding: 40px 30px; ${idx < classStudents.length - 1 ? 'page-break-after: always; margin-bottom: 40px;' : ''}">
              <div class="emu-cert-cross">✝</div>
              <div style="text-align: center; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700;">
                ${parishInfo.diocese || 'GIÁO PHẬN'} - ${parishInfo.name || 'GIÁO XỨ'}
              </div>
              <div class="emu-cert-header" style="font-size: 28px; margin-top: 10px;">
                PHIẾU KHEN THÁNH THIỆN
              </div>
              <div class="emu-cert-sub">
                Tuyên Dương Gương Mẫu Thi Đua & Nhân Đức - ${formatMonthDisplay(state.selectedMonth).toUpperCase()}
              </div>

              <div style="text-align: center; margin: 18px 0; font-size: 14px; color: #475569;">
                Ban Giáo Lý & Thiếu Nhi Thánh Thể hân hoan tuyên dương:
              </div>

              <div class="emu-cert-name">
                ${student.holyName ? student.holyName + ' ' : ''}${student.fullName || student.name}
              </div>

              <div style="text-align: center; font-size: 14px; color: #334155; margin-bottom: 8px;">
                Học viên Lớp Giáo Lý: <strong>${currentClass.name}</strong>
              </div>

              <div class="emu-cert-title" style="font-size: 20px; margin: 16px 0;">
                <i class="${title.icon}"></i> ${title.title}
              </div>

              <div class="emu-cert-desc">
                "${title.verse}"<br>
                Đã hoàn thành tốt tháng thi đua với tổng điểm <strong>${scoreData.currentScore} điểm</strong>, 
                siêng năng học Lời Chúa và sống chan hòa bác ái.
              </div>

              <div class="emu-cert-signatures" style="margin-top: 50px;">
                <div class="emu-cert-sig-block">
                  <div class="emu-cert-sig-title">GIÁO LÝ VIÊN CHỦ NHIỆM</div>
                  <div class="emu-cert-sig-name">${currentClass.teacher || (window.currentUser ? window.currentUser.name : '')}</div>
                </div>
                <div class="emu-cert-sig-block">
                  <div style="font-size: 11px; font-style: italic; color: #64748b; margin-bottom: 4px;">Giáo xứ, ngày ..... tháng ..... năm .....</div>
                  <div class="emu-cert-sig-title">LINH MỤC TUYÊN ÚY / QUẢN XỨ</div>
                  <div class="emu-cert-sig-name">${parishInfo.pastor || 'Linh mục Quản xứ'}</div>
                </div>
              </div>
            </div>
          `;
      }).join('')}
      </div>
    `;

      setTimeout(() => {
        window.print();
      }, 200);
    };

    // Sao Chép Báo Cáo Zalo Phụ Huynh
    window.copyZaloAnnouncement = function () {
      const classes = (typeof window.getMagnificatClasses === 'function') ? window.getMagnificatClasses() : (window.appData.classes || []);
      const currentClass = classes.find(c => String(c.id) === String(state.selectedClassId)) || classes[0];
      const allStudents = (typeof window.getMagnificatStudents === 'function') ? window.getMagnificatStudents() : (window.appData.students || []);
      const classStudents = allStudents.filter(s => String(s.classId) === String(currentClass.id) || String(s.className) === String(currentClass.name));

      const ranks = classStudents.map(s => {
        const sc = getStudentMonthScore(currentClass.id, state.selectedMonth, s.id);
        return {
          student: s,
          scoreData: sc,
          biblicalTitle: getBiblicalTitleForScore(sc.currentScore)
        };
      }).sort((a, b) => b.scoreData.currentScore - a.scoreData.currentScore);

      ranks.forEach((item, idx) => item.rank = idx + 1);

      const top5 = ranks.slice(0, 5);

      let msg = `✝️ BẢNG VÀNG TUYÊN DƯƠNG THI ĐUA - ${formatMonthDisplay(state.selectedMonth).toUpperCase()} ✝️\n`;
      msg += `📖 Lớp Giáo Lý: ${currentClass.name}\n`;
      msg += `----------------------------------------\n`;
      msg += `Kính thưa Quý Phụ Huynh, Ban GLV xin trân trọng thông báo kết quả thi đua & hoa thiêng nhân đức tháng này của các em:\n\n`;

      top5.forEach(item => {
        const medal = item.rank === 1 ? '🥇 QUÁN QUÂN' : item.rank === 2 ? '🥈 HẠNG NHÌ' : item.rank === 3 ? '🥉 HẠNG BA' : `⭐ HẠNG ${item.rank}`;
        msg += `${medal}: ${item.student.holyName ? item.student.holyName + ' ' : ''}${item.student.fullName || item.student.name} - ${item.scoreData.currentScore}đ\n`;
        msg += `  📜 Danh hiệu: "${item.biblicalTitle.title}"\n`;
      });

      msg += `\n✨ Xin chúc mừng các em và tri ân Quý Phụ Huynh đã luôn đồng hành cùng con em trong đời sống Đức Tin!\n`;
      msg += `🙏 GLV Chủ Nhiệm: ${currentClass.teacher || (window.currentUser ? window.currentUser.name : '')}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(() => {
          if (typeof window.showToast === 'function') {
            window.showToast('📋 Đã sao chép nội dung tuyên dương vào bộ nhớ đệm! Hãy dán vào Zalo nhóm phụ huynh nhé.', 'success');
          } else {
            alert('Đã sao chép nội dung báo cáo Zalo!');
          }
        });
      } else {
        prompt('Sao chép nội dung gửi Zalo:', msg);
      }
    };

    // --- 18. Global Event Handlers ---
    window.onEmuChangeClass = function (newClassId) {
      state.selectedClassId = newClassId;
      state.searchQuery = '';
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
    };

    window.onEmuChangeMonth = function (newMonth) {
      state.selectedMonth = newMonth;
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
    };

    window.onEmuSwitchTab = function (tabName) {
      state.activeTab = tabName;
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
      if (tabName === 'honors') {
        // Trigger fanfare sound when switching to Hall of Fame
        EmuSound.playCathedralFanfare();
      }
    };

    window.onEmuSearch = function (query) {
      state.searchQuery = query;
      const container = document.getElementById('content-area');
      renderClassEmulation(container, state.selectedClassId);
    };

    // Direct open helper for class cards
    window.openClassEmulation = function (classId) {
      state.selectedClassId = classId;
      state.activeTab = 'tracker';
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('emulation');
      } else {
        const container = document.getElementById('content-area');
        renderClassEmulation(container, classId);
      }
    };

    // Export module interface
    window.renderClassEmulation = renderClassEmulation;
    window.getStudentMonthScore = getStudentMonthScore;
    window.getBiblicalTitleForScore = getBiblicalTitleForScore;

  })();

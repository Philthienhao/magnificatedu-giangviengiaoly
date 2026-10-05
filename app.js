/* ==========================================================================
   MAGNIFICATEDU - CORE APPLICATION JAVASCRIPT
   Features: Multi-tenant Data Isolation, Google Auth Flow, Admin Dashboard,
             Class & Student Management, Quick Attendance, Gradebook,
             Certificate Print Engine, Notifications & Parish Settings.
   ========================================================================== */

(function () {
  'use strict';

  // Supabase Credentials & Fallback Initialization
  const SUPABASE_URL = 'https://hnuacgqxbjhezwjzsfpf.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWFjZ3F4YmpoZXp3anpzZnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDAzMjAsImV4cCI6MjEwNjc3NjMyMH0.4EV5Rv7LNTZvTQPpw4dHzu2ReFMSsETUryMqUcrSxJw';
  if (!window.supabaseClient && window.supabase) {
    try { window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     1. CONSTANTS & SYSTEM SEED DATA
     -------------------------------------------------------------------------- */
  const STORAGE_KEY_ACCOUNTS = 'magnificatedu_global_accounts_v1';
  const STORAGE_KEY_CURRENT_USER = 'magnificatedu_active_user_v1';
  const STORAGE_PREFIX_DATA = 'magnificatedu_user_data_';

  // System Slogan
  const SLOGAN_TEXT = "Không phải tất cả chúng ta đều làm được những điều vĩ đại, nhưng chúng ta có thể làm những điều nhỏ nhặt với tình yêu vĩ đại";
  const SLOGAN_AUTHOR = "Mẹ Têrêsa Calcutta";

  // Pre-configured Accounts (Single Default Admin Account as requested)
  const SEED_ACCOUNTS = [
    {
      id: 'acc_001',
      email: 'philthienhao@gmail.com',
      name: 'Võ Thiện Hảo',
      holyName: 'Philiphê',
      role: 'Admin', // Single Default Admin Account
      avatar: 'admin_avatar.png',
      status: 'active',
      createdDate: '2026-01-15',
      lastLogin: '2026-10-03 19:45',
      loginCount: 50
    }
  ];

  // Default User Data Seed Template (Empty arrays for initial clean setup)
  function generateDefaultUserData(userEmail) {
    return {
      parishInfo: {
        name: 'Giáo Xứ Hoà Khánh',
        diocese: 'Giáo phận Đà Nẵng',
        pastor: 'Lm. Giuse Nguyễn Văn Hoàng',
        phone: '0236 3842 112',
        address: '50 Nguyễn Lương Bằng, P. Hòa Khánh Bắc, Q. Liên Chiểu, Đà Nẵng',
        academicYear: '2026 - 2027',
        logoUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=150&auto=format&fit=crop&q=80'
      },
      classes: [],
      students: [],
      catechists: [],
      attendanceLogs: [],
      notifications: [],
      libraryMaterials: [],
      quizzes: []
    };
  }

  /* --------------------------------------------------------------------------
     2. GLOBAL UTILITIES & MODAL CONTROLLER
     -------------------------------------------------------------------------- */
  let pendingConfirmCallback = null;

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  window.showConfirmDialog = function(title, message, callback) {
    const titleEl = document.getElementById('uni-confirm-title');
    const msgEl = document.getElementById('uni-confirm-msg');
    const modalEl = document.getElementById('universal-confirm-modal');
    const uniBtn = document.getElementById('uni-confirm-btn');

    if (titleEl) titleEl.textContent = title || 'Xác Nhận Xóa';
    if (msgEl) msgEl.textContent = message || 'Bạn có chắc chắn muốn xóa bản ghi này khỏi hệ thống?';

    pendingConfirmCallback = callback;

    if (uniBtn) {
      uniBtn.onclick = function (e) {
        if (e) e.preventDefault();
        closeModal('universal-confirm-modal');
        if (typeof pendingConfirmCallback === 'function') {
          const cb = pendingConfirmCallback;
          pendingConfirmCallback = null;
          cb();
        }
      };
    }

    if (modalEl) {
      modalEl.style.display = 'flex';
    } else {
      if (window.confirm(`${title || 'Xác Nhận Xóa'}\n\n${message || ''}`)) {
        if (typeof callback === 'function') callback();
      }
    }
  };
  const showConfirmDialog = window.showConfirmDialog;
  window.openModal = openModal;
  window.closeModal = closeModal;

  /* --------------------------------------------------------------------------
     3. GLOBAL STATE APP CONTROLLER
     -------------------------------------------------------------------------- */
  let accountsList = [];
  let currentUser = null;
  let appData = null;
  let activePage = 'overview';

  // Initialize App
  function initApp() {
    loadAccounts();
    loadCurrentUser();
    bindGlobalEvents();
    renderAppHeaderAndSidebar();

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      navigateTo(initialHash);
    } else {
      navigateTo(activePage);
    }
  }

  // Load registered accounts & clean obsolete demo accounts
  function loadAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (stored) {
      try {
        let loaded = JSON.parse(stored);
        // Remove obsolete demo seed accounts if present
        loaded = loaded.filter(a => a.email.toLowerCase() !== 'vothienhao.catechist@gmail.com' && a.email.toLowerCase() !== 'mariahuyen.glv@gmail.com');
        
        // Ensure admin account philthienhao@gmail.com is present with Admin role & updated info
        const adminMatch = loaded.find(a => a.email.toLowerCase() === 'philthienhao@gmail.com');
        if (!adminMatch) {
          loaded.unshift(SEED_ACCOUNTS[0]);
        } else {
          adminMatch.holyName = adminMatch.holyName || 'Philiphê';
          adminMatch.name = adminMatch.name || 'Võ Thiện Hảo';
          adminMatch.role = 'Admin';
          adminMatch.avatar = adminMatch.avatar || 'admin_avatar.png';
          adminMatch.status = 'active';
        }

        accountsList = loaded;
      } catch (e) {
        accountsList = SEED_ACCOUNTS;
      }
    } else {
      accountsList = SEED_ACCOUNTS;
    }
    saveAccounts();
  }

  function saveAccounts() {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accountsList));
  }

  // Load current logged in user & isolate user data
  function loadCurrentUser() {
    const storedUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (storedUser) {
      try {
        let u = JSON.parse(storedUser);
        // If current user is set to an obsolete account, switch to default Admin account
        if (u.email.toLowerCase() === 'vothienhao.catechist@gmail.com' || u.email.toLowerCase() === 'mariahuyen.glv@gmail.com') {
          currentUser = accountsList.find(a => a.email.toLowerCase() === 'philthienhao@gmail.com') || SEED_ACCOUNTS[0];
        } else {
          currentUser = accountsList.find(a => a.email.toLowerCase() === u.email.toLowerCase()) || u;
        }
      } catch (e) {
        currentUser = accountsList.find(a => a.email.toLowerCase() === 'philthienhao@gmail.com') || SEED_ACCOUNTS[0];
      }
    } else {
      currentUser = accountsList.find(a => a.email.toLowerCase() === 'philthienhao@gmail.com') || SEED_ACCOUNTS[0]; // Default Admin user
    }

    // Ensure current admin user properties are Philiphê Võ Thiện Hảo with Admin role & preserve custom avatar
    if (!currentUser || currentUser.email.toLowerCase() === 'philthienhao@gmail.com') {
      const adminAcc = accountsList.find(a => a.email.toLowerCase() === 'philthienhao@gmail.com');
      currentUser = adminAcc || currentUser || SEED_ACCOUNTS[0];
      currentUser.holyName = currentUser.holyName || 'Philiphê';
      currentUser.name = currentUser.name || 'Võ Thiện Hảo';
      currentUser.role = 'Admin';
      currentUser.avatar = currentUser.avatar || 'admin_avatar.png';
    }

    saveCurrentUser();

    // Verify if account is suspended
    const match = accountsList.find(a => a.email.toLowerCase() === currentUser.email.toLowerCase());
    if (match) {
      if (match.status === 'suspended') {
        alert('Tài khoản của bạn hiện đang bị TẠM KHÓA bởi Quản trị viên hệ thống.');
        const activeAcc = accountsList.find(a => a.status === 'active');
        if (activeAcc) {
          currentUser = activeAcc;
          saveCurrentUser();
        }
      } else {
        currentUser = match;
      }
    }

    // Load isolated data for this user email
    loadUserData(currentUser.email);
  }

  function saveCurrentUser() {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
  }

  function loadUserData(email) {
    const key = STORAGE_PREFIX_DATA + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try { appData = JSON.parse(storedData); } catch (e) { appData = generateDefaultUserData(email); }
    } else {
      appData = generateDefaultUserData(email);
    }

    if (!appData) appData = generateDefaultUserData(email);
    if (!Array.isArray(appData.classes)) appData.classes = [];
    if (!Array.isArray(appData.students)) appData.students = [];
    if (!Array.isArray(appData.catechists)) appData.catechists = [];
    if (!Array.isArray(appData.attendanceLogs)) appData.attendanceLogs = [];
    if (!Array.isArray(appData.notifications)) appData.notifications = [];
    if (!Array.isArray(appData.libraryMaterials)) appData.libraryMaterials = [];
    if (!Array.isArray(appData.quizzes)) appData.quizzes = [];
    if (!appData.parishInfo) appData.parishInfo = generateDefaultUserData(email).parishInfo;

    // Filter out legacy default seed class ("Lớp 9/1" / "LLop 9/1") so accounts start clean with user-created classes
    if (Array.isArray(appData.classes)) {
      appData.classes = appData.classes.filter(c => c && c.name !== 'Lớp 9/1' && c.name !== 'LLop 9/1');
    }

    // Sanitize any legacy hardcoded 8.5 grades in loaded students
    if (Array.isArray(appData.students)) {
      appData.students.forEach(s => {
        if (s && s.grades && (s.grades.oral15 === 8.5 || s.grades.midterm === 8.5 || s.grades.finalExam === 8.5)) {
          s.grades.semester1 = calculateStudentGrade(0, 0, 0, 0);
          s.grades.semester2 = calculateStudentGrade(0, 0, 0, 0);
          delete s.grades.oral15;
          delete s.grades.oral;
          delete s.grades.min15;
          delete s.grades.midterm;
          delete s.grades.finalExam;
          delete s.grades.average;
          delete s.grades.rank;
        }
      });
    }

    saveUserData();

    // Async sync from Supabase Cloud if available
    if (window.supabaseClient && email) {
      window.supabaseClient
        .from('user_data')
        .select('data, account_info')
        .eq('email', email.toLowerCase())
        .maybeSingle()
        .then(({ data, error }) => {
          if (data) {
            if (data.data) {
              appData = data.data;
              localStorage.setItem(key, JSON.stringify(appData));
            }
            if (data.account_info && data.account_info.avatar && currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
              currentUser.avatar = data.account_info.avatar;
              currentUser.holyName = data.account_info.holyName || currentUser.holyName;
              currentUser.name = data.account_info.name || currentUser.name;
              const match = accountsList.find(a => a.email.toLowerCase() === currentUser.email.toLowerCase());
              if (match) {
                match.avatar = currentUser.avatar;
                match.holyName = currentUser.holyName;
                match.name = currentUser.name;
              }
              saveAccounts();
              saveCurrentUser();
              renderAppHeaderAndSidebar();
            }
            if (typeof renderCurrentView === 'function') renderCurrentView();
          }
        })
        .catch(err => console.log('Supabase cloud load notice:', err));
    }
  }

  function saveUserData() {
    if (!currentUser || !appData) return;
    const key = STORAGE_PREFIX_DATA + currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    localStorage.setItem(key, JSON.stringify(appData));

    // Supabase Cloud Data Persistence Sync
    if (window.supabaseClient && currentUser.email) {
      try {
        window.supabaseClient.from('user_data').upsert({
          email: currentUser.email.toLowerCase(),
          data: appData,
          account_info: {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            holyName: currentUser.holyName,
            role: currentUser.role,
            avatar: currentUser.avatar,
            phone: currentUser.phone,
            status: currentUser.status,
            lastLogin: currentUser.lastLogin,
            loginCount: currentUser.loginCount
          },
          updated_at: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.warn('Supabase sync notice:', error.message);
        });
      } catch (e) {}
    }
  }

  /* --------------------------------------------------------------------------
     3. EVENT BINDING & ROUTING
     -------------------------------------------------------------------------- */
  function bindGlobalEvents() {
    // Sidebar toggle
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.replace('#', '') || 'overview';
      if (page !== activePage) {
        navigateTo(page);
      }
    });

    // Global Delegated Nav Item Click Navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) navigateTo(page);
      }
    });

    // Dropdown Group Triggers in Sidebar
    document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const group = trigger.closest('.nav-group');
        group.classList.toggle('open');
      });
    });

    // User Profile Dropdown Toggle
    const userTrigger = document.getElementById('user-profile-trigger');
    const userMenu = document.getElementById('user-dropdown-menu');
    if (userTrigger && userMenu) {
      userTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        userMenu.classList.remove('show');
      });
    }

    // Account Switcher Button
    const switchBtn = document.getElementById('switch-account-btn');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        openGoogleAuthModal();
      });
    }

    // Universal Confirm Modal Handler
    const uniBtn = document.getElementById('uni-confirm-btn');
    if (uniBtn) {
      uniBtn.onclick = function (e) {
        if (e) e.preventDefault();
        if (typeof pendingConfirmCallback === 'function') {
          const cb = pendingConfirmCallback;
          pendingConfirmCallback = null;
          closeModal('universal-confirm-modal');
          cb();
        } else {
          closeModal('universal-confirm-modal');
        }
      };
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        openGoogleAuthModal();
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        if (modalId) closeModal(modalId);
      });
    });

    // Toggle Custom Google Login Form
    const toggleCustomBtn = document.getElementById('toggle-custom-google-btn');
    const customForm = document.getElementById('custom-google-form');
    if (toggleCustomBtn && customForm) {
      toggleCustomBtn.addEventListener('click', () => {
        const isHidden = customForm.style.display === 'none';
        customForm.style.display = isHidden ? 'block' : 'none';
      });
    }

    // Custom Google Login Form Submit
    const customGoogleForm = document.getElementById('custom-google-form');
    if (customGoogleForm) {
      customGoogleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('custom-email').value.trim();
        const fullname = document.getElementById('custom-fullname').value.trim();
        const holyname = document.getElementById('custom-holyname').value.trim();

        if (email && fullname) {
          loginWithAccount({
            id: 'acc_' + Date.now(),
            email: email,
            name: fullname,
            holyName: holyname || 'T. Giuse',
            role: accountsList.length === 0 ? 'Admin' : 'Giáo lý viên',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            status: 'active',
            createdDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toLocaleString(),
            loginCount: 1
          });
          closeModal('google-auth-modal');
        }
      });
    }

    // Student Form Submit
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => {
        if (typeof handleSaveStudent === 'function') handleSaveStudent(e);
      });
    }

    // Class Form Submit
    const classForm = document.getElementById('class-form');
    if (classForm) {
      classForm.addEventListener('submit', (e) => {
        if (typeof handleSaveClass === 'function') handleSaveClass(e);
      });
    }

    // Admin User Edit Form Submit
    const adminUserForm = document.getElementById('admin-user-form');
    if (adminUserForm) {
      adminUserForm.addEventListener('submit', (e) => {
        if (typeof handleSaveAdminUser === 'function') handleSaveAdminUser(e);
      });
    }

    // Delete User Button in Admin Modal
    const adminDeleteUserBtn = document.getElementById('admin-delete-user-btn');
    if (adminDeleteUserBtn) {
      adminDeleteUserBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = document.getElementById('admin-target-id')?.value;
        if (targetId && typeof window.confirmDeleteAccount === 'function') {
          window.confirmDeleteAccount(targetId);
        }
      });
    }

    // Tab buttons inside Modals
    document.querySelectorAll('.tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.getAttribute('data-tab');
        const parent = tabBtn.closest('.modal-content');
        if (parent && targetTab) {
          parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
          tabBtn.classList.add('active');
          const pane = parent.querySelector('#' + targetTab);
          if (pane) pane.classList.add('active');
        }
      });
    });

    // Print Certificate Button
    const printCertBtn = document.getElementById('print-cert-btn');
    if (printCertBtn) {
      printCertBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Custom Modal Delete Confirm Action Button
    const confirmDeleteBtn = document.getElementById('confirm-do-delete-btn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        if (pendingDeleteAccId) {
          deleteAccountById(pendingDeleteAccId);
          pendingDeleteAccId = null;
        }
      });
    }

    // Bind User Profile & Avatar Edit Events
    bindUserProfileEvents();
  }

  // Navigation controller
  function navigateTo(pageId) {
    if (!pageId) pageId = 'overview';
    pageId = pageId.toString().replace(/^[#\/]+/, '').trim();
    if (!pageId) pageId = 'overview';

    activePage = pageId;
    if (window.location.hash !== '#' + pageId) {
      history.pushState(null, '', '#' + pageId);
    }

    // Update nav active states
    document.querySelectorAll('.nav-item, .nav-sub-item').forEach(el => {
      el.classList.remove('active');
    });

    const activeEl = document.querySelector(`[data-page="${pageId}"]`);
    if (activeEl) {
      activeEl.classList.add('active');
      const group = activeEl.closest('.nav-group');
      if (group) group.classList.add('open');
    }

    // Render corresponding page view
    const container = document.getElementById('content-area');
    if (!container) return;

    try {
      switch (pageId) {
        case 'profile':
          window.openUserProfileModal();
          break;
        case 'overview':
          renderOverview(container);
          break;
        case 'classes':
          renderClasses(container);
          break;
        case 'students':
          renderStudents(container);
          break;
        case 'catechists':
          renderCatechists(container);
          break;
        case 'attendance':
          renderAttendance(container);
          break;
        case 'gradebook':
          renderGradebook(container);
          break;
        case 'conduct':
          renderConduct(container);
          break;
        case 'library':
          renderLibrary(container);
          break;
        case 'quizzes':
          renderQuizzes(container);
          break;
        case 'certificates':
          renderCertificates(container);
          break;
        case 'reports':
          renderReports(container);
          break;
        case 'notifications':
          renderNotifications(container);
          break;
        case 'settings':
          renderSettings(container);
          break;
        case 'admin-users':
          if (currentUser.role === 'Admin') {
            renderAdminUsers(container);
          } else {
            showToast('Bạn không có quyền truy cập trang Admin!', 'danger');
            navigateTo('overview');
          }
          break;
        default:
          renderOverview(container);
      }
    } catch (err) {
      console.error('Error rendering page ' + pageId + ':', err);
    }
  }

  /* --------------------------------------------------------------------------
     4. HEADER & USER INTERFACE RENDERERS
     -------------------------------------------------------------------------- */
  function renderAppHeaderAndSidebar() {
    if (!currentUser) return;

    // Topbar User Info
    const topAvatar = document.getElementById('topbar-user-avatar');
    const topName = document.getElementById('topbar-user-name');
    const topTag = document.getElementById('topbar-user-tag');
    const dropEmail = document.getElementById('dropdown-user-email');
    const dropRoleTag = document.getElementById('dropdown-user-role-tag');

    if (topAvatar) topAvatar.src = currentUser.avatar;
    if (topName) topName.textContent = (currentUser.holyName ? currentUser.holyName + ' ' : '') + currentUser.name;
    if (topTag) topTag.innerHTML = currentUser.role === 'Admin' ? '<i class="fa-solid fa-shield-halved"></i> Admin' : '<i class="fa-solid fa-user"></i> Giáo lý viên';
    if (dropEmail) dropEmail.textContent = currentUser.email;
    if (dropRoleTag) {
      dropRoleTag.textContent = currentUser.role === 'Admin' ? 'Tài Khoản Admin' : 'Tài Khoản Giáo Lý Viên';
      dropRoleTag.className = 'role-badge ' + (currentUser.role === 'Admin' ? 'role-admin' : 'role-catechist');
    }

    // Sidebar User Info
    const sideAvatar = document.getElementById('sidebar-user-avatar');
    const sideHoly = document.getElementById('sidebar-user-holyname');
    const sideFull = document.getElementById('sidebar-user-fullname');
    const sideRole = document.getElementById('sidebar-user-role');

    if (sideAvatar) sideAvatar.src = currentUser.avatar;
    if (sideHoly) sideHoly.textContent = currentUser.holyName || 'T. Giuse';
    if (sideFull) sideFull.textContent = currentUser.name;
    if (sideRole) {
      if (currentUser.role === 'Admin' || currentUser.email.toLowerCase() === 'philthienhao@gmail.com') {
        sideRole.innerHTML = '<i class="fa-solid fa-crown text-warning"></i> Admin / Quản Trị Viên';
        sideRole.className = 'user-role-badge text-warning';
      } else {
        sideRole.textContent = currentUser.role || 'Giáo lý viên';
        sideRole.className = 'user-role-badge';
      }
    }

    // Parish Info & Custom Parish Logo Image
    const parishBranding = document.querySelector('.parish-branding');
    if (parishBranding && appData.parishInfo) {
      const existingIcon = parishBranding.querySelector('.parish-icon, .parish-logo-img');
      if (appData.parishInfo.logoUrl) {
        if (existingIcon) {
          existingIcon.outerHTML = `<img src="${appData.parishInfo.logoUrl}" alt="Parish Logo" class="parish-logo-img">`;
        }
      } else {
        if (existingIcon) {
          existingIcon.outerHTML = `<i class="fa-solid fa-church parish-icon"></i>`;
        }
      }
    }

    const topParishName = document.getElementById('topbar-parish-name');
    const topParishSub = document.getElementById('topbar-parish-sub');
    if (topParishName && appData.parishInfo) topParishName.textContent = appData.parishInfo.name;
    if (topParishSub && appData.parishInfo) topParishSub.textContent = `${appData.parishInfo.diocese} • Niên học ${appData.parishInfo.academicYear || '2026 - 2027'}`;

    // Admin Menu Section Toggle
    const adminBlock = document.getElementById('admin-menu-section');
    if (adminBlock) {
      adminBlock.style.display = (currentUser.role === 'Admin') ? 'block' : 'none';
    }

    // Dynamic Notification Count Badge Update
    const unreadBadge = document.getElementById('unread-count-badge');
    if (unreadBadge) {
      const count = appData && Array.isArray(appData.notifications) ? appData.notifications.length : 0;
      if (count > 0) {
        unreadBadge.textContent = count;
        unreadBadge.style.display = 'inline-block';
      } else {
        unreadBadge.textContent = '0';
        unreadBadge.style.display = 'none';
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. PAGE RENDERING LOGIC
     -------------------------------------------------------------------------- */

  // PAGE 1: TỔNG QUAN (DASHBOARD)
  function renderOverview(container) {
    const totalClasses = appData.classes.length;
    const totalStudents = appData.students.length;
    const totalCatechists = appData.catechists.length;

    container.innerHTML = `
      <div class="welcome-slogan-card">
        <div class="slogan-content">
          <h2>Chào mừng quay trở lại, ${currentUser.holyName ? currentUser.holyName + ' ' : ''}${currentUser.name}! ✨</h2>
          <div class="slogan-quote">
            "${SLOGAN_TEXT}"
          </div>
          <span class="slogan-author-banner">— ${SLOGAN_AUTHOR} —</span>
        </div>
        <i class="fa-solid fa-cross slogan-badge-icon"></i>
      </div>

      <!-- KPI METRICS GRID -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon kpi-blue"><i class="fa-solid fa-layer-group"></i></div>
          <div class="kpi-info">
            <h4>Lớp Học Giáo Lý</h4>
            <div class="kpi-number">${totalClasses}</div>
            <span class="kpi-sub"><i class="fa-solid fa-check"></i> Đang hoạt động</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-green"><i class="fa-solid fa-user-graduate"></i></div>
          <div class="kpi-info">
            <h4>Tổng Số Học Viên</h4>
            <div class="kpi-number">${totalStudents}</div>
            <span class="kpi-sub"><i class="fa-solid fa-arrow-up"></i> Niên học 2025-2026</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-amber"><i class="fa-solid fa-chalkboard-user"></i></div>
          <div class="kpi-info">
            <h4>Giáo Lý Viên</h4>
            <div class="kpi-number">${totalCatechists}</div>
            <span class="kpi-sub"><i class="fa-solid fa-heart"></i> Đội ngũ phục vụ</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-purple"><i class="fa-solid fa-chart-line"></i></div>
          <div class="kpi-info">
            <h4>Tỷ Lệ Chuyên Cần</h4>
            <div class="kpi-number">96.8%</div>
            <span class="kpi-sub"><i class="fa-solid fa-star"></i> Xếp loại Tốt</span>
          </div>
        </div>
      </div>

      <!-- MAIN DASHBOARD CONTENT -->
      <div class="dashboard-grid">
        <div class="left-col">
          <!-- Attendance Quick Summary Widget -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-clipboard-user"></i> Tình Hình Điểm Danh Hôm Nay</h3>
              <button class="btn btn-sm btn-primary" onclick="window.appNavigate('attendance')">Điểm danh ngay</button>
            </div>
            <div class="card-body">
              <div class="attendance-summary-grid">
                <div class="att-status-box att-present">
                  <div class="num">78</div>
                  <div class="lbl">🟢 Có Mặt</div>
                </div>
                <div class="att-status-box att-late">
                  <div class="num">3</div>
                  <div class="lbl">🟡 Đi Trễ</div>
                </div>
                <div class="att-status-box att-excused">
                  <div class="num">2</div>
                  <div class="lbl">🔵 Vắng Có Phép</div>
                </div>
                <div class="att-status-box att-unexcused">
                  <div class="num">1</div>
                  <div class="lbl">🔴 Vắng Không Phép</div>
                </div>
              </div>

              <!-- Weekly Timetable -->
              <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--dark-navy);">
                <i class="fa-solid fa-calendar-days text-primary"></i> Lịch Học Trong Tuần
              </h4>
              <div class="schedule-grid">
                <div class="schedule-day-card">
                  <div class="day-name">Chúa Nhật (Sáng)</div>
                  <div class="class-pill-mini">Khai Tâm 1 (08:00)</div>
                  <div class="class-pill-mini">Ấu Nhi 2A (08:00)</div>
                  <div class="class-pill-mini">Thiếu Nhi 2B (08:00)</div>
                </div>
                <div class="schedule-day-card">
                  <div class="day-name">Chúa Nhật (Chiều)</div>
                  <div class="class-pill-mini">Nghĩa Sĩ 1 (09:30)</div>
                  <div class="class-pill-mini">Hiệp Sĩ 1 (09:30)</div>
                </div>
                <div class="schedule-day-card">
                  <div class="day-name">Thứ Bảy</div>
                  <div class="class-pill-mini">Tập Hát & Nghi Thức (15:00)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Academic Performance Chart Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-chart-pie"></i> Phân Bố Học Lực Giáo Lý</h3>
            </div>
            <div class="card-body">
              <canvas id="overviewChart" style="max-height: 240px;"></canvas>
            </div>
          </div>
        </div>

        <div class="right-col">
          <!-- Recent Notifications -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-bell"></i> Thông Báo Mới</h3>
            </div>
            <div class="card-body" style="padding: 12px 20px;">
              <div class="notification-list">
                ${(appData.notifications || []).length === 0 ? `
                  <p style="color: var(--slate-muted); font-size: 13px; text-align: center; padding: 16px 0;">Chưa có thông báo mới.</p>
                ` : (appData.notifications || []).map(n => `
                  <div style="padding: 10px 0; border-bottom: 1px solid var(--slate-border);">
                    <span class="badge badge-primary" style="margin-bottom: 4px;">${n.category}</span>
                    <h5 style="font-size: 13px; font-weight: 700; color: var(--slate-dark);">${n.title}</h5>
                    <p style="font-size: 11.5px; color: var(--slate-muted); margin-top: 2px;">${n.content}</p>
                    <small style="font-size: 10px; color: #94a3b8;"><i class="fa-regular fa-clock"></i> ${n.date}</small>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-bolt"></i> Thao Tác Nhanh</h3>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn btn-outline-primary btn-block" onclick="window.openAddStudentModal()"><i class="fa-solid fa-user-plus"></i> Thêm Học Viên Mới</button>
              <button class="btn btn-outline-primary btn-block" onclick="window.openAddClassModal()"><i class="fa-solid fa-folder-plus"></i> Tạo Lớp Học Mới</button>
              <button class="btn btn-outline-primary btn-block" onclick="window.appNavigate('certificates')"><i class="fa-solid fa-certificate"></i> In Chứng Nhận Giáo Lý</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Chart.js
    setTimeout(() => {
      const ctx = document.getElementById('overviewChart');
      if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình'],
            datasets: [{
              data: [45, 30, 20, 5],
              backgroundColor: ['#10b981', '#2563eb', '#f59e0b', '#ef4444']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right' }
            }
          }
        });
      }
    }, 100);
  }

  // Helper: Multi-tenant Global Data Aggregation for Admin
  function getParishGlobalData() {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX_DATA));
    let aggregatedClasses = [];
    let aggregatedStudents = [];
    let aggregatedCatechists = [];
    
    allKeys.forEach(k => {
      try {
        const data = JSON.parse(localStorage.getItem(k));
        if (data) {
          if (Array.isArray(data.classes)) aggregatedClasses = aggregatedClasses.concat(data.classes);
          if (Array.isArray(data.students)) aggregatedStudents = aggregatedStudents.concat(data.students);
          if (Array.isArray(data.catechists)) aggregatedCatechists = aggregatedCatechists.concat(data.catechists);
        }
      } catch (e) {}
    });

    if (appData) {
      if (Array.isArray(appData.classes)) aggregatedClasses = aggregatedClasses.concat(appData.classes);
      if (Array.isArray(appData.students)) aggregatedStudents = aggregatedStudents.concat(appData.students);
      if (Array.isArray(appData.catechists)) aggregatedCatechists = aggregatedCatechists.concat(appData.catechists);
    }

    const uniqueClasses = Array.from(new Map(aggregatedClasses.map(item => [item.id, item])).values());
    const uniqueStudents = Array.from(new Map(aggregatedStudents.map(item => [item.id, item])).values());
    const uniqueCatechists = Array.from(new Map(aggregatedCatechists.map(item => [item.id, item])).values());

    return {
      classes: uniqueClasses,
      students: uniqueStudents,
      catechists: uniqueCatechists
    };
  }

  // PAGE 2: QUẢN LÝ LỚP HỌC (CLASSES)
  function renderClasses(container) {
    const classes = appData.classes || [];
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-layer-group"></i> Quản Lý Lớp Học Giáo Lý</h2>
          <p class="page-subtitle">Danh sách tất cả các lớp học giáo lý trong Giáo xứ (${classes.length} lớp)</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-outline-primary" onclick="window.downloadCSVTemplate()"><i class="fa-solid fa-file-excel"></i> Tải Mẫu CSV/Excel</button>
          <button class="btn btn-success" onclick="window.openCSVImportModal()"><i class="fa-solid fa-file-import"></i> Tải Danh Sách Up (CSV/Excel)</button>
          <button class="btn btn-primary" onclick="window.openAddClassModal()"><i class="fa-solid fa-plus"></i> Tạo Lớp Học Mới</button>
        </div>
      </div>

      ${classes.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 24px;">
          <div style="font-size: 48px; color: var(--slate-border); margin-bottom: 12px;"><i class="fa-solid fa-folder-open"></i></div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--dark-navy); margin-bottom: 6px;">Chưa Có Lớp Học Nào Trong Hệ Thống</h3>
          <p style="font-size: 13px; color: var(--slate-muted); max-width: 500px; margin: 0 auto 20px auto;">Bạn có thể bắt đầu tạo lớp học mới thủ công hoặc sử dụng tính năng <strong>Tải Danh Sách Up (CSV/Excel)</strong> để nhập toàn bộ danh sách lớp học và học viên cùng lúc!</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <button class="btn btn-outline-primary" onclick="window.downloadCSVTemplate()"><i class="fa-solid fa-download"></i> Tải File Mẫu Formatted</button>
            <button class="btn btn-success" onclick="window.openCSVImportModal()"><i class="fa-solid fa-cloud-arrow-up"></i> Tải File Up Ngay</button>
            <button class="btn btn-primary" onclick="window.openAddClassModal()"><i class="fa-solid fa-plus"></i> Tạo Lớp Mới Thủ Công</button>
          </div>
        </div>
      ` : `
        <div class="kpi-grid">
          ${classes.map(c => {
            const cid = c.id || c.name || '';
            const safeId = encodeURIComponent(cid);
            const safeName = (c.name || '').replace(/'/g, "\\'");
            return `
            <div class="card" style="margin-bottom: 0;">
              <div class="card-header" style="background: var(--primary-light); display: flex; justify-content: space-between; align-items: center;">
                <h4 style="font-size: 16px; font-weight: 800; color: var(--primary); margin: 0;"><i class="fa-solid fa-book-bookmark"></i> ${c.name}</h4>
                <span class="badge badge-primary">${c.grade}</span>
              </div>
              <div class="card-body">
                <p style="font-size: 13px; margin-bottom: 6px;"><strong>Phòng học:</strong> ${c.room || 'Chưa xếp'}</p>
                <p style="font-size: 13px; margin-bottom: 6px;"><strong>Lịch học:</strong> ${c.schedule || 'Chúa Nhật'}</p>
                <p style="font-size: 13px; margin-bottom: 12px;"><strong>GLV Phụ trách:</strong> ${c.teacher || currentUser.name}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-border); padding-top: 12px;">
                  <span style="font-weight: 700; color: var(--slate-dark);"><i class="fa-solid fa-users text-primary"></i> ${c.studentCount || (appData.students.filter(s => s.classId === c.id || s.className === c.name).length)} Học viên</span>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-sm btn-outline-primary" onclick="window.editClass('${safeId}')"><i class="fa-solid fa-pen"></i> Sửa</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-class" data-class-id="${safeId}" onclick="window.deleteClass('${safeId}')"><i class="fa-solid fa-trash"></i> Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      `}
    `;
  }

  // PAGE 3: QUẢN LÝ HỌC VIÊN (STUDENTS)
  function renderStudents(container) {
    const students = appData.students || [];
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-user-graduate"></i> Danh Sách Học Viên Giáo Lý</h2>
          <p class="page-subtitle">Quản lý sơ yếu lý lịch, hình ảnh vĩnh viễn, bí tích và kết quả học tập (${students.length} học viên)</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-outline-primary" onclick="window.downloadCSVTemplate()"><i class="fa-solid fa-file-excel"></i> Tải Mẫu CSV</button>
          <button class="btn btn-success" onclick="window.openCSVImportModal()"><i class="fa-solid fa-file-import"></i> Tải File Up (CSV/Excel)</button>
          <button class="btn btn-primary" onclick="window.openAddStudentModal()"><i class="fa-solid fa-user-plus"></i> Thêm Học Viên Mới</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-filter"></i> Bộ Lọc Tìm Kiếm</h3>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="col-4">
              <input type="text" id="std-search-input" class="form-control" placeholder="Tìm tên học viên, mã HV, giáo khóm, SĐT..." onkeyup="window.filterStudentTable()">
            </div>
            <div class="col-4">
              <select id="std-filter-class" class="form-control" onchange="window.filterStudentTable()">
                <option value="">-- Tất cả Lớp Học --</option>
                ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="col-4">
              <select id="std-filter-gender" class="form-control" onchange="window.filterStudentTable()">
                <option value="">-- Tất cả Giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding: 0;">
          ${students.length === 0 ? `
            <div style="text-align: center; padding: 40px 20px;">
              <i class="fa-solid fa-user-xmark" style="font-size: 40px; color: var(--slate-border); margin-bottom: 10px;"></i>
              <p style="font-size: 14px; font-weight: 700; color: var(--slate-dark);">Chưa Có Học Viên Nào Trong Hệ Thống</p>
              <p style="font-size: 12px; color: var(--slate-muted);">Bấm 'Tải File Up (CSV/Excel)' để tải danh sách lớp nhanh chóng hoặc bấm 'Thêm Học Viên Mới'</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Mã HV</th>
                    <th>Tên Thánh & Họ Tên</th>
                    <th>Giới tính</th>
                    <th>Lớp Học</th>
                    <th>Giáo Khóm</th>
                    <th>Phụ Huynh & SĐT</th>
                    <th>Bí Tích</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody id="student-table-body">
                  ${students.map(s => {
                    const cls = appData.classes.find(c => c.id === s.classId);
                    const defaultAvatar = s.gender === 'Nữ' 
                      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';
                    return `
                      <tr>
                        <td>
                          <img src="${s.photo || defaultAvatar}" alt="Student Photo" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--primary);">
                        </td>
                        <td><strong style="color: var(--primary);">${s.code}</strong></td>
                        <td>
                          <strong>${s.holyName}</strong> ${s.fullName}
                        </td>
                        <td>${s.gender === 'Nam' ? '🔵 Nam' : '🔴 Nữ'}</td>
                        <td><span class="badge badge-primary">${cls ? cls.name : 'Chưa phân lớp'}</span></td>
                        <td><small style="color: var(--slate-dark); font-weight: 600;">${s.subParish || '---'}</small></td>
                        <td>
                          <div style="font-size: 11.5px;">
                            <div>Cha: ${s.fatherName || '---'} (${s.fatherPhone || '---'})</div>
                            <div>Mẹ: ${s.motherName || '---'} (${s.motherPhone || '---'})</div>
                          </div>
                        </td>
                        <td>
                          <span class="badge ${s.sacraments && s.sacraments.baptized ? 'badge-success' : 'badge-slate'}" title="Rửa tội">RT</span>
                          <span class="badge ${s.sacraments && s.sacraments.eucharist ? 'badge-success' : 'badge-slate'}" title="Rơt lễ lần đầu">RL</span>
                          <span class="badge ${s.sacraments && s.sacraments.confirmed ? 'badge-success' : 'badge-slate'}" title="Thêm sức">TS</span>
                        </td>
                        <td>
                          <div style="display: flex; gap: 4px;">
                            <button class="btn btn-sm btn-outline-primary" onclick="window.editStudent('${s.id}')"><i class="fa-solid fa-pen"></i> Sửa</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="window.deleteStudent('${s.id}')"><i class="fa-solid fa-trash"></i> Xóa</button>
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
      </div>
    `;
  }

  // PAGE 4: QUẢN LÝ GIÁO LÝ VIÊN (CATECHISTS)
  function renderCatechists(container) {
    const catechists = appData.catechists || [];
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-chalkboard-user"></i> Đội Ngũ Giáo Lý Viên</h2>
          <p class="page-subtitle">Danh sách Huấn luyện viên, Huynh trưởng và Giáo lý viên phục vụ (${catechists.length} người)</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddCatechistModal()"><i class="fa-solid fa-plus"></i> Thêm Giáo Lý Viên Mới</button>
      </div>

      ${catechists.length === 0 ? `
        <div class="card" style="text-align: center; padding: 40px;">
          <i class="fa-solid fa-user-group" style="font-size: 36px; color: var(--slate-border); margin-bottom: 8px;"></i>
          <p style="font-weight: 700;">Chưa Có Giáo Lý Viên Nào Trong Danh Sách</p>
          <button class="btn btn-primary" onclick="window.openAddCatechistModal()"><i class="fa-solid fa-plus"></i> Thêm Giáo Lý Viên Mới</button>
        </div>
      ` : `
        <div class="kpi-grid">
          ${catechists.map(cat => `
            <div class="card">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 46px; height: 46px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800;">
                      ${cat.fullName.charAt(0)}
                    </div>
                    <div>
                      <span style="font-size: 11px; font-weight: 700; color: var(--primary);">${cat.holyName}</span>
                      <h3 style="font-size: 15px; font-weight: 800; color: var(--dark-navy); margin: 0;">${cat.fullName}</h3>
                      <span class="badge badge-primary">${cat.role}</span>
                    </div>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-xs btn-outline-primary" onclick="window.editCatechist('${cat.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-xs btn-outline-danger" onclick="window.deleteCatechist('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </div>
                <p style="font-size: 12px; margin-bottom: 4px;"><i class="fa-solid fa-phone text-muted"></i> <strong>SĐT:</strong> ${cat.phone || '---'}</p>
                <p style="font-size: 12px; margin-bottom: 4px;"><i class="fa-solid fa-envelope text-muted"></i> <strong>Email:</strong> ${cat.email || '---'}</p>
                <p style="font-size: 12px;"><i class="fa-solid fa-chalkboard text-muted"></i> <strong>Phụ trách:</strong> ${cat.assignedClass || 'Chưa phân công'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  // PAGE 5: ĐIỂM DANH (ATTENDANCE)
  function renderAttendance(container) {
    const today = new Date().toISOString().split('T')[0];
    const classes = appData.classes || [];
    const selectedClassId = window._selectedAttendanceClassId || (classes.length > 0 ? classes[0].id : '');
    const filteredStudents = appData.students.filter(s => !selectedClassId || s.classId === selectedClassId);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-clipboard-user"></i> Điểm Danh Học Viên Theo Lớp</h2>
          <p class="page-subtitle">Tự động nạp danh sách học viên từ lớp học đã tải lên</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-calendar-check"></i> Chọn Lớp & Ngày Điểm Danh</h3>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="col-4">
              <label>Chọn Lớp Học:</label>
              <select id="att-class-select" class="form-control" onchange="window.changeAttendanceClass(this.value)">
                ${classes.map(c => `<option value="${c.id}" ${c.id === selectedClassId ? 'selected' : ''}>${c.name} (${c.grade})</option>`).join('')}
              </select>
            </div>
            <div class="col-4">
              <label>Ngày Điểm Danh:</label>
              <input type="date" id="att-date" class="form-control" value="${today}">
            </div>
            <div class="col-4">
              <label>Loại Buổi Sinh Hoạt:</label>
              <select id="att-session-type" class="form-control">
                <option value="Giáo lý">Giờ học Giáo lý</option>
                <option value="Thánh lễ">Thánh lễ Chúa Nhật</option>
                <option value="Sinh hoạt">Sinh hoạt Phân đoàn</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h3 class="card-title"><i class="fa-solid fa-list-check"></i> Danh Sách Học Viên (${filteredStudents.length} em)</h3>
          <button class="btn btn-sm btn-outline-primary" onclick="window.checkAllPresent()"><i class="fa-solid fa-check-double"></i> Đánh dấu tất cả Có Mặt</button>
        </div>
        <div class="card-body" style="padding: 0;">
          ${filteredStudents.length === 0 ? `
            <div style="text-align: center; padding: 30px;">
              <p style="color: var(--slate-muted);">Lớp học này chưa có học viên nào. Hãy vào mục 'Học viên' để thêm học viên hoặc tải file CSV lên!</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Mã HV</th>
                    <th>Họ và Tên Học Viên</th>
                    <th>Trạng Thái Điểm Danh</th>
                    <th>Ghi Chú</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredStudents.map(s => `
                    <tr>
                      <td><strong>${s.code}</strong></td>
                      <td>
                        <img src="${s.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; margin-right: 6px;">
                        <strong>${s.holyName}</strong> ${s.fullName}
                      </td>
                      <td>
                        <div style="display: flex; gap: 10px; font-size: 12px;">
                          <label style="cursor: pointer;"><input type="radio" name="att_${s.id}" value="present" checked> 🟢 Có mặt</label>
                          <label style="cursor: pointer;"><input type="radio" name="att_${s.id}" value="late"> 🟡 Đi trễ</label>
                          <label style="cursor: pointer;"><input type="radio" name="att_${s.id}" value="excused"> 🔵 Vắng có phép</label>
                          <label style="cursor: pointer;"><input type="radio" name="att_${s.id}" value="unexcused"> 🔴 Vắng không phép</label>
                        </div>
                      </td>
                      <td><input type="text" class="form-control form-control-sm" placeholder="Ghi chú..."></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
        <div class="card-footer" style="padding: 16px 24px; text-align: right; border-top: 1px solid var(--slate-border);">
          <button class="btn btn-primary" onclick="showToast('Đã lưu dữ liệu điểm danh lớp thành công!', 'success')"><i class="fa-solid fa-floppy-disk"></i> Lưu Kết Quả Điểm Danh</button>
        </div>
      </div>
    `;
  }

  window.changeAttendanceClass = function(clsId) {
    window._selectedAttendanceClassId = clsId;
    renderAttendance(document.getElementById('content-area'));
  };

  window.checkAllPresent = function() {
    document.querySelectorAll('input[type="radio"][value="present"]').forEach(r => r.checked = true);
    showToast('Đã đánh dấu tất cả học viên Có Mặt!', 'info');
  };

  // PAGE 6: BẢNG ĐIỂM (GRADEBOOK)
  function calculateStudentGrade(oral, min15, midterm, finalExam) {
    const parseNum = val => {
      if (val === null || val === undefined || val === '') return 0;
      const str = String(val).replace(',', '.');
      const num = parseFloat(str);
      return isNaN(num) ? 0 : Math.max(0, Math.min(10, num));
    };

    const o = parseNum(oral);
    const m15 = parseNum(min15);
    const mid = parseNum(midterm);
    const fin = parseNum(finalExam);

    // Auto calculation formula: (Miệng + 15 phút + Giữa Kỳ + Cuối Kỳ) / 4
    const avg = (o + m15 + mid + fin) / 4;
    const roundedAvg = Math.round(avg * 10) / 10;

    let rank = 'Trung bình';
    let badgeClass = 'badge-warning';
    if (roundedAvg >= 9.0) {
      rank = 'Xuất sắc';
      badgeClass = 'badge-success';
    } else if (roundedAvg >= 8.0) {
      rank = 'Giỏi';
      badgeClass = 'badge-success';
    } else if (roundedAvg >= 6.5) {
      rank = 'Khá';
      badgeClass = 'badge-info';
    } else if (roundedAvg >= 5.0) {
      rank = 'Trung bình';
      badgeClass = 'badge-warning';
    } else {
      rank = 'Yếu';
      badgeClass = 'badge-danger';
    }

    return {
      oral: o,
      min15: m15,
      midterm: mid,
      finalExam: fin,
      average: roundedAvg,
      rank: rank,
      badgeClass: badgeClass
    };
  }

  function getStudentSemesterGrades(student, semesterKey) {
    if (!student.grades) student.grades = {};
    const g = student.grades;
    const targetSem = semesterKey === 'semester2' ? 'semester2' : 'semester1';

    if (!g[targetSem]) {
      if (typeof g.oral === 'number' || typeof g.min15 === 'number' || typeof g.midterm === 'number' || typeof g.finalExam === 'number' || typeof g.oral15 === 'number') {
        const legacyOral = typeof g.oral === 'number' ? g.oral : (typeof g.oral15 === 'number' ? g.oral15 : 0);
        const legacyMin15 = typeof g.min15 === 'number' ? g.min15 : (typeof g.oral15 === 'number' ? g.oral15 : 0);
        const legacyMid = typeof g.midterm === 'number' ? g.midterm : 0;
        const legacyFin = typeof g.finalExam === 'number' ? g.finalExam : 0;
        g[targetSem] = calculateStudentGrade(legacyOral, legacyMin15, legacyMid, legacyFin);
      } else {
        g[targetSem] = calculateStudentGrade(0, 0, 0, 0);
      }
    }

    return g[targetSem];
  }

  window.calculateStudentGrade = calculateStudentGrade;

  window.updateStudentGradeRow = function (stdId) {
    const semesterKey = window._selectedGradeSemester || 'semester1';
    const oralVal = document.getElementById(`grade-oral-${stdId}`)?.value;
    const min15Val = document.getElementById(`grade-min15-${stdId}`)?.value;
    const midtermVal = document.getElementById(`grade-midterm-${stdId}`)?.value;
    const finalVal = document.getElementById(`grade-final-${stdId}`)?.value;

    const computed = calculateStudentGrade(oralVal, min15Val, midtermVal, finalVal);

    const student = (appData.students || []).find(s => s.id === stdId || String(s.id) === String(stdId));
    if (student) {
      if (!student.grades) student.grades = {};
      student.grades[semesterKey] = {
        oral: computed.oral,
        min15: computed.min15,
        midterm: computed.midterm,
        finalExam: computed.finalExam,
        average: computed.average,
        rank: computed.rank
      };

      // Calculate overall year average
      const sem1Avg = student.grades.semester1 ? student.grades.semester1.average : computed.average;
      const sem2Avg = student.grades.semester2 ? student.grades.semester2.average : computed.average;
      const yearAvg = Math.round(((sem1Avg + sem2Avg) / 2) * 10) / 10;
      student.grades.average = yearAvg;
      student.grades.rank = yearAvg >= 9.0 ? 'Xuất sắc' : (yearAvg >= 8.0 ? 'Giỏi' : (yearAvg >= 6.5 ? 'Khá' : (yearAvg >= 5.0 ? 'Trung bình' : 'Yếu')));

      saveUserData();
    }

    const avgEl = document.getElementById(`grade-avg-${stdId}`);
    if (avgEl) avgEl.textContent = computed.average.toFixed(1);

    const rankEl = document.getElementById(`grade-rank-${stdId}`);
    if (rankEl) {
      rankEl.textContent = computed.rank;
      rankEl.className = `badge ${computed.badgeClass}`;
    }
  };

  window.saveAllGradebook = function () {
    const classes = appData.classes || [];
    const selectedClassId = window._selectedGradeClassId || (classes.length > 0 ? classes[0].id : '');
    const semesterKey = window._selectedGradeSemester || 'semester1';
    const targetClass = classes.find(c => c.id === selectedClassId || String(c.id) === String(selectedClassId));
    const targetClassName = targetClass ? targetClass.name : '';
    const filteredStudents = (appData.students || []).filter(s =>
      !selectedClassId ||
      s.classId === selectedClassId ||
      String(s.classId) === String(selectedClassId) ||
      (targetClassName && s.className === targetClassName)
    );

    filteredStudents.forEach(s => {
      const oralVal = document.getElementById(`grade-oral-${s.id}`)?.value;
      const min15Val = document.getElementById(`grade-min15-${s.id}`)?.value;
      const midtermVal = document.getElementById(`grade-midterm-${s.id}`)?.value;
      const finalVal = document.getElementById(`grade-final-${s.id}`)?.value;

      const computed = calculateStudentGrade(oralVal, min15Val, midtermVal, finalVal);
      if (!s.grades) s.grades = {};
      s.grades[semesterKey] = {
        oral: computed.oral,
        min15: computed.min15,
        midterm: computed.midterm,
        finalExam: computed.finalExam,
        average: computed.average,
        rank: computed.rank
      };
    });

    saveUserData();
    showToast('Đã lưu toàn bộ bảng điểm lớp thành công!', 'success');
  };

  window.resetCurrentGradebookDirect = function () {
    const zeroGrades = calculateStudentGrade(0, 0, 0, 0);

    (appData.students || []).forEach(s => {
      if (!s.grades) s.grades = {};

      s.grades.semester1 = { ...zeroGrades };
      s.grades.semester2 = { ...zeroGrades };

      delete s.grades.oral;
      delete s.grades.min15;
      delete s.grades.midterm;
      delete s.grades.finalExam;
      delete s.grades.oral15;
      delete s.grades.average;
      delete s.grades.rank;
      delete s.oral;
      delete s.min15;
      delete s.midterm;
      delete s.finalExam;
      delete s.oral15;

      s.grades.average = 0.0;
      s.grades.rank = 'Yếu';

      const oralInput = document.getElementById(`grade-oral-${s.id}`);
      const min15Input = document.getElementById(`grade-min15-${s.id}`);
      const midtermInput = document.getElementById(`grade-midterm-${s.id}`);
      const finalInput = document.getElementById(`grade-final-${s.id}`);
      const avgEl = document.getElementById(`grade-avg-${s.id}`);
      const rankEl = document.getElementById(`grade-rank-${s.id}`);

      if (oralInput) oralInput.value = 0;
      if (min15Input) min15Input.value = 0;
      if (midtermInput) midtermInput.value = 0;
      if (finalInput) finalInput.value = 0;
      if (avgEl) avgEl.textContent = '0.0';
      if (rankEl) {
        rankEl.textContent = 'Yếu';
        rankEl.className = 'badge badge-danger';
      }
    });

    saveUserData();

    const container = document.getElementById('content-area');
    if (container) {
      renderGradebook(container);
    }

    showToast('Đã reset toàn bộ bảng điểm lớp về 0 thành công!', 'warning');
  };

  window.resetCurrentGradebook = function () {
    window.resetCurrentGradebookDirect();
  };

  window.changeGradeClass = function (clsId) {
    window._selectedGradeClassId = clsId;
    renderGradebook(document.getElementById('content-area'));
  };

  window.changeGradeSemester = function (semKey) {
    window._selectedGradeSemester = semKey;
    renderGradebook(document.getElementById('content-area'));
  };

  function renderGradebook(container) {
    const classes = appData.classes || [];
    const selectedClassId = window._selectedGradeClassId || (classes.length > 0 ? classes[0].id : '');
    const selectedSemester = window._selectedGradeSemester || 'semester1';
    const semLabel = selectedSemester === 'semester2' ? 'Học Kỳ II' : 'Học Kỳ I';

    const targetClass = classes.find(c => c.id === selectedClassId || String(c.id) === String(selectedClassId));
    const targetClassName = targetClass ? targetClass.name : '';
    const filteredStudents = (appData.students || []).filter(s =>
      !selectedClassId ||
      s.classId === selectedClassId ||
      String(s.classId) === String(selectedClassId) ||
      (targetClassName && s.className === targetClassName)
    );

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-trophy"></i> Bảng Điểm & Kết Quả Học Tập</h2>
          <p class="page-subtitle">Quản lý điểm số theo Học Kỳ (HK I & HK II). Tự động tính Trung bình = (Miệng + 15 phút + Giữa Kỳ + Cuối Kỳ) / 4</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding: 16px 24px;">
          <div class="form-row" style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 220px;">
              <label style="font-weight: 700; margin-bottom: 6px; display: block;"><i class="fa-solid fa-layer-group text-primary"></i> Chọn Lớp Học Cần Nhập Điểm:</label>
              <select id="grade-class-select" class="form-control" onchange="window.changeGradeClass(this.value)">
                ${classes.map(c => `<option value="${c.id}" ${c.id === selectedClassId ? 'selected' : ''}>${c.name} (${c.grade})</option>`).join('')}
              </select>
            </div>
            <div style="flex: 1; min-width: 220px;">
              <label style="font-weight: 700; margin-bottom: 6px; display: block;"><i class="fa-solid fa-calendar-days text-primary"></i> Chọn Học Kỳ:</label>
              <select id="grade-semester-select" class="form-control" onchange="window.changeGradeSemester(this.value)">
                <option value="semester1" ${selectedSemester === 'semester1' ? 'selected' : ''}>📘 Học Kỳ I</option>
                <option value="semester2" ${selectedSemester === 'semester2' ? 'selected' : ''}>📙 Học Kỳ II</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="background: var(--primary-light); display: flex; justify-content: space-between; align-items: center; padding: 14px 24px;">
          <h4 style="font-size: 15px; font-weight: 800; color: var(--primary); margin: 0;">
            <i class="fa-solid fa-graduation-cap"></i> Sổ Điểm ${semLabel} - ${classes.find(c => c.id === selectedClassId)?.name || 'Toàn bộ'}
          </h4>
          <span class="badge badge-primary">${filteredStudents.length} Học Viên</span>
        </div>
        <div class="card-body" style="padding: 0;">
          ${filteredStudents.length === 0 ? `
            <div style="text-align: center; padding: 40px 20px;">
              <div style="font-size: 40px; color: var(--slate-border); margin-bottom: 10px;"><i class="fa-solid fa-folder-open"></i></div>
              <p style="color: var(--slate-muted); font-size: 14px; font-weight: 600;">Lớp học này chưa có học viên nào để nhập điểm.</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="min-width: 180px;">Họ và Tên Học Viên</th>
                    <th style="width: 90px; text-align: center;">Miệng</th>
                    <th style="width: 90px; text-align: center;">15 phút</th>
                    <th style="width: 90px; text-align: center;">Giữa Kỳ</th>
                    <th style="width: 90px; text-align: center;">Cuối Kỳ</th>
                    <th style="width: 130px; text-align: center;">Điểm Trung Bình</th>
                    <th style="width: 130px; text-align: center;">Xếp Loại Học Lực</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredStudents.map(s => {
                    const g = getStudentSemesterGrades(s, selectedSemester);
                    const computed = calculateStudentGrade(g.oral, g.min15, g.midterm, g.finalExam);

                    return `
                    <tr>
                      <td>
                        <img src="${s.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; margin-right: 6px;">
                        <strong>${s.holyName || ''}</strong> ${s.fullName || s.name || ''}
                      </td>
                      <td style="text-align: center;"><input type="number" min="0" max="10" step="0.5" id="grade-oral-${s.id}" class="form-control form-control-sm text-center" value="${computed.oral}" style="width: 75px; margin: 0 auto;" oninput="window.updateStudentGradeRow('${s.id}')"></td>
                      <td style="text-align: center;"><input type="number" min="0" max="10" step="0.5" id="grade-min15-${s.id}" class="form-control form-control-sm text-center" value="${computed.min15}" style="width: 75px; margin: 0 auto;" oninput="window.updateStudentGradeRow('${s.id}')"></td>
                      <td style="text-align: center;"><input type="number" min="0" max="10" step="0.5" id="grade-midterm-${s.id}" class="form-control form-control-sm text-center" value="${computed.midterm}" style="width: 75px; margin: 0 auto;" oninput="window.updateStudentGradeRow('${s.id}')"></td>
                      <td style="text-align: center;"><input type="number" min="0" max="10" step="0.5" id="grade-final-${s.id}" class="form-control form-control-sm text-center" value="${computed.finalExam}" style="width: 75px; margin: 0 auto;" oninput="window.updateStudentGradeRow('${s.id}')"></td>
                      <td style="text-align: center;"><strong id="grade-avg-${s.id}" style="font-size: 15px; color: var(--primary);">${computed.average.toFixed(1)}</strong></td>
                      <td style="text-align: center;"><span id="grade-rank-${s.id}" class="badge ${computed.badgeClass}">${computed.rank}</span></td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
        <div class="card-footer" style="padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-border); background: #fafafa;">
          <button class="btn btn-outline-danger" onclick="window.resetCurrentGradebook()"><i class="fa-solid fa-rotate-left"></i> Reset Bảng Điểm Lớp</button>
          <button class="btn btn-primary" onclick="window.saveAllGradebook()"><i class="fa-solid fa-floppy-disk"></i> Lưu Bảng Điểm Lớp</button>
        </div>
      </div>
    `;
  }

  window.changeGradeClass = function(clsId) {
    window._selectedGradeClassId = clsId;
    renderGradebook(document.getElementById('content-area'));
  };

  // PAGE 7: ĐÁNH GIÁ RÈN LUYỆN (CONDUCT)
  function renderConduct(container) {
    const classes = appData.classes || [];
    const selectedClassId = window._selectedConductClassId || (classes.length > 0 ? classes[0].id : '');
    const filteredStudents = appData.students.filter(s => !selectedClassId || s.classId === selectedClassId);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-star"></i> Đánh Giá Rèn Luyện & Đạo Đức</h2>
          <p class="page-subtitle">Theo dõi thái độ rèn luyện và sinh hoạt theo từng lớp</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding: 16px 24px;">
          <div class="form-row">
            <div class="col-6">
              <label>Chọn Lớp Học:</label>
              <select class="form-control" onchange="window.changeConductClass(this.value)">
                ${classes.map(c => `<option value="${c.id}" ${c.id === selectedClassId ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Học Viên</th>
                  <th>Chuyên Cần Thánh Lễ</th>
                  <th>Điểm Đức Tin & Đạo Đức</th>
                  <th>Nhận Xét Của GLV</th>
                </tr>
              </thead>
              <tbody>
                ${filteredStudents.map(s => `
                  <tr>
                    <td><strong>${s.holyName}</strong> ${s.fullName}</td>
                    <td><span class="badge badge-success">${s.conduct ? s.conduct.massAttendance : '100%'}</span></td>
                    <td><strong style="color: var(--primary);">${s.conduct ? s.conduct.virtueScore : 95}/100</strong></td>
                    <td><input type="text" class="form-control form-control-sm" value="${s.conduct ? s.conduct.remarks : 'Ngoan ngoãn, siêng năng'}" style="width: 100%;"></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  window.changeConductClass = function(clsId) {
    window._selectedConductClassId = clsId;
    renderConduct(document.getElementById('content-area'));
  };

  // PAGE 8: HỌC LIỆU (LIBRARY)
  function renderLibrary(container) {
    const materials = appData.libraryMaterials || [];
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-book-bookmark"></i> Thư Viện Học Liệu Giáo Lý</h2>
          <p class="page-subtitle">Tài liệu tham khảo, sách giáo trình và giáo án bài giảng</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddLibraryModal()"><i class="fa-solid fa-plus"></i> Thêm Học Liệu Mới</button>
      </div>

      ${materials.length === 0 ? `
        <div class="kpi-grid">
          <div class="card">
            <div class="card-body text-center">
              <i class="fa-solid fa-file-pdf" style="font-size: 36px; color: var(--danger); margin-bottom: 10px;"></i>
              <h4 style="font-weight: 800;">Sách Giáo Lý Hội Thánh Công Giáo</h4>
              <p style="font-size: 12px; color: var(--slate-muted); margin-bottom: 12px;">Bản chuẩn Giáo Hội ban hành</p>
              <button class="btn btn-sm btn-outline-primary btn-block" onclick="showToast('Đang tải xuống bản PDF chuẩn...', 'info')"><i class="fa-solid fa-download"></i> Tải PDF</button>
            </div>
          </div>
          <div class="card">
            <div class="card-body text-center">
              <i class="fa-solid fa-file-powerpoint" style="font-size: 36px; color: #d97706; margin-bottom: 10px;"></i>
              <h4 style="font-weight: 800;">Giáo Án Slide Bài Giảng Giáo Lý</h4>
              <p style="font-size: 12px; color: var(--slate-muted); margin-bottom: 12px;">Bài giảng điện tử 32 tuần học</p>
              <button class="btn btn-sm btn-outline-primary btn-block" onclick="showToast('Đang mở file PowerPoint bài giảng...', 'info')"><i class="fa-solid fa-download"></i> Tải Slide PPT</button>
            </div>
          </div>
        </div>
      ` : `
        <div class="kpi-grid">
          ${materials.map(lib => `
            <div class="card">
              <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <h4 style="font-size: 15px; font-weight: 800; color: var(--dark-navy); margin: 0;">${lib.title}</h4>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-xs btn-outline-primary" onclick="window.editLibrary('${lib.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-xs btn-outline-danger" onclick="window.deleteLibrary('${lib.id}')"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </div>
                <span class="badge badge-primary mb-2">${lib.format} • ${lib.grade}</span>
                <p style="font-size: 12px; color: var(--slate-muted); margin-bottom: 12px;">${lib.desc || 'Tài liệu giáo lý chính thức'}</p>
                <button class="btn btn-sm btn-outline-primary btn-block" onclick="showToast('Đang mở học liệu ${lib.title}...', 'info')"><i class="fa-solid fa-download"></i> Tải Về</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  // PAGE 9: NGÂN HÀNG ĐỀ THI (QUIZZES)
  function renderQuizzes(container) {
    const quizzes = appData.quizzes || [];
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-file-pen"></i> Ngân Hàng Câu Hỏi & Đề Thi</h2>
          <p class="page-subtitle">Tạo đề thi trắc nghiệm và tự luận môn Giáo Lý</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddQuizModal()"><i class="fa-solid fa-plus"></i> Tạo Đề Thi Mới</button>
      </div>

      <div class="card">
        <div class="card-body">
          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 12px;">Danh sách đề thi trong hệ thống:</h4>
          ${quizzes.length === 0 ? `
            <ul style="padding-left: 20px; line-height: 2;">
              <li><strong>Đề thi Giữa Kỳ 1 - Ngành Thiếu Nhi:</strong> 20 câu trắc nghiệm + 2 câu tự luận về Phép Thánh Thể.</li>
              <li><strong>Đề thi Cuối Kỳ - Ngành Ấu Nhi:</strong> 15 câu hỏi trắc nghiệm hình ảnh về Cuộc đời Chúa Giêsu.</li>
              <li><strong>Đề khảo sát Khai Tâm:</strong> Kinh nguyện cơ bản (Kinh Lạy Cha, Kinh Kính Mừng, Kinh Sáng Danh).</li>
            </ul>
          ` : `
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Tên Đề Thi</th>
                    <th>Phân Đoàn</th>
                    <th>Số Câu Hỏi</th>
                    <th>Nội Dung Chi Tiết</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${quizzes.map(q => `
                    <tr>
                      <td><strong>${q.title}</strong></td>
                      <td><span class="badge badge-primary">${q.grade}</span></td>
                      <td><strong>${q.count}</strong> câu</td>
                      <td>${q.content || '...' }</td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.editQuiz('${q.id}')"><i class="fa-solid fa-pen"></i> Sửa</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteQuiz('${q.id}')"><i class="fa-solid fa-trash"></i> Xóa</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // PAGE 10: BẰNG & CHỨNG CHỈ (CERTIFICATES)
  function renderCertificates(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-certificate"></i> In Bằng & Giấy Chứng Nhận</h2>
          <p class="page-subtitle">Cấp chứng nhận hoàn thành lớp Giáo lý và các Bí tích cho Học viên</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-sliders"></i> Cấu Hình Chứng Nhận In</h3>
        </div>
        <div class="card-body">
          ${appData.students.length === 0 ? `
            <p style="color: var(--slate-muted); text-align: center;">Chưa có học viên nào trong hệ thống để in chứng chỉ. Vui lòng thêm học viên hoặc tải file CSV lên!</p>
          ` : `
            <div class="form-row">
              <div class="col-6">
                <label>Chọn Học Viên In Chứng Nhận:</label>
                <select id="cert-student-select" class="form-control">
                  ${appData.students.map(s => `<option value="${s.id}">${s.holyName} ${s.fullName} (${s.code})</option>`).join('')}
                </select>
              </div>
              <div class="col-6">
                <label>Loại Giấy Chứng Nhận:</label>
                <select id="cert-type-select" class="form-control">
                  <option value="hoanthanh">Hoàn Thành Chương Trình Giáo Lý</option>
                  <option value="ruatoai">Chứng Nhận Bí Tích Rửa Tội</option>
                  <option value="ruatole">Chứng Nhận Rơt Lễ Lần Đầu</option>
                  <option value="themsuc">Chứng Nhận Bí Tích Thêm Sức</option>
                </select>
              </div>
            </div>
            <div style="margin-top: 16px; text-align: right;">
              <button class="btn btn-primary" onclick="window.previewCertificate()"><i class="fa-solid fa-eye"></i> Xem Trước & In Chứng Chỉ</button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // PAGE 11: BÁO CÁO GIÁO LÝ (REPORTS - SUPER ADMIN MULTI-TENANT PARISH OVERVIEW)
  function renderReports(container) {
    const isAdmin = currentUser && currentUser.role === 'Admin';
    const globalData = getParishGlobalData();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-chart-column text-primary"></i> Báo Cáo Giáo Lý Toàn Giáo Xứ</h2>
          <p class="page-subtitle">${isAdmin ? '👑 Chế độ Admin: Tổng hợp theo dõi toàn bộ các lớp của tất cả GLV trong Giáo xứ' : 'Tổng hợp số liệu lớp học cá nhân'}</p>
        </div>
        <button class="btn btn-outline-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> In Báo Cáo PDF</button>
      </div>

      <!-- KPI STATS -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon kpi-blue"><i class="fa-solid fa-layer-group"></i></div>
          <div class="kpi-info">
            <h4>${isAdmin ? 'Tổng Số Lớp Toàn Giáo Xứ' : 'Tổng Số Lớp Của Tôi'}</h4>
            <div class="kpi-number">${isAdmin ? globalData.classes.length : appData.classes.length} lớp</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-green"><i class="fa-solid fa-user-graduate"></i></div>
          <div class="kpi-info">
            <h4>${isAdmin ? 'Tổng Học Viên Toàn Giáo Xứ' : 'Tổng Số Học Viên'}</h4>
            <div class="kpi-number">${isAdmin ? globalData.students.length : appData.students.length} em</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-amber"><i class="fa-solid fa-chalkboard-user"></i></div>
          <div class="kpi-info">
            <h4>${isAdmin ? 'Đội Ngũ Giáo Lý Viên' : 'Niên Học Hiện Tại'}</h4>
            <div class="kpi-number">${isAdmin ? globalData.catechists.length + ' GLV' : appData.parishInfo.academicYear}</div>
          </div>
        </div>
      </div>

      ${isAdmin ? `
        <!-- SUPER ADMIN PARISH-WIDE CLASS MONITORING TABLE -->
        <div class="card mt-4">
          <div class="card-header" style="background: var(--primary-light); display: flex; justify-content: space-between; align-items: center;">
            <h3 class="card-title" style="color: var(--primary-dark); font-weight: 800;"><i class="fa-solid fa-table-cells"></i> Bảng Tổng Hợp Theo Dõi Toàn Bộ Các Lớp Ở Tất Cả Tài Khoản</h3>
            <span class="badge badge-primary"><i class="fa-solid fa-crown"></i> Toàn Giáo Xứ (Admin)</span>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Tên Lớp Học</th>
                    <th>Phân Đoàn / Ngành</th>
                    <th>GLV Phụ Trách</th>
                    <th>Sĩ Số Học Viên</th>
                    <th>Phòng Học & Lịch Học</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  ${globalData.classes.length === 0 ? `
                    <tr><td colspan="6" class="text-center p-3 text-muted">Chưa có dữ liệu lớp học nào từ các tài khoản GLV.</td></tr>
                  ` : globalData.classes.map(c => `
                    <tr>
                      <td><strong style="color: var(--primary);">${c.name}</strong></td>
                      <td><span class="badge badge-primary">${c.grade}</span></td>
                      <td><strong>${c.teacher || 'Chưa phân công'}</strong></td>
                      <td><strong>${c.studentCount || (globalData.students.filter(s => s.classId === c.id).length)}</strong> em</td>
                      <td><small>${c.room || 'Phòng học'} (${c.schedule || 'Chúa Nhật'})</small></td>
                      <td><span class="badge badge-success">🟢 Đang giảng dạy</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  // PAGE 12: THÔNG BÁO (NOTIFICATIONS)
  function renderNotifications(container) {
    const notifications = appData.notifications || [];
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-bell"></i> Trung Tâm Thông Báo</h2>
          <p class="page-subtitle">Gửi và quản lý thông báo tới Phụ huynh và Học viên Giáo lý</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddNotificationModal()"><i class="fa-solid fa-paper-plane"></i> Gửi Thông Báo Mới</button>
      </div>

      <div class="card">
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Loại Thông Báo</th>
                  <th>Tiêu Đề Thông Báo</th>
                  <th>Nội Dung Chi Tiết</th>
                  <th>Ngày Gửi</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                ${notifications.length === 0 ? `
                  <tr><td colspan="5" class="text-center p-3 text-muted">Chưa có thông báo nào. Bấm 'Gửi Thông Báo Mới' để tạo!</td></tr>
                ` : notifications.map(n => `
                  <tr>
                    <td><span class="badge badge-primary">${n.category}</span></td>
                    <td><strong>${n.title}</strong></td>
                    <td>${n.content}</td>
                    <td><small style="color: var(--slate-muted);">${n.date}</small></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" onclick="window.editNotification('${n.id}')"><i class="fa-solid fa-pen"></i></button>
                      <button class="btn btn-sm btn-outline-danger" onclick="window.deleteNotification('${n.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // PAGE 13: THÔNG TIN GIÁO XỨ (SETTINGS)
  function renderSettings(container) {
    const p = appData.parishInfo;
    let uploadedParishLogoBase64 = p.logoUrl || '';

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-church"></i> Thông Tin Giáo Xứ & Quản Lý Dữ Liệu</h2>
          <p class="page-subtitle">Cập nhật tên Giáo xứ, hình đại diện Giáo xứ, niên học và thiết lập lại dữ liệu</p>
        </div>
      </div>

      ${window._parishSaveSuccessMsg ? `
        <div id="parish-save-alert" class="alert alert-success mb-4" style="background: #ecfdf5; border-left: 5px solid #10b981; color: #065f46; padding: 16px 20px; border-radius: 10px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.18); animation: slideDownToast 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-circle-check" style="font-size: 22px; color: #059669;"></i>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: #047857;">THÔNG BÁO ĐÃ LƯU THÀNH CÔNG!</div>
              <div style="font-size: 13px; font-weight: 600; color: #065f46; margin-top: 2px;">${window._parishSaveSuccessMsg}</div>
            </div>
          </div>
          <button type="button" onclick="window._parishSaveSuccessMsg=null; this.parentElement.remove()" style="background: none; border: none; font-size: 20px; color: #065f46; cursor: pointer; padding: 0 4px;">&times;</button>
        </div>
      ` : ''}

      <!-- RESET DATA BOX -->
      <div class="alert alert-warning mb-4" style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="font-size: 15px; font-weight: 800; color: #b45309; margin-bottom: 4px;"><i class="fa-solid fa-rotate-left"></i> Thiết Lập Dữ Liệu Trắng Bắt Đầu Từ Đầu</h4>
            <p style="font-size: 12.5px; color: #92400e; margin: 0;">Xóa sạch các dữ liệu lớp học, học viên hiện tại để tự nhập dữ liệu thực tế từ đầu.</p>
          </div>
          <button class="btn btn-outline-danger" onclick="window.confirmResetAllUserData()"><i class="fa-solid fa-trash-can"></i> Reset Dữ Liệu Về Trắng</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-church"></i> Thông Tin Chung & Niên Học</h3>
        </div>
        <div class="card-body">
          <form id="parish-settings-form">
            
            <div class="form-group">
              <label><i class="fa-solid fa-image text-primary"></i> Hình Đại Diện Giáo Xứ / Logo Giáo Xứ:</label>
              <div class="parish-logo-upload-wrapper" style="display: flex; align-items: center; gap: 20px; background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px dashed var(--slate-border);">
                <img id="cfg-parish-logo-preview" src="${p.logoUrl || 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=150&auto=format&fit=crop&q=80'}" alt="Parish Logo" style="width: 90px; height: 90px; border-radius: 12px; object-fit: cover; border: 2px solid var(--primary);">
                <div>
                  <label for="cfg-parish-logo-input" class="btn btn-outline-primary btn-sm" style="cursor: pointer;">
                    <i class="fa-solid fa-upload"></i> Tải ảnh Giáo xứ lên từ máy tính
                  </label>
                  <input type="file" id="cfg-parish-logo-input" accept="image/*" style="display: none;">
                  <p style="font-size: 11.5px; color: var(--slate-muted); margin-top: 6px;">Hỗ trợ PNG, JPG, WEBP. Ảnh tải lên hiển thị vĩnh viễn.</p>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label>Tên Giáo Xứ: <span class="text-danger">*</span></label>
                <input type="text" id="cfg-parish-name" class="form-control" value="${p.name}" required>
              </div>
              <div class="form-group col-6">
                <label>Giáo Phận:</label>
                <input type="text" id="cfg-diocese" class="form-control" value="${p.diocese}">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label>Chọn Niên Học Giáo Lý: <span class="text-danger">*</span></label>
                <select id="cfg-academic-year" class="form-control" required>
                  <option value="2026 - 2027" ${p.academicYear === '2026 - 2027' ? 'selected' : ''}>Niên học 2026 - 2027</option>
                  <option value="2025 - 2026" ${p.academicYear === '2025 - 2026' ? 'selected' : ''}>Niên học 2025 - 2026</option>
                  <option value="2027 - 2028" ${p.academicYear === '2027 - 2028' ? 'selected' : ''}>Niên học 2027 - 2028</option>
                </select>
              </div>
              <div class="form-group col-6">
                <label>Linh Mục Quản Xứ:</label>
                <input type="text" id="cfg-pastor" class="form-control" value="${p.pastor}">
              </div>
            </div>

            <div class="form-group" style="text-align: right; margin-top: 20px;">
              <button type="submit" id="save-parish-info-btn" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Lưu Thông Tin Giáo Xứ & Niên Học</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const logoInput = document.getElementById('cfg-parish-logo-input');
    const logoPreview = document.getElementById('cfg-parish-logo-preview');
    if (logoInput && logoPreview) {
      logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            compressImage(evt.target.result, 400, 400, 0.85, (compressed) => {
              uploadedParishLogoBase64 = compressed;
              logoPreview.src = compressed;
              showToast('Đã nén và chọn ảnh đại diện Giáo xứ thành công!', 'info');
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const parishForm = document.getElementById('parish-settings-form');
    if (parishForm) {
      parishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('save-parish-info-btn');

        appData.parishInfo.name = document.getElementById('cfg-parish-name').value.trim();
        appData.parishInfo.diocese = document.getElementById('cfg-diocese').value.trim();
        appData.parishInfo.academicYear = document.getElementById('cfg-academic-year').value;
        appData.parishInfo.pastor = document.getElementById('cfg-pastor').value.trim();
        if (uploadedParishLogoBase64) {
          appData.parishInfo.logoUrl = uploadedParishLogoBase64;
        }
        saveUserData();
        renderAppHeaderAndSidebar();

        const successMsg = `Đã lưu thành công Thông Tin Giáo Xứ & Niên học ${appData.parishInfo.academicYear} lúc ${new Date().toLocaleTimeString('vi-VN')}!`;
        window._parishSaveSuccessMsg = successMsg;

        renderSettings(document.getElementById('content-area'));
        showToast('✓ ' + successMsg, 'success');
        if (submitBtn) flashButtonSuccess(document.getElementById('save-parish-info-btn'), 'Đã Lưu Thành Công!');
      });
    }
  }

  // PAGE 14: QUẢN TRỊ TÀI KHOẢN (ADMIN EXCLUSIVE & MASTER DASHBOARD)
  async function renderAdminUsers(container) {
    let cloudDataRows = [];
    let parishClassesCount = 0;
    let parishStudentsCount = 0;

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient.from('user_data').select('*');
        if (data && Array.isArray(data)) {
          cloudDataRows = data;
          data.forEach(r => {
            if (r.data) {
              if (Array.isArray(r.data.classes)) parishClassesCount += r.data.classes.length;
              if (Array.isArray(r.data.students)) parishStudentsCount += r.data.students.length;
            }
          });
        }
      } catch (e) {
        console.warn('Supabase admin fetch notice:', e);
      }
    }

    const totalUsers = accountsList.length;
    const activeUsers = accountsList.filter(a => a.status === 'active').length;
    const suspendedUsers = accountsList.filter(a => a.status === 'suspended').length;

    container.innerHTML = `
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
        <div>
          <h2 class="page-title"><i class="fa-solid fa-user-shield text-warning"></i> Quản Trị Hệ Thống Toàn Giáo Xứ (Master Admin)</h2>
          <p class="page-subtitle">Quản lý tài khoản Giáo lý viên, xem dữ liệu lớp học và xuất báo cáo tổng hợp toàn Giáo xứ</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-success" onclick="window.exportParishMasterExcel()">
            <i class="fa-solid fa-file-excel"></i> Xuất Báo Cáo Excel Toàn Giáo Xứ
          </button>
          <button class="btn btn-outline-primary" onclick="window.refreshAdminCloudData()">
            <i class="fa-solid fa-arrows-rotate"></i> Tải Lại Dữ Liệu Cloud
          </button>
        </div>
      </div>

      <!-- ADMIN STATS -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon kpi-blue"><i class="fa-solid fa-users"></i></div>
          <div class="kpi-info">
            <h4>Tài Khoản Đã Đăng Nhập</h4>
            <div class="kpi-number">${totalUsers}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-green"><i class="fa-solid fa-school"></i></div>
          <div class="kpi-info">
            <h4>Tổng Số Lớp Giáo Xứ</h4>
            <div class="kpi-number">${parishClassesCount}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-purple"><i class="fa-solid fa-graduation-cap"></i></div>
          <div class="kpi-info">
            <h4>Tổng Học Viên Giáo Xứ</h4>
            <div class="kpi-number">${parishStudentsCount}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-amber"><i class="fa-solid fa-user-check"></i></div>
          <div class="kpi-info">
            <h4>Đang Hoạt Động</h4>
            <div class="kpi-number">${activeUsers} / ${totalUsers}</div>
          </div>
        </div>
      </div>

      <!-- ACCOUNTS & CLASSES MASTER TABLE -->
      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <h3 class="card-title"><i class="fa-solid fa-users-gear"></i> Danh Sách Tài Khoản & Dữ Liệu Lớp Phụ Trách</h3>
          <span class="badge badge-primary"><i class="fa-solid fa-cloud"></i> Đồng Bộ Đám Mây Supabase Cloud</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Tài Khoản Google / Gmail</th>
                  <th>Tên Thánh & Họ Tên</th>
                  <th>Vai Trò</th>
                  <th>Số Lớp Phụ Trách</th>
                  <th>Số Học Viên</th>
                  <th>Lần Đăng Nhập Cuối</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác Admin Master</th>
                </tr>
              </thead>
              <tbody>
                ${accountsList.map(acc => {
                  const cloudMatch = cloudDataRows.find(r => r.email.toLowerCase() === acc.email.toLowerCase());
                  const cCount = cloudMatch && cloudMatch.data && Array.isArray(cloudMatch.data.classes) ? cloudMatch.data.classes.length : 0;
                  const sCount = cloudMatch && cloudMatch.data && Array.isArray(cloudMatch.data.students) ? cloudMatch.data.students.length : 0;
                  const lastSync = cloudMatch && cloudMatch.updated_at ? new Date(cloudMatch.updated_at).toLocaleString('vi-VN') : (acc.lastLogin || 'Mới khởi tạo');

                  return `
                    <tr>
                      <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <img src="${acc.avatar || 'admin_avatar.png'}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover;">
                          <div>
                            <strong>${acc.email}</strong>
                            <div style="font-size: 10px; color: var(--slate-muted);">ID: ${acc.id}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>${acc.holyName || ''}</strong> ${acc.name}</td>
                      <td>
                        <span class="role-badge ${acc.role === 'Admin' ? 'role-admin' : 'role-catechist'}">
                          ${acc.role === 'Admin' ? '👑 Admin Master' : '⛪ Giáo Lý Viên'}
                        </span>
                      </td>
                      <td><span class="badge badge-info">${cCount} lớp</span></td>
                      <td><span class="badge badge-success">${sCount} học viên</span></td>
                      <td><small style="color: var(--slate-muted);">${lastSync}</small></td>
                      <td>
                        ${acc.status === 'active' 
                          ? '<span class="badge badge-success">🟢 Hoạt động</span>' 
                          : '<span class="badge badge-warning">🟡 Tạm khóa</span>'}
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-info" onclick="window.inspectUserData('${acc.email}')" title="Xem & Quản lý các lớp của tài khoản này">
                          <i class="fa-solid fa-eye"></i> Xem Lớp
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.openAdminEditModal('${acc.id}')">
                          <i class="fa-solid fa-user-gear"></i> Quản lý
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.quickDeleteAdminUser('${acc.id}')" title="Xóa tài khoản">
                          <i class="fa-solid fa-trash"></i>
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

  /* --------------------------------------------------------------------------
     6. MODAL & USER ACTIONS HANDLERS
     -------------------------------------------------------------------------- */

  // GOOGLE LOGIN FLOW
  function openGoogleAuthModal() {
    const modal = document.getElementById('google-auth-modal');
    const container = document.getElementById('google-accounts-list');
    if (!modal || !container) return;

    container.innerHTML = accountsList.map(acc => `
      <div class="google-account-card" onclick="window.selectGoogleAccount('${acc.id}')">
        <img src="${acc.avatar}" alt="Avatar" class="account-avatar">
        <div class="account-info">
          <div class="name">${acc.holyName ? acc.holyName + ' ' : ''}${acc.name}</div>
          <div class="email">${acc.email}</div>
          <span class="role-tag">${acc.role === 'Admin' ? '👑 Tài khoản Admin' : '⛪ Giáo lý viên'}</span>
        </div>
        ${acc.status === 'suspended' ? '<span class="badge badge-danger">Tạm khóa</span>' : '<i class="fa-solid fa-chevron-right text-muted"></i>'}
      </div>
    `).join('');

    openModal('google-auth-modal');
  }

  window.selectGoogleAccount = function (accId) {
    const target = accountsList.find(a => a.id === accId);
    if (!target) return;

    if (target.status === 'suspended') {
      alert('Tài khoản Google này đang bị TẠM KHÓA bởi Admin.');
      return;
    }

    loginWithAccount(target);
    closeModal('google-auth-modal');
  };

  function loginWithAccount(acc) {
    // Check if existing
    let match = accountsList.find(a => a.email.toLowerCase() === acc.email.toLowerCase());
    if (!match) {
      match = acc;
      accountsList.push(match);
    } else {
      match.lastLogin = new Date().toLocaleString();
      match.loginCount = (match.loginCount || 0) + 1;
    }

    saveAccounts();
    currentUser = match;
    saveCurrentUser();
    loadUserData(currentUser.email);

    renderAppHeaderAndSidebar();
    navigateTo(activePage);
    showToast(`Đã đăng nhập thành công tài khoản: ${currentUser.name}`, 'success');
  }

  // STUDENT MODAL & PHOTO UPLOAD HANDLERS
  window.openAddStudentModal = function () {
    const form = document.getElementById('student-form');
    if (form) form.reset();
    document.getElementById('student-form-id').value = '';
    document.getElementById('student-modal-title').innerHTML = '<i class="fa-solid fa-user-plus"></i> Thêm Học Viên Mới';
    const previewEl = document.getElementById('std-photo-preview');
    if (previewEl) previewEl.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const photoUrlEl = document.getElementById('std-photo-url');
    if (photoUrlEl) photoUrlEl.value = '';

    const select = document.getElementById('std-class');
    if (select) {
      select.innerHTML = appData.classes.map(c => `<option value="${c.id}">${c.name} (${c.grade})</option>`).join('');
    }

    openModal('student-modal');
  };

  window.editStudent = function (stdId) {
    const student = appData.students.find(s => s.id === stdId);
    if (!student) return;

    document.getElementById('student-form-id').value = student.id;
    document.getElementById('student-modal-title').innerHTML = '<i class="fa-solid fa-user-pen"></i> Chỉnh Sửa Sơ Yếu Lý Lịch Học Viên';

    const select = document.getElementById('std-class');
    if (select) {
      select.innerHTML = appData.classes.map(c => `<option value="${c.id}" ${c.id === student.classId ? 'selected' : ''}>${c.name} (${c.grade})</option>`).join('');
    }

    document.getElementById('std-code').value = student.code || '';
    document.getElementById('std-holyname').value = student.holyName || '';
    document.getElementById('std-fullname').value = student.fullName || '';
    document.getElementById('std-gender').value = student.gender || 'Nam';
    document.getElementById('std-dob').value = student.dob || '';
    const subparishEl = document.getElementById('std-subparish');
    if (subparishEl) subparishEl.value = student.subParish || '';
    document.getElementById('std-address').value = student.address || '';

    const previewEl = document.getElementById('std-photo-preview');
    const photoUrlEl = document.getElementById('std-photo-url');
    if (previewEl) previewEl.src = student.photo || (student.gender === 'Nữ' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80');
    if (photoUrlEl) photoUrlEl.value = student.photo || '';

    document.getElementById('std-father').value = student.fatherName || '';
    document.getElementById('std-father-phone').value = student.fatherPhone || '';
    document.getElementById('std-mother').value = student.motherName || '';
    document.getElementById('std-mother-phone').value = student.motherPhone || '';

    openModal('student-modal');
  };

  function handleSaveStudent(e) {
    e.preventDefault();
    const id = document.getElementById('student-form-id').value;
    const existingStudent = appData.students.find(s => s.id === id);
    const photoVal = document.getElementById('std-photo-url') ? document.getElementById('std-photo-url').value : '';
    const subParishVal = document.getElementById('std-subparish') ? document.getElementById('std-subparish').value.trim() : '';

    const stdData = {
      id: id || 'std_' + Date.now(),
      code: document.getElementById('std-code').value.trim(),
      classId: document.getElementById('std-class').value,
      holyName: document.getElementById('std-holyname').value.trim(),
      fullName: document.getElementById('std-fullname').value.trim(),
      gender: document.getElementById('std-gender').value,
      dob: document.getElementById('std-dob').value,
      subParish: subParishVal,
      address: document.getElementById('std-address').value.trim(),
      photo: photoVal || (existingStudent ? existingStudent.photo : ''),
      fatherName: document.getElementById('std-father').value.trim(),
      fatherPhone: document.getElementById('std-father-phone').value.trim(),
      motherName: document.getElementById('std-mother').value.trim(),
      motherPhone: document.getElementById('std-mother-phone').value.trim(),
      sacraments: {
        baptized: document.getElementById('sac-baptized').checked,
        eucharist: document.getElementById('sac-eucharist').checked,
        confirmed: document.getElementById('sac-confirmed').checked,
        solemn: document.getElementById('sac-solemn').checked
      },
      grades: existingStudent ? existingStudent.grades : { semester1: calculateStudentGrade(0, 0, 0, 0), semester2: calculateStudentGrade(0, 0, 0, 0), average: 0.0, rank: 'Yếu' },
      conduct: existingStudent ? existingStudent.conduct : { virtueScore: 90, massAttendance: '100%', remarks: 'Chăm chỉ' }
    };

    if (id) {
      const idx = appData.students.findIndex(s => s.id === id);
      if (idx !== -1) appData.students[idx] = stdData;
    } else {
      appData.students.push(stdData);
    }

    saveUserData();
    closeModal('student-modal');
    if (activePage === 'students') renderStudents(document.getElementById('content-area'));
    showToast('Đã lưu thông tin học viên thành công!', 'success');
  }

  window.deleteStudent = function (stdId) {
    const std = (appData.students || []).find(s => s.id === stdId || String(s.id) === String(stdId));
    const name = std ? `${std.holyName ? std.holyName + ' ' : ''}${std.fullName || std.name || ''}` : 'học viên này';
    const performDelete = function() {
      appData.students = (appData.students || []).filter(s => s.id !== stdId && String(s.id) !== String(stdId));
      saveUserData();
      if (activePage === 'students') renderStudents(document.getElementById('content-area'));
      if (activePage === 'classes') renderClasses(document.getElementById('content-area'));
      showToast(`Đã xóa học viên "${name}" thành công!`, 'warning');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Xóa Học Viên',
        `Bạn có chắc chắn muốn xóa học viên "${name}" khỏi hệ thống?`,
        performDelete
      );
    } else if (window.confirm(`Xóa Học Viên: Bạn có chắc chắn muốn xóa học viên "${name}" khỏi hệ thống?`)) {
      performDelete();
    }
  };

  // CLASS MODAL HANDLERS
  window.openAddClassModal = function () {
    const form = document.getElementById('class-form');
    if (form) form.reset();
    document.getElementById('class-form-id').value = '';
    openModal('class-modal');
  };

  window.editClass = function (clsId) {
    const cls = appData.classes.find(c => c.id === clsId);
    if (!cls) return;
    document.getElementById('class-form-id').value = cls.id;
    document.getElementById('cls-name').value = cls.name;
    document.getElementById('cls-grade').value = cls.grade || 'Khai Tâm';
    document.getElementById('cls-room').value = cls.room || '';
    document.getElementById('cls-schedule').value = cls.schedule || '';
    document.getElementById('cls-teacher').value = cls.teacher || '';
    openModal('class-modal');
  };

  window.deleteClass = function (clsId) {
    if (!clsId) return;
    const rawId = String(clsId).trim();
    let decodedId = rawId;
    try { decodedId = decodeURIComponent(rawId); } catch (e) {}

    const cls = (appData.classes || []).find(c =>
      c && (
        c.id === rawId ||
        c.id === decodedId ||
        String(c.id) === rawId ||
        String(c.id) === decodedId ||
        c.name === rawId ||
        c.name === decodedId
      )
    );

    const targetId = cls ? cls.id : (rawId !== decodedId ? decodedId : rawId);
    const targetName = cls ? cls.name : (decodedId || rawId);

    const performDelete = function () {
      appData.classes = (appData.classes || []).filter(c => {
        if (!c) return false;
        if (targetId && (c.id === targetId || String(c.id) === String(targetId))) return false;
        if (targetName && c.name === targetName) return false;
        return true;
      });

      if (Array.isArray(appData.students)) {
        appData.students.forEach(s => {
          if ((targetId && (s.classId === targetId || String(s.classId) === String(targetId))) || (targetName && s.className === targetName)) {
            s.classId = '';
            s.className = 'Chưa xếp lớp';
          }
        });
      }

      saveUserData();

      const container = document.getElementById('content-area');
      if (activePage === 'classes' && container) renderClasses(container);
      if (activePage === 'students' && container) renderStudents(container);
      if (typeof renderOverview === 'function' && activePage === 'overview' && container) renderOverview(container);

      showToast(`Đã xóa lớp học "${targetName}" thành công!`, 'warning');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Xóa Lớp Học',
        `Bạn có chắc chắn muốn xóa lớp "${targetName}" khỏi hệ thống? Tất cả học viên thuộc lớp này sẽ chuyển về Chưa xếp lớp.`,
        performDelete
      );
    } else if (window.confirm(`Xóa Lớp Học: Bạn có chắc chắn muốn xóa lớp "${targetName}" khỏi hệ thống?`)) {
      performDelete();
    }
  };

  function handleSaveClass(e) {
    e.preventDefault();
    const id = document.getElementById('class-form-id').value;

    const clsData = {
      id: id || 'cls_' + Date.now(),
      name: document.getElementById('cls-name').value.trim(),
      grade: document.getElementById('cls-grade').value,
      room: document.getElementById('cls-room').value.trim() || 'Phòng 101',
      schedule: document.getElementById('cls-schedule').value.trim() || 'Chúa Nhật (08:00 - 09:30)',
      teacher: document.getElementById('cls-teacher').value.trim() || currentUser.name,
      studentCount: 0
    };

    if (id) {
      const idx = appData.classes.findIndex(c => c.id === id);
      if (idx !== -1) appData.classes[idx] = clsData;
    } else {
      appData.classes.push(clsData);
    }

    saveUserData();
    closeModal('class-modal');
    if (activePage === 'classes') renderClasses(document.getElementById('content-area'));
    showToast('Đã lưu thông tin lớp học thành công!', 'success');
  }

  // CATECHIST CRUD HANDLERS
  window.openAddCatechistModal = function() {
    const form = document.getElementById('catechist-form');
    if (form) form.reset();
    document.getElementById('cat-form-id').value = '';
    openModal('catechist-modal');
  };

  window.editCatechist = function(catId) {
    const cat = appData.catechists.find(c => c.id === catId);
    if (!cat) return;
    document.getElementById('cat-form-id').value = cat.id;
    document.getElementById('cat-holyname').value = cat.holyName || '';
    document.getElementById('cat-fullname').value = cat.fullName || '';
    document.getElementById('cat-role').value = cat.role || 'Huấn Luyện Viên';
    document.getElementById('cat-phone').value = cat.phone || '';
    document.getElementById('cat-email').value = cat.email || '';
    document.getElementById('cat-class').value = cat.assignedClass || '';
    openModal('catechist-modal');
  };

  window.deleteCatechist = function(catId) {
    const cat = (appData.catechists || []).find(c => c.id === catId || String(c.id) === String(catId));
    const name = cat ? `${cat.holyName ? cat.holyName + ' ' : ''}${cat.fullName || cat.name || ''}` : 'Giáo lý viên này';
    const performDelete = function() {
      appData.catechists = (appData.catechists || []).filter(c => c.id !== catId && String(c.id) !== String(catId));
      saveUserData();
      if (activePage === 'catechists') renderCatechists(document.getElementById('content-area'));
      showToast(`Đã xóa Giáo lý viên "${name}" thành công!`, 'warning');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Xóa Giáo Lý Viên',
        `Bạn có chắc chắn muốn xóa Giáo lý viên "${name}" khỏi hệ thống?`,
        performDelete
      );
    } else if (window.confirm(`Xóa Giáo Lý Viên: Bạn có chắc chắn muốn xóa Giáo lý viên "${name}" khỏi hệ thống?`)) {
      performDelete();
    }
  };

  window.saveCatechistForm = function(e) {
    e.preventDefault();
    const id = document.getElementById('cat-form-id').value;
    const catData = {
      id: id || 'cat_' + Date.now(),
      holyName: document.getElementById('cat-holyname').value.trim(),
      fullName: document.getElementById('cat-fullname').value.trim(),
      role: document.getElementById('cat-role').value,
      phone: document.getElementById('cat-phone').value.trim(),
      email: document.getElementById('cat-email').value.trim(),
      assignedClass: document.getElementById('cat-class').value.trim()
    };

    if (id) {
      const idx = appData.catechists.findIndex(c => c.id === id);
      if (idx !== -1) appData.catechists[idx] = catData;
    } else {
      appData.catechists.push(catData);
    }

    saveUserData();
    closeModal('catechist-modal');
    if (activePage === 'catechists') renderCatechists(document.getElementById('content-area'));
    showToast('Đã lưu thông tin Giáo lý viên!', 'success');
  };

  // LIBRARY CRUD HANDLERS
  window.openAddLibraryModal = function() {
    const form = document.getElementById('library-form');
    if (form) form.reset();
    document.getElementById('lib-form-id').value = '';
    openModal('library-modal');
  };

  window.editLibrary = function(libId) {
    const lib = (appData.libraryMaterials || []).find(l => l.id === libId);
    if (!lib) return;
    document.getElementById('lib-form-id').value = lib.id;
    document.getElementById('lib-title').value = lib.title || '';
    document.getElementById('lib-format').value = lib.format || 'PDF';
    document.getElementById('lib-grade').value = lib.grade || 'Chung';
    document.getElementById('lib-desc').value = lib.desc || '';
    openModal('library-modal');
  };

  window.deleteLibrary = function(libId) {
    const lib = (appData.libraryMaterials || []).find(l => l.id === libId || String(l.id) === String(libId));
    const name = lib ? lib.title : 'học liệu này';
    const performDelete = function() {
      appData.libraryMaterials = (appData.libraryMaterials || []).filter(l => l.id !== libId && String(l.id) !== String(libId));
      saveUserData();
      if (activePage === 'library') renderLibrary(document.getElementById('content-area'));
      showToast(`Đã xóa học liệu "${name}" thành công!`, 'warning');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Xóa Học Liệu',
        `Bạn có chắc chắn muốn xóa học liệu "${name}" khỏi thư viện?`,
        performDelete
      );
    } else if (window.confirm(`Xóa Học Liệu: Bạn có chắc chắn muốn xóa học liệu "${name}" khỏi thư viện?`)) {
      performDelete();
    }
  };

  window.saveLibraryForm = function(e) {
    e.preventDefault();
    const id = document.getElementById('lib-form-id').value;
    const libData = {
      id: id || 'lib_' + Date.now(),
      title: document.getElementById('lib-title').value.trim(),
      format: document.getElementById('lib-format').value,
      grade: document.getElementById('lib-grade').value,
      desc: document.getElementById('lib-desc').value.trim()
    };

    if (!appData.libraryMaterials) appData.libraryMaterials = [];
    if (id) {
      const idx = appData.libraryMaterials.findIndex(l => l.id === id);
      if (idx !== -1) appData.libraryMaterials[idx] = libData;
    } else {
      appData.libraryMaterials.push(libData);
    }

    saveUserData();
    closeModal('library-modal');
    if (activePage === 'library') renderLibrary(document.getElementById('content-area'));
    showToast('Đã lưu học liệu thành công!', 'success');
  };

  // QUIZ CRUD HANDLERS
  window.openAddQuizModal = function() {
    const form = document.getElementById('quiz-form');
    if (form) form.reset();
    document.getElementById('quiz-form-id').value = '';
    openModal('quiz-modal');
  };

  window.editQuiz = function(qId) {
    const quiz = (appData.quizzes || []).find(q => q.id === qId);
    if (!quiz) return;
    document.getElementById('quiz-form-id').value = quiz.id;
    document.getElementById('quiz-title').value = quiz.title || '';
    document.getElementById('quiz-grade').value = quiz.grade || 'Thiếu Nhi';
    document.getElementById('quiz-count').value = quiz.count || 20;
    document.getElementById('quiz-content').value = quiz.content || '';
    openModal('quiz-modal');
  };

  window.deleteQuiz = function(qId) {
    const quiz = (appData.quizzes || []).find(q => q.id === qId || String(q.id) === String(qId));
    const name = quiz ? quiz.title : 'đề thi này';
    const performDelete = function() {
      appData.quizzes = (appData.quizzes || []).filter(q => q.id !== qId && String(q.id) !== String(qId));
      saveUserData();
      if (activePage === 'quizzes') renderQuizzes(document.getElementById('content-area'));
      showToast(`Đã xóa đề thi "${name}" thành công!`, 'warning');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Xóa Đề Thi',
        `Bạn có chắc chắn muốn xóa đề thi "${name}" khỏi hệ thống?`,
        performDelete
      );
    } else if (window.confirm(`Xóa Đề Thi: Bạn có chắc chắn muốn xóa đề thi "${name}" khỏi hệ thống?`)) {
      performDelete();
    }
  };

  window.saveQuizForm = function(e) {
    e.preventDefault();
    const id = document.getElementById('quiz-form-id').value;
    const quizData = {
      id: id || 'quiz_' + Date.now(),
      title: document.getElementById('quiz-title').value.trim(),
      grade: document.getElementById('quiz-grade').value,
      count: parseInt(document.getElementById('quiz-count').value) || 20,
      content: document.getElementById('quiz-content').value.trim()
    };

    if (!appData.quizzes) appData.quizzes = [];
    if (id) {
      const idx = appData.quizzes.findIndex(q => q.id === id);
      if (idx !== -1) appData.quizzes[idx] = quizData;
    } else {
      appData.quizzes.push(quizData);
    }

    saveUserData();
    closeModal('quiz-modal');
    if (activePage === 'quizzes') renderQuizzes(document.getElementById('content-area'));
    showToast('Đã lưu đề thi thành công!', 'success');
  };

  // NOTIFICATION CRUD HANDLERS
  window.openAddNotificationModal = function() {
    const form = document.getElementById('notification-form');
    if (form) form.reset();
    document.getElementById('ntf-form-id').value = '';
    openModal('notification-modal');
  };

  window.editNotification = function(nId) {
    const ntf = appData.notifications.find(n => n.id === nId);
    if (!ntf) return;
    document.getElementById('ntf-form-id').value = ntf.id;
    document.getElementById('ntf-title').value = ntf.title || '';
    document.getElementById('ntf-category').value = ntf.category || '📢 Thông báo chung';
    document.getElementById('ntf-content').value = ntf.content || '';
    openModal('notification-modal');
  };

  window.deleteNotification = function(nId) {
    const ntf = (appData.notifications || []).find(n => n.id === nId || String(n.id) === String(nId));
    const name = ntf ? ntf.title : 'thông báo này';
    const performDelete = function() {
      appData.notifications = (appData.notifications || []).filter(n => n.id !== nId && String(n.id) !== String(nId));
      saveUserData();
      renderAppHeaderAndSidebar();
      if (activePage === 'notifications') renderNotifications(document.getElementById('content-area'));
      showToast(`Đã xóa thông báo "${name}" thành công!`, 'warning');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Xóa Thông Báo',
        `Bạn có chắc chắn muốn xóa thông báo "${name}"?`,
        performDelete
      );
    } else if (window.confirm(`Xóa Thông Báo: Bạn có chắc chắn muốn xóa thông báo "${name}"?`)) {
      performDelete();
    }
  };

  window.saveNotificationForm = function(e) {
    e.preventDefault();
    const id = document.getElementById('ntf-form-id').value;
    const ntfData = {
      id: id || 'ntf_' + Date.now(),
      title: document.getElementById('ntf-title').value.trim(),
      category: document.getElementById('ntf-category').value,
      content: document.getElementById('ntf-content').value.trim(),
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };

    if (id) {
      const idx = appData.notifications.findIndex(n => n.id === id);
      if (idx !== -1) appData.notifications[idx] = ntfData;
    } else {
      appData.notifications.push(ntfData);
    }

    saveUserData();
    closeModal('notification-modal');
    renderAppHeaderAndSidebar();
    if (activePage === 'notifications') renderNotifications(document.getElementById('content-area'));
    showToast('Đã gửi thông báo thành công!', 'success');
  };

  // EXCEL & CSV ROSTER IMPORT & TEMPLATE DOWNLOAD ENGINE
  window.downloadCSVTemplate = function() {
    const headers = ["Tên Thánh", "Họ và Tên", "Giới Tính", "Ngày Sinh (YYYY-MM-DD)", "Tên Cha", "SĐT Cha", "Tên Mẹ", "SĐT Mẹ", "Giáo Khóm", "Số Điện Thoại", "Địa Chỉ", "Lớp Học"];
    const sample1 = ["T. Maria", "Nguyễn Thị Mai", "Nữ", "2014-04-15", "T. Giuse Nguyễn Văn Hùng", "0905123456", "T. Anna Lê Thị Hương", "0914987654", "Giáo khóm 1", "0905123456", "120 Tôn Đức Thắng Đà Nẵng", "Thiếu Nhi 2B"];
    const sample2 = ["T. Giuse", "Trần Minh Đạt", "Nam", "2014-08-22", "T. Phêrô Trần Văn Long", "0905888999", "T. Maria Phạm Thị Thu", "0905777666", "Giáo khóm 2", "0905888999", "45 Phạm Như Xương Đà Nẵng", "Thiếu Nhi 2B"];
    
    if (typeof XLSX !== 'undefined') {
      const wsData = [headers, sample1, sample2];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh Sach Hoc Vien");
      XLSX.writeFile(wb, "Mau_Danh_Sach_Hoc_Vien_MagnificatEdu.xlsx");
      showToast("Đã tải xuống file mẫu Excel (.xlsx) thành công!", "success");
    } else {
      const csvContent = "\uFEFF" + [headers.join(","), sample1.join(","), sample2.join(",")].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau_Danh_Sach_Hoc_Vien_MagnificatEdu.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Đã tải xuống file mẫu Excel/CSV thành công!", "success");
    }
  };

  window.openCSVImportModal = function() {
    const previewCont = document.getElementById('csv-preview-container');
    const confirmBtn = document.getElementById('btn-confirm-csv-import');
    if (previewCont) previewCont.style.display = 'none';
    if (confirmBtn) confirmBtn.style.display = 'none';
    window._pendingCSVStudents = [];
    openModal('csv-upload-modal');
  };

  window.handleCSVFileSelected = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        let rows = [];
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (typeof XLSX !== 'undefined') {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        } else {
          const text = new TextDecoder('utf-8').decode(evt.target.result);
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          rows = lines.map(line => line.split(',').map(c => c.replace(/^["']|["']$/g, '').trim()));
        }

        if (!rows || rows.length <= 1) {
          alert('File Excel không chứa dữ liệu hoặc sai định dạng!');
          return;
        }

        window._pendingCSVStudents = [];
        const tbody = document.getElementById('csv-preview-body');
        if (tbody) tbody.innerHTML = '';

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (!cols || cols.length < 2) continue;

          const holyName = (cols[0] || 'T. Giuse').toString().trim();
          const fullName = (cols[1] || 'Học viên').toString().trim();
          const gender = (cols[2] || 'Nam').toString().trim();
          const dob = (cols[3] || '2015-01-01').toString().trim();
          const fatherName = (cols[4] || '').toString().trim();
          const fatherPhone = (cols[5] || '').toString().trim();
          const motherName = (cols[6] || '').toString().trim();
          const motherPhone = (cols[7] || '').toString().trim();
          const subParish = (cols[8] || 'Giáo khóm 1').toString().trim();
          const phone = (cols[9] || '').toString().trim();
          const address = (cols[10] || '').toString().trim();
          const className = (cols[11] || 'Lớp Giáo Lý Mới').toString().trim();

          const item = { holyName, fullName, gender, dob, fatherName, fatherPhone, motherName, motherPhone, subParish, phone, address, className };
          window._pendingCSVStudents.push(item);

          if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${holyName}</strong></td>
              <td>${fullName}</td>
              <td>${gender}</td>
              <td>${dob}</td>
              <td>${fatherName ? fatherName + ' / ' + motherName : '---'}</td>
              <td>${subParish}</td>
              <td><span class="badge badge-primary">${className}</span></td>
            `;
            tbody.appendChild(tr);
          }
        }

        const countSpan = document.getElementById('csv-preview-count');
        if (countSpan) countSpan.textContent = window._pendingCSVStudents.length;

        const previewCont = document.getElementById('csv-preview-container');
        const confirmBtn = document.getElementById('btn-confirm-csv-import');
        if (previewCont) previewCont.style.display = 'block';
        if (confirmBtn) {
          confirmBtn.style.display = 'inline-flex';
          confirmBtn.style.alignItems = 'center';
          confirmBtn.style.gap = '8px';
          setTimeout(() => {
            confirmBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
        showToast(`Đã nhận diện thành công ${window._pendingCSVStudents.length} học viên từ file Excel!`, 'info');
      } catch (err) {
        console.error('Lỗi đọc file Excel:', err);
        alert('Đã xảy ra lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng file!');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  window.confirmImportCSVData = function() {
    if (!window._pendingCSVStudents || window._pendingCSVStudents.length === 0) {
      alert('Chưa có học viên nào để tải lên!');
      return;
    }

    let addedCount = 0;
    window._pendingCSVStudents.forEach((item, index) => {
      let cls = appData.classes.find(c => c.name.toLowerCase() === item.className.toLowerCase());
      if (!cls) {
        cls = {
          id: 'cls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: item.className,
          grade: 'Giáo Lý',
          room: 'Phòng 101',
          schedule: 'Chúa Nhật (08:00 - 09:30)',
          teacher: currentUser.name,
          studentCount: 0
        };
        appData.classes.push(cls);
      }

      const std = {
        id: 'std_' + Date.now() + '_' + index,
        code: 'HV' + (Date.now().toString().slice(-4)) + String(index + 1).padStart(3, '0'),
        classId: cls.id,
        holyName: item.holyName,
        fullName: item.fullName,
        gender: item.gender,
        dob: item.dob,
        address: item.address,
        subParish: item.subParish,
        fatherName: item.fatherName,
        fatherPhone: item.fatherPhone,
        motherName: item.motherName,
        motherPhone: item.motherPhone,
        sacraments: { baptized: true, eucharist: true, confirmed: false, solemn: false },
        grades: { semester1: calculateStudentGrade(0, 0, 0, 0), semester2: calculateStudentGrade(0, 0, 0, 0), average: 0.0, rank: 'Yếu' },
        conduct: { virtueScore: 90, massAttendance: '100%', remarks: 'Ngoan ngoãn' }
      };

      appData.students.push(std);
      cls.studentCount = (cls.studentCount || 0) + 1;
      addedCount++;
    });

    saveUserData();
    closeModal('csv-upload-modal');
    renderAppHeaderAndSidebar();
    navigateTo(activePage);
    showToast(`Đã tải lên thành công ${addedCount} học viên và phân lớp tự động!`, 'success');
  };

  window.confirmResetAllUserData = function() {
    const performReset = function() {
      appData = generateDefaultUserData(currentUser.email);
      saveUserData();
      renderAppHeaderAndSidebar();
      navigateTo(activePage);
      showToast('Đã reset toàn bộ dữ liệu về trạng thái trắng thành công!', 'success');
    };

    if (typeof window.showConfirmDialog === 'function') {
      window.showConfirmDialog(
        'Reset Dữ Liệu Về Trắng',
        'Bạn có chắc chắn muốn XÓA TOÀN BỘ dữ liệu hiện tại để thiết lập dữ liệu lại từ đầu không?',
        performReset
      );
    } else if (window.confirm('Reset Dữ Liệu Về Trắng: Bạn có chắc chắn muốn XÓA TOÀN BỘ dữ liệu hiện tại để thiết lập dữ liệu lại từ đầu không?')) {
      performReset();
    }
  };

  // CERTIFICATE PREVIEW ENGINE
  window.previewCertificate = function () {
    const stdSelect = document.getElementById('cert-student-select');
    if (!stdSelect) return;

    const stdId = stdSelect.value;
    const student = appData.students.find(s => s.id === stdId);
    if (!student) return;

    const cls = appData.classes.find(c => c.id === student.classId);

    const certParish = document.getElementById('cert-parish-title');
    const certRecipient = document.getElementById('cert-student-name');
    const certDob = document.getElementById('cert-dob');
    const certClass = document.getElementById('cert-class');
    const certGradeRank = document.getElementById('cert-grade-rank');

    if (certParish) certParish.textContent = `${appData.parishInfo.name.toUpperCase()} — ${appData.parishInfo.diocese.toUpperCase()}`;
    if (certRecipient) certRecipient.textContent = `${student.holyName.toUpperCase()} ${student.fullName.toUpperCase()}`;
    if (certDob) certDob.textContent = student.dob || '15/04/2014';
    if (certClass) certClass.textContent = cls ? cls.name : 'Giáo lý';
    if (certGradeRank) certGradeRank.textContent = (student.grades ? student.grades.rank : 'XUẤT SẮC').toUpperCase();

    openModal('certificate-modal');
  };

  // ADMIN USER EDIT HANDLERS
  window.openAdminEditModal = function (accId) {
    const acc = accountsList.find(a => a.id === accId);
    if (!acc) return;

    document.getElementById('admin-target-id').value = acc.id;
    document.getElementById('admin-target-avatar').src = acc.avatar;
    document.getElementById('admin-target-name').textContent = acc.name;
    document.getElementById('admin-target-email').textContent = acc.email;
    document.getElementById('admin-target-fullname').value = (acc.holyName ? acc.holyName + ' ' : '') + acc.name;
    document.getElementById('admin-target-role').value = acc.role;
    document.getElementById('admin-target-status').value = acc.status;

    openModal('admin-user-modal');
  };

  function handleSaveAdminUser(e) {
    e.preventDefault();
    const accId = document.getElementById('admin-target-id').value;
    const acc = accountsList.find(a => a.id === accId);
    if (!acc) return;

    acc.role = document.getElementById('admin-target-role').value;
    acc.status = document.getElementById('admin-target-status').value;

    saveAccounts();
    closeModal('admin-user-modal');
    if (activePage === 'admin-users') renderAdminUsers(document.getElementById('content-area'));
    showToast(`Đã cập nhật trạng thái tài khoản ${acc.name}!`, 'success');
  }

  // ACCOUNT DELETION LOGIC WITH CUSTOM CONFIRMATION MODAL
  let pendingDeleteAccId = null;

  window.confirmDeleteAccount = function (accId) {
    if (!accId) return;
    const acc = accountsList.find(a => a.id === accId || a.email.toLowerCase() === accId.toLowerCase());
    if (!acc) return;

    if (currentUser && acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
      alert('Bạn không thể xóa tài khoản Admin hiện đang đăng nhập!');
      return;
    }

    pendingDeleteAccId = acc.id;

    const doDeleteBtn = document.getElementById('confirm-do-delete-btn');
    if (doDeleteBtn) {
      doDeleteBtn.setAttribute('data-target-id', acc.id);
    }

    const targetName = document.getElementById('confirm-target-name');
    const targetEmail = document.getElementById('confirm-target-email');
    if (targetName) targetName.textContent = (acc.holyName ? acc.holyName + ' ' : '') + acc.name;
    if (targetEmail) targetEmail.textContent = acc.email;

    openModal('custom-confirm-modal');
  };

  window.executeAccountDeletion = function (btnElement) {
    try {
      const targetId = (btnElement && btnElement.getAttribute('data-target-id')) || pendingDeleteAccId;
      if (!targetId) {
        alert('Không xác định được tài khoản cần xóa!');
        closeModal('custom-confirm-modal');
        return;
      }

      const accIndex = accountsList.findIndex(a => a.id === targetId || a.email.toLowerCase() === targetId.toLowerCase());
      if (accIndex === -1) {
        alert('Tài khoản này không tồn tại hoặc đã bị xóa!');
        closeModal('custom-confirm-modal');
        return;
      }

      const targetAcc = accountsList[accIndex];
      if (currentUser && targetAcc.email.toLowerCase() === currentUser.email.toLowerCase()) {
        alert('Bạn không thể xóa tài khoản Admin đang sử dụng!');
        closeModal('custom-confirm-modal');
        return;
      }

      const deletedAcc = accountsList.splice(accIndex, 1)[0];
      saveAccounts();

      if (deletedAcc && deletedAcc.email) {
        const userKey = STORAGE_PREFIX_DATA + deletedAcc.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        localStorage.removeItem(userKey);
      }

      closeModal('admin-user-modal');
      closeModal('custom-confirm-modal');

      const contentArea = document.getElementById('content-area');
      if (contentArea && activePage === 'admin-users') {
        renderAdminUsers(contentArea);
      }

      showToast(`Đã xóa thành công tài khoản ${deletedAcc.name} (${deletedAcc.email}) khỏi hệ thống!`, 'danger');
    } catch (err) {
      console.error('Failure in executeAccountDeletion:', err);
      alert('Đã xảy ra lỗi khi xóa tài khoản: ' + err.message);
    }
  };

  // Compatibility wrappers
  window.deleteAdminUser = function (e) {
    if (e) e.preventDefault();
    const accId = document.getElementById('admin-target-id').value;
    window.confirmDeleteAccount(accId);
  };

  window.quickDeleteAdminUser = function (accId) {
    window.confirmDeleteAccount(accId);
  };

  // ADMIN MASTER TOOLS & INSPECTION
  window.inspectUserData = function(targetEmail) {
    if (!targetEmail) return;
    window.adminInspectingEmail = targetEmail;
    loadUserData(targetEmail);
    renderAppHeaderAndSidebar();
    navigateTo('classes');
    showToast(`Đã chuyển sang xem dữ liệu lớp của tài khoản: ${targetEmail}`, 'info');
  };

  window.exitAdminInspection = function() {
    window.adminInspectingEmail = null;
    loadUserData(currentUser.email);
    renderAppHeaderAndSidebar();
    navigateTo('admin');
    showToast('Đã quay lại dữ liệu của Admin Master', 'success');
  };

  window.refreshAdminCloudData = function() {
    showToast('Đang tải lại dữ liệu mới nhất từ Supabase Cloud...', 'info');
    const container = document.getElementById('content-area');
    if (container) renderAdminUsers(container);
  };

  window.exportParishMasterExcel = async function() {
    if (!window.supabaseClient) {
      alert('Chưa kết nối Supabase Cloud để tải dữ liệu toàn giáo xứ.');
      return;
    }
    showToast('Đang tổng hợp dữ liệu toàn Giáo xứ từ Cloud...', 'info');
    try {
      const { data, error } = await window.supabaseClient.from('user_data').select('*');
      if (error || !data) throw error || new Error('Không thể tải dữ liệu');

      const allRows = [];
      data.forEach(row => {
        const uData = row.data;
        const email = row.email;
        const teacherName = (row.account_info && row.account_info.name ? row.account_info.name : email);
        if (uData && Array.isArray(uData.students)) {
          uData.students.forEach((s, idx) => {
            const cls = (uData.classes || []).find(c => c.id === s.classId);
            allRows.push({
              'STT': idx + 1,
              'Giáo Lý Viên Phụ Trách': teacherName,
              'Email': email,
              'Tên Lớp': cls ? cls.name : (s.classId || 'Chưa xếp lớp'),
              'Mã Học Viên': s.code || ('HV' + s.id),
              'Tên Thánh': s.holyName || '',
              'Họ và Tên': s.name || '',
              'Giới Tính': s.gender || '',
              'Ngày Sinh': s.dob || '',
              'Tên Cha/Mẹ': s.parentName || s.phone || '',
              'Điểm TB HK1': s.grades && s.grades.semester1 ? s.grades.semester1.average : '0.0',
              'Điểm TB HK2': s.grades && s.grades.semester2 ? s.grades.semester2.average : '0.0',
              'Đánh Giá/Xếp Loại': s.grades && s.grades.semester2 ? s.grades.semester2.rank : 'Chưa xếp loại'
            });
          });
        }
      });

      if (allRows.length === 0) {
        alert('Chưa có dữ liệu học viên nào trong toàn bộ hệ thống Giáo xứ.');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(allRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "BaoCao_ToanGiaoXu");
      XLSX.writeFile(wb, `MagnificatEdu_BaoCao_ToanGiaoXu_${new Date().toISOString().slice(0,10)}.xlsx`);
      showToast('✓ Đã xuất thành công Báo Cáo Excel Toàn Giáo Xứ!', 'success');
    } catch (err) {
      alert('Lỗi khi tải dữ liệu từ Cloud: ' + err.message);
    }
  };

  // UTILITY HELPER FUNCTIONS

  function showToast(msg, type = 'primary') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    let iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'info') iconClass = 'fa-circle-info';

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${msg}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-15px) scale(0.95)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  }

  function flashButtonSuccess(btn, customMsg) {
    if (!btn) return;
    const origHtml = btn.innerHTML;
    btn.classList.add('btn-success-flash');
    btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${customMsg || 'Đã Lưu Thành Công!'}`;
    setTimeout(() => {
      btn.classList.remove('btn-success-flash');
      btn.innerHTML = origHtml;
    }, 2800);
  }
  window.flashButtonSuccess = flashButtonSuccess;

  // IMAGE COMPRESSION UTILITY (Prevents LocalStorage Quota Exceeded error)
  function compressImage(base64Str, maxWidth = 300, maxHeight = 300, quality = 0.85, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      callback(base64Str);
    };
  }

  // USER PROFILE EDITING LOGIC & AVATAR UPLOAD
  let uploadedUserAvatarBase64 = null;

  window.openUserProfileModal = function () {
    if (!currentUser) return;

    const holyInput = document.getElementById('prof-holyname');
    const nameInput = document.getElementById('prof-fullname');
    const phoneInput = document.getElementById('prof-phone');
    const roleInput = document.getElementById('prof-role');
    const emailInput = document.getElementById('prof-email');
    const avatarPreview = document.getElementById('profile-avatar-preview');

    if (holyInput) holyInput.value = currentUser.holyName || 'T. Giuse';
    if (nameInput) nameInput.value = currentUser.name || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '0905 123 456';
    if (roleInput) roleInput.value = currentUser.email.toLowerCase() === 'philthienhao@gmail.com' ? 'Admin' : (currentUser.role || 'Giáo lý viên');
    if (emailInput) emailInput.value = currentUser.email || '';
    if (avatarPreview) avatarPreview.src = currentUser.avatar || 'admin_avatar.png';
    uploadedUserAvatarBase64 = null;

    openModal('user-profile-modal');
  };

  window.submitUserProfileForm = function (e) {
    if (e) e.preventDefault();

    const holyInput = document.getElementById('prof-holyname');
    const nameInput = document.getElementById('prof-fullname');
    const phoneInput = document.getElementById('prof-phone');
    const roleInput = document.getElementById('prof-role');

    if (!holyInput || !nameInput) return;

    const holyName = holyInput.value.trim();
    const name = nameInput.value.trim();

    if (!holyName || !name) {
      alert('Vui lòng nhập đầy đủ Tên Thánh và Họ Tên!');
      return;
    }

    currentUser.holyName = holyName;
    currentUser.name = name;
    currentUser.phone = phoneInput ? phoneInput.value.trim() : '';
    currentUser.role = roleInput ? roleInput.value : currentUser.role;

    if (uploadedUserAvatarBase64) {
      currentUser.avatar = uploadedUserAvatarBase64;
    }

    const match = accountsList.find(a => a.email.toLowerCase() === currentUser.email.toLowerCase());
    if (match) {
      match.holyName = currentUser.holyName;
      match.name = currentUser.name;
      match.phone = currentUser.phone;
      match.role = currentUser.role;
      match.avatar = currentUser.avatar;
    }

    // Sync avatar to catechists list if matching email or name
    if (Array.isArray(appData.catechists)) {
      const catMatch = appData.catechists.find(c => (c.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) || c.name === currentUser.name);
      if (catMatch) {
        catMatch.holyName = currentUser.holyName;
        catMatch.name = currentUser.name;
        catMatch.phone = currentUser.phone;
        catMatch.avatar = currentUser.avatar;
        saveAppData();
      }
    }

    try {
      saveAccounts();
      saveCurrentUser();
      saveUserData();
      renderAppHeaderAndSidebar();

      const contentArea = document.getElementById('content-area');
      if (activePage === 'overview') renderOverview(contentArea);
      if (activePage === 'catechists') renderCatechists(contentArea);
      if (activePage === 'admin-users') renderAdminUsers(contentArea);

      closeModal('user-profile-modal');
      showToast('Đã lưu thông tin cá nhân và ảnh đại diện thành công! ✨', 'success');
    } catch (err) {
      console.error('Lỗi khi lưu tài khoản:', err);
      alert('Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại!');
    }
  };

  function bindUserProfileEvents() {
    const avatarInput = document.getElementById('profile-avatar-file-input');
    const avatarPreview = document.getElementById('profile-avatar-preview');
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            compressImage(evt.target.result, 300, 300, 0.85, (compressed) => {
              uploadedUserAvatarBase64 = compressed;
              avatarPreview.src = compressed;
              showToast('Đã chọn ảnh đại diện mới! Bấm "Lưu Thông Tin Cá Nhân" để áp dụng.', 'info');
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Bind Student Photo Upload Input
    const stdPhotoInput = document.getElementById('std-photo-input');
    const stdPhotoPreview = document.getElementById('std-photo-preview');
    const stdPhotoUrlHidden = document.getElementById('std-photo-url');

    if (stdPhotoInput && stdPhotoPreview) {
      stdPhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            compressImage(evt.target.result, 200, 200, 0.75, function(compressed) {
              stdPhotoPreview.src = compressed;
              if (stdPhotoUrlHidden) stdPhotoUrlHidden.value = compressed;
              showToast('Đã chọn và nén ảnh đại diện học sinh!', 'info');
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const form = document.getElementById('user-profile-form');
    if (form) {
      form.addEventListener('submit', window.submitUserProfileForm);
    }

    const profileBtn = document.getElementById('btn-open-profile');
    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openUserProfileModal();
      });
    }

    const sidebarUserCard = document.querySelector('.user-mini-card');
    if (sidebarUserCard) {
      sidebarUserCard.style.cursor = 'pointer';
      sidebarUserCard.setAttribute('title', 'Bấm để đổi ảnh đại diện & sửa thông tin cá nhân');
      sidebarUserCard.addEventListener('click', () => {
        window.openUserProfileModal();
      });
    }
  }

  // Global helper exposures for inline onclick handlers
  window.calculateStudentGrade = calculateStudentGrade;
  window.updateStudentGradeRow = updateStudentGradeRow;
  window.saveAllGradebook = saveAllGradebook;
  window.appNavigate = navigateTo;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showToast = showToast;
  window.showConfirmDialog = showConfirmDialog;
  window.openGoogleAuthModal = openGoogleAuthModal;
  window.openUserProfileModal = window.openUserProfileModal;
  window.submitUserProfileForm = window.submitUserProfileForm;
  window.deleteAdminUser = window.deleteAdminUser;
  window.quickDeleteAdminUser = window.quickDeleteAdminUser;
  window.confirmDeleteAccount = window.confirmDeleteAccount;
  window.executeAccountDeletion = window.executeAccountDeletion;
  window.openAddClassModal = window.openAddClassModal;
  window.editClass = window.editClass;
  window.deleteClass = window.deleteClass;
  window.openAddStudentModal = window.openAddStudentModal;
  window.editStudent = window.editStudent;
  window.deleteStudent = window.deleteStudent;
  window.openAddCatechistModal = window.openAddCatechistModal;
  window.editCatechist = window.editCatechist;
  window.deleteCatechist = window.deleteCatechist;
  window.saveCatechistForm = window.saveCatechistForm;
  window.openAddLibraryModal = window.openAddLibraryModal;
  window.editLibrary = window.editLibrary;
  window.deleteLibrary = window.deleteLibrary;
  window.saveLibraryForm = window.saveLibraryForm;
  window.openAddQuizModal = window.openAddQuizModal;
  window.editQuiz = window.editQuiz;
  window.deleteQuiz = window.deleteQuiz;
  window.saveQuizForm = window.saveQuizForm;
  window.openAddNotificationModal = window.openAddNotificationModal;
  window.editNotification = window.editNotification;
  window.deleteNotification = window.deleteNotification;
  window.saveNotificationForm = window.saveNotificationForm;
  window.downloadCSVTemplate = window.downloadCSVTemplate;
  window.openCSVImportModal = window.openCSVImportModal;
  window.handleCSVFileSelected = window.handleCSVFileSelected;
  window.confirmImportCSVData = window.confirmImportCSVData;
  window.confirmResetAllUserData = window.confirmResetAllUserData;
  window.changeGradeSemester = window.changeGradeSemester;
  window.resetCurrentGradebook = window.resetCurrentGradebook;
  window.resetCurrentGradebookDirect = window.resetCurrentGradebookDirect;

  // Initialize application on DOM content loaded or immediate if ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();

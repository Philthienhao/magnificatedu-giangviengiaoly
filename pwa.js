/**
 * MagnificatEdu - Progressive Web App (PWA) Manager
 * Provides native-like app installation, standalone mode detection, and service worker registration
 */

(function() {
  'use strict';

  let deferredPrompt = null;

  // Detect if running in standalone mode (already installed as an App)
  function isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  // Detect iOS platform
  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  // Detect Android platform
  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('✅ MagnificatEdu ServiceWorker registered successfully:', reg.scope);
          try { reg.update(); } catch(e) {}
        })
        .catch((err) => {
          console.warn('⚠️ ServiceWorker registration note:', err);
        });
    });
  }

  // Listen for beforeinstallprompt event (Android, Chrome, Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPWAPrompt = e;
    console.log('💡 PWA beforeinstallprompt captured and ready');

    // Highlight topbar install button if available
    const topbarBtn = document.getElementById('pwa-install-btn');
    if (topbarBtn) {
      topbarBtn.classList.add('pwa-install-ready');
    }
  });

  // Listen for successful app installation
  window.addEventListener('appinstalled', () => {
    console.log('🎉 MagnificatEdu PWA installed successfully');
    deferredPrompt = null;
    window.deferredPWAPrompt = null;
    if (typeof window.showToast === 'function') {
      window.showToast('Chúc mừng! MagnificatEdu đã được cài đặt lên điện thoại của bạn.', 'success');
    }
    const modal = document.getElementById('pwa-install-modal');
    if (modal) modal.style.display = 'none';
  });

  // Trigger PWA install modal or direct prompt
  window.triggerPWAInstall = function() {
    const modal = document.getElementById('pwa-install-modal');
    if (!modal) return;

    const alreadyInstalledBox = document.getElementById('pwa-already-installed-box');
    const directInstallBox = document.getElementById('pwa-direct-install-box');
    const iosInstructions = document.getElementById('pwa-ios-instructions');
    const androidManualGuide = document.getElementById('pwa-android-manual-guide');

    const standalone = isStandalone();

    if (standalone) {
      if (alreadyInstalledBox) alreadyInstalledBox.style.display = 'block';
      if (directInstallBox) directInstallBox.style.display = 'none';
      if (iosInstructions) iosInstructions.style.display = 'none';
      if (androidManualGuide) androidManualGuide.style.display = 'none';
    } else {
      if (alreadyInstalledBox) alreadyInstalledBox.style.display = 'none';

      // Check if direct install prompt is available (Android / Chrome)
      if (deferredPrompt) {
        if (directInstallBox) directInstallBox.style.display = 'block';
      } else {
        if (directInstallBox) directInstallBox.style.display = 'none';
      }

      // Check OS
      if (isIOS()) {
        if (iosInstructions) iosInstructions.style.display = 'block';
        if (androidManualGuide) androidManualGuide.style.display = 'none';
      } else if (isAndroid()) {
        if (iosInstructions) iosInstructions.style.display = 'none';
        if (androidManualGuide) androidManualGuide.style.display = 'block';
      } else {
        // Desktop or other
        if (iosInstructions) iosInstructions.style.display = 'block';
        if (androidManualGuide) androidManualGuide.style.display = 'block';
      }
    }

    modal.style.display = 'flex';
  };

  // Close PWA install modal
  window.closePWAInstallModal = function() {
    const modal = document.getElementById('pwa-install-modal');
    if (modal) modal.style.display = 'none';
  };

  // User clicked "Cài đặt ngay" from prompt
  window.installPWAFromPrompt = async function() {
    if (!deferredPrompt) {
      if (typeof window.showToast === 'function') {
        window.showToast('Vui lòng làm theo hướng dẫn thêm vào màn hình chính bên dưới.', 'info');
      }
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA installation prompt');
        if (typeof window.showToast === 'function') {
          window.showToast('Đang thêm ứng dụng vào Màn hình chính...', 'success');
        }
      } else {
        console.log('User dismissed PWA installation prompt');
      }
      deferredPrompt = null;
      window.deferredPWAPrompt = null;
      window.closePWAInstallModal();
    } catch (err) {
      console.warn('PWA install error:', err);
    }
  };

  // Close modal when clicking on backdrop
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pwa-install-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closePWAInstallModal();
        }
      });
    }

    // Apply standalone styling enhancements if app is in standalone mode
    if (isStandalone()) {
      document.body.classList.add('pwa-standalone-mode');
      console.log('📱 Running in PWA Standalone Mode');
    }
  });

})();

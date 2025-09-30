// pwa-install.js – registers SW and shows Install button with diagnostics
(function(){
  const log = (...a)=>console.log('[PWA]',...a);

  // Install button UI
  const btn = document.createElement('button');
  btn.id = 'install-btn';
  btn.textContent = 'Install App';
  btn.style.cssText = 'position:fixed;right:12px;bottom:14px;z-index:10000;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.55);color:#eae9ff;padding:10px 14px;border-radius:12px;cursor:pointer;backdrop-filter:blur(6px);display:none;';
  document.body.appendChild(btn);

  // Register SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(r=>{
        log('SW registered', r.scope);
      }).catch(e=>log('SW error', e));
    });
  } else {
    log('Service workers not supported in this browser.');
  }

  // Install prompt flow (Chromium/Android)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.style.display='block';
    log('beforeinstallprompt fired');
  });

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    btn.style.display='none';
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    log('User choice:', outcome);
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    log('App installed');
    btn.style.display='none';
  });

  // iOS guidance (no beforeinstallprompt)
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isIOS && isSafari) {
    // show tip banner
    const tip = document.createElement('div');
    tip.textContent = 'Add to Home Screen: Share ▸ Add to Home Screen';
    tip.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:16px;background:rgba(0,0,0,.65);color:#fff;padding:8px 12px;border-radius:10px;z-index:10001;font-size:14px';
    document.body.appendChild(tip);
    setTimeout(()=> tip.remove(), 8000);
  }

})();
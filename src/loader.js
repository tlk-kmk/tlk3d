// loader.js
(function() {
  function createLoader(onComplete) {
    let progress = 0;
    let startExit = false;
    const minProgressDuration = 1000;
    const startTime = Date.now();

    const trailing = document.createElement('div');
    trailing.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 19998;
      background-color: #fff;
      mix-blend-mode: difference;
      pointer-events: none;
      transform: translateY(0);
      transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1);
      transition-delay: 0.4s;
    `;
    document.body.appendChild(trailing);

    const loader = document.createElement('div');
    loader.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 19999;
      background-color: #0B0B0D;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #fff;
      pointer-events: none;
      overflow: hidden;
      transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1);
    `;

    const videoWrapper = document.createElement('div');
    videoWrapper.style.cssText = `
      width: 360px;
      height: 360px;
      pointer-events: none;
      border-radius: 16px;
      overflow: hidden;
      position: absolute;
      bottom: -12%;
    `;

    const video = document.createElement('video');
    video.src = '/src/loader.webm';
    video.muted = true;
    video.playsInline = true;
    video.style.cssText = `
      display: block;
      background: transparent;
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    `;
    videoWrapper.appendChild(video);

    const progressWrapper = document.createElement('div');
    progressWrapper.style.cssText = `
      position: absolute;
      bottom: 4%;
      width: 100%;
      display: flex;
      justify-content: center;
    `;

    const progressText = document.createElement('span');
    progressText.style.cssText = `
      font-size: 6rem;
      opacity: 1;
      transition: opacity 0.3s ease;
      font-family: 'aerion-bold', sans-serif;
    `;
    progressText.textContent = '0%';
    progressWrapper.appendChild(progressText);

    // Center wrapper containing SVG (text removed)
    const centerWrapper = document.createElement('div');
    centerWrapper.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      pointer-events: none;
    `;

    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('width', '14');
    svgIcon.setAttribute('height', '14');
    svgIcon.setAttribute('viewBox', '0 0 14 14');
    svgIcon.setAttribute('fill', 'none');
    svgIcon.innerHTML = `
      <path d="M7 0L7.79196 6.20804L14 7L7.79196 7.79196L7 14L6.20804 7.79196L0 7L6.20804 6.20804L7 0Z" fill="#F6F7FF"/>
    `;

    centerWrapper.appendChild(svgIcon);

    loader.appendChild(videoWrapper);
    loader.appendChild(progressWrapper);
    loader.appendChild(centerWrapper);
    document.body.appendChild(loader);

    function animateProgressOverTime() {
      const interval = setInterval(() => {
        if (startExit) {
          clearInterval(interval);
          return;
        }
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / minProgressDuration) * 100, 100);
        progressText.textContent = `${Math.floor(progress)}%`;

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(startExitSequence, 300);
        }
      }, 20);
    }

    video.addEventListener('loadedmetadata', () => {
      const targetDuration = 1.6;
      const actualDuration = video.duration;
      if (actualDuration > targetDuration) {
        video.playbackRate = actualDuration / targetDuration;
      }
    });

    video.play().catch(() => {});

    function startExitSequence() {
      if (startExit) return;
      startExit = true;
      loader.style.transform = 'translateY(-100%)';
      trailing.style.transform = 'translateY(-100%)';

      setTimeout(() => {
        document.body.removeChild(loader);
      }, 1200);

      setTimeout(() => {
        document.body.removeChild(trailing);
        if (onComplete) onComplete();
      }, 1600);
    }

    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver(() => {
          if (document.readyState === 'complete' && !startExit) {
            progress = 100;
          }
        });
        observer.observe({ type: 'resource', buffered: true });
      } catch (e) {}
    }

    animateProgressOverTime();
  }

  window.initLoader = createLoader;
})();

// customCursor.js
(function() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (!isDesktop) return;

  // Create large cursor
  const largeCursor = document.createElement('div');
  largeCursor.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: lighten;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,1);
    background-color: transparent;
  `;

  // Create small cursor
  const smallCursor = document.createElement('div');
  smallCursor.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    mix-blend-mode: lighten;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,1);
    background-color: transparent;
  `;

  document.body.appendChild(largeCursor);
  document.body.appendChild(smallCursor);

  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const posLarge = { ...target };
  const posSmall = { ...target };

  function lerp(a, b, f) {
    return a + (b - a) * f;
  }

  function onMouseMove(e) {
    target.x = e.clientX;
    target.y = e.clientY;
  }

  window.addEventListener('mousemove', onMouseMove);

  function animate() {
    posLarge.x = lerp(posLarge.x, target.x, 0.15);
    posLarge.y = lerp(posLarge.y, target.y, 0.15);
    posSmall.x = lerp(posSmall.x, target.x, 0.05);
    posSmall.y = lerp(posSmall.y, target.y, 0.05);

    largeCursor.style.left = `${posLarge.x}px`;
    largeCursor.style.top = `${posLarge.y}px`;

    smallCursor.style.left = `${posSmall.x}px`;
    smallCursor.style.top = `${posSmall.y}px`;

    requestAnimationFrame(animate);
  }

  animate();

  // Optional cleanup on page unload
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('mousemove', onMouseMove);
  });
})();

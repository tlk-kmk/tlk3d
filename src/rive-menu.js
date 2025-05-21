export function initRiveAnimation({
  src = 'assets/rive/burgermenu.riv',
  canvasId = 'rive-menu',
  artboard = 'artboard',
  stateMachine = 'stateMachine',
  triggerName = 'Click',
  onTriggerFired = null
} = {}) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.error(`Canvas with id '${canvasId}' not found.`);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;

  const riveInstance = new rive.Rive({
    src: src,
    canvas: canvas,
    artboard: artboard,
    stateMachines: [stateMachine],
    autoplay: true,
    fit: 'contain',
    alignment: 'center',
    renderer: 'webgl',
    onLoad: () => {
      console.log('✅ Rive (WebGL) loaded');

      const inputs = riveInstance.stateMachineInputs(stateMachine);
      console.log('🎯 All inputs:', inputs.map(i => ({ name: i.name, type: i.type })));

      const trigger = inputs.find(i => i.name === triggerName && i.type === 58);
      if (trigger) {
        console.log(`✅ Trigger "${triggerName}" found.`);
        canvas.addEventListener('click', () => {
          trigger.fire();
          console.log(`🔥 Trigger "${triggerName}" fired!`);
          if (typeof onTriggerFired === 'function') {
            onTriggerFired();
          }
        });
      } else {
        console.warn(`❌ Trigger "${triggerName}" not found.`);
      }
    },
    onError: (error) => {
      console.error('❌ Rive failed to load:', error);
    }
  });

  riveInstance.onStateChange = (event) => {
    console.log('🔄 State machine changed:', event.data);
  };

  // Make it globally accessible to trigger from nav-logic.js
  window.burgerRiveInstance = riveInstance;

  return riveInstance;
}

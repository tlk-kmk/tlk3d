import './3d.js'
import './customCursor.js'
import './loader.js'
import './nav-logic.js'
import './star-nav.js'

// Initialize loader AFTER loader.js is loaded
if (window.initLoader) {
  window.initLoader(() => {
    console.log('✅ Loader complete!');
  });
} else {
  console.warn('❌ Loader init function not found!');
}
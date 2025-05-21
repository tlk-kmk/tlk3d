import './3d.js'
import './customCursor.js'
import './loader.js'
import './nav-logic.js'
import './star-nav.js'


// SVG blur filter definitions
const blurDefs = `
  <defs>
    <filter id="blur-2"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="blur-4"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="blur-8"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="blur-12"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="blur-16"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="blur-20"><feGaussianBlur stdDeviation="20"/></filter>
  </defs>
`;

function injectFiltersIntoTargetedSVGs() {
  // Select only the svg elements inside .clickable or .star
  const svgEls = document.querySelectorAll('.clickable svg, .star svg');

  svgEls.forEach(svg => {
    if (!svg.querySelector('defs')) {
      const parser = new DOMParser();
      const defsDoc = parser.parseFromString(blurDefs, 'image/svg+xml');
      const defs = defsDoc.querySelector('defs');
      if (defs) {
        svg.insertBefore(defs, svg.firstChild);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', injectFiltersIntoTargetedSVGs);

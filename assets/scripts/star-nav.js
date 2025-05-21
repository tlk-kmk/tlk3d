// Select the UI Stars container
const uiStars = document.querySelector('.ui-stars');

if (uiStars) {
  uiStars.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('.clickable');

    if (!clickedLink) return; // click outside any clickable

    // Remove 'active' from all clickable elements
    uiStars.querySelectorAll('.clickable').forEach(link => {
      link.classList.remove('active');
    });

    // Add 'active' to the clicked one
    clickedLink.classList.add('active');

    console.log('⭐ New active star set');
    
    // Future: Here you could also scroll to the section
    // Example:
    // const targetId = clickedLink.dataset.target;
    // document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
}

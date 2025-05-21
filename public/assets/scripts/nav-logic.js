let previousNavItem = null;

/* ===============================
   ✨ Letter Animation Logic
================================= */

function splitNavTextToSpans() {
  document.querySelectorAll('.nav-item .alt-text').forEach(textEl => {
    const text = textEl.textContent.trim();
    const parentNavItem = textEl.closest('.nav-item');
    textEl.innerHTML = '';

    [...text].forEach(char => {
      const span = document.createElement('span');
      span.classList.add('nav-letter');
      span.textContent = char;

      // All letters start visible (idle)
      span.style.transform = 'translateY(0%)';
      span.style.opacity = '1';

      textEl.appendChild(span);
    });

    textEl.setAttribute('aria-label', text);
  });
}

function animateLettersIn(navItem) {
  const letters = navItem.querySelectorAll('.nav-letter');

  gsap.set(letters, {
    y: '100%',
    opacity: 0
  });

  gsap.to(letters, {
    y: '0%',
    opacity: 1,
    stagger: 0.05,
    duration: 0.4,
    ease: 'power3.out'
  });
}

function animateLettersOut(navItem) {
  const letters = navItem.querySelectorAll('.nav-letter');

  gsap.to(letters, {
    y: '-100%',
    opacity: 0,
    stagger: 0.03,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      gsap.set(letters, {
        y: '100%',
        opacity: 0
      });

      gsap.to(letters, {
        y: '0%',
        opacity: 1,
        stagger: 0.03,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  });
}

/* ===============================
   🔁 Active State & Navigation
================================= */

function setActiveNavItem(index) {
  const allNavItems = document.querySelectorAll('.nav-item');
  const matchedItems = document.querySelectorAll(`.nav-item[data-index="${index}"]`);

  // Remove active from all nav-items (desktop & mobile)
  allNavItems.forEach(item => {
    item.classList.remove('active');
  });

  // Animate out the previous item if it exists and is not one of the matched
  if (previousNavItem && ![...matchedItems].includes(previousNavItem)) {
    animateLettersOut(previousNavItem);
  }

  // Animate in and activate all matching nav-items (desktop + mobile)
  matchedItems.forEach(item => {
    item.classList.add('active');
    animateLettersIn(item);
  });

  // Sync stars (desktop)
  document.querySelectorAll('.ui-stars .clickable').forEach(star => {
    star.classList.toggle('active', star.getAttribute('data-index') === index);
  });

  // Track previous (use the first one from matchedItems)
  previousNavItem = matchedItems[0];
}


/* ===============================
   🍔 Mobile Menu Handling
================================= */

function closeMobileMenuAndAnimate() {
  const mobileMenu = document.querySelector('.ui-mobile-menu');
  if (mobileMenu?.classList.contains('open')) {
    setTimeout(() => {
      mobileMenu.classList.remove('open');
      triggerBurgerMenu();
    }, 700);
  }
}

function triggerBurgerMenu() {
  if (window.burgerRiveInstance) {
    const inputs = window.burgerRiveInstance.stateMachineInputs('stateMachine');
    const trigger = inputs.find(i => i.name === 'Click' && i.type === 58);
    if (trigger) {
      trigger.fire();
      console.log('🔥 Burger menu trigger "Click" fired from nav-logic');
    } else {
      console.warn('⚠️ Trigger "Click" not found in stateMachine');
    }
  } else {
    console.warn('⚠️ burgerRiveInstance not found');
  }
}

window.triggerBurgerMenu = triggerBurgerMenu;

function setActiveNavItem(index) {
  const allNavItems = document.querySelectorAll('.nav-item');
  const matchedItems = document.querySelectorAll(`.nav-item[data-index="${index}"]`);

  // Remove active from all nav-items (desktop & mobile)
  allNavItems.forEach(item => {
    item.classList.remove('active');
  });

  // Animate out the previous item if it exists and is not one of the matched
  if (previousNavItem && ![...matchedItems].includes(previousNavItem)) {
    animateLettersOut(previousNavItem);
  }

  // Animate in and activate all matching nav-items (desktop + mobile)
  matchedItems.forEach(item => {
    item.classList.add('active');
    animateLettersIn(item);
  });

  // Sync stars (desktop)
  document.querySelectorAll('.ui-stars .clickable').forEach(star => {
    star.classList.toggle('active', star.getAttribute('data-index') === index);
  });

 // Sync headline-copy visibility and animate
  document.querySelectorAll('.headline-copy').forEach(copy => {
    const isActive = copy.getAttribute('data-index') === index;
    copy.classList.toggle('active', isActive);

    if (isActive) {
      animateHeadlineIn(copy);
    }
  });

  // Track previous (use the first one from matchedItems)
  previousNavItem = matchedItems[0];
}

function animateHeadlineIn(copyBlock) {
  const elements = copyBlock.querySelectorAll('h2, p');

  gsap.set(elements, {
    opacity: 0,
    y: 10
  });

  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });
}


/* ===============================
   🚀 Initialize Everything
================================= */

document.addEventListener('DOMContentLoaded', () => {
  splitNavTextToSpans();
  previousNavItem = document.querySelector('.nav-item.active');

  // Attach click to all nav-items (desktop + mobile)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const index = item.getAttribute('data-index');
      if (!item.classList.contains('active')) {
        setActiveNavItem(index);

        // If clicked in mobile menu, close it
        if (item.closest('.ui-mobile-menu')) {
          closeMobileMenuAndAnimate();
        }
      }
    });
  });

  // Attach click to stars (desktop only)
  document.querySelectorAll('.ui-stars .clickable').forEach(star => {
    star.addEventListener('click', (e) => {
      e.preventDefault();
      const index = star.getAttribute('data-index');
      if (!star.classList.contains('active')) {
        setActiveNavItem(index);
      }
    });
  });

  // Mobile burger trigger
  document.querySelector('.mobile-nav')?.addEventListener('click', () => {
    const mobileMenu = document.querySelector('.ui-mobile-menu');
    mobileMenu?.classList.toggle('open');

    if (mobileMenu?.classList.contains('open')) {
      triggerBurgerMenu();
      splitNavTextToSpans(); // Ensure newly shown items are processed
    }
  });
});

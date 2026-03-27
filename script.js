// ─────────────────────────────────────────
// SPLASH ANIMATION
// ─────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const initialsWrap = document.querySelector('.initials-wrap');
  const initialA = document.getElementById('initial-a');
  const initialG = document.getElementById('initial-g');
  const splashName = document.querySelector('.splash-name');
  const splashTagline = document.querySelector('.splash-tagline');
  const splashScroll = document.querySelector('.splash-scroll');

  // Step 1: Fade in initials
  setTimeout(() => {
    if (initialA) initialA.style.opacity = '1';
    if (initialG) initialG.style.opacity = '1';
  }, 400);

  // Step 2: Slide initials apart
  setTimeout(() => {
    if (initialsWrap) initialsWrap.classList.add('animate');
  }, 1600);

  // Step 3: Show full name
  setTimeout(() => {
    if (splashName) splashName.classList.add('visible');
  }, 2200);

  // Step 4: Show tagline
  setTimeout(() => {
    if (splashTagline) splashTagline.classList.add('visible');
  }, 2900);

  // Step 5: Show scroll hint
  setTimeout(() => {
    if (splashScroll) splashScroll.classList.add('visible');
  }, 3500);

  // Dismiss on scroll
  const dismissSplash = () => {
    splash.classList.add('hidden');
    document.body.style.overflow = '';
    window.removeEventListener('scroll', dismissSplash);
    window.removeEventListener('wheel', dismissSplash);
    window.removeEventListener('touchmove', dismissSplash);
  };

  // Lock scroll during splash
  document.body.style.overflow = 'hidden';

  // Allow dismiss after animation plays
  setTimeout(() => {
    window.addEventListener('scroll', dismissSplash);
    window.addEventListener('wheel', dismissSplash);
    window.addEventListener('touchmove', dismissSplash);
    if (splashScroll) splashScroll.addEventListener('click', dismissSplash);
  }, 3500);

  // Auto-dismiss after 7s
  setTimeout(dismissSplash, 7000);
});

// ─────────────────────────────────────────
// CAROUSEL
// ─────────────────────────────────────────

const SLIDE_DURATION = 5000; // ms per slide

(function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const currentEl = document.getElementById('carousel-current');
  const progressBar = document.getElementById('carousel-progress-bar');

  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;
  let progressTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');

    if (currentEl) {
      currentEl.textContent = String(current + 1).padStart(2, '0');
    }

    resetProgress();
  }

  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // force reflow
    progressBar.offsetWidth;
    progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
    progressBar.style.width = '100%';
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), SLIDE_DURATION);
    resetProgress();
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    if (progressBar) {
      const computed = getComputedStyle(progressBar).width;
      const parent = progressBar.parentElement.offsetWidth;
      progressBar.style.transition = 'none';
      progressBar.style.width = computed;
    }
  }

  // Arrows
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  // Dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAutoplay();
    });
  });

  // Pause on hover
  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // Swipe support
  let touchStartX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        goTo(delta > 0 ? current + 1 : current - 1);
        startAutoplay();
      }
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); startAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAutoplay(); }
  });

  startAutoplay();
})();

// ─────────────────────────────────────────
// NAVIGATION — scroll behavior
// ─────────────────────────────────────────

const nav = document.querySelector('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ─────────────────────────────────────────
// FADE-IN ON SCROLL
// ─────────────────────────────────────────

const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  fadeEls.forEach((el) => observer.observe(el));
}

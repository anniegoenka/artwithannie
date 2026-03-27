// ─────────────────────────────────────────
// PAGE TRANSITION — fade out on navigate
// ─────────────────────────────────────────

(function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Intercept internal .html links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    if (!href.endsWith('.html')) return;

    e.preventDefault();
    overlay.style.transition = 'opacity 0.45s ease';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 460);
  });
})();

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

  setTimeout(() => {
    if (initialA) initialA.style.opacity = '1';
    if (initialG) initialG.style.opacity = '1';
  }, 400);

  setTimeout(() => {
    if (initialsWrap) initialsWrap.classList.add('animate');
  }, 1600);

  setTimeout(() => {
    if (splashName) splashName.classList.add('visible');
  }, 2200);

  setTimeout(() => {
    if (splashTagline) splashTagline.classList.add('visible');
  }, 2700);

  setTimeout(() => {
    if (splashScroll) splashScroll.classList.add('visible');
  }, 3200);

  const dismissSplash = () => {
    splash.classList.add('hidden');
    document.body.style.overflow = '';
    window.removeEventListener('scroll', dismissSplash);
    window.removeEventListener('wheel', dismissSplash);
    window.removeEventListener('touchmove', dismissSplash);
  };

  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    window.addEventListener('scroll', dismissSplash);
    window.addEventListener('wheel', dismissSplash);
    window.addEventListener('touchmove', dismissSplash);
    if (splashScroll) splashScroll.addEventListener('click', dismissSplash);
  }, 3200);

  setTimeout(dismissSplash, 7000);
});

// ─────────────────────────────────────────
// CAROUSEL
// ─────────────────────────────────────────

const SLIDE_DURATION = 5000;

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

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (currentEl) currentEl.textContent = String(current + 1).padStart(2, '0');
    resetProgress();
  }

  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
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
      const w = getComputedStyle(progressBar).width;
      progressBar.style.transition = 'none';
      progressBar.style.width = w;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index, 10)); startAutoplay(); });
  });

  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) { goTo(delta > 0 ? current + 1 : current - 1); startAutoplay(); }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); startAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAutoplay(); }
  });

  startAutoplay();
})();

// ─────────────────────────────────────────
// NAVIGATION — scroll + hamburger
// ─────────────────────────────────────────

(function initNav() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  function openMenu() {
    mobileNav && mobileNav.classList.add('open');
    hamburger && hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav && mobileNav.classList.remove('open');
    hamburger && hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileNav) mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMenu();
  });
})();

// ─────────────────────────────────────────
// SCROLL FADE-IN
// ─────────────────────────────────────────

(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));
})();

// ─────────────────────────────────────────
// BACK TO TOP
// ─────────────────────────────────────────

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─────────────────────────────────────────
// AG WATERMARK — fade on scroll
// ─────────────────────────────────────────

(function initWatermark() {
  const mark = document.querySelector('.ag-watermark');
  if (!mark) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 0.03 - window.scrollY / 8000);
    mark.style.opacity = opacity;
  });
})();

// ─────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────

(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!lightbox) return;

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.dataset.lightbox;
      if (lightboxImg) lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lightboxImg) setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();

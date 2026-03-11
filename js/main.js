// ========================================
// NAVBAR SCROLL BEHAVIOR
// ========================================
const navbar = document.getElementById('navbar');
const hero = document.getElementById('hero');

const navObserver = new IntersectionObserver(
  ([entry]) => {
    navbar.classList.toggle('scrolled', !entry.isIntersecting);
  },
  { threshold: 0.1 }
);

navObserver.observe(hero);

// ========================================
// MOBILE MENU
// ========================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========================================
// NAVBAR DROPDOWN TOGGLE (touch support)
// ========================================
document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 || 'ontouchstart' in window) {
      e.preventDefault();
      const parent = link.closest('.nav-dropdown');
      const isOpen = parent.classList.contains('active');
      // Close all dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
      if (!isOpen) parent.classList.add('active');
    }
  });
});

// Close dropdowns on click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
  }
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========================================
// SCROLL ANIMATIONS WITH STAGGER
// ========================================
const animateElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay');
        const delayMs = delay ? parseInt(delay) * 120 : 0;

        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delayMs);

        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

animateElements.forEach(el => scrollObserver.observe(el));

// ========================================
// COUNTER ANIMATION
// ========================================
function animateCounter(el, onComplete) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    let current = target * ease;

    if (target >= 1000) {
      el.textContent = prefix + Math.floor(current).toLocaleString('tr-TR') + '+';
    } else if (isFloat) {
      el.textContent = prefix + current.toFixed(1);
    } else {
      el.textContent = prefix + Math.floor(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (onComplete) onComplete();
    }
  }

  requestAnimationFrame(update);
}

// ========================================
// AWARD COUNTER (no celebration)
// ========================================
const awardNum = document.getElementById('awardNumber');
if (awardNum) {
  const awardObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateCounter(awardNum);
        awardObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.5 }
  );
  awardObserver.observe(awardNum);
}

// ========================================
// 3D CARD TILT EFFECT (Bento Cards)
// ========================================
function initCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

if (!('ontouchstart' in window)) {
  initCardTilt();
}

// ========================================
// PRODUCT CARD FILTERING
// ========================================
const productPills = document.querySelectorAll('.product-filter-pill');
const productCards = document.querySelectorAll('.product-card');

productPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const cat = pill.dataset.productCat;

    // Update active pill
    productPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Filter cards with staggered fade-in
    let visibleIndex = 0;
    productCards.forEach(card => {
      if (card.dataset.productCat === cat) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        const delay = visibleIndex * 80;
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, delay);
        visibleIndex++;
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ========================================
// FAQ ACCORDION
// ========================================
const faqPills = document.querySelectorAll('.faq-pill');
const faqItems = document.querySelectorAll('.faq-accordion-item');

faqPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const cat = pill.dataset.faqCat;
    faqPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    faqItems.forEach(item => {
      if (item.dataset.faqCat === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
      item.classList.remove('active');
      const panel = item.querySelector('.faq-accordion-panel');
      if (panel) panel.style.maxHeight = '0';
    });
  });
});

document.querySelectorAll('.faq-accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const panel = item.querySelector('.faq-accordion-panel');
    const isActive = item.classList.contains('active');

    // Close all in same category
    faqItems.forEach(i => {
      if (i.style.display !== 'none') {
        i.classList.remove('active');
        const p = i.querySelector('.faq-accordion-panel');
        if (p) p.style.maxHeight = '0';
      }
    });

    if (!isActive) {
      item.classList.add('active');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ========================================
// CLIP-PATH TEXT REVEALS
// ========================================
const editorialHeading = document.querySelector('.editorial-heading');

if (editorialHeading) {
  const clipObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = entry.target.querySelectorAll('.reveal-line');
          lines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add('is-visible');
            }, i * 250);
          });
          clipObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  clipObserver.observe(editorialHeading);
}

// ========================================
// STICKY CTA — Show after scrolling past hero
// ========================================
const stickyCta = document.getElementById('stickyCta');
if (stickyCta && hero) {
  const ctaObserver = new IntersectionObserver(
    ([entry]) => {
      stickyCta.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  ctaObserver.observe(hero);
}

// ========================================
// PARALLAX EFFECT ON SCROLL
// ========================================
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      const heroBg = document.querySelector('.hero-bg');
      if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
      }

      const whyElogoBg = document.querySelector('.why-elogo-mesh-bg');
      if (whyElogoBg) {
        const rect = whyElogoBg.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (rect.top / window.innerHeight) * 25;
          whyElogoBg.style.transform = `translateY(${offset}px)`;
        }
      }

      ticking = false;
    });
    ticking = true;
  }
});

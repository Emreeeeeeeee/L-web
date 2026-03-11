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
// HERO SLIDER (5 slides)
// ========================================
const heroSlider = document.getElementById('heroSlider');
if (heroSlider) {
  const slides = heroSlider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const bgLayers = document.querySelectorAll('.hero-bg-layer');
  let currentSlide = 0;
  let heroInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    if (bgLayers[currentSlide]) bgLayers[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    if (bgLayers[currentSlide]) bgLayers[currentSlide].classList.add('active');
  }

  function startHeroAuto() {
    heroInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetHeroAuto() {
    clearInterval(heroInterval);
    startHeroAuto();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      resetHeroAuto();
    });
  });

  startHeroAuto();
}

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

// Hero stats counter
const statsEl = document.querySelector('.hero-stats-editorial');
if (statsEl) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterObserver.observe(statsEl);
}

// ========================================
// AWARD COUNTER + CELEBRATION EFFECT
// ========================================
const awardNum = document.getElementById('awardNumber');
if (awardNum) {
  function createCelebration() {
    const container = document.getElementById('awardCelebration');
    if (!container) return;

    const colors = ['#C62828', '#FF6F00', '#00BCD4', '#3F51B5', '#FF9800', '#4CAF50'];

    // Left side sparkles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      const angle = Math.PI + (Math.random() * Math.PI * 0.7 - Math.PI * 0.35);
      const distance = 30 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 10;
      particle.style.cssText = `
        left: 18%; top: 50%;
        background: ${colors[i % colors.length]};
        width: ${3 + Math.random() * 3}px;
        height: ${3 + Math.random() * 3}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        --tx: ${tx}px; --ty: ${ty}px;
        animation: confettiBurst 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.03}s forwards;
      `;
      container.appendChild(particle);
    }

    // Right side sparkles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      const angle = Math.random() * Math.PI * 0.7 - Math.PI * 0.35;
      const distance = 30 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 10;
      particle.style.cssText = `
        left: 82%; top: 50%;
        background: ${colors[i % colors.length]};
        width: ${3 + Math.random() * 3}px;
        height: ${3 + Math.random() * 3}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        --tx: ${tx}px; --ty: ${ty}px;
        animation: confettiBurst 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.03}s forwards;
      `;
      container.appendChild(particle);
    }

    // Cleanup
    setTimeout(() => { container.innerHTML = ''; }, 1200);
  }

  const awardObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateCounter(awardNum, () => {
          awardNum.classList.add('celebrated');
          createCelebration();
          setTimeout(() => awardNum.classList.remove('celebrated'), 700);
        });
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
// HORIZONTAL SCROLL CARDS (Category Pills + Arrows)
// ========================================
const hscrollCards = document.querySelectorAll('.hscroll-card');
const categoryPills = document.querySelectorAll('.pill');

const productDescriptions = {
  'e-Fatura': {
    title: 'e-Fatura nedir?',
    text: 'e-Fatura, faturaların internet bağlantısı kullanılarak elektronik ortamda veri format ve standardı Gelir İdaresi Başkanlığı tarafından belirlenen ve elektronik belge biçiminde düzenlenen, VUK gereği bir faturada yer alması gereken bilgilerin içerisinde yer aldığı, satıcı ve alıcı arasında dolaşımını güvenli ve sağlıklı bir biçimde sağlamak amacıyla Gelir İdaresi Başkanlığı tarafından oluşturulan uygulamadır.'
  },
  'e-Arşiv': { title: 'e-Arşiv nedir?', text: 'e-Arşiv Fatura, e-Fatura mükellefi olmayan müşterilerinize ve nihai tüketicilere kestiğiniz faturaların elektronik ortamda düzenlenmesini sağlayan GİB onaylı bir uygulamadır.' },
  'e-Defter': { title: 'e-Defter nedir?', text: 'e-Defter, yevmiye defteri ve defter-i kebir\'in elektronik ortamda oluşturulması, onaylanması ve saklanmasını sağlayan GİB onaylı bir uygulamadır.' },
  'e-İrsaliye': { title: 'e-İrsaliye nedir?', text: 'e-İrsaliye, sevk irsaliyelerinin elektronik ortamda düzenlenmesi, iletilmesi ve saklanmasını sağlayan GİB uygulamasıdır.' },
  'e-Adisyon': { title: 'e-Adisyon nedir?', text: 'e-Adisyon, yeme-içme sektöründe faaliyet gösteren işletmelerin adisyon bilgilerini elektronik ortamda düzenlemesini sağlayan dijital çözümdür.' },
  'e-Dekont': { title: 'e-Dekont nedir?', text: 'e-Dekont, banka dekontlarının elektronik ortamda düzenlenmesini ve güvenle saklanmasını sağlayan dijital çözümdür.' },
  'Fatura Finansmanı': { title: 'Fatura Finansmanı nedir?', text: 'Fatura Finansmanı, e-Faturalarınız üzerinden teminatsız kredi teklifleri almanızı sağlayan dijital finansman çözümüdür.' },
  'e-Tahsilat': { title: 'e-Tahsilat nedir?', text: 'e-Tahsilat, dijital ortamda tahsilat süreçlerinizi yönetmenizi sağlayan çözümdür.' },
  'e-Mutabakat': { title: 'e-Mutabakat nedir?', text: 'e-Mutabakat, cari hesap mutabakatlarınızı elektronik ortamda gerçekleştirmenizi sağlayan çözümdür.' },
  'Online Hesap Özeti': { title: 'Online Hesap Özeti nedir?', text: 'Online Hesap Özeti ile hesap hareketlerinizi anlık olarak takip edebilirsiniz.' },
  'e-Defter Saklama': { title: 'e-Defter Saklama nedir?', text: 'e-Defter Saklama, elektronik defterlerinizin GİB mevzuatına uygun şekilde güvenli saklanmasını sağlar.' },
  'e-Belge Transfer': { title: 'e-Belge Transfer nedir?', text: 'e-Belge Transfer, elektronik belgelerinizi farklı platformlar arasında güvenle aktarmanızı sağlar.' },
  'Logo İşbaşı': { title: 'Logo İşbaşı nedir?', text: 'Logo İşbaşı, KOBİ\'ler için geliştirilmiş bulut tabanlı ön muhasebe ve iş yönetimi çözümüdür.' }
};

const productDescTitle = document.getElementById('productDescTitle');
const productDescText = document.getElementById('productDescText');

function updateProductDesc(name) {
  const desc = productDescriptions[name];
  if (desc && productDescTitle && productDescText) {
    productDescTitle.style.opacity = '0';
    productDescText.style.opacity = '0';
    setTimeout(() => {
      productDescTitle.textContent = desc.title;
      productDescText.textContent = desc.text;
      productDescTitle.style.opacity = '1';
      productDescText.style.opacity = '1';
    }, 200);
  }
}

function getVisibleHscrollCards() {
  return [...hscrollCards].filter(c => c.style.display !== 'none');
}

function setActiveHscrollCard(card) {
  hscrollCards.forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  const label = card.querySelector('.hscroll-label')?.textContent;
  if (label) updateProductDesc(label);
}

categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const category = pill.dataset.category;
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    hscrollCards.forEach(card => {
      card.style.display = card.dataset.category === category ? '' : 'none';
      card.classList.remove('active');
    });

    const visible = getVisibleHscrollCards();
    if (visible.length > 0) setActiveHscrollCard(visible[0]);
  });
});

hscrollCards.forEach(card => {
  card.addEventListener('click', () => setActiveHscrollCard(card));
});

// Hscroll arrow navigation
const hscrollPrev = document.getElementById('hscrollPrev');
const hscrollNext = document.getElementById('hscrollNext');

if (hscrollPrev && hscrollNext) {
  hscrollPrev.addEventListener('click', () => {
    const visible = getVisibleHscrollCards();
    const activeIdx = visible.findIndex(c => c.classList.contains('active'));
    if (activeIdx > 0) setActiveHscrollCard(visible[activeIdx - 1]);
    else if (visible.length > 0) setActiveHscrollCard(visible[visible.length - 1]);
  });

  hscrollNext.addEventListener('click', () => {
    const visible = getVisibleHscrollCards();
    const activeIdx = visible.findIndex(c => c.classList.contains('active'));
    if (activeIdx < visible.length - 1) setActiveHscrollCard(visible[activeIdx + 1]);
    else if (visible.length > 0) setActiveHscrollCard(visible[0]);
  });
}

// ========================================
// BLOG SLIDER
// ========================================
const blogSlider = document.getElementById('blogSlider');
const blogPrev = document.getElementById('blogPrev');
const blogNext = document.getElementById('blogNext');

if (blogSlider && blogPrev && blogNext) {
  const blogTrack = blogSlider.querySelector('.blog-slider-track');
  const blogSlides = blogSlider.querySelectorAll('.blog-slide');
  let blogIndex = 0;

  function getBlogSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateBlogSlider() {
    const perView = getBlogSlidesPerView();
    const maxIndex = Math.max(0, blogSlides.length - perView);
    blogIndex = Math.min(blogIndex, maxIndex);
    const offset = -(blogIndex * (100 / perView));
    blogTrack.style.transform = `translateX(${offset}%)`;
  }

  blogPrev.addEventListener('click', () => {
    if (blogIndex > 0) { blogIndex--; updateBlogSlider(); }
  });

  blogNext.addEventListener('click', () => {
    const perView = getBlogSlidesPerView();
    const maxIndex = Math.max(0, blogSlides.length - perView);
    if (blogIndex < maxIndex) { blogIndex++; updateBlogSlider(); }
  });

  window.addEventListener('resize', updateBlogSlider);
}

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

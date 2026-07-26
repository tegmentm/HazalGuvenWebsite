/* =============================================
   ELİF ÖĞRETMEN — script.js
   Animasyonlar, Parallax, Carousel, Counter, FAQ
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. PARTICLE SYSTEM (Hero)
  ───────────────────────────────────────── */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = window.innerWidth < 768 ? 18 : 36;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 5 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 10 + 6}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ─────────────────────────────────────────
     2. PARALLAX (scroll)
  ───────────────────────────────────────── */
  const parallaxSections = document.querySelectorAll('.parallax-section');

  function handleParallax() {
    if (window.innerWidth < 768) return; // mobilde kapat
    const scrollY = window.pageYOffset;
    parallaxSections.forEach(sec => {
      const speed  = parseFloat(sec.dataset.speed) || 0.3;
      const rect   = sec.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * speed;
      const inner  = sec.querySelector('.hero-content, .pb-content, .container');
      if (inner) inner.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ─────────────────────────────────────────
     3. TOP NAVBAR — scroll shadow
  ───────────────────────────────────────── */
  const topNav = document.getElementById('topNav');
  window.addEventListener('scroll', () => {
    if (!topNav) return;
    topNav.classList.toggle('scrolled', window.pageYOffset > 40);
  }, { passive: true });

  /* ─────────────────────────────────────────
     4. BOTTOM NAV — active section
  ───────────────────────────────────────── */
  const bnavItems = document.querySelectorAll('.bnav-item');
  const sections  = ['hero','hakkimda','dersler','yorumlar','iletisim'];

  function updateBottomNav() {
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.pageYOffset >= el.offsetTop - 200) current = id;
    });
    bnavItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateBottomNav, { passive: true });

  // Smooth scroll for bottom nav links
  bnavItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const targetId = item.getAttribute('href').replace('#', '');
      const target   = document.getElementById(targetId);
      if (target) {
        const offset = window.innerWidth < 992 ? 0 : 72;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // Desktop nav smooth scroll
  document.querySelectorAll('.top-nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.getElementById(href.replace('#', ''));
        if (target) window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     5. SCROLL TO TOP BUTTON
  ───────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('visible', window.pageYOffset > 400);
  }, { passive: true });

  /* ─────────────────────────────────────────
     6. COUNTER ANIMATION (Stats Bar)
  ───────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const target = parseInt(num.dataset.target);
          animateCounter(num, target);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsBar = document.getElementById('stats');
  if (statsBar) counterObserver.observe(statsBar);

  /* ─────────────────────────────────────────
     7. REVEAL ON SCROLL (subject cards etc.)
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-card').forEach((card, i) => {
    card.dataset.delay = i * 100;
    revealObserver.observe(card);
  });

  // Generic fade-in-up for coaching items, about features etc.
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.ci-anim, .af-item, .process-step, .faq-item, .about-main-card').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.55s ease ${i * 80}ms, transform 0.55s ease ${i * 80}ms`;
    fadeObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     8. REVIEWS CAROUSEL
  ───────────────────────────────────────── */
  const track     = document.getElementById('reviewsTrack');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const dotsWrap  = document.getElementById('carouselDots');

  if (track && prevBtn && nextBtn) {
    const cards        = track.querySelectorAll('.review-card');
    let   currentIndex = 0;
    let   autoTimer    = null;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 992) return 3;
      if (w >= 600) return 2;
      return 1;
    }

    function getCardWidth() {
      if (!cards[0]) return 320;
      return cards[0].offsetWidth + 20; // gap
    }

    function maxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const total = maxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const d = document.createElement('div');
        d.classList.add('dot');
        if (i === currentIndex) d.classList.add('active');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function goTo(idx) {
      currentIndex = Math.max(0, Math.min(idx, maxIndex()));
      track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
      document.querySelectorAll('#carouselDots .dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function next() { goTo(currentIndex < maxIndex() ? currentIndex + 1 : 0); }
    function prev() { goTo(currentIndex > 0 ? currentIndex - 1 : maxIndex()); }

    nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

    function startAuto() {
      autoTimer = setInterval(next, 4000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAuto();
      }
    });

    buildDots();
    startAuto();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }

  /* ─────────────────────────────────────────
     9. FAQ ACCORDION
  ───────────────────────────────────────── */
  window.toggleFaq = function(questionEl) {
    const item = questionEl.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // close all
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

    // open clicked (if it was closed)
    if (!isOpen) item.classList.add('open');
  };

  /* ─────────────────────────────────────────
     10. CONTACT FORM SUBMIT
  ───────────────────────────────────────── */
  window.submitForm = function(btn) {
    const form    = btn.closest('.contact-form-card');
    const inputs  = form.querySelectorAll('.cf-input');
    let   valid   = true;

    inputs.forEach(input => {
      if (input.type !== 'checkbox' && input.tagName !== 'SELECT' && !input.value.trim() &&
          !input.classList.contains('cf-textarea')) {
        input.style.borderColor = '#ef4444';
        valid = false;
        setTimeout(() => (input.style.borderColor = ''), 2000);
      }
    });

    if (!valid) {
      btn.textContent = '⚠️ Lütfen zorunlu alanları doldurun';
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Mesaj Gönder';
      }, 2500);
      return;
    }

    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Gönderiliyor...';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '🎉 Mesajınız Alındı! En kısa sürede döneceğim.';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      inputs.forEach(input => {
        if (input.tagName === 'SELECT') input.selectedIndex = 0;
        else input.value = '';
      });
      form.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb.checked = false));
      setTimeout(() => {
        btn.innerHTML  = '<i class="bi bi-send-fill me-2"></i>Mesaj Gönder';
        btn.style.background = '';
        btn.disabled   = false;
      }, 5000);
    }, 1800);
  };

  /* ─────────────────────────────────────────
     11. SECTION TITLE REVEAL (stagger)
  ───────────────────────────────────────── */
  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-header').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    titleObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     12. SUBJECT CARDS — HOVER TILT (desktop)
  ───────────────────────────────────────── */
  if (window.innerWidth >= 992) {
    document.querySelectorAll('.subject-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `
          translateY(-10px) scale(1.02)
          rotateY(${x * 10}deg) rotateX(${-y * 10}deg)
        `;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────
     13. COACHING ITEMS — stagger on visible
  ───────────────────────────────────────── */
  const coachingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.coaching-item').forEach((item, i) => {
          item.style.opacity   = '0';
          item.style.transform = 'translateX(40px)';
          item.style.transition = `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`;
          requestAnimationFrame(() => {
            item.style.opacity   = '1';
            item.style.transform = 'translateX(0)';
          });
        });
        coachingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const coachingSection = document.querySelector('.coaching-items');
  if (coachingSection) coachingObserver.observe(coachingSection);

  /* ─────────────────────────────────────────
     14. HERO BUTTONS — CTA link fix
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (!a.classList.contains('bnav-item') && !a.classList.contains('top-nav-link')) {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').replace('#', '');
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const offset = window.innerWidth < 992 ? 0 : 72;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    }
  });

  /* ─────────────────────────────────────────
     15. ABOUT CARD — entrance animation
  ───────────────────────────────────────── */
  const aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const wrapper = entry.target.querySelector('.about-card-wrapper');
        const textBlock = entry.target.querySelector('.about-text-block');
        if (wrapper) {
          wrapper.style.opacity   = '0';
          wrapper.style.transform = 'translateX(-40px)';
          wrapper.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          requestAnimationFrame(() => {
            wrapper.style.opacity   = '1';
            wrapper.style.transform = 'translateX(0)';
          });
        }
        if (textBlock) {
          textBlock.style.opacity   = '0';
          textBlock.style.transform = 'translateX(40px)';
          textBlock.style.transition = 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s';
          requestAnimationFrame(() => {
            textBlock.style.opacity   = '1';
            textBlock.style.transform = 'translateX(0)';
          });
        }
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const aboutSection = document.getElementById('hakkimda');
  if (aboutSection) aboutObserver.observe(aboutSection);

  /* ─────────────────────────────────────────
     16. STATS NUMBER — + suffix on some
  ───────────────────────────────────────── */
  // Add suffix after count animation for stat items
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
    const num   = item.querySelector('.stat-num');
    const label = item.querySelector('.stat-label');
    if (!num || !label) return;
    const labelText = label.textContent;
    if (labelText.includes('%')) {
      num.dataset.suffix = '%';
    } else if (labelText.includes('Öğrenci') || labelText.includes('Yıl')) {
      num.dataset.suffix = '+';
    }
  });

  // Override counter animation to include suffix
  const origCounterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted2) {
        entry.target.dataset.counted2 = '1';
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const target = parseInt(num.dataset.target);
          const suffix = num.dataset.suffix || '';
          let start = null;
          const step = ts => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / 1800, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            num.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else num.textContent = target + suffix;
          };
          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.4 });

  if (statsBar) origCounterObserver.observe(statsBar);

  /* ─────────────────────────────────────────
     17. PARALLAX BANNER — text pop-in
  ───────────────────────────────────────── */
  const bannerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target.querySelector('.pb-title');
        const desc  = entry.target.querySelector('.pb-desc');
        const btn   = entry.target.querySelector('.btn-primary-custom');
        [title, desc, btn].forEach((el, i) => {
          if (!el) return;
          el.style.opacity   = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`;
          requestAnimationFrame(() => {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
          });
        });
        bannerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const banner = document.querySelector('.parallax-banner');
  if (banner) bannerObserver.observe(banner);

  /* ─────────────────────────────────────────
     18. EMOJI ORBIT — speed up on hover
  ───────────────────────────────────────── */
  const orbitItems = document.querySelectorAll('.orbit-item');
  const teacherCard = document.querySelector('.teacher-card');
  if (teacherCard) {
    teacherCard.addEventListener('mouseenter', () => {
      orbitItems.forEach(el => el.style.animationDuration = '3s');
    });
    teacherCard.addEventListener('mouseleave', () => {
      orbitItems.forEach(el => el.style.animationDuration = '10s');
    });
  }

  /* ─────────────────────────────────────────
     19. CONTACT SECTION — wave at top
  ───────────────────────────────────────── */
  const contactSection = document.getElementById('iletisim');
  if (contactSection) {
    const wave = document.createElement('div');
    wave.innerHTML = `
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style="display:block;width:100%;height:70px;">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#ffffff"/>
      </svg>`;
    wave.style.cssText = 'position:absolute;top:0;left:0;right:0;z-index:1;';
    contactSection.style.position = 'relative';
    contactSection.insertBefore(wave, contactSection.firstChild);
  }

  /* ─────────────────────────────────────────
     20. CURSOR SPARKLE (desktop only)
  ───────────────────────────────────────── */
  if (window.innerWidth >= 992) {
    const sparkleEmojis = ['✨','⭐','🌟','💫','🎉'];
    document.addEventListener('mousemove', e => {
      if (Math.random() > 0.92) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.style.cssText = `
          position: fixed;
          left: ${e.clientX - 10}px;
          top: ${e.clientY - 10}px;
          font-size: ${Math.random() * 12 + 10}px;
          pointer-events: none;
          z-index: 9999;
          animation: sparkleOut 0.8s ease forwards;
          user-select: none;
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
      }
    });

    // Add sparkle CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
      @keyframes sparkleOut {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-30px) scale(0.3); }
      }
    `;
    document.head.appendChild(sparkleStyle);
  }

  /* ─────────────────────────────────────────
     INIT CALL
  ───────────────────────────────────────── */
  updateBottomNav();
  handleParallax();

  console.log('✨ Elif Öğretmen — Hazır!');
});

/*!
 * CooksBrad — animation engine
 * Vanilla JS, zero dependencies
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────
     1. Scroll progress bar
  ───────────────────────────────────────────────────── */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  /* ─────────────────────────────────────────────────────
     2. rAF-throttled scroll handler
  ───────────────────────────────────────────────────── */
  let scrollY = 0;
  let rafPending = false;

  function onScroll() {
    scrollY = window.scrollY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    rafPending = false;

    // Progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';

    // Parallax
    updateParallax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // init on load
  requestAnimationFrame(() => { onScroll(); });

  /* ─────────────────────────────────────────────────────
     3. Parallax — avoids conflicting with ken-burns or
        other CSS transform animations:
        · div with background-image → backgroundPositionY
        · <img> element             → objectPosition
  ───────────────────────────────────────────────────── */
  const parallaxTargets = [
    { el: null, selector: '.hero-photo-bg', speed: 0.30, type: 'bg'     },
    { el: null, selector: '.bar-hero-img',  speed: 0.20, type: 'object' },
  ];

  function resolveParallax() {
    parallaxTargets.forEach(p => {
      if (!p.el) p.el = document.querySelector(p.selector);
    });
  }

  function updateParallax() {
    parallaxTargets.forEach(function (p) {
      if (!p.el) return;
      var val = 'calc(50% + ' + (scrollY * p.speed) + 'px)';
      if (p.type === 'object') {
        p.el.style.objectPosition = '50% ' + val;
      } else {
        p.el.style.backgroundPositionY = val;
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     4. Magnetic buttons
  ───────────────────────────────────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('.btn-primary, .nav-gh-cta').forEach(btn => {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left  - r.width  / 2) * 0.18;
        var y = (e.clientY - r.top   - r.height / 2) * 0.26;
        btn.style.transition = 'transform 0.12s ease-out';
        btn.style.transform  = 'translate(' + x + 'px, ' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform  = '';
        setTimeout(function () { btn.style.transition = ''; }, 600);
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     5. 3D card tilt (perspective rotate on mouse move)
  ───────────────────────────────────────────────────── */
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform  = 'perspective(800px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 5) + 'deg) translateZ(8px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform  = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     6. Staggered grid children reveal
  ───────────────────────────────────────────────────── */
  function initStagger() {
    var selectors = [
      '.values',
      '.bento-grid',
      '.collections-grid',
      '.values-process',
    ];

    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (container) {
        var children = Array.from(container.children);
        // Set initial hidden state on children
        children.forEach(function (child) {
          child.style.opacity   = '0';
          child.style.transform = 'translateY(22px)';
          child.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)';
        });

        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            children.forEach(function (child, i) {
              setTimeout(function () {
                child.style.opacity   = '1';
                child.style.transform = 'translateY(0)';
              }, i * 115);
            });
            obs.unobserve(entry.target);
          });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

        obs.observe(container);
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     7. Number counters (.value-num)
  ───────────────────────────────────────────────────── */
  function initCounters() {
    document.querySelectorAll('.value-num').forEach(function (el) {
      var raw    = el.textContent.replace(/\D/g, '');
      var target = parseInt(raw, 10);
      if (isNaN(target) || target === 0) return;

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var start    = performance.now();
          var duration = 950;
          (function raf(now) {
            var p = Math.min((now - start) / duration, 1);
            var e = 1 - Math.pow(1 - p, 3); // ease out cubic
            el.textContent = String(Math.round(e * target)).padStart(2, '0');
            if (p < 1) requestAnimationFrame(raf);
          })(start);
          obs.unobserve(el);
        });
      }, { threshold: 0.6 });

      obs.observe(el);
    });
  }

  /* ─────────────────────────────────────────────────────
     8. Enhanced reveal variants (left / right / scale)
        Complements per-page `.reveal` observers
  ───────────────────────────────────────────────────── */
  function initEnhancedReveals() {
    var els = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale, .reveal-up');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ─────────────────────────────────────────────────────
     9. Smooth image hover depth — dual service card
  ───────────────────────────────────────────────────── */
  function initImageDepth() {
    document.querySelectorAll('.dual-service-img').forEach(function (wrap) {
      var inner = wrap.querySelector('.dual-photo-inner');
      if (!inner) return;
      wrap.addEventListener('mousemove', function (e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        inner.style.transition = 'transform 0.2s ease-out';
        inner.style.transform  = 'scale(1.04) translate(' + (x * 10) + 'px, ' + (y * 8) + 'px)';
        var floatCard = wrap.querySelector('.dual-float-card');
        if (floatCard) {
          floatCard.style.transition = 'transform 0.25s ease-out';
          floatCard.style.transform  = 'translate(' + (-x * 6) + 'px, ' + (-y * 4) + 'px)';
        }
      });
      wrap.addEventListener('mouseleave', function () {
        var inner2 = wrap.querySelector('.dual-photo-inner');
        var floatCard = wrap.querySelector('.dual-float-card');
        if (inner2) {
          inner2.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
          inner2.style.transform  = 'scale(1) translate(0,0)';
        }
        if (floatCard) {
          floatCard.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
          floatCard.style.transform  = '';
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     Init
  ───────────────────────────────────────────────────── */
  function init() {
    resolveParallax();
    initMagnetic();
    initTilt();
    initStagger();
    initCounters();
    initEnhancedReveals();
    initImageDepth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/**
 * BSP Volume Landing — Haynes Call Funnel v3
 *
 * Minimal. The page qualifies. The call sells.
 *
 * PIXEL CONDITIONING (Haynes):
 * - ONLY fire Meta conversion event on QUALIFIED lead booking
 * - DO NOT fire event on unqualified redirect
 * - This teaches Meta to find ops managers, not bargain hunters
 */

(function () {
  'use strict';

  // ==========================================
  // SUBTLE PARTICLE CANVAS
  // ==========================================
  var canvas = document.getElementById('particleCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var COUNT = 25;
    var MAX_DIST = 120;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var a = 0; a < particles.length; a++) {
        var p = particles[a];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.2)';
        ctx.fill();

        for (var b = a + 1; b < particles.length; b++) {
          var p2 = particles[b];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(0, 212, 170, ' + (0.06 * (1 - dist / MAX_DIST)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ==========================================
  // MULTI-STEP QUALIFICATION FORM
  // Haynes: TypeForm qualification + broky bait filter
  // ==========================================
  var form = document.getElementById('qualify-form');
  if (!form) return;

  var steps = form.querySelectorAll('.form-step');
  var progressFill = document.getElementById('progress-fill');
  var resultQualified = document.getElementById('result-qualified');
  var resultRedirect = document.getElementById('result-redirect');
  var answers = {};
  var currentStep = 0;
  var KEYS = ['agents', 'records', 'spend', 'industry'];

  // Haynes qualification thresholds
  var QUALIFIED = {
    agents: ['5-10', '11-25', '25+'],
    records: ['10k-50k', '50k-100k', '100k+'],
    spend: ['1k-2.5k', '2.5k-5k', '5k+']
  };

  form.addEventListener('click', function (e) {
    var opt = e.target.closest('.form-option');
    if (!opt) return;
    e.preventDefault();

    var step = opt.closest('.form-step');
    var idx = parseInt(step.dataset.step, 10) - 1;
    answers[KEYS[idx]] = opt.dataset.value;

    step.querySelectorAll('.form-option').forEach(function (b) {
      b.classList.remove('selected');
    });
    opt.classList.add('selected');

    setTimeout(advance, 300);
  });

  function advance() {
    currentStep++;
    if (progressFill) {
      progressFill.style.width = Math.min(100, ((currentStep + 1) / steps.length) * 100) + '%';
    }
    if (currentStep >= steps.length) {
      showResult();
      return;
    }
    steps.forEach(function (s) { s.classList.remove('active'); });
    steps[currentStep].classList.add('active');
  }

  function showResult() {
    steps.forEach(function (s) { s.classList.remove('active'); });
    if (progressFill) progressFill.style.width = '100%';

    var isQualified =
      QUALIFIED.agents.indexOf(answers.agents) !== -1 &&
      QUALIFIED.records.indexOf(answers.records) !== -1 &&
      QUALIFIED.spend.indexOf(answers.spend) !== -1;

    if (isQualified) {
      resultQualified.classList.add('active');

      // =====================================================
      // HAYNES PIXEL CONDITIONING:
      // ONLY fire conversion event for QUALIFIED leads.
      // This teaches Meta to find more ops managers like them.
      // =====================================================
      // fbq('track', 'Lead', {
      //   content_name: 'volume_qualified',
      //   industry: answers.industry,
      //   agents: answers.agents,
      //   records: answers.records,
      //   spend: answers.spend
      // });

      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'qualification',
          event_label: 'volume_qualified',
          industry: answers.industry
        });
      }
    } else {
      // DO NOT fire pixel event. Redirect to solopreneur offer.
      // This protects the pixel from optimizing on unqualified traffic.
      resultRedirect.classList.add('active');
    }
  }

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // MOBILE STICKY CTA
  // ==========================================
  var sticky = document.getElementById('mobile-sticky');
  if (sticky) {
    var shown = false;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400 && !shown) {
        sticky.classList.add('visible');
        shown = true;
      } else if (window.scrollY < 100 && shown) {
        sticky.classList.remove('visible');
        shown = false;
      }
    });
  }

})();

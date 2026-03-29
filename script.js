/**
 * BSP Volume Landing Page v2
 * - Particle canvas background (Juggernaut pattern)
 * - Multi-step qualification form with progress bar
 * - Animated counters on scroll (IntersectionObserver)
 * - Social proof notification popup (Scalify pattern)
 * - Mobile sticky CTA (LeO pattern)
 * - Smooth scrolling
 */

(function () {
  'use strict';

  // ==========================================
  // PARTICLE CANVAS (Juggernaut background)
  // ==========================================
  var canvas = document.getElementById('particleCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 40;
    var MAX_DIST = 140;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var a = 0; a < particles.length; a++) {
        var p = particles[a];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.3)';
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
            ctx.strokeStyle = 'rgba(0, 212, 170, ' + (0.08 * (1 - dist / MAX_DIST)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ==========================================
  // MULTI-STEP FORM
  // ==========================================
  var form = document.getElementById('qualify-form');
  if (form) {
    var steps = form.querySelectorAll('.form-step');
    var progressFill = document.getElementById('progress-fill');
    var resultQualified = document.getElementById('result-qualified');
    var resultRedirect = document.getElementById('result-redirect');
    var answers = {};
    var currentStep = 0;
    var STEP_KEYS = ['agents', 'records', 'spend', 'industry'];
    var QUALIFY = {
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
      answers[STEP_KEYS[idx]] = opt.dataset.value;

      step.querySelectorAll('.form-option').forEach(function (b) { b.classList.remove('selected'); });
      opt.classList.add('selected');

      setTimeout(advance, 350);
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

      var qualified =
        QUALIFY.agents.indexOf(answers.agents) !== -1 &&
        QUALIFY.records.indexOf(answers.records) !== -1 &&
        QUALIFY.spend.indexOf(answers.spend) !== -1;

      if (qualified) {
        resultQualified.classList.add('active');
        // PRODUCTION: Fire Meta pixel only for qualified leads
        // fbq('track', 'Lead', { content_name: 'volume_qualified', industry: answers.industry });
      } else {
        resultRedirect.classList.add('active');
      }
    }
  }

  // ==========================================
  // ANIMATED COUNTERS (Juggernaut/LeO pattern)
  // ==========================================
  var counters = document.querySelectorAll('.counter, .stat-num[data-target]');
  var counted = new Set();

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 1500;
    var start = performance.now();

    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      el.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  // ==========================================
  // SOCIAL PROOF NOTIFICATION (Scalify/Juggernaut)
  // ==========================================
  var notif = document.getElementById('social-notification');
  if (notif && window.innerWidth > 640) {
    var names = [
      { name: 'Marcus T.', city: 'Tampa' },
      { name: 'Rachel D.', city: 'Dallas' },
      { name: 'Tommy K.', city: 'Charlotte' },
      { name: 'Gary L.', city: 'Cincinnati' },
      { name: 'Denise W.', city: 'Phoenix' },
      { name: 'Andre G.', city: 'Atlanta' }
    ];
    var actions = [
      'just qualified for volume pricing',
      'just accessed the platform',
      'just booked a strategy call',
      'just exported 25,000 records'
    ];

    var notifText = notif.querySelector('.notif-text');
    var notifClose = notif.querySelector('.notif-close');
    var dismissed = false;

    notifClose.addEventListener('click', function () {
      notif.classList.remove('visible');
      dismissed = true;
    });

    function showNotification() {
      if (dismissed) return;
      var person = names[Math.floor(Math.random() * names.length)];
      var action = actions[Math.floor(Math.random() * actions.length)];
      notifText.innerHTML = '<strong>' + person.name + '</strong> from ' + person.city + ' ' + action;
      notif.classList.add('visible');
      setTimeout(function () {
        notif.classList.remove('visible');
      }, 5000);
    }

    // Show first notification after 8 seconds, then every 25 seconds
    setTimeout(function () {
      showNotification();
      setInterval(showNotification, 25000);
    }, 8000);
  }

  // ==========================================
  // MOBILE STICKY CTA (LeO pattern)
  // ==========================================
  var sticky = document.getElementById('mobile-sticky');
  if (sticky) {
    var stickyShown = false;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600 && !stickyShown) {
        sticky.classList.add('visible');
        stickyShown = true;
      }
      if (window.scrollY < 200 && stickyShown) {
        sticky.classList.remove('visible');
        stickyShown = false;
      }
    });
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
        var offset = 20;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();

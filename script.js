/**
 * BSP Volume Landing Page — Qualification Form + Interactions
 *
 * Haynes framework: TypeForm-style qualification flow.
 * Qualified (5+ agents, 10K+ records, $1K+ spend) → book call / platform access.
 * Unqualified → redirect to solopreneur self-serve offer.
 *
 * Pixel note: In production, fire Meta conversion event ONLY on qualified result.
 */

(function () {
  'use strict';

  const form = document.getElementById('qualify-form');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const resultQualified = document.getElementById('result-qualified');
  const resultRedirect = document.getElementById('result-redirect');

  const answers = {};
  let currentStep = 0;

  // Qualification thresholds (Haynes broky bait filter)
  const QUALIFY_RULES = {
    agents: ['5-10', '11-25', '25+'],
    records: ['10k-50k', '50k-100k', '100k+'],
    spend: ['1k-2.5k', '2.5k-5k', '5k+']
  };

  const STEP_KEYS = ['agents', 'records', 'spend', 'industry'];

  // Handle option clicks
  form.addEventListener('click', function (e) {
    const option = e.target.closest('.form-option');
    if (!option) return;

    e.preventDefault();

    // Store answer
    const step = option.closest('.form-step');
    const stepIndex = parseInt(step.dataset.step, 10) - 1;
    const value = option.dataset.value;
    answers[STEP_KEYS[stepIndex]] = value;

    // Visual feedback
    step.querySelectorAll('.form-option').forEach(function (btn) {
      btn.classList.remove('selected');
    });
    option.classList.add('selected');

    // Advance after brief delay
    setTimeout(function () {
      advanceStep();
    }, 300);
  });

  function advanceStep() {
    currentStep++;

    if (currentStep >= steps.length) {
      showResult();
      return;
    }

    // Hide current, show next
    steps.forEach(function (s) { s.classList.remove('active'); });
    steps[currentStep].classList.add('active');
  }

  function showResult() {
    // Hide all steps
    steps.forEach(function (s) { s.classList.remove('active'); });

    // Check qualification
    var qualified =
      QUALIFY_RULES.agents.indexOf(answers.agents) !== -1 &&
      QUALIFY_RULES.records.indexOf(answers.records) !== -1 &&
      QUALIFY_RULES.spend.indexOf(answers.spend) !== -1;

    if (qualified) {
      resultQualified.classList.add('active');

      // PRODUCTION: Fire Meta qualified conversion event here
      // fbq('track', 'Lead', { content_name: 'volume_qualified', industry: answers.industry });
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'qualification',
          event_label: 'volume_qualified',
          industry: answers.industry
        });
      }
    } else {
      resultRedirect.classList.add('active');

      // DO NOT fire conversion event for unqualified — protects pixel
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Progress indicator — show step count
  steps.forEach(function (step, i) {
    var label = step.querySelector('label');
    if (label) {
      var counter = document.createElement('span');
      counter.className = 'step-counter';
      counter.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      counter.style.display = 'block';
      counter.style.fontSize = '0.75rem';
      counter.style.color = '#8892a4';
      counter.style.marginBottom = '8px';
      counter.style.fontWeight = '500';
      counter.style.textTransform = 'uppercase';
      counter.style.letterSpacing = '1px';
      label.parentNode.insertBefore(counter, label);
    }
  });
})();

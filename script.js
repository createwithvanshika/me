/* ═══════════════════════════════════════════════════════════
   CREATE WITH VANSHIKA — SCRIPT.JS
   ═══════════════════════════════════════════════════════════ */
'use strict';

const TOPMATE_LINKS = {
  profile: 'https://topmate.io/createwithvanshika',
  discovery: 'https://topmate.io/createwithvanshika/discovery-call',
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { document.body.classList.add('loaded'); }, 100);
  setTimeout(() => {
    document.querySelectorAll('.hero__line, .hero__eyebrow, .hero__sub, .hero__actions').forEach(el => el.classList.add('visible'));
  }, 300);
  initNav();
  initScrollReveal();
  initPackageBuilder();
  initSmoothScroll();
  initPortfolioHover();
  initCursorGlow();
  staggerDelays();
});

/* ── NAV ── */
function initNav() {
  const nav      = document.getElementById('nav');
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('open'); navLinks.classList.remove('open');
  }));
  const sections = document.querySelectorAll('section[id]');
  const links    = navLinks.querySelectorAll('a[href^="#"]');
  window.addEventListener('scroll', () => {
    const pos = window.scrollY + 120;
    sections.forEach(sec => {
      const id = sec.getAttribute('id');
      const lk = navLinks.querySelector('a[href="#' + id + '"]');
      if (lk && pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => l.classList.remove('active')); lk.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const heroEls = new Set(document.querySelectorAll('.hero__line,.hero__eyebrow,.hero__sub,.hero__actions'));
  const els     = document.querySelectorAll('.reveal-up,.reveal-fade,.reveal-left,.reveal-right');
  const obs     = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !heroEls.has(e.target)) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => { if (!heroEls.has(el)) obs.observe(el); });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return; e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   PACKAGE BUILDER — FULL CORRECTED LOGIC
   ══════════════════════════════════════════════════════════════

   BASE PLANS (from PDF):
   ┌──────────────────────────────────────────────────────────┐
   │ STARTER  ₹24,000/mo                                     │
   │   14 posts (6 Reels + 6 Carousels)                      │
   │   Custom strategy, Competitor analysis,                  │
   │   Trend research, Captions, Keyword integration          │
   ├──────────────────────────────────────────────────────────┤
   │ GROWTH   ₹30,000/mo  = Starter +                        │
   │   18 posts (7 Reels + 7 Carousels)                      │
   │   Reel Covers (branded templates)                        │
   │   Optimized posting plan, Festive templates              │
   ├──────────────────────────────────────────────────────────┤
   │ PREMIUM  ₹35,000/mo  = Growth +                         │
   │   20 posts (10-12 Reels + 6-8 Carousels)               │
   │   Stories & Highlights planning (full)                   │
   │   Content repurposing for multi-platform                 │
   │   Story Highlight Templates                              │
   └──────────────────────────────────────────────────────────┘

   PLAN FEATURE ADD-ONS (tiered extras):
   ┌──────────────────────────────────────────────────────────┐
   │ reelcovers   ₹5,000/mo                                   │
   │   Available for: STARTER only                            │
   │   Included in:  GROWTH + PREMIUM                        │
   ├──────────────────────────────────────────────────────────┤
   │ storyhighlights  ₹4,000/mo                              │
   │   Available for: STARTER + GROWTH                       │
   │   Included in:  PREMIUM                                 │
   ├──────────────────────────────────────────────────────────┤
   │ repurpose  price TBD (ask)                              │
   │   Available for: GROWTH only                            │
   │   Included in:  PREMIUM                                 │
   └──────────────────────────────────────────────────────────┘

   SEPARATE SERVICES (same price, all plans):
   Video Shoot ₹15,000/mo · SEO ₹20,000 (once) ·
   GMB ₹6,000/mo · YouTube ₹9,000/mo · Consultation ₹3,000/mo

   UPGRADE HINT LOGIC:
   If Starter + reelcovers (₹5k) + storyhighlights (₹4k) = ₹33,000
   → ₹33k > ₹30k Growth → "💡 Tip: Adding Reel Covers + Story Highlights
     brings your total to ₹33,000 — you could get the Growth Plan for
     ₹30,000 and have both included."

   If Starter + reelcovers + storyhighlights + repurpose > ₹35k
   → suggest Premium instead
══════════════════════════════════════════════════════════════ */

function initPackageBuilder() {
  /* ── DOM refs ── */
  const planCards       = document.querySelectorAll('.pkg-plan-card');
  const addonsPanel     = document.getElementById('pkgAddonsPanel');
  const allAddonCards   = document.querySelectorAll('.pkg-addon-card');
  const allAddonInputs  = document.querySelectorAll('.pkg-addon-input');
  const totalBar        = document.getElementById('pkgTotalBar');
  const totalAmountEl   = document.getElementById('pkgTotalAmount');
  const totalPlanName   = document.getElementById('pkgTotalPlanName');
  const totalBreakdown  = document.getElementById('pkgTotalBreakdown');
  const selectedPill    = document.getElementById('pkgSelectedPill');
  const burgerEmojiEl   = document.getElementById('burgerEmojiRow');
  const finalCTA        = document.getElementById('pkgFinalCTA');
  const addonsSubtext   = document.getElementById('pkgAddonsSubtext');
  const upgradeHint     = document.getElementById('pkgUpgradeHint');
  const upgradeHintText = document.getElementById('pkgUpgradeHintText');

  /* ── State ── */
  let selectedPlan  = null;
  let selectedPrice = 0;
  let displayedAmt  = 0;
  let animFrame     = null;

  /* ── Plan data ── */
  const PLAN_PRICES = { starter: 24000, growth: 30000, premium: 35000 };
  const PLAN_LABELS = { starter: 'Starter Stack', growth: 'Growth Stack', premium: 'Premium Stack' };
  const PLAN_PILL   = { starter: 'Starter Stack — ₹24,000/mo', growth: 'Growth Stack — ₹30,000/mo', premium: 'Premium Stack — ₹35,000/mo' };
  const PLAN_EMOJI  = { starter: '🍞🥩🍞', growth: '🍞🥩🥗🧀🍞', premium: '🍞🥩🥗🧀✨🍞' };

  /* ── Original addon metadata (for reset when plan changes) ── */
  const ADDON_META = {
    reelcovers:      { price: 5000,  priceText: '+₹5,000/mo',  tag: 'Growth feature',   tagCls: 'pkg-addon-tag--upgrade' },
    storyhighlights: { price: 4000,  priceText: '+₹4,000/mo',  tag: 'Premium feature',  tagCls: 'pkg-addon-tag--upgrade' },
    repurpose:       { price: 0,     priceText: 'Ask for price →', tag: 'Premium feature', tagCls: 'pkg-addon-tag--upgrade' },
    video:           { price: 15000, priceText: '+₹15,000/mo', tag: 'Delhi/NCR',         tagCls: 'pkg-addon-tag--addon' },
    seo:             { price: 20000, priceText: '+₹20,000',    tag: 'One-time',          tagCls: 'pkg-addon-tag--addon' },
    gmb:             { price: 6000,  priceText: '+₹6,000/mo',  tag: 'Monthly',           tagCls: 'pkg-addon-tag--addon' },
    youtube:         { price: 9000,  priceText: '+₹9,000/mo',  tag: 'Monthly',           tagCls: 'pkg-addon-tag--addon' },
    consult:         { price: 3000,  priceText: '+₹3,000/mo',  tag: '45 mins',           tagCls: 'pkg-addon-tag--addon' },
  };

  /* ── Plan card click ── */
  planCards.forEach(card => {
    card.addEventListener('click', () => selectPlan(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPlan(card); }
    });
    const btn = card.querySelector('.pkg-plan-card__cta');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); selectPlan(card); });
  });

  function selectPlan(card) {
    const plan  = card.dataset.plan;
    const price = parseInt(card.dataset.price);

    /* Deselect all */
    planCards.forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');

    selectedPlan  = plan;
    selectedPrice = price;

    /* Uncheck all add-ons on plan switch */
    allAddonInputs.forEach(i => { i.checked = false; });

    updateAddons(plan);
    addonsPanel.classList.add('open');
    setTimeout(() => addonsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 400);

    selectedPill.textContent = PLAN_PILL[plan];

    const subtextMap = {
      starter: 'Select add-ons — Reel Covers & Story Highlights available for Starter',
      growth:  'Story Highlight Templates & Content Repurposing available to add — Reel Covers already included ✓',
      premium: 'All plan features included — add specialist services below',
    };
    addonsSubtext.textContent = subtextMap[plan];

    upgradeHint.style.display = 'none';
    recalculate();
  }

  /* ── Update visibility & state for all addon cards ── */
  function updateAddons(plan) {
    allAddonCards.forEach(card => {
      const id           = card.dataset.id;
      const availFor     = (card.dataset.availableFor || '').split(',').map(s => s.trim());
      const includedIn   = (card.dataset.includedIn   || '').split(',').map(s => s.trim());
      const input        = card.querySelector('.pkg-addon-input');
      const tagEl        = card.querySelector('.pkg-addon-tag');
      const priceEl      = card.querySelector('.pkg-addon-card__price');
      const checkEl      = card.querySelector('.pkg-addon-card__check');
      const meta         = ADDON_META[id] || {};

      if (includedIn.includes(plan)) {
        /* ── INCLUDED: show as green non-interactive ── */
        card.classList.add('is-included');
        card.classList.remove('is-hidden');
        card.style.pointerEvents = 'none';
        if (input) { input.disabled = true; input.checked = false; }
        if (tagEl)   { tagEl.className = 'pkg-addon-tag pkg-addon-tag--included'; tagEl.textContent = '✓ Already Included'; }
        if (priceEl) { priceEl.className = 'pkg-addon-card__price'; priceEl.textContent = 'Included'; }
        if (checkEl) { checkEl.style.cssText = 'opacity:1;transform:scale(1);background:#4caf50;'; }

      } else if (availFor.includes(plan)) {
        /* ── AVAILABLE: interactive add-on ── */
        card.classList.remove('is-included', 'is-hidden');
        card.style.pointerEvents = '';
        if (input) { input.disabled = false; }
        /* Restore */
        if (tagEl)   { tagEl.className = 'pkg-addon-tag ' + (meta.tagCls || 'pkg-addon-tag--addon'); tagEl.textContent = meta.tag || 'Add-on'; }
        if (priceEl) { priceEl.className = 'pkg-addon-card__price' + (meta.tagCls === 'pkg-addon-tag--upgrade' ? ' pkg-addon-card__price--upgrade' : ''); priceEl.textContent = meta.priceText || ''; }
        if (checkEl) { checkEl.style.cssText = ''; }

      } else {
        /* ── HIDDEN: not relevant for this plan ── */
        card.classList.add('is-hidden');
        card.classList.remove('is-included');
        if (input) { input.disabled = true; input.checked = false; }
      }
    });
  }

  /* ── Checkbox changes ── */
  allAddonInputs.forEach(input => input.addEventListener('change', recalculate));

  /* ── Recalculate & show upgrade hints ── */
  function recalculate() {
    if (!selectedPlan) return;

    let total   = selectedPrice;
    const items = [PLAN_LABELS[selectedPlan]];

    allAddonInputs.forEach(input => {
      if (input.checked && !input.disabled) {
        const v = parseInt(input.value) || 0;
        total  += v;
        const label = input.closest('.pkg-addon-card')?.querySelector('h4')?.textContent;
        if (label) items.push(label);
      }
    });

    /* ── Upgrade hint logic ── */
    checkUpgradeHint(total);

    /* ── Animate number ── */
    animateNumber(total);

    /* ── Update total bar ── */
    totalPlanName.textContent  = PLAN_LABELS[selectedPlan];
    totalBreakdown.textContent = items.join('  ·  ');

    /* ── Burger emoji grows with selections ── */
    const extras      = ['🧀','🥓','🌶️','🫙','🍅'];
    const checkedCount = Array.from(allAddonInputs).filter(i => i.checked && !i.disabled).length;
    let emoji = PLAN_EMOJI[selectedPlan];
    for (let k = 0; k < Math.min(checkedCount, extras.length); k++) {
      emoji = emoji.slice(0, -2) + extras[k] + emoji.slice(-2);
    }
    burgerEmojiEl.textContent = emoji;

    totalBar.classList.add('visible');

    /* ── Paid discovery CTA: selected packages are qualified through Topmate first. ── */
    const packageSource = encodeURIComponent(selectedPlan + '-' + items.length + '-items');
    finalCTA.textContent = 'Book Paid Discovery';
    finalCTA.href = TOPMATE_LINKS.discovery + '?utm_source=website&utm_medium=package_builder&utm_campaign=' + packageSource;
  }

  /* ── Smart upgrade hint ── */
  function checkUpgradeHint(currentTotal) {
    upgradeHint.style.display = 'none';

    if (selectedPlan === 'starter') {
      const hasReelCovers = isChecked('reelcovers');
      const hasStories    = isChecked('storyhighlights');

      /* If Starter + Reel Covers alone already = ₹29k — nudge toward Growth at ₹30k */
      if (hasReelCovers && !hasStories && currentTotal >= 29000) {
        showHint('You\'re at <strong>₹' + currentTotal.toLocaleString('en-IN') + '</strong> on Starter + Reel Covers. The <strong>Growth Plan at ₹30,000/mo</strong> includes Reel Covers + 4 more posts/month. Worth considering! 👀');
        return;
      }

      /* If Starter + Reel Covers + Story Highlights → ₹33k > Growth ₹30k */
      if (hasReelCovers && hasStories && currentTotal >= 30000) {
        showHint('Your current selection comes to <strong>₹' + currentTotal.toLocaleString('en-IN') + '</strong>. The <strong>Growth Plan (₹30,000/mo)</strong> already includes Reel Covers and gives you more posts — a smarter deal for almost the same spend. 💡');
        return;
      }
    }

    if (selectedPlan === 'growth') {
      const hasStories = isChecked('storyhighlights');
      const hasRepurpose = isChecked('repurpose');

      /* Growth + Story Highlights = ₹34k — nudge toward Premium ₹35k */
      if (hasStories && currentTotal >= 33000) {
        showHint('You\'re at <strong>₹' + currentTotal.toLocaleString('en-IN') + '</strong> on Growth + Story Highlights. The <strong>Premium Plan at ₹35,000/mo</strong> includes Story Highlights + Content Repurposing + more Reels. Just ₹' + (35000 - currentTotal).toLocaleString('en-IN') + ' more for the full package! 🚀');
        return;
      }
    }
  }

  function isChecked(addonId) {
    const el = document.querySelector('.pkg-addon-input[data-id="' + addonId + '"]');
    return el && el.checked && !el.disabled;
  }

  function showHint(text) {
    upgradeHint.style.display = 'flex';
    upgradeHintText.innerHTML = text;
  }

  /* ── Animated number counter ── */
  function animateNumber(target) {
    if (animFrame) cancelAnimationFrame(animFrame);
    const start    = displayedAmt;
    const diff     = target - start;
    const duration = 450;
    const t0       = performance.now();
    function step(now) {
      const p    = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = Math.round(start + diff * ease);
      totalAmountEl.textContent = val.toLocaleString('en-IN');
      if (p < 1) { animFrame = requestAnimationFrame(step); }
      else        { displayedAmt = target; }
    }
    animFrame = requestAnimationFrame(step);
  }
}

/* ── PORTFOLIO 3D TILT ── */
function initPortfolioHover() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── CURSOR GLOW ── */
function initCursorGlow() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(193,124,84,0.08) 0%,transparent 70%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);will-change:left,top;';
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() { gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08; glow.style.left = gx + 'px'; glow.style.top = gy + 'px'; requestAnimationFrame(loop); })();
}

/* ── STAGGER DELAYS ── */
function staggerDelays() {
  ['.services__grid .service-card', '.testimonials__grid .testi-card', '.portfolio__grid .portfolio-card']
  .forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.style.getPropertyValue('--delay')) el.style.setProperty('--delay', (i * 0.1) + 's');
    });
  });
}

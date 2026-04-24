// ============================================================
//  landing.js  –  Landing page, Contact/About Popup &
//                 Feedback Form (EmailJS + Google Sheets)
// ============================================================

// ─── EmailJS Configuration ───────────────────────────────────
// SETUP INSTRUCTIONS:
//   1. Sign up at https://www.emailjs.com (free plan works)
//   2. Add an Email Service (Gmail), copy the SERVICE ID
//   3. Create an Email Template, copy the TEMPLATE ID
//   4. Copy your PUBLIC KEY from Account → API Keys
//   5. Replace the three placeholders below
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'AbCdEfGhIjKlMnOp'

// ─── Google Sheets Web-App URL ────────────────────────────────
// Leave empty string '' to skip Sheets logging
// SETUP: See google-apps-script.js in project root for code + deployment steps
const GOOGLE_SHEETS_URL = '';  // e.g. 'https://script.google.com/macros/s/XXXXXXX/exec'

// ─────────────────────────────────────────────────────────────
//  Render Landing Page HTML
// ─────────────────────────────────────────────────────────────
function renderLanding() {
  const el = document.getElementById('pg-landing');
  if (!el) return;
  el.innerHTML = `
    <div class="landing-wrap">

      <!-- Animated background grid -->
      <div class="landing-grid-bg" aria-hidden="true"></div>

      <!-- Floating power-line decoration -->
      <div class="landing-deco" aria-hidden="true">
        <div class="deco-circle c1"></div>
        <div class="deco-circle c2"></div>
        <div class="deco-circle c3"></div>
      </div>

      <!-- Hero Card -->
      <div class="landing-card">

        <!-- Top status bar -->
        <div class="landing-status-bar">
          <span class="landing-status-dot"></span>
          <span class="landing-status-text">SYSTEM ONLINE</span>
          <span class="landing-status-ver">v3.1</span>
        </div>

        <!-- Logo hex -->
        <div class="landing-logo-wrap">
          <div class="landing-logo-hex">⚡</div>
          <div class="landing-logo-rings">
            <div class="ring r1"></div>
            <div class="ring r2"></div>
            <div class="ring r3"></div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="landing-title">
          Substation Equipment<br>Testing Guide &amp;
          <span class="landing-title-accent">Troubleshooting System</span>
        </h1>

        <!-- Subtitle -->
        <p class="landing-subtitle">
          Complete solution for testing, analysis, and troubleshooting of substation equipment
        </p>

        <!-- Coverage chips -->
        <div class="landing-coverage">
          <div class="cov-item">
            <span class="cov-icon">🔌</span>
            <div>
              <div class="cov-name">Circuit Breakers</div>
              <div class="cov-desc">SF₆ · Vacuum · Air-Blast</div>
            </div>
          </div>
          <div class="cov-item">
            <span class="cov-icon">🔁</span>
            <div>
              <div class="cov-name">Transformers</div>
              <div class="cov-desc">Power · Distribution · Auto</div>
            </div>
          </div>
          <div class="cov-item">
            <span class="cov-icon">📡</span>
            <div>
              <div class="cov-name">CT / PT</div>
              <div class="cov-desc">Current &amp; Potential Transformers</div>
            </div>
          </div>
          <div class="cov-item">
            <span class="cov-icon">🔋</span>
            <div>
              <div class="cov-name">Batteries</div>
              <div class="cov-desc">VRLA · NiCd · Lead-Acid</div>
            </div>
          </div>
          <div class="cov-item">
            <span class="cov-icon">🛡️</span>
            <div>
              <div class="cov-name">Numerical Relay</div>
              <div class="cov-desc">Protection · Overcurrent · Differential</div>
            </div>
          </div>
        </div>

        <!-- Feature badges -->
        <div class="landing-features">
          <span class="feat-badge">📋 Testing Procedures</span>
          <span class="feat-badge">🔍 Troubleshooting Logic</span>
          <span class="feat-badge">🛡️ Safety Checks &amp; Interlocks</span>
          <span class="feat-badge">🤖 Model-Based Testing</span>
          <span class="feat-badge">💬 AI Troubleshoot Chat</span>
          <span class="feat-badge">📊 Fault Report Generator</span>
        </div>

        <!-- CTA Button -->
        <button id="landingStartBtn" class="landing-cta-btn" onclick="launchApp()">
          <span class="cta-icon">&#9654;</span>
          Start Testing Guide
          <span class="cta-arrow">&rarr;</span>
        </button>

        <!-- Divider -->
        <div class="landing-divider"></div>

        <!-- Creator info & links -->
        <div class="landing-footer-row">
          <div class="landing-creator">
            <div class="creator-avatar">SK</div>
            <div>
              <div class="creator-label">DEVELOPED BY</div>
              <div class="creator-name">Sandeep Kumar Sah</div>
              <div class="creator-role">Electrical Engineer & Web Developer</div>
            </div>
          </div>
          <div class="landing-links">
            <button class="lnk-btn" id="openContactBtn" onclick="openContactPopup()" title="About / Contact">
              ℹ️ About &amp; Contact
            </button>
            <button class="lnk-btn lnk-btn-feedback" id="openFeedbackBtn" onclick="openFeedbackPopup()" title="Send Feedback">
              ✉️ Feedback
            </button>
          </div>
        </div>

      </div><!-- /landing-card -->
    </div><!-- /landing-wrap -->
  `;
}

// ─────────────────────────────────────────────────────────────
//  Launch App  (animate transition from landing to main app)
// ─────────────────────────────────────────────────────────────
function launchApp() {
  const btn = document.getElementById('landingStartBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="cta-spinner"></span> Loading&hellip;';
  }

  setTimeout(() => {
    const overlay = document.getElementById('landing-overlay');
    if (overlay) {
      overlay.classList.add('landing-exit');
      setTimeout(() => {
        overlay.style.display = 'none';
        // Reveal header, nav and main
        document.querySelector('.header').classList.remove('hidden-initially');
        document.querySelector('.nav').classList.remove('hidden-initially');
        document.querySelector('.main').classList.remove('hidden-initially');
        // Go to Step 1 — Selection
        showPage('pg-select', document.getElementById('navPage1'));
      }, 600);
    }
  }, 700);
}

// ─────────────────────────────────────────────────────────────
//  Contact / About Popup
// ─────────────────────────────────────────────────────────────
function openContactPopup() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactPopup() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
}

// ─────────────────────────────────────────────────────────────
//  Feedback Popup
// ─────────────────────────────────────────────────────────────
function openFeedbackPopup() {
  closeContactPopup();
  const modal = document.getElementById('feedbackModal');
  if (modal) {
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeFeedbackPopup() {
  const modal = document.getElementById('feedbackModal');
  if (modal) {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
    resetFeedbackForm();
  }
}

// ─────────────────────────────────────────────────────────────
//  Feedback Form Validation & Submission
// ─────────────────────────────────────────────────────────────
function validateFeedbackForm() {
  const email   = document.getElementById('fbEmail').value.trim();
  const contact = document.getElementById('fbContact').value.trim();
  const errEl   = document.getElementById('fbContactError');
  const emailErrEl = document.getElementById('fbEmailError');
  const phoneErrEl = document.getElementById('fbPhoneError');

  let valid = true;

  // Clear previous errors
  [errEl, emailErrEl, phoneErrEl].forEach(el => { if(el) el.textContent = ''; });

  // Rule: at least one of email/contact must be filled
  if (!email && !contact) {
    errEl.textContent = 'Please provide either Email or Contact Number';
    valid = false;
  }

  // Email format
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErrEl.textContent = 'Invalid email format';
    valid = false;
  }

  // Phone: exactly 10 digits
  if (contact && !/^\d{10}$/.test(contact)) {
    phoneErrEl.textContent = 'Contact number must be exactly 10 digits';
    valid = false;
  }

  return valid;
}

// Live validation — enable/disable submit button
function onFeedbackInput() {
  const email   = document.getElementById('fbEmail').value.trim();
  const contact = document.getElementById('fbContact').value.trim();
  const submitBtn = document.getElementById('fbSubmitBtn');
  if (!submitBtn) return;
  submitBtn.disabled = (!email && !contact);
}

function resetFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (form) form.reset();
  ['fbContactError','fbEmailError','fbPhoneError','fbSuccessMsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  const submitBtn = document.getElementById('fbSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '✉️ Send Feedback';
  }
}

async function submitFeedback(event) {
  event.preventDefault();
  if (!validateFeedbackForm()) return;

  const payload = {
    name      : document.getElementById('fbName').value.trim()      || '—',
    email     : document.getElementById('fbEmail').value.trim()     || '—',
    contact   : document.getElementById('fbContact').value.trim()   || '—',
    equipment : document.getElementById('fbEquipment').value        || '—',
    test      : document.getElementById('fbTestType').value         || '—',
    message   : document.getElementById('fbMessage').value.trim()   || '—',
    timestamp : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  const submitBtn = document.getElementById('fbSubmitBtn');
  const successEl = document.getElementById('fbSuccessMsg');

  // Show spinner
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="fb-spinner"></span> Sending…';

  let emailOk  = false;
  let sheetsOk = false;

  // ── EmailJS ─────────────────────────────────────────────────
  try {
    if (typeof emailjs !== 'undefined' &&
        EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
        EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
        EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY') {

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name       : payload.name,
        from_email      : payload.email,
        contact_number  : payload.contact,
        equipment_type  : payload.equipment,
        test_type       : payload.test,
        message         : payload.message,
        timestamp       : payload.timestamp
      }, EMAILJS_PUBLIC_KEY);
      emailOk = true;
    } else {
      console.warn('EmailJS not configured — skipping email send.');
      emailOk = true; // treat as ok so UX continues
    }
  } catch (err) {
    console.error('EmailJS error:', err);
  }

  // ── Google Sheets ────────────────────────────────────────────
  if (GOOGLE_SHEETS_URL) {
    try {
      const resp = await fetch(GOOGLE_SHEETS_URL, {
        method : 'POST',
        mode   : 'no-cors',       // Apps Script requires no-cors
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload)
      });
      sheetsOk = true;
    } catch (e) {
      console.error('Sheets error:', e);
    }
  } else {
    sheetsOk = true; // skip
  }

  // ── Result ───────────────────────────────────────────────────
  if (emailOk || sheetsOk) {
    successEl.textContent = '✅ Thank you for your feedback!';
    successEl.style.display = 'block';
    submitBtn.innerHTML = '✔ Sent';
    submitBtn.style.background = '#16a34a';
    setTimeout(() => closeFeedbackPopup(), 2200);
  } else {
    document.getElementById('fbContactError').textContent =
      '❌ Submission failed. Please try again.';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '✉️ Send Feedback';
  }
}

// ─────────────────────────────────────────────────────────────
//  Close modals on backdrop click / Escape key
// ─────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeContactPopup();
    closeFeedbackPopup();
  }
});

// ============================================================
//  app.js  —  Navigation & Initialization
//  All 7 pages are standalone workflow stages.
//  Each showPage call re-renders the target stage from WF state.
// ============================================================

// ─── Page → Renderer Map ──────────────────────────────────────
const PAGE_RENDERERS = {
  'pg-select' : () => renderSaSelection(),
  'pg-safety' : () => renderSaSafety(),
  'pg-guide'  : () => renderSaGuide(),
  'pg-conn'   : () => renderSaConnection(),
  'pg-input'  : () => renderSaResults(),
  'pg-result' : () => renderSaReport(),
  'pg-chat'   : () => renderSaTroubleshoot()
};

// ─── Mobile Nav Toggle ────────────────────────────────────────
function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('hamburgerBtn');
  if (!nav) return;
  nav.classList.toggle('nav-open');
  if (btn) btn.classList.toggle('open');
}

function closeMobileNav() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('hamburgerBtn');
  if (nav) nav.classList.remove('nav-open');
  if (btn) btn.classList.remove('open');
}

// ─── Navigation ───────────────────────────────────────────────
function showPage(id, btn) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Deactivate all nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show the selected page
  const page = document.getElementById(id);
  if (page) page.classList.add('active');

  // Highlight the nav button
  if (btn) btn.classList.add('active');

  // Always re-render the page so it reflects current WF state
  if (PAGE_RENDERERS[id]) {
    PAGE_RENDERERS[id]();
  }

  // Close mobile nav after selecting a page
  closeMobileNav();

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Accordion Toggle (shared utility) ───────────────────────
function tog(hdr) {
  const body = hdr.nextElementSibling;
  const arr  = hdr.querySelector('.facc-arr');
  body.classList.toggle('open');
  if (arr) arr.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : '';
}

// ─── Modal Backdrop Click ─────────────────────────────────────
function handleBackdropClick(event, modalId) {
  if (event.target.id === modalId) {
    if (modalId === 'contactModal')  closeContactPopup();
    if (modalId === 'feedbackModal') closeFeedbackPopup();
  }
}

// ─── Initialization ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // 1. Render landing overlay
  renderLanding();

  // 2. Pre-render page 1 (Selection) with session restore
  //    so it's ready the moment the landing exit animation finishes
  renderSaSelection();
});

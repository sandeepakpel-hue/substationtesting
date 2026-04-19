// ============================================================
//  safety.js — Page 2: Safety Checklist Renderer & Logic
//  Reads from: SAFETY_CHECKS (data.js)
// ============================================================

function renderSafety() {
  const container = document.getElementById('pg-safety');
  if (!container) return;

  function renderList(id, items) {
    return items.map(text =>
      `<li class="sitem" onclick="chk(this)"><div class="scheck">✓</div><div class="stext">${text}</div></li>`
    ).join('');
  }

  const totalItems = SAFETY_CHECKS.hvIsolation.items.length + SAFETY_CHECKS.controlSupply.items.length;

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 02</div>
      <div class="sec-title">Pre-Test Safety Checklist</div>
      <div class="sec-line"></div>
    </div>

    <div class="alert a-fail" style="margin-bottom:18px;">
      <div class="alert-title">⚠ MANDATORY — Complete All Checks Before ANY Test Operation</div>
      <div class="alert-body">All 400kV work is Class-A safety procedure. No exceptions. Breaker must be isolated, earthed, and DC control verified before testing begins.</div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head"><span class="card-icon">${SAFETY_CHECKS.hvIsolation.icon}</span><span class="card-title">${SAFETY_CHECKS.hvIsolation.title}</span></div>
        <div class="card-body">
          <ul class="slist" id="safetyList1">${renderList('safetyList1', SAFETY_CHECKS.hvIsolation.items)}</ul>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-icon">${SAFETY_CHECKS.controlSupply.icon}</span><span class="card-title">${SAFETY_CHECKS.controlSupply.title}</span></div>
        <div class="card-body">
          <ul class="slist" id="safetyList2">${renderList('safetyList2', SAFETY_CHECKS.controlSupply.items)}</ul>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="card-body" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <div>
          <span id="safetyScore" style="font-family:var(--mono);font-size:13px;color:var(--text3);">0 / ${totalItems} checks completed</span>
          <div class="progress" style="width:220px;height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-top:6px;">
            <div id="safetyBar" style="height:100%;background:var(--green);width:0%;transition:width .4s;"></div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="showPage('pg-guide',document.querySelectorAll('.nav-btn')[2])">→ Proceed to Testing Guide</button>
      </div>
    </div>
  `;
}

function chk(item) {
  item.classList.toggle('chk');
  updateSafety();
}

function updateSafety() {
  const total = document.querySelectorAll('.sitem').length;
  const done = document.querySelectorAll('.sitem.chk').length;
  const sc = document.getElementById('safetyScore');
  const sb = document.getElementById('safetyBar');
  if (sc) sc.textContent = `${done} / ${total} checks completed`;
  if (sb) sb.style.width = `${(done / total * 100)}%`;
  if (sc) sc.style.color = done === total ? 'var(--green)' : 'var(--text3)';
}

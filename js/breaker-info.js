// ============================================================
//  breaker-info.js — Page 1: Breaker Type Selection & Info
//  Reads from: BREAKER_TYPES, BREAKER_DATA, COIL_RELAY_SPECS,
//              TEST_LIMITS_TABLE (data.js)
// ============================================================

function renderBreakerInfo() {
  const container = document.getElementById('pg-select');
  if (!container) return;

  // Build dropdown options
  const dropdownOptions = BREAKER_TYPES.map(bt =>
    `<option value="${bt.id}" ${bt.id === ACTIVE_BREAKER_ID ? 'selected' : ''}>${bt.label}</option>`
  ).join('');

  // Nameplate table rows
  const nameplateRows = BREAKER_INFO.nameplate.map(row =>
    `<tr><td>${row.param}</td><td class="mono">${row.bold ? '<strong>' + row.value + '</strong>' : row.value}</td></tr>`
  ).join('');

  // Coil & Relay table rows
  const coilRows = COIL_RELAY_SPECS.map(row =>
    `<tr><td class="mono"><strong>${row.designation}</strong></td><td>${row.description}</td><td class="mono">${row.rating}</td></tr>`
  ).join('');

  // Test limits table rows
  const limitsRows = TEST_LIMITS_TABLE.map(row =>
    `<tr>
      <td>${row.test}</td>
      <td class="mono ${row.min !== '—' && row.min !== '>100' && row.min !== '>80' ? 'pass' : ''}">${row.min}</td>
      <td class="mono ${row.max !== '—' ? 'fail' : ''}">${row.max}</td>
      <td>${row.unit}</td>
      <td>${row.action}</td>
    </tr>`
  ).join('');

  const activeLabel = getActiveBreakerLabel();

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 01</div>
      <div class="sec-title">Breaker Type</div>
      <div class="sec-line"></div>
    </div>

    <!-- Breaker Type Selector -->
    <div class="breaker-type-selector" style="margin-bottom:22px;">
      <div class="card">
        <div class="card-head">
          <span class="card-icon">🔧</span>
          <span class="card-title">SELECT BREAKER TYPE</span>
        </div>
        <div class="card-body" style="padding:20px;">
          <label class="fl" for="breakerTypeSelect">BREAKER MODEL</label>
          <select class="fs breaker-type-dropdown" id="breakerTypeSelect" onchange="onBreakerTypeChange(this.value)">
            ${dropdownOptions}
          </select>
          <div class="fi-note" style="margin-top:8px;">
            <span class="badge b-info" style="margin-right:6px;">ACTIVE</span>
            <span id="activeBreakerBadge">${activeLabel}</span>
            — All test limits, nameplate data, and coil specs update automatically.
          </div>
        </div>
      </div>
    </div>

    <div class="g2" style="margin-bottom:18px;">
      <!-- Nameplate Data -->
      <div class="card">
        <div class="card-head"><span class="card-icon">🏷️</span><span class="card-title">NAMEPLATE DATA — ${activeLabel}</span></div>
        <div class="card-body">
          <table class="tbl">
            <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
            <tbody>${nameplateRows}</tbody>
          </table>
        </div>
      </div>

      <!-- Coil & Relay Data + Test Limits -->
      <div>
        <div class="card" style="margin-bottom:16px;">
          <div class="card-head"><span class="card-icon">⚙️</span><span class="card-title">COIL & RELAY SPECIFICATIONS</span></div>
          <div class="card-body">
            <table class="tbl">
              <thead><tr><th>Designation</th><th>Description</th><th>Rating</th></tr></thead>
              <tbody>${coilRows}</tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><span class="card-icon">📋</span><span class="card-title">TEST LIMITS — ${activeLabel}</span></div>
          <div class="card-body">
            <table class="tbl">
              <thead><tr><th>Test</th><th>Min</th><th>Max</th><th>Unit</th><th>Action if Fail</th></tr></thead>
              <tbody>${limitsRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align:center;">
      <button class="btn btn-primary" onclick="showPage('pg-safety',document.querySelectorAll('.nav-btn')[1])">→ Proceed to Safety Checklist</button>
    </div>
  `;
}

// ── Breaker Type Change Handler ──
function onBreakerTypeChange(newId) {
  if (!BREAKER_DATA[newId]) return;
  ACTIVE_BREAKER_ID = newId;

  const hdrBreaker = document.getElementById('hdrBreaker');
  if (hdrBreaker) hdrBreaker.textContent = BREAKER_INFO.headerLabel;

  const logoSub = document.querySelector('.logo-sub');
  if (logoSub) logoSub.textContent = getActiveBreakerLabel().toUpperCase() + ' · POWERGRID';
  if (typeof syncNavBreakerTypeSelect === 'function') syncNavBreakerTypeSelect();

  // Re-render the Breaker Type page
  renderBreakerInfo();

  // Mark other pages as needs-re-render (they use LIMITS etc.)
  ['pg-safety', 'pg-guide', 'pg-input', 'pg-result', 'pg-conn', 'pg-chat'].forEach(pgId => {
    const pg = document.getElementById(pgId);
    if (pg) delete pg.dataset.rendered;
  });
}

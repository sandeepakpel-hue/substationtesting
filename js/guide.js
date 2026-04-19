// ============================================================
//  guide.js — Page 3: Testing Guide Renderer & Logic
//  Reads from: TESTING_GUIDES (data.js)
// ============================================================

function renderGuide() {
  const container = document.getElementById('pg-guide');
  if (!container) return;

  const guideKeys = Object.keys(TESTING_GUIDES);

  // Build tab buttons
  const tabs = guideKeys.map((key, i) => {
    const g = TESTING_GUIDES[key];
    const cls = i === 0 ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
    return `<button class="${cls}" onclick="showGuide('${g.id}',this)">${g.label}</button>`;
  }).join('\n');

  // Build guide sections
  const sections = guideKeys.map((key, i) => {
    const g = TESTING_GUIDES[key];
    const display = i === 0 ? '' : 'style="display:none;"';
    return `<div id="${g.id}" ${display}>${renderGuideSection(g)}</div>`;
  }).join('\n');

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 03</div>
      <div class="sec-title">Step-by-Step Testing Guide</div>
      <div class="sec-line"></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;" id="guideTabs">
      ${tabs}
    </div>
    ${sections}
  `;
}

function renderGuideSection(guide) {
  // Steps
  const stepsHtml = guide.steps.map((s, i) => `
    <li class="step">
      <div class="step-num">${i + 1}</div>
      <div class="step-content">
        <div class="step-title">${s.title}</div>
        <div class="step-body">${s.body}</div>
        ${s.caution ? `<div class="step-caution">⚠ ${s.caution}</div>` : ''}
      </div>
    </li>
  `).join('');

  // Faults accordion
  let faultsHtml = '';
  if (guide.faults && guide.faults.length > 0) {
    faultsHtml = `
      <div class="card">
        <div class="card-head"><span class="card-icon">🔍</span><span class="card-title">COMMON PROBLEMS — INSTANT DIAGNOSIS</span></div>
        <div class="card-body" style="padding:0;">
          ${guide.faults.map(f => renderFaultAccordion(f)).join('')}
        </div>
      </div>
    `;
  }

  // Timing-specific extras
  let timingExtras = '';
  if (guide.limitsTable) {
    const limRows = guide.limitsTable.map(r => `
      <tr>
        <td>${r.operation}</td>
        <td class="pass mono">${r.min}</td>
        <td class="fail mono">${r.max}</td>
        <td class="fail mono">${r.poleDiff}</td>
      </tr>
    `).join('');
    timingExtras += `
      <div class="card" style="margin-bottom:14px;">
        <div class="card-head"><span class="card-icon">📊</span><span class="card-title">TIMING LIMITS — SFM-40S</span></div>
        <div class="card-body">
          <table class="tbl">
            <thead><tr><th>Operation</th><th>Min (ms)</th><th>Max (ms)</th><th>Pole Diff</th></tr></thead>
            <tbody>${limRows}</tbody>
          </table>
          ${guide.coilInfo ? `
            <div class="alert a-info" style="margin-top:12px;">
              <div class="alert-title">${guide.coilInfo.title}</div>
              <div class="alert-body">${guide.coilInfo.body}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // IR-specific extras
  let irExtras = '';
  if (guide.irLimitsTable) {
    const irRows = guide.irLimitsTable.map(r => `
      <tr>
        <td class="mono">${r.value}</td>
        <td class="${r.statusClass}" style="${r.statusClass === 'amber' ? 'color:var(--amber);font-weight:600;' : ''}">${r.status}</td>
        <td>${r.action}</td>
      </tr>
    `).join('');
    irExtras = `
      <div>
        <table class="tbl" style="margin-bottom:14px;">
          <thead><tr><th>IR Value</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${irRows}</tbody>
        </table>
        ${guide.lowIRAction ? `<div class="alert a-warn"><div class="alert-title">Low IR — Instant Action</div><div class="alert-body">${guide.lowIRAction}</div></div>` : ''}
      </div>
    `;
  }

  // Coil-specific extras
  let coilExtras = '';
  if (guide.outOfRangeInfo) {
    coilExtras = `
      <div>
        <div class="alert a-warn" style="margin-bottom:12px;">
          <div class="alert-title">Out-of-Range Coil Resistance</div>
          <div class="alert-body">${guide.outOfRangeInfo}</div>
        </div>
        ${guide.supervisionInfo ? `<div class="alert a-info"><div class="alert-title">Supervision Resistor R1</div><div class="alert-body">${guide.supervisionInfo}</div></div>` : ''}
      </div>
    `;
  }

  // Pole discrepancy extras
  let pdExtras = '';
  if (guide.poleDiscAlarm) {
    pdExtras = `<div class="alert a-warn"><div class="alert-title">Pole Discrepancy Alarm During Testing</div><div class="alert-body">${guide.poleDiscAlarm}</div></div>`;
  }

  // Anti-pumping extras
  let apExtras = '';
  if (guide.failureInfo) {
    apExtras = `<div class="alert a-fail"><div class="alert-title">Anti-Pumping Failure — Breaker Re-closes After Trip</div><div class="alert-body">${guide.failureInfo}</div></div>`;
  }

  // Layout: steps on left, extras on right
  const hasRight = timingExtras || faultsHtml || irExtras || coilExtras || pdExtras || apExtras;

  if (hasRight) {
    return `
      <div class="g2">
        <div class="card">
          <div class="card-head"><span class="card-icon">${guide.cardIcon}</span><span class="card-title">${guide.cardTitle}</span></div>
          <div class="card-body">
            <ul class="steps">${stepsHtml}</ul>
          </div>
        </div>
        <div>
          ${timingExtras}${faultsHtml}${irExtras}${coilExtras}${pdExtras}${apExtras}
        </div>
      </div>
    `;
  }

  // IR/Coil/PD/AP sections use a card with g2 inside
  return `
    <div class="card">
      <div class="card-head"><span class="card-icon">${guide.cardIcon}</span><span class="card-title">${guide.cardTitle}</span></div>
      <div class="card-body">
        <div class="g2">
          <ul class="steps">${stepsHtml}</ul>
          <div>${irExtras}${coilExtras}${pdExtras}${apExtras}</div>
        </div>
      </div>
    </div>
  `;
}

function renderFaultAccordion(fault) {
  const headClass = fault.type === 'fail' ? 'fail-head' : 'warn-head';
  return `
    <div class="facc" style="border:none;border-radius:0;box-shadow:none;margin:0;border-bottom:1px solid var(--border);">
      <div class="facc-head ${headClass}" onclick="tog(this)">
        <div><div class="facc-title">${fault.title}</div>${fault.subtitle ? `<div class="facc-val">${fault.subtitle}</div>` : '<div class="facc-val">Typical causes & fix</div>'}</div>
        <div class="facc-arr">▾</div>
      </div>
      <div class="facc-body">
        <div class="facc-2col">
          <div><div class="facc-sec-label">Causes</div><ul class="facc-list">${fault.causes.map(c => `<li>${c}</li>`).join('')}</ul></div>
          <div><div class="facc-sec-label">Action</div><ul class="facc-list">${fault.actions.map(a => `<li>${a}</li>`).join('')}</ul></div>
        </div>
        ${fault.circuit ? `<div class="facc-ckt"><div class="th">TRACE IN DRAWING</div>${fault.circuit}</div>` : ''}
      </div>
    </div>
  `;
}

function showGuide(id, btn) {
  document.querySelectorAll('#guideTabs .btn').forEach(b => { b.className = 'btn btn-outline btn-sm'; });
  btn.className = 'btn btn-primary btn-sm';
  const guideIds = Object.values(TESTING_GUIDES).map(g => g.id);
  guideIds.forEach(g => {
    const el = document.getElementById(g);
    if (el) el.style.display = g === id ? 'block' : 'none';
  });
}

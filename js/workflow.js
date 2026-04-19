// ============================================================
//  js/workflow.js  —  Guided Workflow Controller
//  7-Stage structured testing workflow:
//  Selection → Safety → Guide → Connections → Results → Report → Troubleshoot
// ============================================================

// ─── State ──────────────────────────────────────────────────
let WF = {
  stage: 0,
  equipment: null,
  model: null,
  test: null,
  safety: {},
  safetyDone: false,
  results: {},
  remarks: '',
  report: null
};

// ─── Stage Config ────────────────────────────────────────────
const WF_STAGES = [
  { label: 'Selection',     icon: '①', desc: 'Choose equipment & test' },
  { label: 'Safety Check',  icon: '②', desc: 'Mandatory safety confirmation' },
  { label: 'Test Guide',    icon: '③', desc: 'Procedure & standard limits' },
  { label: 'Connections',   icon: '④', desc: 'Wiring & terminal details' },
  { label: 'Enter Results', icon: '⑤', desc: 'Input & validate test values' },
  { label: 'Fault Report',  icon: '⑥', desc: 'Auto-generated report' },
  { label: 'Troubleshoot',  icon: '⑦', desc: 'Diagnosis & chat assistant' }
];

const WF_SAFETY_CHECKS = [
  { id: 'iso',  icon: '🔒', label: 'Isolation Confirmed',          desc: 'All sources of supply are isolated and locked off (LOTO applied).' },
  { id: 'erth', icon: '⏚',  label: 'Proper Earthing Applied',      desc: 'Earthing clamps applied on all three phases on both sides of the equipment.' },
  { id: 'ptw',  icon: '📋', label: 'Permit to Work (PTW) Obtained', desc: 'A valid PTW has been issued and signed by the authorised person (AP).' },
  { id: 'ppe',  icon: '🦺', label: 'PPE Verified',                  desc: 'All personnel wearing correct PPE: HV gloves, helmet, safety shoes, arc flash suit where required.' },
  { id: 'disc', icon: '⚡', label: 'Equipment Discharged & Dead',   desc: 'Capacitive charge discharged and equipment confirmed DEAD with approved voltage detector.' }
];

// ─── Main Render ─────────────────────────────────────────────
function renderWorkflow() {
  const el = document.getElementById('pg-workflow');
  if (!el) return;
  el.innerHTML = `
    <div class="wf-outer">
      <div class="wf-stepper-wrap">
        <div class="wf-stepper" id="wfStepper"></div>
      </div>
      <div class="wf-content-area">
        <div class="wf-content" id="wfContent"></div>
        <div class="wf-nav-bar" id="wfNavBar"></div>
      </div>
    </div>
  `;
  wfRestoreSession();
  wfUpdate();
}

// ─── Update (re-render stepper + content + nav) ───────────────
function wfUpdate() {
  wfUpdateStepper();
  wfRenderStage();
  wfRenderNavBar();
  wfScrollToContent();
}

// ─── Stepper ──────────────────────────────────────────────────
function wfUpdateStepper() {
  const el = document.getElementById('wfStepper');
  if (!el) return;
  el.innerHTML = WF_STAGES.map((s, i) => {
    const done   = i < WF.stage;
    const active = i === WF.stage;
    const cls    = done ? 'wf-step done' : active ? 'wf-step active' : 'wf-step';
    const clickable = done ? `onclick="wfGoTo(${i})" style="cursor:pointer;"` : '';
    return `
      <div class="${cls}" ${clickable}>
        <div class="wf-step-circle">${done ? '✓' : s.icon}</div>
        <div class="wf-step-info">
          <div class="wf-step-label">${s.label}</div>
          <div class="wf-step-sub">${s.desc}</div>
        </div>
        ${i < WF_STAGES.length - 1 ? '<div class="wf-step-connector"></div>' : ''}
      </div>`;
  }).join('');
}

// ─── Stage Router ─────────────────────────────────────────────
function wfRenderStage() {
  switch (WF.stage) {
    case 0: wfRenderSelection();    break;
    case 1: wfRenderSafety();       break;
    case 2: wfRenderGuide();        break;
    case 3: wfRenderConnection();   break;
    case 4: wfRenderResults();      break;
    case 5: wfRenderReport();       break;
    case 6: wfRenderTroubleshoot(); break;
  }
}

// ─── Navigation Bar ───────────────────────────────────────────
function wfRenderNavBar() {
  const bar = document.getElementById('wfNavBar');
  if (!bar) return;
  const isLast = WF.stage === WF_STAGES.length - 1;
  // Determine if Next should be disabled on selection stage
  const nextDisabled = WF.stage === 0 && (!WF.equipment || !WF.model || !WF.test);
  bar.innerHTML = `
    <div class="wf-nav-inner">
      ${WF.stage > 0 ? `<button class="btn btn-outline" onclick="wfBack()">← Back</button>` : '<span></span>'}
      <div class="wf-nav-progress">
        <span class="wf-nav-step-label">Step ${WF.stage + 1} of ${WF_STAGES.length}</span>
        <span class="wf-nav-step-name">${WF_STAGES[WF.stage].label}</span>
      </div>
      ${!isLast
        ? `<button class="btn btn-primary wf-next-btn" id="wfNextBtn" onclick="wfNext()" ${nextDisabled ? 'disabled title="Complete all selections first"' : ''}>Next →</button>`
        : `<button class="btn btn-success wf-next-btn" onclick="wfConfirmNewTest()">🔄 Start New Test</button>`}
    </div>
  `;
  // Update the nav badge
  wfUpdateNavBadge();
}

function wfUpdateNavBadge() {
  const btn = document.getElementById('navWorkflowBtn');
  if (!btn) return;
  // Show current stage number on the nav button
  const existing = btn.querySelector('.wf-stage-badge');
  if (existing) existing.remove();
  if (WF.stage > 0) {
    const badge = document.createElement('span');
    badge.className = 'wf-stage-badge';
    badge.textContent = WF.stage + 1;
    btn.appendChild(badge);
  }
}

// ─── Navigation Actions ───────────────────────────────────────
function wfNext() {
  if (!wfValidate()) return;
  WF.stage++;
  wfSaveSession();
  wfUpdate();
}
function wfBack() {
  WF.stage = Math.max(0, WF.stage - 1);
  wfSaveSession();
  wfUpdate();
}
function wfGoTo(i) {
  if (i >= WF.stage) return; // can only go back to completed steps
  WF.stage = i;
  wfSaveSession();
  wfUpdate();
}
function wfScrollToContent() {
  const el = document.getElementById('wfContent');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Validation Router ────────────────────────────────────────
function wfValidate() {
  switch (WF.stage) {
    case 0: return wfValidateSelection();
    case 1: return wfValidateSafety();
    case 4: return wfValidateResults();
    default: return true;
  }
}

// ══════════════════════════════════════════════════════════════
//  STAGE 0 — SELECTION
// ══════════════════════════════════════════════════════════════
function wfRenderSelection() {
  const c = document.getElementById('wfContent');
  const equipOpts = WORKFLOW_DATA.equipment
    .map(e => `<option value="${e.id}" ${WF.equipment && WF.equipment.id === e.id ? 'selected' : ''}>${e.name}</option>`)
    .join('');

  c.innerHTML = `
    <div class="wf-stage">
      <div class="wf-stage-hdr">
        <div class="wf-stage-num primary">01</div>
        <div>
          <h2 class="wf-stage-title">Equipment &amp; Test Selection</h2>
          <p class="wf-stage-desc">Select the equipment type, model, and test type to begin the guided workflow.</p>
        </div>
      </div>

      <div class="wf-sel-stack">

        <!-- ① Equipment -->
        <div class="wf-sel-card ${WF.equipment ? 'done' : ''}">
          <div class="wf-sel-step-badge">① EQUIPMENT TYPE</div>
          <select class="wf-select" id="wfEquipSel" onchange="wfOnEquip(this.value)">
            <option value="">— Select Equipment Type —</option>
            ${equipOpts}
          </select>
        </div>

        <!-- ② Model -->
        <div class="wf-sel-card ${WF.model ? 'done' : WF.equipment ? '' : 'locked'}" id="wfModelCard">
          <div class="wf-sel-step-badge">② EQUIPMENT MODEL</div>
          ${!WF.equipment
            ? `<div class="wf-sel-locked">Select equipment type first</div>`
            : WF.equipment.models.length === 0
              ? `<div class="wf-coming-soon"><span>⚠️</span> Models coming soon for <strong>${WF.equipment.name}</strong></div>`
              : `<select class="wf-select" id="wfModelSel" onchange="wfOnModel(this.value)">
                  <option value="">— Select Model —</option>
                  ${WF.equipment.models.map(m => `<option value="${m.id}" ${WF.model && WF.model.id === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                 </select>`
          }
        </div>

        <!-- ③ Test -->
        <div class="wf-sel-card ${WF.test ? 'done' : WF.model ? '' : 'locked'}" id="wfTestCard">
          <div class="wf-sel-step-badge">③ TEST TYPE</div>
          ${!WF.model
            ? `<div class="wf-sel-locked">Select model first</div>`
            : !WF.model.tests || WF.model.tests.length === 0
              ? `<div class="wf-coming-soon"><span>⚠️</span> Test details coming soon for <strong>${WF.model.name}</strong></div>`
              : `<select class="wf-select" id="wfTestSel" onchange="wfOnTest(this.value)">
                  <option value="">— Select Test —</option>
                  ${WF.model.tests.map(t => `<option value="${t.id}" ${WF.test && WF.test.id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                 </select>`
          }
        </div>

      </div>

      <!-- Selection Summary -->
      ${WF.test ? `
        <div class="wf-sel-summary">
          <div class="wf-sel-summary-title">✅ Selection Complete — Ready to Proceed</div>
          <div class="wf-sel-summary-grid">
            <div class="wf-sum-item"><div class="wf-sum-key">Equipment</div><div class="wf-sum-val">${WF.equipment.icon} ${WF.equipment.name}</div></div>
            <div class="wf-sum-item"><div class="wf-sum-key">Model</div><div class="wf-sum-val">${WF.model.name}</div></div>
            <div class="wf-sum-item"><div class="wf-sum-key">Test</div><div class="wf-sum-val">${WF.test.name}</div></div>
          </div>
        </div>` : ''}

      <div id="wfSelErr" class="wf-err-msg" style="display:none">
        ⚠️ Please complete all three selections (Equipment → Model → Test) before proceeding.
      </div>
    </div>
  `;
}

function wfOnEquip(id) {
  WF.equipment = WORKFLOW_DATA.equipment.find(e => e.id === id) || null;
  WF.model = null;
  WF.test = null;
  wfSaveSession();
  wfRenderSelection();
}
function wfOnModel(id) {
  WF.model = WF.equipment ? WF.equipment.models.find(m => m.id === id) || null : null;
  WF.test = null;
  wfSaveSession();
  wfRenderSelection();
}
function wfOnTest(id) {
  WF.test = WF.model ? WF.model.tests.find(t => t.id === id) || null : null;
  wfSaveSession();
  wfRenderSelection();
}
function wfValidateSelection() {
  if (!WF.equipment || !WF.model || !WF.test) {
    const e = document.getElementById('wfSelErr');
    if (e) { e.style.display = 'flex'; setTimeout(() => e.style.display = 'none', 4000); }
    return false;
  }
  return true;
}

// ══════════════════════════════════════════════════════════════
//  STAGE 1 — SAFETY CHECK
// ══════════════════════════════════════════════════════════════
function wfRenderSafety() {
  const c = document.getElementById('wfContent');
  const count = wfSafetyCount();
  c.innerHTML = `
    <div class="wf-stage">
      <div class="wf-stage-hdr danger-hdr">
        <div class="wf-stage-num danger">02</div>
        <div>
          <h2 class="wf-stage-title">Safety Check — COMPULSORY</h2>
          <p class="wf-stage-desc">
            All 5 safety checks below MUST be confirmed before testing. This step
            <strong>cannot be skipped</strong> under any circumstances.
          </p>
        </div>
      </div>

      <div class="wf-safety-banner">
        ⚠️ WARNING: Failure to confirm safety measures may result in serious injury or death.
        Confirm every item below has been physically verified on-site.
      </div>

      <div class="wf-safety-list">
        ${WF_SAFETY_CHECKS.map(ch => `
          <label class="wf-safety-item ${WF.safety[ch.id] ? 'checked' : ''}" id="sitem_${ch.id}">
            <input type="checkbox" id="sch_${ch.id}"
              ${WF.safety[ch.id] ? 'checked' : ''}
              onchange="wfOnSafe('${ch.id}', this.checked)">
            <div class="wf-safe-icon">${ch.icon}</div>
            <div class="wf-safe-body">
              <div class="wf-safe-label">${ch.label}</div>
              <div class="wf-safe-desc">${ch.desc}</div>
            </div>
            <div class="wf-safe-tick" id="stk_${ch.id}">${WF.safety[ch.id] ? '✓' : ''}</div>
          </label>
        `).join('')}
      </div>

      <div class="wf-safety-progress">
        <div class="wf-safe-prog-label" id="wfSafeLabel">${count}/5 safety checks completed</div>
        <div class="wf-safe-prog-track">
          <div class="wf-safe-prog-fill" id="wfSafeFill" style="width:${count/5*100}%"></div>
        </div>
      </div>

      <div id="wfSafeErr" class="wf-err-msg" style="display:none">
        ⚠️ Complete all 5 safety checks before proceeding to the testing procedure.
      </div>
    </div>
  `;
}

function wfSafetyCount() {
  return WF_SAFETY_CHECKS.filter(ch => WF.safety[ch.id]).length;
}
function wfOnSafe(id, checked) {
  WF.safety[id] = checked;
  wfSaveSession();
  const item = document.getElementById(`sitem_${id}`);
  const tick = document.getElementById(`stk_${id}`);
  if (item) item.classList.toggle('checked', checked);
  if (tick) tick.textContent = checked ? '✓' : '';
  const count = wfSafetyCount();
  const lbl  = document.getElementById('wfSafeLabel');
  const fill = document.getElementById('wfSafeFill');
  if (lbl)  lbl.textContent = `${count}/5 safety checks completed`;
  if (fill) fill.style.width = `${count / 5 * 100}%`;
  if (count === 5) { const e = document.getElementById('wfSafeErr'); if (e) e.style.display = 'none'; }
}
function wfValidateSafety() {
  if (wfSafetyCount() < 5) {
    const e = document.getElementById('wfSafeErr');
    if (e) { e.style.display = 'flex'; setTimeout(() => e.style.display = 'none', 4000); }
    return false;
  }
  WF.safetyDone = true;
  return true;
}

// ══════════════════════════════════════════════════════════════
//  STAGE 2 — TESTING GUIDE
// ══════════════════════════════════════════════════════════════
function wfRenderGuide() {
  const c = document.getElementById('wfContent');
  const t = WF.test;
  if (!t) { c.innerHTML = wfComingSoon('Testing guide not available for this selection.'); return; }

  c.innerHTML = `
    <div class="wf-stage">
      <div class="wf-stage-hdr">
        <div class="wf-stage-num primary">03</div>
        <div>
          <h2 class="wf-stage-title">${t.name} — Testing Guide</h2>
          <p class="wf-stage-desc">${WF.equipment.icon} ${WF.equipment.name} › ${WF.model.name}</p>
        </div>
      </div>

      ${wfCard('🎯', 'OBJECTIVE', `<p class="wf-para">${t.objective}</p>`)}

      ${wfCard('🔧', 'REQUIRED TOOLS &amp; EQUIPMENT', `<ul class="wf-list">${t.tools.map(x=>`<li>${x}</li>`).join('')}</ul>`)}

      ${wfCard('✅', 'PRE-TEST CHECKS', `<ul class="wf-list check-list">${t.preChecks.map(x=>`<li>${x}</li>`).join('')}</ul>`)}

      ${wfCard('📋', 'STEP-BY-STEP PROCEDURE', `<ul class="steps">${t.steps.map(s=>`
        <li class="step">
          <div class="step-num">${s.num}</div>
          <div class="step-content">
            <div class="step-title">${s.title}</div>
            <div class="step-body">${s.body}</div>
          </div>
        </li>`).join('')}</ul>`)}

      ${wfCard('📐', 'STANDARD LIMITS', `
        <div class="tbl-wrap"><table class="tbl">
          <thead><tr><th>Parameter</th><th>Min</th><th>Max</th><th>Unit</th><th>On Fail</th></tr></thead>
          <tbody>${t.limits.map(l=>`<tr>
            <td>${l.param}</td>
            <td class="mono">${l.min !== null ? l.min : '—'}</td>
            <td class="mono">${l.max !== null ? l.max : '—'}</td>
            <td class="mono">${l.unit}</td>
            <td><span class="badge ${l.critical==='FAIL'?'b-fail':l.critical==='WARN'?'b-warn':'b-info'}">${l.critical}</span></td>
          </tr>`).join('')}</tbody>
        </table></div>`)}
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════
//  STAGE 3 — CONNECTIONS
// ══════════════════════════════════════════════════════════════
function wfRenderConnection() {
  const c = document.getElementById('wfContent');
  const conn = WF.test ? WF.test.connections : null;
  if (!conn) { c.innerHTML = wfComingSoon('Connection details not yet available for this test type.'); return; }

  c.innerHTML = `
    <div class="wf-stage">
      <div class="wf-stage-hdr">
        <div class="wf-stage-num primary">04</div>
        <div>
          <h2 class="wf-stage-title">Connection Details</h2>
          <p class="wf-stage-desc">Follow these connection instructions precisely before performing the test.</p>
        </div>
      </div>

      ${wfCard('🔌', 'CONNECTION OVERVIEW', `<p class="wf-para">${conn.description}</p>`)}

      <div class="card wf-sec">
        <div class="card-head"><span class="card-icon">📐</span><span class="card-title">CONNECTION DIAGRAM / SCHEMATIC</span></div>
        <div class="card-body">
          <div class="wf-diagram">
            <div class="wf-diagram-icon">📊</div>
            <div class="wf-diagram-title">Connection Diagram</div>
            <div class="wf-diagram-sub">Refer to the equipment wiring diagram and OEM SLD/schematic for the detailed connection drawing.<br>
            Follow terminal designations shown in the table below.</div>
          </div>
        </div>
      </div>

      ${wfCard('⚡', 'TERMINAL CONNECTION POINTS', `
        <div class="tbl-wrap"><table class="tbl">
          <thead><tr><th>Terminal / TB</th><th>Lead / Relay</th><th>Function</th><th>Note</th></tr></thead>
          <tbody>${conn.terminals.map(t=>`<tr>
            <td class="mono">${t.tb}</td>
            <td class="mono">${t.relay}</td>
            <td>${t.function}</td>
            <td class="mono" style="color:var(--amber)">${t.note || '—'}</td>
          </tr>`).join('')}</tbody>
        </table></div>`)}

      ${conn.precautions ? wfCard('⚠️', 'CONNECTION PRECAUTIONS', `<ul class="wf-list warn-list">${conn.precautions.map(p=>`<li>${p}</li>`).join('')}</ul>`) : ''}
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════
//  STAGE 4 — ENTER TEST RESULTS
// ══════════════════════════════════════════════════════════════
function wfRenderResults() {
  const c = document.getElementById('wfContent');
  const t = WF.test;
  if (!t || !t.inputs || !t.inputs.length) {
    c.innerHTML = wfComingSoon('Result input form coming soon for this test type.');
    return;
  }
  c.innerHTML = `
    <div class="wf-stage">
      <div class="wf-stage-hdr">
        <div class="wf-stage-num primary">05</div>
        <div>
          <h2 class="wf-stage-title">Enter Test Results</h2>
          <p class="wf-stage-desc">Enter measured values. Auto-validation compares with standard limits in real-time.</p>
        </div>
      </div>

      <div class="card wf-sec">
        <div class="card-head">
          <span class="card-icon">📊</span>
          <span class="card-title">${t.name} — MEASURED VALUES</span>
        </div>
        <div class="card-body">
          <div class="wf-results-grid">
            ${t.inputs.map(inp => `
              <div class="fg wf-inp-group" id="fg_${inp.id}">
                <label class="fl" for="ri_${inp.id}">
                  ${inp.label}${inp.unit ? ` <span class="wf-unit">(${inp.unit})</span>` : ''}
                </label>
                <div class="wf-inp-row">
                  <input id="ri_${inp.id}" type="${inp.type}" class="fi wf-ri"
                    value="${WF.results[inp.id] !== undefined ? WF.results[inp.id] : ''}"
                    step="${inp.step || 'any'}" placeholder="Enter value"
                    oninput="wfOnResult('${inp.id}', this.value)">
                  <span class="wf-ri-badge" id="rb_${inp.id}"></span>
                </div>
                <div class="iind" id="rid_${inp.id}"></div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div id="wfResErr" class="wf-err-msg" style="display:none">
        ⚠️ Please enter at least one result value before proceeding.
      </div>
    </div>
  `;
  // Re-validate previously entered values
  Object.entries(WF.results).forEach(([id, val]) => { if (val !== '') wfOnResult(id, String(val)); });
}

function wfOnResult(id, value) {
  WF.results[id] = value;
  wfSaveSession();
  const inp = WF.test.inputs.find(i => i.id === id);
  if (!inp) return;
  const badge = document.getElementById(`rb_${id}`);
  const ind   = document.getElementById(`rid_${id}`);
  const input = document.getElementById(`ri_${id}`);
  const fg    = document.getElementById(`fg_${id}`);

  if (!value || value === '') {
    [badge, ind].forEach(el => { if (el) { el.textContent = ''; el.className = el.tagName === 'SPAN' ? 'wf-ri-badge' : 'iind'; } });
    if (input) input.className = 'fi wf-ri';
    if (fg) fg.className = 'fg wf-inp-group';
    return;
  }

  const num = parseFloat(value);
  let status = 'pass', msg = '✓ Within limits';

  if ((inp.max !== null && num > inp.max) || (inp.min !== null && num < inp.min)) {
    status = 'fail';
    msg = inp.max !== null && num > inp.max
      ? `✗ Exceeds max (${inp.max} ${inp.unit})`
      : `✗ Below min (${inp.min} ${inp.unit})`;
  } else if (inp.warn !== null) {
    const nearHigh = inp.max !== null && num > inp.warn && num <= inp.max;
    const nearLow  = inp.min !== null && num < inp.warn && num >= inp.min;
    if (nearHigh || nearLow) {
      status = 'warn';
      msg = `⚠ Near limit — monitor`;
    }
  }

  if (badge) { badge.textContent = status === 'fail' ? '✗' : status === 'warn' ? '⚠' : '✓'; badge.className = `wf-ri-badge ${status}`; }
  if (ind)   { ind.textContent = msg; ind.className = `iind ${status}`; }
  if (input) input.className = `fi wf-ri ${status}`;
  if (fg)    fg.className = `fg wf-inp-group ${status}-group`;
}

function wfValidateResults() {
  const any = Object.values(WF.results).some(v => v !== '' && v !== undefined && v !== null);
  if (!any) {
    const e = document.getElementById('wfResErr');
    if (e) { e.style.display = 'flex'; setTimeout(() => e.style.display = 'none', 4000); }
    return false;
  }
  return true;
}

// ══════════════════════════════════════════════════════════════
//  STAGE 5 — FAULT REPORT
// ══════════════════════════════════════════════════════════════
function wfRenderReport() {
  const c = document.getElementById('wfContent');
  const t  = WF.test;
  const ts = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Evaluate each input
  const rows = (t.inputs || []).map(inp => {
    const val = WF.results[inp.id];
    if (val === undefined || val === '') return { inp, val: '—', status: 'ns', cls: '' };
    const num = parseFloat(val);
    let status = 'PASS', cls = 'pass';
    if ((inp.max !== null && num > inp.max) || (inp.min !== null && num < inp.min)) { status = 'FAIL'; cls = 'fail'; }
    else if (inp.warn !== null) {
      const nearH = inp.max !== null && num > inp.warn;
      const nearL = inp.min !== null && num < inp.warn;
      if (nearH || nearL) { status = 'WARN'; cls = 'warn'; }
    }
    return { inp, val, status, cls };
  });

  const hasFail = rows.some(r => r.status === 'FAIL');
  const hasWarn = rows.some(r => r.status === 'WARN');
  const overall = hasFail ? 'FAULTY' : hasWarn ? 'INVESTIGATE' : 'HEALTHY';
  const ofBase  = hasFail ? 'a-fail' : hasWarn ? 'a-warn' : 'a-pass';
  const resCls  = hasFail ? 'res-fail' : hasWarn ? 'res-warn' : 'res-pass';
  WF.report = { overall, rows, ts };
  wfSaveSession();

  c.innerHTML = `
    <div class="wf-stage" id="wfReportPrint">
      <div class="wf-stage-hdr">
        <div class="wf-stage-num primary">06</div>
        <div>
          <h2 class="wf-stage-title">Fault Report — Auto-Generated</h2>
          <p class="wf-stage-desc">Report generated: ${ts}</p>
        </div>
      </div>

      <div class="res-banner ${ofBase}">
        <div class="res-status ${resCls}">${overall}</div>
        <div class="res-meta">${WF.equipment.name} &nbsp;|&nbsp; ${WF.model.name} &nbsp;|&nbsp; ${t.name}</div>
      </div>

      ${wfCard('🏭', 'EQUIPMENT DETAILS', `
        <div class="g2">
          <div><span class="fl">Equipment</span><div>${WF.equipment.icon} ${WF.equipment.name}</div></div>
          <div><span class="fl">Model</span><div>${WF.model.name}</div></div>
          <div><span class="fl">Test Type</span><div>${t.name}</div></div>
          <div><span class="fl">Test Date/Time</span><div class="mono">${ts}</div></div>
        </div>
        ${WF.model.specs ? `
        <div class="div"></div>
        <div class="g2">
          ${Object.entries(WF.model.specs).map(([k,v])=>`<div><span class="fl">${k}</span><div class="mono">${v}</div></div>`).join('')}
        </div>` : ''}`)}

      ${wfCard('📊', 'TEST RESULTS', `
        <div class="tbl-wrap"><table class="tbl">
          <thead><tr><th>Parameter</th><th>Measured</th><th>Unit</th><th>Limit</th><th>Status</th></tr></thead>
          <tbody>${rows.map(r=>`<tr>
            <td>${r.inp.label}</td>
            <td class="mono ${r.cls}">${r.val}</td>
            <td class="mono">${r.inp.unit || '—'}</td>
            <td class="mono">${r.inp.min !== null && r.inp.max !== null ? r.inp.min+'–'+r.inp.max : r.inp.max !== null ? '≤ '+r.inp.max : r.inp.min !== null ? '≥ '+r.inp.min : '—'}</td>
            <td><span class="badge ${r.status==='PASS'?'b-pass':r.status==='FAIL'?'b-fail':r.status==='WARN'?'b-warn':'b-info'}">${r.status}</span></td>
          </tr>`).join('')}</tbody>
        </table></div>`)}

      ${wfCard('📝', 'REMARKS &amp; RECOMMENDATION', `
        <div class="alert ${ofBase}">
          <div class="alert-title">
            ${overall==='HEALTHY'?'✅ Equipment is Healthy':overall==='FAULTY'?'❌ Equipment Requires Urgent Attention':'⚠️ Further Investigation Required'}
          </div>
          <div class="alert-body">
            ${overall==='HEALTHY'
              ? 'All measured parameters are within acceptable limits. Equipment is fit for service.'
              : hasFail
                ? `The following parameters exceeded limits: <strong>${rows.filter(r=>r.status==='FAIL').map(r=>r.inp.label).join(', ')}</strong>. Equipment should NOT be energized without rectification.`
                : `The following parameters are in the warning zone: <strong>${rows.filter(r=>r.status==='WARN').map(r=>r.inp.label).join(', ')}</strong>. Monitor closely and schedule maintenance.`}
          </div>
        </div>
        <div style="margin-top:14px">
          <label class="fl">Engineer Remarks (Optional)</label>
          <textarea class="ft" rows="3" placeholder="Add test engineer remarks, observations, or recommendations…"
            oninput="WF.remarks = this.value; wfSaveSession();">${WF.remarks || ''}</textarea>
        </div>`)}

      <div class="wf-report-actions">
        <button class="btn btn-outline" onclick="wfPrintReport()">🖨️ Print / Export PDF</button>
        <button class="btn btn-primary" onclick="wfExportCSV()">📥 Download CSV Report</button>
      </div>
    </div>
  `;
}

function wfPrintReport() { window.print(); }

function wfExportCSV() {
  const t  = WF.test;
  const ts = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const rows = (t.inputs || []).map(inp => {
    const val = WF.results[inp.id];
    if (val === undefined || val === '') return { inp, val: 'NOT ENTERED', status: 'N/A' };
    const num = parseFloat(val);
    let status = 'PASS';
    if ((inp.max !== null && num > inp.max) || (inp.min !== null && num < inp.min)) status = 'FAIL';
    else if (inp.warn !== null) {
      const nearH = inp.max !== null && num > inp.warn;
      const nearL = inp.min !== null && num < inp.warn;
      if (nearH || nearL) status = 'WARN';
    }
    return { inp, val, status };
  });
  const hasFail = rows.some(r => r.status === 'FAIL');
  const hasWarn = rows.some(r => r.status === 'WARN');
  const overall = hasFail ? 'FAULTY' : hasWarn ? 'INVESTIGATE' : 'HEALTHY';

  let csv = 'SUBSTATION EQUIPMENT TESTING GUIDE - FAULT REPORT\n';
  csv += `Generated:,${ts}\n\n`;
  csv += 'EQUIPMENT DETAILS\n';
  csv += `Equipment Type,${WF.equipment.name}\n`;
  csv += `Model,${WF.model.name}\n`;
  csv += `Test Type,${t.name}\n`;
  if (WF.model.specs) {
    Object.entries(WF.model.specs).forEach(([k, v]) => { csv += `${k},${v}\n`; });
  }
  csv += `\nOVERALL STATUS,${overall}\n\n`;
  csv += 'TEST RESULTS\n';
  csv += 'Parameter,Measured Value,Unit,Min Limit,Max Limit,Status\n';
  rows.forEach(r => {
    const minL = r.inp.min !== null ? r.inp.min : 'N/A';
    const maxL = r.inp.max !== null ? r.inp.max : 'N/A';
    csv += `"${r.inp.label}",${r.val},${r.inp.unit || ''},${minL},${maxL},${r.status}\n`;
  });
  csv += `\nEngineer Remarks,"${(WF.remarks || '').replace(/"/g, '""')}"\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `TestReport_${WF.equipment.name.replace(/\s+/g,'_')}_${WF.test.name.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════════
//  STAGE 6 — TROUBLESHOOTING
// ══════════════════════════════════════════════════════════════
function wfRenderTroubleshoot() {
  const c  = document.getElementById('wfContent');
  const t  = WF.test;
  const tb = t ? t.troubleshooting : null;

  c.innerHTML = `
    <div class="wf-stage">
      <div class="wf-stage-hdr">
        <div class="wf-stage-num primary">07</div>
        <div>
          <h2 class="wf-stage-title">Troubleshooting Assistant</h2>
          <p class="wf-stage-desc">${WF.equipment.icon} ${WF.equipment.name} › ${WF.model.name} › ${t.name}</p>
        </div>
      </div>

      ${(!tb || !tb.length) ? `
        <div class="wf-fallback">
          <div class="wf-fallback-icon">🔍</div>
          <div class="wf-fallback-title">Troubleshooting data not available for this case</div>
          <div class="wf-fallback-sub">We are continuously expanding the knowledge base. Submit your problem below and our engineers will respond.</div>
          <button class="btn btn-primary" onclick="wfScrollToForm()">📬 Submit Problem Form ↓</button>
        </div>
      ` : `
        ${wfCard('📚', 'KNOWN ISSUES &amp; SOLUTIONS', `
          ${tb.map((tr,i) => `
            <div class="facc">
              <div class="facc-head warn-head" onclick="tog(this)">
                <div>
                  <div class="facc-title">⚠️ ${tr.condition}</div>
                  <div class="facc-val">${tr.causes.length} possible cause(s)</div>
                </div>
                <div class="facc-arr">▼</div>
              </div>
              <div class="facc-body">
                <div class="facc-2col">
                  <div>
                    <div class="facc-sec-label">Possible Causes</div>
                    <ul class="facc-list">${tr.causes.map(x=>`<li>${x}</li>`).join('')}</ul>
                  </div>
                  <div>
                    <div class="facc-sec-label">Recommended Actions</div>
                    <ul class="facc-list">${tr.actions.map(x=>`<li>${x}</li>`).join('')}</ul>
                  </div>
                </div>
              </div>
            </div>`).join('')}
        `)}
      `}

      <!-- Chat Troubleshooting -->
      ${wfCard('💬', 'AI TROUBLESHOOT CHAT', `
        <div class="chat-wrap" id="wfChat"></div>
        <div class="quick-chips">
          ${(tb||[]).slice(0,4).map(tr=>`
            <div class="chip" onclick="wfChatQuery('${tr.condition.replace(/'/g,"\\'")}')">
              ${tr.condition.length > 40 ? tr.condition.slice(0,40)+'…' : tr.condition}
            </div>`).join('')}
          <div class="chip" onclick="wfScrollToForm()">📬 Submit Problem</div>
        </div>
        <div class="chat-input-row">
          <input id="wfChatInp" class="fi" type="text" placeholder="Describe your problem or symptom…"
            onkeydown="if(event.key==='Enter') wfChatSend()">
          <button class="btn btn-primary" onclick="wfChatSend()">Send</button>
        </div>
      `)}

      <!-- Submit Problem Form — always visible at bottom of troubleshoot stage -->
      <div class="card wf-sec" id="wfProbCard">
        <div class="card-head"><span class="card-icon">📬</span><span class="card-title">SUBMIT PROBLEM REPORT</span></div>
        <div class="card-body">
          <p class="wf-para" style="margin-bottom:16px">
            Can't find a solution above? Submit your problem and our team will respond within 24–48 hours.
          </p>
          ${wfProbFormHTML()}
        </div>
      </div>

      <div class="wf-new-test-row">
        <button class="btn btn-outline" onclick="wfConfirmNewTest()">🔄 Start a New Test</button>
      </div>
    </div>
  `;

  // Init chat
  wfChatInit();
}

// ─── Chat Functions ───────────────────────────────────────────
function wfChatInit() {
  setTimeout(() => {
    const t = WF.test;
    wfChatAddMsg(`Hello! I'm your troubleshooting assistant for <strong>${WF.equipment.name} – ${t.name}</strong>.<br>Describe your fault symptom and I'll help identify causes and recommended actions.`, 'ai');
  }, 100);
}
function wfChatSend() {
  const inp = document.getElementById('wfChatInp');
  const q   = inp ? inp.value.trim() : '';
  if (!q) return;
  wfChatAddMsg(q, 'user');
  inp.value = '';
  setTimeout(() => wfChatAddMsg(wfChatMatch(q), 'ai'), 500);
}
function wfChatQuery(text) {
  const inp = document.getElementById('wfChatInp');
  if (inp) { inp.value = text; } wfChatSend();
}
function wfChatAddMsg(html, role) {
  const wrap = document.getElementById('wfChat');
  if (!wrap) return;
  const d = document.createElement('div');
  d.className = `chat-msg${role === 'user' ? ' user' : ''}`;
  d.innerHTML = `<div class="chat-av ${role === 'ai' ? 'ai' : 'usr'}">${role === 'ai' ? 'AI' : 'ME'}</div>
                 <div class="chat-bbl ${role === 'ai' ? 'ai' : 'usr'}">${html}</div>`;
  wrap.appendChild(d);
  wrap.scrollTop = wrap.scrollHeight;
}
function wfChatMatch(q) {
  const tb = WF.test ? WF.test.troubleshooting : [];
  if (!tb || !tb.length) {
    wfScrollToForm();
    return `I don't have troubleshooting data for <strong>${WF.test ? WF.test.name : 'this test'}</strong>.<br>Please use the <strong>Submit Problem Form</strong> below.`;
  }
  const words = q.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matched = tb.filter(tr => {
    const hay = (tr.condition + ' ' + tr.causes.join(' ')).toLowerCase();
    return words.some(w => hay.includes(w));
  });
  if (!matched.length) {
    wfScrollToForm();
    return `I couldn't match "<em>${q}</em>" to a known issue for this test.<br>Try describing the symptom differently, or choose a quick chip above.<br>You can also <strong>Submit a Problem Report</strong> below.`;
  }
  return matched.map(tr => `
    <strong>⚠️ ${tr.condition}</strong><br><br>
    <b>Possible Causes:</b><ul>${tr.causes.map(c=>`<li>${c}</li>`).join('')}</ul>
    <b>Recommended Actions:</b><ul>${tr.actions.map(a=>`<li>${a}</li>`).join('')}</ul>
  `).join('<hr style="margin:10px 0;border-color:rgba(0,0,0,0.1)">');
}
function wfScrollToForm() {
  const card = document.getElementById('wfProbCard');
  if (card) {
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

// ─── Problem Submission Form ──────────────────────────────────
function wfProbFormHTML() {
  return `
    <div id="wfProbErr" class="fb-error-global"></div>
    <form id="wfProbForm" onsubmit="wfProbSubmit(event)" novalidate>
      <div class="fb-grid-2">
        <div class="fg">
          <label class="fl">Name <span class="fb-opt">(Optional)</span></label>
          <input id="wpf_name" type="text" class="fi" placeholder="Your name" maxlength="80">
        </div>
        <div class="fg">
          <label class="fl">Email <span class="fb-opt">(Optional*)</span></label>
          <input id="wpf_email" type="email" class="fi" placeholder="you@example.com" oninput="wfProbChange()">
          <div id="wpf_emailErr" class="fb-field-error"></div>
        </div>
        <div class="fg">
          <label class="fl">Contact Number <span class="fb-opt">(Optional*)</span></label>
          <input id="wpf_phone" type="tel" class="fi" placeholder="10-digit mobile" maxlength="10" oninput="wfProbChange()">
          <div id="wpf_phoneErr" class="fb-field-error"></div>
        </div>
      </div>
      <div class="fg">
        <label class="fl">Problem Description</label>
        <textarea id="wpf_desc" class="ft" rows="4" placeholder="Describe the problem and symptoms in detail…" maxlength="2000"></textarea>
      </div>
      <div id="wfProbOk" class="fb-success" style="display:none">✅ Problem submitted successfully! We'll get back to you.</div>
      <div class="fb-actions">
        <button id="wfProbBtn" type="submit" class="btn fb-submit-btn" disabled>📬 Submit Problem</button>
      </div>
    </form>`;
}
function wfProbChange() {
  const email   = (document.getElementById('wpf_email')  || {}).value || '';
  const contact = (document.getElementById('wpf_phone')  || {}).value || '';
  const btn     = document.getElementById('wfProbBtn');
  if (btn) btn.disabled = !(email.trim() || contact.trim());
}
async function wfProbSubmit(e) {
  e.preventDefault();
  const email   = document.getElementById('wpf_email').value.trim();
  const contact = document.getElementById('wpf_phone').value.trim();
  const errEl   = document.getElementById('wfProbErr');
  const eEr = document.getElementById('wpf_emailErr');
  const pEr = document.getElementById('wpf_phoneErr');
  [errEl, eEr, pEr].forEach(el => { if (el) el.textContent = ''; });

  if (!email && !contact) { errEl.textContent = 'Please provide either Email or Contact Number'; return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { eEr.textContent = 'Invalid email format'; return; }
  if (contact && !/^\d{10}$/.test(contact)) { pEr.textContent = 'Must be exactly 10 digits'; return; }

  const payload = {
    name: document.getElementById('wpf_name').value.trim() || '—',
    email: email || '—', contact: contact || '—',
    equipment: WF.equipment ? `${WF.equipment.name} / ${WF.model ? WF.model.name : '—'}` : '—',
    test: WF.test ? WF.test.name : '—',
    message: document.getElementById('wpf_desc').value.trim() || '—',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  const btn = document.getElementById('wfProbBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="fb-spinner"></span> Submitting…';

  try {
    if (typeof emailjs !== 'undefined' && typeof EMAILJS_SERVICE_ID !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: payload.name, from_email: payload.email,
        contact_number: payload.contact, equipment_type: payload.equipment,
        test_type: payload.test, message: `[PROBLEM REPORT] ${payload.message}`,
        timestamp: payload.timestamp
      }, EMAILJS_PUBLIC_KEY);
    }
    if (typeof GOOGLE_SHEETS_URL !== 'undefined' && GOOGLE_SHEETS_URL) {
      await fetch(GOOGLE_SHEETS_URL, { method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type: 'problem_report' }) });
    }
    document.getElementById('wfProbOk').style.display = 'block';
    btn.innerHTML = '✔ Submitted'; btn.style.background = '#16a34a';
  } catch (err) {
    errEl.textContent = 'Submission failed — please try again or email directly.';
    btn.disabled = false; btn.innerHTML = '📬 Submit Problem';
  }
}

// ══════════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════════
function wfCard(icon, title, bodyHTML) {
  return `
    <div class="card wf-sec">
      <div class="card-head"><span class="card-icon">${icon}</span><span class="card-title">${title}</span></div>
      <div class="card-body">${bodyHTML}</div>
    </div>`;
}
function wfComingSoon(msg) {
  return `<div class="wf-stage"><div class="wf-coming-soon-box"><span>⚠️</span> ${msg}</div></div>`;
}
// ─── Confirm New Test Dialog ──────────────────────────────────
function wfConfirmNewTest() {
  // Remove any existing dialog
  const existing = document.getElementById('wfNewTestDialog');
  if (existing) existing.remove();

  const dl = document.createElement('div');
  dl.id = 'wfNewTestDialog';
  dl.className = 'wf-confirm-overlay';
  dl.innerHTML = `
    <div class="wf-confirm-box">
      <div class="wf-confirm-icon">🔄</div>
      <div class="wf-confirm-title">Start a New Test?</div>
      <div class="wf-confirm-body">This will clear your current session including all entered results and the generated report. This cannot be undone.</div>
      <div class="wf-confirm-actions">
        <button class="btn btn-outline" onclick="document.getElementById('wfNewTestDialog').remove()">Cancel</button>
        <button class="btn btn-danger" onclick="wfStartNew()">Yes, Start New Test</button>
      </div>
    </div>`;
  document.body.appendChild(dl);
}

function wfStartNew() {
  const dl = document.getElementById('wfNewTestDialog');
  if (dl) dl.remove();
  WF = { stage: 0, equipment: null, model: null, test: null, safety: {}, safetyDone: false, results: {}, remarks: '', report: null };
  sessionStorage.removeItem('wf_session');
  wfUpdateNavBadge();
  wfUpdate();
}

// ─── Session Storage ──────────────────────────────────────────
function wfSaveSession() {
  try {
    sessionStorage.setItem('wf_session', JSON.stringify({
      stage      : WF.stage,
      equipmentId: WF.equipment ? WF.equipment.id : null,
      modelId    : WF.model     ? WF.model.id     : null,
      testId     : WF.test      ? WF.test.id      : null,
      safety     : WF.safety,
      results    : WF.results,
      remarks    : WF.remarks || ''
    }));
  } catch (e) { /* storage not available */ }
}
function wfRestoreSession() {
  try {
    const raw = sessionStorage.getItem('wf_session');
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.equipmentId) WF.equipment = WORKFLOW_DATA.equipment.find(e => e.id === s.equipmentId) || null;
    if (WF.equipment && s.modelId) WF.model = WF.equipment.models.find(m => m.id === s.modelId) || null;
    if (WF.model && s.testId) WF.test = WF.model.tests.find(t => t.id === s.testId) || null;
    WF.stage   = s.stage   || 0;
    WF.safety  = s.safety  || {};
    WF.results = s.results || {};
    WF.remarks = s.remarks || '';
  } catch (e) { WF.stage = 0; }
}

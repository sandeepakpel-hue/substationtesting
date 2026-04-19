// ============================================================
//  js/workflow-standalone.js
//  Converts each workflow stage into an independent nav page.
//  Shares WF state from workflow.js.
//  Renders: pg-select, pg-safety, pg-guide, pg-conn,
//           pg-input, pg-result, pg-chat
// ============================================================

// ─── Page Config ─────────────────────────────────────────────
const SA_PAGES = [
  { id: 'pg-select', label: 'Selection',     icon: '①', navId: 'navPage1', short: 'Selection' },
  { id: 'pg-safety', label: 'Safety Check',  icon: '②', navId: 'navPage2', short: 'Safety' },
  { id: 'pg-guide',  label: 'Test Guide',    icon: '③', navId: 'navPage3', short: 'Guide' },
  { id: 'pg-conn',   label: 'Connections',   icon: '④', navId: 'navPage4', short: 'Connections' },
  { id: 'pg-input',  label: 'Enter Results', icon: '⑤', navId: 'navPage5', short: 'Results' },
  { id: 'pg-result', label: 'Fault Report',  icon: '⑥', navId: 'navPage6', short: 'Report' },
  { id: 'pg-chat',   label: 'Troubleshoot',  icon: '⑦', navId: 'navPage7', short: 'Troubleshoot' }
];

// ─── Progress Strip ───────────────────────────────────────────
function saProgressStrip(currentIdx) {
  return `<div class="sa-progress-strip" id="saStrip_${currentIdx}">
    ${SA_PAGES.map((p, i) => {
      const done   = i < currentIdx;
      const active = i === currentIdx;
      const cls    = done ? 'sa-stp done' : active ? 'sa-stp active' : 'sa-stp';
      const clickable = done ? `style="cursor:pointer" onclick="saNav('${p.id}','${p.navId}')"` : '';
      return `<div class="${cls}" ${clickable}>
        <div class="sa-stp-circle">${done ? '✓' : p.icon}</div>
        <div class="sa-stp-label">${p.label}</div>
        ${i < SA_PAGES.length - 1 ? '<div class="sa-stp-connector"></div>' : ''}
      </div>`;
    }).join('')}
  </div>`;
}

// ─── Bottom Nav Bar ───────────────────────────────────────────
function saNavBar(currentIdx) {
  const prev = currentIdx > 0 ? SA_PAGES[currentIdx - 1] : null;
  const next = currentIdx < SA_PAGES.length - 1 ? SA_PAGES[currentIdx + 1] : null;
  return `<div class="sa-nav-bar">
    ${prev
      ? `<button class="btn btn-outline" onclick="saNav('${prev.id}','${prev.navId}')">← ${prev.short}</button>`
      : '<span></span>'}
    <div class="sa-nav-info">
      <span class="sa-nav-step">Step ${currentIdx + 1} of ${SA_PAGES.length}</span>
      <span class="sa-nav-stage">${SA_PAGES[currentIdx].label}</span>
    </div>
    ${next
      ? `<button class="btn btn-primary sa-next-btn" id="saNextBtn_${currentIdx}" onclick="saGoNext(${currentIdx})">
           ${next.short} →
         </button>`
      : `<button class="btn btn-success" onclick="wfConfirmNewTest()">🔄 New Test</button>`}
  </div>`;
}

// ─── Navigation Helpers ───────────────────────────────────────
function saNav(pageId, navId) {
  showPage(pageId, document.getElementById(navId));
}

function saGoNext(currentIdx) {
  let valid = true;
  if (currentIdx === 0) valid = wfValidateSelection();
  if (currentIdx === 1) valid = wfValidateSafety();
  if (currentIdx === 4) valid = wfValidateResults();
  if (!valid) return;
  const next = SA_PAGES[currentIdx + 1];
  if (next) saNav(next.id, next.navId);
}

// ─── Prerequisite Warning ─────────────────────────────────────
function saPrereqBox(msg, btnLabel, targetPage, targetNav) {
  return `<div class="sa-prereq">
    <div class="sa-prereq-icon">⚠️</div>
    <div class="sa-prereq-msg">${msg}</div>
    <button class="btn btn-primary" onclick="saNav('${targetPage}','${targetNav}')">${btnLabel}</button>
  </div>`;
}

// ─── Wrap a page with progress strip + content + nav ─────────
function saWrap(el, currentIdx, contentHTML) {
  el.innerHTML = saProgressStrip(currentIdx)
    + `<div class="sa-content">${contentHTML}</div>`
    + saNavBar(currentIdx);
}

// ══════════════════════════════════════════════════════════════
//  PAGE 1 — SELECTION
// ══════════════════════════════════════════════════════════════
function renderSaSelection() {
  const el = document.getElementById('pg-select');
  if (!el) return;

  const equipOpts = WORKFLOW_DATA.equipment
    .map(e => `<option value="${e.id}" ${WF.equipment && WF.equipment.id === e.id ? 'selected' : ''}>${e.name}</option>`)
    .join('');

  const modelBlock = !WF.equipment
    ? `<div class="wf-sel-locked">Select equipment type first</div>`
    : WF.equipment.models.length === 0
      ? `<div class="wf-coming-soon"><span>⚠️</span> Models coming soon for <strong>${WF.equipment.name}</strong></div>`
      : `<select class="wf-select" id="wfModelSel" onchange="wfOnModel(this.value)">
           <option value="">— Select Model —</option>
           ${WF.equipment.models.map(m => `<option value="${m.id}" ${WF.model && WF.model.id === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
         </select>`;

  const testBlock = !WF.model
    ? `<div class="wf-sel-locked">Select model first</div>`
    : !WF.model.tests || WF.model.tests.length === 0
      ? `<div class="wf-coming-soon"><span>⚠️</span> Test details coming soon for <strong>${WF.model.name}</strong></div>`
      : `<select class="wf-select" id="wfTestSel" onchange="wfOnTest(this.value)">
           <option value="">— Select Test —</option>
           ${WF.model.tests.map(t => `<option value="${t.id}" ${WF.test && WF.test.id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
         </select>`;

  const summary = WF.test ? `
    <div class="wf-sel-summary">
      <div class="wf-sel-summary-title">Selection Complete — Ready to Proceed</div>
      <div class="wf-sel-summary-grid">
        <div class="wf-sum-item"><div class="wf-sum-key">Equipment</div><div class="wf-sum-val">${WF.equipment.name}</div></div>
        <div class="wf-sum-item"><div class="wf-sum-key">Model</div><div class="wf-sum-val">${WF.model.name}</div></div>
        <div class="wf-sum-item"><div class="wf-sum-key">Test</div><div class="wf-sum-val">${WF.test.name}</div></div>
      </div>
    </div>` : '';

  const content = `
    <div class="sa-stage-hdr">
      <div class="sa-stage-num primary">01</div>
      <div>
        <h2 class="sa-stage-title">Equipment &amp; Test Selection</h2>
        <p class="sa-stage-desc">Select the equipment type, model, and test type to begin the guided testing workflow.</p>
      </div>
    </div>

    <div class="wf-sel-stack">
      <div class="wf-sel-card ${WF.equipment ? 'done' : ''}">
        <div class="wf-sel-step-badge">① EQUIPMENT TYPE</div>
        <select class="wf-select" id="wfEquipSel" onchange="wfOnEquip(this.value)">
          <option value="">— Select Equipment Type —</option>
          ${equipOpts}
        </select>
      </div>

      <div class="wf-sel-card ${WF.model ? 'done' : WF.equipment ? '' : 'locked'}" id="wfModelCard">
        <div class="wf-sel-step-badge">② EQUIPMENT MODEL</div>
        ${modelBlock}
      </div>

      <div class="wf-sel-card ${WF.test ? 'done' : WF.model ? '' : 'locked'}" id="wfTestCard">
        <div class="wf-sel-step-badge">③ TEST TYPE</div>
        ${testBlock}
      </div>
    </div>

    ${summary}

    <div id="wfSelErr" class="wf-err-msg" style="display:none">
      ⚠️ Please complete all three selections (Equipment → Model → Test) before proceeding.
    </div>`;

  saWrap(el, 0, content);
}

// ══════════════════════════════════════════════════════════════
//  PAGE 2 — SAFETY CHECK
// ══════════════════════════════════════════════════════════════
function renderSaSafety() {
  const el = document.getElementById('pg-safety');
  if (!el) return;

  if (!WF.equipment || !WF.model || !WF.test) {
    saWrap(el, 1, saPrereqBox(
      'Please complete <strong>Step 1: Selection</strong> first — choose your equipment, model, and test type.',
      '← Go to Selection', 'pg-select', 'navPage1'
    ));
    return;
  }

  const count = WF_SAFETY_CHECKS.filter(ch => WF.safety[ch.id]).length;

  const content = `
    <div class="sa-stage-hdr danger-hdr">
      <div class="sa-stage-num danger">02</div>
      <div>
        <h2 class="sa-stage-title">Safety Check — COMPULSORY</h2>
        <p class="sa-stage-desc">All 5 safety checks MUST be confirmed before testing. This step <strong>cannot be skipped</strong>.</p>
      </div>
    </div>

    <div class="wf-safety-banner">
      ⚠️ WARNING: Failure to confirm safety measures may result in serious injury or death.
      Confirm every item below has been physically verified on-site.
    </div>

    <div class="wf-safety-list">
      ${WF_SAFETY_CHECKS.map(ch => `
        <label class="wf-safety-item ${WF.safety[ch.id] ? 'checked' : ''}" id="sitem_${ch.id}">
          <input type="checkbox" id="sch_${ch.id}" ${WF.safety[ch.id] ? 'checked' : ''}
            onchange="wfOnSafe('${ch.id}', this.checked)">
          <div class="wf-safe-icon">${ch.icon}</div>
          <div class="wf-safe-body">
            <div class="wf-safe-label">${ch.label}</div>
            <div class="wf-safe-desc">${ch.desc}</div>
          </div>
          <div class="wf-safe-tick" id="stk_${ch.id}">${WF.safety[ch.id] ? '✓' : ''}</div>
        </label>`).join('')}
    </div>

    <div class="wf-safety-progress">
      <div class="wf-safe-prog-label" id="wfSafeLabel">${count}/5 safety checks completed</div>
      <div class="wf-safe-prog-track">
        <div class="wf-safe-prog-fill" id="wfSafeFill" style="width:${count / 5 * 100}%"></div>
      </div>
    </div>

    <div id="wfSafeErr" class="wf-err-msg" style="display:none">
      ⚠️ Complete all 5 safety checks before proceeding to the testing procedure.
    </div>`;

  saWrap(el, 1, content);
}

// ══════════════════════════════════════════════════════════════
//  PAGE 3 — TESTING GUIDE
// ══════════════════════════════════════════════════════════════
function renderSaGuide() {
  const el = document.getElementById('pg-guide');
  if (!el) return;

  if (!WF.test) {
    saWrap(el, 2, saPrereqBox(
      'Please complete <strong>Step 1: Selection</strong> first to load the testing guide.',
      '← Go to Selection', 'pg-select', 'navPage1'
    ));
    return;
  }

  const t = WF.test;

  const content = `
    <div class="sa-stage-hdr">
      <div class="sa-stage-num primary">03</div>
      <div>
        <h2 class="sa-stage-title">${t.name} — Testing Guide</h2>
        <p class="sa-stage-desc">${WF.equipment.name} › ${WF.model.name}</p>
      </div>
    </div>

    ${wfCard('OBJECTIVE', 'OBJECTIVE', `<p class="wf-para">${t.objective}</p>`)}
    ${wfCard('TOOLS', 'REQUIRED TOOLS &amp; EQUIPMENT', `<ul class="wf-list">${t.tools.map(x => `<li>${x}</li>`).join('')}</ul>`)}
    ${wfCard('CHECKS', 'PRE-TEST CHECKS', `<ul class="wf-list check-list">${t.preChecks.map(x => `<li>${x}</li>`).join('')}</ul>`)}
    ${wfCard('PROCEDURE', 'STEP-BY-STEP PROCEDURE', `<ul class="steps">${t.steps.map(s => `
      <li class="step">
        <div class="step-num">${s.num}</div>
        <div class="step-content">
          <div class="step-title">${s.title}</div>
          <div class="step-body">${s.body}</div>
        </div>
      </li>`).join('')}</ul>`)}
    ${wfCard('LIMITS', 'STANDARD LIMITS', `
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Parameter</th><th>Min</th><th>Max</th><th>Unit</th><th>On Fail</th></tr></thead>
        <tbody>${t.limits.map(l => `<tr>
          <td>${l.param}</td>
          <td class="mono">${l.min !== null ? l.min : '—'}</td>
          <td class="mono">${l.max !== null ? l.max : '—'}</td>
          <td class="mono">${l.unit}</td>
          <td><span class="badge ${l.critical === 'FAIL' ? 'b-fail' : l.critical === 'WARN' ? 'b-warn' : 'b-info'}">${l.critical}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>`)}`;

  saWrap(el, 2, content);
}

// ══════════════════════════════════════════════════════════════
//  PAGE 4 — CONNECTIONS
// ══════════════════════════════════════════════════════════════
function renderSaConnection() {
  const el = document.getElementById('pg-conn');
  if (!el) return;

  if (!WF.test) {
    saWrap(el, 3, saPrereqBox(
      'Please complete <strong>Step 1: Selection</strong> first to view connection details.',
      '← Go to Selection', 'pg-select', 'navPage1'
    ));
    return;
  }

  const conn = WF.test.connections;
  if (!conn) {
    saWrap(el, 3, `<div class="wf-coming-soon-box"><span>⚠️</span> Connection details not yet available for this test type.</div>`);
    return;
  }

  const content = `
    <div class="sa-stage-hdr">
      <div class="sa-stage-num primary">04</div>
      <div>
        <h2 class="sa-stage-title">Connection Details</h2>
        <p class="sa-stage-desc">Follow these connection instructions precisely before performing the test.</p>
      </div>
    </div>

    ${wfCard('🔌', 'CONNECTION OVERVIEW', `<p class="wf-para">${conn.description}</p>`)}

    <div class="card wf-sec">
      <div class="card-head"><span class="card-icon">&#128208;</span><span class="card-title">CONNECTION DIAGRAM / SCHEMATIC</span></div>
      <div class="card-body">
        <div class="wf-diagram">
          <div class="wf-diagram-icon">&#128202;</div>
          <div class="wf-diagram-title">Connection Diagram</div>
          <div class="wf-diagram-sub">Refer to the equipment wiring diagram and OEM SLD/schematic for the detailed connection drawing.<br>Follow terminal designations shown in the table below.</div>
        </div>
        <div class="wf-drawing-inline">
          <span class="wf-drawing-inline-label">Connection Diagram / Schematic</span>
          ${(WF.model && WF.model.drawing)
            ? `<a class="wf-drawing-btn" href="${WF.model.drawing}" target="_blank" rel="noopener">&#128190; Download Drawing</a>`
            : `<span class="wf-drawing-btn-disabled" tabindex="0" aria-disabled="true">&#128190; Download Drawing<span class="wf-drawing-tooltip">Drawing will be available soon</span></span>`
          }
        </div>
      </div>
    </div>

    ${wfCard('⚡', 'TERMINAL CONNECTION POINTS', `
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Terminal / TB</th><th>Lead / Relay</th><th>Function</th><th>Note</th></tr></thead>
        <tbody>${conn.terminals.map(t => `<tr>
          <td class="mono">${t.tb}</td>
          <td class="mono">${t.relay}</td>
          <td>${t.function}</td>
          <td class="mono" style="color:var(--amber)">${t.note || '—'}</td>
        </tr>`).join('')}</tbody>
      </table></div>`)}

    ${conn.precautions ? wfCard('⚠️', 'CONNECTION PRECAUTIONS', `<ul class="wf-list warn-list">${conn.precautions.map(p => `<li>${p}</li>`).join('')}</ul>`) : ''}`;

  saWrap(el, 3, content);
}

// ══════════════════════════════════════════════════════════════
//  PAGE 5 — ENTER RESULTS
// ══════════════════════════════════════════════════════════════
function renderSaResults() {
  const el = document.getElementById('pg-input');
  if (!el) return;

  if (!WF.test) {
    saWrap(el, 4, saPrereqBox(
      'Please complete <strong>Step 1: Selection</strong> and <strong>Step 2: Safety Check</strong> first.',
      '← Go to Selection', 'pg-select', 'navPage1'
    ));
    return;
  }

  const t = WF.test;
  if (!t.inputs || !t.inputs.length) {
    saWrap(el, 4, `<div class="wf-coming-soon-box"><span>⚠️</span> Result input form coming soon for this test type.</div>`);
    return;
  }

  const content = `
    <div class="sa-stage-hdr">
      <div class="sa-stage-num primary">05</div>
      <div>
        <h2 class="sa-stage-title">Enter Test Results</h2>
        <p class="sa-stage-desc">Enter measured values. Auto-validation compares with standard limits in real-time.</p>
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
    </div>`;

  saWrap(el, 4, content);

  // Re-validate previously entered values
  Object.entries(WF.results).forEach(([id, val]) => { if (val !== '') wfOnResult(id, String(val)); });
}

// ══════════════════════════════════════════════════════════════
//  PAGE 6 — FAULT REPORT
// ══════════════════════════════════════════════════════════════
function renderSaReport() {
  const el = document.getElementById('pg-result');
  if (!el) return;

  if (!WF.test) {
    saWrap(el, 5, saPrereqBox(
      'Please complete the previous steps first to generate a fault report.',
      '← Go to Selection', 'pg-select', 'navPage1'
    ));
    return;
  }

  const t  = WF.test;
  const ts = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

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

  const noResults = rows.every(r => r.status === 'ns');

  const content = `
    <div class="sa-stage-hdr">
      <div class="sa-stage-num primary">06</div>
      <div>
        <h2 class="sa-stage-title">Fault Report — Auto-Generated</h2>
        <p class="sa-stage-desc">Report generated: ${ts}</p>
      </div>
    </div>

    ${noResults ? `<div class="alert a-warn"><div class="alert-title">⚠️ No Results Entered</div>
      <div class="alert-body">Please go to <strong>Step 5: Enter Results</strong> and input test values before viewing the report.</div></div>` : ''}

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
      ${WF.model.specs ? `<div class="div"></div>
      <div class="g2">
        ${Object.entries(WF.model.specs).map(([k, v]) => `<div><span class="fl">${k}</span><div class="mono">${v}</div></div>`).join('')}
      </div>` : ''}`)}

    ${wfCard('📊', 'TEST RESULTS', `
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Parameter</th><th>Measured</th><th>Unit</th><th>Limit</th><th>Status</th></tr></thead>
        <tbody>${rows.map(r => `<tr>
          <td>${r.inp.label}</td>
          <td class="mono ${r.cls}">${r.val}</td>
          <td class="mono">${r.inp.unit || '—'}</td>
          <td class="mono">${r.inp.min !== null && r.inp.max !== null ? r.inp.min + '–' + r.inp.max : r.inp.max !== null ? '≤ ' + r.inp.max : r.inp.min !== null ? '≥ ' + r.inp.min : '—'}</td>
          <td><span class="badge ${r.status === 'PASS' ? 'b-pass' : r.status === 'FAIL' ? 'b-fail' : r.status === 'WARN' ? 'b-warn' : 'b-info'}">${r.status}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>`)}

    ${wfCard('📝', 'REMARKS &amp; RECOMMENDATION', `
      <div class="alert ${ofBase}">
        <div class="alert-title">
          ${overall === 'HEALTHY' ? '✅ Equipment is Healthy' : overall === 'FAULTY' ? '❌ Equipment Requires Urgent Attention' : '⚠️ Further Investigation Required'}
        </div>
        <div class="alert-body">
          ${overall === 'HEALTHY'
            ? 'All measured parameters are within acceptable limits. Equipment is fit for service.'
            : hasFail
              ? `The following parameters exceeded limits: <strong>${rows.filter(r => r.status === 'FAIL').map(r => r.inp.label).join(', ')}</strong>. Equipment should NOT be energized without rectification.`
              : `The following parameters are in the warning zone: <strong>${rows.filter(r => r.status === 'WARN').map(r => r.inp.label).join(', ')}</strong>. Monitor closely and schedule maintenance.`}
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
    </div>`;

  saWrap(el, 5, content);
}

// ══════════════════════════════════════════════════════════════
//  PAGE 7 — TROUBLESHOOT
// ══════════════════════════════════════════════════════════════
function renderSaTroubleshoot() {
  const el = document.getElementById('pg-chat');
  if (!el) return;

  if (!WF.test) {
    saWrap(el, 6, saPrereqBox(
      'Please complete <strong>Step 1: Selection</strong> first to access troubleshooting.',
      '← Go to Selection', 'pg-select', 'navPage1'
    ));
    return;
  }

  const t  = WF.test;
  const tb = t.troubleshooting;

  // Troubleshoot page — chatbot only, no Known Issues accordion
  const noData = !tb || !tb.length;

  const content = `
    <div class="sa-stage-hdr">
      <div class="sa-stage-num primary">07</div>
      <div>
        <h2 class="sa-stage-title">Troubleshooting Assistant</h2>
        <p class="sa-stage-desc">${WF.equipment.name} › ${WF.model.name} › ${t.name}</p>
      </div>
    </div>

    ${noData ? `
      <div class="wf-fallback">
        <div class="wf-fallback-icon">&#128269;</div>
        <div class="wf-fallback-title">Troubleshooting data not available</div>
        <div class="wf-fallback-sub">Submit your problem below and our engineers will respond.</div>
        <button class="btn btn-primary" onclick="document.getElementById('wfProbCard').scrollIntoView({behavior:'smooth'})">
          &#128236; Submit Problem Form
        </button>
      </div>
    ` : ''}

    <div class="card wf-sec">
      <div class="card-head"><span class="card-title">AI TROUBLESHOOT CHAT</span></div>
      <div class="card-body">
        <div class="chat-wrap" id="wfChat"></div>
        <div class="quick-chips">
          ${(tb || []).slice(0, 4).map(tr => `
            <div class="chip" onclick="wfChatQuery('${tr.condition.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">
              ${tr.condition.length > 40 ? tr.condition.slice(0, 40) + '&hellip;' : tr.condition}
            </div>`).join('')}
          <div class="chip" onclick="document.getElementById('wfProbCard').scrollIntoView({behavior:'smooth'})">Submit Problem</div>
        </div>
        <div class="chat-input-row">
          <input id="wfChatInp" class="fi" type="text" placeholder="Describe your issue…"
            onkeydown="if(event.key==='Enter') wfChatSend()">
          <button class="btn btn-primary" onclick="wfChatSend()">Send</button>
        </div>
      </div>
    </div>

    <div class="card wf-sec" id="wfProbCard" style="border-top:3px solid var(--blue)">
      <div class="card-head">
        <span class="card-title">SUBMIT PROBLEM REPORT</span>
      </div>
      <div class="card-body">
        <p class="wf-para" style="margin-bottom:16px">
          Can't find a solution? Submit your problem and our team will respond within 24–48 hours.
        </p>
        ${wfProbFormHTML()}
      </div>
    </div>

    <div class="wf-new-test-row">
      <button class="btn btn-outline" onclick="wfConfirmNewTest()">Start a New Test</button>
    </div>`;

  saWrap(el, 6, content);

  // Init chat with context greeting
  setTimeout(() => {
    const noDataMsg = noData
      ? '<br><em>Note: No pre-built troubleshooting data for this test. Please describe your issue.</em>'
      : '';
    wfChatAddMsg(`Hello! I am your troubleshooting assistant for <strong>${WF.equipment.name} &ndash; ${t.name}</strong>.<br>Describe your issue and I will help identify causes and recommended actions.${noDataMsg}`, 'ai');
  }, 100);
}

// ══════════════════════════════════════════════════════════════
//  HOOK: Override wfOnEquip/wfOnModel/wfOnTest → Standalone
// ══════════════════════════════════════════════════════════════
// These override the versions in workflow.js to re-render the
// standalone selection page instead of the embedded workflow.
function wfOnEquip(id) {
  WF.equipment = WORKFLOW_DATA.equipment.find(e => e.id === id) || null;
  WF.model = null;
  WF.test = null;
  wfSaveSession();
  renderSaSelection();
}
function wfOnModel(id) {
  WF.model = WF.equipment ? WF.equipment.models.find(m => m.id === id) || null : null;
  WF.test = null;
  wfSaveSession();
  renderSaSelection();
}
function wfOnTest(id) {
  WF.test = WF.model ? WF.model.tests.find(t => t.id === id) || null : null;
  wfSaveSession();
  renderSaSelection();
}

// ══════════════════════════════════════════════════════════════
//  wfExportCSV available in standalone context
// ══════════════════════════════════════════════════════════════
// (wfExportCSV and wfPrintReport are defined in workflow.js)

// ============================================================
//  fault-report.js — Page 5: Evaluation Engine & Report Generator
//  Reads from: LIMITS (data.js)
// ============================================================

function renderFaultReport() {
  const container = document.getElementById('pg-result');
  if (!container) return;
  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 05</div>
      <div class="sec-title">Fault Report & Problem Solutions</div>
      <div class="sec-line"></div>
    </div>
    <div id="noResult" class="alert a-warn"><div class="alert-title">⚠ No Evaluation Done</div><div class="alert-body">Enter results in Module 04 and click Evaluate.</div></div>
    <div id="resultContent" style="display:none;"></div>
  `;
}

function evalResults() {
  const g = id => { const el = document.getElementById(id); return el && el.value ? parseFloat(el.value) : null; };
  const gs = id => { const el = document.getElementById(id); return el ? el.value : ''; };

  const opens = [g('tOR'), g('tOY'), g('tOB')];
  const closes = [g('tCR'), g('tCY'), g('tCB')];
  const crs = [g('crR'), g('crY'), g('crB')];
  const tc1s = [g('tc1R'), g('tc1Y'), g('tc1B')];
  const tc2s = [g('tc2R'), g('tc2Y'), g('tc2B')];
  const cc = g('ccOhm');
  const irs = [g('irR'), g('irY'), null];

  let faults = [], warnings = [], pass = true;

  // Timing open
  opens.forEach((v, i) => {
    if (v === null) return;
    const ph = ['R', 'Y', 'B'][i];
    if (v < LIMITS.open[0] || v > LIMITS.open[1]) {
      pass = false;
      const slow = v > LIMITS.open[1];
      faults.push({
        sev: 'fail', sym: `${slow ? 'SLOW' : 'FAST'} OPEN TIME — Phase ${ph}`,
        val: `Measured: ${v} ms | Limit: ${LIMITS.open[0]}–${LIMITS.open[1]} ms`,
        causes: slow ? ['Dried lubricant in mechanism', 'Low 110V DC at TBI-13 (check now)', 'TC plunger friction', 'SF6 density reduced (63AGX-A-2 affected?)', 'Dashpot sluggish'] : ['TC pre-trip possible (circuit transient)', 'Aux contact 52a maladjusted', 'Check analyser trigger setting'],
        actions: slow ? ['Measure 110V DC at TBI-13(+) to TBI-14(−)', 'Check TC1 coil R at TBI-42/43 (should be 19Ω)', 'Lubricate mechanism per CGL OEM manual', 'Check 63AGX-A-2 NC contact in TC circuit', 'Verify SF6 pressure at density gauge'] : ['Verify timing analyser trigger level', 'Check 52a contact opening point', 'Retest — if repeatable, inspect mechanism'],
        circuit: `TBI-13(+) → TBI-42 → K23${ph} → 63AGX-A-2(NC) → K29${ph} → 52T1(${ph}-ph) → TBI-14(−)`
      });
    }
  });

  // Open pole diff
  const vo = opens.filter(v => v !== null);
  if (vo.length === 3) {
    const pd = Math.max(...vo) - Math.min(...vo);
    if (pd > LIMITS.poleDiff) {
      pass = false;
      faults.push({ sev: 'fail', sym: 'HIGH POLE DIFFERENCE — OPEN', val: `Measured: ${pd.toFixed(1)} ms | Limit: <${LIMITS.poleDiff} ms | R=${vo[0]}ms, Y=${vo[1]}ms, B=${vo[2]}ms`, causes: ['Individual pole mechanism misalignment', 'Unequal linkage wear on one phase', 'Different 52a contact adjustment', 'SF6 per interrupter unequal'], actions: ['Identify lagging phase from analyser', 'Inspect that phase mechanism / linkage', 'Adjust 52a contact cam for lagging phase', 'Check SF6 interrupter individually'], circuit: `52a contacts: TB3-R11, TB3-Y11, TC4-B11 — check lagging phase` });
    }
  }

  // Timing close
  closes.forEach((v, i) => {
    if (v === null) return;
    const ph = ['R', 'Y', 'B'][i];
    if (v < LIMITS.close[0] || v > LIMITS.close[1]) {
      pass = false;
      const slow = v > LIMITS.close[1];
      faults.push({ sev: 'fail', sym: `${slow ? 'SLOW' : 'FAST'} CLOSE TIME — Phase ${ph}`, val: `Measured: ${v} ms | Limit: ${LIMITS.close[0]}–${LIMITS.close[1]} ms`, causes: slow ? ['Spring partially charged (62CX not fully closed)', 'Mechanical friction in close linkage', '63CLX contactor sluggish', 'Low voltage at CC (below 110V)'] : ['Close cam early release', 'Mechanism adjustment issue'], actions: slow ? ['Wait for full spring recharge — listen for motor M1/M2', 'Check 110V at 63CLX coil terminals', 'Measure CC resistance (should be 20Ω)', 'Check 62CX contact is fully CLOSED before close', 'Lubricate closing cam & roller'] : ['Inspect closing cam & roller position', 'Re-test after mechanism inspection'], circuit: `TBI-13(+) → K5 → K3 → 62CX(spring chg) → K15V(NC) → 63CLX → 52C → TBI-14(−)` });
    }
  });

  // Close pole diff
  const vc = closes.filter(v => v !== null);
  if (vc.length === 3) {
    const pd = Math.max(...vc) - Math.min(...vc);
    if (pd > LIMITS.poleDiff) {
      pass = false;
      faults.push({ sev: 'fail', sym: 'HIGH POLE DIFFERENCE — CLOSE', val: `Measured: ${pd.toFixed(1)} ms | Limit: <${LIMITS.poleDiff} ms | R=${vc[0]}ms, Y=${vc[1]}ms, B=${vc[2]}ms`, causes: ['Spring release unequal across poles', 'Linkage wear on one phase mechanism', 'Closing cam adjustment unequal'], actions: ['Identify lagging phase', 'Adjust close linkage for that phase', 'Re-test after adjustment'], circuit: `62CX spring contact + 63CLX per phase` });
    }
  }

  // CR
  crs.forEach((v, i) => {
    if (v === null) return;
    const ph = ['R', 'Y', 'B'][i];
    if (v > LIMITS.crWarn) { pass = false; faults.push({ sev: 'fail', sym: `HIGH CONTACT RESISTANCE — Phase ${ph} (REJECT)`, val: `Measured: ${v} µΩ | Limit: <${LIMITS.cr} µΩ | Reject: >100 µΩ`, causes: ['Severe arc erosion of main contacts', 'Contact finger spring failure', 'Moisture / contamination in interrupter', 'Wrong DLRO connection (verify first)'], actions: ['Verify DLRO 4-wire Kelvin connection before raising fault', 'Check SF6 dew point (<−40°C) and purity (>97%)', 'Drain and inspect interrupter (OEM overhaul required)', 'Replace contact assembly per CGL procedure'], circuit: `DLRO: I+ → Line bushing → contact → Bus bushing ← I−; V+ / V− inner` }); }
    else if (v > LIMITS.cr) { warnings.push(`Contact Resistance Ph-${ph}: ${v} µΩ — above ${LIMITS.cr} µΩ limit. Investigate. Re-test after 5 operations.`); }
  });

  // Coil resistance
  const tcPhase = ['R', 'Y', 'B'];
  [tc1s, tc2s].forEach((tcArr, ti) => {
    tcArr.forEach((v, i) => {
      if (v === null) return;
      const ph = tcPhase[i];
      if (v < LIMITS.tc[0] || v > LIMITS.tc[1]) {
        pass = false;
        const coilId = ti === 0 ? 'TC1' : 'TC2';
        const tbiMap = { TC1: { R: 'TBI-42/43', Y: 'TBI-45/46', B: 'TBI-47/48' }, TC2: { R: 'TBI-61/62', Y: 'TBI-62/63', B: 'TBI-63/77' } };
        faults.push({ sev: 'fail', sym: `${coilId} COIL RESISTANCE ABNORMAL — Phase ${ph}`, val: `Measured: ${v} Ω | Expected: ${LIMITS.tc[0]}–${LIMITS.tc[1]} Ω (nominal 19Ω)`, causes: v < LIMITS.tc[0] ? ['Shorted turns in TC winding', 'Insulation breakdown'] : v > 100 ? ['TC coil wire broken (open circuit)'] : ['Poor terminal connection', 'Corrosion on coil terminals'], actions: v < LIMITS.tc[0] ? ['Replace TC coil immediately'] : v > 50 ? [`Check terminal connections at ${tbiMap[coilId][ph]}`, 'Clean and re-tighten, re-measure', 'Replace TC coil if still high after terminal check'] : [`Re-tighten terminals at ${tbiMap[coilId][ph]}`, 'Apply contact grease to terminals', 'Re-measure — if still out of range, replace coil'], circuit: `${coilId} ${ph}-ph: ${tbiMap[coilId][ph]}` });
      }
    });
  });

  if (cc !== null && (cc < LIMITS.cc[0] || cc > LIMITS.cc[1])) {
    pass = false;
    faults.push({ sev: 'fail', sym: 'CLOSE COIL (52C) RESISTANCE ABNORMAL', val: `Measured: ${cc} Ω | Expected: ${LIMITS.cc[0]}–${LIMITS.cc[1]} Ω (nominal 20Ω)`, causes: cc < LIMITS.cc[0] ? ['Shorted CC winding'] : ['CC terminal loose', 'CC coil partially open'], actions: cc < LIMITS.cc[0] ? ['Replace close coil 52C immediately'] : ['Re-tighten 63CLX and CC terminals', 'Re-measure after tightening', 'Replace CC coil if still out of range'], circuit: `63CLX → 52C close coil → TBI-14(−)` });
  }

  // IR
  irs.forEach((v, i) => {
    if (v === null) return;
    const ph = ['R', 'Y', 'B'][i];
    if (v < LIMITS.ir) { pass = false; faults.push({ sev: v < 100 ? 'fail' : 'warn', sym: `LOW INSULATION RESISTANCE — Phase ${ph}`, val: `Measured: ${v} MΩ | Minimum: ${LIMITS.ir} MΩ`, causes: ['Moisture ingress at flange seal', 'SF6 gas moisture (dew point degraded)', 'Contamination on interrupter surface'], actions: ['Check SF6 dew point (should be <−40°C)', 'Inspect flange seals for moisture', 'Dry with warm dry N₂ if moisture found', 'Do NOT energise until IR >1000 MΩ'], circuit: `5kV Megger: HV lead → Line bushing, Earth → Bus bushing. CB in OPEN position.` }); }
  });

  // Status fields
  if (gs('posInd') === 'mis') { pass = false; faults.push({ sev: 'fail', sym: 'POSITION INDICATION MISMATCH', val: 'Breaker position at SCADA/relay panel does not match actual breaker position', causes: ['Auxiliary contact 52a/52b maladjusted', '52a cam position incorrect', 'Wiring fault at TB3 terminal block', 'RTU/SCADA point mapping error', 'Loose terminal screw causing intermittent contact'], actions: ['Check 52a contacts at TB3-R11, Y11, B11 physically', 'Adjust 52a cam per CGL manual (45° angle, 3-position)', 'Trace wiring from TB3 to relay panel', 'Check all terminal screws in TB3 and relay panel', 'Verify SCADA binary input point assignment'], circuit: `52a (R-ph): TB3-R11/R12 → relay panel | 52b: TB3-R13/R14 → relay panel` }); }

  const sf6 = gs('sf6Stat');
  if (sf6 === 'alm') warnings.push('SF6 Low Pressure (63GA) active. Pressure below 7.5 kg/cm². Locate leak and top-up SF6 before full service restoration.');
  if (sf6 === 'lko') { pass = false; faults.push({ sev: 'fail', sym: 'SF6 LOCKOUT (63AGX) ACTIVE', val: 'SF6 pressure at lockout level (<7.0 kg/cm²). 63AGX-A-2 and 63AGX-B contacts are OPEN — trip circuit BROKEN.', causes: ['Major SF6 gas leak', 'Leak not attended after Stage-1 alarm', 'Density relay false trip (calibration drift)'], actions: ['EMERGENCY: Inform Shift-In-Charge immediately', 'Do NOT operate breaker in any condition', 'Isolate bay — take maintenance outage', 'Locate and fix SF6 leak before re-commissioning', 'Refill SF6 to 8 kg/cm² after repair', 'Verify 63AGX contact resets after gas refill'], circuit: `63AGX-A-2 (NC) is in TC1 path. 63AGX-B (NC) is in TC2 path. Both OPEN = No trip possible.` }); }
  if (sf6 === 'lk') warnings.push('SF6 leak suspected. Use electronic SF6 detector at all flanges, density monitor connections. Log leak rate. Arrange repair before next outage.');

  const spr = gs('sprStat');
  if (spr === 'slow') warnings.push('Spring charging slow (>30s). Check 240V AC supply to motor M1/M2/M3 at TBI-1/2. Check motor contactor and fuse. Motor may need servicing.');
  if (spr === 'fail') { pass = false; faults.push({ sev: 'fail', sym: 'SPRING NOT CHARGING (MOTOR FAULT)', val: '62CX contact not closing — spring not charged after operation.', causes: ['240V AC motor supply lost (MCB tripped)', 'Spring charging motor M1/M2/M3 faulty', 'Motor contactor burnt/stuck', 'Spring mechanism jam'], actions: ['Check 240V AC at TBI-1/TBI-2 (motor supply)', 'Check MCB / fuse for motor circuit at MB', 'Check motor contactor (listen for energisation sound)', 'Inspect motor coupling for mechanical jam', 'If motor fault confirmed: arrange emergency OEM service'], circuit: `TBI-1(P) / TBI-2(N) → H1 → Motor M1(R)/M2(Y)/M3(B) → Spring mechanism` }); }

  if (gs('apStat') === 'fail') { pass = false; faults.push({ sev: 'fail', sym: 'ANTI-PUMPING (K15V) FAILURE — BREAKER PUMPING', val: 'Breaker re-closed after trip while close command was sustained.', causes: ['K15V relay coil failed (not picking up)', 'K15V latching contact faulty', 'K15V NC contact in close circuit not opening'], actions: ['Check K15V coil resistance at TBI-16 area', 'Measure K15V pick-up voltage (should operate at ≤90V DC)', 'Replace K15V relay if coil or contact is faulty', 'Do NOT put breaker in service until AP is repaired — risk of close on fault'], circuit: `K15V NC contact in closing circuit: K3 → K15V(NC) → 63CLX → 52C` }); }

  if (gs('pdStat') === 'trig') { pass = false; faults.push({ sev: 'fail', sym: 'POLE DISCREPANCY RELAY (47TX) TRIGGERED', val: '47TX operated during timing test — one phase delayed beyond timer setting.', causes: ['One pole mechanical failure', 'TC coil open on one phase', '52a contact of one phase maladjusted', 'Timer set too tight for this breaker model'], actions: ['Check timing analyser trace — identify lagging phase', 'Measure TC coil for that phase', 'Check 52a contact opening for that phase', 'Review 47TX timer setting (0.5–2s range)'], circuit: `47TX at TB2-33 → K81 → 3-phase trip when poll discrepancy detected` }); }

  if (gs('lrStat') === 'fail') warnings.push('Local/Remote changeover (SW-1/SW-2) issue detected. Check 43LR relay and SW-1 switch position. Verify wiring between MB and control panel.');

  // Generate report HTML
  document.getElementById('noResult').style.display = 'none';
  const rc = document.getElementById('resultContent');
  rc.style.display = 'block';

  const overallStatus = faults.length === 0 ? (warnings.length === 0 ? 'PASS' : 'CONDITIONAL PASS') : 'FAIL';
  const statusStyle = overallStatus === 'PASS' ? 'background:var(--green-light);border-color:var(--green);color:var(--green)' : overallStatus === 'CONDITIONAL PASS' ? 'background:var(--amber-light);border-color:var(--amber);color:var(--amber)' : 'background:var(--red-light);border-color:var(--red);color:var(--red)';

  document.getElementById('faultBadge').style.display = faults.length > 0 ? 'inline' : 'none';
  document.getElementById('faultBadge').textContent = faults.length;

  let html = `
    <div class="res-banner" style="${statusStyle}">
      <div class="res-status">${overallStatus}</div>
      <div class="res-meta">400kV CGL SFM-40S · ${new Date().toLocaleDateString('en-IN')} · ${faults.length} Fault(s) · ${warnings.length} Warning(s)</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
        <span class="badge ${faults.length > 0 ? 'b-fail' : 'b-pass'}">${faults.length} FAULTS</span>
        <span class="badge ${warnings.length > 0 ? 'b-warn' : 'b-pass'}">${warnings.length} WARNINGS</span>
      </div>
    </div>
  `;

  if (overallStatus === 'PASS') {
    html += `<div class="alert a-pass"><div class="alert-title">✅ All Parameters Within Limits</div><div class="alert-body">Breaker passed all evaluated parameters. Safe for service restoration after completing all other site checks. Ensure earthing removal procedure is followed before energisation.</div></div>`;
  }

  if (warnings.length > 0) {
    html += `<div class="alert a-warn" style="margin-bottom:16px;"><div class="alert-title">⚠ Warnings / Observations</div><div class="alert-body">${warnings.map((w, i) => `${i + 1}. ${w}`).join('<br>')}</div></div>`;
  }

  if (faults.length > 0) {
    html += `<div class="sec-header" style="margin-bottom:14px;"><div class="sec-chip">FAULTS</div><div class="sec-title" style="font-size:18px;">Detected Faults, Root Causes & Solutions</div><div class="sec-line"></div></div>`;
    faults.forEach(f => {
      html += `
        <div class="facc" style="margin-bottom:12px;">
          <div class="facc-head ${f.sev === 'fail' ? 'fail-head' : 'warn-head'}" onclick="tog(this)">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <span class="badge ${f.sev === 'fail' ? 'b-fail' : 'b-warn'}">${f.sev.toUpperCase()}</span>
                <span class="facc-title">${f.sym}</span>
              </div>
              <div class="facc-val">${f.val}</div>
            </div>
            <div class="facc-arr">▾</div>
          </div>
          <div class="facc-body open">
            <div class="facc-2col">
              <div><div class="facc-sec-label">🔍 Root Causes (from Drawing Analysis)</div><ul class="facc-list">${f.causes.map(c => `<li>${c}</li>`).join('')}</ul></div>
              <div><div class="facc-sec-label">🔧 Field Action Steps</div><ul class="facc-list">${f.actions.map((a, i) => `<li><strong>${i + 1}.</strong> ${a}</li>`).join('')}</ul></div>
            </div>
            <div class="facc-ckt"><div class="th">CIRCUIT TRACE (from CGL Drawing)</div>${f.circuit}</div>
          </div>
        </div>
      `;
    });
  }

  const rem = document.getElementById('remarks') ? document.getElementById('remarks').value : '';
  if (rem) { html += `<div class="alert a-info" style="margin-top:12px;"><div class="alert-title">📝 Field Remarks</div><div class="alert-body">${rem}</div></div>`; }

  html += `<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;"><button class="btn btn-outline btn-sm" onclick="window.print()">🖨 Print Report</button><button class="btn btn-outline btn-sm" onclick="showPage('pg-input',document.querySelectorAll('.nav-btn')[3])">← Edit Results</button></div>`;
  rc.innerHTML = html;

  // Open accordions by default
  rc.querySelectorAll('.facc-body.open').forEach(b => {
    const arr = b.previousElementSibling && b.previousElementSibling.querySelector('.facc-arr');
    if (arr) arr.style.transform = 'rotate(180deg)';
  });
}

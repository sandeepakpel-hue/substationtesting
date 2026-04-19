// ============================================================
//  connections.js — Page 6: Connections, TB Layout & Alarm Sim
//  Reads from: CIRCUIT_DATA, TB_DATA, ALARM_DATA, ALARM_SIM_RULES, MB_PRECAUTIONS (data.js)
// ============================================================

function renderConnections() {
  const container = document.getElementById('pg-conn');
  if (!container) return;

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 06</div>
      <div class="sec-title">Connections, TB Layout & Alarm Simulation</div>
      <div class="sec-line"></div>
    </div>

    <div class="conn-tabs">
      <button class="conn-tab active" onclick="showConn('ct-tc',this)">🔴 Trip Circuit (TC1/TC2)</button>
      <button class="conn-tab" onclick="showConn('ct-cc',this)">🟢 Close Circuit</button>
      <button class="conn-tab" onclick="showConn('ct-sf6',this)">💨 SF6 Alarms</button>
      <button class="conn-tab" onclick="showConn('ct-tb',this)">📋 Full TB Layout</button>
      <button class="conn-tab" onclick="showConn('ct-alarm',this)">🔔 Alarm Simulation</button>
    </div>

    <!-- TRIP CIRCUIT -->
    <div id="ct-tc">${renderTripCircuits()}</div>

    <!-- CLOSE CIRCUIT -->
    <div id="ct-cc" style="display:none;">${renderCloseCircuit()}</div>

    <!-- SF6 TERMINALS -->
    <div id="ct-sf6" style="display:none;">${renderSF6Terminals()}</div>

    <!-- FULL TB LAYOUT -->
    <div id="ct-tb" style="display:none;">${renderTBLayout()}</div>

    <!-- ALARM SIMULATION -->
    <div id="ct-alarm" style="display:none;">${renderAlarmSim()}</div>
  `;
}

function renderTripCircuits() {
  const tc1 = CIRCUIT_DATA.tc1;
  const tc2 = CIRCUIT_DATA.tc2;

  const tc1Rows = tc1.terminals.map(t => `<tr><td class="mono">${t.terminal}</td><td>${t.relay}</td><td>${t.func}</td><td>${t.state}</td></tr>`).join('');
  const tc2Rows = tc2.terminals.map(t => `<tr><td class="mono">${t.terminal}</td><td>${t.relay}</td><td>${t.func}</td></tr>`).join('');

  return `
    <div class="g2">
      <div class="card">
        <div class="card-head"><span class="card-icon">${tc1.icon}</span><span class="card-title">${tc1.title}</span></div>
        <div class="card-body">
          <div class="alert a-navy" style="margin-bottom:14px;"><div class="alert-title">Circuit Path — TC1 (R-Phase shown)</div><div class="alert-body" style="font-family:var(--mono);font-size:12px;line-height:2.2;">${tc1.circuitPath}</div></div>
          <table class="tbl"><thead><tr><th>Terminal</th><th>Relay/Device</th><th>Function</th><th>Normal State</th></tr></thead><tbody>${tc1Rows}</tbody></table>
          <div class="alert a-warn" style="margin-top:14px;"><div class="alert-title">TC1 Not Tripping — Field Check Sequence</div><div class="alert-body">${tc1.troubleshoot.replace(/\n/g, '<br>')}</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-icon">${tc2.icon}</span><span class="card-title">${tc2.title}</span></div>
        <div class="card-body">
          <div class="alert a-navy" style="margin-bottom:14px;"><div class="alert-title">Circuit Path — TC2 (R-Phase shown)</div><div class="alert-body" style="font-family:var(--mono);font-size:12px;line-height:2.2;">${tc2.circuitPath}</div></div>
          <table class="tbl"><thead><tr><th>Terminal</th><th>Relay/Device</th><th>Function</th></tr></thead><tbody>${tc2Rows}</tbody></table>
          <div class="alert a-info" style="margin-top:14px;"><div class="alert-title">DC Changeover (DCC) — Drawing Pg.1 Bottom</div><div class="alert-body">${tc2.dccInfo}</div></div>
        </div>
      </div>
    </div>
  `;
}

function renderCloseCircuit() {
  const cc = CIRCUIT_DATA.close;
  const rows = cc.terminals.map(t => `<tr><td class="mono">${t.terminal}</td><td>${t.relay}</td><td>${t.func}</td></tr>`).join('');

  return `
    <div class="card">
      <div class="card-head"><span class="card-icon">${cc.icon}</span><span class="card-title">${cc.title}</span></div>
      <div class="card-body">
        <div class="g2">
          <div>
            <div class="alert a-navy" style="margin-bottom:14px;"><div class="alert-title">Close Circuit Path</div><div class="alert-body" style="font-family:var(--mono);font-size:12px;line-height:2.4;">${cc.circuitPath}</div></div>
            <table class="tbl"><thead><tr><th>Terminal / Relay</th><th>Function</th><th>Normal State</th></tr></thead><tbody>${rows}</tbody></table>
          </div>
          <div>
            <div class="alert a-fail" style="margin-bottom:12px;"><div class="alert-title">Breaker Not Closing — Check Sequence</div><div class="alert-body">${cc.troubleshoot.replace(/\n/g, '<br>')}</div></div>
            <div class="alert a-warn"><div class="alert-title">88M1 (Closing Resistor) — TB2-28 area</div><div class="alert-body">${cc.resistorInfo}</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSF6Terminals() {
  const sf6 = CIRCUIT_DATA.sf6Terminals;
  const rows = sf6.terminals.map(t => `<tr><td class="mono">${t.terminal}</td><td class="mono">${t.relay}</td><td>${t.phase}</td><td>${t.func}</td><td>${t.contact}</td></tr>`).join('');

  return `
    <div class="card">
      <div class="card-head"><span class="card-icon">${sf6.icon}</span><span class="card-title">${sf6.title}</span></div>
      <div class="card-body">
        <div class="g2">
          <div>
            <div class="alert a-info" style="margin-bottom:14px;"><div class="alert-title">SF6 Relay Designation</div><div class="alert-body">${sf6.relayInfo}</div></div>
            <table class="tbl"><thead><tr><th>TB Terminal</th><th>Relay</th><th>Phase</th><th>Function</th><th>Contact Type</th></tr></thead><tbody>${rows}</tbody></table>
          </div>
          <div>
            <div class="alert a-warn" style="margin-bottom:12px;"><div class="alert-title">⚠ Alarm Simulation — SF6 Low (63GA)</div><div class="alert-body">${sf6.alarmSimLow}</div></div>
            <div class="alert a-fail"><div class="alert-title">⚠ Alarm Simulation — SF6 Lockout (63AGX)</div><div class="alert-body">${sf6.alarmSimLockout}</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTBLayout() {
  const tbCells = TB_DATA.map(t => `
    <div class="tb-cell" title="${t.d}">
      <div class="tb-num">${t.n}</div>
      <div class="tb-relay">${t.r}</div>
      <div class="tb-desc">${t.d}</div>
    </div>
  `).join('');

  const precautions = MB_PRECAUTIONS.map((p, i) => `${i + 1}. ${p}`).join('<br>');

  return `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-head"><span class="card-icon">📋</span><span class="card-title">MB TERMINAL BLOCK — ACTUAL LAYOUT (From CGL Drawing)</span></div>
      <div class="card-body">
        <div class="alert a-fail" style="margin-bottom:14px;">
          <div class="alert-title">⚠ MB Working Precautions</div>
          <div class="alert-body">${precautions}</div>
        </div>
        <div class="tb-grid">${tbCells}</div>
      </div>
    </div>
  `;
}

function renderAlarmSim() {
  const alarmOptions = Object.entries(ALARM_DATA).map(([key, val]) =>
    `<option value="${key}">${val.title}</option>`
  ).join('');

  const rules = ALARM_SIM_RULES.map(r => `<li>${r}</li>`).join('');

  return `
    <div class="g2">
      <div class="card">
        <div class="card-head"><span class="card-icon">🔔</span><span class="card-title">ALARM SIMULATION GUIDE</span></div>
        <div class="card-body">
          <div class="fg"><label class="fl">Select Alarm to Simulate</label>
            <select class="fs" id="alarmSel" onchange="showAlarmInfo()">
              <option value="">— Select alarm type —</option>
              ${alarmOptions}
            </select>
          </div>
          <div id="alarmPanel"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-icon">⚠</span><span class="card-title">GENERAL SIMULATION RULES</span></div>
        <div class="card-body">
          <ul class="facc-list" style="font-size:13px;line-height:2;">${rules}</ul>
        </div>
      </div>
    </div>
  `;
}

function showConn(id, btn) {
  ['ct-tc', 'ct-cc', 'ct-sf6', 'ct-tb', 'ct-alarm'].forEach(c => {
    const el = document.getElementById(c);
    if (el) el.style.display = c === id ? 'block' : 'none';
  });
  document.querySelectorAll('.conn-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function showAlarmInfo() {
  const sel = document.getElementById('alarmSel').value;
  const panel = document.getElementById('alarmPanel');
  if (!sel) { panel.innerHTML = ''; return; }
  const d = ALARM_DATA[sel];
  panel.innerHTML = `
    <div class="alert a-navy" style="margin-top:12px;">
      <div class="alert-title">${d.title}</div>
      <div class="alert-body"><strong>Terminals:</strong> ${d.terminals}</div>
    </div>
    <div class="div"></div>
    <div style="font-family:var(--mono);font-size:10px;letter-spacing:1.5px;color:var(--text4);text-transform:uppercase;margin-bottom:8px;">STEP-BY-STEP PROCEDURE</div>
    <ul class="steps">
      ${d.steps.map((s, i) => `<li class="step"><div class="step-num">${i + 1}</div><div class="step-content"><div class="step-body">${s}</div></div></li>`).join('')}
    </ul>
    ${d.caution ? `<div class="step-caution">⚠ ${d.caution}</div>` : ''}
  `;
}

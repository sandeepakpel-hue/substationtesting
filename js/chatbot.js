// ============================================================
//  chatbot.js — Page 7: AI Troubleshoot Chat + Quick Reference
//  Reads from: CHAT_CHIPS, QUICK_REF, CHAT_SYSTEM_PROMPT (data.js)
// ============================================================

let chatInit = false;

function renderChatbot() {
  const container = document.getElementById('pg-chat');
  if (!container) return;

  const chipsHtml = CHAT_CHIPS.map(c =>
    `<span class="chip" onclick="sendQ('${c.query.replace(/'/g, "\\'")}')">${c.label}</span>`
  ).join('');

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 07</div>
      <div class="sec-title">Smart Troubleshooting Chat</div>
      <div class="sec-line"></div>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-head"><span class="card-icon">🤖</span><span class="card-title">AI TROUBLESHOOTING — CGL SFM-40S EXPERT</span></div>
        <div class="card-body" style="padding-bottom:12px;">
          <p style="font-size:12px;color:var(--text3);font-family:var(--mono);margin-bottom:10px;">POWERED BY CLAUDE AI · 400kV CGL SFM-40S Drawing Context Loaded</p>
          <div class="chat-wrap" id="chatArea"></div>
          <div class="quick-chips">${chipsHtml}</div>
          <div class="chat-input-row">
            <input class="fi" id="chatIn" placeholder="Describe your problem… e.g. 'TC1 Y-phase coil resistance is open circuit'" onkeydown="if(event.key==='Enter')sendChat()">
            <button class="btn btn-primary" onclick="sendChat()">SEND</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-icon">📚</span><span class="card-title">QUICK REFERENCE — PROBLEMS DURING TESTING</span></div>
        <div class="card-body" style="padding:0;" id="qrPanel"></div>
      </div>
    </div>
  `;
}

function initChat() {
  if (chatInit) return;
  chatInit = true;
  const area = document.getElementById('chatArea');
  if (area) area.innerHTML = '';
  addMsg('ai', `<strong>CGL SFM-40S Troubleshooting Expert — Online</strong><br>
I have your full 400kV CGL drawing loaded — TC1/TC2 circuits, TB terminals, relay designations, SF6 logic, anti-pumping, and pole discrepancy.<br><br>
Describe your problem in plain English. For example:<br>
• <em>"Breaker not opening — measured TC1 R-phase is 35Ω"</em><br>
• <em>"SF6 alarm 63GA active on Y-phase after testing"</em><br>
• <em>"Close time 92ms only on R-phase"</em>`);
}

function addMsg(role, html) {
  const area = document.getElementById('chatArea');
  const d = document.createElement('div');
  d.className = `chat-msg ${role}`;
  d.innerHTML = `<div class="chat-av ${role === 'ai' ? 'ai' : 'usr'}">${role === 'ai' ? 'AI' : 'ENG'}</div><div class="chat-bbl ${role === 'ai' ? 'ai' : 'usr'}">${html}</div>`;
  area.appendChild(d);
  area.scrollTop = area.scrollHeight;
}

function sendQ(txt) { document.getElementById('chatIn').value = txt; sendChat(); }

async function sendChat() {
  const inp = document.getElementById('chatIn');
  const msg = inp.value.trim(); if (!msg) return;
  inp.value = ''; addMsg('user', msg);

  const area = document.getElementById('chatArea');
  const td = document.createElement('div');
  td.className = 'chat-msg ai';
  td.innerHTML = `<div class="chat-av ai">AI</div><div class="chat-bbl ai"><div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>`;
  area.appendChild(td); area.scrollTop = area.scrollHeight;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: CHAT_SYSTEM_PROMPT, messages: [{ role: 'user', content: msg }] })
    });
    const data = await resp.json(); td.remove();
    if (data.content && data.content[0]) {
      const txt = data.content[0].text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n(\d+\.)/g, '<br>$1')
        .replace(/\n[-•]/g, '<br>•');
      addMsg('ai', txt);
    } else { addMsg('ai', localAnswer(msg)); }
  } catch (e) { td.remove(); addMsg('ai', localAnswer(msg)); }
}

function localAnswer(msg) {
  const m = msg.toLowerCase();
  if (m.includes('not open') || m.includes('not trip')) { return `<strong>Breaker Not Opening — Check Sequence (TC1 Circuit):</strong><br>1. Measure 110V DC at <strong>TBI-13(+)/TBI-14(−)</strong><br>2. Check trip command reaching <strong>TBI-42</strong> (K23R R-phase)<br>3. Verify <strong>63AGX-A-2</strong> NC contact is CLOSED (SF6 pressure OK?)<br>4. Measure TC1 resistance at TBI-42/43 (should be 17–21Ω)<br>5. Check TC2 separately at TBI-61<br>6. Check 52a contact (NC when CB open) at TB3-R11`; }
  if (m.includes('not clos')) { return `<strong>Breaker Not Closing — Check Sequence:</strong><br>1. Is spring charged? Check 62CX indicator (62CX must be CLOSED)<br>2. Measure 110V DC at TBI-13<br>3. Is close command reaching K3? Check TBI-1/2<br>4. Is K15V anti-pumping relay latched? Reset it<br>5. Check CC coil (63CLX → 52C) resistance = 20Ω<br>6. Is 63AGX lockout active? Check SF6 pressure at gauge`; }
  if (m.includes('sf6') || m.includes('63ga') || m.includes('gas')) { return `<strong>SF6 Alarm Analysis:</strong><br>If 63GA (Stage-1 alarm): pressure below 7.5 kg/cm²<br>Alarm terminals: <strong>TB2-15/16 (R), TB2-19/20 (Y), TB2-23/24 (B)</strong><br>1. Check density gauge<br>2. Use SF6 detector at all flanges<br>3. Top-up after locating leak<br><br>If 63AGX (Stage-2 lockout): pressure below 7.0 kg/cm²<br><strong>CRITICAL: 63AGX-A-2 is NC in TC1 path — breaker will NOT trip!</strong><br>Emergency: isolate bay immediately.`; }
  if (m.includes('contact resist') || m.includes('cr ') || m.includes('µΩ') || m.includes('microohm')) { return `<strong>High Contact Resistance — Action:</strong><br>1. First verify DLRO 4-wire Kelvin connection<br>2. 60–100µΩ: clean with dry N₂, retest after 5 operations<br>3. >100µΩ: Check SF6 dew point (<−40°C)<br>4. If still high: OEM overhaul required — contact erosion<br>5. CR is at main interrupter contacts — not accessible without SF6 handling`; }
  if (m.includes('pole diff') || m.includes('47tx') || m.includes('discrepancy')) { return `<strong>Pole Discrepancy (47TX):</strong><br>47TX timer at <strong>TB2-33</strong>, output via K81<br>1. Identify lagging phase from timing analyser trace<br>2. Check 52a contact timing for that phase (TB3-R11/Y11/B11)<br>3. Measure TC coil resistance for that phase<br>4. Check 47TX set time (should be 0.5–2s)<br>5. Adjust individual pole mechanism if mechanical delay confirmed`; }
  return `<strong>Problem received.</strong><br>Please describe:<br>1. Exact symptom observed<br>2. Phase(s) affected (R/Y/B or all)<br>3. Any measured values (time, resistance, voltage)<br>4. Any alarm indicators active (63GA, 47TX, etc.)<br>For specific circuit trace, use Module 06 (Connections & TB).`;
}

function renderQR() {
  const el = document.getElementById('qrPanel'); if (!el) return;
  el.innerHTML = QUICK_REF.map(q => `
    <div class="facc" style="border:none;border-radius:0;box-shadow:none;margin:0;border-bottom:1px solid var(--border);">
      <div class="facc-head fail-head" onclick="tog(this)" style="border-left:none;border-bottom:none;">
        <div><div class="facc-title">${q.icon} ${q.title}</div></div>
        <div class="facc-arr">▾</div>
      </div>
      <div class="facc-body">
        <div style="font-size:12.5px;color:var(--text2);white-space:pre-line;font-family:var(--mono);">${q.fix}</div>
      </div>
    </div>
  `).join('');
}

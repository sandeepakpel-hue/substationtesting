const fs = require('fs');
const path = require('path');

// ─── Patch workflow-standalone.js ─────────────────────────────
const saFile = path.join(__dirname, 'js', 'workflow-standalone.js');
let sa = fs.readFileSync(saFile, 'utf8');

// 1. Rename chat card heading + update placeholder + improve send button
sa = sa.replace(
  `    <div class="card wf-sec">
      <div class="card-head"><span class="card-title">AI TROUBLESHOOT CHAT</span></div>
      <div class="card-body">
        <div class="chat-wrap" id="wfChat"></div>
        <div class="quick-chips">
          \${(tb || []).slice(0, 4).map(tr => \`
            <div class="chip" onclick="wfChatQuery('\${tr.condition.replace(/'/g, "\\\\'").replace(/"/g, '&quot;')}')">
              \${tr.condition.length > 40 ? tr.condition.slice(0, 40) + '&hellip;' : tr.condition}
            </div>\`).join('')}
          <div class="chip" onclick="document.getElementById('wfProbCard').scrollIntoView({behavior:'smooth'})">Submit Problem</div>
        </div>
        <div class="chat-input-row">
          <input id="wfChatInp" class="fi" type="text" placeholder="Describe your issue…"
            onkeydown="if(event.key==='Enter') wfChatSend()">
          <button class="btn btn-primary" onclick="wfChatSend()">Send</button>
        </div>
      </div>
    </div>`,

  `    <div class="card wf-sec">
      <div class="card-head">
        <div class="sets-chat-heading">
          <span class="sets-badge">SETS</span>
          <span class="card-title">AI TROUBLESHOOTING CHAT</span>
          <div class="sets-status-dot"></div>
        </div>
      </div>
      <div class="card-body">
        <div class="chat-wrap" id="wfChat"></div>
        <div class="quick-chips">
          \${(tb || []).slice(0, 4).map(tr => \`
            <div class="chip" onclick="wfChatQuery('\${tr.condition.replace(/'/g, "\\\\'").replace(/"/g, '&quot;')}')">
              \${tr.condition.length > 40 ? tr.condition.slice(0, 40) + '&hellip;' : tr.condition}
            </div>\`).join('')}
          <div class="chip" onclick="document.getElementById('wfProbCard').scrollIntoView({behavior:'smooth'})">Submit Problem</div>
        </div>
        <div class="chat-input-row">
          <input id="wfChatInp" class="fi" type="text" placeholder="Describe your issue or test problem\u2026"
            onkeydown="if(event.key==='Enter') wfChatSend()">
          <button class="chat-send-btn" id="wfChatSendBtn" onclick="wfChatSendWithLoading()">&#9654; Send</button>
        </div>
      </div>
    </div>`
);

fs.writeFileSync(saFile, sa, 'utf8');
console.log('✅ workflow-standalone.js patched');

// ─── Patch workflow.js ─────────────────────────────────────────
const wfFile = path.join(__dirname, 'js', 'workflow.js');
let wf = fs.readFileSync(wfFile, 'utf8');

// 2. Rename the chat card heading inside workflow.js (embedded version)
wf = wf.replace(
  `\${wfCard('💬', 'AI TROUBLESHOOT CHAT', \``,
  `\${wfCard('💬', 'SETS — AI TROUBLESHOOTING CHAT', \``
);

// 3. Update placeholder in workflow.js chat input
wf = wf.replace(
  `<input id="wfChatInp" class="fi" type="text" placeholder="Describe your problem or symptom…"`,
  `<input id="wfChatInp" class="fi" type="text" placeholder="Describe your issue or test problem\u2026"`
);

// 4. Upgrade send button in workflow.js
wf = wf.replace(
  `<button class="btn btn-primary" onclick="wfChatSend()">Send</button>`,
  `<button class="chat-send-btn" id="wfChatSendBtn" onclick="wfChatSendWithLoading()">&#9654; Send</button>`
);

fs.writeFileSync(wfFile, wf, 'utf8');
console.log('✅ workflow.js patched');

// ─── Add wfChatSendWithLoading helper to workflow.js ──────────
// Append at end of file
const helperFn = `
// ─── SETS Chat — Send with Loading Indicator ─────────────────
function wfChatSendWithLoading() {
  const inp = document.getElementById('wfChatInp');
  const btn = document.getElementById('wfChatSendBtn');
  const q   = inp ? inp.value.trim() : '';
  if (!q) return;

  // Show loading state
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="chat-send-spinner"></span> Sending…';
  }

  wfChatAddMsg(q, 'user');
  if (inp) inp.value = '';

  setTimeout(() => {
    const reply = wfChatMatch(q);
    wfChatAddMsg(reply, 'ai');
    // Restore button
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '&#9654; Send';
    }
  }, 600);
}
`;

let wf2 = fs.readFileSync(wfFile, 'utf8');
if (!wf2.includes('wfChatSendWithLoading')) {
  wf2 += helperFn;
  fs.writeFileSync(wfFile, wf2, 'utf8');
  console.log('✅ wfChatSendWithLoading helper added to workflow.js');
}

// Also add to standalone if not present
let sa2 = fs.readFileSync(saFile, 'utf8');
const saHelper = `
// ─── SETS Chat — Send with Loading (Standalone) ───────────────
// (delegates to wfChatSendWithLoading defined in workflow.js)
`;
if (!sa2.includes('wfChatSendWithLoading')) {
  // Just reference: the function is in workflow.js which is loaded first
  console.log('ℹ️  Standalone relies on wfChatSendWithLoading from workflow.js (loaded first)');
}

console.log('\\n✅ All patches applied successfully.');

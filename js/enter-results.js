// ============================================================
//  enter-results.js — Page 4: Enter Results + PDF Upload
//  Reads from: TEST_TYPE_OPTIONS, TEST_TYPE_LABELS, LIMITS (data.js)
// ============================================================

// ── PDF UPLOAD STATE ──
let pdfFileData = null;
let pdfMediaType = 'application/pdf';
let pdfFileName = '';

function renderEnterResults() {
  const container = document.getElementById('pg-input');
  if (!container) return;

  // Test type picker buttons
  const testTypeButtons = TEST_TYPE_OPTIONS.map(opt => `
    <label class="test-type-btn" data-val="${opt.value}">
      <input type="radio" name="testType" value="${opt.value}" ${opt.checked ? 'checked' : ''} style="display:none;">
      <div class="ttb-inner">
        <div class="ttb-icon">${opt.icon}</div>
        <div class="ttb-label">${opt.label}</div>
      </div>
    </label>
  `).join('');

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-chip">MODULE 04</div>
      <div class="sec-title">Enter Test Results</div>
      <div class="sec-line"></div>
    </div>

    <!-- PDF UPLOAD PANEL -->
    <div class="card" style="margin-bottom:20px;border:2px dashed var(--blue);background:var(--blue-light);">
      <div class="card-head" style="background:var(--blue-mid);border-bottom-color:var(--blue);">
        <span class="card-icon">📄</span>
        <span class="card-title" style="color:var(--navy);">UPLOAD TEST REPORT PDF — AI Auto-Extraction</span>
        <span style="margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--blue);background:var(--surface);padding:2px 8px;border-radius:10px;border:1px solid var(--blue);">POWERED BY CLAUDE AI</span>
      </div>
      <div class="card-body">
        <div class="g2" style="align-items:start;">
          <div>
            <div class="fg">
              <label class="fl">Select Test Type</label>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:4px;" id="testTypePicker">
                ${testTypeButtons}
              </div>
            </div>
            <div id="pdfDropZone" class="pdf-drop" onclick="document.getElementById('pdfFileIn').click()" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="dropFile(event)">
              <div class="pdf-drop-icon">📄</div>
              <div class="pdf-drop-text">Click to upload or drag & drop test report PDF</div>
              <div class="pdf-drop-sub">Supports: timing analyser printout, DLRO report, Megger test sheet, handwritten scanned report</div>
              <input type="file" id="pdfFileIn" accept=".pdf,image/*" style="display:none;" onchange="handleFile(this)">
            </div>
            <div id="pdfFileInfo" style="display:none;margin-top:10px;" class="alert a-pass">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                <div>
                  <div class="alert-title" id="pdfFileName">report.pdf</div>
                  <div class="alert-body" id="pdfFileSize">—</div>
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="btn btn-primary btn-sm" id="extractBtn" onclick="extractFromPDF()">🤖 Extract & Evaluate</button>
                  <button class="btn btn-outline btn-sm" onclick="clearPDF()">✕ Remove</button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div id="extractStatus" class="alert a-info" style="margin-bottom:12px;">
              <div class="alert-title">How it works</div>
              <div class="alert-body">
                1. Select the <strong>test type</strong> matching your PDF report<br>
                2. Upload the PDF (printout, scan, or photo)<br>
                3. AI reads and extracts all values automatically<br>
                4. Results are checked against CGL SFM-40S limits<br>
                5. Faults with root causes appear instantly<br><br>
                <strong>Supported formats:</strong> Timing analyser printout (EGIL, TM1800, Doble), DLRO report, Megger test sheet, handwritten report (scanned/photo)
              </div>
            </div>
            <div id="extractPreview" style="display:none;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- DIVIDER -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
      <div style="flex:1;height:1px;background:var(--border);"></div>
      <span style="font-family:var(--mono);font-size:11px;color:var(--text4);letter-spacing:2px;white-space:nowrap;">OR ENTER MANUALLY BELOW</span>
      <div style="flex:1;height:1px;background:var(--border);"></div>
    </div>

    <div class="alert a-navy" style="margin-bottom:18px; display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
      <div><strong>Breaker:</strong> 400kV CGL SFM-40S &nbsp;|&nbsp; <strong>TC:</strong> 19Ω, 110V DC &nbsp;|&nbsp; <strong>CC:</strong> 20Ω, 110V DC &nbsp;|&nbsp; <strong>SF6:</strong> 8 kg/cm²@20°C</div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-outline btn-sm" onclick="fillSample()">📋 Fill Sample</button>
        <button class="btn btn-outline btn-sm" onclick="clearAll()">✕ Clear</button>
      </div>
    </div>

    <div class="g2" style="margin-bottom:16px;">
      <!-- TIMING -->
      <div class="card">
        <div class="card-head"><span class="card-icon">⏱</span><span class="card-title">TIMING TEST RESULTS (ms)</span></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div><div class="fl">Open R (ms)</div><input class="fi" type="number" id="tOR" placeholder="e.g. 48" oninput="liveCheck(this,'open')"><div class="iind" id="liOR"></div></div>
            <div><div class="fl">Open Y (ms)</div><input class="fi" type="number" id="tOY" placeholder="e.g. 49" oninput="liveCheck(this,'open')"><div class="iind" id="liOY"></div></div>
            <div><div class="fl">Open B (ms)</div><input class="fi" type="number" id="tOB" placeholder="e.g. 47" oninput="liveCheck(this,'open')"><div class="iind" id="liOB"></div></div>
            <div><div class="fl">Close R (ms)</div><input class="fi" type="number" id="tCR" placeholder="e.g. 62" oninput="liveCheck(this,'close')"><div class="iind" id="liCR"></div></div>
            <div><div class="fl">Close Y (ms)</div><input class="fi" type="number" id="tCY" placeholder="e.g. 63" oninput="liveCheck(this,'close')"><div class="iind" id="liCY"></div></div>
            <div><div class="fl">Close B (ms)</div><input class="fi" type="number" id="tCB" placeholder="e.g. 65" oninput="liveCheck(this,'close')"><div class="iind" id="liCB"></div></div>
          </div>
          <div class="div"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div><div class="fl">Spring Recharge Time (s)</div><input class="fi" type="number" id="springTime" placeholder="e.g. 15"></div>
            <div><div class="fl">No. of Operations Done</div><input class="fi" type="number" id="opCount" placeholder="e.g. 3"></div>
          </div>
        </div>
      </div>

      <!-- STATUS -->
      <div>
        <div class="card" style="margin-bottom:14px;">
          <div class="card-head"><span class="card-icon">🚦</span><span class="card-title">BREAKER STATUS & ALARMS</span></div>
          <div class="card-body">
            <div class="g2">
              <div class="fg"><label class="fl">Position Indication</label><select class="fs" id="posInd"><option value="ok">✅ Correct (matches actual)</option><option value="mis">❌ MISMATCH detected</option></select></div>
              <div class="fg"><label class="fl">SF6 Status (63GA/AGX)</label><select class="fs" id="sf6Stat"><option value="ok">✅ Normal (>7.5 kg/cm²)</option><option value="alm">⚠ Alarm (63GA/GB active)</option><option value="lko">❌ Lockout (63AGX active)</option><option value="lk">🔴 Leak suspected</option></select></div>
              <div class="fg"><label class="fl">Spring Status (62CX)</label><select class="fs" id="sprStat"><option value="ok">✅ Charged (62CX=CLOSED)</option><option value="slow">⚠ Charging Slow (>30s)</option><option value="fail">❌ NOT Charging (motor fault)</option></select></div>
              <div class="fg"><label class="fl">Anti-Pumping (K15V)</label><select class="fs" id="apStat"><option value="ok">✅ Working</option><option value="fail">❌ Pumping observed</option><option value="nottest">— Not Tested</option></select></div>
              <div class="fg"><label class="fl">TC1 Circuit (52T1)</label><select class="fs" id="tc1"><option value="ok">✅ OK (R,Y,B all healthy)</option><option value="r">❌ TC1 R-phase FAIL</option><option value="y">❌ TC1 Y-phase FAIL</option><option value="b">❌ TC1 B-phase FAIL</option><option value="all">❌ TC1 all phases FAIL</option></select></div>
              <div class="fg"><label class="fl">TC2 Circuit (52T2)</label><select class="fs" id="tc2"><option value="ok">✅ OK</option><option value="r">❌ TC2 R-phase FAIL</option><option value="y">❌ TC2 Y-phase FAIL</option><option value="b">❌ TC2 B-phase FAIL</option><option value="all">❌ TC2 all phases FAIL</option></select></div>
              <div class="fg"><label class="fl">Pole Discrepancy (47TX)</label><select class="fs" id="pdStat"><option value="ok">✅ No pole disc. event</option><option value="trig">❌ 47TX Triggered during test</option></select></div>
              <div class="fg"><label class="fl">Local/Remote (SW-1/SW-2)</label><select class="fs" id="lrStat"><option value="ok">✅ Changeover correct</option><option value="fail">❌ Changeover issue</option></select></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="g2" style="margin-bottom:16px;">
      <!-- CR -->
      <div class="card">
        <div class="card-head"><span class="card-icon">Ω</span><span class="card-title">CONTACT RESISTANCE (µΩ)</span></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div><div class="fl">Ph-R (µΩ)</div><input class="fi" type="number" id="crR" placeholder="e.g. 35" oninput="liveCR(this,'crR')"><div class="iind" id="licrR"></div></div>
            <div><div class="fl">Ph-Y (µΩ)</div><input class="fi" type="number" id="crY" placeholder="e.g. 38" oninput="liveCR(this,'crY')"><div class="iind" id="licrY"></div></div>
            <div><div class="fl">Ph-B (µΩ)</div><input class="fi" type="number" id="crB" placeholder="e.g. 33" oninput="liveCR(this,'crB')"><div class="iind" id="licrB"></div></div>
          </div>
        </div>
      </div>

      <!-- COILS -->
      <div class="card">
        <div class="card-head"><span class="card-icon">🔧</span><span class="card-title">COIL RESISTANCE (Ω)</span></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            <div><div class="fl">TC1-R (Ω)</div><input class="fi" type="number" id="tc1R" placeholder="19" oninput="liveCoil(this,'tc','tc1R')"><div class="iind" id="lc1R"></div></div>
            <div><div class="fl">TC1-Y (Ω)</div><input class="fi" type="number" id="tc1Y" placeholder="19" oninput="liveCoil(this,'tc','tc1Y')"><div class="iind" id="lc1Y"></div></div>
            <div><div class="fl">TC1-B (Ω)</div><input class="fi" type="number" id="tc1B" placeholder="19" oninput="liveCoil(this,'tc','tc1B')"><div class="iind" id="lc1B"></div></div>
            <div><div class="fl">TC2-R (Ω)</div><input class="fi" type="number" id="tc2R" placeholder="19" oninput="liveCoil(this,'tc','tc2R')"><div class="iind" id="lc2R"></div></div>
            <div><div class="fl">TC2-Y (Ω)</div><input class="fi" type="number" id="tc2Y" placeholder="19" oninput="liveCoil(this,'tc','tc2Y')"><div class="iind" id="lc2Y"></div></div>
            <div><div class="fl">TC2-B (Ω)</div><input class="fi" type="number" id="tc2B" placeholder="19" oninput="liveCoil(this,'tc','tc2B')"><div class="iind" id="lc2B"></div></div>
            <div><div class="fl">CC (Ω)</div><input class="fi" type="number" id="ccOhm" placeholder="20" oninput="liveCoil(this,'cc','ccOhm')"><div class="iind" id="lcc"></div></div>
            <div><div class="fl">IR Ph-R (MΩ)</div><input class="fi" type="number" id="irR" placeholder="e.g. 5000"></div>
            <div><div class="fl">IR Ph-Y (MΩ)</div><input class="fi" type="number" id="irY" placeholder="e.g. 4500"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- REMARKS -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-head"><span class="card-icon">📝</span><span class="card-title">FIELD REMARKS & OBSERVATIONS</span></div>
      <div class="card-body">
        <textarea class="ft" id="remarks" placeholder="Record any abnormal sounds, visual observations, alarm conditions, weather conditions, or any deviation from normal during testing..."></textarea>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:12px;flex-wrap:wrap;">
      <button class="btn btn-outline" onclick="clearAll()">✕ Clear All</button>
      <button class="btn btn-primary" onclick="evalResults()">→ Evaluate Results & Generate Fault Report</button>
    </div>
  `;

  // Init test type picker styling
  initTestTypePicker();
}

function initTestTypePicker() {
  document.querySelectorAll('input[name="testType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.test-type-btn .ttb-inner').forEach(el => {
        el.style.background = ''; el.style.borderColor = '';
      });
      const sel = document.querySelector('input[name="testType"]:checked');
      if (sel) {
        const inner = sel.parentElement.querySelector('.ttb-inner');
        if (inner) { inner.style.background = 'var(--navy)'; inner.style.borderColor = 'var(--navy)'; }
      }
    });
  });
  const def = document.querySelector('input[name="testType"]:checked');
  if (def) {
    const inner = def.parentElement.querySelector('.ttb-inner');
    if (inner) { inner.style.background = 'var(--navy)'; inner.style.borderColor = 'var(--navy)'; }
  }
}

// ── Live Validation ──
function liveCheck(el, type) {
  if (!el.value) return;
  const v = parseFloat(el.value);
  const lim = type === 'open' ? LIMITS.open : LIMITS.close;
  const map = { tOR: 'liOR', tOY: 'liOY', tOB: 'liOB', tCR: 'liCR', tCY: 'liCY', tCB: 'liCB' };
  const ind = document.getElementById(map[el.id]);
  if (!ind) return;
  if (v >= lim[0] && v <= lim[1]) { ind.className = 'iind pass'; ind.innerHTML = '✓ PASS — within ' + lim[0] + '–' + lim[1] + ' ms'; }
  else { ind.className = 'iind fail'; ind.innerHTML = '✗ FAIL — limit ' + lim[0] + '–' + lim[1] + ' ms'; }
}

function liveCR(el, id) {
  if (!el.value) return;
  const v = parseFloat(el.value);
  const map = { crR: 'licrR', crY: 'licrY', crB: 'licrB' };
  const ind = document.getElementById(map[id]); if (!ind) return;
  if (v < LIMITS.cr) { ind.className = 'iind pass'; ind.innerHTML = '✓ PASS (<' + LIMITS.cr + ' µΩ)'; }
  else if (v < LIMITS.crWarn) { ind.className = 'iind fail'; ind.innerHTML = '⚠ INVESTIGATE (' + LIMITS.cr + '–100 µΩ)'; }
  else { ind.className = 'iind fail'; ind.innerHTML = '✗ REJECT (>100 µΩ)'; }
}

function liveCoil(el, type, id) {
  if (!el.value) return;
  const v = parseFloat(el.value);
  const lim = type === 'tc' ? LIMITS.tc : LIMITS.cc;
  const map = { tc1R: 'lc1R', tc1Y: 'lc1Y', tc1B: 'lc1B', tc2R: 'lc2R', tc2Y: 'lc2Y', tc2B: 'lc2B', ccOhm: 'lcc' };
  const ind = document.getElementById(map[id]); if (!ind) return;
  if (v >= lim[0] && v <= lim[1]) { ind.className = 'iind pass'; ind.innerHTML = '✓ ' + v + 'Ω OK'; }
  else if (v === 0 || !isFinite(v)) { ind.className = 'iind fail'; ind.innerHTML = '✗ OPEN CIRCUIT'; }
  else { ind.className = 'iind fail'; ind.innerHTML = '✗ Out of range (' + lim[0] + '–' + lim[1] + ' Ω)'; }
}

// ── Sample & Clear ──
function fillSample() {
  Object.entries(SAMPLE_DATA).forEach(([k, v]) => { const el = document.getElementById(k); if (el) el.value = v; });
  ['tOR', 'tOY', 'tOB'].forEach(id => { const el = document.getElementById(id); if (el) liveCheck(el, 'open'); });
  ['tCR', 'tCY', 'tCB'].forEach(id => { const el = document.getElementById(id); if (el) liveCheck(el, 'close'); });
  ['crR', 'crY', 'crB'].forEach(id => { const el = document.getElementById(id); if (el) liveCR(el, id); });
  ['tc1R', 'tc1Y', 'tc1B', 'tc2R', 'tc2Y', 'tc2B'].forEach(id => { const el = document.getElementById(id); if (el) liveCoil(el, 'tc', id); });
  const cc = document.getElementById('ccOhm'); if (cc) liveCoil(cc, 'cc', 'ccOhm');
}

function clearAll() {
  ['tOR', 'tOY', 'tOB', 'tCR', 'tCY', 'tCB', 'crR', 'crY', 'crB', 'tc1R', 'tc1Y', 'tc1B', 'tc2R', 'tc2Y', 'tc2B', 'ccOhm', 'irR', 'irY', 'springTime', 'opCount', 'remarks'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  ['liOR', 'liOY', 'liOB', 'liCR', 'liCY', 'liCB', 'licrR', 'licrY', 'licrB', 'lc1R', 'lc1Y', 'lc1B', 'lc2R', 'lc2Y', 'lc2B', 'lcc'].forEach(id => { const el = document.getElementById(id); if (el) { el.className = 'iind'; el.innerHTML = ''; } });
}

// ── PDF Upload Helpers ──
function dragOver(e) { e.preventDefault(); document.getElementById('pdfDropZone').classList.add('dragover'); }
function dragLeave(e) { document.getElementById('pdfDropZone').classList.remove('dragover'); }
function dropFile(e) { e.preventDefault(); document.getElementById('pdfDropZone').classList.remove('dragover'); const f = e.dataTransfer.files[0]; if (f) processFile(f); }
function handleFile(input) { if (input.files[0]) processFile(input.files[0]); }

function processFile(file) {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) { alert('Please upload a PDF or image file (JPG, PNG, PDF).'); return; }
  pdfFileName = file.name;
  pdfMediaType = file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    pdfFileData = e.target.result.split(',')[1];
    document.getElementById('pdfFileInfo').style.display = 'block';
    document.getElementById('pdfFileName').textContent = '📄 ' + file.name;
    document.getElementById('pdfFileSize').textContent = (file.size / 1024).toFixed(1) + ' KB · ' + file.type;
    const dz = document.getElementById('pdfDropZone');
    dz.style.borderColor = 'var(--green)'; dz.style.background = 'var(--green-light)';
    dz.querySelector('.pdf-drop-icon').textContent = '✅';
    dz.querySelector('.pdf-drop-text').textContent = file.name;
    dz.querySelector('.pdf-drop-sub').textContent = 'File ready. Click "Extract & Evaluate" to process.';
    setExtractStatus('ready');
  };
  reader.readAsDataURL(file);
}

function clearPDF() {
  pdfFileData = null; pdfFileName = '';
  document.getElementById('pdfFileInfo').style.display = 'none';
  document.getElementById('pdfFileIn').value = '';
  document.getElementById('extractPreview').style.display = 'none';
  const dz = document.getElementById('pdfDropZone');
  dz.style.borderColor = ''; dz.style.background = '';
  dz.querySelector('.pdf-drop-icon').textContent = '📄';
  dz.querySelector('.pdf-drop-text').textContent = 'Click to upload or drag & drop test report PDF';
  dz.querySelector('.pdf-drop-sub').textContent = 'Supports: timing analyser printout, DLRO report, Megger test sheet, handwritten scanned report';
  setExtractStatus('idle');
}

function getSelectedTestType() { const r = document.querySelector('input[name="testType"]:checked'); return r ? r.value : 'full_report'; }

function setExtractStatus(state, msg = '') {
  const el = document.getElementById('extractStatus');
  if (!el) return;
  const states = {
    idle: { cls: 'a-info', title: 'How it works', body: '1. Select the <strong>test type</strong> matching your PDF report<br>2. Upload the PDF (printout, scan, or photo)<br>3. AI reads and extracts all values automatically<br>4. Results are checked against CGL SFM-40S limits<br>5. Faults with root causes appear instantly<br><br><strong>Supported formats:</strong> Timing analyser printout (EGIL, TM1800, Doble), DLRO report, Megger test sheet, handwritten report (scanned/photo)' },
    ready: { cls: 'a-pass', title: '✅ File Ready', body: 'Select test type above (if not already selected), then click <strong>"Extract & Evaluate"</strong>.' },
    loading: { cls: 'a-info', title: '🤖 AI Extracting Values…', body: msg || 'Reading PDF and identifying test parameters. This may take 10–20 seconds…<br><br><div class="typing" style="justify-content:flex-start;padding:4px 0;"><div class="td"></div><div class="td"></div><div class="td"></div></div>' },
    done: { cls: 'a-pass', title: '✅ Extraction Complete', body: msg },
    error: { cls: 'a-fail', title: '❌ Extraction Error', body: msg },
  };
  const s = states[state] || states.idle;
  el.className = 'alert ' + s.cls;
  el.innerHTML = `<div class="alert-title">${s.title}</div><div class="alert-body">${s.body}</div>`;
}

// ── PDF AI Extraction ──
async function extractFromPDF() {
  if (!pdfFileData) { alert('Please upload a PDF file first.'); return; }
  const testType = getSelectedTestType();
  const testLabel = TEST_TYPE_LABELS[testType] || testType;

  setExtractStatus('loading', `Analysing: <strong>${pdfFileName}</strong><br>Test type: <strong>${testLabel}</strong><br><br><div class="typing" style="padding:4px 0;"><div class="td"></div><div class="td"></div><div class="td"></div></div>`);
  document.getElementById('extractPreview').style.display = 'none';
  document.getElementById('extractBtn').disabled = true;
  document.getElementById('extractBtn').textContent = '⏳ Extracting…';

  const systemPrompt = getPDFSystemPrompt(testLabel);

  try {
    const msgContent = pdfMediaType === 'application/pdf'
      ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfFileData } }, { type: 'text', text: `Extract all test values from this ${testLabel} report. Return only JSON as specified.` }]
      : [{ type: 'image', source: { type: 'base64', media_type: pdfMediaType, data: pdfFileData } }, { type: 'text', text: `Extract all test values from this ${testLabel} report image. Return only JSON as specified.` }];

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, system: systemPrompt, messages: [{ role: 'user', content: msgContent }] })
    });

    const data = await resp.json();
    if (!data.content || !data.content[0]) throw new Error('No response from AI');
    const rawText = data.content[0].text;
    const clean = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    populateFromExtraction(parsed);
    renderExtractionPreview(parsed);
    setExtractStatus('done', `✅ Extracted from <strong>${parsed.document_title || pdfFileName}</strong><br>Confidence: <strong>${parsed.extraction_confidence || 'MEDIUM'}</strong> · Values populated in form below.`);
  } catch (err) {
    console.error('PDF extraction error:', err);
    setExtractStatus('error', `Failed to extract values: ${err.message}.<br>Please enter values manually below, or try a clearer scan.`);
  } finally {
    document.getElementById('extractBtn').disabled = false;
    document.getElementById('extractBtn').textContent = '🤖 Extract & Evaluate';
  }
}

function populateFromExtraction(data) {
  const v = data.values || {};
  const fieldMap = {
    open_r: 'tOR', open_y: 'tOY', open_b: 'tOB',
    close_r: 'tCR', close_y: 'tCY', close_b: 'tCB',
    cr_r: 'crR', cr_y: 'crY', cr_b: 'crB',
    tc1_r: 'tc1R', tc1_y: 'tc1Y', tc1_b: 'tc1B',
    tc2_r: 'tc2R', tc2_y: 'tc2Y', tc2_b: 'tc2B',
    cc_ohm: 'ccOhm', ir_r: 'irR', ir_y: 'irY',
    spring_recharge_time: 'springTime',
  };
  Object.entries(fieldMap).forEach(([src, dest]) => {
    if (v[src] !== null && v[src] !== undefined) {
      const el = document.getElementById(dest);
      if (el) { el.value = v[src]; el.style.background = '#fffbeb'; el.style.borderColor = 'var(--amber)'; }
    }
  });
  if (data.raw_notes) { const r = document.getElementById('remarks'); if (r) r.value = (r.value ? r.value + '\n' : '') + `[AI Extracted — ${data.date || ''}] ${data.raw_notes}`; }
  ['tOR', 'tOY', 'tOB'].forEach(id => { const el = document.getElementById(id); if (el && el.value) liveCheck(el, 'open'); });
  ['tCR', 'tCY', 'tCB'].forEach(id => { const el = document.getElementById(id); if (el && el.value) liveCheck(el, 'close'); });
  ['crR', 'crY', 'crB'].forEach(id => { const el = document.getElementById(id); if (el && el.value) liveCR(el, id); });
  ['tc1R', 'tc1Y', 'tc1B', 'tc2R', 'tc2Y', 'tc2B'].forEach(id => { const el = document.getElementById(id); if (el && el.value) liveCoil(el, 'tc', id); });
  const cc = document.getElementById('ccOhm'); if (cc && cc.value) liveCoil(cc, 'cc', 'ccOhm');
}

function renderExtractionPreview(data) {
  const v = data.values || {};
  const preview = document.getElementById('extractPreview');
  preview.style.display = 'block';
  const checks = [
    { label: 'Open R', val: v.open_r, unit: 'ms', lim: LIMITS.open, type: 'range' },
    { label: 'Open Y', val: v.open_y, unit: 'ms', lim: LIMITS.open, type: 'range' },
    { label: 'Open B', val: v.open_b, unit: 'ms', lim: LIMITS.open, type: 'range' },
    { label: 'Close R', val: v.close_r, unit: 'ms', lim: LIMITS.close, type: 'range' },
    { label: 'Close Y', val: v.close_y, unit: 'ms', lim: LIMITS.close, type: 'range' },
    { label: 'Close B', val: v.close_b, unit: 'ms', lim: LIMITS.close, type: 'range' },
    { label: 'Pole Diff Open', val: v.pole_diff_open, unit: 'ms', lim: [0, LIMITS.poleDiff], type: 'max' },
    { label: 'Pole Diff Close', val: v.pole_diff_close, unit: 'ms', lim: [0, LIMITS.poleDiff], type: 'max' },
    { label: 'CR Ph-R', val: v.cr_r, unit: 'µΩ', lim: [0, LIMITS.cr], type: 'max' },
    { label: 'CR Ph-Y', val: v.cr_y, unit: 'µΩ', lim: [0, LIMITS.cr], type: 'max' },
    { label: 'CR Ph-B', val: v.cr_b, unit: 'µΩ', lim: [0, LIMITS.cr], type: 'max' },
    { label: 'IR Ph-R', val: v.ir_r, unit: 'MΩ', lim: [LIMITS.ir, 999999], type: 'min' },
    { label: 'IR Ph-Y', val: v.ir_y, unit: 'MΩ', lim: [LIMITS.ir, 999999], type: 'min' },
    { label: 'TC1-R', val: v.tc1_r, unit: 'Ω', lim: LIMITS.tc, type: 'range' },
    { label: 'TC1-Y', val: v.tc1_y, unit: 'Ω', lim: LIMITS.tc, type: 'range' },
    { label: 'TC1-B', val: v.tc1_b, unit: 'Ω', lim: LIMITS.tc, type: 'range' },
    { label: 'CC', val: v.cc_ohm, unit: 'Ω', lim: LIMITS.cc, type: 'range' },
    { label: 'SF6', val: v.sf6_pressure, unit: 'kg/cm²', lim: [LIMITS.sf6Lockout, 99], type: 'min' },
  ].filter(c => c.val !== null && c.val !== undefined);

  let status, cls;
  const cards = checks.map(c => {
    if (c.type === 'range') { const ok = c.val >= c.lim[0] && c.val <= c.lim[1]; status = ok ? 'PASS' : 'FAIL'; cls = ok ? 'pass-item' : 'fail-item'; }
    else if (c.type === 'max') { const ok = c.val <= c.lim[1]; status = ok ? 'PASS' : (c.val > LIMITS.crWarn && c.unit === 'µΩ' ? 'REJECT' : 'FAIL'); cls = ok ? 'pass-item' : 'fail-item'; }
    else { const ok = c.val >= c.lim[0]; status = ok ? 'PASS' : 'FAIL'; cls = ok ? 'pass-item' : 'fail-item'; }
    return `<div class="ext-val-item ${cls}"><div class="ext-param">${c.label}</div><div class="ext-num">${c.val}<span class="ext-unit"> ${c.unit}</span></div><div class="ext-status ${status.toLowerCase() === 'pass' ? 'pass' : 'fail'}">${status}</div></div>`;
  }).join('');

  const failCount = checks.filter(c => {
    if (c.type === 'range') return !(c.val >= c.lim[0] && c.val <= c.lim[1]);
    if (c.type === 'max') return c.val > c.lim[1];
    return c.val < c.lim[0];
  }).length;

  const overallCls = failCount === 0 ? 'a-pass' : 'a-fail';
  const overallLabel = failCount === 0 ? '✅ ALL EXTRACTED VALUES PASS' : '❌ ' + failCount + ' VALUE(S) FAIL — See Fault Report';

  const infoRows = [
    data.document_title && `<tr><td style="color:var(--text3);font-size:12px;padding:3px 8px 3px 0;">Document</td><td style="font-family:var(--mono);font-size:12px;">${data.document_title}</td></tr>`,
    data.date && `<tr><td style="color:var(--text3);font-size:12px;padding:3px 8px 3px 0;">Date</td><td style="font-family:var(--mono);font-size:12px;">${data.date}</td></tr>`,
    data.breaker_id && `<tr><td style="color:var(--text3);font-size:12px;padding:3px 8px 3px 0;">Breaker/Bay</td><td style="font-family:var(--mono);font-size:12px;">${data.breaker_id}</td></tr>`,
    data.operator && `<tr><td style="color:var(--text3);font-size:12px;padding:3px 8px 3px 0;">Tester</td><td style="font-family:var(--mono);font-size:12px;">${data.operator}</td></tr>`,
  ].filter(Boolean).join('');

  preview.innerHTML = `
    <div class="alert ${overallCls}" style="margin-bottom:10px;"><div class="alert-title">${overallLabel}</div>${infoRows ? `<table style="margin-top:6px;">${infoRows}</table>` : ''}</div>
    ${cards ? `<div class="ext-val-grid">${cards}</div>` : '<p style="font-size:12px;color:var(--text3);font-family:var(--mono);">No numerical values found.</p>'}
    ${data.unreadable_sections ? `<div class="alert a-warn" style="margin-top:10px;"><div class="alert-title">⚠ Partially Unreadable</div><div class="alert-body">${data.unreadable_sections}</div></div>` : ''}
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="evalResults();showPage('pg-result',document.querySelectorAll('.nav-btn')[4])">→ Generate Full Fault Report</button>
      <button class="btn btn-outline btn-sm" onclick="document.getElementById('pg-input').scrollIntoView({behavior:'smooth'})">✏ Edit Values Below</button>
    </div>
  `;
}

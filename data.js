// ============================================================
//  data.js — ALL BREAKER DATA (EDIT THIS FILE TO FEED MORE DATA)
//  CB Testing Assistant — Multi-Breaker Support
// ============================================================
//
// ⭐ THIS IS THE SINGLE FILE YOU EDIT TO ADD/CHANGE DATA
//
// To add a new breaker model, add a new entry to BREAKER_TYPES
// and a corresponding data block in BREAKER_DATA. The UI
// automatically adapts via the Breaker Type dropdown.
// ============================================================

// ============================================================
//  SECTION 0: BREAKER TYPE DEFINITIONS
//  → Used in: Page 1 (Breaker Type dropdown)
//  → The first entry with `default: true` is pre-selected
// ============================================================
const BREAKER_TYPES = [
  { id: 'cgl_sfm40a',      label: '400kV CGL SFM-40A',        default: true },
  { id: 'siemens_3ap2fi',   label: '400kV Siemens 3AP2FI'                    },
  { id: 'siemens_3ap1fi',   label: '245kV Siemens 3AP1FI'                    },
  { id: 'abb_ltb245e1',     label: '245kV ABB LTB 245E1'                     },
];

// Currently selected breaker type ID (mutable — changed by dropdown)
let ACTIVE_BREAKER_ID = BREAKER_TYPES.find(b => b.default)?.id || BREAKER_TYPES[0].id;

// ============================================================
//  SECTION 1: PER-BREAKER DATA (nameplate, coils, limits)
//  → Each key matches a BREAKER_TYPES[].id
//  → To add a new breaker, duplicate a block and change values
// ============================================================
const BREAKER_DATA = {

  // ────────────────────────────────────────────
  // 400kV CGL SFM-40A (DEFAULT)
  // ────────────────────────────────────────────
  cgl_sfm40a: {
    headerLabel: '400kV · CGL · SFM-40A · 40kA',
    nameplate: [
      { param: 'Model / Type', value: '200-SFM-40A, Class C2 M2', bold: true },
      { param: 'Rated Voltage', value: '420 kV (400kV system)' },
      { param: 'Rated Frequency', value: '50 Hz' },
      { param: 'Rated Normal Current', value: '4000 A / 125A aux' },
      { param: 'Rated Short-Circuit Breaking', value: '40 kA', bold: true },
      { param: 'First Pole to Clear Factor', value: '1.3' },
      { param: 'Rated Opening Voltage', value: '110 V DC', bold: true },
      { param: 'Rated Closing Voltage', value: '110 V DC', bold: true },
      { param: 'SF6 Gas Pressure (20°C)', value: '7.0 bar (abs)', bold: true },
      { param: 'Gas Weight', value: '~30 kg per pole' },
      { param: 'Operating Sequence', value: 'O – 0.3s – CO – 3min – CO', bold: true },
      { param: 'Standard', value: 'IEC 62271-100' },
      { param: 'Customer', value: 'Power Grid Corporation of India Ltd.' },
    ],
    coilRelaySpecs: [
      { designation: '52T1 / 52T2', description: 'Trip Coil 1 & 2 (per phase)', rating: '110V DC, 19Ω' },
      { designation: '52C / 63CLX', description: 'Closing Coil / Closing Contactor', rating: '110V DC, 20Ω' },
      { designation: '63GA / 63GB', description: 'SF6 Low Press Alarm (Stage-1)', rating: '0.05A @ 110V DC, 7.5 kg/cm²' },
      { designation: '63AGX-A/B', description: 'SF6 Lockout (Stage-2)', rating: '0.05A @ 110V DC, 7.0 kg/cm²' },
      { designation: '62CX', description: 'Spring Charged Contactor', rating: '4NO+2NC, 110V DC' },
      { designation: 'M(R/Y/B)', description: 'Spring Charging Motor (3-ph)', rating: '240V AC, 650W' },
      { designation: '52a / 52b', description: 'Aux Switch (R/Y/B phase)', rating: '3-pos, 45°, 110V DC, 10A' },
      { designation: '47TX', description: 'Pole Discrepancy Timer', rating: '110V DC, 0.5–5s' },
      { designation: 'K15V', description: 'Anti-Pumping Relay', rating: '110V DC, 0.5–9s' },
      { designation: 'K3', description: 'Close Command Relay', rating: '110V DC' },
      { designation: 'SW-1 / SW-2', description: 'Local/Remote Changeover', rating: '2-pole 240V AC' },
      { designation: 'R1', description: 'Trip Supervision Resistor', rating: '3.3 kΩ, 35W / 2.7kΩ, 50W' },
    ],
    limits: {
      open: [40, 60],       // Open time min/max in ms
      close: [50, 80],      // Close time min/max in ms
      poleDiff: 3,          // Max pole difference in ms
      cr: 60,               // Contact resistance pass limit (µΩ)
      crWarn: 100,          // Contact resistance reject limit (µΩ)
      tc: [17, 21],         // Trip coil resistance min/max (Ω)
      cc: [18, 22],         // Close coil resistance min/max (Ω)
      ir: 1000,             // Insulation resistance minimum (MΩ)
      sf6Alarm: 7.5,        // SF6 alarm threshold (kg/cm²)
      sf6Lockout: 7.0       // SF6 lockout threshold (kg/cm²)
    },
    testLimitsTable: [
      { test: 'Open Time', min: '40', max: '60', unit: 'ms', action: 'Check TC circuit / SF6' },
      { test: 'Close Time', min: '50', max: '80', unit: 'ms', action: 'Check spring / CC circuit' },
      { test: 'Pole Difference (Open)', min: '—', max: '3', unit: 'ms', action: 'Check individual pole mech' },
      { test: 'Pole Difference (Close)', min: '—', max: '3', unit: 'ms', action: 'Check spring / linkage' },
      { test: 'Contact Resistance (CR)', min: '—', max: '60', unit: 'µΩ', action: 'Clean contacts / overhaul' },
      { test: 'CR — Investigate', min: '60', max: '100', unit: 'µΩ', action: 'Re-test, monitor' },
      { test: 'CR — Reject', min: '>100', max: '—', unit: 'µΩ', action: 'Immediate overhaul' },
      { test: 'Insulation Resistance (IR)', min: '1000', max: '—', unit: 'MΩ', action: 'Check moisture / contacts' },
      { test: 'Trip Coil Resistance', min: '17', max: '21', unit: 'Ω', action: 'Replace TC if out of range' },
      { test: 'Close Coil Resistance', min: '18', max: '22', unit: 'Ω', action: 'Replace CC if out of range' },
      { test: 'SF6 Alarm (63GA/63GB)', min: '—', max: '7.5', unit: 'kg/cm²', action: 'Top up SF6 gas' },
      { test: 'SF6 Lockout (63AGX)', min: '—', max: '7.0', unit: 'kg/cm²', action: 'Emergency — do not operate' },
    ],
  },

  // ────────────────────────────────────────────
  // 400kV Siemens 3AP2FI
  // ────────────────────────────────────────────
  siemens_3ap2fi: {
    headerLabel: '400kV · Siemens · 3AP2FI · 50kA',
    nameplate: [
      { param: 'Model / Type', value: '3AP2FI, Dead-Tank', bold: true },
      { param: 'Rated Voltage', value: '420 kV (400kV system)' },
      { param: 'Rated Frequency', value: '50 Hz' },
      { param: 'Rated Normal Current', value: '4000 A' },
      { param: 'Rated Short-Circuit Breaking', value: '50 kA', bold: true },
      { param: 'First Pole to Clear Factor', value: '1.3' },
      { param: 'Rated Opening Voltage', value: '110 V DC', bold: true },
      { param: 'Rated Closing Voltage', value: '110 V DC', bold: true },
      { param: 'SF6 Gas Pressure (20°C)', value: '6.0 bar (abs)', bold: true },
      { param: 'Gas Weight', value: '~45 kg per pole' },
      { param: 'Operating Sequence', value: 'O – 0.3s – CO – 3min – CO', bold: true },
      { param: 'Drive Type', value: 'Hydraulic Spring (stored energy)' },
      { param: 'Standard', value: 'IEC 62271-100' },
      { param: 'Customer', value: 'Power Grid Corporation of India Ltd.' },
    ],
    coilRelaySpecs: [
      { designation: 'Y1 / Y2', description: 'Trip Coil 1 & 2 (per pole)', rating: '110V DC, 23Ω' },
      { designation: 'Y3', description: 'Closing Coil', rating: '110V DC, 28Ω' },
      { designation: 'S1', description: 'SF6 Density Monitor (Alarm)', rating: '5.7 bar abs @ 20°C' },
      { designation: 'S2', description: 'SF6 Density Monitor (Lockout)', rating: '5.4 bar abs @ 20°C' },
      { designation: 'M1', description: 'Spring Charging Motor', rating: '415V AC, 3-ph, 1.5 kW' },
      { designation: 'S10', description: 'Spring Charged Limit Switch', rating: 'NO contact, 110V DC' },
      { designation: '52a / 52b', description: 'Aux Switch (per pole)', rating: '12NO+12NC, 110V DC' },
      { designation: 'K1', description: 'Anti-Pumping Relay', rating: '110V DC' },
      { designation: 'K2', description: 'Pole Discrepancy Relay', rating: '110V DC, 0.2–5s' },
    ],
    limits: {
      open: [18, 30],
      close: [45, 70],
      poleDiff: 3.3,
      cr: 50,
      crWarn: 80,
      tc: [20, 26],
      cc: [25, 31],
      ir: 1000,
      sf6Alarm: 5.7,
      sf6Lockout: 5.4
    },
    testLimitsTable: [
      { test: 'Open Time', min: '18', max: '30', unit: 'ms', action: 'Check TC circuit / hydraulic' },
      { test: 'Close Time', min: '45', max: '70', unit: 'ms', action: 'Check spring / CC circuit' },
      { test: 'Pole Difference (Open)', min: '—', max: '3.3', unit: 'ms', action: 'Check individual pole mech' },
      { test: 'Pole Difference (Close)', min: '—', max: '3.3', unit: 'ms', action: 'Check spring / linkage' },
      { test: 'Contact Resistance (CR)', min: '—', max: '50', unit: 'µΩ', action: 'Clean contacts / overhaul' },
      { test: 'CR — Investigate', min: '50', max: '80', unit: 'µΩ', action: 'Re-test, monitor' },
      { test: 'CR — Reject', min: '>80', max: '—', unit: 'µΩ', action: 'Immediate overhaul' },
      { test: 'Insulation Resistance (IR)', min: '1000', max: '—', unit: 'MΩ', action: 'Check moisture / contacts' },
      { test: 'Trip Coil Resistance (Y1/Y2)', min: '20', max: '26', unit: 'Ω', action: 'Replace TC if out of range' },
      { test: 'Close Coil Resistance (Y3)', min: '25', max: '31', unit: 'Ω', action: 'Replace CC if out of range' },
      { test: 'SF6 Alarm (S1)', min: '—', max: '5.7', unit: 'bar', action: 'Top up SF6 gas' },
      { test: 'SF6 Lockout (S2)', min: '—', max: '5.4', unit: 'bar', action: 'Emergency — do not operate' },
    ],
  },

  // ────────────────────────────────────────────
  // 245kV Siemens 3AP1FI
  // ────────────────────────────────────────────
  siemens_3ap1fi: {
    headerLabel: '245kV · Siemens · 3AP1FI · 40kA',
    nameplate: [
      { param: 'Model / Type', value: '3AP1FI, Live-Tank', bold: true },
      { param: 'Rated Voltage', value: '245 kV' },
      { param: 'Rated Frequency', value: '50 Hz' },
      { param: 'Rated Normal Current', value: '3150 A' },
      { param: 'Rated Short-Circuit Breaking', value: '40 kA', bold: true },
      { param: 'First Pole to Clear Factor', value: '1.3' },
      { param: 'Rated Opening Voltage', value: '110 V DC', bold: true },
      { param: 'Rated Closing Voltage', value: '110 V DC', bold: true },
      { param: 'SF6 Gas Pressure (20°C)', value: '6.0 bar (abs)', bold: true },
      { param: 'Gas Weight', value: '~12 kg per pole' },
      { param: 'Operating Sequence', value: 'O – 0.3s – CO – 3min – CO', bold: true },
      { param: 'Drive Type', value: 'Spring-operated mechanism' },
      { param: 'Standard', value: 'IEC 62271-100' },
    ],
    coilRelaySpecs: [
      { designation: 'Y1 / Y2', description: 'Trip Coil 1 & 2 (per pole)', rating: '110V DC, 22Ω' },
      { designation: 'Y3', description: 'Closing Coil', rating: '110V DC, 25Ω' },
      { designation: 'S1', description: 'SF6 Density Monitor (Alarm)', rating: '5.6 bar abs @ 20°C' },
      { designation: 'S2', description: 'SF6 Density Monitor (Lockout)', rating: '5.2 bar abs @ 20°C' },
      { designation: 'M1', description: 'Spring Charging Motor', rating: '240V AC, 1-ph, 750W' },
      { designation: 'S10', description: 'Spring Charged Limit Switch', rating: 'NO contact, 110V DC' },
      { designation: '52a / 52b', description: 'Aux Switch (per pole)', rating: '12NO+12NC, 110V DC' },
      { designation: 'K1', description: 'Anti-Pumping Relay', rating: '110V DC' },
      { designation: 'K2', description: 'Pole Discrepancy Relay', rating: '110V DC, 0.5–3s' },
    ],
    limits: {
      open: [20, 35],
      close: [45, 75],
      poleDiff: 3,
      cr: 50,
      crWarn: 80,
      tc: [19, 25],
      cc: [22, 28],
      ir: 1000,
      sf6Alarm: 5.6,
      sf6Lockout: 5.2
    },
    testLimitsTable: [
      { test: 'Open Time', min: '20', max: '35', unit: 'ms', action: 'Check TC circuit / mechanism' },
      { test: 'Close Time', min: '45', max: '75', unit: 'ms', action: 'Check spring / CC circuit' },
      { test: 'Pole Difference (Open)', min: '—', max: '3', unit: 'ms', action: 'Check individual pole mech' },
      { test: 'Pole Difference (Close)', min: '—', max: '3', unit: 'ms', action: 'Check spring / linkage' },
      { test: 'Contact Resistance (CR)', min: '—', max: '50', unit: 'µΩ', action: 'Clean contacts / overhaul' },
      { test: 'CR — Investigate', min: '50', max: '80', unit: 'µΩ', action: 'Re-test, monitor' },
      { test: 'CR — Reject', min: '>80', max: '—', unit: 'µΩ', action: 'Immediate overhaul' },
      { test: 'Insulation Resistance (IR)', min: '1000', max: '—', unit: 'MΩ', action: 'Check moisture / contacts' },
      { test: 'Trip Coil Resistance (Y1/Y2)', min: '19', max: '25', unit: 'Ω', action: 'Replace TC if out of range' },
      { test: 'Close Coil Resistance (Y3)', min: '22', max: '28', unit: 'Ω', action: 'Replace CC if out of range' },
      { test: 'SF6 Alarm (S1)', min: '—', max: '5.6', unit: 'bar', action: 'Top up SF6 gas' },
      { test: 'SF6 Lockout (S2)', min: '—', max: '5.2', unit: 'bar', action: 'Emergency — do not operate' },
    ],
  },

  // ────────────────────────────────────────────
  // 245kV ABB LTB 245E1
  // ────────────────────────────────────────────
  abb_ltb245e1: {
    headerLabel: '245kV · ABB · LTB 245E1 · 40kA',
    nameplate: [
      { param: 'Model / Type', value: 'LTB 245E1, Live-Tank', bold: true },
      { param: 'Rated Voltage', value: '245 kV' },
      { param: 'Rated Frequency', value: '50 Hz' },
      { param: 'Rated Normal Current', value: '3150 A' },
      { param: 'Rated Short-Circuit Breaking', value: '40 kA', bold: true },
      { param: 'First Pole to Clear Factor', value: '1.3' },
      { param: 'Rated Opening Voltage', value: '110 V DC', bold: true },
      { param: 'Rated Closing Voltage', value: '110 V DC', bold: true },
      { param: 'SF6 Gas Pressure (20°C)', value: '6.0 bar (abs)', bold: true },
      { param: 'Gas Weight', value: '~14 kg per pole' },
      { param: 'Operating Sequence', value: 'O – 0.3s – CO – 3min – CO', bold: true },
      { param: 'Drive Type', value: 'BLG Motor-operated spring' },
      { param: 'Standard', value: 'IEC 62271-100' },
    ],
    coilRelaySpecs: [
      { designation: 'Y1 / Y2', description: 'Trip Coil 1 & 2 (per pole)', rating: '110V DC, 20Ω' },
      { designation: 'Y3', description: 'Closing Coil', rating: '110V DC, 22Ω' },
      { designation: 'K37', description: 'SF6 Density Monitor (Alarm)', rating: '5.6 bar abs @ 20°C' },
      { designation: 'K38', description: 'SF6 Density Monitor (Lockout)', rating: '5.3 bar abs @ 20°C' },
      { designation: 'M1', description: 'Spring Charging Motor', rating: '240V AC, 1-ph, 550W' },
      { designation: 'S33', description: 'Spring Charged Limit Switch', rating: 'NO contact, 110V DC' },
      { designation: '52a / 52b', description: 'Aux Switch (per pole)', rating: '10NO+10NC, 110V DC' },
      { designation: 'K10', description: 'Anti-Pumping Relay', rating: '110V DC' },
      { designation: 'K15', description: 'Pole Discrepancy Relay', rating: '110V DC, 0.5–5s' },
    ],
    limits: {
      open: [22, 38],
      close: [50, 80],
      poleDiff: 3,
      cr: 50,
      crWarn: 100,
      tc: [17, 23],
      cc: [19, 25],
      ir: 1000,
      sf6Alarm: 5.6,
      sf6Lockout: 5.3
    },
    testLimitsTable: [
      { test: 'Open Time', min: '22', max: '38', unit: 'ms', action: 'Check TC circuit / mechanism' },
      { test: 'Close Time', min: '50', max: '80', unit: 'ms', action: 'Check spring / CC circuit' },
      { test: 'Pole Difference (Open)', min: '—', max: '3', unit: 'ms', action: 'Check individual pole mech' },
      { test: 'Pole Difference (Close)', min: '—', max: '3', unit: 'ms', action: 'Check spring / linkage' },
      { test: 'Contact Resistance (CR)', min: '—', max: '50', unit: 'µΩ', action: 'Clean contacts / overhaul' },
      { test: 'CR — Investigate', min: '50', max: '100', unit: 'µΩ', action: 'Re-test, monitor' },
      { test: 'CR — Reject', min: '>100', max: '—', unit: 'µΩ', action: 'Immediate overhaul' },
      { test: 'Insulation Resistance (IR)', min: '1000', max: '—', unit: 'MΩ', action: 'Check moisture / contacts' },
      { test: 'Trip Coil Resistance (Y1/Y2)', min: '17', max: '23', unit: 'Ω', action: 'Replace TC if out of range' },
      { test: 'Close Coil Resistance (Y3)', min: '19', max: '25', unit: 'Ω', action: 'Replace CC if out of range' },
      { test: 'SF6 Alarm (K37)', min: '—', max: '5.6', unit: 'bar', action: 'Top up SF6 gas' },
      { test: 'SF6 Lockout (K38)', min: '—', max: '5.3', unit: 'bar', action: 'Emergency — do not operate' },
    ],
  },
};

// ============================================================
//  HELPER FUNCTIONS — backward-compatible accessors
//  Other modules use BREAKER_INFO, COIL_RELAY_SPECS, LIMITS,
//  TEST_LIMITS_TABLE — these getters keep them working.
// ============================================================
function getActiveBreaker()       { return BREAKER_DATA[ACTIVE_BREAKER_ID]; }
function getActiveBreakerLabel()  { return (BREAKER_TYPES.find(b => b.id === ACTIVE_BREAKER_ID) || BREAKER_TYPES[0]).label; }

// Backward-compatible global references (read via getter)
Object.defineProperty(window, 'BREAKER_INFO', { get() { return getActiveBreaker(); }, configurable: true });
Object.defineProperty(window, 'COIL_RELAY_SPECS', { get() { return getActiveBreaker().coilRelaySpecs; }, configurable: true });
Object.defineProperty(window, 'LIMITS', { get() { return getActiveBreaker().limits; }, configurable: true });
Object.defineProperty(window, 'TEST_LIMITS_TABLE', { get() { return getActiveBreaker().testLimitsTable; }, configurable: true });

// ============================================================
//  SECTION 4: SAFETY CHECKLIST ITEMS
//  → Used in: Page 2 (Safety Checklist)
//  → To add more items, add strings to the arrays
// ============================================================
const SAFETY_CHECKS = {
  hvIsolation: {
    title: 'HV ISOLATION & EARTHING',
    icon: '🛡️',
    items: [
      '400 kV breaker isolated — both bus-side and line-side isolators in OPEN position',
      'AC and DC supplies to the isolators must be switched OFF. ',
      'Earth switch closed on bus side (physically confirmed)',
      'Earth switch closed on line side (physically confirmed)',
      'Portable earthing clamps applied at test points (both L and B terminals)',
      'LOTO (Lock-Out Tag-Out) applied — danger tags placed on isolator operating handles',
      'PTW/SFT obtained from RTAMC / Control Room',
    ]
  },
  controlSupply: {
    title: 'CONTROL SUPPLY & MB CHECKS',
    icon: '🔌',
    items: [
      '110V DC supply measured at TBI-13(+) and TBI-14(−) with tong tester — confirmed present',
      '110V DC Main-I and Main-II verified at MB (both bus bars live)',
      'SF6 gas density gauge read — confirmed above 7.5 kg/cm² (no alarm active)',
      'Spring fully charged — 62CX indicator showing CHARGED before starting',
      'MB door opened with care — all wiring visually inspected, no loose terminals',
      '240V AC heater supply verified at TBI-1/TBI-2 — motor and heater supply live',
      'All personnel briefed — test team minimum 2 persons; non-essential staff clear of HV zone',
      'Auto-reclose disabled at relay panel (if applicable)',
    ]
  }
};

// ============================================================
//  SECTION 5: TESTING GUIDE DATA
//  → Used in: Page 3 (Step-by-Step Testing Guide)
//  → Each guide has steps[] and optionally faults[]
//  → To add a new test type, add a new key to this object
// ============================================================
const TESTING_GUIDES = {
  timing: {
    id: 'g-timing',
    label: '⏱ Timing Test',
    cardTitle: 'TIMING TEST — CGL SFM-40S (110V DC Coils)',
    cardIcon: '⏱',
    steps: [
      {
        title: 'Confirm Safety & Breaker Position',
        body: 'Breaker must be OPEN. Verify spring is charged (62CX contact closed). Check 110V DC is available at MB.<br><span class="term">TBI-13 (+ve DC)</span> <span class="term">TBI-14 (−ve DC)</span> — measure with multimeter.'
      },
      {
        title: 'Connect Timing Analyser — Aux Contacts (52a/52b)',
        body: 'Connect analyser across 52a (NC) contacts per phase:<br><span class="term">CH-1: TB3 R-phase 52a (R11/R12)</span><br><span class="term">CH-2: TB3-41 Y-phase 52a (Y11/Y12)</span><br><span class="term">CH-3: TC4-26 B-phase 52a (B11/B12)</span><br>Confirm correct channel labels in analyser. Polarity: terminal wired to 110V DC bus = positive.',
        caution: 'Confirm 52a contacts are NC when breaker is OPEN. 52b contacts are NC when breaker is CLOSED. Do not confuse.'
      },
      {
        title: 'Connect Coil Current Probes',
        body: 'Clamp CT on coil supply wires inside MB:<br><span class="term-r">CH-4: TC1 supply wire (from TBI-42 area)</span><br><span class="term-r">CH-5: TC2 supply wire (from TBI-61 area)</span><br><span class="term-g">CH-6: CC supply wire (63CLX coil)</span><br>TC nominal current = 110V ÷ 19Ω ≈ <strong>5.8A DC</strong><br>CC nominal current = 110V ÷ 20Ω ≈ <strong>5.5A DC</strong>'
      },
      {
        title: 'Set Trigger — DC Voltage on TC1 Supply',
        body: 'Set trigger source to DC voltage channel. Set threshold at 50V DC (≈half of 110V DC supply). Pre-trigger: 20ms. Record duration: 200ms for OPEN, 500ms for CLOSE.'
      },
      {
        title: 'OPEN Operation — Trip from Local Panel',
        body: 'Use local test push-button (3PT) inside MB. Call out <em>"TRIPPING"</em> before operating. Analyser captures:<br>• Open time per phase (R/Y/B)<br>• TC1 & TC2 current waveform<br>• Pole-wise timing from aux contact transition',
        caution: 'Use local PB (3PT), NOT remote relay panel trip during maintenance. 3PT is located inside MB.'
      },
      {
        title: 'CLOSE Operation — Close from Local Panel',
        body: 'Wait for spring to recharge (motor M1/M2/M3 runs — listen for motor run sound, or watch 62CX LED). Typical recharge time: 10–20 seconds.<br>Close using local close PB. Record:<br>• Close time per phase<br>• CC current waveform<br>• Spring recharge time after operation',
        caution: 'Never close before spring is fully charged. 62CX contact must be confirmed CLOSED.'
      },
      {
        title: 'Calculate & Record Pole Difference',
        body: 'Pole diff = Max(R,Y,B) − Min(R,Y,B)<br><strong>OPEN pole diff must be &lt; 3ms</strong><br><strong>CLOSE pole diff must be &lt; 3ms</strong><br>Enter values in Module 04 for automatic PASS/FAIL and fault tracing.'
      }
    ],
    limitsTable: [
      { operation: 'OPEN', min: '40', max: '60', poleDiff: '< 3ms' },
      { operation: 'CLOSE', min: '50', max: '80', poleDiff: '< 3ms' },
      { operation: 'O–CO Interval', min: 'Min 0.3 sec dead time', max: '', poleDiff: '—' }
    ],
    coilInfo: {
      title: 'Coil Current Interpretation',
      body: '<strong>Normal TC pick-up:</strong> ~5.8A, duration 40–60ms<br><strong>Low current (<4A):</strong> High resistance in TC circuit — check supervision resistor R1 wiring<br><strong>No current:</strong> TC circuit open — check TBI-42/55/61/62 links<br><strong>Prolonged current:</strong> Contacts not making — mechanical issue'
    },
    faults: [
      {
        title: 'Slow Open Time (>60ms)',
        type: 'warn',
        causes: ['Dried lubricant in mechanism', 'Low 110V DC (check at TBI-13)', 'Dashpot sluggish', 'TC plunger friction', 'Low SF6 density'],
        actions: ['Lubricate mechanism per OEM manual', 'Check DC bus at MB, should be 110V±10%', 'Check/replace dashpot', 'Clean TC plunger & core', 'Check 63GA/63GB relay'],
        circuit: '<span class="tb">TBI-13(+)</span> <span class="arrow">→</span> <span class="relay">TBI-42</span> <span class="arrow">→</span> <span class="relay">K23R</span> <span class="arrow">→</span> <span class="relay">63AGX-A-2</span> <span class="arrow">→</span> <span class="relay">K29R</span> <span class="arrow">→</span> <span class="relay">52T1(R)</span> <span class="arrow">→</span> <span class="tb">TBI-22(−)</span>'
      },
      {
        title: 'Slow Close Time (>80ms)',
        type: 'warn',
        causes: ['Spring partially charged', 'Mechanical friction in close linkage', 'Low CC voltage', '63CLX contactor sluggish'],
        actions: ['Wait full recharge; check motor M1/M2/M3', 'Lubricate closing cam & roller', 'Check 110V at CC terminals', 'Check 63CLX coil resistance (should be 20Ω)'],
        circuit: '<span class="tb">TBI-13(+)</span> <span class="arrow">→</span> <span class="relay">K5</span> <span class="arrow">→</span> <span class="relay">62CX(spring chgd)</span> <span class="arrow">→</span> <span class="relay">K15V(AP)</span> <span class="arrow">→</span> <span class="relay">63CLX</span> <span class="arrow">→</span> <span class="relay">52C(CC)</span> <span class="arrow">→</span> <span class="tb">TBI-14(−)</span>'
      },
      {
        title: 'High Pole Difference (>3ms)',
        type: 'fail',
        causes: ['One pole mechanism misaligned', 'Unequal linkage wear', 'Different SF6 levels per interrupter', 'Aux contact 52a maladjusted (one phase)'],
        actions: ['Identify slow pole from analyser trace', 'Inspect & adjust individual pole linkage', 'Check SF6 per interrupter', 'Adjust 52a contact cam for that phase'],
        circuit: ''
      }
    ]
  },
  cr: {
    id: 'g-cr',
    label: 'Ω Contact Resistance',
    cardTitle: 'CONTACT RESISTANCE TEST — DLRO 100A Method',
    cardIcon: 'Ω',
    steps: [
      { title: 'Breaker in CLOSED Position', body: 'Ensure breaker is CLOSED and earthed at both terminals. Remove timing analyser if connected.' },
      { title: 'Connect DLRO — 4-Wire Kelvin', body: 'Outer (current) leads: <span class="term">I+ → Line-end bushing</span> <span class="term">I− → Bus-end bushing</span><br>Inner (voltage) leads as close to interrupter contact as accessible.', caution: 'Inject in normal load flow direction. Confirm earthing is NOT removed during CR test.' },
      { title: 'Inject 100A DC — Wait for Stabilisation', body: 'Apply 100A. Wait 15 seconds for thermal stabilisation. Take average of 3 readings. Test each phase (R, Y, B) separately.' },
      { title: 'Record & Compare', body: 'CR limit for 400kV CGL: <strong>&lt;60 µΩ PASS, 60–100 µΩ INVESTIGATE, &gt;100 µΩ REJECT</strong>' }
    ],
    faults: [
      {
        title: 'CR 60–100 µΩ (Investigate)',
        type: 'fail',
        causes: ['Surface oxide / carbon deposit on contacts', 'Contact misalignment (slight)', 'Reduced contact spring pressure'],
        actions: ['Clean with dry N₂ purge + lint-free cloth', 'Re-test after 5 operations (self-wiping)', 'Check contact spring per OEM manual'],
        circuit: ''
      },
      {
        title: 'CR >100 µΩ (Reject)',
        type: 'fail',
        causes: ['Severe arc erosion of main contacts', 'Contact finger assembly worn', 'Moisture/contamination in interrupter', 'Wrong DLRO connection (test error)'],
        actions: ['Verify DLRO connection — re-test first', 'Arrange OEM overhaul — contact replacement', 'Drain & analyse SF6 gas (dew point test)', 'Check SF6 purity >97%, dew pt <−40°C'],
        circuit: ''
      }
    ]
  },
  ir: {
    id: 'g-ir',
    label: '🔬 Insulation Resistance',
    cardTitle: 'INSULATION RESISTANCE TEST — 5kV Megger',
    cardIcon: '🔬',
    steps: [
      { title: 'Breaker in OPEN Position', body: 'Earth one side. Apply Megger HV lead to other terminal. Earth terminal is at ground potential.', caution: 'Use 5kV DC Megger for 400kV breaker. 2.5kV only for secondary wiring and CT/PT circuits.' },
      { title: 'Apply for 1 Minute', body: 'Record IR at 15s (R₁₅) and 60s (R₆₀). Calculate Polarisation Index: PI = R₆₀ ÷ R₁₅.<br>PI > 1.5 = Healthy insulation<br>PI < 1.25 = Investigate moisture' },
      { title: 'Discharge & Record', body: 'Short circuit HV terminal for at least 4× test duration (4 min) before touching. Record per phase.' }
    ],
    irLimitsTable: [
      { value: '> 5000 MΩ', status: 'EXCELLENT', statusClass: 'pass', action: 'No action' },
      { value: '1000–5000 MΩ', status: 'PASS', statusClass: 'pass', action: 'Record & monitor' },
      { value: '500–1000 MΩ', status: 'MARGINAL', statusClass: 'amber', action: 'Investigate' },
      { value: '< 500 MΩ', status: 'FAIL', statusClass: 'fail', action: 'Check moisture / SF6' },
      { value: '< 100 MΩ', status: 'REJECT', statusClass: 'fail', action: 'Do not energise' }
    ],
    lowIRAction: 'If IR < 500 MΩ: Check SF6 dew point. Check for moisture ingress at flange seals. Dry out with warm dry N₂ before re-test. Do NOT energise.',
    faults: []
  },
  sf6: {
    id: 'g-sf6',
    label: '💨 SF6 Gas Check',
    cardTitle: 'SF6 GAS CHECK — 63GA / 63GB / 63AGX',
    cardIcon: '💨',
    steps: [
      { title: 'Read Density Monitor Gauge', body: 'Rated pressure = <strong>8 kg/cm² abs at 20°C</strong>. Gauge is temperature-compensated (density monitor, not simple pressure gauge).<br>• Alarm (63GA/B): 7.5 kg/cm²<br>• Lockout (63AGX): 7.0 kg/cm²' },
      { title: 'Verify 63GA / 63GB Alarm Contact', body: '63GA = R-phase, 63GB = Y-phase, 63GC = B-phase (or combined). These are NC contacts to MB.<br>Check at: <span class="term">TB2-15 to TB2-18 (63GA-A/R)</span> <span class="term">TB2-19 to TB2-24 (63GA-B)</span>' },
      { title: 'Verify 63AGX Lockout Contact', body: '63AGX-A and 63AGX-B are NC contacts in the trip circuit. If SF6 drops to lockout level, these contacts OPEN → break trip circuit → breaker cannot be tripped remotely.<br>Verify at: <span class="term">TB2-41 to TB2-44</span> (63AGX-A-5 area)', caution: '63AGX open = breaker will NOT trip. CRITICAL for protection. Top up gas immediately.' },
      { title: 'Leak Detection', body: 'Use SF6 electronic leak detector (sensitivity 1 ppm) around all flange joints, density monitor connections, and pressure relief device. Mark any leak location.', caution: 'SF6 is 23,500× GWP of CO₂. Record all leaks in Environmental Register. Use gas recovery equipment.' }
    ],
    faults: [
      {
        title: '63GA/63GB Alarm Active (Stage-1)',
        type: 'warn',
        causes: ['Slow gas leak from flange seals', 'Density relay set-point drift', 'Low ambient temperature (seasonal)'],
        actions: ['Locate leak with detector (all flanges)', 'Top-up SF6 to 8 kg/cm²', 'Check density relay calibration', 'Log leak rate (compare monthly readings)'],
        circuit: '63GA-A(R): <span class="tb">TB2-15 (LR)</span> <span class="arrow">↔</span> <span class="tb">TB2-16 (LR)</span><br>63GA-A(Y): <span class="tb">TB2-19 (LY)</span> <span class="arrow">↔</span> <span class="tb">TB2-20 (LY)</span><br>63GA-A(B): <span class="tb">TB2-23 (LB)</span> <span class="arrow">↔</span> <span class="tb">TB2-24 (LB)</span>'
      },
      {
        title: '63AGX Lockout Active (Stage-2)',
        type: 'fail',
        causes: ['Major SF6 leak (sudden or slow)', 'Gas refill not done after Stage-1 alarm', 'Cracked interrupter chamber'],
        actions: ['IMMEDIATE: Inform control room', 'Do NOT trip or close breaker', 'Isolate bay, take outage', 'Emergency SF6 top-up (if safe)', 'Locate and repair leak before re-energising'],
        circuit: '<span class="tb">TBI-42(TC1 supply)</span> <span class="arrow">→</span> <span class="relay">K23R</span> <span class="arrow">→</span> <span class="relay">63AGX-A-2(NC)</span> <span class="arrow">→</span> <span class="relay">52T1(R-ph)</span><br><span class="arrow">↑ If 63AGX OPEN → Trip circuit broken → Breaker will NOT trip ↑</span>'
      }
    ]
  },
  coil: {
    id: 'g-coil',
    label: '🔧 Coil Resistance',
    cardTitle: 'COIL RESISTANCE CHECK — Trip & Close Coils',
    cardIcon: '🔧',
    steps: [
      { title: 'Isolate DC Supply First', body: 'Remove DC supply links at TBI-13/14 before measuring coil resistance to avoid false reading from live supply.', caution: 'NEVER measure resistance on live circuit. Remove link first.' },
      { title: 'Measure TC1 (52T1) per Phase', body: 'Using low-resistance ohmmeter or multimeter at TC1 terminals:<br>TC1 R-phase: at <span class="term">TBI-42 / TBI-43</span><br>TC1 Y-phase: at <span class="term">TBI-45 / TBI-46</span><br>TC1 B-phase: at <span class="term">TBI-47 / TBI-48</span><br><strong>Expected: 17–21 Ω (nominal 19Ω)</strong>' },
      { title: 'Measure TC2 (52T2) per Phase', body: 'TC2 R-phase: at <span class="term">TBI-61 / TBI-62</span><br>TC2 Y-phase: at <span class="term">TBI-63 / TBI-64</span><br>TC2 B-phase: at <span class="term">TBI-65 / TBI-77</span><br><strong>Expected: 17–21 Ω (nominal 19Ω)</strong>' },
      { title: 'Measure Close Coil (52C / 63CLX)', body: 'At closing contactor (63CLX) terminals inside MB.<br><strong>Expected: 18–22 Ω (nominal 20Ω)</strong>' }
    ],
    outOfRangeInfo: '<strong>Low (<15Ω):</strong> Shorted turns — replace coil<br><strong>High (>25Ω):</strong> Broken strands or poor connection — check terminal tightness first<br><strong>∞ (Open):</strong> Coil wire broken — replace immediately<br><strong>Tip:</strong> If one phase TC is open, breaker will trip only on 2 poles — pole discrepancy relay (47TX) will activate.',
    supervisionInfo: 'R1 (3.3kΩ / 35W) is in series with TC1 for continuous supervision. At MB, check <span class="term">TBI-42</span> to <span class="term">TBI-43</span>. If R1 open: TC supervision alarm appears but breaker still trips (R1 bypassed on trip).',
    faults: []
  },
  pd: {
    id: 'g-pd',
    label: '⚡ Pole Discrepancy',
    cardTitle: 'POLE DISCREPANCY TEST — 47TX Timer',
    cardIcon: '⚡',
    steps: [
      { title: 'Understand the Circuit', body: '47TX timer relay monitors pole position mismatch via 52a contacts.<br>If any pole differs in position for >0.5s (set time), 47TX operates → issues trip to all poles.<br>Timer at: <span class="term">TB2-33 / TB2-34</span> — <span class="term">47T</span> relay area' },
      { title: 'Simulate Pole Discrepancy', body: 'With breaker in service (or test): manually open one phase 52a contact link at TB3 to simulate single-phase open condition. 47TX should pick up and issue 3-phase trip via K81 relay.', caution: 'Only simulate during maintenance outage. Coordinate with protection engineer.' },
      { title: 'Verify Timer Setting', body: 'Set time should be 0.5–2 sec (as per protection requirement). Confirm at relay. Check at <span class="term">TB2-33</span>: L1 terminal of 47TX timer relay. Pickup time is adjustable — refer site protection document.' }
    ],
    poleDiscAlarm: 'If 47TX trips during timing test: One phase did not operate (or was delayed >0.5s beyond others). Identify the lagging phase from analyser trace, then:<br>1. Check 52a contact timing for that phase<br>2. Check TC coil resistance for that phase<br>3. Check linkage/mechanism for that phase<br>Pole discrepancy relay output goes to: <span class="term">K81</span> → 3-phase trip coil command',
    faults: []
  },
  ap: {
    id: 'g-ap',
    label: '🔒 Anti-Pumping',
    cardTitle: 'ANTI-PUMPING TEST — K15V Relay',
    cardIcon: '🔒',
    steps: [
      { title: 'Confirm Circuit', body: 'Anti-pumping relay K15V is in closing circuit. After 1st close, if close command remains sustained and breaker trips, K15V prevents re-close.<br>K15V coil at: <span class="term">TBI-16 area</span> → K15V NC contact in closing circuit' },
      { title: 'Test Procedure', body: '1. Apply and <em>sustain</em> close command (hold local close PB)<br>2. Breaker closes — note it<br>3. Apply trip while holding close PB<br>4. Breaker opens<br>5. <strong>Breaker must NOT re-close</strong> — K15V is working<br>6. Release close PB — K15V resets', caution: 'Need two persons: one holds close PB, one operates trip PB. Use local test PBs only.' }
    ],
    failureInfo: 'If breaker re-closes (pumps): K15V relay has failed to latch.<br>Check: K15V coil continuity at <span class="term">TBI-16</span>. K15V NC contact must open after first close and stay open while close command is applied.<br>Replace K15V relay if coil or contact is faulty.<br>Do NOT put breaker into service with faulty anti-pumping — risk of repeated close on fault.',
    faults: []
  }
};

// ============================================================
//  SECTION 6: TEST TYPE LABELS (for PDF upload)
//  → Used in: Page 4 (PDF Upload)
// ============================================================
const TEST_TYPE_LABELS = {
  timing_open:        'Timing Test — OPEN Operation',
  timing_close:       'Timing Test — CLOSE Operation',
  timing_both:        'Timing Test — OPEN + CLOSE',
  contact_resistance: 'Contact Resistance Test (DLRO)',
  insulation_resistance: 'Insulation Resistance Test (Megger)',
  coil_resistance:    'Coil Resistance Test (TC1/TC2/CC)',
  sf6_gas:            'SF6 Gas Pressure Check',
  pole_discrepancy:   'Pole Discrepancy (47TX) Test',
  full_report:        'Full Test Report (All Tests)',
};

// ============================================================
//  SECTION 7: TEST TYPE PICKER OPTIONS (for Page 4 UI)
//  → Used in: Page 4 (Enter Results — test type selector)
//  → To add a new test type, add an object here
// ============================================================
const TEST_TYPE_OPTIONS = [
  { value: 'timing_open', icon: '⏱', label: 'Timing<br><strong>OPEN</strong>' },
  { value: 'timing_close', icon: '⏱', label: 'Timing<br><strong>CLOSE</strong>' },
  { value: 'timing_both', icon: '⏱⏱', label: 'Timing<br><strong>O + C</strong>' },
  { value: 'contact_resistance', icon: 'Ω', label: 'Contact<br><strong>Resistance</strong>' },
  { value: 'insulation_resistance', icon: '🔬', label: 'Insulation<br><strong>Resistance</strong>' },
  { value: 'coil_resistance', icon: '🔧', label: 'Coil<br><strong>Resistance</strong>' },
  { value: 'full_report', icon: '📋', label: 'Full<br><strong>All Tests</strong>', checked: true },
  { value: 'sf6_gas', icon: '💨', label: 'SF6<br><strong>Gas Check</strong>' },
  { value: 'pole_discrepancy', icon: '⚡', label: 'Pole<br><strong>Discrepancy</strong>' },
];

// ============================================================
//  SECTION 8: TERMINAL BLOCK DATA
//  → Used in: Page 6 (Connections & TB Layout)
//  → To add more terminals, add objects to the array
// ============================================================
const TB_DATA = [
  { n: 'TBI-1', r: 'H1(Ph-P)', d: 'Motor 240V AC (P)' },
  { n: 'TBI-2', r: 'H1(Ph-N)', d: 'Motor 240V AC (N)' },
  { n: 'TBI-3', r: 'TBI-3', d: 'Heater supply (B)' },
  { n: 'TBI-4', r: 'TBI-4', d: 'Heater supply (N)' },
  { n: 'TBI-13', r: '110V DC+', d: 'DC Main-I Positive' },
  { n: 'TBI-14', r: '110V DC−', d: 'DC Main-I Negative' },
  { n: 'TBI-21', r: '110V DC+II', d: 'DC Main-II Positive' },
  { n: 'TBI-22', r: 'DC Return', d: 'DC Return / Negative' },
  { n: 'TBI-1/2', r: 'Remote Close', d: 'Close command input' },
  { n: 'TBI-42', r: 'TC1-R', d: 'Trip Coil-1 R-phase cmd' },
  { n: 'TBI-45', r: 'TC1-Y', d: 'Trip Coil-1 Y-phase cmd' },
  { n: 'TBI-47', r: 'TC1-B', d: 'Trip Coil-1 B-phase cmd' },
  { n: 'TBI-55', r: 'TC1-R alt', d: 'TC1 R-phase 2nd path' },
  { n: 'TBI-57', r: 'TC1-Y alt', d: 'TC1 Y-phase 2nd path' },
  { n: 'TBI-61', r: 'TC2-R', d: 'Trip Coil-2 R-phase cmd' },
  { n: 'TBI-62', r: 'TC2-Y', d: 'Trip Coil-2 Y-phase cmd' },
  { n: 'TBI-63', r: 'TC2-B', d: 'Trip Coil-2 B-phase cmd' },
  { n: 'TBI-77', r: 'TC2 Ret', d: 'TC2 common return' },
  { n: 'TB2-15/16', r: '63GA-A(R)', d: 'SF6 Low Alarm R-ph NC' },
  { n: 'TB2-19/20', r: '63GA-A(Y)', d: 'SF6 Low Alarm Y-ph NC' },
  { n: 'TB2-23/24', r: '63GA-A(B)', d: 'SF6 Low Alarm B-ph NC' },
  { n: 'TB2-41/42', r: '63AGX-A-5', d: 'SF6 Lockout alarm NC' },
  { n: 'TB2-43/44', r: '63AGX-B-4', d: 'SF6 Lockout alt NC' },
  { n: 'TB2-33', r: '47TX-L1', d: 'Pole Discrepancy Timer' },
  { n: 'TB3-R11', r: '52a-R', d: 'Aux SW R-ph open ind.' },
  { n: 'TB3-Y11', r: '52a-Y', d: 'Aux SW Y-ph open ind.' },
  { n: 'TC4-B11', r: '52a-B', d: 'Aux SW B-ph open ind.' },
  { n: 'DCC-1', r: 'DCC-1', d: 'DC Changeover TC1' },
  { n: 'DCC-3', r: 'DCC-3', d: 'DC Changeover TC2' },
  { n: 'DCC-A', r: 'DCC-A', d: 'DC Bus changeover' },
];

// ============================================================
//  SECTION 9: ALARM SIMULATION DATA
//  → Used in: Page 6 (Alarm Simulation)
//  → To add a new alarm type, add a new key to this object
// ============================================================
const ALARM_DATA = {
  sf6low: {
    title: 'SF6 Low Pressure Alarm (63GA Stage-1)',
    terminals: 'TB2-15 / TB2-16 (R-phase), TB2-19/20 (Y-ph), TB2-23/24 (B-ph)',
    steps: ['Inform Control Room / DCC operator', 'Measure voltage at TB2-15 and TB2-16 with tong-tester (should be near 0V — NC contact closed normally)', 'Remove test link between TB2-15 and TB2-16 to open NC contact', 'Verify Low Gas Alarm appears at relay panel and SCADA', 'Note response time at SCADA (for functional check)', 'Re-insert link within 30 seconds', 'Verify alarm clears at panel and SCADA', 'Repeat for Y-phase (TB2-19/20) and B-phase (TB2-23/24)', 'Document in Testing Register'],
    caution: 'Do NOT remove 63AGX (Lockout) links — those are in the TC circuit. Only remove 63GA links.'
  },
  sf6lko: {
    title: 'SF6 Lockout (63AGX Stage-2)',
    terminals: 'TB2-41/42 (alarm output). NEVER touch 63AGX-A-2 or 63AGX-B in TC circuit.',
    steps: ['Inform Control Room. Disable auto-reclose at protection panel', 'Check that breaker is in OPEN position', 'Remove link at TB2-41 (63AGX-A-5 alarm circuit ONLY)', 'Verify lockout alarm at relay panel and SCADA', 'Test that close command is blocked: press local close PB — breaker must NOT close', 'Re-insert link at TB2-41 within 30 seconds', 'Reset lockout relay manually at panel', 'Verify alarm clears and close function restored'],
    caution: 'CRITICAL: Never remove 63AGX-A-2 contact (this is in TC1 trip circuit). Lockout relay blocks closing only — if removed from TC circuit, trip is lost.'
  },
  tc1: {
    title: 'Trip Coil-1 Supervision Fail',
    terminals: 'TBI-42 (R-ph TC1 supply area). R1 supervision resistor in circuit.',
    steps: ['⚠ Only perform when breaker is in maintenance/isolated state', 'Inform Control Room', 'Identify TC1 supply link at TBI-42 area (R-phase)', 'Remove the test link to break TC1 supervision current path', 'Verify TC1 Fail alarm at relay panel and SCADA', 'Re-insert link immediately after alarm confirmed', 'Reset alarm at relay panel', 'Repeat for Y-phase (TBI-45) and B-phase (TBI-47)'],
    caution: 'NEVER simulate TC1 fail on a standby or in-service breaker. Loss of protection during simulation.'
  },
  tc2: {
    title: 'Trip Coil-2 Supervision Fail',
    terminals: 'TBI-61 (R-ph TC2), TBI-62 (Y-ph), TBI-63 (B-ph)',
    steps: ['⚠ Breaker must be in maintenance outage state', 'Inform Control Room', 'Remove link at TBI-61 (TC2 R-phase)', 'Verify TC2 Fail alarm at relay panel and SCADA', 'Re-insert link and reset alarm', 'Repeat per phase as needed'],
    caution: 'TC2 fail in service means backup protection is lost. Never simulate in-service.'
  },
  spring: {
    title: 'Spring Not Charged Alarm (62CX)',
    terminals: '62CX contact in closing circuit. Spring charged signal at MB.',
    steps: ['Ensure spring motor supply (240V AC) is isolated at MCB/fuse', '62CX NO contact opens (spring not charged)', 'Spring Not Charged alarm should appear at panel', 'Alternatively: manually discharge spring using mechanism release if OEM permits', 'Verify alarm at SCADA', 'Restore 240V motor supply', 'Wait for spring to recharge (10–20 seconds typical)', 'Verify alarm clears when 62CX closes (spring charged)'],
    caution: 'Do not operate (close) breaker when spring is not charged. 62CX NC contact blocks close circuit.'
  },
  pd: {
    title: 'Pole Discrepancy (47TX) Test',
    terminals: 'TB2-33 (47TX timer), K81 relay output',
    steps: ['Breaker must be in open state, all poles open', 'At TB3 (aux switch block), manually disconnect one phase 52a contact link (e.g. R11/R12)', '47TX timer starts counting (set: 0.5–2s)', 'After timer expiry, K81 issues 3-phase trip command', 'Verify pole discrepancy alarm and trip event at SCADA', 'Re-connect aux contact link at TB3-R11', 'Reset 47TX relay', 'Verify breaker can be closed normally after reset'],
    caution: 'Confirm timer setting matches site protection document before test.'
  },
  ap: {
    title: 'Anti-Pumping (K15V) Test',
    terminals: 'K15V relay coil in closing circuit. TBI-16 area.',
    steps: ['One person holds local close PB (sustained — do not release)', 'Breaker closes — observe', 'Second person immediately applies trip (local trip PB)', 'Breaker opens', 'With close PB still held: breaker must NOT re-close (K15V latched)', 'Verify K15V has operated (indicator or multimeter on K15V coil)', 'Release close PB — K15V resets', 'Verify breaker can now be closed normally'],
    caution: 'Two-person operation mandatory. One on close PB, one on trip PB. Use local test PBs only — not remote from relay panel.'
  },
  cf: {
    title: 'Close Failure Simulation',
    terminals: '63CLX closing contactor supply circuit.',
    steps: ['Ensure breaker is in OPEN position', 'Remove close coil (52C) supply link at 63CLX input terminal', 'Apply close command via local PB', 'Breaker does not close — close failure alarm should appear', 'Verify Close Fail alarm at relay panel', 'Re-insert link at 63CLX', 'Verify closing restored by test close operation'],
    caution: 'Close failure alarm depends on position relay (52a contact) — ensure aux contacts are correctly wired.'
  }
};

// ============================================================
//  SECTION 10: QUICK REFERENCE TROUBLESHOOTING
//  → Used in: Page 7 (Chat sidebar)
//  → To add more quick fixes, add objects to the array
// ============================================================
const QUICK_REF = [
  { title: 'Breaker not tripping (TC1)', icon: '🔴', fix: '1. Check 110V DC at TBI-13(+)/TBI-14(−)\n2. Check trip cmd at TBI-42 (R-ph)\n3. Verify 63AGX-A-2 NC is CLOSED (SF6 OK?)\n4. Measure TC1 resistance (should be 17–21Ω)\n5. Check 52a contacts are NC when CB open' },
  { title: 'Breaker not closing', icon: '🟢', fix: '1. Spring charged? Check 62CX indicator\n2. DC at TBI-13? Measure voltage\n3. Close cmd reaching K3? Check TBI-1/2\n4. K15V stuck? Reset anti-pumping relay\n5. CC coil resistance = 20Ω?\n6. 63AGX lockout active? Check SF6 pressure' },
  { title: 'High contact resistance', icon: 'Ω', fix: '1. Confirm DLRO 4-wire connection is correct\n2. Re-test after 5 operations (self-wiping)\n3. Clean with dry N₂ purge + lint cloth\n4. Check SF6 dew point (<−40°C)\n5. If >100µΩ: arrange OEM overhaul' },
  { title: 'SF6 alarm (63GA active)', icon: '💨', fix: '1. Check density gauge reading (below 7.5 kg/cm²?)\n2. Use SF6 leak detector at all flanges\n3. Check density relay calibration\n4. Top-up SF6 after locating leak\n5. Log gas leak rate in register' },
  { title: 'Position mismatch (SCADA)', icon: '🚦', fix: '1. Check 52a/52b contact position physically vs SCADA\n2. Adjust 52a cam for correct contact angle\n3. Trace TB3 wiring (R11/Y11/B11 area)\n4. Check RTU/SCADA point mapping\n5. Tighten all terminal screws in TB3' },
  { title: '47TX pole discrepancy trip', icon: '⚡', fix: '1. Identify lagging phase from timing analyser\n2. Check 52a contact of that phase\n3. Check TC coil of that phase\n4. Check linkage/mechanism of that phase\n5. Adjust 47TX timer if set too tight' },
];

// ============================================================
//  SECTION 11: CONNECTION CIRCUIT DATA
//  → Used in: Page 6 (Trip/Close/SF6 circuit pages)
//  → To add/modify circuit tables, edit these arrays
// ============================================================
const CIRCUIT_DATA = {
  tc1: {
    title: 'TRIP CIRCUIT 1 (TC1 / 52T1) — From Drawing Pg.1',
    icon: '🔴',
    circuitPath: '<span class="term">110V DC Main-I (+)</span> → <span class="term">TBI-13</span> → <span class="term">TBI-22</span> → Remote Trip Relay Contact → <span class="term">TBI-42</span> → <span class="relay">K23R</span> (Trip relay R-ph) → <span class="relay">63AGX-A-2</span> (SF6 lockout NC) → <span class="relay">K29R</span> → <span class="term">52T1 (R-ph TC1)</span> → <span class="term">TBI-22</span> → <span class="term">110V DC (−)</span>',
    terminals: [
      { terminal: 'TBI-13', relay: '110V DC Main-I (+)', func: 'DC supply positive bus', state: '110V live' },
      { terminal: 'TBI-14', relay: '110V DC Main-I (−)', func: 'DC supply negative bus', state: '0V reference' },
      { terminal: 'TBI-42', relay: 'Remote Trip R-ph Input', func: 'From protection relay', state: 'Open (no trip)' },
      { terminal: 'TBI-43', relay: 'K23R coil +', func: 'Trip relay R-phase', state: 'De-energised' },
      { terminal: 'TBI-45', relay: 'Remote Trip Y-ph Input', func: 'From protection relay', state: 'Open' },
      { terminal: 'TBI-46', relay: 'K23Y coil +', func: 'Trip relay Y-phase', state: 'De-energised' },
      { terminal: 'TBI-47', relay: 'Remote Trip B-ph Input', func: 'From protection relay', state: 'Open' },
      { terminal: 'TBI-48', relay: 'K23B coil +', func: 'Trip relay B-phase', state: 'De-energised' },
      { terminal: '63AGX-A-2', relay: 'SF6 Lockout NC', func: 'Opens on SF6 lockout', state: 'CLOSED (normal)' },
      { terminal: '52T1 (R/Y/B)', relay: 'Trip Coil 1', func: '19Ω, 110V DC', state: 'De-energised' },
      { terminal: 'TBI-55/56/57', relay: 'Remote Trip TC1 alt', func: 'Second remote trip path', state: 'Open' },
    ],
    troubleshoot: '1. Check 110V DC at TBI-13 (+) to TBI-14 (−)\n2. Check trip command arrival at TBI-42 (K23R)\n3. Check 63AGX-A-2 NC contact is CLOSED (SF6 OK?)\n4. Measure TC1 resistance (should be 17–21Ω)\n5. Check supervision resistor R1 (3.3kΩ at TBI area)'
  },
  tc2: {
    title: 'TRIP CIRCUIT 2 (TC2 / 52T2) — From Drawing Pg.1',
    icon: '🔴',
    circuitPath: '<span class="term">110V DC Main-II (+)</span> → <span class="term">TBI-21</span> → Remote Trip → <span class="term">TBI-61</span> → <span class="relay">K43R</span> → <span class="relay">63AGX-B</span> (SF6 NC) → <span class="relay">K49R</span> → <span class="term">52T2 (R-ph TC2)</span> → <span class="term">TBI-22 (−)</span>',
    terminals: [
      { terminal: 'TBI-21', relay: '110V DC Main-II (+)', func: 'Second DC supply bus' },
      { terminal: 'TBI-61', relay: 'Remote TC2 R-ph', func: 'Input from protection relay 2' },
      { terminal: 'TBI-62', relay: 'TC2 Y-ph', func: 'Y-phase TC2 input' },
      { terminal: 'TBI-63/64', relay: 'TC2 B-ph', func: 'B-phase TC2 input' },
      { terminal: 'TBI-77', relay: 'TC2 common return', func: 'Return to DC negative' },
      { terminal: '63AGX-B', relay: 'SF6 Lockout NC-B', func: 'TC2 side SF6 interlock' },
      { terminal: '52T2 (R/Y/B)', relay: 'Trip Coil 2', func: '19Ω, 110V DC' },
    ],
    dccInfo: 'DCC-1/DCC-2: TC1 supply changeover contactors<br>DCC-3/DCC-4: TC2 supply changeover<br>DCC-A/DCC-B: DC bus changeover (Main-I to Main-II or vice versa)<br>If one DC source fails, DCC automatically switches to healthy source.'
  },
  close: {
    title: 'CLOSING CIRCUIT — From Drawing Pg.1 (Top Section)',
    icon: '🟢',
    circuitPath: '<span class="term">TBI-13 (+)</span> → <span class="relay">TBI-1/2 (Close cmd)</span> → <span class="relay">K5 (remote close relay)</span> → <span class="relay">43LR</span> (L/R changeover) → <span class="relay">K3</span> (close cmd relay) → <span class="relay">62CX-X-A-1</span> (spring charged NC→NO) → <span class="relay">K15V NC</span> (anti-pumping) → <span class="relay">63CLX</span> (closing contactor) → <span class="relay">52C</span> (close coil) → <span class="term">TBI-14 (−)</span>',
    terminals: [
      { terminal: 'TBI-13(+) / TBI-14(−)', relay: '110V DC supply to close circuit', func: 'Live' },
      { terminal: 'TBI-1 / TBI-2', relay: 'Remote close command input', func: 'Open (no close)' },
      { terminal: 'K5', relay: 'Remote close relay', func: 'De-energised' },
      { terminal: '43LR (Local/Remote)', relay: 'L/R changeover switch', func: 'As set by SW-1' },
      { terminal: 'K3', relay: 'Close command latching relay', func: 'De-energised' },
      { terminal: '62CX-X-A-1 (Spring)', relay: 'Spring charged contact (NO)', func: 'CLOSED when spring charged' },
      { terminal: 'K15V NC', relay: 'Anti-pumping relay NC contact', func: 'CLOSED (normal)' },
      { terminal: '63CLX', relay: 'Closing contactor (110V DC)', func: 'De-energised' },
      { terminal: '52C', relay: 'Close coil (20Ω)', func: 'De-energised' },
      { terminal: 'TBI-22', relay: 'TB2-28 area (88M closing)', func: '—' },
      { terminal: '88M1(R/Y/B)', relay: 'Closing resistor relay per phase', func: 'As per design' },
    ],
    troubleshoot: '1. Spring charged? → Check 62CX contact (TB area)\n2. DC supply at TBI-13? → Measure with meter\n3. Close command reaching K5? → Check TBI-1/2\n4. L/R switch in correct position? → Check 43LR / SW-1\n5. K15V stuck? → Anti-pumping may be latched\n6. SF6 lockout (63AGX) blocking? → Check gas pressure\n7. Close coil 52C resistance = 20Ω? → Measure at 63CLX terminals\n8. 63CLX contactor contacts dirty? → Clean main contacts',
    resistorInfo: '88M1(R), 88M1(Y), 88M1(B) are resistor insertion contacts during closing. If these contacts fail to insert resistors, voltage surge during close. Check TB2-28 to TB2-32 area for 88M1 contacts.'
  },
  sf6Terminals: {
    title: 'SF6 ALARM TERMINALS — From Drawing Pg.1 (Left Side)',
    icon: '💨',
    relayInfo: '63GA = Low Pressure Alarm (Stage-1, 7.5 kg/cm²)<br>63GB = Low Pressure Alarm (Stage-1, alternate phase)<br>63AGX-A / 63AGX-B = Lockout (Stage-2, 7.0 kg/cm²)',
    terminals: [
      { terminal: 'TB2-15/16', relay: '63GA-A(R)', phase: 'R', func: 'SF6 Low Alarm Stage-1', contact: 'NC' },
      { terminal: 'TB2-19/20', relay: '63GA-A(Y)', phase: 'Y', func: 'SF6 Low Alarm Stage-1', contact: 'NC' },
      { terminal: 'TB2-23/24', relay: '63GA-A(B)', phase: 'B', func: 'SF6 Low Alarm Stage-1', contact: 'NC' },
      { terminal: 'TB2-25/26', relay: '63GA-B(R)', phase: 'R', func: 'SF6 Low Alarm Stage-1 alt', contact: 'NC' },
      { terminal: 'TB2-21/22', relay: '63GA-A(Y) alt', phase: 'Y', func: 'Low alarm (alt wiring)', contact: 'NC' },
      { terminal: 'TB2-27', relay: '63GA-B(B)', phase: 'B', func: 'SF6 Low Alarm Stage-1 alt-B', contact: 'NC' },
      { terminal: 'TB2-41/42', relay: '63AGX-A-5', phase: 'All', func: 'SF6 Lockout — alarm circuit', contact: 'NC' },
      { terminal: 'TB2-43/44', relay: '63AGX-B-4', phase: 'All', func: 'SF6 Lockout — alarm circuit', contact: 'NC' },
      { terminal: 'In TC circuit', relay: '63AGX-A-2', phase: 'All', func: 'SF6 Lockout — TC1 interlock', contact: 'NC (CRITICAL)' },
      { terminal: 'In TC circuit', relay: '63AGX-B', phase: 'All', func: 'SF6 Lockout — TC2 interlock', contact: 'NC (CRITICAL)' },
    ],
    alarmSimLow: '<strong>Method:</strong> Remove test link between TB2-15 and TB2-16 (63GA-A R-phase). This opens the NC contact signal to relay panel.<br><br><strong>Steps:</strong><br>1. Inform control room / SCADA operator<br>2. Open test link at TB2-15 / TB2-16<br>3. Verify alarm at relay panel and SCADA<br>4. Re-insert link within 30 seconds<br>5. Verify alarm reset<br>6. Repeat for Y-phase (TB2-19/20) and B-phase (TB2-23/24)<br><br><strong>⚠ NEVER remove 63AGX contact links — this breaks trip circuit</strong>',
    alarmSimLockout: '<strong>Only simulate at TB2-41/42 (alarm output), NEVER at 63AGX-A-2 in TC circuit.</strong><br><br>Steps:<br>1. Ensure auto-reclose is disabled<br>2. Remove link at TB2-41 (alarm circuit only)<br>3. Verify lockout alarm at panel<br>4. Verify close command blocked (test with close PB — should NOT close)<br>5. Re-insert link<br>6. Reset lockout relay manually<br>7. Verify alarm clears'
  }
};

// ============================================================
//  SECTION 12: ALARM SIMULATION RULES
//  → Used in: Page 6 (General simulation rules)
// ============================================================
const ALARM_SIM_RULES = [
  'Always inform Control Room / DCC before and after simulation',
  'Maximum simulation duration: 60 seconds',
  'Restore all links before proceeding to next alarm',
  'Log all simulations in Testing Register with time stamp',
  'Never simulate TC failure on standby / in-service breaker',
  'SF6 lockout simulation: auto-reclose must be disabled first',
  'One alarm at a time — do not simulate multiple simultaneously',
  'Verify alarm resets properly before handing over',
];

// ============================================================
//  SECTION 13: CHATBOT QUICK CHIPS
//  → Used in: Page 7 (Chat quick-fire questions)
//  → To add more preset questions, add objects to the array
// ============================================================
const CHAT_CHIPS = [
  { label: 'Not opening', query: 'Breaker not opening after trip command' },
  { label: 'Not closing', query: 'Breaker not closing, spring seems charged' },
  { label: 'High CR', query: 'High contact resistance more than 100 microohm on Y phase' },
  { label: 'SF6 alarm', query: 'SF6 63GA alarm active on R phase' },
  { label: 'Slow close', query: 'Close time 92ms on R phase, B phase ok' },
  { label: '47TX tripped', query: 'Pole discrepancy relay 47TX tripped during timing test' },
  { label: 'TC1 high R', query: 'Trip coil TC1 R phase resistance is 35 ohm' },
  { label: 'Spring fault', query: 'Spring not charging after close operation' },
  { label: 'Status mismatch', query: 'Position indication mismatch at SCADA after operation' },
  { label: 'AP fault', query: 'Anti-pumping relay K15V seems stuck' },
];

// ============================================================
//  SECTION 14: AI SYSTEM PROMPTS
//  → Used in: Page 4 (PDF extraction) and Page 7 (Chat)
//  → Edit these to change AI behavior/context
// ============================================================
const CHAT_SYSTEM_PROMPT = `You are a senior substation testing engineer specializing in 400kV CGL SF6 circuit breakers, specifically the SFM-40S model (200-SFM-40S, Class C2 M2) used in Power Grid Corporation of India (PGCIL) substations.

You have the actual electrical drawing data:
BREAKER: 245kV, 40kA, 110V DC coils (TC1/TC2 = 19Ω, CC = 20Ω), SF6 pressure 8 kg/cm² at 20°C

KEY TERMINALS FROM DRAWING:
- DC Supply: TBI-13(+) / TBI-14(−) Main-I, TBI-21(+) Main-II
- TC1 commands: TBI-42(R), TBI-45(Y), TBI-47(B), TC1 relays: K23R/Y/B → K29R/Y/B → 52T1
- TC2 commands: TBI-61(R), TBI-62(Y), TBI-63(B), TC2 relays: K43R/Y/B → K49R/Y/B → 52T2
- Close circuit: TBI-1/2 → K5 → K3 → 62CX(spring) → K15V(AP) → 63CLX → 52C
- SF6 Alarm (63GA): TB2-15/16(R), TB2-19/20(Y), TB2-23/24(B)
- SF6 Lockout (63AGX-A-2): In TC1 path; (63AGX-B): In TC2 path — NC contacts
- Aux switch: TB3-R11/R12(52a-R), TB3-Y11/Y12(52a-Y), TC4-B11/B12(52a-B)
- Pole Discrepancy: 47TX at TB2-33, output via K81
- Anti-pumping: K15V relay
- Motor supply: TBI-1/TBI-2 (240V AC)
- DC Changeover: DCC-1/2/3/4/A/B

TEST LIMITS: Open 40-60ms, Close 50-80ms, Pole diff <3ms, CR <60µΩ (reject >100µΩ), TC coil 17-21Ω, CC 18-22Ω, IR >1000MΩ, SF6 alarm <7.5 kg/cm², lockout <7.0 kg/cm²

Provide practical, specific troubleshooting answers referencing actual terminal numbers and relay designations from the drawing. Be concise and direct. Format with numbered steps.`;

function getPDFSystemPrompt(testLabel) {
  return `You are an expert 400kV circuit breaker testing engineer. You are given a test report PDF or image for a CGL SFM-40S 400kV SF6 circuit breaker (245kV, 40kA).

Your job is to extract ALL numerical test values from the document and return them as a JSON object.

BREAKER TEST LIMITS (CGL SFM-40S):
- Open time: 40–60 ms per phase (R/Y/B)
- Close time: 50–80 ms per phase (R/Y/B)  
- Pole difference (open): < 3 ms
- Pole difference (close): < 3 ms
- Contact resistance: < 60 µΩ (warn >60, reject >100)
- Insulation resistance: > 1000 MΩ (5kV Megger)
- TC1/TC2 coil resistance: 17–21 Ω (nominal 19 Ω)
- Close coil resistance: 18–22 Ω (nominal 20 Ω)
- SF6 pressure alarm: < 7.5 kg/cm²
- SF6 pressure lockout: < 7.0 kg/cm²

The document being analysed is: "${testLabel}"

Return ONLY a valid JSON object (no markdown, no explanation) in this exact structure:
{
  "test_type": "${testLabel}",
  "document_title": "extracted title or filename",
  "date": "date from report if found",
  "breaker_id": "bay/feeder name if found",
  "operator": "tester name if found",
  "ambient_temp": "temperature if found",
  "values": {
    "open_r": null, "open_y": null, "open_b": null,
    "close_r": null, "close_y": null, "close_b": null,
    "pole_diff_open": null, "pole_diff_close": null,
    "cr_r": null, "cr_y": null, "cr_b": null,
    "ir_r": null, "ir_y": null, "ir_b": null,
    "tc1_r": null, "tc1_y": null, "tc1_b": null,
    "tc2_r": null, "tc2_y": null, "tc2_b": null,
    "cc_ohm": null, "sf6_pressure": null,
    "spring_recharge_time": null, "dc_voltage": null,
    "tc1_current": null, "tc2_current": null, "close_coil_current": null
  },
  "raw_notes": "any additional observations, alarms, remarks found in document",
  "extraction_confidence": "HIGH/MEDIUM/LOW",
  "unreadable_sections": "list any parts that were unclear or unreadable"
}

Fill only the fields present in the document. Leave others as null. Units: times in ms, resistance in µΩ (CR) or Ω (coil), IR in MΩ, pressure in kg/cm², current in A, voltage in V.`;
}

// ============================================================
//  SECTION 15: SAMPLE DATA (for "Fill Sample" button)
//  → Used in: Page 4 (Enter Results)
// ============================================================
const SAMPLE_DATA = {
  tOR: 48, tOY: 50, tOB: 47,
  tCR: 62, tCY: 64, tCB: 65,
  crR: 35, crY: 38, crB: 33,
  tc1R: 19, tc1Y: 19, tc1B: 19,
  tc2R: 19, tc2Y: 19, tc2B: 19,
  ccOhm: 20, irR: 5000, irY: 4800,
  springTime: 15, opCount: 3
};

// ============================================================
//  SECTION 16: MB PRECAUTIONS
//  → Used in: Page 6 (TB Layout)
// ============================================================
const MB_PRECAUTIONS = [
  'NEVER short any terminal without first measuring voltage with tong-tester',
  'Use proper test links only — no bare wire shorting',
  'Verify schematic drawing before operating any link',
  '240V AC (heater/motor) is always live even in breaker outage — work carefully',
  'Two-person rule: one working, one supervising',
];

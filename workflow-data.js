// ============================================================
//  workflow-data.js  â€”  Equipment & Test Data for Guided Workflow
//  Structure: Equipment â†’ Models â†’ Tests â†’ Procedure/Limits/Connections/Inputs/Troubleshooting
//
//  HOW TO ADD NEW EQUIPMENT / MODEL / TEST:
//  1. Add a new object in WORKFLOW_DATA.equipment array
//  2. Add models[] insideâ€”leave empty [] for "coming soon"
//  3. Add tests[] inside each model
//  4. Each test must have: id, name, objective, tools, preChecks,
//     steps, limits, connections, inputs, troubleshooting
// ============================================================

const WORKFLOW_DATA = {
  equipment: [

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  CIRCUIT BREAKER
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    {
      id: 'circuit_breaker',
      name: 'Circuit Breaker',
      icon: 'âš¡',
      models: [
        // â”€â”€ 400kV CGL SFM-40A â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        {
          id: 'cgl_sfm40a_400kv',
          name: '400kV CGL SFM-40A',
          specs: { 'Rated Voltage': '420 kV', 'Rated Current': '4000 A', 'Breaking Capacity': '40 kA', 'Type': 'SFâ‚†', 'Standard': 'IEC 62271-100' },
          tests: [
            // â”€ Timing Test â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              id: 'timing',
              name: 'Timing Test',
              objective: 'Verify that the circuit breaker opens and closes within specified time limits per IEC 62271-100 to ensure correct system protection grading.',
              tools: [
                'Circuit Breaker Analyzer / Timing Kit',
                'Laptop with CB Analyzer Software',
                'Control cables (Trip/Close command cables)',
                'Timing leads (main contact measurement)',
                'Auxiliary contact leads',
                'Screwdriver set',
                'Spanner / Ratchet set',
                'Extension board',
                'Multimeter'
              ],
              preChecks: [
                'Ensure CB and both side isolators of CB are physically open and AC/DC supplies are OFF',
                'Ensure earthing is applied on both sides of CB;Remove only during testing',
                'Circuit Breaker Analyzer body should be earthed',
                'Connect timing leads across the CB Contacts and to the CB Analyzer Kit',
                'Isolate all protection relay outputs (trip output contacts),if Required',
                'Check control supply voltage: 110 V DC at breaker MB terminals',
                'Verify SF6 gas pressure 7.0 bar at pressure gauge in All Phase',
                'Ensure AC Supply is available in MB and connect to the analyzer',
                'Verify communication between analyzer and laptop via Analyzer software'
              ],
              steps: [
                { num: 1, title: 'Setup CB Analyzer', body: 'Connect control circuit (TC and CC), Timing, and Auxiliary leads to the CB analyzer (e.g., SCOPE-HISAC ULTIMA)' },
                { num: 2, title: 'Configure Software Settings', body: 'Open CBA software and configure breaker type, breaker information, system settings, and channel selection etc' },
                { num: 3, title: 'Perform Closing Test (C)', body: 'Energize Close Coil CC via test set. Breaker closes. Record closing time for R, Y, B phases. Check pole discrepancy time (max allowed = 5 ms)' },
                { num: 4, title: 'Charge Spring', body: 'Allow spring to complete full charging cycle. Confirm spring charged indicator turns ON (green). Do NOT proceed until spring is fully charged.' },
                { num: 5, title: 'Perform Opening Test (O)', body: 'Energize Trip Coil TC1/TC2 via test set. Breaker opens. Record opening time for R, Y, B phases individually.check pole discrepancy time (max allowed = 5 ms)' },
                { num: 6, title: 'Perform C-O Sequence', body: 'Execute the Close Open sequence: Close open( Open command at least 10ms prior to contact touch during close operation. Record all operation times.' },
                { num: 7, title: 'Perform O-C-O Sequence', body: 'Execute the auto-reclosure sequence: Open  0.3s Close 3 min Open. Record all operation times.' },
                { num: 8, title: 'Record & Verify Results', body: 'Note all timing values in test report. Compare with type test values from Previous/factory test report and standard limits below.' },
                { num: 9, title: 'Restore & Document', body: 'Leave the breaker in OPEN position. Apply earthing on both sides of the CB. Restore all control, supply, and auxiliary connections. Remove all test leads safely. After clearance of PTW, remove earthing, close associated isolators, and then close the circuit breaker.' }
              ],
              limits: [
                { param: 'Opening Time (O)', unit: 'ms', min: null, max: 25, critical: 'WARN' },
                { param: 'Closing Time (C)', unit: 'ms', min: null, max: 150, critical: 'WARN' },
                { param: 'Pole Discrepancy Opening', unit: 'ms', min: null, max: 3.3, critical: 'WARN' },
                { param: 'Pole Discrepancy Closing', unit: 'ms', min: null, max: 5, critical: 'WARN' },
                { param: 'Break to Break mismatch', unit: 'ms', min: 0, max: 2.5, critical: 'WARN' },
                { param: 'Close open time(CO)', unit: 'ms', min: 35, max: null, critical: 'WARN' }
              ],
              connections: {
                description: 'Connect CB Analyzer between the breaker control cabinet and the breaker. Current clamps on coil leads for waveform capture. Auxiliary contacts (52a/52b) trigger timing start/stop.',
                terminals: [
                  { tb: 'TB1-1/2', relay: 'TC1 +ve', function: 'Trip Coil 1 Main DC', note: '+ 110V DC' },
                  { tb: 'TB1-5/6', relay: 'TC2 +ve', function: 'Trip Coil 2 Main DC', note: '+ 110V DC' },
                  { tb: 'TB2-1/2', relay: 'CC +ve', function: 'Close Coil Main DC', note: '+ 110V DC' },
                  { tb: '52a-R', relay: 'AUX 52a', function: 'Closed Position Signal', note: 'Timer Start' },
                  { tb: '52b-R', relay: 'AUX 52b', function: 'Open Position Signal', note: 'Timer Stop' }
                ],
                precautions: [
                  'Use insulated probes rated 1000 V CAT III',
                  'Do NOT energize TC and CC simultaneously severe damage risk',
                  'Ensure station earth continuity before test',
                  'Stand clear of breaker during all operations',
                  'Use remote operation / avoid manual close during test'
                ]
              },
              inputs: [
                { id: 'trip_r', label: 'Opening Time R Phase', unit: 'ms', type: 'number', min: null, max: 25, warn: 24, step: 0.1 },
                { id: 'trip_y', label: 'Opening Time Y Phase', unit: 'ms', type: 'number', min: null, max: 25, warn: 24, step: 0.1 },
                { id: 'trip_b', label: 'Opening Time B Phase', unit: 'ms', type: 'number', min: null, max: 25, warn: 24, step: 0.1 },
                { id: 'close_r', label: 'Closing Time R Phase', unit: 'ms', type: 'number', min: null, max: 150, warn: 130, step: 0.1 },
                { id: 'close_y', label: 'Closing Time Y Phase', unit: 'ms', type: 'number', min: null, max: 150, warn: 130, step: 0.1 },
                { id: 'close_b', label: 'Closing Time  B Phase', unit: 'ms', type: 'number', min: null, max: 150, warn: 130, step: 0.1 },
                { id: 'pd_trip', label: 'Pole Discrepancy (Trip)', unit: 'ms', type: 'number', min: 0, max: 3.3, warn: 3, step: 0.1 },
                { id: 'pd_close', label: 'Pole Discrepancy (Close)', unit: 'ms', type: 'number', min: 0, max: 5, warn: 4.5, step: 0.1 }
              ],
              troubleshooting: [
                {
                  condition: 'Opening time too slow (> 60 ms)',
                  causes: ['Low SF6 gas pressure reduces arc quenching force', 'Worn or high-resistance trip coil', 'Low control supply voltage at breaker terminals', 'Sluggish mechanism linkage or lack of lubrication', 'Weak or fatigued trip spring'],
                  actions: ['Check SF6 pressure gauge â€” top up if < 7.0 bar', 'Measure TC1 resistance (17â€“21 Î©); replace if out of range', 'Check 110V DC at TB1 under loaded condition', 'Lubricate mechanism per OEM service manual', 'Replace trip spring if physically deformed']
                },
                {
                  condition: 'Closing time too slow (> 80 ms)',
                  causes: ['Spring not fully charged before close command', 'High close coil resistance', 'Mechanical binding in closing linkage', 'Low control voltage under load', 'Anti-pumping relay K15V malfunction'],
                  actions: ['Allow spring to fully charge â€” confirm green indicator', 'Measure CC resistance (18â€“22 Î©)', 'Inspect closing linkage for obstruction or corrosion', 'Measure 110 V DC at CC terminals under loaded conditions', 'Test K15V relay operation separately']
                },
                {
                  condition: 'High pole discrepancy (> 3 ms)',
                  causes: ['Unequal SFâ‚† gas fill across poles (3-pole independent type)', 'Different trip coil resistances per phase', 'Worn or damaged linkage on one pole', 'Different spring tensions across poles', 'Dirty auxiliary contact on that pole'],
                  actions: ['Check SF6 pressure per pole if independent type', 'Measure each phase coil resistance individually', 'Inspect linkage of slow pole for wear or bending', 'Compare spring compression across all three poles', 'Clean and lubricate auxiliary contacts']
                },
                {
                  condition: 'Breaker fails to trip on command',
                  causes: ['Open circuit in TC1 wiring', 'Blown DC supply fuse', 'Anti-pumping relay held open', 'Trip supply voltage below pick-up level (< 70 V DC)', 'Coil wire broken or connector loose'],
                  actions: ['Trace TC1 circuit with continuity tester', 'Check all fuses on 110V DC panel', 'Test K15V relay reset function', 'Measure DC bus voltage and battery float voltage', 'Inspect coil connector at breaker terminal box']
                },
                {
                  condition: 'Breaker fails to close on command',
                  causes: ['Spring not charged (motor circuit fault)', 'Close coil circuit open', 'Interlock not satisfied (Buchholz, gas low, etc.)', 'Anti-pumping relay not releasing', 'Close command pulse too short'],
                  actions: ['Check spring motor supply and motor condition', 'Test CC circuit continuity', 'Check all interlock conditions on SCADA/HMI', 'Verify K15V timing and reset', 'Extend close command pulse duration in relay settings']
                }
              ]
            },

            // â”€ DCRM (Contact Resistance Test) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              id: 'dcrm',
              name: 'Contact Resistance Test (DCRM)',
              objective: 'Measure the milliohm-level resistance of main contacts using 4-wire DC current injection to detect burnt, pitted, or degraded contacts that increase heating losses.',
              tools: [
                'Micro-ohmmeter / DCRM tester (100A or 200A DC injection)',
                'Heavy-duty current leads (200 A rated, 35 mmÂ² cable)',
                'Voltage sensing leads (Kelvin probes)',
                'Multi-meter',
                'PPE (HV gloves, safety helmet)'
              ],
              preChecks: [
                'Breaker MUST be in CLOSED position â€” verify mechanically',
                'Isolate all parallel current paths (earthing switches, busbars)',
                'Control supply to breaker must be isolated (prevent accidental operation)',
                'Test current leads must be rated for â‰¥ 200A DC',
                'Verify calibration date of micro-ohmmeter (within 12 months)',
                'Clean contact surfaces of test lead clamps'
              ],
              steps: [
                { num: 1, title: 'Verify Breaker CLOSED', body: 'Mechanically confirm breaker is in closed position. Check position indicator and auxiliary contacts 52a.' },
                { num: 2, title: 'Connect 4-Wire Kelvin Leads', body: 'Connect C+ (current lead) and P+ (voltage lead) to the Line terminal (top bushing). Connect Câˆ’ and Pâˆ’ to the Bus terminal (bottom bushing). Ensure P probes are INSIDE C probes for accurate 4-wire measurement.' },
                { num: 3, title: 'Configure Instrument', body: 'Set test current to 100 A or 200 A. Select 4-wire Kelvin measurement mode. Connect to correct phase first (R).' },
                { num: 4, title: 'Inject DC & Record R-Phase', body: 'Start test â€” instrument injects DC and measures voltage drop. Wait for stable reading. Record resistance in ÂµÎ© for R-phase.' },
                { num: 5, title: 'Test Y and B Phases', body: 'Repeat steps 2â€“4 for Y-phase and B-phase by moving test leads to respective pole terminals.' },
                { num: 6, title: 'Compare with Limits', body: 'PASS: < 60 ÂµÎ© per phase. INVESTIGATE: 60â€“100 ÂµÎ© â€” schedule maintenance. FAIL: > 100 ÂµÎ© â€” do not energize, contact OEM.' },
                { num: 7, title: 'Remove Leads & Restore', body: 'De-energize test instrument first. Remove leads safely. Restore any earthing switches opened for test. Document all results.' }
              ],
              limits: [
                { param: 'Contact Resistance â€” R Phase', unit: 'ÂµÎ©', min: null, max: 60, critical: 'FAIL' },
                { param: 'Contact Resistance â€” Y Phase', unit: 'ÂµÎ©', min: null, max: 60, critical: 'FAIL' },
                { param: 'Contact Resistance â€” B Phase', unit: 'ÂµÎ©', min: null, max: 60, critical: 'FAIL' },
                { param: 'Investigate Zone (any phase)', unit: 'ÂµÎ©', min: 60, max: 100, critical: 'WARN' },
                { param: 'Phase-to-Phase Variation', unit: 'ÂµÎ©', min: null, max: 10, critical: 'WARN' }
              ],
              connections: {
                description: '4-wire Kelvin measurement eliminates lead resistance. Current is injected at outer terminals; voltage is sensed at inner taps. Measure one phase at a time with breaker CLOSED.',
                terminals: [
                  { tb: 'Line Terminal (Top)', relay: 'C+ / P+', function: 'Current & Voltage +ve', note: '200 A lead â€” clamp firmly' },
                  { tb: 'Bus Terminal (Bottom)', relay: 'Câˆ’ / Pâˆ’', function: 'Current & Voltage âˆ’ve', note: '200 A lead â€” clamp firmly' }
                ],
                precautions: [
                  'Remove ALL parallel current paths before test',
                  'Never open the breaker while test current is flowing',
                  '4-wire Kelvin method is MANDATORY â€” 2-wire gives incorrect results',
                  'Confirm leads are fully tightened â€” high contact resistance gives false readings',
                  'Test each phase separately for individual diagnosis'
                ]
              },
              inputs: [
                { id: 'cr_r', label: 'Contact Resistance â€” R Phase', unit: 'ÂµÎ©', type: 'number', min: 0, max: 60, warn: 55, step: 0.1 },
                { id: 'cr_y', label: 'Contact Resistance â€” Y Phase', unit: 'ÂµÎ©', type: 'number', min: 0, max: 60, warn: 55, step: 0.1 },
                { id: 'cr_b', label: 'Contact Resistance â€” B Phase', unit: 'ÂµÎ©', type: 'number', min: 0, max: 60, warn: 55, step: 0.1 }
              ],
              troubleshooting: [
                {
                  condition: 'Contact resistance > 100 ÂµÎ© on one phase',
                  causes: ['Burnt or severely pitted contacts on that pole', 'Contact alignment mismatched after maintenance', 'Carbon or metallic deposits on contact surfaces', 'Incomplete mechanical closing â€” pole not fully latched'],
                  actions: ['Inspect main contacts of that pole visually if accessible', 'Clean with SFâ‚†-compatible contact compound (consult OEM)', 'Verify breaker fully closed â€” check mechanical indicator', 'Contact OEM for contact replacement criteria']
                },
                {
                  condition: 'High resistance on all three phases',
                  causes: ['Loose or improperly clamped test leads', '4-wire connection not properly made (2-wire measurement error)', 'Instrument calibration expired or fault', 'All contacts degraded (high-fault-duty breaker)'],
                  actions: ['Re-torque all current lead clamps firmly', 'Verify P-leads are connected INSIDE C-leads (Kelvin method)', 'Check instrument calibration certificate', 'Cross-check with independent DCRM instrument']
                },
                {
                  condition: 'Phase-to-phase variation > 10 ÂµÎ©',
                  causes: ['Unequal contact wear between poles', 'Different contact adjustment on one pole', 'One pole operated more frequently'],
                  actions: ['Record the out-of-spec phase for trending', 'Schedule individual pole contact inspection', 'Review breaker operation log for unbalanced trips']
                }
              ]
            }
          ]
        },

        // â”€â”€ 245kV Siemens 3AP1FI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        {
          id: 'siemens_3ap1fi_245kv',
          name: '245kV Siemens 3AP1FI',
          specs: { 'Rated Voltage': '245 kV', 'Rated Current': '3150 A', 'Breaking Capacity': '40 kA', 'Type': 'SFâ‚†', 'Standard': 'IEC 62271-100' },
          tests: [
            {
              id: 'timing',
              name: 'Timing Test',
              objective: 'Verify 245kV Siemens 3AP1FI breaker opening and closing times per Siemens factory test values and IEC 62271-100.',
              tools: [
                'Circuit Breaker Analyzer / Timing Kit',
                'Laptop with CB Analyzer Software',
                'Control cables (Trip/Close command cables)',
                'Timing leads (main contact measurement)',
                'Auxiliary contact leads',
                'Screwdriver set',
                'Spanner / Ratchet set',
                'Extension board',
                'Multimeter'
              ],
              preChecks: [
                'Verify SF6 gas density â‰¥ 6.8 bar (abs) at 20Â°C',
                'Check control voltage: 110V DC at P1+/P1âˆ’ terminals',
                'Confirm closing spring charged â€” green indicator ON',
                'Isolate all protection relay trip contacts'
              ],
              steps: [
                { num: 1, title: 'Connect Analyzer', body: 'Connect CB analyzer to breaker control cabinet. Connect to P1 (TC1), P3 (CC), and auxiliary contacts at X1.' },
                { num: 2, title: 'Open Test', body: 'Energize TC1 via analyzer. Record open time R, Y, B poles.' },
                { num: 3, title: 'Close Test', body: 'Allow spring to charge fully. Energize CC (P3). Record close time R, Y, B poles.' },
                { num: 4, title: 'Compare Results', body: 'Compare with limits below and Siemens factory test report.' }
              ],
              limits: [
                { param: 'Opening Time', unit: 'ms', min: 35, max: 55, critical: 'FAIL' },
                { param: 'Closing Time', unit: 'ms', min: 55, max: 85, critical: 'FAIL' },
                { param: 'Pole Discrepancy', unit: 'ms', min: null, max: 3, critical: 'FAIL' }
              ],
              connections: {
                description: 'Connect as per Siemens wiring diagram. Trip coil at P1, close coil at P3, auxiliary contacts at X1.',
                terminals: [
                  { tb: 'P1+ / P1âˆ’', relay: 'TC1', function: 'Trip Coil 1', note: '110V DC' },
                  { tb: 'P3+ / P3âˆ’', relay: 'CC', function: 'Close Coil', note: '110V DC' },
                  { tb: 'X1: 52a, 52b', relay: 'AUX', function: 'Timing Contacts', note: 'Analyzer input' }
                ],
                precautions: [
                  'Never bridge P1 and P3 simultaneously â€” risk of through-fault',
                  'Confirm gas density before test â€” density switch may lock out close command',
                  'Verify spring discharge after each operation before next'
                ]
              },
              inputs: [
                { id: 'trip_r', label: 'Opening Time â€” R Phase', unit: 'ms', type: 'number', min: 35, max: 55, warn: 52, step: 0.1 },
                { id: 'trip_y', label: 'Opening Time â€” Y Phase', unit: 'ms', type: 'number', min: 35, max: 55, warn: 52, step: 0.1 },
                { id: 'trip_b', label: 'Opening Time â€” B Phase', unit: 'ms', type: 'number', min: 35, max: 55, warn: 52, step: 0.1 },
                { id: 'close_r', label: 'Closing Time â€” R Phase', unit: 'ms', type: 'number', min: 55, max: 85, warn: 82, step: 0.1 },
                { id: 'close_y', label: 'Closing Time â€” Y Phase', unit: 'ms', type: 'number', min: 55, max: 85, warn: 82, step: 0.1 },
                { id: 'close_b', label: 'Closing Time â€” B Phase', unit: 'ms', type: 'number', min: 55, max: 85, warn: 82, step: 0.1 },
                { id: 'pd_trip', label: 'Pole Discrepancy (Trip)', unit: 'ms', type: 'number', min: 0, max: 3, warn: 2.5, step: 0.1 }
              ],
              troubleshooting: [
                {
                  condition: 'Slow opening time (>55ms) on Siemens 3AP1FI',
                  causes: ['SF6 gas density below minimum alarm level', 'Trip coil resistance out of range', 'Low 110V DC supply at P1 under load', 'Spring mechanism stiff due to temperature', 'Gas density relay lockout active'],
                  actions: ['Check SF6 density switch set-point and current density', 'Measure TC resistance at P1+/P1âˆ’ (check Siemens DT for spec)', 'Verify 110V DC under full load at P1 terminals', 'Check ambient temperature â€” lubricate if < 5Â°C', 'Inspect and reset gas density relay if spuriously locked']
                }
              ]
            }
          ]
        }
      ]
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  POWER TRANSFORMER
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    {
      id: 'power_transformer',
      name: 'Power Transformer',
      icon: 'ðŸ”',
      models: [] // â† Coming soon
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  CURRENT TRANSFORMER (CT)
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    {
      id: 'current_transformer',
      name: 'Current Transformer (CT)',
      icon: 'ðŸ“¡',
      models: [
        {
          id: 'ct_220kv_imc',
          name: '220kV Oil-Immersed CT (IMC Type)',
          specs: { 'Rated Voltage': '220 kV', 'Primary Current': '800/400 A', 'Secondary Current': '1 A / 5 A', 'Accuracy Class': '0.2 / 5P20', 'Standard': 'IEC 61869-2' },
          tests: [
            // â”€ Insulation Resistance (CT) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              id: 'ct_ir_test',
              name: 'CT Insulation Resistance Test',
              objective: 'Measure insulation resistance of the CT primary winding to secondary winding and to earth, to verify insulation integrity and detect moisture or contamination.',
              tools: [
                'Insulation Resistance Tester (Megger) â€” 5 kV DC, 200 GÎ© range',
                'Shorting link for secondary terminals',
                'HV rated connecting leads',
                'Digital multi-meter',
                'PPE â€” HV gloves, face shield'
              ],
              preChecks: [
                'Completely isolate and earth CT primary connections â€” LOTO applied',
                'Short ALL secondary terminals (P1, P2 and all secondary cores) safely',
                'Disconnect all secondary core leads from relay and metering panels',
                'Earth the tank / secondary winding before primary test',
                'Verify Megger calibration validity (< 12 months)',
                'Record ambient temperature & humidity (RH should be < 70%)',
                'Ensure no personnel are in contact with CT terminals during test'
              ],
              steps: [
                { num: 1, title: 'Record Test Conditions', body: 'Note date, time, ambient temperature (Â°C), humidity (% RH), and top oil temperature if applicable.' },
                { num: 2, title: 'Primary to (Secondary + Earth)', body: 'Connect Megger +ve to P1 (primary terminal). Connect âˆ’ve to all secondary terminals shorted together + earth. Apply 5 kV DC. Record R at 1 min (R60) and 10 min (R600).' },
                { num: 3, title: 'Calculate PI', body: 'Polarisation Index (PI) = R600 / R60. PI > 1.5 indicates acceptable insulation condition.' },
                { num: 4, title: 'Secondary to Earth (each core)', body: 'With primary earthed: Apply 1 kV DC from each secondary winding to earth. Record resistance. Repeat for all secondary cores.' },
                { num: 5, title: 'Discharge & Restore', body: 'Apply earth to all terminals for minimum 3 minutes after test. Restore secondary core connections to protection panels. Document all readings.' }
              ],
              limits: [
                { param: 'Primary to (S+E) â€” 1 min at 5kV', unit: 'GÎ©', min: 1, max: null, critical: 'FAIL' },
                { param: 'Polarisation Index (PI)', unit: '', min: 1.5, max: null, critical: 'WARN' },
                { param: 'Secondary Core to Earth â€” 1 min at 1kV', unit: 'MÎ©', min: 100, max: null, critical: 'WARN' }
              ],
              connections: {
                description: 'Megger connects PRIMARY terminal to all SECONDARY terminals shorted + earth. Test one direction at a time only. Always discharge fully between tests.',
                terminals: [
                  { tb: 'P1 (Primary HV Terminal)', relay: 'Megger LINE (+)', function: 'Primary winding test electrode', note: 'HV terminal â€” ensure full isolation' },
                  { tb: 'CT Tank / Earth Bar', relay: 'Megger EARTH (âˆ’)', function: 'Return + earth reference', note: 'Common earth point' },
                  { tb: 'S1, S2, â€¦ (All secondaries shorted)', relay: 'Megger EARTH (âˆ’)', function: 'Secondary earth during P-side test', note: 'Short all secondary cores' }
                ],
                precautions: [
                  'NEVER apply 5kV on secondary side â€” secondary insulation is rated 1kV only',
                  'Always earth the opposite winding during measurement',
                  'CT secondary must NEVER be left open-circuited when primary is energised',
                  'Discharge capacitance for at least 3 minutes after 5kV test',
                  'High humidity (RH > 60%) causes spuriously low readings â€” note in report'
                ]
              },
              inputs: [
                { id: 'ct_ir_pri_60', label: 'IR: Primary to (S+E) â€” 1 min', unit: 'GÎ©', type: 'number', min: 1, max: null, warn: null, step: 0.01 },
                { id: 'ct_ir_pri_600', label: 'IR: Primary to (S+E) â€” 10 min', unit: 'GÎ©', type: 'number', min: null, max: null, warn: null, step: 0.01 },
                { id: 'ct_pi', label: 'Polarisation Index (PI)', unit: '', type: 'number', min: 1.5, max: null, warn: 1.8, step: 0.01 },
                { id: 'ct_sec_ir', label: 'Secondary Core to Earth â€” 1 min', unit: 'MÎ©', type: 'number', min: 100, max: null, warn: null, step: 1 },
                { id: 'ct_humidity', label: 'Ambient Humidity', unit: '% RH', type: 'number', min: null, max: 70, warn: 60, step: 1 }
              ],
              troubleshooting: [
                {
                  condition: 'IR < 1 GÎ© (primary to secondary+earth)',
                  causes: ['Oil contamination â€” high moisture or PCB content', 'Tracking or surface discharge on primary porcelain bushing', 'Deteriorated paper insulation due to ageing', 'Moisture ingress from leaking top seal or tank weld'],
                  actions: ['Take oil sample â€” Karl Fischer for moisture (> 30 ppm is critical)', 'Clean primary bushing surface with dry lint-free cloth', 'Check oil level and top seal for leakage', 'Consult OEM â€” if PI also < 1.0, take CT out of service immediately']
                },
                {
                  condition: 'Secondary IR < 100 MÎ©',
                  causes: ['Moisture in secondary terminal box', 'Damaged secondary lead insulation', 'Earth fault in secondary cable run', 'Core insulation degradation'],
                  actions: ['Open secondary terminal box â€” check for moisture/condensation', 'Megger secondary cable runs separately to locate fault', 'Clean and dry terminal box with hot air gun', 'Contact CT manufacturer if core shows tracking or burning']
                }
              ]
            },

            // â”€ CT Ratio & Polarity Test â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            {
              id: 'ct_ratio_test',
              name: 'CT Ratio & Polarity Test',
              objective: 'Verify the actual transformation ratio and polarity of all secondary cores against the nameplate to confirm correct metering and protection connections.',
              tools: [
                'CT Ratio Tester (CTER) â€” Megger or Omicron',
                'Variable AC source or injection transformer',
                'Digital clamp meter (secondary side)',
                'Multi-meter',
                'PPE â€” insulation gloves'
              ],
              preChecks: [
                'CT must be completely isolated from HV primary circuit',
                'All secondary loads (relays, meters) must be disconnected',
                'Shorting links are NOT needed â€” test injects from primary or secondary',
                'Verify polarity marks P1 and S1 on nameplate',
                'Record ambient temperature'
              ],
              steps: [
                { num: 1, title: 'Primary Injection Method', body: 'Inject known AC current through primary (P1 â†’ P2). Measure secondary output using clamp meter or ratio tester at each secondary core. Ratio = Primary current / Secondary current.' },
                { num: 2, title: 'Verify Ratio for Each Core', body: 'Record ratio for protection core, metering core. Compare with nameplate (e.g. 800/1A).' },
                { num: 3, title: 'Polarity Check', body: 'Inject current from P1 â†’ P2. Observe that secondary current flows S1 â†’ load â†’ S2 (marked polarity dot). Phase angle between primary and secondary should be ~0Â°.' },
                { num: 4, title: 'Ratio Error Calculation', body: 'Ratio Error (%) = (Actual Ratio âˆ’ Nameplate Ratio) / Nameplate Ratio Ã— 100. Must be within accuracy class tolerance.' },
                { num: 5, title: 'Document Results', body: 'Record all core ratios, polarity confirmation, and any deviations. Compare with FAT (Factory Acceptance Test) report.' }
              ],
              limits: [
                { param: 'Ratio Error (Metering Core 0.2 class)', unit: '%', min: null, max: 0.2, critical: 'FAIL' },
                { param: 'Ratio Error (Protection Core 5P20)', unit: '%', min: null, max: 1.0, critical: 'FAIL' },
                { param: 'Phase Angle Error (metering)', unit: 'min', min: null, max: 10, critical: 'WARN' }
              ],
              connections: {
                description: 'Inject low AC current through primary terminals P1, P2. Measure secondary at each core output S1, S2. Maintain correct polarity during test.',
                terminals: [
                  { tb: 'P1 â†’ P2', relay: 'AC Source / Ratio Tester Primary', function: 'Primary injection (low current, 1â€“5A)', note: 'Use injection transformer â€” never HV supply' },
                  { tb: 'S1 / S2 (Protection Core)', relay: 'Ratio Tester Secondary', function: 'Protection core output measurement', note: 'Core 1' },
                  { tb: 'S3 / S4 (Metering Core)', relay: 'Ratio Tester Secondary', function: 'Metering core output measurement', note: 'Core 2' }
                ],
                precautions: [
                  'Never leave secondary open during primary injection current',
                  'Always complete the secondary circuit before energising primary',
                  'Test a ratio of 1 or more first to avoid overloading the secondary',
                  'Ensure no load is connected to secondary core under test'
                ]
              },
              inputs: [
                { id: 'ct_ratio_prot', label: 'Ratio Error â€” Protection Core', unit: '%', type: 'number', min: null, max: 1.0, warn: 0.8, step: 0.01 },
                { id: 'ct_ratio_meter', label: 'Ratio Error â€” Metering Core', unit: '%', type: 'number', min: null, max: 0.2, warn: 0.15, step: 0.01 },
                { id: 'ct_phase_angle', label: 'Phase Angle Error (metering)', unit: 'min', type: 'number', min: null, max: 10, warn: 8, step: 0.1 },
                { id: 'ct_polarity_ok', label: 'Polarity Correct (1=Yes, 0=No)', unit: '', type: 'number', min: 1, max: 1, warn: null, step: 1 }
              ],
              troubleshooting: [
                {
                  condition: 'Ratio error > 1% on protection core',
                  causes: ['Inter-turn fault (shorted turns) in secondary winding', 'Wrong tap selected on multi-ratio CT', 'Burden connected during test (load not isolated)', 'Connection error â€” wrong core leads connected to tester'],
                  actions: ['Verify all secondary leads are disconnected from panels before test', 'Check nameplate â€” confirm tap ratio matches test configuration', 'Inspect for any inter-winding contact or moisture in terminal box', 'If error persists after reconnection checks, send CT to OEM or workshop']
                },
                {
                  condition: 'Polarity reversed on one core',
                  causes: ['S1/S2 core leads swapped at terminal box', 'Wrong core identified in terminal box (core labelling error)', 'Factory wiring error â€” compare with FAT report'],
                  actions: ['Swap S1 and S2 leads on the reversed core at terminal box', 'Trace individual core leads with continuity test back to CT tank', 'Verify with CT test report from factory before any correction']
                }
              ]
            }
          ]
        }
      ]
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  POTENTIAL TRANSFORMER (PT/VT)
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    {
      id: 'potential_transformer',
      name: 'Potential Transformer (PT/VT)',
      icon: 'ðŸ”†',
      models: [] // â† Coming soon
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    //  STATION BATTERY
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    {
      id: 'battery',
      name: 'Station Battery',
      icon: 'ðŸ”‹',
      models: [] // â† Coming soon
    }
  ]
};

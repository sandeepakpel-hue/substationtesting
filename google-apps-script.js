// ============================================================
//  google-apps-script.js
//  Paste this code into Google Apps Script editor and deploy
//  as a Web App (see instructions below)
// ============================================================
//
//  DEPLOYMENT STEPS:
//  ─────────────────────────────────────────────────────────
//  1. Open Google Sheets → Extensions → Apps Script
//  2. Delete any existing code and paste ALL of the code below
//  3. Click Save (Ctrl+S / Cmd+S)
//  4. Click Deploy → New Deployment
//  5. Choose type: Web App
//  6. Execute As: Me (your Google account)
//  7. Who has access: Anyone
//  8. Click Deploy → Copy the Web App URL
//  9. Paste that URL into landing.js:
//       const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/XXXX/exec';
//
//  NOTE: Re-deploy (new deployment) every time you edit the script.
// ============================================================

// ── PASTE BELOW INTO APPS SCRIPT EDITOR ────────────────────

/*
const SHEET_NAME = 'Feedback';  // Tab name in your Google Sheet

function doPost(e) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet + headers if they don't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Contact',
        'Equipment Type', 'Test Type', 'Message'
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    // Parse JSON body
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp  || new Date().toLocaleString(),
      data.name       || '',
      data.email      || '',
      data.contact    || '',
      data.equipment  || '',
      data.test       || '',
      data.message    || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Allow GET requests for testing
function doGet(e) {
  return ContentService
    .createTextOutput('Substation Feedback Endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
*/

// ── END OF APPS SCRIPT CODE ─────────────────────────────────

// ============================================================
//  EmailJS Template Configuration
// ─────────────────────────────────────────────────────────────
//  Create an email template at https://www.emailjs.com with
//  the following variables in the template body:
//
//  Subject: New Feedback – Substation Testing Guide
//
//  Body:
//  ─────────────────────────────────────────
//  New Feedback Received
//
//  Name      : {{from_name}}
//  Email     : {{from_email}}
//  Contact   : {{contact_number}}
//  Equipment : {{equipment_type}}
//  Test Type : {{test_type}}
//  Message   : {{message}}
//  Timestamp : {{timestamp}}
//  ─────────────────────────────────────────
//
//  To Email  : sandeepakpel@gmail.com
// ============================================================

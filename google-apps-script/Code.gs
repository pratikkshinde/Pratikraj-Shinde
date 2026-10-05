const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "Responses";
const HEADERS = ["ID", "Name", "Email", "Subject", "Message", "Timestamp"];

function doGet() {
  try {
    const sheet = getResponsesSheet_();
    const lastRow = sheet.getLastRow();
    const responses = lastRow < 2
      ? []
      : sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getDisplayValues().map(function (row) {
          return {
            id: row[0],
            name: row[1],
            email: row[2],
            subject: row[3],
            message: row[4],
            timestamp: row[5]
          };
        });
    return jsonResponse_({ success: true, responses: responses });
  } catch (error) {
    return jsonResponse_({ success: false, message: "Unable to retrieve responses." });
  }
}

function doPost(event) {
  try {
    const body = event && event.postData && event.postData.contents;
    if (!body) return jsonResponse_({ success: false, message: "Request body is required." });

    let data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      return jsonResponse_({ success: false, message: "Request body must be valid JSON." });
    }

    const validation = validateSubmission_(data);
    if (!validation.valid) return jsonResponse_({ success: false, message: validation.message });

    const sheet = getResponsesSheet_();
    const timestamp = new Date().toISOString();
    const row = [
      Utilities.getUuid(),
      validation.values.name,
      validation.values.email,
      validation.values.subject,
      validation.values.message,
      timestamp
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const nextRow = sheet.getLastRow() + 1;
      const responseRange = sheet.getRange(nextRow, 1, 1, HEADERS.length);
      responseRange.setNumberFormat("@");
      responseRange.setValues([row]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ success: true, message: "Response submitted successfully" });
  } catch (error) {
    return jsonResponse_({ success: false, message: "Unable to save your response." });
  }
}

function getResponsesSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (HEADERS.some(function (header, index) { return currentHeaders[index] !== header; })) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange("A:F").setNumberFormat("@");
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function validateSubmission_(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, message: "Request data must be an object." };
  }
  const values = {
    name: cleanText_(data.name),
    email: cleanText_(data.email),
    subject: cleanText_(data.subject),
    message: cleanText_(data.message)
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (values.name.length < 2 || values.name.length > 100) return { valid: false, message: "Name must be between 2 and 100 characters." };
  if (values.email.length > 254 || !emailPattern.test(values.email)) return { valid: false, message: "Enter a valid email address." };
  if (values.subject.length < 3 || values.subject.length > 150) return { valid: false, message: "Subject must be between 3 and 150 characters." };
  if (values.message.length < 10 || values.message.length > 5000) return { valid: false, message: "Message must be between 10 and 5000 characters." };
  return { valid: true, values: values };
}

function cleanText_(value) {
  return typeof value === "string" ? value.trim() : "";
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

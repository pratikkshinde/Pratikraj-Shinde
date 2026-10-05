const API_URL = "https://script.google.com/macros/s/AKfycbxY9QI6cshrWLo0Qx1HMA4_EKPF8NvCv01e34M1FzX0cN8pQRiLH-ogF9GOwtAudnpn-g/exec";

function configuredApiUrl() {
  if (!API_URL || API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(API_URL)) {
    throw new Error("API_NOT_CONFIGURED");
  }
  return API_URL;
}

async function readJsonResponse(response) {
  const body = await response.text();
  let result;
  try {
    result = JSON.parse(body);
  } catch {
    throw new Error("INVALID_API_RESPONSE");
  }
  if (!response.ok || result.success !== true) {
    throw new Error(result.message || "API_REQUEST_FAILED");
  }
  return result;
}

function validateContactPayload(data) {
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const subject = String(data.subject ?? "").trim();
  const message = String(data.message ?? "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (name.length < 2 || name.length > 100 || !emailPattern.test(email) || email.length > 254 || subject.length < 3 || subject.length > 150 || message.length < 10 || message.length > 5000) {
    throw new Error("INVALID_CONTACT_DATA");
  }
  return { name, email, subject, message };
}

export async function submitContactForm(data) {
  const url = configuredApiUrl();
  const payload = validateContactPayload(data);
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
  } catch {
    throw new Error("NETWORK_ERROR");
  }
  return readJsonResponse(response);
}

export async function fetchResponses() {
  const url = configuredApiUrl();
  let response;
  try {
    response = await fetch(url, { method: "GET", cache: "no-store", redirect: "follow" });
  } catch {
    throw new Error("NETWORK_ERROR");
  }
  const result = await readJsonResponse(response);
  if (!Array.isArray(result.responses)) throw new Error("INVALID_API_RESPONSE");
  return result.responses;
}

import { fetchResponses } from "./api.js";

// Note: This is a static site. Client-side authentication is NEVER truly secure.
// Credentials are base64 encoded to prevent casual snooping, but anyone can still decode them.
const ADMIN_USERNAME = atob("UHJhdGlraw=="); // Decodes to your username
const ADMIN_PASSWORD = atob("UHJhdGlrQDY2NjA="); // Decodes to your password
const SESSION_KEY = "portfolio-admin-session";
const loginPanel = document.querySelector("#admin-login-panel");
const loginForm = document.querySelector("#admin-login-form");
const loginStatus = document.querySelector("#admin-login-status");
const dashboard = document.querySelector("#admin-dashboard");
const dashboardStatus = document.querySelector("#dashboard-status");
const tableBody = document.querySelector("#response-table-body");
const responseCards = document.querySelector("#response-cards");
const responseCount = document.querySelector("#response-count");
const refreshButton = document.querySelector("#refresh-responses");
const logoutButton = document.querySelector("#admin-logout");
const backButton = document.querySelector("#back-to-portfolio");

if (backButton) {
  backButton.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });
}

function setStatus(element, message, state = "") {
  element.textContent = message;
  if (state) element.dataset.state = state;
  else delete element.dataset.state;
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "Unknown date");
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeStyle: "short" }).format(date);
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = String(text ?? "");
  return cell;
}

function renderResponses(responses) {
  tableBody.replaceChildren();
  responseCards.replaceChildren();
  responseCount.textContent = String(responses.length);
  const orderedResponses = [...responses].sort((first, second) => {
    const firstDate = Date.parse(first.timestamp) || 0;
    const secondDate = Date.parse(second.timestamp) || 0;
    return secondDate - firstDate;
  });

  orderedResponses.forEach((response) => {
    const name = String(response.name ?? "");
    const email = String(response.email ?? "");
    const subject = String(response.subject ?? "");
    const message = String(response.message ?? "");
    const timestamp = String(response.timestamp ?? "");
    const formattedTimestamp = formatTimestamp(timestamp);

    const row = document.createElement("tr");
    [name, email, subject, message, formattedTimestamp].forEach((value) => row.append(createCell(value)));
    tableBody.append(row);

    const card = document.createElement("article");
    card.className = "response-card";
    const heading = document.createElement("h4");
    heading.textContent = name;
    const emailText = document.createElement("a");
    emailText.textContent = email;
    emailText.href = `mailto:${encodeURIComponent(email)}`;
    const subjectText = document.createElement("p");
    subjectText.className = "response-card-subject";
    subjectText.textContent = subject;
    const messageText = document.createElement("p");
    messageText.className = "response-card-message";
    messageText.textContent = message;
    const time = document.createElement("time");
    time.textContent = formattedTimestamp;
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) time.dateTime = date.toISOString();
    card.append(heading, emailText, subjectText, messageText, time);
    responseCards.append(card);
  });

  if (orderedResponses.length === 0) {
    setStatus(dashboardStatus, "No responses yet. When visitors submit the contact form, their messages will appear here.");
  } else {
    setStatus(dashboardStatus, `${orderedResponses.length} ${orderedResponses.length === 1 ? "response" : "responses"}.`);
  }
}

async function loadResponses() {
  refreshButton.disabled = true;
  setStatus(dashboardStatus, "Loading responses…");
  try {
    const responses = await fetchResponses();
    renderResponses(responses);
  } catch (error) {
    const message = error.message === "NETWORK_ERROR"
      ? "Network error. Please check your connection."
      : error.message === "API_NOT_CONFIGURED"
        ? "Unable to load responses. Configure the Apps Script URL in js/api.js, then try again."
        : "Unable to load responses. Please try again.";
    setStatus(dashboardStatus, message, "error");
  } finally {
    refreshButton.disabled = false;
  }
}

function showDashboard() {
  loginPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadResponses();
}

function showLogin() {
  sessionStorage.removeItem(SESSION_KEY);
  dashboard.classList.add("hidden");
  loginPanel.classList.remove("hidden");
  loginForm.reset();
  setStatus(loginStatus, "");
  document.querySelector("#admin-username").focus();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = String(loginForm.elements.namedItem("username").value).trim();
  const password = String(loginForm.elements.namedItem("password").value);
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    setStatus(loginStatus, "Invalid username or password.", "error");
    loginForm.elements.namedItem("password").value = "";
    loginForm.elements.namedItem("password").focus();
    return;
  }
  sessionStorage.setItem(SESSION_KEY, "authenticated");
  setStatus(loginStatus, "");
  showDashboard();
});

refreshButton.addEventListener("click", loadResponses);
logoutButton.addEventListener("click", showLogin);

if (sessionStorage.getItem(SESSION_KEY) === "authenticated") showDashboard();

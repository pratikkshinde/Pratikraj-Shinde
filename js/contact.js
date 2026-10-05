import { submitContactForm } from "./api.js";

const contactForm = document.querySelector("#contact-form");
const submitButton = document.querySelector("#contact-submit");
const formStatus = document.querySelector("#contact-status");
const fields = ["name", "email", "subject", "message"];
const fieldErrors = {
  name: "Please enter your name (at least 2 characters).",
  email: "Enter a valid email address.",
  subject: "Add a subject (at least 3 characters).",
  message: "Your message needs at least 10 characters."
};

function setStatus(message, state = "") {
  formStatus.textContent = message;
  if (state) formStatus.dataset.state = state;
  else delete formStatus.dataset.state;
}

function validateField(field) {
  const input = contactForm.elements.namedItem(field);
  const error = document.querySelector(`#${field}-error`);
  const value = input.value.trim();
  let message = "";
  if (!value || !input.checkValidity()) message = fieldErrors[field];
  else if (field === "name" && value.length < 2) message = fieldErrors.name;
  else if (field === "subject" && value.length < 3) message = fieldErrors.subject;
  else if (field === "message" && value.length < 10) message = fieldErrors.message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
  return !message;
}

fields.forEach((field) => {
  const input = contactForm.elements.namedItem(field);
  input.addEventListener("input", () => {
    if (input.hasAttribute("aria-invalid")) validateField(field);
    if (formStatus.dataset.state === "error") setStatus();
  });
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    setStatus("Please check the fields marked below.", "error");
    contactForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(contactForm).entries());
  fields.forEach((field) => { data[field] = String(data[field]).trim(); });
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  submitButton.firstChild.textContent = "Sending... ";
  setStatus("Sending your note…");

  try {
    await submitContactForm(data);
    contactForm.reset();
    fields.forEach((field) => {
      contactForm.elements.namedItem(field).removeAttribute("aria-invalid");
      document.querySelector(`#${field}-error`).textContent = "";
    });
    setStatus("Message sent successfully! I’ll get back to you soon.", "success");
  } catch (error) {
    const message = error.message === "NETWORK_ERROR"
      ? "Network error. Please check your connection and try again."
      : error.message === "API_NOT_CONFIGURED"
        ? "Contact is not connected yet. Please email pratiksclg@gmail.com directly."
        : "Unable to send your message. Please try again or email pratiksclg@gmail.com.";
    setStatus(message, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    submitButton.firstChild.textContent = "Send your note ";
  }
});

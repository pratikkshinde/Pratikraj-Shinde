const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const desktopNavigation = window.matchMedia("(min-width: 900px)");
const searchButton = document.querySelector(".nav-search-button");
const searchDialog = document.querySelector("#nav-search-dialog");
const searchInput = document.querySelector("#nav-search-input");
const searchResults = document.querySelector("#nav-search-results");
const searchStatus = document.querySelector("#nav-search-status");

const greetingText = document.querySelector(".nav-greeting-text");
const greetingIcon = document.querySelector(".nav-greeting-icon");
const currentHour = new Date().getHours();
if (greetingText) greetingText.textContent = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";
if (greetingIcon) greetingIcon.textContent = currentHour >= 17 || currentHour < 6 ? "☾" : "☀";
window.setTimeout(() => {
  if (navPanel) navPanel.inert = false;
  const navElement = document.querySelector(".nav");
  if (navElement) navElement.classList.remove("is-intro");
}, 1500);

const searchIndex = [
  ...[...document.querySelectorAll("main section[id]")].map((section) => {
    const title = section.id.charAt(0).toUpperCase() + section.id.slice(1);
    return { title: title, category: "Section", href: `#${section.id}`, content: `${section.id} ${section.textContent}` };
  }).filter(Boolean),
  ...[...document.querySelectorAll(".project-card")].map((project) => {
    const heading = project.querySelector("h3");
    return heading ? { title: heading.textContent.trim(), category: "Project", href: "#projects", content: project.textContent } : null;
  }).filter(Boolean),
  { title: "pratiksclg@gmail.com", category: "Email", href: "mailto:pratiksclg@gmail.com", content: "email contact mail" },
  { title: "pratikkshinde", category: "GitHub", href: "https://github.com/pratikkshinde", content: "github code repo username social" },
  { title: "pratikraj-shinde-a398b7309", category: "LinkedIn", href: "https://www.linkedin.com/in/pratikraj-shinde-a398b7309/", content: "linkedin profile username social work" },
  { title: "pratikkshinde_", category: "Instagram", href: "https://instagram.com/pratikkshinde_", content: "instagram photo username social" }
];

function renderSearchResults() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = query
    ? searchIndex.filter((item) => `${item.title} ${item.category} ${item.content}`.toLocaleLowerCase().includes(query)).slice(0, 8)
    : [];
  searchResults.replaceChildren();
  matches.forEach((item) => {
    const result = document.createElement("li");
    const link = document.createElement("a");
    const title = document.createElement("span");
    const category = document.createElement("span");
    link.href = item.href;
    if (item.href.startsWith("http") || item.href.startsWith("mailto")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    title.className = "search-result-title";
    title.textContent = item.title;
    category.className = "search-result-category";
    category.textContent = item.category;
    link.append(title, category);
    result.append(link);
    searchResults.append(result);
  });
  searchStatus.textContent = !query
    ? "Type to search sections and projects."
    : matches.length
      ? `${matches.length} ${matches.length === 1 ? "result" : "results"}`
      : `No results for “${searchInput.value.trim()}”.`;
}

searchButton.addEventListener("click", () => {
  setMenuOpen(false);
  searchDialog.showModal();
  searchInput.value = "";
  renderSearchResults();
  searchInput.focus();
});

document.querySelector(".search-close").addEventListener("click", () => searchDialog.close());
searchInput.addEventListener("input", renderSearchResults);
searchDialog.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  searchDialog.close();
  searchButton.focus();
});
searchDialog.addEventListener("click", (event) => {
  if (event.target === searchDialog) searchDialog.close();
});
searchResults.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  searchDialog.close();
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (!target) return;
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
});

function setMenuOpen(open, returnFocus = false) {
  if (!menuToggle || !navPanel) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navPanel.classList.toggle("is-open", open);
  if (open && !desktopNavigation.matches) navPanel.querySelector("a")?.focus();
  if (!open && returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const wasMobileMenuOpen = !desktopNavigation.matches && menuToggle?.getAttribute("aria-expanded") === "true";
    setMenuOpen(false);
    
    if (link.hash === "#top") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!wasMobileMenuOpen) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  });
});

document.querySelectorAll('a[href="#top"]').forEach(link => {
  if (!link.classList.contains('nav-links')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

document.addEventListener("pointerdown", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") === "true" && !navPanel.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false, true);
  }
});

desktopNavigation.addEventListener("change", (event) => {
  if (event.matches) setMenuOpen(false);
});

const sectionNavigation = new Map();
navLinks.forEach((link) => sectionNavigation.set(link.hash, link));
const observedSections = [...document.querySelectorAll("main section[id], .hero")];
const homeLink = sectionNavigation.get("#top");

if ("IntersectionObserver" in window) {
  const visibleSections = new Set();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    const current = [...visibleSections].sort((first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top)[0];
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
    const activeLink = current?.classList.contains("hero") ? homeLink : sectionNavigation.get(`#${current?.id}`);
    activeLink?.setAttribute("aria-current", "location");
  }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
} else {
  homeLink?.setAttribute("aria-current", "location");
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

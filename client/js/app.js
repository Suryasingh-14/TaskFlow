// TaskFlow client logic — your turn!
// Suggested first steps (Milestone 1, in-memory data):
// 1. Keep tasks in an array: let tasks = [];
// 2. Switch views when a .nav-item is clicked (toggle the `hidden` attribute on .view sections)
// 3. Open #task-modal with .showModal() when "Add task" is clicked
// 4. On form submit: validate title, push to tasks, re-render board + list
// ---- Starter code: view switching + modal, so you can see every page ----
// Replace or extend this as you learn. Real task logic goes below.

/* ==========================================================================
   TaskFlow: app.js

   PART 1: STARTER CODE (already written for you; read it and learn from it)
           navbar, page switching, theme toggle, modal, scroll effects.
   PART 2: YOUR TASK LOGIC (at the bottom; this is where you build)
   ========================================================================== */

// Tell CSS that JavaScript is running (scroll-reveal styles depend on this)
document.documentElement.classList.add("js");


/* --------------------------------------------------------------------------
   1. GRAB THE ELEMENTS WE NEED (one place, so they are easy to find)
   -------------------------------------------------------------------------- */
const navbar      = document.getElementById("navbar");
const navItems    = document.querySelectorAll(".nav-item");
const navPill     = document.getElementById("nav-pill");
const views       = document.querySelectorAll(".view");
const pageTitle   = document.getElementById("page-title");
const modal       = document.getElementById("task-modal");
const menuToggle  = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const progressBar = document.getElementById("scroll-progress");


/* --------------------------------------------------------------------------
   2. PAGES (VIEWS): show one section, hide the others
   -------------------------------------------------------------------------- */

// Slide the coral pill behind the active nav link
function movePill() {
  const active = document.querySelector(".nav-item.is-active");
  if (!active) return;
  navPill.style.width = active.offsetWidth + "px";
  navPill.style.transform = `translateX(${active.offsetLeft}px)`;
}

function closeMenu() {
  navbar.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

// name = "overview" | "board" | "tasks" | "calendar" | "activity"
function showView(name, scrollToTop = true) {
  // Unknown name (for example a typo in the URL)? Fall back to Overview.
  if (!document.getElementById("view-" + name)) name = "overview";

  // Show the matching section, hide the others
  views.forEach((view) => {
    view.hidden = view.dataset.viewName !== name;
  });

  // Highlight the matching nav link
  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === name);
  });

  // Update the big title
  pageTitle.textContent = name === "tasks" ? "My Tasks" : name[0].toUpperCase() + name.slice(1);

  movePill();
  closeMenu();
  if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
}

// Clicking a nav link changes the URL hash (#board); the hashchange event shows the page.
// This also makes the browser Back button work.
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    location.hash = item.dataset.view;
  });
});

window.addEventListener("hashchange", () => showView(location.hash.slice(1)));
window.addEventListener("resize", movePill);

showView(location.hash.slice(1) || "overview", false);   // first load: no scrolling
document.fonts.ready.then(movePill);                      // measure again once fonts load


/* --------------------------------------------------------------------------
   3. MOBILE MENU
   -------------------------------------------------------------------------- */
menuToggle.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});


/* --------------------------------------------------------------------------
   4. THEME: light / dark
   The initial theme is set by a small script in <head> (no white flash).
   Here we only handle the toggle button and remember the choice.
   -------------------------------------------------------------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  try {
    localStorage.setItem("taskflow-theme", theme);
  } catch (error) {
    // Storage can be blocked (private mode). The theme still works for this visit.
  }
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  // Browsers that support View Transitions cross-fade the whole page smoothly.
  // Others (and people who prefer reduced motion) just switch instantly.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduceMotion) {
    document.startViewTransition(() => applyTheme(next));
  } else {
    applyTheme(next);
  }
});

// Make the button label correct on first load
applyTheme(document.documentElement.getAttribute("data-theme") || "light");


/* --------------------------------------------------------------------------
   5. MODAL (add / edit form) AND HERO BUTTONS
   Logo, Create button and hero button all open the same form.
   -------------------------------------------------------------------------- */
function openTaskModal() {
  modal.showModal();
}

document.getElementById("logo-btn").addEventListener("click", openTaskModal);
document.getElementById("add-task-btn").addEventListener("click", openTaskModal);
document.getElementById("hero-create").addEventListener("click", openTaskModal);
document.getElementById("hero-board").addEventListener("click", () => {
  location.hash = "board";
});

document.getElementById("modal-close").addEventListener("click", () => modal.close());
document.getElementById("modal-cancel").addEventListener("click", () => modal.close());


/* --------------------------------------------------------------------------
   6. SCROLL EFFECTS: floating navbar and progress line
   requestAnimationFrame limits the work to once per screen refresh (smooth).
   -------------------------------------------------------------------------- */
let scrollTicking = false;

function onScroll() {
  const y = window.scrollY;

  // Navbar becomes a floating pill after a small scroll
  navbar.classList.toggle("is-scrolled", y > 24);

  // Progress line: 0 at the top, 1 at the bottom
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      onScroll();
      scrollTicking = false;
    });
  },
  { passive: true }
);

onScroll(); // set the correct state on first load


/* --------------------------------------------------------------------------
   7. REVEAL ON SCROLL: sections fade and slide up when they enter the screen
   -------------------------------------------------------------------------- */
const revealTargets = document.querySelectorAll(".panel, .toolbar, .table-wrap, .column, .cal-grid");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);   // reveal only once
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.transitionDelay = (index % 4) * 80 + "ms";   // small stagger
  revealObserver.observe(element);
});


/* --------------------------------------------------------------------------
   8. HELPER FOR YOU: count a number up smoothly
   Example (later):  animateNumber(document.getElementById("stat-total"), tasks.length);
   -------------------------------------------------------------------------- */
function animateNumber(element, to, duration = 900) {
  const from = parseInt(element.textContent, 10) || 0;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);        // fast start, soft landing
    element.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}


/* ==========================================================================
   PART 2: YOUR TASK LOGIC STARTS HERE
   See the build order I gave you: tasks array -> create -> render board ->
   renderAll() -> toasts -> drag and drop -> list -> edit -> filters ->
   dashboard -> calendar -> activity -> localStorage.
   ========================================================================== */
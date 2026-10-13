/* ==========================================================================
   TaskFlow: app.js  (for index.html)

   Needs common.js to be loaded first (theme and profile helpers live there).

   PART 1: STARTER CODE (already written for you; read it and learn from it)
           pages, greeting, profile menu, modal, hero effects, scroll effects.
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
const progressBar = document.getElementById("scroll-progress");
const profileWrap = document.getElementById("profile-wrap");
const avatarBtn   = document.getElementById("avatar-btn");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* --------------------------------------------------------------------------
   2. GREETING (replaces the "Overview" title)
   "Good evening, Surya" (or just "Good evening" if no name is saved yet)
   -------------------------------------------------------------------------- */
function getGreeting() {
  const hour = new Date().getHours();
  let part = "Good evening";
  if (hour < 12) part = "Good morning";
  else if (hour < 17) part = "Good afternoon";

  const firstName = getProfile().name.trim().split(/\s+/)[0];
  return firstName ? `${part}, ${firstName}` : part;
}


/* --------------------------------------------------------------------------
   3. PAGES (VIEWS): show one section, hide the others
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

  // Title: a greeting on Overview, the page name on the others
  if (name === "overview") {
    pageTitle.textContent = getGreeting();
  } else {
    pageTitle.textContent = name === "tasks" ? "My Tasks" : name[0].toUpperCase() + name.slice(1);
  }

  movePill();
  closeMenu();
  setProfileMenu(false);
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
document.fonts.ready.then(movePill);   // measure again once fonts load


/* --------------------------------------------------------------------------
   4. MOBILE MENU
   -------------------------------------------------------------------------- */
menuToggle.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});


/* --------------------------------------------------------------------------
   5. PROFILE MENU (avatar dropdown)
   "Edit profile" is a normal link to profile.html, so no JS is needed for it.
   -------------------------------------------------------------------------- */

// Fill the avatar and the menu with the saved profile
function renderProfile() {
  const profile = getProfile();
  paintAvatar(avatarBtn, profile);
  paintAvatar(document.getElementById("menu-avatar"), profile);
  document.getElementById("menu-name").textContent = profile.name || "Guest";
}

function setProfileMenu(open) {
  profileWrap.classList.toggle("is-open", open);
  avatarBtn.setAttribute("aria-expanded", String(open));
}

avatarBtn.addEventListener("click", (event) => {
  event.stopPropagation();   // so the "click outside" listener below does not close it at once
  setProfileMenu(!profileWrap.classList.contains("is-open"));
});

// Click anywhere else, or press Escape, to close the menu
document.addEventListener("click", (event) => {
  if (!profileWrap.contains(event.target)) setProfileMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setProfileMenu(false);
});

renderProfile();
showView(location.hash.slice(1) || "overview", false);   // first load: no scrolling


/* --------------------------------------------------------------------------
   6. MODAL (add / edit form) AND HERO BUTTONS
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
   7. HERO DEMO: the mini board tilts toward the mouse
   CSS reads the --rx / --ry variables we set here. Moving the mouse to the right
   edge turns the board to the right, and so on. On leave, the variables are
   removed and CSS glides the board back to its resting tilt.
   -------------------------------------------------------------------------- */
const demoWrap = document.querySelector(".hero-demo");
const demoBoard = document.querySelector(".demo");

if (demoWrap && demoBoard && !reduceMotion) {
  demoWrap.addEventListener("mousemove", (event) => {
    const box = demoWrap.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;    // -0.5 (left) ... 0.5 (right)
    const y = (event.clientY - box.top) / box.height - 0.5;    // -0.5 (top)  ... 0.5 (bottom)

    demoBoard.classList.add("is-tilting");
    demoBoard.style.setProperty("--ry", x * 14 + "deg");
    demoBoard.style.setProperty("--rx", -y * 10 + "deg");
  });

  demoWrap.addEventListener("mouseleave", () => {
    demoBoard.classList.remove("is-tilting");
    demoBoard.style.removeProperty("--ry");
    demoBoard.style.removeProperty("--rx");
  });
}


/* --------------------------------------------------------------------------
   8. SCROLL EFFECTS: floating navbar and progress line
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
   9. REVEAL ON SCROLL: sections fade and slide up when they enter the screen
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
   10. HELPER FOR YOU: count a number up smoothly
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
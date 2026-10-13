/* ==========================================================================
   TaskFlow: common.js
   Code shared by every page (index.html and profile.html):
     1. Light / dark theme toggle
     2. Profile helpers (read / save the profile, initials, avatar colour)
   This file must be loaded BEFORE app.js or profile.js.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. THEME: light / dark
   The first theme is set by a small script in <head> (so there is no white flash).
   Here we only handle the toggle button and remember the choice.
   -------------------------------------------------------------------------- */
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
  try {
    localStorage.setItem("taskflow-theme", theme);
  } catch (error) {
    // Storage can be blocked (private mode). The theme still works for this visit.
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    // Browsers with View Transitions cross-fade the whole page smoothly.
    // Others (and people who prefer reduced motion) switch instantly.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  });

  // Make the button label correct on first load
  applyTheme(document.documentElement.getAttribute("data-theme") || "light");
}


/* --------------------------------------------------------------------------
   2. PROFILE HELPERS
   The profile is saved in localStorage for now: { name: "Surya", color: "coral" }
   Later, when you add real accounts, this is the only place that needs to change.
   -------------------------------------------------------------------------- */
const PROFILE_KEY = "taskflow-profile";
const DEFAULT_PROFILE = { name: "", color: "coral" };

// Returns the saved profile, or the default one if nothing is saved yet
function getProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY));
    return Object.assign({}, DEFAULT_PROFILE, saved);
  } catch (error) {
    return Object.assign({}, DEFAULT_PROFILE);
  }
}

// Saves the profile. Returns true if it worked, false if storage is blocked.
function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    return false;
  }
}

// "Surya Pratap" -> "SP", "Surya" -> "S", "" -> "U" (for User)
function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  const letters = words.length === 1 ? words[0][0] : words[0][0] + words[words.length - 1][0];
  return letters.toUpperCase();
}

// Puts the initials and colour on an avatar element
function paintAvatar(element, profile) {
  element.dataset.color = profile.color;
  element.textContent = getInitials(profile.name);   // textContent: safe, never runs HTML
}
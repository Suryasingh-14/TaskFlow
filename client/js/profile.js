/* ==========================================================================
   TaskFlow: profile.js  (for profile.html)
   Edit the display name and avatar colour. Needs common.js loaded first.
   ========================================================================== */

const profileForm   = document.getElementById("profile-form");
const nameInput     = document.getElementById("profile-name");
const previewAvatar = document.getElementById("preview-avatar");
const previewName   = document.getElementById("preview-name");
const statusText    = document.getElementById("profile-status");
const colorRadios   = document.querySelectorAll('input[name="color"]');

// Which colour radio is selected right now?
function getSelectedColor() {
  const checked = document.querySelector('input[name="color"]:checked');
  return checked ? checked.value : "coral";
}

// Redraw the big preview from what is typed / selected (nothing is saved yet)
function renderPreview() {
  const draft = { name: nameInput.value, color: getSelectedColor() };
  paintAvatar(previewAvatar, draft);
  previewName.textContent = draft.name.trim() || "Guest";
}

// Load the saved profile into the form
const saved = getProfile();
nameInput.value = saved.name;
colorRadios.forEach((radio) => {
  radio.checked = radio.value === saved.color;
});
renderPreview();

// Live preview while the user types or picks a colour
nameInput.addEventListener("input", () => {
  statusText.textContent = "";
  renderPreview();
});
colorRadios.forEach((radio) => radio.addEventListener("change", () => {
  statusText.textContent = "";
  renderPreview();
}));

// Save
profileForm.addEventListener("submit", (event) => {
  event.preventDefault();   // stop the browser from reloading the page

  const profile = {
    name: nameInput.value.trim().slice(0, 40),
    color: getSelectedColor()
  };

  const ok = saveProfile(profile);
  statusText.textContent = ok
    ? "Saved. Your changes will show on every page."
    : "Could not save. Your browser is blocking storage.";
});
/* FRONTIER — Authentication interactions
   NOTE: This is the UI layer. Real auth must hit the backend
   (see /backend/auth) — never trust client-side validation alone. */

(function () {
  "use strict";

  const form = document.getElementById("login-form");
  const bioBtn = document.getElementById("biometric-btn");
  const overlay = document.getElementById("bio-overlay");
  const status = document.getElementById("bio-status");

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function goToDashboard() {
    document.body.style.transition = "opacity 600ms cubic-bezier(0.16,1,0.3,1)";
    document.body.style.opacity = "0";
    setTimeout(() => (window.location.href = "dashboard.html"), 520);
  }

  // --- Email / password (UI only; replace with real fetch to backend) ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    if (!email || !pass) return;
    // Demo: in production -> await fetch('/api/auth/login', {...})
    goToDashboard();
  });

  // --- Simulated FaceID cinematic sequence ---
  bioBtn.addEventListener("click", async () => {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    const stepKeys = [
      "auth.faceStep1",
      "auth.faceStep2",
      "auth.faceStep3",
      "auth.faceStep4",
    ];
    for (const key of stepKeys) {
      status.textContent = I18n.t(key);   // read at display time -> respects current language
      await wait(820);
    }

    overlay.classList.add("success");
    status.textContent = I18n.t("auth.faceConfirmed");
    await wait(900);
    goToDashboard();
  });
})();

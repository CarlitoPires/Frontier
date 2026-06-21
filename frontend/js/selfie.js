/* ============================================================
 *  LinguoBound — Victory Selfie + Web Share  (window.LBSelfie)
 *
 *  Triggered by bonus modules with content.triggerSelfieShare === true.
 *  Opens the camera (getUserMedia), stamps the "London Tourist" overlay
 *  onto the photo (canvas), and broadcasts it via the Web Share API
 *  (with a download fallback where sharing files isn't supported).
 *
 *  100% client-side / Spark-friendly. Degrades gracefully with no camera.
 * ============================================================ */

(function (global) {
  "use strict";

  let stream = null;

  function stopStream() {
    if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  }

  function drawOverlay(ctx, w, h, opts) {
    // Gold frame
    ctx.strokeStyle = "#cdb287";
    ctx.lineWidth = Math.max(6, Math.round(w * 0.012));
    const m = ctx.lineWidth;
    ctx.strokeRect(m, m, w - m * 2, h - m * 2);

    // Bottom gradient bar
    const barH = Math.round(h * 0.22);
    const grad = ctx.createLinearGradient(0, h - barH, 0, h);
    grad.addColorStop(0, "rgba(5,5,6,0)");
    grad.addColorStop(1, "rgba(5,5,6,0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, h - barH, w, barH);

    // Wordmark + line
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f4f4f2";
    ctx.font = "700 " + Math.round(w * 0.062) + "px Helvetica, Arial, sans-serif";
    ctx.fillText("LinguoBound", Math.round(w * 0.06), h - Math.round(barH * 0.42));

    ctx.fillStyle = "#cdb287";
    ctx.font = "500 " + Math.round(w * 0.034) + "px Helvetica, Arial, sans-serif";
    ctx.fillText(opts.tagline || "London Tourist — Survived Day 1", Math.round(w * 0.06), h - Math.round(barH * 0.18));
  }

  async function open(opts) {
    opts = opts || {};
    const modal = document.createElement("div");
    modal.className = "lb-selfie";
    modal.innerHTML =
      '<div class="lb-selfie-card glass">' +
        '<p class="eyebrow">' + (opts.eyebrow || "London Tourist") + "</p>" +
        '<h3 class="lb-selfie-title display">' + (opts.title || "Broadcast your victory") + "</h3>" +
        '<div class="lb-selfie-stage">' +
          '<video id="lb-cam" autoplay playsinline muted></video>' +
          '<canvas id="lb-canvas" hidden></canvas>' +
        "</div>" +
        '<div class="lb-selfie-actions">' +
          '<button class="btn" id="lb-cap">\uD83D\uDCF8 ' + (opts.captureLabel || "Capture") + "</button>" +
          '<button class="btn btn-gold" id="lb-share" hidden>' + (opts.shareLabel || "Share") + "</button>" +
          '<button class="btn" id="lb-retake" hidden>' + (opts.retakeLabel || "Retake") + "</button>" +
          '<button class="btn" id="lb-close">' + (opts.closeLabel || "Close") + "</button>" +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);

    const video = modal.querySelector("#lb-cam");
    const canvas = modal.querySelector("#lb-canvas");
    const capBtn = modal.querySelector("#lb-cap");
    const shareBtn = modal.querySelector("#lb-share");
    const retakeBtn = modal.querySelector("#lb-retake");
    const closeBtn = modal.querySelector("#lb-close");
    let shot = null;
    let hasCamera = false;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      video.srcObject = stream;
      hasCamera = true;
    } catch (e) {
      video.hidden = true; // no camera -> generated victory card instead
    }

    function capture() {
      const w = (hasCamera && video.videoWidth) ? video.videoWidth : 1080;
      const h = (hasCamera && video.videoHeight) ? video.videoHeight : 1080;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (hasCamera) {
        ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1);   // un-mirror selfie
        ctx.drawImage(video, 0, 0, w, h); ctx.restore();
      } else {
        const bg = ctx.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, "#16181d"); bg.addColorStop(1, "#050506");
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      }
      drawOverlay(ctx, w, h, opts);
      canvas.toBlob((b) => { shot = b; }, "image/jpeg", 0.92);
      canvas.hidden = false; video.hidden = true;
      stopStream();
      capBtn.hidden = true; shareBtn.hidden = false; retakeBtn.hidden = !hasCamera;
    }

    async function share() {
      if (!shot) return;
      const file = new File([shot], "linguobound-london.jpg", { type: "image/jpeg" });
      const text = opts.shareText || "I survived my first day in London with LinguoBound! 🇬🇧";
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "LinguoBound", text: text }); } catch (e) { /* user cancelled */ }
      } else {
        const url = URL.createObjectURL(shot);
        const a = document.createElement("a");
        a.href = url; a.download = "linguobound-london.jpg"; a.click();
        URL.revokeObjectURL(url);
      }
    }

    async function retake() {
      shot = null; canvas.hidden = true; shareBtn.hidden = true; retakeBtn.hidden = true; capBtn.hidden = false;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        video.srcObject = stream; video.hidden = false; hasCamera = true;
      } catch (e) { hasCamera = false; }
    }

    function close() { stopStream(); modal.remove(); }

    capBtn.addEventListener("click", capture);
    shareBtn.addEventListener("click", share);
    retakeBtn.addEventListener("click", retake);
    closeBtn.addEventListener("click", close);
  }

  global.LBSelfie = { open: open };
})(window);

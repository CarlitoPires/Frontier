/* FRONTIER — lightweight canvas Radar Chart (no dependencies).
   Renders the fluency profile with a cinematic ease-in sweep. */

function drawRadar(canvas, data, opts) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  // Cache the logical (CSS) size on first call. Without this, re-rendering
  // (e.g. on language change) would re-read the already-scaled canvas.width
  // and the chart would grow on every redraw.
  const size = canvas.__logicalSize || (canvas.__logicalSize = canvas.width);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2;
  const radius = size / 2 - 56;
  const n = data.length;
  const rings = opts.rings || 4;
  const gold = "#cdb287";
  const grid = "rgba(255,255,255,0.07)";

  function point(i, r) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  }

  let progress = 0;
  function frame() {
    progress = Math.min(1, progress + 0.025);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    ctx.clearRect(0, 0, size, size);

    // concentric grid
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    for (let ring = 1; ring <= rings; ring++) {
      const r = (radius * ring) / rings;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const [x, y] = point(i % n, r);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // spokes + labels
    ctx.fillStyle = "#8b8d8a";
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const [x, y] = point(i, radius);
      ctx.strokeStyle = grid;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      const [lx, ly] = point(i, radius + 26);
      ctx.fillText(data[i].label, lx, ly);
    }

    // data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const d = data[i % n];
      const r = radius * (d.value / 100) * eased;
      const [x, y] = point(i % n, r);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    const fill = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    fill.addColorStop(0, "rgba(205,178,135,0.30)");
    fill.addColorStop(1, "rgba(184,153,104,0.06)");
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // vertices
    for (let i = 0; i < n; i++) {
      const d = data[i];
      const r = radius * (d.value / 100) * eased;
      const [x, y] = point(i, r);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = gold;
      ctx.fill();
    }

    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

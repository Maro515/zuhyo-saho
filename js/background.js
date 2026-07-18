/* ==========================================================================
   Ambient "aurora constellation" — drifting luminous nodes joined by faint
   edges, reacting to the cursor with parallax + light threads. Pure canvas,
   no dependencies, DPR-aware, honours prefers-reduced-motion.
   ========================================================================== */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COLORS = [
    [58, 231, 255],  // cyan
    [106, 139, 255], // blue
    [185, 139, 255], // violet
    [255, 106, 217], // magenta
    [56, 242, 176],  // emerald
  ];
  let w = 0, h = 0, dpr = 1, nodes = [], raf = null, t = 0;
  const mouse = { x: -9999, y: -9999, px: 0, py: 0 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(104, Math.max(36, Math.round((w * h) / 20000)));
    seed(target);
  }

  function seed(n) {
    nodes = [];
    for (let i = 0; i < n; i++) {
      const c = COLORS[i % COLORS.length];
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.7 + 0.9,
        ph: Math.random() * Math.PI * 2,   // pulse phase
        depth: Math.random() * 0.8 + 0.3,  // parallax depth
        c,
      });
    }
  }

  const LINK = 138;   // px distance to draw an edge
  const MOUSE = 168;   // px cursor influence radius

  function frame() {
    t += 0.016;
    // ease parallax offset toward the mouse
    mouse.px += ((mouse.x === -9999 ? w / 2 : mouse.x) - w / 2 - mouse.px) * 0.04;
    mouse.py += ((mouse.y === -9999 ? h / 2 : mouse.y) - h / 2 - mouse.py) * 0.04;

    ctx.clearRect(0, 0, w, h);

    // draw node-node edges
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = w + 20; else if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20; else if (a.y > h + 20) a.y = -20;
      }
      const ax = a.x + mouse.px * a.depth * 0.06;
      const ay = a.y + mouse.py * a.depth * 0.06;
      a._x = ax; a._y = ay;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const bx = b.x + mouse.px * b.depth * 0.06;
        const by = b.y + mouse.py * b.depth * 0.06;
        const dx = ax - bx, dy = ay - by;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.16;
          ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
    }

    // luminous nodes + light threads to the cursor
    for (const a of nodes) {
      const ax = a._x, ay = a._y;
      const pulse = reduce ? 1 : 1 + Math.sin(t * 1.4 + a.ph) * 0.28;
      const r = a.r * pulse;
      let near = 0;
      if (mouse.x > -9000) {
        const mdx = ax - mouse.x, mdy = ay - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE * MOUSE) {
          near = 1 - Math.sqrt(md2) / MOUSE;
          ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${near * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      // soft glow
      const glow = ctx.createRadialGradient(ax, ay, 0, ax, ay, r * 6);
      glow.addColorStop(0, `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${0.22 + near * 0.4})`);
      glow.addColorStop(1, `rgba(${a.c[0]},${a.c[1]},${a.c[2]},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ax, ay, r * 6, 0, Math.PI * 2);
      ctx.fill();
      // core
      ctx.beginPath();
      ctx.arc(ax, ay, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${0.6 + near * 0.4})`;
      ctx.fill();
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (reduce) frame(); }, 180);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
    else if (!reduce && !raf) frame();
  });

  resize();
  frame();
})();

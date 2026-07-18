/* 第6章：代謝解析 — 8 interactive widgets
   （脂質プロファイル・OCR呼吸曲線・クランプ・GTT/ITT・¹³C標識・空間代謝・呼吸商・寒冷刺激） */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const LIME = "#84cc16";
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f2f4f8" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function auc(pts, base) { let a = 0; for (let i = 1; i < pts.length; i++) { const dx = pts[i][0] - pts[i - 1][0]; a += dx * ((pts[i][1] - base) + (pts[i - 1][1] - base)) / 2; } return a; }

  // 1. Lipidomics — lipid class profile by diet ----------------------------
  W.lipidomics = function (container) {
    const classes = ["PC", "PE", "PS", "PI", "PG", "CL", "BMP", "LPC"];
    const control = [1.0, 0.8, 0.5, 0.55, 0.3, 0.35, 0.25, 0.4];
    const dha = [0.95, 0.85, 0.55, 0.6, 0.32, 0.5, 0.95, 0.42];
    const state = { diet: "ctrl" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("lp_d", "餌の条件", [{ v: "ctrl", label: "コントロール食" }, { v: "dha", label: "DHA添加食" }], "ctrl")}</div>
      <div class="widget-stage"><div id="lp_plot"></div></div>
      ${readoutRow([{ id: "lp_top", label: "最も増えた脂質クラス", value: "—" }, { id: "lp_note", label: "解釈", value: "—" }])}
      <p class="widget-note">脂質クラスごとの存在量プロファイル。<b>DHA添加食ではBMP</b>(bis(monoacylglycero)phosphate)などDHAを取り込む脂質クラスが顕著に増えます。クラス＋アシル基の2つの切り口で読みます。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, s = lightPanel(document.getElementById("lp_plot"), W2, H2, "#f6f8f1");
      const vals = state.diet === "ctrl" ? control : dha;
      const x0 = 44, y0 = 20, y1 = 196, bw = 40, gap = 12;
      add(s, "line", { x1: x0 - 6, y1: y1, x2: W2 - 12, y2: y1, stroke: "#b7bdc7", "stroke-width": 1.2 });
      vals.forEach((v, i) => {
        const bx = x0 + i * (bw + gap), bh = v * (y1 - y0);
        add(s, "rect", { x: bx, y: y1 - bh, width: bw, height: bh, rx: 3, fill: LIME, opacity: 0.85 });
        // control ghost when DHA
        if (state.diet === "dha") add(s, "rect", { x: bx, y: y1 - control[i] * (y1 - y0), width: bw, height: control[i] * (y1 - y0), rx: 3, fill: "none", stroke: "#9aa6b4", "stroke-dasharray": "3 3", "stroke-width": 1 });
        add(s, "text", { x: bx + bw / 2, y: y1 + 15, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: classes[i] });
      });
      add(s, "text", { x: 14, y: (y0 + y1) / 2, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", "font-weight": 700, transform: `rotate(-90 14 ${(y0 + y1) / 2})`, text: "相対存在量" });
      setReadout("lp_top", state.diet === "ctrl" ? "PC（対照）" : "BMP（DHA食で増加）");
      setReadout("lp_note", state.diet === "ctrl" ? "基準プロファイル" : "アシル基にDHAを含む脂質が増加");
    }
    bindSeg("lp_d", (v) => { state.diet = v; draw(); });
    draw();
  };

  // 2. Seahorse — OCR trace with drug injections ---------------------------
  W.seahorse = function (container) {
    const state = { m: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("sh_m", "ミトコンドリア機能", 0.4, 1.6, 0.05, state.m, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="sh_plot"></div></div>
      ${readoutRow([{ id: "sh_b", label: "基礎呼吸", value: "—" }, { id: "sh_a", label: "ATP産生", value: "—" }, { id: "sh_x", label: "最大呼吸", value: "—" }, { id: "sh_s", label: "予備呼吸能", value: "—" }])}
      <p class="widget-note">OCR経時変化。<b>オリゴマイシン</b>(ATP合成阻害)で↓、<b>FCCP</b>(脱共役)で最大呼吸へ↑、<b>ロテノン</b>(呼吸鎖阻害)で非ミトコンドリア呼吸へ↓。差分から各指標を算出します。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("sh_plot"), { width: 460, height: 270, xDomain: [0, 100], yDomain: [0, 130], xTicks: 5, yTicks: 5, xLabel: "時間 (min)", yLabel: "OCR (pmol/min)", xFmt: (v) => v, yFmt: (v) => v });
      const m = state.m, nonMito = 12, basal = 45 + 15 * m, postOligo = clamp(basal - 30 * m, nonMito + 3, basal), maxResp = basal + 40 * m;
      function level(t) { if (t < 20) return basal; if (t < 45) return postOligo; if (t < 70) return maxResp; return nonMito; }
      const pts = []; for (let t = 0; t <= 100; t += 2.5) { const rng = CK.makeRng(600 + t); pts.push([t, level(t) + (rng() - 0.5) * 2.5]); }
      [20, 45, 70].forEach((tx) => CK.vline(ctx, tx, { stroke: "#c7cce0", "stroke-dasharray": "4 3" }));
      CK.textPx(ctx, ctx.x(20), ctx.margin.top + 10, "Oligo", { "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: "Oligo" });
      CK.textPx(ctx, ctx.x(45), ctx.margin.top + 10, "FCCP", { "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: "FCCP" });
      CK.textPx(ctx, ctx.x(70), ctx.margin.top + 10, "Rot/AA", { "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: "Rot/AA" });
      CK.line(ctx, pts, { stroke: LIME, "stroke-width": 2.4 });
      pts.filter((p, i) => i % 2 === 0).forEach((p) => CK.dot(ctx, p[0], p[1], { r: 2.6, fill: LIME, opacity: 0.7 }));
      setReadout("sh_b", (basal - nonMito).toFixed(0) + " ");
      setReadout("sh_a", (basal - postOligo).toFixed(0) + " ");
      setReadout("sh_x", (maxResp - nonMito).toFixed(0) + " ");
      setReadout("sh_s", (maxResp - basal).toFixed(0) + " ");
    }
    bindSlider("sh_m", (v) => "×" + v.toFixed(2), (v) => { state.m = v; draw(); });
    draw();
  };

  // 3. Clamp — HIEC glucose infusion rate ----------------------------------
  W.clamp = function (container) {
    const state = { s: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("cl_s", "インスリン感受性", 0.2, 1.5, 0.05, state.s, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="cl_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#84cc16"></span>GIR</span><span class="li"><span class="sw" style="background:#5b8bff"></span>血糖(目標=一定)</span></div></div>
      ${readoutRow([{ id: "cl_g", label: "定常GIR", value: "—" }, { id: "cl_i", label: "インスリン感受性", value: "—" }])}
      <p class="widget-note">高インスリン正常血糖クランプ。血糖を目標(青・一定)に保つのに必要な<b>グルコース注入速度(GIR)</b>が定常値に達します。<b>GIRが高いほどインスリンがよく効いている</b>＝感受性が高い。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("cl_plot"), { width: 460, height: 260, xDomain: [0, 120], yDomain: [0, 45], xTicks: 6, yTicks: 5, xLabel: "クランプ開始からの時間 (min)", yLabel: "GIR (mg/kg/min)", xFmt: (v) => v, yFmt: (v) => v });
      const GIRss = 28 * state.s;
      const pts = []; for (let t = 0; t <= 120; t += 2) pts.push([t, GIRss * (1 - Math.exp(-t / 22))]);
      // euglycemia line (scaled to fit): show glucose held constant near top
      const glu = []; for (let t = 0; t <= 120; t += 2) { const rng = CK.makeRng(700 + t); glu.push([t, 38 + (rng() - 0.5) * 1.5]); }
      CK.line(ctx, glu, { stroke: "#5b8bff", "stroke-width": 1.8, "stroke-dasharray": "5 4" });
      CK.line(ctx, pts, { stroke: LIME, "stroke-width": 2.6 });
      CK.dot(ctx, 120, GIRss * (1 - Math.exp(-120 / 22)), { r: 5, fill: LIME });
      setReadout("cl_g", GIRss.toFixed(0) + " mg/kg/min");
      setReadout("cl_i", state.s > 1.05 ? "高い（よく効く）" : state.s < 0.6 ? "低い（インスリン抵抗性）" : "中程度");
    }
    bindSlider("cl_s", (v) => "×" + v.toFixed(2), (v) => { state.s = v; draw(); });
    draw();
  };

  // 4. GTT / ITT — glucose tolerance curves --------------------------------
  W.gtt = function (container) {
    const state = { mode: "gtt", r: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("gt_m", "検査", [{ v: "gtt", label: "GTT(ブドウ糖負荷)" }, { v: "itt", label: "ITT(インスリン負荷)" }], "gtt")}${sliderRow("gt_r", "インスリン抵抗性", 0, 1, 0.05, state.r, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="gt_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#84cc16"></span>被験群</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>対照(点線)</span></div></div>
      ${readoutRow([{ id: "gt_p", label: "ピーク/最低値", value: "—" }, { id: "gt_a", label: "AUC(相対)", value: "—" }])}
      <p class="widget-note">血糖の経時変化。GTTでは<b>ピークが高く戻りが遅い(AUC大)＝耐糖能低下</b>。ITTでは<b>血糖降下が小さい＝インスリン抵抗性</b>。点線は対照です。</p>`;
    function gttCurve(r) { const A = 5 + 8 * r, tp = 15 + 22 * r; const pts = []; for (let t = 0; t <= 120; t += 2) pts.push([t, 6 + A * (t / tp) * Math.exp(1 - t / tp)]); return pts; }
    function ittCurve(r) { const D = 4 * (1 - 0.6 * r); const pts = []; for (let t = 0; t <= 60; t += 1) pts.push([t, 6 - D * (t / 25) * Math.exp(1 - t / 25)]); return pts; }
    function draw() {
      const isG = state.mode === "gtt";
      const ctx = CK.plot(document.getElementById("gt_plot"), { width: 460, height: 260, xDomain: [0, isG ? 120 : 60], yDomain: [0, isG ? 20 : 8], xTicks: isG ? 6 : 6, yTicks: 5, xLabel: "時間 (min)", yLabel: "血糖 (mmol/L)", xFmt: (v) => v, yFmt: (v) => v });
      const cur = isG ? gttCurve(state.r) : ittCurve(state.r);
      const ctrl = isG ? gttCurve(0) : ittCurve(0);
      CK.line(ctx, ctrl, { stroke: "#9aa6b4", "stroke-width": 2, "stroke-dasharray": "4 3" });
      CK.line(ctx, cur, { stroke: LIME, "stroke-width": 2.6 });
      cur.filter((p, i) => i % 4 === 0).forEach((p) => CK.dot(ctx, p[0], p[1], { r: 2.8, fill: LIME, opacity: 0.75 }));
      if (isG) { const pk = Math.max.apply(null, cur.map((p) => p[1])); setReadout("gt_p", "ピーク " + pk.toFixed(1) + " mmol/L"); setReadout("gt_a", auc(cur, 6).toFixed(0)); }
      else { const nd = Math.min.apply(null, cur.map((p) => p[1])); setReadout("gt_p", "最低値 " + nd.toFixed(1) + " mmol/L"); setReadout("gt_a", (-auc(cur, 6)).toFixed(0)); }
    }
    bindSeg("gt_m", (v) => { state.mode = v; draw(); });
    bindSlider("gt_r", (v) => (v * 100).toFixed(0) + "%", (v) => { state.r = v; draw(); });
    draw();
  };

  // 5. Metabolome — 13C mass isotopomer distribution -----------------------
  W.metabolome = function (container) {
    const state = { p: 0.15 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mb_p", "¹³C標識の取り込み", 0, 1, 0.05, state.p, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="mb_plot"></div></div>
      ${readoutRow([{ id: "mb_l", label: "標識された割合", value: "—" }, { id: "mb_pk", label: "主要アイソトポマー", value: "—" }])}
      <p class="widget-note">¹³C₆グルコースなどのトレーサー由来の<b>質量アイソトポマー分布(M+0〜M+6)</b>。標識(代謝の流れ)が進むほど、M+0(非標識)から高次のM+n(標識あり)へ分布がシフトします。</p>`;
    function draw() {
      const W2 = 440, H2 = 240, s = lightPanel(document.getElementById("mb_plot"), W2, H2, "#f6f8f1");
      const center = state.p * 6;
      const w = []; let sum = 0;
      for (let k = 0; k <= 6; k++) { const v = Math.exp(-Math.pow((k - center) / 1.25, 2)); w.push(v); sum += v; }
      const norm = w.map((v) => v / sum);
      const x0 = 44, y0 = 22, y1 = 196, bw = 40, gap = 14;
      add(s, "line", { x1: x0 - 6, y1: y1, x2: W2 - 12, y2: y1, stroke: "#b7bdc7", "stroke-width": 1.2 });
      norm.forEach((v, k) => {
        const bx = x0 + k * (bw + gap), bh = v * (y1 - y0) * 1.6;
        add(s, "rect", { x: bx, y: y1 - bh, width: bw, height: bh, rx: 3, fill: k === 0 ? "#9aa6b4" : LIME, opacity: 0.85 });
        add(s, "text", { x: bx + bw / 2, y: y1 + 15, "text-anchor": "middle", "font-size": 9.5, fill: "#616a7d", text: "M+" + k });
        add(s, "text", { x: bx + bw / 2, y: y1 - bh - 4, "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: (v * 100).toFixed(0) });
      });
      add(s, "text", { x: 14, y: (y0 + y1) / 2, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", "font-weight": 700, transform: `rotate(-90 14 ${(y0 + y1) / 2})`, text: "存在割合 (%)" });
      const labeled = (1 - norm[0]) * 100;
      let pk = 0; norm.forEach((v, k) => { if (v > norm[pk]) pk = k; });
      setReadout("mb_l", labeled.toFixed(0) + "%");
      setReadout("mb_pk", "M+" + pk);
    }
    bindSlider("mb_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.p = v; draw(); });
    draw();
  };

  // 6. Imaging mass spec — spatial molecule distribution -------------------
  W.msi = function (container) {
    const state = { mol: "gaba" };
    // hotspot centers (in normalized tissue coords) differ per molecule
    const spots = {
      gaba: [{ x: 0.5, y: 0.72, i: 1.0, r: 0.16 }, { x: 0.3, y: 0.4, i: 0.5, r: 0.14 }, { x: 0.7, y: 0.4, i: 0.5, r: 0.14 }],
      dopa: [{ x: 0.32, y: 0.34, i: 1.0, r: 0.13 }, { x: 0.68, y: 0.34, i: 1.0, r: 0.13 }],
    };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ms_m", "可視化する分子", [{ v: "gaba", label: "GABA (m/z 104)" }, { v: "dopa", label: "ドーパミン (m/z 154)" }], "gaba")}</div>
      <div class="widget-stage"><div id="ms_plot"></div></div>
      ${readoutRow([{ id: "ms_r", label: "強い脳領域", value: "—" }, { id: "ms_n", label: "検出", value: "—" }])}
      <p class="widget-note">同じ脳切片でも、<b>選ぶm/z(分子)で空間分布が全く異なります</b>。抗体を使わず質量電荷比だけで分子を可視化。色＝相対強度(青=低→赤=高)です。</p>`;
    function jet(t) { t = clamp(t, 0, 1); const r = Math.round(255 * clamp(1.5 - Math.abs(4 * t - 3), 0, 1)); const g = Math.round(255 * clamp(1.5 - Math.abs(4 * t - 2), 0, 1)); const b = Math.round(255 * clamp(1.5 - Math.abs(4 * t - 1), 0, 1)); return `rgb(${r},${g},${b})`; }
    function draw() {
      const W2 = 440, H2 = 230, s = darkPanel(document.getElementById("ms_plot"), W2, H2, "#05060c");
      const cx = 220, cy = 115, rx = 150, ry = 92;
      // clip to brain ellipse: draw pixels inside
      const sp = spots[state.mol], px = 10;
      for (let gx = cx - rx; gx <= cx + rx; gx += px) for (let gy = cy - ry; gy <= cy + ry; gy += px) {
        const nx = (gx - cx) / rx, ny = (gy - cy) / ry;
        if (nx * nx + ny * ny > 1) continue;
        const u = (gx - (cx - rx)) / (2 * rx), v = (gy - (cy - ry)) / (2 * ry);
        let inten = 0.05;
        sp.forEach((h) => { inten += h.i * Math.exp(-(Math.pow(u - h.x, 2) + Math.pow(v - h.y, 2)) / (2 * h.r * h.r)); });
        inten = clamp(inten, 0, 1);
        add(s, "rect", { x: gx, y: gy, width: px - 0.5, height: px - 0.5, fill: jet(inten), opacity: 0.85 });
      }
      add(s, "ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, fill: "none", stroke: "#2a3550", "stroke-width": 1.5 });
      setReadout("ms_r", state.mol === "gaba" ? "淡蒼球・黒質(下部)" : "線条体(左右上部)");
      setReadout("ms_n", state.mol === "gaba" ? "GABA分布" : "ドーパミン分布");
    }
    bindSeg("ms_m", (v) => { state.mol = v; draw(); });
    draw();
  };

  // 7. Metabolic cage — respiratory quotient -------------------------------
  W.metaboliccage = function (container) {
    const state = { fuel: 0.5 }; // 0 fat -> 1 carb
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mc_f", "燃焼している栄養素 (脂肪⇔糖質)", 0, 1, 0.05, state.fuel, (v) => v < 0.33 ? "脂肪寄り" : v > 0.66 ? "糖質寄り" : "混合")}</div>
      <div class="widget-stage"><div id="mc_plot"></div></div>
      ${readoutRow([{ id: "mc_rq", label: "呼吸商 RQ (=VCO₂/VO₂)", value: "—" }, { id: "mc_f2", label: "主な燃料", value: "—" }])}
      <p class="widget-note">VO₂は一定でも、<b>糖質を燃やすほどVCO₂が増え、RQ=VCO₂/VO₂が0.7(脂肪)→1.0(糖質)へ</b>上がります。0.7に近いほど脂肪燃焼優位です。</p>`;
    function draw() {
      const W2 = 440, H2 = 240, s = lightPanel(document.getElementById("mc_plot"), W2, H2, "#f6f8f1");
      const RQ = 0.7 + 0.3 * state.fuel;
      const vo2 = 1.0, vco2 = vo2 * RQ;
      const bx = 90, y1 = 190, maxh = 150, bw = 60;
      [{ x: bx, v: vo2, lab: "VO₂", col: "#5b8bff" }, { x: bx + 130, v: vco2, lab: "VCO₂", col: LIME }].forEach((b) => {
        const bh = b.v * maxh;
        add(s, "rect", { x: b.x, y: y1 - bh, width: bw, height: bh, rx: 3, fill: b.col, opacity: 0.85 });
        add(s, "text", { x: b.x + bw / 2, y: y1 + 16, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", text: b.lab });
        add(s, "text", { x: b.x + bw / 2, y: y1 - bh - 5, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: b.v.toFixed(2) });
      });
      // RQ scale
      const sx0 = 280, sx1 = 410, sy = 90;
      add(s, "line", { x1: sx0, y1: sy, x2: sx1, y2: sy, stroke: "#b7bdc7", "stroke-width": 3 });
      [0.7, 0.85, 1.0].forEach((t) => { const x = sx0 + (t - 0.7) / 0.3 * (sx1 - sx0); add(s, "text", { x: x, y: sy + 18, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: t.toFixed(2) }); });
      const mx = sx0 + (RQ - 0.7) / 0.3 * (sx1 - sx0);
      add(s, "circle", { cx: mx, cy: sy, r: 7, fill: "#ef5350" });
      add(s, "text", { x: (sx0 + sx1) / 2, y: 56, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: "RQ = " + RQ.toFixed(2) });
      add(s, "text", { x: sx0, y: 74, "font-size": 8.5, fill: "#8a93a8", text: "脂肪" });
      add(s, "text", { x: sx1 - 18, y: 74, "font-size": 8.5, fill: "#8a93a8", text: "糖質" });
      setReadout("mc_rq", RQ.toFixed(2));
      setReadout("mc_f2", RQ < 0.78 ? "脂肪燃焼が優位" : RQ > 0.92 ? "糖質燃焼が優位" : "糖・脂肪の混合");
    }
    bindSlider("mc_f", (v) => v < 0.33 ? "脂肪寄り" : v > 0.66 ? "糖質寄り" : "混合", (v) => { state.fuel = v; draw(); });
    draw();
  };

  // 8. Cold tolerance test — body temp under 4C ----------------------------
  W.coldtest = function (container) {
    const state = { bat: 0.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ct_b", "褐色脂肪の機能", 0, 1, 0.05, state.bat, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ct_plot"></div></div>
      ${readoutRow([{ id: "ct_t", label: "6時間後の体温", value: "—" }, { id: "ct_j", label: "褐色脂肪の評価", value: "—" }])}
      <p class="widget-note">4℃の寒冷刺激下での体温の経時変化。<b>褐色脂肪が機能していれば熱を産生して体温を維持</b>できますが、機能が低下すると熱を作れず体温が下がります。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ct_plot"), { width: 460, height: 260, xDomain: [0, 6], yDomain: [28, 39], xTicks: 6, yTicks: 5, xLabel: "4℃低温室での経過時間 (h)", yLabel: "体温 (℃)", xFmt: (v) => v, yFmt: (v) => v });
      const drop = 6.5 * (1 - state.bat);
      const pts = []; for (let t = 0; t <= 6; t += 0.25) pts.push([t, 37.2 - drop * (1 - Math.exp(-t / 1.8))]);
      CK.hline(ctx, 34, { stroke: "#ef5350", "stroke-dasharray": "4 3" });
      CK.textPx(ctx, ctx.margin.left + 30, ctx.y(34) - 4, "低体温域", { "font-size": 9, fill: "#c77", text: "低体温の目安" });
      CK.line(ctx, pts, { stroke: LIME, "stroke-width": 2.6 });
      [0, 1, 2, 3, 4, 5, 6].forEach((t) => CK.dot(ctx, t, 37.2 - drop * (1 - Math.exp(-t / 1.8)), { r: 3.4, fill: LIME }));
      const finalT = 37.2 - drop * (1 - Math.exp(-6 / 1.8));
      setReadout("ct_t", finalT.toFixed(1) + " ℃");
      setReadout("ct_j", finalT > 35.5 ? "良好（体温を維持）" : finalT > 33.5 ? "やや低下" : "機能低下（体温維持できず）");
    }
    bindSlider("ct_b", (v) => (v * 100).toFixed(0) + "%", (v) => { state.bat = v; draw(); });
    draw();
  };
})();

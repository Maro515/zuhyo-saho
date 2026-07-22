/* 第12章 発展編 その他：先端装置のインタラクティブ図（前半 t51-t65）
   ローカルヘルパは本ファイル冒頭で共通定義。各widgetは W.<name> を登録する。 */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const MAG = "#d946ef";
  const BLUE = "#3a7bd5";
  const ORANGE = "#f97316";
  const GREEN = "#1f9d6b";
  const GRAY = "#9aa6b4";

  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f6f8fb" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function txt(s, x, y, str, attrs) {
    return add(s, "text", Object.assign({ x: x, y: y, "font-size": 10, fill: "#616a7d", text: str }, attrs || {}));
  }
  function mix(c1, c2, t) {
    const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const a = p(c1), b = p(c2);
    const r = a.map((v, i) => Math.round(lerp(v, b[i], clamp(t, 0, 1))));
    return "#" + r.map((v) => v.toString(16).padStart(2, "0")).join("");
  }

// ==========================================================================
// 51. minflux — 局在化精度σ 対 光子数N（MINFLUX 1/N 対 カメラ型 1/√N）
// ==========================================================================
W.minflux = function (container) {
  const state = { N: 500, mode: "minflux" };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("mf_m", "方式", [{ v: "minflux", label: "MINFLUX" }, { v: "cam", label: "カメラ型(STORM/PALM)" }], "minflux")}
      ${sliderRow("mf_n", "1分子あたりの検出光子数 N", 50, 5000, 50, 500, (v) => v.toFixed(0) + " 光子")}
    </div>
    <div class="widget-stage"><div id="mf_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>MINFLUX（σ ∝ 1/N）</span><span class="li"><span class="sw" style="background:#3a7bd5"></span>カメラ型（σ ∝ 1/√N）</span></div></div>
    ${readoutRow([{ id: "mf_a", label: "MINFLUX σ", value: "—" }, { id: "mf_b", label: "カメラ型 σ", value: "—" }])}
    <p class="widget-note">方式を切り替え、光子数Nを動かしてください。カメラ型のσは<b>1/√N</b>でゆるやかに、MINFLUXのσは<b>1/N的に急峻</b>に下がって数nmに届きます。右の局在化点の散らばりが、精度に応じて小さな塊へ収束します。</p>`;
  const sigMin = (N) => clamp(900 / N + 0.5, 0.6, 60);       // MINFLUX ~ 1/N
  const sigCam = (N) => clamp(150 / Math.sqrt(N), 1.6, 60);  // camera ~ 1/√N
  const hash = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const gauss = (i) => (hash(i) + hash(i + 101) + hash(i + 211) - 1.5) * 1.4; // approx N(0,~1)
  function draw() {
    const w = 540, h = 300, s = lightPanel(document.getElementById("mf_plot"), w, h);
    // ---- left: sigma vs N curves ----
    const x0 = 52, y0 = 40, cw = 300, ph = 200, yMax = 30;
    const px = (N) => x0 + (N / 5000) * cw;
    const py = (sig) => y0 + ph - (clamp(sig, 0, yMax) / yMax) * ph;
    // grid + axes
    add(s, "line", { x1: x0, x2: x0 + cw, y1: y0 + ph, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: x0, x2: x0, y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    [0, 10, 20, 30].forEach((v) => {
      const y = py(v);
      add(s, "line", { x1: x0, x2: x0 + cw, y1: y, y2: y, stroke: "#eef1f6", "stroke-width": 1 });
      txt(s, x0 - 6, y + 3, String(v), { "text-anchor": "end", "font-size": 9 });
    });
    [0, 1000, 2000, 3000, 4000, 5000].forEach((N) => txt(s, px(N), y0 + ph + 14, String(N), { "text-anchor": "middle", "font-size": 9 }));
    txt(s, x0 + cw / 2, y0 + ph + 30, "1分子あたりの光子数 N", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 15, y0 + ph / 2, "局在化精度 σ (nm)", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 15 ${y0 + ph / 2})` });
    // curves
    let dMin = "", dCam = "";
    for (let N = 50; N <= 5000; N += 25) {
      dMin += (dMin ? " L " : "M ") + px(N).toFixed(1) + " " + py(sigMin(N)).toFixed(1);
      dCam += (dCam ? " L " : "M ") + px(N).toFixed(1) + " " + py(sigCam(N)).toFixed(1);
    }
    add(s, "path", { d: dCam, fill: "none", stroke: BLUE, "stroke-width": 2.6 });
    add(s, "path", { d: dMin, fill: "none", stroke: MAG, "stroke-width": 2.6 });
    // current N marker
    const sm = sigMin(state.N), sc = sigCam(state.N);
    add(s, "line", { x1: px(state.N), x2: px(state.N), y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-dasharray": "4 3" });
    add(s, "circle", { cx: px(state.N), cy: py(sc), r: 4.5, fill: BLUE });
    add(s, "circle", { cx: px(state.N), cy: py(sm), r: 4.5, fill: MAG });
    // ---- right: localization scatter cloud for selected method ----
    const bx = 388, by = 70, bs = 130;         // box
    const sig = state.mode === "minflux" ? sm : sc;
    const col = state.mode === "minflux" ? MAG : BLUE;
    add(s, "rect", { x: bx, y: by, width: bs, height: bs, rx: 6, fill: "#ffffff", stroke: "#dfe4ee", "stroke-width": 1.2 });
    txt(s, bx + bs / 2, by - 22, "局在化点の散らばり", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, bx + bs / 2, by - 8, state.mode === "minflux" ? "MINFLUX" : "カメラ型", { "text-anchor": "middle", "font-size": 10, fill: col, "font-weight": 700 });
    // scale: box spans +-20 nm
    const span = 20, scale = bs / (2 * span);
    // grid cross
    add(s, "line", { x1: bx + bs / 2, x2: bx + bs / 2, y1: by + bs / 2 - 6, y2: by + bs / 2 + 6, stroke: "#c7cce0" });
    add(s, "line", { x1: bx + bs / 2 - 6, x2: bx + bs / 2 + 6, y1: by + bs / 2, y2: by + bs / 2, stroke: "#c7cce0" });
    for (let i = 0; i < 60; i++) {
      const dx = gauss(i * 2 + 1) * sig, dy = gauss(i * 2 + 2) * sig;
      const cx = bx + bs / 2 + clamp(dx * scale, -bs / 2 + 3, bs / 2 - 3);
      const cy = by + bs / 2 + clamp(dy * scale, -bs / 2 + 3, bs / 2 - 3);
      add(s, "circle", { cx: cx, cy: cy, r: 2.4, fill: col, opacity: 0.55 });
    }
    // 10 nm scale bar
    add(s, "line", { x1: bx + 10, x2: bx + 10 + 10 * scale, y1: by + bs - 10, y2: by + bs - 10, stroke: "#5a6376", "stroke-width": 2.2 });
    txt(s, bx + 10 + 10 * scale / 2, by + bs - 14, "10 nm", { "text-anchor": "middle", "font-size": 8.5, fill: "#5a6376" });
    setReadout("mf_a", sm.toFixed(1) + " nm");
    setReadout("mf_b", sc.toFixed(1) + " nm");
  }
  bindSeg("mf_m", (v) => { state.mode = v; draw(); });
  bindSlider("mf_n", (v) => v.toFixed(0) + " 光子", (v) => { state.N = v; draw(); });
  draw();
};

// ==========================================================================
// 52. srs — ラマンシフト（波数）で分子を選ぶ：スペクトルと化学マップ
// ==========================================================================
W.srs = function (container) {
  const state = { shift: 2850, view: "spec" };
  const COMPS = [
    { name: "脂質 (CH₂)", peak: 2850, wid: 32, amp: 1.0, col: ORANGE },
    { name: "タンパク質 (CH₃)", peak: 2930, wid: 30, amp: 0.85, col: MAG },
    { name: "水 (OH)", peak: 3400, wid: 90, amp: 1.15, col: BLUE },
  ];
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("sr_v", "表示", [{ v: "spec", label: "ラマンスペクトル" }, { v: "map", label: "化学マップ" }], "spec")}
      ${sliderRow("sr_s", "ラマンシフト（波数）", 2750, 3500, 10, 2850, (v) => v.toFixed(0) + " cm⁻¹")}
    </div>
    <div class="widget-stage"><div id="sr_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#f97316"></span>脂質 2850</span><span class="li"><span class="sw" style="background:#d946ef"></span>タンパク質 2930</span><span class="li"><span class="sw" style="background:#3a7bd5"></span>水 3400</span></div></div>
    ${readoutRow([{ id: "sr_c", label: "強調される分子", value: "—" }, { id: "sr_i", label: "相対SRS信号", value: "—" }])}
    <p class="widget-note">波数を選ぶことが、見る分子を選ぶことです。<b>山に合わせると化学マップでその成分だけが明るく</b>なります。CH₂(2850)とCH₃(2930)は近接して裾が重なり、単一波数の像に別成分が混じりうることも見えます。</p>`;
  function sig(shift, c) { return c.amp * Math.exp(-0.5 * Math.pow((shift - c.peak) / c.wid, 2)); }
  function dominant(shift) {
    let best = COMPS[0], bv = -1;
    COMPS.forEach((c) => { const v = sig(shift, c); if (v > bv) { bv = v; best = c; } });
    return { comp: best, val: bv };
  }
  function drawSpec() {
    const w = 540, h = 288, s = lightPanel(document.getElementById("sr_plot"), w, h);
    const x0 = 50, y0 = 26, cw = 456, ph = 200, xMin = 2750, xMax = 3500;
    const px = (sh) => x0 + ((sh - xMin) / (xMax - xMin)) * cw;
    const py = (v) => y0 + ph - clamp(v, 0, 1.25) / 1.25 * ph;
    add(s, "line", { x1: x0, x2: x0 + cw, y1: y0 + ph, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: x0, x2: x0, y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    [2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500].forEach((sh) => txt(s, px(sh), y0 + ph + 14, String(sh), { "text-anchor": "middle", "font-size": 8.5 }));
    txt(s, x0 + cw / 2, y0 + ph + 30, "ラマンシフト（波数, cm⁻¹）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 14, y0 + ph / 2, "SRS信号（相対）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 14 ${y0 + ph / 2})` });
    // component curves + total
    COMPS.forEach((c) => {
      let d = "";
      for (let sh = xMin; sh <= xMax; sh += 5) d += (d ? " L " : "M ") + px(sh).toFixed(1) + " " + py(sig(sh, c)).toFixed(1);
      add(s, "path", { d: d, fill: "none", stroke: c.col, "stroke-width": 2, opacity: 0.9 });
      txt(s, px(c.peak), py(c.amp) - 6, c.name, { "text-anchor": "middle", "font-size": 9, fill: c.col, "font-weight": 700 });
    });
    // current shift line + dominant marker
    add(s, "line", { x1: px(state.shift), x2: px(state.shift), y1: y0, y2: y0 + ph, stroke: "#3a4256", "stroke-width": 1.8, "stroke-dasharray": "5 4" });
    const dm = dominant(state.shift);
    add(s, "circle", { cx: px(state.shift), cy: py(dm.val), r: 5, fill: dm.comp.col });
    txt(s, px(state.shift), y0 - 12, state.shift + " cm⁻¹", { "text-anchor": "middle", "font-size": 10, fill: "#3a4256", "font-weight": 700 });
  }
  function drawMap() {
    const w = 540, h = 288, s = lightPanel(document.getElementById("sr_plot"), w, h, "#f2f5fa");
    const dm = dominant(state.shift);
    // water background intensity ~ its signal
    const wSig = sig(state.shift, COMPS[2]);
    add(s, "rect", { x: 20, y: 20, width: 500, height: 248, rx: 8, fill: mix("#f2f5fa", BLUE, 0.10 + 0.5 * wSig) });
    txt(s, 30, 40, "化学マップ（" + state.shift + " cm⁻¹ で撮像）", { "font-size": 11, fill: "#3a4256", "font-weight": 700 });
    // cytoplasm blob (protein) — one big rounded region
    const pSig = sig(state.shift, COMPS[1]);
    add(s, "ellipse", { cx: 270, cy: 150, rx: 210, ry: 96, fill: mix("#eef1f6", MAG, 0.12 + 0.8 * pSig), stroke: "#e3e7f0", "stroke-width": 1 });
    txt(s, 270, 250, "細胞質＝タンパク質(CH₃)", { "text-anchor": "middle", "font-size": 9.5, fill: mix("#8a93a6", MAG, pSig), "font-weight": 700 });
    // lipid droplets (deterministic positions)
    const lSig = sig(state.shift, COMPS[0]);
    const drops = [[180, 130, 26], [330, 120, 22], [250, 175, 30], [380, 170, 18], [150, 175, 16], [300, 190, 14]];
    drops.forEach((d) => {
      add(s, "circle", { cx: d[0], cy: d[1], r: d[2], fill: mix("#f4ede6", ORANGE, 0.10 + 0.85 * lSig), stroke: mix("#e7dccf", ORANGE, lSig), "stroke-width": 1.2 });
    });
    txt(s, 430, 250, "脂肪滴＝脂質(CH₂)", { "text-anchor": "middle", "font-size": 9.5, fill: mix("#8a93a6", ORANGE, lSig), "font-weight": 700 });
    txt(s, 110, 250, "背景＝水(OH)", { "text-anchor": "middle", "font-size": 9.5, fill: mix("#8a93a6", BLUE, wSig), "font-weight": 700 });
    // highlight label
    add(s, "rect", { x: 360, y: 30, width: 152, height: 22, rx: 6, fill: dm.comp.col, opacity: 0.9 });
    txt(s, 436, 45, "強調中： " + dm.comp.name, { "text-anchor": "middle", "font-size": 10, fill: "#fff", "font-weight": 700 });
  }
  function draw() {
    if (state.view === "spec") drawSpec(); else drawMap();
    const dm = dominant(state.shift);
    setReadout("sr_c", dm.comp.name);
    setReadout("sr_i", (dm.val * 100).toFixed(0) + " %（最大比）");
  }
  bindSeg("sr_v", (v) => { state.view = v; draw(); });
  bindSlider("sr_s", (v) => v.toFixed(0) + " cm⁻¹", (v) => { state.shift = v; draw(); });
  draw();
};

// ==========================================================================
// 53. flim — 指数減衰 I(t)=I0 e^(−t/τ)：濃度に依らない寿命とFRET短縮
// ==========================================================================
W.flim = function (container) {
  const state = { tauD: 2.6, E: 0.4, mode: "free" };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("fl_m", "状態", [{ v: "free", label: "遊離ドナー" }, { v: "fret", label: "FRET" }], "free")}
      ${sliderRow("fl_t", "ドナー寿命 τ_D", 1.0, 4.0, 0.1, 2.6, (v) => v.toFixed(1) + " ns")}
      ${sliderRow("fl_e", "FRET効率 E（FRET時）", 0, 0.8, 0.05, 0.4, (v) => (v * 100).toFixed(0) + " %")}
    </div>
    <div class="widget-stage"><div id="fl_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>曲線A（明るい）</span><span class="li"><span class="sw" style="background:#3a7bd5"></span>曲線B（暗い）</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>単独ドナー(参照)</span></div></div>
    ${readoutRow([{ id: "fl_to", label: "観測寿命 τ", value: "—" }, { id: "fl_e", label: "FRET効率 E", value: "—" }])}
    <p class="widget-note">明るさ（I0）の違う2本の曲線A・Bを並べても、<b>寿命τが同じなら1/eに落ちる時刻は同じ</b>——これが「濃度に依らない」の意味です。FRETに切り替えて効率を上げると、τが短縮し点線の単独ドナーとの差が広がります。</p>`;
  function draw() {
    const w = 540, h = 296, s = lightPanel(document.getElementById("fl_plot"), w, h);
    const tauObs = state.mode === "fret" ? state.tauD * (1 - state.E) : state.tauD;
    const x0 = 52, y0 = 26, cw = 452, ph = 206, tMax = 12;
    const px = (t) => x0 + (t / tMax) * cw;
    const py = (I) => y0 + ph - clamp(I, 0, 1.05) / 1.05 * ph;
    // axes + grid
    add(s, "line", { x1: x0, x2: x0 + cw, y1: y0 + ph, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: x0, x2: x0, y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    [0, 0.25, 0.5, 0.75, 1.0].forEach((I) => {
      const y = py(I);
      add(s, "line", { x1: x0, x2: x0 + cw, y1: y, y2: y, stroke: "#eef1f6", "stroke-width": 1 });
      txt(s, x0 - 6, y + 3, I.toFixed(2), { "text-anchor": "end", "font-size": 9 });
    });
    for (let t = 0; t <= 12; t += 2) txt(s, px(t), y0 + ph + 14, String(t), { "text-anchor": "middle", "font-size": 9 });
    txt(s, x0 + cw / 2, y0 + ph + 30, "パルス後の時間 (ns)", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 14, y0 + ph / 2, "蛍光強度（規格化）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 14 ${y0 + ph / 2})` });
    // reference free-donor decay (dashed) when in FRET mode
    if (state.mode === "fret") {
      let dr = "";
      for (let t = 0; t <= 12; t += 0.1) dr += (dr ? " L " : "M ") + px(t).toFixed(1) + " " + py(1.0 * Math.exp(-t / state.tauD)).toFixed(1);
      add(s, "path", { d: dr, fill: "none", stroke: GRAY, "stroke-width": 1.8, "stroke-dasharray": "5 4" });
    }
    // curve A (I0=1.0) and curve B (I0=0.5), both same tauObs
    [{ I0: 1.0, col: MAG, lab: "A" }, { I0: 0.5, col: BLUE, lab: "B" }].forEach((c) => {
      let d = "";
      for (let t = 0; t <= 12; t += 0.1) d += (d ? " L " : "M ") + px(t).toFixed(1) + " " + py(c.I0 * Math.exp(-t / tauObs)).toFixed(1);
      add(s, "path", { d: d, fill: "none", stroke: c.col, "stroke-width": 2.6 });
      // 1/e marker on this curve
      add(s, "circle", { cx: px(tauObs), cy: py(c.I0 / Math.E), r: 4, fill: c.col });
    });
    // vertical line at tauObs (=common 1/e time)
    add(s, "line", { x1: px(tauObs), x2: px(tauObs), y1: y0, y2: y0 + ph, stroke: "#3a4256", "stroke-width": 1.6, "stroke-dasharray": "3 3" });
    txt(s, px(tauObs) + 5, y0 + 14, "t = τ（両曲線が I0/e に落ちる）", { "font-size": 10, fill: "#3a4256", "font-weight": 700 });
    setReadout("fl_to", tauObs.toFixed(2) + " ns");
    setReadout("fl_e", state.mode === "fret" ? (state.E * 100).toFixed(0) + " %（= 1 − τ_DA/τ_D）" : "0 %（遊離）");
  }
  bindSeg("fl_m", (v) => { state.mode = v; draw(); });
  bindSlider("fl_t", (v) => v.toFixed(1) + " ns", (v) => { state.tauD = v; draw(); });
  bindSlider("fl_e", (v) => (v * 100).toFixed(0) + " %", (v) => { state.E = v; draw(); });
  draw();
};

// ==========================================================================
// 54. adaptiveoptics — 波面収差 → PSFのボケ／ストレール比、補正ON/OFF
// ==========================================================================
W.adaptiveoptics = function (container) {
  const state = { rms: 0.30, corr: "off" };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("ao_c", "適応光学の補正", [{ v: "off", label: "補正OFF" }, { v: "on", label: "補正ON" }], "off")}
      ${sliderRow("ao_r", "波面収差（RMS）", 0, 0.6, 0.02, 0.30, (v) => v.toFixed(2) + " λ")}
    </div>
    <div class="widget-stage"><div id="ao_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>現在のPSF断面</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>無収差(理想)</span></div></div>
    ${readoutRow([{ id: "ao_w", label: "残留波面誤差", value: "—" }, { id: "ao_s", label: "ストレール比 S", value: "—" }])}
    <p class="widget-note">収差（波面誤差のRMS）を上げるとPSFのスポットが広がりピークが暗くなり、<b>ストレール比が指数関数的に落ちます</b>。補正をONにすると残留収差が小さくなり、スポットが再び鋭く明るくなってSが1に近づきます。</p>`;
  function draw() {
    const w = 540, h = 300, s = lightPanel(document.getElementById("ao_plot"), w, h);
    const wres = state.corr === "on" ? state.rms * 0.12 : state.rms;   // residual RMS (waves)
    const S = clamp(Math.exp(-Math.pow(2 * Math.PI * wres, 2)), 0.02, 1); // Maréchal
    const sig0 = 1.0;                        // ideal PSF width (arb)
    const sig = sig0 * (1 + 5.5 * wres);     // broadened width
    // ---- left: PSF spot render (concentric intensity) ----
    const cx = 150, cy = 150, R = 96;
    txt(s, cx, 40, "点像 (PSF)", { "text-anchor": "middle", "font-size": 11, fill: "#565f73", "font-weight": 700 });
    add(s, "rect", { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, rx: 8, fill: "#0e1524" });
    // ideal reference ring (faint)
    add(s, "circle", { cx: cx, cy: cy, r: 12, fill: "none", stroke: "#9aa6b4", "stroke-width": 1, "stroke-dasharray": "3 3", opacity: 0.6 });
    // draw PSF as concentric filled circles, intensity ~ S*exp(-r^2/(2 (sig*scale)^2))
    const scale = 22;                        // px per unit width
    const rings = 26;
    for (let k = rings; k >= 1; k--) {
      const r = (k / rings) * R;
      const rUnit = r / scale;
      const I = S * Math.exp(-(rUnit * rUnit) / (2 * sig * sig));
      if (I < 0.01) continue;
      add(s, "circle", { cx: cx, cy: cy, r: r, fill: mix("#0e1524", "#d946ef", clamp(I, 0, 1)) });
    }
    // bright core
    const coreI = S;
    add(s, "circle", { cx: cx, cy: cy, r: Math.max(3, 6 - wres * 4), fill: mix("#d946ef", "#ffffff", clamp(coreI, 0, 1) * 0.7) });
    txt(s, cx, cy + R + 20, state.corr === "on" ? "補正ON" : "補正OFF", { "text-anchor": "middle", "font-size": 10.5, fill: state.corr === "on" ? GREEN : ORANGE, "font-weight": 700 });
    // ---- right: PSF cross-section curve + Strehl bar ----
    const x0 = 300, y0 = 60, cw = 210, ph = 150;
    add(s, "line", { x1: x0, x2: x0 + cw, y1: y0 + ph, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: x0, x2: x0, y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    txt(s, x0 + cw / 2, y0 - 10, "PSF断面（ピーク＝ストレール比）", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700 });
    txt(s, x0 + cw / 2, y0 + ph + 16, "焦点面の位置", { "text-anchor": "middle", "font-size": 9.5, fill: "#7b8497" });
    const pxc = (u) => x0 + (u + 4) / 8 * cw;   // u in [-4,4]
    const pyc = (I) => y0 + ph - clamp(I, 0, 1) * ph;
    // ideal (dashed)
    let di = "";
    for (let u = -4; u <= 4; u += 0.1) di += (di ? " L " : "M ") + pxc(u).toFixed(1) + " " + pyc(Math.exp(-(u * u) / (2 * sig0 * sig0))).toFixed(1);
    add(s, "path", { d: di, fill: "none", stroke: GRAY, "stroke-width": 1.6, "stroke-dasharray": "5 4" });
    // current
    let dc = "";
    for (let u = -4; u <= 4; u += 0.1) dc += (dc ? " L " : "M ") + pxc(u).toFixed(1) + " " + pyc(S * Math.exp(-(u * u) / (2 * sig * sig))).toFixed(1);
    add(s, "path", { d: dc, fill: "none", stroke: MAG, "stroke-width": 2.6 });
    // Strehl bar
    const bx = x0, byb = y0 + ph + 34, bw = cw;
    txt(s, bx, byb - 6, "ストレール比 S", { "font-size": 10, fill: "#565f73", "font-weight": 700 });
    add(s, "rect", { x: bx, y: byb, width: bw, height: 16, rx: 6, fill: "#e4e8f0" });
    add(s, "rect", { x: bx, y: byb, width: bw * S, height: 16, rx: 6, fill: S > 0.8 ? GREEN : S > 0.4 ? MAG : ORANGE });
    txt(s, bx + bw + 4, byb + 13, S.toFixed(2), { "font-size": 10.5, fill: "#3a4256", "font-weight": 700 });
    setReadout("ao_w", wres.toFixed(3) + " λ" + (state.corr === "on" ? "（補正後）" : ""));
    setReadout("ao_s", S.toFixed(2) + (S > 0.8 ? "（良好）" : S > 0.4 ? "（劣化）" : "（大きく劣化）"));
  }
  bindSeg("ao_c", (v) => { state.corr = v; draw(); });
  bindSlider("ao_r", (v) => v.toFixed(2) + " λ", (v) => { state.rms = v; draw(); });
  draw();
};

// ==========================================================================
// 55. photoacoustic — 波長→吸収体スペクトル／深さ対分解能トレードオフ
// ==========================================================================
W.photoacoustic = function (container) {
  const state = { lam: 800, view: "spec" };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("pa_v", "表示", [{ v: "spec", label: "吸収スペクトル" }, { v: "depth", label: "深さ 対 分解能" }], "spec")}
      ${sliderRow("pa_l", "波長 λ", 600, 1000, 5, 800, (v) => v.toFixed(0) + " nm")}
    </div>
    <div class="widget-stage"><div id="pa_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#ef5350"></span>HbO₂（酸素化）</span><span class="li"><span class="sw" style="background:#3a7bd5"></span>Hb（脱酸素化）</span><span class="li"><span class="sw" style="background:#8a6d3b"></span>メラニン</span></div></div>
    ${readoutRow([{ id: "pa_c", label: "優勢な吸収体", value: "—" }, { id: "pa_s", label: "sO₂感度（|HbO₂−Hb|）", value: "—" }])}
    <p class="widget-note">波長を動かすと、HbO₂・Hb・メラニンの吸収スペクトル上を縦線が移動します。<b>HbとHbO₂は約800nmで交差（等吸収点）</b>し、そこから離れるほど酸素飽和度の感度が上がります。表示を切り替えると、分解能≈深さ/200のトレードオフが見えます。</p>`;
  const RED = "#ef5350", BRN = "#8a6d3b";
  const muHb = (l) => 0.85 * Math.exp(-Math.pow((l - 758) / 55, 2)) + 0.15;
  const muHbO2 = (l) => 0.28 + 0.52 / (1 + Math.exp(-(l - 830) / 42));
  const muMel = (l) => 0.9 * Math.exp(-(l - 600) / 450);
  function drawSpec() {
    const w = 540, h = 288, s = lightPanel(document.getElementById("pa_plot"), w, h);
    const x0 = 50, y0 = 24, cw = 456, ph = 202, xMin = 600, xMax = 1000, yMax = 1.05;
    const px = (l) => x0 + (l - xMin) / (xMax - xMin) * cw;
    const py = (v) => y0 + ph - clamp(v, 0, yMax) / yMax * ph;
    add(s, "line", { x1: x0, x2: x0 + cw, y1: y0 + ph, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: x0, x2: x0, y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    [600, 700, 800, 900, 1000].forEach((l) => txt(s, px(l), y0 + ph + 14, String(l), { "text-anchor": "middle", "font-size": 9 }));
    txt(s, x0 + cw / 2, y0 + ph + 30, "波長 λ (nm)", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 14, y0 + ph / 2, "吸収係数（相対）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 14 ${y0 + ph / 2})` });
    [[muHbO2, RED], [muHb, BLUE], [muMel, BRN]].forEach(([fn, col]) => {
      let d = "";
      for (let l = xMin; l <= xMax; l += 4) d += (d ? " L " : "M ") + px(l).toFixed(1) + " " + py(fn(l)).toFixed(1);
      add(s, "path", { d: d, fill: "none", stroke: col, "stroke-width": 2.4 });
    });
    // isosbestic marker ~ where Hb crosses HbO2
    let iso = 800;
    for (let l = 760; l <= 860; l += 1) { if (Math.abs(muHb(l) - muHbO2(l)) < Math.abs(muHb(iso) - muHbO2(iso))) iso = l; }
    add(s, "line", { x1: px(iso), x2: px(iso), y1: y0, y2: y0 + ph, stroke: GRAY, "stroke-width": 1.4, "stroke-dasharray": "4 3" });
    txt(s, px(iso), y0 + ph - 6, "等吸収点 ~" + iso + "nm", { "text-anchor": "middle", "font-size": 9, fill: "#7b8497" });
    // current wavelength
    add(s, "line", { x1: px(state.lam), x2: px(state.lam), y1: y0, y2: y0 + ph, stroke: "#3a4256", "stroke-width": 1.8, "stroke-dasharray": "5 4" });
    add(s, "circle", { cx: px(state.lam), cy: py(muHbO2(state.lam)), r: 4, fill: RED });
    add(s, "circle", { cx: px(state.lam), cy: py(muHb(state.lam)), r: 4, fill: BLUE });
    txt(s, px(state.lam), y0 - 10, state.lam + " nm", { "text-anchor": "middle", "font-size": 10, fill: "#3a4256", "font-weight": 700 });
  }
  function drawDepth() {
    const w = 540, h = 288, s = lightPanel(document.getElementById("pa_plot"), w, h);
    // log-log: depth (um) 100..70000 ; resolution (um) 0.5..500 ; R = depth/200
    const x0 = 58, y0 = 26, cw = 446, ph = 200;
    const dMin = 100, dMax = 70000, rMin = 0.3, rMax = 600;
    const lx = (d) => x0 + (Math.log10(d) - Math.log10(dMin)) / (Math.log10(dMax) - Math.log10(dMin)) * cw;
    const ly = (r) => y0 + ph - (Math.log10(r) - Math.log10(rMin)) / (Math.log10(rMax) - Math.log10(rMin)) * ph;
    add(s, "line", { x1: x0, x2: x0 + cw, y1: y0 + ph, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: x0, x2: x0, y1: y0, y2: y0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    [[100, "0.1mm"], [1000, "1mm"], [10000, "1cm"], [70000, "7cm"]].forEach(([d, lab]) => txt(s, lx(d), y0 + ph + 14, lab, { "text-anchor": "middle", "font-size": 9 }));
    [[1, "1µm"], [10, "10µm"], [100, "100µm"]].forEach(([r, lab]) => txt(s, x0 - 6, ly(r) + 3, lab, { "text-anchor": "end", "font-size": 9 }));
    txt(s, x0 + cw / 2, y0 + ph + 30, "撮像深さ", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 16, y0 + ph / 2, "空間分解能", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 16 ${y0 + ph / 2})` });
    // R = depth/200 line
    let d = "";
    for (let dep = dMin; dep <= dMax; dep *= 1.1) d += (d ? " L " : "M ") + lx(dep).toFixed(1) + " " + ly(clamp(dep / 200, rMin, rMax)).toFixed(1);
    add(s, "path", { d: d, fill: "none", stroke: MAG, "stroke-width": 2.6 });
    txt(s, lx(4000), ly(4000 / 200) - 8, "分解能 ≈ 深さ / 200", { "font-size": 10, fill: MAG, "font-weight": 700 });
    // regime markers
    const regimes = [
      { d: 700, r: 2, lab: "OR-PAM（光学分解能）", col: GREEN },
      { d: 3000, r: 45, lab: "AR-PAM（音響分解能）", col: BLUE },
      { d: 40000, r: 250, lab: "PACT（トモグラフィ）", col: ORANGE },
    ];
    regimes.forEach((g) => {
      add(s, "circle", { cx: lx(g.d), cy: ly(g.r), r: 6, fill: g.col });
      txt(s, lx(g.d), ly(g.r) - 12, g.lab, { "text-anchor": "middle", "font-size": 9, fill: g.col, "font-weight": 700 });
    });
    txt(s, x0 + 6, y0 + 14, "深いほど分解能は粗くなる（トレードオフ）", { "font-size": 10, fill: "#7b8497" });
  }
  function draw() {
    if (state.view === "spec") drawSpec(); else drawDepth();
    const a = muHbO2(state.lam), b = muHb(state.lam), m = muMel(state.lam);
    let name = "HbO₂", mx = a;
    if (b > mx) { mx = b; name = "Hb"; }
    if (m > mx) { mx = m; name = "メラニン"; }
    setReadout("pa_c", name);
    const sens = Math.abs(a - b);
    setReadout("pa_s", (sens * 100).toFixed(0) + " %" + (sens > 0.25 ? "（高い）" : sens > 0.1 ? "（中）" : "（等吸収点付近＝低い）"));
  }
  bindSeg("pa_v", (v) => { state.view = v; draw(); });
  bindSlider("pa_l", (v) => v.toFixed(0) + " nm", (v) => { state.lam = v; draw(); });
  draw();
};

// ==========================================================================
// 56. volumeem — 連続断面の積層・切片厚とz分解能・等方性のトレードオフ
// ==========================================================================
W.volumeem = function (container) {
  const state = { method: "fib", thick: 8 };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("ve_m", "方式", [{ v: "fib", label: "FIB-SEM（微細）" }, { v: "sbf", label: "SBF-SEM（広域）" }], "fib")}
      ${sliderRow("ve_t", "切片厚（z分解能）", 4, 100, 2, 8, (v) => v.toFixed(0) + " nm")}
    </div>
    <div class="widget-stage"><div id="ve_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>神経突起（真の形）</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>切片ごとの階段状の再構成</span></div></div>
    ${readoutRow([{ id: "ve_n", label: "断面枚数 / 撮像時間", value: "—" }, { id: "ve_i", label: "等方性（xy対z）", value: "—" }])}
    <p class="widget-note">切片厚を薄くすると同じ深さを撮るのに必要な<b>断面枚数（＝撮像時間）が急増</b>し、ボクセルは<b>等方（立方体）</b>に近づきます。厚くすると速い代わりにz方向がつぶれ、斜めの神経突起が<b>階段状に途切れる</b>様子が見えます。</p>`;
  const D = 400; // 撮像したい深さ（nm）
  function draw() {
    const w = 540, h = 292, s = lightPanel(document.getElementById("ve_plot"), w, h);
    const xy = state.method === "fib" ? 6 : 15; // xy画素サイズ(nm)
    const t = state.thick;
    const n = Math.max(1, Math.round(D / t));
    const iso = Math.min(xy, t) / Math.max(xy, t);
    // --- 左：側面から見た連続断面と神経突起 ---
    const x0 = 40, y0 = 42, SW = 250, SH = 208;
    txt(s, x0, y0 - 16, "側面から見た連続断面（縦＝z、深さ " + D + " nm）", { "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    const drawN = Math.min(n, 40);
    const sh = SH / drawN;
    for (let i = 0; i < drawN; i++) {
      const y = y0 + i * sh;
      add(s, "rect", { x: x0, y: y, width: SW, height: Math.max(0.6, sh - 0.6), fill: i % 2 ? "#eef1f6" : "#f6f8fb", stroke: "#e2e7f0", "stroke-width": 0.5 });
    }
    const curveX = (zz) => x0 + SW * (0.5 + 0.34 * Math.sin(zz * Math.PI * 1.6));
    let dTrue = "";
    for (let i = 0; i <= 100; i++) { const zz = i / 100; dTrue += (i ? " L " : "M ") + curveX(zz).toFixed(1) + " " + (y0 + zz * SH).toFixed(1); }
    // 階段状の再構成（切片ごとに1点でサンプル）
    for (let i = 0; i < drawN; i++) {
      const zc = (i + 0.5) / drawN;
      const y = y0 + i * sh;
      add(s, "rect", { x: curveX(zc) - 7, y: y, width: 14, height: Math.max(0.6, sh - 0.6), fill: GRAY, opacity: 0.5 });
    }
    add(s, "path", { d: dTrue, fill: "none", stroke: MAG, "stroke-width": 2.6, opacity: 0.92 });
    // --- 右：ボクセルの形と情報 ---
    const vx = 336, vy = 66, scale = 2.4;
    txt(s, vx, vy - 20, "ボクセルの形（xy × z）", { "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    const bw = clamp(xy * scale, 8, 60), bh = clamp(t * scale, 8, 150);
    add(s, "rect", { x: vx, y: vy, width: bw, height: bh, rx: 3, fill: mix("#f6f8fb", BLUE, 0.25), stroke: BLUE, "stroke-width": 1.6 });
    txt(s, vx + bw + 10, vy + 12, "xy = " + xy + " nm", { "font-size": 9.5, fill: "#565f73" });
    txt(s, vx + bw + 10, vy + 27, "z = " + t + " nm", { "font-size": 9.5, fill: "#565f73" });
    txt(s, vx, vy + bh + 16, iso > 0.8 ? "ほぼ立方体＝等方的" : "z方向に伸びた直方体＝異方的", { "font-size": 9.5, fill: iso > 0.8 ? GREEN : ORANGE, "font-weight": 700 });
    const ty = vy + Math.max(bh, 60) + 34;
    txt(s, vx, ty - 6, "相対撮像時間（体積一定）", { "font-size": 9.5, fill: "#565f73" });
    add(s, "rect", { x: vx, y: ty, width: 150, height: 12, rx: 5, fill: "#e4e8f0" });
    const tf = clamp(n / 100, 0, 1);
    add(s, "rect", { x: vx, y: ty, width: 150 * tf, height: 12, rx: 5, fill: tf > 0.7 ? "#ef5350" : MAG });
    setReadout("ve_n", n + " 枚 ／ 相対 " + (50 / t).toFixed(1) + " 倍", void 0);
    setReadout("ve_i", (iso * 100).toFixed(0) + " %" + (iso > 0.8 ? "（ほぼ等方）" : "（異方）"));
  }
  bindSeg("ve_m", (v) => { state.method = v; draw(); });
  bindSlider("ve_t", (v) => v.toFixed(0) + " nm", (v) => { state.thick = v; draw(); });
  draw();
};

// ==========================================================================
// 57. xfel — 損傷前回折・結晶枚数とデータ完全性・パルス幅と損傷
// ==========================================================================
W.xfel = function (container) {
  const state = { pulse: "short", n: 2000 };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("xf_p", "パルス幅", [{ v: "short", label: "短（損傷前）" }, { v: "long", label: "長（損傷あり）" }], "short")}
      ${sliderRow("xf_n", "統合した微結晶の枚数", 50, 20000, 50, 2000, (v) => v.toFixed(0) + " 枚")}
    </div>
    <div class="widget-stage"><div id="xf_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>回折スポット</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>分解能リング</span></div></div>
    ${readoutRow([{ id: "xf_c", label: "データ完全性", value: "—" }, { id: "xf_r", label: "多重度 / 分解能", value: "—" }])}
    <p class="widget-note">パルス幅を「長」にすると、外側（高分解能）のスポットが<b>放射線損傷で減衰</b>し分解能が悪化します。結晶枚数を増やすと逆空間が埋まって<b>データ完全性と多重度が上がり、やがて飽和</b>します。1枚だけでは構造にならない理由が分かります。</p>`;
  function draw() {
    const w = 540, h = 300, s = lightPanel(document.getElementById("xf_plot"), w, h);
    const long = state.pulse === "long";
    // --- 左：1枚の回折スナップショット ---
    const cx = 148, cy = 158, R = 116;
    add(s, "rect", { x: cx - R - 6, y: cy - R - 6, width: 2 * (R + 6), height: 2 * (R + 6), rx: 6, fill: "#fbfcfe", stroke: "#e2e7f0" });
    txt(s, cx, cy - R - 14, "1枚の回折スナップショット", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    [0.45, 0.72, 1.0].forEach((fr) => add(s, "circle", { cx: cx, cy: cy, r: R * fr, fill: "none", stroke: "#d7dced", "stroke-width": 1, "stroke-dasharray": "3 3" }));
    txt(s, cx, cy - R + 12, "高分解能→外側", { "text-anchor": "middle", "font-size": 8, fill: "#9aa6b4" });
    let rng = 987654321;
    const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff; };
    for (let i = 0; i < 130; i++) {
      const ang = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * R;
      const radFrac = rr / R;
      const damage = long ? Math.exp(-Math.pow(radFrac / 0.5, 2) * 1.6) : 1;
      const keep = rand();
      if (keep > damage * 0.95 + 0.03) continue;
      const px = cx + rr * Math.cos(ang), py = cy + rr * Math.sin(ang);
      const rad = clamp(1.2 + 2.0 * (1 - radFrac) * damage, 0.6, 3.0);
      add(s, "circle", { cx: px, cy: py, r: rad, fill: MAG, opacity: clamp(0.35 + 0.6 * damage, 0.12, 0.95) });
    }
    txt(s, cx, cy + R + 18, long ? "外側（高分解能）が損傷で減衰" : "外側まで鋭いスポット", { "text-anchor": "middle", "font-size": 9.5, fill: long ? ORANGE : GREEN, "font-weight": 700 });
    // --- 右：完全性 vs 枚数 ---
    const gx = 322, gy = 66, gw = 186, gh = 150;
    add(s, "line", { x1: gx, x2: gx + gw, y1: gy + gh, y2: gy + gh, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: gx, x2: gx, y1: gy, y2: gy + gh, stroke: "#c7cce0", "stroke-width": 1.2 });
    txt(s, gx + gw / 2, gy + gh + 30, "統合した枚数（対数）", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700 });
    txt(s, gx - 42, gy + gh / 2, "完全性 (%)", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 ${gx - 42} ${gy + gh / 2})` });
    const n0 = 2500;
    const lx = (nn) => gx + (Math.log10(nn) - Math.log10(50)) / (Math.log10(20000) - Math.log10(50)) * gw;
    const ly = (c) => gy + gh - c / 100 * gh;
    [0, 50, 100].forEach((v) => { add(s, "line", { x1: gx, x2: gx + gw, y1: ly(v), y2: ly(v), stroke: "#eef1f6", "stroke-width": 1 }); txt(s, gx - 6, ly(v) + 3, String(v), { "text-anchor": "end", "font-size": 9 }); });
    [50, 500, 5000, 20000].forEach((nn) => txt(s, lx(nn), gy + gh + 14, nn >= 1000 ? (nn / 1000) + "k" : String(nn), { "text-anchor": "middle", "font-size": 8.5 }));
    let d = "";
    for (let nn = 50; nn <= 20000; nn *= 1.08) { const c = 100 * (1 - Math.exp(-nn / n0)); d += (d ? " L " : "M ") + lx(nn).toFixed(1) + " " + ly(c).toFixed(1); }
    add(s, "path", { d: d, fill: "none", stroke: BLUE, "stroke-width": 2.6 });
    const comp = 100 * (1 - Math.exp(-state.n / n0));
    add(s, "line", { x1: lx(state.n), x2: lx(state.n), y1: gy, y2: gy + gh, stroke: "#c7cce0", "stroke-dasharray": "4 3" });
    add(s, "circle", { cx: lx(state.n), cy: ly(comp), r: 5, fill: BLUE });
    const mult = state.n / n0 * 3.5;
    const res = long ? 3.2 : 1.8;
    setReadout("xf_c", comp.toFixed(0) + " %" + (comp > 95 ? "（十分）" : comp > 80 ? "（やや不足）" : "（不足）"));
    setReadout("xf_r", "×" + mult.toFixed(1) + " / " + res.toFixed(1) + " Å" + (long ? "（損傷）" : ""));
  }
  bindSeg("xf_p", (v) => { state.pulse = v; draw(); });
  bindSlider("xf_n", (v) => v.toFixed(0) + " 枚", (v) => { state.n = v; draw(); });
  draw();
};

// ==========================================================================
// 58. saxs — I(q)曲線とGuinier領域・回転半径Rg
// ==========================================================================
W.saxs = function (container) {
  const state = { view: "iq", rg: 30 };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("sx_v", "表示", [{ v: "iq", label: "散乱曲線 I(q)（両対数）" }, { v: "gui", label: "Guinierプロット" }], "iq")}
      ${sliderRow("sx_r", "回転半径 Rg（粒子サイズ）", 12, 80, 1, 30, (v) => v.toFixed(0) + " Å")}
    </div>
    <div class="widget-stage"><div id="sx_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>散乱データ I(q)</span><span class="li"><span class="sw" style="background:#d946ef"></span>Guinier近似／有効範囲</span></div></div>
    ${readoutRow([{ id: "sx_s", label: "Guinierの傾き", value: "—" }, { id: "sx_q", label: "有効範囲 q·Rg≲1.3", value: "—" }])}
    <p class="widget-note">Rgを動かすと、粒子が大きいほどI(q)の落ち込みが<b>低q側へ寄る</b>ことが見えます。「Guinierプロット」に切り替えると低qが直線になり、その<b>傾きが −Rg²/3</b>、直線が成り立つのは<b>q·Rgが小さい範囲（紫の帯）だけ</b>だと分かります。</p>`;
  const I0 = 100;
  function sphereI(q, Rg) {
    const R = Rg * Math.sqrt(5 / 3), x = q * R;
    if (x < 1e-4) return I0;
    const f = 3 * (Math.sin(x) - x * Math.cos(x)) / (x * x * x);
    return I0 * f * f + 0.2; // 平坦なバックグラウンドを少し加える
  }
  function guinI(q, Rg) { return I0 * Math.exp(-q * q * Rg * Rg / 3); }
  function draw() {
    const w = 540, h = 292, s = lightPanel(document.getElementById("sx_plot"), w, h);
    const Rg = state.rg, qMin = 0.006, qMax = 0.5, qv = 1.3 / Rg;
    const mx = 60, my = 26, pw = 442, ph = 210;
    if (state.view === "iq") {
      const lxmin = Math.log10(qMin), lxmax = Math.log10(qMax), lymin = -1, lymax = 2.05;
      const X = (q) => mx + (Math.log10(q) - lxmin) / (lxmax - lxmin) * pw;
      const Y = (I) => my + ph - (Math.log10(Math.max(I, 1e-2)) - lymin) / (lymax - lymin) * ph;
      add(s, "line", { x1: mx, x2: mx + pw, y1: my + ph, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: mx, x2: mx, y1: my, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
      [0.01, 0.03, 0.1, 0.3].forEach((q) => { add(s, "line", { x1: X(q), x2: X(q), y1: my, y2: my + ph, stroke: "#eef1f6", "stroke-width": 1 }); txt(s, X(q), my + ph + 14, String(q), { "text-anchor": "middle", "font-size": 9 }); });
      [-1, 0, 1, 2].forEach((e) => { const lab = e === -1 ? "0.1" : e === 0 ? "1" : e === 1 ? "10" : "100"; txt(s, mx - 6, Y(Math.pow(10, e)) + 3, lab, { "text-anchor": "end", "font-size": 9 }); });
      txt(s, mx + pw / 2, my + ph + 30, "散乱ベクトル q（Å⁻¹、対数）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      txt(s, 15, my + ph / 2, "散乱強度 I(q)（対数）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 15 ${my + ph / 2})` });
      const xr = clamp(X(Math.min(qv, qMax)), mx, mx + pw);
      add(s, "rect", { x: mx, y: my, width: xr - mx, height: ph, fill: MAG, opacity: 0.09 });
      txt(s, (mx + xr) / 2, my + 12, "Guinier領域", { "text-anchor": "middle", "font-size": 9.5, fill: MAG, "font-weight": 700 });
      let d = "";
      for (let i = 0; i <= 220; i++) { const q = Math.pow(10, lxmin + (lxmax - lxmin) * i / 220); const I = sphereI(q, Rg); d += (d ? " L " : "M ") + X(q).toFixed(1) + " " + Y(I).toFixed(1); }
      add(s, "path", { d: d, fill: "none", stroke: BLUE, "stroke-width": 2.4 });
      let dg = "";
      for (let i = 0; i <= 140; i++) { const q = Math.pow(10, lxmin + (lxmax - lxmin) * i / 140); const I = guinI(q, Rg); if (I < 0.05) break; dg += (dg ? " L " : "M ") + X(q).toFixed(1) + " " + Y(I).toFixed(1); }
      add(s, "path", { d: dg, fill: "none", stroke: MAG, "stroke-width": 2, "stroke-dasharray": "5 4" });
    } else {
      const q2max = Math.pow(2.2 / Rg, 2);
      const X = (q2) => mx + q2 / q2max * pw;
      const yTop = Math.log(I0) + 0.3, yBot = Math.log(I0) - 3.2;
      const Y = (lnI) => my + ph - (lnI - yBot) / (yTop - yBot) * ph;
      add(s, "line", { x1: mx, x2: mx + pw, y1: my + ph, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: mx, x2: mx, y1: my, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
      txt(s, mx + pw / 2, my + ph + 30, "q²（Å⁻²）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      txt(s, 15, my + ph / 2, "ln I(q)", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 15 ${my + ph / 2})` });
      const q2v = Math.pow(1.3 / Rg, 2), xrv = clamp(X(q2v), mx, mx + pw);
      add(s, "rect", { x: mx, y: my, width: xrv - mx, height: ph, fill: MAG, opacity: 0.09 });
      txt(s, (mx + xrv) / 2, my + 12, "直線が成り立つ範囲", { "text-anchor": "middle", "font-size": 9.5, fill: MAG, "font-weight": 700 });
      for (let i = 0; i <= 60; i++) { const q2 = q2max * i / 60; const q = Math.sqrt(q2); const I = sphereI(q, Rg); if (I <= 0) continue; const lnI = Math.log(I); if (lnI < yBot) continue; add(s, "circle", { cx: X(q2), cy: Y(lnI), r: 2.4, fill: BLUE, opacity: 0.82 }); }
      const yA = Math.log(I0), slope = -Rg * Rg / 3;
      add(s, "path", { d: "M " + X(0).toFixed(1) + " " + Y(yA).toFixed(1) + " L " + X(q2max).toFixed(1) + " " + Y(yA + slope * q2max).toFixed(1), stroke: MAG, "stroke-width": 2, "stroke-dasharray": "5 4" });
      txt(s, mx + pw - 6, clamp(Y(yA + slope * q2max) - 6, my + 10, my + ph - 4), "傾き = −Rg²/3", { "text-anchor": "end", "font-size": 9.5, fill: MAG, "font-weight": 700 });
    }
    setReadout("sx_s", "−Rg²/3 = " + (-Rg * Rg / 3).toFixed(0) + " Å²");
    setReadout("sx_q", "q ≲ " + (1.3 / Rg).toFixed(3) + " Å⁻¹");
  }
  bindSeg("sx_v", (v) => { state.view = v; draw(); });
  bindSlider("sx_r", (v) => v.toFixed(0) + " Å", (v) => { state.rg = v; draw(); });
  draw();
};

// ==========================================================================
// 59. massphotometry — 質量ヒストグラムと単量体/二量体/四量体のピーク
// ==========================================================================
W.massphotometry = function (container) {
  const state = { dim: 30, mono: 60 };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${sliderRow("mp_d", "二量体の割合", 0, 80, 5, 30, (v) => v.toFixed(0) + " %")}
      ${sliderRow("mp_m", "単量体の質量", 20, 120, 5, 60, (v) => v.toFixed(0) + " kDa")}
    </div>
    <div class="widget-stage"><div id="mp_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>単量体</span><span class="li"><span class="sw" style="background:#3a7bd5"></span>二量体</span><span class="li"><span class="sw" style="background:#1f9d6b"></span>四量体</span></div></div>
    ${readoutRow([{ id: "mp_p", label: "ピーク位置", value: "—" }, { id: "mp_s", label: "分離", value: "—" }])}
    <p class="widget-note">二量体割合を上げると、<b>二量体ピーク（単量体の2倍の位置）の面積が増え</b>単量体が減ります。単量体質量を下げるほど隣のピークとの間隔が狭まり、<b>質量が近いと融合して分離が悪く</b>なります。ピーク位置＝質量、面積＝割合です。</p>`;
  function draw() {
    const w = 540, h = 288, s = lightPanel(document.getElementById("mp_plot"), w, h);
    const m = state.mono, fDim = state.dim / 100, fTet = 0.12 * (1 - fDim), fMono = Math.max(0, 1 - fDim - fTet);
    const comps = [
      { mu: m, frac: fMono, col: MAG, label: "単量体" },
      { mu: 2 * m, frac: fDim, col: BLUE, label: "二量体" },
      { mu: 4 * m, frac: fTet, col: GREEN, label: "四量体" },
    ];
    const sigma = 14; // 質量分解能(kDa)
    const mx = 54, my = 30, pw = 452, ph = 200, massMax = 4 * m + 60;
    const X = (mass) => mx + mass / massMax * pw;
    const dens = (mass) => comps.reduce((a, c) => a + c.frac * Math.exp(-0.5 * Math.pow((mass - c.mu) / sigma, 2)), 0);
    let peak = 1e-6;
    for (let mm = 0; mm <= massMax; mm += 2) peak = Math.max(peak, dens(mm));
    const Y = (dd) => my + ph - dd / peak * ph;
    add(s, "line", { x1: mx, x2: mx + pw, y1: my + ph, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: mx, x2: mx, y1: my, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    txt(s, mx + pw / 2, my + ph + 30, "質量（kDa）　← コントラストを較正 →", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 15, my + ph / 2, "イベント数", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 15 ${my + ph / 2})` });
    const tstep = massMax > 300 ? 100 : 50;
    for (let t = 0; t <= massMax; t += tstep) { add(s, "line", { x1: X(t), x2: X(t), y1: my + ph, y2: my + ph + 4, stroke: "#c7cce0" }); txt(s, X(t), my + ph + 15, String(t), { "text-anchor": "middle", "font-size": 9 }); }
    const binW = 8;
    for (let b = 0; b * binW <= massMax; b++) {
      const mc = b * binW + binW / 2, dd = dens(mc);
      if (dd < peak * 0.012) continue;
      let near = comps[0], best = 1e9;
      comps.forEach((c) => { const gg = Math.abs(mc - c.mu); if (gg < best) { best = gg; near = c; } });
      add(s, "rect", { x: X(mc - binW / 2) + 0.6, y: Y(dd), width: Math.max(1, X(mc + binW / 2) - X(mc - binW / 2) - 1.2), height: my + ph - Y(dd), fill: near.col, opacity: 0.55 });
    }
    let dpath = "";
    for (let mm = 0; mm <= massMax; mm += 2) dpath += (dpath ? " L " : "M ") + X(mm).toFixed(1) + " " + Y(dens(mm)).toFixed(1);
    add(s, "path", { d: dpath, fill: "none", stroke: "#3a4256", "stroke-width": 1.6, opacity: 0.55 });
    comps.forEach((c) => { if (c.frac < 0.02) return; add(s, "line", { x1: X(c.mu), x2: X(c.mu), y1: Y(dens(c.mu)) - 6, y2: my, stroke: c.col, "stroke-dasharray": "3 3", opacity: 0.5 }); txt(s, X(c.mu), my - 4, c.label + " " + c.mu.toFixed(0), { "text-anchor": "middle", "font-size": 9.5, fill: c.col, "font-weight": 700 }); });
    setReadout("mp_p", m + " / " + (2 * m) + " / " + (4 * m) + " kDa");
    setReadout("mp_s", m >= 2.2 * sigma ? "単量体と二量体は分離" : "ピークが融合気味（質量が近い）");
  }
  bindSlider("mp_d", (v) => v.toFixed(0) + " %", (v) => { state.dim = v; draw(); });
  bindSlider("mp_m", (v) => v.toFixed(0) + " kDa", (v) => { state.mono = v; draw(); });
  draw();
};

// ==========================================================================
// 60. opticaltweezers — 力–伸長曲線・WLC・overstretch・のこぎり波
// ==========================================================================
W.opticaltweezers = function (container) {
  const state = { mol: "dna", ext: 0.6, k: 0.2 };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${segRow("ot_m", "分子", [{ v: "dna", label: "dsDNA（WLC＋伸びきり）" }, { v: "hp", label: "折りたたみ（のこぎり波）" }], "dna")}
      ${sliderRow("ot_e", "伸長（接触長に対する割合）", 0, 1.8, 0.02, 0.6, (v) => (v * 100).toFixed(0) + " %")}
      ${sliderRow("ot_k", "トラップ剛性 k", 0.05, 0.5, 0.01, 0.2, (v) => v.toFixed(2) + " pN/nm")}
    </div>
    <div class="widget-stage"><div id="ot_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>力–伸長曲線</span><span class="li"><span class="sw" style="background:#d946ef"></span>現在の伸長</span></div></div>
    ${readoutRow([{ id: "ot_f", label: "力", value: "—" }, { id: "ot_x", label: "トラップ内変位 F/k", value: "—" }])}
    <p class="widget-note">伸長を動かすと曲線上のマーカーが移動し、WLCの非線形な立ち上がり、<b>約65pNの伸びきり平坦部</b>、折りたたみ型では<b>解離のたびに力が急落する「のこぎり波」</b>が見えます。トラップ剛性kを変えると、同じ力でもビーズ変位 x=F/k が変わります。</p>`;
  const kT = 4.1, Lp = 50;
  function fWLC(u) { const uu = clamp(u, 0, 0.984); return (kT / Lp) * (1 / (4 * Math.pow(1 - uu, 2)) - 0.25 + uu); }
  function forceDNA(u) {
    if (u <= 0.982) return fWLC(u);
    if (u <= 1.682) return 63 + (u - 0.982) * (6 / 0.7);
    return 69 + (u - 1.682) * 130;
  }
  function forceHP(u) {
    const arms = [[0.0, 0.45, 6, 19], [0.45, 0.95, 5, 20], [0.95, 1.5, 5, 22]];
    for (let i = 0; i < arms.length; i++) { const a = arms[i]; if (u >= a[0] && u < a[1]) return a[2] + (a[3] - a[2]) * Math.pow((u - a[0]) / (a[1] - a[0]), 0.7); }
    if (u >= 1.5) return 6 + (u - 1.5) * 40;
    return 0;
  }
  const force = (u) => state.mol === "dna" ? forceDNA(u) : forceHP(u);
  function draw() {
    const w = 540, h = 300, s = lightPanel(document.getElementById("ot_plot"), w, h);
    const F = force(state.ext), dx = F / state.k;
    // --- 模式図：光トラップ＝フックのばね ---
    txt(s, 26, 24, "光トラップ＝フックのばね（F = k·x）", { "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    const by = 48;
    add(s, "circle", { cx: 62, cy: by, r: 12, fill: "#cfd7e6", stroke: "#9aa6b4" });
    txt(s, 62, by + 26, "固定ビーズ", { "text-anchor": "middle", "font-size": 8, fill: "#9aa6b4" });
    const trapCx = 176, beadCx = trapCx + clamp(dx * 0.5, 0, 62);
    add(s, "line", { x1: trapCx, x2: trapCx, y1: by - 18, y2: by + 18, stroke: "#c7cce0", "stroke-dasharray": "3 3" });
    txt(s, trapCx, by - 22, "トラップ中心", { "text-anchor": "middle", "font-size": 8, fill: "#9aa6b4" });
    add(s, "line", { x1: 74, x2: beadCx - 12, y1: by, y2: by, stroke: MAG, "stroke-width": 2 });
    add(s, "circle", { cx: beadCx, cy: by, r: 12, fill: mix("#f6f8fb", BLUE, 0.4), stroke: BLUE, "stroke-width": 1.5 });
    txt(s, 320, by - 4, "ビーズ変位 x = F/k", { "font-size": 9.5, fill: "#565f73" });
    txt(s, 320, by + 11, "= " + dx.toFixed(0) + " nm", { "font-size": 9.5, fill: BLUE, "font-weight": 700 });
    // --- 力–伸長曲線 ---
    const mx = 58, my = 98, pw = 452, ph = 166, uMax = 1.8, fMax = 80;
    const X = (u) => mx + u / uMax * pw;
    const Y = (f) => my + ph - clamp(f, 0, fMax) / fMax * ph;
    add(s, "line", { x1: mx, x2: mx + pw, y1: my + ph, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    add(s, "line", { x1: mx, x2: mx, y1: my, y2: my + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
    txt(s, mx + pw / 2, my + ph + 28, "伸長（接触長 L₀ に対する割合）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
    txt(s, 15, my + ph / 2, "力 (pN)", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 15 ${my + ph / 2})` });
    [0, 20, 40, 60, 80].forEach((f) => { add(s, "line", { x1: mx, x2: mx + pw, y1: Y(f), y2: Y(f), stroke: "#eef1f6", "stroke-width": 1 }); txt(s, mx - 6, Y(f) + 3, String(f), { "text-anchor": "end", "font-size": 9 }); });
    [0, 0.5, 1.0, 1.5].forEach((u) => txt(s, X(u), my + ph + 13, (u * 100).toFixed(0) + "%", { "text-anchor": "middle", "font-size": 9 }));
    if (state.mol === "dna") { add(s, "line", { x1: mx, x2: mx + pw, y1: Y(65), y2: Y(65), stroke: ORANGE, "stroke-width": 1, "stroke-dasharray": "5 4" }); txt(s, mx + pw - 4, Y(65) - 4, "≈65 pN 伸びきり", { "text-anchor": "end", "font-size": 9, fill: ORANGE, "font-weight": 700 }); }
    let d = "";
    for (let u = 0; u <= uMax + 1e-9; u += 0.01) { d += (d ? " L " : "M ") + X(u).toFixed(1) + " " + Y(force(u)).toFixed(1); }
    add(s, "path", { d: d, fill: "none", stroke: BLUE, "stroke-width": 2.6 });
    add(s, "circle", { cx: X(state.ext), cy: Y(F), r: 5.5, fill: MAG });
    setReadout("ot_f", F.toFixed(1) + " pN");
    setReadout("ot_x", dx.toFixed(1) + " nm（= F/k）");
  }
  bindSeg("ot_m", (v) => { state.mol = v; draw(); });
  bindSlider("ot_e", (v) => (v * 100).toFixed(0) + " %", (v) => { state.ext = v; draw(); });
  bindSlider("ot_k", (v) => v.toFixed(2) + " pN/nm", (v) => { state.k = v; draw(); });
  draw();
};

// ==========================================================================
  // t61. magnetictweezers — 回転–伸長（帽子型）曲線：低張力＝対称／高張力＝非対称
  // ==========================================================================
  W.magnetictweezers = function (container) {
    const state = { force: 0.8, turns: 15 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mt_f", "張力（磁石を下げるほど強い・指数的）", 0.2, 4, 0.1, 0.8, (v) => v.toFixed(1) + " pN")}
        ${sliderRow("mt_n", "ねじれ回数 ΔLk（磁石の回転）", -60, 60, 1, 15, (v) => (v > 0 ? "+" : "") + v.toFixed(0) + " 回転")}
      </div>
      <div class="widget-stage"><div id="mt_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>過巻き（＋）：プレクトネーム</span><span class="li"><span class="sw" style="background:#f97316"></span>巻き戻し（−）：高張力で変性</span></div></div>
      ${readoutRow([{ id: "mt_z", label: "現在のDNA伸長", value: "—" }, { id: "mt_s", label: "曲線の対称性", value: "—" }])}
      <p class="widget-note">回転–伸長（帽子型）曲線です。<b>低張力では過巻き(＋)も巻き戻し(−)も対称にプレクトネームを作り伸長が下がります</b>。張力を上げると、<b>−側はプレクトネームの代わりに局所変性で応力を逃がし、伸びたまま</b>になって曲線が非対称になります。鎖にニックが入ると超らせんを保持できず、この応答自体が消えて平坦になります。</p>`;
    function znaught(F) { return 1 - 0.42 * Math.exp(-F / 0.7); }
    function ext(n, F) {
      const zn = znaught(F);
      const nb = 2.5 + 5.5 * F;
      const slopePos = 0.9 / (38 + 26 * F);
      const melt = clamp((F - 0.45) / 0.7, 0, 1);
      const slopeNeg = slopePos * (1 - melt);
      let e;
      if (n >= 0) { const over = Math.max(0, n - nb); e = zn - slopePos * over; }
      else { const under = Math.max(0, -n - nb); e = zn - slopeNeg * under; }
      return clamp(e, 0.03, 1);
    }
    function draw() {
      const ctx = CK.plot(document.getElementById("mt_plot"), {
        width: 540, height: 286, margin: { top: 18, right: 20, bottom: 46, left: 60 },
        xDomain: [-60, 60], yDomain: [0, 1.05], xTicks: 6, yTicks: 4,
        xLabel: "ねじれ回数 ΔLk（回転）", yLabel: "相対伸長 z / z0", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(1),
      });
      CK.vline(ctx, 0, { stroke: "#e5e9f2", "stroke-width": 1 });
      const neg = [], pos = [];
      for (let n = -60; n <= 0; n += 1) neg.push([n, ext(n, state.force)]);
      for (let n = 0; n <= 60; n += 1) pos.push([n, ext(n, state.force)]);
      CK.line(ctx, neg, { stroke: ORANGE, "stroke-width": 2.8 });
      CK.line(ctx, pos, { stroke: BLUE, "stroke-width": 2.8 });
      const cz = ext(state.turns, state.force);
      CK.vline(ctx, state.turns, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.turns, cz, { r: 5.5, fill: MAG });
      CK.textPx(ctx, ctx.margin.left + 8, ctx.margin.top + 14, "張力 " + state.force.toFixed(1) + " pN", { "font-size": ctx.fs(11), fill: "#565f73", "font-weight": 700 });
      const melt = clamp((state.force - 0.45) / 0.7, 0, 1);
      setReadout("mt_z", (cz * 100).toFixed(0) + " %（z0比）");
      setReadout("mt_s", melt < 0.25 ? "ほぼ対称な帽子型（低張力）" : melt > 0.7 ? "非対称（−側は変性で伸びたまま）" : "対称→非対称の遷移域");
    }
    bindSlider("mt_f", (v) => v.toFixed(1) + " pN", (v) => { state.force = v; draw(); });
    bindSlider("mt_n", (v) => (v > 0 ? "+" : "") + v.toFixed(0) + " 回転", (v) => { state.turns = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t62. bli — センサーグラム（会合・解離）と KD = koff/kon
  // ==========================================================================
  W.bli = function (container) {
    const state = { lkon: 5.0, lkoff: -2.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("bli_on", "会合速度 kon", 3.5, 6.5, 0.1, 5.0, (v) => "10^" + v.toFixed(1) + " M⁻¹s⁻¹")}
        ${sliderRow("bli_off", "解離速度 koff", -4, -1, 0.1, -2.5, (v) => "10^" + v.toFixed(1) + " s⁻¹")}
      </div>
      <div class="widget-stage"><div id="bli_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#cfe0f5"></span>低濃度</span><span class="li"><span class="sw" style="background:#1f3f78"></span>高濃度</span><span class="li"><span class="sw" style="background:#d946ef"></span>会合／解離の境目</span></div></div>
      ${readoutRow([{ id: "bli_kd", label: "KD = koff/kon", value: "—" }, { id: "bli_t", label: "解離半減期 ln2/koff", value: "—" }])}
      <p class="widget-note">センサーグラムです。会合相は <b>1−e^(−(kon·C+koff)t)</b> で立ち上がり（曲率＝kobs）、プラトー＝定常応答Req。解離相は <b>e^(−koff·t)</b> で減衰します。konを上げると立ち上がりが速く、<b>koffを上げると解離が速く定常も低く</b>なり、KD＝koff/konが変わります。信号は結合質量に比例するので小分子ほど小さくなります。</p>`;
    const concs = [3.9, 15.6, 62.5, 250, 1000]; // nM
    const cols = ["#cfe0f5", "#8fb6e8", BLUE, "#2b5aa8", "#1f3f78"];
    const ta = 120, tend = 300, Rmax = 1.0;
    function fmtKD(nM) {
      if (nM >= 1000) return (nM / 1000).toFixed(2) + " µM";
      if (nM >= 1) return nM.toFixed(1) + " nM";
      return nM.toFixed(3) + " nM";
    }
    function draw() {
      const kon = Math.pow(10, state.lkon), koff = Math.pow(10, state.lkoff);
      const KD = koff / kon; // M
      const ctx = CK.plot(document.getElementById("bli_plot"), {
        width: 540, height: 286, margin: { top: 18, right: 22, bottom: 46, left: 58 },
        xDomain: [0, tend], yDomain: [0, 1.05], xTicks: 5, yTicks: 4,
        xLabel: "時間 (秒)", yLabel: "応答 Δλ（規格化）", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(1),
      });
      CK.vline(ctx, ta, { stroke: MAG, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
      CK.textPx(ctx, ctx.x(ta / 2), ctx.margin.top + 13, "会合", { "text-anchor": "middle", "font-size": ctx.fs(10.5), fill: "#7b8497" });
      CK.textPx(ctx, ctx.x((ta + tend) / 2), ctx.margin.top + 13, "解離", { "text-anchor": "middle", "font-size": ctx.fs(10.5), fill: "#7b8497" });
      concs.forEach((Cn, i) => {
        const C = Cn * 1e-9;
        const Req = Rmax * C / (C + KD);
        const kobs = kon * C + koff;
        const pts = [];
        for (let t = 0; t <= ta; t += 2) pts.push([t, Req * (1 - Math.exp(-kobs * t))]);
        const Ra = Req * (1 - Math.exp(-kobs * ta));
        for (let t = ta; t <= tend; t += 2) pts.push([t, Ra * Math.exp(-koff * (t - ta))]);
        CK.line(ctx, pts, { stroke: cols[i], "stroke-width": 2.2 });
      });
      setReadout("bli_kd", fmtKD(KD / 1e-9));
      setReadout("bli_t", (Math.log(2) / koff).toFixed(0) + " 秒");
    }
    bindSlider("bli_on", (v) => "10^" + v.toFixed(1) + " M⁻¹s⁻¹", (v) => { state.lkon = v; draw(); });
    bindSlider("bli_off", (v) => "10^" + v.toFixed(1) + " s⁻¹", (v) => { state.lkoff = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t63. mst — 用量反応（Fnorm）と変曲点＝KD、標的濃度によるリガンド枯渇のずれ
  // ==========================================================================
  W.mst = function (container) {
    const state = { lkd: 2.0, ltar: 1.0 }; // log10 nM
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mst_kd", "真の KD", 0, 4, 0.1, 2.0, (v) => fmtnM(Math.pow(10, v)))}
        ${sliderRow("mst_t", "標的（蛍光体）濃度", 0, 4, 0.1, 1.0, (v) => fmtnM(Math.pow(10, v)))}
      </div>
      <div class="widget-stage"><div id="mst_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>用量反応（結合率＝Fnorm）</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>真の KD</span></div></div>
      ${readoutRow([{ id: "mst_km", label: "見かけのKD（変曲点）", value: "—" }, { id: "mst_r", label: "標的濃度とKDの関係", value: "—" }])}
      <p class="widget-note">リガンド濃度を横軸（対数）にした<b>用量反応曲線</b>です。Fnorm（規格化した結合率）がシグモイドを描き、<b>変曲点＝KD</b>——ただし<b>標的（蛍光体）濃度 ≪ KD</b> のときだけ。標的濃度をKDに近づけると曲線が鋭くなり、変曲点が標的濃度の半分あたりへずれて、見かけのKDが真の値からずれます（リガンド枯渇領域）。</p>`;
    function fmtnM(x) {
      if (x >= 10000) return (x / 1000).toFixed(0) + " µM";
      if (x >= 1000) return (x / 1000).toFixed(1) + " µM";
      if (x >= 10) return x.toFixed(0) + " nM";
      return x.toFixed(1) + " nM";
    }
    function fracBound(L, T, KD) {
      const s = T + L + KD;
      const b = 0.5 * (s - Math.sqrt(Math.max(0, s * s - 4 * T * L)));
      return T > 0 ? clamp(b / T, 0, 1) : 0;
    }
    function draw() {
      const KD = Math.pow(10, state.lkd); // nM
      const T = Math.pow(10, state.ltar); // nM
      const ctx = CK.plot(document.getElementById("mst_plot"), {
        width: 540, height: 286, margin: { top: 18, right: 22, bottom: 48, left: 58 },
        xDomain: [-1, 6], yDomain: [0, 1.05], xTicks: 7, yTicks: 4,
        xLabel: "リガンド濃度（log10 nM）", yLabel: "結合率 Fnorm（規格化）", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(1),
      });
      const pts = [];
      for (let lx = -1; lx <= 6; lx += 0.05) pts.push([lx, fracBound(Math.pow(10, lx), T, KD)]);
      CK.line(ctx, pts, { stroke: MAG, "stroke-width": 2.8 });
      CK.vline(ctx, Math.log10(KD), { stroke: GRAY, "stroke-width": 1.6, "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.x(Math.log10(KD)) + 5, ctx.margin.top + 14, "真のKD", { "font-size": ctx.fs(10.5), fill: "#7b8497" });
      // apparent midpoint (fracBound = 0.5)
      let mid = KD, prev = null;
      for (let lx = -1; lx <= 6; lx += 0.02) {
        const fb = fracBound(Math.pow(10, lx), T, KD);
        if (prev && prev.fb < 0.5 && fb >= 0.5) {
          const t = (0.5 - prev.fb) / (fb - prev.fb);
          mid = Math.pow(10, prev.lx + t * 0.02);
          break;
        }
        prev = { lx: lx, fb: fb };
      }
      CK.dot(ctx, Math.log10(mid), 0.5, { r: 5, fill: MAG });
      const ratio = T / KD;
      setReadout("mst_km", fmtnM(mid));
      setReadout("mst_r", ratio < 0.1 ? "標的 ≪ KD：変曲点＝真のKD" : ratio < 1 ? "標的がKDに接近：変曲点がずれ始める" : "標的 ≥ KD：枯渇でずれ、KDは上限");
    }
    bindSlider("mst_kd", (v) => fmtnM(Math.pow(10, v)), (v) => { state.lkd = v; draw(); });
    bindSlider("mst_t", (v) => fmtnM(Math.pow(10, v)), (v) => { state.ltar = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t64. dsf — 融解曲線（シグモイド）と一次微分のピーク＝Tm、ΔTm（熱シフト）
  // ==========================================================================
  W.dsf = function (container) {
    const state = { dtm: 4, width: 1.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("dsf_d", "リガンドによる熱シフト ΔTm", 0, 12, 0.5, 4, (v) => "+" + v.toFixed(1) + " ℃")}
        ${sliderRow("dsf_w", "遷移幅（狭いほど協同的）", 0.6, 3, 0.1, 1.4, (v) => "±" + v.toFixed(1) + " ℃")}
      </div>
      <div class="widget-stage"><div id="dsf_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#9aa6b4"></span>apo（リガンドなし）</span><span class="li"><span class="sw" style="background:#d946ef"></span>＋リガンド</span><span class="li"><span class="sw" style="background:#3a4256"></span>破線＝一次微分</span></div></div>
      ${readoutRow([{ id: "dsf_tm", label: "Tm（apo → ＋リガンド）", value: "—" }, { id: "dsf_dt", label: "ΔTm（安定化の指標）", value: "—" }])}
      <p class="widget-note">融解曲線（シグモイド、実線）と<b>一次微分（破線）</b>を重ねています。微分の<b>ピーク位置＝Tm</b>。リガンドが天然状態を安定化すると曲線と微分ピークが<b>高温側へシフト（ΔTm）</b>します。遷移幅を狭める（協同性↑）と微分ピークが鋭くなります。<b>ΔTmは安定化の指標であって直接のKDではありません</b>。</p>`;
    const Tm0 = 52, T0 = 30, T1 = 80;
    function fu(T, Tm, w) { return 1 / (1 + Math.exp(-(T - Tm) / w)); }
    function draw() {
      const w = state.width, TmL = Tm0 + state.dtm;
      const ctx = CK.plot(document.getElementById("dsf_plot"), {
        width: 540, height: 286, margin: { top: 18, right: 22, bottom: 46, left: 56 },
        xDomain: [T0, T1], yDomain: [0, 1.08], xTicks: 5, yTicks: 4,
        xLabel: "温度 (℃)", yLabel: "変性割合 / 微分（規格化）", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(1),
      });
      const kd = 2.2; // derivative display scale
      const meltA = [], meltL = [], derA = [], derL = [];
      for (let T = T0; T <= T1; T += 0.5) {
        const fA = fu(T, Tm0, w), fL = fu(T, TmL, w);
        meltA.push([T, fA]); meltL.push([T, fL]);
        derA.push([T, kd * (1 / w) * fA * (1 - fA)]);
        derL.push([T, kd * (1 / w) * fL * (1 - fL)]);
      }
      CK.line(ctx, meltA, { stroke: GRAY, "stroke-width": 2.4 });
      CK.line(ctx, meltL, { stroke: MAG, "stroke-width": 2.4 });
      CK.line(ctx, derA, { stroke: GRAY, "stroke-width": 2, "stroke-dasharray": "5 4" });
      CK.line(ctx, derL, { stroke: MAG, "stroke-width": 2, "stroke-dasharray": "5 4" });
      CK.vline(ctx, Tm0, { stroke: GRAY, "stroke-width": 1.2, "stroke-dasharray": "2 3" });
      CK.vline(ctx, TmL, { stroke: MAG, "stroke-width": 1.2, "stroke-dasharray": "2 3" });
      const yp = kd * (1 / w) * 0.25;
      CK.textPx(ctx, ctx.x(TmL), ctx.y(yp) - 6, "Tm", { "text-anchor": "middle", "font-size": ctx.fs(10.5), fill: MAG, "font-weight": 700 });
      setReadout("dsf_tm", Tm0.toFixed(1) + " ℃ → " + TmL.toFixed(1) + " ℃");
      setReadout("dsf_dt", "+" + state.dtm.toFixed(1) + " ℃");
    }
    bindSlider("dsf_d", (v) => "+" + v.toFixed(1) + " ℃", (v) => { state.dtm = v; draw(); });
    bindSlider("dsf_w", (v) => "±" + v.toFixed(1) + " ℃", (v) => { state.width = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t65. cd — 遠紫外CDスペクトル＝基底スペクトルの加重和（%ヘリックスで208/222が深化）
  // ==========================================================================
  W.cd = function (container) {
    const state = { helix: 30, sheet: 20 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("cd_h", "αヘリックス含量", 0, 100, 5, 30, (v) => v.toFixed(0) + " %")}
        ${sliderRow("cd_s", "βシート含量", 0, 100, 5, 20, (v) => v.toFixed(0) + " %")}
      </div>
      <div class="widget-stage"><div id="cd_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>CDスペクトル（加重和）</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>208・222 nm</span></div></div>
      ${readoutRow([{ id: "cd_c", label: "組成（ヘリックス/シート/コイル）", value: "—" }, { id: "cd_r", label: "θ222 / θ208 比", value: "—" }])}
      <p class="widget-note">遠紫外CDは<b>αヘリックス・βシート・ランダムコイルの基底スペクトルの加重和</b>です。ヘリックス含量を上げると<b>208 nmと222 nmの二つの極小が深くなり</b>、192 nm付近の正のピークが伸びます。シート主体なら極小は218 nm付近の一つ。<b>θ222/θ208比</b>がヘリックスらしさの目安で、βシートは個体差が大きく推定が最も不確かな成分です。</p>`;
    const sq = (x) => x * x;
    function Hb(l) { return 75 * Math.exp(-sq((l - 192) / 4.5)) - 34 * Math.exp(-sq((l - 208) / 4.5)) - 34 * Math.exp(-sq((l - 222) / 5.5)); }
    function Sb(l) { return 32 * Math.exp(-sq((l - 196) / 5)) - 18 * Math.exp(-sq((l - 217) / 7)); }
    function Cb(l) { return -22 * Math.exp(-sq((l - 199) / 6)) + 2 * Math.exp(-sq((l - 222) / 8)); }
    function draw() {
      const h = state.helix, s = state.sheet, c = Math.max(0, 100 - h - s);
      const tot = h + s + c;
      const fH = h / tot, fS = s / tot, fC = c / tot;
      const theta = (l) => fH * Hb(l) + fS * Sb(l) + fC * Cb(l);
      const ctx = CK.plot(document.getElementById("cd_plot"), {
        width: 540, height: 288, margin: { top: 18, right: 22, bottom: 46, left: 62 },
        xDomain: [190, 250], yDomain: [-45, 80], xTicks: 6, yTicks: 5,
        xLabel: "波長 (nm)", yLabel: "モル楕円率 [θ] (×10³)", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(0),
      });
      CK.hline(ctx, 0, { stroke: "#c7cce0", "stroke-width": 1 });
      CK.vline(ctx, 208, { stroke: GRAY, "stroke-width": 1, "stroke-dasharray": "3 3" });
      CK.vline(ctx, 222, { stroke: GRAY, "stroke-width": 1, "stroke-dasharray": "3 3" });
      const pts = [];
      for (let l = 190; l <= 250; l += 0.5) pts.push([l, clamp(theta(l), -45, 80)]);
      CK.line(ctx, pts, { stroke: MAG, "stroke-width": 2.8 });
      CK.textPx(ctx, ctx.x(208), ctx.margin.top + 12, "208", { "text-anchor": "middle", "font-size": ctx.fs(9.5), fill: "#9aa6b4" });
      CK.textPx(ctx, ctx.x(222), ctx.margin.top + 12, "222", { "text-anchor": "middle", "font-size": ctx.fs(9.5), fill: "#9aa6b4" });
      const t222 = theta(222), t208 = theta(208);
      setReadout("cd_c", Math.round(fH * 100) + " / " + Math.round(fS * 100) + " / " + Math.round(fC * 100) + " %");
      setReadout("cd_r", Math.abs(t208) > 0.5 ? (t222 / t208).toFixed(2) : "—");
    }
    bindSlider("cd_h", (v) => v.toFixed(0) + " %", (v) => { state.helix = v; draw(); });
    bindSlider("cd_s", (v) => v.toFixed(0) + " %", (v) => { state.sheet = v; draw(); });
    draw();
  };
})();

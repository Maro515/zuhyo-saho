/* 第7章：実験動物・遺伝子改変動物解析 — batch1 widgets (topics 1〜8)
   （CT窓・MRI T1/T2・PET集積・光イメージング・心エコー・Cre/loxP・系統追跡・組織透明化） */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const ORANGE = "#f97316";
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function gray(t) { const v = Math.round(clamp(t, 0, 1) * 255); return `rgb(${v},${v},${v})`; }
  function jet(t) { t = clamp(t, 0, 1); const r = Math.round(255 * clamp(1.5 - Math.abs(4 * t - 3), 0, 1)); const g = Math.round(255 * clamp(1.5 - Math.abs(4 * t - 2), 0, 1)); const b = Math.round(255 * clamp(1.5 - Math.abs(4 * t - 1), 0, 1)); return `rgb(${r},${g},${b})`; }

  // 1. CT — windowing (lung / soft-tissue / bone) --------------------------
  W.ct = function (container) {
    const state = { win: "lung" };
    // regions of an axial slice with HU values
    const regions = [
      { name: "骨(肋骨)", hu: 800, shape: "ring" },
      { name: "軟部組織", hu: 40, shape: "body" },
      { name: "脂肪", hu: -70, shape: "fat" },
      { name: "肺(空気)", hu: -800, shape: "lung" },
    ];
    const wins = { lung: { c: -500, w: 1400, lab: "肺野条件" }, soft: { c: 40, w: 350, lab: "縦隔条件" }, bone: { c: 500, w: 1500, lab: "骨条件" } };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ct_w", "表示条件(ウィンドウ)", [{ v: "lung", label: "肺野条件" }, { v: "soft", label: "縦隔条件" }, { v: "bone", label: "骨条件" }], "lung")}</div>
      <div class="widget-stage"><div id="ct_plot"></div></div>
      ${readoutRow([{ id: "ct_v", label: "ウィンドウ中心/幅", value: "—" }, { id: "ct_s", label: "よく見える組織", value: "—" }])}
      <p class="widget-note">同じ断面でも、<b>ウィンドウ(表示するCT値の範囲)で見える組織が変わります</b>。肺野条件は空気、縦隔条件は軟部組織、骨条件は骨が最もよく見えます。</p>`;
    function shade(hu) { const wn = wins[state.win]; return clamp((hu - (wn.c - wn.w / 2)) / wn.w, 0, 1); }
    function draw() {
      const W2 = 320, H2 = 260, s = darkPanel(document.getElementById("ct_plot"), W2, H2, "#000");
      const cx = 160, cy = 130;
      // body (soft tissue) ellipse
      add(s, "ellipse", { cx: cx, cy: cy, rx: 118, ry: 100, fill: gray(shade(40)) });
      // fat rim
      add(s, "ellipse", { cx: cx, cy: cy, rx: 118, ry: 100, fill: "none", stroke: gray(shade(-70)), "stroke-width": 12 });
      // lungs (air) two ellipses
      add(s, "ellipse", { cx: cx - 45, cy: cy - 6, rx: 34, ry: 56, fill: gray(shade(-800)) });
      add(s, "ellipse", { cx: cx + 45, cy: cy - 6, rx: 34, ry: 56, fill: gray(shade(-800)) });
      // spine (bone) + rib ring
      add(s, "circle", { cx: cx, cy: cy + 66, r: 16, fill: gray(shade(800)) });
      for (let a = 0; a < 360; a += 30) { const rx = 112, ry = 94; add(s, "circle", { cx: cx + rx * Math.cos(a * Math.PI / 180), cy: cy + ry * Math.sin(a * Math.PI / 180), r: 5, fill: gray(shade(800)) }); }
      const wn = wins[state.win];
      setReadout("ct_v", wn.c + " / " + wn.w + " HU");
      setReadout("ct_s", state.win === "lung" ? "肺(空気)" : state.win === "soft" ? "軟部組織・縦隔" : "骨");
    }
    bindSeg("ct_w", (v) => { state.win = v; draw(); });
    draw();
  };

  // 2. MRI — T1 vs T2 weighting --------------------------------------------
  W.mri = function (container) {
    const state = { seq: "t1" };
    // tissues with T1/T2 relative signal (0 dark - 1 bright)
    const tissues = [
      { name: "白質/灰白質", t1: 0.6, t2: 0.5 },
      { name: "脳脊髄液(水)", t1: 0.1, t2: 0.95 },
      { name: "脂肪", t1: 0.9, t2: 0.5 },
      { name: "病変(浮腫)", t1: 0.3, t2: 0.9 },
    ];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("mr_s", "撮影法", [{ v: "t1", label: "T1強調(T1WI)" }, { v: "t2", label: "T2強調(T2WI)" }], "t1")}</div>
      <div class="widget-stage"><div id="mr_plot"></div></div>
      ${readoutRow([{ id: "mr_w", label: "水(脳脊髄液)", value: "—" }, { id: "mr_l", label: "病変(浮腫)", value: "—" }])}
      <p class="widget-note">同じ脳でも撮影法で白黒が反転します。<b>T1WIは水=黒・脂肪=白(解剖向き)</b>、<b>T2WIは水・病変=白(病変把握向き)</b>。撮影法の確認が重要です。</p>`;
    function sig(t) { return state.seq === "t1" ? t.t1 : t.t2; }
    function draw() {
      const W2 = 320, H2 = 250, s = darkPanel(document.getElementById("mr_plot"), W2, H2, "#000");
      const cx = 160, cy = 122;
      add(s, "ellipse", { cx: cx, cy: cy, rx: 110, ry: 92, fill: gray(sig(tissues[0])) });        // brain tissue
      add(s, "ellipse", { cx: cx, cy: cy, rx: 110, ry: 92, fill: "none", stroke: gray(sig(tissues[2])), "stroke-width": 9 }); // fat rim
      // ventricles (CSF)
      add(s, "path", { d: `M ${cx - 8} ${cy - 26} q -22 26 0 52 q 22 -26 0 -52 Z`, fill: gray(sig(tissues[1])) });
      add(s, "path", { d: `M ${cx + 8} ${cy - 26} q 22 26 0 52 q -22 -26 0 -52 Z`, fill: gray(sig(tissues[1])) });
      // lesion
      add(s, "circle", { cx: cx + 52, cy: cy - 30, r: 17, fill: gray(sig(tissues[3])) });
      add(s, "circle", { cx: cx + 52, cy: cy - 30, r: 17, fill: "none", stroke: ORANGE, "stroke-width": 1.5, "stroke-dasharray": "3 2" });
      setReadout("mr_w", state.seq === "t1" ? "低信号(黒)" : "高信号(白)");
      setReadout("mr_l", state.seq === "t1" ? "分かりにくい" : "高信号(白)で明瞭");
    }
    bindSeg("mr_s", (v) => { state.seq = v; draw(); });
    draw();
  };

  // 3. PET/SPECT — FDG uptake with physiological hotspots -------------------
  W.petspect = function (container) {
    const state = { suv: 0.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pt_s", "腫瘍の糖代謝 (SUV)", 0, 1, 0.05, state.suv, (v) => (v * 12).toFixed(1))}</div>
      <div class="widget-stage"><div id="pt_plot"></div></div>
      ${readoutRow([{ id: "pt_v", label: "腫瘍のSUV", value: "—" }, { id: "pt_n", label: "生理的集積", value: "—" }])}
      <p class="widget-note">FDG-PET。<b>糖代謝が高い腫瘍ほどホットスポットが強く</b>光ります。ただし脳・心臓・腎臓・膀胱は正常でも集積する(生理的集積)ため、腫瘍との見分けが要ります。</p>`;
    function draw() {
      const W2 = 300, H2 = 260, s = darkPanel(document.getElementById("pt_plot"), W2, H2, "#04121a");
      const cx = 150;
      // body outline (mouse)
      add(s, "ellipse", { cx: cx, cy: 130, rx: 44, ry: 118, fill: "#0a1a22", stroke: "#1d3a48", "stroke-width": 1 });
      // physiological hotspots: brain, heart, kidneys, bladder
      const phys = [{ x: cx, y: 34, r: 15, i: 0.85, lab: "脳" }, { x: cx, y: 96, r: 13, i: 0.8, lab: "心" }, { x: cx - 18, y: 176, r: 10, i: 0.75 }, { x: cx + 18, y: 176, r: 10, i: 0.75 }, { x: cx, y: 226, r: 12, i: 0.95, lab: "膀胱" }];
      phys.forEach((p) => { add(s, "circle", { cx: p.x, cy: p.y, r: p.r + 4, fill: jet(p.i), opacity: 0.3 }); add(s, "circle", { cx: p.x, cy: p.y, r: p.r, fill: jet(p.i), opacity: 0.85 }); });
      // tumor
      add(s, "circle", { cx: cx + 26, cy: 132, r: 8 + state.suv * 10, fill: jet(state.suv), opacity: 0.35 });
      add(s, "circle", { cx: cx + 26, cy: 132, r: 6 + state.suv * 7, fill: jet(state.suv), opacity: 0.9 });
      add(s, "text", { x: cx + 26, y: 132 - 16 - state.suv * 7, "text-anchor": "middle", "font-size": 9, fill: "#f4b48a", text: "腫瘍" });
      // colorbar
      for (let k = 0; k < 40; k++) add(s, "rect", { x: 272, y: 210 - k * 4, width: 12, height: 4, fill: jet(k / 40) });
      add(s, "text", { x: 278, y: 224, "font-size": 8, fill: "#8aa0b0", text: "低" });
      add(s, "text", { x: 278, y: 56, "font-size": 8, fill: "#8aa0b0", text: "高" });
      setReadout("pt_v", (state.suv * 12).toFixed(1));
      setReadout("pt_n", "脳・心・腎・膀胱");
    }
    bindSlider("pt_s", (v) => (v * 12).toFixed(1), (v) => { state.suv = v; draw(); });
    draw();
  };

  // 4. Optical imaging — signal vs color-scale ceiling ----------------------
  W.optical = function (container) {
    const state = { sig: 0.5, ceil: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("op_s", "シグナル強度(腫瘍量)", 0, 1, 0.05, state.sig, (v) => (v * 100).toFixed(0) + "%")}${sliderRow("op_c", "カラースケール上限", 0.2, 1.2, 0.05, state.ceil, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="op_plot"></div></div>
      ${readoutRow([{ id: "op_v", label: "見かけの明るさ", value: "—" }, { id: "op_n", label: "注意", value: "—" }])}
      <p class="widget-note">同じ発光でも<b>カラースケール上限で見え方が変わります</b>。上限を高くすると弱いシグナルが黒く沈み、低くすると飽和して差が潰れます。スケール設定に注意します。</p>`;
    function draw() {
      const W2 = 300, H2 = 250, s = darkPanel(document.getElementById("op_plot"), W2, H2, "#04070d");
      add(s, "ellipse", { cx: 150, cy: 125, rx: 46, ry: 110, fill: "#0c0f16", stroke: "#242a38", "stroke-width": 1 });
      // signal hotspot, displayed value clamped to ceiling
      const disp = clamp(state.sig / state.ceil, 0, 1);
      const spots = [{ x: 150, y: 110, base: 1.0 }, { x: 135, y: 165, base: 0.4 }];
      spots.forEach((sp) => {
        const d = clamp(state.sig * sp.base / state.ceil, 0, 1);
        for (let k = 3; k >= 1; k--) add(s, "circle", { cx: sp.x, cy: sp.y, r: (10 + k * 8), fill: jet(d), opacity: d > 0.03 ? 0.12 : 0 });
        add(s, "circle", { cx: sp.x, cy: sp.y, r: 12, fill: jet(d), opacity: d > 0.03 ? 0.9 : 0.05 });
      });
      // colorbar with ceiling
      for (let k = 0; k < 40; k++) add(s, "rect", { x: 270, y: 205 - k * 4, width: 12, height: 4, fill: jet(k / 40) });
      add(s, "text", { x: 276, y: 220, "font-size": 8, fill: "#8aa0b0", text: "0" });
      add(s, "text", { x: 270, y: 52, "font-size": 8, fill: "#8aa0b0", text: (state.ceil * 100).toFixed(0) });
      setReadout("op_v", (disp * 100).toFixed(0) + "%");
      setReadout("op_n", disp > 0.98 ? "飽和(差が潰れる)" : disp < 0.08 ? "弱く見え落とす恐れ" : "適正レンジ");
    }
    bindSlider("op_s", (v) => (v * 100).toFixed(0) + "%", (v) => { state.sig = v; draw(); });
    bindSlider("op_c", (v) => (v * 100).toFixed(0) + "%", (v) => { state.ceil = v; draw(); });
    draw();
  };

  // 5. Echo — M-mode wall motion + LVEF ------------------------------------
  W.echo = function (container) {
    const state = { ef: 0.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ec_e", "心収縮能", 0.15, 0.75, 0.01, state.ef, (v) => "EF目安 " + (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ec_plot"></div></div>
      ${readoutRow([{ id: "ec_lvef", label: "左室駆出率 LVEF", value: "—" }, { id: "ec_fs", label: "%FS", value: "—" }])}
      <p class="widget-note">Mモード(壁運動の時間変化)。<b>収縮期に前壁と後壁が近づく振れ幅が大きいほど収縮能が高い</b>。拡張期径と収縮期径の差から%FS・LVEFを算出します。</p>`;
    function draw() {
      const W2 = 460, H2 = 230, s = darkPanel(document.getElementById("ec_plot"), W2, H2, "#0a0d14");
      const midTop = 70, midBot = 165, LVIDd = (midBot - midTop);
      const excursion = (LVIDd / 2 - 8) * (state.ef / 0.7);
      function wall(base, dir) { let d = ""; for (let x = 0; x <= 440; x += 3) { const phase = (x / 110) * Math.PI * 2; const beat = Math.max(0, Math.sin(phase)); const y = base + dir * excursion * beat; d += (x === 0 ? "M" : "L") + (10 + x) + " " + y.toFixed(1) + " "; } return d; }
      add(s, "path", { d: wall(midTop, 1), fill: "none", stroke: "#e8eef6", "stroke-width": 2 });
      add(s, "path", { d: wall(midBot, -1), fill: "none", stroke: "#e8eef6", "stroke-width": 2 });
      add(s, "text", { x: 16, y: midTop - 6, "font-size": 9, fill: "#9fb0c8", text: "前壁" });
      add(s, "text", { x: 16, y: midBot + 14, "font-size": 9, fill: "#9fb0c8", text: "後壁" });
      // diastole/systole markers
      add(s, "line", { x1: 10 + 27, y1: 30, x2: 10 + 27, y2: 200, stroke: "#3a4256", "stroke-dasharray": "3 3" });
      add(s, "line", { x1: 10 + 82, y1: 30, x2: 10 + 82, y2: 200, stroke: "#3a4256", "stroke-dasharray": "3 3" });
      add(s, "text", { x: 10 + 27, y: 24, "text-anchor": "middle", "font-size": 8, fill: "#8a93a8", text: "拡張" });
      add(s, "text", { x: 10 + 82, y: 24, "text-anchor": "middle", "font-size": 8, fill: "#8a93a8", text: "収縮" });
      const LVIDs = LVIDd - 2 * excursion;
      const fs = (LVIDd - LVIDs) / LVIDd * 100;
      const lvef = clamp(fs * 1.8, 5, 85);
      setReadout("ec_lvef", lvef.toFixed(0) + "%");
      setReadout("ec_fs", fs.toFixed(0) + "%");
    }
    bindSlider("ec_e", (v) => "EF目安 " + (v * 100).toFixed(0) + "%", (v) => { state.ef = v; draw(); });
    draw();
  };

  // 6. Cre/loxP — tamoxifen-inducible conditional KO -----------------------
  W.creloxp = function (container) {
    const state = { tam: "no" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cr_t", "タモキシフェン", [{ v: "no", label: "なし" }, { v: "yes", label: "あり" }], "no")}</div>
      <div class="widget-stage"><div id="cr_plot"></div></div>
      ${readoutRow([{ id: "cr_loc", label: "CreERの局在", value: "—" }, { id: "cr_g", label: "標的遺伝子", value: "—" }])}
      <p class="widget-note">CreERは通常<b>細胞質</b>にいて働けません。<b>タモキシフェンが結合すると核へ移行</b>し、loxPで挟まれた(flox)遺伝子領域を除去＝条件的ノックアウトが起こります。</p>`;
    function loxTri(s, x, y, flip) { add(s, "path", { d: `M ${x} ${y - 6} L ${x + (flip ? -12 : 12)} ${y} L ${x} ${y + 6} Z`, fill: "#f5a623" }); }
    function draw() {
      const W2 = 440, H2 = 230, s = darkPanel(document.getElementById("cr_plot"), W2, H2, "#080a12");
      const on = state.tam === "yes";
      // cell + nucleus
      add(s, "ellipse", { cx: 220, cy: 115, rx: 200, ry: 100, fill: "#0e1424", stroke: "#26304a", "stroke-width": 1 });
      add(s, "ellipse", { cx: 300, cy: 120, rx: 118, ry: 78, fill: "#111a30", stroke: "#2f3b58", "stroke-width": 1 });
      add(s, "text", { x: 300, y: 52, "text-anchor": "middle", "font-size": 10, fill: "#8aa0b0", text: "核" });
      // CreER position
      const crx = on ? 300 : 90, cry = on ? 120 : 70;
      if (on) { add(s, "circle", { cx: 90, cy: 60, r: 6, fill: "#f5d90a" }); add(s, "text", { x: 90, y: 46, "text-anchor": "middle", "font-size": 8, fill: "#d8c84a", text: "タモキシフェン" }); }
      add(s, "rect", { x: crx - 24, y: cry - 12, width: 48, height: 24, rx: 6, fill: on ? "#f97316" : "#7a879c" });
      add(s, "text", { x: crx, y: cry + 4, "text-anchor": "middle", "font-size": 10, fill: "#fff", "font-weight": 700, text: "CreER" });
      // gene cassette in nucleus with loxP
      const gx = 300, gy = 165;
      loxTri(s, gx - 60, gy, false);
      loxTri(s, gx + 60, gy, false);
      if (!on) {
        add(s, "rect", { x: gx - 48, y: gy - 9, width: 96, height: 18, rx: 4, fill: "#37d67a", opacity: 0.85 });
        add(s, "text", { x: gx, y: gy + 4, "text-anchor": "middle", "font-size": 9, fill: "#04120a", "font-weight": 700, text: "標的遺伝子" });
      } else {
        add(s, "line", { x1: gx - 48, y1: gy, x2: gx + 48, y2: gy, stroke: "#5a6472", "stroke-width": 2, "stroke-dasharray": "5 4" });
        add(s, "text", { x: gx, y: gy + 4, "text-anchor": "middle", "font-size": 9, fill: "#ef7a7a", text: "除去（KO）" });
      }
      setReadout("cr_loc", on ? "核（作用できる）" : "細胞質（作用できない）");
      setReadout("cr_g", on ? "ノックアウト" : "発現（正常）");
    }
    bindSeg("cr_t", (v) => { state.tam = v; draw(); });
    draw();
  };

  // 7. Lineage tracing — clonal expansion over time ------------------------
  W.lineage = function (container) {
    const state = { day: 0 };
    const cols = [ORANGE, "#37d67a", "#3aa0ff", "#f5d90a"];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("li_d", "時間 (日)", 0, 30, 1, state.day, (v) => v.toFixed(0) + " 日")}</div>
      <div class="widget-stage"><div id="li_plot"></div></div>
      ${readoutRow([{ id: "li_c", label: "標識細胞の広がり", value: "—" }, { id: "li_n", label: "解釈", value: "—" }])}
      <p class="widget-note">組織(腸の陰窩→絨毛)。基部の<b>標識された1個の幹細胞</b>の子孫が同じ色を受け継ぎ、時間とともに上へ広がります。長期に組織を埋めれば、その細胞は幹細胞と分かります。</p>`;
    function draw() {
      const W2 = 460, H2 = 230, s = darkPanel(document.getElementById("li_plot"), W2, H2, "#0a0806");
      const nCrypts = 4, cw = 100, baseY = 200, topY = 24;
      for (let c = 0; c < nCrypts; c++) {
        const cx = 60 + c * cw;
        // crypt-villus column outline
        add(s, "rect", { x: cx - 26, y: topY, width: 52, height: baseY - topY, rx: 12, fill: "#171310", stroke: "#2a221a", "stroke-width": 1 });
        // unlabeled cells
        for (let r = 0; r < 12; r++) for (let k = 0; k < 2; k++) add(s, "circle", { cx: cx - 12 + k * 24, cy: baseY - 8 - r * 14, r: 5, fill: "#3a322a" });
        // labeled clone rising from base
        const rise = Math.min(12, Math.round(state.day / 30 * 12));
        for (let r = 0; r < rise; r++) for (let k = 0; k < 2; k++) add(s, "circle", { cx: cx - 12 + k * 24, cy: baseY - 8 - r * 14, r: 5.2, fill: cols[c], opacity: 0.92 });
        add(s, "circle", { cx: cx, cy: baseY - 6, r: 6, fill: cols[c], stroke: "#fff", "stroke-width": 1 });
      }
      const frac = Math.min(1, state.day / 30);
      setReadout("li_c", (frac * 100).toFixed(0) + "% (陰窩→絨毛)");
      setReadout("li_n", state.day < 3 ? "標識直後（幹細胞のみ）" : state.day < 20 ? "子孫が上行中" : "全系譜を長期に供給＝幹細胞");
    }
    bindSlider("li_d", (v) => v.toFixed(0) + " 日", (v) => { state.day = v; draw(); });
    draw();
  };

  // 8. Tissue clearing — opacity -> internal 3D structures -----------------
  W.clearing = function (container) {
    const rng = CK.makeRng(708), fibers = [];
    for (let i = 0; i < 26; i++) fibers.push({ x: 40 + rng() * 380, y: 30 + rng() * 150, len: 20 + rng() * 60, ang: rng() * Math.PI, col: rng() < 0.6 ? "#37d67a" : "#ff5a6e", seed: i });
    const state = { clear: 0.2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("cw_c", "透明化の度合い", 0, 1, 0.05, state.clear, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="cw_plot"></div></div>
      ${readoutRow([{ id: "cw_t", label: "組織の透明度", value: "—" }, { id: "cw_s", label: "内部構造", value: "—" }])}
      <p class="widget-note">不透明な組織を光学的に<b>透明化</b>すると、切らずに内部の蛍光標識された構造(神経・血管)が丸ごと三次元で見えるようになります。ライトシート顕微鏡などで撮像します。</p>`;
    function draw() {
      const W2 = 440, H2 = 220, s = darkPanel(document.getElementById("cw_plot"), W2, H2, "#05070d");
      // internal fluorescent fibers (drawn first)
      fibers.forEach((f) => {
        const x2 = f.x + Math.cos(f.ang) * f.len, y2 = f.y + Math.sin(f.ang) * f.len;
        add(s, "line", { x1: f.x, y1: f.y, x2: x2, y2: y2, stroke: f.col, "stroke-width": 2.2, opacity: 0.35 + 0.6 * state.clear, "stroke-linecap": "round" });
      });
      // opaque tissue overlay whose alpha decreases with clearing
      add(s, "rect", { x: 20, y: 16, width: W2 - 40, height: H2 - 32, rx: 10, fill: "#d9d2c4", opacity: (1 - state.clear) * 0.9 });
      add(s, "rect", { x: 20, y: 16, width: W2 - 40, height: H2 - 32, rx: 10, fill: "none", stroke: "#3a4152", "stroke-width": 1 });
      setReadout("cw_t", (state.clear * 100).toFixed(0) + "%");
      setReadout("cw_s", state.clear > 0.6 ? "3Dで明瞭に見える" : state.clear > 0.3 ? "うっすら見える" : "不透明で見えない");
    }
    bindSlider("cw_c", (v) => (v * 100).toFixed(0) + "%", (v) => { state.clear = v; draw(); });
    draw();
  };

  // 9. Electrophysiology — action potential firing vs injected current -----
  W.ephys = function (container) {
    const state = { i: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ep_i", "刺激電流(脱分極)", 0, 1, 0.05, state.i, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ep_plot"></div></div>
      ${readoutRow([{ id: "ep_v", label: "膜電位の状態", value: "—" }, { id: "ep_f", label: "発火頻度", value: "—" }])}
      <p class="widget-note">膜電位トレース。刺激電流で脱分極し、<b>閾値(-55 mV)を超えると活動電位(スパイク)が発火</b>。電流が強いほど発火頻度が上がります。閾値以下では発火しません(全か無か)。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ep_plot"), { width: 460, height: 240, xDomain: [0, 100], yDomain: [-80, 40], xTicks: 5, yTicks: 4, xLabel: "時間 (ms)", yLabel: "膜電位 (mV)", xFmt: (v) => v, yFmt: (v) => v });
      const rest = -70, thr = -55;
      const depol = rest + state.i * 40; // steady depolarization from current
      const fire = depol >= thr;
      const rate = fire ? Math.min(0.15, 0.008 + (depol - thr) * 0.005) : 0; // spikes per ms (cap ~150 Hz)
      CK.hline(ctx, thr, { stroke: "#e35fa0", "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.margin.left + 32, ctx.y(thr) - 4, "閾値", { "font-size": 9, fill: "#c77", text: "閾値 -55mV" });
      const pts = [];
      let lastSpike = -999;
      for (let t = 0; t <= 100; t += 0.5) {
        let v = depol;
        if (fire) { const period = 1 / rate; const ph = ((t) % period); if (ph < 1.2) v = 30 - ph * 20; else if (ph < 3) v = -78 + (ph - 1.2) * 8; }
        pts.push([t, v]);
      }
      CK.line(ctx, pts, { stroke: ORANGE, "stroke-width": 2 });
      setReadout("ep_v", fire ? "閾値超え → 発火" : depol > rest + 5 ? "脱分極(閾値以下)" : "静止");
      setReadout("ep_f", fire ? Math.round(rate * 1000) + " Hz" : "0 Hz");
    }
    bindSlider("ep_i", (v) => (v * 100).toFixed(0) + "%", (v) => { state.i = v; draw(); });
    draw();
  };

  // 10. Awake imaging — calcium traces aligned to behavior -----------------
  W.awakeimaging = function (container) {
    const state = { t: 5 };
    // event times (s) for sound, licking, reward
    const events = { sound: [3, 12, 22, 33], lick: [5, 14, 25, 36], reward: [7, 16, 27, 38] };
    const neurons = [{ key: "sound", lab: "音応答性", col: "#3aa0ff" }, { key: "lick", lab: "行動(licking)応答性", col: "#37d67a" }, { key: "reward", lab: "報酬応答性", col: "#f97316" }];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("aw_t", "時間 (秒)", 0, 40, 0.5, state.t, (v) => v.toFixed(1) + " s")}</div>
      <div class="widget-stage"><div id="aw_plot"></div></div>
      ${readoutRow([{ id: "aw_a", label: "この瞬間に活動中の細胞", value: "—" }, { id: "aw_e", label: "直近のイベント", value: "—" }])}
      <p class="widget-note">3細胞のカルシウム蛍光(ΔF/F)。細胞ごとに<b>音・行動(licking)・報酬</b>の特定イベントに応答して活動します。カーソルを動かし、どの瞬間にどの細胞が活動するか読み解きましょう。</p>`;
    function ca(t, evs) { let v = 0.05; evs.forEach((e) => { if (t >= e) v += Math.exp(-(t - e) / 1.6); }); return Math.min(v, 1.4); }
    function draw() {
      const W2 = 460, H2 = 250, s = darkPanel(document.getElementById("aw_plot"), W2, H2, "#04070d");
      const x0 = 90, x1 = 445, rowH = 70, active = [];
      neurons.forEach((n, i) => {
        const yBase = 20 + i * rowH + 50;
        add(s, "text", { x: 8, y: yBase - 22, "font-size": 9.5, fill: n.col, text: n.lab });
        // event ticks
        events[n.key].forEach((e) => { const ex = x0 + e / 40 * (x1 - x0); add(s, "line", { x1: ex, y1: yBase - 44, x2: ex, y2: yBase + 4, stroke: n.col, "stroke-width": 1, opacity: 0.3 }); });
        let d = "";
        for (let t = 0; t <= 40; t += 0.4) { const v = ca(t, events[n.key]); const px = x0 + t / 40 * (x1 - x0), py = yBase - v * 42; d += (t === 0 ? "M" : "L") + px.toFixed(1) + " " + py.toFixed(1) + " "; }
        add(s, "path", { d: d, fill: "none", stroke: n.col, "stroke-width": 1.8 });
        if (ca(state.t, events[n.key]) > 0.35) active.push(n.lab);
      });
      // cursor
      const cx = x0 + state.t / 40 * (x1 - x0);
      add(s, "line", { x1: cx, y1: 12, x2: cx, y2: H2 - 10, stroke: "#fff", "stroke-width": 1.4, opacity: 0.8 });
      // nearest event
      let nearest = "—", nd = 999;
      Object.keys(events).forEach((k) => events[k].forEach((e) => { if (state.t >= e && state.t - e < nd) { nd = state.t - e; nearest = k === "sound" ? "音刺激" : k === "lick" ? "licking" : "報酬"; } }));
      setReadout("aw_a", active.length ? active.join(" / ") : "なし(静止)");
      setReadout("aw_e", nearest);
    }
    bindSlider("aw_t", (v) => v.toFixed(1) + " s", (v) => { state.t = v; draw(); });
    draw();
  };

  // 11. Optogenetics — ChR2/NpHR light response ----------------------------
  W.optogenetics = function (container) {
    const state = { opsin: "chr2" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("og_o", "オプシン", [{ v: "chr2", label: "ChR2(興奮性)" }, { v: "nphr", label: "NpHR(抑制性)" }], "chr2")}</div>
      <div class="widget-stage"><div id="og_plot"></div></div>
      ${readoutRow([{ id: "og_r", label: "光照射中の応答", value: "—" }, { id: "og_m", label: "機構", value: "—" }])}
      <p class="widget-note">膜電位トレース(影＝<b>青色光照射中</b>)。<b>ChR2は光で陽イオンが流入し発火</b>、<b>NpHRは光でCl⁻が流入し過分極して発火を止めます</b>。ミリ秒精度の双方向制御が特徴です。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("og_plot"), { width: 460, height: 240, xDomain: [0, 100], yDomain: [-90, 40], xTicks: 5, yTicks: 4, xLabel: "時間 (ms)", yLabel: "膜電位 (mV)", xFmt: (v) => v, yFmt: (v) => v });
      const lightOn = (t) => (t >= 30 && t <= 70);
      // shade light period
      CK.rectData(ctx, 30, -90, 70, 40, { fill: "#3aa0ff", opacity: 0.12 });
      CK.textPx(ctx, ctx.x(50), ctx.margin.top + 10, "青色光 ON", { "text-anchor": "middle", "font-size": 9.5, fill: "#5fb0ff", text: "青色光 ON" });
      const isChR2 = state.opsin === "chr2";
      const pts = [];
      const baseRate = 0.012; // spontaneous
      for (let t = 0; t <= 100; t += 0.4) {
        let v = -68;
        const on = lightOn(t);
        let rate = baseRate;
        if (isChR2 && on) rate = 0.06; // fire fast under light
        if (!isChR2 && on) { v = -85; rate = 0; } // hyperpolarized silence
        if (rate > 0) { const period = 1 / rate; const ph = t % period; if (ph < 1.2) v = 28 - ph * 18; else if (ph < 3) v = -76 + (ph - 1.2) * 7; }
        pts.push([t, v]);
      }
      CK.line(ctx, pts, { stroke: ORANGE, "stroke-width": 1.9 });
      setReadout("og_r", isChR2 ? "発火が増加(興奮)" : "発火が停止(抑制)");
      setReadout("og_m", isChR2 ? "陽イオン流入→脱分極" : "Cl⁻流入→過分極");
    }
    bindSeg("og_o", (v) => { state.opsin = v; draw(); });
    draw();
  };

  // 12. Chemogenetics — slow sustained firing-rate change -------------------
  W.chemogenetics = function (container) {
    const state = { rec: "hm3dq", t: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cg_r", "DREADD受容体", [{ v: "hm3dq", label: "hM3Dq(興奮性)" }, { v: "hm4di", label: "hM4Di(抑制性)" }], "hm3dq")}${sliderRow("cg_t", "CNO投与後の時間 (分)", 0, 120, 5, 0, (v) => v.toFixed(0) + " 分")}</div>
      <div class="widget-stage"><div id="cg_plot"></div></div>
      ${readoutRow([{ id: "cg_a", label: "神経活動", value: "—" }, { id: "cg_n", label: "光遺伝学との違い", value: "—" }])}
      <p class="widget-note">CNO投与後の神経活動(発火頻度)の時間変化。<b>hM3Dqは活動↑、hM4Diは活動↓</b>。作用は<b>数十分かけてゆっくり立ち上がり長く持続</b>します(光遺伝学のミリ秒制御とは対照的)。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("cg_plot"), { width: 460, height: 240, xDomain: [0, 120], yDomain: [0, 100], xTicks: 6, yTicks: 5, xLabel: "CNO投与後 (分)", yLabel: "発火頻度 (相対%)", xFmt: (v) => v, yFmt: (v) => v });
      const up = state.rec === "hm3dq";
      // rise ~15min, decline after ~60min
      function act(t) { const env = (1 - Math.exp(-t / 15)) * Math.exp(-Math.max(0, t - 60) / 90); return up ? 40 + 55 * env : 40 - 35 * env; }
      const pts = []; for (let t = 0; t <= 120; t += 1) pts.push([t, act(t)]);
      CK.line(ctx, pts, { stroke: ORANGE, "stroke-width": 2.6 });
      const cur = act(state.t);
      CK.vline(ctx, state.t, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.t, cur, { r: 5, fill: ORANGE });
      setReadout("cg_a", up ? "促進(興奮) " + cur.toFixed(0) + "%" : "抑制 " + cur.toFixed(0) + "%");
      setReadout("cg_n", "分オーダーで緩徐・持続");
    }
    bindSeg("cg_r", (v) => { state.rec = v; draw(); });
    bindSlider("cg_t", (v) => v.toFixed(0) + " 分", (v) => { state.t = v; draw(); });
    draw();
  };

  // 13. Open field — track + center time vs anxiety ------------------------
  W.openfield = function (container) {
    const state = { anx: 0.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("of_a", "不安の強さ", 0, 1, 0.05, state.anx, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="of_plot"></div></div>
      ${readoutRow([{ id: "of_c", label: "中央への滞在時間", value: "—" }, { id: "of_d", label: "総移動距離", value: "—" }])}
      <p class="widget-note">オープンフィールドの移動軌跡。不安が強いほど<b>壁際に偏り(thigmotaxis)、明るい中央部の滞在が減ります</b>。総移動距離(活動量)はほぼ一定のまま不安を評価します。</p>`;
    function draw() {
      const W2 = 300, H2 = 260, s = darkPanel(document.getElementById("of_plot"), W2, H2, "#0b0d12");
      const box = { x: 30, y: 20, w: 240, h: 220 };
      add(s, "rect", { x: box.x, y: box.y, width: box.w, height: box.h, rx: 4, fill: "#12151d", stroke: "#2a303c", "stroke-width": 1.5 });
      // center zone
      const cz = { x: box.x + box.w * 0.28, y: box.y + box.h * 0.28, w: box.w * 0.44, h: box.h * 0.44 };
      add(s, "rect", { x: cz.x, y: cz.y, width: cz.w, height: cz.h, rx: 3, fill: ORANGE, opacity: 0.1, stroke: ORANGE, "stroke-dasharray": "4 3", "stroke-width": 1 });
      add(s, "text", { x: box.x + box.w / 2, y: box.y + box.h / 2, "text-anchor": "middle", "font-size": 9, fill: "#8a5a2b", text: "中央" });
      // random walk track biased to edge by anxiety
      const rng = CK.makeRng(713);
      let px = box.x + box.w / 2, py = box.y + box.h / 2, d = `M ${px} ${py} `, centerSteps = 0, total = 0;
      for (let k = 0; k < 900; k++) {
        // bias toward walls if anxious
        const towardEdgeX = (px < box.x + box.w / 2 ? -1 : 1) * state.anx * 1.2;
        const towardEdgeY = (py < box.y + box.h / 2 ? -1 : 1) * state.anx * 1.2;
        const nx = px + (rng() - 0.5) * 14 + towardEdgeX * 3;
        const ny = py + (rng() - 0.5) * 14 + towardEdgeY * 3;
        px = clamp(nx, box.x + 6, box.x + box.w - 6); py = clamp(ny, box.y + 6, box.y + box.h - 6);
        total += 1;
        if (px > cz.x && px < cz.x + cz.w && py > cz.y && py < cz.y + cz.h) centerSteps++;
        d += `L ${px.toFixed(1)} ${py.toFixed(1)} `;
      }
      add(s, "path", { d: d, fill: "none", stroke: "#5fd0c0", "stroke-width": 0.8, opacity: 0.7 });
      const centerPct = centerSteps / total * 100;
      setReadout("of_c", (centerPct * 3).toFixed(0) + " 秒相当 (" + centerPct.toFixed(0) + "%)");
      setReadout("of_d", "≈ 一定 (活動量の指標)");
    }
    bindSlider("of_a", (v) => (v * 100).toFixed(0) + "%", (v) => { state.anx = v; draw(); });
    draw();
  };

  // 14. Morris water maze — escape latency learning curve ------------------
  W.watermaze = function (container) {
    const state = { mem: 0.7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("wm_m", "空間記憶能力", 0.1, 1, 0.05, state.mem, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="wm_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#9aa6b4"></span>対照群</span><span class="li"><span class="sw" style="background:#f97316"></span>実験群</span></div></div>
      ${readoutRow([{ id: "wm_l", label: "4日目の探索時間", value: "—" }, { id: "wm_j", label: "空間記憶", value: "—" }])}
      <p class="widget-note">hidden platform taskの学習曲線。台の位置を覚えるほど<b>探索時間(escape latency)が日ごとに短縮</b>します。空間記憶が低いと曲線が下がらず、対照(灰)と差が開きます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("wm_plot"), { width: 440, height: 250, xDomain: [1, 4], yDomain: [0, 60], xTicks: 3, yTicks: 4, xLabel: "訓練日 (Day)", yLabel: "Escape latency (s)", xFmt: (v) => v, yFmt: (v) => v });
      function curve(mem) { const pts = []; for (let d = 1; d <= 4; d += 0.1) pts.push([d, 12 + 42 * Math.exp(-(d - 1) * mem)]); return pts; }
      CK.line(ctx, curve(0.85), { stroke: "#9aa6b4", "stroke-width": 2.2, "stroke-dasharray": "4 3" });
      CK.line(ctx, curve(state.mem), { stroke: ORANGE, "stroke-width": 2.6 });
      [1, 2, 3, 4].forEach((d) => CK.dot(ctx, d, 12 + 42 * Math.exp(-(d - 1) * state.mem), { r: 3.6, fill: ORANGE }));
      const l4 = 12 + 42 * Math.exp(-3 * state.mem);
      setReadout("wm_l", l4.toFixed(0) + " 秒");
      setReadout("wm_j", state.mem > 0.6 ? "良好(速く学習)" : state.mem > 0.35 ? "やや低下" : "低下(学習しにくい)");
    }
    bindSlider("wm_m", (v) => (v * 100).toFixed(0) + "%", (v) => { state.mem = v; draw(); });
    draw();
  };

  // 15. Three-chamber — sociability -----------------------------------------
  W.threechamber = function (container) {
    const state = { soc: 0.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("tc_s", "社会性", 0, 1, 0.05, state.soc, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="tc_plot"></div></div>
      ${readoutRow([{ id: "tc_a", label: "新奇動物側の滞在", value: "—" }, { id: "tc_e", label: "空ケージ側の滞在", value: "—" }])}
      <p class="widget-note">3部屋装置。<b>社会性が高いほど、新奇動物のいるケージ側に長く滞在</b>します(匂い嗅ぎなどの社会的行動)。社会性が低いと空ケージとの差がなくなります。</p>`;
    function draw() {
      const W2 = 460, H2 = 200, s = darkPanel(document.getElementById("tc_plot"), W2, H2, "#0b0d12");
      // three chambers
      [0, 1, 2].forEach((i) => add(s, "rect", { x: 20 + i * 145, y: 20, width: 138, height: 130, rx: 4, fill: "#12151d", stroke: "#2a303c", "stroke-width": 1 }));
      // empty cage (left), subject (center), novel animal (right)
      add(s, "circle", { cx: 89, cy: 85, r: 26, fill: "none", stroke: "#5a6472", "stroke-width": 1.5, "stroke-dasharray": "3 3" });
      add(s, "text", { x: 89, y: 130, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "空ケージ" });
      add(s, "circle", { cx: 234, cy: 85, r: 10, fill: "#c9d4e6" });
      add(s, "text", { x: 234, y: 130, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "被験動物" });
      add(s, "circle", { cx: 379, cy: 85, r: 26, fill: "none", stroke: ORANGE, "stroke-width": 1.5 });
      add(s, "circle", { cx: 379, cy: 85, r: 11, fill: ORANGE, opacity: 0.7 });
      add(s, "text", { x: 379, y: 130, "text-anchor": "middle", "font-size": 9, fill: "#f4b48a", text: "新奇動物" });
      // subject position drifts toward novel side with sociability
      const sx = 234 + (state.soc - 0.5) * 200;
      add(s, "circle", { cx: clamp(sx, 60, 400), cy: 168, r: 8, fill: "#5fd0c0" });
      add(s, "text", { x: 240, y: 186, "text-anchor": "middle", "font-size": 8.5, fill: "#7f8ca3", text: "↑滞在の偏り" });
      const novel = 40 + state.soc * 55, empty = 40 + (1 - state.soc) * 45;
      setReadout("tc_a", Math.round(novel * 2) + " 秒");
      setReadout("tc_e", Math.round(empty * 2) + " 秒");
    }
    bindSlider("tc_s", (v) => (v * 100).toFixed(0) + "%", (v) => { state.soc = v; draw(); });
    draw();
  };

  // 16. Rotarod — latency to fall learning curve --------------------------
  W.rotarod = function (container) {
    const state = { learn: 0.7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("rr_l", "運動学習能力", 0.1, 1, 0.05, state.learn, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="rr_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#9aa6b4"></span>対照群</span><span class="li"><span class="sw" style="background:#f97316"></span>実験群</span></div></div>
      ${readoutRow([{ id: "rr_l6", label: "6回目の落下潜時", value: "—" }, { id: "rr_j", label: "運動学習", value: "—" }])}
      <p class="widget-note">ロータロッドの学習曲線。訓練(trial)を重ねるほど<b>落下までの時間(latency to fall)が延び</b>ます。運動学習能力が低いと伸びが悪く、対照(灰)と差が開きます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("rr_plot"), { width: 440, height: 250, xDomain: [1, 6], yDomain: [0, 300], xTicks: 5, yTicks: 5, xLabel: "試験回 (Trial)", yLabel: "Latency to fall (s)", xFmt: (v) => v, yFmt: (v) => v });
      function curve(l) { const pts = []; for (let t = 1; t <= 6; t += 0.1) pts.push([t, 80 + (270 - 80) * (1 - Math.exp(-(t - 1) * 0.5 * l))]); return pts; }
      CK.line(ctx, curve(0.9), { stroke: "#9aa6b4", "stroke-width": 2.2, "stroke-dasharray": "4 3" });
      CK.line(ctx, curve(state.learn), { stroke: ORANGE, "stroke-width": 2.6 });
      [1, 2, 3, 4, 5, 6].forEach((t) => CK.dot(ctx, t, 80 + (270 - 80) * (1 - Math.exp(-(t - 1) * 0.5 * state.learn)), { r: 3.6, fill: ORANGE }));
      const l6 = 80 + (270 - 80) * (1 - Math.exp(-5 * 0.5 * state.learn));
      setReadout("rr_l6", l6.toFixed(0) + " 秒");
      setReadout("rr_j", state.learn > 0.6 ? "良好(上達)" : state.learn > 0.35 ? "やや不良" : "低下(伸びにくい)");
    }
    bindSlider("rr_l", (v) => (v * 100).toFixed(0) + "%", (v) => { state.learn = v; draw(); });
    draw();
  };

  // 17. PPI — prepulse inhibition of startle -------------------------------
  W.ppi = function (container) {
    const state = { gate: 0.7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pp_g", "感覚運動ゲーティング機能", 0, 1, 0.05, state.gate, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="pp_plot"></div></div>
      ${readoutRow([{ id: "pp_r", label: "PPI ratio", value: "—" }, { id: "pp_j", label: "解釈", value: "—" }])}
      <p class="widget-note">パルス単独 vs プレパルス＋パルスの驚愕反応強度。<b>ゲーティングが働くほどプレパルスが驚愕反応を強く抑え、PPI%が高く</b>なります。障害されると(統合失調症モデル)PPIが低下します。</p>`;
    function draw() {
      const W2 = 440, H2 = 240, s = darkPanel(document.getElementById("pp_plot"), W2, H2, "#0b0d12");
      const y1 = 200, maxh = 150, pulseAlone = 1.0, withPre = pulseAlone * (1 - 0.8 * state.gate);
      const ppi = (pulseAlone - withPre) / pulseAlone * 100;
      [{ x: 90, v: pulseAlone, lab: "パルス単独", col: "#9aa6b4" }, { x: 250, v: withPre, lab: "プレパルス+パルス", col: ORANGE }].forEach((b) => {
        const bh = b.v * maxh;
        add(s, "rect", { x: b.x, y: y1 - bh, width: 90, height: bh, rx: 3, fill: b.col, opacity: 0.85 });
        add(s, "text", { x: b.x + 45, y: y1 + 18, "text-anchor": "middle", "font-size": 10, fill: "#9fb0c8", text: b.lab });
      });
      // arrow showing suppression
      add(s, "line", { x1: 340, y1: y1 - pulseAlone * maxh, x2: 340, y2: y1 - withPre * maxh, stroke: "#e35fa0", "stroke-width": 2 });
      add(s, "text", { x: 366, y: y1 - (pulseAlone + withPre) / 2 * maxh, "font-size": 10, fill: "#e35fa0", "font-weight": 700, text: "抑制" });
      add(s, "text", { x: 22, y: 30, "font-size": 10, fill: "#9fb0c8", text: "驚愕反応強度" });
      setReadout("pp_r", ppi.toFixed(0) + "%");
      setReadout("pp_j", ppi > 55 ? "正常(よく抑制)" : ppi > 30 ? "中間" : "低下(ゲーティング障害)");
    }
    bindSlider("pp_g", (v) => (v * 100).toFixed(0) + "%", (v) => { state.gate = v; draw(); });
    draw();
  };
})();

/* 第4章：細胞の形態や性質の解析 — 15 interactive widgets
   （サイトメトリー散布図・DNA量ヒスト・用量反応・染色像など） */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const TEAL = "#0fb9d4";
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f2f4f8" }); return s; }
  function gauss(x, mu, sd) { return Math.exp(-0.5 * Math.pow((x - mu) / sd, 2)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // 1. Flow cytometry — 2-parameter dot plot with quadrant gating -----------
  W.fcm = function (container) {
    const rng = CK.makeRng(401), N = 260, cells = [];
    for (let i = 0; i < N; i++) {
      const aPos = rng() < 0.5;
      const ax = aPos ? 62 + CK.randNormal(0, 9, rng) : 20 + CK.randNormal(0, 7, rng);
      cells.push({ ax: clamp(ax, 2, 98), bHigh: clamp(66 + CK.randNormal(0, 9, rng), 2, 98), bLow: clamp(18 + CK.randNormal(0, 7, rng), 2, 98), u: rng() });
    }
    const state = { p: 0.45 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("fcm_p", "CD-B陽性率", 0, 1, 0.05, state.p, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="fcm_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#e35fa0"></span>A⁺B⁺</span><span class="li"><span class="sw" style="background:#0fb9d4"></span>A⁻B⁺</span><span class="li"><span class="sw" style="background:#f5a623"></span>A⁺B⁻</span><span class="li"><span class="sw" style="background:#7a879c"></span>A⁻B⁻</span></div></div>
      ${readoutRow([{ id: "fcm_pp", label: "右上 A⁺B⁺", value: "—" }, { id: "fcm_np", label: "左上 A⁻B⁺", value: "—" }, { id: "fcm_pn", label: "右下 A⁺B⁻", value: "—" }, { id: "fcm_nn", label: "左下 A⁻B⁻", value: "—" }])}
      <p class="widget-note">点線が<b>ゲートの境界</b>。CD-B陽性率を上げると細胞が上へ移り、四分画（Q1〜Q4）の％が変わります。これがゲーティングで読む値です。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("fcm_plot"), { width: 440, height: 330, xDomain: [0, 100], yDomain: [0, 100], xTicks: 5, yTicks: 5, xLabel: "CD-A（蛍光強度）", yLabel: "CD-B（蛍光強度）", xFmt: (v) => v, yFmt: (v) => v });
      const thr = 40, q = [0, 0, 0, 0];
      cells.forEach((c) => {
        const by = c.u < state.p ? c.bHigh : c.bLow;
        const aPos = c.ax >= thr, bPos = by >= thr;
        let color;
        if (bPos && aPos) { q[0]++; color = "#e35fa0"; }
        else if (bPos && !aPos) { q[1]++; color = "#0fb9d4"; }
        else if (!bPos && aPos) { q[2]++; color = "#f5a623"; }
        else { q[3]++; color = "#7a879c"; }
        CK.dot(ctx, c.ax, by, { r: 3, fill: color, opacity: 0.72 });
      });
      CK.vline(ctx, thr, { stroke: "#3b4256", "stroke-dasharray": "5 4", "stroke-width": 1.3 });
      CK.hline(ctx, thr, { stroke: "#3b4256", "stroke-dasharray": "5 4", "stroke-width": 1.3 });
      const pc = (v) => (v / N * 100).toFixed(1) + "%";
      setReadout("fcm_pp", pc(q[0])); setReadout("fcm_np", pc(q[1])); setReadout("fcm_pn", pc(q[2])); setReadout("fcm_nn", pc(q[3]));
    }
    bindSlider("fcm_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.p = v; draw(); });
    draw();
  };

  // 2. Mass cytometry — spillover matrix (fluorescence vs mass) --------------
  W.cytof = function (container) {
    const n = 8, state = { mode: "fluor" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cy_m", "検出方式", [{ v: "fluor", label: "蛍光（FCM）" }, { v: "mass", label: "質量（CyTOF）" }], "fluor")}</div>
      <div class="widget-stage"><div id="cy_plot"></div></div>
      ${readoutRow([{ id: "cy_sp", label: "隣接chへの漏れ込み", value: "—" }, { id: "cy_np", label: "同時測定しやすさ", value: "—" }])}
      <p class="widget-note">対角＝本来のシグナル。<b>蛍光は対角以外にも色がにじみ（スピルオーバー）</b>、補正が必要です。質量ではほぼ対角だけになり、多数のマーカーを補正なしで測れます。</p>`;
    function val(i, j) {
      if (i === j) return 1;
      const d = Math.abs(i - j);
      if (state.mode === "fluor") return d === 1 ? 0.28 : d === 2 ? 0.10 : 0.02;
      return d === 1 ? 0.03 : 0.008;
    }
    function draw() {
      const W2 = 430, H2 = 300, s = lightPanel(document.getElementById("cy_plot"), W2, H2, "#ffffff");
      const x0 = 70, y0 = 26, cell = 30;
      for (let i = 0; i < n; i++) {
        add(s, "text", { x: x0 - 8, y: y0 + i * cell + cell / 2 + 4, "text-anchor": "end", "font-size": 10.5, fill: "#616a7d", text: "M" + (i + 1) });
        add(s, "text", { x: x0 + i * cell + cell / 2, y: y0 - 8, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "M" + (i + 1) });
        for (let j = 0; j < n; j++) {
          const v = val(i, j);
          add(s, "rect", { x: x0 + j * cell, y: y0 + i * cell, width: cell - 2, height: cell - 2, rx: 2, fill: TEAL, opacity: clamp(v, 0.03, 1), stroke: "#e2e6ee", "stroke-width": 1 });
        }
      }
      add(s, "text", { x: x0 + n * cell / 2, y: y0 + n * cell + 22, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", "font-weight": 700, text: "標識マーカー" });
      add(s, "text", { x: 16, y: y0 + n * cell / 2, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", "font-weight": 700, transform: `rotate(-90 16 ${y0 + n * cell / 2})`, text: "検出チャンネル" });
      setReadout("cy_sp", state.mode === "fluor" ? "大きい（要補正）" : "ほぼ無し");
      setReadout("cy_np", state.mode === "fluor" ? "色数に限り" : "40超も容易");
    }
    bindSeg("cy_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 3. Imaging flow cytometry — similarity-score histogram + thumbnails ------
  W.ifc = function (container) {
    const state = { p: 0.35 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ifc_p", "核内移行した細胞の割合", 0, 1, 0.05, state.p, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ifc_hist"></div></div>
      <div class="widget-stage" style="margin-top:10px"><div id="ifc_thumb"></div></div>
      ${readoutRow([{ id: "ifc_v", label: "核内移行 陽性率", value: "—" }, { id: "ifc_med", label: "類似度スコア中央値", value: "—" }])}
      <p class="widget-note">軸は蛍光“強度”ではなく画像由来の<b>核内移行の類似度スコア</b>。下のサムネイルが、細胞質にびまん性（低スコア）→核に集中（高スコア）へ変わります。</p>`;
    function draw() {
      // histogram: two populations (cytoplasmic ~ low score, nuclear ~ high score)
      const ctx = CK.plot(document.getElementById("ifc_hist"), { width: 440, height: 210, xDomain: [0, 100], yDomain: [0, 1.05], xTicks: 5, yTicks: 4, xLabel: "核-転写因子 類似度スコア", yLabel: "細胞数", xFmt: (v) => v, yFmt: () => "" });
      const bins = 40, counts = [];
      let maxc = 0;
      for (let b = 0; b < bins; b++) {
        const sx = (b + 0.5) / bins * 100;
        const c = (1 - state.p) * gauss(sx, 28, 11) + state.p * gauss(sx, 74, 10);
        counts.push([sx, c]); maxc = Math.max(maxc, c);
      }
      const bw = 100 / bins;
      counts.forEach((d) => {
        const hy = d[1] / maxc;
        CK.rectData(ctx, d[0] - bw / 2, 0, d[0] + bw / 2, hy, { fill: d[0] < 50 ? "#7a879c" : "#37d67a", opacity: 0.8 });
      });
      CK.vline(ctx, 50, { stroke: "#e35fa0", "stroke-dasharray": "5 4", "stroke-width": 1.3 });
      // thumbnails
      const W2 = 440, H2 = 118, s = darkPanel(document.getElementById("ifc_thumb"), W2, H2, "#04121a");
      const scores = [0.12, 0.38, 0.62, 0.9];
      scores.forEach((base, k) => {
        const cx = 62 + k * 108, cy = 58;
        const nuclear = clamp((state.p - (1 - base)) * 1.6 + 0.3, 0, 1); // higher p -> more nuclear
        add(s, "circle", { cx: cx, cy: cy, r: 40, fill: "#0a1f2b", stroke: "#1d3a48", "stroke-width": 1 });
        // cytoplasmic diffuse green
        add(s, "circle", { cx: cx, cy: cy, r: 34, fill: "#37d67a", opacity: 0.10 * (1 - nuclear) + 0.03 });
        // nucleus (blue) with translocated signal
        add(s, "circle", { cx: cx, cy: cy, r: 16, fill: "#2f6bd8", opacity: 0.5 });
        add(s, "circle", { cx: cx, cy: cy, r: 15, fill: "#37d67a", opacity: 0.15 + 0.7 * nuclear });
        add(s, "text", { x: cx, y: 108, "text-anchor": "middle", "font-size": 10, fill: "#8aa0b0", text: nuclear > 0.55 ? "核内移行⁺" : "細胞質" });
      });
      setReadout("ifc_v", (state.p * 100).toFixed(0) + "%");
      setReadout("ifc_med", state.p < 0.5 ? "低い（細胞質）" : "高い（核内）");
    }
    bindSlider("ifc_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.p = v; draw(); });
    draw();
  };

  // 4. Ghost cytometry — waveforms + classifier threshold -------------------
  W.ghost = function (container) {
    const state = { thr: 50 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("gh_t", "分類のしきい値", 20, 80, 1, state.thr, (v) => v.toFixed(0))}</div>
      <div class="widget-stage"><div id="gh_wave"></div></div>
      <div class="widget-stage" style="margin-top:10px"><div id="gh_dist"></div></div>
      ${readoutRow([{ id: "gh_pur", label: "分取したB細胞の純度", value: "—" }, { id: "gh_rec", label: "B細胞の回収率", value: "—" }])}
      <p class="widget-note">画像を作らず、細胞の<b>形態が乗った時間波形</b>を機械学習で分類。しきい値の右を「B細胞」として分取します。境界を動かすと純度と回収率が変わります。</p>`;
    function draw() {
      // waveforms
      const W2 = 440, H2 = 96, s = darkPanel(document.getElementById("gh_wave"), W2, H2, "#04121a");
      function wave(x0, color, seed) {
        let d = "", rng = CK.makeRng(seed);
        for (let i = 0; i <= 90; i++) {
          const x = x0 + i * 1.9;
          const y = 48 + Math.sin(i / 5 + seed) * 14 * gauss(i, 45, 26) + (rng() - 0.5) * 6;
          d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
        }
        add(s, "path", { d: d, fill: "none", stroke: color, "stroke-width": 1.6, opacity: 0.9 });
      }
      wave(20, "#37d67a", 3); wave(230, "#f5a623", 8);
      add(s, "text", { x: 40, y: 16, "font-size": 10.5, fill: "#37d67a", text: "細胞A の波形" });
      add(s, "text", { x: 250, y: 16, "font-size": 10.5, fill: "#f5a623", text: "細胞B の波形" });
      // score distributions
      const ctx = CK.plot(document.getElementById("gh_dist"), { width: 440, height: 210, xDomain: [0, 100], yDomain: [0, 1.05], xTicks: 5, yTicks: 4, xLabel: "分類器スコア（形態）", yLabel: "細胞数", xFmt: (v) => v, yFmt: () => "" });
      const bins = 46; let maxc = 0; const A = [], B = [];
      for (let b = 0; b < bins; b++) { const sx = (b + 0.5) / bins * 100; const a = gauss(sx, 38, 10), bb = gauss(sx, 66, 10); A.push([sx, a]); B.push([sx, bb]); maxc = Math.max(maxc, a, bb); }
      const bw = 100 / bins;
      A.forEach((d) => CK.rectData(ctx, d[0] - bw / 2, 0, d[0] + bw / 2, d[1] / maxc, { fill: "#37d67a", opacity: 0.55 }));
      B.forEach((d) => CK.rectData(ctx, d[0] - bw / 2, 0, d[0] + bw / 2, d[1] / maxc, { fill: "#f5a623", opacity: 0.55 }));
      CK.vline(ctx, state.thr, { stroke: "#e35fa0", "stroke-width": 2 });
      // integrate above threshold
      let aAbove = 0, bAbove = 0, bTot = 0;
      for (let b = 0; b < 400; b++) { const sx = b / 400 * 100; const a = gauss(sx, 38, 10), bb = gauss(sx, 66, 10); bTot += bb; if (sx >= state.thr) { aAbove += a; bAbove += bb; } }
      const purity = bAbove / (aAbove + bAbove) * 100;
      const recall = bAbove / bTot * 100;
      setReadout("gh_pur", purity.toFixed(1) + "%");
      setReadout("gh_rec", recall.toFixed(1) + "%");
    }
    bindSlider("gh_t", (v) => v.toFixed(0), (v) => { state.thr = v; draw(); });
    draw();
  };

  // 5. Cell cycle — DNA content histogram -----------------------------------
  W.cellcycle = function (container) {
    const state = { mode: "normal" };
    const wts = { normal: [0.60, 0.15, 0.25], g1: [0.85, 0.05, 0.10], s: [0.20, 0.60, 0.20], g2m: [0.15, 0.10, 0.75] };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cc_m", "細胞の状態", [{ v: "normal", label: "正常（増殖中）" }, { v: "g1", label: "G1停止" }, { v: "s", label: "S期停止" }, { v: "g2m", label: "G2/M停止" }], "normal")}</div>
      <div class="widget-stage"><div id="cc_plot"></div></div>
      ${readoutRow([{ id: "cc_g1", label: "G0/G1 (2N)", value: "—" }, { id: "cc_s", label: "S期", value: "—" }, { id: "cc_g2", label: "G2/M (4N)", value: "—" }])}
      <p class="widget-note">PI染色のDNA量ヒスト。左の山＝<b>G0/G1(2N)</b>、右の山＝<b>G2/M(4N)</b>、谷間が<b>S期</b>。停止させる周期を変えると山の大小が入れ替わります。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("cc_plot"), { width: 440, height: 300, xDomain: [100, 480], yDomain: [0, 1.05], xTicks: 4, yTicks: 4, xLabel: "DNA量（PI蛍光）", yLabel: "細胞数", xFmt: (v) => (v <= 210 ? "2N" : v >= 390 ? "4N" : ""), yFmt: () => "" });
      const w = wts[state.mode];
      const f = (x) => w[0] * gauss(x, 200, 15) + w[1] * (Math.exp(-Math.pow((x - 300) / 95, 8)) * 0.9) + w[2] * gauss(x, 400, 17);
      const top = [], bot = []; let maxc = 0;
      for (let x = 100; x <= 480; x += 3) { const c = f(x); top.push([x, c]); maxc = Math.max(maxc, c); }
      const topN = top.map((d) => [d[0], d[1] / maxc]);
      for (let x = 100; x <= 480; x += 3) bot.push([x, 0]);
      // region shading
      CK.rectData(ctx, 150, 0, 250, 1.05, { fill: "#5b8bff", opacity: 0.08 });
      CK.rectData(ctx, 250, 0, 350, 1.05, { fill: "#f5a623", opacity: 0.08 });
      CK.rectData(ctx, 350, 0, 450, 1.05, { fill: "#e35fa0", opacity: 0.08 });
      CK.area(ctx, topN, bot.map((d) => [d[0], 0]), { fill: TEAL, opacity: 0.22 });
      CK.line(ctx, topN, { stroke: TEAL, "stroke-width": 2.2 });
      CK.textPx(ctx, ctx.x(200), ctx.margin.top + 12, "G1", { "text-anchor": "middle", fill: "#5b8bff", "font-weight": 700, "font-size": 11 });
      CK.textPx(ctx, ctx.x(300), ctx.margin.top + 12, "S", { "text-anchor": "middle", fill: "#c98a1a", "font-weight": 700, "font-size": 11 });
      CK.textPx(ctx, ctx.x(400), ctx.margin.top + 12, "G2/M", { "text-anchor": "middle", fill: "#e35fa0", "font-weight": 700, "font-size": 11 });
      const tot = w[0] + w[1] + w[2];
      setReadout("cc_g1", (w[0] / tot * 100).toFixed(0) + "%");
      setReadout("cc_s", (w[1] / tot * 100).toFixed(0) + "%");
      setReadout("cc_g2", (w[2] / tot * 100).toFixed(0) + "%");
    }
    bindSeg("cc_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 6. Fucci — cell-cycle color indicator -----------------------------------
  W.fucci = function (container) {
    const state = { t: 0.15 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("fu_t", "細胞周期の進行", 0, 1, 0.02, state.t, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="fu_plot"></div></div>
      ${readoutRow([{ id: "fu_ph", label: "現在の周期", value: "—" }, { id: "fu_col", label: "蛍光の色", value: "—" }])}
      <p class="widget-note">G1期は<b>赤</b>（Cdt1）、S/G2/M期は<b>緑</b>（Geminin）、移行期は両方光って<b>黄</b>。生きた細胞の周期を色でリアルタイムに追えます。</p>`;
    function draw() {
      const W2 = 440, H2 = 250, s = darkPanel(document.getElementById("fu_plot"), W2, H2, "#05080f");
      // phase ring
      const cx = 130, cy = 125, R = 82;
      const segs = [{ a0: -90, a1: 40, col: "#ff4d5e", lab: "G1" }, { a0: 40, a1: 75, col: "#f5d90a", lab: "G1/S" }, { a0: 75, a1: 270, col: "#37d67a", lab: "S/G2/M" }];
      function pol(a, r) { const rad = a * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; }
      segs.forEach((sg) => {
        const p0 = pol(sg.a0, R), p1 = pol(sg.a1, R), large = (sg.a1 - sg.a0) > 180 ? 1 : 0;
        add(s, "path", { d: `M ${cx} ${cy} L ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${R} ${R} 0 ${large} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Z`, fill: sg.col, opacity: 0.22, stroke: sg.col, "stroke-width": 1 });
      });
      // marker at current phase
      const ang = -90 + state.t * 360;
      const mp = pol(ang, R);
      add(s, "line", { x1: cx, y1: cy, x2: mp[0], y2: mp[1], stroke: "#fff", "stroke-width": 2 });
      add(s, "circle", { cx: mp[0], cy: mp[1], r: 6, fill: "#fff" });
      add(s, "text", { x: cx, y: cy + R + 26, "text-anchor": "middle", "font-size": 10.5, fill: "#8aa0b0", text: "細胞周期リング" });
      // color of the cell
      let red, green, phase;
      if (state.t < 0.36) { red = 0.9; green = 0.08; phase = "G1期"; }
      else if (state.t < 0.5) { const f = (state.t - 0.36) / 0.14; red = 0.9 - 0.5 * f; green = 0.1 + 0.7 * f; phase = "G1/S移行期"; }
      else { red = 0.08; green = 0.92; phase = "S/G2/M期"; }
      const cellCx = 335, cellCy = 125;
      add(s, "ellipse", { cx: cellCx, cy: cellCy, rx: 52, ry: 44, fill: "#0a1420", stroke: "#22303f", "stroke-width": 1 });
      add(s, "ellipse", { cx: cellCx, cy: cellCy, rx: 30, ry: 26, fill: "#ff4d5e", opacity: red });
      add(s, "ellipse", { cx: cellCx, cy: cellCy, rx: 30, ry: 26, fill: "#37d67a", opacity: green });
      add(s, "text", { x: cellCx, y: cellCy + 66, "text-anchor": "middle", "font-size": 10.5, fill: "#8aa0b0", text: "細胞核の蛍光" });
      const colName = state.t < 0.36 ? "赤（Cdt1）" : state.t < 0.5 ? "黄（両方）" : "緑（Geminin）";
      setReadout("fu_ph", phase); setReadout("fu_col", colName);
    }
    bindSlider("fu_t", (v) => (v * 100).toFixed(0) + "%", (v) => { state.t = v; draw(); });
    draw();
  };

  // 7. Proliferation — growth curves ----------------------------------------
  W.proliferation = function (container) {
    const state = { rate: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pr_r", "処理群の増殖速度", 0.5, 2.0, 0.05, state.rate, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="pr_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#7a879c"></span>コントロール</span><span class="li"><span class="sw" style="background:#0fb9d4"></span>処理群</span></div></div>
      ${readoutRow([{ id: "pr_dt", label: "処理群の倍加時間", value: "—" }, { id: "pr_fc", label: "6日目の相対細胞数", value: "—" }])}
      <p class="widget-note">増殖曲線は指数関数的に立ち上がります。傾きが急なほど<b>倍加時間（ダブリングタイム）が短い＝増殖が速い</b>。灰のコントロールと比較しましょう。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("pr_plot"), { width: 440, height: 300, xDomain: [0, 6], yDomain: [0, 36], xTicks: 6, yTicks: 6, xLabel: "培養日数", yLabel: "相対細胞数 (×10⁴)", xFmt: (v) => v, yFmt: (v) => v });
      const dtCtrl = 2.4, dtTreat = 2.4 / state.rate;
      function curve(dt) { const pts = []; for (let t = 0; t <= 6; t += 0.2) pts.push([t, Math.pow(2, t / dt)]); return pts; }
      CK.line(ctx, curve(dtCtrl), { stroke: "#7a879c", "stroke-width": 2.2 });
      CK.line(ctx, curve(dtTreat), { stroke: TEAL, "stroke-width": 2.6 });
      [0, 1, 2, 3, 4, 5, 6].forEach((t) => CK.dot(ctx, t, Math.pow(2, t / dtTreat), { r: 3.5, fill: TEAL }));
      setReadout("pr_dt", dtTreat.toFixed(2) + " 日");
      setReadout("pr_fc", Math.pow(2, 6 / dtTreat).toFixed(1) + " ×10⁴");
    }
    bindSlider("pr_r", (v) => "×" + v.toFixed(2), (v) => { state.rate = v; draw(); });
    draw();
  };

  // 8. Annexin V / PI — apoptosis quadrant plot -----------------------------
  W.annexinv = function (container) {
    const rng = CK.makeRng(408), N = 260, cells = [];
    for (let i = 0; i < N; i++) cells.push({ u: rng(), jx: CK.randNormal(0, 6, rng), jy: CK.randNormal(0, 6, rng) });
    const state = { p: 0.2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("av_p", "アポトーシス誘導", 0, 1, 0.05, state.p, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="av_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#37d67a"></span>生細胞</span><span class="li"><span class="sw" style="background:#f5a623"></span>初期アポ</span><span class="li"><span class="sw" style="background:#e35fa0"></span>後期アポ/壊死</span></div></div>
      ${readoutRow([{ id: "av_live", label: "生細胞", value: "—" }, { id: "av_early", label: "初期アポ", value: "—" }, { id: "av_late", label: "後期アポ", value: "—" }])}
      <p class="widget-note">横=Annexin V、縦=PI。誘導を上げると、細胞が<b>左下（生）→右下（初期アポ）→右上（後期アポ）</b>へと移っていきます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("av_plot"), { width: 440, height: 330, xDomain: [0, 100], yDomain: [0, 100], xTicks: 5, yTicks: 5, xLabel: "Annexin V", yLabel: "PI", xFmt: (v) => v, yFmt: (v) => v });
      const thr = 40; let live = 0, early = 0, late = 0, necro = 0;
      cells.forEach((c) => {
        let ax, py, color;
        if (c.u > state.p) { ax = 20 + c.jx; py = 20 + c.jy; color = "#37d67a"; }        // live
        else if (c.u > state.p * 0.45) { ax = 70 + c.jx; py = 22 + c.jy; color = "#f5a623"; } // early
        else { ax = 72 + c.jx; py = 72 + c.jy; color = "#e35fa0"; }                          // late
        ax = clamp(ax, 2, 98); py = clamp(py, 2, 98);
        const aPos = ax >= thr, pPos = py >= thr;
        if (!aPos && !pPos) live++; else if (aPos && !pPos) early++; else if (aPos && pPos) late++; else necro++;
        CK.dot(ctx, ax, py, { r: 3, fill: color, opacity: 0.72 });
      });
      CK.vline(ctx, thr, { stroke: "#3b4256", "stroke-dasharray": "5 4", "stroke-width": 1.3 });
      CK.hline(ctx, thr, { stroke: "#3b4256", "stroke-dasharray": "5 4", "stroke-width": 1.3 });
      const pc = (v) => (v / N * 100).toFixed(1) + "%";
      setReadout("av_live", pc(live)); setReadout("av_early", pc(early)); setReadout("av_late", pc(late));
    }
    bindSlider("av_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.p = v; draw(); });
    draw();
  };

  // 9. Comet assay — single-cell gel electrophoresis ------------------------
  W.tunel = function (container) {
    const state = { d: 0.3 };
    const rng = CK.makeRng(409), comets = [];
    for (let i = 0; i < 5; i++) comets.push({ x: 70 + (i % 5) * 78, y: 70 + (i < 5 ? 0 : 90), r: 15 + rng() * 3, seed: 20 + i });
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("tu_d", "DNA損傷の程度", 0, 1, 0.05, state.d, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="tu_plot"></div></div>
      ${readoutRow([{ id: "tu_tail", label: "尾のDNA割合", value: "—" }, { id: "tu_tm", label: "テールモーメント", value: "—" }])}
      <p class="widget-note">Comet assay（単一細胞ゲル電気泳動）。切断されたDNAが電気泳動で右へ流れ出し<b>“彗星の尾”</b>になります。損傷が多いほど尾が長く濃くなります。</p>`;
    function draw() {
      const W2 = 440, H2 = 190, s = darkPanel(document.getElementById("tu_plot"), W2, H2, "#03100a");
      add(s, "text", { x: W2 - 12, y: 18, "text-anchor": "end", "font-size": 10, fill: "#5f8a6f", text: "＋（陽極）→" });
      const tailFrac = 0.05 + 0.7 * state.d;
      comets.forEach((c) => {
        const cy = 95;
        const tailLen = 12 + 118 * state.d;
        // tail gradient
        const gid = "cg" + c.x;
        const defs = add(s, "defs", {});
        const lg = add(defs, "linearGradient", { id: gid, x1: "0", y1: "0", x2: "1", y2: "0" });
        add(lg, "stop", { offset: "0%", "stop-color": "#7dffb0", "stop-opacity": 0.85 });
        add(lg, "stop", { offset: "100%", "stop-color": "#2fae6a", "stop-opacity": 0.05 });
        add(s, "ellipse", { cx: c.x + tailLen / 2, cy: cy, rx: tailLen / 2, ry: c.r * 0.72, fill: `url(#${gid})`, opacity: 0.35 + 0.4 * state.d });
        // head
        add(s, "circle", { cx: c.x, cy: cy, r: c.r * (1 - 0.25 * state.d), fill: "#c8ffe0", opacity: 0.95 });
      });
      const tm = (tailFrac * (12 + 118 * state.d) / 130 * 100);
      setReadout("tu_tail", (tailFrac * 100).toFixed(0) + "%");
      setReadout("tu_tm", tm.toFixed(1));
    }
    bindSlider("tu_d", (v) => (v * 100).toFixed(0) + "%", (v) => { state.d = v; draw(); });
    draw();
  };

  // 10. IC50 — dose-response curve ------------------------------------------
  W.ic50 = function (container) {
    const state = { lic: 0.0, hill: 1.2 }; // log10(IC50 µM), Hill slope
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ic_i", "IC50 (µM)", -2, 1.5, 0.05, state.lic, (v) => Math.pow(10, v).toPrecision(2))}${sliderRow("ic_h", "曲線の傾き (Hill)", 0.5, 3, 0.1, state.hill, (v) => v.toFixed(1))}</div>
      <div class="widget-stage"><div id="ic_plot"></div></div>
      ${readoutRow([{ id: "ic_v", label: "IC50", value: "—" }, { id: "ic_sens", label: "感受性の解釈", value: "—" }])}
      <p class="widget-note">横軸は薬剤濃度（対数）。<b>生存率を50%にする濃度＝IC50</b>（点線の交点）。IC50が左（低濃度）ほど“効きやすい”細胞です。傾きは反応の急峻さ。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ic_plot"), { width: 460, height: 300, xDomain: [-3, 2], yDomain: [0, 105], xTicks: 5, yTicks: 5, xLabel: "薬剤濃度 (µM, 対数)", yLabel: "相対生存率 (%)", xFmt: (v) => { const d = Math.pow(10, v); return d >= 1 ? d.toString() : d < 0.1 ? d.toFixed(3) : d.toFixed(2); }, yFmt: (v) => v });
      const ic = Math.pow(10, state.lic);
      const pts = [];
      for (let v = -3; v <= 2; v += 0.05) { const dose = Math.pow(10, v); const via = 100 / (1 + Math.pow(dose / ic, state.hill)); pts.push([v, via]); }
      CK.hline(ctx, 50, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.vline(ctx, state.lic, { stroke: "#e35fa0", "stroke-dasharray": "5 4", "stroke-width": 1.4 });
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: TEAL, opacity: 0.12 });
      CK.line(ctx, pts, { stroke: TEAL, "stroke-width": 2.6 });
      CK.dot(ctx, state.lic, 50, { r: 5, fill: "#e35fa0" });
      setReadout("ic_v", ic.toPrecision(2) + " µM");
      setReadout("ic_sens", state.lic < -0.3 ? "感受性が高い（低濃度で効く）" : state.lic > 0.7 ? "感受性が低い（耐性寄り）" : "中間");
    }
    bindSlider("ic_i", (v) => Math.pow(10, v).toPrecision(2), (v) => { state.lic = v; draw(); });
    bindSlider("ic_h", (v) => v.toFixed(1), (v) => { state.hill = v; draw(); });
    draw();
  };

  // 11. Motility — scratch / wound-healing assay ----------------------------
  W.motility = function (container) {
    const rng = CK.makeRng(411), pts = [];
    for (let i = 0; i < 520; i++) pts.push([rng() * 440, 20 + rng() * 160, 1.4 + rng() * 1.4]);
    const state = { t: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mo_t", "経過時間 (h)", 0, 24, 1, state.t, (v) => v.toFixed(0) + " h")}</div>
      <div class="widget-stage"><div id="mo_plot"></div></div>
      ${readoutRow([{ id: "mo_gap", label: "残った隙間の幅", value: "—" }, { id: "mo_close", label: "傷の閉鎖率", value: "—" }])}
      <p class="widget-note">コンフルエントな細胞層をひっかいた<b>スクラッチ（創傷治癒）アッセイ</b>。時間が経つと細胞が隙間に進出し、傷が閉じます。運動能が高いほど速く閉じます。</p>`;
    function draw() {
      const W2 = 440, H2 = 200, s = darkPanel(document.getElementById("mo_plot"), W2, H2, "#0a0e16");
      const cx = 220, g0 = 78, g = g0 * (1 - state.t / 24 * 0.92);
      // dashed original scratch edges
      add(s, "line", { x1: cx - g0, y1: 8, x2: cx - g0, y2: H2 - 8, stroke: "#3a4a5f", "stroke-dasharray": "4 4", "stroke-width": 1 });
      add(s, "line", { x1: cx + g0, y1: 8, x2: cx + g0, y2: H2 - 8, stroke: "#3a4a5f", "stroke-dasharray": "4 4", "stroke-width": 1 });
      pts.forEach((p) => { if (Math.abs(p[0] - cx) > g) add(s, "circle", { cx: p[0], cy: p[1], r: p[2], fill: "#3fd6c0", opacity: 0.7 }); });
      const closure = (1 - g / g0) * 100;
      setReadout("mo_gap", (g * 2).toFixed(0) + " µm相当");
      setReadout("mo_close", closure.toFixed(0) + "%");
    }
    bindSlider("mo_t", (v) => v.toFixed(0) + " h", (v) => { state.t = v; draw(); });
    draw();
  };

  // 12. Oil Red O — lipid droplet staining ----------------------------------
  W.oilredo = function (container) {
    const rng = CK.makeRng(412), cells = [];
    for (let i = 0; i < 9; i++) cells.push({ cx: 60 + (i % 3) * 130, cy: 45 + Math.floor(i / 3) * 60, seed: 30 + i });
    const state = { d: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("or_d", "脂肪分化の程度", 0, 1, 0.05, state.d, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="or_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d1372e"></span>脂肪滴（Oil Red O陽性）</span></div></div>
      ${readoutRow([{ id: "or_od", label: "抽出吸光度 OD₅₁₈", value: "—" }, { id: "or_area", label: "脂肪滴の面積率", value: "—" }])}
      <p class="widget-note">脂肪細胞への分化が進むほど、細胞内の<b>赤い脂肪滴が数・サイズともに増加</b>。イソプロパノールで抽出したOROの518 nm吸光度で定量します。</p>`;
    function draw() {
      const W2 = 440, H2 = 190, s = lightPanel(document.getElementById("or_plot"), W2, H2, "#f4eee9");
      let totArea = 0;
      cells.forEach((c) => {
        add(s, "ellipse", { cx: c.cx, cy: c.cy, rx: 46, ry: 26, fill: "#efe0d6", stroke: "#d9c3b4", "stroke-width": 1 });
        const rng = CK.makeRng(c.seed);
        const nDrops = Math.round(2 + state.d * 22);
        for (let k = 0; k < nDrops; k++) {
          const dx = c.cx + (rng() - 0.5) * 74, dy = c.cy + (rng() - 0.5) * 40;
          const r = 1.5 + rng() * (1.5 + state.d * 4.5);
          totArea += r * r;
          add(s, "circle", { cx: dx, cy: dy, r: r, fill: "#d1372e", opacity: 0.82 });
        }
      });
      const od = clamp(0.05 + totArea / 900, 0.05, 2.2);
      setReadout("or_od", od.toFixed(2));
      setReadout("or_area", (clamp(totArea / 1600, 0, 1) * 100).toFixed(0) + "%");
    }
    bindSlider("or_d", (v) => (v * 100).toFixed(0) + "%", (v) => { state.d = v; draw(); });
    draw();
  };

  // 13. 3D culture — 2D monolayer vs 3D spheroid ----------------------------
  W.culture3d = function (container) {
    const state = { mode: "d3", day: 4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cu_m", "培養様式", [{ v: "d2", label: "2D 単層" }, { v: "d3", label: "3D スフェロイド" }], "d3")}${sliderRow("cu_day", "培養日数", 1, 10, 1, 4, (v) => v.toFixed(0) + " 日")}</div>
      <div class="widget-stage"><div id="cu_plot"></div></div>
      ${readoutRow([{ id: "cu_form", label: "形態", value: "—" }, { id: "cu_res", label: "薬剤抵抗性", value: "—" }])}
      <p class="widget-note">2D単層は平らに広がり、3Dは<b>球状の塊（スフェロイド）</b>を作ります。3Dは幹細胞性を帯び、2Dより<b>薬剤抵抗性が高い</b>ことが知られます。</p>`;
    function draw() {
      const W2 = 440, H2 = 220, s = darkPanel(document.getElementById("cu_plot"), W2, H2, "#060b12");
      const day = state.day;
      if (state.mode === "d2") {
        const rng = CK.makeRng(413);
        const n = 40 + day * 10;
        for (let i = 0; i < n; i++) {
          const x = 30 + rng() * 380, y = 24 + rng() * 172;
          add(s, "polygon", { points: `${x - 10},${y} ${x - 3},${y - 8} ${x + 8},${y - 5} ${x + 11},${y + 4} ${x + 2},${y + 9} ${x - 8},${y + 6}`, fill: "#2b6f8a", opacity: 0.5, stroke: "#3fd6c0", "stroke-width": 0.8 });
          add(s, "circle", { cx: x, cy: y, r: 3, fill: "#7fe3d5" });
        }
        setReadout("cu_form", "平らに接着し単層に伸展");
        setReadout("cu_res", "相対的に低い");
      } else {
        const cx = 220, cy = 110, R = 32 + day * 6.5;
        const rng = CK.makeRng(414);
        add(s, "circle", { cx: cx, cy: cy, r: R + 4, fill: "#12303c", opacity: 0.5 });
        const n = Math.round(R * R / 22);
        for (let i = 0; i < n; i++) {
          const ang = rng() * Math.PI * 2, rr = Math.sqrt(rng()) * R;
          const x = cx + rr * Math.cos(ang), y = cy + rr * Math.sin(ang);
          add(s, "circle", { cx: x, cy: y, r: 5 + rng() * 2, fill: "#2b6f8a", opacity: 0.8, stroke: "#1a4657", "stroke-width": 0.6 });
        }
        add(s, "circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: "#3fd6c0", "stroke-width": 1.4, opacity: 0.5 });
        setReadout("cu_form", "球状の塊（径 " + Math.round(R * 4) + " µm相当）");
        setReadout("cu_res", "相対的に高い");
      }
    }
    bindSeg("cu_m", (v) => { state.mode = v; draw(); });
    bindSlider("cu_day", (v) => v.toFixed(0) + " 日", (v) => { state.day = v; draw(); });
    draw();
  };

  // 14. Xenograft — tumor growth curves -------------------------------------
  W.xenograft = function (container) {
    const state = { eff: 0.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("xe_e", "処理（KD/薬剤）の効果", 0, 0.9, 0.05, state.eff, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="xe_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#2b2f3a"></span>コントロール</span><span class="li"><span class="sw" style="background:#0fb9d4"></span>処理群</span></div></div>
      ${readoutRow([{ id: "xe_ctrl", label: "4週後 腫瘍体積 (対照)", value: "—" }, { id: "xe_kd", label: "4週後 腫瘍体積 (処理)", value: "—" }])}
      <p class="widget-note">免疫不全マウスに移植した腫瘍の<b>増殖曲線</b>。効果が大きいほど処理群（青）の曲線が寝て、腫瘍が小さくなります。エラーバーは個体差。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("xe_plot"), { width: 440, height: 300, xDomain: [0, 4], yDomain: [0, 750], xTicks: 4, yTicks: 5, xLabel: "移植後（週）", yLabel: "腫瘍体積 (mm³)", xFmt: (v) => v, yFmt: (v) => v });
      const V0 = 30, g = 0.75;
      function vol(t, e) { return V0 * Math.exp(g * (1 - e) * t); }
      function series(e, color, dash) {
        const pts = []; for (let t = 0; t <= 4; t += 0.25) pts.push([t, vol(t, e)]);
        CK.line(ctx, pts, { stroke: color, "stroke-width": 2.4, "stroke-dasharray": dash || "none" });
        [1, 2, 3, 4].forEach((t) => {
          const v = vol(t, e), sd = v * 0.16;
          add(ctx.svg, "line", { x1: ctx.x(t), x2: ctx.x(t), y1: ctx.y(v - sd), y2: ctx.y(v + sd), stroke: color, "stroke-width": 1.4 });
          add(ctx.svg, "line", { x1: ctx.x(t) - 4, x2: ctx.x(t) + 4, y1: ctx.y(v + sd), y2: ctx.y(v + sd), stroke: color, "stroke-width": 1.4 });
          add(ctx.svg, "line", { x1: ctx.x(t) - 4, x2: ctx.x(t) + 4, y1: ctx.y(v - sd), y2: ctx.y(v - sd), stroke: color, "stroke-width": 1.4 });
          CK.dot(ctx, t, v, { r: 3.6, fill: color });
        });
      }
      series(0, "#2b2f3a"); series(state.eff, TEAL);
      setReadout("xe_ctrl", Math.round(vol(4, 0)) + " mm³");
      setReadout("xe_kd", Math.round(vol(4, state.eff)) + " mm³");
    }
    bindSlider("xe_e", (v) => (v * 100).toFixed(0) + "%", (v) => { state.eff = v; draw(); });
    draw();
  };

  // 15. Senescence — SA-β-Gal staining --------------------------------------
  W.senescence = function (container) {
    const rng = CK.makeRng(415), cells = [];
    for (let i = 0; i < 12; i++) cells.push({ cx: 55 + (i % 4) * 110, cy: 50 + Math.floor(i / 4) * 62, u: rng(), rot: rng() * 40 - 20 });
    const state = { d: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("se_d", "老化の程度", 0, 1, 0.05, state.d, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="se_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#2f83c9"></span>SA-β-Gal陽性（老化）</span><span class="li"><span class="sw" style="background:#cfd6de"></span>若い細胞</span></div></div>
      ${readoutRow([{ id: "se_pos", label: "SA-β-Gal陽性率", value: "—" }, { id: "se_morph", label: "形態", value: "—" }])}
      <p class="widget-note">老化細胞は<b>肥大・扁平化</b>し、弱酸性でのβ-Gal活性で<b>青く（SA-β-Gal陽性）</b>染まります。程度を上げると青い大型細胞が増えます。</p>`;
    function draw() {
      const W2 = 440, H2 = 200, s = lightPanel(document.getElementById("se_plot"), W2, H2, "#eef1f5");
      let pos = 0;
      cells.forEach((c) => {
        const sen = c.u < state.d;
        if (sen) {
          pos++;
          add(s, "ellipse", { cx: c.cx, cy: c.cy, rx: 40, ry: 24, fill: "#8fbfe6", opacity: 0.55, stroke: "#2f83c9", "stroke-width": 1.4, transform: `rotate(${c.rot} ${c.cx} ${c.cy})` });
          add(s, "circle", { cx: c.cx, cy: c.cy, r: 8, fill: "#2f5f86" });
        } else {
          add(s, "ellipse", { cx: c.cx, cy: c.cy, rx: 16, ry: 9, fill: "#dbe1e8", stroke: "#b7c0cc", "stroke-width": 1, transform: `rotate(${c.rot} ${c.cx} ${c.cy})` });
          add(s, "circle", { cx: c.cx, cy: c.cy, r: 4.5, fill: "#9aa6b4" });
        }
      });
      setReadout("se_pos", Math.round(pos / cells.length * 100) + "%");
      setReadout("se_morph", state.d > 0.5 ? "肥大・扁平化が優勢" : "小型が優勢");
    }
    bindSlider("se_d", (v) => (v * 100).toFixed(0) + "%", (v) => { state.d = v; draw(); });
    draw();
  };
})();

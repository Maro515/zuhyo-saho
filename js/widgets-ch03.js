/* 第3章：イメージング — 13 interactive widgets (microscopy figures) */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }

  // 1. Phase contrast / DIC -------------------------------------------------
  W.phasecontrast = function (container) {
    const state = { mode: "bf" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ph_m", "観察法", [{ v: "bf", label: "明視野" }, { v: "pc", label: "位相差" }, { v: "dic", label: "微分干渉(DIC)" }], "bf")}</div>
      <div class="widget-stage"><div id="ph_plot"></div></div>
      ${readoutRow([{ id: "ph_v", label: "透明な細胞の見え方", value: "—" }, { id: "ph_note", label: "特徴", value: "—" }])}
      <p class="widget-note">無染色で透明な細胞。<b>明視野ではほとんど見えず</b>、位相差では明暗＋ハロ、DICでは立体的なレリーフ調で“位相のずれ”が可視化されます。</p>`;
    function draw() {
      const W2 = 460, H2 = 280;
      const s = stage(document.getElementById("ph_plot"), W2, H2);
      const bg = state.mode === "dic" ? "#8a8f9c" : "#e7e9ee";
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: bg });
      if (state.mode === "dic") { add(s, "defs", {}); }
      const cells = [[150, 110, 60, 44], [300, 170, 52, 40], [230, 90, 34, 28]];
      cells.forEach((c) => {
        if (state.mode === "bf") {
          add(s, "ellipse", { cx: c[0], cy: c[1], rx: c[2], ry: c[3], fill: "#dfe1e7", stroke: "#d2d5dd", "stroke-width": 1 });
          add(s, "circle", { cx: c[0], cy: c[1], r: c[3] * 0.3, fill: "#d6d8df" });
        } else if (state.mode === "pc") {
          add(s, "ellipse", { cx: c[0], cy: c[1], rx: c[2] + 3, ry: c[3] + 3, fill: "#ffffff", opacity: 0.9 });   // halo
          add(s, "ellipse", { cx: c[0], cy: c[1], rx: c[2], ry: c[3], fill: "#6b7280", opacity: 0.55 });
          add(s, "circle", { cx: c[0], cy: c[1], r: c[3] * 0.32, fill: "#2b2f3a" });
          add(s, "ellipse", { cx: c[0] - c[2] * 0.4, cy: c[1] + c[3] * 0.3, rx: 6, ry: 5, fill: "#3a3f4c" });
        } else {
          const gid = "dg" + c[0];
          const defs = add(s, "defs", {});
          const lg = add(defs, "linearGradient", { id: gid, x1: "0", y1: "0", x2: "1", y2: "1" });
          add(lg, "stop", { offset: "0%", "stop-color": "#f4f5f8" });
          add(lg, "stop", { offset: "50%", "stop-color": "#8a8f9c" });
          add(lg, "stop", { offset: "100%", "stop-color": "#33373f" });
          add(s, "ellipse", { cx: c[0], cy: c[1], rx: c[2], ry: c[3], fill: `url(#${gid})` });
          add(s, "circle", { cx: c[0], cy: c[1], r: c[3] * 0.3, fill: "#2b2f3a", opacity: 0.7 });
        }
      });
      const map = { bf: ["ほとんど見えない", "コントラストが付かない"], pc: ["明暗＋ハロで見える", "薄い試料向け・縁取り注意"], dic: ["立体的（レリーフ調）", "厚い試料の形態観察向け"] };
      setReadout("ph_v", map[state.mode][0]); setReadout("ph_note", map[state.mode][1]);
    }
    bindSeg("ph_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 2. Confocal (optical sectioning) ---------------------------------------
  W.confocal = function (container) {
    const rng = CK.makeRng(302);
    const struct = []; for (let i = 0; i < 14; i++) struct.push([40 + rng() * 380, 30 + rng() * 200, 14 + rng() * 16, rng() < 0.5 ? "#37d67a" : "#ff5a6e"]);
    const state = { mode: "wf" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cf_m", "検出", [{ v: "wf", label: "広視野（ピンホールなし）" }, { v: "cf", label: "共焦点" }], "wf")}</div>
      <div class="widget-stage"><div id="cf_plot"></div></div>
      ${readoutRow([{ id: "cf_v", label: "焦点外のボケ", value: "—" }, { id: "cf_note", label: "得られる像", value: "—" }])}
      <p class="widget-note">ピンホールがない広視野では<b>焦点面以外のボケた蛍光が重なって</b>にじみます。共焦点はピンホールで焦点外光を除き、<b>鋭い光学切片</b>が得られます。</p>`;
    function draw() {
      const W2 = 460, H2 = 270;
      const s = darkPanel(document.getElementById("cf_plot"), W2, H2, "#04121a");
      struct.forEach((o) => {
        if (state.mode === "wf") {
          for (let k = 3; k >= 1; k--) add(s, "circle", { cx: o[0], cy: o[1], r: o[2] * (1 + k * 0.7), fill: o[3], opacity: 0.08 });
          add(s, "circle", { cx: o[0], cy: o[1], r: o[2], fill: o[3], opacity: 0.5 });
        } else {
          add(s, "circle", { cx: o[0], cy: o[1], r: o[2], fill: o[3], opacity: 0.95 });
        }
      });
      setReadout("cf_v", state.mode === "wf" ? "大きい（にじむ）" : "除去（鋭い）");
      setReadout("cf_note", state.mode === "wf" ? "焦点外光が重なる" : "薄い光学切片");
    }
    bindSeg("cf_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 3. IHC (DAB staining) ---------------------------------------------------
  W.ihc = function (container) {
    const cols = 14, rows = 9, rng = CK.makeRng(303);
    const u = []; for (let i = 0; i < cols * rows; i++) u.push(rng());
    const state = { pos: 0.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ih_p", "陽性率", 0, 1, 0.05, state.pos, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ih_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#8a5a2b"></span>DAB陽性（茶）</span><span class="li"><span class="sw" style="background:#5a6ba8"></span>対比染色（核・青）</span></div></div>
      ${readoutRow([{ id: "ih_pct", label: "陽性率", value: "—" }, { id: "ih_note", label: "評価", value: "組織構造を保って局在を見る" }])}
      <p class="widget-note">抗体＋DABで標的タンパク質を<b>茶色</b>に、核を<b>青</b>で対比染色。組織構造を残したまま、どの細胞が陽性かを見ます。ネガティブ対照の陰性で特異性を判断します。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, mL = 14, mT = 12, cw = (W2 - mL * 2) / cols, chh = (H2 - mT * 2) / rows;
      const s = stage(document.getElementById("ih_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: "#f3eef0" });
      let pos = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const on = u[r * cols + c] < state.pos; if (on) pos++;
        const x = mL + (c + 0.5) * cw, y = mT + (r + 0.5) * chh;
        add(s, "ellipse", { cx: x, cy: y, rx: cw * 0.36, ry: chh * 0.42, fill: on ? "#8a5a2b" : "#5a6ba8", opacity: on ? 0.9 : 0.75 });
      }
      setReadout("ih_pct", (pos / (cols * rows) * 100).toFixed(0) + "%");
    }
    bindSlider("ih_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.pos = v; draw(); });
    draw();
  };

  // 4. Immunofluorescence (multi-channel merge) ----------------------------
  W.immunofluoro = function (container) {
    const rng = CK.makeRng(304);
    const greens = [], reds = [];
    for (let i = 0; i < 10; i++) { const a = rng() * 6.28, r = rng() * 55; greens.push([230 + Math.cos(a) * r, 135 + Math.sin(a) * r]); }
    for (let i = 0; i < 10; i++) { const a = rng() * 6.28, r = rng() * 55; reds.push([230 + Math.cos(a) * r + (rng() - 0.5) * 14, 135 + Math.sin(a) * r + (rng() - 0.5) * 14]); }
    const state = { ch: "merge" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("if_c", "チャンネル", [{ v: "g", label: "緑（標的）" }, { v: "r", label: "赤（マーカー）" }, { v: "b", label: "DAPI（核）" }, { v: "merge", label: "Merge" }], "merge")}</div>
      <div class="widget-stage"><div id="if_plot"></div></div>
      ${readoutRow([{ id: "if_v", label: "表示チャンネル", value: "—" }, { id: "if_note", label: "共局在", value: "—" }])}
      <p class="widget-note">各チャンネルを切り替え、Mergeで重ねます。<b>緑と赤が重なる部分は黄色</b>＝共局在（同じ場所に両分子）。青はDAPI（核）です。</p>`;
    function draw() {
      const W2 = 460, H2 = 270, cx = 230, cy = 135;
      const s = darkPanel(document.getElementById("if_plot"), W2, H2);
      const showG = state.ch === "g" || state.ch === "merge";
      const showR = state.ch === "r" || state.ch === "merge";
      const showB = state.ch === "b" || state.ch === "merge";
      if (showB) add(s, "ellipse", { cx: cx, cy: cy, rx: 48, ry: 40, fill: "#3a6bff", opacity: state.ch === "b" ? 0.7 : 0.35 });
      if (showG) greens.forEach((p) => add(s, "circle", { cx: p[0], cy: p[1], r: 7, fill: "#37ff88", opacity: 0.8 }));
      if (showR) reds.forEach((p) => add(s, "circle", { cx: p[0], cy: p[1], r: 7, fill: "#ff4d6a", opacity: 0.8 }));
      const nm = { g: "緑（標的）", r: "赤（マーカー）", b: "DAPI（核）", merge: "Merge（重ね合わせ）" };
      setReadout("if_v", nm[state.ch]);
      setReadout("if_note", state.ch === "merge" ? "黄色部＝緑と赤の共局在" : "Mergeで共局在を確認");
    }
    bindSeg("if_c", (v) => { state.ch = v; draw(); });
    draw();
  };

  // 5. Multiplex staining (markers -> cell types) --------------------------
  W.multiplex = function (container) {
    const rng = CK.makeRng(305), N = 120;
    const cells = []; for (let i = 0; i < N; i++) cells.push([30 + rng() * 400, 20 + rng() * 210, Math.floor(rng() * 8)]);
    const cols = ["#ff5a6e", "#5b8bff", "#37d67a", "#f5a623", "#a855f7", "#22d3ee", "#f472b6", "#facc15"];
    const state = { m: 3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mx_m", "マーカー数", 1, 8, 1, state.m)}</div>
      <div class="widget-stage"><div id="mx_plot"></div></div>
      ${readoutRow([{ id: "mx_t", label: "識別できる細胞種", value: "—" }, { id: "mx_note", label: "未分類（グレー）", value: "—" }])}
      <p class="widget-note">同じ組織でも、<b>マーカーが増えるほど細胞種を細かく分類</b>できます。グレー＝まだ識別できない細胞。多数のマーカーで細胞集団の構成と空間配置を一括で読めます。</p>`;
    function draw() {
      const W2 = 460, H2 = 250;
      const s = darkPanel(document.getElementById("mx_plot"), W2, H2, "#0a0a12");
      let classified = 0;
      cells.forEach((c) => {
        const known = c[2] < state.m; if (known) classified++;
        add(s, "circle", { cx: c[0], cy: c[1], r: 5.5, fill: known ? cols[c[2]] : "#525a70", opacity: known ? 0.92 : 0.5 });
      });
      setReadout("mx_t", state.m + " 種");
      setReadout("mx_note", (N - classified) + " 細胞");
    }
    bindSlider("mx_m", (v) => v, (v) => { state.m = v; draw(); });
    draw();
  };

  // 6. SEM (surface topology, grayscale) -----------------------------------
  W.sem = function (container) {
    const rng = CK.makeRng(306);
    const spheres = []; for (let i = 0; i < 9; i++) spheres.push([70 + rng() * 320, 50 + rng() * 150, 26 + rng() * 22]);
    const state = { sig: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("se_s", "検出信号（明るさ）", 0.5, 1.5, 0.05, state.sig, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="se_plot"></div></div>
      ${readoutRow([{ id: "se_v", label: "見ているもの", value: "表面の凹凸（形状）" }, { id: "se_note", label: "明暗の意味", value: "信号が多いほど白い" }])}
      <p class="widget-note">SEMは<b>表面の凹凸を立体的</b>に見る手法。検出信号が多いほど白く（明るく）表示されます（TEMの明暗とは逆）。金属薄膜で導電処理して観察します。</p>`;
    function draw() {
      const W2 = 460, H2 = 250, sg = state.sig;
      const s = stage(document.getElementById("se_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: "#0c0c0e" });
      spheres.forEach((c) => {
        const gid = "sem" + c[0];
        const defs = add(s, "defs", {});
        const rg = add(defs, "radialGradient", { id: gid, cx: "0.35", cy: "0.32", r: "0.75" });
        add(rg, "stop", { offset: "0%", "stop-color": `rgb(${Math.round(235 * sg)},${Math.round(235 * sg)},${Math.round(238 * sg)})` });
        add(rg, "stop", { offset: "60%", "stop-color": `rgb(${Math.round(150 * sg)},${Math.round(150 * sg)},${Math.round(155 * sg)})` });
        add(rg, "stop", { offset: "100%", "stop-color": "#14141a" });
        add(s, "circle", { cx: c[0], cy: c[1], r: c[2], fill: `url(#${gid})` });
        add(s, "ellipse", { cx: c[0] - c[2] * 0.35, cy: c[1] - c[2] * 0.35, rx: c[2] * 0.28, ry: c[2] * 0.2, fill: "#fff", opacity: 0.4 * sg });
      });
      add(s, "text", { x: W2 - 14, y: H2 - 12, "text-anchor": "end", "font-size": 10, fill: "#c7cce0", text: "2 µm" });
    }
    bindSlider("se_s", (v) => "×" + v.toFixed(2), (v) => { state.sig = v; draw(); });
    draw();
  };

  // 7. TEM (internal ultrastructure, grayscale) ----------------------------
  W.tem = function (container) {
    const state = { con: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("te_c", "電子染色（コントラスト）", 0.4, 1.4, 0.05, state.con, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="te_plot"></div></div>
      ${readoutRow([{ id: "te_v", label: "見ているもの", value: "内部の微細構造（断面）" }, { id: "te_note", label: "明暗の意味", value: "電子密度が高いと黒い" }])}
      <p class="widget-note">TEMは<b>細胞内部の断面</b>を見る手法。電子密度が高い膜・クリステは電子の透過が減り<b>黒く（暗く）</b>、細胞質は白く見えます（SEMとは逆）。</p>`;
    function draw() {
      const W2 = 460, H2 = 260, con = state.con;
      const s = stage(document.getElementById("te_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: `rgb(${Math.round(205 - con * 20)},${Math.round(205 - con * 20)},${Math.round(205 - con * 20)})` });
      const dark = (op) => `rgba(30,30,34,${op * con})`;
      // mitochondrion
      add(s, "ellipse", { cx: 160, cy: 130, rx: 95, ry: 62, fill: "rgba(160,160,164,0.5)", stroke: dark(0.9), "stroke-width": 3 });
      for (let i = 0; i < 9; i++) { const y = 78 + i * 12; add(s, "path", { d: `M 78 ${y} q 82 ${(i % 2 ? 12 : -12)} 164 0`, fill: "none", stroke: dark(0.8), "stroke-width": 2.2 }); }
      add(s, "text", { x: 160, y: 132, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: dark(1), text: "M" });
      // lysosome (dense)
      add(s, "circle", { cx: 340, cy: 90, r: 34, fill: dark(0.8) });
      add(s, "text", { x: 340, y: 94, "text-anchor": "middle", "font-size": 11, fill: "#eee", text: "L" });
      // ER membranes
      for (let i = 0; i < 5; i++) add(s, "path", { d: `M 290 ${170 + i * 9} q 70 8 150 0`, fill: "none", stroke: dark(0.7), "stroke-width": 1.8 });
      add(s, "text", { x: W2 - 14, y: H2 - 12, "text-anchor": "end", "font-size": 10, fill: "#333", text: "500 nm" });
    }
    bindSlider("te_c", (v) => "×" + v.toFixed(2), (v) => { state.con = v; draw(); });
    draw();
  };

  // 8. CLEM (fluorescence + EM merge) --------------------------------------
  W.clem = function (container) {
    const rng = CK.makeRng(308);
    const mito = []; for (let i = 0; i < 7; i++) mito.push([70 + rng() * 320, 60 + rng() * 140, 22 + rng() * 16, 10 + rng() * 8, rng() * 60 - 30]);
    const state = { mode: "merge" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cl_m", "表示", [{ v: "fl", label: "蛍光（位置）" }, { v: "em", label: "電顕（超微形態）" }, { v: "merge", label: "マージ（相関）" }], "merge")}</div>
      <div class="widget-stage"><div id="cl_plot"></div></div>
      ${readoutRow([{ id: "cl_v", label: "表示", value: "—" }, { id: "cl_note", label: "読み取り", value: "分子の位置×超微形態" }])}
      <p class="widget-note">同じ領域を蛍光（<b>どこに何があるか</b>）と電顕（<b>超微形態</b>）で観察し、<b>重ね合わせて相関</b>。蛍光シグナルの位置にある構造の膜の保持性まで読めます。</p>`;
    function draw() {
      const W2 = 460, H2 = 250;
      const s = stage(document.getElementById("cl_plot"), W2, H2);
      const showEM = state.mode === "em" || state.mode === "merge";
      const showFL = state.mode === "fl" || state.mode === "merge";
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: showEM ? "#c7c9cd" : "#05070f" });
      mito.forEach((m) => {
        const g = add(s, "g", { transform: `translate(${m[0]},${m[1]}) rotate(${m[4]})` });
        if (showEM) {
          add(g, "ellipse", { cx: 0, cy: 0, rx: m[2], ry: m[3], fill: "rgba(120,120,124,0.5)", stroke: "#2b2b30", "stroke-width": 2 });
          for (let i = 0; i < 4; i++) add(g, "line", { x1: -m[2] * 0.7, y1: -m[3] + 3 + i * (m[3] * 2 / 4), x2: m[2] * 0.7, y2: -m[3] + 3 + i * (m[3] * 2 / 4), stroke: "#3a3a40", "stroke-width": 1.4 });
        }
        if (showFL) add(g, "ellipse", { cx: 0, cy: 0, rx: m[2] + 2, ry: m[3] + 2, fill: "#37ff88", opacity: showEM ? 0.42 : 0.85 });
      });
      const nm = { fl: "蛍光顕微鏡像", em: "電子顕微鏡像", merge: "マージ（相関）像" };
      setReadout("cl_v", nm[state.mode]);
    }
    bindSeg("cl_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 9. Two-photon (localized excitation, depth) ----------------------------
  W.twophoton = function (container) {
    const state = { mode: "two", depth: 0.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("tp_m", "励起", [{ v: "one", label: "一光子（共焦点）" }, { v: "two", label: "二光子" }], "two")}
        ${sliderRow("tp_d", "焦点の深さ", 0.15, 0.9, 0.05, state.depth, (v) => (v * 100).toFixed(0) + "%")}
      </div>
      <div class="widget-stage"><div id="tp_plot"></div></div>
      ${readoutRow([{ id: "tp_v", label: "励起される範囲", value: "—" }, { id: "tp_note", label: "深部到達", value: "—" }])}
      <p class="widget-note">一光子は光路全体が励起され焦点外でも褪色・光毒性。<b>二光子は焦点でのみ蛍光</b>が生じるので光毒性が小さく、近赤外光で深部（0.5〜1mm）まで届きます。</p>`;
    function draw() {
      const W2 = 460, H2 = 280, cx = 230, top = 20, fy = top + state.depth * 210;
      const s = stage(document.getElementById("tp_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: "#0a1424" });
      // tissue speckle
      const rng = CK.makeRng(9);
      for (let i = 0; i < 60; i++) add(s, "circle", { cx: rng() * W2, cy: top + rng() * 220, r: 2 + rng() * 3, fill: "#1c2c4a", opacity: 0.6 });
      // objective
      add(s, "path", { d: `M ${cx - 40} 6 L ${cx + 40} 6 L ${cx + 14} 22 L ${cx - 14} 22 Z`, fill: "#3a4a6a" });
      if (state.mode === "one") {
        add(s, "path", { d: `M ${cx - 14} 22 L ${cx + 14} 22 L ${cx} ${fy} Z`, fill: "#ff9d3a", opacity: 0.28 }); // whole cone excited
      } else {
        add(s, "path", { d: `M ${cx - 14} 22 L ${cx + 14} 22 L ${cx} ${fy} Z`, fill: "#ff5566", opacity: 0.06 }); // beam path faint
      }
      // focal spot glow
      add(s, "circle", { cx: cx, cy: fy, r: 16, fill: state.mode === "two" ? "#ffe14d" : "#ff9d3a", opacity: 0.35 });
      add(s, "circle", { cx: cx, cy: fy, r: 7, fill: "#ffef9a" });
      add(s, "text", { x: W2 - 14, y: H2 - 12, "text-anchor": "end", "font-size": 10, fill: "#8aa0d8", text: "深さ →" });
      setReadout("tp_v", state.mode === "two" ? "焦点のみ" : "光路全体（焦点外も）");
      setReadout("tp_note", state.mode === "two" ? "深部・低光毒性 ✓" : (state.depth > 0.6 ? "深部は褪色・信号低下" : "浅部向き"));
    }
    bindSeg("tp_m", (v) => { state.mode = v; draw(); });
    bindSlider("tp_d", (v) => (v * 100).toFixed(0) + "%", (v) => { state.depth = v; draw(); });
    draw();
  };

  // 10. Light-sheet (sheet illumination + z) -------------------------------
  W.lightsheet = function (container) {
    const rng = CK.makeRng(310);
    const pts = []; for (let i = 0; i < 90; i++) { const a = rng() * 6.28, r = rng() * 90; pts.push([230 + Math.cos(a) * r, 140 + Math.sin(a) * r * 0.9]); }
    const state = { z: 0.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ls_z", "シート位置 (z)", 0.15, 0.85, 0.05, state.z, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ls_plot"></div></div>
      ${readoutRow([{ id: "ls_v", label: "照らしている面", value: "—" }, { id: "ls_note", label: "特徴", value: "低光毒性・高速3D" }])}
      <p class="widget-note">レーザーを<b>シート状</b>にして観察平面だけを照らし、直交方向のカメラで検出。1平面ずつなので退色・光毒性が小さく、シートを動かせば光学切片を積み重ねて高速3D。</p>`;
    function draw() {
      const W2 = 460, H2 = 280, sheetY = 40 + state.z * 200;
      const s = stage(document.getElementById("ls_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: "#04121a" });
      // sample sphere (dim)
      add(s, "ellipse", { cx: 230, cy: 140, rx: 96, ry: 96, fill: "#0a2233", opacity: 0.6, stroke: "#1c4a5a", "stroke-width": 1 });
      // light sheet (horizontal glowing band)
      add(s, "rect", { x: 0, y: sheetY - 7, width: W2, height: 14, fill: "#37e0ff", opacity: 0.16 });
      add(s, "rect", { x: 0, y: sheetY - 2, width: W2, height: 4, fill: "#7ff0ff", opacity: 0.5 });
      add(s, "text", { x: 8, y: sheetY - 10, "font-size": 9.5, fill: "#7ff0ff", text: "ライトシート照明 →" });
      // fluoresce only points near the sheet
      pts.forEach((p) => { if (Math.abs(p[1] - sheetY) < 9) add(s, "circle", { cx: p[0], cy: p[1], r: 3.4, fill: "#eaffb0", opacity: 0.95 }); else add(s, "circle", { cx: p[0], cy: p[1], r: 2, fill: "#1c3a4a", opacity: 0.5 }); });
      // detection objective (right, perpendicular)
      add(s, "path", { d: `M ${W2 - 6} 120 L ${W2 - 6} 160 L ${W2 - 26} 148 L ${W2 - 26} 132 Z`, fill: "#3a5a6a" });
      add(s, "text", { x: W2 - 34, y: 118, "text-anchor": "end", "font-size": 8.5, fill: "#8aa0b8", text: "検出（直交）" });
      setReadout("ls_v", "z = " + (state.z * 100).toFixed(0) + "% の平面");
    }
    bindSlider("ls_z", (v) => (v * 100).toFixed(0) + "%", (v) => { state.z = v; draw(); });
    draw();
  };

  // 11. TIRF (evanescent, surface only) ------------------------------------
  W.tirf = function (container) {
    const rng = CK.makeRng(311);
    const surf = []; for (let i = 0; i < 26; i++) surf.push([60 + rng() * 340, 200 + rng() * 26]);
    const inner = []; for (let i = 0; i < 30; i++) inner.push([80 + rng() * 300, 70 + rng() * 110]);
    const state = { mode: "tirf" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ti_m", "照明", [{ v: "epi", label: "落射（全体）" }, { v: "tirf", label: "TIRF（表面）" }], "tirf")}</div>
      <div class="widget-stage"><div id="ti_plot"></div></div>
      ${readoutRow([{ id: "ti_v", label: "照らす領域", value: "—" }, { id: "ti_note", label: "背景光", value: "—" }])}
      <p class="widget-note">落射は細胞全体を照らし背景が高い。<b>TIRFはガラス面〜150nmだけ</b>を照らすので、細胞膜近傍の1分子だけが低背景で光ります。輝点は回折限界で実サイズより大きく見えます。</p>`;
    function draw() {
      const W2 = 460, H2 = 250;
      const s = stage(document.getElementById("ti_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: "#05070f" });
      // coverslip
      add(s, "rect", { x: 0, y: 224, width: W2, height: 26, fill: "#12203a", opacity: 0.7 });
      add(s, "line", { x1: 0, y1: 224, x2: W2, y2: 224, stroke: "#3a5a8a", "stroke-width": 1 });
      add(s, "text", { x: 8, y: 242, "font-size": 9, fill: "#6f8ce0", text: "カバーガラス" });
      // cell outline
      add(s, "ellipse", { cx: 230, cy: 150, rx: 170, ry: 80, fill: "#0a1430", opacity: 0.5, stroke: "#2a3a6a", "stroke-width": 1 });
      if (state.mode === "epi") {
        inner.forEach((p) => add(s, "circle", { cx: p[0], cy: p[1], r: 3, fill: "#37ff88", opacity: 0.55 }));
        surf.forEach((p) => add(s, "circle", { cx: p[0], cy: p[1], r: 3, fill: "#37ff88", opacity: 0.7 }));
        add(s, "rect", { x: 60, y: 75, width: 340, height: 145, fill: "#37ff88", opacity: 0.05 });
      } else {
        add(s, "rect", { x: 0, y: 205, width: W2, height: 20, fill: "#37e0ff", opacity: 0.08 });
        surf.forEach((p) => { add(s, "circle", { cx: p[0], cy: p[1], r: 5, fill: "#37ff88", opacity: 0.25 }); add(s, "circle", { cx: p[0], cy: p[1], r: 2.4, fill: "#8dffc4" }); });
      }
      setReadout("ti_v", state.mode === "tirf" ? "ガラス面〜150nm（膜近傍）" : "細胞全体");
      setReadout("ti_note", state.mode === "tirf" ? "低い（1分子が見える）" : "高い（にじむ）");
    }
    bindSeg("ti_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 12. Super-resolution (two-point resolution) ----------------------------
  W.superres = function (container) {
    const state = { sep: 180, mode: "conv" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("sr_m", "手法", [{ v: "conv", label: "従来（回折限界）" }, { v: "sr", label: "超解像" }], "conv")}
        ${sliderRow("sr_s", "2点の間隔 (nm)", 40, 400, 10, state.sep)}
      </div>
      <div class="widget-stage"><div id="sr_plot"></div></div>
      ${readoutRow([{ id: "sr_v", label: "2点分解能", value: "—" }, { id: "sr_lim", label: "回折限界(約)", value: "≈250 nm" }])}
      <p class="widget-note">上＝像、下＝ラインプロファイル。従来法は<b>回折限界(≈250nm)より近い2点は1つにボケ</b>ます。超解像はPSFが鋭く、近い2点も<b>2つに分離</b>して見えます。</p>`;
    function draw() {
      const W2 = 460, H2 = 260, cx = 230, cyImg = 70, cyPlot = 200, scale = 0.32;
      const s = stage(document.getElementById("sr_plot"), W2, H2);
      add(s, "rect", { x: 0, y: 0, width: W2, height: H2, rx: 8, fill: "#05070f" });
      const sigma = state.mode === "sr" ? 22 : 105; // PSF width in nm-ish
      const d = state.sep * scale, x1 = cx - d / 2, x2 = cx + d / 2;
      // image: two PSF blobs (radius = PSF sigma → conventional blobs merge, super-res stay tight)
      const R = Math.max(4, sigma * scale);
      [x1, x2].forEach((xp) => { for (let k = 7; k >= 1; k--) add(s, "circle", { cx: xp, cy: cyImg, r: R * k / 7, fill: "#5dff9e", opacity: 0.11 }); });
      // line profile
      add(s, "line", { x1: 30, y1: cyPlot, x2: W2 - 20, y2: cyPlot, stroke: "#33405c", "stroke-width": 1 });
      const g = (x, mu) => Math.exp(-(((x - mu) / (sigma * scale)) ** 2));
      let d1 = "";
      for (let px = 30; px <= W2 - 20; px += 2) { const v = g(px, x1) + g(px, x2); const y = cyPlot - Math.min(1, v) * 55; d1 += (px === 30 ? "M" : "L") + " " + px + " " + y.toFixed(1) + " "; }
      add(s, "path", { d: d1, fill: "none", stroke: "#f5a623", "stroke-width": 2 });
      const resolved = state.sep > (state.mode === "sr" ? 60 : 250);
      setReadout("sr_v", resolved ? "2点に分離 ✓" : "1つにボケる ✗");
    }
    bindSeg("sr_m", (v) => { state.mode = v; draw(); });
    bindSlider("sr_s", (v) => v, (v) => { state.sep = v; draw(); });
    draw();
  };

  // 13. FRAP (recovery curve) ----------------------------------------------
  W.frap = function (container) {
    const state = { d: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("fr_d", "拡散速度", 0.3, 3, 0.1, state.d, (v) => "×" + v.toFixed(1))}</div>
      <div class="widget-stage"><div id="fr_plot"></div></div>
      ${readoutRow([{ id: "fr_t", label: "半回復時間 t½", value: "—" }, { id: "fr_mob", label: "可動分画", value: "—" }, { id: "fr_note", label: "回復の速さ", value: "—" }])}
      <p class="widget-note">褪色後の蛍光回復。<b>回復が速い＝拡散が速い</b>（t½が小さい）。回復しきらずに残る差＝<b>動かない不動分画</b>。回復には結合・解離の影響も含まれます。</p>`;
    function draw() {
      const mobile = 0.72, k = 0.18 * state.d;
      const ctx = CK.plot(document.getElementById("fr_plot"), {
        width: 560, height: 270, margin: { top: 16, right: 16, bottom: 40, left: 46 },
        xDomain: [-4, 50], yDomain: [0, 1.1], xTicks: 5, yTicks: 3, grid: false,
        yFmt: () => "", xLabel: "時間 (秒)", yLabel: "蛍光強度（規格化）",
      });
      // prebleach
      CK.line(ctx, [[-4, 1], [0, 1]], { stroke: "#9aa2b6", "stroke-width": 2 });
      CK.dot(ctx, 0, 1, { r: 3, fill: "#9aa2b6" });
      // bleach drop + recovery
      const pts = [[0, 0.12]];
      for (let t = 0; t <= 50; t += 0.5) pts.push([t, 0.12 + mobile * (1 - Math.exp(-k * t))]);
      CK.line(ctx, pts, { stroke: "#e35fa0", "stroke-width": 2.6 });
      CK.hline(ctx, 0.12 + mobile, { stroke: "#c7cce0", "stroke-dasharray": "3 3" });
      CK.hline(ctx, 1, { stroke: "#eceef4", "stroke-dasharray": "2 4" });
      // t-half
      const thalf = Math.log(2) / k;
      CK.vline(ctx, thalf, { stroke: "#e35fa0", "stroke-width": 1, "stroke-dasharray": "3 3" });
      CK.textPx(ctx, ctx.x(0), ctx.y(0.06), "褪色", { "font-size": 10, fill: "#e35fa0", "text-anchor": "middle" });
      setReadout("fr_t", thalf.toFixed(1) + " s");
      setReadout("fr_mob", Math.round(mobile * 100) + "%");
      setReadout("fr_note", state.d >= 2 ? "速い（拡散大）" : state.d <= 0.6 ? "遅い（拡散小）" : "中程度");
    }
    bindSlider("fr_d", (v) => "×" + v.toFixed(1), (v) => { state.d = v; draw(); });
    draw();
  };
})();

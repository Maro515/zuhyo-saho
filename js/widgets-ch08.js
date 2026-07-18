/* 第8章 — 網羅的配列解析（発現解析の中核8図表）のインタラクティブ教材
   すべて .widget-stage（明るいデータパネル）上に SVG で描画する。 */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  // shared palette (legible on the bright stage)
  const UP = "#e5484d", DOWN = "#3b63e0", NS = "#c3c9d8", GREEN = "#0f9e73";
  const CLU = ["#e5484d", "#3b63e0", "#0f9e73", "#f59e0b", "#a855f7", "#0ea5e9"];

  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(s, tag, attrs) { const e = CK.el(tag, attrs); s.appendChild(e); return e; }

  // 5. Volcano plot --------------------------------------------------------
  W.volcano = function (container) {
    const rng = CK.makeRng(20240808), N = 340, genes = [];
    for (let i = 0; i < N; i++) {
      const fc = CK.randNormal(0, 1.05, rng);
      const se = 0.28 * Math.exp(CK.randNormal(0, 0.42, rng));
      let p = 2 * (1 - CK.normalCDF(Math.abs(fc) / se));
      p = Math.min(1, Math.max(p, 1e-12));
      genes.push({ fc, y: -Math.log10(p) });
    }
    const maxY = Math.max(6, ...genes.map((g) => g.y)) * 1.05;
    const state = { fcT: 1, yT: 1.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("vc_fc", "発現量比の閾値 |log2FC|", 0, 3, 0.25, state.fcT, (v) => v.toFixed(2))}
        ${sliderRow("vc_y", "有意性の閾値 −log10(p)", 1, 6, 0.1, state.yT, (v) => v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="vc_plot"></div></div>
      ${readoutRow([
        { id: "vc_up", label: "有意に高発現", value: "—" },
        { id: "vc_dn", label: "有意に低発現", value: "—" },
        { id: "vc_ns", label: "非有意", value: "—" },
      ])}
      <p class="widget-note">縦軸の p は<b>多重比較の海</b>の中の値です。実際の論文では FDR 補正後（q値）で見ます。fold change の閾値を上げると「大きく動いた」遺伝子だけに絞れます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("vc_plot"), {
        width: 560, height: 340, margin: { top: 16, right: 20, bottom: 46, left: 52 },
        xDomain: [-4, 4], yDomain: [0, maxY], xTicks: 8, yTicks: 5,
        xLabel: "log2 fold change（発現量比）", yLabel: "−log10(p値)",
      });
      CK.vline(ctx, state.fcT, { stroke: "#c7cce0" });
      CK.vline(ctx, -state.fcT, { stroke: "#c7cce0" });
      CK.hline(ctx, state.yT, { stroke: "#c7cce0" });
      let up = 0, dn = 0, ns = 0;
      genes.forEach((g) => {
        let fill = NS;
        if (g.y >= state.yT && g.fc >= state.fcT) { fill = UP; up++; }
        else if (g.y >= state.yT && g.fc <= -state.fcT) { fill = DOWN; dn++; }
        else ns++;
        CK.dot(ctx, Math.max(-4, Math.min(4, g.fc)), g.y, { r: 3, fill, opacity: fill === NS ? 0.5 : 0.85 });
      });
      setReadout("vc_up", up); setReadout("vc_dn", dn); setReadout("vc_ns", ns);
    }
    bindSlider("vc_fc", (v) => v.toFixed(2), (v) => { state.fcT = v; draw(); });
    bindSlider("vc_y", (v) => v.toFixed(1), (v) => { state.yT = v; draw(); });
    draw();
  };

  // 27. MA plot ------------------------------------------------------------
  W.maplot = function (container) {
    const rng = CK.makeRng(551), N = 340, genes = [];
    for (let i = 0; i < N; i++) {
      const A = Math.pow(rng(), 0.75) * 14;
      const sd = 0.35 + 2.2 / (1 + 0.55 * A);
      let M = CK.randNormal(0, sd, rng);
      if (rng() < 0.13 && A > 3) M += (rng() < 0.5 ? -1 : 1) * (1.2 + rng() * 2.4);
      const se = 0.25 + 1.5 / (1 + 0.6 * A);
      let p = 2 * (1 - CK.normalCDF(Math.abs(M) / se));
      genes.push({ A, M, p: Math.min(1, Math.max(p, 1e-12)) });
    }
    const order = genes.map((g, i) => i).sort((a, b) => genes[a].p - genes[b].p);
    const maxM = Math.max(5, ...genes.map((g) => Math.abs(g.M))) * 1.02;
    const state = { fdr: 0.05 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ma_fdr", "有意判定の閾値 FDR", 0.01, 0.2, 0.01, state.fdr, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="ma_plot"></div></div>
      ${readoutRow([
        { id: "ma_deg", label: "発現変動遺伝子", value: "—" },
        { id: "ma_up", label: "発現増加", value: "—" },
        { id: "ma_dn", label: "発現減少", value: "—" },
      ])}
      <p class="widget-note">左側（低発現）ほど M が大きく暴れる<b>扇形</b>に注目。反復のばらつきの影響で、上下端の遺伝子がすべて本物の変動とは限りません。</p>`;
    function sigSet() {
      const m = genes.length; let k = 0;
      for (let r = 0; r < order.length; r++) if (genes[order[r]].p <= ((r + 1) / m) * state.fdr) k = r + 1;
      return new Set(order.slice(0, k));
    }
    function draw() {
      const sig = sigSet();
      const ctx = CK.plot(document.getElementById("ma_plot"), {
        width: 560, height: 340, margin: { top: 16, right: 20, bottom: 46, left: 52 },
        xDomain: [0, 14], yDomain: [-maxM, maxM], xTicks: 7, yTicks: 6,
        xLabel: "平均発現量 A（log CPM）", yLabel: "発現変動 M（log2 比）",
      });
      CK.hline(ctx, 0, { stroke: "#9aa2b6", "stroke-dasharray": "" });
      let up = 0, dn = 0;
      genes.forEach((g, i) => {
        const s = sig.has(i);
        if (s) { if (g.M > 0) up++; else dn++; }
        CK.dot(ctx, g.A, Math.max(-maxM, Math.min(maxM, g.M)), { r: 3, fill: s ? UP : NS, opacity: s ? 0.85 : 0.45 });
      });
      setReadout("ma_deg", up + dn); setReadout("ma_up", up); setReadout("ma_dn", dn);
    }
    bindSlider("ma_fdr", (v) => v.toFixed(2), (v) => { state.fdr = v; draw(); });
    draw();
  };

  // 11. PCA ----------------------------------------------------------------
  W.pca = function (container) {
    const state = { sep: 2.4, seed: 7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("pca_sep", "2群の分離度", 0, 6, 0.2, state.sep, (v) => v.toFixed(1))}
        <button class="btn" id="pca_re">🎲 別のサンプルで再取得</button>
      </div>
      <div class="widget-stage"><div id="pca_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${UP}"></span>群A</span><span class="li"><span class="sw" style="background:${GREEN}"></span>群B</span></div></div>
      ${readoutRow([
        { id: "pca_r1", label: "PC1 寄与率", value: "—" },
        { id: "pca_r2", label: "PC2 寄与率", value: "—" },
        { id: "pca_sum", label: "PC1+PC2", value: "—" },
      ])}
      <p class="widget-note">分離度を上げると PC1 の寄与率が伸び、2群が横（PC1）に分かれます。PC1+PC2 の寄与率が低いほど、この2次元図は全体の<b>一部</b>しか映していません。</p>`;
    function build() {
      const rng = CK.makeRng(state.seed);
      const pts = [], extra = [];
      for (let g = 0; g < 2; g++) {
        const off = (g === 0 ? -1 : 1) * state.sep / 2;
        for (let i = 0; i < 11; i++) {
          pts.push({ g, pc1: off + CK.randNormal(0, 1.0, rng), pc2: CK.randNormal(0, 1.0, rng) });
          extra.push([CK.randNormal(0, 0.9, rng), CK.randNormal(0, 0.8, rng), CK.randNormal(0, 0.7, rng)]);
        }
      }
      const v1 = CK.variance(pts.map((p) => p.pc1)), v2 = CK.variance(pts.map((p) => p.pc2));
      const ve = [0, 1, 2].map((k) => CK.variance(extra.map((e) => e[k])));
      const total = v1 + v2 + ve[0] + ve[1] + ve[2];
      return { pts, r1: (v1 / total) * 100, r2: (v2 / total) * 100 };
    }
    function draw() {
      const d = build();
      const xr = Math.max(3, ...d.pts.map((p) => Math.abs(p.pc1))) * 1.15;
      const yr = Math.max(3, ...d.pts.map((p) => Math.abs(p.pc2))) * 1.15;
      const ctx = CK.plot(document.getElementById("pca_plot"), {
        width: 560, height: 330, margin: { top: 16, right: 20, bottom: 46, left: 52 },
        xDomain: [-xr, xr], yDomain: [-yr, yr], xTicks: 6, yTicks: 5,
        xLabel: `PC1 (${d.r1.toFixed(1)}%)`, yLabel: `PC2 (${d.r2.toFixed(1)}%)`,
      });
      d.pts.forEach((p) => CK.dot(ctx, p.pc1, p.pc2, { r: 5, fill: p.g === 0 ? UP : GREEN, opacity: 0.85, stroke: "#fff", "stroke-width": 1 }));
      setReadout("pca_r1", d.r1.toFixed(1) + "%"); setReadout("pca_r2", d.r2.toFixed(1) + "%");
      setReadout("pca_sum", (d.r1 + d.r2).toFixed(1) + "%");
    }
    bindSlider("pca_sep", (v) => v.toFixed(1), (v) => { state.sep = v; draw(); });
    document.getElementById("pca_re").addEventListener("click", () => { state.seed++; draw(); });
    draw();
  };

  // 9. Hierarchical clustering (dendrogram) --------------------------------
  W.hclust = function (container) {
    const rng = CK.makeRng(4242);
    const centers = [[2, 2, 0, 0, 1, -1], [-2, 1, 1, -1, 0, 2], [0, -2, -2, 2, -1, 0]];
    const truth = [0, 0, 0, 1, 1, 2, 2, 1];
    const samples = truth.map((c) => centers[c].map((v) => v + CK.randNormal(0, 0.9, rng)));
    const names = samples.map((_, i) => "S" + (i + 1));
    const n = samples.length;
    const dist = (a, b) => { let s = 0; for (let k = 0; k < a.length; k++) s += (a[k] - b[k]) ** 2; return Math.sqrt(s); };
    // agglomerative, average linkage
    let clusters = samples.map((_, i) => ({ members: [i], node: { leaf: i, y: 0 } }));
    const merges = [];
    const avg = (c1, c2) => { let s = 0, m = 0; c1.members.forEach((i) => c2.members.forEach((j) => { s += dist(samples[i], samples[j]); m++; })); return s / m; };
    while (clusters.length > 1) {
      let best = Infinity, bi = 0, bj = 1;
      for (let i = 0; i < clusters.length; i++) for (let j = i + 1; j < clusters.length; j++) { const d = avg(clusters[i], clusters[j]); if (d < best) { best = d; bi = i; bj = j; } }
      const c1 = clusters[bi], c2 = clusters[bj];
      merges.push({ height: best, rep: c1.members[0], other: c2.members[0] });
      const node = { y: best, children: [c1.node, c2.node] };
      const merged = { members: c1.members.concat(c2.members), node };
      clusters = clusters.filter((_, k) => k !== bi && k !== bj); clusters.push(merged);
    }
    const root = clusters[0].node;
    const order = []; (function walk(nd) { if (nd.leaf !== undefined) order.push(nd.leaf); else { walk(nd.children[0]); walk(nd.children[1]); } })(root);
    const xpos = {}; order.forEach((leaf, i) => (xpos[leaf] = i));
    (function setx(nd) { if (nd.leaf !== undefined) { nd.x = xpos[nd.leaf]; return nd.x; } const a = setx(nd.children[0]), b = setx(nd.children[1]); nd.x = (a + b) / 2; return nd.x; })(root);
    const maxH = root.y;
    const state = { h: maxH * 0.55 };

    function clustersAt(h) {
      const parent = samples.map((_, i) => i);
      const find = (x) => { while (parent[x] !== x) x = parent[x] = parent[parent[x]]; return x; };
      merges.forEach((m) => { if (m.height <= h) parent[find(m.rep)] = find(m.other); });
      const groups = {}; samples.forEach((_, i) => { const r = find(i); (groups[r] = groups[r] || []).push(i); });
      return groups;
    }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("hc_h", "樹形図を切る高さ", 0, +maxH.toFixed(2), +(maxH / 100).toFixed(3), state.h, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="hc_plot"></div></div>
      ${readoutRow([
        { id: "hc_k", label: "クラスター数", value: "—" },
        { id: "hc_cut", label: "切る高さ", value: "—" },
      ])}
      <p class="widget-note">枝が<b>低い位置で合流</b>する組ほど似ています。切る高さを下げるほどクラスターは細かく分かれます。距離の定義や結合法を変えれば結果も変わる点に注意。</p>`;
    function draw() {
      const W2 = 560, H2 = 320, mL = 24, mR = 16, topY = 22, baseY = 250;
      const s = stage(document.getElementById("hc_plot"), W2, H2);
      const px = (x) => mL + x * (W2 - mL - mR) / (n - 1);
      const py = (v) => baseY - (v / maxH) * (baseY - topY);
      // cluster color per leaf
      const groups = clustersAt(state.h);
      const leafColor = {};
      Object.values(groups).forEach((g, gi) => g.forEach((leaf) => (leafColor[leaf] = CLU[gi % CLU.length])));
      // a node "below the cut" (merge height <= cut) is one cluster → colour it
      function firstLeaf(nd) { while (nd.leaf === undefined) nd = nd.children[0]; return nd.leaf; }
      (function drawNode(nd) {
        if (nd.leaf !== undefined) return;
        const c1 = nd.children[0], c2 = nd.children[1];
        const col = nd.y <= state.h ? leafColor[firstLeaf(nd)] : "#c1c7d6";
        const yTop = py(nd.y);
        add(s, "line", { x1: px(c1.x), x2: px(c2.x), y1: yTop, y2: yTop, stroke: col, "stroke-width": 2 });
        add(s, "line", { x1: px(c1.x), x2: px(c1.x), y1: py(c1.y), y2: yTop, stroke: nd.y <= state.h ? leafColor[firstLeaf(c1)] : "#c1c7d6", "stroke-width": 2 });
        add(s, "line", { x1: px(c2.x), x2: px(c2.x), y1: py(c2.y), y2: yTop, stroke: nd.y <= state.h ? leafColor[firstLeaf(c2)] : "#c1c7d6", "stroke-width": 2 });
        drawNode(c1); drawNode(c2);
      })(root);
      // cut line
      add(s, "line", { x1: mL, x2: W2 - mR, y1: py(state.h), y2: py(state.h), stroke: "#e5484d", "stroke-width": 1.4, "stroke-dasharray": "5 4" });
      add(s, "text", { x: W2 - mR, y: py(state.h) - 5, "text-anchor": "end", "font-size": 10.5, fill: "#e5484d", text: "cut" });
      // leaf labels + ticks
      order.forEach((leaf) => {
        add(s, "circle", { cx: px(xpos[leaf]), cy: baseY, r: 3.5, fill: leafColor[leaf] });
        add(s, "text", { x: px(xpos[leaf]), y: baseY + 18, "text-anchor": "middle", "font-size": 11, fill: "#4a5268", "font-weight": 700, text: names[leaf] });
      });
      const k = Object.keys(groups).length;
      setReadout("hc_k", k + " 個"); setReadout("hc_cut", state.h.toFixed(2));
    }
    bindSlider("hc_h", (v) => v.toFixed(2), (v) => { state.h = v; draw(); });
    draw();
  };

  // 10. k-means ------------------------------------------------------------
  W.kmeans = function (container) {
    const rng0 = CK.makeRng(999);
    const blobs = [[3, 7], [7, 3], [8, 8]], pts = [];
    blobs.forEach((c) => { for (let i = 0; i < 20; i++) pts.push([c[0] + CK.randNormal(0, 0.85, rng0), c[1] + CK.randNormal(0, 0.85, rng0)]); });
    const state = { k: 3, seed: 1 };
    function run() {
      const rng = CK.makeRng(1000 + state.seed);
      let cent = [], used = [];
      while (cent.length < state.k) { const j = Math.floor(rng() * pts.length); if (!used.includes(j)) { used.push(j); cent.push(pts[j].slice()); } }
      const assign = new Array(pts.length).fill(0); let iters = 0;
      for (let it = 0; it < 25; it++) {
        iters++; let changed = false;
        for (let i = 0; i < pts.length; i++) {
          let best = 0, bd = Infinity;
          for (let c = 0; c < cent.length; c++) { const d = (pts[i][0] - cent[c][0]) ** 2 + (pts[i][1] - cent[c][1]) ** 2; if (d < bd) { bd = d; best = c; } }
          if (assign[i] !== best) { assign[i] = best; changed = true; }
        }
        cent = cent.map((c, ci) => { const m = pts.filter((_, i) => assign[i] === ci); return m.length ? [CK.mean(m.map((p) => p[0])), CK.mean(m.map((p) => p[1]))] : c; });
        if (!changed) break;
      }
      let sse = 0; pts.forEach((p, i) => { sse += (p[0] - cent[assign[i]][0]) ** 2 + (p[1] - cent[assign[i]][1]) ** 2; });
      return { cent, assign, iters, sse };
    }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("km_k", "クラスター数 k", 2, 5, 1, state.k)}
        <button class="btn" id="km_re">🎲 初期値を変えて再実行</button>
      </div>
      <div class="widget-stage"><div id="km_plot"></div></div>
      ${readoutRow([
        { id: "km_kk", label: "k", value: "—" },
        { id: "km_sse", label: "クラスター内平方和", value: "—" },
        { id: "km_it", label: "収束までの反復", value: "—" },
      ])}
      <p class="widget-note">「初期値を変えて再実行」を押すと、同じデータ・同じ k でも色分けが変わることがあります（<b>初期値依存性</b>）。◆は各クラスターの中心（重心）です。</p>`;
    function draw() {
      const r = run();
      const ctx = CK.plot(document.getElementById("km_plot"), {
        width: 560, height: 330, margin: { top: 16, right: 20, bottom: 44, left: 46 },
        xDomain: [0, 11], yDomain: [0, 11], xTicks: 1, yTicks: 1, grid: false,
        xFmt: () => "", yFmt: () => "", xLabel: "特徴量1", yLabel: "特徴量2",
      });
      pts.forEach((p, i) => CK.dot(ctx, p[0], p[1], { r: 4, fill: CLU[r.assign[i] % CLU.length], opacity: 0.78 }));
      r.cent.forEach((c, ci) => {
        add(ctx.svg, "path", { d: diamond(ctx.x(c[0]), ctx.y(c[1]), 8), fill: CLU[ci % CLU.length], stroke: "#1b2233", "stroke-width": 2 });
      });
      setReadout("km_kk", state.k); setReadout("km_sse", r.sse.toFixed(1)); setReadout("km_it", r.iters);
    }
    function diamond(cx, cy, s) { return `M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`; }
    bindSlider("km_k", (v) => v, (v) => { state.k = v; draw(); });
    document.getElementById("km_re").addEventListener("click", () => { state.seed++; draw(); });
    draw();
  };

  // 7. GO / ORA enrichment bar chart ---------------------------------------
  W.goenrich = function (container) {
    const terms = [
      { name: "Cell cycle", p: 1e-9, dir: "up" },
      { name: "DNA replication", p: 3e-8, dir: "up" },
      { name: "Chromosome segregation", p: 2e-6, dir: "up" },
      { name: "Immune response", p: 8e-6, dir: "down" },
      { name: "Cell adhesion", p: 4e-5, dir: "down" },
      { name: "Oxidative phosphorylation", p: 2e-4, dir: "up" },
      { name: "Extracellular matrix", p: 9e-4, dir: "down" },
      { name: "Inflammatory response", p: 6e-3, dir: "down" },
      { name: "Angiogenesis", p: 2e-2, dir: "up" },
      { name: "Wnt signaling", p: 4e-2, dir: "down" },
      { name: "Fatty acid metabolism", p: 9e-2, dir: "up" },
      { name: "Response to hypoxia", p: 2e-1, dir: "down" },
    ].map((t) => ({ ...t, nl: -Math.log10(t.p) })).sort((a, b) => b.nl - a.nl);
    const state = { alpha: 0.05 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("go_a", "有意水準 α（FDR）", 0.001, 0.2, 0.001, state.alpha, (v) => v.toFixed(3))}
      </div>
      <div class="widget-stage"><div id="go_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${UP}"></span>上昇群でエンリッチ</span><span class="li"><span class="sw" style="background:${DOWN}"></span>下降群でエンリッチ</span></div></div>
      ${readoutRow([
        { id: "go_sig", label: "有意なGO term", value: "—" },
        { id: "go_line", label: "有意ライン −log10(α)", value: "—" },
      ])}
      <p class="widget-note">バーが長い（p が小さい）ほど有意。αを厳しくすると、点線の右側に残る term が減ります。少数遺伝子の term ほど偽陽性的に飛び出しやすい点に注意。</p>`;
    function draw() {
      const W2 = 560, rowH = 25, mT = 12, mL = 172, mR = 44, H2 = mT + terms.length * rowH + 26;
      const s = stage(document.getElementById("go_plot"), W2, H2);
      const maxNL = Math.max(...terms.map((t) => t.nl)) * 1.08;
      const bx = (v) => mL + (v / maxNL) * (W2 - mL - mR);
      const thr = -Math.log10(state.alpha);
      terms.forEach((t, i) => {
        const y = mT + i * rowH, sig = t.p <= state.alpha, col = t.dir === "up" ? UP : DOWN;
        add(s, "text", { x: mL - 8, y: y + rowH / 2 + 4, "text-anchor": "end", "font-size": 11, fill: sig ? "#2a3040" : "#a2a9bb", "font-weight": sig ? 700 : 500, text: t.name });
        add(s, "rect", { x: mL, y: y + 4, width: Math.max(1, bx(t.nl) - mL), height: rowH - 9, rx: 3, fill: col, opacity: sig ? 0.9 : 0.28 });
        add(s, "text", { x: bx(t.nl) + 5, y: y + rowH / 2 + 4, "font-size": 10, fill: sig ? "#4a5268" : "#b3b9c8", text: t.nl.toFixed(1) });
      });
      // threshold line (label pinned to its top so it never collides with the axis label)
      if (thr <= maxNL) {
        add(s, "line", { x1: bx(thr), x2: bx(thr), y1: mT - 2, y2: mT + terms.length * rowH, stroke: "#1b2233", "stroke-width": 1.4, "stroke-dasharray": "5 4" });
        add(s, "text", { x: bx(thr) + 5, y: mT + 7, "text-anchor": "start", "font-size": 10.5, fill: "#4a5268", "font-weight": 700, text: "α = " + state.alpha.toFixed(3) });
      }
      add(s, "text", { x: mL, y: H2 - 5, "font-size": 11, fill: "#616a7d", "font-weight": 700, text: "−log10(p値)  →" });
      setReadout("go_sig", terms.filter((t) => t.p <= state.alpha).length + " / " + terms.length);
      setReadout("go_line", thr.toFixed(2));
    }
    bindSlider("go_a", (v) => v.toFixed(3), (v) => { state.alpha = v; draw(); });
    draw();
  };

  // 8. GSEA running enrichment score ---------------------------------------
  W.gsea = function (container) {
    const N = 220, setSize = 26;
    const state = { bias: 0.7 };
    function build() {
      const metric = []; for (let i = 0; i < N; i++) metric.push(2.2 * (1 - 2 * i / (N - 1)));
      const rng = CK.makeRng(31 + Math.round((state.bias + 1) * 60));
      const weights = []; for (let i = 0; i < N; i++) weights.push(Math.exp(state.bias * (1 - 2 * i / (N - 1)) * 2.6));
      const chosen = new Set();
      let guard = 0;
      while (chosen.size < setSize && guard++ < 5000) {
        let wsum = 0; for (let i = 0; i < N; i++) if (!chosen.has(i)) wsum += weights[i];
        let r = rng() * wsum, pick = -1;
        for (let i = 0; i < N; i++) { if (chosen.has(i)) continue; r -= weights[i]; if (r <= 0) { pick = i; break; } }
        if (pick < 0) { for (let i = 0; i < N; i++) if (!chosen.has(i)) { pick = i; break; } }
        chosen.add(pick);
      }
      const Nr = [...chosen].reduce((sm, i) => sm + Math.abs(metric[i]), 0);
      const miss = 1 / (N - setSize);
      let run = 0, es = 0, esAbs = 0, esRank = 0; const curve = [];
      for (let i = 0; i < N; i++) {
        run += chosen.has(i) ? Math.abs(metric[i]) / Nr : -miss;
        curve.push(run);
        if (Math.abs(run) > esAbs) { esAbs = Math.abs(run); es = run; esRank = i; }
      }
      return { metric, chosen, curve, es, esRank };
    }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("gs_b", "遺伝子セットの偏り（上位←→下位）", -1, 1, 0.1, state.bias, (v) => (v > 0 ? "上位+" : v < 0 ? "下位" : "均一") + Math.abs(v).toFixed(1))}
      </div>
      <div class="widget-stage"><div id="gs_plot"></div></div>
      ${readoutRow([
        { id: "gs_es", label: "エンリッチメントスコア", value: "—" },
        { id: "gs_side", label: "エンリッチ方向", value: "—" },
      ])}
      <p class="widget-note">黒い縦線が遺伝子セットの各遺伝子の位置。上位（左）に密集すると曲線が上に山を作り <b>正のES</b>、下位（右）なら負のES。全遺伝子を使うので DEG の閾値決めが要りません。</p>`;
    function draw() {
      const d = build();
      const W2 = 560, mL = 46, mR = 18, curveTop = 16, curveBot = 150, tickTop = 158, tickBot = 186, stripTop = 192, stripBot = 208, H2 = 236;
      const s = stage(document.getElementById("gs_plot"), W2, H2);
      const px = (i) => mL + (i / (N - 1)) * (W2 - mL - mR);
      const maxAbs = Math.max(0.2, ...d.curve.map((v) => Math.abs(v)));
      const cy = (v) => curveBot - ((v + maxAbs) / (2 * maxAbs)) * (curveBot - curveTop);
      // zero baseline
      add(s, "line", { x1: mL, x2: W2 - mR, y1: cy(0), y2: cy(0), stroke: "#dfe3ee", "stroke-width": 1 });
      // running ES curve
      let dd = "";
      d.curve.forEach((v, i) => { dd += `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${cy(v).toFixed(1)} `; });
      add(s, "path", { d: dd, fill: "none", stroke: GREEN, "stroke-width": 2 });
      // ES peak marker
      add(s, "line", { x1: px(d.esRank), x2: px(d.esRank), y1: curveTop, y2: tickBot, stroke: "#e5484d", "stroke-width": 1.2, "stroke-dasharray": "4 3" });
      add(s, "text", { x: 8, y: cy(maxAbs) + 4, "font-size": 10.5, fill: "#616a7d", text: "ES" });
      add(s, "text", { x: 8, y: cy(0) + 3, "font-size": 10, fill: "#9aa2b6", text: "0" });
      // hit ticks
      d.chosen.forEach((i) => add(s, "line", { x1: px(i), x2: px(i), y1: tickTop, y2: tickBot, stroke: "#2a3040", "stroke-width": 1 }));
      // ranked metric strip
      for (let i = 0; i < N; i++) {
        const m = d.metric[i], col = m >= 0 ? `rgba(229,72,77,${0.25 + 0.6 * (m / 2.2)})` : `rgba(59,99,224,${0.25 + 0.6 * (-m / 2.2)})`;
        add(s, "rect", { x: px(i), y: stripTop, width: (W2 - mL - mR) / N + 0.6, height: stripBot - stripTop, fill: col, stroke: "none" });
      }
      add(s, "text", { x: mL, y: H2 - 4, "font-size": 10.5, fill: "#616a7d", text: "発現変動でランク付けした全遺伝子（左=上位）→" });
      setReadout("gs_es", d.es.toFixed(3));
      setReadout("gs_side", d.es >= 0 ? "上位（発現上昇側）" : "下位（発現低下側）");
    }
    bindSlider("gs_b", (v) => (v > 0 ? "上位+" : v < 0 ? "下位" : "均一") + Math.abs(v).toFixed(1), (v) => { state.bias = v; draw(); });
    draw();
  };

  // 28. t-SNE / UMAP -------------------------------------------------------
  W.umap = function (container) {
    const rng0 = CK.makeRng(88), K = 5, base = [], cells = [];
    for (let c = 0; c < K; c++) { const a = (c / K) * 2 * Math.PI; base.push([Math.cos(a) * 5, Math.sin(a) * 5]); }
    for (let c = 0; c < K; c++) for (let i = 0; i < 42; i++) cells.push({ c, ox: CK.randNormal(0, 1, rng0), oy: CK.randNormal(0, 1, rng0) });
    const state = { nn: 15, method: "umap" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("um_meth", "手法", [{ v: "umap", label: "UMAP" }, { v: "tsne", label: "t-SNE" }], state.method)}
        ${sliderRow("um_nn", "近傍数 n_neighbors / perplexity", 2, 50, 1, state.nn)}
      </div>
      <div class="widget-stage"><div id="um_plot"></div></div>
      ${readoutRow([
        { id: "um_m", label: "手法", value: "—" },
        { id: "um_nnv", label: "ハイパーパラメータ", value: "—" },
      ])}
      <p class="widget-note">同じデータでも、手法やハイパーパラメータで見た目（クラスターの締まり）が変わります。クラスターの<b>大きさ・間の距離に定量的な意味はありません</b>。</p>`;
    function draw() {
      const spread = 2.3 - Math.min(2.1, (state.nn - 2) / 48 * 2.1);
      const push = state.method === "umap" ? 1.18 : 1.0;
      const rot = state.method === "umap" ? 0.0 : 0.6;
      const pts = cells.map((p) => {
        const b = base[p.c];
        const cx = (b[0] * Math.cos(rot) - b[1] * Math.sin(rot)) * push;
        const cy = (b[0] * Math.sin(rot) + b[1] * Math.cos(rot)) * push;
        return { c: p.c, x: cx + p.ox * spread, y: cy + p.oy * spread };
      });
      const xr = Math.max(...pts.map((p) => Math.abs(p.x))) * 1.15, yr = Math.max(...pts.map((p) => Math.abs(p.y))) * 1.15;
      const ctx = CK.plot(document.getElementById("um_plot"), {
        width: 560, height: 340, margin: { top: 16, right: 18, bottom: 40, left: 40 },
        xDomain: [-xr, xr], yDomain: [-yr, yr], xTicks: 1, yTicks: 1, grid: false,
        xFmt: () => "", yFmt: () => "", xLabel: state.method === "umap" ? "UMAP-1" : "t-SNE 1", yLabel: state.method === "umap" ? "UMAP-2" : "t-SNE 2",
      });
      pts.forEach((p) => CK.dot(ctx, p.x, p.y, { r: 3, fill: CLU[p.c % CLU.length], opacity: 0.72 }));
      setReadout("um_m", state.method === "umap" ? "UMAP" : "t-SNE");
      setReadout("um_nnv", state.nn);
    }
    bindSeg("um_meth", (v) => { state.method = v; draw(); });
    bindSlider("um_nn", (v) => v, (v) => { state.nn = v; draw(); });
    draw();
  };

  // 20. Mutational signature (96-channel SBS spectrum) ---------------------
  W.mutsig = function (container) {
    const TYPES = ["C>A", "C>G", "C>T", "T>A", "T>C", "T>G"];
    const TCOL = ["#22c1e0", "#1b2233", "#e5484d", "#c3c9d8", "#7fce6a", "#f2a6c2"];
    // per-preset base weight for each of the 6 substitution types
    const PRE = {
      obs: { label: "観測スペクトラム", w: [0.9, 0.5, 1.0, 0.6, 0.7, 0.4], dom: "C>T" },
      sbs4: { label: "SBS4 タバコ", w: [1.8, 0.4, 0.5, 0.3, 0.35, 0.3], dom: "C>A" },
      sbs7: { label: "SBS7 紫外線", w: [0.2, 0.2, 2.0, 0.15, 0.4, 0.15], dom: "C>T" },
      sbs22: { label: "SBS22 アリストロキア酸", w: [0.25, 0.2, 0.3, 1.9, 0.4, 0.2], dom: "T>A" },
    };
    const state = { key: "obs" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ms_pre", "発がん要因のプリセット", Object.keys(PRE).map((k) => ({ v: k, label: PRE[k].label })), state.key)}
      </div>
      <div class="widget-stage"><div id="ms_plot"></div></div>
      ${readoutRow([
        { id: "ms_dom", label: "優位な置換タイプ", value: "—" },
        { id: "ms_pre_ro", label: "シグネチャー", value: "—" },
      ])}
      <p class="widget-note">中心の6種の置換 × 前後の塩基文脈16通り＝<b>96チャネル</b>。因子ごとに“指紋”が違います（タバコ=C>A、紫外線=C>T、アリストロキア酸=T>A が優位）。</p>`;
    function draw() {
      const p = PRE[state.key];
      const W2 = 560, H2 = 250, mL = 34, mR = 12, top = 26, base = 210;
      const s = stage(document.getElementById("ms_plot"), W2, H2);
      const bw = (W2 - mL - mR) / 96;
      let idx = 0, maxv = 0; const vals = [];
      for (let t = 0; t < 6; t++) for (let c = 0; c < 16; c++) {
        const jitter = 0.35 + ((Math.sin((t * 16 + c) * 12.9898) * 43758.5453) % 1 + 1) % 1;
        const v = p.w[t] * jitter; vals.push({ t, v }); if (v > maxv) maxv = v; idx++;
      }
      vals.forEach((d, i) => {
        const h = (d.v / maxv) * (base - top);
        add(s, "rect", { x: mL + i * bw, y: base - h, width: Math.max(1, bw - 0.4), height: h, fill: TCOL[d.t] });
      });
      // top colour blocks + type labels
      for (let t = 0; t < 6; t++) {
        const x0 = mL + t * 16 * bw;
        add(s, "rect", { x: x0, y: 8, width: 16 * bw - 2, height: 8, fill: TCOL[t], rx: 2 });
        add(s, "text", { x: x0 + 8 * bw, y: 22, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: t === 1 ? "#4a5268" : TCOL[t], text: TYPES[t] });
      }
      add(s, "line", { x1: mL, x2: W2 - mR, y1: base, y2: base, stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: 8, y: top + 6, "font-size": 10, fill: "#8a93a8", text: "頻度" });
      setReadout("ms_dom", p.dom); setReadout("ms_pre_ro", p.label);
    }
    bindSeg("ms_pre", (v) => { state.key = v; draw(); });
    draw();
  };

  // 21. Circos plot (chromosome ring + rearrangement chords) ---------------
  W.circos = function (container) {
    const NCHR = 22, rng = CK.makeRng(707);
    const links = []; for (let i = 0; i < 40; i++) links.push({ a: rng() * 2 * Math.PI, b: rng() * 2 * Math.PI, art: rng() < 0.25 });
    const state = { n: 16 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ci_n", "構造変異（SV）の数", 0, 40, 1, state.n)}
      </div>
      <div class="widget-stage"><div id="ci_plot"></div></div>
      ${readoutRow([
        { id: "ci_chr", label: "染色体", value: NCHR + " 本" },
        { id: "ci_link", label: "リンク（chord）数", value: "—" },
      ])}
      <p class="widget-note">外周＝染色体、中央のリンク＝離れた領域どうしのつながり（<b>転座・構造変異</b>）。リング・色の意味は作図者が決めるので、実際の論文ではキャプション確認が必須です。</p>`;
    function draw() {
      const SZ = 360, cx = SZ / 2, cy = SZ / 2, R = 150, r0 = 128;
      const s = stage(document.getElementById("ci_plot"), SZ, SZ);
      const gap = 0.03;
      const seg = (2 * Math.PI) / NCHR;
      for (let i = 0; i < NCHR; i++) {
        const a0 = i * seg + gap, a1 = (i + 1) * seg - gap;
        const col = i % 2 ? "#8aa0d8" : "#c0b3ea";
        const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
        const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
        add(s, "path", { d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`, fill: "none", stroke: col, "stroke-width": 9, "stroke-linecap": "butt" });
        const am = (a0 + a1) / 2, lr = R + 15;
        add(s, "text", { x: cx + lr * Math.cos(am), y: cy + lr * Math.sin(am) + 3, "text-anchor": "middle", "font-size": 8.5, fill: "#7a84a0", text: i + 1 });
      }
      const shown = links.slice(0, state.n);
      shown.forEach((lk) => {
        const ax = cx + r0 * Math.cos(lk.a), ay = cy + r0 * Math.sin(lk.a);
        const bx = cx + r0 * Math.cos(lk.b), by = cy + r0 * Math.sin(lk.b);
        add(s, "path", { d: `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${cx} ${cy} ${bx.toFixed(1)} ${by.toFixed(1)}`, fill: "none", stroke: lk.art ? "rgba(229,72,77,0.6)" : "rgba(59,99,224,0.5)", "stroke-width": 1.4 });
      });
      setReadout("ci_link", state.n);
    }
    bindSlider("ci_n", (v) => v, (v) => { state.n = v; draw(); });
    draw();
  };

  // 22. Manhattan plot -----------------------------------------------------
  W.manhattan = function (container) {
    const CHR = 22, rng = CK.makeRng(2024);
    const lens = []; for (let c = 0; c < CHR; c++) lens.push(1.4 - c * 0.04 + rng() * 0.1);
    const total = lens.reduce((a, b) => a + b, 0);
    const starts = []; let acc = 0; for (let c = 0; c < CHR; c++) { starts.push(acc); acc += lens[c]; }
    // background SNPs + true loci
    const snps = [];
    for (let c = 0; c < CHR; c++) {
      const m = Math.round(60 * lens[c]);
      for (let i = 0; i < m; i++) {
        const x = starts[c] + rng() * lens[c];
        const base = -Math.log10(Math.max(1e-6, rng())) * 0.55; // noise
        snps.push({ x, c, base, boost: 0 });
      }
    }
    const loci = [{ c: 3, off: 0.5, amp: 8.6 }, { c: 8, off: 0.6, amp: 6.4 }, { c: 12, off: 0.4, amp: 9.0 }, { c: 15, off: 0.5, amp: 6.9 }, { c: 1, off: 0.7, amp: 5.4 }];
    loci.forEach((L) => {
      const cx = starts[L.c] + L.off * lens[L.c];
      snps.forEach((s) => { const d = Math.abs(s.x - cx); if (d < 0.05) s.boost = Math.max(s.boost, L.amp * Math.exp(-((d / 0.02) ** 2))); });
    });
    const state = { n: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mh_n", "サンプルサイズ（相対）", 0.3, 3, 0.1, state.n, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="mh_plot"></div></div>
      ${readoutRow([
        { id: "mh_gw", label: "ゲノムワイド有意", value: "—" },
        { id: "mh_sg", label: "示唆的水準のみ", value: "—" },
      ])}
      <p class="widget-note">赤線＝ゲノムワイド有意（α=5×10⁻⁸）、青線＝示唆的水準。サンプルサイズを上げると検出力が増して塔が伸び、赤線を超える領域が増えます。載っているのは<b>p値だけ</b>です。</p>`;
    function draw() {
      const GW = 7.3, SG = 6.0;
      const maxY = 10;
      const ctx = CK.plot(document.getElementById("mh_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 16, bottom: 40, left: 44 },
        xDomain: [0, total], yDomain: [0, maxY], xTicks: 1, yTicks: 5, grid: false,
        xFmt: () => "", yLabel: "−log10(p値)",
      });
      let gw = 0, sg = 0;
      snps.forEach((s) => {
        const y = Math.min(maxY, s.base + s.boost * state.n);
        CK.dot(ctx, s.x, y, { r: 2.4, fill: s.c % 2 ? "#5b8bff" : "#a855f7", opacity: 0.7 });
      });
      // count peaks per locus
      loci.forEach((L) => {
        const peak = Math.min(maxY, (0.3 + L.amp * state.n));
        if (peak >= GW) gw++; else if (peak >= SG) sg++;
      });
      CK.hline(ctx, GW, { stroke: "#e5484d", "stroke-width": 1.4, "stroke-dasharray": "5 4" });
      CK.hline(ctx, SG, { stroke: "#3b82f6", "stroke-width": 1.2, "stroke-dasharray": "3 3" });
      for (let c = 0; c < CHR; c += 1) {
        if (c % 2 === 0 || c > 15) CK.textPx(ctx, ctx.x(starts[c] + lens[c] / 2), ctx.margin.top + ctx.h + 16, String(c + 1), { "font-size": 8.5, fill: "#8a93a8", "text-anchor": "middle" });
      }
      setReadout("mh_gw", gw + " 領域"); setReadout("mh_sg", sg + " 領域");
    }
    bindSlider("mh_n", (v) => "×" + v.toFixed(1), (v) => { state.n = v; draw(); });
    draw();
  };

  // 23. Regional plot ------------------------------------------------------
  W.regional = function (container) {
    const rng = CK.makeRng(316), lo = 20.2, hi = 20.5, lead = 20.34, leadY = 8.4;
    const snps = [];
    for (let i = 0; i < 140; i++) {
      const x = lo + rng() * (hi - lo);
      snps.push({ x, noise: -Math.log10(Math.max(1e-4, rng())) * 0.6 });
    }
    const state = { decay: 0.035 };
    function r2(x) { return Math.exp(-(((x - lead) / state.decay) ** 2)); }
    function colorFor(r) { return r >= 0.8 ? "#e5484d" : r >= 0.6 ? "#f59e0b" : r >= 0.4 ? "#7fce6a" : r >= 0.2 ? "#5b8bff" : "#3b4a80"; }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("rg_d", "連鎖不平衡(LD)の広がり", 0.012, 0.08, 0.002, state.decay, (v) => v.toFixed(3))}
      </div>
      <div class="widget-stage"><div id="rg_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#e5484d"></span>r²≥0.8</span><span class="li"><span class="sw" style="background:#f59e0b"></span>0.6</span><span class="li"><span class="sw" style="background:#7fce6a"></span>0.4</span><span class="li"><span class="sw" style="background:#5b8bff"></span>0.2</span><span class="li"><span class="sw" style="background:#3b4a80"></span>&lt;0.2</span></div></div>
      ${readoutRow([
        { id: "rg_lead", label: "リードSNP −log10p", value: leadY.toFixed(1) },
        { id: "rg_hi", label: "高LD(r²≥0.6)のSNP", value: "—" },
      ])}
      <p class="widget-note">色＝<b>リードSNP（◆）との連鎖不平衡 r²</b>。有意なSNPがみな高LD（赤〜橙）なら、この領域で独立に効く場所は1か所と推測できます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("rg_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 42, left: 46 },
        xDomain: [lo, hi], yDomain: [0, 10], xTicks: 4, yTicks: 5,
        xFmt: (v) => v.toFixed(2), xLabel: "16番染色体上の位置 (Mb)", yLabel: "−log10(p値)",
      });
      CK.hline(ctx, 7.3, { stroke: "#e5484d", "stroke-width": 1.2, "stroke-dasharray": "5 4" });
      let hi2 = 0;
      snps.forEach((s) => {
        const r = r2(s.x), y = Math.min(9.5, s.noise + r * (leadY - 0.5));
        if (r >= 0.6) hi2++;
        CK.dot(ctx, s.x, y, { r: 3.4, fill: colorFor(r), opacity: 0.85, stroke: "#fff", "stroke-width": 0.5 });
      });
      add(ctx.svg, "path", { d: `M ${ctx.x(lead)} ${ctx.y(leadY) - 8} L ${ctx.x(lead) + 7} ${ctx.y(leadY)} L ${ctx.x(lead)} ${ctx.y(leadY) + 8} L ${ctx.x(lead) - 7} ${ctx.y(leadY)} Z`, fill: "#a855f7", stroke: "#fff", "stroke-width": 1 });
      setReadout("rg_hi", hi2 + " 個");
    }
    bindSlider("rg_d", (v) => v.toFixed(3), (v) => { state.decay = v; draw(); });
    draw();
  };

  // 24. Haplotype (genotype vs phased haplotype) ---------------------------
  W.haplotype = function (container) {
    const SNP = [{ name: "SNP1", al: ["A", "T"] }, { name: "SNP2", al: ["A", "G"] }, { name: "SNP3", al: ["C", "T"] }];
    const state = { pat: [0, 0, 0], mat: [0, 1, 1] }; // indices into al
    container.innerHTML = `
      <div class="widget-stage" style="padding:20px">
        <div id="hp_ui"></div>
      </div>
      ${readoutRow([
        { id: "hp_gt", label: "ジェノタイプ", value: "—" },
        { id: "hp_h1", label: "ハプロタイプ1（父鎖）", value: "—" },
        { id: "hp_h2", label: "ハプロタイプ2（母鎖）", value: "—" },
      ])}
      <p class="widget-note">父鎖・母鎖のアレルを切り替えてみましょう。<b>ジェノタイプ</b>（各SNPの順不同のアレル対）だけからは、どの鎖に何が乗っていたか（phase＝ハプロタイプ）は復元できません。</p>`;
    const ui = container.querySelector("#hp_ui");
    function segFor(strand, si) {
      const cur = state[strand][si], al = SNP[si].al;
      return `<span class="seg" data-strand="${strand}" data-si="${si}">${al.map((a, ai) => `<button type="button" data-ai="${ai}" class="${ai === cur ? "active" : ""}" style="min-width:34px">${a}</button>`).join("")}</span>`;
    }
    function render() {
      ui.innerHTML = `
        <div style="display:grid;grid-template-columns:auto repeat(3,1fr);gap:10px 14px;align-items:center;max-width:440px;margin:0 auto">
          <div></div>${SNP.map((s) => `<div style="text-align:center;font-size:11px;color:#616a7d;font-family:var(--font-mono)">${s.name}</div>`).join("")}
          <div style="font-size:12px;font-weight:700;color:#e5484d">父鎖</div>${SNP.map((_, i) => `<div style="text-align:center">${segFor("pat", i)}</div>`).join("")}
          <div style="font-size:12px;font-weight:700;color:#0f9e73">母鎖</div>${SNP.map((_, i) => `<div style="text-align:center">${segFor("mat", i)}</div>`).join("")}
        </div>`;
      ui.querySelectorAll(".seg").forEach((seg) => {
        const strand = seg.dataset.strand, si = +seg.dataset.si;
        seg.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
          state[strand][si] = +b.dataset.ai; update(); render();
        }));
      });
    }
    function update() {
      const gt = SNP.map((s, i) => { const p = s.al[state.pat[i]], m = s.al[state.mat[i]]; return [p, m].sort().join("/"); }).join("  ");
      const h1 = SNP.map((s, i) => s.al[state.pat[i]]).join("-");
      const h2 = SNP.map((s, i) => s.al[state.mat[i]]).join("-");
      setReadout("hp_gt", gt); setReadout("hp_h1", h1); setReadout("hp_h2", h2);
    }
    render(); update();
  };

  // 25. Accumulation / rarefaction curve -----------------------------------
  W.accum = function (container) {
    const DIV = { lo: { S: 90, k: 0.16, label: "低" }, mid: { S: 170, k: 0.10, label: "中" }, hi: { S: 280, k: 0.055, label: "高" } };
    const state = { n: 22, div: "mid" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ac_div", "真の多様性", Object.keys(DIV).map((k) => ({ v: k, label: DIV[k].label })), state.div)}
        ${sliderRow("ac_n", "サンプリング回数", 2, 50, 1, state.n)}
      </div>
      <div class="widget-stage"><div id="ac_plot"></div></div>
      ${readoutRow([
        { id: "ac_det", label: "検出数", value: "—" },
        { id: "ac_slope", label: "現在の傾き（新規発見率）", value: "—" },
        { id: "ac_sat", label: "飽和判定", value: "—" },
      ])}
      <p class="widget-note">曲線の傾きが0に近づけば<b>頭打ち＝十分にサンプリングできた</b>サイン。まだ直線的に伸びていれば、回数を増やした分だけ新規が見つかる（多様性を捉えきれていない）状態です。</p>`;
    function draw() {
      const d = DIV[state.div];
      const yMax = 300;
      const ctx = CK.plot(document.getElementById("ac_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 18, bottom: 42, left: 48 },
        xDomain: [0, 50], yDomain: [0, yMax], xTicks: 5, yTicks: 5,
        xLabel: "サンプリング回数", yLabel: "累積検出数",
      });
      const f = (x) => d.S * (1 - Math.exp(-d.k * x));
      const full = []; for (let x = 0; x <= 50; x += 0.5) full.push([x, f(x)]);
      CK.line(ctx, full, { stroke: "#d5d9e6", "stroke-width": 1.5, "stroke-dasharray": "4 3" });
      CK.hline(ctx, d.S, { stroke: "#c7cce0", "stroke-dasharray": "2 4" });
      const rev = full.filter((p) => p[0] <= state.n);
      CK.line(ctx, rev, { stroke: "#a855f7", "stroke-width": 2.4 });
      CK.dot(ctx, state.n, f(state.n), { r: 5, fill: "#a855f7", stroke: "#fff", "stroke-width": 1.5 });
      const slope = d.S * d.k * Math.exp(-d.k * state.n);
      setReadout("ac_det", Math.round(f(state.n)));
      setReadout("ac_slope", slope.toFixed(2) + " /回");
      setReadout("ac_sat", slope < 1.0 ? "ほぼ飽和 ✓" : "まだ増加中");
    }
    bindSeg("ac_div", (v) => { state.div = v; draw(); });
    bindSlider("ac_n", (v) => v, (v) => { state.n = v; draw(); });
    draw();
  };

  // 36. ChIP-seq (IGV-style pileup + peak calling) -------------------------
  W.chipseq = function (container) {
    // fixed peak positions (as fraction of window) with base heights
    const peaks = [{ x: 0.22, h: 0.5 }, { x: 0.5, h: 0.35, tnf: 2.4 }, { x: 0.78, h: 0.6 }];
    const state = { cond: "tnf", thr: 1.2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("cs_c", "条件", [{ v: "mock", label: "Mock" }, { v: "tnf", label: "TNF-α" }], state.cond)}
        ${sliderRow("cs_t", "ピーク閾値（peak call）", 0.4, 3, 0.1, state.thr, (v) => v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="cs_plot"></div></div>
      ${readoutRow([
        { id: "cs_n", label: "検出ピーク", value: "—" },
        { id: "cs_cond", label: "条件", value: "—" },
      ])}
      <p class="widget-note">TNF-α処理でプロモーター（中央）に結合ピークが出現。<b>Input（平らな背景）</b>と比べ、閾値を超えた山だけを結合部位として拾います（peak calling）。</p>`;
    function height(px) {
      let v = 0.06; // baseline
      peaks.forEach((p) => { const amp = (state.cond === "tnf" && p.tnf) ? p.tnf : p.h; v += amp * Math.exp(-(((px - p.x) / 0.03) ** 2)); });
      return v;
    }
    function draw() {
      const W2 = 560, H2 = 300, mL = 40, mR = 14, topC = 18, botC = 150, topI = 176, botI = 214;
      const s = stage(document.getElementById("cs_plot"), W2, H2);
      const N = 240, px = (i) => mL + (i / (N - 1)) * (W2 - mL - mR);
      const vals = []; let maxv = 0.1;
      for (let i = 0; i < N; i++) { const v = height(i / (N - 1)); vals.push(v); if (v > maxv) maxv = v; }
      const cy = (v) => botC - (v / maxv) * (botC - topC);
      // ChIP area
      let d = `M ${mL} ${botC} `; vals.forEach((v, i) => { d += `L ${px(i).toFixed(1)} ${cy(v).toFixed(1)} `; }); d += `L ${W2 - mR} ${botC} Z`;
      add(s, "path", { d, fill: "rgba(168,85,247,0.35)", stroke: "#a855f7", "stroke-width": 1.2 });
      // threshold line + called peaks
      const ty = cy(state.thr);
      add(s, "line", { x1: mL, x2: W2 - mR, y1: ty, y2: ty, stroke: "#e5484d", "stroke-width": 1.3, "stroke-dasharray": "5 4" });
      add(s, "text", { x: W2 - mR, y: ty - 4, "text-anchor": "end", "font-size": 10, fill: "#e5484d", text: "閾値" });
      let n = 0;
      peaks.forEach((p) => { const amp = (state.cond === "tnf" && p.tnf) ? p.tnf : p.h; const peakV = amp + 0.06; if (peakV >= state.thr) { n++; add(s, "rect", { x: px((p.x) * (N - 1)) - 14, y: topC - 2, width: 28, height: botC - topC + 4, fill: "rgba(229,72,77,0.10)", stroke: "none" }); } });
      add(s, "text", { x: mL, y: topC + 8, "font-size": 10.5, fill: "#616a7d", "font-weight": 700, text: "ChIP-seq" });
      // input track (flat, low)
      const recN = CK.makeRng(9);
      let di = `M ${mL} ${botI} `;
      for (let i = 0; i < N; i++) { const v = 0.05 + 0.03 * recN(); di += `L ${px(i).toFixed(1)} ${(botI - (v / maxv) * (botI - topI)).toFixed(1)} `; }
      di += `L ${W2 - mR} ${botI} Z`;
      add(s, "path", { d: di, fill: "rgba(150,162,182,0.3)", stroke: "#9aa2b6", "stroke-width": 1 });
      add(s, "text", { x: mL, y: topI + 8, "font-size": 10.5, fill: "#8a93a8", "font-weight": 700, text: "Input（対照）" });
      add(s, "text", { x: (mL + W2 - mR) / 2, y: H2 - 4, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "ゲノム位置（プロモーター周辺）→" });
      setReadout("cs_n", n + " 個"); setReadout("cs_cond", state.cond === "tnf" ? "TNF-α処理" : "Mock処理");
    }
    bindSeg("cs_c", (v) => { state.cond = v; draw(); });
    bindSlider("cs_t", (v) => v.toFixed(1), (v) => { state.thr = v; draw(); });
    draw();
  };

  // 37. ATAC-seq (fragment size distribution) ------------------------------
  W.atacseq = function (container) {
    const state = { q: "good" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("at_q", "ライブラリ品質", [{ v: "good", label: "良質" }, { v: "bad", label: "低品質" }], state.q)}
      </div>
      <div class="widget-stage"><div id="at_plot"></div></div>
      ${readoutRow([
        { id: "at_nfr", label: "ヌクレオソームフリー割合", value: "—" },
        { id: "at_lad", label: "ラダー（周期性）", value: "—" },
      ])}
      <p class="widget-note">良質なライブラリは、短い断片（オープンクロマチン）の大きな山＋<b>約200bpごとの周期的な山（ヌクレオソームのはしご）</b>が見えます。崩れていれば品質に注意。</p>`;
    function density(L) {
      const good = state.q === "good";
      const nfr = 1.0 * Math.exp(-(((L - 55) / 40) ** 2));
      const amps = good ? [0.55, 0.32, 0.18, 0.10] : [0.10, 0.05, 0.03, 0.02];
      let nuc = 0; [200, 400, 600, 800].forEach((c, i) => { nuc += amps[i] * Math.exp(-(((L - c) / 55) ** 2)); });
      const hump = good ? 0 : 0.16 * Math.exp(-(((L - 300) / 260) ** 2));
      return nfr + nuc + hump;
    }
    function draw() {
      const ctx = CK.plot(document.getElementById("at_plot"), {
        width: 560, height: 310, margin: { top: 16, right: 18, bottom: 42, left: 46 },
        xDomain: [0, 1000], yDomain: [0, 1.15], xTicks: 5, yTicks: 1, grid: false,
        yFmt: () => "", xLabel: "フラグメント長 (bp)", yLabel: "リード密度",
      });
      const pts = []; for (let L = 0; L <= 1000; L += 6) pts.push([L, density(L)]);
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: "#a855f7", opacity: 0.16 });
      CK.line(ctx, pts, { stroke: "#a855f7", "stroke-width": 2 });
      if (state.q === "good") [200, 400, 600].forEach((c) => CK.vline(ctx, c, { stroke: "#c7cce0" }));
      const nfr = state.q === "good" ? "約 55%" : "約 30%";
      setReadout("at_nfr", nfr);
      setReadout("at_lad", state.q === "good" ? "明瞭 ✓" : "不明瞭 ✗");
    }
    bindSeg("at_q", (v) => { state.q = v; draw(); });
    draw();
  };

  // 38. CUT&RUN / CUT&Tag vs ChIP-seq (signal-to-noise vs cell number) -----
  W.cutrun = function (container) {
    const state = { log: 5 }; // log10(cells)
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("cr_c", "細胞数", 3, 6, 0.1, state.log, (v) => "10^" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="cr_plot"></div></div>
      ${readoutRow([
        { id: "cr_chip", label: "ChIP-seq S/N", value: "—" },
        { id: "cr_cut", label: "CUT&Tag S/N", value: "—" },
      ])}
      <p class="widget-note">細胞数を下げると、ゲノム全体を沈降する<b>ChIP-seqは背景ノイズが増えS/Nが悪化</b>。結合部位近傍だけを狙うCUT&Tagは少数細胞でも鋭く低背景を保ちます。</p>`;
    function track(s, y0, y1, label, bg, peakScale, col) {
      const W2 = 560, mL = 40, mR = 14, N = 220, px = (i) => mL + (i / (N - 1)) * (W2 - mL - mR);
      const rng = CK.makeRng(label === "ChIP-seq" ? 11 : 22);
      const peak = 1.0 * peakScale;
      const vals = []; let maxv = 0.2;
      for (let i = 0; i < N; i++) {
        const f = i / (N - 1);
        let v = bg * (0.5 + rng());
        [0.3, 0.62].forEach((c) => { v += peak * Math.exp(-(((f - c) / 0.025) ** 2)); });
        vals.push(v); if (v > maxv) maxv = v;
      }
      const cy = (v) => y1 - (v / maxv) * (y1 - y0);
      let d = `M ${mL} ${y1} `; vals.forEach((v, i) => { d += `L ${px(i).toFixed(1)} ${cy(v).toFixed(1)} `; }); d += `L ${W2 - mR} ${y1} Z`;
      add(s, "path", { d, fill: col + "40", stroke: col, "stroke-width": 1.1 });
      add(s, "text", { x: mL, y: y0 + 2, "font-size": 10.5, fill: "#4a5268", "font-weight": 700, text: label });
      return peak / bg;
    }
    function draw() {
      const H2 = 300;
      const s = stage(document.getElementById("cr_plot"), 560, H2);
      const cells = state.log;
      const chipBg = 0.08 * (1 + (6 - cells) * 0.9);      // ChIP background blows up at low cells
      const cutBg = 0.05 * (1 + (6 - cells) * 0.12);      // CUT&Tag stays low
      const chipPeak = 0.9 * (0.7 + 0.3 * (cells - 3) / 3);
      const cutPeak = 1.0 * (0.85 + 0.15 * (cells - 3) / 3);
      const sn1 = track(s, 20, 130, "ChIP-seq", chipBg, chipPeak, "#5b8bff");
      const sn2 = track(s, 165, 275, "CUT&Tag", cutBg, cutPeak, "#a855f7");
      add(s, "text", { x: 280, y: H2 - 4, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "同じ遺伝子座（結合部位2か所）→" });
      setReadout("cr_chip", sn1.toFixed(1)); setReadout("cr_cut", sn2.toFixed(1));
    }
    bindSlider("cr_c", (v) => "10^" + v.toFixed(1), (v) => { state.log = v; draw(); });
    draw();
  };

  // 39. Hi-C contact matrix (TADs along diagonal) --------------------------
  W.hic = function (container) {
    const N = 44;
    const tads = [[0, 9], [9, 18], [18, 30], [30, 38], [38, 44]];
    const loops = [[3, 8], [20, 28], [31, 37]];
    const state = { tad: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("hc2_t", "TAD構造の強さ", 0, 2, 0.1, state.tad, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="hc2_plot"></div></div>
      ${readoutRow([
        { id: "hc2_tad", label: "TAD（対角ブロック）", value: tads.length + " 個" },
        { id: "hc2_res", label: "解像度 (bin)", value: "200 kb" },
      ])}
      <p class="widget-note">対角線＝ゲノム上で近い領域どうしで最も濃い。対角付近の四角いブロックが<b>TAD</b>、対角から離れた点が<b>ループ</b>。実データは正規化（観察値/期待値）後に読みます。</p>`;
    function tadOf(i) { for (let t = 0; t < tads.length; t++) if (i >= tads[t][0] && i < tads[t][1]) return t; return -1; }
    function draw() {
      const SZ = 320, mL = 30, top = 12, cell = (SZ - mL - 12) / N;
      const s = stage(document.getElementById("hc2_plot"), SZ + 60, SZ);
      let maxv = 0;
      const M = [];
      for (let i = 0; i < N; i++) { M[i] = []; for (let j = 0; j < N; j++) {
        const d = Math.abs(i - j);
        let v = Math.exp(-d / 5);
        if (tadOf(i) === tadOf(j) && tadOf(i) >= 0) v += 0.5 * state.tad * Math.exp(-d / 8);
        loops.forEach((lp) => { if ((Math.abs(i - lp[0]) < 2 && Math.abs(j - lp[1]) < 2) || (Math.abs(i - lp[1]) < 2 && Math.abs(j - lp[0]) < 2)) v += 0.6 * state.tad; });
        M[i][j] = v; if (v > maxv) maxv = v;
      } }
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const t = Math.min(1, M[i][j] / maxv);
        const r = 255, g = Math.round(255 - t * 235), b = Math.round(255 - t * 245);
        add(s, "rect", { x: mL + j * cell, y: top + i * cell, width: cell + 0.5, height: cell + 0.5, fill: `rgb(${r},${g},${b})` });
      }
      add(s, "rect", { x: mL, y: top, width: N * cell, height: N * cell, fill: "none", stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: mL + N * cell / 2, y: SZ - 2, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "染色体上の位置 →" });
      // colour scale
      for (let k = 0; k <= 20; k++) { const t = k / 20; add(s, "rect", { x: SZ + 20, y: top + (1 - t) * N * cell, width: 12, height: N * cell / 20 + 0.5, fill: `rgb(255,${Math.round(255 - t * 235)},${Math.round(255 - t * 245)})` }); }
      add(s, "text", { x: SZ + 36, y: top + 6, "font-size": 9, fill: "#8a93a8", text: "高" });
      add(s, "text", { x: SZ + 36, y: top + N * cell, "font-size": 9, fill: "#8a93a8", text: "低" });
    }
    bindSlider("hc2_t", (v) => "×" + v.toFixed(1), (v) => { state.tad = v; draw(); });
    draw();
  };

  // 26. Bulk RNA-seq (normalization demo) ----------------------------------
  W.bulkrna = function (container) {
    const genes = [{ name: "Actb (参照)", e: [100, 100, 100] }, { name: "GeneX", e: [40, 80, 40] }, { name: "GeneY", e: [60, 60, 120] }];
    const gcol = ["#9aa2b6", "#a855f7", "#0f9e73"];
    const state = { depth: 2.0, mode: "raw" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("br_m", "表示", [{ v: "raw", label: "生カウント (Raw)" }, { v: "cpm", label: "CPM 正規化" }], state.mode)}
        ${sliderRow("br_d", "サンプル3の深度（相対）", 0.5, 3, 0.1, state.depth, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="br_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${gcol[0]}"></span>Actb(参照)</span><span class="li"><span class="sw" style="background:${gcol[1]}"></span>GeneX</span><span class="li"><span class="sw" style="background:${gcol[2]}"></span>GeneY</span></div></div>
      ${readoutRow([
        { id: "br_mode", label: "表示", value: "—" },
        { id: "br_note", label: "サンプル3の見え方", value: "—" },
      ])}
      <p class="widget-note">深度（読んだリード数）が違うと、<b>生カウントではサンプル3の全遺伝子が一律に高く見えます</b>。CPM正規化で深度をそろえると、本来の発現パターンに戻ります。</p>`;
    function draw() {
      const depths = [1, 1, state.depth];
      const W2 = 560, H2 = 300, mL = 40, mR = 14, top = 18, base = 250;
      const s = stage(document.getElementById("br_plot"), W2, H2);
      const groupW = (W2 - mL - mR) / genes.length;
      const bw = groupW / 4.2;
      const maxRaw = state.mode === "raw" ? 120 * Math.max(...depths) : 130;
      genes.forEach((g, gi) => {
        const gx = mL + gi * groupW + groupW * 0.12;
        for (let sIdx = 0; sIdx < 3; sIdx++) {
          const val = state.mode === "raw" ? g.e[sIdx] * depths[sIdx] : g.e[sIdx];
          const h = (val / maxRaw) * (base - top);
          add(s, "rect", { x: gx + sIdx * bw, y: base - h, width: bw - 2, height: h, fill: gcol[gi], opacity: sIdx === 2 ? 1 : 0.55, rx: 2 });
          add(s, "text", { x: gx + sIdx * bw + bw / 2 - 1, y: base + 12, "text-anchor": "middle", "font-size": 8, fill: "#8a93a8", text: "S" + (sIdx + 1) });
        }
        add(s, "text", { x: gx + 1.5 * bw, y: base + 26, "text-anchor": "middle", "font-size": 10.5, fill: "#4a5268", "font-weight": 700, text: g.name });
      });
      add(s, "line", { x1: mL, x2: W2 - mR, y1: base, y2: base, stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: 8, y: top + 6, "font-size": 10, fill: "#8a93a8", text: state.mode === "raw" ? "生カウント" : "CPM" });
      setReadout("br_mode", state.mode === "raw" ? "生カウント (Raw)" : "CPM 正規化");
      setReadout("br_note", state.mode === "raw" ? (state.depth > 1.15 ? "一律に高く見える（誤り）" : state.depth < 0.9 ? "一律に低く見える" : "ほぼ等しい") : "本来の発現に補正");
    }
    bindSeg("br_m", (v) => { state.mode = v; draw(); });
    bindSlider("br_d", (v) => "×" + v.toFixed(1), (v) => { state.depth = v; draw(); });
    draw();
  };

  // 29. Trajectory / pseudotime --------------------------------------------
  W.trajectory = function (container) {
    const rng = CK.makeRng(2929);
    const path = (t) => [0.5 + 3.4 * t, 2.2 + 1.5 * Math.sin(t * Math.PI * 1.15)];
    const cells = [];
    for (let i = 0; i < 260; i++) {
      const t = rng();
      const p = path(t);
      cells.push({ t, x: p[0] + CK.randNormal(0, 0.28, rng), y: p[1] + CK.randNormal(0, 0.28, rng) });
    }
    const state = { cur: 0.5 };
    function ptCol(t) { const r = Math.round(60 + 195 * t), g = Math.round(90 + 40 * Math.sin(t * Math.PI)), b = Math.round(250 - 210 * t); return `rgb(${r},${g},${b})`; }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("tr_c", "pseudotime カーソル", 0, 1, 0.02, state.cur, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="tr_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${ptCol(0)}"></span>始点(幹細胞)</span><span class="li"><span class="sw" style="background:${ptCol(0.5)}"></span>中間</span><span class="li"><span class="sw" style="background:${ptCol(1)}"></span>終点(分化)</span></div></div>
      ${readoutRow([
        { id: "tr_pt", label: "カーソル位置 pseudotime", value: "—" },
        { id: "tr_n", label: "その段階付近の細胞", value: "—" },
      ])}
      <p class="widget-note">細胞はpseudotime（分化の進行度）で色分けされ、曲線が分化の<b>道筋（トラジェクトリ）</b>。これは実時間ではなく発現の連続変化から推定した順序です。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("tr_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 18, bottom: 40, left: 40 },
        xDomain: [0, 4.4], yDomain: [0, 4.4], xTicks: 1, yTicks: 1, grid: false,
        xFmt: () => "", yFmt: () => "", xLabel: "UMAP-1", yLabel: "UMAP-2",
      });
      const curve = []; for (let t = 0; t <= 1; t += 0.02) curve.push(path(t));
      CK.line(ctx, curve, { stroke: "#2a3040", "stroke-width": 3, opacity: 0.85 });
      let near = 0;
      cells.forEach((c) => {
        const hl = Math.abs(c.t - state.cur) < 0.06;
        if (hl) near++;
        CK.dot(ctx, c.x, c.y, { r: hl ? 5 : 3, fill: ptCol(c.t), opacity: hl ? 1 : 0.7, stroke: hl ? "#1b2233" : "none", "stroke-width": hl ? 1.5 : 0 });
      });
      const cp = path(state.cur);
      add(ctx.svg, "circle", { cx: ctx.x(cp[0]), cy: ctx.y(cp[1]), r: 8, fill: "none", stroke: "#e5484d", "stroke-width": 2 });
      setReadout("tr_pt", state.cur.toFixed(2)); setReadout("tr_n", near + " 個");
    }
    bindSlider("tr_c", (v) => v.toFixed(2), (v) => { state.cur = v; draw(); });
    draw();
  };

  // 30. RNA velocity (vector field) ----------------------------------------
  W.velocity = function (container) {
    const rng = CK.makeRng(3030);
    const path = (t) => [0.5 + 3.4 * t, 2.2 + 1.4 * Math.sin(t * Math.PI * 1.15)];
    const tang = (t) => { const d = 0.001, a = path(t - d), b = path(t + d); return [b[0] - a[0], b[1] - a[1]]; };
    const cells = [];
    for (let i = 0; i < 240; i++) { const t = rng(); const p = path(t); cells.push([p[0] + CK.randNormal(0, 0.3, rng), p[1] + CK.randNormal(0, 0.3, rng)]); }
    const state = { scale: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ve_s", "矢印の大きさ（速度スケール）", 0.3, 2, 0.1, state.scale, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="ve_plot"></div></div>
      ${readoutRow([
        { id: "ve_dir", label: "全体の流れの向き", value: "分化方向 →" },
        { id: "ve_scl", label: "矢印スケール", value: "—" },
      ])}
      <p class="widget-note">灰色は細胞、矢印は各点で細胞が<b>これから変化しようとする方向と速度</b>。未成熟/成熟mRNAの比から推定した“向きつき”の情報で、分化の行き先を示唆します。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ve_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 18, bottom: 40, left: 40 },
        xDomain: [0, 4.4], yDomain: [0, 4.4], xTicks: 1, yTicks: 1, grid: false,
        xFmt: () => "", yFmt: () => "", xLabel: "Component 1", yLabel: "Component 2",
      });
      cells.forEach((c) => CK.dot(ctx, c[0], c[1], { r: 3, fill: "#c3c9d8", opacity: 0.7 }));
      // arrow at grid points: find nearest t on path, use tangent
      for (let gx = 0.6; gx < 4.2; gx += 0.55) for (let gy = 0.6; gy < 4.2; gy += 0.55) {
        let bt = 0, bd = 1e9;
        for (let t = 0; t <= 1; t += 0.04) { const p = path(t); const d = (p[0] - gx) ** 2 + (p[1] - gy) ** 2; if (d < bd) { bd = d; bt = t; } }
        if (bd > 0.5) continue;
        const tg = tang(bt); const len = Math.hypot(tg[0], tg[1]) || 1;
        const ux = tg[0] / len, uy = tg[1] / len, L = 0.32 * state.scale;
        const x0 = ctx.x(gx), y0 = ctx.y(gy), x1 = ctx.x(gx + ux * L), y1 = ctx.y(gy + uy * L);
        add(ctx.svg, "line", { x1: x0, y1: y0, x2: x1, y2: y1, stroke: "#a855f7", "stroke-width": 1.8 });
        const ang = Math.atan2(y1 - y0, x1 - x0);
        add(ctx.svg, "path", { d: `M ${x1} ${y1} L ${(x1 - 6 * Math.cos(ang - 0.4)).toFixed(1)} ${(y1 - 6 * Math.sin(ang - 0.4)).toFixed(1)} M ${x1} ${y1} L ${(x1 - 6 * Math.cos(ang + 0.4)).toFixed(1)} ${(y1 - 6 * Math.sin(ang + 0.4)).toFixed(1)}`, stroke: "#a855f7", "stroke-width": 1.8, fill: "none" });
      }
      setReadout("ve_scl", "×" + state.scale.toFixed(1));
    }
    bindSlider("ve_s", (v) => "×" + v.toFixed(1), (v) => { state.scale = v; draw(); });
    draw();
  };

  // 31. TCR/BCR repertoire (clonality) -------------------------------------
  W.repertoire = function (container) {
    const M = 60, rng = CK.makeRng(3131);
    const jitter = []; for (let i = 0; i < M; i++) jitter.push(0.6 + rng() * 0.8);
    const state = { clon: 1.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("rp_c", "クローン増殖度", 0.2, 3, 0.1, state.clon, (v) => v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="rp_plot"></div></div>
      ${readoutRow([
        { id: "rp_top", label: "上位クローン占有率", value: "—" },
        { id: "rp_eff", label: "有効クローン数", value: "—" },
        { id: "rp_type", label: "レパトア", value: "—" },
      ])}
      <p class="widget-note">左端が最大のクローン。増殖度を上げると<b>少数のクローンが優占（oligoclonal）</b>、下げると<b>多数が均等（polyclonal）</b>に。上位クローン占有率は免疫応答の集中度の指標です。</p>`;
    function sizes() {
      const raw = []; for (let i = 0; i < M; i++) raw.push(Math.pow(i + 1, -state.clon) * jitter[i]);
      const sum = raw.reduce((a, b) => a + b, 0);
      return raw.map((v) => v / sum).sort((a, b) => b - a);
    }
    function draw() {
      const f = sizes();
      const W2 = 560, H2 = 280, mL = 40, mR = 14, top = 16, base = 240, nShow = 30;
      const s = stage(document.getElementById("rp_plot"), W2, H2);
      const bw = (W2 - mL - mR) / nShow;
      const maxf = f[0];
      for (let i = 0; i < nShow; i++) {
        const h = (f[i] / maxf) * (base - top);
        const hue = 260 - i * 6;
        add(s, "rect", { x: mL + i * bw, y: base - h, width: bw - 1.5, height: h, fill: i < 3 ? "#a855f7" : "#8aa0d8", opacity: i < 3 ? 0.95 : 0.6, rx: 1.5 });
      }
      add(s, "line", { x1: mL, x2: W2 - mR, y1: base, y2: base, stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: 8, y: top + 6, "font-size": 10, fill: "#8a93a8", text: "頻度" });
      add(s, "text", { x: (mL + W2 - mR) / 2, y: H2 - 4, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "クローン（頻度順・上位30）→" });
      const top5 = (f[0] + f[1] + f[2] + f[3] + f[4]) * 100;
      const eff = 1 / f.reduce((a, b) => a + b * b, 0);
      setReadout("rp_top", top5.toFixed(0) + "%");
      setReadout("rp_eff", eff.toFixed(1));
      setReadout("rp_type", state.clon > 1.6 ? "寡クローン(oligoclonal)" : state.clon < 0.8 ? "多様(polyclonal)" : "中間");
    }
    bindSlider("rp_c", (v) => v.toFixed(1), (v) => { state.clon = v; draw(); });
    draw();
  };

  // 32. Ribo-seq (footprint coverage, 3-nt periodicity) --------------------
  W.riboseq = function (container) {
    const N = 180, cdsL = Math.round(N * 0.15), cdsR = Math.round(N * 0.85);
    const rng = CK.makeRng(3232);
    const state = { frame: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("rb_f", "リーディングフレーム", [{ v: "0", label: "フレーム0" }, { v: "1", label: "1" }, { v: "2", label: "2" }], String(state.frame))}
      </div>
      <div class="widget-stage"><div id="rb_plot"></div></div>
      ${readoutRow([
        { id: "rb_cds", label: "CDSにマップ", value: "約 95%" },
        { id: "rb_per", label: "3塩基周期性", value: "明瞭 ✓" },
      ])}
      <p class="widget-note">CDS上に<b>3塩基周期の縞模様</b>（リボソームが1コドンずつ進む証拠）と、開始コドン AUG 付近の大きなピーク。5'UTR・3'UTRにはほとんど乗りません。</p>`;
    function draw() {
      const W2 = 560, H2 = 280, mL = 30, mR = 14, top = 24, base = 220;
      const s = stage(document.getElementById("rb_plot"), W2, H2);
      const bw = (W2 - mL - mR) / N;
      let maxv = 1;
      const vals = [];
      for (let i = 0; i < N; i++) {
        let v = 0.04 + 0.03 * rng();
        if (i >= cdsL && i <= cdsR) {
          const onFrame = ((i - cdsL) % 3) === state.frame;
          v = 0.12 + (onFrame ? 0.5 + 0.3 * rng() : 0.05 + 0.05 * rng());
          v += 0.9 * Math.exp(-(((i - cdsL) / 3) ** 2));   // start peak
          v += 0.6 * Math.exp(-(((i - cdsR) / 3) ** 2));   // stop peak
        }
        vals.push(v); if (v > maxv) maxv = v;
      }
      // region shading
      add(s, "rect", { x: mL + cdsL * bw, y: top - 6, width: (cdsR - cdsL) * bw, height: base - top + 6, fill: "rgba(15,158,115,0.06)" });
      vals.forEach((v, i) => {
        const h = (v / maxv) * (base - top);
        const inCds = i >= cdsL && i <= cdsR;
        add(s, "rect", { x: mL + i * bw, y: base - h, width: Math.max(0.8, bw - 0.4), height: h, fill: inCds ? "#0f9e73" : "#c3c9d8" });
      });
      add(s, "line", { x1: mL, x2: W2 - mR, y1: base, y2: base, stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: mL + cdsL * bw / 2, y: base + 16, "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: "5'UTR" });
      add(s, "text", { x: mL + (cdsL + cdsR) / 2 * bw, y: base + 16, "text-anchor": "middle", "font-size": 10.5, fill: "#0f9e73", "font-weight": 700, text: "CDS" });
      add(s, "text", { x: mL + (cdsR + N) / 2 * bw, y: base + 16, "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: "3'UTR" });
      add(s, "text", { x: mL + cdsL * bw, y: top - 8, "text-anchor": "middle", "font-size": 10, fill: "#e5484d", "font-weight": 700, text: "AUG" });
      const onF = state.frame === 0;
      setReadout("rb_per", onF ? "明瞭 ✓" : "フレームずれ");
      setReadout("rb_cds", "約 95%");
    }
    bindSeg("rb_f", (v) => { state.frame = +v; draw(); });
    draw();
  };

  // 33. Spatial transcriptomics — Visium (spot grid) -----------------------
  W.visium = function (container) {
    const cols = 22, rows = 16, rng = CK.makeRng(3333);
    const inTissue = (cx, cy) => { const dx = (cx - 0.5) / 0.46, dy = (cy - 0.5) / 0.42; return dx * dx + dy * dy < 1 + 0.15 * Math.sin(cx * 9); };
    const spots = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) / cols, cy = (r + 0.5) / rows;
      if (!inTissue(cx, cy)) continue;
      const clu = cy < 0.34 ? 0 : cy < 0.62 ? 1 : 2;
      const expr = Math.max(0, Math.min(1, (0.85 - cy) + CK.randNormal(0, 0.12, rng)));
      spots.push({ c, r, clu, expr });
    }
    const cCol = ["#a855f7", "#0f9e73", "#f59e0b"];
    const state = { mode: "cluster" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("vs_m", "表示", [{ v: "cluster", label: "クラスター" }, { v: "gene", label: "遺伝子発現 Vil1" }], state.mode)}
      </div>
      <div class="widget-stage"><div id="vs_plot"></div></div>
      ${readoutRow([
        { id: "vs_n", label: "スポット数", value: spots.length + " 個" },
        { id: "vs_res", label: "解像度", value: "スポット単位(数十µm)" },
      ])}
      <p class="widget-note">組織像の上に<b>スポット（タイル）単位</b>で発現を重ねます。クラスターが組織構造に対応し、遺伝子発現は領域ごとに空間的な偏りを示します。厳密な1細胞解像度ではありません。</p>`;
    function draw() {
      const W2 = 460, H2 = 320, mL = 20, mT = 12;
      const s = stage(document.getElementById("vs_plot"), W2, H2);
      const cw = (W2 - mL * 2) / cols, ch = (H2 - mT * 2) / rows, rad = Math.min(cw, ch) * 0.42;
      spots.forEach((sp) => {
        const x = mL + (sp.c + 0.5) * cw, y = mT + (sp.r + 0.5) * ch;
        let fill;
        if (state.mode === "cluster") fill = cCol[sp.clu];
        else { const t = sp.expr; fill = `rgb(${Math.round(250 - t * 90)},${Math.round(240 - t * 200)},${Math.round(250 - t * 60)})`; }
        add(s, "circle", { cx: x, cy: y, r: rad, fill, opacity: 0.9 });
      });
      setReadout("vs_res", state.mode === "cluster" ? "スポット単位(数十µm)" : "発現の空間勾配");
    }
    bindSeg("vs_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 34. Spatial transcriptomics — Xenium (molecules + segmentation) --------
  W.xenium = function (container) {
    const rng = CK.makeRng(3434);
    const genes = ["#e5484d", "#5b8bff", "#0f9e73", "#f59e0b"];
    const gname = ["EPCAM", "PTPRC", "VWF", "ACTA2"];
    const cells = [];
    for (let gy = 0; gy < 6; gy++) for (let gx = 0; gx < 8; gx++) {
      cells.push({ x: (gx + 0.5) / 8 + CK.randNormal(0, 0.02, rng), y: (gy + 0.5) / 6 + CK.randNormal(0, 0.02, rng), r: 0.045 + rng() * 0.012, dom: (gy < 3 ? (gx < 4 ? 0 : 1) : (gx < 4 ? 2 : 3)) });
    }
    const state = {};
    container.innerHTML = `
      <div class="widget-stage"><div id="xe_plot"></div>
        <div class="legend-row">${gname.map((n, i) => `<span class="li"><span class="sw" style="background:${genes[i]}"></span>${n}</span>`).join("")}</div></div>
      ${readoutRow([
        { id: "xe_c", label: "細胞（セグメンテーション）", value: cells.length + " 個" },
        { id: "xe_res", label: "解像度", value: "1分子・1細胞" },
      ])}
      <p class="widget-note">白い輪郭が<b>細胞セグメンテーション</b>、色つきドットが<b>個々のRNA分子</b>（色＝遺伝子）。Visiumのスポットより細かい1分子・1細胞解像度ですが、測れる遺伝子はプローブパネルに限られます。</p>`;
    function draw() {
      const SZ = 430, H2 = 320, mL = 14, mT = 10;
      const s = stage(document.getElementById("xe_plot"), SZ, H2);
      const px = (x) => mL + x * (SZ - mL * 2), py = (y) => mT + y * (H2 - mT * 2);
      const rr = CK.makeRng(9999);
      cells.forEach((c) => {
        add(s, "circle", { cx: px(c.x), cy: py(c.y), r: c.r * (SZ - mL * 2), fill: "rgba(120,140,200,0.05)", stroke: "#b9c1d6", "stroke-width": 1 });
        const nd = 8 + Math.floor(rr() * 6);
        for (let k = 0; k < nd; k++) {
          const a = rr() * 2 * Math.PI, rad = rr() * c.r * 0.85;
          const gi = rr() < 0.7 ? c.dom : Math.floor(rr() * 4);
          add(s, "circle", { cx: px(c.x + Math.cos(a) * rad), cy: py(c.y + Math.sin(a) * rad * 1.25), r: 1.7, fill: genes[gi], opacity: 0.9 });
        }
      });
    }
    draw();
  };

  // 35. Spatial epigenomics (gene score map) -------------------------------
  W.spatialepi = function (container) {
    const cols = 22, rows = 16, rng = CK.makeRng(3535);
    const inTissue = (cx, cy) => { const dx = (cx - 0.5) / 0.46, dy = (cy - 0.5) / 0.42; return dx * dx + dy * dy < 1 + 0.12 * Math.sin(cy * 8); };
    const spots = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) / cols, cy = (r + 0.5) / rows;
      if (!inTissue(cx, cy)) continue;
      spots.push({ c, r, cx, cy, n: CK.randNormal(0, 0.1, rng) });
    }
    const markers = {
      PAX6: (cx, cy) => 1 - Math.abs(cy - 0.3) * 2.4,
      GABRB2: (cx, cy) => 1 - Math.abs(cx - 0.65) * 2.2,
      GABRA6: (cx, cy) => 1 - Math.hypot(cx - 0.4, cy - 0.7) * 2.6,
    };
    const state = { m: "PAX6" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("se_m", "マーカー遺伝子", Object.keys(markers).map((k) => ({ v: k, label: k })), state.m)}
      </div>
      <div class="widget-stage"><div id="se_plot"></div></div>
      ${readoutRow([
        { id: "se_g", label: "指標", value: "gene score（クロマチン開き具合）" },
        { id: "se_m2", label: "マーカー", value: "—" },
      ])}
      <p class="widget-note">色は<b>gene score＝クロマチンの開き具合（ATAC由来の指標）</b>で、発現量そのものではありません。マーカーごとに、組織上で開いている領域が異なります。</p>`;
    function draw() {
      const W2 = 460, H2 = 320, mL = 20, mT = 12;
      const s = stage(document.getElementById("se_plot"), W2, H2);
      const cw = (W2 - mL * 2) / cols, ch = (H2 - mT * 2) / rows, rad = Math.min(cw, ch) * 0.42;
      const fn = markers[state.m];
      spots.forEach((sp) => {
        const x = mL + (sp.c + 0.5) * cw, y = mT + (sp.r + 0.5) * ch;
        const t = Math.max(0, Math.min(1, fn(sp.cx, sp.cy) + sp.n));
        const fill = `rgb(${Math.round(255 - t * 90)},${Math.round(250 - t * 210)},${Math.round(255 - t * 40)})`;
        add(s, "circle", { cx: x, cy: y, r: rad, fill, opacity: 0.92 });
      });
      setReadout("se_m2", state.m);
    }
    bindSeg("se_m", (v) => { state.m = v; draw(); });
    draw();
  };

  // 1. Microarray (two-colour heatmap) -------------------------------------
  W.microarray = function (container) {
    const G = 26, S = 8, rng = CK.makeRng(101);
    const rows = [];
    for (let g = 0; g < G; g++) {
      const patt = g % 3; // three latent patterns
      rows.push(Array.from({ length: S }, (_, s) => {
        const base = patt === 0 ? (s < 4 ? 1 : -1) : patt === 1 ? Math.sin(s) : (s % 2 ? 1 : -1);
        return Math.max(-1, Math.min(1, base * 0.8 + CK.randNormal(0, 0.28, rng)));
      }));
    }
    const state = { sort: false };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ma_s", "並び順", [{ v: "raw", label: "元の順" }, { v: "sort", label: "クラスタリングで並べ替え" }], "raw")}
      </div>
      <div class="widget-stage"><div id="ma_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#e5484d"></span>高発現</span><span class="li"><span class="sw" style="background:#111"></span>同程度</span><span class="li"><span class="sw" style="background:#22c55e"></span>低発現</span></div></div>
      ${readoutRow([{ id: "ma_g", label: "遺伝子 × サンプル", value: G + " × " + S }, { id: "ma_v", label: "値", value: "蛍光強度比(A.U.)" }])}
      <p class="widget-note">古典的な2色マイクロアレイのヒートマップ。<b>赤=高発現・緑=低発現</b>。クラスタリングで並べ替えると、似た発現パターンが“ブロック”として浮かびます（クラスタリング 8章-9）。</p>`;
    function draw() {
      const order = state.sort ? rows.map((r, i) => i).sort((a, b) => rows[a][0] - rows[b][0] || rows[a][3] - rows[b][3]) : rows.map((_, i) => i);
      const W2 = 460, H2 = 300, mL = 20, mT = 14, cw = (W2 - mL - 30) / S, chh = (H2 - mT - 20) / G;
      const s = stage(document.getElementById("ma_plot"), W2, H2);
      order.forEach((gi, r) => {
        for (let c = 0; c < S; c++) {
          const v = rows[gi][c];
          const col = v >= 0 ? `rgb(${Math.round(20 + v * 210)},${Math.round(20)},${Math.round(30)})` : `rgb(20,${Math.round(20 - v * 200)},40)`;
          add(s, "rect", { x: mL + c * cw, y: mT + r * chh, width: cw + 0.5, height: chh + 0.5, fill: col });
        }
      });
      for (let c = 0; c < S; c++) add(s, "text", { x: mL + (c + 0.5) * cw, y: H2 - 6, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "S" + (c + 1) });
      add(s, "text", { x: mL - 4, y: mT + G * chh / 2, "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", transform: `rotate(-90 ${mL - 4} ${mT + G * chh / 2})`, text: "遺伝子" });
    }
    bindSeg("ma_s", (v) => { state.sort = v === "sort"; draw(); });
    draw();
  };

  // 2. Illumina short read (Q-score profile) -------------------------------
  W.illumina = function (container) {
    const N = 150, rng = CK.makeRng(102);
    const noise = Array.from({ length: N }, () => rng());
    const state = { q: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("il_q", "ライブラリ品質", 0.5, 1.3, 0.05, state.q, (v) => "×" + v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="il_plot"></div></div>
      ${readoutRow([{ id: "il_pct", label: "Q30以上の割合", value: "—" }, { id: "il_acc", label: "平均精度", value: "—" }])}
      <p class="widget-note">横軸＝リード上の位置（150b）、縦軸＝クオリティ Q値。<b>Q30ライン（=99.9%精度）</b>を超えていれば高品質。3'末端に向かって品質が下がるのがショートリードの典型です。</p>`;
    function qAt(i) {
      const decay = Math.max(0, (i - N * 0.6) / (N * 0.4));
      return Math.max(2, Math.min(41, (38 - 16 * decay * decay) * state.q + (noise[i] - 0.5) * 4));
    }
    function draw() {
      const ctx = CK.plot(document.getElementById("il_plot"), {
        width: 560, height: 280, margin: { top: 16, right: 16, bottom: 40, left: 42 },
        xDomain: [0, N], yDomain: [0, 42], xTicks: 5, yTicks: 4, xLabel: "リード上の位置 (bp)", yLabel: "Q値",
      });
      const pts = []; let over = 0;
      for (let i = 0; i < N; i++) { const q = qAt(i); pts.push([i, q]); if (q >= 30) over++; }
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: "#5b8bff", opacity: 0.14 });
      CK.line(ctx, pts, { stroke: "#5b8bff", "stroke-width": 2 });
      CK.hline(ctx, 30, { stroke: "#0f9e73", "stroke-width": 1.4, "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(30) - 4, "Q30 (99.9%)", { fill: "#0f9e73", "font-size": 10, "font-weight": 700 });
      const avgQ = pts.reduce((a, b) => a + b[1], 0) / N;
      setReadout("il_pct", Math.round(over / N * 100) + "%");
      setReadout("il_acc", (100 * (1 - Math.pow(10, -avgQ / 10))).toFixed(2) + "%");
    }
    bindSlider("il_q", (v) => "×" + v.toFixed(2), (v) => { state.q = v; draw(); });
    draw();
  };

  // 3. Nanopore (ionic current squiggle) -----------------------------------
  W.nanopore = function (container) {
    const bases = "ACGTTGCAAGTCCAGTACGT".split("");
    const bcol = { A: "#0f9e73", C: "#5b8bff", G: "#f59e0b", T: "#e5484d" };
    const lvl = { A: 0.75, C: 0.55, G: 0.35, T: 0.18 };
    const state = { speed: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("np_s", "送り込み速度（表示塩基数）", 8, 20, 1, 14)}
      </div>
      <div class="widget-stage"><div id="np_plot"></div></div>
      ${readoutRow([{ id: "np_n", label: "この画面の塩基", value: "—" }, { id: "np_read", label: "リード長の目安", value: "10k〜100k b" }])}
      <p class="widget-note">ポアを塩基が通過するときの<b>電流の変化（squiggle）</b>。各塩基でポアの電流レベルが変わり、この波形を機械学習（ベースコーラー）が塩基配列に変換します。修飾塩基も読めます。</p>`;
    function draw() {
      const n = Math.round(document.getElementById("np_s") ? +document.getElementById("np_s").value : 14);
      const W2 = 560, H2 = 240, mL = 40, mR = 14, top = 20, base = 180, rng = CK.makeRng(3);
      const s = stage(document.getElementById("np_plot"), W2, H2);
      const step = (W2 - mL - mR) / n;
      const yFor = (v) => base - v * (base - top);
      let d = ""; const seq = [];
      for (let i = 0; i < n; i++) {
        const b = bases[i % bases.length]; seq.push(b);
        const y = yFor(lvl[b] + (rng() - 0.5) * 0.04);
        const x0 = mL + i * step, x1 = mL + (i + 1) * step;
        d += (i === 0 ? `M ${x0} ${y}` : ` L ${x0} ${y}`) + ` L ${x1} ${y}`;
        add(s, "text", { x: (x0 + x1) / 2, y: base + 18, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: bcol[b], text: b });
      }
      add(s, "path", { d, fill: "none", stroke: "#a855f7", "stroke-width": 2 });
      add(s, "line", { x1: mL, x2: W2 - mR, y1: base + 4, y2: base + 4, stroke: "#e6e9f2" });
      add(s, "text", { x: 8, y: top + 4, "font-size": 10, fill: "#8a93a8", text: "電流" });
      add(s, "text", { x: mL, y: base + 34, "font-size": 10, fill: "#8a93a8", text: "→ ベースコール" });
      setReadout("np_n", n + " 塩基");
    }
    bindSlider("np_s", (v) => v, () => draw());
    draw();
  };

  // 4. PacBio (CCS consensus accuracy vs pass count) -----------------------
  W.pacbio = function (container) {
    const state = { passes: 3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("pb_p", "周回数（パス数）", 1, 12, 1, state.passes)}
      </div>
      <div class="widget-stage"><div id="pb_plot"></div></div>
      ${readoutRow([{ id: "pb_q", label: "コンセンサス精度 (Q)", value: "—" }, { id: "pb_acc", label: "精度", value: "—" }, { id: "pb_type", label: "リード種別", value: "—" }])}
      <p class="widget-note">円状鋳型を何周も読むCCS。各周（subread）はエラーだらけでも、<b>周回数を増やすほどコンセンサスの精度が上がり</b>、Q20→Q30級のHiFiリードになります。</p>`;
    function draw() {
      const p = state.passes;
      const W2 = 560, H2 = 280, mL = 40, mR = 14, top = 30, base = 210, rng = CK.makeRng(7);
      const s = stage(document.getElementById("pb_plot"), W2, H2);
      const L = 40, cw = (W2 - mL - mR) / L;
      // draw up to 6 subread rows with random errors, then consensus
      const showRows = Math.min(p, 6);
      const trueSeq = Array.from({ length: L }, () => Math.floor(rng() * 4));
      const rowH = 15;
      for (let r = 0; r < showRows; r++) {
        for (let c = 0; c < L; c++) {
          const err = rng() < 0.14;
          add(s, "rect", { x: mL + c * cw, y: top + r * rowH, width: cw - 1, height: rowH - 3, fill: err ? "#e5484d" : "#c7cce0", opacity: 0.8 });
        }
        add(s, "text", { x: mL - 4, y: top + r * rowH + 9, "text-anchor": "end", "font-size": 8.5, fill: "#8a93a8", text: "pass" + (r + 1) });
      }
      // consensus row: error prob drops with passes
      const consY = top + showRows * rowH + 10;
      const perr = Math.pow(0.14, Math.min(p, 12) / 2.2);
      for (let c = 0; c < L; c++) {
        const err = rng() < perr;
        add(s, "rect", { x: mL + c * cw, y: consY, width: cw - 1, height: rowH - 2, fill: err ? "#e5484d" : "#0f9e73" });
      }
      add(s, "text", { x: mL - 4, y: consY + 10, "text-anchor": "end", "font-size": 9, "font-weight": 700, fill: "#0f9e73", text: "CCS" });
      const q = Math.min(41, -10 * Math.log10(Math.max(1e-5, perr)));
      setReadout("pb_q", "Q" + q.toFixed(0));
      setReadout("pb_acc", (100 * (1 - perr)).toFixed(perr < 0.01 ? 2 : 1) + "%");
      setReadout("pb_type", p >= 3 ? "HiFi ✓" : "低精度(CLR相当)");
    }
    bindSlider("pb_p", (v) => v, (v) => { state.passes = v; draw(); });
    draw();
  };

  // 6. Pairwise scatter plot (scatter matrix) ------------------------------
  W.pairscatter = function (container) {
    const vars = ["Area", "Compact", "Energy", "Entropy"];
    const N = 70, rng = CK.makeRng(106);
    const base = Array.from({ length: N }, () => CK.randNormal(0, 1, rng));
    const state = { r: 0.85 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ps_r", "Area–Compact の相関 r", -0.95, 0.95, 0.05, state.r, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="ps_plot"></div></div>
      ${readoutRow([{ id: "ps_rv", label: "設定した相関 r", value: "—" }, { id: "ps_note", label: "対角線への集まり", value: "—" }])}
      <p class="widget-note">4変数を2つずつ総当たりにした散布図マトリクス。点が<b>対角線に近く集まるほど相関が高い</b>（右上がり=正、右下がり=負）。左上パネルの相関をスライダーで変えられます。</p>`;
    function data() {
      // build 4 vars; var2 correlated to var1 by r
      const v0 = base;
      const v1 = base.map((x, i) => state.r * x + Math.sqrt(1 - state.r * state.r) * CK.randNormal(0, 1, rng));
      const v2 = base.map((x) => -0.6 * x + CK.randNormal(0, 0.9, rng));
      const v3 = base.map((x, i) => 0.3 * v2[i] + CK.randNormal(0, 1, rng));
      return [v0, v1, v2, v3];
    }
    function draw() {
      const D = data();
      const SZ = 430, mL = 34, mT = 12, pad = 4;
      const s = stage(document.getElementById("ps_plot"), SZ, SZ);
      const cell = (SZ - mL - 8) / 4;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const x0 = mL + j * cell, y0 = mT + i * cell;
        add(s, "rect", { x: x0, y: y0, width: cell - pad, height: cell - pad, fill: "#fbfcff", stroke: "#e6e9f2" });
        if (i === j) { add(s, "text", { x: x0 + (cell - pad) / 2, y: y0 + (cell - pad) / 2 + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "#4a5268", text: vars[i] }); continue; }
        const xs = D[j], ys = D[i];
        const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
        for (let k = 0; k < N; k++) {
          const px = x0 + 3 + ((xs[k] - xmin) / (xmax - xmin || 1)) * (cell - pad - 6);
          const py = y0 + (cell - pad - 3) - ((ys[k] - ymin) / (ymax - ymin || 1)) * (cell - pad - 6);
          add(s, "circle", { cx: px, cy: py, r: 1.6, fill: "#5b8bff", opacity: 0.6 });
        }
      }
      setReadout("ps_rv", state.r.toFixed(2));
      setReadout("ps_note", Math.abs(state.r) >= 0.7 ? "強く集まる(相関 高)" : Math.abs(state.r) <= 0.2 ? "ばらばら(相関 低)" : "中程度");
    }
    bindSlider("ps_r", (v) => v.toFixed(2), (v) => { state.r = v; draw(); });
    draw();
  };

  // 12. Metagene plot (mean coverage + CI ribbon) --------------------------
  W.metagene = function (container) {
    const N = 100, rng = CK.makeRng(112);
    const state = { peak: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mg_p", "結合の集中度（ピーク強度）", 0.3, 2, 0.1, state.peak, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="mg_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#a855f7"></span>転写因子X 結合領域</span><span class="li"><span class="sw" style="background:#9aa2b6"></span>全遺伝子</span></div></div>
      ${readoutRow([{ id: "mg_pk", label: "ピーク位置", value: "中央(TSS付近)" }, { id: "mg_max", label: "ピーク平均カバレッジ", value: "—" }])}
      <p class="widget-note">横軸＝領域を100 binに区切った相対位置、縦軸＝平均カバレッジ(RPM)。<b>帯（リボン）＝95%信頼区間</b>。中央の盛り上がりは、その位置にリードが集中していたことを示します。</p>`;
    function curve(amp, seed) {
      const r = CK.makeRng(seed); const pts = [], lo = [], hi = [];
      for (let i = 0; i <= N; i++) {
        const base = 120 + amp * 520 * Math.exp(-(((i - 50) / 16) ** 2)) + (r() - 0.5) * 40;
        const ci = 34 + amp * 60 * Math.exp(-(((i - 50) / 20) ** 2));
        pts.push([i, base]); lo.push([i, Math.max(0, base - ci)]); hi.push([i, base + ci]);
      }
      return { pts, lo, hi };
    }
    function draw() {
      const ctx = CK.plot(document.getElementById("mg_plot"), {
        width: 560, height: 300, margin: { top: 16, right: 16, bottom: 42, left: 50 },
        xDomain: [0, N], yDomain: [0, 800], xTicks: 4, yTicks: 4, xLabel: "領域内の相対位置 (bins)", yLabel: "平均カバレッジ (RPM)",
      });
      const a = curve(state.peak, 5), b = curve(state.peak * 0.45 + 0.15, 9);
      CK.area(ctx, b.hi, b.lo, { fill: "#9aa2b6", opacity: 0.2 });
      CK.line(ctx, b.pts, { stroke: "#9aa2b6", "stroke-width": 2 });
      CK.area(ctx, a.hi, a.lo, { fill: "#a855f7", opacity: 0.2 });
      CK.line(ctx, a.pts, { stroke: "#a855f7", "stroke-width": 2.4 });
      CK.vline(ctx, 50, { stroke: "#c7cce0" });
      setReadout("mg_max", Math.round(120 + state.peak * 520) + " RPM");
    }
    bindSlider("mg_p", (v) => "×" + v.toFixed(1), (v) => { state.peak = v; draw(); });
    draw();
  };

  // 13. Sequence motif logo -------------------------------------------------
  W.motif = function (container) {
    const consensus = "TTTAGCCG".split("");
    const bcol = { A: "#0f9e73", C: "#5b8bff", G: "#f59e0b", T: "#e5484d" };
    const alph = ["A", "C", "G", "T"];
    const state = { cons: 0.85 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mo_c", "保存度（情報量）", 0.35, 0.98, 0.03, state.cons, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="mo_plot"></div></div>
      ${readoutRow([{ id: "mo_seq", label: "コンセンサス配列", value: consensus.join("") }, { id: "mo_bits", label: "最大情報量", value: "—" }])}
      <p class="widget-note">シークエンスロゴ。各位置で<b>文字の高さ＝その塩基の保存度（情報量, bits）</b>。文字が大きい位置ほど強く保存された、転写因子の認識配列などです。</p>`;
    function draw() {
      const W2 = 560, H2 = 260, mL = 34, mR = 14, top = 16, base = 210;
      const s = stage(document.getElementById("mo_plot"), W2, H2);
      const n = consensus.length, cw = (W2 - mL - mR) / n, maxBits = 2;
      const p = state.cons, other = (1 - p) / 3;
      for (let i = 0; i < n; i++) {
        const freqs = alph.map((b) => (b === consensus[i] ? p : other));
        const H = -freqs.reduce((a, f) => a + (f > 0 ? f * Math.log2(f) : 0), 0);
        const R = maxBits - H; // information content
        const order = alph.map((b, k) => ({ b, f: freqs[k] })).sort((a, b) => a.f - b.f);
        let yb = base;
        order.forEach((o) => {
          const h = o.f * R / maxBits * (base - top);
          if (h < 1) return;
          const x = mL + i * cw;
          const t = add(s, "text", { x: 0, y: 0, "font-size": 20, "font-weight": 800, fill: bcol[o.b], text: o.b, "font-family": "var(--font-mono)" });
          t.setAttribute("transform", `translate(${x + cw / 2},${yb}) scale(${cw / 13},${h / 15}) `);
          t.setAttribute("text-anchor", "middle");
          yb -= h;
        });
        add(s, "text", { x: mL + i * cw + cw / 2, y: base + 16, "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: i + 1 });
      }
      add(s, "line", { x1: mL, x2: W2 - mR, y1: base, y2: base, stroke: "#c7cce0" });
      add(s, "text", { x: 10, y: top + 40, "font-size": 10, fill: "#8a93a8", transform: `rotate(-90 10 ${top + 40})`, text: "bits" });
      const pmax = state.cons; const Hmax = -((pmax) * Math.log2(pmax) + 3 * ((1 - pmax) / 3) * Math.log2((1 - pmax) / 3));
      setReadout("mo_bits", (2 - Hmax).toFixed(2) + " bits");
    }
    bindSlider("mo_c", (v) => v.toFixed(2), (v) => { state.cons = v; draw(); });
    draw();
  };

  // 14. STRING PPI network --------------------------------------------------
  W.string = function (container) {
    const rng = CK.makeRng(114);
    const clusters = [[0.28, 0.35], [0.7, 0.3], [0.5, 0.72]];
    const nodes = [];
    for (let c = 0; c < 3; c++) for (let k = 0; k < 6; k++) nodes.push({ x: clusters[c][0] + CK.randNormal(0, 0.08, rng), y: clusters[c][1] + CK.randNormal(0, 0.08, rng), c });
    const N = nodes.length, edges = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const same = nodes[i].c === nodes[j].c;
      const conf = same ? 0.4 + rng() * 0.6 : (rng() < 0.12 ? 0.2 + rng() * 0.4 : 0);
      if (conf > 0) edges.push({ i, j, conf, ev: Math.floor(rng() * 4) });
    }
    const evCol = ["#0f9e73", "#5b8bff", "#f59e0b", "#a855f7"];
    const state = { thr: 0.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("st_t", "信頼度スコアの閾値", 0.2, 0.9, 0.05, state.thr, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="st_plot"></div></div>
      ${readoutRow([{ id: "st_e", label: "表示エッジ数", value: "—" }, { id: "st_hub", label: "最大ハブの次数", value: "—" }])}
      <p class="widget-note">ノード＝タンパク質、エッジ＝相互作用（色＝エビデンス種）。閾値を上げると弱いエッジが消え疎に。多くつながる<b>ハブ</b>（大きい）が重要な可能性。<b>ノード間の距離に意味はありません</b>。</p>`;
    function draw() {
      const SZ = 440, H2 = 320, mL = 16, mT = 12, rng2 = CK.makeRng(1);
      const s = stage(document.getElementById("st_plot"), SZ, H2);
      const px = (x) => mL + x * (SZ - mL * 2), py = (y) => mT + y * (H2 - mT * 2);
      const shown = edges.filter((e) => e.conf >= state.thr);
      const deg = new Array(N).fill(0);
      shown.forEach((e) => { deg[e.i]++; deg[e.j]++; add(s, "line", { x1: px(nodes[e.i].x), y1: py(nodes[e.i].y), x2: px(nodes[e.j].x), y2: py(nodes[e.j].y), stroke: evCol[e.ev], "stroke-width": 0.6 + e.conf * 1.6, opacity: 0.5 }); });
      const maxDeg = Math.max(1, ...deg);
      nodes.forEach((nd, i) => {
        const r = 5 + deg[i] / maxDeg * 9;
        add(s, "circle", { cx: px(nd.x), cy: py(nd.y), r, fill: ["#5b8bff", "#0f9e73", "#a855f7"][nd.c], opacity: 0.9, stroke: "#fff", "stroke-width": 1 });
      });
      setReadout("st_e", shown.length + " 本");
      setReadout("st_hub", maxDeg + " 次数");
    }
    bindSlider("st_t", (v) => v.toFixed(2), (v) => { state.thr = v; draw(); });
    draw();
  };

  // 15. KEGG pathway map ----------------------------------------------------
  W.kegg = function (container) {
    // simple linear pathway with a branch: metabolites (circles) + enzymes (boxes)
    const steps = ["Glucose", "G6P", "F6P", "F1,6BP", "G3P", "Pyruvate", "Acetyl-CoA", "Citrate"];
    const enz = ["2.7.1.1", "5.3.1.9", "2.7.1.11", "4.1.2.13", "1.2.1.12", "1.2.4.1", "2.3.3.1"];
    const state = { hits: 4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("kg_h", "解析でヒットした酵素の数", 0, 7, 1, state.hits)}
      </div>
      <div class="widget-stage"><div id="kg_plot"></div></div>
      ${readoutRow([{ id: "kg_n", label: "該当（緑）の酵素", value: "—" }, { id: "kg_id", label: "パスウェイID", value: "hsa00010(解糖系)" }])}
      <p class="widget-note">代謝経路の地図。○＝代謝物、□＝酵素、矢印＝反応の向き。解析で見つかった遺伝子（酵素）に該当する箱が<b>緑に色付け</b>され、どの経路が動いているかを俯瞰します（過剰発現解析）。</p>`;
    function draw() {
      const W2 = 560, H2 = 300, s = stage(document.getElementById("kg_plot"), W2, H2);
      const cols = [70, 210, 350, 490], rowsY = [50, 120, 190, 260];
      // zig-zag layout positions for 8 metabolites
      const pos = [[70, 60], [230, 60], [390, 60], [490, 130], [390, 200], [230, 200], [70, 200], [230, 270]];
      function metab(x, y, label) {
        add(s, "circle", { cx: x, cy: y, r: 6, fill: "#fff", stroke: "#7a84a0", "stroke-width": 1.5 });
        add(s, "text", { x: x, y: y - 11, "text-anchor": "middle", "font-size": 9.5, fill: "#4a5268", text: label });
      }
      for (let i = 0; i < steps.length - 1; i++) {
        const a = pos[i], b = pos[i + 1];
        add(s, "line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#b9c1d6", "stroke-width": 1.4, "marker-end": "" });
        // arrowhead
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        add(s, "path", { d: `M ${mx} ${my} L ${mx - 7 * Math.cos(ang - 0.4)} ${my - 7 * Math.sin(ang - 0.4)} M ${mx} ${my} L ${mx - 7 * Math.cos(ang + 0.4)} ${my - 7 * Math.sin(ang + 0.4)}`, stroke: "#8a93a8", "stroke-width": 1.2, fill: "none" });
        // enzyme box at midpoint
        const on = i < state.hits;
        add(s, "rect", { x: mx - 22, y: my - 8, width: 44, height: 16, rx: 2, fill: on ? "#8fdcb8" : "#eef0f5", stroke: on ? "#0f9e73" : "#c7cce0", "stroke-width": 1 });
        add(s, "text", { x: mx, y: my + 4, "text-anchor": "middle", "font-size": 8.5, fill: on ? "#0b5c3f" : "#8a93a8", text: enz[i] });
      }
      pos.forEach((p, i) => metab(p[0], p[1], steps[i]));
      setReadout("kg_n", state.hits + " / 7");
    }
    bindSlider("kg_h", (v) => v, (v) => { state.hits = v; draw(); });
    draw();
  };

  // 16. Network analysis (co-expression + degree distribution) -------------
  W.network = function (container) {
    const rng = CK.makeRng(116), N = 24;
    const nodes = Array.from({ length: N }, (_, i) => ({ x: 0.15 + rng() * 0.7, y: 0.12 + rng() * 0.76, m: i % 3 }));
    const pairs = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const w = (nodes[i].m === nodes[j].m ? 0.5 : 0.15) + rng() * 0.5; pairs.push({ i, j, w }); }
    const state = { thr: 0.7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("nw_t", "共発現の相関 閾値", 0.4, 0.95, 0.05, state.thr, (v) => v.toFixed(2))}
      </div>
      <div class="widget-stage"><div style="display:flex;gap:12px;flex-wrap:wrap"><div id="nw_net" style="flex:1;min-width:240px"></div><div id="nw_hist" style="flex:1;min-width:200px"></div></div></div>
      ${readoutRow([{ id: "nw_e", label: "エッジ数", value: "—" }, { id: "nw_hub", label: "最大ハブの次数", value: "—" }])}
      <p class="widget-note">左＝共発現ネットワーク（点の大きさ＝次数＝つながりの多さ＝<b>ハブ</b>）、右＝次数分布。閾値を上げるとエッジが減り、ハブが際立ちます。ノード/エッジの意味は目的で変わります。</p>`;
    function draw() {
      const shown = pairs.filter((p) => p.w >= state.thr);
      const deg = new Array(N).fill(0); shown.forEach((p) => { deg[p.i]++; deg[p.j]++; });
      const maxDeg = Math.max(1, ...deg);
      const SZ = 260, s = stage(document.getElementById("nw_net"), SZ, 260);
      const px = (x) => 12 + x * (SZ - 24), py = (y) => 12 + y * (260 - 24);
      shown.forEach((p) => add(s, "line", { x1: px(nodes[p.i].x), y1: py(nodes[p.i].y), x2: px(nodes[p.j].x), y2: py(nodes[p.j].y), stroke: "#c7cce0", "stroke-width": 0.8 }));
      nodes.forEach((nd, i) => add(s, "circle", { cx: px(nd.x), cy: py(nd.y), r: 3 + deg[i] / maxDeg * 9, fill: ["#5b8bff", "#a855f7", "#0f9e73"][nd.m], opacity: 0.9, stroke: "#fff", "stroke-width": 0.8 }));
      // degree histogram
      const h = stage(document.getElementById("nw_hist"), 240, 260), hist = new Array(maxDeg + 1).fill(0);
      deg.forEach((d) => hist[d]++);
      const mH = Math.max(1, ...hist), bw = (240 - 40) / (maxDeg + 1);
      hist.forEach((cnt, d) => { const bh = cnt / mH * 190; add(h, "rect", { x: 32 + d * bw, y: 210 - bh, width: bw - 2, height: bh, fill: "#a855f7", opacity: 0.75 }); add(h, "text", { x: 32 + d * bw + bw / 2, y: 224, "text-anchor": "middle", "font-size": 8, fill: "#8a93a8", text: d }); });
      add(h, "text", { x: 130, y: 244, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: "次数分布" });
      setReadout("nw_e", shown.length + " 本"); setReadout("nw_hub", maxDeg + " 次数");
    }
    bindSlider("nw_t", (v) => v.toFixed(2), (v) => { state.thr = v; draw(); });
    draw();
  };

  // 17. iModulon (ICA gene weights) ----------------------------------------
  W.imodulon = function (container) {
    const mods = {
      "Fur (鉄)": { seed: 11, n: 14 }, "Fnr (酸素)": { seed: 22, n: 10 }, "Crp (代謝)": { seed: 33, n: 20 }, "翻訳": { seed: 44, n: 8 },
    };
    const NG = 220;
    const state = { m: "Fur (鉄)" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("im_m", "iModulon を選択", Object.keys(mods).map((k) => ({ v: k, label: k })), state.m)}
      </div>
      <div class="widget-stage"><div id="im_plot"></div></div>
      ${readoutRow([{ id: "im_n", label: "メンバー遺伝子", value: "—" }, { id: "im_var", label: "説明分散", value: "—" }])}
      <p class="widget-note">横軸＝遺伝子、縦軸＝そのiModulonへの寄与度(gene weight)。<b>ほとんどの遺伝子は0付近で、少数だけ大きな重み</b>＝そのモジュールのメンバー（共に制御される遺伝子群）です。</p>`;
    function draw() {
      const cfg = mods[state.m], rng = CK.makeRng(cfg.seed);
      const ctx = CK.plot(document.getElementById("im_plot"), {
        width: 560, height: 280, margin: { top: 16, right: 16, bottom: 40, left: 48 },
        xDomain: [0, NG], yDomain: [-0.35, 0.5], xTicks: 4, yTicks: 4, xFmt: (v) => Math.round(v), xLabel: "遺伝子（ゲノム順）", yLabel: "gene weight",
      });
      CK.hline(ctx, 0, { stroke: "#c7cce0" });
      CK.hline(ctx, 0.18, { stroke: "#e5484d", "stroke-dasharray": "4 3", "stroke-width": 1 });
      let members = 0;
      const memberIdx = new Set(); for (let k = 0; k < cfg.n; k++) memberIdx.add(Math.floor(rng() * NG));
      for (let i = 0; i < NG; i++) {
        let w = CK.randNormal(0, 0.03, rng);
        if (memberIdx.has(i)) { w = 0.2 + rng() * 0.28; members++; }
        CK.dot(ctx, i, w, { r: memberIdx.has(i) ? 3.5 : 2, fill: memberIdx.has(i) ? "#a855f7" : "#c3c9d8", opacity: memberIdx.has(i) ? 1 : 0.6 });
      }
      setReadout("im_n", members + " 個");
      setReadout("im_var", (3 + (cfg.n / 5)).toFixed(1) + " %");
    }
    bindSeg("im_m", (v) => { state.m = v; draw(); });
    draw();
  };

  // 18. Riverplot / Sankey --------------------------------------------------
  W.riverplot = function (container) {
    const cols = [
      [{ n: "スニチニブ", v: 46 }, { n: "テムシロリムス", v: 22 }, { n: "パゾパニブ", v: 20 }, { n: "その他", v: 12 }],
      [{ n: "エベロリムス", v: 33 }, { n: "アキシチニブ", v: 30 }, { n: "ソラフェニブ", v: 22 }, { n: "中止", v: 15 }],
      [{ n: "ソラフェニブ", v: 34 }, { n: "エベロリムス", v: 30 }, { n: "その他", v: 36 }],
    ];
    const colColor = ["#5b8bff", "#a855f7", "#0f9e73"];
    container.innerHTML = `
      <div class="widget-stage"><div id="rv_plot"></div></div>
      ${readoutRow([{ id: "rv_a", label: "1次治療の最多", value: "スニチニブ 46%" }, { id: "rv_b", label: "図の見方", value: "帯の太さ=患者の割合" }])}
      <p class="widget-note">転移性腎細胞がんの治療シークエンス。列＝治療ライン（1次→2次→3次）、<b>帯の太さ＝その経路を選んだ患者の割合</b>。太い帯を追うと主要な治療遷移が読めます。</p>`;
    function draw() {
      const W2 = 560, H2 = 320, mT = 20, gap = 6, colX = [40, 280, 520], nodeW = 16;
      const s = stage(document.getElementById("rv_plot"), W2, H2);
      const rng = CK.makeRng(18);
      const layout = cols.map((col) => {
        const total = col.reduce((a, b) => a + b.v, 0); let y = mT; const H = H2 - mT * 2 - gap * (col.length - 1);
        return col.map((nd) => { const h = nd.v / total * H; const o = { ...nd, y, h }; y += h + gap; return o; });
      });
      // ribbons between col0->1 and col1->2 (random-ish proportional splits)
      function ribbons(a, b, x0, x1) {
        a.forEach((src) => {
          let sy = src.y;
          b.forEach((dst, di) => {
            const frac = (0.5 * rng() + 0.15);
            const h = src.h * frac / b.length * 2.0;
            if (h < 1.5) return;
            let dy = dst.y + (di * 0); // stack roughly
            const path = `M ${x0} ${sy} C ${(x0 + x1) / 2} ${sy}, ${(x0 + x1) / 2} ${dst.y}, ${x1} ${dst.y} L ${x1} ${dst.y + h} C ${(x0 + x1) / 2} ${dst.y + h}, ${(x0 + x1) / 2} ${sy + h}, ${x0} ${sy + h} Z`;
            add(s, "path", { d: path, fill: "#5b8bff", opacity: 0.14 });
            sy += h;
          });
        });
      }
      ribbons(layout[0], layout[1], colX[0] + nodeW, colX[1]);
      ribbons(layout[1], layout[2], colX[1] + nodeW, colX[2]);
      const labels = ["初回(1次)", "2次治療", "3次治療"];
      layout.forEach((col, ci) => {
        add(s, "text", { x: colX[ci] + nodeW / 2, y: 12, "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: "#4a5268", text: labels[ci] });
        col.forEach((nd) => {
          add(s, "rect", { x: colX[ci], y: nd.y, width: nodeW, height: Math.max(2, nd.h), fill: colColor[ci], rx: 2 });
          add(s, "text", { x: ci === 2 ? colX[ci] - 4 : colX[ci] + nodeW + 4, y: nd.y + nd.h / 2 + 3, "text-anchor": ci === 2 ? "end" : "start", "font-size": 9, fill: "#4a5268", text: nd.n + " " + nd.v + "%" });
        });
      });
    }
    draw();
  };

  // 19. Clustered dotplot (cell types × genes) -----------------------------
  W.dotplot = function (container) {
    const cells = ["Oligodendrocyte", "Excitatory", "Inhibitory", "Astrocyte", "Microglia", "OPC", "Endothelial"];
    const genes = ["Mog", "Slc17a7", "Gad1", "Aqp4", "Cx3cr1", "Pdgfra", "Cldn5", "Plp1", "Snap25"];
    const rng = CK.makeRng(119);
    // each cell type strongly expresses a couple of markers
    const marker = { 0: [0, 7], 1: [1, 8], 2: [2, 8], 3: [3], 4: [4], 5: [5], 6: [6] };
    const data = cells.map((_, ci) => genes.map((_, gi) => {
      const on = (marker[ci] || []).includes(gi);
      const expr = on ? 0.6 + rng() * 0.4 : rng() * 0.22;
      const pct = on ? 0.55 + rng() * 0.45 : rng() * 0.25;
      return { expr, pct };
    }));
    const state = { clustered: true };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("dp_c", "並び", [{ v: "clu", label: "クラスタリング" }, { v: "raw", label: "元の順" }], "clu")}
      </div>
      <div class="widget-stage"><div id="dp_plot"></div>
        <div class="legend-row"><span class="li">色＝平均発現（濃いほど高）</span><span class="li">円の大きさ＝発現細胞の割合</span></div></div>
      ${readoutRow([{ id: "dp_dim", label: "細胞種 × 遺伝子", value: cells.length + " × " + genes.length }, { id: "dp_note", label: "読み方", value: "色と円サイズの両方" }])}
      <p class="widget-note">scRNA-seqのドットプロット。各点は<b>色＝平均発現量</b>と<b>円の大きさ＝発現している細胞の割合</b>の2情報。濃くて大きい点がその細胞種のマーカーです。</p>`;
    function draw() {
      const order = state.clustered ? [0, 7 === 7 ? 0 : 0] : null;
      const rowOrder = state.clustered ? cells.map((_, i) => i) : cells.map((_, i) => i);
      const W2 = 560, H2 = 300, mL = 120, mT = 40, cw = (W2 - mL - 20) / genes.length, chh = (H2 - mT - 20) / cells.length;
      const s = stage(document.getElementById("dp_plot"), W2, H2);
      genes.forEach((g, gi) => add(s, "text", { x: mL + gi * cw + cw / 2, y: mT - 8, "text-anchor": "start", "font-size": 8.5, fill: "#616a7d", transform: `rotate(-40 ${mL + gi * cw + cw / 2} ${mT - 8})`, text: g }));
      rowOrder.forEach((ci, r) => {
        add(s, "text", { x: mL - 8, y: mT + r * chh + chh / 2 + 4, "text-anchor": "end", "font-size": 9.5, fill: "#4a5268", text: cells[ci] });
        genes.forEach((_, gi) => {
          const d = data[ci][gi];
          const rad = 2 + d.pct * (Math.min(cw, chh) * 0.42);
          const t = d.expr;
          const col = `rgb(${Math.round(210 - t * 190)},${Math.round(224 - t * 150)},${Math.round(245 - t * 40)})`;
          add(s, "circle", { cx: mL + gi * cw + cw / 2, cy: mT + r * chh + chh / 2, r: rad, fill: col, stroke: "#c7cce0", "stroke-width": 0.4 });
        });
      });
    }
    bindSeg("dp_c", (v) => { state.clustered = v === "clu"; draw(); });
    draw();
  };
})();

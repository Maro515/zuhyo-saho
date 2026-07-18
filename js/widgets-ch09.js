/* 第9章：マイクロバイオーム・メタゲノム解析 — 6 interactive widgets
   （菌叢構成の積み上げ棒・16S vs shotgun・アセンブリ・注釈付き系統樹・α多様性・β多様性PCoA） */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const INDIGO = "#6366f1";
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f2f4f8" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // 1. 16S — stacked bar of phylum composition -----------------------------
  W.microbiome16s = function (container) {
    const phyla = [
      { name: "Firmicutes", col: "#4c9f70", h: 0.52, c: 0.24 },
      { name: "Bacteroidetes", col: "#3aa0ff", h: 0.28, c: 0.20 },
      { name: "Actinobacteria", col: "#f5a623", h: 0.08, c: 0.06 },
      { name: "Proteobacteria", col: "#ef5350", h: 0.05, c: 0.34 },
      { name: "Verrucomicrobia", col: "#a855f7", h: 0.04, c: 0.02 },
      { name: "Others", col: "#8a93a8", h: 0.03, c: 0.14 },
    ];
    const state = { d: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mb_d", "疾患の状態 (健常→CD活動期)", 0, 1, 0.05, state.d, (v) => v < 0.2 ? "健常" : v > 0.8 ? "CD活動期" : "移行")}</div>
      <div class="widget-stage"><div id="mb_plot"></div>
        <div class="legend-row">${phyla.map((p) => `<span class="li"><span class="sw" style="background:${p.col}"></span>${p.name}</span>`).join("")}</div></div>
      ${readoutRow([{ id: "mb_f", label: "Firmicutes", value: "—" }, { id: "mb_p", label: "Proteobacteria", value: "—" }])}
      <p class="widget-note">門(phylum)レベルの積み上げ棒グラフ(相対存在量)。クローン病では<b>Firmicutesが減少しProteobacteriaが増加</b>する菌叢の乱れ(ディスバイオーシス)がみられます。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, s = lightPanel(document.getElementById("mb_plot"), W2, H2, "#f6f7fb");
      const frac = phyla.map((p) => lerp(p.h, p.c, state.d));
      const sum = frac.reduce((a, b) => a + b, 0);
      const rng = CK.makeRng(901);
      const nBars = 10, x0 = 40, bw = 34, gap = 8, y0 = 18, y1 = 200;
      for (let b = 0; b < nBars; b++) {
        const bx = x0 + b * (bw + gap);
        let acc = 0;
        frac.forEach((f, i) => {
          const fv = (f / sum) * (1 + (rng() - 0.5) * 0.18);
          const h = fv * (y1 - y0);
          add(s, "rect", { x: bx, y: y1 - acc - h, width: bw, height: h, fill: phyla[i].col, opacity: 0.9 });
          acc += h;
        });
      }
      add(s, "text", { x: 14, y: (y0 + y1) / 2, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", "font-weight": 700, transform: `rotate(-90 14 ${(y0 + y1) / 2})`, text: "相対存在量" });
      add(s, "text", { x: (x0 + W2) / 2 - 20, y: y1 + 22, "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: "各サンプル →" });
      setReadout("mb_f", (frac[0] / sum * 100).toFixed(0) + "%");
      setReadout("mb_p", (frac[3] / sum * 100).toFixed(0) + "%");
    }
    bindSlider("mb_d", (v) => v < 0.2 ? "健常" : v > 0.8 ? "CD活動期" : "移行", (v) => { state.d = v; draw(); });
    draw();
  };

  // 2. Shotgun vs 16S — resolution & function comparison -------------------
  W.shotgunmeta = function (container) {
    const state = { m: "s16" };
    const levels = ["界", "門", "綱", "目", "科", "属", "種", "株"];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("sm_m", "解析手法", [{ v: "s16", label: "16S rRNA解析" }, { v: "shot", label: "ショットガン" }], "s16")}</div>
      <div class="widget-stage"><div id="sm_plot"></div></div>
      ${readoutRow([{ id: "sm_r", label: "系統分類の解像度", value: "—" }, { id: "sm_f", label: "遺伝子機能", value: "—" }])}
      <p class="widget-note">同じ検体でも手法で読める深さが違います。<b>16Sは属レベルまで・機能は不明</b>、<b>ショットガンは株レベル＋遺伝子機能・パスウェイ</b>まで読めます。感度・簡便さは16Sが上。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, s = lightPanel(document.getElementById("sm_plot"), W2, H2, "#f6f7fb");
      const depth = state.m === "s16" ? 6 : 8; // 属 vs 株
      // taxonomy ladder
      add(s, "text", { x: 24, y: 24, "font-size": 11, fill: "#616a7d", "font-weight": 700, text: "系統分類の深さ" });
      levels.forEach((l, i) => {
        const y = 40 + i * 22, on = i < depth;
        add(s, "rect", { x: 30, y: y - 12, width: 150, height: 18, rx: 3, fill: on ? INDIGO : "#e2e6ee", opacity: on ? clamp(0.4 + i * 0.08, 0.4, 1) : 0.5 });
        add(s, "text", { x: 105, y: y + 1, "text-anchor": "middle", "font-size": 10, fill: on ? "#fff" : "#a7afbd", text: l });
      });
      add(s, "line", { x1: 30, y1: 40 + (depth - 1) * 22 + 12, x2: 190, y2: 40 + (depth - 1) * 22 + 12, stroke: "#ef5350", "stroke-width": 2 });
      add(s, "text", { x: 195, y: 40 + (depth - 1) * 22 + 15, "font-size": 9, fill: "#c44", text: "← ここまで" });
      // function box
      add(s, "rect", { x: 250, y: 40, width: 190, height: 160, rx: 8, fill: state.m === "shot" ? "rgba(99,102,241,0.1)" : "#eef0f4", stroke: state.m === "shot" ? INDIGO : "#d2d7e0", "stroke-width": 1.2 });
      add(s, "text", { x: 345, y: 66, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", "font-weight": 700, text: "遺伝子機能・パスウェイ" });
      if (state.m === "shot") {
        ["✓ 遺伝子ファミリー", "✓ 代謝パスウェイ", "✓ 抗生物質耐性遺伝子", "✓ ウイルス・古細菌も"].forEach((t, i) => add(s, "text", { x: 268, y: 96 + i * 24, "font-size": 10.5, fill: "#4048b8", text: t }));
      } else {
        add(s, "text", { x: 345, y: 130, "text-anchor": "middle", "font-size": 13, fill: "#a7afbd", text: "✗ わからない" });
        add(s, "text", { x: 345, y: 152, "text-anchor": "middle", "font-size": 9.5, fill: "#a7afbd", text: "(構成のみ)" });
      }
      setReadout("sm_r", state.m === "s16" ? "属レベルまで(低め)" : "種・株レベルまで(高い)");
      setReadout("sm_f", state.m === "s16" ? "わからない" : "わかる(パスウェイまで)");
    }
    bindSeg("sm_m", (v) => { state.m = v; draw(); });
    draw();
  };

  // 3. Genome assembly — read length vs contigs ----------------------------
  W.assembly = function (container) {
    const state = { len: 25 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("as_l", "リード長", 10, 100, 5, state.len, (v) => v < 45 ? "ショート" : v < 80 ? "中" : "ロング")}</div>
      <div class="widget-stage"><div id="as_plot"></div></div>
      ${readoutRow([{ id: "as_c", label: "コンティグ数", value: "—" }, { id: "as_s", label: "完成度", value: "—" }])}
      <p class="widget-note">環状の細菌ゲノム。<b>ショートリードはくり返し配列(赤)をまたげず分断され、多数のコンティグ</b>に。<b>ロングリードはくり返しをまたいで1本の環状ゲノムに完成</b>します。</p>`;
    function draw() {
      const W2 = 320, H2 = 260, s = darkPanel(document.getElementById("as_plot"), W2, H2, "#080a12");
      const cx = 160, cy = 128, R = 92;
      const contigs = clamp(Math.round(1 + (85 - state.len) / 12), 1, 7);
      const complete = contigs === 1;
      // repeat regions (arcs) shown in red
      const cols = ["#6366f1", "#4c9f70", "#3aa0ff", "#f5a623", "#a855f7", "#ef7aa0", "#5fd0c0"];
      const gap = complete ? 0 : 10; // degrees gap between contigs
      const seg = 360 / contigs;
      function pol(a, r) { const rad = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; }
      for (let i = 0; i < contigs; i++) {
        const a0 = i * seg + gap / 2, a1 = (i + 1) * seg - gap / 2;
        const p0 = pol(a0, R), p1 = pol(a1, R), large = (a1 - a0) > 180 ? 1 : 0;
        add(s, "path", { d: `M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${R} ${R} 0 ${large} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`, fill: "none", stroke: cols[i % cols.length], "stroke-width": 10, "stroke-linecap": complete ? "round" : "butt" });
      }
      // repeat markers
      [40, 160, 280].forEach((a) => { const p = pol(a, R); add(s, "circle", { cx: p[0], cy: p[1], r: 5, fill: "#ef5350" }); });
      if (complete) {
        // inner genome map rings
        add(s, "circle", { cx: cx, cy: cy, r: R - 18, fill: "none", stroke: "#3a4256", "stroke-width": 4, opacity: 0.6 });
        add(s, "circle", { cx: cx, cy: cy, r: R - 30, fill: "none", stroke: "#2a3040", "stroke-width": 3, opacity: 0.5 });
        add(s, "text", { x: cx, y: cy + 4, "text-anchor": "middle", "font-size": 11, fill: "#8b93ff", "font-weight": 700, text: "環状ゲノム完成" });
      }
      add(s, "text", { x: cx, y: H2 - 14, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "赤点＝くり返し配列" });
      setReadout("as_c", contigs + " 本");
      setReadout("as_s", complete ? "完全長(環状)" : Math.round((1 - (contigs - 1) / 6) * 90) + "% (ドラフト)");
    }
    bindSlider("as_l", (v) => v < 45 ? "ショート" : v < 80 ? "中" : "ロング", (v) => { state.len = v; draw(); });
    draw();
  };

  // 4. Annotated phylogenetic tree (GraPhlAn-style radial) -----------------
  W.phylotree = function (container) {
    const rng = CK.makeRng(904);
    const clades = [{ name: "Firmicutes", col: "#4c9f70", enr: -1, gsize: 0.6 }, { name: "Bacteroidetes", col: "#3aa0ff", enr: -1, gsize: 0.8 }, { name: "Proteobacteria", col: "#ef5350", enr: 1, gsize: 0.9 }, { name: "Actinobacteria", col: "#f5a623", enr: 1, gsize: 0.5 }, { name: "Verrucomicrobia", col: "#a855f7", enr: -1, gsize: 0.4 }];
    const tips = [];
    clades.forEach((c, ci) => { const n = 4 + Math.floor(rng() * 3); for (let k = 0; k < n; k++) tips.push({ clade: ci, jitter: rng() }); });
    const state = { meta: "phylum" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("pt_m", "表示するメタデータ", [{ v: "phylum", label: "門分類" }, { v: "enrich", label: "疾患群で増減" }, { v: "gsize", label: "ゲノムサイズ" }], "phylum")}</div>
      <div class="widget-stage"><div id="pt_plot"></div>
        <div class="legend-row"><span class="li" id="pt_leg"></span></div></div>
      ${readoutRow([{ id: "pt_v", label: "表示中のメタデータ", value: "—" }, { id: "pt_n", label: "読み方", value: "—" }])}
      <p class="widget-note">放射状の系統樹(GraPhlAn)。中央＝高次分類、外周＝末端の分類群。<b>周辺リングやノードの色にメタデータを重ねて</b>、複雑な菌叢を1枚で俯瞰します。</p>`;
    function color(t) {
      const c = clades[t.clade];
      if (state.meta === "phylum") return c.col;
      if (state.meta === "enrich") return c.enr > 0 ? "#ef5350" : "#4c9f70";
      const g = c.gsize * (0.7 + t.jitter * 0.5); return `rgba(99,102,241,${clamp(g, 0.2, 1)})`;
    }
    function draw() {
      const W2 = 320, H2 = 270, s = darkPanel(document.getElementById("pt_plot"), W2, H2, "#070810");
      const cx = 160, cy = 128, R = 92;
      const N = tips.length;
      tips.forEach((t, i) => {
        const ang = i / N * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + Math.cos(ang) * R, y1 = cy + Math.sin(ang) * R;
        const xm = cx + Math.cos(ang) * (R * 0.45), ym = cy + Math.sin(ang) * (R * 0.45);
        add(s, "line", { x1: cx, y1: cy, x2: xm, y2: ym, stroke: "#2a3040", "stroke-width": 1 });
        add(s, "line", { x1: xm, y1: ym, x2: x1, y2: y1, stroke: color(t), "stroke-width": 1.6, opacity: 0.8 });
        add(s, "circle", { cx: x1, cy: y1, r: 3.4, fill: color(t) });
        // outer ring segment
        const x2 = cx + Math.cos(ang) * (R + 14), y2 = cy + Math.sin(ang) * (R + 14);
        add(s, "line", { x1: cx + Math.cos(ang) * (R + 6), y1: cy + Math.sin(ang) * (R + 6), x2: x2, y2: y2, stroke: color(t), "stroke-width": 5, opacity: 0.85 });
      });
      add(s, "circle", { cx: cx, cy: cy, r: 5, fill: "#8b93ff" });
      // legend
      const leg = document.getElementById("pt_leg");
      if (state.meta === "phylum") leg.innerHTML = clades.map((c) => `<span class="li"><span class="sw" style="background:${c.col}"></span>${c.name}</span>`).join("");
      else if (state.meta === "enrich") leg.innerHTML = `<span class="li"><span class="sw" style="background:#ef5350"></span>疾患で増加</span><span class="li"><span class="sw" style="background:#4c9f70"></span>健常で増加</span>`;
      else leg.innerHTML = `<span class="li"><span class="sw" style="background:#6366f1"></span>濃いほどゲノム大</span>`;
      setReadout("pt_v", state.meta === "phylum" ? "門(phylum)分類" : state.meta === "enrich" ? "疾患群での増減" : "ゲノムサイズ");
      setReadout("pt_n", state.meta === "phylum" ? "系統群を色分け" : state.meta === "enrich" ? "赤=疾患/緑=健常で豊富" : "色の濃さ=サイズ");
    }
    bindSeg("pt_m", (v) => { state.meta = v; draw(); });
    draw();
  };

  // 5. Alpha diversity — richness × evenness -> Shannon --------------------
  W.alphadiv = function (container) {
    const state = { rich: 6, even: 0.7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ad_r", "種数 (richness)", 2, 12, 1, state.rich, (v) => v + " 種")}${sliderRow("ad_e", "均等性 (evenness)", 0, 1, 0.05, state.even, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ad_plot"></div></div>
      ${readoutRow([{ id: "ad_h", label: "Shannon指数 H'", value: "—" }, { id: "ad_c", label: "観測種数(≈Chao)", value: "—" }])}
      <p class="widget-note">サンプル内の種構成。<b>種数が多いほど、また各種が均等に存在するほど、多様性(Shannon H')が高く</b>なります。腸内では多様性の低下＝ディスバイオーシスの目安です。</p>`;
    function draw() {
      const W2 = 460, H2 = 230, s = lightPanel(document.getElementById("ad_plot"), W2, H2, "#f6f7fb");
      const S = state.rich;
      const raw = []; for (let i = 0; i < S; i++) raw.push(Math.exp(-i * (1 - state.even) * 2.2));
      const sum = raw.reduce((a, b) => a + b, 0);
      const p = raw.map((r) => r / sum);
      const cols = ["#6366f1", "#4c9f70", "#3aa0ff", "#f5a623", "#ef5350", "#a855f7", "#e35fa0", "#0fb9d4", "#84cc16", "#fb923c", "#22d3ee", "#94a3b8"];
      const x0 = 44, y1 = 196, maxh = 160, bw = Math.min(32, (W2 - 60) / S - 6), gap = 6;
      let H = 0; p.forEach((pi) => { if (pi > 0) H -= pi * Math.log(pi); });
      p.forEach((pi, i) => {
        const bx = x0 + i * (bw + gap), h = pi / Math.max.apply(null, p) * maxh;
        add(s, "rect", { x: bx, y: y1 - h, width: bw, height: h, rx: 2, fill: cols[i % cols.length], opacity: 0.9 });
        add(s, "text", { x: bx + bw / 2, y: y1 + 14, "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: "種" + (i + 1) });
      });
      add(s, "line", { x1: x0 - 6, y1: y1, x2: W2 - 14, y2: y1, stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: 14, y: (20 + y1) / 2, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", "font-weight": 700, transform: `rotate(-90 14 ${(20 + y1) / 2})`, text: "存在量" });
      setReadout("ad_h", H.toFixed(3) + " (最大 " + Math.log(S).toFixed(2) + ")");
      setReadout("ad_c", S + " 種");
    }
    bindSlider("ad_r", (v) => v + " 種", (v) => { state.rich = v; draw(); });
    bindSlider("ad_e", (v) => (v * 100).toFixed(0) + "%", (v) => { state.even = v; draw(); });
    draw();
  };

  // 6. Beta diversity — PCoA ordination of two groups ---------------------
  W.betadiv = function (container) {
    const rng = CK.makeRng(906), A = [], B = [];
    for (let i = 0; i < 26; i++) { A.push([CK.randNormal(0, 1, rng), CK.randNormal(0, 1, rng)]); B.push([CK.randNormal(0, 1, rng), CK.randNormal(0, 1, rng)]); }
    const state = { sep: 0.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("bd_s", "群間の相違度", 0, 1, 0.05, state.sep, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="bd_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#9aa6b4"></span>健常群</span><span class="li"><span class="sw" style="background:#ef5350"></span>疾患群</span></div></div>
      ${readoutRow([{ id: "bd_d", label: "群間距離 / 群内距離", value: "—" }, { id: "bd_p", label: "PERMANOVA", value: "—" }])}
      <p class="widget-note">PCoA(主座標分析)プロット。1点＝1サンプルで、<b>近いほど似た菌叢、離れるほど異なる菌叢</b>。相違度が大きいと健常群と疾患群が分離します。群間距離をPERMANOVAで検定します。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("bd_plot"), { width: 440, height: 260, xDomain: [-5, 6], yDomain: [-4, 4], xTicks: 5, yTicks: 4, xLabel: "PC1 (24.3%)", yLabel: "PC2 (6.3%)", xFmt: () => "", yFmt: () => "" });
      const shift = state.sep * 5.5;
      A.forEach((p) => CK.dot(ctx, p[0] - shift * 0.5, p[1], { r: 4, fill: "#9aa6b4", opacity: 0.8 }));
      B.forEach((p) => CK.dot(ctx, p[0] + shift * 0.5, p[1], { r: 4, fill: "#ef5350", opacity: 0.8 }));
      const ratio = 1 + state.sep * 4;
      setReadout("bd_d", ratio.toFixed(1) + " 倍");
      setReadout("bd_p", state.sep > 0.35 ? "p < 0.05 (有意に異なる)" : "n.s. (差なし)");
    }
    bindSlider("bd_s", (v) => (v * 100).toFixed(0) + "%", (v) => { state.sep = v; draw(); });
    draw();
  };
})();

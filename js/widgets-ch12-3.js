/* 第12章 発展編 — パート3 ウィジェット（t21〜t30）
   Stereo-seq / CODEX / IMC / DVP / ExSeq / cryo-ET / MicroED / HDX-MS / XL-MS / CETSA */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  const ACC = "#b02fd0";   // 章のアクセント（ch12: #d946ef 系）
  const ACC2 = "#26a69a";
  const WARN = "#ef6c5a";

  // ---------------------------------------------------------- local helpers
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f4f5f9" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hex(n) { const s = Math.round(clamp(n, 0, 255)).toString(16); return s.length === 1 ? "0" + s : s; }
  function toRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(c1, c2, t) {
    const a = toRgb(c1), b = toRgb(c2);
    return "#" + hex(lerp(a[0], b[0], t)) + hex(lerp(a[1], b[1], t)) + hex(lerp(a[2], b[2], t));
  }
  function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }
  function label(s, x, y, txt, size, fill, anchor) {
    add(s, "text", { x: x, y: y, "font-size": size || 11, fill: fill || "#5b6478", "text-anchor": anchor || "start", text: txt });
  }

  // ==================================================== 21. Stereo-seq =====
  W.stereoseq = function (container) {
    const BINS = [10, 20, 50, 100, 200];
    const state = { i: 2 };
    const fmtBin = (i) => "bin" + BINS[i] + "（" + (BINS[i] * 0.5) + " μm四方）";
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ss_b", "binサイズ", 0, BINS.length - 1, 1, state.i, fmtBin)}</div>
      <div class="widget-stage"><div id="ss_plot"></div></div>
      ${readoutRow([
        { id: "ss_res", label: "1binの実寸", value: "—" },
        { id: "ss_g", label: "1binあたり検出遺伝子数", value: "—" },
        { id: "ss_c", label: "1binに含まれる細胞数", value: "—" },
      ])}
      <p class="widget-note">同じ組織・同じ生データを、binサイズだけ変えて描いています。binを小さくすると格子は細かくなりますが1binに落ちるmRNAが減って像がざらつき、binを大きくすると滑らかになる代わりに<b>複数の細胞が1点に混ざります</b>。図の隅のbin表記を確認する習慣を。</p>`;

    // 組織の「真の」発現パターン（0〜1）: 層構造 ＋ 円形の構造体
    function truth(x, y) {
      let v = 0.5 + 0.42 * Math.sin((y + 0.35 * x) / 46);
      const dx = x - 218, dy = y - 92;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < 52) v = lerp(v, 0.96, clamp((52 - r) / 26, 0, 1));
      const dx2 = x - 80, dy2 = y - 236;
      const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (r2 < 44) v = lerp(v, 0.05, clamp((44 - r2) / 22, 0, 1));
      return clamp(v, 0, 1);
    }

    function draw() {
      const bin = BINS[state.i];
      const um = bin * 0.5;                 // 1binの一辺（μm）
      const FIELD = 320;                    // 視野（μm）
      const W2 = 380, H2 = 400;
      const s = lightPanel(document.getElementById("ss_plot"), W2, H2, "#f6f7fb");
      const ox = 40, oy = 42, side = 300;   // 描画領域（px）
      const n = Math.max(3, Math.round(FIELD / um));
      const cell = side / n;
      const area = um * um;
      const genes = Math.min(3800, Math.round(2.4 * Math.pow(area, 0.85)));
      const sd = 1.15 / Math.sqrt(genes);
      const rng = CK.makeRng(1234 + state.i * 7);

      label(s, ox, 26, "Stereo-seqチップ（視野 320 μm 四方）", 12, "#414a5e");
      label(s, ox + side - 4, 26, "bin" + bin, 12.5, ACC, "end");

      for (let iy = 0; iy < n; iy++) {
        for (let ix = 0; ix < n; ix++) {
          const cx = (ix + 0.5) * um, cy = (iy + 0.5) * um;
          const t = truth(cx, cy) + CK.randNormal(0, sd, rng);
          const col = mix("#2f5fd0", "#e04a3f", clamp(t, 0, 1));
          add(s, "rect", { x: ox + ix * cell, y: oy + iy * cell, width: cell + 0.6, height: cell + 0.6, fill: col, opacity: 0.94 });
        }
      }
      add(s, "rect", { x: ox, y: oy, width: side, height: side, fill: "none", stroke: "#c8cddc", "stroke-width": 1.2, rx: 4 });

      // 参考：細胞1個の大きさ（直径16 μm）と bin の大きさを並べる
      const px = side / FIELD;
      const y1 = oy + side + 22, y2 = oy + side + 40;
      add(s, "rect", { x: ox, y: y1 - 9, width: 16 * px, height: 9, fill: "#8d97ad", opacity: 0.75, rx: 1.5 });
      label(s, ox + 16 * px + 6, y1 - 1, "細胞1個 (16 μm)", 10, "#6e7688");
      const bw = Math.max(Math.min(um * px, 200), 1.5);
      add(s, "rect", { x: ox, y: y2 - 9, width: bw, height: 9, fill: ACC, opacity: 0.85, rx: 1.5 });
      label(s, ox + bw + 6, y2 - 1, "1bin (" + um + " μm)", 10, ACC);

      setReadout("ss_res", um + " μm 四方");
      setReadout("ss_g", genes.toLocaleString() + " 遺伝子");
      const cells = area / 200;
      setReadout("ss_c", cells < 1 ? "約 " + cells.toFixed(2) + " 個（細胞の一部）" : "約 " + cells.toFixed(1) + " 個");
    }
    bindSlider("ss_b", fmtBin, (v) => { state.i = v; draw(); });
    draw();
  };

  // ============================================ 22. CODEX / PhenoCycler ====
  W.codex = function (container) {
    const state = { cyc: 6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("cx_c", "読み出しサイクル数（1サイクル＝3マーカー）", 1, 20, 1, state.cyc, (v) => v + " サイクル")}</div>
      <div class="widget-stage"><div id="cx_plot"></div></div>
      ${readoutRow([
        { id: "cx_m", label: "読めるマーカー数", value: "—" },
        { id: "cx_s", label: "識別できる細胞サブセット", value: "—" },
        { id: "cx_i", label: "最終サイクルの残存シグナル", value: "—" },
      ])}
      <p class="widget-note">抗体は最初に一括で結合させたまま動かさず、蛍光オリゴの結合・撮像・除去を繰り返します。サイクルを増やすほど<b>細胞タイプは細かく分かれます</b>が、後半サイクルほど<b>シグナルは弱くなります</b>。パネル表で「そのマーカーが何サイクル目か」を確認しましょう。</p>`;

    const rng0 = CK.makeRng(99);
    const CELLS = [];
    for (let i = 0; i < 170; i++) {
      CELLS.push({ x: 18 + rng0() * 258, y: 16 + rng0() * 190, r: 4 + rng0() * 2.4, t: Math.floor(rng0() * 32) });
    }

    function draw() {
      const cyc = state.cyc;
      const markers = cyc * 3;
      const subsets = Math.min(32, Math.round(1 + markers * 0.9));
      const W2 = 500, H2 = 272;
      const s = lightPanel(document.getElementById("cx_plot"), W2, H2, "#f6f7fb");

      // --- 左：組織の細胞地図 ---
      add(s, "rect", { x: 12, y: 30, width: 292, height: 218, fill: "#fbfbfe", stroke: "#ccd2e2", "stroke-width": 1.1, rx: 5 });
      label(s, 12, 22, "細胞地図（色＝識別された細胞サブセット）", 11.5, "#414a5e");
      CELLS.forEach((c) => {
        const idx = c.t % subsets;
        const hue = Math.round((idx * 360) / Math.max(subsets, 1));
        add(s, "circle", { cx: 12 + c.x, cy: 30 + c.y, r: c.r, fill: subsets === 1 ? "#9aa3b6" : hsl(hue, 62, 55), opacity: 0.9 });
      });

      // --- 右：サイクルごとの残存シグナル ---
      const bx = 326, by = 40, bw = 158, bh = 200;
      label(s, bx, 22, "サイクル別の残存シグナル", 11.5, "#414a5e");
      add(s, "line", { x1: bx, y1: by + bh, x2: bx + bw, y2: by + bh, stroke: "#c2c8d8", "stroke-width": 1.1 });
      add(s, "line", { x1: bx, y1: by, x2: bx, y2: by + bh, stroke: "#c2c8d8", "stroke-width": 1.1 });
      const cw = bw / 20;
      let lastSig = 100;
      for (let c = 1; c <= 20; c++) {
        const sig = 100 * Math.exp(-0.042 * (c - 1));
        const on = c <= cyc;
        if (on) lastSig = sig;
        const h = (sig / 100) * (bh - 8);
        add(s, "rect", {
          x: bx + (c - 1) * cw + 1, y: by + bh - h, width: cw - 2, height: h,
          fill: on ? mix(ACC, WARN, (c - 1) / 19) : "#dfe3ee", opacity: on ? 0.9 : 0.55, rx: 1.5,
        });
      }
      label(s, bx, by + bh + 15, "1", 10, "#7b8397");
      label(s, bx + bw, by + bh + 15, "20 サイクル", 10, "#7b8397", "end");
      label(s, bx, by - 6, "100%", 9.5, "#9aa2b4");

      setReadout("cx_m", markers + " マーカー");
      setReadout("cx_s", subsets + " 種類" + (subsets >= 32 ? "（頭打ち）" : ""));
      setReadout("cx_i", lastSig.toFixed(0) + "%" + (lastSig < 60 ? "（減衰に注意）" : ""));
    }
    bindSlider("cx_c", (v) => v + " サイクル", (v) => { state.cyc = v; draw(); });
    draw();
  };

  // ========================================================== 23. IMC =====
  W.imc = function (container) {
    const state = { mode: "metal", n: 24 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:6px">${segRow("im_m", "検出のしかた", [{ v: "fluor", label: "蛍光色素" }, { v: "metal", label: "金属同位体（IMC）" }], state.mode)}</div>
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("im_n", "パネルのマーカー数", 4, 40, 1, state.n, (v) => v + " チャネル")}</div>
      <div class="widget-stage"><div id="im_plot"></div></div>
      ${readoutRow([
        { id: "im_o", label: "隣接チャネルの重なり", value: "—" },
        { id: "im_j", label: "補正なしでの分離", value: "—" },
        { id: "im_a", label: "検出軸", value: "—" },
      ])}
      <p class="widget-note">蛍光は発光スペクトルが幅を持つため、チャネルを増やすほど隣同士が重なり合い補正が不可欠になります。金属同位体は<b>質量軸上に細い線として離れて立つ</b>ので、40チャネルでも重なりはほぼ生じません。ただし完全なゼロではなく、良い論文はスピルオーバー補正を明記しています。</p>`;

    function draw() {
      const W2 = 500, H2 = 280;
      const s = lightPanel(document.getElementById("im_plot"), W2, H2, "#f6f7fb");
      const x0 = 46, x1 = 476, yb = 218, top = 44;
      const n = state.n;
      const fluor = state.mode === "fluor";
      const sig = fluor ? 0.055 : 0.0042;   // 正規化幅
      const spacing = 0.86 / Math.max(n - 1, 1);
      const overlap = Math.exp(-(spacing * spacing) / (4 * sig * sig));

      label(s, x0, 24, fluor ? "蛍光発光スペクトル（波長軸）" : "質量スペクトル（m/z 軸）", 12, "#414a5e");
      add(s, "line", { x1: x0, y1: yb, x2: x1, y2: yb, stroke: "#c2c8d8", "stroke-width": 1.2 });
      add(s, "line", { x1: x0, y1: top - 8, x2: x0, y2: yb, stroke: "#c2c8d8", "stroke-width": 1.2 });

      const X = (u) => x0 + u * (x1 - x0);
      for (let i = 0; i < n; i++) {
        const mu = 0.07 + (i / Math.max(n - 1, 1)) * 0.86;
        const hue = Math.round((i * 300) / Math.max(n, 1));
        const col = fluor ? hsl(hue, 70, 52) : mix("#2f5fd0", ACC, i / Math.max(n - 1, 1));
        let d = "";
        const steps = fluor ? 60 : 14;
        const span = fluor ? 3.2 * sig : 3.4 * sig;
        for (let k = 0; k <= steps; k++) {
          const u = mu - span + (2 * span * k) / steps;
          const v = Math.exp(-((u - mu) * (u - mu)) / (2 * sig * sig));
          d += (k === 0 ? "M " : "L ") + X(u).toFixed(2) + " " + (yb - v * (yb - top)).toFixed(2) + " ";
        }
        d += "L " + X(mu + span).toFixed(2) + " " + yb + " L " + X(mu - span).toFixed(2) + " " + yb + " Z";
        add(s, "path", { d: d, fill: col, opacity: fluor ? 0.3 : 0.75, stroke: col, "stroke-width": fluor ? 1.1 : 1.4 });
      }

      // 軸ラベル
      if (fluor) {
        [450, 550, 650, 750].forEach((nm, k) => label(s, X(0.05 + k * 0.3), yb + 17, nm + " nm", 10, "#7b8397", "middle"));
        label(s, (x0 + x1) / 2, H2 - 8, "発光波長 → 隣接チャネルが裾で重なる", 11.5, "#616a7d", "middle");
      } else {
        ["141Pr", "153Eu", "165Ho", "176Yb"].forEach((m, k) => label(s, X(0.05 + k * 0.3), yb + 17, m, 10, "#7b8397", "middle"));
        label(s, (x0 + x1) / 2, H2 - 8, "質量数 → チャネルは細い線として分離する", 11.5, "#616a7d", "middle");
      }

      setReadout("im_o", (overlap * 100).toFixed(overlap < 0.01 ? 2 : 1) + "%");
      setReadout("im_j", overlap > 0.5 ? "困難（補正必須）" : overlap > 0.12 ? "やや困難" : "良好");
      setReadout("im_a", fluor ? "波長（幅を持つ）" : "質量（ほぼ線スペクトル）");
    }
    bindSeg("im_m", (v) => { state.mode = v; draw(); });
    bindSlider("im_n", (v) => v + " チャネル", (v) => { state.n = v; draw(); });
    draw();
  };

  // ========================================================== 24. DVP =====
  W.dvp = function (container) {
    const state = { thr: 0.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("dv_t", "AI分類のしきい値（この値以上のスコアの細胞を切り出す）", 0.3, 0.95, 0.05, state.thr, (v) => v.toFixed(2))}</div>
      <div class="widget-stage"><div id="dv_plot"></div></div>
      ${readoutRow([
        { id: "dv_n", label: "切り出した細胞数", value: "—" },
        { id: "dv_p", label: "腫瘍細胞の純度", value: "—" },
        { id: "dv_q", label: "定量できたタンパク質数", value: "—" },
        { id: "dv_s", label: "有意に変動したタンパク質", value: "—" },
      ])}
      <p class="widget-note">左が組織とAIの分類、右が切り出した細胞集団どうしのプロテオーム比較（火山図）。しきい値を厳しくすると<b>純度は上がるが細胞が減って測れるタンパク質が減り</b>、緩めると<b>深く測れるが他の細胞が混ざって差が薄まります</b>。DVPの図を読むときはAI分類の妥当性が土台です。</p>`;

    const rngC = CK.makeRng(31);
    const CELLS = [];
    for (let i = 0; i < 72; i++) {
      const tumor = i % 2 === 0;
      CELLS.push({
        x: 16 + rngC() * 196, y: 14 + rngC() * 186, r: 5 + rngC() * 2.6, tumor: tumor,
        score: tumor ? clamp(0.52 + 0.46 * rngC(), 0, 1) : clamp(0.04 + 0.62 * rngC(), 0, 1),
      });
    }
    const rngP = CK.makeRng(77);
    const PROT = [];
    for (let i = 0; i < 110; i++) {
      const diff = i < 14;
      PROT.push({ base: diff ? (rngP() < 0.5 ? -1 : 1) * (1.1 + rngP() * 1.6) : 0, e: CK.randNormal(0, 1, rngP), diff: diff });
    }

    function draw() {
      const W2 = 520, H2 = 300;
      const s = lightPanel(document.getElementById("dv_plot"), W2, H2, "#f6f7fb");
      const sel = CELLS.filter((c) => c.score >= state.thr);
      const nSel = sel.length;
      const nTum = sel.filter((c) => c.tumor).length;
      const purity = nSel > 0 ? nTum / nSel : 0;
      const proteins = Math.round(900 + 3400 * (1 - Math.exp(-nSel / 11)));
      const contrast = clamp(2 * purity - 1, 0, 1);
      const noise = 0.85 / Math.sqrt(Math.max(proteins, 1) / 600);

      // --- 左：組織とAI分類 ---
      label(s, 12, 22, "組織画像＋AIの細胞分類", 11.5, "#414a5e");
      add(s, "rect", { x: 12, y: 30, width: 228, height: 214, fill: "#fbfbfe", stroke: "#ccd2e2", "stroke-width": 1.1, rx: 5 });
      CELLS.forEach((c) => {
        const on = c.score >= state.thr;
        add(s, "circle", {
          cx: 12 + c.x, cy: 30 + c.y, r: c.r,
          fill: on ? (c.tumor ? ACC : WARN) : "#d7dbe6",
          stroke: on ? "#ffffff" : "none", "stroke-width": on ? 1.2 : 0, opacity: on ? 0.95 : 0.6,
        });
      });
      label(s, 12, 262, "● 切り出された腫瘍細胞", 10, ACC);
      label(s, 12, 276, "● 誤って混入した間質細胞", 10, WARN);
      label(s, 12, 290, "● 切り出されなかった細胞", 10, "#9aa2b4");

      // --- 右：火山図 ---
      const px0 = 286, px1 = 506, py0 = 40, py1 = 244;
      label(s, px0, 22, "プロテオーム比較（火山図）", 11.5, "#414a5e");
      add(s, "rect", { x: px0, y: py0, width: px1 - px0, height: py1 - py0, fill: "#fbfbfe", stroke: "#ccd2e2", "stroke-width": 1.1, rx: 5 });
      const FX = (lfc) => px0 + ((clamp(lfc, -3.2, 3.2) + 3.2) / 6.4) * (px1 - px0);
      const FY = (nl) => py1 - (clamp(nl, 0, 14) / 14) * (py1 - py0);
      add(s, "line", { x1: FX(0), y1: py0, x2: FX(0), y2: py1, stroke: "#dde1ec", "stroke-width": 1 });
      add(s, "line", { x1: px0, y1: FY(1.3), x2: px1, y2: FY(1.3), stroke: "#c3c9da", "stroke-width": 1, "stroke-dasharray": "4 3" });

      let nSig = 0;
      PROT.forEach((p) => {
        const lfc = p.base * contrast + p.e * noise * 0.55;
        const z = Math.abs(lfc) / (noise * 0.72);
        const pval = 2 * (1 - CK.normalCDF(z));
        const nl = clamp(-Math.log10(Math.max(pval, 1e-15)), 0, 14);
        const sig = nl > 1.3 && Math.abs(lfc) > 0.6;
        if (sig) nSig++;
        add(s, "circle", {
          cx: FX(lfc), cy: FY(nl), r: sig ? 3.4 : 2.6,
          fill: sig ? (lfc > 0 ? WARN : ACC2) : "#aeb5c6", opacity: sig ? 0.9 : 0.55,
        });
      });
      label(s, (px0 + px1) / 2, py1 + 16, "log2 変化量 →（縦軸: −log10 p）", 10.5, "#6e7688", "middle");
      [-2, 0, 2].forEach((v) => label(s, FX(v), py1 + 30, String(v), 9.5, "#9aa2b4", "middle"));
      label(s, px0 + 4, FY(1.3) - 4, "p = 0.05", 9.5, "#9aa2b4");

      setReadout("dv_n", nSel + " 個 / 72");
      setReadout("dv_p", (purity * 100).toFixed(0) + "%");
      setReadout("dv_q", proteins.toLocaleString() + " 種類");
      setReadout("dv_s", nSig + " 種類");
    }
    bindSlider("dv_t", (v) => v.toFixed(2), (v) => { state.thr = v; draw(); });
    draw();
  };

  // ======================================================== 25. ExSeq =====
  W.exseq = function (container) {
    const state = { ex: 1 };
    const PAIRS = [60, 120, 250, 500];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ex_e", "膨張率", 1, 20, 0.5, state.ex, (v) => v.toFixed(1) + " 倍")}</div>
      <div class="widget-stage"><div id="ex_plot"></div></div>
      ${readoutRow([
        { id: "ex_r", label: "実効分解能（元試料換算）", value: "—" },
        { id: "ex_n", label: "分離できた分子ペア", value: "—" },
        { id: "ex_s", label: "見かけの試料サイズ", value: "—" },
      ])}
      <p class="widget-note">4組のRNA分子ペア（本来の距離 60・120・250・500 nm）の蛍光強度プロファイルです。膨張率を上げると<b>実効分解能（点の広がり）が元試料換算で細かくなり</b>、山が1つだった密なペアが2つに割れて「分離できた」状態に切り替わります。図のスケールバーが膨張後の実寸か換算値かは必ず確認を。</p>`;

    function draw() {
      const ex = state.ex;
      const resEff = 250 / ex;                 // 元試料換算の実効分解能（nm）
      const sigma = resEff / 2.355;
      const host = document.getElementById("ex_plot");
      const ctx = CK.plot(host, {
        width: 500, height: 320, margin: { top: 26, right: 20, bottom: 46, left: 66 },
        xDomain: [-420, 420], yDomain: [0, 4.5], xTicks: 6, yTicks: 0,
        xFmt: (v) => Math.round(v), xLabel: "位置（元試料換算 nm）", grid: true,
      });
      let nOk = 0;
      PAIRS.forEach((d, i) => {
        const base = i * 1.1 + 0.15;
        const raw = [];
        let vmax = 0;
        for (let x = -420; x <= 420; x += 4) {
          const a = Math.exp(-((x + d / 2) * (x + d / 2)) / (2 * sigma * sigma));
          const b = Math.exp(-((x - d / 2) * (x - d / 2)) / (2 * sigma * sigma));
          raw.push([x, a + b]);
          if (a + b > vmax) vmax = a + b;
        }
        const pts = raw.map((p) => [p[0], base + 0.85 * (p[1] / (vmax || 1))]);
        // 中央のくぼみで「分離できたか」を判定（Rayleigh基準に相当）
        const center = 2 * Math.exp(-(d * d / 4) / (2 * sigma * sigma));
        const peak = 1 + Math.exp(-(d * d) / (2 * sigma * sigma));
        const ok = center / peak < 0.81;
        if (ok) nOk++;
        CK.line(ctx, pts, { stroke: ok ? ACC : "#a8afc0", "stroke-width": ok ? 2.4 : 1.8, opacity: ok ? 0.95 : 0.75 });
        CK.textPx(ctx, 70, ctx.y(base + 0.95), d + " nm " + (ok ? "分離" : "未分離"),
          { "font-size": ctx.fs(11), fill: ok ? ACC : "#8b93a5", "font-weight": ok ? 700 : 400 });
      });
      CK.textPx(ctx, ctx.margin.left, 18, "実効分解能 " + resEff.toFixed(0) + " nm（点線＝分離の目安）",
        { "font-size": ctx.fs(11.5), fill: "#5b6478" });

      setReadout("ex_r", resEff.toFixed(0) + " nm");
      setReadout("ex_n", nOk + " / " + PAIRS.length + " 組");
      setReadout("ex_s", ex.toFixed(1) + " 倍（体積は約 " + Math.round(ex * ex * ex) + " 倍）");
    }
    bindSlider("ex_e", (v) => v.toFixed(1) + " 倍", (v) => { state.ex = v; draw(); });
    draw();
  };

  // ======================================================= 26. cryo-ET ====
  W.cryoet = function (container) {
    const STEPS = [1, 5, 20, 100, 500, 2000, 8000];
    const state = { i: 3 };
    const fmtN = (i) => STEPS[i].toLocaleString() + " 個";
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ce_n", "平均化するサブトモグラム数", 0, STEPS.length - 1, 1, state.i, fmtN)}</div>
      <div class="widget-stage"><div id="ce_plot"></div></div>
      ${readoutRow([
        { id: "ce_r", label: "到達分解能（目安）", value: "—" },
        { id: "ce_s", label: "シグナル対ノイズ比", value: "—" },
        { id: "ce_v", label: "見えるもの", value: "—" },
      ])}
      <p class="widget-note">左が平均化後の密度マップ、右がFSC曲線です。粒子1個ではノイズに埋もれて何も見えませんが、同一の複合体を多数重ねるとノイズが打ち消し合い、分解能はおおよそ<b>√N に比例して改善</b>します。論文の分解能の値は、必ず「何個の粒子を使ったか」とセットで読みます。</p>`;

    function draw() {
      const N = STEPS[state.i];
      const res = 3.0 + 45 / Math.sqrt(N);
      const snr = Math.sqrt(N) * 0.35;
      const W2 = 520, H2 = 280;
      const s = lightPanel(document.getElementById("ce_plot"), W2, H2, "#f6f7fb");

      // --- 左：密度マップ ---
      label(s, 14, 22, "サブトモグラム平均像", 11.5, "#414a5e");
      const ox = 14, oy = 30, side = 216, n = 54, cell = side / n;
      const rng = CK.makeRng(500 + state.i * 13);
      const sd = 1.25 / Math.sqrt(N);
      for (let iy = 0; iy < n; iy++) {
        for (let ix = 0; ix < n; ix++) {
          const cx = (ix + 0.5) / n - 0.5, cy = (iy + 0.5) / n - 0.5;
          const r = Math.sqrt(cx * cx + cy * cy);
          // リング状の膜＋中央の密度（模式的な複合体）
          let v = Math.exp(-((r - 0.33) * (r - 0.33)) / (2 * 0.045 * 0.045));
          v += 0.75 * Math.exp(-(r * r) / (2 * 0.075 * 0.075));
          const ang = Math.atan2(cy, cx);
          v += 0.45 * Math.exp(-((r - 0.33) * (r - 0.33)) / (2 * 0.05 * 0.05)) * Math.pow(Math.abs(Math.cos(4 * ang)), 6);
          v = clamp(v, 0, 1.2) / 1.2 + CK.randNormal(0, sd, rng);
          const g = clamp(v, 0, 1);
          add(s, "rect", { x: ox + ix * cell, y: oy + iy * cell, width: cell + 0.5, height: cell + 0.5, fill: mix("#141a2c", "#eef1f8", g) });
        }
      }
      add(s, "rect", { x: ox, y: oy, width: side, height: side, fill: "none", stroke: "#c8cddc", "stroke-width": 1.2, rx: 4 });
      label(s, ox, oy + side + 18, "N = " + N.toLocaleString() + " 粒子", 11, ACC);

      // --- 右：FSC曲線 ---
      const gx0 = 274, gx1 = 500, gy0 = 40, gy1 = 234;
      label(s, gx0, 22, "FSC曲線", 11.5, "#414a5e");
      add(s, "rect", { x: gx0, y: gy0, width: gx1 - gx0, height: gy1 - gy0, fill: "#fbfbfe", stroke: "#ccd2e2", "stroke-width": 1.1, rx: 5 });
      const kmax = 0.35;                             // 1/Å
      const FX = (k) => gx0 + (k / kmax) * (gx1 - gx0);
      const FY = (v) => gy1 - v * (gy1 - gy0);
      // 0.143 の基準線
      add(s, "line", { x1: gx0, y1: FY(0.143), x2: gx1, y2: FY(0.143), stroke: "#c3c9da", "stroke-width": 1.2, "stroke-dasharray": "4 3" });
      label(s, gx0 + 4, FY(0.143) - 4, "FSC = 0.143", 9.5, "#8b93a5");
      const kc = 1 / res;
      let d = "";
      for (let i = 0; i <= 80; i++) {
        const k = (i / 80) * kmax;
        const v = Math.exp(-Math.pow(k / kc, 2) * 1.946);   // k = kc で 0.143 を通る
        d += (i === 0 ? "M " : "L ") + FX(k).toFixed(2) + " " + FY(v).toFixed(2) + " ";
      }
      add(s, "path", { d: d, fill: "none", stroke: ACC, "stroke-width": 2.4 });
      add(s, "line", { x1: FX(Math.min(kc, kmax)), y1: gy0, x2: FX(Math.min(kc, kmax)), y2: gy1, stroke: WARN, "stroke-width": 1.4, "stroke-dasharray": "3 3" });
      label(s, (gx0 + gx1) / 2, gy1 + 18, "空間周波数 (1/Å) →", 10.5, "#6e7688", "middle");
      label(s, gx0 + 4, gy0 + 13, "1.0", 9.5, "#9aa2b4");
      label(s, FX(Math.min(kc, kmax)) + 5, gy0 + 28, res.toFixed(1) + " Å", 11, WARN);

      setReadout("ce_r", res.toFixed(1) + " Å");
      setReadout("ce_s", snr.toFixed(1) + " 倍（1粒子比）");
      setReadout("ce_v", res > 25 ? "輪郭も不明瞭" : res > 12 ? "全体の形" : res > 7 ? "サブユニット配置" : res > 4.5 ? "二次構造" : "側鎖の一部");
    }
    bindSlider("ce_n", fmtN, (v) => { state.i = v; draw(); });
    draw();
  };

  // ======================================================= 27. MicroED ====
  W.microed = function (container) {
    const state = { src: "electron", lg: 2.6 };   // lg = log10(結晶サイズ nm)
    const fmtSize = (lg) => {
      const nm = Math.pow(10, lg);
      return nm >= 1000 ? (nm / 1000).toFixed(1) + " μm" : nm.toFixed(0) + " nm";
    };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:6px">${segRow("me_s", "照射するもの", [{ v: "xray", label: "X線" }, { v: "electron", label: "電子線（MicroED）" }], state.src)}</div>
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("me_l", "結晶の一辺", 1.7, 4.7, 0.05, state.lg, fmtSize)}</div>
      <div class="widget-stage"><div id="me_plot"></div></div>
      ${readoutRow([
        { id: "me_i", label: "回折強度（相対）", value: "—" },
        { id: "me_d", label: "見える最高分解能", value: "—" },
        { id: "me_v", label: "構造解析の可否", value: "—" },
      ])}
      <p class="widget-note">電子と物質の相互作用はX線のおよそ10万倍あります。結晶を小さくしていくと、X線では高分解能の外側リングから順にスポットが消えて解けなくなりますが、<b>電子線でははるかに小さな結晶でも外側まで回折が残ります</b>。論文では解像度と併せてデータの完全性と使用結晶数を確認します。</p>`;

    const rngS = CK.makeRng(202);
    const SPOTS = [];
    for (let shell = 1; shell <= 6; shell++) {
      const cnt = 6 + shell * 5;
      for (let j = 0; j < cnt; j++) {
        const ang = (j / cnt) * Math.PI * 2 + rngS() * 0.25;
        SPOTS.push({ shell: shell, r: shell * 16.5 + (rngS() - 0.5) * 3, ang: ang, sz: 3.4 - shell * 0.22 });
      }
    }

    function draw() {
      const nm = Math.pow(10, state.lg);
      const um = nm / 1000;
      const cross = state.src === "xray" ? 1 : 1e5;
      const I = cross * Math.pow(um, 3);
      let kmax = 0;
      for (let k = 1; k <= 6; k++) if (I / Math.pow(3, k - 1) > 1) kmax = k;

      const W2 = 500, H2 = 300;
      const s = lightPanel(document.getElementById("me_plot"), W2, H2, "#f6f7fb");
      const cx = 168, cy = 150;
      label(s, 14, 22, "回折パターン（模式図）", 11.5, "#414a5e");
      add(s, "circle", { cx: cx, cy: cy, r: 122, fill: "#101522", opacity: 0.93 });
      add(s, "circle", { cx: cx, cy: cy, r: 8, fill: "#2a3247" });
      SPOTS.forEach((sp) => {
        const strength = I / Math.pow(3, sp.shell - 1);
        const op = clamp(Math.log10(Math.max(strength, 1e-6)) / 3 + 0.15, 0, 0.95);
        if (op <= 0.03) return;
        add(s, "circle", {
          cx: cx + sp.r * Math.cos(sp.ang), cy: cy + sp.r * Math.sin(sp.ang), r: sp.sz,
          fill: state.src === "xray" ? "#8fd3ff" : "#c7b3ff", opacity: op,
        });
      });
      [1, 3, 6].forEach((k) => {
        add(s, "circle", { cx: cx, cy: cy, r: k * 16.5, fill: "none", stroke: "#39415a", "stroke-width": 0.9, "stroke-dasharray": "2 4" });
      });
      label(s, cx, cy + 140, state.src === "xray" ? "X線回折" : "電子線回折（MicroED）", 11.5, "#414a5e", "middle");

      // 右：結晶の大きさ比較
      const bx = 320;
      label(s, bx, 22, "結晶の大きさ", 11.5, "#414a5e");
      const px = clamp((um / 20) * 120, 2, 120);   // 一辺どうしの線形比較
      add(s, "rect", { x: bx + 8, y: 60, width: 120, height: 120, fill: "#e7eaf3", stroke: "#c8cddc", "stroke-width": 1, rx: 4 });
      label(s, bx + 8, 54, "X線が必要とする大きさ (20 μm)", 9.5, "#8b93a5");
      add(s, "rect", { x: bx + 8, y: 60 + 120 - px, width: px, height: px, fill: ACC, opacity: 0.85, rx: 2 });
      label(s, bx + 8, 200, "この結晶: " + fmtSize(state.lg), 11, ACC);

      setReadout("me_i", I >= 1 ? I.toExponential(1) : I.toExponential(1) + "（微弱）");
      setReadout("me_d", kmax === 0 ? "回折なし" : (6.0 / kmax).toFixed(1) + " Å");
      setReadout("me_v", kmax >= 5 ? "原子分解能で解ける" : kmax >= 3 ? "解けるが分解能は限定的" : kmax >= 1 ? "困難（低分解能のみ）" : "解けない");
    }
    bindSeg("me_s", (v) => { state.src = v; draw(); });
    bindSlider("me_l", fmtSize, (v) => { state.lg = v; draw(); });
    draw();
  };

  // ======================================================= 28. HDX-MS =====
  W.hdxms = function (container) {
    const state = { lg: 2, lig: "apo" };
    const fmtT = (lg) => {
      const t = Math.pow(10, lg);
      return t < 60 ? t.toFixed(0) + " 秒" : t < 3600 ? (t / 60).toFixed(0) + " 分" : (t / 3600).toFixed(1) + " 時間";
    };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:6px">${segRow("hx_l", "リガンド", [{ v: "apo", label: "なし (apo)" }, { v: "holo", label: "あり (holo)" }], state.lig)}</div>
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("hx_t", "重水に浸す時間", 1, 4, 0.1, state.lg, fmtT)}</div>
      <div class="widget-stage"><div id="hx_plot"></div></div>
      ${readoutRow([
        { id: "hx_m", label: "最も保護された領域", value: "—" },
        { id: "hx_d", label: "最大の取り込み減少", value: "—" },
        { id: "hx_u", label: "取り込みが増えた領域", value: "—" },
      ])}
      <p class="widget-note">横軸はペプチド（配列順）、縦軸は重水素の取り込み量です。リガンドを結合させると<b>結合界面のペプチドだけ取り込みが減り（保護）</b>、アロステリックに開く領域では逆に増えます。時間を延ばすと保護されていた領域も最終的には交換され、差は縮みます。灰色の点線はapoの値です。</p>`;

    // 12ペプチド：保護係数と、リガンド結合による変化
    const PEP = [
      { n: "1-14", pf: 1.2, f: 1 }, { n: "15-27", pf: 3, f: 1 }, { n: "28-41", pf: 9, f: 1 },
      { n: "42-55", pf: 2, f: 1 }, { n: "56-68", pf: 4, f: 14 }, { n: "69-82", pf: 6, f: 22 },
      { n: "83-95", pf: 3, f: 9 }, { n: "96-110", pf: 12, f: 1 }, { n: "111-124", pf: 2.5, f: 1 },
      { n: "125-138", pf: 7, f: 0.28 }, { n: "139-152", pf: 1.6, f: 1 }, { n: "153-166", pf: 5, f: 1 },
    ];
    const MAXD = 9;

    function uptake(p, t, holo) {
      const pf = p.pf * (holo ? p.f : 1);
      return MAXD * (1 - Math.exp(-(t / 25) / pf));
    }

    function draw() {
      const t = Math.pow(10, state.lg);
      const holo = state.lig === "holo";
      const W2 = 500, H2 = 300;
      const s = lightPanel(document.getElementById("hx_plot"), W2, H2, "#f6f7fb");
      const x0 = 52, x1 = 484, yb = 236, top = 44;
      add(s, "line", { x1: x0, y1: yb, x2: x1, y2: yb, stroke: "#c2c8d8", "stroke-width": 1.2 });
      add(s, "line", { x1: x0, y1: top - 10, x2: x0, y2: yb, stroke: "#c2c8d8", "stroke-width": 1.2 });
      label(s, 14, 22, "ペプチドごとの重水素取り込み（" + (holo ? "リガンドあり" : "リガンドなし") + "・" + fmtT(state.lg) + "）", 11.5, "#414a5e");
      [0, 3, 6, 9].forEach((v) => {
        const y = yb - (v / MAXD) * (yb - top);
        add(s, "line", { x1: x0, y1: y, x2: x1, y2: y, stroke: "#e6e9f2", "stroke-width": 1 });
        label(s, x0 - 8, y + 4, String(v), 10, "#9aa2b4", "end");
      });
      add(s, "text", { x: 16, y: (top + yb) / 2, "font-size": 10.5, fill: "#616a7d", "text-anchor": "middle", transform: `rotate(-90 16 ${(top + yb) / 2})`, text: "重水素の取り込み量" });

      const bw = (x1 - x0) / PEP.length;
      let maxProt = null, maxDelta = 0, opened = null, slowest = null, slowU = 1e9;
      PEP.forEach((p, i) => {
        const uA = uptake(p, t, false);
        const uH = uptake(p, t, true);
        const u = holo ? uH : uA;
        const h = (u / MAXD) * (yb - top);
        const delta = uA - uH;
        if (delta > maxDelta) { maxDelta = delta; maxProt = p.n; }
        if (uH - uA > 0.5) opened = p.n;
        if (u < slowU) { slowU = u; slowest = p.n; }
        const col = holo && delta > 0.4 ? ACC2 : holo && uH - uA > 0.4 ? WARN : ACC;
        add(s, "rect", { x: x0 + i * bw + 4, y: yb - h, width: bw - 8, height: h, fill: col, opacity: 0.85, rx: 2 });
        if (holo) {
          const yA = yb - (uA / MAXD) * (yb - top);
          add(s, "line", { x1: x0 + i * bw + 2, y1: yA, x2: x0 + (i + 1) * bw - 2, y2: yA, stroke: "#8d97ad", "stroke-width": 1.4, "stroke-dasharray": "3 2" });
        }
        add(s, "text", { x: x0 + i * bw + bw / 2, y: yb + 16, "font-size": 9.5, fill: "#7b8397", "text-anchor": "middle", text: p.n.split("-")[0] });
      });
      label(s, (x0 + x1) / 2, H2 - 8, "ペプチド開始残基（配列順・カバーされた領域のみ）", 11, "#616a7d", "middle");

      setReadout("hx_m", holo ? (maxProt || "—") + " 残基（結合界面）" : (slowest || "—") + " 残基（構造で保護）");
      setReadout("hx_d", holo ? "−" + maxDelta.toFixed(1) + " 重水素" : "リガンドありで表示");
      setReadout("hx_u", holo ? (opened ? opened + " 残基（開いた）" : "なし") : "リガンドありで表示");
    }
    bindSeg("hx_l", (v) => { state.lig = v; draw(); });
    bindSlider("hx_t", fmtT, (v) => { state.lg = v; draw(); });
    draw();
  };

  // ======================================================== 29. XL-MS =====
  W.xlms = function (container) {
    const state = { arm: 11 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("xl_a", "架橋剤のスペーサー長 (Å)", 4, 30, 1, state.arm, (v) => v + " Å")}</div>
      <div class="widget-stage"><div id="xl_plot"></div></div>
      ${readoutRow([
        { id: "xl_n", label: "検出された架橋", value: "—" },
        { id: "xl_c", label: "Cα–Cα 距離上限", value: "—" },
        { id: "xl_s", label: "1本あたりの絞り込む力", value: "—" },
        { id: "xl_v", label: "距離制約への違反", value: "—" },
      ])}
      <p class="widget-note">横棒がタンパク質、弧の1本1本が「この2残基は上限以内に近接していた」という距離制約です。スペーサーを長くすると<b>架橋の本数は増えますが1本あたりの制約は緩くなり</b>、構造を絞り込む力は落ちます。赤い弧は上限を超える違反で、偽陽性か複数の構造状態を示唆します。</p>`;

    const rngX = CK.makeRng(404);
    const PAIRS = [];
    for (let i = 0; i < 46; i++) {
      const a = Math.round(10 + rngX() * 370);
      const b = Math.round(10 + rngX() * 370);
      if (Math.abs(a - b) < 18) continue;
      PAIRS.push({ a: Math.min(a, b), b: Math.max(a, b), dist: 8 + rngX() * 38, det: rngX() });
    }
    // 別コンフォマー／偽陽性に相当する「遠い」ペア
    const FAR = [{ a: 40, b: 300, dist: 62 }, { a: 120, b: 355, dist: 58 }, { a: 65, b: 210, dist: 55 }];

    function draw() {
      const maxCa = state.arm + 14;      // 側鎖の可動域を加味
      const W2 = 500, H2 = 280;
      const s = lightPanel(document.getElementById("xl_plot"), W2, H2, "#f6f7fb");
      const x0 = 34, x1 = 470, ybar = 214;
      const X = (r) => x0 + (r / 400) * (x1 - x0);
      label(s, 14, 22, "架橋マップ（弧＝1本の距離制約）", 11.5, "#414a5e");
      add(s, "rect", { x: x0, y: ybar, width: x1 - x0, height: 15, fill: "#d9deec", stroke: "#b9c1d6", "stroke-width": 1, rx: 4 });
      [1, 100, 200, 300, 400].forEach((r) => {
        add(s, "line", { x1: X(r), y1: ybar + 15, x2: X(r), y2: ybar + 20, stroke: "#a9b1c6", "stroke-width": 1 });
        label(s, X(r), ybar + 33, String(r), 9.5, "#7b8397", "middle");
      });
      label(s, (x0 + x1) / 2, H2 - 8, "残基番号", 11, "#616a7d", "middle");

      let n = 0;
      PAIRS.forEach((p) => {
        if (p.dist > maxCa) return;
        if (p.det > 0.82) return;            // 検出効率は100%ではない
        n++;
        const xa = X(p.a), xb = X(p.b);
        const h = clamp((xb - xa) * 0.42, 14, 150);
        const t = clamp(p.dist / maxCa, 0, 1);
        add(s, "path", {
          d: `M ${xa} ${ybar} Q ${(xa + xb) / 2} ${ybar - h * 2} ${xb} ${ybar}`,
          fill: "none", stroke: mix(ACC2, ACC, t), "stroke-width": 1.5, opacity: 0.75,
        });
      });
      let viol = 0;
      FAR.forEach((p) => {
        if (state.arm < 16) return;          // 長いスペーサーほど遠いペアも拾ってしまう
        viol++;
        const xa = X(p.a), xb = X(p.b);
        const h = clamp((xb - xa) * 0.42, 14, 150);
        add(s, "path", {
          d: `M ${xa} ${ybar} Q ${(xa + xb) / 2} ${ybar - h * 2} ${xb} ${ybar}`,
          fill: "none", stroke: WARN, "stroke-width": 2, opacity: 0.9, "stroke-dasharray": "5 3",
        });
      });

      // 制約の鋭さの目盛り
      const sharp = 30 / maxCa;
      label(s, x0, 44, "距離上限 " + maxCa + " Å（スペーサー " + state.arm + " Å ＋ 側鎖 14 Å）", 11, "#5b6478");

      setReadout("xl_n", n + " 本");
      setReadout("xl_c", maxCa + " Å 以内");
      setReadout("xl_s", (sharp * 100).toFixed(0) + "（相対）");
      setReadout("xl_v", viol + " 本" + (viol > 0 ? "（要確認）" : ""));
    }
    bindSlider("xl_a", (v) => v + " Å", (v) => { state.arm = v; draw(); });
    draw();
  };

  // ======================================================= 30. CETSA ======
  W.cetsa = function (container) {
    const state = { dose: 0 };
    const fmtD = (v) => (v === 0 ? "0 (DMSO)" : v.toFixed(1) + " μM");
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ct_d", "薬剤濃度", 0, 30, 0.5, state.dose, fmtD)}</div>
      <div class="widget-stage"><div id="ct_plot"></div></div>
      ${readoutRow([
        { id: "ct_t", label: "標的タンパク質の Tm", value: "—" },
        { id: "ct_dt", label: "ΔTm（熱シフト）", value: "—" },
        { id: "ct_o", label: "非標的タンパク質の ΔTm", value: "—" },
        { id: "ct_j", label: "標的エンゲージメント", value: "—" },
      ])}
      <p class="widget-note">縦軸は加熱後に上清へ残った可溶性画分の割合です。薬剤が結合すると変性に必要な温度が上がり、<b>標的の融解曲線だけが右へシフト</b>します。灰色の非標的タンパク質はほとんど動きません。ΔTmがゼロでも「結合していない」とは言えない点（偽陰性）に注意してください。</p>`;

    const TM0 = 48, DTMAX = 7.2, KD = 2.2, SLOPE = 1.7;
    function curve(tm) {
      const pts = [];
      for (let T = 37; T <= 67; T += 0.5) pts.push([T, 1 / (1 + Math.exp((T - tm) / SLOPE))]);
      return pts;
    }
    function draw() {
      const dt = DTMAX * (state.dose / (state.dose + KD));
      const tmT = TM0 + dt;
      const host = document.getElementById("ct_plot");
      const ctx = CK.plot(host, {
        width: 520, height: 320, margin: { top: 26, right: 22, bottom: 48, left: 68 },
        xDomain: [37, 67], yDomain: [0, 1.05], xTicks: 6, yTicks: 5,
        xFmt: (v) => Math.round(v), yFmt: (v) => (v * 100).toFixed(0) + "%",
        xLabel: "加熱温度 (℃)", yLabel: "可溶性画分",
      });
      // 参照（薬剤なし）
      CK.line(ctx, curve(TM0), { stroke: "#b6bccc", "stroke-width": 1.6, "stroke-dasharray": "5 4" });
      // 非標的
      CK.line(ctx, curve(52), { stroke: "#8d97ad", "stroke-width": 2 });
      // 標的
      CK.line(ctx, curve(tmT), { stroke: ACC, "stroke-width": 2.8 });
      CK.hline(ctx, 0.5, { stroke: "#d5d9e6" });
      CK.vline(ctx, tmT, { stroke: ACC, "stroke-width": 1.5 });
      CK.vline(ctx, TM0, { stroke: "#c3c9da", "stroke-width": 1.2 });

      // 実測点（ばらつき込み）
      const rng = CK.makeRng(7 + Math.round(state.dose * 10));
      [40, 44, 47, 50, 53, 56, 59, 63].forEach((T) => {
        const v = 1 / (1 + Math.exp((T - tmT) / SLOPE));
        CK.dot(ctx, T, clamp(v + CK.randNormal(0, 0.035, rng), 0, 1.02), { r: 3.6, fill: ACC, opacity: 0.85 });
        const v2 = 1 / (1 + Math.exp((T - 52) / SLOPE));
        CK.dot(ctx, T, clamp(v2 + CK.randNormal(0, 0.035, rng), 0, 1.02), { r: 3, fill: "#8d97ad", opacity: 0.7 });
      });

      CK.textPx(ctx, ctx.margin.left + 6, 18, "紫＝標的　灰＝非標的　点線＝薬剤なしの標的", { "font-size": ctx.fs(11), fill: "#5b6478" });
      if (dt > 0.3) {
        CK.textPx(ctx, ctx.x((TM0 + tmT) / 2), ctx.y(0.62), "ΔTm = " + dt.toFixed(1) + " ℃",
          { "font-size": ctx.fs(12), fill: ACC, "font-weight": 700, "text-anchor": "middle" });
      }

      setReadout("ct_t", tmT.toFixed(1) + " ℃");
      setReadout("ct_dt", "+" + dt.toFixed(1) + " ℃");
      setReadout("ct_o", "+0.0 ℃");
      setReadout("ct_j", dt < 0.5 ? "検出できず" : dt < 2 ? "部分的" : dt < 5 ? "明瞭" : "ほぼ飽和");
    }
    bindSlider("ct_d", fmtD, (v) => { state.dose = v; draw(); });
    draw();
  };
})();

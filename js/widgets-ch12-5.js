/* 第12章 発展編 パート5（t41-t50）— インタラクティブ図10個
   phasedmeth / t2tpangenome / ctdnamrd / mced / spectralflow
   pdodrug / organchip / mendelianrand / targettrial / prs
   すべて .widget-stage（明るい白パネル）の中に描画する。 */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  // ---- local helpers (widgets ファイルはスコープが独立するため自前で用意) ----
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f6f8fb" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function txt(s, x, y, str, attrs) { return add(s, "text", Object.assign({ x, y, "font-size": 10.5, fill: "#3d465c", text: str }, attrs)); }
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  const INK = "#1b2233", MUTED = "#7b8497", BLUE = "#3b63e0", RED = "#e5484d", GREEN = "#0f9e73", ORANGE = "#f97316", PURPLE = "#9333ea";

  // 41. 一分子メチル化フェージング -------------------------------------------------
  W.phasedmeth = function (container) {
    const state = { depth: 16, mode: "imprint" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("pm_mode", "解析領域", [{ v: "normal", label: "通常の遺伝子体部" }, { v: "imprint", label: "インプリンティング領域" }, { v: "tumor", label: "腫瘍：片アレルのみ高メチル化" }], "imprint")}
        ${sliderRow("pm_depth", "リード深度（本）", 6, 30, 2, state.depth)}
      </div>
      <div class="widget-stage"><div id="pm_host"></div></div>
      ${readoutRow([{ id: "pm_bulk", label: "バルク平均メチル化率", value: "—" }, { id: "pm_h1", label: "ハプロタイプ1", value: "—" }, { id: "pm_h2", label: "ハプロタイプ2", value: "—" }])}
      <p class="widget-note">1本1本のリードが横並びの行。黒丸がメチル化CpG、白丸が非メチル化CpGです。<b>バルク平均が同じ約50%でも</b>、父方・母方に分けると「全分子が中途半端」なのか「片アレルだけ完全メチル化」なのかがまったく違って見えます。</p>`;
    function pMeth(hap, x) {
      if (state.mode === "normal") return 0.5;
      if (state.mode === "imprint") return hap === 0 ? (x > 0.25 && x < 0.75 ? 0.94 : 0.5) : (x > 0.25 && x < 0.75 ? 0.05 : 0.5);
      return hap === 0 ? (x < 0.55 ? 0.92 : 0.15) : 0.06;
    }
    function draw() {
      const Wd = 660, H = 300, s = lightPanel(document.getElementById("pm_host"), Wd, H, "#ffffff");
      const nCpG = 26, x0 = 92, x1 = Wd - 26, y0 = 58;
      const rows = state.depth, rowH = Math.min(13, (H - 126) / rows);
      const r = rng(7 + state.depth * 13 + state.mode.length * 101);
      let sum = 0, cnt = 0, h1s = 0, h1c = 0, h2s = 0, h2c = 0;
      const region = state.mode === "imprint" ? [0.25, 0.75] : state.mode === "tumor" ? [0, 0.55] : [0, 1];
      const inRegion = (f) => f >= region[0] && f <= region[1];
      txt(s, 14, 20, "1分子メチル化フェージング（各行＝1本のロングリード）", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      if (state.mode !== "normal") {
        const rx0 = x0 + region[0] * (x1 - x0), rx1 = x0 + region[1] * (x1 - x0);
        add(s, "rect", { x: rx0, y: y0 - 14, width: rx1 - rx0, height: rows * rowH + 28, fill: "#f59e0b", opacity: 0.1 });
        txt(s, rx0 + 6, y0 - 20, state.mode === "imprint" ? "アレル特異的メチル化（ASM）領域" : "プロモーターCpGアイランド（片アレル高メチル化）", { fill: "#b45309", "font-weight": 700 });
      }
      for (let i = 0; i < rows; i++) {
        const hap = i < Math.ceil(rows / 2) ? 0 : 1;
        const yy = y0 + i * rowH + (hap === 1 ? 14 : 0);
        add(s, "line", { x1: x0 - 6, x2: x1 + 6, y1: yy, y2: yy, stroke: hap === 0 ? "#dbe3f7" : "#fbe0e6", "stroke-width": rowH * 0.82 });
        for (let j = 0; j < nCpG; j++) {
          const fx = j / (nCpG - 1);
          const px = x0 + fx * (x1 - x0);
          const m = r() < pMeth(hap, fx) ? 1 : 0;
          add(s, "circle", { cx: px, cy: yy, r: Math.min(3.2, rowH * 0.36), fill: m ? INK : "#ffffff", stroke: m ? INK : "#9aa2b6", "stroke-width": 0.9 });
          if (!inRegion(fx)) continue;
          sum += m; cnt++;
          if (hap === 0) { h1s += m; h1c++; } else { h2s += m; h2c++; }
        }
      }
      const midY = y0 + Math.ceil(rows / 2) * rowH + 6;
      add(s, "line", { x1: 20, x2: x1 + 6, y1: midY, y2: midY, stroke: "#c7cce0", "stroke-width": 1, "stroke-dasharray": "5 4" });
      txt(s, 14, y0 + 10, "ハプロタイプ1", { fill: BLUE, "font-weight": 700 });
      txt(s, 14, midY + 20, "ハプロタイプ2", { fill: RED, "font-weight": 700 });
      const by = y0 + rows * rowH + 30;
      add(s, "line", { x1: x0, x2: x1, y1: by, y2: by, stroke: "#c7cce0", "stroke-width": 1.2 });
      txt(s, x0, by + 16, "ゲノム座標 →", { fill: MUTED });
      txt(s, x1, by + 16, state.mode === "normal" ? "全域を集計" : "橙色の領域内で集計", { fill: MUTED, "text-anchor": "end" });
      setReadout("pm_bulk", ((sum / cnt) * 100).toFixed(0) + "%");
      setReadout("pm_h1", ((h1s / h1c) * 100).toFixed(0) + "%");
      setReadout("pm_h2", ((h2s / h2c) * 100).toFixed(0) + "%");
    }
    bindSeg("pm_mode", (v) => { state.mode = v; draw(); });
    bindSlider("pm_depth", (v) => v, (v) => { state.depth = v; draw(); });
    draw();
  };

  // 42. T2Tアセンブリとパンゲノム ---------------------------------------------------
  W.t2tpangenome = function (container) {
    const state = { div: 40, ref: "linear" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("t2_ref", "参照", [{ v: "linear", label: "参照配列1本（GRCh38）" }, { v: "graph", label: "パンゲノムグラフ" }], "linear")}
        ${sliderRow("t2_div", "個人ゲノムの多型量（参照からの隔たり）", 0, 100, 5, state.div, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="t2_host"></div></div>
      ${readoutRow([{ id: "t2_map", label: "マッピング率", value: "—" }, { id: "t2_bias", label: "参照アレル比（理想0.50）", value: "—" }, { id: "t2_sv", label: "構造多型の検出率", value: "—" }])}
      <p class="widget-note">上段は参照の構造。1本の直線に対し、グラフは多型を<b>バブル（分岐と再合流）</b>として保持します。多型量を上げると、参照1本では非参照アレルのリードが捨てられてマッピング率が落ち、ヘテロ接合部位の<b>参照アレル比が0.5から上振れ</b>します。</p>`;
    function draw() {
      const Wd = 660, H = 278, s = lightPanel(document.getElementById("t2_host"), Wd, H, "#ffffff");
      const d = state.div / 100, graph = state.ref === "graph";
      txt(s, 14, 20, graph ? "パンゲノム参照グラフ（Liao 2023）" : "直線参照配列（GRCh38 / T2T-CHM13）", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      const bx0 = 40, bx1 = Wd - 40, by = 62;
      add(s, "line", { x1: bx0, x2: bx1, y1: by, y2: by, stroke: "#2c3448", "stroke-width": 6, "stroke-linecap": "round" });
      const bubbles = [0.16, 0.34, 0.52, 0.68, 0.85];
      bubbles.forEach((f, i) => {
        const cx = bx0 + f * (bx1 - bx0), wgt = 16 + i * 3;
        if (graph) {
          const h = 12 + 10 * (i % 3);
          add(s, "path", { d: `M ${cx - wgt} ${by} C ${cx - wgt / 2} ${by - h}, ${cx + wgt / 2} ${by - h}, ${cx + wgt} ${by}`, fill: "none", stroke: PURPLE, "stroke-width": 3.4 });
          add(s, "path", { d: `M ${cx - wgt} ${by} C ${cx - wgt / 2} ${by + h}, ${cx + wgt / 2} ${by + h}, ${cx + wgt} ${by}`, fill: "none", stroke: "#c084fc", "stroke-width": 2.6 });
          add(s, "circle", { cx: cx - wgt, cy: by, r: 3.4, fill: PURPLE });
          add(s, "circle", { cx: cx + wgt, cy: by, r: 3.4, fill: PURPLE });
        } else {
          add(s, "circle", { cx, cy: by, r: 3.4, fill: "#9aa2b6" });
        }
      });
      txt(s, bx0, by + (graph ? 46 : 22), graph ? "バブル＝集団内に存在する対立配列（欠失・挿入・SV）を保持" : "多型は表現されず、非参照アレルは「不一致」として扱われる", { fill: MUTED });

      const mapRate = graph ? 99.4 - 0.6 * d : 99.2 - 9.5 * d;
      const bias = graph ? 0.50 + 0.015 * d : 0.50 + 0.16 * d;
      const svRate = graph ? 88 - 8 * d : 46 - 30 * d;
      const bars = [
        { label: "マッピング率 (%)", v: mapRate, max: 100, c: BLUE, fmt: (x) => x.toFixed(1) + "%" },
        { label: "構造多型の検出率 (%)", v: Math.max(4, svRate), max: 100, c: GREEN, fmt: (x) => x.toFixed(0) + "%" },
        { label: "参照アレル比", v: bias, max: 0.75, c: bias > 0.56 ? RED : "#a1a8bb", fmt: (x) => x.toFixed(3) },
      ];
      const gx = 190, gw = Wd - gx - 110, gy = 140;
      bars.forEach((b, i) => {
        const yy = gy + i * 46;
        txt(s, gx - 10, yy + 4, b.label, { "text-anchor": "end", fill: INK, "font-size": 11 });
        add(s, "rect", { x: gx, y: yy - 10, width: gw, height: 20, rx: 4, fill: "#eef1f7" });
        add(s, "rect", { x: gx, y: yy - 10, width: gw * clamp(b.v / b.max, 0, 1), height: 20, rx: 4, fill: b.c });
        txt(s, gx + gw + 8, yy + 4, b.fmt(b.v), { fill: INK, "font-weight": 700, "font-size": 11 });
      });
      const ideal = gx + gw * (0.5 / 0.75);
      add(s, "line", { x1: ideal, x2: ideal, y1: gy + 2 * 46 - 16, y2: gy + 2 * 46 + 16, stroke: INK, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
      txt(s, ideal + 4, gy + 2 * 46 + 28, "理想 0.50", { fill: MUTED, "font-size": 9.5 });
      setReadout("t2_map", mapRate.toFixed(1) + "%");
      setReadout("t2_bias", bias.toFixed(3));
      setReadout("t2_sv", Math.max(4, svRate).toFixed(0) + "%");
    }
    bindSeg("t2_ref", (v) => { state.ref = v; draw(); });
    bindSlider("t2_div", (v) => v + "%", (v) => { state.div = v; draw(); });
    draw();
  };

  // 43. ctDNAによるMRD検出 -----------------------------------------------------------
  W.ctdnamrd = function (container) {
    const state = { growth: 0.24, lod: -2, resid: -3.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ct_res", "術後の微小残存腫瘍量 log10(VAF%)", -5, -1.5, 0.1, state.resid, (v) => Math.pow(10, v).toExponential(1) + "%")}
        ${sliderRow("ct_gr", "再発腫瘍の増殖速度（月あたり）", 0.08, 0.5, 0.02, state.growth, (v) => v.toFixed(2))}
        ${sliderRow("ct_lod", "アッセイ検出限界 log10(VAF%)", -3, -1, 0.1, state.lod, (v) => (Math.pow(10, v)).toFixed(3) + "%")}
      </div>
      <div class="widget-stage"><div id="ct_host"></div></div>
      ${readoutRow([{ id: "ct_ct", label: "ctDNA陽性化", value: "—" }, { id: "ct_img", label: "画像で再発確認", value: "—" }, { id: "ct_lead", label: "リードタイム", value: "—" }])}
      <p class="widget-note">縦軸は対数のVAF（変異アレル頻度）。術後にいったん検出限界を下回り、残存腫瘍が増殖して再びしきい値を超える軌跡です。<b>検出限界の破線を上げ下げすると、画像診断（灰色の線）に対するリードタイムが変わります</b>。陰性は「腫瘍なし」ではなく「LOD未満」であることを読み取ってください。</p>`;
    function draw() {
      const host = document.getElementById("ct_host");
      const YMIN = -5.2;
      const ctx = CK.plot(host, { width: 660, height: 320, margin: { top: 18, right: 24, bottom: 44, left: 62 }, xDomain: [-2, 30], yDomain: [YMIN, 1.2], xTicks: 8, yTicks: 8, xLabel: "手術からの月数", yLabel: "log10 VAF (%)", xFmt: (v) => Math.round(v), yFmt: (v) => v.toFixed(1) });
      const IMG = 0.3; // 画像で検出可能となる log10 VAF 相当の腫瘍量
      const pts = [];
      for (let t = -2; t <= 30; t += 0.2) {
        let v;
        if (t < 0) v = 0.85; // 術前
        else if (t < 0.5) v = 0.85 + (state.resid - 0.85) * (t / 0.5); // 術後のクリアランス
        else v = state.resid + state.growth * (t - 0.5) * 0.9;
        pts.push([t, clamp(v, YMIN, 1.2)]);
      }
      CK.area(ctx, pts.map((p) => [p[0], Math.max(p[1], YMIN)]), pts.map((p) => [p[0], YMIN]), { fill: BLUE, opacity: 0.1 });
      CK.line(ctx, pts, { stroke: BLUE, "stroke-width": 2.6 });
      CK.vline(ctx, 0, { stroke: "#2c3448", "stroke-width": 1.6, "stroke-dasharray": "" });
      CK.textPx(ctx, ctx.x(0) + 4, ctx.margin.top + 12, "根治手術", { fill: INK, "font-size": 10.5, "font-weight": 700 });
      CK.hline(ctx, state.lod, { stroke: RED, "stroke-width": 1.8 });
      CK.textPx(ctx, ctx.margin.left + 6, ctx.y(state.lod) - 5, "ctDNA 検出限界 (LOD)", { fill: RED, "font-size": 10.5, "font-weight": 700 });
      CK.hline(ctx, IMG, { stroke: "#8b93a7", "stroke-width": 1.6 });
      CK.textPx(ctx, ctx.margin.left + 6, ctx.y(IMG) - 5, "画像で再発が確認できる腫瘍量", { fill: "#616a7d", "font-size": 10.5, "font-weight": 700 });
      const solve = (target) => {
        const t = 0.5 + (target - state.resid) / (state.growth * 0.9);
        return t >= 0.5 && t <= 30 ? t : null;
      };
      const tCt = solve(state.lod), tImg = solve(IMG);
      if (tCt !== null) { CK.dot(ctx, tCt, state.lod, { r: 6, fill: RED, opacity: 1 }); }
      if (tImg !== null) { CK.dot(ctx, tImg, IMG, { r: 6, fill: "#616a7d", opacity: 1 }); }
      if (tCt !== null && tImg !== null) {
        const yBar = YMIN + 0.28;
        CK.line(ctx, [[tCt, yBar], [tImg, yBar]], { stroke: GREEN, "stroke-width": 3 });
        CK.line(ctx, [[tCt, state.lod], [tCt, yBar]], { stroke: GREEN, "stroke-width": 1, "stroke-dasharray": "3 3" });
        CK.line(ctx, [[tImg, IMG], [tImg, yBar]], { stroke: GREEN, "stroke-width": 1, "stroke-dasharray": "3 3" });
        CK.textPx(ctx, (ctx.x(tCt) + ctx.x(tImg)) / 2 - 30, ctx.y(yBar) - 7, "リードタイム", { fill: GREEN, "font-size": 10.5, "font-weight": 700 });
      }
      setReadout("ct_ct", tCt === null ? (state.resid >= state.lod ? "術直後から陽性" : "30ヶ月以内になし") : tCt.toFixed(1) + "ヶ月");
      setReadout("ct_img", tImg === null ? "30ヶ月以内になし" : tImg.toFixed(1) + "ヶ月");
      setReadout("ct_lead", tCt !== null && tImg !== null ? (tImg - tCt).toFixed(1) + "ヶ月先行" : "—");
    }
    bindSlider("ct_res", (v) => Math.pow(10, v).toExponential(1) + "%", (v) => { state.resid = v; draw(); });
    bindSlider("ct_gr", (v) => v.toFixed(2), (v) => { state.growth = v; draw(); });
    bindSlider("ct_lod", (v) => Math.pow(10, v).toFixed(3) + "%", (v) => { state.lod = v; draw(); });
    draw();
  };

  // 44. マルチがん早期検出（MCED） -----------------------------------------------------
  W.mced = function (container) {
    const state = { prev: 0.5, sens: 60, spec: 99.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mc_prev", "対象集団のがん有病率", 0.1, 30, 0.1, state.prev, (v) => v.toFixed(1) + "%")}
        ${sliderRow("mc_sens", "感度", 20, 95, 1, state.sens, (v) => v + "%")}
        ${sliderRow("mc_spec", "特異度", 95, 99.9, 0.1, state.spec, (v) => v.toFixed(1) + "%")}
      </div>
      <div class="widget-stage"><div id="mc_host"></div></div>
      ${readoutRow([{ id: "mc_ppv", label: "陽性的中率 (PPV)", value: "—" }, { id: "mc_npv", label: "陰性的中率 (NPV)", value: "—" }, { id: "mc_n", label: "陽性者数 / 1万人", value: "—" }])}
      <p class="widget-note">1万人を1マス＝50人の格子で表しています。<b>感度・特異度を固定したまま有病率だけを動かす</b>と、陽性的中率が桁で変わることが分かります。症例対照デザインで算出されたPPVを検診集団に持ち込んではいけない理由がここにあります。</p>`;
    function draw() {
      const Wd = 660, H = 256, s = lightPanel(document.getElementById("mc_host"), Wd, H, "#ffffff");
      const N = 10000, p = state.prev / 100, se = state.sens / 100, sp = state.spec / 100;
      const dis = N * p, well = N - dis;
      const TP = dis * se, FN = dis - TP, FP = well * (1 - sp), TN = well - FP;
      const ppv = TP / Math.max(1e-9, TP + FP), npv = TN / Math.max(1e-9, TN + FN);
      txt(s, 14, 20, "1万人に検査を実施したときの内訳（1マス＝50人）", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      const cols = 40, rows = 5, cw = (Wd - 60) / cols, chh = 13;
      const cells = [];
      const push = (n, c) => { for (let i = 0; i < Math.round(n / 50); i++) cells.push(c); };
      push(TP, RED); push(FN, "#fbbf24"); push(FP, "#93c5fd"); push(TN, "#e3e7ef");
      for (let i = 0; i < cols * rows; i++) {
        const c = cells[i] || "#e3e7ef";
        add(s, "rect", { x: 30 + (i % cols) * cw, y: 40 + Math.floor(i / cols) * (chh + 2), width: cw - 2, height: chh, rx: 2, fill: c });
      }
      const leg = [["真陽性（がんあり・陽性）", RED, TP], ["偽陰性（がんあり・陰性）", "#fbbf24", FN], ["偽陽性（がんなし・陽性）", "#93c5fd", FP], ["真陰性", "#e3e7ef", TN]];
      leg.forEach((L, i) => {
        const yy = 130 + i * 20;
        add(s, "rect", { x: 30, y: yy - 9, width: 12, height: 12, rx: 2, fill: L[1] });
        txt(s, 48, yy + 1, L[0] + "： " + Math.round(L[2]).toLocaleString() + " 人", { fill: INK, "font-size": 11 });
      });
      // PPV bar
      const bx = 330, bw = Wd - bx - 40, byy = 138;
      txt(s, bx, byy - 10, "陽性と判定された人の内訳", { fill: INK, "font-weight": 700, "font-size": 11.5 });
      add(s, "rect", { x: bx, y: byy, width: bw, height: 30, rx: 5, fill: "#93c5fd" });
      add(s, "rect", { x: bx, y: byy, width: bw * ppv, height: 30, rx: 5, fill: RED });
      txt(s, bx + 8, byy + 20, "真のがん " + (ppv * 100).toFixed(1) + "%", { fill: "#ffffff", "font-weight": 700, "font-size": 11.5 });
      txt(s, bx + bw - 8, byy + 20, "偽陽性 " + ((1 - ppv) * 100).toFixed(1) + "%", { fill: "#1e3a8a", "font-weight": 700, "font-size": 11.5, "text-anchor": "end" });
      txt(s, bx, byy + 52, "陽性者 " + Math.round(TP + FP).toLocaleString() + " 人に精査（画像・内視鏡）が必要", { fill: MUTED, "font-size": 11 });
      txt(s, bx, byy + 70, "うち " + Math.round(FP).toLocaleString() + " 人はがんではない", { fill: RED, "font-size": 11, "font-weight": 700 });
      txt(s, bx, byy + 96, "見逃し（偽陰性）" + Math.round(FN).toLocaleString() + " 人", { fill: "#b45309", "font-size": 11, "font-weight": 700 });
      setReadout("mc_ppv", (ppv * 100).toFixed(1) + "%");
      setReadout("mc_npv", (npv * 100).toFixed(2) + "%");
      setReadout("mc_n", Math.round(TP + FP).toLocaleString());
    }
    bindSlider("mc_prev", (v) => v.toFixed(1) + "%", (v) => { state.prev = v; draw(); });
    bindSlider("mc_sens", (v) => v + "%", (v) => { state.sens = v; draw(); });
    bindSlider("mc_spec", (v) => v.toFixed(1) + "%", (v) => { state.spec = v; draw(); });
    draw();
  };

  // 45. フルスペクトラムフローサイトメトリー -----------------------------------------
  W.spectralflow = function (container) {
    const state = { af: 60, unmixAF: "on", mode: "spectral" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("sf_mode", "計測方式", [{ v: "conv", label: "従来型（1色素1検出器＋補正）" }, { v: "spectral", label: "フルスペクトラム" }], "spectral")}
        ${segRow("sf_af", "自家蛍光の扱い", [{ v: "off", label: "アンミキシングに含めない" }, { v: "on", label: "独立成分として分離する" }], "on")}
        ${sliderRow("sf_afl", "細胞の自家蛍光の強さ", 0, 100, 5, state.af, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="sf_host"></div></div>
      ${readoutRow([{ id: "sf_sep", label: "PD-1陽性集団の分離度", value: "—" }, { id: "sf_pos", label: "PD-1陽性率の見かけ", value: "—" }, { id: "sf_ch", label: "使用検出器数", value: "—" }])}
      <p class="widget-note">左は検出器チャンネルごとの蛍光スペクトル、右はアンミキシング後の2次元ドットプロットです。<b>自家蛍光を独立成分として分離しないと</b>、陰性集団まで右へ押し上げられ、弱い抗原（PD-1）の陽性集団が判定できなくなります。</p>`;
    function draw() {
      const Wd = 660, H = 300, s = lightPanel(document.getElementById("sf_host"), Wd, H, "#ffffff");
      const spectral = state.mode === "spectral";
      const nCh = spectral ? 48 : 8;
      const px0 = 40, px1 = 320, py0 = 44, py1 = 168;
      txt(s, 14, 20, spectral ? "スペクトルシグネチャ（48検出器）" : "従来型：8検出器のピーク値のみ", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      add(s, "line", { x1: px0, x2: px1, y1: py1, y2: py1, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: px0, x2: px0, y1: py0, y2: py1, stroke: "#c7cce0", "stroke-width": 1.2 });
      const dyes = [{ n: "BV421", mu: 0.13, sd: 0.075, c: "#6366f1" }, { n: "BV480", mu: 0.22, sd: 0.09, c: "#22d3ee" }, { n: "FITC", mu: 0.38, sd: 0.085, c: "#16a34a" }, { n: "PE", mu: 0.52, sd: 0.08, c: ORANGE }, { n: "APC", mu: 0.74, sd: 0.085, c: RED }];
      const afl = state.af / 100;
      dyes.forEach((d) => {
        const pts = [];
        for (let i = 0; i <= nCh; i++) {
          const f = i / nCh;
          const v = Math.exp(-((f - d.mu) ** 2) / (2 * d.sd * d.sd)) + 0.22 * Math.exp(-((f - d.mu - 0.16) ** 2) / (2 * 0.11 * 0.11));
          pts.push([px0 + f * (px1 - px0), py1 - clamp(v, 0, 1.2) * (py1 - py0) * 0.82]);
        }
        add(s, "path", { d: pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "), fill: "none", stroke: d.c, "stroke-width": spectral ? 2 : 1.2, opacity: spectral ? 0.95 : 0.35 });
        if (!spectral) add(s, "circle", { cx: px0 + d.mu * (px1 - px0), cy: py1 - (py1 - py0) * 0.82, r: 3.6, fill: d.c });
      });
      if (afl > 0.02) {
        const pts = [];
        for (let i = 0; i <= nCh; i++) {
          const f = i / nCh;
          const v = afl * (0.85 * Math.exp(-((f - 0.3) ** 2) / (2 * 0.2 * 0.2)) + 0.35 * Math.exp(-((f - 0.62) ** 2) / (2 * 0.16 * 0.16)));
          pts.push([px0 + f * (px1 - px0), py1 - clamp(v, 0, 1.2) * (py1 - py0) * 0.82]);
        }
        add(s, "path", { d: pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "), fill: "none", stroke: "#a16207", "stroke-width": 2.4, "stroke-dasharray": "6 3" });
        txt(s, px0 + 6, py0 + 10, "自家蛍光（破線）", { fill: "#a16207", "font-weight": 700 });
      }
      txt(s, (px0 + px1) / 2, py1 + 18, "検出器チャンネル（波長 →）", { fill: MUTED, "text-anchor": "middle" });
      dyes.forEach((d, i) => {
        const lx = px0 + (i % 3) * 96, ly = py1 + 42 + Math.floor(i / 3) * 18;
        add(s, "rect", { x: lx, y: ly - 8, width: 11, height: 11, rx: 2, fill: d.c });
        txt(s, lx + 16, ly + 1, d.n, { fill: INK, "font-size": 10.5 });
      });
      txt(s, px0, py1 + 96, spectral
        ? "スペクトル全体の形状で分解するため、ピークが近い色素も区別できます。"
        : "ピーク値のみを使うため、近接ピークの色素は補正誤差が累積します。", { fill: MUTED, "font-size": 10.5 });

      // right: dot plot
      const qx0 = 400, qx1 = Wd - 34, qy0 = 44, qy1 = 244;
      add(s, "rect", { x: qx0, y: qy0, width: qx1 - qx0, height: qy1 - qy0, fill: "#fbfcfe", stroke: "#dde2ee" });
      txt(s, qx0, qy0 - 10, "アンミキシング後：CD8 vs PD-1", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      const afLeak = state.unmixAF === "on" ? 0.04 * afl : (spectral ? 0.55 : 0.8) * afl;
      const spread = spectral ? 0.055 : 0.1;
      const r = rng(31 + Math.round(state.af) * 7 + (state.unmixAF === "on" ? 1 : 2) * 999 + (spectral ? 5 : 11));
      const gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
      let posSeen = 0, tot = 0;
      for (let i = 0; i < 700; i++) {
        const isPos = r() < 0.22;
        const cd8 = 0.62 + gauss() * 0.09;
        let pd1 = (isPos ? 0.58 : 0.22) + gauss() * spread + afLeak;
        pd1 = clamp(pd1, 0.02, 0.98);
        const px = qx0 + clamp(cd8, 0.02, 0.98) * (qx1 - qx0);
        const py = qy1 - pd1 * (qy1 - qy0);
        add(s, "circle", { cx: px, cy: py, r: 1.7, fill: isPos ? RED : "#64748b", opacity: 0.6 });
        tot++; if (pd1 > 0.42) posSeen++;
      }
      const sep = clamp((0.58 - 0.22) / (spread + 0.5 * afLeak + 0.005), 0, 20);
      add(s, "line", { x1: qx0, x2: qx1, y1: qy1 - 0.42 * (qy1 - qy0), y2: qy1 - 0.42 * (qy1 - qy0), stroke: INK, "stroke-width": 1.2, "stroke-dasharray": "4 3" });
      txt(s, qx0 + 6, qy1 - 0.42 * (qy1 - qy0) - 5, "PD-1 陽性ゲート", { fill: INK, "font-size": 10 });
      txt(s, (qx0 + qx1) / 2, qy1 + 18, "CD8 →", { fill: MUTED, "text-anchor": "middle" });
      setReadout("sf_sep", sep > 3.5 ? "良好 (" + sep.toFixed(1) + ")" : sep > 1.8 ? "不十分 (" + sep.toFixed(1) + ")" : "分離不能 (" + sep.toFixed(1) + ")");
      setReadout("sf_pos", ((posSeen / tot) * 100).toFixed(1) + "%（真値 22%）");
      setReadout("sf_ch", nCh + " ch");
    }
    bindSeg("sf_mode", (v) => { state.mode = v; draw(); });
    bindSeg("sf_af", (v) => { state.unmixAF = v; draw(); });
    bindSlider("sf_afl", (v) => v + "%", (v) => { state.af = v; draw(); });
    draw();
  };

  // 46. 患者由来オルガノイド薬剤感受性 ---------------------------------------------
  W.pdodrug = function (container) {
    const state = { conc: 0.5, cutoff: 1.0 };
    const pts = [
      { id: "患者A", ic50: 0.12, resp: "PR", c: GREEN },
      { id: "患者B", ic50: 0.45, resp: "PR", c: GREEN },
      { id: "患者C", ic50: 1.8, resp: "SD", c: ORANGE },
      { id: "患者D", ic50: 6.5, resp: "PD", c: RED },
      { id: "患者E", ic50: 12.0, resp: "PD", c: RED },
      { id: "患者F", ic50: 0.9, resp: "PD", c: RED },
    ];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("pd_c", "薬剤濃度 log10(μM)", -2, 1.5, 0.1, Math.log10(state.conc), (v) => Math.pow(10, v).toFixed(2) + " μM")}
        ${sliderRow("pd_k", "感受性ありと判定するIC50カットオフ (μM)", 0.1, 10, 0.1, state.cutoff, (v) => v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="pd_host"></div></div>
      ${readoutRow([{ id: "pd_acc", label: "臨床効果との一致率", value: "—" }, { id: "pd_sens", label: "感度（PRを感受性と判定）", value: "—" }, { id: "pd_spec", label: "特異度（PDを耐性と判定）", value: "—" }])}
      <p class="widget-note">6例の患者由来オルガノイドの用量反応曲線。線の色は<b>実際の臨床効果</b>（緑＝PR、橙＝SD、赤＝PD）です。カットオフを動かすと一致率が変わりますが、<b>同じデータ上でカットオフを最適化すれば性能は必ず良く見えます</b>。患者Fのような不一致例（in vitro感受性ありだが臨床PD）にも注目してください。</p>`;
    function draw() {
      const host = document.getElementById("pd_host");
      const ctx = CK.plot(host, { width: 660, height: 320, margin: { top: 18, right: 130, bottom: 44, left: 62 }, xDomain: [-2, 1.5], yDomain: [0, 110], xTicks: 7, yTicks: 5, xLabel: "薬剤濃度 log10(μM)", yLabel: "生存細胞率 (%)", xFmt: (v) => v.toFixed(1), yFmt: (v) => v.toFixed(0) });
      const lc = Math.log10(state.conc);
      const labels = [];
      pts.forEach((p) => {
        const curve = [];
        for (let x = -2; x <= 1.5; x += 0.05) {
          const y = 100 / (1 + Math.pow(10, (x - Math.log10(p.ic50)) * 1.3));
          curve.push([x, y]);
        }
        CK.line(ctx, curve, { stroke: p.c, "stroke-width": 2.2, opacity: 0.9 });
        const yAt = 100 / (1 + Math.pow(10, (lc - Math.log10(p.ic50)) * 1.3));
        CK.dot(ctx, lc, yAt, { r: 5, fill: p.c, opacity: 1, stroke: "#fff", "stroke-width": 1.4 });
        labels.push({ p, yAt, py: ctx.y(yAt) });
      });
      // ラベルの重なりを避けて上から順に最小間隔を確保する
      labels.sort((a, b) => a.py - b.py);
      const GAP = 17;
      for (let i = 1; i < labels.length; i++) if (labels[i].py - labels[i - 1].py < GAP) labels[i].py = labels[i - 1].py + GAP;
      const overflow = labels[labels.length - 1].py - (ctx.margin.top + ctx.h);
      if (overflow > 0) labels.forEach((L) => (L.py -= overflow));
      labels.forEach((L) => {
        CK.line(ctx, [[lc, L.yAt], [1.5, L.yAt]], { stroke: L.p.c, "stroke-width": 0.8, opacity: 0.35, "stroke-dasharray": "2 3" });
        CK.textPx(ctx, ctx.margin.left + ctx.w + 8, L.py + 4, L.p.id + " " + L.p.resp + " " + L.yAt.toFixed(0) + "%", { fill: L.p.c, "font-size": 10.5, "font-weight": 700 });
      });
      CK.vline(ctx, lc, { stroke: INK, "stroke-width": 1.6, "stroke-dasharray": "" });
      CK.vline(ctx, Math.log10(state.cutoff), { stroke: PURPLE, "stroke-width": 1.8 });
      CK.textPx(ctx, ctx.x(Math.log10(state.cutoff)) + 4, ctx.margin.top + 12, "IC50カットオフ", { fill: PURPLE, "font-size": 10.5, "font-weight": 700 });
      CK.hline(ctx, 50, { stroke: "#c7cce0" });
      let tp = 0, fp = 0, tn = 0, fn = 0, agree = 0;
      pts.forEach((p) => {
        const predSens = p.ic50 <= state.cutoff;
        const clinBenefit = p.resp === "PR";
        if (predSens && clinBenefit) tp++;
        else if (predSens && !clinBenefit) fp++;
        else if (!predSens && clinBenefit) fn++;
        else tn++;
        if (predSens === clinBenefit) agree++;
      });
      setReadout("pd_acc", ((agree / pts.length) * 100).toFixed(0) + "% (" + agree + "/" + pts.length + ")");
      setReadout("pd_sens", tp + fn > 0 ? ((tp / (tp + fn)) * 100).toFixed(0) + "%" : "—");
      setReadout("pd_spec", tn + fp > 0 ? ((tn / (tn + fp)) * 100).toFixed(0) + "%" : "—");
    }
    bindSlider("pd_c", (v) => Math.pow(10, v).toFixed(2) + " μM", (v) => { state.conc = Math.pow(10, v); draw(); });
    bindSlider("pd_k", (v) => v.toFixed(1), (v) => { state.cutoff = v; draw(); });
    draw();
  };

  // 47. Organ-on-a-chip ------------------------------------------------------------
  W.organchip = function (container) {
    const state = { mode: "flow2", dose: 40 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("oc_m", "培養条件", [{ v: "static", label: "静置ウェル" }, { v: "flow", label: "灌流あり" }, { v: "flow2", label: "灌流＋周期的伸展" }], "flow2")}
        ${sliderRow("oc_d", "薬剤曝露量（公称濃度の相対値）", 0, 100, 5, state.dose, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="oc_host"></div></div>
      ${readoutRow([{ id: "oc_teer", label: "TEER（バリア機能）", value: "—" }, { id: "oc_perm", label: "デキストラン透過係数", value: "—" }, { id: "oc_tox", label: "毒性の検出", value: "—" }])}
      <p class="widget-note">上段は肺胞チップの断面（上皮／多孔質膜／内皮）。灌流と周期的伸展を加えると<b>バリア機能（TEER）が成熟し</b>、同じ薬剤でも毒性の現れ方が変わります。静置培養では検出できない毒性が、生理的条件で初めて見えることを確認してください。</p>`;
    function draw() {
      const Wd = 660, H = 300, s = lightPanel(document.getElementById("oc_host"), Wd, H, "#ffffff");
      const flow = state.mode !== "static", stretch = state.mode === "flow2";
      const cx0 = 40, cx1 = Wd - 200, cy = 86, str = stretch ? 1.1 : 1.0;
      txt(s, 14, 20, "肺胞チップの断面", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      add(s, "rect", { x: cx0, y: cy - 34 * str, width: cx1 - cx0, height: 26 * str, rx: 3, fill: "#c7e6f7" });
      add(s, "rect", { x: cx0, y: cy - 4, width: cx1 - cx0, height: 5, fill: "#94a3b8" });
      add(s, "rect", { x: cx0, y: cy + 3, width: cx1 - cx0, height: 26 * str, rx: 3, fill: "#fbcfe8" });
      txt(s, cx0 + 6, cy - 34 * str - 6, "肺胞上皮（気相側）", { fill: "#0369a1", "font-weight": 700 });
      txt(s, cx0 + 6, cy + 3 + 26 * str + 13, "血管内皮（灌流側）", { fill: "#9d174d", "font-weight": 700 });
      const nCell = 22;
      for (let i = 0; i < nCell; i++) {
        const px = cx0 + 8 + i * ((cx1 - cx0 - 16) / nCell);
        add(s, "circle", { cx: px, cy: cy - 34 * str + 13 * str, r: 5, fill: "#7dd3fc", stroke: "#0284c7", "stroke-width": stretch ? 1.4 : 0.8 });
        add(s, "circle", { cx: px, cy: cy + 3 + 13 * str, r: 5, fill: "#f9a8d4", stroke: "#db2777", "stroke-width": flow ? 1.4 : 0.8 });
      }
      if (flow) {
        for (let i = 0; i < 6; i++) {
          const px = cx0 + 30 + i * 74;
          add(s, "path", { d: `M ${px} ${cy + 3 + 26 * str + 26} l 34 0 m -8 -5 l 8 5 l -8 5`, fill: "none", stroke: "#db2777", "stroke-width": 2 });
        }
        txt(s, cx0, cy + 3 + 26 * str + 44, "灌流によるずり応力あり", { fill: "#9d174d", "font-weight": 700 });
      } else {
        txt(s, cx0, cy + 3 + 26 * str + 30, "静置：ずり応力なし・伸展なし", { fill: MUTED, "font-weight": 700 });
      }
      if (stretch) {
        add(s, "path", { d: `M ${cx1 + 8} ${cy - 12} l 16 0 m -6 -5 l 6 5 l -6 5`, fill: "none", stroke: "#b45309", "stroke-width": 2 });
        add(s, "path", { d: `M ${cx0 - 8} ${cy - 12} l -16 0 m 6 -5 l -6 5 l 6 5`, fill: "none", stroke: "#b45309", "stroke-width": 2 });
        txt(s, cx1 + 8, cy + 6, "周期的伸展", { fill: "#b45309", "font-weight": 700 });
      }
      // metrics
      const teerBase = state.mode === "static" ? 210 : state.mode === "flow" ? 620 : 980;
      const d = state.dose / 100;
      const sensitivity = state.mode === "static" ? 0.25 : state.mode === "flow" ? 0.6 : 1.0;
      const teer = teerBase * (1 - 0.72 * d * sensitivity);
      const perm = 0.4 + 5.6 * d * sensitivity * (state.mode === "static" ? 1.6 : 1);
      const bars = [
        { l: "TEER (Ω·cm²)", v: teer, max: 1100, c: BLUE, f: (x) => x.toFixed(0) },
        { l: "透過係数 (×10⁻⁶ cm/s)", v: perm, max: 10, c: ORANGE, f: (x) => x.toFixed(2) },
      ];
      const gx = 210, gw = Wd - gx - 120, gy = 208;
      bars.forEach((b, i) => {
        const yy = gy + i * 40;
        txt(s, gx - 10, yy + 4, b.l, { "text-anchor": "end", fill: INK, "font-size": 11 });
        add(s, "rect", { x: gx, y: yy - 10, width: gw, height: 20, rx: 4, fill: "#eef1f7" });
        add(s, "rect", { x: gx, y: yy - 10, width: gw * clamp(b.v / b.max, 0, 1), height: 20, rx: 4, fill: b.c });
        txt(s, gx + gw + 8, yy + 4, b.f(b.v), { fill: INK, "font-weight": 700, "font-size": 11 });
      });
      const drop = 1 - teer / teerBase;
      setReadout("oc_teer", teer.toFixed(0) + " Ω·cm²");
      setReadout("oc_perm", perm.toFixed(2));
      setReadout("oc_tox", drop > 0.4 ? "明瞭に検出" : drop > 0.15 ? "軽度に検出" : "検出できず");
    }
    bindSeg("oc_m", (v) => { state.mode = v; draw(); });
    bindSlider("oc_d", (v) => v + "%", (v) => { state.dose = v; draw(); });
    draw();
  };

  // 48. メンデルランダム化 -----------------------------------------------------------
  W.mendelianrand = function (container) {
    const state = { beta: 0.5, pleio: 0, nsnp: 24 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mr_b", "真の因果効果 β（曝露→アウトカム）", -0.4, 1.0, 0.05, state.beta, (v) => v.toFixed(2))}
        ${sliderRow("mr_p", "水平多面発現の強さ（方向性あり）", 0, 0.5, 0.02, state.pleio, (v) => v.toFixed(2))}
        ${sliderRow("mr_n", "操作変数に用いるSNP数", 8, 60, 2, state.nsnp)}
      </div>
      <div class="widget-stage"><div id="mr_host"></div></div>
      ${readoutRow([{ id: "mr_ivw", label: "IVW推定値", value: "—" }, { id: "mr_int", label: "MR-Egger切片", value: "—" }, { id: "mr_v", label: "除外制約の判定", value: "—" }])}
      <p class="widget-note">各点が1つのSNP。横軸がそのSNPの<b>曝露</b>への効果、縦軸が<b>アウトカム</b>への効果です。青線が原点を通るIVW推定、紫線が切片を自由にしたMR-Egger回帰。<b>水平多面発現を強めると紫線の切片が0からずれ、青線の傾きが真の因果効果からバイアスします</b>。</p>`;
    function draw() {
      const host = document.getElementById("mr_host");
      const ctx = CK.plot(host, { width: 660, height: 320, margin: { top: 18, right: 26, bottom: 46, left: 66 }, xDomain: [0, 0.5], yDomain: [-0.2, 0.6], xTicks: 5, yTicks: 4, xLabel: "SNPの曝露への効果量 (β_exposure)", yLabel: "SNPのアウトカムへの効果量", xFmt: (v) => v.toFixed(2), yFmt: (v) => v.toFixed(2) });
      const r = rng(101 + state.nsnp * 3 + Math.round(state.pleio * 100) * 17 + Math.round(state.beta * 100) * 7);
      const gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
      const xs = [], ys = [], ws = [];
      for (let i = 0; i < state.nsnp; i++) {
        const bx = 0.05 + r() * 0.42;
        const by = state.beta * bx + state.pleio * (0.4 + 0.6 * r()) * 0.25 + gauss() * 0.028;
        xs.push(bx); ys.push(by); ws.push(1 / (0.028 * 0.028));
        CK.line(ctx, [[bx, by - 0.045], [bx, by + 0.045]], { stroke: "#c3cbe0", "stroke-width": 1.2 });
        CK.line(ctx, [[bx - 0.014, by], [bx + 0.014, by]], { stroke: "#c3cbe0", "stroke-width": 1.2 });
        CK.dot(ctx, bx, by, { r: 4, fill: BLUE, opacity: 0.85 });
      }
      // IVW: through origin
      let num = 0, den = 0;
      for (let i = 0; i < xs.length; i++) { num += ws[i] * xs[i] * ys[i]; den += ws[i] * xs[i] * xs[i]; }
      const ivw = num / den;
      // MR-Egger: OLS with intercept
      const eg = CK.linreg(xs, ys);
      CK.line(ctx, [[0, 0], [0.5, ivw * 0.5]], { stroke: BLUE, "stroke-width": 2.6 });
      CK.line(ctx, [[0, eg.intercept], [0.5, eg.intercept + eg.slope * 0.5]], { stroke: PURPLE, "stroke-width": 2.4, "stroke-dasharray": "7 4" });
      CK.line(ctx, [[0, 0], [0.5, state.beta * 0.5]], { stroke: GREEN, "stroke-width": 1.6, "stroke-dasharray": "3 4" });
      CK.hline(ctx, 0, { stroke: "#c7cce0" });
      CK.dot(ctx, 0, eg.intercept, { r: 5.5, fill: PURPLE, opacity: 1, stroke: "#fff", "stroke-width": 1.4 });
      CK.textPx(ctx, ctx.margin.left + 10, ctx.margin.top + 14, "青：IVW（原点通過）　紫破線：MR-Egger　緑点線：真の因果効果", { fill: "#555f75", "font-size": 10.5, "font-weight": 700 });
      setReadout("mr_ivw", CK.fmt(ivw, 3) + "（真値 " + state.beta.toFixed(2) + "）");
      setReadout("mr_int", CK.fmt(eg.intercept, 3));
      setReadout("mr_v", Math.abs(eg.intercept) > 0.02 ? "切片が0から乖離：水平多面発現を疑う" : "切片はほぼ0：除外制約と矛盾しない");
    }
    bindSlider("mr_b", (v) => v.toFixed(2), (v) => { state.beta = v; draw(); });
    bindSlider("mr_p", (v) => v.toFixed(2), (v) => { state.pleio = v; draw(); });
    bindSlider("mr_n", (v) => v, (v) => { state.nsnp = v; draw(); });
    draw();
  };

  // 49. ターゲットトライアル・エミュレーション -------------------------------------
  W.targettrial = function (container) {
    const state = { design: "naive", wait: 4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("tt_d", "解析デザイン", [{ v: "naive", label: "素朴な解析（手術日から追跡）" }, { v: "tte", label: "target trial emulation" }], "naive")}
        ${sliderRow("tt_w", "術後補助療法の開始までの待機（月）", 0, 12, 0.5, state.wait, (v) => v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="tt_host"></div></div>
      ${readoutRow([{ id: "tt_hr", label: "見かけのハザード比", value: "—" }, { id: "tt_it", label: "不死時間の合計", value: "—" }, { id: "tt_j", label: "判定", value: "—" }])}
      <p class="widget-note">上段は6人分のタイムライン。青が対照、緑が補助療法群、<b>赤い網かけが不死時間</b>（治療開始まで＝イベントが起きていないことが確定した期間）です。素朴な解析ではこの期間が治療群だけに加算され、真の効果がなくても治療が有効に見えます。</p>`;
    function draw() {
      const Wd = 660, H = 300, s = lightPanel(document.getElementById("tt_host"), Wd, H, "#ffffff");
      const tte = state.design === "tte";
      const maxT = 48, x0 = 118, x1 = Wd - 40;
      const X = (t) => x0 + (t / maxT) * (x1 - x0);
      txt(s, 14, 20, tte ? "時点ゼロをそろえた追跡（target trial emulation）" : "素朴な解析：手術日から追跡開始", { "font-weight": 700, fill: INK, "font-size": 11.5 });
      // 真の効果はゼロ：治療群も対照群も「時点ゼロ以降」の生存時間は同じ 9/14/23ヶ月
      const patients = [
        { arm: 1, k: 1.0, post: 9 }, { arm: 1, k: 1.5, post: 14 }, { arm: 1, k: 0.6, post: 23 },
        { arm: 0, k: 0, post: 9 }, { arm: 0, k: 0, post: 14 }, { arm: 0, k: 0, post: 23 },
      ].map((p) => ({ ...p, start: p.k * state.wait, ev: p.k * state.wait + p.post }));
      let immortal = 0;
      patients.forEach((p, i) => {
        const yy = 46 + i * 26;
        const treated = p.arm === 1;
        const startT = p.start;
        const t0 = tte ? startT : 0;
        txt(s, 14, yy + 4, treated ? "補助療法あり #" + (i + 1) : "対照 #" + (i + 1), { fill: treated ? GREEN : BLUE, "font-weight": 700, "font-size": 10.5 });
        add(s, "line", { x1: X(0), x2: X(maxT), y1: yy, y2: yy, stroke: "#eceff6", "stroke-width": 12, "stroke-linecap": "round" });
        if (treated && !tte && startT > 0) {
          add(s, "rect", { x: X(0), y: yy - 6, width: X(startT) - X(0), height: 12, fill: RED, opacity: 0.3 });
          immortal += startT;
        }
        add(s, "line", { x1: X(t0), x2: X(p.ev), y1: yy, y2: yy, stroke: treated ? GREEN : BLUE, "stroke-width": 6, "stroke-linecap": "round" });
        add(s, "circle", { cx: X(p.ev), cy: yy, r: 4.5, fill: "#1b2233" });
        if (treated && startT > 0) add(s, "line", { x1: X(startT), x2: X(startT), y1: yy - 10, y2: yy + 10, stroke: "#166534", "stroke-width": 2 });
      });
      add(s, "line", { x1: X(0), x2: X(maxT), y1: 210, y2: 210, stroke: "#c7cce0", "stroke-width": 1.2 });
      for (let t = 0; t <= maxT; t += 8) {
        add(s, "line", { x1: X(t), x2: X(t), y1: 210, y2: 215, stroke: "#c7cce0", "stroke-width": 1.2 });
        txt(s, X(t), 228, t + "", { fill: MUTED, "text-anchor": "middle", "font-size": 10 });
      }
      txt(s, (x0 + x1) / 2, 246, "手術からの月数", { fill: MUTED, "text-anchor": "middle" });
      txt(s, 14, 210, "縦線＝治療開始", { fill: "#166534", "font-size": 10 });
      if (!tte) txt(s, 14, 226, "赤網＝不死時間", { fill: RED, "font-size": 10 });

      // 見かけのHR（真の効果はゼロと仮定）
      const trtPT = patients.filter((p) => p.arm === 1).reduce((a, p) => a + (tte ? p.post : p.ev), 0);
      const ctlPT = patients.filter((p) => p.arm === 0).reduce((a, p) => a + p.ev, 0);
      const hr = (3 / trtPT) / (3 / ctlPT);
      txt(s, 14, 274, "真の治療効果は「なし（HR = 1.00）」と設定しています。", { fill: INK, "font-size": 11, "font-weight": 700 });
      txt(s, 350, 274, tte ? "時点ゼロをそろえると HR は 1 に戻ります。" : "不死時間の分だけ治療群の観察時間が水増しされます。", { fill: tte ? GREEN : RED, "font-size": 11, "font-weight": 700 });
      setReadout("tt_hr", hr.toFixed(2));
      setReadout("tt_it", immortal.toFixed(1) + " 人月");
      setReadout("tt_j", tte ? "不死時間バイアスなし" : hr < 0.92 ? "不死時間バイアスにより治療が有利に歪む" : "待機期間が短くバイアスは小さい");
    }
    bindSeg("tt_d", (v) => { state.design = v; draw(); });
    bindSlider("tt_w", (v) => v.toFixed(1), (v) => { state.wait = v; draw(); });
    draw();
  };

  // 50. ポリジェニックリスクスコア --------------------------------------------------
  W.prs = function (container) {
    const state = { pop: "eur", base: 8, view: "decile" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("pr_pop", "適用する祖先集団", [{ v: "eur", label: "欧州系（GWAS由来集団）" }, { v: "eas", label: "東アジア系" }, { v: "afr", label: "アフリカ系" }], "eur")}
        ${segRow("pr_v", "表示", [{ v: "dist", label: "スコア分布" }, { v: "decile", label: "十分位別の発症率" }], "decile")}
        ${sliderRow("pr_b", "集団のベースライン発症率", 1, 25, 1, state.base, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="pr_host"></div></div>
      ${readoutRow([{ id: "pr_auc", label: "PRS単独のAUC", value: "—" }, { id: "pr_or", label: "最上位10% 対 最下位10%", value: "—" }, { id: "pr_mid", label: "中間層（40-60%）の発症率", value: "—" }])}
      <p class="widget-note">祖先集団を切り替えると、同じPRSでも判別能が落ちます（<b>移植性の問題</b>）。十分位別の棒グラフは両端の差を強調しますが、<b>大多数を占める中間層の発症率はベースラインとほとんど変わりません</b>。この見え方の非対称性がPRSの図の読みどころです。</p>`;
    const SEP = { eur: 0.62, eas: 0.36, afr: 0.22 };
    function draw() {
      const host = document.getElementById("pr_host");
      const sep = SEP[state.pop];
      const auc = CK.normalCDF(sep / Math.SQRT2);
      const base = state.base / 100;
      if (state.view === "dist") {
        const ctx = CK.plot(host, { width: 660, height: 320, margin: { top: 18, right: 26, bottom: 46, left: 62 }, xDomain: [-4, 4], yDomain: [0, 0.45], xTicks: 8, yTicks: 4, xLabel: "ポリジェニックリスクスコア（標準化）", yLabel: "確率密度", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(2) });
        const ctrl = [], cas = [];
        for (let i = 0; i <= 120; i++) { const x = -4 + (i / 120) * 8; ctrl.push([x, CK.normalPDF(x, -sep / 2, 1)]); cas.push([x, CK.normalPDF(x, sep / 2, 1)]); }
        CK.area(ctx, ctrl, ctrl.map((p) => [p[0], 0]), { fill: BLUE, opacity: 0.16 });
        CK.area(ctx, cas, cas.map((p) => [p[0], 0]), { fill: RED, opacity: 0.16 });
        CK.line(ctx, ctrl, { stroke: BLUE, "stroke-width": 2.4 });
        CK.line(ctx, cas, { stroke: RED, "stroke-width": 2.4 });
        CK.textPx(ctx, ctx.margin.left + 8, ctx.margin.top + 14, "青：非発症者　赤：発症者", { fill: "#555f75", "font-size": 11, "font-weight": 700 });
        CK.textPx(ctx, ctx.margin.left + 8, ctx.margin.top + 30, "2つの分布はほぼ重なる＝個人予測は困難", { fill: MUTED, "font-size": 10.5 });
      } else {
        const ctx = CK.plot(host, { width: 660, height: 320, margin: { top: 18, right: 26, bottom: 50, left: 66 }, xDomain: [0, 10], yDomain: [0, Math.max(0.35, base * 3.4)], xTicks: 0, yTicks: 5, xLabel: "PRSの十分位（左＝低リスク）", yLabel: "発症率", yFmt: (v) => (v * 100).toFixed(0) + "%" });
        const rates = [];
        for (let d = 0; d < 10; d++) {
          const z = -1.645 + (d * 3.29) / 9; // 各十分位の代表スコア
          const rr = Math.exp(sep * z * 1.05);
          rates.push(base * rr);
        }
        const norm = base / (rates.reduce((a, b) => a + b, 0) / 10);
        rates.forEach((v, d) => {
          const y = v * norm;
          const c = d === 9 ? RED : d === 0 ? BLUE : "#9db0dd";
          CK.rectData(ctx, d + 0.12, 0, d + 0.88, y, { fill: c, rx: 3 });
          CK.textPx(ctx, ctx.x(d + 0.5), ctx.y(y) - 5, (y * 100).toFixed(1) + "%", { fill: INK, "font-size": 10, "text-anchor": "middle", "font-weight": 700 });
          CK.textPx(ctx, ctx.x(d + 0.5), ctx.margin.top + ctx.h + 15, String(d + 1), { fill: MUTED, "font-size": 10.5, "text-anchor": "middle" });
        });
        CK.hline(ctx, base, { stroke: "#2c3448", "stroke-width": 1.6 });
        CK.textPx(ctx, ctx.margin.left + 6, ctx.y(base) - 6, "集団平均の発症率", { fill: INK, "font-size": 10.5, "font-weight": 700 });
        const top = rates[9] * norm, bot = rates[0] * norm, mid = (rates[4] + rates[5]) / 2 * norm;
        setReadout("pr_or", (top / bot).toFixed(1) + " 倍");
        setReadout("pr_mid", (mid * 100).toFixed(1) + "%（平均 " + (base * 100).toFixed(0) + "%）");
      }
      const rates2 = [];
      for (let d = 0; d < 10; d++) rates2.push(base * Math.exp(sep * (-1.645 + (d * 3.29) / 9) * 1.05));
      const norm2 = base / (rates2.reduce((a, b) => a + b, 0) / 10);
      setReadout("pr_auc", auc.toFixed(3) + (state.pop === "eur" ? "" : "（欧州系比 低下）"));
      setReadout("pr_or", ((rates2[9] * norm2) / (rates2[0] * norm2)).toFixed(1) + " 倍");
      setReadout("pr_mid", (((rates2[4] + rates2[5]) / 2 * norm2) * 100).toFixed(1) + "%（平均 " + (base * 100).toFixed(0) + "%）");
    }
    bindSeg("pr_pop", (v) => { state.pop = v; draw(); });
    bindSeg("pr_v", (v) => { state.view = v; draw(); });
    bindSlider("pr_b", (v) => v + "%", (v) => { state.base = v; draw(); });
    draw();
  };
})();

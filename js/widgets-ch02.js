/* 第2章：核酸解析 — 13 interactive widgets (gels, PCR curves, FISH, EMSA) */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }

  // 1. Bioanalyzer / RIN ----------------------------------------------------
  W.bioanalyzer = function (container) {
    const state = { deg: 0.15 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ba_d", "RNAの分解度", 0, 1, 0.05, state.deg, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ba_plot"></div></div>
      ${readoutRow([{ id: "ba_rin", label: "RIN値", value: "—" }, { id: "ba_q", label: "RNA-seq適性", value: "—" }])}
      <p class="widget-note">エレクトロフェログラム（横軸≒断片長、縦軸=蛍光）。分解が進むと<b>28Sピークが縮み、低分子量の分解産物が増え</b>、RIN値が下がります。RNA-seqにはRIN≧7が望ましい。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ba_plot"), {
        width: 560, height: 280, margin: { top: 16, right: 16, bottom: 40, left: 44 },
        xDomain: [18, 66], yDomain: [0, 1.2], xTicks: 4, yTicks: 3, grid: false,
        yFmt: () => "", xLabel: "泳動時間 (秒) ≒ 断片長 →", yLabel: "蛍光強度",
      });
      const d = state.deg;
      function g(x, mu, sig, amp) { return amp * Math.exp(-(((x - mu) / sig) ** 2)); }
      const pts = [];
      for (let x = 18; x <= 66; x += 0.4) {
        let y = g(x, 25, 1.1, 0.9);                       // marker
        y += g(x, 44, 2.0, 0.62 * (1 - d * 0.45));        // 18S
        y += g(x, 51, 2.2, 0.98 * (1 - d * 0.92));        // 28S
        y += (0.02 + d * 0.5) * Math.exp(-(((x - 34) / 8) ** 2)); // degradation products
        pts.push([x, y]);
      }
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: "#f5a623", opacity: 0.14 });
      CK.line(ctx, pts, { stroke: "#f5a623", "stroke-width": 2 });
      CK.textPx(ctx, ctx.x(25), ctx.y(0.92) - 4, "マーカー", { "font-size": 9.5, fill: "#8a93a8", "text-anchor": "middle" });
      if (d < 0.7) { CK.textPx(ctx, ctx.x(44), ctx.y(0.62 * (1 - d * 0.45)) - 4, "18S", { "font-size": 10, fill: "#616a7d", "text-anchor": "middle" }); CK.textPx(ctx, ctx.x(51), ctx.y(0.98 * (1 - d * 0.92)) - 4, "28S", { "font-size": 10, fill: "#616a7d", "text-anchor": "middle" }); }
      const rin = Math.max(1.5, Math.min(10, 10 - d * 7.6));
      setReadout("ba_rin", rin.toFixed(1));
      setReadout("ba_q", rin >= 7 ? "良好 ✓ (RIN≧7)" : rin >= 5 ? "中等度" : "不良");
    }
    bindSlider("ba_d", (v) => (v * 100).toFixed(0) + "%", (v) => { state.deg = v; draw(); });
    draw();
  };

  // shared: draw a gel/blot dark panel; migration maps bp (log) to y --------
  function bpY(size, top, bot) {
    const lo = Math.log10(50), hi = Math.log10(3000);
    const t = (hi - Math.log10(Math.max(50, Math.min(3000, size)))) / (hi - lo);
    return top + t * (bot - top);
  }

  // 2. Agarose gel electrophoresis -----------------------------------------
  W.agarose = function (container) {
    const state = { size: 350 };
    const ladder = [2000, 1000, 700, 500, 300, 200, 100];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ag_s", "サンプルDNAの断片長 (bp)", 100, 2000, 10, state.size)}</div>
      <div class="widget-stage"><div id="ag_plot"></div></div>
      ${readoutRow([{ id: "ag_est", label: "推定サイズ", value: "—" }, { id: "ag_pos", label: "泳動位置", value: "—" }])}
      <p class="widget-note">上＝マイナス極、下＝プラス極。<b>短いDNAほど下まで速く泳動</b>されます。左のラダー（サイズマーカー）と比べてバンドのサイズを推定します。</p>`;
    function draw() {
      const W2 = 520, H2 = 300, top = 30, bot = 270, gelX = 90, gelW = 400;
      const s = stage(document.getElementById("ag_plot"), W2, H2);
      add(s, "rect", { x: gelX, y: top - 12, width: gelW, height: bot - top + 24, rx: 4, fill: "#0b1020" });
      add(s, "text", { x: gelX - 8, y: top - 2, "text-anchor": "end", "font-size": 9, fill: "#8a93a8", text: "(−)" });
      add(s, "text", { x: gelX - 8, y: bot + 8, "text-anchor": "end", "font-size": 9, fill: "#8a93a8", text: "(+)" });
      const lanes = [gelX + 60, gelX + 180, gelX + 280];
      // ladder
      ladder.forEach((bp) => {
        const y = bpY(bp, top, bot);
        add(s, "rect", { x: lanes[0] - 26, y: y - 2.5, width: 52, height: 5, rx: 2, fill: "#cfe3ff", opacity: 0.85 });
        add(s, "text", { x: lanes[0] - 34, y: y + 3, "text-anchor": "end", "font-size": 8.5, fill: "#8a93a8", text: bp });
      });
      add(s, "text", { x: lanes[0], y: top - 16, "text-anchor": "middle", "font-size": 9.5, fill: "#616a7d", text: "ラダー" });
      // sample band (glowing)
      const y = bpY(state.size, top, bot);
      add(s, "rect", { x: lanes[1] - 26, y: y - 3.5, width: 52, height: 7, rx: 3, fill: "#f5a623", opacity: 0.95 });
      add(s, "rect", { x: lanes[1] - 26, y: y - 6, width: 52, height: 12, rx: 4, fill: "#f5a623", opacity: 0.22 });
      add(s, "text", { x: lanes[1], y: top - 16, "text-anchor": "middle", "font-size": 9.5, fill: "#616a7d", text: "サンプル" });
      setReadout("ag_est", state.size + " bp");
      setReadout("ag_pos", state.size < 250 ? "下方（よく泳動）" : state.size > 900 ? "上方（あまり動かず）" : "中央付近");
    }
    bindSlider("ag_s", (v) => v, (v) => { state.size = v; draw(); });
    draw();
  };

  // 3. Southern / Northern blot ---------------------------------------------
  W.blot = function (container) {
    const state = { mode: "southern", amt: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("bl_m", "ブロット", [{ v: "southern", label: "サザン (DNA)" }, { v: "northern", label: "ノーザン (RNA)" }], state.mode)}
        ${sliderRow("bl_a", "レーン2の量（コピー数/発現量）", 0.2, 2, 0.1, state.amt, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="bl_plot"></div></div>
      ${readoutRow([{ id: "bl_probe", label: "プローブが検出", value: "—" }, { id: "bl_lc", label: "ローディング対照", value: "—" }])}
      <p class="widget-note">分離した核酸をメンブレンに転写し、標識プローブで特定の配列を検出。バンドの位置＝分子サイズ、<b>濃さ＝量</b>。ノーザンではrRNA等のローディング対照で各レーンのRNA量をそろえます。</p>`;
    function draw() {
      const W2 = 500, H2 = 300, top = 30, bot = 210, memX = 110, memW = 320;
      const s = stage(document.getElementById("bl_plot"), W2, H2);
      add(s, "rect", { x: memX, y: top - 12, width: memW, height: bot - top + 24, rx: 4, fill: "#0d1424" });
      const lanes = [memX + 70, memX + 160, memX + 250];
      const labs = ["対照", "sample", "sample'"];
      const bandSize = state.mode === "southern" ? 5000 : 1500;
      const y = state.mode === "southern" ? 90 : 130;
      const amts = [1.0, state.amt, 0.7];
      lanes.forEach((lx, i) => {
        add(s, "text", { x: lx, y: top - 16, "text-anchor": "middle", "font-size": 9, fill: "#616a7d", text: labs[i] });
        add(s, "rect", { x: lx - 26, y: y - 3.5, width: 52, height: 7, rx: 3, fill: "#7fd4ff", opacity: Math.min(0.95, 0.3 + amts[i] * 0.5) });
      });
      add(s, "text", { x: memX - 6, y: y + 3, "text-anchor": "end", "font-size": 9, fill: "#8a93a8", text: state.mode === "southern" ? "5 kb" : "1.5 kb" });
      // loading control row for northern
      if (state.mode === "northern") {
        const ly = 185;
        lanes.forEach((lx) => add(s, "rect", { x: lx - 26, y: ly - 3, width: 52, height: 6, rx: 3, fill: "#c3c9d8", opacity: 0.8 }));
        add(s, "text", { x: memX - 6, y: ly + 3, "text-anchor": "end", "font-size": 9, fill: "#8a93a8", text: "rRNA" });
        add(s, "text", { x: (memX + memW / 2), y: bot + 24, "text-anchor": "middle", "font-size": 9.5, fill: "#616a7d", text: "下段rRNA＝ローディング対照（各レーンのRNA量が同じか）" });
      }
      setReadout("bl_probe", state.mode === "southern" ? "特定DNA断片 (5 kb)" : "mRNA (1.5 kb)");
      setReadout("bl_lc", state.mode === "northern" ? "rRNA で確認" : "サザンでは制限酵素で規定");
    }
    bindSeg("bl_m", (v) => { state.mode = v; draw(); });
    bindSlider("bl_a", (v) => "×" + v.toFixed(1), (v) => { state.amt = v; draw(); });
    draw();
  };

  // 4. PCR exponential amplification ----------------------------------------
  W.pcr = function (container) {
    const state = { cyc: 25 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pc_c", "サイクル数", 0, 35, 1, state.cyc)}</div>
      <div class="widget-stage"><div id="pc_plot"></div></div>
      ${readoutRow([{ id: "pc_n", label: "サイクル数", value: "—" }, { id: "pc_amp", label: "増幅率（理論）", value: "—" }, { id: "pc_ph", label: "状態", value: "—" }])}
      <p class="widget-note">標的は毎サイクル約<b>2倍（指数関数的）</b>に増えます（縦軸は対数）。やがて試薬が尽きて<b>プラトー（飽和）</b>に達し、飽和後は量を比較できません。</p>`;
    function draw() {
      const plateau = 9; // log10 copies
      const ctx = CK.plot(document.getElementById("pc_plot"), {
        width: 560, height: 280, margin: { top: 16, right: 16, bottom: 40, left: 48 },
        xDomain: [0, 35], yDomain: [0, 10], xTicks: 5, yTicks: 5,
        xFmt: (v) => Math.round(v), yFmt: (v) => "10^" + Math.round(v), xLabel: "サイクル数", yLabel: "コピー数 (対数)",
      });
      const f = (c) => Math.min(plateau, c * Math.log10(2));
      const full = []; for (let c = 0; c <= 35; c += 0.5) full.push([c, f(c)]);
      CK.line(ctx, full, { stroke: "#d5d9e6", "stroke-width": 1.4, "stroke-dasharray": "4 3" });
      const rev = full.filter((p) => p[0] <= state.cyc);
      CK.line(ctx, rev, { stroke: "#f5a623", "stroke-width": 2.6 });
      CK.dot(ctx, state.cyc, f(state.cyc), { r: 5, fill: "#f5a623", stroke: "#fff", "stroke-width": 1.5 });
      CK.hline(ctx, plateau, { stroke: "#c7cce0", "stroke-dasharray": "2 4" });
      const saturated = state.cyc * Math.log10(2) >= plateau;
      setReadout("pc_n", state.cyc);
      setReadout("pc_amp", saturated ? "飽和" : "×2^" + state.cyc);
      setReadout("pc_ph", saturated ? "プラトー（比較不可）" : "指数増幅中");
    }
    bindSlider("pc_c", (v) => v, (v) => { state.cyc = v; draw(); });
    draw();
  };

  // 5. qPCR amplification curves + Ct ---------------------------------------
  W.qpcr = function (container) {
    const state = { tmpl: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("qp_t", "サンプルAの鋳型量（相対）", 0.05, 20, 0.05, state.tmpl, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="qp_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#f5a623"></span>サンプルA（可変）</span><span class="li"><span class="sw" style="background:#5b8bff"></span>標準（多）</span><span class="li"><span class="sw" style="background:#9aa2b6"></span>標準（少）</span></div></div>
      ${readoutRow([{ id: "qp_ct", label: "サンプルAのCt", value: "—" }, { id: "qp_note", label: "鋳型量とCt", value: "—" }])}
      <p class="widget-note">蛍光が閾値を超えるサイクル数が<b>Ct</b>。<b>鋳型が多いほど早く立ち上がりCtが小さく</b>なります。飽和後の量では定量できないため、立ち上がり(Ct)で定量します。</p>`;
    function mid(t) { return 26 - Math.log2(Math.max(0.02, t)) * 1.35; }
    function draw() {
      const thr = 0.2, plateau = 1;
      const ctx = CK.plot(document.getElementById("qp_plot"), {
        width: 560, height: 280, margin: { top: 16, right: 16, bottom: 40, left: 46 },
        xDomain: [0, 40], yDomain: [0, 1.15], xTicks: 4, yTicks: 3, grid: false,
        yFmt: () => "", xLabel: "サイクル数", yLabel: "蛍光強度",
      });
      const samples = [{ t: state.tmpl, c: "#f5a623", w: 2.6 }, { t: 8, c: "#5b8bff", w: 1.8 }, { t: 0.4, c: "#9aa2b6", w: 1.8 }];
      samples.forEach((sm) => {
        const m = mid(sm.t), pts = [];
        for (let c = 0; c <= 40; c += 0.4) pts.push([c, plateau / (1 + Math.exp(-(c - m) * 0.7))]);
        CK.line(ctx, pts, { stroke: sm.c, "stroke-width": sm.w });
      });
      CK.hline(ctx, thr, { stroke: "#e5484d", "stroke-width": 1.3, "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(thr) - 4, "閾値", { "font-size": 10, fill: "#e5484d", "font-weight": 700 });
      // Ct for sample A: where curve crosses thr => m + ln((1-thr)/thr)/0.7... solve
      const m = mid(state.tmpl);
      const ct = m + Math.log((plateau - thr) / thr) / 0.7;
      CK.vline(ctx, ct, { stroke: "#f5a623", "stroke-width": 1.2, "stroke-dasharray": "3 3" });
      setReadout("qp_ct", ct.toFixed(1));
      setReadout("qp_note", state.tmpl >= 4 ? "鋳型 多 → Ct 小（早い）" : state.tmpl <= 0.3 ? "鋳型 少 → Ct 大（遅い）" : "中間");
    }
    bindSlider("qp_t", (v) => "×" + v.toFixed(2), (v) => { state.tmpl = v; draw(); });
    draw();
  };

  // 6. Digital PCR (droplet partitioning + Poisson) -------------------------
  W.dpcr = function (container) {
    const cols = 26, rows = 15, Npart = cols * rows, rng = CK.makeRng(206);
    const u = []; for (let i = 0; i < Npart; i++) u.push(rng());
    const state = { conc: 0.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("dp_c", "核酸濃度（λ：1区画あたりの平均分子数）", 0.05, 4, 0.05, state.conc, (v) => v.toFixed(2))}</div>
      <div class="widget-stage"><div id="dp_plot"></div></div>
      ${readoutRow([{ id: "dp_pos", label: "陽性ドロップレット", value: "—" }, { id: "dp_frac", label: "陽性率", value: "—" }, { id: "dp_est", label: "推定コピー数（絶対）", value: "—" }])}
      <p class="widget-note">各区画に核酸が1個/0個になるよう分配しPCR。<b>陽性数からポアソン統計で絶対コピー数</b>を算出（標準曲線不要）。濃すぎて全部陽性になると定量できません。</p>`;
    function draw() {
      const p = 1 - Math.exp(-state.conc);
      const W2 = 500, H2 = 250, mL = 18, mT = 14, cw = (W2 - mL * 2) / cols, chh = (H2 - mT * 2 - 6) / rows;
      const s = stage(document.getElementById("dp_plot"), W2, H2);
      let pos = 0;
      for (let i = 0; i < Npart; i++) {
        const r = Math.floor(i / cols), c = i % cols, on = u[i] < p; if (on) pos++;
        add(s, "circle", { cx: mL + (c + 0.5) * cw, cy: mT + (r + 0.5) * chh, r: Math.min(cw, chh) * 0.38, fill: on ? "#f5a623" : "#26304a", opacity: on ? 0.95 : 1 });
      }
      const frac = pos / Npart;
      const lambdaEst = frac >= 0.999 ? Infinity : -Math.log(1 - frac);
      setReadout("dp_pos", pos + " / " + Npart);
      setReadout("dp_frac", (frac * 100).toFixed(0) + "%");
      setReadout("dp_est", frac >= 0.985 ? "定量不能（薄めて）" : Math.round(lambdaEst * Npart) + " コピー");
    }
    bindSlider("dp_c", (v) => v.toFixed(2), (v) => { state.conc = v; draw(); });
    draw();
  };

  // 7. Bisulfite (methylation lollipop) -------------------------------------
  W.bisulfite = function (container) {
    const rows = 12, cols = 16, rng = CK.makeRng(207);
    const jitter = []; for (let i = 0; i < rows * cols; i++) jitter.push(rng());
    const state = { m: 0.6 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("bs_m", "メチル化率", 0, 1, 0.05, state.m, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="bs_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#1b2233;border-radius:50%"></span>●メチル化</span><span class="li"><span class="sw" style="background:#fff;border:1px solid #c7cce0;border-radius:50%"></span>○非メチル化</span></div></div>
      ${readoutRow([{ id: "bs_pct", label: "全体のメチル化率", value: "—" }, { id: "bs_dim", label: "クローン × CpG", value: rows + " × " + cols }])}
      <p class="widget-note">行＝クローン（1DNA分子）、列＝CpG部位。<b>●＝メチル化、○＝非メチル化</b>。1分子ごとのメチル化パターンが読めます（バイサルファイトで非メチル化C→Tに変換）。</p>`;
    function draw() {
      const W2 = 460, H2 = 250, mL = 26, mT = 14, cw = (W2 - mL - 14) / cols, chh = (H2 - mT - 14) / rows;
      const s = stage(document.getElementById("bs_plot"), W2, H2);
      let meth = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const on = jitter[r * cols + c] < state.m; if (on) meth++;
        add(s, "circle", { cx: mL + (c + 0.5) * cw, cy: mT + (r + 0.5) * chh, r: Math.min(cw, chh) * 0.34, fill: on ? "#1b2233" : "#ffffff", stroke: "#9aa2b6", "stroke-width": 1 });
      }
      setReadout("bs_pct", (meth / (rows * cols) * 100).toFixed(0) + "%");
    }
    bindSlider("bs_m", (v) => (v * 100).toFixed(0) + "%", (v) => { state.m = v; draw(); });
    draw();
  };

  // 8. G-banding / karyotype ------------------------------------------------
  W.gbanding = function (container) {
    const chrom = {
      "1番": { seed: 1, pLen: 0.42 }, "7番": { seed: 7, pLen: 0.38 }, "X": { seed: 23, pLen: 0.4 },
    };
    const state = { chr: "1番", abn: false };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("gb_c", "染色体", Object.keys(chrom).map((k) => ({ v: k, label: k })), state.chr)}
        ${segRow("gb_a", "状態", [{ v: "n", label: "正常" }, { v: "d", label: "構造異常(欠失)" }], "n")}
      </div>
      <div class="widget-stage"><div id="gb_plot"></div></div>
      ${readoutRow([{ id: "gb_arm", label: "腕", value: "p=短腕 / q=長腕" }, { id: "gb_note", label: "判定", value: "—" }])}
      <p class="widget-note">Gバンドの縞（AT富む部位が濃い）で染色体を同定。セントロメアを境に<b>短腕(p)・長腕(q)</b>。『構造異常』にすると長腕の一部バンドが欠失する様子が分かります。</p>`;
    function draw() {
      const cfg = chrom[state.chr], rng = CK.makeRng(cfg.seed);
      const W2 = 460, H2 = 300, cx = 230, top = 24, bot = 276, wdt = 34;
      const s = stage(document.getElementById("gb_plot"), W2, H2);
      const cenY = top + (bot - top) * cfg.pLen;
      // bands
      const nBands = 22;
      let y = top;
      const bandH = (bot - top) / nBands;
      for (let i = 0; i < nBands; i++) {
        const isCen = Math.abs((top + i * bandH) - cenY) < bandH * 0.6;
        const dark = rng();
        const deleted = state.abn === true && i > nBands * 0.7 && i < nBands * 0.82;
        const shade = isCen ? "#e5484d" : deleted ? "#f0f2f7" : `rgb(${Math.round(240 - dark * 210)},${Math.round(240 - dark * 210)},${Math.round(244 - dark * 205)})`;
        add(s, "rect", { x: cx - wdt / 2, y: top + i * bandH, width: wdt, height: bandH + 0.5, fill: shade, stroke: deleted ? "#e5484d" : "none", "stroke-dasharray": deleted ? "3 2" : "" });
      }
      // outline (rounded)
      add(s, "rect", { x: cx - wdt / 2, y: top, width: wdt, height: bot - top, rx: 10, fill: "none", stroke: "#4a5268", "stroke-width": 1.6 });
      add(s, "circle", { cx: cx, cy: cenY, r: 4, fill: "#e5484d" });
      add(s, "text", { x: cx - wdt / 2 - 10, y: (top + cenY) / 2, "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: "#616a7d", text: "p" });
      add(s, "text", { x: cx - wdt / 2 - 10, y: (cenY + bot) / 2, "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: "#616a7d", text: "q" });
      add(s, "text", { x: cx, y: top - 8, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "#4a5268", text: "第" + state.chr + "染色体" });
      setReadout("gb_note", state.abn ? "長腕(q)に欠失あり" : "構造異常なし");
    }
    bindSeg("gb_c", (v) => { state.chr = v; draw(); });
    bindSeg("gb_a", (v) => { state.abn = v === "d"; draw(); });
    draw();
  };

  // fluorescence dark panel helper -----------------------------------------
  function fluoPanel(host, w, h) {
    const s = stage(host, w, h);
    add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: "#05070f" });
    return s;
  }

  // 9. DNA-FISH (fusion gene) ----------------------------------------------
  W.dnafish = function (container) {
    const state = { fusion: false };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("df_m", "状態", [{ v: "n", label: "正常" }, { v: "f", label: "融合遺伝子(転座)" }], "n")}</div>
      <div class="widget-stage"><div id="df_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#ff5a6e"></span>BCR(赤)</span><span class="li"><span class="sw" style="background:#37d67a"></span>ABL(緑)</span><span class="li"><span class="sw" style="background:#ffe14d"></span>融合(黄)</span></div></div>
      ${readoutRow([{ id: "df_sig", label: "シグナル", value: "—" }, { id: "df_judge", label: "判定", value: "—" }])}
      <p class="widget-note">赤(BCR)と緑(ABL)のプローブ。正常では<b>赤と緑が離れて</b>見え、転座があると<b>赤と緑が重なって黄色</b>く見えます（BCR-ABL融合遺伝子型）。</p>`;
    function draw() {
      const W2 = 460, H2 = 280;
      const s = fluoPanel(document.getElementById("df_plot"), W2, H2);
      // nucleus (DAPI blue)
      add(s, "ellipse", { cx: 230, cy: 140, rx: 150, ry: 110, fill: "#16308f", opacity: 0.5 });
      add(s, "ellipse", { cx: 230, cy: 140, rx: 150, ry: 110, fill: "none", stroke: "#6f8ce0", "stroke-width": 1, "stroke-dasharray": "4 3" });
      function sig(x, y, col) { add(s, "circle", { cx: x, cy: y, r: 9, fill: col, opacity: 0.35 }); add(s, "circle", { cx: x, cy: y, r: 4.5, fill: col }); }
      if (!state.fusion) {
        sig(150, 100, "#ff5a6e"); sig(300, 180, "#ff5a6e");
        sig(180, 200, "#37d67a"); sig(320, 90, "#37d67a");
        setReadout("df_sig", "赤2 ・ 緑2（分離）");
        setReadout("df_judge", "正常");
      } else {
        sig(160, 110, "#ff5a6e"); sig(300, 190, "#37d67a");
        // fused (overlap => yellow)
        add(s, "circle", { cx: 250, cy: 120, r: 10, fill: "#ffe14d", opacity: 0.35 });
        add(s, "circle", { cx: 250, cy: 120, r: 5, fill: "#ffe14d" });
        setReadout("df_sig", "赤1・緑1＋融合(黄)1");
        setReadout("df_judge", "転座（BCR-ABL）示唆");
      }
    }
    bindSeg("df_m", (v) => { state.fusion = v === "f"; draw(); });
    draw();
  };

  // 10. Interphase FISH (copy number) --------------------------------------
  W.interphasefish = function (container) {
    const rng = CK.makeRng(210);
    const nuclei = [[120, 90], [300, 80], [180, 190], [340, 200], [230, 140]];
    const state = { cn: 2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("if_c", "コピー数（1核あたりのシグナル）", 1, 12, 1, state.cn)}</div>
      <div class="widget-stage"><div id="if_plot"></div></div>
      ${readoutRow([{ id: "if_n", label: "シグナル数 / 核", value: "—" }, { id: "if_j", label: "判定", value: "—" }])}
      <p class="widget-note">間期核（青）の中の赤いシグナルの数＝そのDNA領域のコピー数。<b>正常は2、増幅（例：HER2）では多数のシグナル</b>が1核に見えます。</p>`;
    function draw() {
      const W2 = 460, H2 = 270;
      const s = fluoPanel(document.getElementById("if_plot"), W2, H2);
      nuclei.forEach((c) => {
        add(s, "ellipse", { cx: c[0], cy: c[1], rx: 58, ry: 46, fill: "#1a339a", opacity: 0.5 });
        add(s, "ellipse", { cx: c[0], cy: c[1], rx: 58, ry: 46, fill: "none", stroke: "#6f8ce0", "stroke-width": 0.8 });
        for (let k = 0; k < state.cn; k++) {
          const a = rng() * 6.283, rr = rng() * 40;
          add(s, "circle", { cx: c[0] + Math.cos(a) * rr, cy: c[1] + Math.sin(a) * rr * 0.8, r: 3.6, fill: "#ff5a6e" });
        }
      });
      setReadout("if_n", state.cn + " 点");
      setReadout("if_j", state.cn <= 2 ? "正常/正倍数" : state.cn <= 3 ? "トリソミー等" : "増幅（amplification）");
    }
    bindSlider("if_c", (v) => v, (v) => { state.cn = v; draw(); });
    draw();
  };

  // 11. RNA-FISH (single molecule mRNA) ------------------------------------
  W.rnafish = function (container) {
    const rng = CK.makeRng(211);
    const cells = [[130, 130, 78], [300, 110, 70], [250, 210, 66]];
    const state = { expr: 40 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("rf_e", "発現量（1細胞あたりの転写産物）", 0, 120, 5, state.expr)}</div>
      <div class="widget-stage"><div id="rf_plot"></div></div>
      ${readoutRow([{ id: "rf_n", label: "転写産物 / 細胞", value: "—" }, { id: "rf_loc", label: "局在", value: "核＋細胞質" }])}
      <p class="widget-note">1分子RNA（赤ドット）を可視化するsmFISH。DNA-FISHの『核内2点』と違い、mRNAは<b>細胞質にも多数のドット</b>として散らばります。発現量が多いほどドットが増えます。</p>`;
    function draw() {
      const W2 = 460, H2 = 270;
      const s = fluoPanel(document.getElementById("rf_plot"), W2, H2);
      cells.forEach((c) => {
        add(s, "circle", { cx: c[0], cy: c[1], r: c[2], fill: "#0b1740", opacity: 0.6, stroke: "#3a4e8f", "stroke-width": 0.8 });
        add(s, "circle", { cx: c[0], cy: c[1], r: c[2] * 0.42, fill: "#1a339a", opacity: 0.6 }); // nucleus
        const n = Math.round(state.expr / cells.length) + 2;
        for (let k = 0; k < n; k++) {
          const a = rng() * 6.283, rr = rng() * c[2] * 0.92;
          add(s, "circle", { cx: c[0] + Math.cos(a) * rr, cy: c[1] + Math.sin(a) * rr, r: 1.7, fill: "#ff6a6a", opacity: 0.92 });
        }
      });
      setReadout("rf_n", state.expr + " 分子");
    }
    bindSlider("rf_e", (v) => v, (v) => { state.expr = v; draw(); });
    draw();
  };

  // 12. Promoter (luciferase reporter) -------------------------------------
  W.promoter = function (container) {
    const cons = [
      { label: "−1884 bp", act: 11.5 }, { label: "−902 bp", act: 11.0 }, { label: "−491 bp", act: 10.5 },
      { label: "−217 bp", act: 3.8 }, { label: "−91 bp", act: 1.1 },
    ];
    const state = { sel: 2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("pr_s", "コンストラクト（上流領域の長さ）", cons.map((c, i) => ({ v: String(i), label: c.label })), "2")}</div>
      <div class="widget-stage"><div id="pr_plot"></div></div>
      ${readoutRow([{ id: "pr_act", label: "相対発光強度", value: "—" }, { id: "pr_note", label: "解釈", value: "—" }])}
      <p class="widget-note">上流領域＋luciferaseの発光量＝転写活性。上流を短くしても活性が変わらない部分は不要、<b>短くした途端に活性が落ちた境界（−491〜−217）に必要な領域</b>があります。</p>`;
    function draw() {
      const W2 = 540, H2 = 260, mL = 90, top = 20, base = 210, maxA = 13;
      const s = stage(document.getElementById("pr_plot"), W2, H2);
      const bh = (base - top) / cons.length;
      cons.forEach((c, i) => {
        const y = top + i * bh + 4, w = (c.act / maxA) * (W2 - mL - 70);
        const on = i === state.sel;
        add(s, "text", { x: mL - 8, y: y + bh / 2 - 2, "text-anchor": "end", "font-size": 10.5, fill: on ? "#f5a623" : "#616a7d", "font-weight": on ? 700 : 500, text: c.label });
        add(s, "rect", { x: mL, y: y, width: Math.max(3, w), height: bh - 10, rx: 3, fill: on ? "#f5a623" : "#c9d2e6", opacity: on ? 1 : 0.7 });
        add(s, "text", { x: mL + Math.max(3, w) + 6, y: y + bh / 2 - 2, "font-size": 10, fill: "#8a93a8", text: c.act.toFixed(1) });
      });
      add(s, "text", { x: mL, y: base + 22, "font-size": 10, fill: "#616a7d", text: "相対発光強度 (fold) →" });
      const c = cons[state.sel];
      setReadout("pr_act", c.act.toFixed(1) + " fold");
      setReadout("pr_note", state.sel <= 2 ? "十分な活性（プロモーターを含む）" : state.sel === 3 ? "活性が急落（必要領域が欠けた）" : "ほぼ活性なし");
    }
    bindSeg("pr_s", (v) => { state.sel = +v; draw(); });
    draw();
  };

  // 13. Gel shift assay (EMSA) ---------------------------------------------
  W.gelshift = function (container) {
    const state = { sc: "probe" };
    const scenarios = { probe: "プローブのみ", protein: "＋タンパク質", comp: "＋競合プローブ", ab: "＋抗体" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("gs_s", "レーンの条件", Object.keys(scenarios).map((k) => ({ v: k, label: scenarios[k] })), "probe")}</div>
      <div class="widget-stage"><div id="gs_plot"></div></div>
      ${readoutRow([{ id: "gs_band", label: "検出バンド", value: "—" }, { id: "gs_mean", label: "意味", value: "—" }])}
      <p class="widget-note">タンパク質がDNAに結合すると複合体が重く＝<b>バンドが上にシフト</b>。競合プローブで消え（特異性）、抗体でさらに上へ＝<b>スーパーシフト</b>。位置で結合を判定します。</p>`;
    function draw() {
      const W2 = 460, H2 = 290, gx = 150, gw = 160, top = 24, bot = 250;
      const s = stage(document.getElementById("gs_plot"), W2, H2);
      add(s, "rect", { x: gx, y: top - 10, width: gw, height: bot - top + 20, rx: 4, fill: "#0b1020" });
      const yFree = 210, yShift = 130, ySuper = 70;
      // reference lane (always free probe, left)
      add(s, "rect", { x: gx + 14, y: yFree - 3, width: 44, height: 6, rx: 3, fill: "#ff5566", opacity: 0.85 });
      add(s, "text", { x: gx + 36, y: top - 14, "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: "対照" });
      // result lane (right)
      const rx = gx + 100;
      add(s, "text", { x: rx + 22, y: top - 14, "text-anchor": "middle", "font-size": 8.5, fill: "#8a93a8", text: "反応" });
      function band(y, op) { add(s, "rect", { x: rx, y: y - 3, width: 44, height: 6, rx: 3, fill: "#ff5566", opacity: op }); }
      let bandTxt, meanTxt;
      if (state.sc === "probe") { band(yFree, 0.9); bandTxt = "free probe（下）"; meanTxt = "タンパク質なし"; }
      else if (state.sc === "protein") { band(yFree, 0.25); band(yShift, 0.95); bandTxt = "シフト（上）"; meanTxt = "タンパク質が結合"; }
      else if (state.sc === "comp") { band(yFree, 0.9); bandTxt = "free に戻る（消失）"; meanTxt = "競合＝特異的結合の証拠"; }
      else { band(yFree, 0.2); band(ySuper, 0.95); bandTxt = "スーパーシフト（最上）"; meanTxt = "抗体が結合→タンパク質を同定"; }
      // labels
      add(s, "text", { x: gx + gw + 8, y: yFree + 3, "font-size": 9, fill: "#8a93a8", text: "free probe" });
      add(s, "text", { x: gx + gw + 8, y: yShift + 3, "font-size": 9, fill: "#8a93a8", text: "shift" });
      add(s, "text", { x: gx + gw + 8, y: ySuper + 3, "font-size": 9, fill: "#8a93a8", text: "supershift" });
      add(s, "text", { x: gx + gw / 2, y: bot + 22, "text-anchor": "middle", "font-size": 9.5, fill: "#616a7d", text: scenarios[state.sc] });
      setReadout("gs_band", bandTxt); setReadout("gs_mean", meanTxt);
    }
    bindSeg("gs_s", (v) => { state.sc = v; draw(); });
    draw();
  };
})();

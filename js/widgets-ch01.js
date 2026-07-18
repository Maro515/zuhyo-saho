/* Chapter 1 — 統計エッセンシャル — 9 interactive widgets */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  // 1. 統計的仮説検定とp値 ---------------------------------------------------
  W.pvalue = function (container) {
    const state = { delta: 5, n: 15 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("pv_delta", "新薬群の効果差 Δ", -5, 15, 0.5, state.delta, (v) => v.toFixed(1))}
        ${sliderRow("pv_n", "各群のサンプルサイズ n", 3, 60, 1, state.n)}
        <button class="btn" id="pv_redraw">🎲 サンプルを引き直す</button>
      </div>
      <div class="widget-stage"><div style="display:flex;gap:18px;flex-wrap:wrap">
        <div style="flex:1;min-width:260px"><div id="pv_dots"></div></div>
        <div style="flex:1;min-width:260px"><div id="pv_dist"></div></div>
      </div></div>
      ${readoutRow([
        { id: "pv_meanA", label: "対照群 平均", value: "—" },
        { id: "pv_meanB", label: "新薬群 平均", value: "—" },
        { id: "pv_t", label: "検定統計量 t", value: "—" },
        { id: "pv_p", label: "p値", value: "—" },
        { id: "pv_verdict", label: "判定 (α=0.05)", value: "—" },
      ])}
      <p class="widget-note">帰無仮説は「2群の母平均に差はない」。実際にその帰無仮説が正しい世界からサンプルを生成し、そこで観測された差がどれくらい珍しいかを p 値として計算しています。</p>`;
    function draw() {
      const a = CK.normalSample(state.n, 100, 15);
      const b = CK.normalSample(state.n, 100 + state.delta, 15);
      const res = CK.welchT(b, a);
      const dotsHost = document.getElementById("pv_dots");
      const ctx1 = CK.plot(dotsHost, { width: 340, height: 220, margin: { top: 16, right: 16, bottom: 34, left: 46 }, xDomain: [Math.min(...a, ...b) - 10, Math.max(...a, ...b) + 10], yDomain: [0, 1], yTicks: 0, xTicks: 4, xLabel: "観測値" });
      a.forEach((v) => CK.dot(ctx1, v, 0.28, { r: 4, fill: "#9aa2b6" }));
      b.forEach((v) => CK.dot(ctx1, v, 0.72, { r: 4, fill: "#3b63e0" }));
      CK.textPx(ctx1, ctx1.margin.left, ctx1.y(0.28) - 10, "対照", { fill: "#9aa2b6", "font-weight": 700, "font-size": 11 });
      CK.textPx(ctx1, ctx1.margin.left, ctx1.y(0.72) - 10, "新薬", { fill: "#3b63e0", "font-weight": 700, "font-size": 11 });
      CK.vline(ctx1, CK.mean(a), { stroke: "#9aa2b6" });
      CK.vline(ctx1, CK.mean(b), { stroke: "#3b63e0" });

      const distHost = document.getElementById("pv_dist");
      const se = res.se;
      const range = se * 4.2;
      const ctx2 = CK.plot(distHost, { width: 340, height: 220, margin: { top: 16, right: 16, bottom: 34, left: 30 }, xDomain: [-range, range], yDomain: [0, CK.normalPDF(0, 0, se) * 1.15], yTicks: 0, xLabel: "群間の平均差（帰無仮説上）", xFmt: (v) => v.toFixed(0) });
      const curvePts = [];
      for (let i = 0; i <= 80; i++) { const xv = -range + (i / 80) * 2 * range; curvePts.push([xv, CK.normalPDF(xv, 0, se)]); }
      CK.line(ctx2, curvePts, { stroke: "#9aa2b6", "stroke-width": 2 });
      const obs = res.diff;
      const tail1 = []; for (let i = 0; i <= 40; i++) { const xv = Math.abs(obs) + (i / 40) * (range - Math.abs(obs)); tail1.push([xv, CK.normalPDF(xv, 0, se)]); }
      CK.area(ctx2, tail1, tail1.map((p) => [p[0], 0]), { fill: "#e5484d", opacity: 0.35 });
      const tail2 = []; for (let i = 0; i <= 40; i++) { const xv = -Math.abs(obs) - (i / 40) * (range - Math.abs(obs)); tail2.push([xv, CK.normalPDF(xv, 0, se)]); }
      CK.area(ctx2, tail2, tail2.map((p) => [p[0], 0]), { fill: "#e5484d", opacity: 0.35 });
      CK.vline(ctx2, obs, { stroke: "#e5484d", "stroke-width": 2, "stroke-dasharray": "" });
      CK.textPx(ctx2, ctx2.x(obs), ctx2.margin.top - 4, "観測差", { fill: "#e5484d", "font-size": 10.5, "text-anchor": "middle", "font-weight": 700 });

      setReadout("pv_meanA", CK.fmt(CK.mean(a), 1));
      setReadout("pv_meanB", CK.fmt(CK.mean(b), 1));
      setReadout("pv_t", CK.fmt(res.t, 2));
      setReadout("pv_p", res.p < 0.001 ? "< 0.001" : res.p.toFixed(3));
      const verdictEl = document.getElementById("pv_verdict");
      verdictEl.textContent = res.p < 0.05 ? "帰無仮説を棄却" : "棄却できない";
      verdictEl.style.color = res.p < 0.05 ? "var(--success)" : "var(--text-muted)";
    }
    bindSlider("pv_delta", (v) => v.toFixed(1), (v) => { state.delta = v; draw(); });
    bindSlider("pv_n", (v) => v, (v) => { state.n = v; draw(); });
    document.getElementById("pv_redraw").addEventListener("click", draw);
    draw();
  };

  // 2. 多重比較と多重検定補正 -------------------------------------------------
  W.multicomp = function (container) {
    const genes = [
      { name: "Gene A", p: 0.001 }, { name: "Gene B", p: 0.004 }, { name: "Gene C", p: 0.009 },
      { name: "Gene D", p: 0.031 }, { name: "Gene E", p: 0.06 }, { name: "Gene F", p: 0.15 },
      { name: "Gene G", p: 0.31 }, { name: "Gene H", p: 0.62 },
    ];
    const state = { n: 5, method: "raw" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mc_n", "これから行う検定数 N", 1, 50, 1, state.n)}</div>
      <div class="widget-stage"><div id="mc_curve"></div></div>
      <p class="widget-note">検定を繰り返すほど、本当は差がないのに「偶然どれかで有意」と出てしまう確率（少なくとも1つの偽陽性）が跳ね上がります。</p>
      <div class="w-head" style="margin-top:18px"><h2 style="font-size:13.5px">8遺伝子の発現差を検定した例（架空データ）</h2></div>
      ${segRow("mc_method", "有意と判定する基準", [{ v: "raw", label: "生のp<0.05" }, { v: "bonf", label: "Bonferroni" }, { v: "bh", label: "BH法(FDR)" }], "raw")}
      <div id="mc_table" style="margin-top:12px"></div>`;
    function drawCurve() {
      const host = document.getElementById("mc_curve");
      const ctx = CK.plot(host, { width: 600, height: 200, margin: { top: 16, right: 24, bottom: 34, left: 46 }, xDomain: [1, 50], yDomain: [0, 1], xTicks: 5, yTicks: 4, xLabel: "検定数 N", yFmt: (v) => (v * 100).toFixed(0) + "%" });
      const pts = []; for (let n = 1; n <= 50; n++) pts.push([n, 1 - Math.pow(0.95, n)]);
      CK.line(ctx, pts, { stroke: "#3b63e0", "stroke-width": 2.2 });
      const cur = 1 - Math.pow(0.95, state.n);
      CK.dot(ctx, state.n, cur, { r: 6, fill: "#e5484d" });
      CK.vline(ctx, state.n, { stroke: "#e5484d" });
      CK.textPx(ctx, ctx.x(state.n) + 8, ctx.y(cur) - 8, `N=${state.n}: ${(cur * 100).toFixed(1)}%`, { fill: "#e5484d", "font-weight": 700, "font-size": 12 });
    }
    function bonf(p, n) { return Math.min(1, p * n); }
    function bhInfo() {
      const n = genes.length;
      const sorted = genes.slice().sort((a, b) => a.p - b.p);
      let maxK = -1;
      sorted.forEach((g, i) => { const thresh = ((i + 1) / n) * 0.05; if (g.p <= thresh) maxK = i; });
      const q = {};
      sorted.forEach((g, i) => { q[g.name] = Math.min(1, (g.p * n) / (i + 1)); });
      return { sigSet: new Set(sorted.slice(0, maxK + 1).map((g) => g.name)), q };
    }
    function drawTable() {
      const bh = bhInfo();
      const rows = genes.map((g) => {
        const bonfP = bonf(g.p, genes.length);
        const qval = bh.q[g.name];
        let sig;
        if (state.method === "raw") sig = g.p < 0.05;
        else if (state.method === "bonf") sig = bonfP < 0.05;
        else sig = bh.sigSet.has(g.name);
        return `<tr style="${sig ? "background:var(--success-soft)" : ""}">
          <td style="padding:6px 10px">${g.name}</td><td style="padding:6px 10px">${g.p.toFixed(3)}</td>
          <td style="padding:6px 10px">${bonfP.toFixed(3)}</td><td style="padding:6px 10px">${qval.toFixed(3)}</td>
          <td style="padding:6px 10px;text-align:center">${sig ? "✅" : "—"}</td></tr>`;
      }).join("");
      document.getElementById("mc_table").innerHTML = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="color:var(--text-muted);text-align:left;border-bottom:1px solid var(--border)">
          <th style="padding:6px 10px">遺伝子</th><th>生のp値</th><th>Bonferroni補正</th><th>BH法 (q値)</th><th style="text-align:center">有意</th>
        </tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    bindSlider("mc_n", (v) => v, (v) => { state.n = v; drawCurve(); });
    bindSeg("mc_method", (v) => { state.method = v; drawTable(); });
    drawCurve(); drawTable();
  };

  // 3. 信頼区間 --------------------------------------------------------------
  W.ci = function (container) {
    const state = { n: 15, trueMean: 50, trueSD: 12, trials: 60 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ci_n", "サンプルサイズ n", 3, 100, 1, state.n)}
        <button class="btn" id="ci_redraw">🎲 ${state.trials}回引き直す</button>
      </div>
      <div class="widget-stage"><div id="ci_host"></div></div>
      ${readoutRow([{ id: "ci_capture", label: "真の平均を含んだ試行", value: "—" }, { id: "ci_width", label: "CIの平均幅", value: "—" }])}
      <p class="widget-note">母平均 μ=${state.trueMean} の母集団から毎回サンプルを取り直し、95%信頼区間を計算しています。理論上は約95%の試行で区間が真の μ を含みます。</p>`;
    function draw() {
      const host = document.getElementById("ci_host");
      const results = [];
      for (let i = 0; i < state.trials; i++) {
        const s = CK.normalSample(state.n, state.trueMean, state.trueSD);
        const m = CK.mean(s), se = CK.sem(s), half = CK.tCritical(Math.max(state.n - 1, 1)) * se;
        results.push({ lo: m - half, hi: m + half, m, capture: state.trueMean >= m - half && state.trueMean <= m + half });
      }
      const spread = (4 * state.trueSD) / Math.sqrt(Math.max(state.n, 3));
      const ctx = CK.plot(host, { width: 680, height: 340, margin: { top: 16, right: 20, bottom: 34, left: 44 }, xDomain: [0, state.trials + 1], yDomain: [state.trueMean - spread - 10, state.trueMean + spread + 10], xTicks: 0, yTicks: 5, xLabel: "試行 (それぞれ新しいサンプル)", yLabel: "推定値" });
      CK.hline(ctx, state.trueMean, { stroke: "#3b63e0", "stroke-width": 1.6, "stroke-dasharray": "" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(state.trueMean) - 6, `真の平均 μ=${state.trueMean}`, { fill: "#3b63e0", "font-size": 10.5, "font-weight": 700 });
      results.forEach((r, i) => {
        const color = r.capture ? "#16a34a" : "#e5484d";
        CK.line(ctx, [[i + 1, r.lo], [i + 1, r.hi]], { stroke: color, "stroke-width": 2 });
        CK.dot(ctx, i + 1, r.m, { r: 2.2, fill: color });
      });
      const captured = results.filter((r) => r.capture).length;
      setReadout("ci_capture", `${captured} / ${state.trials}`);
      setReadout("ci_width", CK.fmt(CK.mean(results.map((r) => r.hi - r.lo)), 1));
    }
    bindSlider("ci_n", (v) => v, (v) => { state.n = v; draw(); });
    document.getElementById("ci_redraw").addEventListener("click", draw);
    draw();
  };

  // 4. t検定 ------------------------------------------------------------------
  W.ttest = function (container) {
    const state = { meanB: 108, n: 12, equalVar: false };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("tt_meanB", "群Bの平均", 80, 130, 1, state.meanB)}
        ${sliderRow("tt_n", "各群のn", 3, 50, 1, state.n)}
        ${segRow("tt_var", "分散の仮定", [{ v: "welch", label: "Welch (異分散)" }, { v: "pooled", label: "等分散を仮定" }], "welch")}
        <button class="btn" id="tt_redraw">🎲 引き直す</button>
      </div>
      <div class="widget-stage"><div id="tt_host"></div></div>
      ${readoutRow([{ id: "tt_mA", label: "群A 平均", value: "—" }, { id: "tt_mB", label: "群B 平均", value: "—" }, { id: "tt_t", label: "t値", value: "—" }, { id: "tt_df", label: "自由度", value: "—" }, { id: "tt_p", label: "p値", value: "—" }])}`;
    let A = [], B = [];
    function resample() { A = CK.normalSample(state.n, 100, 14); B = CK.normalSample(state.n, state.meanB, 14); }
    function draw() {
      const host = document.getElementById("tt_host");
      const all = A.concat(B);
      const ctx = CK.plot(host, { width: 600, height: 280, margin: { top: 16, right: 20, bottom: 34, left: 46 }, xDomain: [0, 3], yDomain: [Math.min(...all) - 8, Math.max(...all) + 8], xTicks: 0, yTicks: 5, yLabel: "観測値" });
      function box(xc, arr, color, label) {
        const s = arr.slice().sort((a, b) => a - b);
        const q = (p) => s[Math.floor(p * (s.length - 1))];
        const med = q(0.5), q1 = q(0.25), q3 = q(0.75);
        CK.line(ctx, [[xc, s[0]], [xc, s[s.length - 1]]], { stroke: color, "stroke-width": 1.3, "stroke-dasharray": "3 3" });
        CK.rectData(ctx, xc - 0.28, q1, xc + 0.28, q3, { fill: color, opacity: 0.18, stroke: color, "stroke-width": 1.4 });
        CK.line(ctx, [[xc - 0.28, med], [xc + 0.28, med]], { stroke: color, "stroke-width": 2.2 });
        arr.forEach((v, i) => CK.dot(ctx, xc + ((i % 7) - 3) / 3 * 0.16, v, { r: 3, fill: color, opacity: 0.75 }));
        CK.textPx(ctx, ctx.x(xc), ctx.margin.top + ctx.h + 18, label, { "text-anchor": "middle", "font-weight": 700, fill: color });
      }
      box(1, A, "#9aa2b6", "群A"); box(2, B, "#3b63e0", "群B");
      const res = state.equalVar ? CK.pooledT(B, A) : CK.welchT(B, A);
      setReadout("tt_mA", CK.fmt(CK.mean(A), 1));
      setReadout("tt_mB", CK.fmt(CK.mean(B), 1));
      setReadout("tt_t", CK.fmt(res.t, 2));
      setReadout("tt_df", CK.fmt(res.df, 1));
      setReadout("tt_p", res.p < 0.001 ? "< 0.001" : res.p.toFixed(3));
    }
    bindSlider("tt_meanB", (v) => v, (v) => { state.meanB = v; resample(); draw(); });
    bindSlider("tt_n", (v) => v, (v) => { state.n = v; resample(); draw(); });
    bindSeg("tt_var", (v) => { state.equalVar = v === "pooled"; draw(); });
    document.getElementById("tt_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 5. ANOVA -------------------------------------------------------------------
  W.anova = function (container) {
    const state = { means: [100, 104, 110, 118], n: 10 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${state.means.map((m, i) => sliderRow("an_m" + i, `群${String.fromCharCode(65 + i)}の平均`, 80, 140, 1, m)).join("")}
        ${sliderRow("an_n", "各群のn", 3, 40, 1, state.n)}
        <button class="btn" id="an_redraw">🎲 引き直す</button>
      </div>
      <div class="widget-stage"><div id="an_host"></div></div>
      ${readoutRow([{ id: "an_F", label: "F値", value: "—" }, { id: "an_df", label: "自由度", value: "—" }, { id: "an_p", label: "p値", value: "—" }, { id: "an_verdict", label: "判定", value: "—" }])}
      <p class="widget-note">ANOVAが有意でも「どの2群が違うか」は教えてくれません。事後検定（Tukey法など）で個別に確認する必要があります。</p>`;
    let groups = [];
    function resample() { groups = state.means.map((m) => CK.normalSample(state.n, m, 12)); }
    function draw() {
      const host = document.getElementById("an_host");
      const all = groups.flat();
      const ctx = CK.plot(host, { width: 620, height: 300, margin: { top: 16, right: 20, bottom: 36, left: 46 }, xDomain: [0, groups.length + 1], yDomain: [Math.min(...all) - 8, Math.max(...all) + 8], xTicks: 0, yTicks: 5, yLabel: "観測値" });
      const colors = ["#9aa2b6", "#3b63e0", "#0f9e73", "#f59e0b"];
      groups.forEach((g, gi) => {
        const xc = gi + 1, s = g.slice().sort((a, b) => a - b);
        const q = (p) => s[Math.floor(p * (s.length - 1))];
        const med = q(0.5), q1 = q(0.25), q3 = q(0.75);
        CK.line(ctx, [[xc, s[0]], [xc, s[s.length - 1]]], { stroke: colors[gi], "stroke-width": 1.3, "stroke-dasharray": "3 3" });
        CK.rectData(ctx, xc - 0.3, q1, xc + 0.3, q3, { fill: colors[gi], opacity: 0.18, stroke: colors[gi], "stroke-width": 1.4 });
        CK.line(ctx, [[xc - 0.3, med], [xc + 0.3, med]], { stroke: colors[gi], "stroke-width": 2.2 });
        g.forEach((v, i) => CK.dot(ctx, xc + ((i % 7) - 3) / 3 * 0.17, v, { r: 2.8, fill: colors[gi], opacity: 0.7 }));
        CK.textPx(ctx, ctx.x(xc), ctx.margin.top + ctx.h + 18, "群" + String.fromCharCode(65 + gi), { "text-anchor": "middle", "font-weight": 700, fill: colors[gi] });
      });
      const res = CK.oneWayANOVA(groups);
      setReadout("an_F", CK.fmt(res.F, 2));
      setReadout("an_df", `${res.df1}, ${res.df2}`);
      setReadout("an_p", res.p < 0.001 ? "< 0.001" : res.p.toFixed(3));
      const v = document.getElementById("an_verdict");
      v.textContent = res.p < 0.05 ? "少なくとも1群は異なる" : "差があるとはいえない";
      v.style.color = res.p < 0.05 ? "var(--success)" : "var(--text-muted)";
    }
    state.means.forEach((m, i) => bindSlider("an_m" + i, (v) => v, (v) => { state.means[i] = v; resample(); draw(); }));
    bindSlider("an_n", (v) => v, (v) => { state.n = v; resample(); draw(); });
    document.getElementById("an_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 6. 棒グラフ（SD/SEM/CI・グラフ種） -----------------------------------------
  W.bargraph = function (container) {
    const state = { n: 8, errorType: "sd", chartType: "bar" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("bg_n", "サンプルサイズ n", 3, 100, 1, state.n)}
        ${segRow("bg_err", "エラーバーの意味", [{ v: "sd", label: "SD" }, { v: "sem", label: "SEM" }, { v: "ci", label: "95%CI" }], "sd")}
        ${segRow("bg_type", "グラフの種類", [{ v: "bar", label: "棒グラフ" }, { v: "box", label: "箱ひげ図" }, { v: "violin", label: "バイオリン" }, { v: "swarm", label: "スウォーム" }], "bar")}
        <button class="btn" id="bg_redraw">🎲 引き直す</button>
      </div>
      <div class="widget-stage"><div id="bg_host"></div></div>
      ${readoutRow([{ id: "bg_mean", label: "平均", value: "—" }, { id: "bg_sd", label: "SD", value: "—" }, { id: "bg_sem", label: "SEM", value: "—" }, { id: "bg_ci", label: "95%CI半幅", value: "—" }])}
      <p class="widget-note">nを増やしてもSDはほぼ変わりませんが、SEMと95%CIはどんどん狭くなります。「ばらつき」を見せたいのか「母平均の推定精度」を見せたいのかで、選ぶエラーバーが変わります。</p>`;
    let data = [];
    function resample() { data = CK.normalSample(state.n, 100, 18); }
    function draw() {
      const host = document.getElementById("bg_host");
      const m = CK.mean(data), sd = CK.sd(data), sem = CK.sem(data), half = CK.tCritical(Math.max(state.n - 1, 1)) * sem;
      const errHalf = state.errorType === "sd" ? sd : state.errorType === "sem" ? sem : half;
      const yMax = Math.max(m + errHalf, ...data) + 10;
      const yMin = Math.min(0, Math.min(...data) - 10);
      const ctx = CK.plot(host, { width: 420, height: 300, margin: { top: 16, right: 20, bottom: 34, left: 46 }, xDomain: [0, 2], yDomain: [state.chartType === "bar" ? 0 : yMin, yMax], xTicks: 0, yTicks: 5, yLabel: "観測値" });
      if (state.chartType === "bar") {
        CK.rectData(ctx, 0.6, 0, 1.4, m, { fill: "#3b63e0", opacity: 0.75 });
        CK.line(ctx, [[1, m - errHalf], [1, m + errHalf]], { stroke: "#1b2233", "stroke-width": 2 });
        CK.line(ctx, [[0.88, m - errHalf], [1.12, m - errHalf]], { stroke: "#1b2233", "stroke-width": 2 });
        CK.line(ctx, [[0.88, m + errHalf], [1.12, m + errHalf]], { stroke: "#1b2233", "stroke-width": 2 });
      } else if (state.chartType === "box") {
        const s = data.slice().sort((a, b) => a - b);
        const q = (p) => s[Math.floor(p * (s.length - 1))];
        CK.line(ctx, [[1, s[0]], [1, s[s.length - 1]]], { stroke: "#3b63e0", "stroke-width": 1.3, "stroke-dasharray": "3 3" });
        CK.rectData(ctx, 0.65, q(0.25), 1.35, q(0.75), { fill: "#3b63e0", opacity: 0.18, stroke: "#3b63e0", "stroke-width": 1.5 });
        CK.line(ctx, [[0.65, q(0.5)], [1.35, q(0.5)]], { stroke: "#3b63e0", "stroke-width": 2.4 });
      } else if (state.chartType === "violin") {
        const bw = (Math.max(...data) - Math.min(...data)) / 8 || 1;
        const ys = []; for (let i = 0; i <= 30; i++) ys.push(yMin + (i / 30) * (yMax - yMin));
        const dens = ys.map((yv) => CK.sum(data.map((v) => Math.exp(-((yv - v) ** 2) / (2 * bw * bw)))) / data.length);
        const maxD = Math.max(...dens);
        const leftPts = ys.map((yv, i) => [1 - (0.35 * dens[i]) / maxD, yv]);
        const rightPts = ys.map((yv, i) => [1 + (0.35 * dens[i]) / maxD, yv]);
        CK.area(ctx, rightPts, leftPts, { fill: "#3b63e0", opacity: 0.28 });
      } else {
        data.slice().sort((a, b) => a - b).forEach((v, i) => CK.dot(ctx, 1 + ((i % 9) - 4) / 4 * 0.3, v, { r: 3.4, fill: "#3b63e0", opacity: 0.75 }));
      }
      setReadout("bg_mean", CK.fmt(m, 1)); setReadout("bg_sd", CK.fmt(sd, 1)); setReadout("bg_sem", CK.fmt(sem, 2)); setReadout("bg_ci", "±" + CK.fmt(half, 2));
    }
    bindSlider("bg_n", (v) => v, (v) => { state.n = v; resample(); draw(); });
    bindSeg("bg_err", (v) => { state.errorType = v; draw(); });
    bindSeg("bg_type", (v) => { state.chartType = v; draw(); });
    document.getElementById("bg_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 7. 相関解析 ------------------------------------------------------------------
  W.correlation = function (container) {
    function genLinear(n, slope, intercept, noiseSD) {
      const x = Array.from({ length: n }, () => Math.random() * 20 - 10);
      const y = x.map((v) => slope * v + intercept + CK.randNormal(0, noiseSD));
      return { x, y };
    }
    const presets = {
      strong: () => genLinear(60, 2, 0, 3),
      weak: () => genLinear(60, 0.6, 0, 14),
      none: () => genLinear(60, 0, 0, 14),
      curve: () => { const x = Array.from({ length: 60 }, (_, i) => -3 + (6 * i) / 59); const y = x.map((v) => v * v + CK.randNormal(0, 1)); return { x, y }; },
      outlier: () => { const d = genLinear(40, 1.4, 0, 2); d.x.push(9.5); d.y.push(-25); return d; },
    };
    let cur = presets.strong();
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("cr_preset", "データの例", [{ v: "strong", label: "強い正の相関" }, { v: "weak", label: "弱い相関" }, { v: "none", label: "無相関" }, { v: "curve", label: "曲線関係" }, { v: "outlier", label: "外れ値あり" }], "strong")}
        <button class="btn" id="cr_redraw">🎲 再生成</button>
      </div>
      <div class="widget-stage"><div id="cr_host"></div></div>
      ${readoutRow([{ id: "cr_r", label: "Pearson's r", value: "—" }, { id: "cr_rho", label: "Spearman's ρ", value: "—" }])}
      <p class="widget-note">Pearsonのrは直線的な関係だけを評価します。曲線関係や外れ値があると、rの数値だけを見て「相関がない／強い」と即断すると誤ることがあります。必ず散布図の形も確認しましょう。</p>`;
    function draw() {
      const host = document.getElementById("cr_host");
      const ctx = CK.plot(host, { width: 520, height: 340, margin: { top: 16, right: 20, bottom: 40, left: 46 }, xDomain: [Math.min(...cur.x) - 3, Math.max(...cur.x) + 3], yDomain: [Math.min(...cur.y) - 3, Math.max(...cur.y) + 3], xLabel: "変数 X", yLabel: "変数 Y" });
      cur.x.forEach((xv, i) => CK.dot(ctx, xv, cur.y[i], { r: 4 }));
      setReadout("cr_r", CK.fmt(CK.pearsonR(cur.x, cur.y), 3));
      setReadout("cr_rho", CK.fmt(CK.spearmanRho(cur.x, cur.y), 3));
    }
    bindSeg("cr_preset", (v) => { cur = presets[v](); draw(); });
    document.getElementById("cr_redraw").addEventListener("click", () => {
      const activeBtn = document.querySelector("#cr_preset button.active");
      cur = presets[activeBtn.dataset.v](); draw();
    });
    draw();
  };

  // 8. 線形回帰 -------------------------------------------------------------------
  W.regression = function (container) {
    const state = { n: 30, noise: 4, trueSlope: 2, trueIntercept: 1, band: "ci" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("rg_n", "データ点数 n", 4, 100, 1, state.n)}
        ${sliderRow("rg_noise", "ノイズの大きさ", 0.5, 15, 0.5, state.noise)}
        ${segRow("rg_band", "帯が示す意味", [{ v: "ci", label: "95%信頼区間" }, { v: "pi", label: "95%予測区間" }], "ci")}
        <button class="btn" id="rg_redraw">🎲 引き直す</button>
      </div>
      <div class="widget-stage"><div id="rg_host"></div></div>
      ${readoutRow([{ id: "rg_slope", label: "推定 傾き", value: "—" }, { id: "rg_int", label: "推定 切片", value: "—" }, { id: "rg_r2", label: "R²", value: "—" }])}
      <p class="widget-note">信頼区間は「真の回帰直線がどこにあるか」の不確実性、予測区間は「次に観測される1点がどこに来るか」の不確実性です。予測区間の方が常に広くなります。</p>`;
    let x = [], y = [];
    function resample() {
      x = Array.from({ length: state.n }, () => Math.random() * 10);
      y = x.map((v) => state.trueSlope * v + state.trueIntercept + CK.randNormal(0, state.noise));
    }
    function draw() {
      const host = document.getElementById("rg_host");
      const reg = CK.linreg(x, y);
      const xd = [Math.min(...x) - 0.5, Math.max(...x) + 0.5];
      const ctx = CK.plot(host, { width: 560, height: 340, margin: { top: 16, right: 20, bottom: 40, left: 46 }, xDomain: xd, yDomain: [Math.min(...y) - 6, Math.max(...y) + 6], xLabel: "説明変数 X", yLabel: "目的変数 Y" });
      const linePts = [], top = [], bot = [];
      for (let i = 0; i <= 40; i++) {
        const xv = xd[0] + (i / 40) * (xd[1] - xd[0]);
        const yv = reg.predict(xv);
        const half = state.band === "ci" ? reg.ciHalf(xv) : reg.piHalf(xv);
        linePts.push([xv, yv]); top.push([xv, yv + half]); bot.push([xv, yv - half]);
      }
      CK.area(ctx, top, bot, {});
      CK.line(ctx, linePts, { stroke: "#3b63e0", "stroke-width": 2.2 });
      x.forEach((xv, i) => CK.dot(ctx, xv, y[i], { r: 3.6, fill: "#1b2233", opacity: 0.55 }));
      setReadout("rg_slope", CK.fmt(reg.slope, 2));
      setReadout("rg_int", CK.fmt(reg.intercept, 2));
      setReadout("rg_r2", CK.fmt(reg.r2, 3));
    }
    bindSlider("rg_n", (v) => v, (v) => { state.n = v; resample(); draw(); });
    bindSlider("rg_noise", (v) => v.toFixed(1), (v) => { state.noise = v; resample(); draw(); });
    bindSeg("rg_band", (v) => { state.band = v; draw(); });
    document.getElementById("rg_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 9. カーブフィッティング ---------------------------------------------------------
  W.curvefit = function (container) {
    const state = { degree: 3, n: 24, noise: 0.5 };
    function trueFn(x) { return Math.sin(x * 1.3) * 1.4 + x * 0.15; }
    let x = [], y = [];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("cf_deg", "多項式の次数", [{ v: "1", label: "次数1 (直線)" }, { v: "3", label: "次数3" }, { v: "5", label: "次数5" }, { v: "10", label: "次数10" }], "3")}
        ${sliderRow("cf_n", "データ点数 n", 8, 60, 1, state.n)}
        <button class="btn" id="cf_redraw">🎲 データを引き直す</button>
      </div>
      <div class="widget-stage"><div id="cf_host"></div></div>
      <p class="widget-note">次数が低いと現象を捉えきれず（過小適合）、高すぎるとデータのノイズにまで無理に合わせにいきます（過学習）。データが少ない領域ほど高次多項式は暴れやすいことに注目してください。</p>`;
    function resample() {
      x = Array.from({ length: state.n }, () => Math.random() * 10 - 1);
      y = x.map((v) => trueFn(v) + CK.randNormal(0, state.noise));
    }
    function draw() {
      const host = document.getElementById("cf_host");
      const xd = [Math.min(...x) - 0.5, Math.max(...x) + 0.5];
      const fit = CK.polyFit(x, y, state.degree);
      const ctx = CK.plot(host, { width: 560, height: 340, margin: { top: 16, right: 20, bottom: 40, left: 46 }, xDomain: xd, yDomain: [-4, 6], xLabel: "説明変数 X", yLabel: "目的変数 Y" });
      const truePts = [], fitPts = [];
      for (let i = 0; i <= 100; i++) {
        const xv = xd[0] + (i / 100) * (xd[1] - xd[0]);
        truePts.push([xv, trueFn(xv)]);
        fitPts.push([xv, Math.max(-4, Math.min(6, fit.predict(xv)))]);
      }
      CK.line(ctx, truePts, { stroke: "#9aa2b6", "stroke-width": 2, "stroke-dasharray": "5 4" });
      CK.line(ctx, fitPts, { stroke: "#e5484d", "stroke-width": 2.2 });
      x.forEach((xv, i) => CK.dot(ctx, xv, y[i], { r: 3.6, fill: "#3b63e0", opacity: 0.7 }));
      CK.textPx(ctx, ctx.margin.left + 6, ctx.margin.top + 14, "- - - 真の関数　─ 推定曲線", { fill: "#616a7d", "font-size": 11 });
    }
    bindSeg("cf_deg", (v) => { state.degree = +v; draw(); });
    bindSlider("cf_n", (v) => v, (v) => { state.n = v; resample(); draw(); });
    document.getElementById("cf_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };
})();

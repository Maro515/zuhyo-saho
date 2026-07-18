/* Chapter 10 — 臨床情報解析 — 10 interactive widgets */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  // 1. Kaplan-Meier法 ----------------------------------------------------------
  W.km = function (container) {
    const state = { hrB: 0.6, n: 40, maxT: 36 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("km_hrB", "B群のイベント発生率（A群を1とした相対値）", 0.2, 1.5, 0.05, state.hrB, (v) => v.toFixed(2))}
        ${sliderRow("km_n", "各群の症例数", 10, 100, 5, state.n)}
        <button class="btn" id="km_redraw">🎲 コホートを引き直す</button>
      </div>
      <div class="widget-stage"><div id="km_host"></div></div>
      ${readoutRow([{ id: "km_medA", label: "A群 生存期間中央値", value: "—" }, { id: "km_medB", label: "B群 生存期間中央値", value: "—" }])}
      <div class="legend-row"><span class="li"><span class="sw" style="background:#9aa2b6"></span>A群（対照）</span><span class="li"><span class="sw" style="background:#0f9e73"></span>B群（新規治療）</span></div>
      <p class="widget-note">縦軸は生存割合、横軸は起算日からの時間。階段が落ちるたびにイベント（死亡）が起きています。B群のイベント発生率をA群より下げると、曲線が右上に離れていく＝生存期間が延びる様子を確認できます。</p>`;
    let kmA, kmB;
    function genArm(n, hazard) {
      const rows = [];
      for (let i = 0; i < n; i++) {
        const t = -Math.log(Math.random()) / hazard;
        const censorAt = state.maxT * (0.6 + Math.random() * 0.4);
        if (t < censorAt && t < state.maxT) rows.push({ t, event: 1 });
        else rows.push({ t: Math.min(censorAt, state.maxT), event: 0 });
      }
      return rows;
    }
    function resample() {
      const baseHazard = 0.045;
      kmA = CK.kaplanMeier(genArm(state.n, baseHazard));
      kmB = CK.kaplanMeier(genArm(state.n, baseHazard * state.hrB));
    }
    function toStepPoints(km) {
      const pts = km.steps.map((s) => [s.t, s.s]);
      pts.push([state.maxT, km.steps[km.steps.length - 1].s]);
      return pts;
    }
    function draw() {
      const host = document.getElementById("km_host");
      const ctx = CK.plot(host, { width: 640, height: 320, margin: { top: 16, right: 20, bottom: 36, left: 48 }, xDomain: [0, state.maxT], yDomain: [0, 1], yTicks: 5, xTicks: 6, xLabel: "時間（月）", yFmt: (v) => (v * 100).toFixed(0) + "%", yLabel: "生存割合" });
      CK.hline(ctx, 0.5, { stroke: "#c7cce0" });
      CK.stepAfter(ctx, toStepPoints(kmA), { stroke: "#9aa2b6" });
      CK.stepAfter(ctx, toStepPoints(kmB), { stroke: "#0f9e73" });
      setReadout("km_medA", kmA.median !== null ? CK.fmt(kmA.median, 1) + "ヶ月" : "未到達");
      setReadout("km_medB", kmB.median !== null ? CK.fmt(kmB.median, 1) + "ヶ月" : "未到達");
    }
    bindSlider("km_hrB", (v) => v.toFixed(2), (v) => { state.hrB = v; resample(); draw(); });
    bindSlider("km_n", (v) => v, (v) => { state.n = v; resample(); draw(); });
    document.getElementById("km_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 2. ROC曲線 -------------------------------------------------------------------
  W.roc = function (container) {
    const state = { sep: 1.2, n: 150, threshold: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("roc_sep", "検査法の判別力（2群の分布の離れ具合）", 0.1, 3, 0.1, state.sep)}
        <button class="btn" id="roc_redraw">🎲 症例を引き直す</button>
      </div>
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <div style="flex:1;min-width:280px"><div id="roc_dist"></div>${sliderRow("roc_th", "カットオフ値", -4, 4, 0.1, state.threshold)}</div>
        <div style="flex:1;min-width:280px"><div id="roc_curve"></div></div>
      </div>
      ${readoutRow([{ id: "roc_sens", label: "感度", value: "—" }, { id: "roc_spec", label: "特異度", value: "—" }, { id: "roc_auc", label: "AUC", value: "—" }])}`;
    let pos = [], neg = [];
    function resample() { pos = CK.normalSample(state.n, state.sep, 1); neg = CK.normalSample(state.n, 0, 1); }
    function draw() {
      const dctx = CK.plot(document.getElementById("roc_dist"), { width: 320, height: 230, margin: { top: 16, right: 14, bottom: 34, left: 26 }, xDomain: [-4, Math.max(4, state.sep + 4)], yDomain: [0, 0.45], yTicks: 0, xLabel: "検査スコア" });
      const curveN = [], curveP = [];
      for (let i = 0; i <= 80; i++) { const xv = -4 + (i / 80) * (8 + state.sep); curveN.push([xv, CK.normalPDF(xv, 0, 1)]); curveP.push([xv, CK.normalPDF(xv, state.sep, 1)]); }
      CK.line(dctx, curveN, { stroke: "#9aa2b6", "stroke-width": 2 });
      CK.line(dctx, curveP, { stroke: "#e5484d", "stroke-width": 2 });
      CK.vline(dctx, state.threshold, { stroke: "#1b2233", "stroke-width": 2, "stroke-dasharray": "" });
      CK.textPx(dctx, dctx.margin.left + 4, dctx.margin.top + 12, "健常（陰性）", { fill: "#9aa2b6", "font-size": 10.5, "font-weight": 700 });
      CK.textPx(dctx, dctx.margin.left + 4, dctx.margin.top + 26, "疾患（陽性）", { fill: "#e5484d", "font-size": 10.5, "font-weight": 700 });

      const roc = CK.rocCurve(pos, neg);
      const cctx = CK.plot(document.getElementById("roc_curve"), { width: 300, height: 280, margin: { top: 16, right: 14, bottom: 36, left: 40 }, xDomain: [0, 1], yDomain: [0, 1], xLabel: "1 - 特異度", yLabel: "感度" });
      CK.line(cctx, [[0, 0], [1, 1]], { stroke: "#e6e9f2", "stroke-width": 1.5 });
      CK.line(cctx, roc.points.map((p) => [p.fpr, p.tpr]), { stroke: "#3b63e0", "stroke-width": 2.2 });
      const tp = pos.filter((v) => v >= state.threshold).length, fp = neg.filter((v) => v >= state.threshold).length;
      const sens = tp / pos.length, spec = 1 - fp / neg.length;
      CK.dot(cctx, 1 - spec, sens, { r: 5, fill: "#e5484d" });
      setReadout("roc_sens", (sens * 100).toFixed(1) + "%");
      setReadout("roc_spec", (spec * 100).toFixed(1) + "%");
      setReadout("roc_auc", CK.fmt(roc.auc, 3));
    }
    bindSlider("roc_sep", (v) => v.toFixed(1), (v) => { state.sep = v; resample(); draw(); });
    bindSlider("roc_th", (v) => v.toFixed(1), (v) => { state.threshold = v; draw(); });
    document.getElementById("roc_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 3. 多変量解析（交絡の調整） -----------------------------------------------------
  W.multivariate = function (container) {
    const strata = [
      { label: "進行度 高 (T3/4)", a: 70, b: 70, c: 30, d: 30 },
      { label: "進行度 低 (T1/2)", a: 4, b: 46, c: 16, d: 184 },
    ];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("mv_adj", "解析方法", [{ v: "crude", label: "単変量（進行度を無視）" }, { v: "adj", label: "多変量（進行度で調整）" }], "crude")}</div>
      <div id="mv_tables"></div>
      ${readoutRow([{ id: "mv_or", label: "オッズ比 (OR)", value: "—" }, { id: "mv_verdict", label: "解釈", value: "—" }])}
      <p class="widget-note">同一の架空データを、進行度（T分類）という交絡因子を無視した場合／層別化して調整した場合で解析しています。補助化学療法を受けた患者は進行度の高い患者に偏っていたため、進行度を無視すると化学療法があたかも有害であるかのように見えてしまいます。</p>`;
    function crudeTable() {
      return { a: strata.reduce((s, x) => s + x.a, 0), b: strata.reduce((s, x) => s + x.b, 0), c: strata.reduce((s, x) => s + x.c, 0), d: strata.reduce((s, x) => s + x.d, 0) };
    }
    function tableHtml(t, title) {
      return `<div style="margin-bottom:14px"><div style="font-weight:700;font-size:12.5px;margin-bottom:6px;color:var(--text-muted)">${title}</div>
        <div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:13px;width:100%;max-width:440px">
          <thead><tr style="color:var(--text-muted)"><th></th><th style="padding:4px 10px">イベントあり</th><th style="padding:4px 10px">イベントなし</th></tr></thead>
          <tbody>
            <tr><td style="padding:4px 10px;font-weight:700">補助化学療法あり</td><td style="padding:4px 10px;text-align:center">${t.a}</td><td style="padding:4px 10px;text-align:center">${t.b}</td></tr>
            <tr><td style="padding:4px 10px;font-weight:700">補助化学療法なし</td><td style="padding:4px 10px;text-align:center">${t.c}</td><td style="padding:4px 10px;text-align:center">${t.d}</td></tr>
          </tbody></table></div></div>`;
    }
    function draw(mode) {
      const host = document.getElementById("mv_tables");
      if (mode === "adj") {
        host.innerHTML = strata.map((s) => tableHtml(s, s.label)).join("");
        const or = CK.mantelHaenszelOR(strata);
        setReadout("mv_or", CK.fmt(or, 2));
        const v = document.getElementById("mv_verdict"); v.textContent = "進行度で調整すると関連は消える（真の効果はない）"; v.style.color = "var(--text-muted)";
      } else {
        const t = crudeTable();
        host.innerHTML = tableHtml(t, "進行度を無視してプールした2×2表");
        setReadout("mv_or", CK.fmt(CK.crudeOR(t), 2));
        const v = document.getElementById("mv_verdict"); v.textContent = "化学療法が有害に見える（交絡の影響）"; v.style.color = "var(--danger)";
      }
    }
    bindSeg("mv_adj", draw);
    draw("crude");
  };

  // 4. メタアナリシス/フォレストプロット ---------------------------------------------
  W.forest = function (container) {
    const baseStudies = [
      { label: "Study 1 (2015)", or: 0.55, ciLo: 0.32, ciHi: 0.94 },
      { label: "Study 2 (2017)", or: 0.71, ciLo: 0.52, ciHi: 0.97 },
      { label: "Study 3 (2018)", or: 0.44, ciLo: 0.19, ciHi: 1.02 },
      { label: "Study 4 (2019)", or: 0.83, ciLo: 0.66, ciHi: 1.04 },
      { label: "Study 5 (2021)", or: 0.62, ciLo: 0.39, ciHi: 0.99 },
      { label: "Study 6 (2023)", or: 1.05, ciLo: 0.58, ciHi: 1.9 },
    ].map((s) => {
      const yi = Math.log(s.or);
      const se = (Math.log(s.ciHi) - Math.log(s.ciLo)) / (2 * 1.96);
      return { ...s, yi, vi: se * se, active: true };
    });
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("fp_model", "統合モデル", [{ v: "fixed", label: "固定効果モデル" }, { v: "random", label: "変量効果モデル" }], "fixed")}</div>
      <div class="widget-stage"><div id="fp_host"></div></div>
      <div id="fp_toggles" class="legend-row" style="margin-top:10px"></div>
      ${readoutRow([{ id: "fp_or", label: "統合OR", value: "—" }, { id: "fp_ci", label: "95%CI", value: "—" }, { id: "fp_i2", label: "I² (異質性)", value: "—" }])}
      <p class="widget-note">四角の大きさは各研究の重み（サンプルサイズ・推定精度）に比例します。下のチェックを外すと、その研究を除いた統合結果（緑のダイヤモンド）がどう動くか確認できます。</p>`;
    const toggleHost = document.getElementById("fp_toggles");
    toggleHost.innerHTML = baseStudies.map((s, i) => `<label class="li" style="cursor:pointer"><input type="checkbox" data-i="${i}" checked style="margin-right:4px"/>${s.label}</label>`).join("");
    let model = "fixed";
    function draw() {
      const active = baseStudies.filter((s) => s.active);
      const studies = active.map((s) => ({ yi: s.yi, vi: s.vi }));
      const res = model === "fixed" ? CK.fixedEffectMeta(studies) : CK.randomEffectMeta(studies);
      const host = document.getElementById("fp_host");
      const pOR = Math.exp(res.pooled), loOR = Math.exp(res.pooled - 1.96 * res.se), hiOR = Math.exp(res.pooled + 1.96 * res.se);
      const xMax = Math.max(2.2, Math.exp(Math.max(...baseStudies.map((s) => Math.log(s.ciHi)))) + 0.2);
      const ctx = CK.plot(host, { width: 640, height: 40 + baseStudies.length * 34, margin: { top: 14, right: 24, bottom: 34, left: 150 }, xDomain: [0, xMax], yDomain: [0, baseStudies.length + 1], yTicks: 0, xTicks: 4, xLabel: "オッズ比 (OR)" });
      CK.vline(ctx, 1, { stroke: "#9aa2b6" });
      const maxInvVar = Math.max(...active.map((a) => 1 / a.vi));
      baseStudies.forEach((s, i) => {
        const yc = baseStudies.length - i;
        CK.textPx(ctx, 6, ctx.y(yc) + 4, s.label, { "font-size": 11.5, fill: s.active ? "#1b2233" : "#c4c9d6" });
        if (!s.active) return;
        CK.line(ctx, [[Math.exp(s.yi - 1.96 * Math.sqrt(s.vi)), yc], [Math.exp(s.yi + 1.96 * Math.sqrt(s.vi)), yc]], { stroke: "#3b63e0", "stroke-width": 1.6 });
        const size = 6 + 10 * ((1 / s.vi) / maxInvVar);
        const px = ctx.x(Math.exp(s.yi)), py = ctx.y(yc);
        ctx.svg.appendChild(CK.el("rect", { x: px - size / 2, y: py - size / 2, width: size, height: size, fill: "#3b63e0" }));
      });
      const py2 = 0.15;
      const diamond = `M ${ctx.x(loOR)} ${ctx.y(py2)} L ${ctx.x(pOR)} ${ctx.y(py2 + 0.32)} L ${ctx.x(hiOR)} ${ctx.y(py2)} L ${ctx.x(pOR)} ${ctx.y(py2 - 0.32)} Z`;
      ctx.svg.appendChild(CK.el("path", { d: diamond, fill: "#0f9e73" }));
      CK.textPx(ctx, 6, ctx.y(py2) + 4, "統合結果", { "font-size": 11.5, "font-weight": 700, fill: "#0f9e73" });
      setReadout("fp_or", CK.fmt(pOR, 2));
      setReadout("fp_ci", `${CK.fmt(loOR, 2)} 〜 ${CK.fmt(hiOR, 2)}`);
      setReadout("fp_i2", CK.fmt(res.I2, 1) + "%");
    }
    bindSeg("fp_model", (v) => { model = v; draw(); });
    toggleHost.querySelectorAll("input").forEach((cb) => { cb.addEventListener("change", () => { baseStudies[+cb.dataset.i].active = cb.checked; draw(); }); });
    draw();
  };

  // 5. ネットワークメタアナリシス -----------------------------------------------------
  W.networkmeta = function (container) {
    const nodes = [
      { id: "A", label: "標準治療A", x: 0.5, y: 0.06 },
      { id: "B", label: "新薬B", x: 0.95, y: 0.38 },
      { id: "C", label: "新薬C", x: 0.78, y: 0.94 },
      { id: "D", label: "新薬D", x: 0.22, y: 0.94 },
      { id: "E", label: "新薬E", x: 0.05, y: 0.38 },
    ];
    const edges = [["A", "B", 8], ["A", "C", 3], ["A", "D", 5], ["A", "E", 6], ["B", "C", 2], ["D", "E", 4]];
    container.innerHTML = `<div class="widget-stage"><div id="nm_host"></div></div>
      <p class="widget-note">円（ノード）は治療法、線（エッジ）はその2治療を直接比較した試験があることを示し、太さは試験数・症例数の目安に対応します。ノードをクリックすると、直接比較（青）と間接比較で辿れる経路（オレンジ点線）がわかります。</p>`;
    const host = document.getElementById("nm_host");
    const Wd = 460, Hd = 460;
    const svg = CK.el("svg", { viewBox: `0 0 ${Wd} ${Hd}`, width: "100%", height: "auto", style: "display:block;max-width:420px;margin:0 auto" });
    host.appendChild(svg);
    let selected = null;
    function pos(n) { return [40 + n.x * (Wd - 80), 30 + n.y * (Hd - 90)]; }
    function neighbors(id) { return edges.filter((e) => e[0] === id || e[1] === id).map((e) => (e[0] === id ? e[1] : e[0])); }
    function draw() {
      svg.innerHTML = "";
      edges.forEach(([a, b, wt]) => {
        const na = nodes.find((n) => n.id === a), nb = nodes.find((n) => n.id === b);
        const [x1, y1] = pos(na), [x2, y2] = pos(nb);
        const stroke = selected && (a === selected || b === selected) ? "#3b63e0" : "#c7cce0";
        svg.appendChild(CK.el("line", { x1, y1, x2, y2, stroke, "stroke-width": 2 + wt * 1.1 }));
      });
      if (selected) {
        const dNeighbors = neighbors(selected);
        nodes.forEach((n) => {
          if (n.id === selected || dNeighbors.includes(n.id)) return;
          const shared = neighbors(n.id).some((x) => dNeighbors.includes(x));
          if (shared) {
            const [x1, y1] = pos(nodes.find((x) => x.id === selected));
            const [x2, y2] = pos(n);
            svg.appendChild(CK.el("line", { x1, y1, x2, y2, stroke: "#f59e0b", "stroke-width": 1.6, "stroke-dasharray": "6 4" }));
          }
        });
      }
      nodes.forEach((n) => {
        const [x, y] = pos(n);
        const isSel = n.id === selected;
        const isDirect = selected && neighbors(selected).includes(n.id);
        const r = 26;
        const fill = isSel ? "#3b63e0" : isDirect ? "#dbe6ff" : "#fff";
        const g = CK.el("g", { style: "cursor:pointer" });
        g.appendChild(CK.el("circle", { cx: x, cy: y, r, fill, stroke: "#3b63e0", "stroke-width": 2 }));
        const t = CK.el("text", { x, y: y + 4, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: isSel ? "#fff" : "#1b2233" }); t.textContent = n.id;
        g.appendChild(t);
        const t2 = CK.el("text", { x, y: y + r + 16, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d" }); t2.textContent = n.label;
        g.appendChild(t2);
        g.addEventListener("click", () => { selected = selected === n.id ? null : n.id; draw(); });
        svg.appendChild(g);
      });
    }
    draw();
  };

  // 6. スイマープロット -------------------------------------------------------------
  W.swimmer = function (container) {
    const patients = [
      { id: "P01", dose: "高用量", dur: 32, events: [{ t: 4, type: "PR" }, { t: 32, type: "ongoing" }] },
      { id: "P02", dose: "高用量", dur: 18, events: [{ t: 3, type: "PR" }, { t: 18, type: "PD" }] },
      { id: "P03", dose: "高用量", dur: 26, events: [{ t: 6, type: "CR" }, { t: 26, type: "ongoing" }] },
      { id: "P04", dose: "中用量", dur: 14, events: [{ t: 5, type: "SD" }, { t: 14, type: "PD" }] },
      { id: "P05", dose: "中用量", dur: 29, events: [{ t: 4, type: "PR" }, { t: 29, type: "ongoing" }] },
      { id: "P06", dose: "中用量", dur: 9, events: [{ t: 9, type: "death" }] },
      { id: "P07", dose: "低用量", dur: 20, events: [{ t: 8, type: "SD" }, { t: 20, type: "PD" }] },
      { id: "P08", dose: "低用量", dur: 11, events: [{ t: 11, type: "PD" }] },
      { id: "P09", dose: "低用量", dur: 34, events: [{ t: 5, type: "PR" }, { t: 34, type: "ongoing" }] },
      { id: "P10", dose: "高用量", dur: 22, events: [{ t: 2, type: "PR" }, { t: 22, type: "PD" }] },
      { id: "P11", dose: "中用量", dur: 16, events: [{ t: 16, type: "death" }] },
      { id: "P12", dose: "低用量", dur: 7, events: [{ t: 7, type: "PD" }] },
    ];
    const doseColor = { 高用量: "#3b63e0", 中用量: "#0f9e73", 低用量: "#f59e0b" };
    const shape = { CR: "★", PR: "●", SD: "◆", PD: "■", ongoing: "▶", death: "✝" };
    let sortMode = "dur";
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("sw_sort", "並び替え", [{ v: "dur", label: "治療期間順" }, { v: "dose", label: "用量群でまとめる" }], "dur")}</div>
      <div class="widget-stage"><div id="sw_host"></div></div>
      <div class="legend-row">
        <span class="li"><span class="sw" style="background:#3b63e0"></span>高用量</span>
        <span class="li"><span class="sw" style="background:#0f9e73"></span>中用量</span>
        <span class="li"><span class="sw" style="background:#f59e0b"></span>低用量</span>
        <span class="li">★完全奏効　●部分奏効　◆病勢安定　■進行　▶治療継続中　✝死亡</span>
      </div>`;
    function draw() {
      const list = patients.slice().sort((a, b) => (sortMode === "dur" ? b.dur - a.dur : a.dose === b.dose ? b.dur - a.dur : a.dose.localeCompare(b.dose)));
      const host = document.getElementById("sw_host");
      const ctx = CK.plot(host, { width: 640, height: 40 + list.length * 28, margin: { top: 10, right: 20, bottom: 34, left: 42 }, xDomain: [0, 36], yDomain: [0, list.length + 0.5], yTicks: 0, xTicks: 6, xLabel: "治療期間（月）" });
      list.forEach((p, i) => {
        const yc = list.length - i;
        CK.line(ctx, [[0, yc], [p.dur, yc]], { stroke: doseColor[p.dose], "stroke-width": 7, "stroke-linecap": "round", opacity: 0.35 });
        CK.textPx(ctx, ctx.margin.left - 8, ctx.y(yc) + 4, p.id, { "text-anchor": "end", "font-size": 10.5, fill: "#616a7d" });
        p.events.forEach((ev) => { CK.textPx(ctx, ctx.x(ev.t), ctx.y(yc) + 4, shape[ev.type], { "text-anchor": "middle", "font-size": ev.type === "death" ? 13 : 12, fill: doseColor[p.dose], "font-weight": 700 }); });
      });
    }
    bindSeg("sw_sort", (v) => { sortMode = v; draw(); });
    draw();
  };

  // 7. ウォーターフォールプロット ------------------------------------------------------
  W.waterfall = function (container) {
    const state = { orr: 45, n: 28 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("wf_orr", "薬剤の効きやすさ（イメージ）", 5, 90, 5, state.orr, (v) => v + "%")}
        <button class="btn" id="wf_redraw">🎲 コホートを引き直す</button>
      </div>
      <div class="widget-stage"><div id="wf_host"></div></div>
      ${readoutRow([{ id: "wf_orr2", label: "客観的奏効率 ORR (CR+PR)", value: "—" }, { id: "wf_dcr", label: "病勢コントロール率 DCR", value: "—" }])}
      <p class="widget-note">各棒は1人の患者の最良腫瘍縮小率。-30%のラインを超えて縮小（下側）していればPR以上、+20%を超えて増大（上側）していればPDです。</p>`;
    let data = [];
    function resample() {
      const bias = ((state.orr - 50) / 50) * 40;
      data = Array.from({ length: state.n }, () => Math.max(-100, Math.min(120, CK.randNormal(-bias * 0.6, 32))));
    }
    function draw() {
      const sorted = data.slice().sort((a, b) => b - a);
      const host = document.getElementById("wf_host");
      const ctx = CK.plot(host, { width: 640, height: 320, margin: { top: 16, right: 20, bottom: 36, left: 46 }, xDomain: [0, sorted.length], yDomain: [-100, 120], xTicks: 0, yTicks: 5, xLabel: "患者（反応が悪い順に左から並べる）", yFmt: (v) => v + "%", yLabel: "ベースラインからの最良変化率" });
      CK.hline(ctx, -30, { stroke: "#0f9e73" });
      CK.hline(ctx, 20, { stroke: "#e5484d" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(-30) - 5, "PR閾値 -30%", { "font-size": 10, fill: "#0f9e73" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(20) - 5, "PD閾値 +20%", { "font-size": 10, fill: "#e5484d" });
      sorted.forEach((v, i) => {
        const color = v <= -30 ? "#0f9e73" : v >= 20 ? "#e5484d" : "#9aa2b6";
        CK.rectData(ctx, i + 0.15, 0, i + 0.85, v, { fill: color, opacity: 0.85 });
      });
      setReadout("wf_orr2", ((data.filter((v) => v <= -30).length / data.length) * 100).toFixed(0) + "%");
      setReadout("wf_dcr", ((data.filter((v) => v < 20).length / data.length) * 100).toFixed(0) + "%");
    }
    bindSlider("wf_orr", (v) => v + "%", (v) => { state.orr = v; resample(); draw(); });
    document.getElementById("wf_redraw").addEventListener("click", () => { resample(); draw(); });
    resample(); draw();
  };

  // 8. スパイダープロット --------------------------------------------------------------
  W.spider = function (container) {
    let showPseudo = true;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px"><label class="li" style="font-size:12.5px;cursor:pointer"><input type="checkbox" id="sp_pseudo" checked style="margin-right:6px"/>偽増悪（pseudoprogression）の例を含める</label></div>
      <div class="widget-stage"><div id="sp_host"></div></div>
      <p class="widget-note">免疫療法では、一時的に腫瘍が増大して見えた後に縮小する「偽増悪」が起こることがあります。ウォーターフォールプロット（最良反応のみ）では見逃してしまう、この時間的な動きを追えるのがスパイダープロットの強みです。</p>`;
    function clampPush(arr, v) { arr.push(Math.max(-99, Math.min(99, v))); }
    function genLine(kind) {
      const t = [0, 4, 8, 12, 16, 20, 24];
      const v = [0];
      let cur = 0;
      if (kind === "responder") { t.slice(1).forEach(() => { cur += CK.randNormal(-14, 6); clampPush(v, cur); }); }
      else if (kind === "pd") { t.slice(1).forEach(() => { cur += CK.randNormal(14, 6); clampPush(v, cur); }); }
      else if (kind === "pseudo") { t.forEach((tt, i) => { if (i === 0) return; cur += i <= 2 ? CK.randNormal(16, 4) : -CK.randNormal(22, 5); clampPush(v, cur); }); }
      else { t.slice(1).forEach(() => { cur += CK.randNormal(0, 8); clampPush(v, cur); }); }
      return t.map((tt, i) => [tt, v[i]]);
    }
    function draw() {
      const host = document.getElementById("sp_host");
      const lines = [{ kind: "responder", color: "#0f9e73" }, { kind: "responder", color: "#0f9e73" }, { kind: "stable", color: "#9aa2b6" }, { kind: "stable", color: "#9aa2b6" }, { kind: "pd", color: "#e5484d" }];
      if (showPseudo) lines.push({ kind: "pseudo", color: "#3b63e0" });
      const ctx = CK.plot(host, { width: 600, height: 320, margin: { top: 16, right: 20, bottom: 36, left: 46 }, xDomain: [0, 24], yDomain: [-100, 100], xTicks: 6, yTicks: 5, xLabel: "時間（週）", yFmt: (v) => v + "%", yLabel: "ベースラインからの変化率" });
      CK.hline(ctx, -30, { stroke: "#0f9e73" });
      CK.hline(ctx, 20, { stroke: "#e5484d", "stroke-dasharray": "4 3" });
      lines.forEach((l) => CK.line(ctx, genLine(l.kind), { stroke: l.color, "stroke-width": l.kind === "pseudo" ? 2.6 : 1.8 }));
      if (showPseudo) CK.textPx(ctx, ctx.x(11), ctx.y(34), "← 偽増悪の例（後で縮小）", { "font-size": 10.5, fill: "#3b63e0", "font-weight": 700 });
    }
    document.getElementById("sp_pseudo").addEventListener("change", (e) => { showPseudo = e.target.checked; draw(); });
    draw();
  };

  // 9. 家系図 --------------------------------------------------------------------------
  W.pedigree = function (container) {
    const patterns = {
      ad: { name: "常染色体優性 (AD)", note: "各世代に罹患者が現れやすく、罹患者の親も罹患していることが多い。", people: [
        { id: "I-1", sex: "F", affected: false, gen: 1, x: 2 },
        { id: "I-2", sex: "M", affected: true, gen: 1, x: 3 },
        { id: "II-1", sex: "F", affected: true, gen: 2, x: 1, parents: ["I-1", "I-2"] },
        { id: "II-2", sex: "M", affected: false, gen: 2, x: 2.3, spouseOf: "II-1" },
        { id: "II-3", sex: "M", affected: true, gen: 2, x: 3.6, parents: ["I-1", "I-2"] },
        { id: "III-1", sex: "F", affected: true, gen: 3, x: 1, parents: ["II-1", "II-2"] },
        { id: "III-2", sex: "M", affected: false, gen: 3, x: 1.8, parents: ["II-1", "II-2"] },
      ] },
      ar: { name: "常染色体劣性 (AR)", note: "両親は非罹患（保因者）のことが多く、同世代の同胞に罹患者が集中しやすい。", people: [
        { id: "I-1", sex: "F", affected: false, gen: 1, x: 2 },
        { id: "I-2", sex: "M", affected: false, gen: 1, x: 3 },
        { id: "II-1", sex: "M", affected: true, gen: 2, x: 1.4, parents: ["I-1", "I-2"] },
        { id: "II-2", sex: "F", affected: false, gen: 2, x: 2.4, parents: ["I-1", "I-2"] },
        { id: "II-3", sex: "M", affected: true, gen: 2, x: 3.4, parents: ["I-1", "I-2"] },
      ] },
      xl: { name: "X連鎖劣性", note: "罹患者はほぼ男性のみ。母親（保因者）を介して母方の血縁に罹患者が見られやすい。", people: [
        { id: "I-1", sex: "F", affected: false, gen: 1, x: 2 },
        { id: "I-2", sex: "M", affected: false, gen: 1, x: 3 },
        { id: "II-1", sex: "F", affected: false, gen: 2, x: 1.4, parents: ["I-1", "I-2"] },
        { id: "II-2", sex: "M", affected: false, gen: 2, x: 2.4, spouseOf: "II-1" },
        { id: "II-3", sex: "M", affected: true, gen: 2, x: 3.4, parents: ["I-1", "I-2"] },
        { id: "III-1", sex: "M", affected: true, gen: 3, x: 1.4, parents: ["II-1", "II-2"] },
      ] },
    };
    let cur = "ad";
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("pd_pattern", "家系パターン", [{ v: "ad", label: "常染色体優性" }, { v: "ar", label: "常染色体劣性" }, { v: "xl", label: "X連鎖劣性" }], "ad")}</div>
      <div class="widget-stage"><div id="pd_host"></div></div>
      <div id="pd_note" class="card" style="margin:14px 0 0;padding:14px 16px"></div>
      <div class="legend-row"><span class="li">□ 男性　○ 女性　■●罹患者　─ 婚姻　│ 子</span></div>`;
    function personById(list, id) { return list.find((x) => x.id === id); }
    function draw() {
      const p = patterns[cur];
      document.getElementById("pd_note").innerHTML = `<b>${p.name}</b><br/><span style="color:var(--text-muted);font-size:13px">${p.note}</span>`;
      const host = document.getElementById("pd_host");
      const Wd = 560, Hd = 60 + Math.max(...p.people.map((x) => x.gen)) * 110;
      const svg = CK.el("svg", { viewBox: `0 0 ${Wd} ${Hd}`, width: "100%", height: "auto", style: "display:block;max-width:520px;margin:0 auto" });
      const px = (x) => 60 + x * 110, py = (gen) => 40 + (gen - 1) * 110;
      p.people.forEach((person) => {
        if (person.spouseOf) {
          const sp = personById(p.people, person.spouseOf);
          svg.appendChild(CK.el("line", { x1: px(sp.x), y1: py(sp.gen), x2: px(person.x), y2: py(person.gen), stroke: "#9aa2b6", "stroke-width": 1.6 }));
        }
        if (person.parents) {
          const a = personById(p.people, person.parents[0]), b = personById(p.people, person.parents[1]);
          const midX = (px(a.x) + px(b.x)) / 2, midY = py(a.gen);
          svg.appendChild(CK.el("line", { x1: midX, y1: midY, x2: midX, y2: midY + 30, stroke: "#9aa2b6", "stroke-width": 1.6 }));
          svg.appendChild(CK.el("line", { x1: midX, y1: midY + 30, x2: px(person.x), y2: midY + 30, stroke: "#9aa2b6", "stroke-width": 1.6 }));
          svg.appendChild(CK.el("line", { x1: px(person.x), y1: midY + 30, x2: px(person.x), y2: py(person.gen), stroke: "#9aa2b6", "stroke-width": 1.6 }));
        }
      });
      const couples = new Set();
      p.people.forEach((person) => { if (person.parents) couples.add(person.parents.join("|")); });
      couples.forEach((key) => {
        const [aId, bId] = key.split("|"), a = personById(p.people, aId), b = personById(p.people, bId);
        svg.appendChild(CK.el("line", { x1: px(a.x), y1: py(a.gen), x2: px(b.x), y2: py(b.gen), stroke: "#9aa2b6", "stroke-width": 1.6 }));
      });
      p.people.forEach((person) => {
        const x = px(person.x), y = py(person.gen);
        const fill = person.affected ? "#3b63e0" : "#fff";
        const g = CK.el("g");
        if (person.sex === "M") g.appendChild(CK.el("rect", { x: x - 16, y: y - 16, width: 32, height: 32, fill, stroke: "#1b2233", "stroke-width": 1.6 }));
        else g.appendChild(CK.el("circle", { cx: x, cy: y, r: 17, fill, stroke: "#1b2233", "stroke-width": 1.6 }));
        const t = CK.el("text", { x, y: y + 32, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d" }); t.textContent = person.id;
        g.appendChild(t);
        svg.appendChild(g);
      });
      host.innerHTML = ""; host.appendChild(svg);
    }
    bindSeg("pd_pattern", (v) => { cur = v; draw(); });
    draw();
  };

  // 10. バリアント表記法（HGVS） --------------------------------------------------------
  W.hgvs = function (container) {
    container.innerHTML = `
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        <div style="flex:1;min-width:280px">
          <h3 style="font-size:13.5px;margin-bottom:10px">① 塩基配列（cDNA）レベルの表記</h3>
          <div class="w-controls" style="margin-bottom:10px">
            <div class="field"><label>参照配列ID</label><input id="hg_ref" type="text" value="NM_000546.6" style="padding:7px 10px;border:1px solid var(--border-strong);border-radius:8px;font-family:var(--font-mono)"/></div>
            <div class="field"><label>位置</label><input id="hg_pos" type="number" value="215" min="1" style="padding:7px 10px;border:1px solid var(--border-strong);border-radius:8px;width:100px;font-family:var(--font-mono)"/></div>
            ${segRow("hg_ref_base", "置換前の塩基", [{ v: "G", label: "G" }, { v: "A", label: "A" }, { v: "T", label: "T" }, { v: "C", label: "C" }], "G")}
            ${segRow("hg_alt_base", "置換後の塩基", [{ v: "A", label: "A" }, { v: "G", label: "G" }, { v: "T", label: "T" }, { v: "C", label: "C" }], "A")}
          </div>
          <div class="widget-readout"><div class="ro" style="min-width:100%">生成されたHGVS表記<b id="hg_out_c" style="font-size:15px;font-family:var(--font-mono)"></b></div></div>
        </div>
        <div style="flex:1;min-width:280px">
          <h3 style="font-size:13.5px;margin-bottom:10px">② アミノ酸配列レベルの表記</h3>
          <div class="w-controls" style="margin-bottom:10px">
            <div class="field"><label>参照配列ID</label><input id="hg_pref" type="text" value="NP_000537.3" style="padding:7px 10px;border:1px solid var(--border-strong);border-radius:8px;font-family:var(--font-mono)"/></div>
            <div class="field"><label>位置</label><input id="hg_ppos" type="number" value="72" min="1" style="padding:7px 10px;border:1px solid var(--border-strong);border-radius:8px;width:100px;font-family:var(--font-mono)"/></div>
            <div class="field"><label>変化前アミノ酸(1文字)</label><input id="hg_aa1" maxlength="1" value="R" style="padding:7px 10px;border:1px solid var(--border-strong);border-radius:8px;width:60px;font-family:var(--font-mono);text-transform:uppercase"/></div>
            <div class="field"><label>変化後アミノ酸(1文字)</label><input id="hg_aa2" maxlength="1" value="P" style="padding:7px 10px;border:1px solid var(--border-strong);border-radius:8px;width:60px;font-family:var(--font-mono);text-transform:uppercase"/></div>
          </div>
          <div class="widget-readout"><div class="ro" style="min-width:100%">生成されたHGVS表記<b id="hg_out_p" style="font-size:15px;font-family:var(--font-mono)"></b></div></div>
        </div>
      </div>
      <p class="widget-note">"c." はcDNA参照配列上の位置、"p." はタンパク質参照配列上のアミノ酸位置を示します。区切り文字の後にスペースを入れないのがルールです。終止コドンは <code>Ter</code> または <code>*</code> で表記します。</p>`;
    function updateC() {
      const ref = document.getElementById("hg_ref").value.trim() || "NM_000000.0";
      const pos = document.getElementById("hg_pos").value || "1";
      const rb = document.querySelector("#hg_ref_base button.active").dataset.v;
      const ab = document.querySelector("#hg_alt_base button.active").dataset.v;
      document.getElementById("hg_out_c").textContent = `${ref}:c.${pos}${rb}>${ab}`;
    }
    function updateP() {
      const ref = document.getElementById("hg_pref").value.trim() || "NP_000000.0";
      const pos = document.getElementById("hg_ppos").value || "1";
      const aa1 = (document.getElementById("hg_aa1").value || "X").toUpperCase();
      const aa2 = (document.getElementById("hg_aa2").value || "X").toUpperCase();
      const three1 = CK.AA3[aa1] || "Xaa", three2 = CK.AA3[aa2] || "Xaa";
      document.getElementById("hg_out_p").textContent = `${ref}:p.${three1}${pos}${three2}`;
    }
    ["hg_ref", "hg_pos"].forEach((id) => document.getElementById(id).addEventListener("input", updateC));
    bindSeg("hg_ref_base", updateC); bindSeg("hg_alt_base", updateC);
    ["hg_pref", "hg_ppos", "hg_aa1", "hg_aa2"].forEach((id) => document.getElementById(id).addEventListener("input", updateP));
    updateC(); updateP();
  };
})();

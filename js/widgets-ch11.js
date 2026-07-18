/* 第11章：機械学習 — batch1 widgets (topics 1〜8)
   （学習曲線・混同行列/評価指標・アンサンブル・SHAP・畳み込み・転移学習・アテンション・セグメンテーション） */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const CYAN = "#22d3ee";
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f2f4f8" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  // standard normal CDF (approx via erf)
  function ncdf(x, mu, sd) { const z = (x - mu) / (sd * Math.SQRT2); const t = 1 / (1 + 0.3275911 * Math.abs(z)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z); const erf = z >= 0 ? y : -y; return 0.5 * (1 + erf); }

  // 1. Learning curve — overfitting -----------------------------------------
  W.mllearningcurve = function (container) {
    const state = { reg: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("lc_r", "過学習の抑制(正則化)", 0, 1, 0.05, state.reg, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="lc_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#22d3ee"></span>学習データ</span><span class="li"><span class="sw" style="background:#ef5350"></span>検証データ</span></div></div>
      ${readoutRow([{ id: "lc_v", label: "過学習", value: "—" }, { id: "lc_g", label: "汎化性能", value: "—" }])}
      <p class="widget-note">損失の学習曲線。学習データ(シアン)は下がり続けますが、<b>検証データ(赤)が途中から増加に転じると過学習</b>。正則化を強めると検証損失の反転が抑えられ、汎化性能が保たれます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("lc_plot"), { width: 460, height: 250, xDomain: [0, 100], yDomain: [0, 2], xTicks: 5, yTicks: 4, xLabel: "エポック", yLabel: "損失 (loss)", xFmt: (v) => v, yFmt: (v) => v.toFixed(1) });
      const train = [], val = [];
      const overfit = (1 - state.reg); // 0 = no overfit
      for (let e = 0; e <= 100; e += 2) {
        const base = 0.15 + 1.7 * Math.exp(-e / 18);
        train.push([e, base]);
        const rise = overfit * 0.9 * clamp((e - 30) / 70, 0, 1);
        val.push([e, base + 0.12 + rise]);
      }
      CK.line(ctx, train, { stroke: CYAN, "stroke-width": 2.6 });
      CK.line(ctx, val, { stroke: "#ef5350", "stroke-width": 2.6 });
      setReadout("lc_v", overfit > 0.5 ? "強い(検証損失が上昇)" : overfit > 0.2 ? "軽度" : "ほぼ無し");
      setReadout("lc_g", state.reg > 0.6 ? "良好" : state.reg > 0.3 ? "中程度" : "低い");
    }
    bindSlider("lc_r", (v) => (v * 100).toFixed(0) + "%", (v) => { state.reg = v; draw(); });
    draw();
  };

  // 2. Confusion matrix + metrics vs threshold -----------------------------
  W.mlmetrics = function (container) {
    const state = { thr: 50 };
    const N = 200; // per class
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("mm_t", "分類のしきい値", 10, 90, 1, state.thr, (v) => (v / 100).toFixed(2))}</div>
      <div class="widget-stage"><div id="mm_plot"></div></div>
      ${readoutRow([{ id: "mm_a", label: "Accuracy", value: "—" }, { id: "mm_f", label: "F1-score", value: "—" }])}
      <p class="widget-note">陽性(平均0.65)と陰性(平均0.35)のスコア分布に<b>しきい値</b>を引いて予測。混同行列(TP/FP/FN/TN)とprecision・recall・F1が変わります。<b>precisionとrecallはトレードオフ</b>です。</p>`;
    function draw() {
      const W2 = 460, H2 = 250, s = lightPanel(document.getElementById("mm_plot"), W2, H2, "#f6f8fb");
      const t = state.thr / 100;
      const TP = Math.round(N * (1 - ncdf(t, 0.65, 0.15)));
      const FN = N - TP;
      const FP = Math.round(N * (1 - ncdf(t, 0.35, 0.15)));
      const TN = N - FP;
      // confusion matrix 2x2
      const gx = 60, gy = 40, cell = 78;
      const cells = [[TP, "#1f9d6b", 0, 0], [FN, "#cfe8dd", 1, 0], [FP, "#cfe8dd", 0, 1], [TN, "#1f9d6b", 1, 1]];
      add(s, "text", { x: gx + cell, y: gy - 14, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: "予測ラベル" });
      cells.forEach((c) => {
        const x = gx + c[2] * cell, y = gy + c[3] * cell;
        add(s, "rect", { x: x, y: y, width: cell - 2, height: cell - 2, fill: c[1] });
        add(s, "text", { x: x + cell / 2, y: y + cell / 2 + 5, "text-anchor": "middle", "font-size": 15, fill: (c[1] === "#1f9d6b") ? "#fff" : "#3a5a4c", "font-weight": 700, text: c[0] });
      });
      add(s, "text", { x: gx + cell / 2, y: gy + 2 * cell + 16, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "陽性" });
      add(s, "text", { x: gx + cell * 1.5, y: gy + 2 * cell + 16, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "陰性" });
      add(s, "text", { x: gx - 12, y: gy + cell / 2 + 4, "text-anchor": "end", "font-size": 9, fill: "#8a93a8", text: "陽性" });
      add(s, "text", { x: gx - 12, y: gy + cell * 1.5 + 4, "text-anchor": "end", "font-size": 9, fill: "#8a93a8", text: "陰性" });
      // metrics
      const acc = (TP + TN) / (2 * N), prec = TP / Math.max(1, TP + FP), rec = TP / Math.max(1, TP + FN), f1 = 2 * prec * rec / Math.max(1e-6, prec + rec);
      const mx = 280;
      [["Precision", prec, "#3aa0ff"], ["Recall", rec, "#f97316"], ["F1", f1, CYAN]].forEach((m, i) => {
        const y = 60 + i * 44;
        add(s, "text", { x: mx, y: y - 4, "font-size": 10.5, fill: "#616a7d", text: m[0] + " = " + m[1].toFixed(2) });
        add(s, "rect", { x: mx, y: y, width: 140, height: 12, rx: 6, fill: "#e2e6ee" });
        add(s, "rect", { x: mx, y: y, width: 140 * m[1], height: 12, rx: 6, fill: m[2] });
      });
      setReadout("mm_a", acc.toFixed(3));
      setReadout("mm_f", f1.toFixed(3));
    }
    bindSlider("mm_t", (v) => (v / 100).toFixed(2), (v) => { state.thr = v; draw(); });
    draw();
  };

  // 3. Ensemble — accuracy vs number of weak learners ----------------------
  W.ensemble = function (container) {
    const state = { mode: "bag", n: 10 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("en_m", "手法", [{ v: "bag", label: "バギング" }, { v: "boost", label: "ブースティング" }], "bag")}${sliderRow("en_n", "弱学習器の数", 1, 50, 1, 10, (v) => v.toFixed(0) + " 個")}</div>
      <div class="widget-stage"><div id="en_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#22d3ee"></span>アンサンブル</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>単一弱学習器</span></div></div>
      ${readoutRow([{ id: "en_a", label: "アンサンブル精度", value: "—" }, { id: "en_r", label: "主に減らすもの", value: "—" }])}
      <p class="widget-note">弱学習器を増やすほど<b>アンサンブルの精度が単一モデルを上回って</b>いきます(三人寄れば文殊の知恵)。バギングは<b>バリアンス</b>、ブースティングは<b>バイアス</b>を主に減らします。</p>`;
    function acc(n, boost) {
      if (boost) return 0.72 + 0.21 * (1 - Math.exp(-n / 8)) - clamp((n - 35) / 15, 0, 1) * 0.04; // slight overfit late
      return 0.72 + 0.17 * (1 - Math.exp(-n / 6));
    }
    function draw() {
      const ctx = CK.plot(document.getElementById("en_plot"), { width: 460, height: 250, xDomain: [1, 50], yDomain: [0.6, 1.0], xTicks: 5, yTicks: 4, xLabel: "弱学習器の数", yLabel: "精度 (accuracy)", xFmt: (v) => v, yFmt: (v) => v.toFixed(2) });
      const boost = state.mode === "boost";
      const pts = []; for (let n = 1; n <= 50; n += 1) pts.push([n, acc(n, boost)]);
      CK.line(ctx, [[1, 0.72], [50, 0.72]], { stroke: "#9aa6b4", "stroke-width": 2, "stroke-dasharray": "5 4" });
      CK.line(ctx, pts, { stroke: CYAN, "stroke-width": 2.6 });
      const cur = acc(state.n, boost);
      CK.vline(ctx, state.n, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.n, cur, { r: 5, fill: CYAN });
      setReadout("en_a", cur.toFixed(3));
      setReadout("en_r", boost ? "バイアス(予測の偏り)" : "バリアンス(不安定性)");
    }
    bindSeg("en_m", (v) => { state.mode = v; draw(); });
    bindSlider("en_n", (v) => v.toFixed(0) + " 個", (v) => { state.n = v; draw(); });
    draw();
  };

  // 4. XAI — SHAP force/waterfall for a prediction --------------------------
  W.xai = function (container) {
    const state = { age: 60, ntp: 0.4 };
    const base = 0.28;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("xa_a", "年齢 (歳)", 30, 90, 1, state.age, (v) => v.toFixed(0))}${sliderRow("xa_n", "NT-proBNP (相対)", 0, 1, 0.05, state.ntp, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="xa_plot"></div></div>
      ${readoutRow([{ id: "xa_r", label: "予測死亡リスク", value: "—" }, { id: "xa_top", label: "最大の押し上げ要因", value: "—" }])}
      <p class="widget-note">3年死亡予測のSHAP。基準値から、各特徴量のSHAP値が予測を<b>赤=押し上げ／青=押し下げ</b>ます。年齢・NT-proBNPが高いほどリスクを押し上げる局所的説明を体感しましょう。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, s = lightPanel(document.getElementById("xa_plot"), W2, H2, "#f6f8fb");
      const shapAge = (state.age - 60) / 30 * 0.22;
      const shapNtp = (state.ntp - 0.4) * 0.34;
      const shapWt = -0.06, shapOther = 0.03;
      const feats = [{ n: "年齢", v: shapAge }, { n: "NT-proBNP", v: shapNtp }, { n: "体重", v: shapWt }, { n: "その他", v: shapOther }];
      const risk = clamp(base + feats.reduce((a, f) => a + f.v, 0), 0.02, 0.98);
      // waterfall
      const x0 = 150, scale = 320, y0 = 40, bh = 30, gap = 12;
      add(s, "text", { x: 20, y: y0 - 14, "font-size": 10, fill: "#616a7d", text: "基準値 " + base.toFixed(2) });
      let acc = base;
      feats.forEach((f, i) => {
        const y = y0 + i * (bh + gap);
        const xStart = x0 + (acc - 0.5) * scale;
        const xEnd = x0 + (acc + f.v - 0.5) * scale;
        add(s, "rect", { x: Math.min(xStart, xEnd), y: y, width: Math.abs(xEnd - xStart) + 1, height: bh, fill: f.v >= 0 ? "#ef5350" : "#3aa0ff", opacity: 0.85 });
        add(s, "text", { x: 20, y: y + bh / 2 + 4, "font-size": 10.5, fill: "#616a7d", text: f.n });
        add(s, "text", { x: Math.max(xStart, xEnd) + 6, y: y + bh / 2 + 4, "font-size": 9.5, fill: f.v >= 0 ? "#c0392b" : "#2a6ea8", text: (f.v >= 0 ? "+" : "") + f.v.toFixed(2) });
        acc += f.v;
      });
      // base & final markers
      add(s, "line", { x1: x0, y1: y0 - 6, x2: x0, y2: H2 - 20, stroke: "#9aa6b4", "stroke-dasharray": "3 3" });
      const fx = x0 + (risk - 0.5) * scale;
      add(s, "line", { x1: fx, y1: y0 - 6, x2: fx, y2: H2 - 20, stroke: "#111", "stroke-width": 1.5 });
      add(s, "text", { x: fx, y: H2 - 8, "text-anchor": "middle", "font-size": 10, fill: "#111", "font-weight": 700, text: "予測 " + risk.toFixed(2) });
      setReadout("xa_r", (risk * 100).toFixed(0) + "%");
      const pushers = feats.filter((f) => f.v > 0).sort((a, b) => b.v - a.v);
      setReadout("xa_top", pushers.length ? pushers[0].n : "なし");
    }
    bindSlider("xa_a", (v) => v.toFixed(0), (v) => { state.age = v; draw(); });
    bindSlider("xa_n", (v) => (v * 100).toFixed(0) + "%", (v) => { state.ntp = v; draw(); });
    draw();
  };

  // 5. CNN — convolution filter -> feature map -----------------------------
  W.cnn = function (container) {
    const state = { k: "vedge" };
    // input image (12x12) with a diagonal + a horizontal bar
    const NI = 12, img = [];
    for (let y = 0; y < NI; y++) { img.push([]); for (let x = 0; x < NI; x++) { let v = 0; if (Math.abs(x - y) <= 1) v = 1; if (y >= 4 && y <= 5 && x >= 2 && x <= 9) v = 1; img[y].push(v); } }
    const kernels = {
      vedge: { m: [[1, 0, -1], [1, 0, -1], [1, 0, -1]], lab: "縦エッジ" },
      hedge: { m: [[1, 1, 1], [0, 0, 0], [-1, -1, -1]], lab: "横エッジ" },
      blur: { m: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], lab: "ぼかし" },
    };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("cn_k", "フィルタ(カーネル)", [{ v: "vedge", label: "縦エッジ" }, { v: "hedge", label: "横エッジ" }, { v: "blur", label: "ぼかし" }], "vedge")}</div>
      <div class="widget-stage"><div id="cn_plot"></div></div>
      ${readoutRow([{ id: "cn_f", label: "抽出される特徴", value: "—" }, { id: "cn_k2", label: "カーネル", value: "—" }])}
      <p class="widget-note">小さな<b>フィルタ(カーネル)で入力画像をスキャン</b>して局所特徴を抽出。フィルタの種類で、縦エッジ・横エッジ・ぼかしなど<b>異なる特徴マップ</b>が得られます。これが畳み込みの本質です。</p>`;
    function draw() {
      const W2 = 460, H2 = 220, s = lightPanel(document.getElementById("cn_plot"), W2, H2, "#f6f8fb");
      const ker = kernels[state.k], K = ker.m;
      const cs = 14;
      // input
      add(s, "text", { x: 14 + NI * cs / 2, y: 16, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: "入力画像" });
      for (let y = 0; y < NI; y++) for (let x = 0; x < NI; x++) add(s, "rect", { x: 14 + x * cs, y: 24 + y * cs, width: cs - 1, height: cs - 1, fill: img[y][x] ? "#2b3a55" : "#e7ebf2" });
      // output feature map (convolution, abs-normalized)
      const NO = NI - 2, out = [];
      let mx = 0.001;
      for (let y = 0; y < NO; y++) { out.push([]); for (let x = 0; x < NO; x++) { let sum = 0; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) sum += img[y + j][x + i] * K[j][i]; if (state.k === "blur") sum /= 9; out[y].push(sum); mx = Math.max(mx, Math.abs(sum)); } }
      const ox = 260;
      add(s, "text", { x: ox + NO * cs / 2, y: 16, "text-anchor": "middle", "font-size": 10, fill: "#616a7d", text: "出力特徴マップ" });
      for (let y = 0; y < NO; y++) for (let x = 0; x < NO; x++) { const v = out[y][x] / mx; const c = state.k === "blur" ? `rgb(${Math.round(255 - clamp(v, 0, 1) * 200)},${Math.round(255 - clamp(v, 0, 1) * 130)},${Math.round(255 - clamp(v, 0, 1) * 60)})` : (v >= 0 ? `rgba(34,211,238,${clamp(v, 0, 1)})` : `rgba(239,83,80,${clamp(-v, 0, 1)})`); add(s, "rect", { x: ox + x * cs, y: 24 + y * cs, width: cs - 1, height: cs - 1, fill: c }); }
      setReadout("cn_f", ker.lab);
      setReadout("cn_k2", "3×3 " + ker.lab + "検出");
    }
    bindSeg("cn_k", (v) => { state.k = v; draw(); });
    draw();
  };

  // 6. Transfer learning — accuracy vs data size ---------------------------
  W.transferlearning = function (container) {
    const state = { data: 0.2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("tl_d", "新タスクの学習データ量", 0, 1, 0.05, state.data, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="tl_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#22d3ee"></span>転移学習</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>ゼロから学習</span></div></div>
      ${readoutRow([{ id: "tl_t", label: "転移学習の精度", value: "—" }, { id: "tl_s", label: "ゼロから学習の精度", value: "—" }])}
      <p class="widget-note">データ量に対する精度。<b>転移学習は少ないデータでも高精度</b>を保つ(事前学習の知識)一方、<b>ゼロから学習は大量データが必要</b>で、少データでは精度が伸びません。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("tl_plot"), { width: 460, height: 250, xDomain: [0, 1], yDomain: [0.4, 1.0], xTicks: 5, yTicks: 4, xLabel: "学習データ量 (相対)", yLabel: "精度", xFmt: (v) => (v * 100).toFixed(0) + "%", yFmt: (v) => v.toFixed(2) });
      const trans = [], scratch = [];
      for (let d = 0; d <= 1; d += 0.02) { trans.push([d, 0.78 + 0.18 * (1 - Math.exp(-d * 6))]); scratch.push([d, 0.45 + 0.5 * (1 - Math.exp(-d * 2.3))]); }
      CK.line(ctx, scratch, { stroke: "#9aa6b4", "stroke-width": 2.4, "stroke-dasharray": "5 4" });
      CK.line(ctx, trans, { stroke: CYAN, "stroke-width": 2.6 });
      const tv = 0.78 + 0.18 * (1 - Math.exp(-state.data * 6)), sv = 0.45 + 0.5 * (1 - Math.exp(-state.data * 2.3));
      CK.vline(ctx, state.data, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.data, tv, { r: 5, fill: CYAN }); CK.dot(ctx, state.data, sv, { r: 4.5, fill: "#9aa6b4" });
      setReadout("tl_t", (tv * 100).toFixed(1) + "%");
      setReadout("tl_s", (sv * 100).toFixed(1) + "%");
    }
    bindSlider("tl_d", (v) => (v * 100).toFixed(0) + "%", (v) => { state.data = v; draw(); });
    draw();
  };

  // 7. Transformer — self-attention weights --------------------------------
  W.transformer = function (container) {
    const tokens = ["The", "cell", "that", "was", "stained", "shows", "high", "signal"];
    const N = tokens.length;
    // fixed attention pattern: each token attends to a couple of related ones
    const rng = CK.makeRng(1107);
    const attn = [];
    for (let i = 0; i < N; i++) { attn.push([]); let row = []; for (let j = 0; j < N; j++) { let w = 0.15 + 0.85 * Math.exp(-Math.abs(i - j) / 2.2) + (rng() * 0.15); if (i === 1 && j === 4) w = 1.3; if (i === 5 && (j === 1 || j === 7)) w = 1.2; row.push(w); } const sum = row.reduce((a, b) => a + b, 0); attn[i] = row.map((w) => w / sum); }
    const state = { q: 1 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("tf_q", "注目する単語(query)", 0, N - 1, 1, 1, (v) => tokens[v])}</div>
      <div class="widget-stage"><div id="tf_plot"></div></div>
      ${readoutRow([{ id: "tf_q2", label: "query 単語", value: "—" }, { id: "tf_k", label: "最も注目している単語", value: "—" }])}
      <p class="widget-note">self-attentionの重み。選んだ<b>query単語が、系列内のどの単語に強く「注目」しているか</b>をアーク(線の太さ・濃さ)で表します。離れた位置の関係も捉えられるのが強みです。</p>`;
    function draw() {
      const W2 = 460, H2 = 220, s = darkPanel(document.getElementById("tf_plot"), W2, H2, "#080b14");
      const y = 150, x0 = 34, dx = (W2 - 68) / (N - 1);
      // attention arcs from query
      const row = attn[state.q];
      row.forEach((w, j) => {
        if (j === state.q) return;
        const x1 = x0 + state.q * dx, x2 = x0 + j * dx, mx = (x1 + x2) / 2, h = 40 + Math.abs(x2 - x1) * 0.35;
        add(s, "path", { d: `M ${x1} ${y} Q ${mx} ${y - h} ${x2} ${y}`, fill: "none", stroke: CYAN, "stroke-width": 0.6 + w * 8, opacity: clamp(0.15 + w * 2.2, 0.1, 0.95) });
      });
      // tokens
      tokens.forEach((tk, i) => {
        const x = x0 + i * dx, isQ = i === state.q;
        add(s, "circle", { cx: x, cy: y, r: isQ ? 8 : 5, fill: isQ ? "#f5d90a" : "#22d3ee", opacity: isQ ? 1 : clamp(0.3 + row[i] * 2, 0.3, 1) });
        add(s, "text", { x: x, y: y + 24, "text-anchor": "middle", "font-size": 9.5, fill: isQ ? "#f5d90a" : "#9fb0c8", "font-weight": isQ ? 700 : 400, text: tk });
      });
      let km = -1, best = -1; row.forEach((w, j) => { if (j !== state.q && w > best) { best = w; km = j; } });
      setReadout("tf_q2", tokens[state.q]);
      setReadout("tf_k", tokens[km] + " (" + (best * 100).toFixed(0) + "%)");
    }
    bindSlider("tf_q", (v) => tokens[v], (v) => { state.q = v; draw(); });
    draw();
  };

  // 8. Segmentation — Dice / IoU between GT and prediction ------------------
  W.segmentation = function (container) {
    const state = { acc: 0.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("sg_a", "予測の正確さ", 0, 1, 0.05, state.acc, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="sg_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#22c55e"></span>一致(TP)</span><span class="li"><span class="sw" style="background:#ef5350"></span>誤検出(FP)</span><span class="li"><span class="sw" style="background:#3aa0ff"></span>見逃し(FN)</span></div></div>
      ${readoutRow([{ id: "sg_d", label: "Dice係数", value: "—" }, { id: "sg_i", label: "IoU", value: "—" }])}
      <p class="widget-note">正解マスク(ground truth)と予測マスクの重なり。<b>予測が正確なほど2つが重なり、Dice係数・IoUが1に近づき</b>ます。緑=一致、赤=誤検出、青=見逃しです。</p>`;
    function draw() {
      const W2 = 320, H2 = 240, s = darkPanel(document.getElementById("sg_plot"), W2, H2, "#0a0d14");
      const gtC = [130, 120], gtR = 62;
      const off = (1 - state.acc) * 70;
      const prC = [130 + off, 120 + off * 0.4], prR = lerp(38, 62, state.acc);
      // draw FN (GT only) blue, FP (pred only) red, TP (overlap) green — via layered circles
      add(s, "circle", { cx: gtC[0], cy: gtC[1], r: gtR, fill: "#3aa0ff", opacity: 0.55 });
      add(s, "circle", { cx: prC[0], cy: prC[1], r: prR, fill: "#ef5350", opacity: 0.55 });
      // approximate intersection as a lens using a clipped smaller circle at midpoint
      const d = Math.hypot(prC[0] - gtC[0], prC[1] - gtC[1]);
      const overlap = clamp((gtR + prR - d) / (2 * Math.min(gtR, prR)), 0, 1);
      const midx = (gtC[0] + prC[0]) / 2, midy = (gtC[1] + prC[1]) / 2;
      add(s, "circle", { cx: midx, cy: midy, r: Math.min(gtR, prR) * overlap, fill: "#22c55e", opacity: 0.85 });
      add(s, "text", { x: gtC[0] - 40, y: 34, "font-size": 9.5, fill: "#7fb0ff", text: "正解(GT)" });
      add(s, "text", { x: prC[0] + 4, y: 214, "font-size": 9.5, fill: "#f4a0a0", text: "予測" });
      // Dice/IoU approx from areas
      const aGT = Math.PI * gtR * gtR, aPR = Math.PI * prR * prR;
      const inter = Math.PI * Math.pow(Math.min(gtR, prR) * overlap, 2);
      const dice = 2 * inter / (aGT + aPR);
      const iou = inter / (aGT + aPR - inter);
      setReadout("sg_d", dice.toFixed(2));
      setReadout("sg_i", iou.toFixed(2));
    }
    bindSlider("sg_a", (v) => (v * 100).toFixed(0) + "%", (v) => { state.acc = v; draw(); });
    draw();
  };

  // 9. Foundation model — one model -> many downstream tasks ---------------
  W.foundationmodel = function (container) {
    const tasks = ["画像診断", "創薬", "変異予測", "構造予測", "テキスト", "オミクス"];
    const state = { shot: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("fm_s", "追加学習データ (shot数)", 0, 50, 1, 0, (v) => v == 0 ? "0 (zero-shot)" : v + " 例")}</div>
      <div class="widget-stage"><div id="fm_plot"></div></div>
      ${readoutRow([{ id: "fm_a", label: "下流タスクの平均精度", value: "—" }, { id: "fm_z", label: "適応の仕方", value: "—" }])}
      <p class="widget-note">1つの<b>基盤モデル</b>(大規模事前学習)が、多数の下流タスクに適用できます。<b>例なし(zero-shot)や少数例(few-shot)でも高い性能</b>を発揮し、追加学習でさらに伸びます。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, s = darkPanel(document.getElementById("fm_plot"), W2, H2, "#04121a");
      const cx = 110, cy = 120;
      const acc = 0.72 + 0.2 * (1 - Math.exp(-state.shot / 12));
      // spokes to tasks
      tasks.forEach((t, i) => {
        const y = 30 + i * 34;
        add(s, "line", { x1: cx + 46, y1: cy, x2: 300, y2: y, stroke: "#1d3a48", "stroke-width": 1 });
        add(s, "rect", { x: 300, y: y - 11, width: 150, height: 22, rx: 5, fill: "#0a1f2b", stroke: "#22d3ee", "stroke-width": 1, opacity: 0.9 });
        add(s, "rect", { x: 300, y: y - 11, width: 150 * clamp(acc, 0, 1), height: 22, rx: 5, fill: CYAN, opacity: 0.28 });
        add(s, "text", { x: 308, y: y + 4, "font-size": 10, fill: "#cbe9f2", text: t });
        add(s, "text", { x: 444, y: y + 4, "text-anchor": "end", "font-size": 9, fill: "#8aa0b0", text: (acc * 100).toFixed(0) + "%" });
      });
      // central foundation model
      add(s, "circle", { cx: cx, cy: cy, r: 50, fill: "#0a1f2b", stroke: CYAN, "stroke-width": 2 });
      add(s, "circle", { cx: cx, cy: cy, r: 50, fill: CYAN, opacity: 0.12 });
      add(s, "text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 12, fill: "#cbe9f2", "font-weight": 700, text: "基盤モデル" });
      add(s, "text", { x: cx, y: cy + 14, "text-anchor": "middle", "font-size": 9, fill: "#8aa0b0", text: "大規模事前学習" });
      setReadout("fm_a", (acc * 100).toFixed(0) + "%");
      setReadout("fm_z", state.shot === 0 ? "zero-shot(例なし)" : state.shot < 10 ? "few-shot(少数例)" : "fine-tuning");
    }
    bindSlider("fm_s", (v) => v == 0 ? "0 (zero-shot)" : v + " 例", (v) => { state.shot = v; draw(); });
    draw();
  };

  // 10. Biological LM — masked amino-acid prediction -----------------------
  W.biolm = function (container) {
    const seq = "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ".split("");
    const aa = ["A", "R", "N", "D", "C", "Q", "E", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V"];
    const state = { pos: 8 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("bl_p", "マスクする位置", 0, seq.length - 1, 1, 8, (v) => (+v + 1) + " 残基目")}</div>
      <div class="widget-stage"><div id="bl_plot"></div></div>
      ${readoutRow([{ id: "bl_t", label: "予測1位のアミノ酸", value: "—" }, { id: "bl_c", label: "正解", value: "—" }])}
      <p class="widget-note">タンパク質配列の一部を<b>[MASK]で隠し</b>、言語モデルがそこに入るアミノ酸を予測します(マスク言語モデル)。<b>配列のパターンを学習しているから予測できる</b>—これが埋め込み表現の源です。</p>`;
    function draw() {
      const W2 = 460, H2 = 240, s = darkPanel(document.getElementById("bl_plot"), W2, H2, "#080b14");
      // sequence row
      const n = seq.length, cw = (W2 - 24) / n;
      seq.forEach((c, i) => {
        const x = 12 + i * cw, masked = i === state.pos;
        add(s, "rect", { x: x, y: 24, width: cw - 1.5, height: 22, rx: 2, fill: masked ? "#f5d90a" : "#12283a" });
        add(s, "text", { x: x + cw / 2, y: 39, "text-anchor": "middle", "font-size": 9.5, fill: masked ? "#111" : "#9fdff0", "font-weight": masked ? 700 : 400, text: masked ? "?" : c });
      });
      add(s, "text", { x: 12, y: 18, "font-size": 9, fill: "#8aa0b0", text: "タンパク質配列（黄=マスク）" });
      // prediction bars: correct AA gets highest prob, plus a few plausible
      const rng = CK.makeRng(1000 + state.pos);
      const correct = seq[state.pos];
      const cand = [correct];
      while (cand.length < 5) { const a = aa[Math.floor(rng() * aa.length)]; if (cand.indexOf(a) < 0) cand.push(a); }
      const probs = cand.map((c, i) => i === 0 ? 0.4 + rng() * 0.25 : (0.3 - i * 0.05) * rng());
      const sum = probs.reduce((a, b) => a + b, 0);
      const norm = probs.map((p) => p / sum);
      // sort by prob desc
      const order = cand.map((c, i) => ({ c, p: norm[i] })).sort((a, b) => b.p - a.p);
      add(s, "text", { x: 12, y: 74, "font-size": 10, fill: "#cbe9f2", text: "言語モデルの予測（この位置に入るアミノ酸）" });
      order.forEach((o, i) => {
        const y = 88 + i * 28;
        add(s, "text", { x: 30, y: y + 13, "text-anchor": "middle", "font-size": 12, fill: o.c === correct ? "#5dff9c" : "#9fb0c8", "font-weight": 700, text: o.c });
        add(s, "rect", { x: 46, y: y, width: 320, height: 18, rx: 4, fill: "#12283a" });
        add(s, "rect", { x: 46, y: y, width: 320 * o.p, height: 18, rx: 4, fill: o.c === correct ? "#22c55e" : CYAN, opacity: 0.8 });
        add(s, "text", { x: 372, y: y + 13, "font-size": 9.5, fill: "#8aa0b0", text: (o.p * 100).toFixed(0) + "%" });
      });
      setReadout("bl_t", order[0].c + (order[0].c === correct ? "（正解！）" : ""));
      setReadout("bl_c", correct);
    }
    bindSlider("bl_p", (v) => (+v + 1) + " 残基目", (v) => { state.pos = v; draw(); });
    draw();
  };

  // 11. AlphaFold — backbone colored by pLDDT ------------------------------
  W.alphafold = function (container) {
    const rng = CK.makeRng(1111), N = 60, chain = [];
    // build a backbone path with a helix and a sheet region; pLDDT high in core, low at termini
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      let x = 60 + t * 340 + Math.sin(i * 0.9) * 22 * Math.exp(-Math.pow((i - 30) / 20, 2));
      let y = 130 + Math.sin(i * 0.55) * 46 + (rng() - 0.5) * 6;
      // pLDDT: low at ends, high in middle
      const plddt = clamp(100 * (1 - Math.pow((i - 30) / 34, 2)) - (rng() * 8), 20, 98);
      chain.push({ x: x, y: y, plddt: plddt });
    }
    const state = { res: 30 };
    function plddtColor(p) { return p >= 90 ? "#0b3d91" : p >= 70 ? "#3aa0ff" : p >= 50 ? "#f5d90a" : "#f97316"; }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("af_r", "残基番号", 0, N - 1, 1, 30, (v) => (+v + 1) + " 番")}</div>
      <div class="widget-stage"><div id="af_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#0b3d91"></span>Very high</span><span class="li"><span class="sw" style="background:#3aa0ff"></span>Confident</span><span class="li"><span class="sw" style="background:#f5d90a"></span>Low</span><span class="li"><span class="sw" style="background:#f97316"></span>Very Low</span></div></div>
      ${readoutRow([{ id: "af_v", label: "pLDDT値", value: "—" }, { id: "af_c", label: "信頼度", value: "—" }])}
      <p class="widget-note">配列から予測した立体構造の主鎖を<b>pLDDT値(信頼度)で色分け</b>。青=高信頼、オレンジ=低信頼。末端(N/C端)や天然変性領域は信頼度が低くなりがちです。</p>`;
    function draw() {
      const W2 = 460, H2 = 210, s = darkPanel(document.getElementById("af_plot"), W2, H2, "#060a12");
      // backbone as colored segments
      for (let i = 1; i < N; i++) add(s, "line", { x1: chain[i - 1].x, y1: chain[i - 1].y, x2: chain[i].x, y2: chain[i].y, stroke: plddtColor(chain[i].plddt), "stroke-width": 5, "stroke-linecap": "round" });
      // N/C labels
      add(s, "text", { x: chain[0].x - 6, y: chain[0].y - 8, "font-size": 10, fill: "#f4b48a", text: "N" });
      add(s, "text", { x: chain[N - 1].x + 6, y: chain[N - 1].y, "font-size": 10, fill: "#9fdff0", text: "C" });
      // marker on selected residue
      const r = chain[state.res];
      add(s, "circle", { cx: r.x, cy: r.y, r: 8, fill: "none", stroke: "#fff", "stroke-width": 2 });
      const p = r.plddt;
      setReadout("af_v", p.toFixed(0) + " / 100");
      setReadout("af_c", p >= 90 ? "Very high" : p >= 70 ? "Confident" : p >= 50 ? "Low" : "Very Low");
    }
    bindSlider("af_r", (v) => (+v + 1) + " 番", (v) => { state.res = v; draw(); });
    draw();
  };

  // 12. GNN — message passing / receptive field ---------------------------
  W.gnn = function (container) {
    // small molecular-ish graph
    const nodes = [{ x: 90, y: 60 }, { x: 170, y: 40 }, { x: 250, y: 70 }, { x: 150, y: 120 }, { x: 240, y: 150 }, { x: 330, y: 110 }, { x: 90, y: 150 }, { x: 320, y: 180 }];
    const edges = [[0, 1], [1, 2], [1, 3], [3, 4], [2, 5], [4, 5], [3, 6], [5, 7], [4, 7]];
    const adj = nodes.map(() => []);
    edges.forEach((e) => { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    const seed = 0;
    const state = { layers: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("gn_l", "情報交換の回数(層)", 0, 4, 1, 0, (v) => v + " 層")}</div>
      <div class="widget-stage"><div id="gn_plot"></div></div>
      ${readoutRow([{ id: "gn_h", label: "情報が届いた範囲", value: "—" }, { id: "gn_n", label: "到達ノード数", value: "—" }])}
      <p class="widget-note">分子グラフ(ノード=原子、エッジ=結合)。黄のノードの情報が、<b>メッセージパッシング</b>で1層ごとに隣へ伝わります。<b>層を重ねるほど遠く(多ホップ先)まで情報が届き</b>、受容野が広がります。</p>`;
    function bfs(k) { let reached = new Set([seed]); let frontier = [seed]; for (let step = 0; step < k; step++) { const nf = []; frontier.forEach((n) => adj[n].forEach((m) => { if (!reached.has(m)) { reached.add(m); nf.push(m); } })); frontier = nf; } return reached; }
    function draw() {
      const W2 = 420, H2 = 220, s = darkPanel(document.getElementById("gn_plot"), W2, H2, "#080b14");
      const reached = bfs(state.layers);
      edges.forEach((e) => add(s, "line", { x1: nodes[e[0]].x, y1: nodes[e[0]].y, x2: nodes[e[1]].x, y2: nodes[e[1]].y, stroke: "#2a3550", "stroke-width": 2 }));
      nodes.forEach((nd, i) => {
        const isSeed = i === seed, got = reached.has(i);
        add(s, "circle", { cx: nd.x, cy: nd.y, r: isSeed ? 13 : 11, fill: isSeed ? "#f5d90a" : got ? CYAN : "#3a4256", stroke: got ? "#cbe9f2" : "#2a3550", "stroke-width": 1.5, opacity: got ? 1 : 0.6 });
      });
      setReadout("gn_h", state.layers + " ホップ先まで");
      setReadout("gn_n", reached.size + " / " + nodes.length);
    }
    bindSlider("gn_l", (v) => v + " 層", (v) => { state.layers = v; draw(); });
    draw();
  };

  // 13. Generative — diffusion (noise -> structure) -----------------------
  W.generative = function (container) {
    const rng = CK.makeRng(1313), M = 90, pts = [];
    // target: a protein-like backbone curve
    for (let i = 0; i < M; i++) {
      const t = i / M * Math.PI * 4;
      const tx = 230 + Math.cos(t) * (40 + i * 0.7) * 0.5 + Math.sin(i * 0.4) * 20;
      const ty = 110 + Math.sin(t) * 50 + (i - M / 2) * 0.2;
      pts.push({ tx: tx, ty: clamp(ty, 20, 200), nx: rng() * 440 + 10, ny: rng() * 200 + 15, col: `hsl(${Math.round(i / M * 300)},70%,60%)` });
    }
    const state = { step: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ge_s", "生成ステップ (ノイズ→データ)", 0, 1, 0.02, 0, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ge_plot"></div></div>
      ${readoutRow([{ id: "ge_st", label: "状態", value: "—" }, { id: "ge_p", label: "逆拡散の進行", value: "—" }])}
      <p class="widget-note">拡散モデルの<b>逆拡散過程</b>。完全な<b>ランダムノイズから、徐々にノイズを除去</b>して、構造をもつデータ(ここではタンパク質の骨格)を生成していきます。de novo生成の仕組みです。</p>`;
    function draw() {
      const W2 = 460, H2 = 220, s = darkPanel(document.getElementById("ge_plot"), W2, H2, "#05070f");
      const t = state.step;
      // draw backbone line when structured enough
      if (t > 0.4) { let d = ""; pts.forEach((p, i) => { const x = p.nx + (p.tx - p.nx) * t, y = p.ny + (p.ty - p.ny) * t; d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " "; }); add(s, "path", { d: d, fill: "none", stroke: "#2a3550", "stroke-width": 1.5, opacity: (t - 0.4) * 1.5 }); }
      pts.forEach((p) => { const x = p.nx + (p.tx - p.nx) * t, y = p.ny + (p.ty - p.ny) * t; add(s, "circle", { cx: x, cy: y, r: 3.4, fill: p.col, opacity: 0.4 + t * 0.55 }); });
      setReadout("ge_st", t < 0.15 ? "ノイズ" : t < 0.7 ? "生成中…" : "構造が出現");
      setReadout("ge_p", (t * 100).toFixed(0) + "%");
    }
    bindSlider("ge_s", (v) => (v * 100).toFixed(0) + "%", (v) => { state.step = v; draw(); });
    draw();
  };

  // 14. AI drug discovery — virtual screening & PPV -----------------------
  W.aidrug = function (container) {
    const rng = CK.makeRng(1414), lib = [];
    for (let i = 0; i < 96; i++) lib.push({ x: 20 + (i % 16) * 27, y: 24 + Math.floor(i / 16) * 30, score: rng(), u: rng() });
    // AI selects top ~12 by score
    const ranked = lib.slice().sort((a, b) => b.score - a.score);
    const topSet = new Set(ranked.slice(0, 12));
    const state = { ppv: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ad_p", "陽性的中率 (PPV)", 0, 1, 0.05, 0.3, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ad_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#22c55e"></span>実際に当たり</span><span class="li"><span class="sw" style="background:#ef5350"></span>偽陽性</span><span class="li"><span class="sw" style="background:#3a4256"></span>非選択</span></div></div>
      ${readoutRow([{ id: "ad_h", label: "提案12化合物の当たり数", value: "—" }, { id: "ad_r", label: "実際の当たり率", value: "—" }])}
      <p class="widget-note">バーチャルスクリーニング。AIが化合物ライブラリから<b>上位を提案(枠)</b>しますが、<b>PPVが低いと実際の当たり(緑)は少なく偽陽性(赤)が多く</b>なります。AUROCが高くても過信は禁物です。</p>`;
    function draw() {
      const W2 = 460, H2 = 210, s = darkPanel(document.getElementById("ad_plot"), W2, H2, "#080b14");
      let hits = 0;
      const topArr = ranked.slice(0, 12);
      topArr.forEach((c, idx) => { if (idx / 12 < state.ppv) hits++; });
      lib.forEach((c) => {
        const isTop = topSet.has(c);
        let fill = "#3a4256";
        if (isTop) { const idx = topArr.indexOf(c); fill = (idx / 12 < state.ppv) ? "#22c55e" : "#ef5350"; }
        add(s, "circle", { cx: c.x, cy: c.y, r: 7, fill: fill, opacity: isTop ? 0.95 : 0.5 });
        if (isTop) add(s, "circle", { cx: c.x, cy: c.y, r: 10, fill: "none", stroke: "#cbe9f2", "stroke-width": 1.2 });
      });
      setReadout("ad_h", hits + " / 12");
      setReadout("ad_r", (state.ppv * 100).toFixed(0) + "%");
    }
    bindSlider("ad_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.ppv = v; draw(); });
    draw();
  };

  // 15. AI agent — autonomous research cycle ------------------------------
  W.aiagent = function (container) {
    const stages = ["文献調査", "仮説生成", "実験計画", "実験自動実行", "データ解析", "結果解釈"];
    const state = { step: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ag_s", "研究サイクルのステップ", 0, 5, 1, 0, (v) => stages[v])}</div>
      <div class="widget-stage"><div id="ag_plot"></div></div>
      ${readoutRow([{ id: "ag_c", label: "現在の工程", value: "—" }, { id: "ag_n", label: "次の工程", value: "—" }])}
      <p class="widget-note">AIエージェントが<b>文献調査→仮説生成→実験計画→(ロボット)実験→データ解析→結果解釈</b>と自律的に研究サイクルを回します。中心では役割の異なる複数エージェント(PI・専門家・批評家)が議論します。</p>`;
    function draw() {
      const W2 = 440, H2 = 250, s = darkPanel(document.getElementById("ag_plot"), W2, H2, "#04121a");
      const cx = 220, cy = 120, R = 88;
      // ring stages
      stages.forEach((st, i) => {
        const a = -Math.PI / 2 + i / stages.length * Math.PI * 2;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        const active = i === state.step, done = i < state.step;
        // arrow to next
        const a2 = -Math.PI / 2 + (i + 1) / stages.length * Math.PI * 2;
        const x2 = cx + Math.cos(a2) * R, y2 = cy + Math.sin(a2) * R;
        add(s, "path", { d: `M ${x} ${y} A ${R} ${R} 0 0 1 ${x2} ${y2}`, fill: "none", stroke: done ? CYAN : "#1d3a48", "stroke-width": done ? 3 : 1.5, opacity: done ? 0.8 : 0.5 });
        add(s, "circle", { cx: x, cy: y, r: active ? 14 : 10, fill: active ? "#f5d90a" : done ? CYAN : "#0a1f2b", stroke: active ? "#fff" : "#22d3ee", "stroke-width": 1.5 });
        add(s, "text", { x: x, y: y - 20, "text-anchor": "middle", "font-size": 9.5, fill: active ? "#f5d90a" : "#9fdff0", "font-weight": active ? 700 : 400, text: st });
      });
      // central multi-agent team
      add(s, "circle", { cx: cx, cy: cy, r: 40, fill: "#0a1f2b", stroke: CYAN, "stroke-width": 1.5 });
      add(s, "text", { x: cx, y: cy - 6, "text-anchor": "middle", "font-size": 10, fill: "#cbe9f2", "font-weight": 700, text: "AIエージェント" });
      add(s, "text", { x: cx, y: cy + 9, "text-anchor": "middle", "font-size": 8, fill: "#8aa0b0", text: "PI・専門家・批評家" });
      add(s, "text", { x: cx, y: cy + 22, "text-anchor": "middle", "font-size": 8, fill: "#8aa0b0", text: "が議論" });
      setReadout("ag_c", stages[state.step]);
      setReadout("ag_n", stages[(state.step + 1) % stages.length] + (state.step === 5 ? "（次サイクル）" : ""));
    }
    bindSlider("ag_s", (v) => stages[v], (v) => { state.step = v; draw(); });
    draw();
  };
})();

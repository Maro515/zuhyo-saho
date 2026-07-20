/* 第12章 発展編 パート2（t11-t20）のインタラクティブ教材
   マルチオーム / scNMT-seq / 単一細胞プロテオミクス / Live-seq / 単一細胞アイソフォーム /
   SLAM-seq / sc-eQTL / MERFISH / seqFISH+ / Slide-seq・Slide-tags
   すべて .widget-stage（明るいパネル）の上に SVG で描画する。 */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  // ---- local helpers (widgets ファイルはスコープが独立なので自前で用意する) ----
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f6f8fb" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function txt(s, x, y, str, attrs) {
    const t = add(s, "text", Object.assign({ x, y, "font-size": 12, fill: "#1b2233" }, attrs || {}));
    t.textContent = str; return t;
  }
  function mixColor(c1, c2, t) {
    const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const a = p(c1), b = p(c2);
    const h = (v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
    return "#" + h(lerp(a[0], b[0], t)) + h(lerp(a[1], b[1], t)) + h(lerp(a[2], b[2], t));
  }
  function choose(n, k) { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; }
  function binom(n, k, p) { return choose(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }

  const RED = "#e5484d", BLUE = "#3b63e0", GREEN = "#0f9e73", ORANGE = "#f59e0b",
        PURPLE = "#a855f7", GRAY = "#c3c9d8", INK = "#1b2233", MUTED = "#6b7386";

  // 11. マルチオーム（RNA＋ATAC同時） ---------------------------------------
  W.multiome = function (container) {
    const state = { mode: "same", depth: 20 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("mo_mode", "計測のしかた", [
          { v: "same", label: "同一核でRNA＋ATAC同時" },
          { v: "sep", label: "別々に測って計算で統合" },
        ], state.mode)}
        ${sliderRow("mo_dep", "ATACの読み取り深度（千フラグメント/核）", 2, 40, 1, state.depth, (v) => v + "k")}
      </div>
      <div class="widget-stage"><div id="mo_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${BLUE}"></span>対応が正しい核</span>
          <span class="li"><span class="sw" style="background:${RED}"></span>対応が誤っている核</span>
        </div></div>
      ${readoutRow([
        { id: "mo_r", label: "RNA–ATAC 相関 r", value: "—" },
        { id: "mo_ok", label: "対応が正しい細胞", value: "—" },
        { id: "mo_pk", label: "検出ピーク数/核", value: "—" },
      ])}
      <p class="widget-note">同じ点の散らばり方でも、<b>同一核で同時に測ったのか、別々に測ってから計算で結び付けたのか</b>で意味がまったく違います。統合型では対応の誤り（赤）が混ざり、相関が見かけ上薄まります。図の説明文でどちらなのかを必ず確かめてください。</p>`;
    function draw() {
      const rng = CK.makeRng(4211);
      const N = 260;
      const noiseA = 0.35 + 2.2 / state.depth; // 深度が浅いほど ATAC は暴れる
      const errRate = state.mode === "same" ? 0 : 0.22;
      const cells = [];
      for (let i = 0; i < N; i++) {
        const a = CK.randNormal(0, 1, rng);                 // 潜在的な制御活性
        const rna = clamp(2.6 + 1.15 * a + CK.randNormal(0, 0.45, rng), 0, 7);
        let atac = clamp(2.2 + 1.0 * a + CK.randNormal(0, noiseA, rng), 0, 7);
        let bad = false;
        if (rng() < errRate) { atac = clamp(2.2 + 1.0 * CK.randNormal(0, 1, rng) + CK.randNormal(0, noiseA, rng), 0, 7); bad = true; }
        cells.push({ rna, atac, bad });
      }
      const ctx = CK.plot(document.getElementById("mo_plot"), {
        width: 560, height: 330, margin: { top: 16, right: 20, bottom: 48, left: 56 },
        xDomain: [0, 7], yDomain: [0, 7], xTicks: 7, yTicks: 7,
        xLabel: "ATAC 遺伝子活性スコア（プロモーター＋遺伝子体の開き具合）",
        yLabel: "RNA 発現量（log）",
      });
      cells.forEach((c) => CK.dot(ctx, c.atac, c.rna, { r: 3.6, fill: c.bad ? RED : BLUE, opacity: c.bad ? 0.85 : 0.6 }));
      const fit = CK.linreg(cells.map((c) => c.atac), cells.map((c) => c.rna));
      CK.line(ctx, [[0, fit.intercept], [7, fit.intercept + fit.slope * 7]], { stroke: INK, "stroke-width": 2, opacity: 0.6 });
      const r = CK.pearsonR(cells.map((c) => c.atac), cells.map((c) => c.rna));
      setReadout("mo_r", r.toFixed(2));
      setReadout("mo_ok", (100 * cells.filter((c) => !c.bad).length / N).toFixed(0) + "%");
      setReadout("mo_pk", Math.round(1500 + 620 * Math.log(1 + state.depth)).toLocaleString() + " 箇所");
    }
    bindSeg("mo_mode", (v) => { state.mode = v; draw(); });
    bindSlider("mo_dep", (v) => v + "k", (v) => { state.depth = v; draw(); });
    draw();
  };

  // 12. 単一細胞メチローム / scNMT-seq --------------------------------------
  W.scnmt = function (container) {
    const state = { act: 70, mode: "normal" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("nm_mode", "この細胞の状態", [
          { v: "normal", label: "正常" },
          { v: "hyper", label: "プロモーター高メチル化" },
        ], state.mode)}
        ${sliderRow("nm_act", "本来の転写活性", 0, 100, 5, state.act, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="nm_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${RED}"></span>CpGメチル化（mCG）</span>
          <span class="li"><span class="sw" style="background:${GREEN}"></span>GpCアクセシビリティ</span>
        </div></div>
      ${readoutRow([
        { id: "nm_m", label: "TSS上のmCG", value: "—" },
        { id: "nm_a", label: "TSS上の開き具合", value: "—" },
        { id: "nm_e", label: "実際の発現量", value: "—" },
      ])}
      <p class="widget-note">scNMT-seq は<b>同じ1細胞</b>からメチル化・クロマチンの開き具合・RNAを同時に読みます。正常では TSS でメチル化が谷、アクセシビリティが山という<b>きれいな反相関</b>になります。高メチル化に切り替えると谷が埋まり、山も消え、転写活性を上げても発現が戻らないことが見えます。</p>`;
    function draw() {
      const hyper = state.mode === "hyper";
      const act = hyper ? Math.min(state.act, 18) : state.act;
      const a = act / 100;
      const pts = [];
      for (let x = -2000; x <= 2000; x += 50) {
        const g = Math.exp(-(x * x) / (2 * 420 * 420));           // TSS 周辺の窓
        const meth = hyper ? 78 - 6 * g : 82 - (10 + 66 * a) * g;  // 谷の深さは活性しだい
        const acc = 18 + (8 + 62 * a) * g;
        pts.push([x, clamp(meth, 0, 100), clamp(acc, 0, 100)]);
      }
      const ctx = CK.plot(document.getElementById("nm_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 48, left: 56 },
        xDomain: [-2000, 2000], yDomain: [0, 100], xTicks: 8, yTicks: 5,
        xLabel: "転写開始点（TSS）からの距離（bp）", yLabel: "割合（%）",
      });
      CK.vline(ctx, 0, { stroke: "#9aa2b6" });
      CK.textPx(ctx, ctx.x(0) + 6, ctx.margin.top + 14, "TSS", { fill: MUTED, "font-weight": 700 });
      CK.line(ctx, pts.map((p) => [p[0], p[1]]), { stroke: RED, "stroke-width": 2.6 });
      CK.line(ctx, pts.map((p) => [p[0], p[2]]), { stroke: GREEN, "stroke-width": 2.6 });
      const mid = pts[Math.floor(pts.length / 2)];
      setReadout("nm_m", mid[1].toFixed(0) + "%");
      setReadout("nm_a", mid[2].toFixed(0) + "%");
      setReadout("nm_e", (act * (hyper ? 0.35 : 1)).toFixed(0) + "%");
    }
    bindSeg("nm_mode", (v) => { state.mode = v; draw(); });
    bindSlider("nm_act", (v) => v + "%", (v) => { state.act = v; draw(); });
    draw();
  };

  // 13. 単一細胞プロテオミクス（SCoPE-MS） ---------------------------------
  W.scproteomics = function (container) {
    const state = { carrier: 100, trueFC: 1.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("sp_car", "キャリア（ブースター）チャネル比", 0, 400, 10, state.carrier, (v) => v + "倍")}
        ${segRow("sp_true", "2群の本当の発現比", [
          { v: "1.5", label: "1.5倍" },
          { v: "3", label: "3倍" },
        ], String(state.trueFC))}
      </div>
      <div class="widget-stage"><div id="sp_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${RED}"></span>細胞種A</span>
          <span class="li"><span class="sw" style="background:${BLUE}"></span>細胞種B</span>
        </div></div>
      ${readoutRow([
        { id: "sp_n", label: "定量タンパク質数", value: "—" },
        { id: "sp_obs", label: "観測される比", value: "—" },
        { id: "sp_tr", label: "本当の比", value: "—" },
      ])}
      <p class="widget-note">キャリアを増やすと<b>検出できるタンパク質数は増えます</b>が、単一細胞チャネルの信号がキャリアに引っ張られて比が1へ潰れます（ratio compression）。「何千タンパク質を単一細胞で定量」という見出しの図では、<b>キャリア比と、群分離が本当に保たれているか</b>をセットで確認します。</p>`;
    function draw() {
      const c = state.carrier;
      const nProt = Math.round(420 + 2100 * (1 - Math.exp(-c / 90)));
      const compress = 1 / (1 + c / 110);
      const obsFC = 1 + (state.trueFC - 1) * compress;
      const sep = 3.4 * Math.log2(obsFC) / Math.log2(state.trueFC);
      const rng = CK.makeRng(9182);
      const ctx = CK.plot(document.getElementById("sp_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 48, left: 56 },
        xDomain: [-6, 6], yDomain: [-5, 5], xTicks: 6, yTicks: 5,
        xLabel: "主成分1（群を分ける軸）", yLabel: "主成分2",
      });
      CK.vline(ctx, 0, { stroke: "#dbe0ec" });
      for (let g = 0; g < 2; g++) {
        for (let i = 0; i < 40; i++) {
          const x = (g === 0 ? -1 : 1) * sep / 2 + CK.randNormal(0, 0.95, rng);
          const y = CK.randNormal(0, 1.1, rng);
          CK.dot(ctx, clamp(x, -6, 6), clamp(y, -5, 5), { r: 4.6, fill: g === 0 ? RED : BLUE, opacity: 0.8, stroke: "#fff", "stroke-width": 1 });
        }
      }
      setReadout("sp_n", nProt.toLocaleString());
      setReadout("sp_obs", obsFC.toFixed(2) + " 倍");
      setReadout("sp_tr", state.trueFC.toFixed(2) + " 倍");
    }
    bindSlider("sp_car", (v) => v + "倍", (v) => { state.carrier = v; draw(); });
    bindSeg("sp_true", (v) => { state.trueFC = +v; draw(); });
    draw();
  };

  // 14. Live-seq -----------------------------------------------------------
  W.liveseq = function (container) {
    const state = { amount: 6, mode: "live" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ls_mode", "採取のしかた", [
          { v: "live", label: "Live-seq（細胞質を少量吸い出す）" },
          { v: "dest", label: "通常のscRNA-seq（細胞を溶かす）" },
        ], state.mode)}
        ${sliderRow("ls_amt", "吸い出す細胞質の量", 1, 20, 1, state.amount, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="ls_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${BLUE}"></span>採取した細胞</span>
          <span class="li"><span class="sw" style="background:${GRAY}"></span>触れていない対照細胞</span>
        </div></div>
      ${readoutRow([
        { id: "ls_sv", label: "採取後の生存率", value: "—" },
        { id: "ls_dl", label: "分裂再開までの遅れ", value: "—" },
        { id: "ls_gn", label: "検出遺伝子数", value: "—" },
      ])}
      <p class="widget-note">通常のscRNA-seqでは<b>採取した瞬間に細胞が失われる</b>ため、「この転写状態のあとどうなったか」は原理的に測れません。Live-seqは同じ細胞を追跡できますが、吸い出す量を増やすほど検出遺伝子は増える一方で細胞を痛めます。図では<b>生存率と検出遺伝子数のどこで折り合いをつけたか</b>が要点です。</p>`;
    function draw() {
      const live = state.mode === "live";
      const amt = state.amount;
      const surv = live ? clamp(96 - 2.4 * amt, 40, 100) : 0;
      const delay = live ? 1.2 + 0.55 * amt : 0;
      const genes = Math.round(live ? 900 + 380 * amt : 6800);
      const ctrl = [], samp = [];
      for (let t = -6; t <= 48; t += 1) {
        ctrl.push([t, Math.pow(2, (t + 6) / 20)]);
        if (!live && t > 0) continue;
        const shift = t <= 0 ? 0 : Math.min(delay, t);
        const dip = t > 0 ? Math.exp(-t / 8) * (amt / 100) * 3.2 : 0;
        samp.push([t, Math.max(0.2, Math.pow(2, (t + 6 - shift) / 20) * (1 - dip))]);
      }
      const ctx = CK.plot(document.getElementById("ls_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 48, left: 58 },
        xDomain: [-6, 48], yDomain: [0, 7], xTicks: 6, yTicks: 7,
        xLabel: "採取からの時間（時間）", yLabel: "相対的な細胞数（増殖）",
      });
      CK.vline(ctx, 0, { stroke: RED });
      CK.textPx(ctx, ctx.x(0) + 6, ctx.margin.top + 14, "採取", { fill: RED, "font-weight": 700 });
      CK.line(ctx, ctrl, { stroke: GRAY, "stroke-width": 2.6 });
      CK.line(ctx, samp, { stroke: BLUE, "stroke-width": 2.8 });
      if (!live) {
        CK.dot(ctx, 0, samp[samp.length - 1][1], { r: 6, fill: RED, stroke: "#fff", "stroke-width": 1.5 });
        CK.textPx(ctx, ctx.x(2), ctx.y(1.6), "ここで細胞は失われ、以降は追跡不能", { fill: RED, "font-weight": 700 });
      }
      setReadout("ls_sv", live ? surv.toFixed(0) + "%" : "0%");
      setReadout("ls_dl", live ? delay.toFixed(1) + " 時間" : "—（追跡不能）");
      setReadout("ls_gn", genes.toLocaleString() + " 個");
    }
    bindSeg("ls_mode", (v) => { state.mode = v; draw(); });
    bindSlider("ls_amt", (v) => v + "%", (v) => { state.amount = v; draw(); });
    draw();
  };

  // 15. 単一細胞ロングリードアイソフォーム解析 ------------------------------
  W.scisoform = function (container) {
    const state = { len: 400, cap: "three" };
    const TRUE = [0.5, 0.3, 0.2];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("si_cap", "cDNAの捕まえ方", [
          { v: "three", label: "3'端から読む（一般的な1細胞法）" },
          { v: "full", label: "全長cDNAをロングリードで読む" },
        ], state.cap)}
        ${sliderRow("si_len", "1本あたりの読み取り長", 100, 3200, 100, state.len, (v) => v + " bp")}
      </div>
      <div class="widget-stage"><div id="si_plot"></div></div>
      ${readoutRow([
        { id: "si_uq", label: "アイソフォームを一意に決められたリード", value: "—" },
        { id: "si_er", label: "割合推定の最大誤差", value: "—" },
        { id: "si_rs", label: "見分けられる差", value: "—" },
      ])}
      <p class="widget-note">アイソフォームの違いが<b>読んだ範囲の外にある</b>と、どれだけリードを増やしても割合は「みんな同じくらい」に潰れます。棒グラフの推定値（青）が真の値（灰）に近づくのは、差のある部位までリードが届いたときだけです。</p>`;
    function draw() {
      const L = state.len, full = state.cap === "full";
      // 差のある部位：エクソン2（5'側 600bp）とエクソン5（3'側 2300bp）。遺伝子長 3000bp。
      const covStart = full ? 0 : Math.max(0, 3000 - L);
      const covEnd = full ? Math.min(3000, L === 3200 ? 3000 : L) : 3000;
      const pFull = full ? Math.min(1, L / 3000) : 1;
      const hit5 = (600 >= covStart && 600 <= covEnd) ? pFull : 0;
      const hit3 = (2300 >= covStart && 2300 <= covEnd) ? pFull : 0;
      const uniq = clamp(1 - (1 - hit5) * (1 - hit3), 0, 1);
      const est = TRUE.map((t) => uniq * t + (1 - uniq) / 3);
      const maxErr = Math.max(...est.map((e, i) => Math.abs(e - TRUE[i])));

      const W2 = 560, H2 = 300, s = lightPanel(document.getElementById("si_plot"), W2, H2, "#f6f8fb");
      const gx = (bp) => 46 + (bp / 3000) * 440;
      const exons = [[0, 220], [520, 700], [980, 1250], [1520, 1780], [2180, 2420], [2760, 3000]];
      const skips = [null, 1, 4];
      const names = ["アイソフォームA", "アイソフォームB（エクソン2欠失）", "アイソフォームC（エクソン5欠失）"];
      // 読み取り範囲の帯
      add(s, "rect", { x: gx(covStart), y: 22, width: Math.max(2, gx(covEnd) - gx(covStart)), height: 92, fill: "#dbe6ff", opacity: 0.75, rx: 4 });
      txt(s, gx(covStart) + 4, 18, "読み取り範囲", { fill: BLUE, "font-size": 11, "font-weight": 700 });
      for (let i = 0; i < 3; i++) {
        const y = 34 + i * 28;
        add(s, "line", { x1: gx(0), x2: gx(3000), y1: y + 7, y2: y + 7, stroke: "#a8b0c4", "stroke-width": 1.2 });
        exons.forEach((e, k) => {
          if (skips[i] === k) return;
          const dif = (k === 1 || k === 4);
          add(s, "rect", { x: gx(e[0]), y, width: gx(e[1]) - gx(e[0]), height: 14, rx: 2, fill: dif ? ORANGE : "#7f8aa3" });
        });
        txt(s, 6, y + 11, ["A", "B", "C"][i], { "font-size": 12, "font-weight": 700, fill: INK });
      }
      txt(s, 46, 128, "橙＝アイソフォームを見分ける鍵になるエクソン", { "font-size": 11, fill: MUTED });

      // 棒グラフ
      const base = 268, bh = 118;
      add(s, "line", { x1: 46, x2: 520, y1: base, y2: base, stroke: "#c7cce0", "stroke-width": 1.2 });
      for (let i = 0; i < 3; i++) {
        const cx = 110 + i * 150;
        add(s, "rect", { x: cx - 44, y: base - TRUE[i] * bh, width: 40, height: TRUE[i] * bh, fill: GRAY, rx: 2 });
        add(s, "rect", { x: cx + 4, y: base - est[i] * bh, width: 40, height: est[i] * bh, fill: BLUE, rx: 2 });
        txt(s, cx, base + 16, names[i].split("（")[0], { "text-anchor": "middle", "font-size": 11.5, fill: INK });
        txt(s, cx - 24, base - TRUE[i] * bh - 5, (TRUE[i] * 100).toFixed(0) + "%", { "text-anchor": "middle", "font-size": 11, fill: MUTED });
        txt(s, cx + 24, base - est[i] * bh - 5, (est[i] * 100).toFixed(0) + "%", { "text-anchor": "middle", "font-size": 11, fill: BLUE, "font-weight": 700 });
      }
      txt(s, 46, 146, "灰＝本当の割合／青＝このリードから推定された割合", { "font-size": 11.5, fill: MUTED });

      setReadout("si_uq", (uniq * 100).toFixed(0) + "%");
      setReadout("si_er", (maxErr * 100).toFixed(1) + " ポイント");
      setReadout("si_rs", hit5 > 0 && hit3 > 0 ? "5'側・3'側の両方" : hit3 > 0 ? "3'側の差だけ" : "見分けられない");
    }
    bindSeg("si_cap", (v) => { state.cap = v; draw(); });
    bindSlider("si_len", (v) => v + " bp", (v) => { state.len = v; draw(); });
    draw();
  };

  // 16. SLAM-seq（新生RNA標識） --------------------------------------------
  W.slamseq = function (container) {
    const state = { half: 6, conv: 80, mode: "ctrl" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("sl_mode", "条件", [
          { v: "ctrl", label: "対照" },
          { v: "inhib", label: "転写を薬剤で止める" },
        ], state.mode)}
        ${sliderRow("sl_half", "このRNAの半減期", 0.5, 24, 0.5, state.half, (v) => v.toFixed(1) + " 時間")}
        ${sliderRow("sl_conv", "4sU取り込み・T→C検出の効率", 20, 100, 5, state.conv, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="sl_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${GRAY}"></span>総RNA量（従来法で見える量）</span>
          <span class="li"><span class="sw" style="background:${GREEN}"></span>新生RNA（T→C変換をもつリード）</span>
        </div></div>
      ${readoutRow([
        { id: "sl_hf", label: "図から推定される半減期", value: "—" },
        { id: "sl_f6", label: "6時間後の新生RNA割合", value: "—" },
        { id: "sl_tt", label: "6時間後の総RNA量", value: "—" },
      ])}
      <p class="widget-note">総RNA量（灰）が動かなくても、新生RNA（緑）を見れば<b>合成と分解が同時に変化している</b>ことが分かります。ただし標識効率が低いと新生割合は系統的に過小評価され、半減期は長めに出ます。図に<b>変換率の実測値</b>が示されているか確認してください。</p>`;
    function draw() {
      const k = Math.LN2 / state.half, eff = state.conv / 100;
      const inhib = state.mode === "inhib";
      const nasc = [], total = [];
      for (let t = 0; t <= 12; t += 0.25) {
        const f = inhib ? 0 : (1 - Math.exp(-k * t)) * eff * 100;
        const tot = inhib ? 100 * Math.exp(-k * t) : 100;
        nasc.push([t, f]); total.push([t, tot]);
      }
      const ctx = CK.plot(document.getElementById("sl_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 48, left: 56 },
        xDomain: [0, 12], yDomain: [0, 110], xTicks: 6, yTicks: 5,
        xLabel: "4sU標識からの時間（時間）", yLabel: "割合（%）",
      });
      CK.line(ctx, total, { stroke: GRAY, "stroke-width": 2.8 });
      CK.line(ctx, nasc, { stroke: GREEN, "stroke-width": 2.8 });
      const f6 = inhib ? 0 : (1 - Math.exp(-k * 6)) * eff * 100;
      CK.dot(ctx, 6, f6, { r: 5, fill: GREEN, stroke: "#fff", "stroke-width": 1.5 });
      // 標識効率を100%と思い込んで推定した半減期
      const fObs = f6 / 100;
      const est = fObs > 0 && fObs < 0.999 ? Math.LN2 * 6 / (-Math.log(1 - fObs)) : Infinity;
      setReadout("sl_hf", inhib ? "推定不能（新生なし）" : (isFinite(est) ? est.toFixed(1) + " 時間" : "非常に長い"));
      setReadout("sl_f6", f6.toFixed(0) + "%");
      setReadout("sl_tt", (inhib ? 100 * Math.exp(-k * 6) : 100).toFixed(0) + "%");
    }
    bindSeg("sl_mode", (v) => { state.mode = v; draw(); });
    bindSlider("sl_half", (v) => v.toFixed(1) + " 時間", (v) => { state.half = v; draw(); });
    bindSlider("sl_conv", (v) => v + "%", (v) => { state.conv = v; draw(); });
    draw();
  };

  // 17. 単一細胞eQTL -------------------------------------------------------
  W.sceqtl = function (container) {
    const state = { cell: "mono", donors: 60 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("eq_cell", "解析に使う細胞", [
          { v: "bulk", label: "バルク（全細胞まぜて）" },
          { v: "mono", label: "単球だけ" },
          { v: "tcell", label: "T細胞だけ" },
        ], state.cell)}
        ${sliderRow("eq_n", "ドナー数", 20, 200, 10, state.donors, (v) => v + " 人")}
      </div>
      <div class="widget-stage"><div id="eq_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${BLUE}"></span>ドナー1人ぶんの平均発現</span>
          <span class="li"><span class="sw" style="background:${INK}"></span>遺伝子型に対する回帰直線</span>
        </div></div>
      ${readoutRow([
        { id: "eq_b", label: "効果量 β（1アレルあたり）", value: "—" },
        { id: "eq_p", label: "p値", value: "—" },
        { id: "eq_j", label: "判定", value: "—" },
      ])}
      <p class="widget-note">同じ遺伝子・同じ変異でも、<b>どの細胞集団で見たか</b>で eQTL は出たり消えたりします。単球でのみ効く変異はバルクでは薄まって消えます。sc-eQTL の図では、<b>細胞種ごとの点の傾き</b>と、その細胞が何割を占めるかを合わせて読みます。</p>`;
    function draw() {
      const trueB = state.cell === "mono" ? 0.62 : state.cell === "tcell" ? 0.02 : 0.62 * 0.22;
      const noiseSd = state.cell === "bulk" ? 0.32 : state.cell === "tcell" ? 0.34 : 0.38;
      const rng = CK.makeRng(3307);
      const gs = [], ys = [];
      for (let i = 0; i < state.donors; i++) {
        const u = rng(), g = u < 0.49 ? 0 : u < 0.91 ? 1 : 2;   // MAF 約0.3
        gs.push(g);
        ys.push(4.0 + trueB * g + CK.randNormal(0, noiseSd, rng));
      }
      const ctx = CK.plot(document.getElementById("eq_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 50, left: 56 },
        xDomain: [-0.5, 2.5], yDomain: [2.6, 6.2], xTicks: 3, yTicks: 6,
        xFmt: (v) => (Math.abs(v - 0) < 0.01 ? "AA" : Math.abs(v - 1) < 0.01 ? "AB" : Math.abs(v - 2) < 0.01 ? "BB" : ""),
        xLabel: "遺伝子型", yLabel: "この細胞種での平均発現量（log）",
      });
      const rng2 = CK.makeRng(881);
      gs.forEach((g, i) => CK.dot(ctx, g + CK.randNormal(0, 0.09, rng2), clamp(ys[i], 2.6, 6.2), { r: 3.8, fill: BLUE, opacity: 0.55 }));
      const fit = CK.linreg(gs, ys);
      CK.line(ctx, [[0, fit.intercept], [2, fit.intercept + fit.slope * 2]], { stroke: INK, "stroke-width": 2.4 });
      // 傾きのSEとt検定
      const mg = CK.mean(gs), sxx = gs.reduce((a, g) => a + (g - mg) * (g - mg), 0);
      let sse = 0; gs.forEach((g, i) => { const r = ys[i] - (fit.intercept + fit.slope * g); sse += r * r; });
      const df = Math.max(1, gs.length - 2);
      const se = Math.sqrt(sse / df / Math.max(sxx, 1e-9));
      const t = fit.slope / se, p = CK.tTwoSidedP(Math.abs(t), df);
      setReadout("eq_b", fit.slope.toFixed(3));
      setReadout("eq_p", CK.pfmt(p).replace("p = ", "").replace("p ＜ ", "＜ ").replace("p < ", "＜ "));
      setReadout("eq_j", p < 0.05 ? "eQTLとして検出" : "検出できず");
    }
    bindSeg("eq_cell", (v) => { state.cell = v; draw(); });
    bindSlider("eq_n", (v) => v + " 人", (v) => { state.donors = v; draw(); });
    draw();
  };

  // 18. MERFISH ------------------------------------------------------------
  W.merfish = function (container) {
    const state = { err: 6, code: "hd4" };
    // 長さ16・重み4の符号語。任意の2語の重なりが2以下なので最小ハミング距離は4（MHD4）。
    const CODES = [
      [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
      [0, 1, 4, 5], [2, 3, 6, 7], [8, 9, 12, 13], [10, 11, 14, 15],
    ];
    const GENES = ["GeneA", "GeneB", "GeneC", "GeneD", "GeneE", "GeneF", "GeneG", "GeneH"];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("mf_code", "使う符号", [
          { v: "plain", label: "誤り訂正なしの符号" },
          { v: "hd4", label: "MHD4符号（1ビット誤りを訂正）" },
        ], state.code)}
        ${sliderRow("mf_err", "1ビットあたりの検出誤り率", 0, 20, 1, state.err, (v) => v + "%")}
      </div>
      <div class="widget-stage"><div id="mf_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${INK}"></span>本来ONのビット</span>
          <span class="li"><span class="sw" style="background:${ORANGE}"></span>誤って反転したビット</span>
        </div></div>
      ${readoutRow([
        { id: "mf_ok", label: "正しく同定", value: "—" },
        { id: "mf_rj", label: "棄却（読めないと判断）", value: "—" },
        { id: "mf_bad", label: "別の遺伝子と誤同定", value: "—" },
      ])}
      <p class="widget-note">MERFISHの強みは多重度そのものより<b>誤り訂正</b>です。訂正なしなら1ビットの取りこぼしがそのまま別の遺伝子に化けますが、MHD4符号では1ビット誤りは復元され、2ビット誤りは「読めない」として捨てられます。<b>誤同定より棄却を選ぶ</b>設計だと理解して図を読みます。</p>`;
    function draw() {
      const p = state.err / 100, hd4 = state.code === "hd4";
      // 16ビット中の誤り数の分布から結果を集計する
      let ok = 0, rej = 0, bad = 0;
      for (let e = 0; e <= 16; e++) {
        const pr = binom(16, e, p);
        if (e === 0) ok += pr;
        else if (hd4 && e === 1) ok += pr;
        else if (hd4 && e === 2) rej += pr;
        else bad += pr;
      }
      const W2 = 560, H2 = 306, s = lightPanel(document.getElementById("mf_plot"), W2, H2, "#f6f8fb");
      const rng = CK.makeRng(6612);
      const bx = 118, bw = 19, bh = 15;
      txt(s, 6, 18, "測定された16ビットのバーコード", { "font-size": 12, "font-weight": 700, fill: INK });
      for (let i = 0; i < 8; i++) {
        const y = 30 + i * 21;
        const on = new Set(CODES[i]);
        let flips = 0;
        txt(s, 6, y + 11, GENES[i], { "font-size": 11.5, fill: MUTED });
        for (let b = 0; b < 16; b++) {
          const flip = rng() < p;
          if (flip) flips++;
          const bit = on.has(b) !== flip;
          add(s, "rect", {
            x: bx + b * bw, y, width: bw - 3, height: bh, rx: 2,
            fill: flip ? ORANGE : bit ? INK : "#dfe4ee",
          });
        }
        const stat = flips === 0 ? "正しく同定" : hd4 ? (flips === 1 ? "訂正して同定" : flips === 2 ? "棄却" : "誤同定") : "誤同定";
        const col = stat === "誤同定" ? RED : stat === "棄却" ? MUTED : GREEN;
        txt(s, bx + 16 * bw + 6, y + 11, stat, { "font-size": 11, fill: col, "font-weight": 700 });
      }
      // 集計の積み上げ棒
      const y0 = 232, barW = 430;
      txt(s, 6, y0 - 10, "分子1万個あたりの内訳", { "font-size": 12, "font-weight": 700, fill: INK });
      let x = 60;
      [[ok, GREEN, "同定"], [rej, "#aab2c4", "棄却"], [bad, RED, "誤同定"]].forEach((d) => {
        const w = d[0] * barW;
        if (w > 0.5) add(s, "rect", { x, y: y0, width: w, height: 34, fill: d[1] });
        if (w > 46) txt(s, x + w / 2, y0 + 22, d[2] + " " + (d[0] * 100).toFixed(1) + "%", { "text-anchor": "middle", "font-size": 11.5, fill: "#fff", "font-weight": 700 });
        x += w;
      });
      add(s, "rect", { x: 60, y: y0, width: barW, height: 34, fill: "none", stroke: "#c7cce0" });
      txt(s, 60, y0 + 56, "橙のビットは検出誤り。MHD4では1つまでなら元の符号語へ戻せます。", { "font-size": 11.5, fill: MUTED });

      setReadout("mf_ok", (ok * 100).toFixed(1) + "%");
      setReadout("mf_rj", (rej * 100).toFixed(1) + "%");
      setReadout("mf_bad", (bad * 100).toFixed(1) + "%");
    }
    bindSeg("mf_code", (v) => { state.code = v; draw(); });
    bindSlider("mf_err", (v) => v + "%", (v) => { state.err = v; draw(); });
    draw();
  };

  // 19. seqFISH+ -----------------------------------------------------------
  W.seqfish = function (container) {
    const state = { pseudo: 12, rounds: 4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("sf_ps", "疑似色数（1ラウンドを何枚に分けて撮るか）", 4, 60, 2, state.pseudo, (v) => v + " 色")}
        ${sliderRow("sf_rd", "バーコードのラウンド数", 2, 5, 1, state.rounds, (v) => v + " ラウンド")}
      </div>
      <div class="widget-stage"><div id="sf_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${BLUE}"></span>分離できたスポット</span>
          <span class="li"><span class="sw" style="background:${RED}"></span>重なって分離できないスポット</span>
        </div></div>
      ${readoutRow([
        { id: "sf_cap", label: "符号化できる遺伝子数", value: "—" },
        { id: "sf_spot", label: "1枚あたりのスポット数", value: "—" },
        { id: "sf_ov", label: "重なり（光学的混雑）", value: "—" },
      ])}
      <p class="widget-note">seqFISH+ の要点は「色を増やす」ことではなく、<b>1枚の画像に写るスポットを疑似色で薄めて重なりを防ぐ</b>ことです。疑似色を減らすと符号数は減らずとも視野が赤く埋まり、定量が壊れます。図では<b>スポット密度と検出効率</b>が併記されているかを見てください。</p>`;
    function draw() {
      const F = state.pseudo, R = state.rounds;
      const TOTAL = 3000;
      const n = Math.max(8, Math.round(TOTAL / F));
      const W2 = 560, H2 = 320, s = lightPanel(document.getElementById("sf_plot"), W2, H2, "#fbfcfe");
      const fx = 150, fy = 22, fw = 276, fh = 276;
      add(s, "rect", { x: fx, y: fy, width: fw, height: fh, rx: 6, fill: "#ffffff", stroke: "#c7cce0" });
      txt(s, fx, fy - 6, "1ラウンド分の1枚の画像（疑似色1色ぶん）", { "font-size": 11.5, fill: MUTED });
      const rng = CK.makeRng(1904);
      const rr = 2.6, pts = [];
      for (let i = 0; i < n; i++) pts.push([fx + 4 + rng() * (fw - 8), fy + 4 + rng() * (fh - 8)]);
      let overlap = 0;
      const flagged = new Array(n).fill(false);
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
          if (dx * dx + dy * dy < (2 * rr) * (2 * rr)) { flagged[i] = true; flagged[j] = true; }
        }
      }
      for (let i = 0; i < n; i++) {
        if (flagged[i]) overlap++;
        add(s, "circle", { cx: pts[i][0], cy: pts[i][1], r: rr, fill: flagged[i] ? RED : BLUE, opacity: flagged[i] ? 0.9 : 0.6 });
      }
      // 左側にラウンド構成の説明
      txt(s, 8, 40, "ラウンド構成", { "font-size": 12, "font-weight": 700, fill: INK });
      for (let r = 0; r < R; r++) {
        const y = 56 + r * 30;
        add(s, "rect", { x: 8, y, width: 126, height: 22, rx: 4, fill: mixColor("#dbe6ff", "#9db6ff", r / Math.max(1, R - 1)) });
        txt(s, 14, y + 15, "R" + (r + 1) + "：" + F + " 色から1つ", { "font-size": 11, fill: INK });
      }
      txt(s, 8, 56 + R * 30 + 14, "符号数 ＝ " + F + " の " + R + " 乗", { "font-size": 11.5, fill: MUTED });

      const cap = Math.pow(F, R);
      setReadout("sf_cap", cap.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " 通り");
      setReadout("sf_spot", n.toLocaleString() + " 個");
      setReadout("sf_ov", (100 * overlap / n).toFixed(1) + "%");
    }
    bindSlider("sf_ps", (v) => v + " 色", (v) => { state.pseudo = v; draw(); });
    bindSlider("sf_rd", (v) => v + " ラウンド", (v) => { state.rounds = v; draw(); });
    draw();
  };

  // 20. Slide-seq / Slide-tags ---------------------------------------------
  W.slideseq = function (container) {
    const state = { bead: 20, mode: "seq" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ss_mode", "手法", [
          { v: "seq", label: "Slide-seq（ビーズ上のRNAを回収）" },
          { v: "tags", label: "Slide-tags（核に位置タグを移す）" },
        ], state.mode)}
        ${sliderRow("ss_bead", "ビーズの直径", 5, 50, 5, state.bead, (v) => v + " µm")}
      </div>
      <div class="widget-stage"><div id="ss_plot"></div>
        <div class="legend-row">
          <span class="li"><span class="sw" style="background:${RED}"></span>細胞種X</span>
          <span class="li"><span class="sw" style="background:${BLUE}"></span>細胞種Y</span>
          <span class="li"><span class="sw" style="background:${PURPLE}"></span>2種が混ざった読み取り単位</span>
        </div></div>
      ${readoutRow([
        { id: "ss_nb", label: "読み取り単位の数", value: "—" },
        { id: "ss_cc", label: "1単位あたりの細胞数", value: "—" },
        { id: "ss_bl", label: "境界のぼけ幅", value: "—" },
      ])}
      <p class="widget-note">位置バーコードの図で最初に確かめるのは<b>「1つの点＝1細胞なのか、直径◯µmの区画なのか」</b>です。Slide-seqのビーズは細胞境界と無関係に切るため、大きくすると境界がにじみ、混合した発現プロファイルが「中間的な細胞種」に見えてしまいます。Slide-tagsは核単位なのでこの混合が起きません。</p>`;
    function draw() {
      const d = state.bead, tags = state.mode === "tags";
      const W2 = 560, H2 = 344, s = lightPanel(document.getElementById("ss_plot"), W2, H2, "#fbfcfe");
      const ox = 60, oy = 24, tw = 440, th = 272;   // 組織 440µm × 272µm 相当
      add(s, "rect", { x: ox, y: oy, width: tw, height: th, rx: 6, fill: "#ffffff", stroke: "#c7cce0" });
      // 真の組織構造：曲がった境界
      const boundary = (x) => 130 + 55 * Math.sin((x / tw) * Math.PI * 1.6);
      const truth = (x, y) => (y < boundary(x) ? 1 : 0);   // 1 = 細胞種X
      const path = [];
      for (let x = 0; x <= tw; x += 8) path.push(`${x === 0 ? "M" : "L"} ${ox + x} ${oy + boundary(x)}`);
      add(s, "path", { d: path.join(" "), fill: "none", stroke: "#9aa2b6", "stroke-width": 1.6, "stroke-dasharray": "5 4" });

      const rng = CK.makeRng(7745);
      let units = 0, mixed = 0;
      if (tags) {
        // 核ひとつが1単位。位置精度は数µm。
        const cellD = 12;
        for (let y = cellD / 2; y < th; y += cellD) {
          for (let x = cellD / 2; x < tw; x += cellD) {
            const jx = x + CK.randNormal(0, 2.4, rng), jy = y + CK.randNormal(0, 2.4, rng);
            const f = truth(x, y);
            units++;
            add(s, "circle", { cx: ox + clamp(jx, 4, tw - 4), cy: oy + clamp(jy, 4, th - 4), r: 3.4, fill: f ? RED : BLUE, opacity: 0.85 });
          }
        }
        setReadout("ss_nb", units.toLocaleString() + " 核");
        setReadout("ss_cc", "1.0 細胞");
        setReadout("ss_bl", "約 3 µm");
      } else {
        const offX = (tw % d) / 2, offY = (th % d) / 2;
        for (let y = offY; y + d <= th + 0.01; y += d) {
          for (let x = offX; x + d <= tw + 0.01; x += d) {
            // ビーズの覆う正方区画に含まれる細胞種Xの割合
            let hit = 0, tot = 0;
            for (let sy = 2; sy < d; sy += Math.max(2, d / 5)) {
              for (let sx = 2; sx < d; sx += Math.max(2, d / 5)) {
                tot++; if (truth(x + sx, y + sy)) hit++;
              }
            }
            const f = tot ? hit / tot : 0;
            units++;
            if (f > 0.12 && f < 0.88) mixed++;
            const col = f > 0.88 ? RED : f < 0.12 ? BLUE : mixColor(BLUE, RED, f);
            add(s, "circle", {
              cx: ox + x + d / 2, cy: oy + y + d / 2,
              r: Math.max(1.8, d / 2 - 1), fill: col, opacity: 0.88,
            });
          }
        }
        setReadout("ss_nb", units.toLocaleString() + " ビーズ");
        setReadout("ss_cc", (Math.pow(d / 12, 2)).toFixed(1) + " 細胞");
        setReadout("ss_bl", "約 " + d + " µm");
      }
      txt(s, 6, 18, tags ? "1点 ＝ 1核（位置タグ付き）" : "1点 ＝ 直径 " + d + " µm のビーズ", { "font-size": 12, "font-weight": 700, fill: INK });
      txt(s, ox, oy + th + 17, "破線＝本当の組織境界。" + (tags ? "核単位なので混合は起きません。" : "ビーズが大きいほど境界の紫（混合）が増えます。"), { "font-size": 11.5, fill: MUTED });
      if (!tags) txt(s, ox, oy + th + 34, "2種が混ざったビーズ： " + (100 * mixed / Math.max(1, units)).toFixed(0) + "%", { "font-size": 11.5, fill: PURPLE, "font-weight": 700 });
    }
    bindSeg("ss_mode", (v) => { state.mode = v; draw(); });
    bindSlider("ss_bead", (v) => v + " µm", (v) => { state.bead = v; draw(); });
    draw();
  };
})();

/* 第12章 発展編 パート4（t31-t40）のインタラクティブ教材
   LiP-MS / AlphaFold-Multimer / de novo設計 / ナノポアタンパク質 /
   ダイレクトRNA / eCLIP / SHAPE-MaP / PRO-seq / Micro-C / Repli-seq
   すべて .widget-stage（明るいデータパネル）上に SVG で描画する。 */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;

  // 明るいステージ上で読みやすい配色
  const RED = "#e5484d", BLUE = "#3b63e0", GREEN = "#0f9e73",
    AMBER = "#f59e0b", PURPLE = "#a855f7", GRAY = "#c3c9d8", INK = "#4a5268";

  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(s, tag, attrs) { const e = CK.el(tag, attrs); s.appendChild(e); return e; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  function mix(c1, c2, t) {
    const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const a = p(c1), b = p(c2);
    return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
  }

  // ---------------------------------------------------------------- 31. LiP-MS
  W.lipms = function (container) {
    const NPEP = 44, CENTER = 27, EXPOSE = 8; // 結合部位近傍と、遠隔で露出する部位
    const rng = CK.makeRng(31031);
    const noise = Array.from({ length: NPEP }, () => CK.randNormal(0, 1, rng));
    const state = { lig: 2, prot: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("lip_l", "リガンド濃度", 0, 20, 0.5, state.lig, (v) => v.toFixed(1) + " μM")}
        ${sliderRow("lip_p", "限定分解の強さ（プロテアーゼ量・時間）", 0.2, 2.6, 0.1, state.prot, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage">
        <div id="lip_map"></div>
        <div id="lip_vol"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${RED}"></span>有意に保護（切られにくい）</span><span class="li"><span class="sw" style="background:${BLUE}"></span>有意に露出</span><span class="li"><span class="sw" style="background:${GRAY}"></span>変化なし</span></div>
      </div>
      ${readoutRow([
        { id: "lip_occ", label: "リガンド占有率", value: "—" },
        { id: "lip_pro", label: "保護ペプチド", value: "—" },
        { id: "lip_exp", label: "露出ペプチド", value: "—" },
      ])}
      <p class="widget-note">結合部位の近傍だけが<b>切られにくく（保護）</b>なり、ボルカノ図の左上に集まります。分解が弱すぎても強すぎても差が消えることに注目。<b>離れた位置の露出</b>はアロステリックな構造変化で、直接の結合部位とは限りません。</p>`;

    function model() {
      const occ = state.lig / (state.lig + 3.0);               // Kd = 3 μM
      const win = Math.exp(-((state.prot - 1.1) ** 2) / (2 * 0.55 * 0.55)); // 分解条件の窓
      const se = 0.16 + 0.10 / state.prot;
      return Array.from({ length: NPEP }, (_, i) => {
        const prot = Math.exp(-((i - CENTER) ** 2) / (2 * 2.4 * 2.4));
        const expo = Math.exp(-((i - EXPOSE) ** 2) / (2 * 1.6 * 1.6));
        const r = (-2.6 * prot + 1.5 * expo) * occ * win + noise[i] * se;
        const p = Math.max(1e-9, 2 * (1 - CK.normalCDF(Math.abs(r) / se)));
        return { i, r, p, y: -Math.log10(p) };
      });
    }
    function draw() {
      const peps = model();
      // (a) ペプチドマップ
      const MW = 560, MH = 96;
      const s = stage(document.getElementById("lip_map"), MW, MH);
      const x0 = 44, cw = (MW - x0 - 16) / NPEP;
      peps.forEach((p) => {
        const t = clamp(Math.abs(p.r) / 2.6, 0, 1);
        const col = p.p < 0.01 ? mix("#ffffff", p.r < 0 ? RED : BLUE, 0.25 + 0.75 * t) : "#eef1f7";
        add(s, "rect", { x: x0 + p.i * cw, y: 30, width: cw - 0.8, height: 28, fill: col, stroke: "#dfe4ef", "stroke-width": 0.6 });
      });
      add(s, "text", { x: 6, y: 48, "font-size": 10.5, fill: INK, "font-weight": 700, text: "配列" });
      add(s, "line", { x1: x0 + (CENTER - 2.2) * cw, x2: x0 + (CENTER + 3.2) * cw, y1: 24, y2: 24, stroke: GREEN, "stroke-width": 3 });
      add(s, "text", { x: x0 + (CENTER + 0.5) * cw, y: 19, "text-anchor": "middle", "font-size": 10, fill: GREEN, "font-weight": 700, text: "リガンド結合部位" });
      add(s, "text", { x: x0, y: 74, "font-size": 10, fill: "#8a93a8", text: "N末端" });
      add(s, "text", { x: MW - 16, y: 74, "text-anchor": "end", "font-size": 10, fill: "#8a93a8", text: "C末端" });
      add(s, "text", { x: MW / 2, y: 90, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "タンパク質の一次配列上に並べたペプチド（色＝変化の向きと大きさ）" });

      // (b) ボルカノ図
      const ctx = CK.plot(document.getElementById("lip_vol"), {
        width: 560, height: 300, margin: { top: 14, right: 20, bottom: 46, left: 54 },
        xDomain: [-3.2, 3.2], yDomain: [0, 8], xTicks: 8, yTicks: 4,
        xLabel: "log2（リガンドあり／なし）のLiPペプチド量", yLabel: "−log10(p値)",
      });
      CK.hline(ctx, 2, { stroke: "#c7cce0" });
      let pro = 0, exp = 0;
      peps.forEach((p) => {
        let fill = GRAY;
        if (p.y >= 2 && p.r < 0) { fill = RED; pro++; }
        else if (p.y >= 2 && p.r > 0) { fill = BLUE; exp++; }
        CK.dot(ctx, clamp(p.r, -3.2, 3.2), Math.min(p.y, 8), { r: 4, fill, opacity: fill === GRAY ? 0.5 : 0.9, stroke: "#fff", "stroke-width": 0.8 });
      });
      const occ = state.lig / (state.lig + 3.0);
      setReadout("lip_occ", (occ * 100).toFixed(0) + "%");
      setReadout("lip_pro", pro + " 本");
      setReadout("lip_exp", exp + " 本");
    }
    bindSlider("lip_l", (v) => v.toFixed(1) + " μM", (v) => { state.lig = v; draw(); });
    bindSlider("lip_p", (v) => "×" + v.toFixed(1), (v) => { state.prot = v; draw(); });
    draw();
  };

  // ------------------------------------------- 32. AlphaFold-Multimer（PAE/ipTM）
  W.afmultimer = function (container) {
    const NA = 34, NB = 26, N = NA + NB;
    const rng = CK.makeRng(32032);
    const jitter = [];
    for (let i = 0; i < N; i++) { jitter[i] = []; for (let j = 0; j < N; j++) jitter[i][j] = CK.randNormal(0, 1, rng); }
    const state = { iface: 0.35, fold: 0.85 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("af_i", "界面の予測しやすさ（共進化シグナルの強さ）", 0, 1, 0.05, state.iface, (v) => (v * 100).toFixed(0) + "%")}
        ${sliderRow("af_f", "各鎖の折りたたみ品質", 0.3, 1, 0.05, state.fold, (v) => (v * 100).toFixed(0) + "%")}
      </div>
      <div class="widget-stage"><div id="af_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#14532d"></span>PAE 小（相対配置が信頼できる）</span><span class="li"><span class="sw" style="background:#eef7f1"></span>PAE 大（信頼できない）</span></div></div>
      ${readoutRow([
        { id: "af_iptm", label: "ipTM（界面）", value: "—" },
        { id: "af_ptm", label: "pLDDT（平均）", value: "—" },
        { id: "af_pae", label: "鎖間PAE 中央値", value: "—" },
        { id: "af_j", label: "判定", value: "—" },
      ])}
      <p class="widget-note">左上・右下の<b>対角ブロック</b>は各鎖の内部、対角外の<b>鎖間ブロック</b>は複合体の界面です。折りたたみ品質だけ上げても鎖間ブロックは薄いまま＝<b>単量体は良いが複合体は信用できない</b>状態が作れます。</p>`;
    function draw() {
      const SZ = 330, mL = 46, top = 16, cell = (SZ - 22) / N;
      const s = stage(document.getElementById("af_plot"), 560, SZ + 46);
      const intra = lerp(14, 2.2, state.fold);
      const inter = lerp(29, 2.8, state.iface);
      let interSum = [];
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const sameChain = (i < NA) === (j < NA);
        const d = Math.abs(i - j);
        let v = sameChain
          ? Math.min(31, intra * (0.35 + 0.9 * Math.min(1, d / 18)) + jitter[i][j] * 0.7)
          : Math.min(31, inter + jitter[i][j] * 1.1);
        v = Math.max(0.4, v);
        if (!sameChain) interSum.push(v);
        const t = 1 - clamp(v / 31, 0, 1); // t=1 → 誤差小（濃い緑）
        add(s, "rect", { x: mL + j * cell, y: top + i * cell, width: cell + 0.4, height: cell + 0.4, fill: mix("#eef7f1", "#14532d", t) });
      }
      // 鎖の区切り
      add(s, "line", { x1: mL + NA * cell, x2: mL + NA * cell, y1: top, y2: top + N * cell, stroke: "#ffffff", "stroke-width": 1.6 });
      add(s, "line", { x1: mL, x2: mL + N * cell, y1: top + NA * cell, y2: top + NA * cell, stroke: "#ffffff", "stroke-width": 1.6 });
      add(s, "rect", { x: mL, y: top, width: N * cell, height: N * cell, fill: "none", stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: mL + NA * cell / 2, y: top - 4, "text-anchor": "middle", "font-size": 10.5, fill: INK, "font-weight": 700, text: "鎖A" });
      add(s, "text", { x: mL + (NA + NB / 2) * cell, y: top - 4, "text-anchor": "middle", "font-size": 10.5, fill: INK, "font-weight": 700, text: "鎖B" });
      add(s, "text", { x: 14, y: top + NA * cell / 2, "text-anchor": "middle", "font-size": 10.5, fill: INK, "font-weight": 700, transform: `rotate(-90 14 ${top + NA * cell / 2})`, text: "鎖A" });
      add(s, "text", { x: 14, y: top + (NA + NB / 2) * cell, "text-anchor": "middle", "font-size": 10.5, fill: INK, "font-weight": 700, transform: `rotate(-90 14 ${top + (NA + NB / 2) * cell})`, text: "鎖B" });
      add(s, "text", { x: mL + N * cell + 14, y: top + NA * cell + 14, "font-size": 10.5, fill: PURPLE, "font-weight": 700, text: "← 鎖間ブロック" });
      add(s, "text", { x: mL + N * cell / 2, y: SZ + 34, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", text: "PAE 行列（残基 × 残基、単位 Å）" });

      interSum.sort((a, b) => a - b);
      const med = interSum[Math.floor(interSum.length / 2)];
      const iptm = clamp(0.08 + 0.86 * Math.pow(state.iface, 0.85) * (0.55 + 0.45 * state.fold), 0, 0.98);
      const plddt = 45 + 50 * state.fold;
      setReadout("af_iptm", iptm.toFixed(2));
      setReadout("af_ptm", plddt.toFixed(0));
      setReadout("af_pae", med.toFixed(1) + " Å");
      setReadout("af_j", iptm >= 0.8 ? "界面は高信頼" : iptm >= 0.5 ? "要検証（中程度）" : "界面は信用しない");
    }
    bindSlider("af_i", (v) => (v * 100).toFixed(0) + "%", (v) => { state.iface = v; draw(); });
    bindSlider("af_f", (v) => (v * 100).toFixed(0) + "%", (v) => { state.fold = v; draw(); });
    draw();
  };

  // --------------------------------------------------- 33. de novo タンパク質設計
  W.proteindesign = function (container) {
    const rng = CK.makeRng(33033);
    const pool = Array.from({ length: 1600 }, () => {
      const scr = Math.max(0.35, 0.35 + 4.6 * Math.pow(rng(), 1.6));
      const plddt = clamp(96 - 9 * scr + CK.randNormal(0, 4.5, rng), 45, 98);
      // 実験で機能する確率は scRMSD が小さく pLDDT が高いほど上がる（それでも低い）
      const pFunc = clamp(0.30 * Math.exp(-scr / 0.9) * ((plddt - 45) / 53), 0, 0.4);
      return { scr, plddt, func: rng() < pFunc };
    });
    const state = { n: 400, cut: 2.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("pd_n", "設計・合成する候補の数", 50, 1600, 50, state.n, (v) => v + " 個")}
        ${sliderRow("pd_c", "選抜の厳しさ（scRMSD 閾値）", 0.5, 5, 0.1, state.cut, (v) => v.toFixed(1) + " Å")}
      </div>
      <div class="widget-stage"><div id="pd_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${GREEN}"></span>通過かつ実験で機能</span><span class="li"><span class="sw" style="background:${AMBER}"></span>通過したが機能せず</span><span class="li"><span class="sw" style="background:${GRAY}"></span>フィルター落ち</span></div></div>
      ${readoutRow([
        { id: "pd_pass", label: "計算フィルター通過", value: "—" },
        { id: "pd_hit", label: "実験で機能", value: "—" },
        { id: "pd_rate", label: "通過候補中の成功率", value: "—" },
        { id: "pd_all", label: "全候補中の成功率", value: "—" },
      ])}
      <p class="widget-note">論文の図に載るのは緑の点だけです。閾値を厳しくすると成功率は上がりますが<b>通過数自体が激減</b>します。分母（試した総数）が書かれていない図から手法の実力は読めません。</p>`;
    function draw() {
      const cands = pool.slice(0, state.n);
      const ctx = CK.plot(document.getElementById("pd_plot"), {
        width: 560, height: 320, margin: { top: 16, right: 20, bottom: 48, left: 56 },
        xDomain: [0, 5.2], yDomain: [40, 100], xTicks: 6, yTicks: 6,
        xLabel: "self-consistency RMSD（設計骨格と再予測構造のずれ, Å）", yLabel: "再予測 pLDDT",
      });
      CK.vline(ctx, state.cut, { stroke: PURPLE, "stroke-width": 1.6 });
      CK.textPx(ctx, ctx.x(state.cut) + 5, ctx.margin.top + 14, "選抜の閾値", { fill: PURPLE, "font-size": 10.5, "font-weight": 700 });
      let pass = 0, hit = 0, allHit = 0;
      cands.forEach((c) => {
        const p = c.scr <= state.cut;
        if (p) { pass++; if (c.func) hit++; }
        if (c.func) allHit++;
        const fill = p ? (c.func ? GREEN : AMBER) : GRAY;
        CK.dot(ctx, Math.min(c.scr, 5.2), c.plddt, { r: p && c.func ? 4.2 : 2.8, fill, opacity: p ? 0.85 : 0.35 });
      });
      setReadout("pd_pass", pass + " 個");
      setReadout("pd_hit", hit + " 個");
      setReadout("pd_rate", pass ? ((hit / pass) * 100).toFixed(1) + "%" : "—");
      setReadout("pd_all", ((allHit / cands.length) * 100).toFixed(1) + "%");
    }
    bindSlider("pd_n", (v) => v + " 個", (v) => { state.n = v; draw(); });
    bindSlider("pd_c", (v) => v.toFixed(1) + " Å", (v) => { state.cut = v; draw(); });
    draw();
  };

  // ------------------------------------- 34. ナノポア・タンパク質シークエンシング
  W.nanoporeprotein = function (container) {
    // アミノ酸ごとの「電流の下がりやすさ」（模式値。実測値ではありません）
    const LEV = { G: 0.86, A: 0.80, S: 0.78, V: 0.70, L: 0.66, K: 0.60, E: 0.58, F: 0.50, Y: 0.46, W: 0.38 };
    const SEQ = {
      easy: "GWGAWGYGVW".split(""),
      hard: "LFVYLFYVLF".split(""),
    };
    const rng = CK.makeRng(34034);
    const state = { seq: "easy", noise: 0.03, speed: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("np_s", "ペプチド", [{ v: "easy", label: "識別しやすい配列" }, { v: "hard", label: "似た残基が並ぶ配列" }], state.seq)}
        ${sliderRow("np_n", "電流ノイズ", 0.005, 0.09, 0.005, state.noise, (v) => (v * 100).toFixed(1) + "%")}
        ${sliderRow("np_v", "通過速度", 0.4, 3, 0.1, state.speed, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="np_plot"></div></div>
      ${readoutRow([
        { id: "np_id", label: "正しく読めた残基", value: "—" },
        { id: "np_dwell", label: "1残基の滞在時間", value: "—" },
        { id: "np_call", label: "推定された配列", value: "—" },
      ])}
      <p class="widget-note">縦軸は開放時電流に対する比（正規化値）。段の深さが残基に対応します。<b>ノイズを上げる・速度を上げる</b>と段が潰れ、似た残基（LとF、YとWなど）が読み分けられなくなります。</p>`;
    function draw() {
      const seq = SEQ[state.seq];
      const dwell = 8 / state.speed;           // ms
      const perRes = Math.max(3, Math.round(14 / state.speed));
      const eff = state.noise / Math.sqrt(perRes);   // 平均化後の実効ノイズ
      const pts = [], meas = [];
      let t = 0;
      pts.push([0, 1.0]);
      pts.push([6, 1.0]);
      t = 6;
      seq.forEach((aa) => {
        let acc = 0;
        for (let k = 0; k < perRes; k++) {
          const v = LEV[aa] + CK.randNormal(0, state.noise, rng);
          acc += v;
          pts.push([t + (k + 1) * (dwell / perRes) * 0.9, v]);
        }
        meas.push(acc / perRes);
        t += dwell * 0.9;
      });
      pts.push([t + 6, 1.0]);
      const xMax = t + 8;
      const ctx = CK.plot(document.getElementById("np_plot"), {
        width: 560, height: 300, margin: { top: 16, right: 20, bottom: 48, left: 58 },
        xDomain: [0, xMax], yDomain: [0.25, 1.08], xTicks: 6, yTicks: 5,
        xLabel: "時間（ms）", yLabel: "電流（開放時に対する比）",
        yFmt: (v) => v.toFixed(2),
      });
      // 理論レベルの目安線
      Object.keys(LEV).forEach((aa) => {
        CK.hline(ctx, LEV[aa], { stroke: "#e6eaf3", "stroke-dasharray": "2 3" });
        CK.textPx(ctx, ctx.margin.left + ctx.w + 3, ctx.y(LEV[aa]) + 3, aa, { "font-size": 9, fill: "#a6adbd" });
      });
      CK.line(ctx, pts, { stroke: BLUE, "stroke-width": 1.6, opacity: 0.9 });
      // 各残基の推定
      let ok = 0;
      const calls = meas.map((m, i) => {
        let best = null, bd = 9;
        Object.keys(LEV).forEach((aa) => { const d = Math.abs(LEV[aa] - m); if (d < bd) { bd = d; best = aa; } });
        if (best === seq[i]) ok++;
        return best;
      });
      calls.forEach((c, i) => {
        const cx = ctx.x(6 + (i + 0.5) * dwell * 0.9);
        CK.textPx(ctx, cx, ctx.margin.top + 12, c, { "font-size": 11.5, "text-anchor": "middle", "font-weight": 700, fill: c === seq[i] ? GREEN : RED });
      });
      setReadout("np_id", ok + " / " + seq.length);
      setReadout("np_dwell", dwell.toFixed(1) + " ms");
      setReadout("np_call", calls.join(""));
    }
    bindSeg("np_s", (v) => { state.seq = v; draw(); });
    bindSlider("np_n", (v) => (v * 100).toFixed(1) + "%", (v) => { state.noise = v; draw(); });
    bindSlider("np_v", (v) => "×" + v.toFixed(1), (v) => { state.speed = v; draw(); });
    draw();
  };

  // ------------------------------------------ 35. ダイレクトRNAシークエンシング
  W.directrna = function (container) {
    const BASES = "GGACUAGGACGUUAGCUGGACAUCG".split("");
    const SITE = 12; // m6A 部位（DRACH 文脈のA）
    const rng = CK.makeRng(35035);
    const base = BASES.map(() => 0.55 + 0.35 * rng());
    const state = { stoich: 0.5, cov: 40 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("dr_s", "真のm6A修飾率", 0, 1, 0.05, state.stoich, (v) => (v * 100).toFixed(0) + "%")}
        ${sliderRow("dr_c", "その部位のカバレッジ（通過分子数）", 4, 300, 2, state.cov, (v) => v + " 本")}
      </div>
      <div class="widget-stage"><div id="dr_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${BLUE}"></span>非修飾対照（IVT）</span><span class="li"><span class="sw" style="background:${RED}"></span>細胞由来RNA</span></div></div>
      ${readoutRow([
        { id: "dr_est", label: "推定修飾率", value: "—" },
        { id: "dr_ci", label: "95%信頼区間", value: "—" },
        { id: "dr_w", label: "区間の幅", value: "—" },
      ])}
      <p class="widget-note">m6A部位で電流が下方向にずれます。ずれの大きさが修飾率に対応しますが、<b>カバレッジが小さいと推定は大きく揺れます</b>。信頼区間もカバレッジも書かれていない修飾率の棒グラフは要注意です。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("dr_plot"), {
        width: 560, height: 310, margin: { top: 18, right: 20, bottom: 52, left: 58 },
        xDomain: [0, BASES.length - 1], yDomain: [0.3, 1.05], xTicks: 0, yTicks: 5,
        xLabel: "RNA上の位置（ナノポア内の塩基）", yLabel: "正規化電流",
        yFmt: (v) => v.toFixed(2),
      });
      const ctrl = base.map((b, i) => [i, b]);
      const shift = 0.26 * state.stoich;
      const sample = base.map((b, i) => {
        const near = Math.exp(-((i - SITE) ** 2) / (2 * 1.1 * 1.1));
        return [i, b - shift * near];
      });
      CK.line(ctx, ctrl, { stroke: BLUE, "stroke-width": 2.2 });
      CK.line(ctx, sample, { stroke: RED, "stroke-width": 2.2 });
      ctrl.forEach((p, i) => {
        CK.dot(ctx, p[0], p[1], { r: 3, fill: BLUE, opacity: 0.8 });
        CK.dot(ctx, sample[i][0], sample[i][1], { r: 3, fill: RED, opacity: 0.8 });
        CK.textPx(ctx, ctx.x(i), ctx.margin.top + ctx.h + 15, BASES[i], { "font-size": 9, "text-anchor": "middle", fill: i === SITE ? RED : "#a6adbd", "font-weight": i === SITE ? 700 : 400 });
      });
      CK.vline(ctx, SITE, { stroke: RED, "stroke-width": 1.2 });
      CK.textPx(ctx, ctx.x(SITE), ctx.margin.top - 4, "m6A 候補部位", { "font-size": 10.5, "text-anchor": "middle", fill: RED, "font-weight": 700 });

      // 二項サンプリングによる修飾率推定
      const r2 = CK.makeRng(Math.round(state.stoich * 1000) * 977 + state.cov);
      let k = 0;
      for (let i = 0; i < state.cov; i++) if (r2() < state.stoich) k++;
      const p = k / state.cov;
      const half = 1.96 * Math.sqrt(Math.max(p * (1 - p), 0.004) / state.cov);
      const lo = clamp(p - half, 0, 1), hi = clamp(p + half, 0, 1);
      setReadout("dr_est", (p * 100).toFixed(1) + "%");
      setReadout("dr_ci", (lo * 100).toFixed(1) + " − " + (hi * 100).toFixed(1) + "%");
      setReadout("dr_w", ((hi - lo) * 100).toFixed(1) + " ポイント");
    }
    bindSlider("dr_s", (v) => (v * 100).toFixed(0) + "%", (v) => { state.stoich = v; draw(); });
    bindSlider("dr_c", (v) => v + " 本", (v) => { state.cov = v; draw(); });
    draw();
  };

  // ------------------------------------------------------------- 36. eCLIP
  W.eclip = function (container) {
    const L = 120, SITE = 74;          // 真の結合部位
    const rng = CK.makeRng(36036);
    const noiseIP = Array.from({ length: L }, () => rng());
    const noiseIN = Array.from({ length: L }, () => rng());
    // 発現量の高い領域（偽ピークの源）
    const abundance = (i) => 1 + 3.2 * Math.exp(-((i - 30) ** 2) / (2 * 12 * 12));
    const state = { xl: 0.6, mode: "raw" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ec_m", "表示", [{ v: "raw", label: "生のリード数（IPと入力）" }, { v: "fe", label: "入力に対する濃縮（fold）" }], state.mode)}
        ${sliderRow("ec_x", "紫外線架橋の効率", 0, 1, 0.05, state.xl, (v) => (v * 100).toFixed(0) + "%")}
      </div>
      <div class="widget-stage"><div id="ec_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${RED}"></span>IP（免疫沈降）</span><span class="li"><span class="sw" style="background:${GRAY}"></span>サイズマッチ入力（SMInput）</span></div></div>
      ${readoutRow([
        { id: "ec_peak", label: "最大シグナルの位置", value: "—" },
        { id: "ec_true", label: "真の結合部位", value: "位置 " + SITE },
        { id: "ec_fe", label: "結合部位の濃縮", value: "—" },
      ])}
      <p class="widget-note">リードの<b>5'末端</b>は架橋点（＝結合部位）の直前に積み上がります。「生のリード数」表示では<b>発現量の高い領域が偽のピークに見える</b>ことに注目。入力で割って初めて本物の結合部位が立ち上がります。</p>`;
    function draw() {
      const ip = [], inp = [], fe = [];
      for (let i = 0; i < L; i++) {
        const ab = abundance(i);
        const bind = 26 * state.xl * Math.exp(-((i - SITE) ** 2) / (2 * 2.2 * 2.2));
        const iv = ab * (2.2 + noiseIP[i] * 1.4) + bind;
        const nv = ab * (2.2 + noiseIN[i] * 1.4);
        ip.push([i, iv]); inp.push([i, nv]); fe.push([i, iv / Math.max(nv, 0.6)]);
      }
      const useFE = state.mode === "fe";
      const series = useFE ? fe : ip;
      const yMax = Math.max(6, ...series.map((p) => p[1])) * 1.12;
      const ctx = CK.plot(document.getElementById("ec_plot"), {
        width: 560, height: 310, margin: { top: 16, right: 20, bottom: 50, left: 58 },
        xDomain: [0, L - 1], yDomain: [0, yMax], xTicks: 6, yTicks: 5,
        xLabel: "転写産物上の位置（3'UTR 模式）",
        yLabel: useFE ? "IP / 入力（濃縮率）" : "リード5'末端の数",
        yFmt: (v) => v.toFixed(0),
      });
      if (!useFE) {
        CK.area(ctx, inp, inp.map((p) => [p[0], 0]), { fill: GRAY, opacity: 0.45 });
        CK.line(ctx, inp, { stroke: "#9aa2b6", "stroke-width": 1.6 });
        CK.line(ctx, ip, { stroke: RED, "stroke-width": 2.2 });
      } else {
        CK.hline(ctx, 1, { stroke: "#9aa2b6" });
        CK.line(ctx, fe, { stroke: RED, "stroke-width": 2.2 });
      }
      CK.vline(ctx, SITE, { stroke: GREEN, "stroke-width": 1.4 });
      CK.textPx(ctx, ctx.x(SITE) - 4, ctx.margin.top + 12, "真の結合部位", { "font-size": 10.5, "text-anchor": "end", fill: GREEN, "font-weight": 700 });
      // 発現の高い領域の注記
      CK.textPx(ctx, ctx.x(30), ctx.margin.top + ctx.h - 6, "発現量の高い領域", { "font-size": 10, "text-anchor": "middle", fill: "#8a93a8" });
      let bi = 0;
      series.forEach((p, i) => { if (p[1] > series[bi][1]) bi = i; });
      setReadout("ec_peak", "位置 " + bi + (Math.abs(bi - SITE) <= 3 ? "（正しい）" : "（誤り）"));
      setReadout("ec_fe", fe[SITE][1].toFixed(1) + " 倍");
    }
    bindSeg("ec_m", (v) => { state.mode = v; draw(); });
    bindSlider("ec_x", (v) => (v * 100).toFixed(0) + "%", (v) => { state.xl = v; draw(); });
    draw();
  };

  // -------------------------------------------------------- 37. SHAPE-MaP
  W.shapemap = function (container) {
    // 模式的な二次構造：S=ステム（対合）, L=ループ（非対合）
    const STR = {
      hairpin: "SSSSSSSSSSLLLLLLSSSSSSSSSSLLLLSSSSSSLLLLLLLLSSSSSS".split(""),
      multi: "SSSSSSLLLLSSSSSSLLLLLLSSSSSSLLLLSSSSSSLLLLLLSSSSSS".split(""),
    };
    const rng = CK.makeRng(37037);
    const noiseArr = Array.from({ length: 50 }, () => CK.randNormal(0, 1, rng));
    const state = { s: "hairpin", noise: 0.12, rbp: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("sh_s", "RNAの二次構造", [{ v: "hairpin", label: "長いヘアピン型" }, { v: "multi", label: "複数ステム型" }], state.s)}
        ${sliderRow("sh_n", "測定ノイズ", 0.02, 0.4, 0.02, state.noise, (v) => v.toFixed(2))}
        ${sliderRow("sh_r", "細胞内でのタンパク質結合（in-cell）", 0, 1, 0.05, state.rbp, (v) => (v * 100).toFixed(0) + "%")}
      </div>
      <div class="widget-stage"><div id="sh_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${RED}"></span>高反応（非対合）</span><span class="li"><span class="sw" style="background:${AMBER}"></span>中間</span><span class="li"><span class="sw" style="background:${GRAY}"></span>低反応（対合と解釈されがち）</span></div></div>
      ${readoutRow([
        { id: "sh_hi", label: "高反応と判定", value: "—" },
        { id: "sh_acc", label: "真の構造との一致率", value: "—" },
        { id: "sh_fp", label: "タンパク質結合による誤判定", value: "—" },
      ])}
      <p class="widget-note">反応性が高い＝ループ、低い＝ステム、が基本の読みです。ただし<b>タンパク質結合のスライダーを上げると、実際にはループなのに低反応</b>になる領域が現れます。in-cellデータの低反応は多義的です。</p>`;
    function draw() {
      const st = STR[state.s], n = st.length;
      const rbpZone = [30, 39]; // タンパク質が覆う区間
      const vals = st.map((c, i) => {
        let v = c === "L" ? 0.95 : 0.16;
        const covered = i >= rbpZone[0] && i <= rbpZone[1];
        if (covered) v *= (1 - 0.92 * state.rbp);
        v += noiseArr[i] * state.noise;
        return Math.max(0, v);
      });
      const ctx = CK.plot(document.getElementById("sh_plot"), {
        width: 560, height: 320, margin: { top: 30, right: 20, bottom: 52, left: 58 },
        xDomain: [-1, n], yDomain: [0, 1.5], xTicks: 5, yTicks: 5,
        xLabel: "塩基の位置（nt）", yLabel: "規格化 SHAPE 反応性",
        xFmt: (v) => Math.round(v), yFmt: (v) => v.toFixed(1),
      });
      CK.hline(ctx, 0.4, { stroke: "#c7cce0" });
      CK.hline(ctx, 0.85, { stroke: "#c7cce0" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(0.4) - 3, "0.4", { "font-size": 9.5, fill: "#8a93a8" });
      CK.textPx(ctx, ctx.margin.left + 4, ctx.y(0.85) - 3, "0.85", { "font-size": 9.5, fill: "#8a93a8" });
      let hi = 0, agree = 0, fp = 0;
      vals.forEach((v, i) => {
        const col = v >= 0.85 ? RED : v >= 0.4 ? AMBER : GRAY;
        if (v >= 0.85) hi++;
        const called = v >= 0.62 ? "L" : "S";
        if (called === st[i]) agree++;
        if (st[i] === "L" && called === "S" && i >= rbpZone[0] && i <= rbpZone[1]) fp++;
        CK.rectData(ctx, i - 0.42, 0, i + 0.42, Math.min(v, 1.5), { fill: col, opacity: 0.92 });
      });
      // 真の二次構造トラック
      const yTop = ctx.margin.top - 20;
      st.forEach((c, i) => {
        CK.textPx(ctx, 0, 0, "", {});
        const x = ctx.x(i - 0.42), w = ctx.x(i + 0.42) - ctx.x(i - 0.42);
        const r = CK.el("rect", { x, y: yTop, width: Math.max(w, 1), height: 9, fill: c === "S" ? "#5b7cf0" : "#f0b429", opacity: 0.85 });
        ctx.svg.appendChild(r);
      });
      CK.textPx(ctx, ctx.margin.left - 6, yTop + 8, "真の構造", { "font-size": 9.5, "text-anchor": "end", fill: INK, "font-weight": 700 });
      if (state.rbp > 0.05) {
        const x = ctx.x(rbpZone[0] - 0.5), w = ctx.x(rbpZone[1] + 0.5) - x;
        ctx.svg.appendChild(CK.el("rect", { x, y: ctx.margin.top, width: w, height: ctx.h, fill: PURPLE, opacity: 0.08 }));
        CK.textPx(ctx, x + w / 2, ctx.margin.top + 12, "タンパク質が結合", { "font-size": 10, "text-anchor": "middle", fill: PURPLE, "font-weight": 700 });
      }
      setReadout("sh_hi", hi + " 塩基");
      setReadout("sh_acc", ((agree / n) * 100).toFixed(0) + "%");
      setReadout("sh_fp", fp + " 塩基");
    }
    bindSeg("sh_s", (v) => { state.s = v; draw(); });
    bindSlider("sh_n", (v) => v.toFixed(2), (v) => { state.noise = v; draw(); });
    bindSlider("sh_r", (v) => (v * 100).toFixed(0) + "%", (v) => { state.rbp = v; draw(); });
    draw();
  };

  // ------------------------------------------------------ 38. PRO-seq / NET-seq
  W.proseq = function (container) {
    const rng = CK.makeRng(38038);
    const jit = Array.from({ length: 240 }, () => rng());
    const state = { pause: 6, init: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ps_p", "ポーズの強さ（プロモーター近傍での待機）", 0, 20, 0.5, state.pause, (v) => "×" + v.toFixed(1))}
        ${sliderRow("ps_i", "転写開始の頻度", 0.2, 3, 0.1, state.init, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="ps_plot"></div></div>
      ${readoutRow([
        { id: "ps_pi", label: "ポーズ指数", value: "—" },
        { id: "ps_body", label: "遺伝子本体シグナル", value: "—" },
        { id: "ps_rna", label: "定常状態のmRNA量（推定）", value: "—" },
      ])}
      <p class="widget-note">縦軸は<b>そこにいるポリメラーゼの数</b>で、速度ではありません。ポーズを強めるとTSS直後の山だけが伸び、遺伝子本体とmRNA量は変わりません。<b>RNA-seqでは区別できない2つの制御</b>がここで分かれます。</p>`;
    function draw() {
      // 位置：-2 kb 〜 +20 kb（TSS = 0）
      const pts = [], anti = [];
      const bodyLevel = 1.6 * state.init;
      for (let i = 0; i < 240; i++) {
        const x = -2 + (i / 239) * 22;
        let v = 0.08 + jit[i] * 0.12;
        if (x > 0.02) {
          v += bodyLevel * (1 - Math.exp(-x / 0.4)) * (x < 18.5 ? 1 : Math.exp(-(x - 18.5) / 0.9));
          v += state.pause * state.init * Math.exp(-((x - 0.05) ** 2) / (2 * 0.055 * 0.055));
        }
        if (x > 17.5 && x < 19.6) v += 0.9 * state.init * Math.exp(-((x - 18.6) ** 2) / (2 * 0.5 * 0.5));
        pts.push([x, v * (0.92 + jit[i] * 0.16)]);
        if (x < 0) anti.push([x, (0.05 + 0.9 * state.init * Math.exp(-((x + 0.25) ** 2) / (2 * 0.16 * 0.16))) * (0.9 + jit[i] * 0.2)]);
      }
      const yMax = Math.max(4, ...pts.map((p) => p[1])) * 1.12;
      const ctx = CK.plot(document.getElementById("ps_plot"), {
        width: 560, height: 320, margin: { top: 18, right: 20, bottom: 52, left: 60 },
        xDomain: [-2, 20], yDomain: [-yMax * 0.32, yMax], xTicks: 6, yTicks: 5,
        xLabel: "TSS からの距離（kb）", yLabel: "新生鎖3'末端の数（ポリメラーゼ密度）",
        xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(0),
      });
      CK.hline(ctx, 0, { stroke: "#9aa2b6", "stroke-dasharray": "" });
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: RED, opacity: 0.22 });
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 1.8 });
      CK.area(ctx, anti.map((p) => [p[0], -p[1] * 0.6]), anti.map((p) => [p[0], 0]), { fill: BLUE, opacity: 0.2 });
      CK.line(ctx, anti.map((p) => [p[0], -p[1] * 0.6]), { stroke: BLUE, "stroke-width": 1.4 });
      CK.vline(ctx, 0, { stroke: GREEN, "stroke-width": 1.4 });
      CK.textPx(ctx, ctx.x(0) + 5, ctx.margin.top + 12, "TSS", { "font-size": 10.5, fill: GREEN, "font-weight": 700 });
      CK.textPx(ctx, ctx.x(9), ctx.y(bodyLevel) - 8, "遺伝子本体", { "font-size": 10.5, "text-anchor": "middle", fill: INK, "font-weight": 700 });
      CK.textPx(ctx, ctx.x(-1.1), ctx.y(-yMax * 0.2), "上流アンチセンス", { "font-size": 10, "text-anchor": "middle", fill: BLUE });
      const peak = Math.max(...pts.filter((p) => p[0] > -0.2 && p[0] < 0.35).map((p) => p[1]));
      const body = pts.filter((p) => p[0] > 3 && p[0] < 15).reduce((s, p) => s + p[1], 0) / pts.filter((p) => p[0] > 3 && p[0] < 15).length;
      setReadout("ps_pi", (peak / Math.max(body, 0.05)).toFixed(1));
      setReadout("ps_body", body.toFixed(2));
      setReadout("ps_rna", "×" + state.init.toFixed(1) + "（開始頻度に比例）");
    }
    bindSlider("ps_p", (v) => "×" + v.toFixed(1), (v) => { state.pause = v; draw(); });
    bindSlider("ps_i", (v) => "×" + v.toFixed(1), (v) => { state.init = v; draw(); });
    draw();
  };

  // ------------------------------------------------------------- 39. Micro-C
  W.microc = function (container) {
    const BP = 96;                                    // 最小分解能でのビン数
    const tads = [[0, 22], [22, 46], [46, 70], [70, 96]];
    const loops = [[6, 20], [26, 43], [50, 66], [74, 92], [30, 38]];
    const state = { bin: 1, depth: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("mc_b", "ビンサイズ（1ピクセルの大きさ）", 1, 8, 1, state.bin, (v) => (v * 200) + " bp 相当")}
        ${sliderRow("mc_d", "シークエンス深度", 0.05, 2, 0.05, state.depth, (v) => "×" + v.toFixed(2))}
      </div>
      <div class="widget-stage"><div id="mc_plot"></div></div>
      ${readoutRow([
        { id: "mc_res", label: "実効分解能", value: "—" },
        { id: "mc_loop", label: "検出できたループ", value: "—" },
        { id: "mc_ct", label: "総コンタクト数", value: "—" },
      ])}
      <p class="widget-note">対角付近の三角ブロックが<b>TAD</b>、対角から離れた点が<b>ループ</b>です。ビンを粗くするとループは対角へ溶け、深度を下げるとノイズが構造に見えます。<b>同じ真の構造でも図の見た目は条件で変わります。</b></p>`;
    function draw() {
      const b = state.bin, N = Math.floor(BP / b);
      const rng = CK.makeRng(3939);
      const tadOf = (i) => { const g = i * b; for (let t = 0; t < tads.length; t++) if (g >= tads[t][0] && g < tads[t][1]) return t; return -1; };
      const M = [];
      let maxv = 0, total = 0, detected = 0;
      for (let i = 0; i < N; i++) {
        M[i] = [];
        for (let j = 0; j < N; j++) {
          const d = Math.abs(i - j) * b;
          let v = Math.exp(-d / 12);
          if (tadOf(i) === tadOf(j) && tadOf(i) >= 0) v += 0.42 * Math.exp(-d / 22);
          loops.forEach((lp) => {
            const w = Math.max(1.4, b * 0.9);
            const near = (Math.abs(i * b - lp[0]) < w && Math.abs(j * b - lp[1]) < w) || (Math.abs(i * b - lp[1]) < w && Math.abs(j * b - lp[0]) < w);
            if (near) v += 0.75 / Math.max(1, b * 0.75);
          });
          const counts = v * 900 * state.depth * b * b;
          total += counts;
          const obs = counts + CK.randNormal(0, Math.sqrt(Math.max(counts, 1)) * 1.6, rng);
          M[i][j] = Math.max(0, obs);
          if (M[i][j] > maxv) maxv = M[i][j];
        }
      }
      // ループが「見えるか」の判定：ループ画素が周辺中央値の1.6倍以上か
      loops.forEach((lp) => {
        const i = Math.floor(lp[0] / b), j = Math.floor(lp[1] / b);
        if (i >= N || j >= N || i === j) return;
        const ring = [];
        for (let di = -3; di <= 3; di++) for (let dj = -3; dj <= 3; dj++) {
          if (Math.abs(di) < 2 && Math.abs(dj) < 2) continue;
          const a = i + di, c = j + dj;
          if (a >= 0 && a < N && c >= 0 && c < N) ring.push(M[a][c]);
        }
        ring.sort((x, y) => x - y);
        const med = ring[Math.floor(ring.length / 2)] || 1;
        if (M[i][j] > med * 1.6) detected++;
      });

      const SZ = 340, mL = 34, top = 12, cell = (SZ - mL - 16) / N;
      const s = stage(document.getElementById("mc_plot"), SZ + 70, SZ + 22);
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const t = clamp(Math.pow(M[i][j] / maxv, 0.55), 0, 1);
        add(s, "rect", { x: mL + j * cell, y: top + i * cell, width: cell + 0.5, height: cell + 0.5, fill: mix("#ffffff", "#b91c1c", t) });
      }
      add(s, "rect", { x: mL, y: top, width: N * cell, height: N * cell, fill: "none", stroke: "#c7cce0", "stroke-width": 1 });
      add(s, "text", { x: mL + N * cell / 2, y: SZ + 16, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", text: "ゲノム上の位置 →（縦横とも同じ座標）" });
      add(s, "text", { x: 12, y: top + N * cell / 2, "text-anchor": "middle", "font-size": 10.5, fill: "#616a7d", transform: `rotate(-90 12 ${top + N * cell / 2})`, text: "ゲノム上の位置" });
      for (let k = 0; k <= 20; k++) {
        const t = k / 20;
        add(s, "rect", { x: SZ + 22, y: top + (1 - t) * N * cell, width: 12, height: N * cell / 20 + 0.5, fill: mix("#ffffff", "#b91c1c", t) });
      }
      add(s, "text", { x: SZ + 38, y: top + 8, "font-size": 9.5, fill: "#8a93a8", text: "高" });
      add(s, "text", { x: SZ + 38, y: top + N * cell, "font-size": 9.5, fill: "#8a93a8", text: "低" });
      setReadout("mc_res", (b * 200) + " bp / ビン");
      setReadout("mc_loop", detected + " / " + loops.length);
      setReadout("mc_ct", (total / 1e6).toFixed(1) + " 百万");
    }
    bindSlider("mc_b", (v) => (v * 200) + " bp 相当", (v) => { state.bin = v; draw(); });
    bindSlider("mc_d", (v) => "×" + v.toFixed(2), (v) => { state.depth = v; draw(); });
    draw();
  };

  // ------------------------------------------------------------ 40. Repli-seq
  W.repliseq = function (container) {
    const L = 200; // ゲノム上のビン
    const rng = CK.makeRng(40040);
    const nz = Array.from({ length: L }, () => CK.randNormal(0, 1, rng));
    // 真の複製タイミング（0＝最も早い, 1＝最も遅い）
    const domains = [[0, 34, 0.15], [34, 58, 0.85], [58, 96, 0.22], [96, 126, 0.9], [126, 158, 0.35], [158, 200, 0.8]];
    function trueTiming(i) {
      let v = 0.5;
      domains.forEach((d) => { if (i >= d[0] && i < d[1]) v = d[2]; });
      // 遷移領域をなめらかにする
      let sm = 0, wsum = 0;
      for (let k = -6; k <= 6; k++) {
        const j = clamp(i + k, 0, L - 1);
        let vv = 0.5;
        domains.forEach((d) => { if (j >= d[0] && j < d[1]) vv = d[2]; });
        const w = Math.exp(-(k * k) / 18);
        sm += vv * w; wsum += w;
      }
      return 0.35 * v + 0.65 * (sm / wsum);
    }
    const truth = Array.from({ length: L }, (_, i) => trueTiming(i));
    const state = { frac: 2, contrast: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("rp_f", "S期の分画数", 2, 16, 2, state.frac, (v) => v + " 分画")}
        ${sliderRow("rp_c", "ドメインのコントラスト（細胞集団の同調性）", 0.2, 1.6, 0.1, state.contrast, (v) => "×" + v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="rp_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:${GREEN}"></span>早期複製ドメイン</span><span class="li"><span class="sw" style="background:${PURPLE}"></span>後期複製ドメイン</span></div></div>
      ${readoutRow([
        { id: "rp_early", label: "早期複製と判定された割合", value: "—" },
        { id: "rp_ttr", label: "遷移領域（TTR）の幅", value: "—" },
        { id: "rp_snr", label: "分画あたりの分解能", value: "—" },
      ])}
      <p class="widget-note">縦軸は log2(early/late)。ゼロより上が早期、下が後期複製ドメインです。<b>分画数が少ないとドメイン境界（TTR）がぼやけ</b>、コントラストが下がると全体が平坦になります。E/Lは相対値である点にも注意。</p>`;
    function draw() {
      // 分画が粗いほど平滑化される
      const smoothW = Math.max(1, Math.round(20 / state.frac));
      const raw = truth.map((t, i) => {
        const el = (0.5 - t) * 3.4 * state.contrast;
        return el + nz[i] * (0.16 + 0.5 / state.frac);
      });
      const prof = raw.map((_, i) => {
        let s = 0, n = 0;
        for (let k = -smoothW; k <= smoothW; k++) { const j = i + k; if (j >= 0 && j < L) { s += raw[j]; n++; } }
        return [i, s / n];
      });
      const ctx = CK.plot(document.getElementById("rp_plot"), {
        width: 560, height: 320, margin: { top: 18, right: 20, bottom: 52, left: 60 },
        xDomain: [0, L - 1], yDomain: [-3, 3], xTicks: 5, yTicks: 6,
        xLabel: "ゲノム上の位置（1ビン = 50 kb 相当）", yLabel: "log2（early / late）",
        xFmt: (v) => Math.round(v / 20) * 1 + " Mb", yFmt: (v) => v.toFixed(0),
      });
      // 真のドメインの帯
      domains.forEach((d) => {
        const x = ctx.x(d[0]), w = ctx.x(d[1] - 1) - x;
        ctx.svg.appendChild(CK.el("rect", { x, y: ctx.margin.top, width: Math.max(w, 1), height: ctx.h, fill: d[2] < 0.5 ? GREEN : PURPLE, opacity: 0.07 }));
      });
      CK.hline(ctx, 0, { stroke: "#9aa2b6", "stroke-dasharray": "" });
      const pos = prof.map((p) => [p[0], Math.max(p[1], 0)]);
      const neg = prof.map((p) => [p[0], Math.min(p[1], 0)]);
      CK.area(ctx, pos, pos.map((p) => [p[0], 0]), { fill: GREEN, opacity: 0.3 });
      CK.area(ctx, neg, neg.map((p) => [p[0], 0]), { fill: PURPLE, opacity: 0.3 });
      CK.line(ctx, prof, { stroke: "#334155", "stroke-width": 1.8 });
      CK.textPx(ctx, ctx.margin.left + 6, ctx.y(2.5), "早期複製", { "font-size": 10.5, fill: GREEN, "font-weight": 700 });
      CK.textPx(ctx, ctx.margin.left + 6, ctx.y(-2.4), "後期複製", { "font-size": 10.5, fill: PURPLE, "font-weight": 700 });
      const early = prof.filter((p) => p[1] > 0).length;
      setReadout("rp_early", ((early / L) * 100).toFixed(0) + "%");
      setReadout("rp_ttr", (smoothW * 2 + 1) * 50 + " kb 相当");
      setReadout("rp_snr", state.frac >= 6 ? "境界まで判別できる" : state.frac >= 4 ? "ドメインは見えるが境界は粗い" : "早期／後期の二分のみ");
    }
    bindSlider("rp_f", (v) => v + " 分画", (v) => { state.frac = v; draw(); });
    bindSlider("rp_c", (v) => "×" + v.toFixed(1), (v) => { state.contrast = v; draw(); });
    draw();
  };
})();

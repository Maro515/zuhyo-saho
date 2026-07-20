/* 第12章 発展編 パート1（t1-t10）のインタラクティブ図
   塩基編集・プライム編集・エピゲノム編集・Perturb-seq・Cas13・ブリッジRNA・
   系統バーコード・飽和ゲノム編集・CITE-seq・scATAC-seq */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const MAG = "#d946ef";
  const BLUE = "#3a7bd5";
  const ORANGE = "#f97316";
  const GREEN = "#1f9d6b";
  const GRAY = "#9aa6b4";

  // ---- local helpers（各widgetsファイルはスコープが独立しているので自前で用意）--
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f6f8fb" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function txt(s, x, y, str, attrs) {
    return add(s, "text", Object.assign({ x: x, y: y, "font-size": 10, fill: "#616a7d", text: str }, attrs || {}));
  }
  function mix(c1, c2, t) {
    const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const a = p(c1), b = p(c2);
    const r = a.map((v, i) => Math.round(lerp(v, b[i], clamp(t, 0, 1))));
    return "#" + r.map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  // ==========================================================================
  // 1. baseedit — 編集ウィンドウとバイスタンダー編集
  // ==========================================================================
  W.baseedit = function (container) {
    const SEQ = "GACCTCAGCATCACGTGACA"; // protospacer 20nt (5' -> 3')
    const PAM = "AGG";
    const state = { mode: "cbe", center: 6, win: 5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("be_m", "エディター", [{ v: "cbe", label: "CBE（C→T）" }, { v: "abe", label: "ABE（A→G）" }], "cbe")}
        ${sliderRow("be_c", "編集ウィンドウの中心（位置）", 3, 12, 1, 6, (v) => v.toFixed(0) + " 番目")}
        ${sliderRow("be_w", "編集ウィンドウの幅", 2, 9, 1, 5, (v) => v.toFixed(0) + " 塩基")}
      </div>
      <div class="widget-stage"><div id="be_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>標的塩基</span><span class="li"><span class="sw" style="background:#f97316"></span>バイスタンダー編集</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>基質にならない塩基</span></div></div>
      ${readoutRow([{ id: "be_e", label: "標的の編集効率", value: "—" }, { id: "be_b", label: "バイスタンダー編集", value: "—" }])}
      <p class="widget-note">プロトスペーサー上で脱アミノ酵素が働ける範囲が<b>編集ウィンドウ</b>です。中心を動かすと標的塩基の効率が跳ね上がり、幅を広げると<b>同じウィンドウ内の別の同種塩基まで巻き添えで変換</b>されます。</p>`;
    const targetPos = { cbe: 6, abe: 7 };
    function draw() {
      const w = 540, h = 268, s = lightPanel(document.getElementById("be_plot"), w, h);
      const sub = state.mode === "cbe" ? "C" : "A";
      const tgt = targetPos[state.mode];
      const x0 = 38, bw = 21.0, seqY = 196, base = 178;
      const sigma = Math.max(0.9, state.win / 2.6);
      const effAt = (i) => 78 * Math.exp(-0.5 * Math.pow((i - state.center) / sigma, 2));
      // window shading
      const wl = state.center - (state.win - 1) / 2, wr = state.center + (state.win - 1) / 2;
      add(s, "rect", { x: x0 + (wl - 1) * bw, y: 40, width: (wr - wl + 1) * bw, height: 178, fill: MAG, opacity: 0.09 });
      txt(s, x0 + (wl - 1) * bw + ((wr - wl + 1) * bw) / 2, 34, "編集ウィンドウ", { "text-anchor": "middle", "font-size": 10.5, fill: MAG, "font-weight": 700 });
      // axis
      add(s, "line", { x1: x0, x2: x0 + 23 * bw, y1: base, y2: base, stroke: "#c7cce0", "stroke-width": 1.2 });
      [0, 25, 50, 75].forEach((v) => {
        const y = base - (v / 100) * 128;
        add(s, "line", { x1: x0, x2: x0 + 23 * bw, y1: y, y2: y, stroke: "#e5e9f2", "stroke-width": 1 });
        txt(s, x0 - 5, y + 3, String(v), { "text-anchor": "end", "font-size": 9 });
      });
      txt(s, 13, 116, "編集効率 (%)", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: "rotate(-90 13 116)" });
      let bystander = 0, tgtEff = 0;
      for (let i = 1; i <= 23; i++) {
        const ch = i <= 20 ? SEQ[i - 1] : PAM[i - 21];
        const inProto = i <= 20;
        const isSub = inProto && ch === sub;
        const e = isSub ? effAt(i) : 0;
        if (isSub && e >= 5) { if (i === tgt) tgtEff = e; else bystander++; }
        if (i === tgt) tgtEff = e;
        const col = !inProto ? "#cfd5e2" : i === tgt ? MAG : isSub ? ORANGE : GRAY;
        if (e > 0.6) {
          const bh = (e / 100) * 128;
          add(s, "rect", { x: x0 + (i - 1) * bw + 3, y: base - bh, width: bw - 6, height: bh, rx: 2, fill: col, opacity: 0.92 });
          if (e >= 5) txt(s, x0 + (i - 1) * bw + bw / 2, base - bh - 4, e.toFixed(0), { "text-anchor": "middle", "font-size": 8.5, fill: col, "font-weight": 700 });
        }
        add(s, "rect", { x: x0 + (i - 1) * bw + 1.5, y: seqY, width: bw - 3, height: 22, rx: 3, fill: !inProto ? "#dfe4ee" : isSub ? mix("#ffffff", col, 0.22) : "#ffffff", stroke: i === tgt ? MAG : "#d7dced", "stroke-width": i === tgt ? 2 : 1 });
        txt(s, x0 + (i - 1) * bw + bw / 2, seqY + 15.5, ch, { "text-anchor": "middle", "font-size": 11.5, fill: !inProto ? "#7b8497" : isSub ? col : "#3a4256", "font-weight": isSub ? 700 : 500 });
        if (i % 5 === 0 && inProto) txt(s, x0 + (i - 1) * bw + bw / 2, seqY + 34, String(i), { "text-anchor": "middle", "font-size": 8.5, fill: "#9aa6b4" });
      }
      txt(s, x0 + 20.5 * bw + bw / 2, seqY + 34, "PAM", { "text-anchor": "middle", "font-size": 8.5, fill: "#9aa6b4" });
      txt(s, x0 + (tgt - 1) * bw + bw / 2, 254, "▲ 標的", { "text-anchor": "middle", "font-size": 9.5, fill: MAG, "font-weight": 700 });
      setReadout("be_e", tgtEff.toFixed(1) + " %");
      setReadout("be_b", bystander === 0 ? "なし" : bystander + " か所（5%以上）");
    }
    bindSeg("be_m", (v) => { state.mode = v; draw(); });
    bindSlider("be_c", (v) => v.toFixed(0) + " 番目", (v) => { state.center = v; draw(); });
    bindSlider("be_w", (v) => v.toFixed(0) + " 塩基", (v) => { state.win = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 2. primeedit — pegRNA の PBS / RTテンプレートと編集効率
  // ==========================================================================
  W.primeedit = function (container) {
    const state = { kind: "sub", pbs: 13, rt: 14, sys: "pe2" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("pe_k", "編集の種類", [{ v: "sub", label: "置換" }, { v: "ins", label: "挿入(6塩基)" }, { v: "del", label: "欠失(10塩基)" }], "sub")}
        ${segRow("pe_s", "系", [{ v: "pe2", label: "PE2" }, { v: "pe3", label: "PE3" }], "pe2")}
        ${sliderRow("pe_p", "PBS長", 6, 20, 1, 13, (v) => v.toFixed(0) + " 塩基")}
        ${sliderRow("pe_r", "RTテンプレート長", 8, 34, 1, 14, (v) => v.toFixed(0) + " 塩基")}
      </div>
      <div class="widget-stage"><div id="pe_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>PBS（プライマー結合部位）</span><span class="li"><span class="sw" style="background:#d946ef"></span>RTテンプレート（書き込む配列）</span></div></div>
      ${readoutRow([{ id: "pe_e", label: "編集効率", value: "—" }, { id: "pe_i", label: "インデル率", value: "—" }])}
      <p class="widget-note">pegRNAの<b>PBS長</b>と<b>RTテンプレート長</b>には最適値の山があります。編集の種類を変えると最適なRT長がずれ、<b>PE3に切り替えると効率と一緒にインデル率も上がる</b>ことが見えます。</p>`;
    const rtOpt = { sub: 13, ins: 20, del: 17 };
    const kindCap = { sub: 1.0, ins: 0.72, del: 0.8 };
    function eff(pbs, rt) {
      const a = Math.exp(-0.5 * Math.pow((pbs - 13) / 3.4, 2));
      const b = Math.exp(-0.5 * Math.pow((rt - rtOpt[state.kind]) / 6.5, 2));
      return 42 * a * b * kindCap[state.kind] * (state.sys === "pe3" ? 1.75 : 1);
    }
    function draw() {
      const w = 540, h = 300, s = lightPanel(document.getElementById("pe_plot"), w, h);
      // --- schematic ---
      const gx = 28, gy = 34;
      txt(s, gx, gy - 12, "ゲノムDNA（Cas9ニッカーゼが片鎖にニックを入れる）", { "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      add(s, "rect", { x: gx, y: gy, width: 480, height: 11, rx: 3, fill: "#dfe4ee" });
      add(s, "rect", { x: gx, y: gy + 20, width: 200, height: 11, rx: 3, fill: "#dfe4ee" });
      add(s, "rect", { x: gx + 214, y: gy + 20, width: 266, height: 11, rx: 3, fill: "#dfe4ee" });
      add(s, "path", { d: `M ${gx + 207} ${gy + 16} l 0 20`, stroke: "#ef5350", "stroke-width": 2 });
      txt(s, gx + 207, gy + 50, "ニック", { "text-anchor": "middle", "font-size": 9.5, fill: "#ef5350" });
      // pegRNA
      const py = gy + 76;
      txt(s, gx, py - 10, "pegRNA の 3' 側", { "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      const pbsW = state.pbs * 8.5, rtW = state.rt * 8.5;
      add(s, "rect", { x: gx + 207 - pbsW, y: py, width: pbsW, height: 16, rx: 3, fill: BLUE, opacity: 0.85 });
      add(s, "rect", { x: gx + 207, y: py, width: rtW, height: 16, rx: 3, fill: MAG, opacity: 0.85 });
      txt(s, gx + 207 - pbsW / 2, py + 12, "PBS " + state.pbs, { "text-anchor": "middle", "font-size": 9.5, fill: "#fff", "font-weight": 700 });
      txt(s, gx + 207 + rtW / 2, py + 12, "RTテンプレート " + state.rt, { "text-anchor": "middle", "font-size": 9.5, fill: "#fff", "font-weight": 700 });
      // 書き込まれる結果
      const oy = py + 40;
      const label = state.kind === "sub" ? "1塩基が置換される" : state.kind === "ins" ? "6塩基が挿入される" : "10塩基が欠失する";
      add(s, "rect", { x: gx, y: oy, width: 480, height: 12, rx: 3, fill: "#dfe4ee" });
      const mw = state.kind === "ins" ? 44 : state.kind === "del" ? 0 : 10;
      if (state.kind === "del") add(s, "rect", { x: gx + 207, y: oy, width: 70, height: 12, rx: 3, fill: "#ffffff", stroke: "#c7cce0", "stroke-dasharray": "3 3" });
      else if (mw > 0) add(s, "rect", { x: gx + 207, y: oy - 2, width: mw, height: 16, rx: 3, fill: MAG });
      txt(s, gx + 290, oy + 11, label, { "font-size": 10, fill: MAG, "font-weight": 700 });
      // --- efficiency curve vs PBS ---
      const cx = 60, cy = 200, cw = 420, chh = 74;
      add(s, "line", { x1: cx, x2: cx + cw, y1: cy + chh, y2: cy + chh, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: cx, x2: cx, y1: cy, y2: cy + chh, stroke: "#c7cce0", "stroke-width": 1.2 });
      txt(s, cx + cw / 2, cy + chh + 26, "PBS長（塩基）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      txt(s, 20, cy + chh / 2, "編集効率 (%)", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 20 ${cy + chh / 2})` });
      const yMax = 80;
      const px = (p) => cx + ((p - 6) / 14) * cw;
      const py2 = (e) => cy + chh - (clamp(e, 0, yMax) / yMax) * chh;
      let d = "";
      for (let p = 6; p <= 20; p += 0.5) d += (d ? " L " : "M ") + px(p).toFixed(1) + " " + py2(eff(p, state.rt)).toFixed(1);
      add(s, "path", { d: d, fill: "none", stroke: MAG, "stroke-width": 2.6 });
      [6, 10, 13, 16, 20].forEach((p) => txt(s, px(p), cy + chh + 13, String(p), { "text-anchor": "middle", "font-size": 9 }));
      [0, 40, 80].forEach((v) => txt(s, cx - 6, py2(v) + 3, String(v), { "text-anchor": "end", "font-size": 9 }));
      const e0 = eff(state.pbs, state.rt);
      add(s, "line", { x1: px(state.pbs), x2: px(state.pbs), y1: cy, y2: cy + chh, stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      add(s, "circle", { cx: px(state.pbs), cy: py2(e0), r: 5, fill: MAG });
      const indel = state.sys === "pe3" ? 3.2 + e0 * 0.18 : 0.6 + e0 * 0.03;
      setReadout("pe_e", e0.toFixed(1) + " %");
      setReadout("pe_i", indel.toFixed(1) + " %");
    }
    bindSeg("pe_k", (v) => { state.kind = v; draw(); });
    bindSeg("pe_s", (v) => { state.sys = v; draw(); });
    bindSlider("pe_p", (v) => v.toFixed(0) + " 塩基", (v) => { state.pbs = v; draw(); });
    bindSlider("pe_r", (v) => v.toFixed(0) + " 塩基", (v) => { state.rt = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 3. epiedit — CRISPRi / CRISPRa / CRISPRoff の位置依存性と可逆性
  // ==========================================================================
  W.epiedit = function (container) {
    const state = { mode: "i", pos: 120, day: 20 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("ep_m", "モード", [{ v: "i", label: "CRISPRi" }, { v: "a", label: "CRISPRa" }, { v: "off", label: "CRISPRoff" }], "i")}
        ${sliderRow("ep_p", "sgRNAのTSSからの距離", -600, 600, 20, 120, (v) => (v > 0 ? "+" : "") + v + " 塩基")}
        ${sliderRow("ep_d", "経過日数", 0, 30, 1, 20, (v) => v.toFixed(0) + " 日")}
      </div>
      <div class="widget-stage"><div id="ep_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>発現量の時間経過</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>10日目にエフェクター除去</span></div></div>
      ${readoutRow([{ id: "ep_e", label: "到達した発現量", value: "—" }, { id: "ep_r", label: "現時点の発現量", value: "—" }])}
      <p class="widget-note">効き目は<b>sgRNAのTSSからの距離</b>でほぼ決まります（CRISPRiは下流側、CRISPRaは上流側が有利）。10日目でエフェクターを除去すると、<b>CRISPRi/aは発現が戻るのにCRISPRoffは戻りません</b>。</p>`;
    function strength(pos) {
      if (state.mode === "a") return Math.exp(-0.5 * Math.pow((pos + 180) / 250, 2));
      if (state.mode === "off") return Math.exp(-0.5 * Math.pow((pos - 50) / 200, 2));
      return Math.exp(-0.5 * Math.pow((pos - 120) / 220, 2));
    }
    function targetLevel(f) {
      if (state.mode === "a") return 100 * (1 + 5.0 * f);
      if (state.mode === "off") return 100 * (1 - 0.95 * f);
      return 100 * (1 - 0.9 * f);
    }
    function levelAt(day, f) {
      const tgt = targetLevel(f);
      if (day <= 10) return 100 + (tgt - 100) * (1 - Math.exp(-day / 2.4));
      const at10 = 100 + (tgt - 100) * (1 - Math.exp(-10 / 2.4));
      if (state.mode === "off") return at10;
      return 100 + (at10 - 100) * Math.exp(-(day - 10) / 4.2);
    }
    function draw() {
      const f = strength(state.pos);
      const yMax = state.mode === "a" ? 640 : 120;
      const host = document.getElementById("ep_plot");
      const ctx = CK.plot(host, {
        width: 520, height: 268, margin: { top: 18, right: 22, bottom: 46, left: 62 },
        xDomain: [0, 30], yDomain: [0, yMax], xTicks: 6, yTicks: 4,
        xLabel: "日数", yLabel: "発現量（対照＝100）", xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(0),
      });
      CK.hline(ctx, 100, { stroke: GRAY, "stroke-dasharray": "5 4" });
      CK.vline(ctx, 10, { stroke: GRAY, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
      CK.textPx(ctx, ctx.x(10) + 5, ctx.margin.top + 14, "エフェクター除去", { "font-size": ctx.fs(10.5), fill: "#7b8497" });
      const pts = [];
      for (let d = 0; d <= 30; d += 0.5) pts.push([d, clamp(levelAt(d, f), 0, yMax)]);
      CK.line(ctx, pts, { stroke: MAG, "stroke-width": 2.8 });
      const cur = clamp(levelAt(state.day, f), 0, yMax);
      CK.dot(ctx, state.day, cur, { r: 5.5, fill: MAG, opacity: 1 });
      CK.textPx(ctx, ctx.margin.left + 8, ctx.margin.top + 14, "効き目 " + (f * 100).toFixed(0) + " %", { "font-size": ctx.fs(11), fill: "#565f73", "font-weight": 700 });
      setReadout("ep_e", targetLevel(f).toFixed(0) + " %");
      setReadout("ep_r", levelAt(state.day, f).toFixed(0) + " %（" + state.day + "日目）");
    }
    bindSeg("ep_m", (v) => { state.mode = v; draw(); });
    bindSlider("ep_p", (v) => (v > 0 ? "+" : "") + v + " 塩基", (v) => { state.pos = v; draw(); });
    bindSlider("ep_d", (v) => v.toFixed(0) + " 日", (v) => { state.day = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 4. perturbseq — UMAP 上で摂動集団が対照からずれる
  // ==========================================================================
  W.perturbseq = function (container) {
    const state = { eff: 0.5, n: 80 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ps_e", "摂動の強さ（表現型の大きさ）", 0, 1, 0.05, 0.5, (v) => (v * 100).toFixed(0) + " %")}
        ${sliderRow("ps_n", "1摂動あたりの細胞数", 10, 300, 10, 80, (v) => v.toFixed(0) + " 細胞")}
      </div>
      <div class="widget-stage"><div id="ps_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#9aa6b4"></span>対照sgRNA</span><span class="li"><span class="sw" style="background:#d946ef"></span>摂動A</span><span class="li"><span class="sw" style="background:#3a7bd5"></span>摂動B</span><span class="li"><span class="sw" style="background:#1f9d6b"></span>摂動C（弱い）</span></div></div>
      ${readoutRow([{ id: "ps_d", label: "検出できた摂動", value: "—" }, { id: "ps_z", label: "摂動Cの検出力(z)", value: "—" }])}
      <p class="widget-note">UMAP上で摂動細胞が対照からどれだけずれるかを見ます。<b>効果が弱い、または細胞数が少ないと、実在する効果でも対照に埋もれて見えなくなります</b>。「重なっている＝効果なし」と読めない理由がここにあります。</p>`;
    const groups = [
      { name: "対照", col: GRAY, dx: 0, dy: 0, rel: 0 },
      { name: "摂動A", col: MAG, dx: 1.0, dy: 0.35, rel: 1.0 },
      { name: "摂動B", col: BLUE, dx: -0.45, dy: 1.0, rel: 0.75 },
      { name: "摂動C", col: GREEN, dx: 0.55, dy: -0.95, rel: 0.16 },
    ];
    function draw() {
      const ctx = CK.plot(document.getElementById("ps_plot"), {
        width: 520, height: 286, margin: { top: 16, right: 20, bottom: 44, left: 52 },
        xDomain: [-5, 9], yDomain: [-4.6, 5.4], xTicks: 4, yTicks: 4,
        xLabel: "UMAP 1", yLabel: "UMAP 2", xFmt: () => "", yFmt: () => "",
      });
      const spread = 1.35;
      const shiftMax = 5.2;
      let detected = 0, zC = 0;
      groups.forEach((g, gi) => {
        const rng = CK.makeRng(1000 + gi * 37);
        const sh = state.eff * g.rel * shiftMax;
        const mx = g.dx * sh, my = g.dy * sh;
        const shown = Math.min(state.n, 90);
        for (let i = 0; i < shown; i++) {
          const x = mx + CK.randNormal(0, spread, rng);
          const y = my + CK.randNormal(0, spread, rng);
          CK.dot(ctx, x, y, { r: 2.8, fill: g.col, opacity: 0.62 });
        }
        if (gi > 0) {
          const dist = Math.sqrt(mx * mx + my * my);
          const z = (dist / spread) * Math.sqrt(state.n / 2);
          if (z >= 3) detected++;
          if (g.name === "摂動C") zC = z;
          CK.textPx(ctx, ctx.x(mx), ctx.y(my) - 6, g.name + (z >= 3 ? "" : "（検出できず）"), { "text-anchor": "middle", "font-size": ctx.fs(10.5), fill: g.col, "font-weight": 700 });
        }
      });
      CK.textPx(ctx, ctx.x(0), ctx.y(0) + 22, "対照", { "text-anchor": "middle", "font-size": ctx.fs(10.5), fill: "#4a5468", "font-weight": 700 });
      setReadout("ps_d", detected + " / 3");
      setReadout("ps_z", zC.toFixed(1) + (zC >= 3 ? "（有意）" : "（不十分）"));
    }
    bindSlider("ps_e", (v) => (v * 100).toFixed(0) + " %", (v) => { state.eff = v; draw(); });
    bindSlider("ps_n", (v) => v.toFixed(0) + " 細胞", (v) => { state.n = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 5. cas13 — ノックダウンの特異性とコラテラル切断／RNA編集
  // ==========================================================================
  W.cas13 = function (container) {
    const state = { mode: "kd", expr: 50, mm: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("c13_m", "モード", [{ v: "kd", label: "ノックダウン" }, { v: "ed", label: "RNA編集（dCas13-ADAR）" }], "kd")}
        ${sliderRow("c13_e", "標的RNAの発現量", 5, 100, 5, 50, (v) => v.toFixed(0) + " （相対）")}
        ${sliderRow("c13_x", "ガイドと標的のミスマッチ", 0, 5, 1, 0, (v) => v.toFixed(0) + " 塩基")}
      </div>
      <div class="widget-stage"><div id="c13_plot"></div></div>
      ${readoutRow([{ id: "c13_a", label: "標的への効果", value: "—" }, { id: "c13_b", label: "巻き添え（非標的）", value: "—" }])}
      <p class="widget-note">標的RNAの発現量を上げると、ノックダウンは深くなる一方で<b>コラテラル切断が強まり、非標的RNAや細胞生存まで低下</b>します。RNA編集モードでは標的以外のAも書き換わる<b>バイスタンダー編集</b>が現れます。</p>`;
    function draw() {
      const w = 520, h = 268, s = lightPanel(document.getElementById("c13_plot"), w, h);
      const kd = state.mode === "kd";
      const onEff = (kd ? 88 : 68) * Math.exp(-state.mm * 0.58);
      const col = state.expr / 100;
      let bars;
      if (kd) {
        const coll = 0.55 * (onEff / 88) * col;
        bars = [
          { label: "標的RNA 残存", v: 100 - onEff, col: MAG },
          { label: "非標的RNA-1 残存", v: 100 - 42 * coll, col: ORANGE },
          { label: "非標的RNA-2 残存", v: 100 - 34 * coll, col: ORANGE },
          { label: "細胞生存率", v: 100 - 46 * coll, col: GRAY },
        ];
        setReadout("c13_a", "ノックダウン " + onEff.toFixed(0) + " %");
        setReadout("c13_b", coll < 0.12 ? "ほぼ無し" : coll < 0.3 ? "軽度のコラテラル切断" : "明らかなコラテラル切断");
      } else {
        const b1 = onEff * 0.42, b2 = onEff * 0.19;
        bars = [
          { label: "標的A 編集率", v: onEff, col: MAG },
          { label: "バイスタンダーA-1", v: b1, col: ORANGE },
          { label: "バイスタンダーA-2", v: b2, col: ORANGE },
          { label: "細胞生存率", v: 100 - 18 * col * (onEff / 68), col: GRAY },
        ];
        setReadout("c13_a", "標的の編集率 " + onEff.toFixed(0) + " %");
        setReadout("c13_b", "バイスタンダー最大 " + b1.toFixed(0) + " %");
      }
      const x0 = 168, bw = 300, y0 = 42, gap = 54;
      txt(s, x0, 26, kd ? "処理後の残存量／生存率 (%)" : "編集率・生存率 (%)", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      bars.forEach((b, i) => {
        const y = y0 + i * gap;
        txt(s, x0 - 12, y + 15, b.label, { "text-anchor": "end", "font-size": 10.5, fill: "#4a5468" });
        add(s, "rect", { x: x0, y: y, width: bw, height: 20, rx: 5, fill: "#e4e8f0" });
        add(s, "rect", { x: x0, y: y, width: (clamp(b.v, 0, 100) / 100) * bw, height: 20, rx: 5, fill: b.col, opacity: 0.9 });
        txt(s, x0 + bw + 8, y + 15, b.v.toFixed(0) + " %", { "font-size": 10.5, fill: b.col, "font-weight": 700 });
      });
      add(s, "line", { x1: x0, x2: x0, y1: y0 - 6, y2: y0 + 3 * gap + 26, stroke: "#c7cce0", "stroke-width": 1.2 });
    }
    bindSeg("c13_m", (v) => { state.mode = v; draw(); });
    bindSlider("c13_e", (v) => v.toFixed(0) + " （相対）", (v) => { state.expr = v; draw(); });
    bindSlider("c13_x", (v) => v.toFixed(0) + " 塩基", (v) => { state.mm = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 6. bridgerna — 2つのループが標的と供与を同時に指定する
  // ==========================================================================
  W.bridgerna = function (container) {
    const state = { mt: 100, md: 100, out: "ins" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("br_o", "認識部位の配置", [{ v: "ins", label: "挿入" }, { v: "inv", label: "逆位" }, { v: "exc", label: "切り出し" }], "ins")}
        ${sliderRow("br_t", "標的ループの一致度", 0, 100, 5, 100, (v) => v.toFixed(0) + " %")}
        ${sliderRow("br_d", "供与ループの一致度", 0, 100, 5, 100, (v) => v.toFixed(0) + " %")}
      </div>
      <div class="widget-stage"><div id="br_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>標的ループ</span><span class="li"><span class="sw" style="background:#d946ef"></span>供与ループ</span></div></div>
      ${readoutRow([{ id: "br_e", label: "組換え効率", value: "—" }, { id: "br_s", label: "特異性", value: "—" }])}
      <p class="widget-note">1本のブリッジRNAが持つ<b>2つのループ</b>が、標的DNAと供与DNAを別々に指定します。両方が合ったときだけ右の行列の対角が光り、一致度を下げると<b>非対角（別の相手との誤った組換え）</b>が現れます。配置を変えると同じ酵素で出力が変わります。</p>`;
    function draw() {
      const w = 540, h = 300, s = lightPanel(document.getElementById("br_plot"), w, h);
      const mt = state.mt / 100, md = state.md / 100;
      const on = 92 * Math.pow(mt, 2.2) * Math.pow(md, 2.2);
      const leak = 26 * (1 - mt) * md * mt + 8 * (1 - md) * mt;
      // --- left: bridge RNA schematic ---
      txt(s, 22, 26, "ブリッジRNA（2つのループ）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "path", { d: "M 30 60 C 60 40, 100 40, 130 60 C 160 80, 200 80, 230 60", fill: "none", stroke: "#b9c1d4", "stroke-width": 3 });
      // loop 1 (target)
      add(s, "ellipse", { cx: 80, cy: 92, rx: 40, ry: 24, fill: "none", stroke: BLUE, "stroke-width": 2.6 });
      txt(s, 80, 96, "標的ループ", { "text-anchor": "middle", "font-size": 10, fill: BLUE, "font-weight": 700 });
      add(s, "ellipse", { cx: 182, cy: 92, rx: 40, ry: 24, fill: "none", stroke: MAG, "stroke-width": 2.6 });
      txt(s, 182, 96, "供与ループ", { "text-anchor": "middle", "font-size": 10, fill: MAG, "font-weight": 700 });
      // base-pair ticks: number scales with match
      const nt = Math.round(mt * 10), nd = Math.round(md * 10);
      for (let i = 0; i < 10; i++) {
        add(s, "line", { x1: 44 + i * 8, x2: 44 + i * 8, y1: 122, y2: 134, stroke: i < nt ? BLUE : "#dde2ec", "stroke-width": 3 });
        add(s, "line", { x1: 146 + i * 8, x2: 146 + i * 8, y1: 122, y2: 134, stroke: i < nd ? MAG : "#dde2ec", "stroke-width": 3 });
      }
      add(s, "rect", { x: 30, y: 138, width: 96, height: 12, rx: 3, fill: "#dfe4ee" });
      txt(s, 78, 164, "標的DNA", { "text-anchor": "middle", "font-size": 9.5 });
      add(s, "rect", { x: 138, y: 138, width: 96, height: 12, rx: 3, fill: "#dfe4ee" });
      txt(s, 186, 164, "供与DNA", { "text-anchor": "middle", "font-size": 9.5 });
      // --- outcome ---
      const oy = 200;
      txt(s, 22, oy - 10, "出力（認識部位の向きが決める）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "rect", { x: 30, y: oy, width: 210, height: 14, rx: 3, fill: "#dfe4ee" });
      const arr = (x, dir, col) => add(s, "path", { d: dir > 0 ? `M ${x} ${oy + 2} l 26 5 l -26 5 z` : `M ${x + 26} ${oy + 2} l -26 5 l 26 5 z`, fill: col });
      if (state.out === "ins") {
        add(s, "rect", { x: 118, y: oy - 3, width: 46, height: 20, rx: 3, fill: MAG, opacity: 0.9 });
        txt(s, 141, oy + 11, "供与", { "text-anchor": "middle", "font-size": 9.5, fill: "#fff", "font-weight": 700 });
        txt(s, 30, oy + 38, "供与DNAが標的座位に組み込まれる", { "font-size": 10, fill: MAG, "font-weight": 700 });
      } else if (state.out === "inv") {
        arr(80, -1, BLUE); arr(140, -1, BLUE);
        add(s, "rect", { x: 74, y: oy - 4, width: 92, height: 22, rx: 3, fill: "none", stroke: BLUE, "stroke-dasharray": "4 3" });
        txt(s, 30, oy + 38, "2部位の間の領域が反転する（逆位）", { "font-size": 10, fill: BLUE, "font-weight": 700 });
      } else {
        add(s, "rect", { x: 74, y: oy - 4, width: 92, height: 22, rx: 3, fill: "#ffffff", stroke: "#c7cce0", "stroke-dasharray": "4 3" });
        add(s, "circle", { cx: 200, cy: oy + 42, r: 15, fill: "none", stroke: GREEN, "stroke-width": 2.4 });
        txt(s, 30, oy + 46, "間の領域が環状に抜け落ちる", { "font-size": 10, fill: GREEN, "font-weight": 700 });
      }
      // --- right: specificity matrix ---
      const mx = 300, my = 52, cell = 52;
      txt(s, mx, my - 26, "特異性の行列（標的 × 供与）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      txt(s, mx - 8, my - 8, "供与→", { "text-anchor": "end", "font-size": 9.5 });
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const v = r === c ? on : leak * (r === c ? 1 : 0.85);
          const x = mx + c * cell, y = my + r * cell;
          add(s, "rect", { x: x, y: y, width: cell - 3, height: cell - 3, rx: 3, fill: mix("#eef1f6", MAG, v / 100) });
          txt(s, x + (cell - 3) / 2, y + (cell - 3) / 2 + 4, v.toFixed(0), { "text-anchor": "middle", "font-size": 10.5, fill: v > 45 ? "#fff" : "#5a6376", "font-weight": 700 });
        }
        txt(s, mx - 8, my + r * cell + 28, "標的" + (r + 1), { "text-anchor": "end", "font-size": 9.5 });
      }
      txt(s, mx, my + 3 * cell + 24, "対角＝設計どおりの組換え／非対角＝誤った組換え", { "font-size": 9.5, fill: "#7b8497" });
      setReadout("br_e", on.toFixed(0) + " %");
      const spec = on / Math.max(0.1, on + 6 * leak);
      setReadout("br_s", (spec * 100).toFixed(0) + " %" + (spec > 0.9 ? "（良好）" : spec > 0.6 ? "（要注意）" : "（不良）"));
    }
    bindSeg("br_o", (v) => { state.out = v; draw(); });
    bindSlider("br_t", (v) => v.toFixed(0) + " %", (v) => { state.mt = v; draw(); });
    bindSlider("br_d", (v) => v.toFixed(0) + " %", (v) => { state.md = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 7. crisprlineage — 傷跡アレイの蓄積・飽和・ホモプラシー
  // ==========================================================================
  W.crisprlineage = function (container) {
    const state = { rate: 0.15, gen: 6 };
    const SITES = 10, CELLS = 16;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("cl_r", "編集速度（1世代あたり）", 0.02, 0.6, 0.02, 0.15, (v) => (v * 100).toFixed(0) + " %")}
        ${sliderRow("cl_g", "世代数", 1, 14, 1, 6, (v) => v.toFixed(0) + " 世代")}
      </div>
      <div class="widget-stage"><div id="cl_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#eef1f6"></span>未編集の部位</span><span class="li"><span class="sw" style="background:#d946ef"></span>傷跡（色＝傷跡の種類）</span></div></div>
      ${readoutRow([{ id: "cl_s", label: "アレイの飽和度", value: "—" }, { id: "cl_h", label: "ホモプラシー", value: "—" }])}
      <p class="widget-note">傷跡が蓄積するほど系譜は解けますが、<b>速すぎるとアレイが早期に飽和して後半の分岐が記録されません</b>。頻出する傷跡が別系統に独立に生じるホモプラシーの割合も同時に増えます。</p>`;
    const PALETTE = ["#d946ef", "#3a7bd5", "#1f9d6b", "#f97316", "#ef5350", "#8b5cf6", "#0ea5e9", "#eab308"];
    function simulate() {
      const rng = CK.makeRng(7);
      // 傷跡IDは偏った分布（頻出する傷跡がある）から引く
      const drawScar = () => {
        const u = rng();
        if (u < 0.42) return 0;      // 非常に頻出
        if (u < 0.64) return 1;
        return 2 + Math.floor(rng() * 6);
      };
      let cells = [{ arr: new Array(SITES).fill(-1), clade: -1 }];
      for (let g = 1; g <= state.gen; g++) {
        const next = [];
        cells.forEach((c) => {
          for (let k = 0; k < 2; k++) {
            const arr = c.arr.slice();
            for (let i = 0; i < SITES; i++) if (arr[i] === -1 && rng() < state.rate) arr[i] = drawScar();
            const clade = g === 1 ? k : c.clade;
            next.push({ arr: arr, clade: clade });
          }
        });
        cells = next;
        if (cells.length > CELLS) {
          const step = cells.length / CELLS;
          const picked = [];
          for (let i = 0; i < CELLS; i++) picked.push(cells[Math.floor(i * step)]);
          cells = picked;
        }
      }
      while (cells.length < CELLS) cells.push({ arr: cells[cells.length - 1].arr.slice(), clade: cells[cells.length - 1].clade });
      return cells;
    }
    function draw() {
      const w = 540, h = 322, s = lightPanel(document.getElementById("cl_plot"), w, h);
      const cells = simulate();
      const x0 = 118, y0 = 44, cw = 26, chh = 13;
      txt(s, x0, y0 - 22, "バーコードアレイ（横＝10部位、縦＝16細胞）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      let edited = 0;
      const byClade = [{}, {}];
      cells.forEach((c, ri) => {
        const y = y0 + ri * (chh + 1.6);
        txt(s, x0 - 8, y + 11, "細胞" + (ri + 1), { "text-anchor": "end", "font-size": 8.5 });
        add(s, "rect", { x: x0 - 6, y: y, width: 4, height: chh, rx: 2, fill: c.clade === 0 ? "#94a3b8" : "#cbd5e1" });
        c.arr.forEach((v, ci) => {
          if (v >= 0) { edited++; byClade[c.clade === 0 ? 0 : 1][v] = true; }
          add(s, "rect", { x: x0 + ci * cw, y: y, width: cw - 2.5, height: chh, rx: 2, fill: v < 0 ? "#eef1f6" : PALETTE[v % PALETTE.length], opacity: v < 0 ? 1 : 0.88 });
        });
      });
      for (let ci = 0; ci < SITES; ci++) txt(s, x0 + ci * cw + (cw - 2.5) / 2, y0 + CELLS * (chh + 1.6) + 12, String(ci + 1), { "text-anchor": "middle", "font-size": 8.5 });
      txt(s, x0 + SITES * cw / 2, y0 + CELLS * (chh + 1.6) + 28, "アレイ上の部位", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700 });
      const sat = edited / (SITES * CELLS);
      const shared = Object.keys(byClade[0]).filter((k) => byClade[1][k]).length;
      const total = new Set(Object.keys(byClade[0]).concat(Object.keys(byClade[1]))).size;
      const homo = total > 0 ? shared / total : 0;
      // saturation bar
      add(s, "rect", { x: 400, y: 44, width: 120, height: 14, rx: 5, fill: "#e4e8f0" });
      add(s, "rect", { x: 400, y: 44, width: 120 * sat, height: 14, rx: 5, fill: sat > 0.9 ? "#ef5350" : MAG });
      txt(s, 400, 38, "飽和度 " + (sat * 100).toFixed(0) + " %", { "font-size": 10, fill: "#565f73", "font-weight": 700 });
      setReadout("cl_s", (sat * 100).toFixed(0) + " %" + (sat > 0.9 ? "（飽和：以降の分岐は記録されません）" : ""));
      setReadout("cl_h", (homo * 100).toFixed(0) + " %（別系統で共有された傷跡）");
    }
    bindSlider("cl_r", (v) => (v * 100).toFixed(0) + " %", (v) => { state.rate = v; draw(); });
    bindSlider("cl_g", (v) => v.toFixed(0) + " 世代", (v) => { state.gen = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 8. sge — 変異効果マップとスコア分布の二峰性
  // ==========================================================================
  W.sge = function (container) {
    const state = { view: "hist", sep: 2.2, thr: -1.1 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("sg_v", "表示", [{ v: "hist", label: "スコア分布" }, { v: "map", label: "変異効果マップ" }], "hist")}
        ${sliderRow("sg_s", "アッセイの分離度", 0.4, 3.6, 0.2, 2.2, (v) => v.toFixed(1) + " SD")}
        ${sliderRow("sg_t", "機能喪失と判定するしきい値", -2.6, 0.2, 0.1, -1.1, (v) => v.toFixed(1))}
      </div>
      <div class="widget-stage"><div id="sg_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#1f9d6b"></span>機能保持（同義置換など）</span><span class="li"><span class="sw" style="background:#ef5350"></span>機能喪失（ナンセンスなど）</span></div></div>
      ${readoutRow([{ id: "sg_e", label: "誤分類率", value: "—" }, { id: "sg_a", label: "識別能（AUC相当）", value: "—" }])}
      <p class="widget-note">2つの山が離れているほどアッセイは信頼できます。<b>分離度を下げると、しきい値をどこに引いても誤分類が増える</b>ことが分かります。マップ表示では機能ドメインが縦の帯として浮かび上がります。</p>`;
    const SD = 0.42;
    function normPdf(x, mu) { return Math.exp(-0.5 * Math.pow((x - mu) / SD, 2)) / (SD * Math.sqrt(2 * Math.PI)); }
    function drawHist() {
      const ctx = CK.plot(document.getElementById("sg_plot"), {
        width: 520, height: 272, margin: { top: 18, right: 20, bottom: 46, left: 56 },
        xDomain: [-3.6, 1.2], yDomain: [0, 1.05], xTicks: 4, yTicks: 4,
        xLabel: "機能スコア（0＝機能保持）", yLabel: "変異の密度", xFmt: (v) => v.toFixed(1), yFmt: () => "",
      });
      const muL = -state.sep;
      const pts1 = [], pts2 = [], zero = [];
      for (let x = -3.6; x <= 1.2; x += 0.02) {
        pts1.push([x, normPdf(x, 0) * SD * 1.0]);
        pts2.push([x, normPdf(x, muL) * SD * 1.0]);
        zero.push([x, 0]);
      }
      CK.area(ctx, pts1, zero, { fill: GREEN, opacity: 0.28 });
      CK.area(ctx, pts2, zero, { fill: "#ef5350", opacity: 0.28 });
      CK.line(ctx, pts1, { stroke: GREEN, "stroke-width": 2.4 });
      CK.line(ctx, pts2, { stroke: "#ef5350", "stroke-width": 2.4 });
      CK.vline(ctx, state.thr, { stroke: "#3a4256", "stroke-width": 2, "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.x(state.thr) + 5, ctx.margin.top + 14, "しきい値", { "font-size": ctx.fs(10.5), fill: "#3a4256", "font-weight": 700 });
    }
    function drawMap() {
      const w = 520, h = 272, s = lightPanel(document.getElementById("sg_plot"), w, h);
      const POS = 30, ALT = 3;
      const rng = CK.makeRng(11);
      const x0 = 56, y0 = 54, cw = 14.5, chh = 26;
      txt(s, x0, y0 - 26, "変異効果マップ（横＝アミノ酸位置、縦＝置換後の残基）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      for (let p = 0; p < POS; p++) {
        const inDomain = p >= 9 && p <= 17;
        for (let a = 0; a < ALT; a++) {
          const mu = inDomain ? -state.sep : 0;
          const sc = mu + CK.randNormal(0, SD, rng);
          const t = clamp((0.2 - sc) / (state.sep + 0.6), 0, 1);
          add(s, "rect", { x: x0 + p * cw, y: y0 + a * chh, width: cw - 1.5, height: chh - 1.5, fill: mix("#e8f3ee", "#ef5350", t) });
        }
      }
      add(s, "rect", { x: x0 + 9 * cw - 2, y: y0 - 6, width: 9 * cw + 2, height: ALT * chh + 8, fill: "none", stroke: MAG, "stroke-width": 2, "stroke-dasharray": "4 3" });
      txt(s, x0 + 13.5 * cw, y0 - 12, "機能ドメイン", { "text-anchor": "middle", "font-size": 10, fill: MAG, "font-weight": 700 });
      ["Ala", "Asp", "Trp"].forEach((r, i) => txt(s, x0 - 8, y0 + i * chh + 17, r, { "text-anchor": "end", "font-size": 9.5 }));
      [1, 10, 20, 30].forEach((p) => txt(s, x0 + (p - 0.5) * cw, y0 + ALT * chh + 14, String(p), { "text-anchor": "middle", "font-size": 9 }));
      txt(s, x0 + POS * cw / 2, y0 + ALT * chh + 32, "アミノ酸位置", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      // color scale
      const sx = 56, sy = 200;
      for (let i = 0; i < 60; i++) add(s, "rect", { x: sx + i * 3, y: sy, width: 3, height: 12, fill: mix("#e8f3ee", "#ef5350", i / 59) });
      txt(s, sx, sy + 26, "機能保持", { "font-size": 9.5 });
      txt(s, sx + 180, sy + 26, "機能喪失", { "text-anchor": "end", "font-size": 9.5 });
      txt(s, 280, sy + 12, "白い部分＝測定できていない変異ではないか確認を", { "font-size": 9.5, fill: "#7b8497" });
    }
    function draw() {
      if (state.view === "hist") drawHist(); else drawMap();
      const fp = 1 - CK.normalCDF(state.thr, 0, SD);       // 機能喪失なのに保持と判定
      const fn = CK.normalCDF(state.thr, -state.sep, SD);  // 保持なのに喪失と判定
      const err = 0.5 * (CK.normalCDF(state.thr, 0, SD) + (1 - CK.normalCDF(state.thr, -state.sep, SD)));
      const auc = CK.normalCDF(state.sep / (SD * Math.SQRT2), 0, 1);
      setReadout("sg_e", (err * 100).toFixed(1) + " %");
      setReadout("sg_a", auc.toFixed(3) + (auc > 0.99 ? "（良好な分離）" : auc > 0.9 ? "（許容範囲）" : "（分離不良）"));
      void fp; void fn;
    }
    bindSeg("sg_v", (v) => { state.view = v; draw(); });
    bindSlider("sg_s", (v) => v.toFixed(1) + " SD", (v) => { state.sep = v; draw(); });
    bindSlider("sg_t", (v) => v.toFixed(1), (v) => { state.thr = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 9. citeseq — RNA と抗体（ADT）の乖離、背景シグナル
  // ==========================================================================
  W.citeseq = function (container) {
    const state = { bg: 0.25, sens: 0.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("ct_b", "抗体の背景（アンビエント）", 0, 1, 0.05, 0.25, (v) => (v * 100).toFixed(0) + " %")}
        ${sliderRow("ct_s", "RNAの検出感度", 0.05, 1, 0.05, 0.5, (v) => (v * 100).toFixed(0) + " %")}
      </div>
      <div class="widget-stage"><div id="ct_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>マーカー陽性細胞</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>マーカー陰性細胞</span></div></div>
      ${readoutRow([{ id: "ct_r", label: "陽性細胞でRNAが0の割合", value: "—" }, { id: "ct_d", label: "ADTの陽性・陰性分離", value: "—" }])}
      <p class="widget-note">横軸がmRNA、縦軸が同じ細胞の抗体シグナル（ADT）。<b>RNAが0でもADTは陽性</b>という乖離は、翻訳後制御ではなくRNAの取りこぼしで生じます。背景を上げると<b>陽性・陰性の境界そのものが消えていく</b>ことに注目してください。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ct_plot"), {
        width: 520, height: 292, margin: { top: 18, right: 20, bottom: 48, left: 60 },
        xDomain: [-0.35, 2.0], yDomain: [0, 3.0], xTicks: 4, yTicks: 3,
        xLabel: "CD4 mRNA  log10(カウント+1)", yLabel: "抗体シグナル ADT  log10", xFmt: (v) => v.toFixed(1), yFmt: (v) => v.toFixed(1),
      });
      const rng = CK.makeRng(23);
      let posN = 0, zeroN = 0;
      // 陰性細胞
      for (let i = 0; i < 150; i++) {
        const adt = 0.25 + state.bg * 1.25 + CK.randNormal(0, 0.16, rng);
        const x = rng() < 0.93 ? -0.22 + rng() * 0.14 : Math.log10(1 + Math.floor(rng() * 2) + 1) * 0.5;
        CK.dot(ctx, x, clamp(adt, 0.02, 2.95), { r: 2.9, fill: GRAY, opacity: 0.5 });
      }
      // 陽性細胞
      for (let i = 0; i < 150; i++) {
        const adt = 2.3 - state.bg * 0.35 + CK.randNormal(0, 0.17, rng);
        const detected = rng() < state.sens;
        posN++;
        let x;
        if (!detected) { x = -0.22 + rng() * 0.14; zeroN++; }
        else x = clamp(0.45 + CK.randNormal(0, 0.3, rng) + state.sens * 0.5, 0.15, 1.95);
        CK.dot(ctx, x, clamp(adt, 0.02, 2.95), { r: 2.9, fill: MAG, opacity: 0.55 });
      }
      CK.vline(ctx, -0.05, { stroke: "#c7cce0", "stroke-dasharray": "3 3" });
      CK.textPx(ctx, ctx.x(-0.28), ctx.margin.top + 12, "RNA = 0", { "font-size": ctx.fs(10), fill: "#7b8497" });
      const gap = (2.3 - state.bg * 0.35) - (0.25 + state.bg * 1.25);
      const thr = (2.3 - state.bg * 0.35 + 0.25 + state.bg * 1.25) / 2;
      CK.hline(ctx, thr, { stroke: "#3a4256", "stroke-width": 1.8, "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.margin.left + ctx.w - 6, ctx.y(thr) - 6, "ADTの陽性判定ライン", { "text-anchor": "end", "font-size": ctx.fs(10), fill: "#3a4256", "font-weight": 700 });
      setReadout("ct_r", ((zeroN / Math.max(1, posN)) * 100).toFixed(0) + " %");
      setReadout("ct_d", gap.toFixed(2) + (gap > 1.4 ? "（明瞭）" : gap > 0.8 ? "（やや不明瞭）" : "（判定困難）"));
    }
    bindSlider("ct_b", (v) => (v * 100).toFixed(0) + " %", (v) => { state.bg = v; draw(); });
    bindSlider("ct_s", (v) => (v * 100).toFixed(0) + " %", (v) => { state.sens = v; draw(); });
    draw();
  };

  // ==========================================================================
  // 10. scatac — 疎な行列と TSS 濃縮プロファイル
  // ==========================================================================
  W.scatac = function (container) {
    const state = { frag: 8000, view: "both" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("sa_f", "細胞あたりのフラグメント数", 300, 30000, 300, 8000, (v) => v.toFixed(0))}
        ${segRow("sa_v", "表示", [{ v: "both", label: "行列とTSSプロファイル" }, { v: "qc", label: "品質管理プロット" }], "both")}
      </div>
      <div class="widget-stage"><div id="sa_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>観測あり／品質合格の細胞</span><span class="li"><span class="sw" style="background:#c9cfdb"></span>0・低品質（開いていないとは限らない）</span></div></div>
      ${readoutRow([{ id: "sa_z", label: "行列の非ゼロ率", value: "—" }, { id: "sa_t", label: "TSS濃縮度", value: "—" }])}
      <p class="widget-note">深度を下げると細胞×ピーク行列は<b>ほぼ真っ白（0）</b>になり、TSS周辺の濃縮の山も潰れます。<b>0は「閉じている」ではなく「観測されなかった」</b>にすぎない、という読み方の勘所が体感できます。</p>`;
    function tssScore(frag) { return clamp(1.2 + 9.5 * (1 - Math.exp(-frag / 6000)), 1, 12); }
    function drawBoth() {
      const w = 540, h = 266, s = lightPanel(document.getElementById("sa_plot"), w, h);
      const p = clamp(0.006 + 0.30 * (1 - Math.exp(-state.frag / 12000)), 0.004, 0.34);
      const rng = CK.makeRng(5);
      const COLS = 22, ROWS = 14, cw = 10.2, chh = 12.4, x0 = 26, y0 = 46;
      txt(s, x0, y0 - 22, "細胞 × ピーク 行列（一部）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      let nz = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const isPeak = c % 5 === 1 || c % 7 === 3;
          const hit = rng() < p * (isPeak ? 2.4 : 0.5);
          if (hit) nz++;
          add(s, "rect", { x: x0 + c * cw, y: y0 + r * chh, width: cw - 1.4, height: chh - 1.4, rx: 1.5, fill: hit ? MAG : "#eef1f6", opacity: hit ? 0.9 : 1 });
        }
      }
      txt(s, x0, y0 + ROWS * chh + 16, "ピーク（列）→", { "font-size": 9.5 });
      txt(s, 14, y0 + ROWS * chh / 2, "細胞", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 14 ${y0 + ROWS * chh / 2})` });
      // TSS profile
      const px0 = 300, py0 = 46, pw = 210, ph = 150;
      txt(s, px0, py0 - 22, "TSS周辺のフラグメント密度", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "line", { x1: px0, x2: px0 + pw, y1: py0 + ph, y2: py0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: px0, x2: px0, y1: py0, y2: py0 + ph, stroke: "#c7cce0", "stroke-width": 1.2 });
      const ts = tssScore(state.frag);
      const noise = clamp(1.4 / Math.sqrt(state.frag / 300), 0.02, 1.2);
      const rng2 = CK.makeRng(9);
      let d = "";
      for (let i = 0; i <= 60; i++) {
        const t = -2000 + (i / 60) * 4000;
        const v = 1 + (ts - 1) * Math.exp(-0.5 * Math.pow(t / 550, 2)) + CK.randNormal(0, noise, rng2);
        const X = px0 + (i / 60) * pw;
        const Y = py0 + ph - (clamp(v, 0, 13) / 13) * ph;
        d += (d ? " L " : "M ") + X.toFixed(1) + " " + Y.toFixed(1);
      }
      add(s, "path", { d: d, fill: "none", stroke: MAG, "stroke-width": 2.4 });
      add(s, "line", { x1: px0 + pw / 2, x2: px0 + pw / 2, y1: py0, y2: py0 + ph, stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      txt(s, px0 + pw / 2, py0 + ph + 14, "TSS", { "text-anchor": "middle", "font-size": 9.5 });
      txt(s, px0, py0 + ph + 14, "−2kb", { "font-size": 9 });
      txt(s, px0 + pw, py0 + ph + 14, "+2kb", { "text-anchor": "end", "font-size": 9 });
      txt(s, px0 - 6, py0 + ph - (1 / 13) * ph + 3, "1", { "text-anchor": "end", "font-size": 9 });
      txt(s, px0 - 6, py0 + 6, "13", { "text-anchor": "end", "font-size": 9 });
      setReadout("sa_z", ((nz / (ROWS * COLS)) * 100).toFixed(1) + " %");
      setReadout("sa_t", ts.toFixed(1) + (ts >= 6 ? "（合格）" : "（低品質として除外される水準）"));
    }
    function drawQC() {
      const ctx = CK.plot(document.getElementById("sa_plot"), {
        width: 520, height: 292, margin: { top: 18, right: 20, bottom: 48, left: 58 },
        xDomain: [2.2, 4.8], yDomain: [0, 14], xTicks: 4, yTicks: 4,
        xLabel: "細胞あたりフラグメント数 log10", yLabel: "TSS濃縮度", xFmt: (v) => v.toFixed(1), yFmt: (v) => v.toFixed(0),
      });
      const rng = CK.makeRng(31);
      const center = Math.log10(state.frag);
      for (let i = 0; i < 220; i++) {
        const lx = clamp(center + CK.randNormal(0, 0.34, rng), 2.2, 4.8);
        const ts = clamp(tssScore(Math.pow(10, lx)) + CK.randNormal(0, 1.0, rng), 0.2, 13.6);
        const pass = ts >= 6 && lx >= 3.2;
        CK.dot(ctx, lx, ts, { r: 3, fill: pass ? MAG : GRAY, opacity: pass ? 0.6 : 0.42 });
      }
      // debris cluster
      for (let i = 0; i < 70; i++) {
        CK.dot(ctx, clamp(2.5 + CK.randNormal(0, 0.22, rng), 2.2, 4.8), clamp(1.2 + CK.randNormal(0, 0.6, rng), 0.2, 13.6), { r: 3, fill: GRAY, opacity: 0.4 });
      }
      CK.hline(ctx, 6, { stroke: "#3a4256", "stroke-width": 1.8, "stroke-dasharray": "5 4" });
      CK.vline(ctx, 3.2, { stroke: "#3a4256", "stroke-width": 1.8, "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.margin.left + 8, ctx.y(2), "左下＝死細胞・裸の核（除外）", { "font-size": ctx.fs(10.5), fill: "#7b8497" });
      const ts = tssScore(state.frag);
      setReadout("sa_z", "—");
      setReadout("sa_t", ts.toFixed(1) + (ts >= 6 ? "（合格）" : "（低品質として除外される水準）"));
    }
    function draw() { if (state.view === "qc") drawQC(); else drawBoth(); }
    bindSlider("sa_f", (v) => v.toFixed(0), (v) => { state.frag = v; draw(); });
    bindSeg("sa_v", (v) => { state.view = v; draw(); });
    draw();
  };
})();

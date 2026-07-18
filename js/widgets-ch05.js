/* 第5章：タンパク質解析 — batch1 widgets (topics 1〜10)
   ゲル像・ブロット・FRET・分解曲線・foci など */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const RED = "#ef5350";
  function stage(host, w, h) {
    const s = CK.el("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    host.innerHTML = ""; host.appendChild(s); return s;
  }
  function add(parent, tag, attrs) { const e = CK.el(tag, attrs); parent.appendChild(e); return e; }
  function darkPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#05070f" }); return s; }
  function lightPanel(host, w, h, bg) { const s = stage(host, w, h); add(s, "rect", { x: 0, y: 0, width: w, height: h, rx: 8, fill: bg || "#f2f4f8" }); return s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  // map log10(MW kDa) -> y within a gel (top=big MW, bottom=small MW)
  function mwToY(mw, top, bottom, mwTop, mwBot) {
    const t = (Math.log10(mwTop) - Math.log10(mw)) / (Math.log10(mwTop) - Math.log10(mwBot));
    return top + clamp(t, 0, 1) * (bottom - top);
  }

  // 1. PAGE — SDS-PAGE gel with MW ladder + movable sample band -------------
  W.page_gel = function (container) {
    const state = { mw: 50 };
    const markers = [250, 150, 100, 75, 50, 37, 25, 20, 15, 10];
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pg_m", "目的タンパク質の分子量 (kDa)", 10, 250, 1, state.mw, (v) => v + " kDa")}</div>
      <div class="widget-stage"><div id="pg_plot"></div></div>
      ${readoutRow([{ id: "pg_mw", label: "目的バンドの分子量", value: "—" }, { id: "pg_pos", label: "泳動位置", value: "—" }])}
      <p class="widget-note">左が分子量マーカー。SDS-PAGEでは<b>大きいほど上（動きにくい）、小さいほど下（速い）</b>。移動度は分子量の対数に反比例します。</p>`;
    function draw() {
      const W2 = 420, H2 = 320, s = darkPanel(document.getElementById("pg_plot"), W2, H2, "#0b0f18");
      const top = 34, bottom = 292, mwTop = 260, mwBot = 9;
      // lanes header
      add(s, "text", { x: 90, y: 22, "text-anchor": "middle", "font-size": 11, fill: "#9fb0c8", text: "マーカー" });
      add(s, "text", { x: 250, y: 22, "text-anchor": "middle", "font-size": 11, fill: "#f4b4b2", text: "サンプル" });
      // ladder
      markers.forEach((m) => {
        const y = mwToY(m, top, bottom, mwTop, mwBot);
        add(s, "rect", { x: 55, y: y - 4, width: 70, height: 7, rx: 2, fill: "#c9d4e6", opacity: 0.82 });
        add(s, "text", { x: 44, y: y + 3.5, "text-anchor": "end", "font-size": 9.5, fill: "#7f8ca3", text: m });
      });
      // sample lane band
      const ys = mwToY(state.mw, top, bottom, mwTop, mwBot);
      add(s, "rect", { x: 200, y: top - 6, width: 100, height: bottom - top + 12, rx: 4, fill: "#10151f", stroke: "#1c2432", "stroke-width": 1 });
      add(s, "rect", { x: 208, y: ys - 5, width: 84, height: 10, rx: 3, fill: RED, opacity: 0.9 });
      add(s, "rect", { x: 208, y: ys - 8, width: 84, height: 16, rx: 4, fill: RED, opacity: 0.25 });
      setReadout("pg_mw", state.mw + " kDa");
      const nearest = markers.reduce((a, b) => Math.abs(b - state.mw) < Math.abs(a - state.mw) ? b : a);
      setReadout("pg_pos", "マーカー " + nearest + " kDa 付近");
    }
    bindSlider("pg_m", (v) => v + " kDa", (v) => { state.mw = v; draw(); });
    draw();
  };

  // 2. Western blot — target band + loading control -------------------------
  W.westernblot = function (container) {
    const state = { expr: 0.7 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("wb_e", "目的タンパク質の発現量", 0, 1, 0.05, state.expr, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="wb_plot"></div></div>
      ${readoutRow([{ id: "wb_t", label: "目的バンドの濃さ", value: "—" }, { id: "wb_c", label: "ローディングコントロール", value: "—" }])}
      <p class="widget-note">上が目的タンパク質、下がローディングコントロール（アクチン等）。発現量を変えると<b>目的バンドの濃さだけが変化</b>し、コントロールは一定＝これが定量の基準です。</p>`;
    function draw() {
      const W2 = 440, H2 = 190, s = darkPanel(document.getElementById("wb_plot"), W2, H2, "#0a0d14");
      const lanes = [{ x: 70, e: 0.9 }, { x: 150, e: 0.55 }, { x: 230, e: state.expr }, { x: 310, e: 0.15 }];
      const labels = ["対照", "条件1", "条件2(可変)", "KD"];
      add(s, "text", { x: 20, y: 62, "font-size": 10.5, fill: "#9fb0c8", text: "IB:目的" });
      add(s, "text", { x: 20, y: 140, "font-size": 10.5, fill: "#9fb0c8", text: "IB:actin" });
      lanes.forEach((ln, i) => {
        const e = i === 2 ? state.expr : ln.e;
        // target band (variable)
        add(s, "rect", { x: ln.x, y: 50, width: 64, height: 15, rx: 3, fill: "#f0f2f6", opacity: clamp(0.08 + e * 0.9, 0.06, 0.98) });
        add(s, "rect", { x: ln.x, y: 47, width: 64, height: 21, rx: 4, fill: "#f0f2f6", opacity: clamp(e * 0.28, 0, 0.3) });
        // loading control (constant)
        add(s, "rect", { x: ln.x, y: 126, width: 64, height: 14, rx: 3, fill: "#cfe0d8", opacity: 0.85 });
        add(s, "text", { x: ln.x + 32, y: 172, "text-anchor": "middle", "font-size": 9.5, fill: i === 2 ? "#f4b4b2" : "#7f8ca3", text: labels[i] });
      });
      setReadout("wb_t", (state.expr * 100).toFixed(0) + "%（濃さ）");
      setReadout("wb_c", "一定（補正の基準）");
    }
    bindSlider("wb_e", (v) => (v * 100).toFixed(0) + "%", (v) => { state.expr = v; draw(); });
    draw();
  };

  // 3. 2D-PAGE — spot train shifting along pI with phosphorylation ----------
  W.twod_page = function (container) {
    const state = { phos: 0.2 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("td_p", "リン酸化の度合い", 0, 1, 0.05, state.phos, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="td_plot"></div></div>
      ${readoutRow([{ id: "td_pi", label: "スポット群の等電点(pI)", value: "—" }, { id: "td_n", label: "検出されるスポット数", value: "—" }])}
      <p class="widget-note">横軸=等電点(pI)、縦軸=分子量。リン酸化が進むほど負電荷が増え、<b>スポット列が酸性側（左）へ移動</b>します。リン酸化サイトの数だけスポットが増えます。</p>`;
    function draw() {
      const W2 = 460, H2 = 260, s = lightPanel(document.getElementById("td_plot"), W2, H2, "#eef0ea");
      const x0 = 54, x1 = 430, y0 = 26, y1 = 210;
      // axes
      add(s, "line", { x1: x0, y1: y1, x2: x1, y2: y1, stroke: "#b7bdc7", "stroke-width": 1.2 });
      add(s, "line", { x1: x0, y1: y0, x2: x0, y2: y1, stroke: "#b7bdc7", "stroke-width": 1.2 });
      [4, 5, 6, 7, 8, 9].forEach((pi) => { const x = x0 + (pi - 4) / 5 * (x1 - x0); add(s, "text", { x: x, y: y1 + 16, "text-anchor": "middle", "font-size": 10, fill: "#7a8496", text: "pI " + pi }); });
      add(s, "text", { x: (x0 + x1) / 2, y: H2 - 4, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", "font-weight": 700, text: "等電点 (pI) → 酸性←    →アルカリ" });
      add(s, "text", { x: 14, y: (y0 + y1) / 2, "text-anchor": "middle", "font-size": 11, fill: "#616a7d", "font-weight": 700, transform: `rotate(-90 14 ${(y0 + y1) / 2})`, text: "分子量" });
      // spot train: base pI ~7, each phospho shifts acidic (left). number grows with phos
      const nSpots = 1 + Math.round(state.phos * 5);
      const basePi = 7.2 - state.phos * 1.8;
      const ySpot = y0 + 78;
      for (let k = 0; k < nSpots; k++) {
        const pi = basePi - k * 0.28;
        const x = x0 + (pi - 4) / 5 * (x1 - x0);
        add(s, "ellipse", { cx: x, cy: ySpot, rx: 13 - k * 0.6, ry: 7, fill: RED, opacity: clamp(0.75 - k * 0.09, 0.2, 0.8) });
      }
      setReadout("td_pi", basePi.toFixed(1) + (state.phos > 0.3 ? "（酸性へ）" : ""));
      setReadout("td_n", nSpots + " 個");
    }
    bindSlider("td_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.phos = v; draw(); });
    draw();
  };

  // 4. FRET — donor/acceptor distance -> efficiency -------------------------
  W.fret = function (container) {
    const state = { d: 8 }; // nm
    const R0 = 5;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("fr_d", "2分子間の距離 (nm)", 2, 12, 0.2, state.d, (v) => v.toFixed(1) + " nm")}</div>
      <div class="widget-stage"><div id="fr_plot"></div></div>
      ${readoutRow([{ id: "fr_e", label: "FRET効率", value: "—" }, { id: "fr_s", label: "見える蛍光", value: "—" }])}
      <p class="widget-note">CFP(ドナー)を450 nmで励起。2分子が<b>近い(&lt;5 nm)ほどFRET効率が上がり</b>、CFPの発光が減ってYFP(アクセプター)が光ります。効率は距離の6乗に依存。</p>`;
    function draw() {
      const eff = 1 / (1 + Math.pow(state.d / R0, 6));
      const W2 = 460, H2 = 250, s = darkPanel(document.getElementById("fr_plot"), W2, H2, "#070b14");
      const cyD = 96, cxD = 120, cxA = 120 + state.d * 20;
      // barrels
      function barrel(cx, col, lab, glow) {
        add(s, "rect", { x: cx - 22, y: cyD - 30, width: 44, height: 60, rx: 20, fill: col, opacity: 0.35 + 0.55 * glow, stroke: col, "stroke-width": 1.5 });
        add(s, "text", { x: cx, y: cyD + 52, "text-anchor": "middle", "font-size": 10.5, fill: "#9fb0c8", text: lab });
      }
      const donorGlow = 1 - eff, acceptorGlow = eff;
      barrel(cxD, "#3aa0ff", "CFP (ドナー)", donorGlow);
      barrel(clamp(cxA, cxD + 46, 430), "#8bd34a", "YFP (アクセプター)", acceptorGlow);
      // energy arrow when close
      if (eff > 0.12) add(s, "text", { x: (cxD + clamp(cxA, cxD + 46, 430)) / 2, y: cyD - 40, "text-anchor": "middle", "font-size": 11, fill: "#ff9d5c", "font-weight": 700, text: "FRET →" });
      // emission bars
      const bx = 60, by = 210, bw = 120;
      add(s, "text", { x: 60, y: 168, "font-size": 10, fill: "#9fb0c8", text: "発光スペクトル（相対）" });
      add(s, "rect", { x: bx, y: by - 40 * donorGlow, width: 46, height: 40 * donorGlow, fill: "#3aa0ff", opacity: 0.8 });
      add(s, "text", { x: bx + 23, y: by + 14, "text-anchor": "middle", "font-size": 9.5, fill: "#7f8ca3", text: "CFP 480" });
      add(s, "rect", { x: bx + 70, y: by - 40 * acceptorGlow, width: 46, height: 40 * acceptorGlow, fill: "#8bd34a", opacity: 0.8 });
      add(s, "text", { x: bx + 93, y: by + 14, "text-anchor": "middle", "font-size": 9.5, fill: "#7f8ca3", text: "YFP 530" });
      setReadout("fr_e", (eff * 100).toFixed(0) + "%");
      setReadout("fr_s", eff > 0.5 ? "YFP優位（相互作用あり）" : eff > 0.15 ? "混在" : "CFP優位（離れている）");
    }
    bindSlider("fr_d", (v) => v.toFixed(1) + " nm", (v) => { state.d = v; draw(); });
    draw();
  };

  // 5. Half-life — CHX chase decay ------------------------------------------
  W.halflife = function (container) {
    const state = { k: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("hl_k", "処理群の分解の速さ", 0.4, 3, 0.05, state.k, (v) => "×" + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="hl_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#7a879c"></span>コントロール</span><span class="li"><span class="sw" style="background:#ef5350"></span>処理群</span></div></div>
      ${readoutRow([{ id: "hl_t", label: "処理群の半減期 t½", value: "—" }, { id: "hl_r", label: "8h後の残量", value: "—" }])}
      <p class="widget-note">シクロヘキシミド(CHX)で合成を止めた後の残量の減衰。<b>曲線が急なほど半減期(t½)が短い＝速く分解</b>。E3過剰発現などで分解が促進された様子を再現できます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("hl_plot"), { width: 440, height: 290, xDomain: [0, 8], yDomain: [0, 105], xTicks: 4, yTicks: 5, xLabel: "CHX chase (h)", yLabel: "残存タンパク質量 (%)", xFmt: (v) => v, yFmt: (v) => v });
      const kCtrl = Math.log(2) / 6.0;          // control t1/2 = 6h
      const kT = kCtrl * state.k;
      function curve(k) { const pts = []; for (let t = 0; t <= 8; t += 0.2) pts.push([t, 100 * Math.exp(-k * t)]); return pts; }
      CK.hline(ctx, 50, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.line(ctx, curve(kCtrl), { stroke: "#7a879c", "stroke-width": 2.2 });
      CK.line(ctx, curve(kT), { stroke: RED, "stroke-width": 2.6 });
      [0, 0.5, 1, 2, 4, 8].forEach((t) => CK.dot(ctx, t, 100 * Math.exp(-kT * t), { r: 3.4, fill: RED }));
      const t12 = Math.log(2) / kT;
      setReadout("hl_t", t12.toFixed(1) + " 時間");
      setReadout("hl_r", (100 * Math.exp(-kT * 8)).toFixed(0) + "%");
    }
    bindSlider("hl_k", (v) => "×" + v.toFixed(2), (v) => { state.k = v; draw(); });
    draw();
  };

  // 6. Ubiquitylation — band shift-up assay ---------------------------------
  W.ubiquitin = function (container) {
    const state = { mode: "all" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ub_m", "反応系", [{ v: "all", label: "全部入り" }, { v: "noe3", label: "E3なし" }, { v: "noub", label: "Ubなし" }], "all")}</div>
      <div class="widget-stage"><div id="ub_plot"></div></div>
      ${readoutRow([{ id: "ub_s", label: "バンドのシフト", value: "—" }, { id: "ub_c", label: "ユビキチン化", value: "—" }])}
      <p class="widget-note">抗体で標的を検出したブロット。<b>Ub+E1+E2+E3が全部揃ったときだけ</b>、標的がユビキチン化されて高分子量側へシフトアップ（はしご〜スメア）します。</p>`;
    function draw() {
      const W2 = 300, H2 = 300, s = darkPanel(document.getElementById("ub_plot"), W2, H2, "#0a0d14");
      const laneX = 120, laneW = 120, top = 30, bottom = 270;
      add(s, "rect", { x: laneX, y: top, width: laneW, height: bottom - top, rx: 4, fill: "#10151f", stroke: "#1c2432", "stroke-width": 1 });
      // kDa scale
      [100, 75, 50, 37, 25].forEach((m, i) => { const y = top + 20 + i * 46; add(s, "text", { x: laneX - 10, y: y + 3, "text-anchor": "end", "font-size": 9, fill: "#7f8ca3", text: m }); });
      // unmodified band (always present)
      const baseY = bottom - 40;
      add(s, "rect", { x: laneX + 12, y: baseY - 6, width: laneW - 24, height: 12, rx: 3, fill: "#f0f2f6", opacity: 0.9 });
      add(s, "text", { x: laneX + laneW + 8, y: baseY + 3, "font-size": 9.5, fill: "#9fb0c8", text: "標的(未修飾)" });
      if (state.mode === "all") {
        // laddered + smear above
        for (let k = 1; k <= 5; k++) {
          add(s, "rect", { x: laneX + 14, y: baseY - 6 - k * 22, width: laneW - 28, height: 8, rx: 2, fill: RED, opacity: clamp(0.7 - k * 0.05, 0.2, 0.7) });
        }
        add(s, "rect", { x: laneX + 12, y: top + 12, width: laneW - 24, height: 70, rx: 4, fill: RED, opacity: 0.16 });
        add(s, "text", { x: laneX + laneW + 8, y: top + 40, "font-size": 9.5, fill: "#f4b4b2", text: "Ub化(スメア)" });
        setReadout("ub_s", "高分子量へシフトアップ");
        setReadout("ub_c", "起きている（陽性）");
      } else {
        setReadout("ub_s", "シフトなし（単一バンド）");
        setReadout("ub_c", state.mode === "noe3" ? "起きない（E3が必須）" : "起きない（基質が必須）");
      }
    }
    bindSeg("ub_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 7. AID — auxin-inducible degron rapid degradation -----------------------
  W.aid = function (container) {
    const state = { t: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ai_t", "オーキシン添加後の時間 (h)", 0, 6, 0.5, state.t, (v) => v.toFixed(1) + " h")}</div>
      <div class="widget-stage"><div id="ai_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#ef5350"></span>標的(mAID)</span><span class="li"><span class="sw" style="background:#7a879c"></span>HSP90(内部標準)</span><span class="li"><span class="sw" style="background:#5b8bff"></span>RNAi(参考)</span></div></div>
      ${readoutRow([{ id: "ai_r", label: "標的の残量", value: "—" }, { id: "ai_c", label: "HSP90", value: "—" }])}
      <p class="widget-note">オーキシン添加で<b>mAID-tag付き標的が数時間で急減</b>（半減期≈0.5h）。内部標準HSP90は不変。参考にRNAi(青)を重ねると、AIDの方が圧倒的に速いのが分かります。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ai_plot"), { width: 440, height: 280, xDomain: [0, 6], yDomain: [0, 105], xTicks: 6, yTicks: 5, xLabel: "オーキシン添加後 (h)", yLabel: "タンパク質残量 (%)", xFmt: (v) => v, yFmt: (v) => v });
      const aid = []; const rnai = []; const hsp = [];
      for (let t = 0; t <= 6; t += 0.1) { aid.push([t, 100 * Math.exp(-Math.log(2) / 0.5 * t)]); rnai.push([t, 100 * Math.exp(-Math.log(2) / 5.0 * t)]); hsp.push([t, 100]); }
      CK.line(ctx, hsp, { stroke: "#7a879c", "stroke-width": 2, "stroke-dasharray": "5 4" });
      CK.line(ctx, rnai, { stroke: "#5b8bff", "stroke-width": 2, "stroke-dasharray": "3 3" });
      CK.line(ctx, aid, { stroke: RED, "stroke-width": 2.8 });
      const cur = 100 * Math.exp(-Math.log(2) / 0.5 * state.t);
      CK.vline(ctx, state.t, { stroke: "#e35fa0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.t, cur, { r: 5, fill: RED });
      setReadout("ai_r", cur.toFixed(0) + "%");
      setReadout("ai_c", "100%（不変）");
    }
    bindSlider("ai_t", (v) => v.toFixed(1) + " h", (v) => { state.t = v; draw(); });
    draw();
  };

  // 8. PROTAC — bell-shaped (hook effect) dose response ---------------------
  W.protac = function (container) {
    const state = { lc: 0 }; // log10(conc nM)
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pt_c", "PROTAC濃度 (nM)", -1, 4, 0.1, state.lc, (v) => Math.round(Math.pow(10, v)) + " nM")}</div>
      <div class="widget-stage"><div id="pt_plot"></div></div>
      ${readoutRow([{ id: "pt_r", label: "標的タンパク質の残量", value: "—" }, { id: "pt_z", label: "領域", value: "—" }])}
      <p class="widget-note">標的の残量を濃度（対数）で見ると、低〜中濃度で分解（残量↓）、しかし<b>高濃度では“フック効果”で分解が弱まり残量が戻る</b>釣り鐘型に。三者複合体が鍵です。</p>`;
    function remaining(lc) {
      // ternary complex ~ bell in log space, peak degradation around lc=1.5 (~30nM)
      const degr = Math.exp(-Math.pow((lc - 1.5) / 1.2, 2)); // 0..1 degradation efficiency
      return 100 * (1 - 0.82 * degr);
    }
    function draw() {
      const ctx = CK.plot(document.getElementById("pt_plot"), { width: 460, height: 290, xDomain: [-1, 4], yDomain: [0, 105], xTicks: 5, yTicks: 5, xLabel: "PROTAC濃度 (nM, 対数)", yLabel: "標的の残量 (%)", xFmt: (v) => { const d = Math.pow(10, v); return d >= 1 ? Math.round(d).toString() : d.toFixed(1); }, yFmt: (v) => v });
      const pts = []; for (let v = -1; v <= 4; v += 0.05) pts.push([v, remaining(v)]);
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.6 });
      const cur = remaining(state.lc);
      CK.vline(ctx, state.lc, { stroke: "#e35fa0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.lc, cur, { r: 5, fill: RED });
      setReadout("pt_r", cur.toFixed(0) + "%");
      setReadout("pt_z", state.lc < 0.8 ? "低濃度（不足）" : state.lc < 2.4 ? "最適（よく分解）" : "高濃度（フック効果）");
    }
    bindSlider("pt_c", (v) => Math.round(Math.pow(10, v)) + " nM", (v) => { state.lc = v; draw(); });
    draw();
  };

  // 9. Fluoppi — foci form / disperse with inhibitor ------------------------
  W.fluoppi = function (container) {
    const rng = CK.makeRng(509), cells = [];
    for (let i = 0; i < 6; i++) cells.push({ cx: 70 + (i % 3) * 150, cy: 60 + Math.floor(i / 3) * 90, seed: 40 + i });
    const state = { inh: 0.1 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("fl_i", "PPI阻害剤の濃度", 0, 1, 0.05, state.inh, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="fl_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#37d67a"></span>foci(相互作用)</span><span class="li"><span class="sw" style="background:#2f6bd8"></span>核</span></div></div>
      ${readoutRow([{ id: "fl_f", label: "foci強度 / 細胞", value: "—" }, { id: "fl_st", label: "相互作用", value: "—" }])}
      <p class="widget-note">相互作用があると蛍光が<b>輝点(foci)</b>に集まります。阻害剤を増やすと<b>fociが解離して細胞全体に分散</b>。foci強度/細胞が指標です。</p>`;
    function draw() {
      const W2 = 460, H2 = 210, s = darkPanel(document.getElementById("fl_plot"), W2, H2, "#04121a");
      const focisity = 1 - state.inh;
      cells.forEach((c) => {
        const rng = CK.makeRng(c.seed);
        add(s, "ellipse", { cx: c.cx, cy: c.cy, rx: 52, ry: 40, fill: "#0a1f2b", stroke: "#16323f", "stroke-width": 1 });
        add(s, "ellipse", { cx: c.cx, cy: c.cy, rx: 22, ry: 18, fill: "#2f6bd8", opacity: 0.45 });
        // diffuse green (grows with inhibition)
        add(s, "ellipse", { cx: c.cx, cy: c.cy, rx: 48, ry: 36, fill: "#37d67a", opacity: 0.05 + 0.14 * state.inh });
        // foci (shrink/vanish with inhibition)
        const nFoci = Math.round(2 + focisity * 6);
        for (let k = 0; k < nFoci; k++) {
          const a = rng() * Math.PI * 2, rr = rng() * 30;
          add(s, "circle", { cx: c.cx + rr * Math.cos(a), cy: c.cy + rr * Math.sin(a) * 0.75, r: 2 + focisity * 3.5, fill: "#5dff9c", opacity: 0.35 + 0.6 * focisity });
        }
      });
      setReadout("fl_f", (focisity * 100).toFixed(0) + "（相対）");
      setReadout("fl_st", state.inh > 0.6 ? "阻害されている（分散）" : state.inh > 0.3 ? "一部解離" : "強い（foci集積）");
    }
    bindSlider("fl_i", (v) => (v * 100).toFixed(0) + "%", (v) => { state.inh = v; draw(); });
    draw();
  };

  // 10. BiFC / SplitGFP — fragment reassembly on proximity ------------------
  W.bifc = function (container) {
    const state = { d: 8 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("bf_d", "2タンパク質の近接", 2, 12, 0.2, state.d, (v) => v.toFixed(1) + " (遠⇔近)")}</div>
      <div class="widget-stage"><div id="bf_plot"></div></div>
      ${readoutRow([{ id: "bf_g", label: "再構築GFPの蛍光", value: "—" }, { id: "bf_s", label: "状態", value: "—" }])}
      <p class="widget-note">GFPを2分割し、別々のタンパク質に融合。<b>2つが近づくとGFPが再構築されて緑に光ります</b>。※一度再構築すると解離しない不可逆反応（Fluoppiとの違い）。</p>`;
    function draw() {
      const prox = clamp((12 - state.d) / 10, 0, 1); // 0 far -> 1 near
      const merged = prox > 0.72;
      const W2 = 460, H2 = 230, s = darkPanel(document.getElementById("bf_plot"), W2, H2, "#070b14");
      const cy = 110;
      if (!merged) {
        const gap = state.d * 14;
        const cxL = 180 - gap / 2, cxR = 220 + gap / 2;
        // two half-barrels + fused proteins
        add(s, "path", { d: `M ${cxL} ${cy - 30} a 26 30 0 0 0 0 60 Z`, fill: "#8bd34a", opacity: 0.22, stroke: "#6ba53a", "stroke-width": 1.4 });
        add(s, "path", { d: `M ${cxR} ${cy - 30} a 26 30 0 0 1 0 60 Z`, fill: "#8bd34a", opacity: 0.22, stroke: "#6ba53a", "stroke-width": 1.4 });
        add(s, "rect", { x: cxL - 46, y: cy - 16, width: 30, height: 32, rx: 6, fill: "#3aa0ff", opacity: 0.5 });
        add(s, "rect", { x: cxR + 16, y: cy - 16, width: 30, height: 32, rx: 6, fill: "#ef7ea0", opacity: 0.5 });
        add(s, "text", { x: cxL - 31, y: cy + 44, "text-anchor": "middle", "font-size": 9.5, fill: "#9fb0c8", text: "タンパク質A" });
        add(s, "text", { x: cxR + 31, y: cy + 44, "text-anchor": "middle", "font-size": 9.5, fill: "#9fb0c8", text: "タンパク質B" });
        add(s, "text", { x: 220, y: cy - 46, "text-anchor": "middle", "font-size": 10.5, fill: "#7f8ca3", text: "GFP断片は単独では光らない" });
      } else {
        // reassembled glowing barrel
        add(s, "circle", { cx: 220, cy: cy, r: 46, fill: "#5dff9c", opacity: 0.16 });
        add(s, "rect", { x: 220 - 26, y: cy - 34, width: 52, height: 68, rx: 24, fill: "#8bd34a", opacity: 0.9, stroke: "#c8ffab", "stroke-width": 1.6 });
        add(s, "rect", { x: 220 - 72, y: cy - 16, width: 30, height: 32, rx: 6, fill: "#3aa0ff", opacity: 0.6 });
        add(s, "rect", { x: 220 + 42, y: cy - 16, width: 30, height: 32, rx: 6, fill: "#ef7ea0", opacity: 0.6 });
        add(s, "text", { x: 220, y: cy - 48, "text-anchor": "middle", "font-size": 10.5, fill: "#8bd34a", "font-weight": 700, text: "GFP再構築 → 発光！" });
      }
      setReadout("bf_g", merged ? (prox * 100).toFixed(0) + "%（点灯）" : "0%（消灯）");
      setReadout("bf_s", merged ? "再構築（不可逆に発光）" : "離れている（断片のまま）");
    }
    bindSlider("bf_d", (v) => v.toFixed(1) + " (遠⇔近)", (v) => { state.d = v; draw(); });
    draw();
  };

  // 11. Interactome — bait-centered network, background filter --------------
  W.interactome = function (container) {
    const rng = CK.makeRng(511), N = 30, nodes = [];
    for (let i = 0; i < N; i++) {
      const specific = i < 11;
      const score = specific ? 2.2 + rng() * 6 : 0.3 + rng() * 1.1;
      const ang = i / N * Math.PI * 2 + rng() * 0.3;
      const r = 58 + rng() * 46;
      nodes.push({ x: 230 + r * Math.cos(ang), y: 118 + r * Math.sin(ang) * 0.82, score });
    }
    const state = { thr: 1.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("in_t", "バックグラウンド除去のしきい値 (H/L比)", 0.3, 3, 0.05, state.thr, (v) => "≥ " + v.toFixed(2))}</div>
      <div class="widget-stage"><div id="in_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#ef5350"></span>特異的相互作用</span><span class="li"><span class="sw" style="background:#7a879c"></span>バックグラウンド</span></div></div>
      ${readoutRow([{ id: "in_n", label: "特異的相互作用分子", value: "—" }, { id: "in_b", label: "除外された背景", value: "—" }])}
      <p class="widget-note">中心が<b>ベイト</b>、周囲が同定分子。しきい値を上げると、非特異的な結合（灰）が振り落とされ、<b>特異的な相互作用分子（赤）だけ</b>が残ります。</p>`;
    function draw() {
      const W2 = 460, H2 = 236, s = darkPanel(document.getElementById("in_plot"), W2, H2, "#080d16");
      let spec = 0, bg = 0;
      nodes.forEach((nd) => {
        const keep = nd.score >= state.thr;
        if (keep) { spec++; add(s, "line", { x1: 230, y1: 118, x2: nd.x, y2: nd.y, stroke: "#ef5350", "stroke-width": 0.8, opacity: 0.4 }); }
        else bg++;
        add(s, "circle", { cx: nd.x, cy: nd.y, r: keep ? 4 + Math.min(nd.score, 8) * 0.6 : 3, fill: keep ? "#ef5350" : "#7a879c", opacity: keep ? 0.9 : 0.28 });
      });
      add(s, "circle", { cx: 230, cy: 118, r: 15, fill: "#f5d90a", opacity: 0.28 });
      add(s, "circle", { cx: 230, cy: 118, r: 10, fill: "#f5d90a" });
      add(s, "text", { x: 230, y: 121, "text-anchor": "middle", "font-size": 9, fill: "#1b2233", "font-weight": 700, text: "Bait" });
      setReadout("in_n", spec + " 分子");
      setReadout("in_b", bg + " 分子");
    }
    bindSlider("in_t", (v) => "≥ " + v.toFixed(2), (v) => { state.thr = v; draw(); });
    draw();
  };

  // 12. ELISA — standard curve + colorimetric well -------------------------
  W.elisa = function (container) {
    const state = { c: 2 };
    const Amax = 1.0, Kd = 2.2;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("el_c", "目的タンパク質の濃度 (ng/mL)", 0, 5, 0.1, state.c, (v) => v.toFixed(1))}</div>
      <div class="widget-stage"><div id="el_plot"></div></div>
      ${readoutRow([{ id: "el_a", label: "吸光度 (OD₄₅₀)", value: "—" }, { id: "el_w", label: "ウェルの発色", value: "—" }])}
      <p class="widget-note">濃度既知の標準溶液で作った<b>検量線</b>。目的タンパク質が多いほど酵素が基質を発色させ、<b>吸光度が上がる</b>。吸光度から逆に濃度を算出します。</p>`;
    function abs(c) { return Amax * c / (Kd + c); }
    function draw() {
      const ctx = CK.plot(document.getElementById("el_plot"), { width: 400, height: 250, xDomain: [0, 5], yDomain: [0, 1.0], xTicks: 5, yTicks: 5, xLabel: "タンパク質濃度 (ng/mL)", yLabel: "吸光度 (OD₄₅₀)", xFmt: (v) => v, yFmt: (v) => v.toFixed(1) });
      const pts = []; for (let c = 0; c <= 5; c += 0.1) pts.push([c, abs(c)]);
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.4 });
      const a = abs(state.c);
      CK.vline(ctx, state.c, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.hline(ctx, a, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.c, a, { r: 5, fill: RED });
      // colored well (yellow intensity ~ absorbance)
      add(ctx.svg, "circle", { cx: ctx.width - 40, cy: 40, r: 16, fill: "#e8c020", opacity: clamp(0.12 + a * 0.85, 0.1, 0.98), stroke: "#b89a18", "stroke-width": 1 });
      add(ctx.svg, "text", { x: ctx.width - 40, y: 66, "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: "well" });
      setReadout("el_a", a.toFixed(3));
      setReadout("el_w", a > 0.6 ? "濃い黄色" : a > 0.25 ? "薄い黄色" : "ほぼ無色");
    }
    bindSlider("el_c", (v) => v.toFixed(1), (v) => { state.c = v; draw(); });
    draw();
  };

  // 13. IP — Input / Pull-down blot with co-IP -----------------------------
  W.ip = function (container) {
    const state = { inter: "yes" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ip_i", "相互作用", [{ v: "yes", label: "あり" }, { v: "no", label: "なし(ネガコン)" }], "yes")}</div>
      <div class="widget-stage"><div id="ip_plot"></div></div>
      ${readoutRow([{ id: "ip_p", label: "Pull-down: 共沈相手", value: "—" }, { id: "ip_j", label: "判定", value: "—" }])}
      <p class="widget-note">Input（全体）と、抗体で沈降したPull-down。<b>相互作用があるときだけ</b>、Pull-downレーンに共沈相手のバンドが現れます（共免疫沈降）。</p>`;
    function draw() {
      const W2 = 380, H2 = 210, s = darkPanel(document.getElementById("ip_plot"), W2, H2, "#0a0d14");
      const lanes = [{ x: 110, lab: "Input" }, { x: 230, lab: "Pull-down" }];
      add(s, "text", { x: 18, y: 66, "font-size": 10, fill: "#9fb0c8", text: "IB:ベイト" });
      add(s, "text", { x: 18, y: 130, "font-size": 10, fill: "#9fb0c8", text: "IB:相手B" });
      const hasB = state.inter === "yes";
      lanes.forEach((ln) => {
        // bait band: present in Input & Pull-down
        add(s, "rect", { x: ln.x, y: 54, width: 78, height: 15, rx: 3, fill: "#f0f2f6", opacity: 0.92 });
        // partner band: Input always (endogenous); Pull-down only if interaction
        const bOn = ln.lab === "Input" ? true : hasB;
        add(s, "rect", { x: ln.x, y: 118, width: 78, height: 14, rx: 3, fill: "#f4b4b2", opacity: bOn ? 0.9 : 0.05 });
        add(s, "text", { x: ln.x + 39, y: 176, "text-anchor": "middle", "font-size": 10, fill: "#9fb0c8", text: ln.lab });
      });
      setReadout("ip_p", hasB ? "バンドあり（共沈）" : "バンドなし");
      setReadout("ip_j", hasB ? "相互作用あり" : "相互作用なし（陰性）");
    }
    bindSeg("ip_i", (v) => { state.inter = v; draw(); });
    draw();
  };

  // 14. Y2H — reporter-driven yeast growth ---------------------------------
  W.y2h = function (container) {
    const rng = CK.makeRng(514), spots = [];
    for (let i = 0; i < 60; i++) spots.push({ x: rng(), y: rng(), r: 2 + rng() * 3, u: rng() });
    const state = { ppi: 0.3 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("y2_p", "PPIの強さ", 0, 1, 0.05, state.ppi, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="y2_plot"></div></div>
      ${readoutRow([{ id: "y2_r", label: "レポーター(HIS3)誘導", value: "—" }, { id: "y2_g", label: "欠損培地での生育", value: "—" }])}
      <p class="widget-note">ベイト-プレイの相互作用でGAL4が再構築されHIS3が誘導。<b>ヒスチジン欠損培地で酵母コロニーが生育</b>します。相互作用が無いと生えません。</p>`;
    function draw() {
      const W2 = 300, H2 = 220, s = darkPanel(document.getElementById("y2_plot"), W2, H2, "#0c0a08");
      const cx = 150, cy = 108, R = 92;
      add(s, "circle", { cx: cx, cy: cy, r: R, fill: "#241d15", stroke: "#3a2f22", "stroke-width": 2 });
      add(s, "text", { x: cx, y: 214, "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: "His⁻ 選択培地" });
      let grown = 0;
      spots.forEach((sp) => {
        if (sp.u < state.ppi) {
          grown++;
          const px = cx + (sp.x - 0.5) * R * 1.5, py = cy + (sp.y - 0.5) * R * 1.5;
          if (Math.hypot(px - cx, py - cy) < R - 6) add(s, "circle", { cx: px, cy: py, r: sp.r * (0.6 + state.ppi * 0.7), fill: "#e8dcc0", opacity: 0.85 });
        }
      });
      setReadout("y2_r", state.ppi > 0.05 ? (state.ppi * 100).toFixed(0) + "% 誘導" : "誘導なし");
      setReadout("y2_g", state.ppi > 0.5 ? "良好に生育" : state.ppi > 0.15 ? "まばらに生育" : "生育せず");
    }
    bindSlider("y2_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.ppi = v; draw(); });
    draw();
  };

  // 15. Chromatography — gel filtration elution profile --------------------
  W.chromatography = function (container) {
    const peaks = [{ v: 8, mw: 600, lab: "複合体" }, { v: 14, mw: 150, lab: "単量体" }, { v: 20, mw: 40, lab: "小分子" }];
    const state = { vol: 8 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ch_v", "回収する画分（溶出量, mL）", 5, 24, 0.5, state.vol, (v) => v.toFixed(1) + " mL")}</div>
      <div class="widget-stage"><div id="ch_plot"></div></div>
      ${readoutRow([{ id: "ch_mw", label: "この画分の推定分子量", value: "—" }, { id: "ch_p", label: "溶出成分", value: "—" }])}
      <p class="widget-note">ゲル濾過の溶出プロファイル（280 nm吸光度）。<b>分子量が大きいものから先に（左＝早く）溶出</b>します。マーカーで分子量を推定できます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ch_plot"), { width: 440, height: 250, xDomain: [5, 24], yDomain: [0, 1.1], xTicks: 5, yTicks: 4, xLabel: "溶出量 (mL) → 小さい分子ほど遅い", yLabel: "A₂₈₀", xFmt: (v) => Math.round(v), yFmt: () => "" });
      const pts = []; for (let v = 5; v <= 24; v += 0.1) { let y = 0; peaks.forEach((p) => y += Math.exp(-Math.pow((v - p.v) / 1.5, 2))); pts.push([v, y]); }
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: RED, opacity: 0.12 });
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.4 });
      peaks.forEach((p) => CK.textPx(ctx, ctx.x(p.v), ctx.y(1.02), p.lab + "\n", { "text-anchor": "middle", "font-size": 9.5, fill: "#8a93a8", text: p.lab + "(" + p.mw + "k)" }));
      CK.vline(ctx, state.vol, { stroke: "#e35fa0", "stroke-width": 1.8 });
      const nearest = peaks.reduce((a, b) => Math.abs(b.v - state.vol) < Math.abs(a.v - state.vol) ? b : a);
      setReadout("ch_mw", "≈ " + nearest.mw + " kDa");
      setReadout("ch_p", nearest.lab);
    }
    bindSlider("ch_v", (v) => v.toFixed(1) + " mL", (v) => { state.vol = v; draw(); });
    draw();
  };

  // 16. Shotgun proteomics — MS/MS b/y ion ladder --------------------------
  W.shotgun = function (container) {
    const seq = "SAVGHEYVAEVEK".split("");
    const mass = { G: 57.02146, A: 71.03711, S: 87.03203, V: 99.06841, H: 137.05891, E: 129.04259, Y: 163.06333, K: 128.09496 };
    const proton = 1.00728, water = 18.01056;
    const state = { mode: "both" };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("sg_m", "表示イオン", [{ v: "b", label: "bイオン" }, { v: "y", label: "yイオン" }, { v: "both", label: "両方" }], "both")}</div>
      <div class="widget-stage"><div id="sg_plot"></div></div>
      ${readoutRow([{ id: "sg_seq", label: "ペプチド配列", value: "—" }, { id: "sg_n", label: "検出フラグメント", value: "—" }])}
      <p class="widget-note">MS/MSスペクトル。<b>隣り合うピークの間隔＝アミノ酸1残基の質量</b>。bイオン(N末端側)とyイオン(C末端側)のはしごを読むと配列が分かります。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("sg_plot"), { width: 460, height: 250, xDomain: [0, 1500], yDomain: [0, 1.15], xTicks: 5, yTicks: 1, xLabel: "m/z", yLabel: "相対強度", xFmt: (v) => v, yFmt: () => "" });
      function peak(mz, h, color, lab) {
        add(ctx.svg, "line", { x1: ctx.x(mz), x2: ctx.x(mz), y1: ctx.y(0), y2: ctx.y(h), stroke: color, "stroke-width": 1.6 });
        if (lab) add(ctx.svg, "text", { x: ctx.x(mz), y: ctx.y(h) - 3, "text-anchor": "middle", "font-size": 8, fill: color, text: lab });
      }
      let n = 0, cum = 0;
      const bmz = [], ymz = [];
      for (let i = 0; i < seq.length - 1; i++) { cum += mass[seq[i]]; bmz.push(cum + proton); }
      cum = 0;
      for (let j = 0; j < seq.length - 1; j++) { cum += mass[seq[seq.length - 1 - j]]; ymz.push(cum + water + proton); }
      if (state.mode !== "y") bmz.forEach((m, i) => { peak(m, 0.35 + 0.55 * Math.abs(Math.sin(i * 1.3)), "#3aa0ff", "b" + (i + 1)); n++; });
      if (state.mode !== "b") ymz.forEach((m, i) => { peak(m, 0.35 + 0.55 * Math.abs(Math.cos(i * 1.1)), "#ef5350", "y" + (i + 1)); n++; });
      // sequence letters across top
      seq.forEach((c, i) => add(ctx.svg, "text", { x: ctx.margin.left + 20 + i * 26, y: ctx.margin.top + 6, "font-size": 12, fill: "#616a7d", "font-weight": 700, text: c }));
      setReadout("sg_seq", seq.join(""));
      setReadout("sg_n", n + " 本");
    }
    bindSeg("sg_m", (v) => { state.mode = v; draw(); });
    draw();
  };

  // 17. Targeted proteomics — SRM with internal standard -------------------
  W.targeted = function (container) {
    const state = { conf: 0.5 }; // relative conc 0..1
    const ISfmol = 10;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("tg_c", "目的ペプチドの濃度", 0, 1, 0.05, state.conf, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="tg_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#ef5350"></span>標的(軽い)</span><span class="li"><span class="sw" style="background:#5b8bff"></span>内部標準(重い・一定)</span></div></div>
      ${readoutRow([{ id: "tg_ratio", label: "面積比 (標的/標準)", value: "—" }, { id: "tg_abs", label: "絶対量", value: "—" }])}
      <p class="widget-note">SRM/MRMのクロマトグラム。既知量の<b>内部標準(重い・青、一定)</b>に対する<b>標的(軽い・赤)</b>のピーク面積比から、絶対量を算出します。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("tg_plot"), { width: 440, height: 250, xDomain: [0, 10], yDomain: [0, 1.1], xTicks: 5, yTicks: 1, xLabel: "保持時間 (min)", yLabel: "強度", xFmt: (v) => v, yFmt: () => "" });
      const targetH = 0.08 + state.conf * 0.95, isH = 0.7;
      function chrom(rt, h, color) { const pts = []; for (let t = 0; t <= 10; t += 0.1) pts.push([t, h * Math.exp(-Math.pow((t - rt) / 0.5, 2))]); CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: color, opacity: 0.16 }); CK.line(ctx, pts, { stroke: color, "stroke-width": 2.2 }); }
      chrom(6.2, isH, "#5b8bff");
      chrom(3.6, targetH, "#ef5350");
      const ratio = targetH / isH;
      setReadout("tg_ratio", ratio.toFixed(2));
      setReadout("tg_abs", (ratio * ISfmol).toFixed(1) + " fmol");
    }
    bindSlider("tg_c", (v) => (v * 100).toFixed(0) + "%", (v) => { state.conf = v; draw(); });
    draw();
  };

  // 18. AlphaScreen — proximity-dependent luminescence ---------------------
  W.alphascreen = function (container) {
    const state = { inh: 0.1 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("as_i", "阻害剤の濃度", 0, 1, 0.05, state.inh, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="as_plot"></div></div>
      ${readoutRow([{ id: "as_s", label: "AlphaScreenシグナル", value: "—" }, { id: "as_i2", label: "阻害率", value: "—" }])}
      <p class="widget-note">Donorビーズ(680 nm励起)の<b>一重項酸素</b>がAcceptorビーズに届くと発光。阻害剤でビーズが離れると一重項酸素が届かず、<b>シグナルが低下</b>します。</p>`;
    function draw() {
      const signal = 100 / (1 + Math.pow(state.inh / 0.32, 3));
      const W2 = 460, H2 = 210, s = darkPanel(document.getElementById("as_plot"), W2, H2, "#070b14");
      const close = 1 - state.inh;
      const cxD = 150, cxA = 150 + 40 + state.inh * 150, cy = 96;
      // singlet oxygen glow between when close
      if (signal > 8) { add(s, "ellipse", { cx: (cxD + cxA) / 2, cy: cy, rx: 30 + close * 20, ry: 22, fill: "#ffd36b", opacity: 0.05 + 0.3 * (signal / 100) }); }
      add(s, "circle", { cx: cxD, cy: cy, r: 26, fill: "#3aa0ff", opacity: 0.85 });
      add(s, "text", { x: cxD, y: cy + 44, "text-anchor": "middle", "font-size": 9.5, fill: "#9fb0c8", text: "Donor 680nm" });
      add(s, "circle", { cx: clamp(cxA, cxD + 54, 420), cy: cy, r: 26, fill: signal > 8 ? "#ffb84d" : "#5a6472", opacity: 0.85 });
      add(s, "text", { x: clamp(cxA, cxD + 54, 420), y: cy + 44, "text-anchor": "middle", "font-size": 9.5, fill: "#9fb0c8", text: "Acceptor" });
      // signal bar
      add(s, "text", { x: 30, y: 176, "font-size": 10, fill: "#9fb0c8", text: "シグナル" });
      add(s, "rect", { x: 100, y: 168, width: 300, height: 12, rx: 6, fill: "#161c28" });
      add(s, "rect", { x: 100, y: 168, width: 300 * signal / 100, height: 12, rx: 6, fill: "#ffb84d" });
      setReadout("as_s", signal.toFixed(0) + "%");
      setReadout("as_i2", (100 - signal).toFixed(0) + "%");
    }
    bindSlider("as_i", (v) => (v * 100).toFixed(0) + "%", (v) => { state.inh = v; draw(); });
    draw();
  };

  // 19. PEA — 4PL NPX standard curve ---------------------------------------
  W.pea = function (container) {
    const state = { lc: 2 }; // log10(pg/mL)
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("pe_c", "標的タンパク質の濃度 (pg/mL)", -1, 5, 0.1, state.lc, (v) => { const d = Math.pow(10, v); return d >= 1 ? Math.round(d) : d.toFixed(2); })}</div>
      <div class="widget-stage"><div id="pe_plot"></div></div>
      ${readoutRow([{ id: "pe_npx", label: "NPX (Log₂)", value: "—" }, { id: "pe_z", label: "検出域", value: "—" }])}
      <p class="widget-note">2抗体＋DNAオリゴが近接→バーコード増幅→定量。<b>4パラメータロジスティック(4PL)の検量線</b>に沿って、濃度がNPX(Log₂: +1で2倍)として読み取られます。</p>`;
    function npx(lc) { return 1 + 15 / (1 + Math.pow(10, -(lc - 2) * 0.9)); }
    function draw() {
      const ctx = CK.plot(document.getElementById("pe_plot"), { width: 460, height: 260, xDomain: [-1, 5], yDomain: [0, 17], xTicks: 6, yTicks: 4, xLabel: "濃度 (pg/mL, 対数)", yLabel: "NPX (Log₂)", xFmt: (v) => { const d = Math.pow(10, v); return d >= 1 ? Math.round(d).toString() : d.toFixed(1); }, yFmt: (v) => v });
      const pts = []; for (let v = -1; v <= 5; v += 0.05) pts.push([v, npx(v)]);
      CK.hline(ctx, 2, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.textPx(ctx, ctx.margin.left + 30, ctx.y(2) - 4, "LOD付近", { "font-size": 9, fill: "#8a93a8", text: "検出限界(LOD)付近" });
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.6 });
      const y = npx(state.lc);
      CK.vline(ctx, state.lc, { stroke: "#e35fa0", "stroke-dasharray": "4 3" });
      CK.dot(ctx, state.lc, y, { r: 5, fill: RED });
      setReadout("pe_npx", y.toFixed(1));
      setReadout("pe_z", y < 2.5 ? "検出限界付近" : y > 15 ? "上限プラトー付近" : "定量ダイナミックレンジ内");
    }
    bindSlider("pe_c", (v) => { const d = Math.pow(10, v); return d >= 1 ? Math.round(d) : d.toFixed(2); }, (v) => { state.lc = v; draw(); });
    draw();
  };

  // 20. X-ray crystallography — electron density detail vs resolution -------
  W.crystallography = function (container) {
    const atoms = [[150, 130], [186, 112], [214, 138], [186, 150], [246, 120], [120, 112]];
    const state = { res: 2.5 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("cr_r", "分解能 (Å)", 1.2, 4, 0.1, state.res, (v) => v.toFixed(1) + " Å")}</div>
      <div class="widget-stage"><div id="cr_plot"></div></div>
      ${readoutRow([{ id: "cr_v", label: "分解能", value: "—" }, { id: "cr_i", label: "見えるもの", value: "—" }])}
      <p class="widget-note">実験結果は<b>電子密度マップ</b>。分解能が良い（数値が小さい）ほど個々の原子が分離して見え、悪いと1つのボヤけた塊になります。</p>`;
    function draw() {
      const W2 = 440, H2 = 250, s = darkPanel(document.getElementById("cr_plot"), W2, H2, "#050a12");
      // density blob radius grows with worse resolution -> atoms merge
      const blob = 8 + (state.res - 1.2) * 12;
      atoms.forEach((a) => {
        for (let k = 3; k >= 1; k--) add(s, "circle", { cx: a[0], cy: a[1], r: blob * (0.5 + k * 0.28), fill: "#37d67a", opacity: 0.08 });
      });
      // atom centers visible only when resolution good
      const showAtoms = state.res < 2.3;
      atoms.forEach((a) => { if (showAtoms) add(s, "circle", { cx: a[0], cy: a[1], r: 3.2, fill: "#eafff2" }); });
      // bonds (model) always faint
      const bonds = [[0, 1], [1, 2], [2, 3], [3, 0], [1, 4], [0, 5]];
      bonds.forEach((b) => add(s, "line", { x1: atoms[b[0]][0], y1: atoms[b[0]][1], x2: atoms[b[1]][0], y2: atoms[b[1]][1], stroke: "#9fb0c8", "stroke-width": 1, opacity: 0.4 }));
      add(s, "text", { x: 330, y: 40, "font-size": 10.5, fill: "#8aa0b0", text: "緑=電子密度" });
      add(s, "text", { x: 330, y: 56, "font-size": 10.5, fill: "#8aa0b0", text: "灰=分子モデル" });
      setReadout("cr_v", state.res.toFixed(1) + " Å");
      setReadout("cr_i", state.res < 1.8 ? "個々の原子が分離" : state.res < 2.5 ? "主鎖＋側鎖" : state.res < 3.3 ? "主鎖のみ（塊）" : "全体の形のみ");
    }
    bindSlider("cr_r", (v) => v.toFixed(1) + " Å", (v) => { state.res = v; draw(); });
    draw();
  };

  // 21. Cryo-EM — FSC curve -> resolution -----------------------------------
  W.cryoem = function (container) {
    const state = { n: 4 }; // log-ish particle count control
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("ce_n", "集めた粒子像の枚数", 1, 20, 0.5, state.n, (v) => Math.round(v * 10000).toLocaleString() + " 枚")}</div>
      <div class="widget-stage"><div id="ce_plot"></div></div>
      ${readoutRow([{ id: "ce_r", label: "分解能 (FSC=0.143)", value: "—" }, { id: "ce_q", label: "マップの質", value: "—" }])}
      <p class="widget-note">2つの独立再構成の一致度=<b>FSC曲線</b>。粒子数が多いほど曲線が高周波まで伸び、<b>FSC=0.143との交点</b>が右へ動いて分解能(Å)が良くなります。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("ce_plot"), { width: 440, height: 260, xDomain: [0, 0.7], yDomain: [0, 1.05], xTicks: 7, yTicks: 5, xLabel: "空間周波数 (1/Å)", yLabel: "FSC", xFmt: (v) => v.toFixed(1), yFmt: (v) => v.toFixed(1) });
      // cutoff frequency increases with particle count
      const fc = 0.18 + (state.n / 20) * 0.4;
      const pts = []; for (let f = 0; f <= 0.7; f += 0.005) pts.push([f, 1 / (1 + Math.pow(f / fc, 8))]);
      CK.hline(ctx, 0.143, { stroke: "#e35fa0", "stroke-dasharray": "5 4" });
      CK.textPx(ctx, ctx.margin.left + 24, ctx.y(0.143) - 4, "FSC=0.143", { "font-size": 9, fill: "#c77", text: "FSC = 0.143" });
      CK.line(ctx, pts, { stroke: "#3aa0ff", "stroke-width": 2.6 });
      // find crossing
      let cross = fc; for (let f = 0; f <= 0.7; f += 0.001) { if (1 / (1 + Math.pow(f / fc, 8)) <= 0.143) { cross = f; break; } }
      const resA = 1 / cross;
      CK.vline(ctx, cross, { stroke: "#e35fa0", "stroke-dasharray": "3 3" });
      CK.dot(ctx, cross, 0.143, { r: 5, fill: "#e35fa0" });
      setReadout("ce_r", resA.toFixed(1) + " Å");
      setReadout("ce_q", resA < 2.5 ? "側鎖まで見える高分解能" : resA < 4 ? "主鎖が追える中分解能" : "全体の形のみ");
    }
    bindSlider("ce_n", (v) => Math.round(v * 10000).toLocaleString() + " 枚", (v) => { state.n = v; draw(); });
    draw();
  };

  // 22. NMR — HSQC cross-peak shift on ligand titration --------------------
  W.nmr = function (container) {
    const rng = CK.makeRng(522), peaks = [];
    for (let i = 0; i < 14; i++) peaks.push({ h: 6.8 + rng() * 3.2, n: 106 + rng() * 24, bind: i < 4, dh: (rng() - 0.5) * 0.8, dn: (rng() - 0.5) * 6 });
    const state = { t: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("nm_t", "リガンドの滴定 (モル比)", 0, 3, 0.1, state.t, (v) => v.toFixed(1))}</div>
      <div class="widget-stage"><div id="nm_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#ef5350"></span>結合部位近傍(移動)</span><span class="li"><span class="sw" style="background:#5b8bff"></span>その他の残基</span></div></div>
      ${readoutRow([{ id: "nm_csp", label: "最大の化学シフト変化(CSP)", value: "—" }, { id: "nm_j", label: "結合部位の推定", value: "—" }])}
      <p class="widget-note">¹H-¹⁵N HSQCの各点＝1残基。リガンドを滴定すると<b>結合部位近傍のクロスピークだけが移動(CSP)</b>。動いた残基を構造にマップすれば結合部位が分かります。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("nm_plot"), { width: 420, height: 260, xDomain: [6, 10.5], yDomain: [104, 132], xTicks: 5, yTicks: 5, xLabel: "¹H (ppm)", yLabel: "¹⁵N (ppm)", xFmt: (v) => v.toFixed(1), yFmt: (v) => Math.round(v) });
      const frac = state.t / (state.t + 0.8); // saturating occupancy
      let maxcsp = 0;
      peaks.forEach((p) => {
        const hh = p.h + (p.bind ? p.dh * frac : 0);
        const nn = p.n + (p.bind ? p.dn * frac : 0);
        if (p.bind) { const csp = Math.sqrt(Math.pow(p.dh * frac, 2) + Math.pow(p.dn * frac / 7, 2)); maxcsp = Math.max(maxcsp, csp); }
        CK.dot(ctx, hh, nn, { r: 5, fill: p.bind ? "#ef5350" : "#5b8bff", opacity: 0.85 });
      });
      setReadout("nm_csp", maxcsp.toFixed(2) + " ppm");
      setReadout("nm_j", state.t > 0.3 ? "移動した残基＝結合部位近傍" : "滴定前（未結合）");
    }
    bindSlider("nm_t", (v) => v.toFixed(1), (v) => { state.t = v; draw(); });
    draw();
  };

  // 23. SPR — sensorgram (association / dissociation) ----------------------
  W.spr = function (container) {
    const state = { ka: 5, kd: 3 }; // log-ish sliders
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("sp_ka", "結合速度 ka", 1, 10, 0.2, state.ka, (v) => v.toFixed(1))}${sliderRow("sp_kd", "解離速度 kd", 1, 10, 0.2, state.kd, (v) => v.toFixed(1))}</div>
      <div class="widget-stage"><div id="sp_plot"></div></div>
      ${readoutRow([{ id: "sp_kd2", label: "解離定数 KD (相対)", value: "—" }, { id: "sp_i", label: "結合の強さ", value: "—" }])}
      <p class="widget-note">センサーグラム(RU)。アナライト添加で<b>結合（上昇）</b>、バッファーで<b>解離（下降）</b>。KD=kd/ka。同じKDでもka・kdが違えば曲線の形が違います。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("sp_plot"), { width: 440, height: 260, xDomain: [0, 200], yDomain: [0, 110], xTicks: 4, yTicks: 5, xLabel: "時間 (s)", yLabel: "レスポンス (RU)", xFmt: (v) => v, yFmt: (v) => v });
      const t1 = 100, kon = state.ka / 60, koff = state.kd / 240, Rmax = 100;
      const kobs = kon + koff * 0.5;
      const Req = Rmax * kon / (kon + koff);
      const pts = [];
      let R1 = 0;
      for (let t = 0; t <= t1; t += 1) { const R = Req * (1 - Math.exp(-kobs * t)); pts.push([t, R]); R1 = R; }
      for (let t = t1; t <= 200; t += 1) pts.push([t, R1 * Math.exp(-koff * (t - t1))]);
      CK.vline(ctx, t1, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.textPx(ctx, ctx.x(45), ctx.margin.top + 12, "結合", { "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: "結合" });
      CK.textPx(ctx, ctx.x(150), ctx.margin.top + 12, "解離", { "text-anchor": "middle", "font-size": 10, fill: "#8a93a8", text: "解離" });
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.6 });
      const KD = state.kd / state.ka;
      setReadout("sp_kd2", KD.toFixed(2));
      setReadout("sp_i", KD < 0.5 ? "強い（KD小）" : KD > 1.6 ? "弱い（KD大）" : "中程度");
    }
    bindSlider("sp_ka", (v) => v.toFixed(1), (v) => { state.ka = v; draw(); });
    bindSlider("sp_kd", (v) => v.toFixed(1), (v) => { state.kd = v; draw(); });
    draw();
  };

  // 24. ITC — binding isotherm (sigmoid) -----------------------------------
  W.itc = function (container) {
    const state = { ka: 5, dh: -8 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("it_ka", "結合定数 Ka (相対)", 1, 10, 0.2, state.ka, (v) => v.toFixed(1))}${sliderRow("it_h", "エンタルピー ΔH (kcal/mol)", -12, -1, 0.5, state.dh, (v) => v.toFixed(1))}</div>
      <div class="widget-stage"><div id="it_plot"></div></div>
      ${readoutRow([{ id: "it_n", label: "結合比 n", value: "—" }, { id: "it_hh", label: "ΔH", value: "—" }])}
      <p class="widget-note">等温滴定曲線。<b>傾き＝結合定数Ka</b>（急なほど強い）、<b>全体の高さ＝ΔH</b>、<b>変曲点のモル比＝結合比n</b>。1回の滴定でこの3つが得られます。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("it_plot"), { width: 440, height: 260, xDomain: [0, 3], yDomain: [state.dh - 1, 1], xTicks: 6, yTicks: 5, xLabel: "モル比 (リガンド/タンパク質)", yLabel: "kcal/mol of injectant", xFmt: (v) => v, yFmt: (v) => v.toFixed(0) });
      const n = 1, sharp = state.ka; // Ka controls transition sharpness
      const pts = []; for (let m = 0; m <= 3; m += 0.03) { const y = state.dh / (1 + Math.exp((m - n) * sharp)); pts.push([m, y]); }
      CK.vline(ctx, n, { stroke: "#c7cce0", "stroke-dasharray": "4 3" });
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.6 });
      pts.filter((p, i) => i % 5 === 0).forEach((p) => CK.dot(ctx, p[0], p[1], { r: 2.6, fill: RED, opacity: 0.7 }));
      setReadout("it_n", n.toFixed(1));
      setReadout("it_hh", state.dh.toFixed(1) + " kcal/mol");
    }
    bindSlider("it_ka", (v) => v.toFixed(1), (v) => { state.ka = v; draw(); });
    bindSlider("it_h", (v) => v.toFixed(1), (v) => { state.dh = v; draw(); });
    draw();
  };

  // 25. Phos-tag — phospho band shift-up -----------------------------------
  W.phostag = function (container) {
    const state = { mode: "phostag", p: 0.4 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${segRow("ps_m", "ゲル", [{ v: "phostag", label: "Phos-tag" }, { v: "normal", label: "通常SDS-PAGE" }], "phostag")}${sliderRow("ps_p", "リン酸化の進行", 0, 1, 0.05, state.p, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="ps_plot"></div></div>
      ${readoutRow([{ id: "ps_b", label: "検出されるバンド", value: "—" }, { id: "ps_note", label: "分離", value: "—" }])}
      <p class="widget-note">リン酸化が進むと、Phos-tagゲルでは<b>非→モノ→ジリン酸化</b>と上へシフトした複数バンドに分かれます。通常ゲルでは1本のまま（リン酸化状態を区別できません）。</p>`;
    function draw() {
      const W2 = 300, H2 = 250, s = darkPanel(document.getElementById("ps_plot"), W2, H2, "#0a0d14");
      const laneX = 110, laneW = 100, top = 24, bottom = 226;
      add(s, "rect", { x: laneX, y: top, width: laneW, height: bottom - top, rx: 4, fill: "#10151f", stroke: "#1c2432", "stroke-width": 1 });
      const p = state.p;
      // fractions: non-, mono-, di- phospho
      const nonF = Math.pow(1 - p, 2), monoF = 2 * p * (1 - p), diF = Math.pow(p, 2);
      if (state.mode === "phostag") {
        const bands = [{ y: bottom - 30, f: nonF, lab: "非リン酸化" }, { y: bottom - 90, f: monoF, lab: "モノ" }, { y: bottom - 150, f: diF, lab: "ジ" }];
        bands.forEach((b) => {
          add(s, "rect", { x: laneX + 12, y: b.y - 7, width: laneW - 24, height: 14, rx: 3, fill: "#f0f2f6", opacity: clamp(0.08 + b.f * 0.9, 0.05, 0.96) });
          add(s, "text", { x: laneX + laneW + 8, y: b.y + 3, "font-size": 9, fill: "#9fb0c8", text: b.lab });
        });
        setReadout("ps_b", "最大3本（非/モノ/ジ）");
        setReadout("ps_note", "リン酸化状態を分離");
      } else {
        add(s, "rect", { x: laneX + 12, y: bottom - 90 - 7, width: laneW - 24, height: 15, rx: 3, fill: "#f0f2f6", opacity: 0.92 });
        add(s, "text", { x: laneX + laneW + 8, y: bottom - 90 + 3, "font-size": 9, fill: "#9fb0c8", text: "1本のみ" });
        setReadout("ps_b", "1本のみ");
        setReadout("ps_note", "リン酸化を区別できない");
      }
    }
    bindSeg("ps_m", (v) => { state.mode = v; draw(); });
    bindSlider("ps_p", (v) => (v * 100).toFixed(0) + "%", (v) => { state.p = v; draw(); });
    draw();
  };

  // 26. Helicase — fluorescence dequenching over time ----------------------
  W.helicase = function (container) {
    const state = { t: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("he_t", "反応時間", 0, 60, 1, state.t, (v) => v.toFixed(0) + " s")}</div>
      <div class="widget-stage"><div id="he_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#ef5350"></span>活性あり(eIF4A)</span><span class="li"><span class="sw" style="background:#5b8bff"></span>活性なし(eIF4E・陰性)</span></div></div>
      ${readoutRow([{ id: "he_u", label: "ほどけた割合(蛍光)", value: "—" }, { id: "he_s", label: "状態", value: "—" }])}
      <p class="widget-note">蛍光消光法。二本鎖ではFAMがDABCYLに消光されますが、<b>ヘリカーゼがほどくとFAMが蛍光を発します</b>。活性あり(赤)は時間とともに蛍光上昇、陰性(青)は変化なし。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("he_plot"), { width: 440, height: 250, xDomain: [0, 60], yDomain: [0, 105], xTicks: 6, yTicks: 5, xLabel: "反応時間 (s)", yLabel: "蛍光強度 (%)", xFmt: (v) => v, yFmt: (v) => v });
      const act = []; const neg = [];
      for (let t = 0; t <= 60; t += 1) { act.push([t, 100 * (1 - Math.exp(-t / 14))]); neg.push([t, 3 + t * 0.05]); }
      CK.line(ctx, neg, { stroke: "#5b8bff", "stroke-width": 2.2, "stroke-dasharray": "4 3" });
      CK.line(ctx, act, { stroke: RED, "stroke-width": 2.6 });
      const cur = 100 * (1 - Math.exp(-state.t / 14));
      CK.vline(ctx, state.t, { stroke: "#c7cce0", "stroke-dasharray": "3 3" });
      CK.dot(ctx, state.t, cur, { r: 5, fill: RED });
      setReadout("he_u", cur.toFixed(0) + "%");
      setReadout("he_s", cur > 60 ? "大半がほどけた" : cur > 20 ? "ほどけ進行中" : "二本鎖のまま");
    }
    bindSlider("he_t", (v) => v.toFixed(0) + " s", (v) => { state.t = v; draw(); });
    draw();
  };

  // 27. Sucrose gradient — polysome profile --------------------------------
  W.sucrose = function (container) {
    const state = { inh: 0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("su_i", "翻訳阻害剤の濃度", 0, 1, 0.05, state.inh, (v) => (v * 100).toFixed(0) + "%")}</div>
      <div class="widget-stage"><div id="su_plot"></div></div>
      ${readoutRow([{ id: "su_r", label: "ポリソーム / モノソーム比", value: "—" }, { id: "su_s", label: "翻訳活性", value: "—" }])}
      <p class="widget-note">ポリソームプロファイル(A₂₅₄)。左から40S・60S・80S(モノソーム)、右に<b>ポリソーム</b>のピーク群。翻訳阻害剤を増やすと<b>ポリソームが減衰</b>します。</p>`;
    function draw() {
      const ctx = CK.plot(document.getElementById("su_plot"), { width: 460, height: 250, xDomain: [0, 12], yDomain: [0, 1.15], xTicks: 6, yTicks: 1, xLabel: "ショ糖濃度（低→高, 分画）", yLabel: "A₂₅₄", xFmt: () => "", yFmt: () => "" });
      const poly = 1 - state.inh;
      const subs = [{ c: 1.6, a: 0.35, w: 0.4 }, { c: 2.4, a: 0.5, w: 0.4 }, { c: 3.3, a: 0.8, w: 0.45 }];
      const polyPeaks = [{ c: 4.6, a: 0.7 }, { c: 5.9, a: 0.6 }, { c: 7.2, a: 0.5 }, { c: 8.5, a: 0.4 }, { c: 9.8, a: 0.3 }];
      const pts = [];
      for (let x = 0; x <= 12; x += 0.05) {
        let y = 0.03;
        subs.forEach((p) => y += p.a * Math.exp(-Math.pow((x - p.c) / p.w, 2)));
        polyPeaks.forEach((p) => y += p.a * poly * Math.exp(-Math.pow((x - p.c) / 0.42, 2)));
        pts.push([x, y]);
      }
      // shade polysome region
      CK.rectData(ctx, 4, 0, 11, 1.15, { fill: "#ef5350", opacity: 0.07 });
      CK.area(ctx, pts, pts.map((p) => [p[0], 0]), { fill: RED, opacity: 0.12 });
      CK.line(ctx, pts, { stroke: RED, "stroke-width": 2.2 });
      ["40S", "60S", "80S"].forEach((l, i) => CK.textPx(ctx, ctx.x(subs[i].c), ctx.y(subs[i].a + 0.12), l, { "text-anchor": "middle", "font-size": 9, fill: "#8a93a8", text: l }));
      CK.textPx(ctx, ctx.x(7), ctx.y(1.05), "ポリソーム", { "text-anchor": "middle", "font-size": 10, fill: "#c77", text: "ポリソーム" });
      setReadout("su_r", (poly * 1.4).toFixed(2));
      setReadout("su_s", state.inh > 0.6 ? "強く抑制（ポリソーム消失）" : state.inh > 0.25 ? "低下" : "活発（翻訳中）");
    }
    bindSlider("su_i", (v) => (v * 100).toFixed(0) + "%", (v) => { state.inh = v; draw(); });
    draw();
  };

  // 28. High-speed AFM — height-mapped dynamic molecule --------------------
  W.hsafm = function (container) {
    const state = { t: 0 };
    function heightColor(h) { // 0..1 -> blue..red
      const r = Math.round(40 + h * 210), g = Math.round(60 + (1 - Math.abs(h - 0.5) * 2) * 150), b = Math.round(230 - h * 200);
      return `rgb(${r},${g},${b})`;
    }
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">${sliderRow("af_t", "時間 (ms)", 0, 300, 10, state.t, (v) => v.toFixed(0) + " ms")}</div>
      <div class="widget-stage"><div id="af_plot"></div></div>
      ${readoutRow([{ id: "af_v", label: "観察", value: "—" }, { id: "af_h", label: "高さスケール", value: "—" }])}
      <p class="widget-note">高さをカラーで表したAFM像。<b>機能中のタンパク質が形を変えながら動く</b>様子を動画観察できます（染色不要・水中）。色＝基板からの高さです。</p>`;
    function draw() {
      const W2 = 440, H2 = 220, s = darkPanel(document.getElementById("af_plot"), W2, H2, "#04060c");
      const phase = state.t / 300 * Math.PI * 2;
      // two-domain molecule; one domain swings
      const cx = 200, cy = 110;
      const cols = 30, rows = 15, cw = 12, ch = 12, ox = cx - cols * cw / 2, oy = cy - rows * ch / 2;
      // domain A center fixed, domain B swings
      const bx = cx + 46 * Math.cos(phase), by = cy + 30 * Math.sin(phase);
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const px = ox + i * cw + cw / 2, py = oy + j * ch + ch / 2;
        const dA = Math.hypot(px - (cx - 30), py - cy), dB = Math.hypot(px - bx, py - by);
        let h = Math.exp(-Math.pow(dA / 26, 2)) + 0.9 * Math.exp(-Math.pow(dB / 22, 2));
        h = clamp(h, 0, 1);
        if (h > 0.06) add(s, "rect", { x: ox + i * cw, y: oy + j * ch, width: cw - 1, height: ch - 1, fill: heightColor(h), opacity: 0.35 + h * 0.6 });
      }
      // color scale bar
      for (let k = 0; k < 40; k++) add(s, "rect", { x: 360 + 0, y: 190 - k * 3, width: 14, height: 3, fill: heightColor(k / 40) });
      add(s, "text", { x: 380, y: 200, "font-size": 8, fill: "#8aa0b0", text: "低" });
      add(s, "text", { x: 380, y: 74, "font-size": 8, fill: "#8aa0b0", text: "高" });
      const openness = (Math.cos(phase) + 1) / 2;
      setReadout("af_v", openness > 0.6 ? "開いた構造" : openness < 0.4 ? "閉じた構造" : "遷移中");
      setReadout("af_h", "青(低)→赤(高)");
    }
    bindSlider("af_t", (v) => v.toFixed(0) + " ms", (v) => { state.t = v; draw(); });
    draw();
  };
})();

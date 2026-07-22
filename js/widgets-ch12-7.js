/* 第12章 発展編 その他：先端装置のインタラクティブ図（後半 t66-t73）
   ローカルヘルパは本ファイル冒頭で共通定義。各widgetは W.<name> を登録する。 */
(function () {
  const { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout } = WCORE;
  const W = window.WIDGETS;
  const MAG = "#d946ef";
  const BLUE = "#3a7bd5";
  const ORANGE = "#f97316";
  const GREEN = "#1f9d6b";
  const GRAY = "#9aa6b4";

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
  // t66 auc — 沈降係数分布 c(s)：単量体・二量体のピーク分離
  // ==========================================================================
  W.auc = function (container) {
    const state = { dimer: 30, broad: 1.0 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("auc_f", "二量体の割合", 0, 100, 5, 30, (v) => v.toFixed(0) + " %")}
        ${sliderRow("auc_b", "拡散の広がり（分解能）", 0.4, 2.6, 0.1, 1.0, (v) => v.toFixed(1) + " ×")}
      </div>
      <div class="widget-stage"><div id="auc_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>単量体</span><span class="li"><span class="sw" style="background:#d946ef"></span>二量体</span></div></div>
      ${readoutRow([{ id: "auc_p", label: "ピーク位置（単量体／二量体）", value: "—" }, { id: "auc_r", label: "二量体の面積比", value: "—" }])}
      <p class="widget-note">溶液中の分子を遠心力で沈降させ、その速度分布を<b>沈降係数 s の分布 c(s)</b>として読みます。二量体の割合を上げると<b>より大きな s の側にもう一つのピーク</b>が立ち、面積が入れ替わります。拡散の広がりを増やすと<b>ピークが太って隣同士が分離できなくなる</b>様子が見えます。</p>`;
    const sMon = 4.5, sDim = 4.5 * Math.pow(2, 2 / 3);
    function draw() {
      const w = 540, h = 268, s = lightPanel(document.getElementById("auc_plot"), w, h);
      const f = state.dimer / 100;
      const sigma = 0.55 * state.broad;
      const x0 = 56, x1 = 512, yb = 208, yt = 44, sMin = 2, sMax = 10;
      const X = (sv) => x0 + ((sv - sMin) / (sMax - sMin)) * (x1 - x0);
      const gM = (sv) => (1 - f) * Math.exp(-0.5 * Math.pow((sv - sMon) / sigma, 2));
      const gD = (sv) => f * Math.exp(-0.5 * Math.pow((sv - sDim) / sigma, 2));
      let maxc = 0.001;
      for (let sv = sMin; sv <= sMax; sv += 0.02) { const c = gM(sv) + gD(sv); if (c > maxc) maxc = c; }
      const Y = (c) => yb - (c / maxc) * (yb - yt);
      for (let sv = 2; sv <= 10; sv += 2) {
        add(s, "line", { x1: X(sv), x2: X(sv), y1: yt, y2: yb, stroke: "#eef1f6", "stroke-width": 1 });
        txt(s, X(sv), yb + 16, sv.toFixed(0), { "text-anchor": "middle", "font-size": 9 });
      }
      add(s, "line", { x1: x0, x2: x1, y1: yb, y2: yb, stroke: "#c7cce0", "stroke-width": 1.2 });
      txt(s, (x0 + x1) / 2, yb + 34, "沈降係数 s（スベドベリ S）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      txt(s, 16, (yb + yt) / 2, "c(s) 分布", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 16 ${(yb + yt) / 2})` });
      const areaPath = (fn) => {
        let d = "M " + X(sMin).toFixed(1) + " " + yb.toFixed(1);
        for (let sv = sMin; sv <= sMax; sv += 0.04) d += " L " + X(sv).toFixed(1) + " " + Y(fn(sv)).toFixed(1);
        d += " L " + X(sMax).toFixed(1) + " " + yb.toFixed(1) + " Z";
        return d;
      };
      add(s, "path", { d: areaPath(gM), fill: BLUE, opacity: 0.20 });
      add(s, "path", { d: areaPath(gD), fill: MAG, opacity: 0.20 });
      let dl = "";
      for (let sv = sMin; sv <= sMax; sv += 0.03) dl += (dl ? " L " : "M ") + X(sv).toFixed(1) + " " + Y(gM(sv) + gD(sv)).toFixed(1);
      add(s, "path", { d: dl, fill: "none", stroke: "#3a4256", "stroke-width": 2.4 });
      if (1 - f > 0.02) {
        add(s, "line", { x1: X(sMon), x2: X(sMon), y1: Y(gM(sMon)), y2: yb, stroke: BLUE, "stroke-dasharray": "4 3", "stroke-width": 1.2 });
        txt(s, X(sMon), Y(gM(sMon)) - 6, "単量体", { "text-anchor": "middle", "font-size": 10, fill: BLUE, "font-weight": 700 });
      }
      if (f > 0.02) {
        add(s, "line", { x1: X(sDim), x2: X(sDim), y1: Y(gD(sDim)), y2: yb, stroke: MAG, "stroke-dasharray": "4 3", "stroke-width": 1.2 });
        txt(s, X(sDim), Y(gD(sDim)) - 6, "二量体", { "text-anchor": "middle", "font-size": 10, fill: MAG, "font-weight": 700 });
      }
      const resolved = (sDim - sMon) > 2.0 * sigma;
      txt(s, x1, yt - 6, resolved ? "2つのピークは分離" : "ピークが重なり分離不可", { "text-anchor": "end", "font-size": 10, fill: resolved ? GREEN : ORANGE, "font-weight": 700 });
      setReadout("auc_p", sMon.toFixed(1) + " S / " + sDim.toFixed(1) + " S");
      setReadout("auc_r", (f * 100).toFixed(0) + " %");
    }
    bindSlider("auc_f", (v) => v.toFixed(0) + " %", (v) => { state.dimer = v; draw(); });
    bindSlider("auc_b", (v) => v.toFixed(1) + " ×", (v) => { state.broad = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t67 nativems — 多価電荷系列と化学量論の梯子
  // ==========================================================================
  W.nativems = function (container) {
    const state = { mass: 80, dimer: 25 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("nm_m", "単量体の質量", 20, 200, 5, 80, (v) => v.toFixed(0) + " kDa")}
        ${sliderRow("nm_f", "二量体の割合", 0, 100, 5, 25, (v) => v.toFixed(0) + " %")}
      </div>
      <div class="widget-stage"><div id="nm_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>単量体の電荷系列</span><span class="li"><span class="sw" style="background:#d946ef"></span>二量体の電荷系列</span></div></div>
      ${readoutRow([{ id: "nm_z", label: "中心の電荷 z", value: "—" }, { id: "nm_d", label: "デコンボリューション質量", value: "—" }])}
      <p class="widget-note">ネイティブESIでは分子が多価に帯電し、<b>電荷の異なるピークが m/z 軸に列</b>をなします。隣接ピークの間隔から<b>電荷 z</b> が、z と m/z から<b>質量</b>が一意に決まります。二量体の割合を上げると<b>高 m/z 側にもう一段の梯子</b>（二量体系列）が現れます。</p>`;
    const PROTON = 1.00728;
    function series(massDa) {
      const z0 = Math.max(3, Math.round(0.0778 * Math.sqrt(massDa)));
      const arr = [];
      for (let z = z0 - 4; z <= z0 + 4; z++) {
        if (z < 1) continue;
        arr.push({ z: z, mz: (massDa + z * PROTON) / z, h: Math.exp(-0.5 * Math.pow((z - z0) / 2.3, 2)) });
      }
      return { z0: z0, arr: arr };
    }
    function draw() {
      const w = 540, h = 272, s = lightPanel(document.getElementById("nm_plot"), w, h);
      const f = state.dimer / 100;
      const monDa = state.mass * 1000, dimDa = monDa * 2;
      const monS = series(monDa), dimS = series(dimDa);
      const allmz = monS.arr.map((p) => p.mz).concat(dimS.arr.map((p) => p.mz));
      const mzMin = Math.min.apply(null, allmz) * 0.9, mzMax = Math.max.apply(null, allmz) * 1.08;
      const x0 = 40, x1 = 516, yb = 210, yt = 46;
      const X = (mz) => x0 + ((mz - mzMin) / (mzMax - mzMin)) * (x1 - x0);
      add(s, "line", { x1: x0, x2: x1, y1: yb, y2: yb, stroke: "#c7cce0", "stroke-width": 1.2 });
      for (let i = 0; i <= 5; i++) {
        const mz = mzMin + (mzMax - mzMin) * i / 5;
        add(s, "line", { x1: X(mz), x2: X(mz), y1: yb, y2: yb + 4, stroke: "#c7cce0", "stroke-width": 1 });
        txt(s, X(mz), yb + 16, (mz / 1000).toFixed(1) + "k", { "text-anchor": "middle", "font-size": 9 });
      }
      txt(s, (x0 + x1) / 2, yb + 34, "m/z", { "text-anchor": "middle", "font-size": 11, fill: "#565f73", "font-weight": 700 });
      txt(s, 15, (yb + yt) / 2, "相対強度", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 15 ${(yb + yt) / 2})` });
      const drawSeries = (SS, col, scale) => {
        SS.arr.forEach((p) => {
          const bh = p.h * scale * (yb - yt);
          if (bh < 1) return;
          add(s, "line", { x1: X(p.mz), x2: X(p.mz), y1: yb, y2: yb - bh, stroke: col, "stroke-width": 3, opacity: 0.9 });
          if (p.h > 0.5) txt(s, X(p.mz), yb - bh - 4, p.z + "+", { "text-anchor": "middle", "font-size": 8.5, fill: col, "font-weight": 700 });
        });
      };
      drawSeries(monS, BLUE, Math.max(0.12, 1 - f) * 0.9);
      drawSeries(dimS, MAG, Math.max(0.05, f) * 0.9);
      const c1 = monS.arr.filter((p) => p.z === monS.z0)[0], c2 = monS.arr.filter((p) => p.z === monS.z0 + 1)[0];
      if (c1 && c2) {
        const yA = yt + 4;
        add(s, "line", { x1: X(c2.mz), x2: X(c1.mz), y1: yA, y2: yA, stroke: "#7b8497", "stroke-width": 1 });
        add(s, "line", { x1: X(c1.mz), x2: X(c1.mz), y1: yA - 3, y2: yA + 3, stroke: "#7b8497", "stroke-width": 1 });
        add(s, "line", { x1: X(c2.mz), x2: X(c2.mz), y1: yA - 3, y2: yA + 3, stroke: "#7b8497", "stroke-width": 1 });
        txt(s, (X(c2.mz) + X(c1.mz)) / 2, yA - 5, "間隔 → z", { "text-anchor": "middle", "font-size": 9, fill: "#7b8497" });
      }
      setReadout("nm_z", "単量体 " + monS.z0 + "+ 付近 ／ 二量体 " + dimS.z0 + "+ 付近");
      setReadout("nm_d", state.mass.toFixed(0) + " kDa（単量体） / " + (state.mass * 2).toFixed(0) + " kDa（二量体）");
    }
    bindSlider("nm_m", (v) => v.toFixed(0) + " kDa", (v) => { state.mass = v; draw(); });
    bindSlider("nm_f", (v) => v.toFixed(0) + " %", (v) => { state.dimer = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t68 ionmobility — m/z × ドリフト時間(CCS) の2次元分離
  // ==========================================================================
  W.ionmobility = function (container) {
    const state = { view: "2d", dccs: 15 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${segRow("im_v", "表示", [{ v: "2d", label: "IM-MS（2次元）" }, { v: "1d", label: "質量スペクトルのみ" }], "2d")}
        ${sliderRow("im_c", "2種の CCS 差", 0, 40, 2, 15, (v) => v.toFixed(0) + " %")}
      </div>
      <div class="widget-stage"><div id="im_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>分子種A（コンパクト）</span><span class="li"><span class="sw" style="background:#f97316"></span>分子種B（広がった形）</span></div></div>
      ${readoutRow([{ id: "im_r", label: "ドリフト方向の分離度", value: "—" }, { id: "im_s", label: "判定", value: "—" }])}
      <p class="widget-note">同じ <b>m/z</b> でも形（<b>衝突断面積 CCS</b>）が違えば、イオン移動度でドリフト時間が変わり分離できます。CCS 差を広げると2種が縦方向に離れます。「質量スペクトルのみ」に切り替えると<b>1本のピークに重なって区別できない</b>ことが分かります。</p>`;
    const mzCenter = 2500, mzMin = 2200, mzMax = 2800;
    function draw() {
      const w = 540, h = 288, s = lightPanel(document.getElementById("im_plot"), w, h);
      const dc = state.dccs / 100;
      const x0 = 62, x1 = 500;
      const X = (mz) => x0 + ((mz - mzMin) / (mzMax - mzMin)) * (x1 - x0);
      if (state.view === "2d") {
        const yb = 232, yt = 40, driftMax = 40;
        const Y = (dt) => yb - (dt / driftMax) * (yb - yt);
        add(s, "line", { x1: x0, x2: x1, y1: yb, y2: yb, stroke: "#c7cce0", "stroke-width": 1.2 });
        add(s, "line", { x1: x0, x2: x0, y1: yt, y2: yb, stroke: "#c7cce0", "stroke-width": 1.2 });
        for (let mz = 2200; mz <= 2800; mz += 150) txt(s, X(mz), yb + 15, String(mz), { "text-anchor": "middle", "font-size": 9 });
        txt(s, (x0 + x1) / 2, yb + 32, "m/z", { "text-anchor": "middle", "font-size": 11, fill: "#565f73", "font-weight": 700 });
        txt(s, 18, (yb + yt) / 2, "ドリフト時間（CCS）→", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 18 ${(yb + yt) / 2})` });
        const spread = 1.4, mzspread = 22;
        const dtA = 15, dtB = 15 + dc * 20;
        const cloud = (dt, col, seed) => {
          const r = CK.makeRng(seed);
          for (let i = 0; i < 60; i++) add(s, "circle", { cx: X(mzCenter + CK.randNormal(0, mzspread, r)), cy: Y(dt + CK.randNormal(0, spread, r)), r: 2.6, fill: col, opacity: 0.5 });
        };
        cloud(dtA, BLUE, 7);
        cloud(dtB, ORANGE, 99);
        txt(s, X(mzCenter) + 34, Y(dtA) + 4, "A", { "font-size": 12, fill: BLUE, "font-weight": 700 });
        txt(s, X(mzCenter) + 34, Y(dtB) + 4, "B", { "font-size": 12, fill: ORANGE, "font-weight": 700 });
        const Rs = Math.abs(dtB - dtA) / (2 * spread);
        setReadout("im_r", Rs.toFixed(2));
        setReadout("im_s", Rs >= 1.0 ? "2種を分離できる" : Rs >= 0.5 ? "部分的に分離" : "分離不可（重なる）");
      } else {
        const yb = 220, yt = 52;
        add(s, "line", { x1: x0, x2: x1, y1: yb, y2: yb, stroke: "#c7cce0", "stroke-width": 1.2 });
        for (let mz = 2200; mz <= 2800; mz += 150) txt(s, X(mz), yb + 15, String(mz), { "text-anchor": "middle", "font-size": 9 });
        txt(s, (x0 + x1) / 2, yb + 32, "m/z", { "text-anchor": "middle", "font-size": 11, fill: "#565f73", "font-weight": 700 });
        txt(s, 18, (yb + yt) / 2, "強度", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 18 ${(yb + yt) / 2})` });
        let d = "";
        for (let mz = mzMin; mz <= mzMax; mz += 4) {
          const v = Math.exp(-0.5 * Math.pow((mz - mzCenter) / 34, 2));
          d += (d ? " L " : "M ") + X(mz).toFixed(1) + " " + (yb - v * (yb - yt)).toFixed(1);
        }
        add(s, "path", { d: d + " L " + X(mzMax).toFixed(1) + " " + yb + " L " + X(mzMin).toFixed(1) + " " + yb + " Z", fill: MAG, opacity: 0.12 });
        add(s, "path", { d: d, fill: "none", stroke: "#3a4256", "stroke-width": 2.6 });
        txt(s, X(mzCenter), yt - 8, "A と B が重なった1本のピーク", { "text-anchor": "middle", "font-size": 10.5, fill: ORANGE, "font-weight": 700 });
        setReadout("im_r", "—（1次元では測れない）");
        setReadout("im_s", "m/z が同じなので区別できない");
      }
    }
    bindSeg("im_v", (v) => { state.view = v; draw(); });
    bindSlider("im_c", (v) => v.toFixed(0) + " %", (v) => { state.dccs = v; draw(); });
    draw();
  };

  // ==========================================================================
  // t69 simoa — デジタルELISA：ポアソン単一分子計数と飽和（デジタル→アナログ）
  // ==========================================================================
  W.simoa = function (container) {
    const state = { aeb: 1.0 };
    const COLS = 16, ROWS = 12;
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("sm_l", "濃度（1ビーズあたりの平均酵素数 AEB）", 0.02, 6, 0.02, 1.0, (v) => v.toFixed(2) + " 酵素/ビーズ")}
      </div>
      <div class="widget-stage"><div id="sm_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>点灯（酵素1個以上）</span><span class="li"><span class="sw" style="background:#dfe4ee"></span>消灯（酵素0個）</span></div></div>
      ${readoutRow([{ id: "sm_p", label: "点灯割合 f_on", value: "—" }, { id: "sm_e", label: "推定 AEB = −ln(1−f_on)", value: "—" }])}
      <p class="widget-note">酵素標識された標的はビーズに<b>ポアソン分布</b>で分配され、微小反応槽に封じられます。消灯の割合 e^(−AEB) から <b>AEB = −ln(1−f_on)</b> を逆算する<b>デジタル計数</b>です。濃度を上げて f_on が1に近づくと、<b>ほぼ全ビーズが点灯して計数が飽和</b>し、この先は<b>アナログ測定</b>の領域になります。</p>`;
    function poiss(rng, lam) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= rng(); } while (p > L); return k - 1; }
    function draw() {
      const w = 540, h = 300, s = lightPanel(document.getElementById("sm_plot"), w, h);
      const lam = state.aeb;
      const rng = CK.makeRng(2024);
      const gx = 26, gy = 46, cell = 16, gap = 2.4;
      const N = COLS * ROWS;
      let pos = 0;
      txt(s, gx, gy - 16, "ビーズ（点灯 / 消灯）", { "font-size": 10.5, fill: "#565f73", "font-weight": 700 });
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const on = poiss(rng, lam) >= 1;
          if (on) pos++;
          const cx = gx + c * (cell + gap) + cell / 2, cy = gy + r * (cell + gap) + cell / 2;
          add(s, "circle", { cx: cx, cy: cy, r: cell / 2 - 1, fill: on ? MAG : "#dfe4ee", opacity: on ? 0.9 : 1, stroke: "#c7cce0", "stroke-width": 0.6 });
        }
      }
      const pObs = pos / N;
      const aebEst = pObs >= 1 ? Infinity : -Math.log(1 - pObs);
      // 右側：f_on = 1 − e^(−AEB) の曲線と飽和域
      const cx0 = 330, cx1 = 512, cyb = 210, cyt = 56;
      const LX = (l) => cx0 + (l / 6) * (cx1 - cx0);
      const PY = (pp) => cyb - pp * (cyb - cyt);
      add(s, "rect", { x: cx0, y: PY(1), width: cx1 - cx0, height: PY(0.9) - PY(1), fill: ORANGE, opacity: 0.14 });
      txt(s, (cx0 + cx1) / 2, PY(0.955) + 3, "飽和→アナログ", { "text-anchor": "middle", "font-size": 8.5, fill: ORANGE, "font-weight": 700 });
      add(s, "line", { x1: cx0, x2: cx1, y1: cyb, y2: cyb, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: cx0, x2: cx0, y1: cyt, y2: cyb, stroke: "#c7cce0", "stroke-width": 1.2 });
      [0, 2, 4, 6].forEach((l) => txt(s, LX(l), cyb + 14, String(l), { "text-anchor": "middle", "font-size": 8.5 }));
      [0, 0.5, 1].forEach((pp) => txt(s, cx0 - 5, PY(pp) + 3, pp.toFixed(1), { "text-anchor": "end", "font-size": 8.5 }));
      txt(s, (cx0 + cx1) / 2, cyb + 28, "AEB（酵素/ビーズ）", { "text-anchor": "middle", "font-size": 9.5, fill: "#565f73", "font-weight": 700 });
      txt(s, cx0 - 22, (cyt + cyb) / 2, "点灯割合 f_on", { "text-anchor": "middle", "font-size": 9.5, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 ${cx0 - 22} ${(cyt + cyb) / 2})` });
      let d = "";
      for (let l = 0; l <= 6; l += 0.05) d += (d ? " L " : "M ") + LX(l).toFixed(1) + " " + PY(1 - Math.exp(-l)).toFixed(1);
      add(s, "path", { d: d, fill: "none", stroke: MAG, "stroke-width": 2.4 });
      add(s, "circle", { cx: LX(lam), cy: PY(1 - Math.exp(-lam)), r: 5, fill: MAG });
      setReadout("sm_p", (pObs * 100).toFixed(1) + " %");
      setReadout("sm_e", pObs >= 0.995 ? "飽和：デジタル計数不能" : aebEst.toFixed(2) + " 酵素/ビーズ" + (pObs > 0.9 ? "（飽和に近く不確か）" : ""));
    }
    bindSlider("sm_l", (v) => v.toFixed(2) + " 酵素/ビーズ", (v) => { state.aeb = v; draw(); });
    draw();
  };

/* W.<fn> = function (container) {...}; を widgets ファイル内（共通ヘルパ定義済みスコープ）に置く */

  W.droplet = function (container) {
    const state = { lambda: 0.6, q: 8 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("dp_l", "細胞負荷 λ（1液滴あたりの平均細胞数）", 0.05, 3, 0.05, 0.6, (v) => v.toFixed(2) + " 個/滴")}
        ${sliderRow("dp_q", "流量比（連続相／分散相）", 2, 20, 1, 8, (v) => v.toFixed(0) + " : 1")}
      </div>
      <div class="widget-stage"><div id="dp_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#dbe4f2"></span>0個（空）</span><span class="li"><span class="sw" style="background:#d946ef"></span>1個（単一封入）</span><span class="li"><span class="sw" style="background:#f97316"></span>2個以上（ダブレット）</span></div></div>
      ${readoutRow([{ id: "dp_s", label: "単一封入率 P(1)", value: "—" }, { id: "dp_d", label: "ダブレット率 P(≥2)", value: "—" }])}
      <p class="widget-note">1滴あたりの平均細胞数<b>λ</b>を動かすと、封入数の分布はポアソン分布に従います。<b>λを小さくするとダブレット（2個以上）は減りますが、大半の液滴が空になり無駄が増えます</b>。単一封入率P(1)はλ=1で最大でも約37%どまりです。流量比を上げると液滴は小さく・生成頻度は高くなります。</p>`;
    function fact(k) { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; }
    function pois(k, lam) { return Math.exp(-lam) * Math.pow(lam, k) / fact(k); }
    function draw() {
      const w = 540, h = 300, s = lightPanel(document.getElementById("dp_plot"), w, h);
      const lam = state.lambda;
      const p0 = pois(0, lam), p1 = pois(1, lam), p2 = clamp(1 - p0 - p1, 0, 1);
      // --- flow-focusing junction + droplet train (top) ---
      txt(s, 22, 24, "フローフォーカシングで生成された液滴の列（占有はλのポアソン分布）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "rect", { x: 20, y: 66, width: 74, height: 12, rx: 3, fill: "#cfe0f5" });
      txt(s, 22, 58, "細胞＋試薬（水相）", { "font-size": 9, fill: "#5a6376" });
      add(s, "path", { d: "M 58 40 L 96 66", stroke: "#e0c9a6", "stroke-width": 8, "stroke-linecap": "round" });
      add(s, "path", { d: "M 58 104 L 96 78", stroke: "#e0c9a6", "stroke-width": 8, "stroke-linecap": "round" });
      txt(s, 36, 118, "油相", { "font-size": 9, fill: "#a98d5e" });
      const r = clamp(16.5 - state.q * 0.42, 8, 15);
      const rng = CK.makeRng(17);
      const n = 12, x0 = 118, dx = (516 - x0) / n, cy = 72;
      for (let i = 0; i < n; i++) {
        const cx = x0 + dx * i + dx / 2;
        const u = rng();
        const occ = u < p0 ? 0 : u < p0 + p1 ? 1 : 2;
        const ring = occ === 0 ? "#b9c8de" : occ === 1 ? MAG : ORANGE;
        add(s, "circle", { cx: cx, cy: cy, r: r, fill: "#eef4fb", stroke: ring, "stroke-width": 2.2 });
        if (occ === 1) add(s, "circle", { cx: cx, cy: cy, r: 3.4, fill: MAG });
        if (occ === 2) { add(s, "circle", { cx: cx - 4, cy: cy - 2, r: 3.2, fill: ORANGE }); add(s, "circle", { cx: cx + 4, cy: cy + 2, r: 3.2, fill: ORANGE }); }
      }
      const dRel = Math.round(100 * (r / 15));
      const fRel = Math.round(20 + state.q * 9);
      txt(s, 118, 104, "液滴径 " + dRel + "（相対）　生成頻度 " + fRel + "（相対）", { "font-size": 9.5, fill: "#7b8497" });
      // --- occupancy bar chart (bottom) ---
      const bx = 70, gap2 = 150, bw2 = 120, by = 150, maxH = 96, baseY = by + maxH;
      txt(s, 22, by - 8, "封入数の分布（ポアソン）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "line", { x1: 40, x2: 516, y1: baseY, y2: baseY, stroke: "#c7cce0", "stroke-width": 1.2 });
      [["0個（空）", p0, "#b9c8de", "#5a6376"], ["1個（単一）", p1, MAG, MAG], ["2個以上", p2, ORANGE, ORANGE]].forEach((b, i) => {
        const x = bx + i * gap2;
        const bh = clamp(b[1], 0, 1) * maxH;
        add(s, "rect", { x: x, y: baseY - bh, width: bw2, height: bh, rx: 4, fill: b[2], opacity: 0.9 });
        txt(s, x + bw2 / 2, baseY - bh - 6, (b[1] * 100).toFixed(1) + " %", { "text-anchor": "middle", "font-size": 10.5, fill: b[3], "font-weight": 700 });
        txt(s, x + bw2 / 2, baseY + 15, b[0], { "text-anchor": "middle", "font-size": 10, fill: "#4a5468" });
      });
      const occSingle = p1 / Math.max(1e-6, 1 - p0);
      txt(s, 40, baseY + 33, "占有された液滴のうち単一封入の割合＝" + (occSingle * 100).toFixed(0) + " %（λが小さいほど高い）", { "font-size": 9.5, fill: "#7b8497" });
      setReadout("dp_s", (p1 * 100).toFixed(1) + " %");
      setReadout("dp_d", (p2 * 100).toFixed(1) + " %");
    }
    bindSlider("dp_l", (v) => v.toFixed(2) + " 個/滴", (v) => { state.lambda = v; draw(); });
    bindSlider("dp_q", (v) => v.toFixed(0) + " : 1", (v) => { state.q = v; draw(); });
    draw();
  };

  W.sers = function (container) {
    const state = { gap: 2, cexp: -9 };
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("sr_g", "ナノ粒子間のギャップ距離", 0.5, 20, 0.5, 2, (v) => v.toFixed(1) + " nm")}
        ${sliderRow("sr_c", "分析種の濃度（対数）", -12, -6, 0.5, -9, (v) => "10^" + v.toFixed(1) + " M")}
      </div>
      <div class="widget-stage"><div id="sr_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>SERSスペクトル</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>通常のラマン（増強なし）</span></div></div>
      ${readoutRow([{ id: "sr_e", label: "増強因子 EF", value: "—" }, { id: "sr_r", label: "検出領域", value: "—" }])}
      <p class="widget-note">増強は<b>ナノ粒子の隙間（ホットスポット）</b>に集中し、増強因子EFは電場の4乗（|E|⁴）に比例します。<b>ギャップをわずかに詰めるだけでEFは桁で跳ね上がり</b>、指紋ピークが立ち上がります。濃度はピーク高さを、ギャップは増強の大きさを決めます。</p>`;
    const PEAKS = [{ c: 610, a: 0.45 }, { c: 775, a: 0.35 }, { c: 1185, a: 0.6 }, { c: 1310, a: 0.55 }, { c: 1360, a: 0.85 }, { c: 1510, a: 1.0 }, { c: 1575, a: 0.72 }, { c: 1650, a: 0.5 }];
    function log10EF(gap) { return 4 + 7 * Math.exp(-(gap - 0.5) / 3.0); }
    function draw() {
      const w = 540, h = 300, s = lightPanel(document.getElementById("sr_plot"), w, h);
      const lef = log10EF(state.gap);
      const efN = clamp((lef - 4) / 7, 0, 1);
      const sVal = efN * clamp((state.cexp + 12) / 6, 0, 1);
      // --- nanoparticle dimer schematic (top-left) ---
      txt(s, 22, 24, "ナノ粒子ダイマーとホットスポット", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      const npy = 80, npr = 30, gapPx = clamp(6 + state.gap * 2.2, 7, 40);
      const cxL = 120 - gapPx / 2 - npr, cxR = 120 + gapPx / 2 + npr;
      add(s, "ellipse", { cx: 120, cy: npy, rx: gapPx / 2 + 6, ry: 15, fill: MAG, opacity: 0.10 + 0.5 * efN });
      add(s, "circle", { cx: cxL, cy: npy, r: npr, fill: "#f0c14b", stroke: "#c99a2e", "stroke-width": 1.4 });
      add(s, "circle", { cx: cxR, cy: npy, r: npr, fill: "#f0c14b", stroke: "#c99a2e", "stroke-width": 1.4 });
      add(s, "line", { x1: 120 - gapPx / 2, x2: 120 + gapPx / 2, y1: npy + npr + 8, y2: npy + npr + 8, stroke: "#7b8497", "stroke-width": 1 });
      txt(s, 120, npy + npr + 22, "ギャップ " + state.gap.toFixed(1) + " nm", { "text-anchor": "middle", "font-size": 9.5, fill: "#5a6376" });
      txt(s, 120, 42, "EF ≈ 10^" + lef.toFixed(1), { "text-anchor": "middle", "font-size": 11, fill: MAG, "font-weight": 700 });
      // --- EF vs gap curve (top-right) ---
      const gx = 300, gy = 46, gw = 210, gh = 92;
      txt(s, gx, gy - 10, "増強因子EF（対数）とギャップ", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "line", { x1: gx, x2: gx, y1: gy, y2: gy + gh, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: gx, x2: gx + gw, y1: gy + gh, y2: gy + gh, stroke: "#c7cce0", "stroke-width": 1.2 });
      const gX = (g) => gx + ((g - 0.5) / 19.5) * gw;
      const gY = (le) => gy + gh - ((le - 4) / 7) * gh;
      let dPath = "";
      for (let g = 0.5; g <= 20; g += 0.25) dPath += (dPath ? " L " : "M ") + gX(g).toFixed(1) + " " + gY(log10EF(g)).toFixed(1);
      add(s, "path", { d: dPath, fill: "none", stroke: MAG, "stroke-width": 2.4 });
      add(s, "circle", { cx: gX(state.gap), cy: gY(lef), r: 4.5, fill: MAG });
      [4, 7, 11].forEach((le) => txt(s, gx - 5, gY(le) + 3, "10^" + le, { "text-anchor": "end", "font-size": 8.5 }));
      [0.5, 5, 10, 20].forEach((g) => txt(s, gX(g), gy + gh + 12, g + "nm", { "text-anchor": "middle", "font-size": 8.5 }));
      // --- Raman spectrum (bottom) ---
      const sx = 54, sy = 170, sw = 462, sh = 102, baseY = sy + sh;
      txt(s, 22, sy - 6, "ラマンスペクトル（強度 対 ラマンシフト）", { "font-size": 11, fill: "#565f73", "font-weight": 700 });
      add(s, "line", { x1: sx, x2: sx + sw, y1: baseY, y2: baseY, stroke: "#c7cce0", "stroke-width": 1.2 });
      add(s, "line", { x1: sx, x2: sx, y1: sy, y2: baseY, stroke: "#c7cce0", "stroke-width": 1.2 });
      txt(s, sx + sw / 2, baseY + 24, "ラマンシフト (cm⁻¹)", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700 });
      txt(s, 16, sy + sh / 2, "強度（相対）", { "text-anchor": "middle", "font-size": 10, fill: "#565f73", "font-weight": 700, transform: `rotate(-90 16 ${sy + sh / 2})` });
      [400, 800, 1200, 1600].forEach((cm) => txt(s, sx + ((cm - 400) / 1400) * sw, baseY + 13, String(cm), { "text-anchor": "middle", "font-size": 8.5 }));
      const specX = (cm) => sx + ((cm - 400) / 1400) * sw;
      const intensity = (cm, amp) => {
        let y = 0;
        PEAKS.forEach((p) => { const hw = 13; y += p.a * amp / (1 + Math.pow((cm - p.c) / hw, 2)); });
        return y;
      };
      let dN = "";
      for (let cm = 400; cm <= 1800; cm += 4) { const yv = intensity(cm, 0.03); dN += (dN ? " L " : "M ") + specX(cm).toFixed(1) + " " + (baseY - clamp(yv, 0, 1) * sh).toFixed(1); }
      add(s, "path", { d: dN, fill: "none", stroke: GRAY, "stroke-width": 1.4, opacity: 0.8 });
      let dS = "";
      for (let cm = 400; cm <= 1800; cm += 3) { const yv = intensity(cm, sVal); dS += (dS ? " L " : "M ") + specX(cm).toFixed(1) + " " + (baseY - clamp(yv, 0, 1) * sh).toFixed(1); }
      add(s, "path", { d: dS, fill: "none", stroke: MAG, "stroke-width": 2.2 });
      setReadout("sr_e", "10^" + lef.toFixed(1));
      setReadout("sr_r", lef >= 8 ? "単一分子検出も可能な領域" : lef >= 6 ? "微量検出に有効" : "増強は限定的");
    }
    bindSlider("sr_g", (v) => v.toFixed(1) + " nm", (v) => { state.gap = v; draw(); });
    bindSlider("sr_c", (v) => "10^" + v.toFixed(1) + " M", (v) => { state.cexp = v; draw(); });
    draw();
  };

  W.nvsensing = function (container) {
    const state = { B: 3, dT: 0 };
    const GAMMA = 28.0; // MHz / mT
    const D0 = 2870;    // MHz
    container.innerHTML = `
      <div class="w-controls" style="margin-bottom:14px">
        ${sliderRow("nv_b", "磁場 B（NV軸方向成分）", 0, 10, 0.5, 3, (v) => v.toFixed(1) + " mT")}
        ${sliderRow("nv_t", "温度変化 ΔT", -50, 50, 5, 0, (v) => (v > 0 ? "+" : "") + v.toFixed(0) + " K")}
      </div>
      <div class="widget-stage"><div id="nv_plot"></div>
        <div class="legend-row"><span class="li"><span class="sw" style="background:#d946ef"></span>ODMRスペクトル（蛍光）</span><span class="li"><span class="sw" style="background:#9aa6b4"></span>D = 2.87 GHz（無磁場中心）</span></div></div>
      ${readoutRow([{ id: "nv_s", label: "2本のディップの分裂幅 Δf", value: "—" }, { id: "nv_e", label: "そこから求まる磁場 B", value: "—" }])}
      <p class="widget-note">NV中心の蛍光は、掃引したマイクロ波が共鳴周波数に一致すると落ち込みます。無磁場では2.87 GHzに1本ですが、<b>磁場をかけると±γB（γ≈28 MHz/mT）だけ左右に分裂して2本</b>になります。分裂幅は磁場だけで決まり、<b>温度は2本を一緒に平行移動</b>させます（磁場と温度を切り分けられる理由です）。</p>`;
    function draw() {
      const D = D0 - 0.074 * state.dT;   // MHz, dD/dT ≈ -74 kHz/K
      const half = GAMMA * state.B;       // half-splitting
      const fm = D - half, fp = D + half;
      const ctx = CK.plot(document.getElementById("nv_plot"), {
        width: 520, height: 272, margin: { top: 22, right: 20, bottom: 48, left: 62 },
        xDomain: [2560, 3180], yDomain: [0.64, 1.03], xTicks: 4, yTicks: 4,
        xLabel: "マイクロ波周波数 (MHz)", yLabel: "蛍光強度（規格化）",
        xFmt: (v) => v.toFixed(0), yFmt: (v) => v.toFixed(2),
      });
      const C = 0.16, hw = 8; // contrast depth, half-width MHz
      const dip = (f) => {
        const l1 = 1 / (1 + Math.pow((f - fm) / hw, 2));
        const l2 = 1 / (1 + Math.pow((f - fp) / hw, 2));
        return 1 - C * (l1 + l2);
      };
      CK.vline(ctx, D0, { stroke: GRAY, "stroke-dasharray": "5 4" });
      CK.vline(ctx, fm, { stroke: "#c7cce0", "stroke-dasharray": "3 3" });
      CK.vline(ctx, fp, { stroke: "#c7cce0", "stroke-dasharray": "3 3" });
      const pts = [];
      for (let f = 2560; f <= 3180; f += 2) pts.push([f, clamp(dip(f), 0.64, 1.03)]);
      CK.line(ctx, pts, { stroke: MAG, "stroke-width": 2.6 });
      CK.textPx(ctx, ctx.x(fm), ctx.y(0.90), "f₋", { "text-anchor": "middle", "font-size": ctx.fs(11), fill: MAG, "font-weight": 700 });
      CK.textPx(ctx, ctx.x(fp), ctx.y(0.90), "f₊", { "text-anchor": "middle", "font-size": ctx.fs(11), fill: MAG, "font-weight": 700 });
      CK.textPx(ctx, ctx.x(D0), ctx.margin.top + 12, "D = 2.87 GHz", { "text-anchor": "middle", "font-size": ctx.fs(10), fill: "#7b8497" });
      CK.textPx(ctx, ctx.margin.left + 8, ctx.margin.top + 12, "分裂幅 Δf = 2γB", { "font-size": ctx.fs(10.5), fill: "#565f73", "font-weight": 700 });
      setReadout("nv_s", (2 * half).toFixed(0) + " MHz");
      setReadout("nv_e", state.B.toFixed(2) + " mT");
    }
    bindSlider("nv_b", (v) => v.toFixed(1) + " mT", (v) => { state.B = v; draw(); });
    bindSlider("nv_t", (v) => (v > 0 ? "+" : "") + v.toFixed(0) + " K", (v) => { state.dT = v; draw(); });
    draw();
  };

W.hcs = function (container) {
  const state = { sep: 50, sigma: 4 };
  container.innerHTML = `
    <div class="w-controls" style="margin-bottom:14px">
      ${sliderRow("hcs_d", "対照間の分離 |μ_p − μ_n|", 5, 60, 5, 50, (v) => v.toFixed(0))}
      ${sliderRow("hcs_s", "各対照のばらつき σ", 2, 20, 1, 4, (v) => "σ = " + v.toFixed(0))}
    </div>
    <div class="widget-stage"><div id="hcs_plot"></div>
      <div class="legend-row"><span class="li"><span class="sw" style="background:#3a7bd5"></span>陰性対照</span><span class="li"><span class="sw" style="background:#d946ef"></span>陽性対照</span><span class="li"><span class="sw" style="background:#1f9d6b"></span>アッセイの窓（±3σが離れる）</span></div></div>
    ${readoutRow([{ id: "hcs_z", label: "Z' ファクター", value: "—" }, { id: "hcs_w", label: "判定", value: "—" }])}
    <p class="widget-note">ヒットを拾える系かどうかは<b>Z'ファクター</b>で決まります。<b>分離</b>（平均の差）を保ったまま<b>ばらつきσ</b>を大きくすると2つの分布が重なり、Z'は0.5を割り、やがて0を下回って<b>使えない系</b>になります。1細胞のばらつきをウェル平均に集約するとσが縮み、窓が開きます。</p>`;
  function draw() {
    const w = 540, h = 300, s = lightPanel(document.getElementById("hcs_plot"), w, h);
    const D = Math.max(1, state.sep), sg = Math.max(0.5, state.sigma);   // 分母・幅のガード
    const muN = 50 - D / 2, muP = 50 + D / 2;
    const plotL = 50, plotR = 516, plotW = plotR - plotL;
    const baseY = 214, topY = 48, Hc = 150;                              // 曲線ピークは baseY-Hc = 64
    const xPix = (v) => plotL + (clamp(v, 0, 100) / 100) * plotW;
    const gauss = (x, mu) => Math.exp(-0.5 * Math.pow((x - mu) / sg, 2)); // ピーク正規化（sg>0で安全）
    const zp = 1 - 3 * (2 * sg) / D;                                      // = 1 − 6σ/D
    const zcol = zp > 0.5 ? GREEN : zp > 0 ? ORANGE : "#ef5350";
    const zlabel = zp > 0.5 ? "良好なスクリーニング系" : zp > 0 ? "境界的（要改善）" : "使えない（分布が重なる）";
    const zDisp = zp < -2 ? "< −2" : zp.toFixed(2);

    // --- 上端の Z' ステータス行（曲線より上、常に空き）---
    txt(s, plotL, 30, "Z' = " + zDisp, { "font-size": 17, fill: zcol, "font-weight": 800 });
    txt(s, plotL + 108, 30, "（" + zlabel + "）", { "font-size": 11, fill: zcol, "font-weight": 700 });

    // --- ±3σ 帯（曲線の背景）---
    add(s, "rect", { x: xPix(muN - 3 * sg), y: topY, width: xPix(muN + 3 * sg) - xPix(muN - 3 * sg), height: baseY - topY, fill: BLUE, opacity: 0.06 });
    add(s, "rect", { x: xPix(muP - 3 * sg), y: topY, width: xPix(muP + 3 * sg) - xPix(muP - 3 * sg), height: baseY - topY, fill: MAG, opacity: 0.06 });

    // --- アッセイの窓（すき間）または 重なり ---
    const innerN = muN + 3 * sg, innerP = muP - 3 * sg;
    if (innerP > innerN) {
      add(s, "rect", { x: xPix(innerN), y: topY, width: xPix(innerP) - xPix(innerN), height: baseY - topY, fill: GREEN, opacity: 0.16 });
      if (xPix(innerP) - xPix(innerN) > 46) txt(s, (xPix(innerN) + xPix(innerP)) / 2, baseY - 8, "アッセイの窓", { "text-anchor": "middle", "font-size": 10, fill: "#1f7d55", "font-weight": 700 });
    } else {
      add(s, "rect", { x: xPix(innerP), y: topY, width: xPix(innerN) - xPix(innerP), height: baseY - topY, fill: "#ef5350", opacity: 0.14 });
      txt(s, (xPix(innerP) + xPix(innerN)) / 2, baseY - 8, "分布が重なる", { "text-anchor": "middle", "font-size": 10, fill: "#d64545", "font-weight": 700 });
    }

    // --- x軸 ---
    add(s, "line", { x1: plotL, x2: plotR, y1: baseY, y2: baseY, stroke: "#c7cce0", "stroke-width": 1.2 });
    for (let v = 0; v <= 100; v += 20) {
      const x = xPix(v);
      add(s, "line", { x1: x, x2: x, y1: baseY, y2: baseY + 4, stroke: "#c7cce0", "stroke-width": 1 });
      txt(s, x, baseY + 16, String(v), { "text-anchor": "middle", "font-size": 9 });
    }
    txt(s, (plotL + plotR) / 2, baseY + 32, "アッセイのシグナル（1ウェルの集約値・任意単位）", { "text-anchor": "middle", "font-size": 10.5, fill: "#565f73", "font-weight": 700 });

    // --- 2つの分布曲線 ---
    const curve = (mu, col) => {
      let d = "";
      for (let x = 0; x <= 100; x += 0.5) {
        const px = xPix(x), py = baseY - gauss(x, mu) * Hc;
        d += (d ? " L " : "M ") + px.toFixed(1) + " " + py.toFixed(1);
      }
      add(s, "path", { d: d, fill: "none", stroke: col, "stroke-width": 2.4 });
    };
    curve(muN, BLUE);
    curve(muP, MAG);
    add(s, "line", { x1: xPix(muN), x2: xPix(muN), y1: baseY - Hc, y2: baseY, stroke: BLUE, "stroke-width": 1.3, "stroke-dasharray": "4 3" });
    add(s, "line", { x1: xPix(muP), x2: xPix(muP), y1: baseY - Hc, y2: baseY, stroke: MAG, "stroke-width": 1.3, "stroke-dasharray": "4 3" });
    txt(s, xPix(muN), baseY - Hc - 6, "陰性対照", { "text-anchor": "middle", "font-size": 10, fill: BLUE, "font-weight": 700 });
    txt(s, xPix(muP), baseY - Hc - 6, "陽性対照", { "text-anchor": "middle", "font-size": 10, fill: MAG, "font-weight": 700 });

    setReadout("hcs_z", zDisp);
    setReadout("hcs_w", zlabel);
  }
  bindSlider("hcs_d", (v) => v.toFixed(0), (v) => { state.sep = v; draw(); });
  bindSlider("hcs_s", (v) => "σ = " + v.toFixed(0), (v) => { state.sigma = v; draw(); });
  draw();
};
})();

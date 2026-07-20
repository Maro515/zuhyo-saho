/* ==========================================================================
   CK — tiny stats + SVG chart toolkit shared by every interactive widget.
   No dependencies. Everything renders as inline SVG so it stays crisp and
   fully offline.
   ========================================================================== */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) {
      for (const k in attrs) {
        if (attrs[k] === undefined || attrs[k] === null) continue;
        if (k === "text") { e.textContent = attrs[k]; continue; }
        e.setAttribute(k, attrs[k]);
      }
    }
    return e;
  }
  function append(parent, ...kids) {
    kids.flat().forEach((k) => { if (k) parent.appendChild(k); });
    return parent;
  }

  // ---------------------------------------------------------------- stats --
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const mean = (a) => sum(a) / a.length;
  const variance = (a) => {
    if (a.length < 2) return 0;
    const m = mean(a);
    return sum(a.map((v) => (v - m) ** 2)) / (a.length - 1);
  };
  const sd = (a) => Math.sqrt(variance(a));
  const sem = (a) => sd(a) / Math.sqrt(a.length);

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) { return seed === undefined ? Math.random : mulberry32(seed); }
  function randNormal(mu = 0, sigma = 1, rng = Math.random) {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function normalSample(n, mu, sigma, rng = Math.random) {
    return Array.from({ length: n }, () => randNormal(mu, sigma, rng));
  }

  function logGamma(x) {
    const g = 7;
    const c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
    ];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    x -= 1;
    let a = c[0];
    const t = x + g + 0.5;
    for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function betacf(x, a, b) {
    const MAXIT = 200, EPS = 3e-9, FPMIN = 1e-30;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= MAXIT; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }
  function regIncompleteBeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return (bt * betacf(x, a, b)) / a;
    return 1 - (bt * betacf(1 - x, b, a)) / b;
  }
  function erf(x) {
    const sign = x < 0 ? -1 : 1; x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  const normalCDF = (z, mu = 0, sigma = 1) => 0.5 * (1 + erf((z - mu) / (sigma * Math.SQRT2)));
  const normalPDF = (x, mu = 0, sigma = 1) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
  const Z975 = 1.9599639845400545;

  function tTwoSidedP(t, df) { return regIncompleteBeta(df / (df + t * t), df / 2, 0.5); }
  function fUpperP(f, d1, d2) { if (f <= 0) return 1; return 1 - regIncompleteBeta((d1 * f) / (d1 * f + d2), d1 / 2, d2 / 2); }
  function tCritical(df, alpha = 0.05) {
    let lo = 0, hi = 80;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (tTwoSidedP(mid, df) > alpha) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function welchT(a, b) {
    const ma = mean(a), mb = mean(b), va = variance(a), vb = variance(b), na = a.length, nb = b.length;
    const se = Math.sqrt(va / na + vb / nb);
    const t = (ma - mb) / se;
    const df = (va / na + vb / nb) ** 2 / ((va / na) ** 2 / (na - 1) + (vb / nb) ** 2 / (nb - 1));
    return { t, df, p: tTwoSidedP(Math.abs(t), df), se, meanA: ma, meanB: mb, diff: ma - mb };
  }
  function pooledT(a, b) {
    const ma = mean(a), mb = mean(b), na = a.length, nb = b.length;
    const sp2 = ((na - 1) * variance(a) + (nb - 1) * variance(b)) / (na + nb - 2);
    const se = Math.sqrt(sp2 * (1 / na + 1 / nb));
    const t = (ma - mb) / se;
    const df = na + nb - 2;
    return { t, df, p: tTwoSidedP(Math.abs(t), df), se, meanA: ma, meanB: mb, diff: ma - mb };
  }
  function oneWayANOVA(groups) {
    const all = groups.flat();
    const grand = mean(all), k = groups.length, N = all.length;
    let ssB = 0, ssW = 0;
    groups.forEach((g) => {
      const m = mean(g);
      ssB += g.length * (m - grand) ** 2;
      g.forEach((v) => (ssW += (v - m) ** 2));
    });
    const df1 = k - 1, df2 = N - k;
    const msB = ssB / df1, msW = ssW / df2;
    const F = msB / msW;
    return { F, df1, df2, p: fUpperP(F, df1, df2), ssB, ssW, msB, msW };
  }

  function rankArray(arr) {
    const idx = arr.map((_, i) => i).sort((a, b) => arr[a] - arr[b]);
    const ranks = new Array(arr.length);
    let i = 0;
    while (i < idx.length) {
      let j = i;
      while (j + 1 < idx.length && arr[idx[j + 1]] === arr[idx[i]]) j++;
      const avg = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) ranks[idx[k]] = avg;
      i = j + 1;
    }
    return ranks;
  }
  function pearsonR(x, y) {
    const mx = mean(x), my = mean(y);
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < x.length; i++) { num += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; }
    return num / Math.sqrt(dx * dy);
  }
  function spearmanRho(x, y) { return pearsonR(rankArray(x), rankArray(y)); }

  function linreg(x, y) {
    const n = x.length, mx = mean(x), my = mean(y);
    let sxx = 0, sxy = 0;
    for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); }
    const slope = sxy / sxx, intercept = my - slope * mx;
    let ssRes = 0, ssTot = 0;
    for (let i = 0; i < n; i++) { const yhat = slope * x[i] + intercept; ssRes += (y[i] - yhat) ** 2; ssTot += (y[i] - my) ** 2; }
    const r2 = 1 - ssRes / ssTot;
    const dof = Math.max(n - 2, 1);
    const mse = ssRes / dof;
    const tcrit = tCritical(dof);
    const seCI = (xv) => Math.sqrt(Math.max(mse * (1 / n + (xv - mx) ** 2 / sxx), 0));
    const sePI = (xv) => Math.sqrt(Math.max(mse * (1 + 1 / n + (xv - mx) ** 2 / sxx), 0));
    return {
      slope, intercept, r2, n, dof, mse,
      predict: (xv) => slope * xv + intercept,
      ciHalf: (xv) => tcrit * seCI(xv),
      piHalf: (xv) => tcrit * sePI(xv),
    };
  }

  function solveLinear(A, b) {
    const n = b.length;
    const M = A.map((row, i) => row.concat([b[i]]));
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      [M[col], M[piv]] = [M[piv], M[col]];
      const pv = M[col][col] || 1e-12;
      for (let c = col; c <= n; c++) M[col][c] /= pv;
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const f = M[r][col];
        for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
      }
    }
    return M.map((row) => row[n]);
  }
  function polyFit(x, y, degree) {
    const n = x.length, p = degree + 1;
    const XtX = Array.from({ length: p }, () => new Array(p).fill(0));
    const Xty = new Array(p).fill(0);
    const pow = x.map((v) => { const arr = [1]; for (let k = 1; k < p; k++) arr.push(arr[k - 1] * v); return arr; });
    for (let i = 0; i < n; i++) {
      for (let r = 0; r < p; r++) {
        Xty[r] += pow[i][r] * y[i];
        for (let c = 0; c < p; c++) XtX[r][c] += pow[i][r] * pow[i][c];
      }
    }
    const beta = solveLinear(XtX, Xty);
    return { coef: beta, predict: (xv) => { let s = 0, pw = 1; for (let k = 0; k < p; k++) { s += beta[k] * pw; pw *= xv; } return s; } };
  }

  function kaplanMeier(rows) {
    const sorted = rows.slice().sort((a, b) => a.t - b.t);
    let atRisk = rows.length, s = 1;
    const steps = [{ t: 0, s: 1, atRisk, d: 0, c: 0 }];
    let i = 0;
    while (i < sorted.length) {
      const t = sorted[i].t;
      let d = 0, c = 0;
      while (i < sorted.length && sorted[i].t === t) { if (sorted[i].event) d++; else c++; i++; }
      if (d > 0) s = s * (1 - d / atRisk);
      steps.push({ t, s, atRisk, d, c });
      atRisk -= d + c;
    }
    let median = null;
    for (const st of steps) if (st.s <= 0.5) { median = st.t; break; }
    return { steps, median };
  }

  function rocCurve(pos, neg) {
    const all = Array.from(new Set([Infinity, ...pos, ...neg, -Infinity])).sort((a, b) => b - a);
    const pts = all.map((th) => {
      const tp = pos.filter((v) => v >= th).length;
      const fp = neg.filter((v) => v >= th).length;
      return { th, tpr: tp / pos.length, fpr: fp / neg.length, sens: tp / pos.length, spec: 1 - fp / neg.length };
    });
    let auc = 0;
    for (let i = 1; i < pts.length; i++) auc += (pts[i].fpr - pts[i - 1].fpr) * (pts[i].tpr + pts[i - 1].tpr) / 2;
    return { points: pts, auc: Math.abs(auc) };
  }

  function fixedEffectMeta(studies) {
    let wSum = 0, wySum = 0;
    studies.forEach((s) => { s.w = 1 / s.vi; wSum += s.w; wySum += s.w * s.yi; });
    const pooled = wySum / wSum, se = Math.sqrt(1 / wSum);
    let Q = 0; studies.forEach((s) => (Q += s.w * (s.yi - pooled) ** 2));
    const df = studies.length - 1;
    const I2 = Math.max(0, ((Q - df) / Q) * 100) || 0;
    return { pooled, se, Q, df, I2, studies };
  }
  function randomEffectMeta(studies) {
    const fe = fixedEffectMeta(studies.map((s) => ({ ...s })));
    let sumW = 0, sumW2 = 0;
    fe.studies.forEach((s) => { sumW += s.w; sumW2 += s.w * s.w; });
    const C = sumW - sumW2 / sumW;
    const tau2 = Math.max(0, (fe.Q - fe.df) / C);
    let wSum = 0, wySum = 0;
    const restudies = studies.map((s) => ({ ...s, wStar: 1 / (s.vi + tau2) }));
    restudies.forEach((s) => { wSum += s.wStar; wySum += s.wStar * s.yi; });
    const pooled = wySum / wSum, se = Math.sqrt(1 / wSum);
    return { pooled, se, tau2, Q: fe.Q, df: fe.df, I2: fe.I2, studies: restudies };
  }
  function mantelHaenszelOR(strata) {
    let num = 0, den = 0;
    strata.forEach((s) => { const n = s.a + s.b + s.c + s.d; num += (s.a * s.d) / n; den += (s.b * s.c) / n; });
    return num / den;
  }
  const crudeOR = ({ a, b, c, d }) => (a * d) / (b * c);

  const AA3 = { A: "Ala", R: "Arg", N: "Asn", D: "Asp", C: "Cys", Q: "Gln", E: "Glu", G: "Gly", H: "His", I: "Ile", L: "Leu", K: "Lys", M: "Met", F: "Phe", P: "Pro", S: "Ser", T: "Thr", W: "Trp", Y: "Tyr", V: "Val", "*": "Ter" };

  // ------------------------------------------------------------ svg plots --
  function plot(container, opts) {
    const o = Object.assign({
      width: 560, height: 320,
      margin: { top: 18, right: 22, bottom: 48, left: 60 },
      xDomain: [0, 1], yDomain: [0, 1], xTicks: 5, yTicks: 5,
      xFmt: (v) => Math.round(v * 100) / 100, yFmt: (v) => Math.round(v * 100) / 100,
      xLabel: "", yLabel: "", grid: true,
    }, opts);
    const { width, height, margin } = o;
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const x = (v) => margin.left + ((v - o.xDomain[0]) / (o.xDomain[1] - o.xDomain[0])) * w;
    const y = (v) => margin.top + h - ((v - o.yDomain[0]) / (o.yDomain[1] - o.yDomain[0])) * h;
    const s = el("svg", { viewBox: `0 0 ${width} ${height}`, width: "100%", height: "auto", style: "display:block;max-width:100%;font-family:inherit" });
    // SVG は viewBox でスケールされるため、同じ font-size でもウィジェットにより
    // 実効サイズが 8px〜25px までばらつく。先に DOM へ挿入して実寸を測り、
    // 「画面上で何px に見えるか」を基準に文字サイズを逆算する。
    container.innerHTML = "";
    container.appendChild(s);
    const renderedW = s.getBoundingClientRect().width || container.clientWidth || width;
    const k = renderedW > 0 ? width / renderedW : 1; // viewBox単位 / 画面px
    const fit = (targetPx, maxUnits) => {
      const units = targetPx * k;
      return Math.max(7, Math.min(units, maxUnits, 26));
    };

    // yラベルは margin.left の内側に収まる必要がある（はみ出すと先頭の桁が切れる）
    const yVals = [];
    if (o.grid && o.yTicks > 0) {
      for (let i = 0; i <= o.yTicks; i++) yVals.push(o.yDomain[0] + (i * (o.yDomain[1] - o.yDomain[0])) / o.yTicks);
    }
    const maxYChars = yVals.reduce((m, v) => Math.max(m, String(o.yFmt(v)).length), 1);
    const yTickFs = fit(12.5, (margin.left - 10) / (maxYChars * 0.58));
    // xラベルは隣の目盛りと衝突しない幅に収める
    const maxXChars = o.xTicks > 0
      ? Array.from({ length: o.xTicks + 1 }, (_, i) => String(o.xFmt(o.xDomain[0] + (i * (o.xDomain[1] - o.xDomain[0])) / o.xTicks)).length).reduce((m, n) => Math.max(m, n), 1)
      : 1;
    const xTickFs = fit(12.5, (w / (o.xTicks + 1) * 0.95) / (maxXChars * 0.58));
    const axisFs = fit(13.5, Math.min(margin.bottom - 4, 30));

    const gGrid = el("g");
    // yTicks/xTicks が 0 のときは「目盛りなし」の意。ループを回すと i/0 が NaN になり
    // ラベルに "NaN" が描かれてしまうので、必ず 0 以下は描画しない。
    yVals.forEach((v) => {
      const yy = y(v);
      append(gGrid, el("line", { x1: margin.left, x2: margin.left + w, y1: yy, y2: yy, stroke: "#e9ecf4", "stroke-width": 1 }));
      append(gGrid, el("text", { x: margin.left - 8, y: yy + yTickFs * 0.35, "text-anchor": "end", "font-size": +yTickFs.toFixed(1), fill: "#7b8497", text: o.yFmt(v) }));
    });
    if (o.xTicks > 0) {
      for (let i = 0; i <= o.xTicks; i++) {
        const v = o.xDomain[0] + (i * (o.xDomain[1] - o.xDomain[0])) / o.xTicks;
        const label = String(o.xFmt(v));
        // 端の目盛りが SVG の外にはみ出して切れないよう、中心位置を内側へ寄せる
        const halfW = label.length * xTickFs * 0.29;
        const cx = Math.max(halfW + 1, Math.min(width - halfW - 1, x(v)));
        append(gGrid, el("text", { x: cx, y: margin.top + h + xTickFs + 6, "text-anchor": "middle", "font-size": +xTickFs.toFixed(1), fill: "#7b8497", text: label }));
      }
    }
    append(gGrid, el("line", { x1: margin.left, x2: margin.left + w, y1: margin.top + h, y2: margin.top + h, stroke: "#c7cce0", "stroke-width": 1.2 }));
    append(gGrid, el("line", { x1: margin.left, x2: margin.left, y1: margin.top, y2: margin.top + h, stroke: "#c7cce0", "stroke-width": 1.2 }));
    if (o.xLabel) append(gGrid, el("text", { x: margin.left + w / 2, y: height - 3, "text-anchor": "middle", "font-size": +axisFs.toFixed(1), fill: "#565f73", "font-weight": 700, text: o.xLabel }));
    if (o.yLabel) append(gGrid, el("text", { x: axisFs, y: margin.top + h / 2, "text-anchor": "middle", "font-size": +axisFs.toFixed(1), fill: "#565f73", "font-weight": 700, transform: `rotate(-90 ${axisFs} ${margin.top + h / 2})`, text: o.yLabel }));
    s.insertBefore(gGrid, s.firstChild);
    return { svg: s, x, y, w, h, margin, width, height, xDomain: o.xDomain, yDomain: o.yDomain, k, fs: (px) => +(px * k).toFixed(1) };
  }

  function dot(ctx, dx, dy, attrs) { const c = el("circle", Object.assign({ cx: ctx.x(dx), cy: ctx.y(dy), r: 4, fill: "#3b63e0", opacity: 0.85 }, attrs)); ctx.svg.appendChild(c); return c; }
  function line(ctx, pts, attrs) {
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${ctx.x(p[0]).toFixed(2)} ${ctx.y(p[1]).toFixed(2)}`).join(" ");
    const p = el("path", Object.assign({ d, fill: "none", stroke: "#3b63e0", "stroke-width": 2 }, attrs));
    ctx.svg.appendChild(p); return p;
  }
  function stepAfter(ctx, pts, attrs) {
    let d = "";
    pts.forEach((p, i) => {
      const px = ctx.x(p[0]), py = ctx.y(p[1]);
      if (i === 0) d += `M ${px} ${py}`;
      else d += ` L ${px} ${ctx.y(pts[i - 1][1])} L ${px} ${py}`;
    });
    const p = el("path", Object.assign({ d, fill: "none", stroke: "#3b63e0", "stroke-width": 2.2 }, attrs));
    ctx.svg.appendChild(p); return p;
  }
  function area(ctx, topPts, bottomPts, attrs) {
    let d = topPts.map((p, i) => `${i === 0 ? "M" : "L"} ${ctx.x(p[0]).toFixed(2)} ${ctx.y(p[1]).toFixed(2)}`).join(" ");
    d += " " + bottomPts.slice().reverse().map((p) => `L ${ctx.x(p[0]).toFixed(2)} ${ctx.y(p[1]).toFixed(2)}`).join(" ") + " Z";
    const p = el("path", Object.assign({ d, fill: "#3b63e0", opacity: 0.14, stroke: "none" }, attrs));
    ctx.svg.appendChild(p); return p;
  }
  function vline(ctx, dx, attrs) { const p = el("line", Object.assign({ x1: ctx.x(dx), x2: ctx.x(dx), y1: ctx.margin.top, y2: ctx.margin.top + ctx.h, stroke: "#c7cce0", "stroke-width": 1.4, "stroke-dasharray": "4 3" }, attrs)); ctx.svg.appendChild(p); return p; }
  function hline(ctx, dy, attrs) { const p = el("line", Object.assign({ x1: ctx.margin.left, x2: ctx.margin.left + ctx.w, y1: ctx.y(dy), y2: ctx.y(dy), stroke: "#c7cce0", "stroke-width": 1.4, "stroke-dasharray": "4 3" }, attrs)); ctx.svg.appendChild(p); return p; }
  function rectData(ctx, x0, y0, x1, y1, attrs) { const p = el("rect", Object.assign({ x: Math.min(ctx.x(x0), ctx.x(x1)), y: Math.min(ctx.y(y0), ctx.y(y1)), width: Math.abs(ctx.x(x1) - ctx.x(x0)), height: Math.abs(ctx.y(y1) - ctx.y(y0)), fill: "#3b63e0" }, attrs)); ctx.svg.appendChild(p); return p; }
  // 既定の font-size は plot() が測ったスケール k から逆算し、画面上 12.5px 相当に揃える。
  // 呼び出し側が font-size を明示している場合はそちらを優先する。
  function defaultFs(ctx) { return ctx && ctx.fs ? ctx.fs(12.5) : 12.5; }
  function text(ctx, dx, dy, str, attrs) { const t = el("text", Object.assign({ x: ctx.x(dx), y: ctx.y(dy), "font-size": defaultFs(ctx), fill: "#1b2233" }, attrs)); t.textContent = str; ctx.svg.appendChild(t); return t; }
  function textPx(ctx, px, py, str, attrs) { const t = el("text", Object.assign({ x: px, y: py, "font-size": defaultFs(ctx), fill: "#1b2233" }, attrs)); t.textContent = str; ctx.svg.appendChild(t); return t; }
  function group(ctx) { const g = el("g"); ctx.svg.appendChild(g); return g; }

  function fmt(v, d = 3) {
    if (v === null || v === undefined || Number.isNaN(v)) return "—";
    if (Math.abs(v) < 1e-4 && v !== 0) return v.toExponential(2);
    return (+v.toFixed(d)).toString();
  }
  function pfmt(p) { if (p < 0.001) return "p < 0.001"; return "p = " + p.toFixed(3); }

  global.CK = {
    el, append, mean, variance, sd, sem, sum,
    makeRng, randNormal, normalSample,
    normalCDF, normalPDF, Z975, tTwoSidedP, fUpperP, tCritical,
    welchT, pooledT, oneWayANOVA, rankArray, pearsonR, spearmanRho, linreg,
    solveLinear, polyFit, kaplanMeier, rocCurve,
    fixedEffectMeta, randomEffectMeta, mantelHaenszelOR, crudeOR, AA3,
    plot, dot, line, stepAfter, area, vline, hline, rectData, text, textPx, group,
    fmt, pfmt,
  };
})(window);

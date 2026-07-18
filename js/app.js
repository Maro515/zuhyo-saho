/* ==========================================================================
   App shell: hash router, view rendering, progress tracking, quiz engine.
   Content lives in data/*.js, interactive demos live in js/widgets.js.
   ========================================================================== */
(function () {
  const root = document.getElementById("app");
  const STORE_KEY = "zuhyoSahoProgress:v1";

  // --------------------------------------------------------------- storage --
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* private mode etc. */ }
  }
  let progress = loadProgress();
  function isDone(chId, topicId) { return !!progress[chId + ":" + topicId]; }
  function markDone(chId, topicId) {
    const key = chId + ":" + topicId;
    if (progress[key]) return false;
    progress[key] = true;
    saveProgress(progress);
    return true;
  }

  // -------------------------------------------------- last-visited (resume) --
  const LAST_KEY = "zuhyoSahoLast:v1";
  function saveLast(chId, topicId) {
    try { localStorage.setItem(LAST_KEY, JSON.stringify({ chId, topicId, at: Date.now() })); } catch (e) { /* ignore */ }
  }
  function loadLast() {
    try { return JSON.parse(localStorage.getItem(LAST_KEY)); } catch (e) { return null; }
  }

  function builtChapters() { return window.BOOK.chapters.filter((c) => c.topics && c.topics.some((t) => !t.planned)); }
  function chapterProgress(ch) {
    const real = ch.topics.filter((t) => !t.planned);
    const total = real.length;
    const done = real.filter((t) => isDone(ch.id, t.id)).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }
  function overallProgress() {
    const chs = builtChapters();
    const total = chs.reduce((s, c) => s + chapterProgress(c).total, 0);
    const done = chs.reduce((s, c) => s + chapterProgress(c).done, 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  // ------------------------------------------------------------------ misc --
  function ringSVG(pct, size, stroke, track) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const off = c * (1 - pct / 100);
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track || "rgba(146,172,238,0.22)"}" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${stroke ? "" : "#3b63e0"}" stroke="currentColor" stroke-width="${stroke}"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" stroke-linecap="round"
        transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>`;
  }
  let toastTimer = null;
  function showToast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // -------------------------------------------------------------- routing --
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    if (!h) return { view: "home" };
    const parts = h.split("/").filter(Boolean);
    if (parts.length === 1) return { view: "chapter", chId: parts[0] };
    return { view: "topic", chId: parts[0], topicId: parts[1] };
  }
  function findChapter(chId) { return window.BOOK.chapters.find((c) => c.id === chId); }
  function findTopic(ch, topicId) { return ch && ch.topics.find((t) => t.id === topicId); }

  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);

  function render() {
    const route = parseHash();
    updateTopbar();
    navPrevHash = navNextHash = null;
    destroyRail();
    if (route.view === "home") return viewHome();
    const ch = findChapter(route.chId);
    if (!ch) return viewNotFound();
    if (route.view === "chapter") {
      return ch.topics.length ? viewChapter(ch) : viewChapterLocked(ch);
    }
    if (route.view === "topic") {
      const topic = findTopic(ch, route.topicId);
      if (!topic) return viewNotFound();
      if (topic.planned) return ch.topics.length ? viewChapter(ch) : viewChapterLocked(ch);
      return viewTopic(ch, topic);
    }
  }

  function updateTopbar() {
    const chip = document.getElementById("topbarProgress");
    if (!chip) return;
    const p = overallProgress();
    chip.innerHTML = `<span class="ring">${ringSVG(p.pct, 18, 3)}</span><span class="ro-label">制覇度&nbsp;</span>${p.done}/${p.total}<span class="ro-pct">（${p.pct}%）</span>`;
  }

  function mount(html) {
    root.innerHTML = `<div class="view-enter">${html}</div>`;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    updateScrollBar();
    setTimeout(updateScrollBar, 60);
  }

  // ------------------------------------------------------------ home view --
  function viewHome() {
    const chs = window.BOOK.chapters;
    const built = builtChapters();
    const totalTopics = chs.reduce((s, c) => s + (c.count || c.topics.length), 0);
    const p = overallProgress();

    const cards = chs.map((ch) => {
      const isBuilt = ch.topics.length > 0;
      const color = ch.color || "var(--locked)";
      const soft = ch.colorSoft || "var(--locked-soft)";
      if (!isBuilt) {
        return `<div class="chapter-card locked" data-no="${String(ch.number).padStart(2, "0")}" onclick="location.hash='#/${ch.id}'" style="cursor:pointer">
          <span class="ch-no">${String(ch.number).padStart(2, "0")}</span>
          <h3>${ch.title}</h3>
          <p>${ch.count}項目 ・ 準備中です</p>
          <div class="meta-row"><span>タップして収録予定の項目を見る</span><span class="soon-badge">準備中</span></div>
        </div>`;
      }
      const cp = chapterProgress(ch);
      const liveLabel = ch.count && cp.total < ch.count ? `${cp.total}/${ch.count} 項目公開` : `${cp.total}項目`;
      return `<a class="chapter-card" href="#/${ch.id}" data-no="${String(ch.number).padStart(2, "0")}" style="--accent-color:${color};--accent-soft-color:${soft}">
        <span class="ch-no">${String(ch.number).padStart(2, "0")}</span>
        <h3>${ch.title}</h3>
        <p>${ch.description || ""}</p>
        <div class="meta-row"><span>${liveLabel}</span><span>${cp.done}/${cp.total} 完了</span></div>
        <div class="mini-progress"><i style="width:${cp.pct}%"></i></div>
      </a>`;
    }).join("");

    // 「続きから」— 最後に開いた項目、なければ最初の未クリア項目
    let resume = null;
    const last = loadLast();
    if (last) {
      const lch = findChapter(last.chId);
      const lt = lch && findTopic(lch, last.topicId);
      if (lch && lt && !lt.planned) resume = { ch: lch, t: lt, label: "続きから" };
    }
    if (!resume) {
      for (let i = 0; i < built.length && !resume; i++) {
        const t = built[i].topics.filter((x) => !x.planned).find((x) => !isDone(built[i].id, x.id));
        if (t) resume = { ch: built[i], t: t, label: "ここから始める" };
      }
    }
    const resumeHtml = resume ? `
      <a class="resume-card" href="#/${resume.ch.id}/${resume.t.id}"
         style="--accent-color:${resume.ch.color};--accent-soft-color:${resume.ch.colorSoft}">
        <span class="resume-tag">${resume.label}</span>
        <span class="resume-body">
          <b>${resume.t.title}</b>
          <span>第${resume.ch.number}章 ${resume.ch.title} ・ ${resume.t.no}項目め</span>
        </span>
        <span class="resume-go">続ける →</span>
      </a>` : "";

    mount(`
      <div class="wrap">
        <section class="hero">
          <span class="kicker">📖 『論文図表を読む作法 PREMIUM』を教材化</span>
          <h1>論文の <span class="accent">図とグラフ</span> を<br/>触って、遊んで、腹落ちさせる。</h1>
          <p class="lead">統計の基本から臨床試験の読み方まで、章ごとに寄り道しながら学べるインタラクティブ・ドージョー。書籍の構成にならい、原理は自分の言葉でかみ砕き、図はすべて手を動かして再現しました。</p>
          <div class="hero-stats">
            <div class="stat"><b>${built.length}/${chs.length}</b><span>公開中の章</span></div>
            <div class="stat"><b>${built.reduce((s, c) => s + chapterProgress(c).total, 0)}</b><span>体験できる項目</span></div>
            <div class="stat"><b>${totalTopics}</b><span>書籍全体の項目数</span></div>
            <div class="stat"><b>${p.pct}%</b><span>あなたの制覇度</span></div>
          </div>
        </section>
        ${resumeHtml}
        <div class="section-title"><h2>章を選ぶ</h2><span class="hint">全11章・書籍の目次に対応</span></div>
        <div class="chapter-grid">${cards}</div>
        <div class="site-footer">個人の学習用に、書籍の構成・要点を参考にオリジナルの解説とインタラクティブ図解として再構成したものです。図版の転載はしていません。</div>
      </div>
    `);
  }

  // --------------------------------------------------------- chapter view --
  function chapterHeaderHtml(ch, extra) {
    const cp = ch.topics.length ? chapterProgress(ch) : null;
    return `<div class="chapter-header" style="--accent-color:${ch.color || "#9aa2b6"};background:linear-gradient(135deg, ${ch.color || "#9aa2b6"}, ${shade(ch.color || "#9aa2b6")})">
      <span class="ch-ghost" aria-hidden="true">${String(ch.number).padStart(2, "0")}</span>
      <div class="ch-tag">第${ch.number}章</div>
      <h1>${ch.title}</h1>
      ${ch.description ? `<p>${ch.description}</p>` : ""}
      ${ch.editor ? `<div class="editor">${ch.editor}</div>` : ""}
      ${cp ? `<div style="margin-top:14px" class="progress-track"><i style="width:${cp.pct}%"></i></div><div style="margin-top:6px;font-size:12.5px;opacity:.9">${cp.done}/${cp.total} 項目 完了</div>` : ""}
      ${extra || ""}
    </div>`;
  }
  function shade(hex) {
    try {
      const n = hex.replace("#", "");
      const r = Math.max(0, parseInt(n.substr(0, 2), 16) - 28);
      const g = Math.max(0, parseInt(n.substr(2, 2), 16) - 28);
      const b = Math.max(0, parseInt(n.substr(4, 2), 16) - 28);
      return `rgb(${r},${g},${b})`;
    } catch (e) { return hex; }
  }

  function topicRowHtml(ch, t) {
    if (t.planned) {
      return `<div class="topic-row is-planned" style="--chip-color:var(--locked);--chip-soft:var(--locked-soft)">
        <span class="t-no">${t.no}</span>
        <span class="t-body"><span class="t-title">${t.title}</span>${t.en ? `<span class="t-sub">${t.en}</span>` : ""}</span>
        <span class="soon-badge">準備中</span>
      </div>`;
    }
    const done = isDone(ch.id, t.id);
    return `<a class="topic-row" href="#/${ch.id}/${t.id}" style="--chip-color:${ch.color};--chip-soft:${ch.colorSoft}">
      <span class="t-no">${t.no}</span>
      <span class="t-body"><span class="t-title">${t.title}</span><span class="t-sub">${t.en || t.aka || ""}</span></span>
      <span class="t-done ${done ? "on" : ""}">${done ? "✓" : ""}</span>
      <span class="t-arrow">→</span>
    </a>`;
  }

  function viewChapter(ch) {
    const hasGroups = ch.topics.some((t) => t.group);
    let listHtml;
    if (hasGroups) {
      const groups = [];
      ch.topics.forEach((t) => { const g = t.group || "その他"; if (!groups.includes(g)) groups.push(g); });
      listHtml = groups.map((g) => {
        const rows = ch.topics.filter((t) => (t.group || "その他") === g).map((t) => topicRowHtml(ch, t)).join("");
        return `<div class="group-title"><span>${g}</span></div><div class="topic-list">${rows}</div>`;
      }).join("");
    } else {
      listHtml = `<div class="topic-list">${ch.topics.map((t) => topicRowHtml(ch, t)).join("")}</div>`;
    }
    const cp = chapterProgress(ch);
    const hint = ch.count && cp.total < ch.count
      ? `<span class="hint">${cp.total}/${ch.count} 項目を公開中・順次追加します</span>`
      : `<span class="hint">クリックして体験</span>`;

    // 前後の章へのナビゲーション
    const all = window.BOOK.chapters;
    const ci = all.findIndex((c) => c.id === ch.id);
    const pc = all[ci - 1], nc = all[ci + 1];
    const chNav = `<div class="topic-nav">
      ${pc ? `<a class="nav-card prev" href="#/${pc.id}"><span>← 前の章</span><b>第${pc.number}章 ${pc.title}</b></a>`
           : `<a class="nav-card prev" href="#/"><span>← ホーム</span><b>章の一覧に戻る</b></a>`}
      ${nc ? `<a class="nav-card next" href="#/${nc.id}"><span>次の章 →</span><b>第${nc.number}章 ${nc.title}</b></a>`
           : `<a class="nav-card next" href="#/"><span>ホーム →</span><b>章の一覧に戻る</b></a>`}
    </div>`;

    mount(`
      <div class="wrap">
        <div class="crumbs"><a href="#/">ホーム</a><span class="sep">/</span><span class="current">第${ch.number}章 ${ch.title}</span></div>
        ${chapterHeaderHtml(ch)}
        <div class="section-title"><h2>この章の項目</h2>${hint}</div>
        ${listHtml}
        ${chNav}
      </div>
    `);
  }

  function viewChapterLocked(ch) {
    const preview = (ch.previewTopics || []).map((title, i) => `
      <div class="topic-row" style="cursor:default;--chip-color:var(--locked);--chip-soft:var(--locked-soft)">
        <span class="t-no">${i + 1}</span>
        <span class="t-body"><span class="t-title" style="color:var(--text-muted)">${title}</span></span>
        <span class="soon-badge">準備中</span>
      </div>`).join("");
    mount(`
      <div class="wrap">
        <div class="crumbs"><a href="#/">ホーム</a><span class="sep">/</span><span class="current">第${ch.number}章 ${ch.title}</span></div>
        ${chapterHeaderHtml(ch)}
        <div class="card" style="text-align:center;padding:34px 20px">
          <h2 style="justify-content:center">🚧 この章は準備中です</h2>
          <p style="color:var(--text-muted);margin:0">以下は書籍の目次に基づく収録予定項目です。</p>
        </div>
        <div class="section-title"><h2>収録予定の項目（${ch.count}）</h2></div>
        <div class="topic-list">${preview}</div>
      </div>
    `);
  }

  function viewNotFound() {
    mount(`<div class="wrap"><div class="card" style="text-align:center;padding:40px">
      <h2 style="justify-content:center">🔍 ページが見つかりません</h2>
      <p style="color:var(--text-muted)">お探しの章・項目は存在しないか、まだ準備中です。</p>
      <a class="btn primary" href="#/">ホームに戻る</a>
    </div></div>`);
  }

  // ------------------------------------------------------------ topic view --
  function renderSectionsHtml(topic) {
    return (topic.sections || []).map((s, i) => `
      <div class="card" id="sec-${i}">
        <h2><span class="ico">${s.icon || "📘"}</span>${s.heading}</h2>
        ${s.body ? s.body.split("\n\n").map((p) => `<p>${p}</p>`).join("") : ""}
        ${s.list ? `<ul>${s.list.map((li) => `<li>${li}</li>`).join("")}</ul>` : ""}
      </div>
    `).join("");
  }
  function renderDeepDiveHtml(ch, topic) {
    const d = (window.DEEPDIVE && (window.DEEPDIVE[ch.id + ":" + topic.id] || window.DEEPDIVE[ch.id + ":" + topic.no])) || null;
    if (!d) return "";
    const tl = d.timeline && d.timeline.length
      ? `<div class="deep-sub">🕰 たどってきた道のり</div>
         <ul class="deep-timeline">${d.timeline.map((e) => `
           <li class="deep-tl">
             <span class="yr">${e.year}</span>${e.who ? `<span class="who">${e.who}</span>` : ""}
             <p>${e.text}</p>
           </li>`).join("")}</ul>`
      : "";
    const pr = d.principle && d.principle.length
      ? `<div class="deep-principle">
           <div class="deep-sub">⚙️ 原理のしくみ</div>
           ${d.principle.map((p) => `<p>${p}</p>`).join("")}
           ${d.formula || d.formulaLegend ? `<div class="deep-formula">${d.formula ? `<div class="fx">${d.formula}</div>` : ""}${d.formulaLegend ? `<p class="lg"${d.formula ? "" : ` style="border-top:none;padding-top:0"`}>${d.formulaLegend}</p>` : ""}</div>` : ""}
         </div>`
      : "";
    const ins = d.insight
      ? `<div class="deep-insight"><div class="deep-sub">💡 一歩深く</div><p>${d.insight}</p></div>`
      : "";
    return `<div class="deep-card" id="sec-deep" style="--chip-color:${ch.color};--chip-soft:${ch.colorSoft}">
      <div class="deep-head">
        <h2><span class="ico">🏛</span>歴史と原理 — なぜこの手法が生まれたか</h2>
        ${d.era ? `<span class="deep-era">${d.era}</span>` : ""}
      </div>
      ${d.origin ? `<p class="deep-origin">${d.origin}</p>` : ""}
      ${tl}
      ${pr}
      ${ins}
    </div>`;
  }

  function renderExploreHtml(ch, topic) {
    const ex = (window.EXPLORE && (window.EXPLORE[ch.id + ":" + topic.id] || window.EXPLORE[ch.id + ":" + topic.no])) || null;
    const watch = ex && ex.watch && ex.watch.length ? ex.watch : null;
    const challenge = ex && ex.challenge ? ex.challenge : null;
    if (!watch && !challenge) return "";
    return `<div class="try-read">
      ${watch ? `<div class="try-watch">
        <div class="try-step">02 観察ポイント</div>
        <ul>${watch.map((w) => `<li>${w}</li>`).join("")}</ul>
      </div>` : ""}
      ${challenge ? `<div class="try-challenge">
        <div class="try-step">03 やってみよう</div>
        <p>${challenge}</p>
      </div>` : ""}
    </div>`;
  }

  function renderCautionHtml(topic) {
    if (!topic.cautions || !topic.cautions.length) return "";
    return `<div class="card caution" id="sec-caution">
      <h2><span class="ico">⚠️</span>ここで誤読しやすい</h2>
      <ul>${topic.cautions.map((c) => `<li>${c}</li>`).join("")}</ul>
    </div>`;
  }

  function renderQuiz(container, ch, topic) {
    const quiz = topic.quiz || [];
    if (!quiz.length) { markDone(ch.id, topic.id); updateTopbar(); return; }
    let answered = 0;
    const alreadyDone = isDone(ch.id, topic.id);
    container.innerHTML = `
      <div class="quiz-card">
        <div class="q-kicker">🎯 理解度クイズ ${alreadyDone ? "（クリア済み ✓）" : ""}</div>
        <div class="quiz-progress">${quiz.map(() => `<i></i>`).join("")}</div>
        <div class="quiz-body"></div>
        <div class="quiz-foot"></div>
      </div>`;
    const progEls = container.querySelectorAll(".quiz-progress i");
    const body = container.querySelector(".quiz-body");
    const foot = container.querySelector(".quiz-foot");
    quiz.forEach((item, qi) => {
      const qDiv = document.createElement("div");
      qDiv.style.marginBottom = qi < quiz.length - 1 ? "22px" : "0";
      qDiv.innerHTML = `<div class="q-text">Q${qi + 1}. ${item.q}</div>
        <div class="quiz-choices">${item.choices.map((c, ci) => `<button class="quiz-choice" data-ci="${ci}">${c}</button>`).join("")}</div>
        <div class="quiz-explain">${item.explain || ""}</div>`;
      body.appendChild(qDiv);
      const btns = qDiv.querySelectorAll(".quiz-choice");
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const ci = +btn.dataset.ci;
          btns.forEach((b) => (b.disabled = true));
          if (ci === item.answer) btn.classList.add("correct");
          else { btn.classList.add("wrong"); btns[item.answer].classList.add("correct"); }
          qDiv.querySelector(".quiz-explain").classList.add("show");
          progEls[qi].classList.add("done");
          answered++;
          if (answered === quiz.length) {
            const first = markDone(ch.id, topic.id);
            updateTopbar();
            if (first) showToast("🎉 この項目をクリアしました！");
            foot.innerHTML = `<button type="button" class="btn quiz-retry">↻ もう一度挑戦する</button>`;
            foot.querySelector(".quiz-retry").addEventListener("click", () => renderQuiz(container, ch, topic));
          }
        }, { once: false });
      });
    });
  }

  let railObserver = null;
  /* レールは body 直下に置く。#app 側は .view-enter の transform が
     包含ブロックを作るため position:fixed が効かない。 */
  function destroyRail() {
    if (railObserver) { railObserver.disconnect(); railObserver = null; }
    const old = document.getElementById("topicRail");
    if (old) old.remove();
  }
  function setupRail(topic, ch) {
    destroyRail();
    const items = (topic.sections || []).map((s, i) => ({ id: "sec-" + i, label: s.heading }));
    const hasDeep = !!(window.DEEPDIVE && (window.DEEPDIVE[ch.id + ":" + topic.id] || window.DEEPDIVE[ch.id + ":" + topic.no]));
    if (hasDeep) items.push({ id: "sec-deep", label: "歴史と原理" });
    items.push({ id: "widgetHost", label: "触って理解する" });
    if (topic.cautions && topic.cautions.length) items.push({ id: "sec-caution", label: "誤読しやすい" });
    if (topic.quiz && topic.quiz.length) items.push({ id: "quizHost", label: "理解度クイズ" });
    if (items.length < 2) return;

    const rail = document.createElement("nav");
    rail.className = "rail";
    rail.id = "topicRail";
    rail.setAttribute("aria-label", "このページの目次");
    rail.innerHTML = items.map((it, i) =>
      `<button type="button" class="rail-dot${i === 0 ? " active" : ""}" data-target="${it.id}"
        aria-label="${escapeHtml(it.label)}へ移動"><span class="rail-label">${escapeHtml(it.label)}</span></button>`
    ).join("");
    document.body.appendChild(rail);
    const dots = [].slice.call(rail.querySelectorAll(".rail-dot"));
    const targets = dots.map((d) => document.getElementById(d.dataset.target)).filter(Boolean);
    dots.forEach((d) => d.addEventListener("click", () => {
      const el = document.getElementById(d.dataset.target);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
    }));
    if (!("IntersectionObserver" in window) || !targets.length) return;
    railObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = targets.indexOf(en.target);
        if (i < 0) return;
        dots.forEach((d, n) => d.classList.toggle("active", n === i));
      });
    }, { rootMargin: "-88px 0px -62% 0px", threshold: 0 });
    targets.forEach((t) => railObserver.observe(t));
  }

  function viewTopic(ch, topic) {
    const built = ch.topics.filter((t) => !t.planned);
    const idx = built.findIndex((t) => t.id === topic.id);
    const prev = built[idx - 1];
    const next = built[idx + 1];
    saveLast(ch.id, topic.id);
    navPrevHash = prev ? "#/" + ch.id + "/" + prev.id : null;
    navNextHash = next ? "#/" + ch.id + "/" + next.id : null;
    mount(`
      <div class="wrap">
        <div class="crumbs">
          <a href="#/">ホーム</a><span class="sep">/</span>
          <a href="#/${ch.id}">第${ch.number}章 ${ch.title}</a><span class="sep">/</span>
          <span class="current">${topic.title}</span>
        </div>
        <div class="topic-hero">
          <div class="t-kicker">
            <span class="t-badge" style="background:${ch.colorSoft};color:${ch.color}">第${ch.number}章-${topic.no}</span>
            ${topic.aka ? `<span class="t-aka">別名：${topic.aka}</span>` : ""}
          </div>
          <h1>${topic.title}</h1>
          ${topic.en ? `<div class="t-en">${topic.en}</div>` : ""}
          ${topic.oneLiner ? `<div class="t-one-liner">💡 ${topic.oneLiner}</div>` : ""}
        </div>
        ${renderSectionsHtml(topic)}
        ${renderDeepDiveHtml(ch, topic)}
        <div class="widget-box" id="widgetHost" style="--accent-color:${ch.color};--chip-color:${ch.color};--chip-soft:${ch.colorSoft}">
          <div class="w-head">
            <h2>🧪 触って理解する</h2>
            <span class="w-tag">INTERACTIVE</span>
          </div>
          ${topic.widgetNote ? `<div class="try-guide"><span class="try-step">01 操作</span><p>${topic.widgetNote}</p></div>` : ""}
          <div class="widget-mount"></div>
          ${renderExploreHtml(ch, topic)}
        </div>
        ${renderCautionHtml(topic)}
        <div id="quizHost"></div>
        <div class="topic-nav">
          ${prev ? `<a class="nav-card prev" href="#/${ch.id}/${prev.id}"><span>← 前の項目</span><b>${prev.title}</b></a>` : `<a class="nav-card prev" href="#/${ch.id}"><span>← 章の一覧</span><b>${ch.title}</b></a>`}
          ${next ? `<a class="nav-card next" href="#/${ch.id}/${next.id}"><span>次の項目 →</span><b>${next.title}</b></a>` : `<a class="nav-card next" href="#/${ch.id}"><span>章を完了 →</span><b>一覧に戻る</b></a>`}
        </div>
      </div>
    `);
    const widgetMount = document.querySelector("#widgetHost .widget-mount");
    try {
      if (window.WIDGETS && window.WIDGETS[topic.widget]) window.WIDGETS[topic.widget](widgetMount, topic, ch);
      else widgetMount.innerHTML = `<p style="color:var(--text-muted);font-size:13px">この項目のインタラクティブ教材は準備中です。</p>`;
    } catch (e) {
      console.error("widget render failed:", topic.widget, e);
      widgetMount.innerHTML = `<p style="color:var(--danger);font-size:13px">教材の読み込み中にエラーが発生しました。</p>`;
    }
    renderQuiz(document.getElementById("quizHost"), ch, topic);
    setupRail(topic, ch);
  }

  /* =========================================================================
     ⌘K コマンドパレット — 全173項目を横断検索
     ========================================================================= */
  let SEARCH_INDEX = null;
  function searchIndex() {
    if (SEARCH_INDEX) return SEARCH_INDEX;
    SEARCH_INDEX = [];
    window.BOOK.chapters.forEach((ch) => {
      (ch.topics || []).filter((t) => !t.planned).forEach((t) => {
        // 見出しだけでなく本文・歴史と原理・観察ポイントまで含めた全文インデックス。
        // 「カプラン」のように和名が本文にしか出てこない語でも辿り着けるようにする。
        const parts = [t.title, t.en || "", t.aka || "", t.group || "", ch.title, t.oneLiner || ""];
        (t.sections || []).forEach((s) => {
          parts.push(s.heading || "", s.body || "");
          (s.list || []).forEach((li) => parts.push(li));
        });
        (t.cautions || []).forEach((c) => parts.push(c));
        const key = ch.id + ":" + t.id;
        const d = (window.DEEPDIVE && window.DEEPDIVE[key]) || null;
        if (d) {
          parts.push(d.origin || "", d.insight || "");
          (d.timeline || []).forEach((e) => parts.push(e.year || "", e.who || "", e.text || ""));
          (d.principle || []).forEach((p) => parts.push(p));
          parts.push(d.formula || "", d.formulaLegend || "");
        }
        const ex = (window.EXPLORE && window.EXPLORE[key]) || null;
        if (ex) {
          (ex.watch || []).forEach((w) => parts.push(w));
          parts.push(ex.challenge || "");
        }
        SEARCH_INDEX.push({ ch: ch, t: t, hay: parts.join(" ").toLowerCase() });
      });
    });
    return SEARCH_INDEX;
  }
  function scoreEntry(e, q) {
    const title = e.t.title.toLowerCase();
    const en = (e.t.en || "").toLowerCase();
    const aka = (e.t.aka || "").toLowerCase();
    if (title === q) return 1000;
    if (title.startsWith(q)) return 820;
    if (title.indexOf(q) >= 0) return 640;
    if (en.startsWith(q) || aka.startsWith(q)) return 520;
    if (en.indexOf(q) >= 0 || aka.indexOf(q) >= 0) return 420;
    if (e.ch.title.toLowerCase().indexOf(q) >= 0) return 210;
    // 本文のみのマッチ。出現回数が多いほど「その項目の話題」である可能性が高い。
    if (e.hay.indexOf(q) >= 0) {
      let n = 0, i = 0;
      while ((i = e.hay.indexOf(q, i)) >= 0) { n++; i += q.length; if (n >= 8) break; }
      return 100 + n * 7;
    }
    return 0;
  }
  function runSearch(query) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return null;
    const out = [];
    searchIndex().forEach((e) => {
      let total = 0;
      for (let i = 0; i < terms.length; i++) {
        const s = scoreEntry(e, terms[i]);
        if (!s) return;
        total += s;
      }
      if (!isDone(e.ch.id, e.t.id)) total += 12;
      out.push({ e: e, s: total });
    });
    out.sort((a, b) => b.s - a.s || a.e.ch.number - b.e.ch.number || a.e.t.no - b.e.t.no);
    return out.slice(0, 24).map((x) => x.e);
  }
  function defaultSuggestions() {
    const list = [];
    const last = loadLast();
    if (last) {
      const ch = findChapter(last.chId);
      const t = ch && findTopic(ch, last.topicId);
      if (ch && t && !t.planned) list.push({ ch: ch, t: t, tag: "続きから" });
    }
    const seen = new Set(list.map((x) => x.ch.id + ":" + x.t.id));
    searchIndex().forEach((e) => {
      if (list.length >= 8) return;
      const key = e.ch.id + ":" + e.t.id;
      if (seen.has(key) || isDone(e.ch.id, e.t.id)) return;
      seen.add(key);
      list.push({ ch: e.ch, t: e.t, tag: "未クリア" });
    });
    return list;
  }

  let cmdkEls = null, cmdkResults = [], cmdkActive = 0;
  function buildCmdk() {
    if (cmdkEls) return cmdkEls;
    const root2 = document.createElement("div");
    root2.className = "cmdk";
    root2.id = "cmdk";
    root2.hidden = true;
    root2.innerHTML = `
      <div class="cmdk-scrim" data-close="1"></div>
      <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="項目を検索">
        <div class="cmdk-input-row">
          <span class="cmdk-ico" aria-hidden="true">🔍</span>
          <input id="cmdkInput" type="text" autocomplete="off" spellcheck="false"
                 placeholder="項目名・英語名で検索（例: ROC、カプラン、PCA、western）" aria-label="項目を検索" />
          <kbd class="cmdk-kbd">ESC</kbd>
        </div>
        <div class="cmdk-list" id="cmdkList" role="listbox"></div>
        <div class="cmdk-foot">
          <span><kbd class="cmdk-kbd">↑</kbd><kbd class="cmdk-kbd">↓</kbd> 移動</span>
          <span><kbd class="cmdk-kbd">Enter</kbd> 開く</span>
          <span class="cmdk-foot-right">全 ${searchIndex().length} 項目を検索</span>
        </div>
      </div>`;
    document.body.appendChild(root2);
    const input = root2.querySelector("#cmdkInput");
    const list = root2.querySelector("#cmdkList");
    root2.addEventListener("click", (ev) => { if (ev.target.dataset.close) closeCmdk(); });
    input.addEventListener("input", () => renderCmdkList(input.value));
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") { ev.preventDefault(); moveCmdk(1); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); moveCmdk(-1); }
      else if (ev.key === "Enter") { ev.preventDefault(); chooseCmdk(); }
      else if (ev.key === "Escape") { ev.preventDefault(); closeCmdk(); }
    });
    cmdkEls = { root: root2, input: input, list: list };
    return cmdkEls;
  }
  function renderCmdkList(query) {
    const els = buildCmdk();
    const hits = runSearch(query);
    let rows, heading;
    if (hits === null) { rows = defaultSuggestions(); heading = "おすすめ"; }
    else { rows = hits.map((e) => ({ ch: e.ch, t: e.t, tag: "" })); heading = `${rows.length} 件`; }
    cmdkResults = rows;
    cmdkActive = 0;
    if (!rows.length) {
      els.list.innerHTML = `<div class="cmdk-empty">「${escapeHtml(query)}」に一致する項目は見つかりませんでした</div>`;
      return;
    }
    els.list.innerHTML =
      `<div class="cmdk-heading">${heading}</div>` +
      rows.map((r, i) => {
        const done = isDone(r.ch.id, r.t.id);
        return `<a class="cmdk-item${i === 0 ? " active" : ""}" role="option" data-i="${i}"
                   href="#/${r.ch.id}/${r.t.id}" style="--chip-color:${r.ch.color};--chip-soft:${r.ch.colorSoft}">
          <span class="cmdk-no">${r.ch.number}-${r.t.no}</span>
          <span class="cmdk-body">
            <span class="cmdk-title">${escapeHtml(r.t.title)}</span>
            <span class="cmdk-sub">${escapeHtml(r.ch.title)}${r.t.en ? " ・ " + escapeHtml(r.t.en) : ""}</span>
          </span>
          ${r.tag ? `<span class="cmdk-tag">${r.tag}</span>` : ""}
          ${done ? `<span class="cmdk-done" title="クリア済み">✓</span>` : ""}
        </a>`;
      }).join("");
    els.list.querySelectorAll(".cmdk-item").forEach((el) => {
      el.addEventListener("mouseenter", () => setCmdkActive(+el.dataset.i));
      el.addEventListener("click", () => closeCmdk());
    });
  }
  function setCmdkActive(i) {
    const els = buildCmdk();
    const items = els.list.querySelectorAll(".cmdk-item");
    if (!items.length) return;
    cmdkActive = (i + items.length) % items.length;
    items.forEach((el, n) => el.classList.toggle("active", n === cmdkActive));
    const el = items[cmdkActive];
    if (el) el.scrollIntoView({ block: "nearest" });
  }
  function moveCmdk(d) { setCmdkActive(cmdkActive + d); }
  function chooseCmdk() {
    const r = cmdkResults[cmdkActive];
    if (!r) return;
    location.hash = "#/" + r.ch.id + "/" + r.t.id;
    closeCmdk();
  }
  function openCmdk() {
    const els = buildCmdk();
    els.root.hidden = false;
    document.body.classList.add("cmdk-open");
    els.input.value = "";
    renderCmdkList("");
    setTimeout(() => els.input.focus(), 20);
  }
  function closeCmdk() {
    if (!cmdkEls) return;
    cmdkEls.root.hidden = true;
    document.body.classList.remove("cmdk-open");
  }
  function cmdkIsOpen() { return !!(cmdkEls && !cmdkEls.root.hidden); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* =========================================================================
     スクロール進捗バー & キーボードショートカット
     ========================================================================= */
  let scrollBar = null;
  function ensureScrollBar() {
    if (scrollBar) return scrollBar;
    scrollBar = document.createElement("div");
    scrollBar.className = "scroll-progress";
    scrollBar.innerHTML = "<i></i>";
    document.body.appendChild(scrollBar);
    return scrollBar;
  }
  function updateScrollBar() {
    const bar = ensureScrollBar().firstChild;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 40 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
    bar.style.width = pct + "%";
    scrollBar.classList.toggle("on", h > 40);
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });
  window.addEventListener("resize", updateScrollBar);

  let navPrevHash = null, navNextHash = null;
  document.addEventListener("keydown", (ev) => {
    const tag = (ev.target && ev.target.tagName) || "";
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (ev.target && ev.target.isContentEditable);
    if ((ev.key === "k" || ev.key === "K") && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault(); cmdkIsOpen() ? closeCmdk() : openCmdk(); return;
    }
    if (cmdkIsOpen()) return;
    if (typing) return;
    if (ev.key === "/") { ev.preventDefault(); openCmdk(); return; }
    if (ev.key === "ArrowLeft" && navPrevHash) { location.hash = navPrevHash; }
    else if (ev.key === "ArrowRight" && navNextHash) { location.hash = navNextHash; }
  });

  window.APP = {
    navigate: (h) => (location.hash = h),
    showToast, isDone, markDone, chapterProgress, overallProgress,
    openSearch: openCmdk,
  };
})();

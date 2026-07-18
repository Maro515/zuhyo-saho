/* Small DOM helpers shared by every widget in widgets-ch01.js / widgets-ch10.js */
(function (global) {
  function sliderRow(id, label, min, max, step, value, fmtFn) {
    const shown = fmtFn ? fmtFn(value) : value;
    return `<div class="field"><label for="${id}">${label}: <span class="val" id="${id}_val">${shown}</span></label>
      <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"/></div>`;
  }
  function bindSlider(id, fmtFn, onInput) {
    const input = document.getElementById(id);
    const val = document.getElementById(id + "_val");
    input.addEventListener("input", () => {
      const v = +input.value;
      val.textContent = fmtFn ? fmtFn(v) : v;
      onInput(v);
    });
    return input;
  }
  function segRow(id, label, options, value) {
    return `<div class="field"><label>${label}</label><div class="seg" id="${id}">${options
      .map((o) => `<button type="button" data-v="${o.v}" class="${String(o.v) === String(value) ? "active" : ""}">${o.label}</button>`)
      .join("")}</div></div>`;
  }
  function bindSeg(id, onChange) {
    const wrap = document.getElementById(id);
    wrap.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        wrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        onChange(btn.dataset.v);
      });
    });
    return wrap;
  }
  function readoutRow(items) {
    return `<div class="widget-readout">${items
      .map((it) => `<div class="ro">${it.label}<b id="${it.id}">${it.value}</b></div>`)
      .join("")}</div>`;
  }
  function setReadout(id, value) {
    const e = document.getElementById(id);
    if (e) e.textContent = value;
  }
  global.WCORE = { sliderRow, bindSlider, segRow, bindSeg, readoutRow, setReadout };
  global.WIDGETS = global.WIDGETS || {};
})(window);

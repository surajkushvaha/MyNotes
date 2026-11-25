// Claude can be your animation studio: clips play only on screen, copy buttons for commands and the example message.
const INSTAGRAM_URL = "https://www.instagram.com/skaleout/";

(function () {
  "use strict";

  var ig = document.getElementById("ig-link");
  if (ig && INSTAGRAM_URL) ig.href = INSTAGRAM_URL;

  // Clips: lazy posters, play only while on screen, controls instead of autoplay for reduced motion
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var videos = Array.prototype.slice.call(document.querySelectorAll("#clip-grid video"));
  var visible = new Set();

  function setPoster(v) {
    if (v.dataset.poster && !v.getAttribute("poster")) v.setAttribute("poster", v.dataset.poster);
  }
  function play(v) {
    v.muted = true;
    var p = v.play();
    if (p && p.catch) p.catch(function (err) { if (err && err.name === "NotAllowedError") v.controls = true; });
  }
  function applyMotion() {
    var still = reduce && reduce.matches;
    videos.forEach(function (v) {
      v.controls = still;
      if (still) { v.pause(); }
      else if (visible.has(v)) { play(v); }
    });
  }
  if ("IntersectionObserver" in window) {
    var posterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { setPoster(e.target); posterIO.unobserve(e.target); }
      });
    }, { rootMargin: "600px 0px" });
    var playIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          visible.add(v);
          if (!(reduce && reduce.matches)) play(v);
        } else {
          visible.delete(v);
          v.pause();
        }
      });
    }, { rootMargin: "120px 0px", threshold: 0.15 });
    videos.forEach(function (v) { posterIO.observe(v); playIO.observe(v); });
  } else {
    videos.forEach(setPoster);
  }
  applyMotion();
  if (reduce) {
    if (reduce.addEventListener) reduce.addEventListener("change", applyMotion);
    else if (reduce.addListener) reduce.addListener(applyMotion);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) videos.forEach(function (v) { v.pause(); });
    else applyMotion();
  });

  // Copy buttons: data-copy="id" names the element whose text is copied.
  var copyButtons = Array.prototype.slice.call(document.querySelectorAll("[data-copy]"));
  var resetTimer = null;

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.className = "offscreen";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function selectNode(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function feedback(btn, node, ok) {
    copyButtons.forEach(function (b) {
      var l = b.querySelector(".copy-label");
      if (!b.dataset.label) b.dataset.label = l.textContent;
      l.textContent = b.dataset.label;
    });
    var label = btn.querySelector(".copy-label");
    label.textContent = ok ? "Copied" : "Copy failed";
    var where = btn.closest("[data-status]");
    var target = where ? where.querySelector(".status") : null;
    if (target) {
      target.textContent = ok ? (btn.dataset.done || "Copied.")
                              : "Copy did not work here. The text is selected, copy it by hand.";
    }
    if (!ok) selectNode(node);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () { label.textContent = btn.dataset.label; }, 2200);
  }
  function doCopy(btn) {
    var node = document.getElementById(btn.dataset.copy);
    if (!node) return;
    var text = node.textContent.trim();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { feedback(btn, node, true); },
        function () { feedback(btn, node, fallbackCopy(text)); }
      );
    } else {
      feedback(btn, node, fallbackCopy(text));
    }
  }
  copyButtons.forEach(function (b) {
    b.addEventListener("click", function () { doCopy(b); });
  });
})();

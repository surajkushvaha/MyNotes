// Jan's Instagram profile URL. Set it here, the footer link picks it up.
const INSTAGRAM_URL = "https://www.instagram.com/";

(function () {
  "use strict";

  // Footer link
  var ig = document.getElementById("ig-link");
  if (ig && INSTAGRAM_URL) ig.href = INSTAGRAM_URL;

  // Clips: lazy posters, play only while on screen, no autoplay for reduced motion
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

  // Style picker
  var chips = Array.prototype.slice.call(document.querySelectorAll("#chips .chip"));
  var slot = document.getElementById("slot");
  var meta = document.getElementById("meta");
  var own = document.getElementById("own");
  var ownInput = document.getElementById("own-input");
  var OWN_EMPTY = "{describe your style here}";
  var ownMode = false;

  function setSlot(text, empty) {
    slot.textContent = text;
    slot.classList.toggle("empty", !!empty);
  }
  function updateOwn() {
    var t = ownInput.value.trim().replace(/\s+/g, " ").replace(/\.+$/, "");
    setSlot(t || OWN_EMPTY, !t);
    meta.textContent = t ? "style: your own" : "style: type it below the chips";
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      ownMode = chip.dataset.own === "true";
      own.hidden = !ownMode;
      if (ownMode) {
        updateOwn();
        ownInput.focus();
      } else {
        setSlot(chip.dataset.style, false);
        meta.textContent = "style: " + chip.textContent;
      }
    });
  });
  ownInput.addEventListener("input", updateOwn);

  // Copy
  var status = document.getElementById("status");
  var promptText = document.getElementById("prompt-text");
  var copyButtons = Array.prototype.slice.call(document.querySelectorAll("[data-copy]"));
  var resetTimer = null;

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "-9999px";
    ta.style.fontSize = "16px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function selectPrompt() {
    var range = document.createRange();
    range.selectNodeContents(promptText);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function feedback(btn, ok) {
    copyButtons.forEach(function (b) {
      var label = b.querySelector(".copy-label");
      if (!b.dataset.label) b.dataset.label = label.textContent;
      label.textContent = b.dataset.label;
    });
    var label = btn.querySelector(".copy-label");
    label.textContent = ok ? "Copied" : "Copy failed";
    status.textContent = ok
      ? "Copied. Now paste it into Claude or ChatGPT and send."
      : "Copy did not work here. The prompt is selected, copy it by hand.";
    if (!ok) selectPrompt();
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      label.textContent = btn.dataset.label;
    }, 2200);
  }
  function doCopy(btn) {
    if (ownMode && !ownInput.value.trim()) {
      status.textContent = "Type your style first, then tap Copy.";
      ownInput.focus();
      return;
    }
    var text = promptText.textContent;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { feedback(btn, true); },
        function () { feedback(btn, fallbackCopy(text)); }
      );
    } else {
      feedback(btn, fallbackCopy(text));
    }
  }
  copyButtons.forEach(function (b) {
    b.addEventListener("click", function () { doCopy(b); });
  });
})();

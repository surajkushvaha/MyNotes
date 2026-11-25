// Poster prompt page: live prompt fields, copy buttons, and the poster images that swap in when they exist.
const INSTAGRAM_URL = "https://www.instagram.com/skaleout/";
// One list: drop each finished poster into media/ under this name (JPEG, about 720 px tall) and it replaces its placeholder.
// Paths are relative to the page so they work under /poster/.
const POSTER_FILES = {
  "01": "media/01-poster.jpg",
  "02": "media/02-poster.jpg",
  "03": "media/03-poster.jpg",
  "04": "media/04-poster.jpg",
  "05": "media/05-poster.jpg"
};

(function () {
  "use strict";

  var ig = document.getElementById("ig-link");
  if (ig && INSTAGRAM_URL) ig.href = INSTAGRAM_URL;

  // Posters: show the file when it loads, else keep the grey placeholder.
  Array.prototype.forEach.call(document.querySelectorAll("[data-poster]"), function (tile) {
    var file = POSTER_FILES[tile.dataset.poster];
    if (!file) return;
    var img = new Image();
    img.onload = function () {
      var ph = tile.querySelector(".ph");
      if (ph) ph.remove();
      img.alt = "Studio poster made by ChatGPT from the photo on the left";
      img.loading = "lazy";
      tile.appendChild(img);
    };
    img.src = file;
  });

  // Live prompt: each field fills its highlighted slot; an empty field keeps the example.
  var fields = Array.prototype.slice.call(document.querySelectorAll("input[data-slot]"));
  function update(input) {
    var out = document.querySelector('[data-slot-out="' + input.dataset.slot + '"]');
    if (!out) return;
    if (!out.dataset.example) out.dataset.example = out.textContent;
    out.textContent = input.value.trim() || out.dataset.example;
  }
  fields.forEach(function (f) { f.addEventListener("input", function () { update(f); }); });

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
      target.textContent = ok ? "Copied. Now paste it into ChatGPT with your photo and send."
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

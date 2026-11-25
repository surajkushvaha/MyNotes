// Copy buttons: each [data-copy] button copies the full text of the <pre> whose id it names.
(function () {
  "use strict";

  var status = document.getElementById("status");
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-copy]"));
  var resetTimer = null;
  var statusTimer = null;

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
  function selectText(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function feedback(btn, target, ok) {
    buttons.forEach(function (b) {
      var l = b.querySelector(".copy-label");
      if (!b.dataset.label) b.dataset.label = l.textContent;
      l.textContent = b.dataset.label;
    });
    var label = btn.querySelector(".copy-label");
    label.textContent = ok ? "Copied" : "Copy failed";
    status.textContent = ok
      ? "Copied. Paste it into your Claude Code chat and send."
      : "Copy did not work here. The prompt is selected, copy it by hand.";
    if (!ok) selectText(target);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () { label.textContent = btn.dataset.label; }, 2200);
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { status.textContent = ""; }, 3200);
  }
  function doCopy(btn) {
    var target = document.getElementById(btn.dataset.copy);
    if (!target) return;
    var text = target.textContent;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { feedback(btn, target, true); },
        function () { feedback(btn, target, fallbackCopy(text)); }
      );
    } else {
      feedback(btn, target, fallbackCopy(text));
    }
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () { doCopy(b); });
  });
})();

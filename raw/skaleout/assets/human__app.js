// Make Claude write like a human: copy buttons. Every button names the element whose text it copies
// (data-copy="id"); the message goes to the .status line of its nearest [data-status] block.
(function () {
  "use strict";

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

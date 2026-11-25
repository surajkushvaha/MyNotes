// Newsletter signup fields (built into every tutorial page by carousels/learn-site/sync.py).
// A page can hold several (data-spot "mid" after the prompt, "end" at the bottom). Each posts to
// /api/subscribe on the same origin; the page's CSP allows only that.
(function () {
  "use strict";
  // Attribution (2026-11-19): a reel link ends in ?r=<reel>&s=<step>. Keep the tag in memory only (no cookie, no storage),
  // take r and s out of the address, count one visit unless the browser asks not to be tracked. Never blocks anything.
  var tag = null;
  try {
    var params = new URLSearchParams(location.search);
    var r = params.get("r");
    var s = params.get("s");
    if (r && s && /^[a-z0-9-]{1,24}$/.test(r) && /^[a-z]{1,12}$/.test(s)) {
      tag = r + "." + s;
      params.delete("r");
      params.delete("s");
      var rest = params.toString();
      history.replaceState(history.state, "", location.pathname + (rest ? "?" + rest : "") + location.hash);
      var optOut = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
      if (!optOut && navigator.sendBeacon) {
        var page = location.pathname.replace(/^\/+|\/+$/g, "") || "home";
        navigator.sendBeacon("/api/visit", new Blob([JSON.stringify({ page: page, tag: tag })], { type: "text/plain" }));
      }
    }
  } catch (err) {
    // attribution is optional; the page works the same without it
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll(".nl-form"));
  if (!forms.length) return;
  var source = location.pathname.replace(/^\/+|\/+$/g, "") || "home";

  function say(form, text, ok) {
    var status = form.querySelector(".nl-status");
    status.textContent = text;
    status.classList.toggle("is-ok", Boolean(ok));
  }

  // After one signup, every field on the page shows the same thank-you instead of asking again.
  function done(message) {
    forms.forEach(function (f) {
      f.classList.add("is-done");
      f.querySelector(".nl-input").disabled = true;
      f.querySelector("button").disabled = true;
      say(f, message, true);
    });
  }

  forms.forEach(function (form) {
    var input = form.querySelector(".nl-input");
    var trap = form.querySelector(".nl-hp");
    var button = form.querySelector("button");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!input.checkValidity() || !email) {
        say(form, "Please enter a valid email address.");
        input.focus();
        return;
      }
      button.disabled = true;
      say(form, "Signing you up...");
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          source: source,
          spot: form.getAttribute("data-spot") || "",
          consent: true,
          website: trap ? trap.value : "",
          tag: tag || "",
        }),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { status: res.status, data: data };
          });
        })
        .then(function (r) {
          if (r.status === 200 && r.data.ok) {
            done(r.data.confirm
              ? "Almost done: check your inbox and tap the confirm button. Your Style Pack opens right after."
              : "You're in. I'll send you the next one when it's out.");
            return;
          }
          if (r.status === 429) {
            say(form, "Too many tries from this connection. Please try again in an hour.");
          } else if (r.data.error === "invalid_email") {
            say(form, "That email doesn't look right. Please check it.");
          } else {
            say(form, "Something went wrong on our side. Please try again in a minute.");
          }
          button.disabled = false;
        })
        .catch(function () {
          say(form, "No connection. Please try again.");
          button.disabled = false;
        });
    });
  });
})();

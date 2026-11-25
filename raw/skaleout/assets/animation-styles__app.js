// Jan's Instagram profile URL. Set it here, the footer link picks it up.
const INSTAGRAM_URL = "https://www.instagram.com/";

// The ten styles of the reel. scene + style fill prompt 1, action + motion fill prompt 2.
const STYLES = {
  watercolour: {
    name: "Watercolour",
    scene: "A koi pond seen from straight above: three koi (red, orange, and white with red patches) glide between green lily pads and one pink lotus over blue-green water.",
    style: "Watercolour on cold-press paper: soft washes with blooms and hard dried edges, pigment granulation, a few small splatters, the paper grain showing through. Only a few colours: warm koi against a cool blue-green pond.",
    action: "The koi glide along slow curving paths, each at its own pace, their bodies flexing in an S wave from head to tail with the fins trailing behind. The lily pads drift and turn a little, soft ripple rings spread from the pads and from the lead fish, and one sun glint crosses the water.",
    motion: "Ripples are soft, broken painted rings that fade as they grow. The paint moves, but the paper grain stays fixed to the frame."
  },
  mosaic: {
    name: "Roman Mosaic",
    scene: "A sea turtle seen from above swims over sand and coral, laid as a Roman floor mosaic.",
    style: "A Roman tile mosaic: small square and cut stone tiles (about 12 px wide on the 1080 px canvas) laid in rows that follow the outlines of every shape, grout lines between them, each tile with its own slight colour shift and a small bevel highlight. A stone palette of ochre, terracotta, sea green, slate and cream, plus one glass tile accent.",
    action: "The turtle swims across the floor with slow, powerful flipper strokes and banks once, while sunlight plays across the tiles as if through water.",
    motion: "The turtle is its own layer of tiles gliding over a fixed floor. Tiles never slide through each other or melt. Light moves as a shimmer of brighter tiles."
  },
  sumie: {
    name: "Sumi-e Ink",
    scene: "A red-crowned crane flies through misty mountains; its mate joins it near a red sun.",
    style: "Sumi-e ink wash on rice paper: black ink from deep black to pale grey washes, wet bleeding edges, dry brush strokes, a lot of empty paper and mist. The red sun is the only colour.",
    action: "The crane flies with big, full wingbeats (the wings sweep up and down about 60 degrees), climbing and dipping, while the mountain ridges slide past in layers and the mist drifts. Halfway through, its mate curves in from the side and flies next to it near the red sun.",
    motion: "Mist blooms and fades like a wet ink wash. The ridges are brush strokes that slide past in depth layers, the near ones fastest."
  },
  impasto: {
    name: "Impasto Oil",
    scene: "A humpback whale breaches out of a stormy sea, most of its body in the air with its long fins spread, and a small boat for scale.",
    style: "An impasto oil painting: thick paint with visible palette knife and bristle strokes that follow the forms, swirling strokes in the sea and sky, raised paint ridges that catch the light, rich broken colour instead of flat fills, and the canvas weave showing where the paint is thin. An original painting, not a copy of a famous one.",
    action: "The whale rises to its peak, hangs for a moment and crashes back into the sea in a big splash of paint strokes. Spray flies, the waves roll and the boat rocks.",
    motion: "Waves are rolling paint strokes and spray is flicks of thick paint. The canvas weave stays fixed to the frame."
  },
  nocturne: {
    name: "Nocturne Gouache",
    scene: "A deer steps out of the trees into a night meadow and fireflies rise around it under the moon.",
    style: "A night painting in gouache: dark, opaque layers of blue and green, matte paint with visible bristle texture, the moonlight as a pale edge along the deer, and the fireflies as small opaque warm dabs with a soft glow.",
    action: "The deer walks out of the tree line and lifts its head. Fireflies rise from the grass and drift around it, blinking on and off, the grass sways and the moon glows behind thin clouds.",
    motion: "The light is painted on, not a digital glow: each firefly is a warm dab that brightens and fades. The bristle texture moves with each object, and the paper grain stays fixed to the frame."
  },
  botanical: {
    name: "Botanical Plate",
    scene: "A blue butterfly flutters across a meadow drawn as a botanical plate and lands on a daisy.",
    style: "A botanical illustration plate: fine ink outlines with soft watercolour fills on cream paper, the plants laid out airy and readable like a scientific drawing (daisies, buttercups, clover, grasses, buds), and the butterfly's blue wings with fine vein lines.",
    action: "The butterfly flutters across the plate in a looping flight with fast wingbeats while a second one crosses behind it. The stems bend gently, then it lands on a daisy and slowly opens and closes its wings.",
    motion: "Every line stays the same drawing: a wing at the same angle always looks the same, with no flickering lines. Plants bend from their base like real stems."
  },
  papercut: {
    name: "Paper Cut",
    scene: "A tissue paper jellyfish pulses up through layers of cut paper sea and kelp while a school of paper fish parts around it.",
    style: "A paper cut diorama: 6 to 9 layers of cut paper from pale surface blue to near black, each layer casting a soft shadow on the one behind it, visible paper fibre and slightly uneven knife-cut edges. The jellyfish's bell is stacked translucent tissue paper with light glowing through it, its tentacles thin paper strips and threads.",
    action: "The jellyfish pulses upward toward the light while the paper layers slide past at different speeds, like a multiplane camera. A school of paper fish swims the other way and parts around it, and punched paper dots drift down like snow.",
    motion: "Everything is a piece of cut paper: pieces slide, hinge, fold and curl, but never melt. The bell pulses like a folding paper lantern, and the paper strips twist to show their paler back."
  },
  nouveau: {
    name: "Art Nouveau",
    scene: "A hummingbird hovers and drinks from a red trumpet flower inside an ornamental poster frame.",
    style: "An Art Nouveau poster: flowing whiplash lines, a thick dark outline around every shape, flat muted fills (sage, olive, gold ochre, cream, deep red), a circular halo behind the bird with a fine decorative pattern, stylised leaves and vines growing into the frame, and aged lithograph paper. No text or lettering.",
    action: "The hummingbird hovers with fast blurred wingbeats, darts in to drink from the flower and backs out again, while the vines and leaves sway and the halo pattern slowly turns.",
    motion: "Shapes move as clean outlined pieces, like a printed poster come to life. The wings blur as fast overlapping strokes, and the paper texture stays fixed to the frame."
  },
  goldenhour: {
    name: "Golden Hour",
    scene: "A swallow skims a ripe wheat field at sunset and snaps an insect out of the air.",
    style: "Golden hour gouache: warm opaque paint, the low sun turning the wheat gold and orange, long shadows, a soft hazy sky and visible brush texture.",
    action: "The swallow swoops low over the wheat in fast arcs with sharp wingbeats, banks and catches an insect in mid air, while the wheat waves in the wind and slides past below.",
    motion: "The wheat bends in waves of painted strokes. The brush texture moves with each object, and the paper grain stays fixed to the frame."
  },
  ghibli: {
    name: "Ghibli Style",
    scene: "Two kids, a girl and a boy, run through a sunny green meadow under big summer clouds, laughing.",
    style: "A hand-painted anime film background in gouache, the look of classic Japanese animated films: lush greens, big white cumulus clouds in a blue sky, tiny white and yellow flowers in the grass and visible brush texture. The kids are drawn with clean, simple lines and soft flat colour, with natural proportions. An original look and original characters, not a copy of any film.",
    action: "The kids run through the grass with the camera moving alongside them. The girl looks back and laughs, the boy smiles, and their hair, clothes and the grass flutter in the wind while the clouds drift.",
    motion: "Like hand-drawn animation: the kids are drawn on twos (a new pose every 2 frames), and the background layers slide past at different speeds."
  }
};

const OWN_SCENE = "{describe your scene here}";
const OWN_STYLE = "{describe your style here}";
const OWN_ACTION = "The main subject does what it naturally does (swims, flies, runs, grows) and travels through the scene, and the rest of the scene reacts to it.";
const OWN_MOTION = "Every movement looks made in that medium, never like a digital effect laid on top.";

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

  // Style picker: fills the slots of prompt 1 and prompt 2
  var chips = Array.prototype.slice.call(document.querySelectorAll("#chips .chip"));
  var slots = {
    scene: document.getElementById("slot-scene"),
    style: document.getElementById("slot-style"),
    action: document.getElementById("slot-action"),
    motion: document.getElementById("slot-motion")
  };
  var metas = Array.prototype.slice.call(document.querySelectorAll("[data-meta]"));
  var own = document.getElementById("own");
  var ownScene = document.getElementById("own-scene");
  var ownStyle = document.getElementById("own-style");
  var ownMode = false;

  function setSlot(el, text, empty) {
    el.textContent = text;
    el.classList.toggle("empty", !!empty);
  }
  function setMeta(text) {
    metas.forEach(function (m) { m.textContent = text; });
  }
  function clean(input) {
    return input.value.trim().replace(/\s+/g, " ");
  }
  function updateOwn() {
    var sc = clean(ownScene);
    var st = clean(ownStyle);
    setSlot(slots.scene, sc || OWN_SCENE, !sc);
    setSlot(slots.style, st || OWN_STYLE, !st);
    setSlot(slots.action, OWN_ACTION, false);
    setSlot(slots.motion, OWN_MOTION, false);
    setMeta(sc && st ? "style: your own" : "style: type it below the chips");
  }
  function pick(key) {
    var s = STYLES[key];
    if (!s) return;
    setSlot(slots.scene, s.scene, false);
    setSlot(slots.style, s.style, false);
    setSlot(slots.action, s.action, false);
    setSlot(slots.motion, s.motion, false);
    setMeta("style: " + s.name);
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      ownMode = chip.dataset.own === "true";
      own.hidden = !ownMode;
      if (ownMode) {
        updateOwn();
        ownScene.focus();
      } else {
        pick(chip.dataset.key);
      }
    });
  });
  ownScene.addEventListener("input", updateOwn);
  ownStyle.addEventListener("input", updateOwn);

  // Copy: every button names the element whose text it copies (data-copy="id")
  var status = document.getElementById("status");
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
      var label = b.querySelector(".copy-label");
      if (!b.dataset.label) b.dataset.label = label.textContent;
      label.textContent = b.dataset.label;
    });
    var label = btn.querySelector(".copy-label");
    label.textContent = ok ? "Copied" : "Copy failed";
    var where = btn.closest("[data-status]");
    var msg = ok ? (btn.dataset.done || "Copied. Paste it into the chat and send.")
                 : "Copy did not work here. The text is selected, copy it by hand.";
    var target = where ? where.querySelector(".status") : status;
    (target || status).textContent = msg;
    if (!ok) selectNode(node);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () { label.textContent = btn.dataset.label; }, 2200);
  }
  function doCopy(btn) {
    var node = document.getElementById(btn.dataset.copy);
    if (!node) return;
    var needsOwn = btn.dataset.copy === "p1" || btn.dataset.copy === "p2";
    if (ownMode && needsOwn && (!clean(ownScene) || !clean(ownStyle))) {
      status.textContent = "Type your scene and style first, then tap Copy.";
      (clean(ownScene) ? ownStyle : ownScene).focus();
      return;
    }
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

  pick("watercolour");
})();

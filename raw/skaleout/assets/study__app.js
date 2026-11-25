// Jan's Instagram profile URL. Set it here, the footer link picks it up.
const INSTAGRAM_URL = "https://www.instagram.com/";

const DEFAULT_TOPIC = "how a rocket reaches orbit";
const EMPTY_TOPIC = "{type your topic here}";

// The ten formats. Each prompt has one {TOPIC} slot; INTRO goes before it and SHARED after it.
const INTRO = "";
const SHARED = "Make it a portrait image with a 2:3 ratio. The image is the page itself: flat, edge to edge, not a photo of a poster, no desk, no hands, no frame around it. Make it look like a finished page from a premium illustrated study guide: full, with no big empty areas. Write real, accurate content about the topic: real facts and real numbers, no filler text and nothing made up. Small text is fine, but every word must be crisp and spelled correctly. One consistent illustration style, careful alignment. No logos, brand names or watermark.";

const FORMATS = {
  blueprint: {
    name: "Blueprint",
    text: "Create an image. A detailed engineering blueprint about {TOPIC}: crisp white linework on deep blueprint blue with a fine grid and draftsman capital lettering. A large main drawing of the subject with dimension lines and 7 numbered callouts, each a name plus a one-line note. On the side: three small detail insets marked A, B and C, a specification table with 6 to 8 rows of real numbers, and a short numbered notes list. A title block in the bottom corner."
  },
  exploded: {
    name: "Exploded view",
    text: "Create an image. An exploded view about {TOPIC}: the main object pulled apart along one vertical axis into 8 to 10 parts, as a clean premium product render on a soft light grey studio background. Thin leader lines to each part: a bold part name and, under it, a short note in brackets saying what the part does. A title and subtitle at the top left, a thin scale bar at the side, and a row of three key number chips at the bottom."
  },
  cutaway: {
    name: "Cutaway",
    text: "Create an image. A detailed cutaway illustration about {TOPIC}: the main object sliced open to show what is inside, on a dark navy background with bold colour coding. 8 to 10 labels on leader lines, each a bold name plus a small note under it. On the side a boxed panel \"How it works\" with a small diagram and 4 numbered steps. At the bottom a colour legend and one horizontal bar chart of what it is made of, with percentages. Title and subtitle at the top."
  },
  timeline: {
    name: "Timeline",
    text: "Create an image. A history timeline about {TOPIC}, as an editorial page on warm cream paper with serif headings: a vertical line with 8 entries in date order. Each entry has a small painted illustration on one side of the line and, on the other, a coloured year chip, a bold heading and two lines of text about what happened. A title and subtitle at the top, a one-line footer at the bottom."
  },
  flowchart: {
    name: "Flowchart",
    text: "Create an image. A flowchart about {TOPIC}: 7 to 9 soft pastel rounded boxes connected by arrows down the page, each with a small illustration, a bold heading and one or two lines of text. Include two diamond decision points with yes and no branches: one leads to a red \"stop\" box, one loops back. Clean modern style on white. A title and subtitle at the top, a colour legend and a small note box at the bottom."
  },
  sketchnotes: {
    name: "Sketchnotes",
    text: "Create an image. Sketchnotes about {TOPIC}: black ink doodles and hand lettering on off-white dotted notebook paper, with three marker colours for highlights. A big hand lettered title banner at the top, then eight numbered panels in two columns. Each panel has a banner heading, a doodle, three short handwritten bullets and one boxed takeaway. Small extra notes with arrows in the corners."
  },
  comic: {
    name: "Comic strip",
    text: "Create an image. A six panel educational comic page that explains {TOPIC} step by step, in two columns of three panels: bold black outlines, flat bright colours, one or two friendly cartoon characters. Every panel has one speech bubble and one yellow caption box with a real fact. A title banner across the top that asks the question the comic answers, and a footer strip with the one-line answer."
  },
  mindmap: {
    name: "Mind map",
    text: "Create an image. A rich mind map about {TOPIC} on white: a central node with a small drawing in it, five thick organic branches in five colours, each with a bold branch name and three leaves. Every leaf is a small colourful icon plus a short fact, with a number where one fits. Rounded hand lettering. Two small boxes in opposite corners: \"Remember\" with the one key idea, and a small box of key numbers."
  },
  whiteboard: {
    name: "Whiteboard",
    text: "Create an image. A classroom whiteboard after a great lecture about {TOPIC}, filling the whole frame: dry erase markers in black, blue, red and green, confident handwriting, boxes, arrows and underlines. A title along the top, then six zones in a grid, each with an underlined heading: the goal, the key formula or rule (boxed, with each term explained), a labelled sketch, a small table of numbers, a common mistake crossed out next to the right way, and a ticked checklist."
  },
  isometric: {
    name: "Isometric",
    text: "Create an image. A soft, detailed isometric 3D diorama that shows {TOPIC} in one picture: pastel colours, tiny believable details, a light background. The main scene sits on an isometric tile with 5 labelled parts; the process rises or flows through 4 labelled stages or layers; 5 numbered event tags along the way each carry a short fact and a number. Clean rounded label tags with thin leader lines, a title and subtitle at the top, and a floating key numbers card at one side."
  }
};

(function () {
  "use strict";

  // Footer link
  var ig = document.getElementById("ig-link");
  if (ig && INSTAGRAM_URL) ig.href = INSTAGRAM_URL;

  var chips = Array.prototype.slice.call(document.querySelectorAll("#chips .chip"));
  var topicInput = document.getElementById("topic");
  var prompt = document.getElementById("p1");
  var metas = Array.prototype.slice.call(document.querySelectorAll("[data-meta]"));
  var current = "blueprint";
  var slot = null;

  function clean(input) {
    return input.value.trim().replace(/\s+/g, " ");
  }

  // Rebuild the prompt: text before the topic, the highlighted topic, text after it.
  function render() {
    var f = FORMATS[current];
    if (!f) return;
    var parts = (INTRO + f.text).split("{TOPIC}");
    var topic = clean(topicInput);
    slot = document.createElement("mark");
    slot.className = "slot" + (topic ? "" : " empty");
    slot.id = "slot-topic";
    slot.textContent = topic || EMPTY_TOPIC;
    prompt.textContent = "";
    prompt.appendChild(document.createTextNode(parts[0]));
    prompt.appendChild(slot);
    prompt.appendChild(document.createTextNode(parts[1] + "\n\n" + SHARED));
    metas.forEach(function (m) { m.textContent = "format: " + f.name; });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      current = chip.dataset.key;
      render();
    });
  });
  topicInput.addEventListener("input", render);

  // Copy, with the clipboard fallback
  var statusBox = document.querySelector("[data-status] .status");
  var more = document.getElementById("more");
  var copyBtn = document.querySelector("[data-copy]");
  var copyLabel = copyBtn.querySelector(".copy-label");
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
  function feedback(ok) {
    copyLabel.textContent = ok ? "Copied" : "Copy failed";
    statusBox.textContent = ok ? "Paste it into a new chat in ChatGPT and send it."
                               : "Copy did not work here. The text is selected, copy it by hand.";
    more.hidden = !ok;
    if (!ok) selectNode(prompt);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () { copyLabel.textContent = "Copy"; }, 2200);
  }
  copyBtn.addEventListener("click", function () {
    if (!clean(topicInput)) {
      statusBox.textContent = "Type your topic first, then tap Copy.";
      more.hidden = true;
      topicInput.focus();
      return;
    }
    var text = prompt.textContent.trim();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { feedback(true); },
        function () { feedback(fallbackCopy(text)); }
      );
    } else {
      feedback(fallbackCopy(text));
    }
  });

  render();
})();

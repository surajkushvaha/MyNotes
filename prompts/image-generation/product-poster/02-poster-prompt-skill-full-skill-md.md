# /poster-prompt skill (full SKILL.md)

- **Category:** Image generation
- **Tutorial:** Studio posters from a product photo
- **Type:** skill
- **Description:** The skill inside poster-prompt-skill.zip: Claude picks the six fields and writes the poster prompt for you.
- **Source:** https://learn.skaleout.com/poster

````text
---
name: poster-prompt
description: Writes a ready-to-paste ChatGPT prompt that turns a plain product photo into a studio ad poster. Use when the user attaches a product photo or describes a product and wants a poster, an ad, or "the poster prompt". It picks six fields (background colour, headline colour, headline, small line, a real place, one light) and returns the full prompt filled in.
---

# poster-prompt

Goal: give the user one block of text they paste into ChatGPT together with their product photo. ChatGPT then makes a print style ad poster. You do not make the poster yourself.

## Step 1: look at the product
Use the attached photo or the user's description. Note the product's main colour, its material, whether it has a brand name on it, and what kind of product it is. If you have nothing to go on, ask for a photo or one sentence about the product.

## Step 2: pick the six fields by these rules
1. **Background colour**: one calm colour that sits next to the product's main colour (a pale or a deep tone, never a loud one). Name it in plain words: "deep navy blue", "pale sage green", "warm terracotta".
2. **Headline colour**: one colour taken from the product itself, or a clear contrast to the background. Two main colours only on the whole poster.
3. **Headline**: the brand name written on the product. If there is none, one short invented word or the product name, one or two words, in capital letters.
4. **Small line**: one short line in capital letters that says what it is or one feeling, for example "WHOLE BEAN COFFEE" or "SOUND AND NOTHING ELSE". At most five words.
5. **Real scene**: one real place where this product lives, with one or two small things beside it ("a worn oak kitchen counter next to a small hand grinder"). A real surface and a real room, never a studio void.
6. **One light**: a single light source, how it falls and one shadow ("low morning sun through a window, one long shadow").

## Step 3: return the prompt
Reply with the fields as a short list (so the user can change one), then the full prompt below in one code block with the six fields filled in. Keep every other word exactly as written. Tell the user to start a new ChatGPT chat, attach the photo with the + button, paste the prompt and send.

The prompt template (replace the six parts in square brackets, nothing else):

```
Turn the product in my photo into a premium print ad poster. The product must stay exactly as it is in the photo: same shape, same colours, same label, same words. Build the poster around it. Do not add any text to the product itself. Format: one full-bleed portrait poster, 9:16, high resolution. No mockup, no frame, no border. Taste rules: Two main colours only: [BACKGROUND COLOUR] for the background and [HEADLINE COLOUR] for the headline. The product keeps its own colours. One huge headline, tightly spaced condensed type, across the top third: [HEADLINE]. Under it one small line in the same typeface: [SMALL LINE]. Put the product in a real place: [REAL SCENE]. Light it with one light: [ONE LIGHT]. Lots of empty space. A faint printed paper grain. No stickers, badges, arrows, glow, sparkles, extra slogans or extra fonts. Spell every word exactly as written above.
```

## After the poster
If a word on the poster is spelled wrong, the user replies in the same ChatGPT chat: "fix the spelling of HEADLINE, keep everything else" (with the real headline). For another take, send the same prompt again in a new chat.
````

# Musical text

A play button for my favorite song, *What Goes Around...Comes Around* by Justin Timberlake, with a text that bounces along on the beat. A switch next to the button chooses between two animations:

- **Weight**: the letters get bolder on the kick, in a wave from left to right.
- **Equalizer**: every letter is a bar of an equalizer, like the lights on a studio panel: bass on the left, high sounds on the right. The letters are bolder, closer together and already a bit stretched.

The text is always one line, and gets smaller when the page isn't wide enough.

**Files**

- [`src/routes/+page.server.js`](../src/routes/+page.server.js): looks up the song at Apple
- [`src/lib/components/MusicalText.svelte`](../src/lib/components/MusicalText.svelte): the component
- [`src/lib/components/Biography.svelte`](../src/lib/components/Biography.svelte): uses it, with the text and the song
- [`src/app.css`](../src/app.css): the `inter` variable font

---

## 1. The song: an Apple preview

Spotify doesn't give out audio files, and a Spotify embed is an iframe from another domain, so its sound can't be analysed. Apple has a free API that gives a 30 second preview of every song, and its server allows other sites to analyse it (CORS).

`+page.server.js` looks up the song by its id at build time:

```
https://itunes.apple.com/lookup?id=1441492959&country=nl
```

and passes `previewUrl` (the 30 seconds) and `trackViewUrl` (the song in Apple Music) to the page. They are looked up at build time and not written in the code, because Apple can change the preview url.

- **Changing the song**: find it on [music.apple.com](https://music.apple.com), the id is the `?i=` in the url of the song. Put it in `favoriteSongId` and change `songTitle` in `Biography.svelte`.
- Apple decides which 30 seconds you get, usually the chorus.
- Apple only allows the previews streamed from its own url and with a link to the song in Apple Music, so the file is not downloaded into the project and there is a link to the song next to the switch. The link is a diagonal arrow (↗, [`ArrowIcon.svelte`](../src/lib/components/ArrowIcon.svelte), also used for the GitHub links of the projects) that moves a bit in its own direction on hover and focus (`translate: .25rem -.25rem`). It doesn't get the underline of the other links (`a::after` in `app.css`), the arrow moving is the hover effect.
- **No internet or Apple down while building**: `getFavoriteSong` returns `null` and Biography leaves the component out, so the build doesn't fail.

## 2. Usage

```svelte
<MusicalText
    text="What goes around comes around"
    song={favoriteSong.previewUrl}
    songTitle="What Goes Around...Comes Around"
    songUrl={favoriteSong.appleMusicUrl}
/>
```

| Prop | What it does |
| --- | --- |
| `text` | The text that bounces |
| `song` | The url of the song |
| `songTitle` | Ends up in the button: "Play …" / "Pause …" |
| `songUrl` | The link to the whole song |

### Place in the biography

The musical text sits below the text of the biography, at the bottom of the section, and while the biography is on screen it sticks to the bottom of the screen, above the fixed nav.

```css
#biography {
    display: flex;
    flex-direction: column;
}

.biography-music {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.biography-music-sticky {
    position: sticky;
    bottom: 4rem;
}
```

- `.biography-music` fills the rest of the section below the text (`flex-grow: 1`), and `justify-content: flex-end` puts the musical text at the bottom of it.
- `.biography-music-sticky` is `position: sticky` with `bottom: 4rem`: while the bottom of the section is still below the screen, it sticks to the bottom of the screen. When you scroll on, it stops at the bottom of the section and scrolls away with it.
- **Why the extra wrapper**: a sticky element stays inside its parent. With the sticky element straight in the section, its parent would be the whole section and it could move up over the text. Inside `.biography-music` it can't move higher than the end of the text. On a small phone the text can push it partly below the screen at first, it sticks as soon as you scroll a bit further.

## 3. Measuring the beat

The song plays in an `<audio>` element. On the first click it gets connected to the Web Audio API:

```
<audio> → MediaElementSource ─┬→ analyser ──→ speakers
                              └→ equalizerAnalyser
```

There are two analysers because they need different settings, see [Equalizer](#equalizer).

- `crossorigin="anonymous"` on the `<audio>` is needed because the song comes from another domain. Without it the song still plays, but the browser gives the analyser only zeros.
- The `AudioContext` is made on the click and not on load: browsers only allow sound to start after the visitor did something.
- `createMediaElementSource` can only be called once per element, so it's only done the first time.
- `preload="none"`: the song is only downloaded after the click.

While the song plays, `measureBeat` runs every frame (`requestAnimationFrame`). `getByteFrequencyData` gives the loudness of every frequency (0 to 255), split into bins. `loudness(band, …)` gives the average of the bins between two frequencies in Hz.

For the weight animation, `measureKick` looks at the kick drum and bass (43 to 215Hz):

1. A running average of the bass is kept, starting at the first measurement. The beat is how far the bass **jumps above** that average, not how loud it is: otherwise a loud song keeps every letter bold, and a quiet one never moves.
2. The level jumps up right away on a kick and falls back slowly (`* .88` per frame). That fast up and slow down is what makes it look like a bounce.

## 4. Letters

The text is split into words and letters. Every letter is a `<span>` with two custom properties, both 0 to 1, set every frame:

- `--beat`: the kick of a few frames ago. `beats` keeps the kick of the last frames, newest first, and letter `n` uses `beats[n * letterDelay]`, so the beat rolls through the text from left to right.
- `--level`: how loud the equalizer band of this letter is right now.

The letters are `inline-block` so `scale` works, with `transform-origin: bottom` so they grow upwards from the baseline. A line can break between any two inline-blocks, so every word is a `<span>` with `white-space: nowrap`: lines only break between words. The letters have `line-height: 1`: the box of an inline-block is as high as its line height, and with the line height of the text it would scale from a box twice as high as the letter.

### One line that fits

With JS the text is always one line (`white-space: nowrap`) and as big as fits, up to 5rem:

```css
.musical-text { container-type: inline-size; }
.text.fits { font-size: min(5rem, 100cqi / var(--text-ems)); }
```

- `100cqi` is the width of `.musical-text`, `--text-ems` the width of the text in em. Divided, that's the font-size where the text just fits.
- **Measuring `textEms`**: `.sizers` holds two invisible copies of the text, one in the widest form of each animation: `.weight-sizer` at weight 900 (every letter bold at once) and `.equalizer-sizer` with the weight and letter-spacing of the equalizer. JS divides the widest of the two by their font-size. Because it uses the widest form, the text still fits when every letter is bold, and doesn't change size when switching.
- It's measured after `document.fonts.ready`: with the fallback font while Inter is loading, the width would be wrong.
- `.sizers` is `position: absolute` with a width of 0 and `overflow: hidden`, so the copies take no space and can't make the page scroll sideways, but still have their real width.
- The letters only scale vertically, so the animations don't change the width.
- **Without JS** nothing is measured and the text just breaks between words, with `clamp(2rem, 8vw, 5rem)`.

### Weight

```css
font-weight: calc(100 + var(--beat) * 800);
scale: 1 calc(1 + var(--beat) * .25);
```

Inter is a variable font with a weight axis from 100 to 900, so every value in between exists. With a normal font the weight would jump between a few fixed weights.

### Equalizer

An equalizer doesn't play anything separately: it shows how loud every pitch of the song is at this moment. Every bar is a range of frequencies, from the bass on the left, through voices and melody in the middle, to hi-hats and "sss" sounds on the right. So all bars move at the same time, each in its own way.

```css
font-weight: 600;
letter-spacing: -.04em;
scale: 1 calc(1.3 + var(--level) * 1.7);
```

The letters are bolder and closer together than in the weight animation, and 1.3 times as tall when it's quiet, up to 3 times on a loud band. The weight, letter-spacing and the stretch of 1.3 also apply with reduced motion, because they don't move.

- **One band per letter** (`equalizerBands`), from 40Hz on the first letter to 12kHz on the last. The bands are spread logarithmically, like on a real equalizer: every octave is twice the frequency of the one below, so with equal steps in Hz almost all of the music would end up in the first few letters.
- **Its own analyser**, with settings that make a lively equalizer but would make the weight bounce worse:
  - `fftSize = 4096`: bins of about 11Hz. With 43Hz bins the lowest bands are narrower than one bin, and the first letters would always move the same.
  - `minDecibels = -70`, `maxDecibels = -25`: music is mostly in this range. With the default -100 to -30 every letter stays at least half up.
  - `smoothingTimeConstant = .5`: less smoothing than the default `.8`, so the letters react faster.
- **Slope**: high sounds are much softer than bass in music, so the right half of the text would hardly move. Like a real equalizer every octave gets a bit extra: `slopePerOctave` (1.5dB).
- **Falling back**: a letter goes up right away and falls back slowly (`* .9` per frame), like the lights of a real equalizer.
- Inter has no height axis, only `wght` (weight) and `opsz` (optical size). Fonts with a real height axis exist, like Roboto Flex (`YTUC`, `YTLC`), but they only stretch a little. `scale` on the y-axis works with any font and can make a letter twice as tall, just like `--heading-stretch` does for the headings in `app.css`.
- The text gets `padding-top: 2em` in this mode, so letters 3 times as tall don't run into the heading above.

### The switch

Two radio buttons in one pill (`.switch`), with a knob that slides behind the chosen option. The CSS picks the animation with `:has()`, so switching needs no JS:

```css
.musical-text:has(input[value="equalizer"]:checked) .letter { … }
```

Both `--beat` and `--level` are always set, so you can switch while the song plays.

- It's the global `.switch` class from `app.css`, the same as the project filter. How the knob works is in the [Conventions](../README.md#conventions) of the README.
- With its padding and border it's 44px high, the same as the play button.

## 5. Accessibility

- **Screen readers**: a text split into letters would be read letter by letter, so the letters are `aria-hidden` and a `.visually-hidden` copy holds the whole text.
- **Button**: the text says what it does ("Play …" / "Pause …"), so no `aria-pressed`, just like the theme toggle. 44px touch target and a visible focus ring.
- **Switch**: a `fieldset` with a visually hidden `legend` ("Animation"), so screen readers hear what the two options are for. The radio buttons stay in the page for keyboard and screen readers, the label shows the focus.
- **Apple Music link**: only the arrow is visible, so the text "Listen to the whole song on Apple Music" is in a `.visually-hidden` span: that's what screen readers read as the name of the link. The arrow `svg` is `aria-hidden`. 44px touch target and a visible focus ring.
- **Reduced motion**: the `font-weight` and `scale` of both animations only apply inside `prefers-reduced-motion: no-preference`. The song still plays, the text stays still.
- **Without JS** the button and the switch aren't shown, because they can't do anything. The text is there, thin and still, and the Apple Music link works.

## 6. Tweaking

| What | Where |
| --- | --- |
| How strong the bounce is | `* 4` in `jump` in `measureKick`. Higher reacts to smaller kicks |
| How fast it falls back | `kick.level * .88` (weight) and `* .9` in `measureBeat` (equalizer). Lower is shorter and snappier |
| How fast the wave moves through the text | `letterDelay` (frames between two letters) |
| How bold and tall it gets (weight) | `* 800` and `* .25` in `.letter` |
| How tall the letters are (equalizer) | `1.3` (quiet) and `* 1.7` (extra on a loud band) in the equalizer `scale`. Raise the `padding-top` with it |
| How bold and close together (equalizer) | `font-weight` and `letter-spacing` of the equalizer `.letter`, **and** the same on `.equalizer-sizer`, otherwise the text is measured wrong |
| How big the text gets at most | `5rem` in `.text.fits` |
| Which sounds the equalizer shows | `lowestFrequency` and `highestFrequency` |
| How much the high letters move (equalizer) | `slopePerOctave`, in dB. Higher lifts the right side of the text |
| How lively the equalizer is | `minDecibels` and `maxDecibels` of `equalizerAnalyser`. A smaller range gives more difference between soft and loud |

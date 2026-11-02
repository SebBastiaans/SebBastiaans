<script>
    let { text, song, songTitle, songUrl } = $props();

    // frames of delay between two letters, so the beat rolls through the text like a wave
    const letterDelay = 2;

    // grouped per word, so a line only breaks between words and not in the middle of one
    const words = $derived.by(() => {
        let index = 0;
        return text.split(' ').map((word) => [...word].map((letter) => ({ letter, index: index++ })));
    });
    const letterCount = $derived(words.flat().length);

    // the button only works with JS, so it's only shown once JS runs
    let canPlay = $state(false);
    let paused = $state(true);
    // the kick of the last frames, newest first: 0 is quiet, 1 is a hard kick
    let beats = $state([]);
    // the equalizer: how loud the band of every letter is right now, 0 to 1
    let spectrum = $state([]);

    let audio;
    let analyser;
    let frequencies;
    // its own analyser, with settings that make a lively equalizer but would make the weight bounce worse
    let equalizerAnalyser;
    let equalizerFrequencies;
    let frame;

    // kick drum and bass, 43 to 215Hz. average: running average of the bass, a beat is the bass jumping above it
    const kick = { from: 43, to: 215, average: undefined, level: 0 };

    // one band per letter, from deep bass on the first letter to the highest sounds on the last
    // spread logarithmically like a real equalizer: every octave is twice the frequency of the one below,
    // so with equal steps in Hz almost all of the music would end up in the first few letters
    const lowestFrequency = 40;
    const highestFrequency = 12000;
    // dB extra for every octave higher, see measureBeat
    const slopePerOctave = 1.5;
    const equalizerBands = $derived(Array.from({ length: letterCount }, (_, index) => ({
        from: lowestFrequency * (highestFrequency / lowestFrequency) ** (index / letterCount),
        to: lowestFrequency * (highestFrequency / lowestFrequency) ** ((index + 1) / letterCount)
    })));

    // the width of the text in em in its widest form, so the CSS can make it fit on one line
    let textEms = $state();
    let weightSizer;
    let equalizerSizer;

    $effect(() => {
        canPlay = true;

        // measured once Inter is loaded, with a fallback font the width would be wrong
        // the widest of both animations, so the text doesn't change size when switching
        document.fonts.ready.then(() => {
            textEms = Math.max(weightSizer.offsetWidth, equalizerSizer.offsetWidth) / parseFloat(getComputedStyle(weightSizer).fontSize);
        });

        return () => {
            cancelAnimationFrame(frame);
            analyser?.context.close();
        };
    });

    function togglePlay() {
        if (!paused) {
            audio.pause();
            return;
        }

        // an AudioContext may only start after a click, so it's made here and not on load
        if (!analyser) {
            const context = new AudioContext();
            analyser = context.createAnalyser();
            analyser.fftSize = 1024;
            frequencies = new Uint8Array(analyser.frequencyBinCount);

            equalizerAnalyser = context.createAnalyser();
            // bins of about 11Hz, otherwise the lowest letters share one bin and always move the same
            equalizerAnalyser.fftSize = 4096;
            // music is mostly between -70 and -25dB, the default -100 to -30 keeps every letter half up
            equalizerAnalyser.minDecibels = -70;
            equalizerAnalyser.maxDecibels = -25;
            // less smoothing than the default .8, so the letters react faster
            equalizerAnalyser.smoothingTimeConstant = .5;
            equalizerFrequencies = new Uint8Array(equalizerAnalyser.frequencyBinCount);

            // the song goes through the analyser to the speakers, and to the equalizer analyser next to it
            const source = context.createMediaElementSource(audio);
            source.connect(analyser);
            source.connect(equalizerAnalyser);
            analyser.connect(context.destination);
        }

        analyser.context.resume();
        audio.play();
        frame = requestAnimationFrame(measureBeat);
    }

    function measureBeat() {
        analyser.getByteFrequencyData(frequencies);
        equalizerAnalyser.getByteFrequencyData(equalizerFrequencies);

        beats = [measureKick(), ...beats].slice(0, letterCount * letterDelay);
        spectrum = equalizerBands.map((band, index) => {
            const bandLoudness = loudness(band, equalizerAnalyser, equalizerFrequencies);
            // high sounds are much softer than bass in music, so like a real equalizer every octave gets a few dB extra (slope)
            // otherwise the right half of the text hardly moves
            const octaves = Math.log2(band.from / lowestFrequency);
            const slope = bandLoudness ? octaves * slopePerOctave * 255 / (equalizerAnalyser.maxDecibels - equalizerAnalyser.minDecibels) : 0;
            const level = Math.min(1, (bandLoudness + slope) / 255);
            // up right away, down slowly, like the lights of a real equalizer
            return Math.max(level, (spectrum[index] ?? 0) * .9);
        });

        // audio.paused and not the bound paused: that one only changes after the play event, a frame too late
        if (!audio.paused) frame = requestAnimationFrame(measureBeat);
    }

    // 0 is quiet, 1 is a hard kick
    function measureKick() {
        const bass = loudness(kick, analyser, frequencies);

        // starts at the first measurement, from 0 the whole first second would count as one big beat
        kick.average ??= bass;
        kick.average = kick.average * .95 + bass * .05;

        // how far the bass jumps above its average, so a loud song doesn't keep every letter bold
        const jump = Math.min(1, Math.max(0, (bass - kick.average) / (255 - kick.average) * 4));

        // jumps up right away on a kick, falls back slowly: that makes the bounce
        kick.level = jump > kick.level ? jump : kick.level * .88;
        return kick.level;
    }

    // the average loudness (0 to 255) of the bins from band.from to band.to Hz
    function loudness(band, analyser, frequencies) {
        // the frequencies of one bin, about 43Hz with fftSize 1024
        const binWidth = analyser.context.sampleRate / analyser.fftSize;
        const from = Math.round(band.from / binWidth);
        // at least one bin: the lowest bands are narrower than a bin
        const to = Math.max(from, Math.round(band.to / binWidth) - 1);

        let sum = 0;
        for (let bin = from; bin <= to; bin++) sum += frequencies[bin];
        return sum / (to - from + 1);
    }

    function stop() {
        cancelAnimationFrame(frame);
        beats = [];
        spectrum = [];
    }
</script>

<div class="musical-text">
    <!-- screen readers read the text in one go, not letter by letter -->
    <p class="text" class:fits={textEms} style:--text-ems={textEms}>
        <span class="visually-hidden">{text}</span>
        <!-- invisible copies of the text in the widest form of each animation, to measure textEms -->
        <span class="sizers" aria-hidden="true">
            <span class="weight-sizer" bind:this={weightSizer}>{text}</span>
            <span class="equalizer-sizer" bind:this={equalizerSizer}>{text}</span>
        </span>
        <span aria-hidden="true">
            {#each words as word, wordIndex}
                {#if wordIndex > 0}{' '}{/if}<span class="word">{#each word as { letter, index }}<span
                    class="letter"
                    style:--beat={beats[index * letterDelay] ?? 0}
                    style:--level={spectrum[index] ?? 0}
                >{letter}</span>{/each}</span>
            {/each}
        </span>
    </p>

    <div class="controls">
        {#if canPlay}
            <!-- the text says what the button does, so no aria-pressed: "Pause, pressed" would be confusing -->
            <button type="button" class="pill play-toggle" onclick={togglePlay}>
                {#if paused}
                    <span aria-hidden="true">▶</span>
                    Play
                {:else}
                    <span aria-hidden="true">❚❚</span>
                    Pause
                {/if}
            </button>

            <!-- radio buttons and :has() in the CSS, like the project filter: switching needs no JS -->
            <fieldset class="style-switch">
                <!-- still read by screen readers, the options speak for themselves visually -->
                <legend class="visually-hidden">Animation</legend>
                <label>
                    <input type="radio" name="musical-text-style" value="weight" checked>
                    Weight
                </label>
                <label>
                    <input type="radio" name="musical-text-style" value="equalizer">
                    Equalizer
                </label>
            </fieldset>
        {/if}

        <!-- Apple only allows its previews with a link to the song in Apple Music, it also works without JS -->
        <!-- only the arrow is visible, the text is still the name of the link for screen readers -->
        <a class="apple-music-link" href={songUrl}>
            <span class="visually-hidden">Listen to the whole song on Apple Music</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
            </svg>
        </a>
    </div>

    <!-- crossorigin: without it the song still plays, but the analyser only gets zeros from another domain -->
    <audio bind:this={audio} bind:paused src={song} crossorigin="anonymous" preload="none" onpause={stop} onended={stop}></audio>
</div>

<style>
.musical-text{
    /* the text uses cqi of this to fit on one line */
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
}

.text{
    font-family: 'inter';
    font-size: clamp(2rem, 8vw, 5rem);
    font-weight: 100;
    line-height: 1.1;

    /* once JS measured the text: always one line, as big as fits, up to 5rem */
    /* 100cqi is the width of .musical-text, textEms the width of the text in em, so this is the font-size where it just fits */
    &.fits{
        white-space: nowrap;
        font-size: min(5rem, 100cqi / var(--text-ems));
    }
}

/* takes no space and can't make the page scroll sideways, but the copies inside still have their real width */
.sizers{
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;

    span{
        position: absolute;
        white-space: pre;
    }
}

/* the widest moment of the weight animation: every letter at 900 */
.weight-sizer{
    font-weight: 900;
}

/* same as the equalizer .letter */
.equalizer-sizer{
    font-weight: 600;
    letter-spacing: -.04em;
}

.word{
    /* the letters are inline-blocks, a line could break between any two of them without this */
    white-space: nowrap;
    /* the words decide the height of the line, the letters inside have line-height 1 to scale from themselves */
    line-height: var(--line-height);
}

.letter{
    /* inline-block lets the letters scale */
    display: inline-block;
    /* the box of an inline-block is as high as its line height, with 1 it scales from the letter itself */
    line-height: 1;
    transform-origin: bottom;

    @media (prefers-reduced-motion: no-preference) {
        /* --beat is 0 to 1, set every frame while the song plays */
        font-weight: calc(100 + var(--beat) * 800);
        scale: 1 calc(1 + var(--beat) * .25);
    }
}

/* equalizer: bolder, tighter letters that are already a bit stretched, and shoot up like the lights on a studio panel */
/* the font-weight and letter-spacing are also on .equalizer-sizer, so the text is measured the same */
.musical-text:has(input[value="equalizer"]:checked){
    .text{
        /* the text is one line, this is the room above it for letters up to 3 times as tall */
        padding-top: 2em;
    }

    .letter{
        font-weight: 600;
        letter-spacing: -.04em;
        scale: 1 1.3;

        @media (prefers-reduced-motion: no-preference) {
            /* --level is 0 to 1: how loud the band of this letter is, bass on the left, high sounds on the right */
            scale: 1 calc(1.3 + var(--level) * 1.7);
        }
    }
}

.controls{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
}

.play-toggle{
    /* the song title is long, on small screens it goes to a second line */
    text-align: start;
}

/* one pill with both options, a knob slides behind the chosen one */
.style-switch{
    --switch-padding: 2px;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0;
    padding: var(--switch-padding);
    border: 2px solid var(--color-primary);
    border-radius: 2rem;
    background: var(--color-background);

    /* the knob: half of the switch, translate 100% moves it exactly one option to the right */
    &::before{
        content: '';
        position: absolute;
        inset-block: var(--switch-padding);
        inset-inline-start: var(--switch-padding);
        width: calc(50% - var(--switch-padding));
        border-radius: 2rem;
        background: var(--color-primary);
        transition: translate .25s ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }

    &:has(input[value="equalizer"]:checked)::before{
        translate: 100%;
    }

    label{
        /* with the padding and border of the switch it's 44px high, like the play button */
        min-height: calc(2.75rem - 2 * var(--switch-padding) - 4px);
        /* in front of the knob */
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding-inline: 1rem;
        border-radius: 2rem;
        color: var(--color-text);
        cursor: pointer;
        transition: color .25s;

        &:has(input:checked){
            color: var(--color-background);
        }

        /* the input is still there for keyboard and screen readers, the label shows the focus */
        &:has(input:focus-visible){
            outline: 3px solid var(--color-text);
            outline-offset: 2px;
        }

        input{
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }
    }
}

.apple-music-link{
    /* 44px touch target */
    width: 2.75rem;
    height: 2.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: .5rem;
    color: var(--color-text);

    /* no underline on hover like the other links (app.css), the arrow moves instead */
    &::after{
        content: none;
    }

    svg{
        width: 1.75rem;
        height: 1.75rem;
        transition: translate .2s;
    }

    /* the arrow moves a bit in the direction it points: right and up */
    &:hover svg,
    &:focus-visible svg{
        translate: .25rem -.25rem;
    }

    &:focus-visible{
        outline: 3px solid var(--color-text);
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        svg{
            transition: none;
        }
    }
}
</style>

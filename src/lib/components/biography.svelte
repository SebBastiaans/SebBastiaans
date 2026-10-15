<section id="biography">
    <h2>Biography</h2>
    <ul>
        <li>Specializing in <span class="hint" data-tooltip="Try different view width's in your dev tools ;)">responsive</span>, accesible, performing, progressive enhanced websites</li>
        <li>Understanding design, translating it to code</li>
        <li>Scrumming, communicating, collaborating</li>
        <li>Soon to be AI prompt whisperer</li>
    </ul>
</section>

<style>
#biography{
    .hint{
        position: relative;
        cursor: help;

        &::after{
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: .35rem;
            white-space: nowrap;
            background: black;
            color: white;
            font-size: .75rem;
            padding: .25rem .5rem;
            border-radius: .25rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity .2s;
            z-index: 20;
        }

        &:hover::after{
            opacity: 1;
        }
    }
}
</style>

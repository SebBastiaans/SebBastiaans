<script>
    import profilePhoto from '$lib/assets/pics/IMG_7841-face.png';
</script>

<div class="hero">
    <img class="profile-photo" src={profilePhoto} alt="">
    <ul class="intro">
        <li>Student Front-end development & Design</li>
        <li>Utrecht, The Netherlands</li>
        <li>scroll down to see more</li>
    </ul>
</div>

<style>
.hero{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding-inline: 0;

    @media (width>=420px){
        padding-inline: clamp(.5rem, calc(.5rem + (100vw - 375px) * 2.5rem / 1065px), 3rem);
    }

    .profile-photo{
        flex: 1 1 300px;
        width: 100%;
        max-width: 420px;
        aspect-ratio: 1/1;

        @media (prefers-reduced-motion: no-preference) {
            @supports (animation-timeline: scroll()) {
                animation-name: photo-morph;
                animation-timing-function: linear;
                animation-fill-mode: both;
                animation-timeline: scroll(root);
                animation-range: 0 40vh;
            }
        }
    }

    .intro{
        flex: 1 1 auto;
    }
}

/* Every shape has 12 points, starting bottom-left and going clockwise, so they can morph into each other */
@keyframes photo-morph {
    0% {
        clip-path: polygon(0% 100%, 0% 0%, 20% 0%, 50% 0%, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 65% 100%, 50% 100%, 35% 100%, 20% 100%);
    }
    40%, 60% {
        /* M */
        clip-path: polygon(0% 100%, 0% 0%, 20% 0%, 50% 45%, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 80% 35%, 50% 80%, 20% 35%, 20% 100%);
    }
    100% {
        /* E */
        clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 20%, 25% 20%, 25% 40%, 80% 40%, 80% 60%, 25% 60%, 25% 80%, 100% 80%, 100% 100%);
    }
}
</style>

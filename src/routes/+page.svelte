<script>
    import { onMount } from 'svelte';
    import profilePhoto from '$lib/assets/pics/IMG_7841-face.png';
    import fixTheFlow from '$lib/assets/pics/fix-the-flow.png';
    import theStartupResponsive from '$lib/assets/pics/the-startup-responsive.png';
    import profileCard from '$lib/assets/pics/profile-card.png';
    import teamSquadPage from '$lib/assets/pics/team-squad-page.png';
    import userExpEnh from '$lib/assets/pics/user-exp-enh.png';
    import pleasurableUi from '$lib/assets/pics/pleasurable-ui.png';
    import proofOfConcept from '$lib/assets/pics/proof-of-concept.png';
    import instagramIcon from '$lib/assets/icons/icons8-instagram.svg';
    import githubIcon from '$lib/assets/icons/icons8-github-logo.svg';
    import linkedinIcon from '$lib/assets/icons/icons8-linkedin-24.svg';
    import whatsappIcon from '$lib/assets/icons/icons8-whatsapp-24.svg';

    let hidden = $state(false);

    onMount(() => {
        let lastScrollY = window.scrollY;

        function handleScroll() {
            const currentScrollY = window.scrollY;
            hidden = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<h1>Seb Bastiaans</h1>
<div class="hero">
    <img class="profile-photo" src={profilePhoto} alt="">
    <ul class="intro">
        <li>Student Front-end development & Design</li>
        <li>Utrecht, The Netherlands</li>
        <li>scroll down to see more</li>
    </ul>
</div>

<nav class:nav-hidden={hidden}>
    <a href="#biography">Biography</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
</nav>

<section id="biography">
    <h2>Biography</h2>
    <ul>
        <li>Specializing in <span class="hint" data-tooltip="Try different view width's in your dev tools ;)">responsive</span>, accesible, performing, progressive enhanced websites</li>
        <li>Understanding design, translating it to code</li>
        <li>Scrumming, communicating, collaborating</li>
        <li>Soon to be AI prompt whisperer</li>
    </ul>
</section>

<section id="projects">
    <h2>Projects</h2>
    <ul class="project-grid">
        <li>
            <a href="https://github.com/SebBastiaans/fix-the-flow-interactive-website">
                <img src={fixTheFlow} alt="">
                <span class="desc">Milledoni - Designing and building a interactive website.</span>
            </a>
        </li>
        <li>
            <a href="https://github.com/SebBastiaans/the-startup-responsive-interactive-website">
                <img src={theStartupResponsive} alt="">
                <span class="desc">270 Degrees - Designing and building a responsive website for a startup.</span>
            </a>
        </li>
        <li>
            <a href="https://github.com/SebBastiaans/connect-your-tribe-profile-card">
                <img src={profileCard} alt="">
                <span class="desc">School - Making a profile card with NodeJS and a REST API</span>
            </a>
        </li>
        <li>
            <a href="http://github.com/SebBastiaans/connect-your-tribe-squad-page">
                <img src={teamSquadPage} alt="">
                <span class="desc">School - Making a team overwiew with a team using NodeJS and REST API</span>
            </a>
        </li>
        <li>
            <a href="https://github.com/SebBastiaans/user-experience-enhanced-website">
                <img src={userExpEnh} alt="">
                <span class="desc">Bloemenveld Frankendael - Personal first data driven and UX enhanced website made with Liquid, NodeJS and API's.</span>
            </a>
        </li>
        <li>
            <a href="https://github.com/GijsNagtegaal/pleasurable-ui">
                <img src={pleasurableUi} alt="">
                <span class="desc">Bloemenveld Frankendael - Working in a team with branches and pull requests.</span>
            </a>
        </li>
        <li>
            <a href="https://github.com/SebBastiaans/proof-of-concept">
                <img src={proofOfConcept} alt="">
                <span class="desc">Q42 and Teylers museum - End of first year project, everything coming together: data-driven, UI and UX progressively enhanced.</span>
            </a>
        </li>
    </ul>
</section>

<section id="contact">
    <h2>Contact</h2>
    <ul>
        <li><a href="https://www.instagram.com/sbeee87?stkn=MWVzZ242ZzQ2dmE2bg%3D%3D&utm_source=qr"><img src={instagramIcon} alt="Instagram">Instagram</a></li>
        <li><a href="https://github.com/SebBastiaans"><img src={githubIcon} alt="GitHub">Github</a></li>
        <li><a href="https://www.linkedin.com/in/seb-bastiaans-86b5b7200?utm_source=share_via&utm_content=profile&utm_medium=member_ios"><img src={linkedinIcon} alt="LinkedIn">LinkedIn</a></li>
        <li><a href="https://wa.me/qr/KLK6VJEGKVD5M1"><img src={whatsappIcon} alt="WhatsApp">Whatsapp</a></li>
    </ul>
</section>

<style>
h1{
    width: 100%;
    --stretch: clamp(.5, calc(1.5 - 0.5 * (100vw - 375px) / 825px), 1.5);
    transform: scaleY(var(--stretch));
    transform-origin: top;
    margin-bottom: calc((var(--stretch) - 1) * 1.4em);
    font-size: 14.5vw;
    white-space: nowrap;
}

.hero{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding-inline: 0;

    @media (width>=441px){
        padding-inline: clamp(.5rem, calc(.5rem + (100vw - 375px) * 2.5rem / 1065px), 3rem);
    }

    .profile-photo{
        flex: 1 1 300px;
        width: 100%;
        max-width: 420px;
        aspect-ratio: 1/1;
    }

    .intro{
        flex: 1 1 auto;
    }
}

nav{
    display: flex;
    border-block: solid black 2px;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.414);
    z-index: 10;

    transform: translateY(0);
    transition: transform .3s ease;

    &.nav-hidden{
        transform: translateY(100%);
    }

    a{
        text-decoration: none;
        color: black;
        padding: .5rem;
        scroll-behavior: smooth;

        &::after{
            bottom: .5rem;
        }
    }
}

section{
    margin-top: 1rem;
    padding-inline: clamp(.5rem, calc(.5rem + (100vw - 375px) * 2.5rem / 1065px), 3rem);

    h2 {
        --stretch: clamp(.8, calc(1.5 - 0.5 * (100vw - 375px) / 825px), 1.5);
        transform: scaleY(var(--stretch));
        transform-origin: top;
        display: flex;
        align-items: center;
        gap: .75rem;
        margin-bottom: calc(.8rem + (var(--stretch) - 1) * 1.4em);

        &::after{
            content: '';
            flex: 1 1 auto;
            height: 2px;
            background: blue;
        }
    }
}

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

#projects{
    .project-grid{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(max(15rem, 100%/4), 1fr));
        grid-template-rows: repeat(auto);
        
        li{
            list-style: none;
            position: relative;
            overflow: hidden;

            a{
                position: relative;
                display: block;

                img{
                    display: block;
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                    transition: filter .3s ease;
                }

                .desc{
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    text-align: center;
                    color: white;
                    background-color: rgba(0, 0, 0, 0.5);
                    opacity: 0;
                    transition: opacity .3s ease;
                }

                &:hover{
                    img{
                        filter: blur(4px);
                    }

                    .desc{
                        opacity: 1;
                    }
                }
            }
        }
    }
}

#contact{
    margin-bottom: 2.8rem;

    ul{
        li{
            width: fit-content;
            a{
                display: flex;
            }
        }
    }

    @media (width>768px){
        ul{
            display: flex;
            justify-content: space-evenly;
        }
    }
}


</style>
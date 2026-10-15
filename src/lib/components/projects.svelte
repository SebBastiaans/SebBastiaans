<script>
    import fixTheFlow from '$lib/assets/pics/fix-the-flow.png';
    import theStartupResponsive from '$lib/assets/pics/the-startup-responsive.png';
    import profileCard from '$lib/assets/pics/profile-card.png';
    import teamSquadPage from '$lib/assets/pics/team-squad-page.png';
    import userExpEnh from '$lib/assets/pics/user-exp-enh.png';
    import pleasurableUi from '$lib/assets/pics/pleasurable-ui.png';
    import proofOfConcept from '$lib/assets/pics/proof-of-concept.png';
    import tribeForLifeSquadPage from '$lib/assets/pics/your-tibe-for-life-squadpage.png';
</script>

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
        <li>
            <a href="https://github.com/SebBastiaans/your-tribe-for-life-squad-page">
                <img src={tribeForLifeSquadPage} alt="">
                <span class="desc">School - Remaking a squadpage using SvelteKit</span>
            </a>
        </li>
    </ul>
</section>

<style>
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
</style>

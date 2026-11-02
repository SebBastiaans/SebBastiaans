<script>
    import instagramIcon from '$lib/assets/icons/icons8-instagram.svg';
    import githubIcon from '$lib/assets/icons/icons8-github-logo.svg';
    import linkedinIcon from '$lib/assets/icons/icons8-linkedin-24.svg';
    import whatsappIcon from '$lib/assets/icons/icons8-whatsapp-24.svg';

    const socials = [
        { name: 'Instagram', href: 'https://www.instagram.com/sbeee87?stkn=MWVzZ242ZzQ2dmE2bg%3D%3D&utm_source=qr', icon: instagramIcon },
        { name: 'GitHub', href: 'https://github.com/SebBastiaans', icon: githubIcon },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/seb-bastiaans-86b5b7200?utm_source=share_via&utm_content=profile&utm_medium=member_ios', icon: linkedinIcon },
        { name: 'WhatsApp', href: 'https://wa.me/qr/KLK6VJEGKVD5M1', icon: whatsappIcon }
    ];
</script>

<section id="contact">
    <h2>Contact</h2>
    <ul>
        {#each socials as { name, href, icon }}
            <li>
                <a {href}>
                    <!-- decorative: the name next to it is the link text -->
                    <!-- quotes in url() are needed: Vite inlines small svgs as data urls that contain ' -->
                    <span class="social-icon" style:mask-image={`url("${icon}")`} aria-hidden="true"></span>
                    {name}
                </a>
            </li>
        {/each}
    </ul>
</section>

<style>
#contact{
    ul{
        li{
            width: fit-content;
            a{
                display: flex;
                align-items: center;
                gap: .25rem;
            }
        }
    }

    /* the svg file is only used as a shape, the color is the text color, so it follows dark mode */
    .social-icon{
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
        background-color: currentColor;
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
    }

    @media (width>768px){
        ul{
            display: flex;
            justify-content: space-evenly;
        }
    }
}
</style>

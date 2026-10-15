<script>
    import instagramIcon from '$lib/assets/icons/icons8-instagram.svg';
    import githubIcon from '$lib/assets/icons/icons8-github-logo.svg';
    import linkedinIcon from '$lib/assets/icons/icons8-linkedin-24.svg';
    import whatsappIcon from '$lib/assets/icons/icons8-whatsapp-24.svg';
</script>

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

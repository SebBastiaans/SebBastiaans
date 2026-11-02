import fixTheFlow from '$lib/assets/pics/fix-the-flow.png'
import theStartupResponsive from '$lib/assets/pics/the-startup-responsive.png'
import profileCard from '$lib/assets/pics/profile-card.png'
import teamSquadPage from '$lib/assets/pics/team-squad-page.png'
import userExperienceEnhanced from '$lib/assets/pics/user-exp-enh.png'
import pleasurableUi from '$lib/assets/pics/pleasurable-ui.png'
import proofOfConcept from '$lib/assets/pics/proof-of-concept.png'
import tribeForLifeSquadPage from '$lib/assets/pics/your-tibe-for-life-squadpage.png'

// category is 'school' or 'personal', used by the filter in projects.svelte
const projects = [
	{
		title: 'Milledoni',
		description: 'Designing and building an interactive website.',
		href: 'https://github.com/SebBastiaans/fix-the-flow-interactive-website',
		image: fixTheFlow,
		category: 'school'
	},
	{
		title: '270 Degrees',
		description: 'Designing and building a responsive website for a startup.',
		href: 'https://github.com/SebBastiaans/the-startup-responsive-interactive-website',
		image: theStartupResponsive,
		category: 'school'
	},
	{
		title: 'Profile card',
		description: 'Making a profile card with NodeJS and a REST API.',
		href: 'https://github.com/SebBastiaans/connect-your-tribe-profile-card',
		image: profileCard,
		category: 'school'
	},
	{
		title: 'Squad page',
		description: 'Making a team overview with a team, using NodeJS and a REST API.',
		href: 'https://github.com/SebBastiaans/connect-your-tribe-squad-page',
		image: teamSquadPage,
		category: 'school'
	},
	{
		title: 'Bloemenveld Frankendael',
		description: 'First personal data driven and UX enhanced website, made with Liquid, NodeJS and APIs.',
		href: 'https://github.com/SebBastiaans/user-experience-enhanced-website',
		image: userExperienceEnhanced,
		category: 'school'
	},
	{
		title: 'Bloemenveld Frankendael — Pleasurable UI',
		description: 'Working in a team with branches and pull requests.',
		href: 'https://github.com/GijsNagtegaal/pleasurable-ui',
		image: pleasurableUi,
		category: 'school'
	},
	{
		title: 'Q42 and Teylers Museum',
		description: 'End of first year project with everything coming together: data driven, UI and UX, progressively enhanced.',
		href: 'https://github.com/SebBastiaans/proof-of-concept',
		image: proofOfConcept,
		category: 'school'
	},
	{
		title: 'Your Tribe squad page',
		description: 'Remaking a squad page using SvelteKit.',
		href: 'https://github.com/SebBastiaans/your-tribe-for-life-squad-page',
		image: tribeForLifeSquadPage,
		category: 'school'
	}
]

export const load = () => {
	return { projects }
}

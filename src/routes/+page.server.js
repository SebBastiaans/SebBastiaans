import fixTheFlow from '$lib/assets/pics/fix-the-flow.png'
import theStartupResponsive from '$lib/assets/pics/the-startup-responsive.png'
import profileCard from '$lib/assets/pics/profile-card.png'
import teamSquadPage from '$lib/assets/pics/team-squad-page.png'
import userExperienceEnhanced from '$lib/assets/pics/user-exp-enh.png'
import pleasurableUi from '$lib/assets/pics/pleasurable-ui.png'
import proofOfConcept from '$lib/assets/pics/proof-of-concept.png'
import tribeForLifeSquadPage from '$lib/assets/pics/your-tibe-for-life-squadpage.png'
import tribeForLifeProfileCard from '$lib/assets/pics/profile-card-fl.png'
import tribeForLifeProfileCardVideo from '$lib/assets/videos/profile-card.mp4'
import aiTradeTool from '$lib/assets/pics/ai-trade-tool.png'
import aiTradeToolVideo from '$lib/assets/videos/ai-trade-tool.mp4'
import aiFramer from '$lib/assets/pics/ai-framer.png'
import aiFramerVideo from '$lib/assets/videos/ai-framer.mp4'

// width and height of the image prevent layout shift while it loads
// category is 'school' or 'personal', used by the filter in projects.svelte
const projects = [
	{
		title: 'Milledoni',
		description: 'Designing and building an interactive website.',
		href: 'https://github.com/SebBastiaans/fix-the-flow-interactive-website',
		image: fixTheFlow,
		width: 2880,
		height: 1984,
		category: 'school'
	},
	{
		title: '270 Degrees',
		description: 'Designing and building a responsive website for a startup.',
		href: 'https://github.com/SebBastiaans/the-startup-responsive-interactive-website',
		image: theStartupResponsive,
		width: 2882,
		height: 1986,
		category: 'school'
	},
	{
		title: 'Profile card',
		description: 'Making a profile card with NodeJS and a REST API.',
		href: 'https://github.com/SebBastiaans/connect-your-tribe-profile-card',
		image: profileCard,
		width: 2878,
		height: 1984,
		category: 'school'
	},
	{
		title: 'Squad page',
		description: 'Making a team overview with a team, using NodeJS and a REST API.',
		href: 'https://github.com/SebBastiaans/connect-your-tribe-squad-page',
		image: teamSquadPage,
		width: 2880,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Bloemenveld Frankendael',
		description: 'First personal data driven and UX enhanced website, made with Liquid, NodeJS and APIs.',
		href: 'https://github.com/SebBastiaans/user-experience-enhanced-website',
		image: userExperienceEnhanced,
		width: 3840,
		height: 1986,
		category: 'school'
	},
	{
		title: 'Bloemenveld Frankendael — Pleasurable UI',
		description: 'Working in a team with branches and pull requests.',
		href: 'https://github.com/GijsNagtegaal/pleasurable-ui',
		image: pleasurableUi,
		width: 3838,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Q42 and Teylers Museum',
		description: 'End of first year project with everything coming together: data driven, UI and UX, progressively enhanced.',
		href: 'https://github.com/SebBastiaans/proof-of-concept',
		image: proofOfConcept,
		width: 3840,
		height: 1984,
		category: 'school'
	},
	{
		title: 'Your tribe for life squad page',
		description: 'Remaking a squad page using SvelteKit.',
		href: 'https://github.com/SebBastiaans/your-tribe-for-life-squad-page',
		image: tribeForLifeSquadPage,
		width: 3840,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Your Tribe for life profile card',
		description: 'Remaking my profile card using SvelteKit.',
		href: 'https://github.com/SebBastiaans/your-tribe-for-life-profile-card',
		image: tribeForLifeProfileCard,
		video: tribeForLifeProfileCardVideo,
		width: 3840,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Automated AI trade tool',
		description: 'Seeing if there is an ulimited money glitch. Using API for live prices.',
		href: 'https://github.com/SebBastiaans/ai-trade',
		image: aiTradeTool,
		video: aiTradeToolVideo,
		width: 1920,
		height: 992,
		category: 'personal'
	},
	{
		title: 'AI Framer testing',
		description: 'Experimenting with AI tools for web.',
		href: 'https://github.com/SebBastiaans/AI-garden',
		image: aiFramer,
		video: aiFramerVideo,
		width: 3840,
		height: 1982,
		category: 'personal'
	}
]

export const load = () => {
	return { projects }
}

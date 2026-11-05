import fixTheFlow from '$lib/assets/pics/fix-the-flow.png?enhanced&w=2400;1600;1080;640'
import theStartupResponsive from '$lib/assets/pics/the-startup-responsive.png?enhanced&w=2400;1600;1080;640'
import profileCard from '$lib/assets/pics/profile-card.png?enhanced&w=2400;1600;1080;640'
import teamSquadPage from '$lib/assets/pics/team-squad-page.png?enhanced&w=2400;1600;1080;640'
import userExperienceEnhanced from '$lib/assets/pics/user-exp-enh.png?enhanced&w=2400;1600;1080;640'
import pleasurableUi from '$lib/assets/pics/pleasurable-ui.png?enhanced&w=2400;1600;1080;640'
import proofOfConcept from '$lib/assets/pics/proof-of-concept.png?enhanced&w=2400;1600;1080;640'
import tribeForLifeSquadPage from '$lib/assets/pics/your-tibe-for-life-squadpage.png?enhanced&w=2400;1600;1080;640'
import tribeForLifeProfileCard from '$lib/assets/pics/profile-card-fl.png?enhanced&w=2400;1600;1080;640'
import tribeForLifeProfileCardVideo from '$lib/assets/videos/profile-card.mp4'
import aiTradeTool from '$lib/assets/pics/ai-trade-tool.png?enhanced&w=2400;1600;1080;640'
import aiTradeToolVideo from '$lib/assets/videos/ai-trade-tool.mp4'
import aiFramer from '$lib/assets/pics/ai-framer.png?enhanced&w=2400;1600;1080;640'
import aiFramerVideo from '$lib/assets/videos/ai-framer.mp4'
// the poster of a video can't be a <picture>, so it's one WebP
import tribeForLifeProfileCardPoster from '$lib/assets/pics/profile-card-fl.png?w=1600&format=webp'
import aiTradeToolPoster from '$lib/assets/pics/ai-trade-tool.png?w=1600&format=webp'
import aiFramerPoster from '$lib/assets/pics/ai-framer.png?w=1600&format=webp'

// image: ?enhanced makes AVIF and WebP versions in 4 widths, with a JPG or PNG fallback, shown in a <picture> in Projects.svelte
// width and height of the image prevent layout shift while it loads
// live is optional: the card links to the live site, or to GitHub when there is none. The GitHub link is always shown as well
// category is 'school' or 'personal', used by the filter in Projects.svelte
const projects = [
	{
		title: 'Milledoni',
		description: 'Designing and building an interactive website.',
		live: 'https://sebbastiaans.github.io/fix-the-flow-interactive-website/',
		github: 'https://github.com/SebBastiaans/fix-the-flow-interactive-website',
		image: fixTheFlow,
		width: 2880,
		height: 1984,
		category: 'school'
	},
	{
		title: '270 Degrees',
		description: 'Designing and building a responsive website for a startup.',
		live: 'https://sebbastiaans.github.io/the-startup-responsive-interactive-website/',
		github: 'https://github.com/SebBastiaans/the-startup-responsive-interactive-website',
		image: theStartupResponsive,
		width: 2882,
		height: 1986,
		category: 'school'
	},
	{
		title: 'Profile card',
		description: 'Making a profile card with NodeJS and a REST API.',
		live: 'https://connect-your-tribe-profile-card-yyds.onrender.com/',
		github: 'https://github.com/SebBastiaans/connect-your-tribe-profile-card',
		image: profileCard,
		width: 2878,
		height: 1984,
		category: 'school'
	},
	{
		title: 'Squad page',
		description: 'Making a team overview with a team, using NodeJS and a REST API.',
		live: 'https://connect-your-tribe-squad-page-okq6.onrender.com/',
		github: 'https://github.com/SebBastiaans/connect-your-tribe-squad-page',
		image: teamSquadPage,
		width: 2880,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Bloemenveld Frankendael',
		description: 'First personal data driven and UX enhanced website, made with Liquid, NodeJS and APIs.',
		live: 'https://user-experience-enhanced-website-7wvf.onrender.com/',
		github: 'https://github.com/SebBastiaans/user-experience-enhanced-website',
		image: userExperienceEnhanced,
		width: 3840,
		height: 1986,
		category: 'school'
	},
	{
		title: 'Bloemenveld Frankendael — Pleasurable UI',
		description: 'Working in a team with branches and pull requests.',
		live: 'https://pleasurable-ui-xr0z.onrender.com/',
		github: 'https://github.com/GijsNagtegaal/pleasurable-ui',
		image: pleasurableUi,
		width: 3838,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Q42 and Teylers Museum',
		description: 'End of first year project with everything coming together: data driven, UI and UX, progressively enhanced.',
		live: 'https://proof-of-concept-p8tg.onrender.com/',
		github: 'https://github.com/SebBastiaans/proof-of-concept',
		image: proofOfConcept,
		width: 3840,
		height: 1984,
		category: 'school'
	},
	{
		title: 'Your tribe for life squad page',
		description: 'Remaking a squad page using SvelteKit.',
		live: 'https://semsettin.netlify.app/',
		github: 'https://github.com/SebBastiaans/your-tribe-for-life-squad-page',
		image: tribeForLifeSquadPage,
		width: 3840,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Your Tribe for life profile card',
		description: 'Remaking my profile card using SvelteKit.',
		live: 'https://profilecardofseb.netlify.app/',
		github: 'https://github.com/SebBastiaans/your-tribe-for-life-profile-card',
		image: tribeForLifeProfileCard,
		video: tribeForLifeProfileCardVideo,
		poster: tribeForLifeProfileCardPoster,
		width: 3840,
		height: 1982,
		category: 'school'
	},
	{
		title: 'Automated AI trade tool',
		description: 'Seeing if there is an ulimited money glitch. Using API for live prices.',
		github: 'https://github.com/SebBastiaans/ai-trade',
		image: aiTradeTool,
		video: aiTradeToolVideo,
		poster: aiTradeToolPoster,
		width: 1920,
		height: 992,
		category: 'personal'
	},
	{
		title: 'AI Framer testing',
		description: 'Experimenting with AI tools for web.',
		github: 'https://github.com/SebBastiaans/AI-garden',
		image: aiFramer,
		video: aiFramerVideo,
		poster: aiFramerPoster,
		width: 3840,
		height: 1982,
		category: 'personal'
	}
]

// the song in Biography.svelte: a 30 second preview from Apple, looked up at build time because Apple can change the preview url
// the id is the ?i= in the url of the song on music.apple.com
const favoriteSongId = 1441492959

async function getFavoriteSong(fetch) {
	try {
		const response = await fetch(`https://itunes.apple.com/lookup?id=${favoriteSongId}&country=nl`)
		const [song] = (await response.json()).results

		return { previewUrl: song.previewUrl, appleMusicUrl: song.trackViewUrl }
	} catch {
		// no internet or Apple is down while building: the site just builds without the song
		return null
	}
}

export const load = async ({ fetch }) => {
	return { projects, favoriteSong: await getFavoriteSong(fetch) }
}

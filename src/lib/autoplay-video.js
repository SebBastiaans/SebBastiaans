// Svelte attachment for the project videos, used as <video {@attach (video) => autoplayVideo(video, isPaused)}>
// A video only plays while it is on the screen, so videos outside the screen don't use battery and data.
// Svelte runs this again when isPaused changes, after calling the cleanup of the previous run.

export function autoplayVideo(video, isPaused) {
	if (isPaused) {
		video.pause()
		return
	}

	// play when at least a quarter of the video is visible, pause when it scrolls away
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				// play() fails when the browser blocks autoplay, then the image underneath just stays visible
				video.play().catch(() => {})
			} else {
				video.pause()
			}
		},
		{ threshold: 0.25 }
	)

	observer.observe(video)

	return () => {
		observer.disconnect()
		video.pause()
	}
}

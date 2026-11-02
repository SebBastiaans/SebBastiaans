// Svelte attachment for the project list, used as <ol {@attach (list) => stackCarousel(list, onActiveChange)}>
// The card in the middle of the screen is full size, cards towards the edges shrink,
// and every card is moved so they stay glued to each other without gaps.
// Scrolling stays native: the cards keep their place in the page, this only moves them visually.
// onActiveChange gets the card in the middle, or null when the carousel is off:
// { index, total } count only the visible cards (for the counter),
// projectIndex is the position in the whole list (to find its project data, also when filtered)

const centerScale = 1
const edgeScale = 0.72

export function stackCarousel(list, onActiveChange = () => {}) {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
	// fires when the list changes size, for example when the filter hides cards
	const resizeObserver = new ResizeObserver(requestUpdate)
	let frame = 0
	let lastActive = ''

	reducedMotion.addEventListener('change', toggle)
	toggle()

	// cleanup when the list is removed from the page
	return () => {
		reducedMotion.removeEventListener('change', toggle)
		stop()
	}

	function toggle() {
		if (reducedMotion.matches) {
			stop()
		} else {
			start()
		}
	}

	function start() {
		// tells the CSS to turn off its own scroll-driven scale, JS takes over
		list.dataset.enhanced = ''
		window.addEventListener('scroll', requestUpdate, { passive: true })
		window.addEventListener('resize', requestUpdate)
		resizeObserver.observe(list)
		requestUpdate()
	}

	function stop() {
		delete list.dataset.enhanced
		window.removeEventListener('scroll', requestUpdate)
		window.removeEventListener('resize', requestUpdate)
		resizeObserver.disconnect()
		cancelAnimationFrame(frame)
		frame = 0

		for (const card of list.children) {
			card.style.transform = ''
		}

		reportActive(null)
	}

	// only tell the component when the active card or the number of cards changes, not every frame
	function reportActive(active) {
		const key = active ? `${active.index}/${active.total}/${active.projectIndex}` : ''

		if (key === lastActive) return

		lastActive = key
		onActiveChange(active)
	}

	// at most one update per frame, however often the browser fires scroll events
	function requestUpdate() {
		if (!frame) {
			frame = requestAnimationFrame(update)
		}
	}

	function update() {
		frame = 0

		// cards hidden by the filter have no offsetParent
		const boxes = [...list.children]
			.filter((card) => card.offsetParent !== null)
			.map((card) => ({ card, top: card.offsetTop, height: card.offsetHeight }))

		if (boxes.length === 0) {
			reportActive(null)
			return
		}

		const viewportHeight = window.innerHeight
		// the middle of the screen, measured from the top of the list
		const center = viewportHeight / 2 - list.getBoundingClientRect().top
		const first = boxes[0]
		const last = boxes.at(-1)
		let anchorIndex
		let anchorTop
		let anchorScale

		// 1. find the anchor: the card under the middle of the screen, and where it goes
		if (center < first.top) {
			// above the list: the first card stays at its own top
			anchorIndex = 0
			anchorScale = scaleBelow(first, first.top)
			anchorTop = first.top
		} else if (center >= last.top + last.height) {
			// below the list: the last card stays at its own bottom, so it meets the next section
			anchorIndex = boxes.length - 1
			anchorScale = scaleAbove(last, last.top + last.height)
			anchorTop = last.top + last.height - last.height * anchorScale
		} else {
			anchorIndex = boxes.findIndex(({ top, height }) => center < top + height)
			const { top, height } = boxes[anchorIndex]
			// how far the middle of the screen is through this card, 0 = top, 1 = bottom
			const progress = (center - top) / height

			// the same point of the card stays under the middle of the screen, also when scaled
			anchorScale = solveScale((scale) => height * scale * (0.5 - progress))
			anchorTop = center - progress * height * anchorScale
		}

		place(boxes[anchorIndex], anchorTop, anchorScale)
		reportActive({
			index: anchorIndex,
			total: boxes.length,
			projectIndex: [...list.children].indexOf(boxes[anchorIndex].card)
		})

		// 2. stack the cards below the anchor, each one starts where the previous one ends
		let edge = anchorTop + boxes[anchorIndex].height * anchorScale

		for (const box of boxes.slice(anchorIndex + 1)) {
			const scale = scaleBelow(box, edge)
			place(box, edge, scale)
			edge += box.height * scale
		}

		// 3. stack the cards above the anchor, each one ends where the next one starts
		edge = anchorTop

		for (const box of boxes.slice(0, anchorIndex).reverse()) {
			const scale = scaleAbove(box, edge)
			edge -= box.height * scale
			place(box, edge, scale)
		}

		// scale of a card whose top is at `top`
		function scaleBelow({ height }, top) {
			return solveScale((scale) => top + (height * scale) / 2 - center)
		}

		// scale of a card whose bottom is at `bottom`
		function scaleAbove({ height }, bottom) {
			return solveScale((scale) => bottom - (height * scale) / 2 - center)
		}

		// the scale depends on where the card ends up, and where it ends up depends on the scale,
		// so guess and correct a few times, that is close enough
		function solveScale(distanceToCenter) {
			let scale = centerScale

			for (let step = 0; step < 5; step++) {
				const distance = Math.min(1, Math.abs(distanceToCenter(scale)) / (viewportHeight / 2))
				scale = centerScale - (centerScale - edgeScale) * smoothstep(distance)
			}

			return scale
		}
	}
}

// move the card from where it is in the page to `top`, and scale it from the right top corner
function place({ card, top }, newTop, scale) {
	card.style.transform = `translate3d(0, ${newTop - top}px, 0) scale(${scale})`
}

// slow at the start and the end, fast in the middle
function smoothstep(value) {
	return value * value * (3 - 2 * value)
}

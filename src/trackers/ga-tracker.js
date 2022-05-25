import ReactGA from "react-ga4"

ReactGA.initialize([
	{trackingId: "G-FN5P6VVSBZ"}
])

export const GaClickTracker = action => {
	ReactGA.event({
		category: "micro",
		action: "click",
		label: action,
		nonInteraction: false
	})
}

export const GaPageTracker = action => {
	ReactGA.event({
		category: "macro",
		action: "page_view",
		label: action,
		nonInteraction: false
	})
}

export const GaSectionTracker = action => {
	ReactGA.event({
		category: "micro",
		action: "section_view",
		label: action,
		nonInteraction: false
	})
}

export const GaExternalTracker = action => {
	ReactGA.event({
		category: "macro",
		action: "external_page",
		label: action,
		nonInteraction: false
	})
}

export const GaSocialTracker = action => {
	ReactGA.event({
		category: "macro",
		action: "social_media",
		label: action,
		nonInteraction: false
	})
}
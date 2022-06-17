import { useState } from "react"

import { isUsable } from "../../../helpers/functions"

import {ReactComponent as FontSizeIncreaseIcon } from "../../../assets/icons/fontsize-increase.svg"
import {ReactComponent as FontSizeDecreaseIcon } from "../../../assets/icons/fontsize-decrease.svg"
import GaTracker from "../../../trackers/ga-tracker"

const minFontSize = 50
const maxFontSize = 200
const fontDeltaStep = 10

const Customizer = ({rendition}) => {
	const [fontSize, setFontSize] = useState(100)

	const rerender = () => {
		let location = rendition.currentLocation()
		rendition.clear()
		rendition.display(location.start.cfi)
	}

	const updateFontSize = (newFontSize) => {
		GaTracker('event_customizer_fontsize_'+newFontSize)
		if(!isUsable(rendition)) return
		rendition.themes.fontSize(`${newFontSize}%`)
		setFontSize(newFontSize)
		rerender()
	}

	const setTheme = (theme="light") => {
		GaTracker('event_customizer_theme_'+theme)
		rendition.themes.select(theme)
		window.document.body.setAttribute("data-theme",theme)
		rerender()
	}

	const setFont = (fontFamily) => {
		GaTracker('event_customizer_font_'+fontFamily)
		rendition.themes.override("font-family", fontFamily)
		rerender()
	}

	return (
		<div className="customizer">
			<div className="customizer__fontsize">
				<div className="customizer__fontsize__decrease-btn" onClick={()=>updateFontSize(Math.max(minFontSize,fontSize-fontDeltaStep))}>
					<FontSizeDecreaseIcon width={24} stroke="currentColor"/>
				</div>
				<div className="customizer__fontsize__value">{fontSize}%</div>
				<div className="customizer__fontsize__increase-btn" onClick={()=>updateFontSize(Math.min(maxFontSize,fontSize+fontDeltaStep))}>
					<FontSizeIncreaseIcon width={24} stroke="currentColor"/>
				</div>
			</div>
			<div className="customizer__theme">
				<div className="customizer__theme__chip customizer__theme__chip--light" onClick={()=>setTheme("light")}>Light</div>
				<div className="customizer__theme__chip customizer__theme__chip--dark" onClick={()=>setTheme("dark")}>Dark</div>
			</div>
			<div className="customizer__fontfamily">
				<div className="customizer__fontfamily__font customizer__fontfamily__font--arial" onClick={()=>{setFont("Arial, sans-serif")}}>Arial</div>
				<div className="customizer__fontfamily__font customizer__fontfamily__font--times" onClick={()=>{setFont("'Times New Roman', serif")}}>Times New Roman</div>
				<div className="customizer__fontfamily__font customizer__fontfamily__font--cursive" onClick={()=>{setFont("'Brush Script MT', cursive")}}>Brush Script MT</div>
			</div>
		</div>
	)
}

export default Customizer

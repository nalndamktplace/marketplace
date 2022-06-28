import { useEffect, useState } from "react"

import { isUsable } from "../../../helpers/functions"

import {ReactComponent as FontSizeIncreaseIcon } from "../../../assets/icons/fontsize-increase.svg"
import {ReactComponent as FontSizeDecreaseIcon } from "../../../assets/icons/fontsize-decrease.svg"
import GaTracker from "../../../trackers/ga-tracker"
import { ReaderDefault, ReaderPreferenceOptions} from "../../../config/readerTheme"

const Customizer = ({rendition}) => {
	const [readerPreferences, setReaderPreferences] = useState({
		...ReaderDefault,
		fontFamily : ReaderDefault.fontFamily.id ,
		theme : ReaderDefault.theme.id,
	});

	const rerender = () => {
		try {
			let location = rendition.currentLocation()
			rendition.clear()
			rendition.display(location.start.cfi)
		} catch(err){
			// console.error(err)
		}
	}

	useEffect(() => {
		if(!isUsable(rendition)) return ;
		console.log(readerPreferences)
		let selectedTheme = ReaderPreferenceOptions.themes.find(s=> s.id === readerPreferences.theme);
		let selectedFontFamily = ReaderPreferenceOptions.fontFamily.find(s => s.id === readerPreferences.fontFamily);
		if(!isUsable(selectedTheme)) selectedTheme = ReaderPreferenceOptions.themes[0] ;
		if(!isUsable(selectedFontFamily)) selectedFontFamily = ReaderPreferenceOptions.fontFamily[0] ;
		rendition.themes.override("--font-size", readerPreferences.fontSize+"%")
		rendition.themes.override("--font-family", selectedFontFamily.value)
		rendition.themes.override("--line-height", readerPreferences.lineHeight)
		rendition.themes.override("--background-color", selectedTheme.backgroundColor)
		rendition.themes.override("--color", selectedTheme.color)
		window.document.body.setAttribute("data-theme",selectedTheme.id)
		rerender();
	}, [readerPreferences,rendition])

	const updateFontSize = (fontSize) => {
		GaTracker('event_customizer_fontsize_'+fontSize)
		setReaderPreferences(rp => ({...rp,fontSize})) ;
	};

	const increaseFontSize = () => {
		updateFontSize(Math.min(ReaderPreferenceOptions.fontSize.max,readerPreferences.fontSize+ReaderPreferenceOptions.fontSize.step))
	}
	
	const decreaseFontSize = () => {
		updateFontSize(Math.max(ReaderPreferenceOptions.fontSize.min,readerPreferences.fontSize-ReaderPreferenceOptions.fontSize.step))
	};

	const setTheme = (theme="reader-theme-light") => {
		GaTracker('event_customizer_theme_'+theme)
		setReaderPreferences(rp => ({...rp,theme})) ;
	}

	const setFont = (fontFamily) => {
		GaTracker('event_customizer_font_'+fontFamily)
		setReaderPreferences(rp => ({...rp,fontFamily})) ;
	}

	return (
		<div className="customizer">
			<div className="customizer__fontsize">
				<div className="customizer__fontsize__decrease-btn" onClick={decreaseFontSize}>
					<FontSizeDecreaseIcon width={24} stroke="currentColor"/>
				</div>
				<div className="customizer__fontsize__value">{readerPreferences.fontSize - ReaderPreferenceOptions.fontSize.offset}%</div>
				<div className="customizer__fontsize__increase-btn" onClick={increaseFontSize}>
					<FontSizeIncreaseIcon width={24} stroke="currentColor"/>
				</div>
			</div>
			<div className="customizer__theme">
				<div className="customizer__theme__chip customizer__theme__chip--light" onClick={()=>setTheme("reader-theme-light")}>Light</div>
				<div className="customizer__theme__chip customizer__theme__chip--dark" onClick={()=>setTheme("reader-theme-dark")}>Dark</div>
			</div>
			<div className="customizer__fontfamily">
				{
					ReaderPreferenceOptions.fontFamily.map(ff => (
						<div key={ff.id} className={"customizer__fontfamily__font" + (readerPreferences.fontFamily === ff.id ? " customizer__fontfamily__font--selected" : "") } style={{fontFamily:ff.value}} onClick={()=>{setFont(ff.id)}}>{ff.name}</div>
					))
				}
				
			</div>
		</div>
	)
}

export default Customizer

import { useEffect, useState } from "react"
import { isUsable } from "../../../helpers/functions"
import GaTracker from "../../../trackers/ga-tracker"
import { ReaderDefault, ReaderPreferenceOptions} from "../../../config/readerTheme"
import NumberInput from "../Input/NumberInput"
import { useCallback } from "react"

const Customizer = ({rendition}) => {
	const [readerPreferences, setReaderPreferences] = useState({
		...ReaderDefault,
		fontFamily : ReaderDefault.fontFamily.id ,
		theme : ReaderDefault.theme.id,
	});

	const rerender = useCallback(() => {
		try {
			let location = rendition.currentLocation()
			rendition.clear()
			rendition.display(location.start.cfi)
		} catch(err){/*console.error(err)*/}
	},[rendition]);

	const savePreferences = (readerPreferences) => {
		if(!window.localStorage) return;
		window.localStorage.setItem("READER_PREFERENCES",JSON.stringify(readerPreferences));
	}

	const loadSavedPreferences = () => {
		if(!window.localStorage) return {} ;
		try{
			let savedItem = JSON.parse(window.localStorage.getItem("READER_PREFERENCES"));
			return savedItem || {} ;
		} catch(err) { return {} }
	}

	useEffect(()=>{
		let {
			fontSize   = ReaderDefault.fontSize ,
			lineHeight = ReaderDefault.lineHeight ,
			fontFamily = ReaderDefault.fontFamily.id,
			theme      = ReaderDefault.theme.id,
		} = loadSavedPreferences();
		setReaderPreferences({fontSize,lineHeight,fontFamily,theme})
	},[])

	useEffect(() => {
		if(!isUsable(rendition)) return ;
		let selectedTheme = ReaderPreferenceOptions.themes.find(s=> s.id === readerPreferences.theme);
		let selectedFontFamily = ReaderPreferenceOptions.fontFamily.find(s => s.id === readerPreferences.fontFamily);
		if(!isUsable(selectedTheme)) selectedTheme = ReaderPreferenceOptions.themes[0] ;
		if(!isUsable(selectedFontFamily)) selectedFontFamily = ReaderPreferenceOptions.fontFamily[0] ;
		rendition.themes.override("--font-size", readerPreferences.fontSize+"%")
		rendition.themes.override("--font-family", selectedFontFamily.value)
		rendition.themes.override("--line-height", readerPreferences.lineHeight)
		rendition.themes.override("--background-color", selectedTheme.backgroundColor)
		rendition.themes.override("--color", selectedTheme.color)
		window.document.body.setAttribute("data-theme",selectedTheme.bodyTheme)
		rerender();
		savePreferences(readerPreferences);
	}, [readerPreferences,rendition,rerender])

	const updateFontSize = (fontSize) => {
		GaTracker('event_customizer_fontsize_'+fontSize)
		setReaderPreferences(rp => ({...rp,fontSize})) ;
	};

	const updateLineHeight = (lineHeight) => {
		GaTracker('event_customizer_lineheight_'+lineHeight)
		setReaderPreferences(rp => ({...rp,lineHeight})) ;
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
		<div className="panel panel__customizer">
			<div className="panel__customizer__field">
				<div className="panel__customizer__field__lable typo__head--6">Font Size</div>
				<div className="panel__customizer__field__input">
					<NumberInput 
						value={readerPreferences.fontSize} 
						setValue={updateFontSize} 
						unit="%"
						offset={ReaderPreferenceOptions.fontSize.offset}
						min={ReaderPreferenceOptions.fontSize.min} 
						max={ReaderPreferenceOptions.fontSize.max}
						step={ReaderPreferenceOptions.fontSize.step}
					/>
				</div>
			</div>
			<div className="panel__customizer__field">
				<div className="panel__customizer__field__lable typo__head--6">Line Spacing</div>
				<div className="panel__customizer__field__input">
					<NumberInput 
						value={readerPreferences.lineHeight} 
						setValue={updateLineHeight} 
						min={ReaderPreferenceOptions.lineHeight.min} 
						max={ReaderPreferenceOptions.lineHeight.max}
						step={ReaderPreferenceOptions.lineHeight.step}
					/>
				</div>
			</div>
			<div className="panel__customizer__field">
				<div className="panel__customizer__field__lable typo__head--6">Themes</div>
				<div className="panel__customizer__field__input panel__customizer__field__input--themes">
					{ReaderPreferenceOptions.themes.map(theme => (
						<div key={theme.id} className={"panel__customizer__field__input__chip" + (readerPreferences.theme === theme.id ? " panel__customizer__field__input__chip--selected" : "")} onClick={()=>setTheme(theme.id)} style={{color:theme.color,backgroundColor:theme.backgroundColor}}>Aa</div>
					))}
				</div>
			</div>
			<div className="panel__customizer__field">
				<div className="panel__customizer__field__lable typo__head--6">Fonts</div>
				<div className="panel__customizer__field__input panel__customizer__field__input--fonts">
				{ReaderPreferenceOptions.fontFamily.map(ff => (
					<div key={ff.id} className={"panel__customizer__field__input__font" + (readerPreferences.fontFamily === ff.id ? " panel__customizer__field__input__font--selected" : "") } style={{fontFamily:ff.value}} onClick={()=>{setFont(ff.id)}}>
						<div className="panel__customizer__field__input__font__demo">Aa</div>
						<div className="panel__customizer__field__input__font__name">{ff.name}</div>
					</div>
				))}
				</div>
			</div>
		</div>
	)
}

export default Customizer

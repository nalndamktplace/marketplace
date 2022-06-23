import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import React, { useCallback, useEffect, useRef, useState } from "react"

import Epub, { EpubCFI } from "epubjs"

import useDebounce from "../hook/useDebounce"

import Button from "../components/ui/Buttons/Button"
import ReadTimer from "../components/ui/ReadTime/ReadTime"
import SidePanel from "../components/hoc/SidePanel/SidePanel"
import Customizer from "../components/ui/Customizer/Customizer"
import AnnotationPanel from "../components/ui/Annotation/AnnotationPanel"
import AnnotationContextMenu from "../components/ui/Annotation/AnnotationContextMenu"

import { isFilled, isUsable } from "../helpers/functions"
import { setSnackbar } from "../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../store/actions/spinner"

import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg"
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg"
import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark.svg"
import { ReactComponent as LetterCaseIcon } from "../assets/icons/letter-case.svg"
import { ReactComponent as BlockquoteIcon } from "../assets/icons/blockquote.svg"
import { ReactComponent as MaximizeIcon } from "../assets/icons/maximize.svg"
import { ReactComponent as MinimizeIcon } from "../assets/icons/minimize.svg"
import { ReactComponent as ListIcon } from "../assets/icons/list.svg"

import { BASE_URL } from '../config/env'
import GaTracker from "../trackers/ga-tracker"
import TocPanel from "../components/ui/TocPanel/TocPanel"
import RangeSlider from "../components/ui/RangeSlider/RangeSlider"
import { setWallet } from "../store/actions/wallet"
import Wallet from "../connections/wallet"
import axios from "axios"

const ReaderPage = () => {

	const params = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const WalletState = useSelector(state => state.WalletState.wallet)

	const [Preview, setPreview] = useState(null)
	const [Loading, setLoading] = useState(false)
	const [bookMeta, setBookMeta] = useState({})
	const [progress, setProgress] = useState(0)
	const [rendition, setRendition] = useState()
	const [fullscreen, setFullscreen] = useState(false)
	const [annotaionPanel, setAnnotaionPanel] = useState(false)
	const [pageBookmarked, setPageBookmarked] = useState(false)
	const [totalLocations, setTotalLocations] = useState(0)
	const [customizerPanel, setCustomizerPanel] = useState(false)
	const [tocPanel, setTocPanel] = useState(false);
	const [WalletAddress, setWalletAddress] = useState(null);

	const debouncedProgress = useDebounce(progress, 300)
	const seeking = useRef(false);

	const connectWallet = useCallback(
		() => {
			Wallet.connectWallet().then(res => {
				dispatch(setWallet(res.selectedAddress))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
			}).finally(() => setLoading(false))
		},[dispatch],
	)

	useEffect(() => {
		setLoading(true)
		if(isUsable(WalletState))
			setWalletAddress(WalletState)
		else connectWallet()
		setLoading(false)
	}, [WalletState, connectWallet])

	useEffect(() => { GaTracker('page_view_reader') }, [])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(!isUsable(Math.floor(progress*100/totalLocations)) || isNaN(Math.floor(progress*100/totalLocations))) setLoading(true)
		else setLoading(false)
	}, [progress, totalLocations])

	const hideAllPanel = ({customizer=true,annotation=true,toc=true}) => {
		customizer && setCustomizerPanel(false)
		annotation && setAnnotaionPanel(false)
		toc && setTocPanel(false)
	}

	useEffect(()=>{
		if(!isUsable(rendition)) return
		const handleResize = () => {
			GaTracker('event_reader_resize')
			rendition.manager.resize(window.innerWidth<600 ? window.innerWidth : window.innerWidth-128,"100%")
		}
		const handleFullscreen = () => {
			if(isUsable(window.document.fullscreenElement)){
				GaTracker('event_reader_fullscreen')
				setFullscreen(true)
			}
			else{
				GaTracker('event_reader_window')
				setFullscreen(false)
			}
			handleResize()
		}
		window.addEventListener("resize",handleResize)
		window.addEventListener("fullscreenchange",handleFullscreen)
		return () => {
			window.removeEventListener("resize",handleResize)
			window.removeEventListener("fullscreenchange",handleFullscreen)
		}
	},[rendition])

	useEffect(()=>{
		let bookURL = null
		const navParams = params.state
		if(isUsable(navParams.preview) && navParams.preview === true){
			bookURL = BASE_URL+'/files/'+navParams.book.preview
			setBookMeta(navParams.book)
			setPreview(true)
		}
		else{
			bookURL = navParams.book.submarineURL
			setBookMeta(navParams.book)
			setPreview(false)
		}
		const book = Epub(bookURL,{openAs:"epub"})
		book.ready.then(()=>{
			document.querySelector("#book__reader").innerHTML = ""
			const rendition = book.renderTo("book__reader", { 
				width: window.innerWidth<600 ? window.innerWidth : window.innerWidth-128,
				height: "100%" ,
				manager: "continuous",
				flow: "paginated",
				snap : "true"
			})
			rendition.themes.registerThemes({
				dark : {
					body : {
						"background-color" : "black",
						"color" : "white",
						"--font-family" : "inherit",
						"--line-height" : "1.6"
					},
					p : {
						"text-align": "justify" ,
						"font-family" : "var(--font-family) !important",
						"line-height" : "var(--line-height) !important"
					}
				},
				light : {
					body : {
						"background-color" : "white",
						"color" : "black",
						"--font-family" : "inherit",
						"--line-height" : "1.6"
					},
					p : {
						"text-align": "justify" ,
						"font-family" : "var(--font-family) !important",
						"line-height" : "var(--line-height) !important"
					}
				}
			})
			rendition.themes.select("light")
			rendition.display()
			rendition.themes.fontSize("150%");
			rendition.themes.font("Arial,sans-serif");
			setRendition(rendition)
		}).catch(err => {
			console.error({err})
			dispatch(setSnackbar({show: true, message: "Error while loading book.", type: 4}))
		})
	},[params, dispatch])

	const saveLastReadPage = useCallback(
		(cfi) => {
			if(!isUsable(window.localStorage)) return
			if(!isUsable(bookMeta)) return
			const bookKey = `${bookMeta.id}:lastread`
			localStorage.setItem(bookKey,cfi)
		},
		[bookMeta],
	)

	useEffect(()=>{
		if (!isUsable(rendition)) return
		if (!isUsable(bookMeta)) return
		rendition.on("relocated", (event)=>{
			setProgress(event.start.location)
			saveLastReadPage(event.start.cfi)
		})
	},[bookMeta,rendition, saveLastReadPage])

	useEffect(()=>{
		if (!isUsable(rendition)) return
		if (!isUsable(bookMeta)) return
		const bookKey = `${bookMeta.id}:locations`
		let stored = localStorage.getItem(bookKey)
		if (stored) {
			rendition.book.locations.load(stored)
			setTotalLocations(JSON.parse(stored).length)
		} else {
			rendition.book.locations.generate().then(()=>{
				setTotalLocations(rendition.book.locations.total)
				localStorage.setItem(bookKey, rendition.book.locations.save())
			}).catch((err)=>{
				console.error(err)
			})
		}
	},[rendition,bookMeta])

	useEffect(() => {
		if(!isUsable(rendition)) return
		if(seeking.current==true){
			rendition.display(rendition.book.locations.cfiFromLocation(debouncedProgress))
			seeking.current=false
		}	
	}, [debouncedProgress, rendition])

	const handlePageUpdate = (e) => {
		seeking.current = true ;
		setProgress(e.target.value)
	}

	// todo move loading to server
	useEffect(() => {
		if(!isUsable(window.localStorage)) return
		if(!isUsable(bookMeta)) return
		if(!isUsable(rendition)) return
		const bookKey = `${bookMeta.id}:lastread`
		let lastPageCfi = localStorage.getItem(bookKey)
		if(isUsable(lastPageCfi)) {
			rendition.display(lastPageCfi)
		}
	}, [bookMeta, rendition]) 
	
	function openFullscreen() {
		var elem = document.documentElement
		if (elem.requestFullscreen) {
			elem.requestFullscreen()
		} else if (elem.webkitRequestFullscreen) { /* Safari */
			elem.webkitRequestFullscreen()
		} else if (elem.msRequestFullscreen) { /* IE11 */
			elem.msRequestFullscreen()
		}
	}

	function closeFullscreen() {
		if(!document.fullscreenElement) return
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) { /* Safari */
			document.webkitExitFullscreen()
		} else if (document.msExitFullscreen) { /* IE11 */
			document.msExitFullscreen()
		}
	}

	useEffect(()=>{
		if(fullscreen===true) openFullscreen()
		else closeFullscreen()
	},[fullscreen])

	const isCurrentPageBookmarked = useCallback(
		() => {
			if(!isUsable(rendition)) return
			if(!isUsable(bookMeta)) return
			const bookKey = `${bookMeta.id}:bookmarks`
			let item = window.localStorage.getItem(bookKey) ;
			if(!isFilled(item)) return false ;
			let stored = JSON.parse(item) || {}
			let epubcfi = new EpubCFI()
			let current = rendition.currentLocation()
			try{
				if(epubcfi.compare(stored.cfi,current.start.cfi)===0) return true
				if(epubcfi.compare(stored.cfi,current.end.cfi)===0) return true
				if(epubcfi.compare(stored.cfi,current.start.cfi)===1 && epubcfi.compare(stored.cfi,current.end.cfi)===-1) return true
				return false	 
			} catch(err){
				console.error(err)
				return false
			}
		},[bookMeta, rendition]
	)

	const updateBookmarkedStatus = useCallback(
		() => {
			const pageBookmarked = isCurrentPageBookmarked()
			setPageBookmarked(pageBookmarked)
		},[isCurrentPageBookmarked]
	)

	const [annotationSelection, setAnnotationSelection] = useState({})
	const [showContextMenu, setShowContextMenu] = useState(false)
	// const [contextMenuPosition, setContextMenuPosition] = useState({x:0,y:0})
	// const contextMenuContainerRef = useRef()

	// useEffect(()=>{
	//	 if(!isUsable(contextMenuContainerRef.current)) return
	//	 contextMenuContainerRef.current.style.setProperty("--x",contextMenuPosition.x)
	//	 contextMenuContainerRef.current.style.setProperty("--y",contextMenuPosition.y)
	// },[contextMenuContainerRef,contextMenuPosition])

	useEffect(()=>{
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		const handleRelocated = ()=>{updateBookmarkedStatus()}
		rendition.on("relocated",handleRelocated)
		return ()=>{rendition.off("relocated",handleRelocated)}
	},[rendition,bookMeta, updateBookmarkedStatus])

	useEffect(()=>{
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		const handleSelected = (cfiRange,contents)=>{
			// console.log(cfiRange,contents)
			// const selection = contents.window.getSelection()
			// const anchorNodeCoords = selection.anchorNode.parentElement.getBoundingClientRect()
			// const extentNodeCoords = selection.extentNode.parentElement.getBoundingClientRect()

			// let coords = {
			//	 y : (Math.min(anchorNodeCoords.y,extentNodeCoords.y) + Math.max(anchorNodeCoords.y+anchorNodeCoords.height,extentNodeCoords.y+extentNodeCoords.height))/2,
			//	 x : (Math.min(anchorNodeCoords.x,extentNodeCoords.x) + Math.max(anchorNodeCoords.x+anchorNodeCoords.width,extentNodeCoords.x+extentNodeCoords.width))/2,
			// }

			// coords = {
			//	 x : window.innerWidth / 2,
			//	 y : window.innerHeight / 2,
			// }

			// if(isNaN(coords.x) || isNaN(coords.y)){
			//	 coords = {
			//		 x : window.innerWidth / 2,
			//		 y : window.innerHeight / 2,
			//	 }
			// }

			rendition.book.getRange(cfiRange).then((range)=>{
				setAnnotationSelection({
					cfiRange,
					text : range?.toString()
				})
				// setContextMenuPosition(coords)
				setShowContextMenu(true)
			}).catch(()=>{
				setAnnotationSelection({})
			})
		}
		rendition.on("selected",handleSelected)
		return ()=>{rendition.off("selected",handleSelected)}
	},[rendition,bookMeta])

	useEffect(()=>{
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		const handleMarkClicked = (cfiRange,data,contents)=>{
			setAnnotaionPanel(true)
		}
		rendition.on("markClicked",handleMarkClicked)
		return ()=>{rendition.off("markClicked",handleMarkClicked)}
	},[rendition,bookMeta])

	useEffect(()=>{
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		updateAnnotation()
	},[rendition,bookMeta])

	const addAnnotationRef = useRef()

	const handleAnnotationColorSelect = (color) => {
		if(!isUsable(annotationSelection)) return
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		if(isUsable(addAnnotationRef.current) && typeof addAnnotationRef.current === "function")
			addAnnotationRef.current({...annotationSelection,color})
	}

	const updateAnnotation = () => {
		// if(!isUsable(rendition)) return ""
		// if(!isUsable(bookMeta)) return ""
		// const bookKey = `${bookMeta.id}:annotations`
		// let stored = JSON.parse(window.localStorage.getItem(bookKey)) || []
		// console.log(stored)
		// stored.forEach((item)=>{
		//	 rendition.annotations.add(
		//		 "highlight",
		//		 item.cfiRange,
		//		 {},
		//		 ()=>{},
		//		 "",
		//		 {"fill": item.color, "fill-opacity": "0.35", "mix-blend-mode": "multiply"}
		//	 )
		// })
	}

	const addBookMark = () => {
		GaTracker('event_bookmarkpanel_bookmark')
		if(isUsable(Preview) && !Preview && isUsable(bookMeta) && isUsable(WalletAddress)){
			if(!isUsable(rendition)) return
			if(!isUsable(bookMeta)) return
			setLoading(true)
			let newBookmarks = {
				cfi : rendition.currentLocation().start.cfi,
				percent : rendition.currentLocation().start.percentage
			};
			console.log(newBookmarks)
			axios({
				url: BASE_URL+'/api/reader/bookmarks',
				method: 'POST',
				data: {
					bid: bookMeta.id,
					uid: WalletAddress,
					bookmarks: JSON.stringify(newBookmarks),
				}
			}).then(res => {
				if(res.status === 200) {
					const bookKey = `${bookMeta.id}:bookmarks`
					localStorage.setItem(bookKey,JSON.stringify(newBookmarks))
					updateBookmarkedStatus()
				} 
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}

	const removeBookMark = () => {
		GaTracker('event_bookmarkpanel_bookmark_remove')
		if(isUsable(Preview) && !Preview && isUsable(bookMeta) && isUsable(WalletAddress)){
			if(!isUsable(rendition)) return
			if(!isUsable(bookMeta)) return
			setLoading(true)
			let newBookmarks = "" ;
			axios({
				url: BASE_URL+'/api/reader/bookmarks',
				method: 'POST',
				data: {
					bid: bookMeta.id,
					uid: WalletAddress,
					bookmarks: "",
				}
			}).then(res => {
				if(res.status === 200) {
					const bookKey = `${bookMeta.id}:bookmarks`
					localStorage.setItem(bookKey,"")
					updateBookmarkedStatus()
				} 
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}

	const toggleBookMark = () => {
		if(isCurrentPageBookmarked()===true) removeBookMark();
		else addBookMark();
	}

	return (
		<div className="reader">
			<div className="reader__header">
				<div className="reader__header__left">
					<Button type="icon" onClick={()=>{navigate(-1)}}><ChevronLeftIcon/></Button>
					<ReadTimer preview={Preview} bookMeta={bookMeta}/>
				</div>
				<div className="reader__header__center">
					<div className="reader__header__center__title">{bookMeta.title||"Untitled"}</div>
				</div> 
				<div className="reader__header__right">
					<Button type="icon" onClick={()=>setFullscreen(s=>!s)}>
						{fullscreen?<MinimizeIcon/>:<MaximizeIcon/>}
					</Button>
					<Button type="icon" className={tocPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({toc:false});setTocPanel(s=>!s)}} >
						<ListIcon/>
					</Button>
					<SidePanel show={tocPanel} position="right"><TocPanel onSelect={()=>{hideAllPanel({toc: false});setTocPanel(false)}} rendition={rendition}/></SidePanel>
					<Button type="icon" className={annotaionPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({annotation:false});setAnnotaionPanel(s=>!s)}} >
						<BlockquoteIcon/>
					</Button>
					<SidePanel show={annotaionPanel} position="right">
						<AnnotationPanel preview={Preview} rendition={rendition} bookMeta={bookMeta} show={annotaionPanel} addAnnotationRef={addAnnotationRef} hideModal={()=>{setAnnotaionPanel(false)}} onRemove={()=>{setAnnotaionPanel(false)}} />
					</SidePanel>
					<Button type="icon" className={pageBookmarked?"reader__header__right__button--active":""} onClick={toggleBookMark} ><BookmarkIcon /></Button>
					<Button type="icon" className={customizerPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({customizer:false});setCustomizerPanel(s=>!s)}}><LetterCaseIcon /></Button>
					<SidePanel show={customizerPanel} position="right">
						<Customizer rendition={rendition}/>
					</SidePanel>
				</div>
			</div>
			<div className="reader__container">
				<div className={pageBookmarked ? "reader__container__bookmark reader__container__bookmark--show" : "reader__container__bookmark"}></div>
				<div className="reader__container__prev-btn">
					<div className="reader__container__prev-btn__button" onClick={()=> rendition.prev()}>
						<ChevronLeftIcon stroke="currentColor" />
					</div>
				</div>
				<div id="book__reader" className="reader__container__book"></div>
				<div className="reader__container__next-btn">
					<div className="reader__container__next-btn__button" onClick={()=> rendition.next()}>
						<ChevronRightIcon stroke="currentColor" />
					</div>
				</div>
				<div className={
					showContextMenu
					? "reader__container__context-menu-container reader__container__context-menu-container--show"
					: "reader__container__context-menu-container"
				}>
					<AnnotationContextMenu 
						onColorSelect={(color)=>{
							handleAnnotationColorSelect(color)
							setShowContextMenu(false)
						}} 
						onClose={()=>{
							setShowContextMenu(false)
						}}
					/>
				</div>
			</div>
			<nav className="reader__nav">
				<RangeSlider value={progress} onChange={handlePageUpdate} max={totalLocations} className="reader__nav__progress" />
				<div className="reader__nav__progress-value">{Math.floor(progress*100/totalLocations)}%</div>
			</nav>
		</div>
	)
}

export default ReaderPage
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import React, { useCallback, useEffect, useRef, useState } from "react"

import Epub, { EpubCFI } from "epubjs"

import useDebounce from "../hook/useDebounce"

import Button from "../components/ui/Buttons/Button"
import ReadTimer from "../components/ui/ReadTime/ReadTime"
import SidePanel from "../components/hoc/SidePanel/SidePanel"
import Customizer from "../components/ui/Customizer/Customizer"
import BookMarkPanel from "../components/ui/BookmarkPanel/BookmarkPanel"
import AnnotationPanel from "../components/ui/Annotation/AnnotationPanel"
import AnnotationContextMenu from "../components/ui/Annotation/AnnotationContextMenu"

import { isUsable } from "../helpers/functions"
import { setSnackbar } from "../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../store/actions/spinner"

import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg"
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg"
import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark.svg"
import { ReactComponent as LetterCaseIcon } from "../assets/icons/letter-case.svg"
import { ReactComponent as BlockquoteIcon } from "../assets/icons/blockquote.svg"
import { ReactComponent as MaximizeIcon } from "../assets/icons/maximize.svg"
import { ReactComponent as MinimizeIcon } from "../assets/icons/minimize.svg"

import { BASE_URL } from '../config/env'

const ReaderPage = () => {

	const params = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [Preview, setPreview] = useState(null)
	const [Loading, setLoading] = useState(false)
	const [bookMeta, setBookMeta] = useState({})
	const [progress, setProgress] = useState(0)
	const [readTime, setReadTime] = useState(0)
	const [rendition, setRendition] = useState()
	const [fullscreen, setFullscreen] = useState(false)
	const [bookmarkPanel, setBookmarkPanel] = useState(false)
	const [annotaionPanel, setAnnotaionPanel] = useState(false)
	const [pageBookmarked, setPageBookmarked] = useState(false)
	const [totalLocations, setTotalLocations] = useState(0)
	const [customizerPanel, setCustomizerPanel] = useState(false)

	const debouncedProgress = useDebounce(progress, 300)

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(!isUsable(Math.floor(progress*100/totalLocations)) || isNaN(Math.floor(progress*100/totalLocations))) setLoading(true)
		else setLoading(false)
	}, [progress, totalLocations])

	const hideAllPanel = ({customizer=true,bookmark=true,annotation=true}) => {
		customizer && setCustomizerPanel(false)
		bookmark && setBookmarkPanel(false)
		annotation && setAnnotaionPanel(false)
	}

	useEffect(()=>{
		if(!isUsable(rendition)) return
		const handleResize = () => rendition.manager.resize(window.innerWidth-8*16,"100%")
		const handleFullscreen = () => {
			if(isUsable(window.document.fullscreenElement)) setFullscreen(true)
			else setFullscreen(false)
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
			const rendition = book.renderTo("book__reader", { width: window.innerWidth-8*16,height: "100%" })
			rendition.themes.registerThemes({
				dark : {
					body : {
						"background-color" : "black",
						"color" : "white"
					},
					p : {
						"text-align": "justify" 
					}
				},
				light : {
					body : {
						"background-color" : "white",
						"color" : "black"
					},
					p : {
						"text-align": "justify" 
					}
				}
			})
			rendition.themes.select("light")
			rendition.display()
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
		rendition.display(rendition.book.locations.cfiFromLocation(debouncedProgress))
	}, [debouncedProgress, rendition])

	const handlePageUpdate = (e) => {
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
			let stored = JSON.parse(window.localStorage.getItem(bookKey)) || []
			let epubcfi = new EpubCFI()
			let current = rendition.currentLocation()
			try{
				for(let bookmark of stored){
					if(epubcfi.compare(bookmark.cfi,current.start.cfi)===0) return true
					if(epubcfi.compare(bookmark.cfi,current.end.cfi)===0) return true
					if(epubcfi.compare(bookmark.cfi,current.start.cfi)===1 && epubcfi.compare(bookmark.cfi,current.end.cfi)===-1) return true
				}
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

	return (
		<div className="reader">
			<div className="reader__header">
				<div className="reader__header__left">
					<Button type="icon" onClick={()=>{navigate(-1)}}><ChevronLeftIcon/></Button>
					<ReadTimer preview={Preview} bookMeta={bookMeta}/>
					{/* <button onClick={()=>{
						console.log(rendition)
					}}>Debug</button> */}
				</div>
				<div className="reader__header__center">
					<div className="reader__header__center__title">{bookMeta.title||"Untitled"}</div>
				</div> 
				<div className="reader__header__right">
					<Button type="icon" onClick={()=>setFullscreen(s=>!s)}>
						{fullscreen?<MinimizeIcon/>:<MaximizeIcon/>}
					</Button>
					<Button type="icon" className={annotaionPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({annotation:false});setAnnotaionPanel(s=>!s)}} >
						<BlockquoteIcon/>
					</Button>
					<SidePanel show={annotaionPanel} position="right">
						<AnnotationPanel preview={Preview} rendition={rendition} bookMeta={bookMeta} show={annotaionPanel} addAnnotationRef={addAnnotationRef} hideModal={()=>{setAnnotaionPanel(false)}} onRemove={()=>{setAnnotaionPanel(false)}} />
					</SidePanel>
					<Button type="icon" className={bookmarkPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({bookmark:false});setBookmarkPanel(s=>!s)}} ><BookmarkIcon /></Button>
					<SidePanel show={bookmarkPanel} position="right">
						<BookMarkPanel preview={Preview} rendition={rendition} bookMeta={bookMeta} show={bookmarkPanel}
							onAdd={()=>{
								updateBookmarkedStatus()
								setBookmarkPanel(s=>false)
							}}
							onRemove={()=>{
								updateBookmarkedStatus()
								setBookmarkPanel(s=>false)
							}}
							onGoto={()=>setBookmarkPanel(s=>false)}
						/>
					</SidePanel>

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
				<input type="range" value={progress} onChange={handlePageUpdate} max={totalLocations} className="reader__nav__progress" />
				<div className="reader__nav__progress-value">{Math.floor(progress*100/totalLocations)}%</div>
			</nav>
		</div>
	)
}

export default ReaderPage
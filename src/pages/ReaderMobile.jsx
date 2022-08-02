import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { useSearchParams } from "react-router-dom"
import React, { useCallback, useEffect, useRef, useState } from "react"

import axios from "axios"
import Epub, { EpubCFI } from "epubjs"

import useDebounce from "../hook/useDebounce"

import Button from "../components/ui/Buttons/Button"
import TocPanel from "../components/ui/TocPanel/TocPanel"
import ReadTimer from "../components/ui/ReadTime/ReadTime"
import SidePanel from "../components/hoc/SidePanel/SidePanel"
import Customizer from "../components/ui/Customizer/Customizer"
import RangeSlider from "../components/ui/RangeSlider/RangeSlider"
import AnnotationPanel from "../components/ui/Annotation/AnnotationPanel"
import AnnotationContextMenu from "../components/ui/Annotation/AnnotationContextMenu"

import { setSnackbar } from "../store/actions/snackbar"
import { isFilled, isUsable } from "../helpers/functions"
import { hideSpinner, showSpinner } from "../store/actions/spinner"

import { ReactComponent as ListIcon } from "../assets/icons/list.svg"
import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark.svg"
import { ReactComponent as MaximizeIcon } from "../assets/icons/maximize.svg"
import { ReactComponent as MinimizeIcon } from "../assets/icons/minimize.svg"
import { ReactComponent as BlockquoteIcon } from "../assets/icons/block-quote.svg"
import { ReactComponent as LetterCaseIcon } from "../assets/icons/letter-case.svg"
import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg"
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg"

import GaTracker from "../trackers/ga-tracker"
import { BASE_URL } from '../config/env'
import { ReaderBaseTheme } from "../config/readerTheme"

const ReaderMobilePage = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [searchParams] = useSearchParams()

	const [Loading, setLoading] = useState(false)
	const [IsReady, setIsReady] = useState(false)
	const [IsErrored, setIsErrored] = useState(false)
	const [BookAddress, setBookAddress] = useState(null)
	const [WalletAddress, setWalletAddress] = useState(null)
	// Reader
	const [ShowUI, setShowUI] = useState(true)
	const [Preview, setPreview] = useState(null)
	const [BookUrl, setBookUrl] = useState(null)
	const [BookMeta, setBookMeta] = useState({})
	const [Progress, setProgress] = useState(0)
	const [Rendition, setRendition] = useState()
	const [Fullscreen, setFullscreen] = useState(false)
	const [ChapterName, setChapterName] = useState("")
	const [PageBookmarked, setPageBookmarked] = useState(false)
	const [TotalLocations, setTotalLocations] = useState(0)
	const [CurrentLocationCFI, setCurrentLocationCFI] = useState("")
	// Panels
	const [ShowTocPanel, setShowTocPanel] = useState(false)
	const [ShowContextMenu, setShowContextMenu] = useState(false)
	const [AnnotationSelection, setAnnotationSelection] = useState({})
	const [ShowAnnotationPanel, setShowAnnotationPanel] = useState(false)
	const [ShowCustomizerPanel, setShowCustomizerPanel] = useState(false)

	const seeking = useRef(false)
	const addAnnotationRef = useRef()
	const debouncedProgress = useDebounce(Progress, 300)

	const saveLastReadPage = useCallback(
		(cfi) => {
			if(!isUsable(window.localStorage)) return
			if(!isUsable(BookMeta)) return
			const bookKey = `${BookMeta.id}:lastread`
			localStorage.setItem(bookKey,cfi)
		},[BookMeta]
	)

	const isCurrentPageBookmarked = useCallback(
		() => {
			if(!isUsable(Rendition)) return
			if(!isUsable(BookMeta)) return
			const bookKey = `${BookMeta.id}:bookmarks`
			let item = window.localStorage.getItem(bookKey) ;
			if(!isFilled(item)) return false ;
			let stored = JSON.parse(item) || {}
			let epubcfi = new EpubCFI()
			let current = Rendition.currentLocation()
			try{
				if(epubcfi.compare(stored.cfi,current.start.cfi)===0) return true
				if(epubcfi.compare(stored.cfi,current.end.cfi)===0) return true
				if(epubcfi.compare(stored.cfi,current.start.cfi)===1 && epubcfi.compare(stored.cfi,current.end.cfi)===-1) return true
				return false	 
			} catch(err){
				return false
			}
		},[BookMeta, Rendition]
	)

	const updateBookmarkedStatus = useCallback(
		() => {
			const PageBookmarked = isCurrentPageBookmarked()
			setPageBookmarked(PageBookmarked)
		},[isCurrentPageBookmarked]
	)

	const hideAllPanel = useCallback(
		({customizer=true,annotation=true,toc=true}={}) => {
			customizer && setShowCustomizerPanel(false)
			annotation && setShowAnnotationPanel(false)
			toc && setShowTocPanel(false)
		},
		[]
	)

	const handlePageUpdate = (e) => {
		seeking.current = true ;
		setProgress(e.target.value)
	}

	const openFullscreen = () => {
		var elem = document.documentElement
		if (elem.requestFullscreen) elem.requestFullscreen()
		else if (elem.webkitRequestFullscreen)elem.webkitRequestFullscreen()
		else if (elem.msRequestFullscreen) elem.msRequestFullscreen()
	}

	const closeFullscreen = () => {
		if(!document.fullscreenElement) return
		if (document.exitFullscreen) document.exitFullscreen()
		else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
		else if (document.msExitFullscreen) document.msExitFullscreen()
	}

	const handleAnnotationColorSelect = (color) => {
		if(!isUsable(AnnotationSelection)) return
		if(!isUsable(Rendition)) return
		if(!isUsable(BookMeta)) return
		if(isUsable(addAnnotationRef.current) && typeof addAnnotationRef.current === "function")
			addAnnotationRef.current({...AnnotationSelection,color})
	}

	const addBookMark = () => {
		GaTracker('event_bookmarkpanel_bookmark')
		if(isUsable(Preview) && !Preview && isUsable(BookMeta) && isUsable(WalletAddress)){
			if(!isUsable(Rendition)) return
			if(!isUsable(BookMeta)) return
			setLoading(true)
			let newBookmark = {
				cfi : Rendition.currentLocation().start.cfi,
				percent : Rendition.currentLocation().start.percentage
			};
			axios({
				url: `${BASE_URL}/api/reader/bookmarks`,
				method: 'POST',
				data: {
					bookAddress: BookMeta.book_address,
					ownerAddress: WalletAddress,
					bookmarks: JSON.stringify(newBookmark),
				}
			}).then(res => {
				if(res.status === 200) {
					const bookKey = `${BookMeta.id}:bookmarks`
					localStorage.setItem(bookKey,JSON.stringify(newBookmark))
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
		if(isUsable(Preview) && !Preview && isUsable(BookMeta) && isUsable(WalletAddress)){
			if(!isUsable(Rendition)) return
			if(!isUsable(BookMeta)) return
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/reader/bookmarks`,
				method: 'POST',
				data: {
					bookAddress: BookMeta.book_address,
					ownerAddress: WalletAddress,
					bookmarks: "",
				}
			}).then(res => {
				if(res.status === 200) {
					const bookKey = `${BookMeta.id}:bookmarks`
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

	useEffect(() => {
		if(IsErrored) dispatch(setSnackbar('ERROR'))
	}, [IsErrored, dispatch])

	useEffect(() => {
		const book = searchParams.get('bk')
		const bookUrl = searchParams.get('bkul')
		const preview = searchParams.get('pw')
		const bookAddress = searchParams.get('bkas')
		const walletAddress = searchParams.get('oras')
		if(isUsable(book) && isUsable(preview) && isFilled(bookAddress) && isFilled(walletAddress)){
			if(!preview && !isFilled(bookUrl)) setIsErrored(true)
			setBookUrl(bookUrl)
			setPreview(preview)
			setBookMeta(book)
			setBookAddress(bookAddress)
			setWalletAddress(walletAddress)
			setIsReady(true)
		}
		else setIsErrored(true)
	}, [searchParams, dispatch])

	useEffect(() => { GaTracker('page_view_reader_mobile') }, [])

	useEffect(()=>{
		if(Fullscreen===true) openFullscreen()
		else closeFullscreen()
	},[Fullscreen])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(()=>{
		hideAllPanel()
	},[ShowUI,hideAllPanel])

	useEffect(()=>{
		if(IsReady){
			setLoading(true)
			let bookURL = BookUrl
			if(Preview) bookURL = BASE_URL+'/files/'+BookMeta.preview
			try {
				const book = Epub(bookURL,{openAs:"epub"})
				book.ready.then(()=>{
					const elm = document.querySelector("#book__reader") ;
					if(elm) elm.innerHTML = "";
					const _rendition = book.renderTo("book__reader", {
						width: "100%",
						height: "100%",
						manager: "continuous",
						flow: "paginated",
						snap: "true",
						gap : 40
					});
					_rendition.themes.default(ReaderBaseTheme)
					_rendition.display();
					setRendition(_rendition)
					setLoading(false)
				}).catch(err => {
					dispatch(setSnackbar({show: true, message: "Error while loading book.", type: 4}))
					setLoading(false)
				})
			} catch(err) {
				dispatch(setSnackbar({show: true, message: "Error while loading book.", type: 4}))
				setLoading(false)
			}
		}
	},[IsReady, dispatch, BookMeta, BookUrl, Preview])

	useEffect(()=>{
		if(IsReady){
			if(!isUsable(Rendition)) return
			const handleResize = () => {
				GaTracker('event_reader_resize')
				Rendition.manager.resize("100%","100%")
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
		}
	},[IsReady, Rendition])

	useEffect(()=>{
		if(IsReady){
			if(!isUsable(Rendition)) return
			if(!isUsable(CurrentLocationCFI) && !isFilled(CurrentLocationCFI)) return
			Rendition.book.loaded.navigation.then(function(){
				let locationCfi = CurrentLocationCFI;
				let spineItem = Rendition.book.spine.get(locationCfi);
				if(!isUsable(spineItem)) return ;
				let navItem = Rendition.book.navigation.get(spineItem.href);
				setChapterName(navItem?.label?.trim()||"")
			});
		}
	},[IsReady, Rendition, CurrentLocationCFI])

	useEffect(()=>{
		if(IsReady){
			if(!isUsable(Rendition)) return
			if(!isUsable(BookMeta)) return
			const handleRelocated = (event)=>{
				updateBookmarkedStatus()
				setProgress(event.start.location)
				saveLastReadPage(event.start.cfi)
				setCurrentLocationCFI(event.start.cfi)
			}
			const handleClick = () => { setShowUI(s=>!s)}
			const handleKeyUp = (e) => {
				if ((e.key === "ArrowLeft") || (e.keyCode || e.which) === 37) {
					Rendition.prev();
				}
				if ((e.key === "ArrowRight") || (e.keyCode || e.which) === 39) {
					Rendition.next();
				}
			}
			Rendition.on("relocated",handleRelocated)
			Rendition.on("click",handleClick);
			Rendition.on("keyup", handleKeyUp);
			document.addEventListener("keyup", handleKeyUp);
			return ()=>{
				Rendition.off("relocated",handleRelocated)
				Rendition.off("click",handleClick);
				Rendition.off("keyup", handleKeyUp);
				document.removeEventListener("keyup", handleKeyUp);
			}
		}
	},[IsReady, Rendition, BookMeta, updateBookmarkedStatus, saveLastReadPage, setCurrentLocationCFI])

	useEffect(()=>{
		if(IsReady){
			if (!isUsable(Rendition)) return
			if (!isUsable(BookMeta)) return
			const bookKey = `${BookMeta.id}:locations`
			let stored = localStorage.getItem(bookKey)
			if (stored) {
				Rendition.book.locations.load(stored)
				setTotalLocations(JSON.parse(stored).length)
			} else {
				Rendition.book.locations.generate()
				.then(()=>{
					setTotalLocations(Rendition.book.locations.total)
					localStorage.setItem(bookKey, Rendition.book.locations.save())
				})
				.catch((err)=>{})
			}
		}
	},[IsReady, Rendition, BookMeta])

	useEffect(() => {
		if(IsReady){
			if(!isUsable(Rendition)) return
			if(seeking.current === true){
				Rendition.display(Rendition.book.locations.cfiFromLocation(debouncedProgress))
				seeking.current=false
			}	
		}
	}, [IsReady, debouncedProgress, Rendition, seeking])

	useEffect(() => {
		if(IsReady){
			if(!isUsable(window.localStorage)) return
			if(!isUsable(BookMeta)) return
			if(!isUsable(Rendition)) return
			const bookKey = `${BookMeta.id}:lastread`
			let lastPageCfi = localStorage.getItem(bookKey)
			if(isUsable(lastPageCfi)) {
				Rendition.display(lastPageCfi)
			}
		}
	}, [IsReady, BookMeta, Rendition])

	useEffect(()=>{
		if(IsReady){
			if(!isUsable(Rendition)) return
			if(!isUsable(BookMeta)) return
			const handleSelected = (cfiRange,contents)=>{
				Rendition.book.getRange(cfiRange).then((range)=>{
					setAnnotationSelection({cfiRange,text : range?.toString()})
					setShowContextMenu(true)
				}).catch(()=>{
					setAnnotationSelection({})
				})
			}
			Rendition.on("selected",handleSelected)
			return ()=>{Rendition.off("selected",handleSelected)}
		}
	},[IsReady, Rendition, BookMeta])

	useEffect(()=>{
		if(IsReady){
			if(!isUsable(Rendition)) return
			if(!isUsable(BookMeta)) return
			const handleMarkClicked = (cfiRange,data,contents)=>{
				setShowAnnotationPanel(true)
			}
			Rendition.on("markClicked",handleMarkClicked)
			return ()=>{Rendition.off("markClicked",handleMarkClicked)}
		}
	},[IsReady, Rendition, BookMeta])

	return (
		IsReady?
			<div className="reader">
				<div className={"reader__header" + (ShowUI?" reader__header--show":"")}>
					<div className="reader__header__left">
						<Button type="icon" onClick={()=>{navigate(-1)}}><ChevronLeftIcon/></Button>
						<div className="reader__header__left__timer">
							{Rendition && <ReadTimer preview={Preview} BookMeta={BookMeta}/>}
						</div>
					</div>
					<div className="reader__header__center">
						<div className="typo__body--2 typo__color--n700 typo__transform--capital">{BookMeta.title||"Untitled"}</div>
					</div> 
					<div className="reader__header__right">
						<Button className="reader__header__right__hide-on-mobile" type="icon" onClick={()=>setFullscreen(s=>!s)}> {Fullscreen?<MinimizeIcon/>:<MaximizeIcon/>} </Button>
						<Button type="icon" className={ShowTocPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({toc:false});setShowTocPanel(s=>!s)}} > <ListIcon/> </Button>
						<Button type="icon" className={ShowAnnotationPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({annotation:false});setShowAnnotationPanel(s=>!s)}} > <BlockquoteIcon/> </Button>
						<Button type="icon" className={PageBookmarked?"reader__header__right__button--active":""} onClick={toggleBookMark} ><BookmarkIcon /></Button>
						<Button type="icon" className={ShowCustomizerPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({customizer:false});setShowCustomizerPanel(s=>!s)}}><LetterCaseIcon /></Button>
					</div>
				</div>
				<div className="reader__container">
					<div className={PageBookmarked ? "reader__container__bookmark reader__container__bookmark--show" : "reader__container__bookmark"}></div>
					<div className="reader__container__prev-btn">
						<div className="reader__container__prev-btn__button" onClick={()=> Rendition.prev()}>
							<ChevronLeftIcon width={32} stroke="currentColor" />
						</div>
					</div>
					<div id="book__reader" className="reader__container__book"></div>
					<div className="reader__container__next-btn">
						<div className="reader__container__next-btn__button" onClick={()=> Rendition.next()}>
							<ChevronRightIcon width={32} stroke="currentColor" />
						</div>
					</div>
					{!Preview && (
						<div className={ ShowContextMenu ? "reader__container__context-menu-container reader__container__context-menu-container--show" : "reader__container__context-menu-container"}>
							<AnnotationContextMenu onColorSelect={(color)=>{handleAnnotationColorSelect(color); setShowContextMenu(false)}} onClose={()=>setShowContextMenu(false)}/>
						</div>
					)}
					<SidePanel show={ShowTocPanel} setShow={setShowTocPanel} position="right" title="Table of Content">
						<TocPanel onSelect={()=>{hideAllPanel({toc: false});setShowTocPanel(false)}} Rendition={Rendition}/>
					</SidePanel>
					<SidePanel show={ShowAnnotationPanel} setShow={setShowAnnotationPanel} position="right" title="Annotations">
						<AnnotationPanel preview={Preview} Rendition={Rendition} BookMeta={BookMeta} show={ShowAnnotationPanel} addAnnotationRef={addAnnotationRef} hideModal={()=>{setShowAnnotationPanel(false)}} onRemove={()=>{setShowAnnotationPanel(false)}} />
					</SidePanel>
					<SidePanel show={ShowCustomizerPanel} setShow={setShowCustomizerPanel} position="right-bottom" title="Preferences">
						<Customizer initialFontSize={100} Rendition={Rendition}/>
					</SidePanel>
				</div>
				<nav className={"reader__nav" + (ShowUI?" reader__nav--show":"")}>
					<div className="reader__nav__value">
						<div className="reader__nav__value__chapter-title typo__gray--n600 typo__transform--capital">{ChapterName||BookMeta.title||""}</div>
						<div>{Math.floor(debouncedProgress*100/TotalLocations)||"0"}%</div>
					</div>
					<div className="reader__nav__progress">
						<RangeSlider value={Progress} onChange={handlePageUpdate} max={TotalLocations} className="reader__nav__progress" />
					</div>
				</nav>
			</div>
		:
			null
	)
}

export default ReaderMobilePage
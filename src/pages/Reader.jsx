import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"

import Epub, { EpubCFI } from "epubjs"

import useDebounce from "../hook/useDebounce"

import Button from "../components/ui/Buttons/Button"
import ReadTimer from "../components/ui/ReadTime/ReadTime"
import SidePanel from "../components/hoc/SidePanel/SidePanel"
import Customizer from "../components/ui/Customizer/Customizer"
import AnnotationPanel from "../components/ui/Annotation/AnnotationPanel"
import QuotePanel from "../components/ui/Quote/QuotePanel"
import AnnotationContextMenu from "../components/ui/Annotation/AnnotationContextMenu"

import { isFilled, isUsable } from "../helpers/functions"
import { setSnackbar } from "../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../store/actions/spinner"

import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg"
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg"
import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark.svg"
import { ReactComponent as LetterCaseIcon } from "../assets/icons/letter-case.svg"
import { ReactComponent as BlockquoteIcon } from "../assets/icons/block-quote.svg"
import { ReactComponent as MaximizeIcon } from "../assets/icons/maximize.svg"
import { ReactComponent as MinimizeIcon } from "../assets/icons/minimize.svg"
import { ReactComponent as ListIcon } from "../assets/icons/list.svg"
import { ReactComponent as CommunicationIcon } from "../assets/icons/communication.svg"

import { BASE_URL } from '../config/env'
import GaTracker from "../trackers/ga-tracker"
import TocPanel from "../components/ui/TocPanel/TocPanel"
import RangeSlider from "../components/ui/RangeSlider/RangeSlider"
import { setWallet } from "../store/actions/wallet"
import Wallet from "../connections/wallet"
import axios from "axios"
import { ReaderBaseTheme } from "../config/readerTheme"

const ReaderPage = () => {

	const params = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const BWalletState = useSelector(state => state.BWalletState)

	const [Preview, setPreview] = useState(null)
	const [Loading, setLoading] = useState(false)
	const [bookMeta, setBookMeta] = useState({})
	const [progress, setProgress] = useState(0)
	const [rendition, setRendition] = useState()
	const [fullscreen, setFullscreen] = useState(false)
	const [annotaionPanel, setAnnotaionPanel] = useState(false)
	const [quotePanel, setQuotePanel] = useState(false)
	const [pageBookmarked, setPageBookmarked] = useState(false)
	const [totalLocations, setTotalLocations] = useState(0)
	const [customizerPanel, setCustomizerPanel] = useState(false)
	const [tocPanel, setTocPanel] = useState(false);
	const [WalletAddress, setWalletAddress] = useState(null);
	const [showUI, setShowUI] = useState(true);
	const [annotationSelection, setAnnotationSelection] = useState({})
	const [showContextMenu, setShowContextMenu] = useState(false)
	const [chapterName, setChapterName] = useState("");
	const [discCount, setDiscCount] = useState("");
	const [currentLocationCFI, setCurrentLocationCFI] = useState("");

	const debouncedProgress = useDebounce(progress, 300)
	const addAnnotationRef = useRef()
	const addQuotesRef = useRef()
	const seeking = useRef(false);

	const connectWallet = useCallback(
		() => {
			Wallet.connectWallet().then(res => {
				dispatch(setWallet(res.selectedAddress))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
			}).catch(err => {
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
			}).finally(() => setLoading(false))
		},[dispatch],
	)

	const saveLastReadPage = useCallback(
		(cfi) => {
			GaTracker('event_reader_lastPage_save')
			if(!isUsable(window.localStorage)) return
			if(!isUsable(bookMeta)) return
			const bookKey = `${bookMeta.id}:lastread`
			localStorage.setItem(bookKey,cfi)
		},[bookMeta]
	)

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
				return false
			}
		},[bookMeta, rendition]
	)

	const updateBookmarkedStatus = useCallback(
		() => {
			GaTracker('event_reader_page_bookmark')
			const pageBookmarked = isCurrentPageBookmarked()
			setPageBookmarked(pageBookmarked)
		},[isCurrentPageBookmarked]
	)

	const hideAllPanel = useCallback(
		({customizer=true,annotation=true,quote=true,toc=true}={}) => {
			GaTracker('event_reader_panels_hide')
			customizer && setCustomizerPanel(false)
			annotation && setAnnotaionPanel(false)
			quote && setQuotePanel(false)
			toc && setTocPanel(false)
		},
		[]
	)

	useEffect(() => { GaTracker('page_view_reader') }, [])

	useEffect(()=>{
		if(fullscreen===true){
			GaTracker('event_reader_screen_full')
			openFullscreen()
		}
		else{
			GaTracker('event_reader_screen_window')
			closeFullscreen()
		}
	},[fullscreen])	

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		if(isUsable(BWalletState.smartAccount)) setWalletAddress(BWalletState.smartAccount.address)
		else connectWallet()
		setLoading(false)
	}, [BWalletState, connectWallet])

	useEffect(()=>{
		hideAllPanel()
	},[showUI,hideAllPanel])

	useEffect(()=>{
		setLoading(true)
		let bookURL = null
		const navParams = params.state
		if(isUsable(navParams.preview) && navParams.preview === true){
			GaTracker('event_reader_mode_preview')
			bookURL = BASE_URL+'/files/'+navParams.book.preview
			setPreview(true)
		} else {
			GaTracker('event_reader_mode_live')
			bookURL = navParams.book.url
			setPreview(false)
		}
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
					gap : 40,
					allowScriptedContent: true
				});
				_rendition.themes.default(ReaderBaseTheme)
				_rendition.display();
				setRendition(_rendition)
				setLoading(false)
			}).catch(err => {
				dispatch(setSnackbar({show: true, message: "Error while loading book.", type: 4}))
				setLoading(false)
			})
			setBookMeta(navParams.book)  
		} catch(err) {
			dispatch(setSnackbar({show: true, message: "Error while loading book.", type: 4}))
			setLoading(false)
		}
	},[params, dispatch])

	useEffect(()=>{ 
		if(!isUsable(rendition)) return
		const handleResize = () => {
			GaTracker('event_reader_resize')
			rendition.manager.resize("100%","100%")
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
		if(!isUsable(rendition)) return
		if(!isUsable(currentLocationCFI) && !isFilled(currentLocationCFI)) return
		rendition.book.loaded.navigation.then(function(){
			let locationCfi = currentLocationCFI;
			let spineItem = rendition.book.spine.get(locationCfi);
			if(!isUsable(spineItem)) return ;
			let navItem = rendition.book.navigation.get(spineItem.href);
			setChapterName(navItem?.label?.trim()||"")
		});
	},[rendition,currentLocationCFI])

	useEffect(()=>{
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		const handleRelocated = (event)=>{
			updateBookmarkedStatus()
			setProgress(event.start.location)
			saveLastReadPage(event.start.cfi)
			setCurrentLocationCFI(event.start.cfi)
		}
		const handleClick = () => { setShowUI(s=>!s)}
		const handleKeyUp = (e) => {
			GaTracker('event_reader_navigate_keys')
			if ((e.key === "ArrowLeft") || (e.keyCode || e.which) === 37) {
				rendition.prev();
			}
			if ((e.key === "ArrowRight") || (e.keyCode || e.which) === 39) {
				rendition.next();
			}
		}
		rendition.on("relocated",handleRelocated)
		rendition.on("click",handleClick);
		rendition.on("keyup", handleKeyUp);
		document.addEventListener("keyup", handleKeyUp);
		return ()=>{
			rendition.off("relocated",handleRelocated)
			rendition.off("click",handleClick);
			rendition.off("keyup", handleKeyUp);
			document.removeEventListener("keyup", handleKeyUp);
		}
	},[rendition,bookMeta, updateBookmarkedStatus,saveLastReadPage,setCurrentLocationCFI])

	useEffect(()=>{
		if (!isUsable(rendition)) return
		if (!isUsable(bookMeta)) return
		const bookKey = `${bookMeta.id}:locations`
		let stored = localStorage.getItem(bookKey)
		if (stored) {
			rendition.book.locations.load(stored)
			setTotalLocations(JSON.parse(stored).length)
		} else {
			rendition.book.locations.generate()
			.then(()=>{
				setTotalLocations(rendition.book.locations.total)
				localStorage.setItem(bookKey, rendition.book.locations.save())
			})
			.catch((err)=>{})
		}
	},[rendition,bookMeta])

	useEffect(() => {
		if(!isUsable(rendition)) return
		if(seeking.current === true){
			rendition.display(rendition.book.locations.cfiFromLocation(debouncedProgress))
			seeking.current=false
		}	
	}, [debouncedProgress, rendition, seeking])

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

	useEffect(()=>{
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		const handleSelected = (cfiRange,contents)=>{
			GaTracker('event_reader_content_selected')
			rendition.book.getRange(cfiRange).then((range)=>{
				setAnnotationSelection({cfiRange,text : range?.toString()})
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
		if(!isUsable(annotationSelection)) return
		if(!isUsable(rendition)) return
		if(!isUsable(bookMeta)) return
		if(isUsable(addAnnotationRef.current) && typeof addAnnotationRef.current === "function")
			addAnnotationRef.current({...annotationSelection,color})
	}

	const addBookMark = () => {
		GaTracker('event_bookmarkpanel_bookmark')
		if(isUsable(Preview) && !Preview && isUsable(bookMeta) && isUsable(WalletAddress)){
			if(!isUsable(rendition)) return
			if(!isUsable(bookMeta)) return
			setLoading(true)
			let newBookmark = {
				cfi : rendition.currentLocation().start.cfi,
				percent : rendition.currentLocation().start.percentage
			};
			axios({
				url: `${BASE_URL}/api/reader/bookmarks`,
				method: 'POST',
				data: {
					bookAddress: bookMeta.book_address,
					ownerAddress: WalletAddress,
					bookmarks: JSON.stringify(newBookmark),
				}
			}).then(res => {
				if(res.status === 200) {
					const bookKey = `${bookMeta.id}:bookmarks`
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
		if(isUsable(Preview) && !Preview && isUsable(bookMeta) && isUsable(WalletAddress)){
			if(!isUsable(rendition)) return
			if(!isUsable(bookMeta)) return
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/reader/bookmarks`,
				method: 'POST',
				data: {
					bookAddress: bookMeta.book_address,
					ownerAddress: WalletAddress,
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
		<>
			<Helmet>
				<meta name='Reader' content="Book's Reader View"/>
			</Helmet>
		<div className="reader">
			<div className={"reader__header" + (showUI?" reader__header--show":"")}>
				<div className="reader__header__left">
					<Button type="icon" onClick={()=>{navigate(-1)}}><ChevronLeftIcon/></Button>
					<div className="reader__header__left__timer">
						{rendition && <ReadTimer preview={Preview} bookMeta={bookMeta}/>}
					</div>
				</div>
				<div className="reader__header__center">
					<div className="typo__body--2 typo__color--n700 typo__transform--capital">{bookMeta.title||"Untitled"}</div>
				</div> 
				<div className="reader__header__right">
					<Button className="reader__header__right__hide-on-mobile" type="icon" onClick={()=>setFullscreen(s=>!s)}> {fullscreen?<MinimizeIcon/>:<MaximizeIcon/>} </Button>
					<Button type="icon" className={tocPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({toc:false});setTocPanel(s=>!s)}} > <ListIcon/> </Button>
					<Button type="icon" className={annotaionPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({annotation:false});setAnnotaionPanel(s=>!s)}} > <BlockquoteIcon/> </Button>
					<Button type="icon" className={quotePanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({quotePanel:false});setQuotePanel(s=>!s)}} > <CommunicationIcon/> </Button>
					<Button type="icon" className={pageBookmarked?"reader__header__right__button--active":""} onClick={toggleBookMark} ><BookmarkIcon /></Button>
					<Button type="icon" className={customizerPanel?"reader__header__right__button--active":""} onClick={()=>{hideAllPanel({customizer:false});setCustomizerPanel(s=>!s)}}><LetterCaseIcon /></Button>
				</div>
			</div>
			<div className="reader__container">
				{!quotePanel?<div className="quotes__discussions " >Discussions:<div className="quotes__discussions__count">{discCount}</div></div>:null}
				<div className={pageBookmarked ? "reader__container__bookmark reader__container__bookmark--show" : "reader__container__bookmark"}></div>
				<div className="reader__container__prev-btn">
					<div className="reader__container__prev-btn__button" onClick={()=> rendition.prev()}>
						<ChevronLeftIcon width={32} stroke="currentColor" />
					</div>
				</div>
				<div id="book__reader" className="reader__container__book"></div>
				<div className="reader__container__next-btn">
					<div className="reader__container__next-btn__button" onClick={()=> rendition.next()}>
						<ChevronRightIcon width={32} stroke="currentColor" />
					</div>
				</div>
				{!Preview && (
					<div className={ showContextMenu ? "reader__container__context-menu-container reader__container__context-menu-container--show" : "reader__container__context-menu-container"}>
						<AnnotationContextMenu onColorSelect={(color)=>{handleAnnotationColorSelect(color); setShowContextMenu(false)}} onClose={()=>setShowContextMenu(false)}/>
					</div>
				)}
				<SidePanel show={tocPanel} setShow={setTocPanel} position="right" title="Table of Content">
					<TocPanel onSelect={()=>{hideAllPanel({toc: false});setTocPanel(false)}} rendition={rendition}/>
				</SidePanel>
				<SidePanel show={annotaionPanel} setShow={setAnnotaionPanel} position="right" title="Annotations">
					<AnnotationPanel preview={Preview} rendition={rendition} bookMeta={bookMeta} show={annotaionPanel} addAnnotationRef={addAnnotationRef} hideModal={()=>{setAnnotaionPanel(false)}} onRemove={()=>{setAnnotaionPanel(false)}} />
				</SidePanel>
				<SidePanel show={quotePanel} setShow={setQuotePanel} position="right" title="Discussions">
					<QuotePanel setDiscCount={setDiscCount} preview={Preview} rendition={rendition} bookMeta={bookMeta} show={quotePanel} addQuotesRef={addQuotesRef} hideModal={()=>{setQuotePanel(false)}}  />
				</SidePanel>
				<SidePanel show={customizerPanel} setShow={setCustomizerPanel} position="right-bottom" title="Preferences">
					<Customizer initialFontSize={100} rendition={rendition}/>
				</SidePanel>
			</div>
			<nav className={"reader__nav" + (showUI?" reader__nav--show":"")}>
				<div className="reader__nav__value">
					<div className="reader__nav__value__chapter-title typo__gray--n600 typo__transform--capital">{chapterName||bookMeta.title||""}</div>
					<div>{Math.floor(debouncedProgress*100/totalLocations)||"0"}%</div>
				</div>
				<div className="reader__nav__progress">
					<RangeSlider value={progress} onChange={handlePageUpdate} max={totalLocations} className="reader__nav__progress" />
				</div>
			</nav>
			
		</div>
		</>
	)
}

export default ReaderPage
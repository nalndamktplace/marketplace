import Epub, { EpubCFI } from "epubjs";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import IconButton from "../components/ui/Buttons/IconButton";
import { isUsable } from "../helpers/functions";
import useDebounce from "../hook/useDebounce";

import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg";
import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark.svg";
import { ReactComponent as LetterCaseIcon } from "../assets/icons/letter-case.svg";
import { ReactComponent as BlockquoteIcon } from "../assets/icons/blockquote.svg";
import { ReactComponent as MaximizeIcon } from "../assets/icons/maximize.svg";
import { ReactComponent as ClockIcon } from "../assets/icons/clock.svg";
import { toHHMMSS } from "../helpers/time-formator";
import Customizer from "../components/ui/Customizer/Customizer";
import SidePanel from "../components/hoc/SidePanel/SidePanel";
import BookMarkPanel from "../components/ui/BookmarkPanel/BookmarkPanel";
// import AnnotationContextMenu from "../components/ui/Annotation/AnnotationContextMenu";


const ReaderPage = () => {
    const params = useLocation();
    const [bookMeta, setBookMeta] = useState({});
    const [rendition, setRendition] = useState();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [totalLocations, setTotalLocations] = useState(0);
    const debouncedProgress = useDebounce(progress, 300);
    const [readTime, setReadTime] = useState(0);
    const [customizerOpen, setCustomizerOpen] = useState(false);
    const [pageBookmarked, setPageBookmarked] = useState(false);
    const [bookmarkPanel, setBookmarkPanel] = useState(false);

    useEffect(()=>{
        if(!isUsable(rendition)) return ;
        const handleResize = () => {
            rendition.manager.resize(window.innerWidth-8*16,"100%");
        }
        window.addEventListener("resize",handleResize);
        window.addEventListener("fullscreenchange",handleResize);
        return () => {
            window.removeEventListener("resize",handleResize);
            window.removeEventListener("fullscreenchange",handleResize);
        }
    },[rendition])

    useEffect(()=>{
        const bookURL = params.state.book.book ;
        setBookMeta(params.state.book);
        const book = Epub(bookURL,{openAs:"epub"});
        book.ready.then(()=>{
            document.querySelector("#book__reader").innerHTML = "" ;
            const rendition = book.renderTo("book__reader", { width: window.innerWidth-8*16,height: "100%" });
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
            rendition.themes.select("light");
            rendition.display();
            setRendition(rendition);
        });

    },[params]);

    useEffect(()=>{
        if (!isUsable(rendition)) return;
        if (!isUsable(bookMeta)) return;
        rendition.on("relocated", (event)=>{
            setProgress(event.start.location);
            saveLastReadPage(event.start.cfi);
        });
    },[bookMeta,rendition])

    useEffect(()=>{
        if (!isUsable(rendition)) return;
        if (!isUsable(bookMeta)) return;
        const bookKey = `${bookMeta.id}:locations` ;
        let stored = localStorage.getItem(bookKey);
        if (stored) {
            rendition.book.locations.load(stored);
            setTotalLocations(JSON.parse(stored).length)
        } else {
            rendition.book.locations.generate().then(()=>{
                setTotalLocations(rendition.book.locations.total);
                localStorage.setItem(bookKey, rendition.book.locations.save());
            }).catch((err)=>{
                console.error(err);
            });
        }
    },[rendition,bookMeta]);

    useEffect(() => {
        if(!isUsable(rendition)) return ;
        rendition.display(rendition.book.locations.cfiFromLocation(debouncedProgress));
    }, [debouncedProgress]);

    const handlePageUpdate = (e) => {
        setProgress(e.target.value);
    };

    useEffect(()=>{
        if (!isUsable(rendition)) return;
        if (!isUsable(bookMeta)) return;
        const updateReadTime = () => {
            const bookKey = `${bookMeta.id}:readtime` ;
            let stored = parseInt(localStorage.getItem(bookKey));
            if(!isNaN(stored)){
                localStorage.setItem(bookKey,stored+1);
                setReadTime(stored+1);
            } else {
                localStorage.setItem(bookKey,0);
            }
        };
        let intervalHandler = setInterval(updateReadTime,1000);

        return () => {
            clearInterval(intervalHandler);
        }

    },[rendition,bookMeta])

    const saveLastReadPage = (cfi) => {
        if(!isUsable(window.localStorage)) return;
        if(!isUsable(bookMeta)) return;
        const bookKey = `${bookMeta.id}:lastread` ;
        localStorage.setItem(bookKey,cfi);
    };

    // todo move loading to server
    useEffect(() => {
        if(!isUsable(window.localStorage)) return;
        if(!isUsable(bookMeta)) return;
        if(!isUsable(rendition)) return ;
        const bookKey = `${bookMeta.id}:lastread` ;
        let lastPageCfi = localStorage.getItem(bookKey);
        if(isUsable(lastPageCfi)) {
            rendition.display(lastPageCfi);
        }
    }, [bookMeta, rendition]); 
    
    function openFullscreen() {
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
    }

    const isCurrentPageBookmarked = () => {
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const bookKey = `${bookMeta.id}:bookmarks`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        let epubcfi = new EpubCFI();
        let current = rendition.currentLocation();
        try{
            for(let bookmark of stored){
                if(epubcfi.compare(bookmark.cfi,current.start.cfi)===0) return true;
                if(epubcfi.compare(bookmark.cfi,current.end.cfi)===0) return true;
                if(epubcfi.compare(bookmark.cfi,current.start.cfi)===1 && epubcfi.compare(bookmark.cfi,current.end.cfi)===-1) return true;
            }   
            return false ;     
        } catch(err){
            console.error(err);
            return false;
        }
    }

    const updateBookmarkedStatus = () => {
        const pageBookmarked = isCurrentPageBookmarked() ;
            console.log("PAGE BOOKMARKED : ",pageBookmarked);
            setPageBookmarked(pageBookmarked);
    }

    useEffect(()=>{
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        rendition.on("relocated",()=>{
            updateBookmarkedStatus();
        });
    },[rendition,bookMeta]);

    return (
        <div className="reader">
            <div className="reader__header">
                <div className="reader__header__left">
                    <IconButton icon={<ChevronLeftIcon stroke="currentColor" />} onClick={()=>{navigate(-1)}}/>
                    <div className="reader__header__left__readtime">
                        <ClockIcon width="3rem" height="3rem" stroke="currentColor"/>
                        <div className="reader__header__left__readtime__time">{toHHMMSS(readTime)}</div>
                    </div>
                    {/* <button onClick={()=>{
                        console.log(rendition);
                    }}>Debug</button> */}
                </div>
                <div className="reader__header__center">
                <div className="reader__header__center__title">{bookMeta.title||"Untitled"}</div>
                </div>
                <div className="reader__header__right">
                    <IconButton icon={<MaximizeIcon stroke="currentColor"/>} onClick={openFullscreen}/>

                    <IconButton icon={<BlockquoteIcon stroke="currentColor"/>} onClick={()=>{}}/>
                    <SidePanel show={bookmarkPanel} position="right">
                        <BookMarkPanel 
                            rendition={rendition} 
                            bookMeta={bookMeta}
                            hideModal={()=>{setBookmarkPanel(false)}}
                            onBookmarkAdd={()=>{updateBookmarkedStatus()}}
                            onBookmarkRemove={()=>{updateBookmarkedStatus()}}
                        />
                    </SidePanel>

                    <IconButton 
                        className={bookmarkPanel?"reader__header__right__button--active":""} 
                        icon={<BookmarkIcon stroke="currentColor"/>} 
                        onClick={()=>{setBookmarkPanel(s=>!s)}}
                    />
                    <SidePanel show={bookmarkPanel} position="right">
                        <BookMarkPanel 
                            rendition={rendition} 
                            bookMeta={bookMeta}
                            hideModal={()=>{setBookmarkPanel(false)}}
                            onBookmarkAdd={()=>{updateBookmarkedStatus()}}
                            onBookmarkRemove={()=>{updateBookmarkedStatus()}}
                        />
                    </SidePanel>

                    <IconButton 
                        className={customizerOpen?"reader__header__right__button--active":""} 
                        icon={<LetterCaseIcon stroke="currentColor"/>} 
                        onClick={()=>{setCustomizerOpen(s=>!s)}}
                    />
                    <SidePanel show={customizerOpen} position="right">
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
                {/* <div className="reader__container__context-menu-container">
                    <AnnotationContextMenu />
                </div> */}
            </div>
            <nav className="reader__nav">
                <input
                    type="range"
                    value={progress}
                    onChange={handlePageUpdate}
                    max={totalLocations}
                    className="reader__nav__progress"
                />
                <div className="reader__nav__progress-value">{Math.floor(progress*100/totalLocations)}%</div>
            </nav>
        </div>
    );
};

export default ReaderPage;

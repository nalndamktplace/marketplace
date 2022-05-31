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
import { ReactComponent as MinimizeIcon } from "../assets/icons/minimize.svg";
import Customizer from "../components/ui/Customizer/Customizer";
import SidePanel from "../components/hoc/SidePanel/SidePanel";
import BookMarkPanel from "../components/ui/BookmarkPanel/BookmarkPanel";
import AnnotationContextMenu from "../components/ui/Annotation/AnnotationContextMenu";
import AnnotationPanel from "../components/ui/Annotation/AnnotationPanel";
import ReadTimer from "../components/ui/ReadTime/ReadTime";

import { BASE_URL } from '../config/env'

const ReaderPage = () => {
    const params = useLocation();
    const [bookMeta, setBookMeta] = useState({});
    const [rendition, setRendition] = useState();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [totalLocations, setTotalLocations] = useState(0);
    const debouncedProgress = useDebounce(progress, 300);
    const [readTime, setReadTime] = useState(0);
    const [pageBookmarked, setPageBookmarked] = useState(false);
    const [customizerPanel, setCustomizerPanel] = useState(false);
    const [bookmarkPanel, setBookmarkPanel] = useState(false);
    const [annotaionPanel, setAnnotaionPanel] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    const hideAllPanel = ({customizer=true,bookmark=true,annotation=true}) => {
        customizer && setCustomizerPanel(false);
        bookmark && setBookmarkPanel(false);
        annotation && setAnnotaionPanel(false);
    }

    useEffect(()=>{
        if(!isUsable(rendition)) return ;
        const handleResize = () => {
            rendition.manager.resize(window.innerWidth-8*16,"100%");
        }
        const handleFullscreen = () => {
            if(isUsable(window.document.fullscreenElement)) setFullscreen(true);
            else setFullscreen(false);
            handleResize();
        }
        window.addEventListener("resize",handleResize);
        window.addEventListener("fullscreenchange",handleFullscreen);
        return () => {
            window.removeEventListener("resize",handleResize);
            window.removeEventListener("fullscreenchange",handleFullscreen);
        }
    },[rendition])

    useEffect(()=>{
      let bookURL = null
        const navParams = params.state
      if(isUsable(navParams.preview) && navParams.preview === true){
        bookURL = BASE_URL+'/files/'+navParams.book.preview
        setBookMeta(navParams.book)
      }
      else{
        bookURL = navParams.book.book
        setBookMeta(navParams.book)
      }
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

    useEffect(()=>{
        if(fullscreen===true) openFullscreen();
        else closeFullscreen();
    },[fullscreen])

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

    const [annotationSelection, setAnnotationSelection] = useState({});
    const [showContextMenu, setShowContextMenu] = useState(false);
    // const [contextMenuPosition, setContextMenuPosition] = useState({x:0,y:0});
    // const contextMenuContainerRef = useRef();

    // useEffect(()=>{
    //     if(!isUsable(contextMenuContainerRef.current)) return ;
    //     contextMenuContainerRef.current.style.setProperty("--x",contextMenuPosition.x)
    //     contextMenuContainerRef.current.style.setProperty("--y",contextMenuPosition.y)
    // },[contextMenuContainerRef,contextMenuPosition])
    
    useEffect(()=>{
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const handleRelocated = ()=>{updateBookmarkedStatus();}
        rendition.on("relocated",handleRelocated);
        return ()=>{rendition.off("relocated",handleRelocated);}
    },[rendition,bookMeta]);


    useEffect(()=>{
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const handleSelected = (cfiRange,contents)=>{
            // console.log(cfiRange,contents)
            // const selection = contents.window.getSelection() ;
            // const anchorNodeCoords = selection.anchorNode.parentElement.getBoundingClientRect() ;
            // const extentNodeCoords = selection.extentNode.parentElement.getBoundingClientRect() ;

            // let coords = {
            //     y : (Math.min(anchorNodeCoords.y,extentNodeCoords.y) + Math.max(anchorNodeCoords.y+anchorNodeCoords.height,extentNodeCoords.y+extentNodeCoords.height))/2,
            //     x : (Math.min(anchorNodeCoords.x,extentNodeCoords.x) + Math.max(anchorNodeCoords.x+anchorNodeCoords.width,extentNodeCoords.x+extentNodeCoords.width))/2,
            // };

            // coords = {
            //     x : window.innerWidth / 2,
            //     y : window.innerHeight / 2,
            // }

            // if(isNaN(coords.x) || isNaN(coords.y)){
            //     coords = {
            //         x : window.innerWidth / 2,
            //         y : window.innerHeight / 2,
            //     }
            // }

            rendition.book.getRange(cfiRange).then((range)=>{
                setAnnotationSelection({
                    cfiRange,
                    text : range?.toString()
                })
                // setContextMenuPosition(coords);
                setShowContextMenu(true);
            }).catch(()=>{
                setAnnotationSelection({});
            })
        }
        rendition.on("selected",handleSelected);
        return ()=>{rendition.off("selected",handleSelected);}
    },[rendition,bookMeta]);

    useEffect(()=>{
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const handleMarkClicked = (cfiRange,data,contents)=>{
            console.log(cfiRange,data,contents)
            setAnnotaionPanel(true);
        }
        rendition.on("markClicked",handleMarkClicked);
        return ()=>{rendition.off("markClicked",handleMarkClicked);}
    },[rendition,bookMeta]);

    useEffect(()=>{
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        updateAnnotation();
    },[rendition,bookMeta]);

    const handleAnnotationColorSelect = (color) => {
        if(!isUsable(annotationSelection)) return ;
        if(!isUsable(rendition)) return ;
        if(!isUsable(bookMeta)) return ;
        rendition.annotations.add(
            "highlight",
            annotationSelection.cfiRange,
            {},
            ()=>{},
            "",
            {"fill": color, "fill-opacity": "0.35", "mix-blend-mode": "multiply"}
        );
        addAnnotaion({...annotationSelection,color});
    }

    const addAnnotaion = (annotation) => {
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const bookKey = `${bookMeta.id}:annotations`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        window.localStorage.setItem(bookKey,JSON.stringify([...stored,annotation]))
    }

    const updateAnnotation = () => {
        if(!isUsable(rendition)) return "";
        if(!isUsable(bookMeta)) return "";
        const bookKey = `${bookMeta.id}:annotations`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        console.log(stored);
        stored.forEach((item)=>{
            rendition.annotations.add(
                "highlight",
                item.cfiRange,
                {},
                ()=>{},
                "",
                {"fill": item.color, "fill-opacity": "0.35", "mix-blend-mode": "multiply"}
            );
        })
    }

    return (
        <div className="reader">
            <div className="reader__header">
                <div className="reader__header__left">
                    <IconButton icon={<ChevronLeftIcon stroke="currentColor" />} onClick={()=>{navigate(-1)}}/>
                    <ReadTimer bookMeta={bookMeta}/>
                    {/* <button onClick={()=>{
                        console.log(rendition);
                    }}>Debug</button> */}
                </div>
                <div className="reader__header__center">
                <div className="reader__header__center__title">{bookMeta.title||"Untitled"}</div>
                </div> 
                <div className="reader__header__right">
                    <IconButton icon={fullscreen?<MinimizeIcon stroke="currentColor"/>:<MaximizeIcon stroke="currentColor"/>} onClick={()=>setFullscreen(s=>!s)}/>

                    <IconButton
                        className={annotaionPanel?"reader__header__right__button--active":""}  
                        icon={<BlockquoteIcon stroke="currentColor"/>} 
                        onClick={()=>{hideAllPanel({annotation:false});setAnnotaionPanel(s=>!s)}}
                    />
                    <SidePanel show={annotaionPanel} position="right">
                        <AnnotationPanel 
                            rendition={rendition} 
                            bookMeta={bookMeta}
                            show={annotaionPanel} 
                            hideModal={()=>{setAnnotaionPanel(false)}}
                            onRemove={()=>{setAnnotaionPanel(false)}}
                        />
                    </SidePanel>

                    <IconButton 
                        className={bookmarkPanel?"reader__header__right__button--active":""} 
                        icon={<BookmarkIcon stroke="currentColor"/>} 
                        onClick={()=>{hideAllPanel({bookmark:false});setBookmarkPanel(s=>!s)}}
                    />
                    <SidePanel show={bookmarkPanel} position="right">
                        <BookMarkPanel 
                            rendition={rendition} 
                            bookMeta={bookMeta}
                            show={bookmarkPanel}
                            onAdd={()=>{
                                updateBookmarkedStatus();
                                setBookmarkPanel(s=>false);
                            }}
                            onRemove={()=>{
                                updateBookmarkedStatus();
                                setBookmarkPanel(s=>false);
                            }}
                            onGoto={()=>setBookmarkPanel(s=>false)}
                        />
                    </SidePanel>

                    <IconButton 
                        className={customizerPanel?"reader__header__right__button--active":""} 
                        icon={<LetterCaseIcon stroke="currentColor"/>} 
                        onClick={()=>{hideAllPanel({customizer:false});setCustomizerPanel(s=>!s)}}
                    />
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
                            handleAnnotationColorSelect(color);
                            setShowContextMenu(false);
                        }} 
                        onClose={()=>{
                            setShowContextMenu(false);
                        }}
                    />
                </div>
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
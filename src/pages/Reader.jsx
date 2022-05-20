import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { isUsable } from "../helpers/functions";
import Epub, { Rendition } from "epubjs";
import Modal from "../components/hoc/Modal/Modal";
import IconButton from "../components/ui/Buttons/IconButton";
import useDebounce from "../hook/useDebounce";

import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark.svg";
import { ReactComponent as BookmarkListIcon } from "../assets/icons/bookmark-list.svg";
import { ReactComponent as ListIcon } from "../assets/icons/list.svg";
import { ReactComponent as ChevronLeftIcon } from "../assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "../assets/icons/chevron-right.svg";
import { ReactComponent as ClockIcon } from "../assets/icons/clock.svg";
import DarkModeSwitch from "../components/ui/DarkModeSwitch/DarkModeSwitch";
import { useSelector } from "react-redux";
import axios from "axios";

const ReaderPage = (props) => {
    const params = useLocation();
    const [bookUrl, setBookUrl] = useState(null);
    const [rendition, setRendition] = useState(null);
    const [isTocModalOpen, setIsTocModalOpen] = useState(false);
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
    const [bookmarkedPages, setBookmarkedPages] = useState([]);
    const [progress, setProgress] = useState(0);
    const DarkModeState = useSelector((state) => state.DarkModeState);
    const [book, setBook] = useState(null);
    const [totalLocations, setTotalLocations] = useState(1);
    const [readTime, setReadTime] = useState(0);

    //############### Load Book ############### */
    useEffect(() => {
        setBookUrl(params.state.book);
    }, [params]);

    useEffect(() => {
        if (!isUsable(bookUrl)) return;
        let book = Epub(bookUrl, { openAs : "epub" }) ;
        book.ready.then(()=>{
            setBook(book);
        })
    }, [bookUrl]);

    useEffect(()=>{
        if (!isUsable(book)) return;
        const bookKey = `${book.key()}:locations` ;
        let stored = localStorage.getItem(bookKey);
        if (stored) {
            book.locations.load(stored);
            setTotalLocations(JSON.parse(stored).length)
            // console.log("Locations Loaded")
        } else {
            book.locations.generate(1650).then(()=>{
                setTotalLocations(book.locations.total);
                localStorage.setItem(bookKey, book.locations.save());
                // console.log("Locations Generated")
            }).catch((err)=>{
                console.error(err);
            });
        }
        document.querySelector("#book__reader").innerHTML = "";
        setRendition(book.renderTo("book__reader", { height: window.innerHeight * 0.8 }));
    },[book])

    useEffect(()=>{
        const updateReadTime = () => {
            const bookKey = `${book.key()}:readtime` ;
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

    },[book])

    const handleResize =  () => {
        updateTheme();
    }

    useEffect(()=>{
        if(!isUsable(rendition)) return ;
        rendition.display();
        rendition.on("relocated", (event)=>{
            setProgress(event.start.location);
            saveLastReadPage(event.start.cfi);
            updateTheme();
        });
        rendition.hooks.content.register(updateTheme);
        window.addEventListener("resize",handleResize);
        return () => {
            window.removeEventListener("resize",handleResize);
        }
    },[rendition]);

    //############### Update Theme ############### */

    const updateTheme = () => {
        if(DarkModeState.darkmode === true){
            rendition.getContents().forEach(c => c.addStylesheetRules({body:{
                "background-color" : "black",
                "color" : "white"
            }}));
            window.document.body.setAttribute("data-theme","dark");
        } else {
            rendition.getContents().forEach(c => c.addStylesheetRules({body:{
                "background-color" : "white",
                "color" : "black"
            }}));
            window.document.body.setAttribute("data-theme","default");
        }
    };

    useEffect(()=>{
        if(!isUsable(rendition)) return ;
        updateTheme();
    },[rendition,DarkModeState])

    //############### Manage Last Read ############### */
    const saveLastReadPage = (cfi) => {
        if (!isUsable(window.localStorage)) return;
        // todo move saving to server
        // todo replace key with tokenId of the book
        let history = JSON.parse(localStorage.getItem("book_history"));
        localStorage.setItem("book_history", JSON.stringify({ ...history, [bookUrl]: cfi }));
    };

    // todo move loading to server
    useEffect(() => {
        if (!window.localStorage) return;
        if (!bookUrl) return;
        let history = JSON.parse(localStorage.getItem("book_history"));
        if (!isUsable(history)) return;
        if (!isUsable(rendition)) return;
        if (history[bookUrl]) {
            rendition.display(history[bookUrl]);
        }
    }, [bookUrl, rendition]); 

    //############### Book Navigation ############### */

    const docPrevPageHandler = () => {
        if (!rendition) return;
        rendition.prev();
    };

    const docNextPageHandler = () => {
        if (!rendition) return;
        rendition.next();
    };

    const openLink = (href) => {
        if (!isUsable(rendition)) return;
        if (!isUsable(href)) return;
        rendition.display(href);
        toggleTocModal(false);
    };

    // todo move it to redux store
    const bookmarkCurrentPage = () => {
        if (!isUsable(rendition)) return;
        let cfiToBookmark = rendition.currentLocation();
        let some = bookmarkedPages.some((c) => c.start.cfi === cfiToBookmark.start.cfi);
        if (some) {
            setBookmarkedPages((s) => s.filter((item) => item.start.cfi !== cfiToBookmark.start.cfi));
        } else {
            setBookmarkedPages((s) => [...s, cfiToBookmark]);
        }

        // todo save it to server using api
    };

    //############### TOC ############### */

    const toggleTocModal = (state = "state_sentinel") => {
        if (state === "state_sentinel") setIsTocModalOpen((s) => !s);
        else setIsTocModalOpen(state);
    };

    const renderTocItems = () => {
        if (!isUsable(rendition)) return;
        const domItems = [];
        rendition?.book?.navigation?.toc?.forEach((item) => {
            domItems.push(
                <li
                    key={item.id}
                    className="list__item"
                    onClick={() => {
                        openLink(item.href);
                    }}
                >
                    {item.label}
                </li>
            );
        });
        return <ul className="list">{domItems}</ul>;
    };

    //############### Bookmark ############### */

    const toggleBookmarkModal = (state = "state_sentinel") => {
        if (state === "state_sentinel") setIsBookmarkModalOpen((s) => !s);
        else setIsBookmarkModalOpen(state);
    };

    const renderBookmarkItems = () => {
        if (!isUsable(rendition)) return;
        const domItems = [];
        bookmarkedPages.forEach((item) => {
            const spine = rendition.book.spine.get(item.start.cfi);
            const brief = spine.contents.innerText.trim().slice(0, 50) + "...";
            domItems.push(
                <li
                    key={item?.start?.cfi}
                    className="list__item"
                    onClick={() => {
                        openLink(item.start.cfi);
                    }}
                >
                    {brief}
                </li>
            );
        });
        return <ul className="list">{domItems}</ul>;
    };

    //############ handles page progress ############# */
    const debouncedProgress = useDebounce(progress, 300);

    useEffect(() => {
        if(!isUsable(rendition)) return ;
        // console.log(debouncedProgress,debouncedProgress/totalLocations);
        rendition.display(book.locations.cfiFromLocation(debouncedProgress));
    }, [debouncedProgress]);

    const handlePageUpdate = (e) => {
        setProgress(e.target.value);
    };

    var toHHMMSS = (secs) => {
        var sec_num = parseInt(secs, 10)
        var hours   = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60
    
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    }

    return (
        <div className="reader">
            <div className="reader__header">
                <div className="reader__header__readtime">
                    <ClockIcon width={16} height={16} stroke="currentColor" />
                    {toHHMMSS(readTime)}
                </div>
                <div className="reader__header__spacer"></div>
                <DarkModeSwitch />
                <IconButton icon={<BookmarkIcon />} onClick={() => bookmarkCurrentPage()} />
                <IconButton icon={<BookmarkListIcon />} onClick={() => toggleBookmarkModal()} />
                <IconButton icon={<ListIcon />} onClick={() => toggleTocModal()} />
            </div>
            <div className="reader__book">
                <div className="reader__book__prev-btn" onClick={docPrevPageHandler}>
                    <ChevronLeftIcon stroke="currentColor" />
                </div>
                <div id="book__reader" className="reader__book__content"></div>
                <div className="reader__book__next-btn" onClick={docNextPageHandler}>
                    <ChevronRightIcon stroke="currentColor" />
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
                <div className="reader__nav__progress-value">{progress}/{totalLocations}</div>
            </nav>

            <Modal title="Bookmarks" open={isBookmarkModalOpen} toggleModal={toggleBookmarkModal}>
                {renderBookmarkItems()}
            </Modal>
            <Modal title="Table of Contents" open={isTocModalOpen} toggleModal={toggleTocModal}>
                {renderTocItems()}
            </Modal>
        </div>
    );
};

export default ReaderPage;

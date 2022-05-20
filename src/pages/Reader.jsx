import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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
import DarkModeSwitch from "../components/ui/DarkModeSwitch/DarkModeSwitch";
import axios from "axios";
import { hideSpinner, showSpinner } from '../store/actions/spinner'

const ReaderPage = (props) => {

	const dispatch = useDispatch()

    const params = useLocation();

	const [Loading, setLoading] = useState(false)
    const [bookUrl, setBookUrl] = useState(null);
    const [rendition, setRendition] = useState(null);
    const [isTocModalOpen, setIsTocModalOpen] = useState(false);
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
    const [bookmarkedPages, setBookmarkedPages] = useState([]);
    const [progress, setProgress] = useState(0);
    const DarkModeState = useSelector((state) => state.DarkModeState);
    const [book, setBook] = useState(null);
    const [totalLocations, setTotalLocations] = useState(1);

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

    //############### Load Book ############### */
    useEffect(() => {
        setBookUrl(params.state.book);
    }, [params]);

    useEffect(() => {
		setLoading(true)
        if (!isUsable(bookUrl)) return;
        let book = Epub(bookUrl, { openAs : "epub" }) ;
        book.ready.then(()=>{
            setBook(book);
			setLoading(false)
        })
    }, [bookUrl]);

    useEffect(()=>{
        if (!isUsable(book)) return;
        book.locations.generate(1650).then(()=>{
            setTotalLocations(book.locations.total);
            console.log(book.locations)
        }).catch((err)=>{
            console.error(err);
        });
        document.querySelector("#book__reader").innerHTML = "";
        setRendition(book.renderTo("book__reader", { height: window.innerHeight * 0.8 }));
    },[book])

    useEffect(()=>{
        console.log(rendition?.book?.locations?.length());
    },[rendition])
    
    // BUG : Appends multiple book reader containers
    // useEffect(()=>{
    //     if (!isUsable(rendition)) return;
    //     if (!isUsable(book)) return;
    //     document.querySelector("#book__reader").innerHTML = "";
    //     book.renderTo("book__reader", { height: window.innerHeight * 0.8 });
    // },[book,rendition]) 
    
    useEffect(()=>{
        if(!isUsable(rendition)) return ;
        rendition.display();
        rendition.themes.register({
            "darkmode" : {body: { background: "black", color: "#fff" }},
            "lightmode": {body: { background: "white", color: "#000" }}
        });
        console.log(rendition);
        rendition.on("relocated", (event)=>{
            setProgress(event.start.location);
        });

        return ()=>{

        }
    },[rendition]);

    //############### Update Theme ############### */

    // useEffect(()=>{
    //     if(!isUsable(rendition)) return ;
    //     console.log(DarkModeState);
    //     if(DarkModeState.darkmode === true){
    //         rendition.getContents().forEach(c => c.addStylesheetRules({body:{
    //             "background-color" : "black",
    //             "color" : "white"
    //         }}));
    //     } else {
    //         rendition.getContents().forEach(c => c.addStylesheetRules({body:{
    //             "background-color" : "white",
    //             "color" : "black"
    //         }}));
    //     }
    // },[rendition,DarkModeState,progress])

    // useEffect(() => {
    //     if(!isUsable(rendition)) return ;
    //     if(darkMode===true)
    //         rendition.themes.select("darkmode");
    //     else 
    //         rendition.themes.select("lightmode");
    // }, [rendition,darkMode]);

    // const toggleDarkMode = () => {
    //     if(!isUsable(rendition)) return ;
    //     setDarkMode(s => !s);
    // }

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
        saveLastReadPage(href);
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

    return (
        <div className="reader">
            <div className="reader__header">
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

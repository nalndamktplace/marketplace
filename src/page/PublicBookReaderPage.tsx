import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/constant";
import { isFilled, isUsable } from "../utils/getUrls";
import { useAccount } from "wagmi";
import Epub, { EpubCFI } from "epubjs";
import { useDispatch } from "react-redux";
import { hideSpinner, showSpinner } from "../store/slice/spinnerManageReducer";
import { message } from "antd";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";
import ReadTime from "../components/ReadTime";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { IoBookmarkOutline, IoListOutline } from "react-icons/io5";
import { BsBlockquoteRight } from "react-icons/bs";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import RangeSlider from "../components/RangeSlider";
import SideDrawer from "../components/SideDrawer";
import TocPanel from "../components/TocPanel";
import AnnotationPanel from "../components/Annotation/AnnotationPanel";
import QuotePanel from "../components/quote/QuotePanel";
import Customizer from "../components/Customizer";
import { ReaderBaseTheme } from "../config/readerTheme";
import AnnotationContextMenu from "../components/Annotation/AnnotationContextMenu";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PublicBookReaderPage() {
  const { address } = useAccount();
  const params = useLocation();

  const addAnnotationRef = useRef<any>(null);
  const addQuotesRef: any = useRef();
  const seeking = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [readTime, setReadTime] = useState(0);
  const [Preview, setPreview] = useState<boolean | null>(null);
  const [Loading, setLoading] = useState(false);
  const [bookMeta, setBookMeta] = useState<any>({});
  const [progress, setProgress] = useState(0);
  const [rendition, setRendition] = useState<any>();
  const [fullscreen, setFullscreen] = useState(false);
  const [annotaionPanel, setAnnotaionPanel] = useState<boolean>(false);
  const [quotePanel, setQuotePanel] = useState(false);
  const [pageBookmarked, setPageBookmarked] = useState<any>(false);
  const [totalLocations, setTotalLocations] = useState(0);
  const [customizerPanel, setCustomizerPanel] = useState(false);
  const [tocPanel, setTocPanel] = useState(false);
  const [WalletAddress, setWalletAddress] = useState<string | undefined>();
  const [showUI, setShowUI] = useState(true);
  const [annotationSelection, setAnnotationSelection] = useState({});
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [_, setDiscCount] = useState("");
  const [currentLocationCFI, setCurrentLocationCFI] = useState("");
  const [timerUpdate, setTimerUpdate] = useState(true);
  const debouncedProgress = useDebounce(progress, 300);

  // const BOOK_URL = BASE_URL + "/files/" + params.state?.book.preview;

  useEffect(() => setWalletAddress(address), []);
  // Save Last read Page
  const saveLastReadPage = useCallback(
    (cfi: any) => {
      if (!isUsable(window.localStorage)) return;
      if (!isUsable(bookMeta)) return;
      const bookKey = `${bookMeta?.id}:lastread`;

      if (cfi) {
        localStorage.setItem(bookKey, cfi);
      }
    },
    [bookMeta]
  );

  // Check  Current Page is Bookmarked
  const isCurrentPageBookmarked = useCallback(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(bookMeta)) return;
    const bookKey = `${bookMeta.id}:bookmarks`;
    const item: any = window.localStorage.getItem(bookKey);
    if (!isFilled(item)) return false;
    const stored = JSON.parse(item) || {};
    const epubcfi = new EpubCFI();
    const current = rendition.currentLocation();
    try {
      if (epubcfi.compare(stored.cfi, current.start.cfi) === 0) return true;
      if (epubcfi.compare(stored.cfi, current.end.cfi) === 0) return true;
      if (
        epubcfi.compare(stored.cfi, current.start.cfi) === 1 &&
        epubcfi.compare(stored.cfi, current.end.cfi) === -1
      )
        return true;
      return false;
    } catch (err) {
      return false;
    }
  }, [bookMeta, rendition]);

  const updateBookmarkedStatus = useCallback(() => {
    const pageBookmarked = isCurrentPageBookmarked();
    setPageBookmarked(pageBookmarked);
  }, [isCurrentPageBookmarked]);

  const hideAllPanel = useCallback(
    ({
      customizer = true,
      annotation = true,
      quote = true,
      toc = true,
    } = {}) => {
      customizer && setCustomizerPanel(false);
      annotation && setAnnotaionPanel(false);
      quote && setQuotePanel(false);
      toc && setTocPanel(false);
    },
    []
  );

  useEffect(() => {
    if (fullscreen === true) {
      openFullscreen();
    } else {
      closeFullscreen();
    }
  }, [fullscreen]);

  useEffect(() => {
    if (Loading) dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [Loading, dispatch]);

  useEffect(() => {
    hideAllPanel();
  }, [showUI, hideAllPanel]);

  useEffect(() => {
    setLoading(true);
    let bookURL = null;
    const navParams = params.state;
    if (isUsable(navParams?.preview) && navParams.preview === true) {
      bookURL = BASE_URL + "/files/" + navParams.book.preview;
      setPreview(false);
    } else {
      bookURL = navParams?.book?.url;
      setPreview(false);
    }
    try {
      const book: any = Epub(bookURL, { openAs: "epub" });

      book.ready
        .then(() => {
          const elm = document.querySelector("#book__reader");
          if (elm) elm.innerHTML = "";
          const _rendition = book.renderTo("book__reader", {
            width: "100%",
            height: "100%",
            manager: "continuous",
            flow: "paginated",
            snap: "true",
            gap: 40,
            allowScriptedContent: true,
          });

          _rendition.themes.default(ReaderBaseTheme);
          _rendition.display();
          setRendition(_rendition);
          setLoading(false);
        })
        .catch(() => {
          message.error("Error while loading book.");
          setLoading(false);
        });
      setBookMeta(navParams.book);
    } catch (err) {
      message.error("Error while loading book.");
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    const handleResize = () => {
      rendition.manager.resize("100%", "100%");
    };
    const handleFullscreen = () => {
      if (isUsable(window.document.fullscreenElement)) {
        setFullscreen(true);
      } else {
        setFullscreen(false);
      }
      handleResize();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("fullscreenchange", handleFullscreen);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, [rendition]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(currentLocationCFI) && !isFilled(currentLocationCFI)) return;
    rendition.book.loaded.navigation.then(function () {
      const locationCfi = currentLocationCFI;
      const spineItem = rendition.book.spine.get(locationCfi);
      if (!isUsable(spineItem)) return;
      const navItem = rendition.book.navigation.get(spineItem.href);
      setChapterName(navItem?.label?.trim() || "");
    });
  }, [rendition, currentLocationCFI]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(bookMeta)) return;
    const handleRelocated = (event: any) => {
      updateBookmarkedStatus();
      setProgress(event.start.location);
      saveLastReadPage(event.start.cfi);
      setCurrentLocationCFI(event.start.cfi);
    };
    const handleClick = () => {
      setShowUI((s) => !s);
    };
    const handleKeyUp = (e: any) => {
      if (e.key === "ArrowLeft" || (e.keyCode || e.which) === 37) {
        rendition.prev();
      }
      if (e.key === "ArrowRight" || (e.keyCode || e.which) === 39) {
        rendition.next();
      }
    };
    rendition.on("relocated", handleRelocated);
    rendition.on("click", handleClick);
    rendition.on("keyup", handleKeyUp);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      rendition.off("relocated", handleRelocated);
      rendition.off("click", handleClick);
      rendition.off("keyup", handleKeyUp);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    rendition,
    bookMeta,
    updateBookmarkedStatus,
    saveLastReadPage,
    setCurrentLocationCFI,
  ]);
  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(bookMeta)) return;
    const bookKey = `${bookMeta.id}:locations`;
    const stored = localStorage.getItem(bookKey);
    if (stored) {
      rendition.book.locations.load(stored);
      setTotalLocations(JSON.parse(stored).length);
    } else {
      rendition.book.locations
        .generate()
        .then(() => {
          setTotalLocations(rendition.book.locations.total);
          localStorage.setItem(bookKey, rendition.book.locations.save());
        })
        .catch((err: any) => {
          message.error(err.message);
        });
    }
  }, [rendition, bookMeta]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (seeking.current === true) {
      rendition.display(
        rendition.book.locations.cfiFromLocation(debouncedProgress)
      );
      seeking.current = false;
    }
  }, [debouncedProgress, rendition, seeking]);

  useEffect(() => {
    if (!isUsable(window.localStorage)) return;
    if (!isUsable(bookMeta)) return;
    if (!isUsable(rendition)) return;
    const bookKey = `${bookMeta.id}:lastread`;
    const lastPageCfi = localStorage.getItem(bookKey);
    if (isUsable(lastPageCfi)) {
      rendition.display(lastPageCfi);
    }
  }, [bookMeta, rendition]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(bookMeta)) return;
    const handleSelected = (cfiRange: any) => {
      rendition.book
        .getRange(cfiRange)
        .then((range: any) => {
          setAnnotationSelection({ cfiRange, text: range?.toString() });
          setShowContextMenu(true);
          setShowContextMenu(true);
        })
        .catch(() => {
          setAnnotationSelection({});
        });
    };

    rendition.on("selected", handleSelected);

    return () => {
      rendition.off("selected", handleSelected);
    };
  }, [rendition, bookMeta]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(bookMeta)) return;
    const handleMarkClicked = () => {
      setAnnotaionPanel(true);
    };
    rendition.on("markClicked", handleMarkClicked);
    return () => {
      rendition.off("markClicked", handleMarkClicked);
    };
  }, [rendition, bookMeta]);

  const handlePageUpdate = (e: any) => {
    startTimer();
    seeking.current = true;
    setProgress(e.target.value);
  };

  const openFullscreen = () => {
    startTimer();
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

  const closeFullscreen = () => {
    startTimer();
    if (!document.fullscreenElement) return;
    if (document.exitFullscreen) document.exitFullscreen();
    // else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    // else if (document.msExitFullscreen) document.msExitFullscreen();
    else if (document.exitFullscreen() as any) document.exitFullscreen();
    else if (document.exitFullscreen() as any) document.exitFullscreen();
  };

  const handleAnnotationColorSelect = (color: any) => {
    startTimer();
    if (!isUsable(annotationSelection)) return;
    if (!isUsable(rendition)) return;
    if (!isUsable(bookMeta)) return;

    if (
      isUsable(addAnnotationRef.current)
      // typeof addAnnotationRef.current === "function"
    ) {
      addAnnotationRef.current({ ...annotationSelection, color });
    } else {
      console.error("addAnnotationRef.current is not a callable function");
    }
  };

  const addBookMark = () => {
    if (
      isUsable(!Preview) &&
      !Preview &&
      isUsable(bookMeta) &&
      isUsable(WalletAddress)
    ) {
      if (!isUsable(rendition)) return;
      if (!isUsable(bookMeta)) return;
      setLoading(true);
      const newBookmark = {
        cfi: rendition.currentLocation().start.cfi,
        percent: rendition.currentLocation().start.percentage,
      };
      axios({
        url: `${BASE_URL}/api/reader/bookmarks`,
        method: "POST",
        data: {
          bookAddress: bookMeta.book_address,
          ownerAddress: WalletAddress,
          bookmarks: JSON.stringify(newBookmark),
        },
      })
        .then((res) => {
          if (res.status === 200) {
            const bookKey = `${bookMeta.id}:bookmarks`;
            localStorage.setItem(bookKey, JSON.stringify(newBookmark));
            updateBookmarkedStatus();
          } else message.error("Something went wrong");
        })
        .catch(() => {
          message.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  };

  const removeBookMark = () => {
    if (
      isUsable(!Preview) &&
      !Preview &&
      isUsable(bookMeta) &&
      isUsable(WalletAddress)
    ) {
      if (!isUsable(rendition)) return;
      if (!isUsable(bookMeta)) return;
      setLoading(true);
      axios({
        url: `${BASE_URL}/api/reader/bookmarks`,
        method: "POST",
        data: {
          bookAddress: bookMeta.book_address,
          ownerAddress: WalletAddress,
          bookmarks: "",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            const bookKey = `${bookMeta.id}:bookmarks`;
            localStorage.setItem(bookKey, "");
            updateBookmarkedStatus();
          } else message.error("Something went wrong");
        })
        .catch(() => {
          message.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  };

  const toggleBookMark = () => {
    startTimer();
    if (isCurrentPageBookmarked() === true) removeBookMark();
    else addBookMark();
  };

  useEffect(() => {
    if (!isUsable(bookMeta) && !isUsable(WalletAddress)) return;
    const updateReadTime = () => {
      setReadTime((s) => s + 1);
    };
    const intervalHandler = setInterval(updateReadTime, 1000);
    return () => {
      clearInterval(intervalHandler);
    };
  }, [bookMeta, WalletAddress]);

  useEffect(() => {
    function resetTimer() {
      if (readTime >= 1000) {
        setTimerUpdate(false);
        setReadTime(0);
      }
    }
    resetTimer();
  }, []);

  function startTimer() {
    setTimerUpdate(true);
    setReadTime(0);
  }

  return (
    <div className="max-w-full mx-auto text-black">
      <div className="flex items-center justify-between p-4 px-10 text-gray-500 ">
        <div className="flex items-center text-gray-500 gap-x-2">
          <MdOutlineArrowBackIos size={22} onClick={() => navigate(-1)} />
          {rendition && (
            <ReadTime
              timerUpdate={timerUpdate}
              preview={Preview}
              bookMeta={bookMeta}
              mobileView={rendition}
            />
          )}
        </div>
        <div className="">{bookMeta.title || "Untitled"}</div>
        <div className="flex items-center text-gray-500 rounded-md gap-x-5">
          <span
            className="flex items-center p-2 cursor-pointer hover:bg-slate-50"
            onClick={() => setFullscreen((s) => !s)}
          >
            {fullscreen ? <LuMinimize size={22} /> : <LuMaximize size={22} />}
          </span>
          <span
            className={`p-2 rounded-sm cursor-pointer hover:bg-slate-50 ${
              tocPanel ? "bg-slate-50" : ""
            }`}
          >
            <IoListOutline
              onClick={() => {
                hideAllPanel({ toc: false });
                setTocPanel((s) => !s);
                startTimer();
              }}
              className="cursor-pointer"
              size={22}
            />
          </span>
          <span
            className={`p-2 rounded-sm cursor-pointer hover:bg-slate-50 ${
              quotePanel ? "bg-slate-50" : ""
            }`}
          >
            <BsBlockquoteRight
              onClick={() => {
                hideAllPanel({ annotation: false });
                setAnnotaionPanel((s) => !s);
                startTimer();
              }}
              className="cursor-pointer "
              size={22}
            />
          </span>
          <span
            className={`p-2 rounded-sm cursor-pointer hover:bg-slate-50 ${
              pageBookmarked ? "bg-slate-50" : ""
            }`}
          >
            <IoBookmarkOutline onClick={toggleBookMark} size={22} />
          </span>

          <span
            className={`p-2 rounded-sm cursor-pointer hover:bg-slate-50 ${
              customizerPanel ? "bg-slate-50" : ""
            }`}
          >
            <RxLetterCaseCapitalize
              size={22}
              onClick={() => {
                hideAllPanel({ customizer: false });
                setCustomizerPanel((s) => !s);
                startTimer();
              }}
            />
          </span>
        </div>
      </div>
      {/* // SidePanel */}
      {!Preview && (
        <div
          id="demoensandknaskld"
          className={
            showContextMenu
              ? "fixed top-1/2 right-1/2 z-10 transform  scale-100  opacity-100 "
              : "fixed top-1/2 transform  scale-0  opacity-0 "
          }
        >
          <AnnotationContextMenu
            onColorSelect={(color: any) => {
              handleAnnotationColorSelect(color);
              setShowContextMenu(false);
            }}
            rendition={rendition}
            onClose={() => setShowContextMenu(false)}
          />
        </div>
      )}
      <>
        <SideDrawer
          show={tocPanel}
          setShow={setTocPanel}
          position="right"
          title="Table of Content"
        >
          <TocPanel
            onSelect={() => {
              hideAllPanel({ toc: false });
              setTocPanel(false);
            }}
            rendition={rendition}
          />
        </SideDrawer>
        <SideDrawer
          show={annotaionPanel}
          setShow={setAnnotaionPanel}
          position="right"
          title="Annotations"
        >
          <AnnotationPanel
            preview={Preview}
            rendition={rendition}
            bookMeta={bookMeta}
            show={annotaionPanel}
            addAnnotationRef={addAnnotationRef}
            hideModal={() => {
              setAnnotaionPanel(false);
              startTimer();
            }}
            onRemove={() => {
              setAnnotaionPanel(false);
            }}
          />
        </SideDrawer>
        <SideDrawer
          show={quotePanel}
          setShow={setQuotePanel}
          position="right"
          title="Discussions"
        >
          <QuotePanel
            setDiscCount={setDiscCount}
            preview={Preview}
            rendition={rendition}
            bookMeta={bookMeta}
            show={quotePanel}
            addQuotesRef={addQuotesRef}
            hideModal={() => {
              setQuotePanel(false);
            }}
          />
        </SideDrawer>
        <SideDrawer
          show={customizerPanel}
          setShow={setCustomizerPanel}
          position="right"
          title="Preferences"
        >
          <Customizer initialFontSize={100} rendition={rendition} />
        </SideDrawer>
      </>
      {/* //Book PDF */}
      <div className="relative flex ">
        <FaChevronLeft
          className="absolute left-0 z-10 text-xl text-gray-300 cursor-pointer top-1/2"
          size={43}
          onClick={() => {
            rendition.prev();
            startTimer();
          }}
        />

        <div id="book__reader" className="w-full h-[80vh] px-10"></div>
        <FaChevronRight
          className="absolute right-0 z-10 text-xl text-gray-300 cursor-pointer top-1/2"
          size={43}
          onClick={() => {
            rendition.next();
            startTimer();
          }}
        />
      </div>
      <div className="px-10">
        <div className="flex items-center justify-between">
          <div>{chapterName || bookMeta.title || ""}</div>
          <div>
            {Math.floor((debouncedProgress * 100) / totalLocations) || "0"}%
          </div>
        </div>
        <RangeSlider
          value={progress}
          onChange={handlePageUpdate}
          max={totalLocations}
        />
      </div>
    </div>
  );
}

export default PublicBookReaderPage;

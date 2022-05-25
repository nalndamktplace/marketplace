import { useState } from "react";
import { isUsable } from "../../../helpers/functions";
import {ReactComponent as TrashIcon} from "../../../assets/icons/trash-icon.svg";

const BookMarkPanel = ({rendition,bookMeta,onAdd=()=>{},onRemove=()=>{},onGoto=()=>{}}) => {

    const [bookmarkTitle, setBookmarkTitle] = useState("");

    const renderBookmarkedItems = () => {
        let domItems = [] ;
        if(!isUsable(rendition)) return "";
        if(!isUsable(bookMeta)) return "";
        const bookKey = `${bookMeta.id}:bookmarks`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        stored.forEach((item,i)=>{
            domItems.push(
                <div key={i} className="bookmark-panel__container__item" onClick={()=>gotoBookmarkedPage(`${item.cfi}`)}>
                    <div className="bookmark-panel__container__item__name">{item.title}</div>
                    <div className="bookmark-panel__container__item__location">
                        {Math.floor(item.percent*100)||"-"}%
                    </div>
                    <div className="bookmark-panel__container__item__delete" onClick={(e)=>{e.stopPropagation();removeBookMark(i)}}>
                        <TrashIcon strokeWidth={2} width={24} height={24}  stroke="currentColor"/>
                    </div>
                </div>
            )
        })
        if(domItems.length===0)
            domItems.push(<div key="empty" className="bookmark-panel__container__empty">No Items</div>);
        return domItems;
    }

    const addBookMark = () => {
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const bookKey = `${bookMeta.id}:bookmarks`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        window.localStorage.setItem(bookKey,JSON.stringify([...stored,{
            title : bookmarkTitle || "Untitled",
            cfi : rendition.currentLocation().start.cfi,
            percent : rendition.currentLocation().start.percentage
        }]))
        setBookmarkTitle("");
        onAdd();
    }

    const removeBookMark = (itemIndex) => {
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        const bookKey = `${bookMeta.id}:bookmarks`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        stored = stored.filter((item,i) => i != itemIndex );
        window.localStorage.setItem(bookKey,JSON.stringify(stored))
        setBookmarkTitle("");
        onRemove();
    }

    const gotoBookmarkedPage = (cfi) => {
        if(!isUsable(rendition)) return;
        rendition.display(cfi);
        rendition.display(cfi);
        onGoto();
    }

    return (
        <div className="bookmark-panel">
            <div className="bookmark-panel__title">Add Bookmark</div>
            <div className="bookmark-panel__add">
                <input 
                    className="bookmark-panel__add__input"
                    value={bookmarkTitle}
                    onChange={(e)=>setBookmarkTitle(e.target.value)}
                    placeholder="Enter Title for Bookmark"
                />
                <button 
                    className="bookmark-panel__add__button"
                    onClick={addBookMark} 
                >
                    Add
                </button>
            </div>
            <div className="bookmark-panel__title">
                Bookmarked Pages
            </div>
            <div className="bookmark-panel__container">
                {renderBookmarkedItems()}
            </div>
        </div>
    );
};

export default BookMarkPanel;

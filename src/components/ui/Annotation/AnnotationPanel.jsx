import { useState } from "react";
import { isUsable } from "../../../helpers/functions";
import {ReactComponent as TrashIcon} from "../../../assets/icons/trash-icon.svg";

const AnnotationPanel = ({rendition,bookMeta,onRemove=()=>{},hideModal=()=>{}}) => {

    const renderAnnotationItems = () => {
        let domItems = [] ;
        if(!isUsable(rendition)) return "";
        if(!isUsable(bookMeta)) return "";
        const bookKey = `${bookMeta.id}:annotations`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        // console.log(stored);
        stored.forEach((item,i)=>{
            domItems.push(
                <div key={i} className="annotation-panel__container__item" onClick={()=>gotoPage(item.cfiRange)}>
                    <div className="annotation-panel__container__item__color" style={{backgroundColor:item.color}}></div>
                    <div className="annotation-panel__container__item__name">{item.text}</div>
                    <div className="annotation-panel__container__item__delete" onClick={(e)=>{e.stopPropagation();removeAnnotation(i,item)}}>
                        <TrashIcon strokeWidth={2} width={24} height={24}  stroke="currentColor"/>
                    </div>
                </div>
            )
        })
        if(domItems.length===0)
            domItems.push(<div key="empty" className="bookmark-panel__container__empty">No Items</div>);
        return domItems;
    }

    const removeAnnotation = (itemIndex,item) => {
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        rendition.annotations.remove(item.cfiRange,"highlight");
        const bookKey = `${bookMeta.id}:annotations`
        let stored = JSON.parse(window.localStorage.getItem(bookKey)) || [];
        stored = stored.filter((item,i) => i != itemIndex );
        window.localStorage.setItem(bookKey,JSON.stringify(stored))
        onRemove();
    }

    const gotoPage = (cfi) => {
        if(!isUsable(rendition)) return;
        rendition.display(cfi);
        rendition.display(cfi);
        hideModal();
    }

    return (
        <div className="bookmark-panel">
            <div className="annotation-panel__title">Annotation</div>
            <div className="annotation-panel__container">
                { renderAnnotationItems() }
            </div>
        </div>
    );
};

export default AnnotationPanel;

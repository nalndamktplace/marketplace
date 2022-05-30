import { useEffect, useState } from "react";
import { isUsable } from "../../../helpers/functions";
import {ReactComponent as TrashIcon} from "../../../assets/icons/trash-icon.svg";
import { BASE_URL } from "../../../config/env";
import Contracts from "../../../connections/contracts";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../../store/actions/snackbar";

const AnnotationPanel = ({rendition,bookMeta,addAnnotationRef,onRemove=()=>{},hideModal=()=>{}}) => {

    const [Annotations, setAnnotations] = useState([]);
    const [Wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
		Contracts.Wallet.getWalletAddress().then(res => {
			if(isUsable(res)) setWallet(res)
		}).catch(err =>{
			console.error(err);
		})
	}, [])

    useEffect(() => {
		if(isUsable(bookMeta) && isUsable(Wallet) && isUsable(rendition)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/reader/annotations?bid='+bookMeta.book_address+'&uid='+Wallet,
				method: 'GET'
			}).then(res => {
				if(res.status === 200) {
                    let parsedAnnotations = JSON.parse(res.data.annotations)||[] ;
                    setAnnotations(parsedAnnotations);
                    parsedAnnotations.forEach((item)=>{
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
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [bookMeta, Wallet, dispatch,rendition])

    const renderAnnotationItems = () => {
        let domItems = [] ;
        if(!isUsable(rendition)) return "";
        if(!isUsable(bookMeta)) return "";
        Annotations.forEach((item,i)=>{
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
        let newAnnotations = Annotations.filter((item,i) => i != itemIndex );
        axios({
            url: BASE_URL+'/api/reader/annotations?bid='+bookMeta.book_address+'&uid='+Wallet,
            method: 'POST',
            data: {
                annotations : JSON.stringify(newAnnotations),
            }
        }).then(res => {
            if(res.status === 200) {
                setAnnotations(newAnnotations);
                rendition.annotations.remove(item.cfiRange,"highlight");
                onRemove();
            } 
            else dispatch(setSnackbar('NOT200'))
        }).catch(err => {
            dispatch(setSnackbar('ERROR'))
        }).finally(() => setLoading(false))
    }

    const gotoPage = (cfi) => {
        if(!isUsable(rendition)) return;
        rendition.display(cfi);
        rendition.display(cfi);
        hideModal();
    }

    const addAnnotaion = (annotation) => {
        if(!isUsable(rendition)) return;
        if(!isUsable(bookMeta)) return;
        let newAnnotations = [...Annotations,annotation];
        axios({
            url: BASE_URL+'/api/reader/annotations?bid='+bookMeta.book_address+'&uid='+Wallet,
            method: 'POST',
            data: {
                annotations : JSON.stringify(newAnnotations),
            }
        }).then(res => {
            if(res.status === 200) {
                setAnnotations(newAnnotations);
                rendition.annotations.add(
                    "highlight",
                    annotation.cfiRange,
                    {},
                    ()=>{},
                    "",
                    {"fill": annotation.color, "fill-opacity": "0.35", "mix-blend-mode": "multiply"}
                );
            } 
            else dispatch(setSnackbar('NOT200'))
        }).catch(err => {
            dispatch(setSnackbar('ERROR'))
        }).finally(() => setLoading(false))
    }

    useEffect(()=>{
        addAnnotationRef.current = addAnnotaion ;
    },[addAnnotationRef,addAnnotaion]);

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

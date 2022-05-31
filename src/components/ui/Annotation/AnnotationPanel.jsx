import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

import { isUsable } from "../../../helpers/functions";
import { setSnackbar } from "../../../store/actions/snackbar";
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'

import {ReactComponent as TrashIcon} from "../../../assets/icons/trash-icon.svg";

import { BASE_URL } from "../../../config/env";

const AnnotationPanel = ({preview,rendition,bookMeta,addAnnotationRef,onRemove=()=>{},hideModal=()=>{}}) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state => state.WalletState)

	const [WalletAddress, setWalletAddress] = useState(null);
	const [Loading, setLoading] = useState(false);
	const [Annotations, setAnnotations] = useState([]);

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(isUsable(preview) && !preview){
			if(isUsable(WalletState.wallet)) setWalletAddress(WalletState.wallet)
			else navigate(-1)
		}
	}, [WalletState, navigate, preview])

	useEffect(() => {
		if(isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/reader/annotations',
				method: 'GET',
				params: {
					bid: bookMeta.book_address,
					uid: WalletAddress
				}
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
	}, [bookMeta, WalletAddress, dispatch, rendition, preview])

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
						<TrashIcon strokeWidth={2} width={24} height={24} stroke="currentColor"/>
					</div>
				</div>
			)
		})
		if(domItems.length===0) domItems.push(<div key="empty" className="bookmark-panel__container__empty">No Items</div>);
		return domItems;
	}

	const removeAnnotation = (itemIndex,item) => {
		if(isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition)){
			if(!isUsable(rendition)) return;
			if(!isUsable(bookMeta)) return;
			setLoading(true)
			let newAnnotations = Annotations.filter((item,i) => i != itemIndex );
			axios({
				url: BASE_URL+'/api/reader/annotations',
				method: 'POST',
				data: {
					bid: bookMeta.book_address,
					uid: WalletAddress,
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
	}

	const gotoPage = (cfi) => {
		if(!isUsable(rendition)) return;
		rendition.display(cfi);
		rendition.display(cfi);
		hideModal();
	}

	const addAnnotaion = useCallback(
		(annotation) => {
			if(isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition)){
				if(!isUsable(rendition)) return;
				if(!isUsable(bookMeta)) return;
				setLoading(true)
				let newAnnotations = [...Annotations,annotation];
				axios({
					url: BASE_URL+'/api/reader/annotations',
					method: 'POST',
					data: {
						bid: bookMeta.book_address,
						uid: WalletAddress,
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
		},
		[Annotations, WalletAddress, bookMeta, dispatch, rendition, preview],
	)

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

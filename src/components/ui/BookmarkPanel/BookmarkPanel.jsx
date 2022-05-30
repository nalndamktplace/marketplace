import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import Contracts from "../../../connections/contracts";

import { isUsable } from "../../../helpers/functions";
import { setSnackbar } from "../../../store/actions/snackbar";
import { hideSpinner, showSpinner } from "../../../store/actions/spinner";

import { BASE_URL } from "../../../config/env";

import {ReactComponent as TrashIcon} from "../../../assets/icons/trash-icon.svg";

const BookMarkPanel = ({rendition,bookMeta,onAdd=()=>{},onRemove=()=>{},onGoto=()=>{}}) => {

	const dispatch = useDispatch();

	const [WalletAddress, setWalletAddress] = useState(null);
	const [Loading, setLoading] = useState(true);
	const [bookmarks, setBookmarks] = useState([]);
	const [bookmarkTitle, setBookmarkTitle] = useState("");

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(isUsable(bookMeta) && isUsable(WalletAddress)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/reader/bookmarks',
				method: 'GET',
				params: {
					bid: bookMeta.book_address,
					uid: WalletAddress
				}
			}).then(res => {
				if(res.status === 200) {
					let parsedBookmarks = JSON.parse(res.data.bookmarks)||[] ;
					setBookmarks(parsedBookmarks);
					const bookKey = `${bookMeta.id}:bookmarks`
					localStorage.setItem(bookKey,JSON.stringify(parsedBookmarks));
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [bookMeta, WalletAddress, dispatch])

	useEffect(() => {
		Contracts.Wallet.getWalletAddress().then(res => {
			if(isUsable(res)) setWalletAddress(res)
		}).catch(err =>{
			console.error(err);
		})
	}, [])

	const renderBookmarkedItems = () => {
		let domItems = [] ;
		if(!isUsable(rendition)) return "";
		if(!isUsable(bookMeta)) return "";
		bookmarks.forEach((item,i)=>{
			domItems.push(
				<div key={i} className="bookmark-panel__container__item" onClick={()=>gotoBookmarkedPage(`${item.cfi}`)}>
					<div className="bookmark-panel__container__item__name">{item.title}</div>
					<div className="bookmark-panel__container__item__location">
						{Math.floor(item.percent*100)||"-"}%
					</div>
					<div className="bookmark-panel__container__item__delete" onClick={(e)=>{e.stopPropagation();removeBookMark(i)}}>
						<TrashIcon strokeWidth={2} width={24} height={24} stroke="currentColor"/>
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
		if(!bookmarkTitle) return;
		setLoading(true)
		let newBookmarks = [...bookmarks,{
			title : bookmarkTitle || "Untitled",
			cfi : rendition.currentLocation().start.cfi,
			percent : rendition.currentLocation().start.percentage
		}];
		axios({
			url: BASE_URL+'/api/reader/bookmarks',
			method: 'POST',
			data: {
				bid: bookMeta.book_address,
				uid: WalletAddress,
				bookmarks: JSON.stringify(newBookmarks),
			}
		}).then(res => {
			if(res.status === 200) {
				setBookmarkTitle("");
				setBookmarks(newBookmarks);
				const bookKey = `${bookMeta.id}:bookmarks`
				localStorage.setItem(bookKey,JSON.stringify(newBookmarks));
				onAdd();
			} 
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			dispatch(setSnackbar('ERROR'))
		}).finally(() => setLoading(false))
	}

	const removeBookMark = (itemIndex) => {
		if(!isUsable(rendition)) return;
		if(!isUsable(bookMeta)) return;
		setLoading(true)
		let newBookmarks = bookmarks.filter((item,i) => i != itemIndex );
		axios({
			url: BASE_URL+'/api/reader/bookmarks',
			method: 'POST',
			data: {
				bid: bookMeta.book_address,
				uid: WalletAddress,
				bookmarks: JSON.stringify(newBookmarks),
			}
		}).then(res => {
			if(res.status === 200) {
				setBookmarkTitle("");
				setBookmarks(newBookmarks);
				const bookKey = `${bookMeta.id}:bookmarks`
				localStorage.setItem(bookKey,JSON.stringify(newBookmarks));
				onRemove();
			} 
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			dispatch(setSnackbar('ERROR'))
		}).finally(() => setLoading(false))
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
				<input className="bookmark-panel__add__input" value={bookmarkTitle} onChange={(e)=>setBookmarkTitle(e.target.value)} placeholder="Enter Title for Bookmark" />
				<button onClick={addBookMark} className="bookmark-panel__add__button">Add</button>
			</div>
			<div className="bookmark-panel__title">Bookmarked Pages</div>
			<div className="bookmark-panel__container">
				{renderBookmarkedItems()}
				{Loading && "Loading..."}
			</div>
		</div>
	);
};

export default BookMarkPanel;

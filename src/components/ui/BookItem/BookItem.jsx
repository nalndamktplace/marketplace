import Stars from "../Stars/Stars"

import {ReactComponent as USDCIcon} from "../../../assets/icons/usdc.svg"

const BookItem = ({book,onBuy=()=>{},onOpen=()=>{},layout="GRID", state = 'show', onRead=()=>{}}) => {
	// todo add CTA case for publisher & owner
	const renderCTA = () => {
		if(book.status === 1)
			switch (state) {
        case 'show':
					return (<div onClick={()=>onOpen()} className='book-item__data__price typo__color--success typo__act utils__d__flex utils__align__center'><USDCIcon width={20} height={20} stroke="currentColor"/>&nbsp;{book.price}</div>)
				case 'publisher':
					return (<div onClick={()=>onRead()} className='book-item__data__price typo__color--success typo__act utils__d__flex utils__align__center'>Approved</div>)
				case 'owned':
					return (<div onClick={()=>onRead()} className='book-item__data__price typo__color--success typo__act utils__d__flex utils__align__center'>Read</div>)
				default:
					return (<div onClick={()=>onOpen()} className='book-item__data__price typo__color--success typo__act utils__d__flex utils__align__center'><USDCIcon width={20} height={20} stroke="currentColor"/>&nbsp;{book.price}</div>)
			}
		else if(book.status === 2) return (<div className='book-item__data__rejected typo__color--danger typo__act utils__d__flex utils__align__center'>Rejected</div>)
		else return (<div className='book-item__data__review typo__color--info typo__act utils__d__flex utils__align__center'>Under Review</div>)
	}

    return (
        <div className='book-item' data-layout={layout}>
            <img className='book-item__cover' onClick={()=>onOpen()} src={book.cover} alt={book.name} />
            <div className="book-item__data">
                <div onClick={()=>onOpen()} className='book-item__data__name typo__head typo__head--6 typo__transform--capital'>{book.title}</div>
                <div onClick={()=>onOpen()} className='book-item__data__author typo__subtitle typo__transform--upper'>{book.author}</div>
                {renderCTA()}
                <Stars rating={book.rating} size={'small'}/>
                <div onClick={()=>onOpen()} className='book-item__data__synopsis typo__body typo__body--2 typo__color--n500'>{book.synopsis.split(" ").slice(0,40).join(" ")}…</div>
            </div>
        </div>
    )
}

export default BookItem

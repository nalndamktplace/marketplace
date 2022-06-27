import Stars from "../Stars/Stars"

import {ReactComponent as USDCIcon} from "../../../assets/icons/usdc-icon.svg"

const BookItem = ({book,onBuy=()=>{},onOpen=()=>{},layout="GRID", state = 'show', onRead=()=>{}}) => {

	const renderCTA = () => {
		if(book.status === 1)
			switch (state) {
				case 'show':
					return (<div className='book-item__data__price typo__body typo__body--2 utils__d__flex utils__align__center'>{book.price}&nbsp;<USDCIcon width={20} height={20} fill="currentColor"/></div>)
				case 'owned':
					return (<div className='book-item__data__price typo__body typo__body--2 utils__d__flex utils__align__center' onClick={()=>onRead()}>Read</div>)
				default:
					return (<div className='book-item__data__price typo__body typo__body--2 utils__d__flex utils__align__center'>{book.price}&nbsp;<USDCIcon width={20} height={20} fill="currentColor"/></div>)
			}
		else return (<div className='book-item__data__review typo__body typo__body--2 utils__d__flex utils__align__center'>Under Review</div>)
	}

    return (
        <div className='book-item' data-layout={layout}>
            <img className='book-item__cover' onClick={onOpen} src={book.cover} alt={book.name} />
            <div className="book-item__data">
                {renderCTA()}
                <div onClick={onOpen} className='book-item__data__price typo__body typo__body--2 utils__d__flex utils__align__center'><USDCIcon width={20} height={20} stroke="currentColor"/>&nbsp;{book.price}</div>
                <div onClick={onOpen} className='book-item__data__name typo__body typo__body--2'>{book.title}</div>
                <div onClick={onOpen} className='book-item__data__author typo__body typo__body--2'>{book.author}</div>
                <div onClick={onOpen} className='book-item__data__synopsis typo__body typo__body--2 typo__color--n500'>{book.synopsis.split(" ").slice(0,40).join(" ")}...</div>
                <Stars rating={book.rating}/>
            </div>
        </div>
    )
}

export default BookItem

import axios from "axios"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useCallback, useEffect, useState } from "react"
import { isUsable } from "../../../helpers/functions"
import { setSnackbar } from "../../../store/actions/snackbar"
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'
import { BASE_URL } from "../../../config/env"
import QuoteSection from "./QuoteSection"
import Button from "../Buttons/Button"

const QuotePanel = ({ mobileView, preview, rendition, bookMeta, addCommentRef, onRemove = () => { }, hideModal = () => { } }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const UserState = useSelector(state => state.UserState)
    const WalletState = useSelector(state => state.WalletState)

    const [WalletAddress, setWalletAddress] = useState(null)
    const [Loading, setLoading] = useState(false)
    const [Quotes, setQuotes] = useState([])
    const [PostQuote, setPostQuotes] = useState('')

    useEffect(() => {
        if (Loading) dispatch(showSpinner())
        else dispatch(hideSpinner())
    }, [Loading, dispatch])

    useEffect(() => {
        if (!isUsable(mobileView) || mobileView === false) {
            if (isUsable(preview) && !preview) {
                if (isUsable(WalletState.wallet.provider)) setWalletAddress(WalletState.wallet.address)
                else navigate(-1)
            }
        }
    }, [WalletState, navigate, preview, mobileView])


    useEffect(() => {
        if (isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition)) {
            setLoading(true)
            axios({
                url: `${BASE_URL}/api/book/quotes`,
                method: 'GET',
                params: {
                    bookAddress: bookMeta.book_address,
                    ownerAddress: WalletAddress
                }
            }).then(res => {
                if (res.status === 200) {
                    setQuotes(res.data)
                }
                else dispatch(setSnackbar('NOT200'))
            }).catch(err => {
                dispatch(setSnackbar('ERROR'))
            }).finally(() => setLoading(false))
        }
    }, [bookMeta, WalletAddress, dispatch, rendition, preview])


    const handlePostQuote = useCallback(
        (PostQuote) => {
            debugger
            if (isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition)) {
                if (!isUsable(rendition)) return
                if (!isUsable(bookMeta)) return
                setLoading(true)
                axios({
                    url: `${BASE_URL}/api/book/quotes`,
                    method: 'POST',
                    data: {
                        bookAddress: bookMeta.book_address,
                        ownerAddress: WalletAddress,
                        quote: { body: PostQuote }
                    }
                }).then(res => {
                    if(res.status === 200) {
                        axios({
                            url: `${BASE_URL}/api/book/quotes`,
                            method: 'GET',
                            params: {
                                bookAddress: bookMeta.book_address,
                                ownerAddress: WalletAddress
                            }
                        }).then(res => {
                            if (res.status === 200) {
                                setQuotes(res.data)
                                setPostQuotes('')
                                console.log(res.data)
                                
                            }
                            else dispatch(setSnackbar('NOT200'))
                        }).catch(err => {
                            dispatch(setSnackbar('ERROR'))
                        }).finally(() => setLoading(false))
                    } 
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))


                }
        },
        [Quotes, WalletAddress, bookMeta, dispatch, rendition, preview]
    )


    return <div className="panel panel__annotation">
        <div className='quotes__input'>
            <textarea className='quotes__input__text-input' rows={6} onChange={e => setPostQuotes(e.target.value)} placeholder="Add a Quote..." type="text" value={PostQuote} />
            <Button className='quotes__input__button' type="primary" onClick={() => handlePostQuote(PostQuote)}>Post</Button>
        </div>
      {Quotes.map(quote=><QuoteSection quote={quote} bookMeta={bookMeta} preview={preview} UserState={UserState} /> )  }
    </div>;
}

export default QuotePanel

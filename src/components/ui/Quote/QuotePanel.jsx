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

const QuotePanel = ({ setDiscCount, mobileView, preview, rendition,  bookMeta, hideModal = () => { } }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const UserState = useSelector(state => state.UserState)
    const WalletState = useSelector(state => state.WalletState)
 
    const [WalletAddress, setWalletAddress] = useState(null)
    const [Loading, setLoading] = useState(false)
    const [Quotes, setQuotes] = useState([])
    const [PostQuote, setPostQuotes] = useState('')
    const [viewAllQuotes, setViewAllQuotes] = useState(false)
console.log(viewAllQuotes)
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
        if (isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition) ) {
            if (!isUsable(rendition)) return
            if (!isUsable(bookMeta)) return
            axios({
                url: `${BASE_URL}/api/book/quotes`,
                method: 'GET',
                params: {
                    bookAddress: bookMeta.book_address,
                    cfi_range : rendition.currentLocation().start.cfi
                }
            }).then(res => {
                if (res.status === 200) {
                    setDiscCount(res.data.length)
                    setQuotes(res.data)
                   
                }
                else dispatch(setSnackbar('NOT200'))
            }).catch(err => {
                dispatch(setSnackbar('ERROR'))
            }).finally(() => setLoading(false))
        }
    }, [  WalletAddress, bookMeta, dispatch, rendition?.location ])


    const handleViewAll = () =>{
        axios({
            url: `${BASE_URL}/api/book/quotes/all`,
            method: 'GET',
            params: {
                bookAddress: bookMeta.book_address
            }
        }).then(res => {
            if (res.status === 200) {
                setQuotes(res.data)
                setViewAllQuotes(true)
            }
            else dispatch(setSnackbar('NOT200'))
        }).catch(err => {
            dispatch(setSnackbar('ERROR'))
        }).finally(() => setLoading(false))
    }


    const handlePostQuote = useCallback(
        (PostQuote) => {
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
                        quote: { body: PostQuote },
                        cfi_range : rendition?.currentLocation().start.cfi
                    }
                }).then(res => {
                    if(res.status === 200) {
                        axios({
                            url: `${BASE_URL}/api/book/quotes`,
                            method: 'GET',
                            params: {
                                bookAddress: bookMeta.book_address,
                                cfi_range : rendition.currentLocation().start.cfi
                            }
                        }).then(res => {
                            if (res.status === 200) {
                                setDiscCount(res.data.length)
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
      {Quotes.map(quote=><QuoteSection rendition={rendition} quote={quote} bookMeta={bookMeta} preview={preview} UserState={UserState} hideModal={hideModal} /> )  }
      {!viewAllQuotes? <div>
        <Button className='quotes__view-all__button' type='primary' onClick={() => handleViewAll()}>View All</Button>
      </div>:null}
    </div>
}

export default QuotePanel

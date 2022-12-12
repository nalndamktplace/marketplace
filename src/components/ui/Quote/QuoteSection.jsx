import axios from "axios"
import React from 'react'
import moment from 'moment'
import { useEffect, useState } from "react"
import { setSnackbar } from "../../../store/actions/snackbar"
import { BASE_URL } from "../../../config/env"
import { ReactComponent as CommentIcon } from '../../../assets/icons/comment.svg'
import { ReactComponent as QuoteIcon } from "../../../assets/icons/quote.svg"
import { ReactComponent as UserIcon } from '../../../assets/icons/user.svg'
import { ReactComponent as LikeIcon } from '../../../assets/icons/thumbs-up.svg'
import { ReactComponent as DislikeIcon } from '../../../assets/icons/thumbs-down.svg'
import { ReactComponent as SendIcon } from '../../../assets/icons/send.svg'
import { ReactComponent as UpVoteIcon } from '../../../assets/icons/arrow-up-circle.svg'
import { ReactComponent as DownVoteIcon } from '../../../assets/icons/arrow-down-circle.svg'
import { useDispatch } from 'react-redux'
import GaTracker from '../../../trackers/ga-tracker'
import { isUsable } from "../../../helpers/functions"

const QuoteSection = ({ quote, bookMeta, UserState, preview, rendition, hideModal }) => {
    const dispatch = useDispatch()

    const [CommentSection, setCommentSection] = useState(false)
    const [postComment, setPostComment] = useState('')
    const [Comments, setComments] = useState([])

    useEffect(() => {
        axios({
            url: `${BASE_URL}/api/book/quotes/comments`,
            method: 'GET',
            params: {
                bookAddress: bookMeta.book_address,
                quoteId: quote.book_id
            }
        }).then(res => {
            if (res.status === 200) {
                setComments(res.data)
            }
            else dispatch(setSnackbar('NOT200'))
        }).catch(err => {
            dispatch(setSnackbar('ERROR'))
        })


    }, [bookMeta, dispatch, rendition, preview, quote])

    const postComments = () => {
        if (postComment.length > 2) {
            axios({
                url: `${BASE_URL}/api/book/quotes/comments`,
                method: 'POST',
                headers: {
                    'user-id': UserState.user.uid
                },
                data: {
                    bookAddress: bookMeta.book_address,
                    quoteId: quote.book_id,
                    comment: postComment,
                }
            }).then(res => {
                if (res.status === 200) {
                    axios({
                        url: `${BASE_URL}/api/book/quotes/comments`,
                        method: 'GET',
                        params: {
                            bookAddress: bookMeta.book_address,
                            quoteId: quote.book_id
                        }
                    }).then(res => {
                        if (res.status === 200) {
                            setComments(res.data)
                            setPostComment("")
                        }
                        else dispatch(setSnackbar('NOT200'))
                    }).catch(err => {
                        dispatch(setSnackbar('ERROR'))
                    })
                }
                else dispatch(setSnackbar('NOT200'))
            }).catch(err => {
                dispatch(setSnackbar('ERROR'))
            })

        }
    }

    const renderThreads = (threads) => {
        let threadsDOM = []
        threads.forEach((thread, i) => {
            threadsDOM.push(
                <div key={i} className='quotes__comments__thread'>
                    <div className="quotes__comments__icon">
                        <UserIcon width={22} height={24} stroke="currentColor" />
                        <div className='quotes__comments__text'>{thread.uid}</div>
                    </div>
                    <div className="quotes__comments__body typo__body">
                        {thread.comment}
                    </div>
                </div>
            )
        })
        return threadsDOM
    }

    const renderComments = () => {
        let commentsDOM = []
        Comments.forEach((comment, i) => {
            commentsDOM.push(
                <div>
                    <div key={i} className='quotes__comments'>
                        <div className="quotes__comments__icon">
                            <UserIcon width={22} height={24} stroke="currentColor" />
                            <div className='quotes__comments__text'>{comment.uid}</div>
                        </div>
                        <div className="quotes__comments__body typo__body">
                            {comment.comment}
                        </div>
                    </div>
                    <div className='quotes__item__section__icons'>
                        <div className='quotes__item__section__icon__action'><LikeIcon height={24} width={24} /></div>
                        <div className='quotes__item__section__icon__action'><DislikeIcon height={24} width={24} /></div>
                    </div>
                    {comment.thread ? renderThreads(comment.thread) : null}
                </div>
            )
        })
        return commentsDOM
    }

    const gotoPage = (cfi) => {
		GaTracker('event_annotationpanel_goto_page')
		if(!isUsable(rendition)) return
		rendition.display(cfi)
		rendition.display(cfi)
		hideModal()
	}

    return (
        <div>
            <div className='quotes__item' onClick={()=>gotoPage(quote.cfi_range)}>
                <div className="quotes__item__icon">
                    <QuoteIcon width={32} height={32} stroke="currentColor" />
                </div>
                <div className="quotes__item__body typo__body">
                    {quote.body}
                </div>
                <div className="quotes__item__time typo__cap typo__cap--2">
                    {moment(quote.created_at).format("D MMM, YYYY") || "-"}
                </div>
            </div>
            <div className="quotes__item__section"></div>
            <div className='quotes__item__section__icons'>

                <div className='quotes__item__section__icon__action'> <CommentIcon onClick={() => setCommentSection(!CommentSection)} height={24} width={24} />{Comments.length}</div>
                <div className='quotes__item__section__icon__action'><UpVoteIcon height={24} width={24} /></div>
                <div className='quotes__item__section__icon__action'><DownVoteIcon height={24} width={24} /></div>
            </div>
            {CommentSection ?
                <div>
                    <div className='quotes__item__section__comment-div'>
                        <input value={postComment} onChange={e => setPostComment(e.target.value)} className="quotes__item__section__comment-div__input" type="text" placeholder="Add a comment..." />
                        <div className='quotes__item__section__comment-div__action'><SendIcon onClick={() => postComments()} /></div>
                    </div>
                    {renderComments()}
                </div> : null}

        </div>
    )
}

export default QuoteSection
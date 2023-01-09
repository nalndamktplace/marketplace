import React, { useState } from 'react'
import { ReactComponent as UserIcon } from '../../../assets/icons/user.svg'
import { ReactComponent as LikeIcon } from '../../../assets/icons/thumbs-up.svg'
import { ReactComponent as DislikeIcon } from '../../../assets/icons/thumbs-down.svg'

const QuoteComments = ({ quote, comment }) => {

    const [Liked, setLiked] = useState(false)
    const [Likes, setLikes] = useState()

    useEffect(()=>{
        axios({
            url: `${BASE_URL}/api/book/quotes/comments/liked`,
            method:`GET`,
            params:{
                book_id: quote.book_id ,
                discussion_id:
            }  
        }).then(res => {
                if (res.status === 200) setComments(res.data)
                else if(res.status === 204) {}
                else dispatch(setSnackbar('NOT200'))
            }).catch(err => {
                dispatch(setSnackbar('ERROR'))
            })
    },[comment, liked])

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


  return (
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
}

export default QuoteComments
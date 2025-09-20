import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../api/constant";
import { message } from "antd";
import { isUsable } from "../../utils/getUrls";

const QuoteSection = ({
  quote,
  bookMeta,
  preview,
  rendition,
  hideModal,
}: any) => {
  const [CommentSection, _] = useState(false);
  const [postComment, setPostComment] = useState("");
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/book/quotes/comments`,
      method: "GET",
      params: {
        bookAddress: bookMeta.book_address,
        quoteId: quote.book_id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setComments(res.data);
        } else message.error("Something went wrong");
      })
      .catch(() => {
        message.error("Something went wrong");
      });
  }, [bookMeta, rendition, preview, quote]);

  // const postComments = () => {
  //   if (postComment.length > 2) {
  //     axios({
  //       url: `${BASE_URL}/api/book/quotes/comments`,
  //       method: "POST",
  //       headers: {
  //         "user-id": UserState.user.uid,
  //       },
  //       data: {
  //         bookAddress: bookMeta.book_address,
  //         quoteId: quote.book_id,
  //         comment: postComment,
  //       },
  //     })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           axios({
  //             url: `${BASE_URL}/api/book/quotes/comments`,
  //             method: "GET",
  //             params: {
  //               bookAddress: bookMeta.book_address,
  //               quoteId: quote.book_id,
  //             },
  //           })
  //             .then((res) => {
  //               if (res.status === 200) {
  //                 setComments(res.data);
  //                 setPostComment("");
  //               } else message.error("Something went wrong");
  //             })
  //             .catch(() => {
  //               message.error("Something went wrong");
  //             });
  //         } else message.error("Something went wrong");
  //       })
  //       .catch(() => {
  //         message.error("Something went wrong");
  //       });
  //   }
  // };

  const renderThreads = (threads: any) => {
    const threadsDOM: any = [];
    threads.forEach((thread: any, i: number) => {
      threadsDOM.push(
        <div key={i} className="quotes__comments__thread">
          <div className="quotes__comments__icon">
            {/* <UserIcon width={22} height={24} stroke="currentColor" /> */}
            <div className="quotes__comments__text">{thread.uid}</div>
          </div>
          <div className="quotes__comments__body typo__body">
            {thread.comment}
          </div>
        </div>
      );
    });
    return threadsDOM;
  };

  const renderComments = () => {
    const commentsDOM: any = [];
    Comments.forEach((comment: any, i: any) => {
      commentsDOM.push(
        <div>
          <div key={i} className="quotes__comments">
            <div className="quotes__comments__icon">
              {/* <UserIcon width={22} height={24} stroke="currentColor" /> */}
              <div className="quotes__comments__text">{comment.uid}</div>
            </div>
            <div className="quotes__comments__body typo__body">
              {comment.comment}
            </div>
          </div>
          <div className="quotes__item__section__icons">
            <div className="quotes__item__section__icon__action">
              {/* <LikeIcon height={24} width={24} /> */}
            </div>
            <div className="quotes__item__section__icon__action">
              {/* <DislikeIcon height={24} width={24} /> */}
            </div>
          </div>
          {comment.thread ? renderThreads(comment.thread) : null}
        </div>
      );
    });
    return commentsDOM;
  };

  const gotoPage = (cfi: any) => {
    if (!isUsable(rendition)) return;
    rendition.display(cfi);
    rendition.display(cfi);
    hideModal();
  };

  return (
    <div>
      <div className="quotes__item" onClick={() => gotoPage(quote.cfi_range)}>
        <div className="quotes__item__body typo__body">{quote.body}</div>
        <div className="quotes__item__time typo__cap typo__cap--2">
          {moment(quote.created_at).format("D MMM, YYYY") || "-"}
        </div>
      </div>
      <div className="quotes__item__section"></div>
      <div className="quotes__item__section__icons">
        <div className="quotes__item__section__icon__action">
          {/* <CommentIcon
            onClick={() => setCommentSection(!CommentSection)}
            height={24}
            width={24}
          /> */}
          {Comments.length}
        </div>
        <div className="quotes__item__section__icon__action">
          {/* <UpVoteIcon height={24} width={24} /> */}
        </div>
        <div className="quotes__item__section__icon__action">
          {/* <DownVoteIcon height={24} width={24} /> */}
        </div>
      </div>
      {CommentSection ? (
        <div>
          <div className="quotes__item__section__comment-div">
            <input
              value={postComment}
              onChange={(e) => setPostComment(e.target.value)}
              className="quotes__item__section__comment-div__input"
              type="text"
              placeholder="Add a comment..."
            />
            <div className="quotes__item__section__comment-div__action">
              {/* <SendIcon onClick={() => postComments()} /> */}
            </div>
          </div>
          {renderComments()}
        </div>
      ) : null}
    </div>
  );
};

export default QuoteSection;

import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  hideSpinner,
  showSpinner,
} from "../../store/slice/spinnerManageReducer";
import { isUsable } from "../../utils/getUrls";
import { useAppSelector } from "../../store/hooks";
import { BASE_URL } from "../../api/constant";
import { Button, message } from "antd";
import QuoteSection from "./QuoteSection";

const QuotePanel = ({
  setDiscCount,
  mobileView,
  preview,
  rendition,
  bookMeta,
  hideModal = () => {},
}: any) => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.userManage);

  const [WalletAddress, setWalletAddress] = useState<any>(null);
  const [Loading, setLoading] = useState(false);
  const [Quotes, setQuotes] = useState([]);
  const [PostQuote, setPostQuotes] = useState("");

  useEffect(() => {
    if (Loading) dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [Loading, dispatch]);

  useEffect(() => {
    if (!isUsable(mobileView) || mobileView === false) {
      if (isUsable(preview) && !preview) {
        if (isUsable(address)) setWalletAddress(address);
        else navigate(-1);
      }
    }
  }, [navigate, preview, mobileView]);

  useEffect(() => {
    if (
      isUsable(preview) &&
      !preview &&
      isUsable(bookMeta) &&
      isUsable(WalletAddress) &&
      isUsable(rendition)
    ) {
      if (!isUsable(rendition)) return;
      if (!isUsable(bookMeta)) return;
      axios({
        url: `${BASE_URL}/api/book/quotes`,
        method: "GET",
        params: {
          bookAddress: bookMeta.book_address,
          cfi_range: rendition.currentLocation().start.cfi,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setDiscCount(res.data.length);
            setQuotes(res.data);
          } else message.error("Something went wrong");
        })
        .catch(() => {
          message.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  }, [WalletAddress, bookMeta, dispatch, rendition?.location]);

  const handlePostQuote = useCallback(
    (PostQuote: any) => {
      if (
        isUsable(preview) &&
        !preview &&
        isUsable(bookMeta) &&
        isUsable(WalletAddress) &&
        isUsable(rendition)
      ) {
        if (!isUsable(rendition)) return;
        if (!isUsable(bookMeta)) return;
        setLoading(true);
        axios({
          url: `${BASE_URL}/api/book/quotes`,
          method: "POST",
          data: {
            bookAddress: bookMeta.book_address,
            ownerAddress: WalletAddress,
            quote: { body: PostQuote },
            cfi_range: rendition?.currentLocation().start.cfi,
          },
        })
          .then((res) => {
            if (res.status === 200) {
              axios({
                url: `${BASE_URL}/api/book/quotes`,
                method: "GET",
                params: {
                  bookAddress: bookMeta.book_address,
                  cfi_range: rendition.currentLocation().start.cfi,
                },
              })
                .then((res) => {
                  if (res.status === 200) {
                    setDiscCount(res.data.length);
                    setQuotes(res.data);
                    setPostQuotes("");
                  } else message.error("Something went wrong");
                })
                .catch(() => {
                  message.error("Something went wrong");
                })
                .finally(() => setLoading(false));
            } else message.error("Something went wrong");
          })
          .catch(() => {
            message.error("Something went wrong");
          })
          .finally(() => setLoading(false));
      }
    },
    [Quotes, WalletAddress, bookMeta, dispatch, rendition, preview]
  );

  return (
    <div className="text-black panel">
      <div className="quotes__input">
        <textarea
          className="quotes__input__text-input"
          rows={6}
          onChange={(e) => setPostQuotes(e.target.value)}
          placeholder="Start a Discussion..."
          value={PostQuote}
        />
        <Button type="primary" onClick={() => handlePostQuote(PostQuote)}>
          Post
        </Button>
      </div>
      {Quotes.map((quote) => (
        <QuoteSection
          rendition={rendition}
          quote={quote}
          bookMeta={bookMeta}
          preview={preview}
          UserState={user}
          hideModal={hideModal}
        />
      ))}
    </div>
  );
};

export default QuotePanel;

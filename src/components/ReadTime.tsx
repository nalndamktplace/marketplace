import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAppSelector } from "../store/hooks";
import { isUsable } from "../utils/getUrls";
import axios from "axios";
import { BASE_URL } from "../api/constant";
import { message } from "antd";
import { TbClockHour3 } from "react-icons/tb";
import { toHHMMSS } from "../utils/time-formator";

function ReadTime({ timerUpdate, mobileView, bookMeta, preview }: any) {
  const { user, tokens } = useAppSelector((state) => state.userManage);
  const [readTime, setReadTime] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [WalletAddress, setWalletAddress] = useState<any>(null);
  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUsable(mobileView) || mobileView === false) {
      if (isUsable(preview) && !preview) {
        if (isUsable(address)) setWalletAddress(address);
        else navigate(-1);
      }
    }
  }, [mobileView, navigate, preview]);

  useEffect(() => {
    if (
      !preview &&
      isUsable(bookMeta) &&
      (isUsable(address) || (isUsable(mobileView) && mobileView === true))
    ) {
      axios({
        url: `${BASE_URL}/api/reader/read-time`,
        method: "GET",
        headers: {
          address: address,
          "user-id": user?.uid,
          authorization: `Bearer ${tokens.acsTkn.tkn}`,
        },
        params: { bookAddress: bookMeta.book_address },
      })
        .then((res) => {
          if (res.status === 200) {
            setReadTime(res.data.read_time);
            setLastUpdate(res.data.read_time);
          }
        })
        .catch(() => {
          message.error("Something went wrong");
        });
    }
  }, [mobileView, bookMeta, WalletAddress, address, preview]);

  useEffect(() => {
    if (
      !isUsable(bookMeta) &&
      !isUsable(address) &&
      !isUsable(mobileView) &&
      mobileView !== true
    )
      return;
    const updateReadTime = () => {
      if (!timerUpdate) return;
      setReadTime((s) => s + 1);
    };
    const intervalHandler = setInterval(updateReadTime, 1000);
    return () => {
      clearInterval(intervalHandler);
    };
  }, [timerUpdate, mobileView, bookMeta, address, WalletAddress]);

  useEffect(() => {
    if (!preview) {
      const currentReadTime = readTime;
      if (currentReadTime - lastUpdate > 10) {
        axios({
          url: `${BASE_URL}/api/reader/read-time`,
          method: "PUT",
          headers: {
            address: address,
            "user-id": user?.uid,
            authorization: `Bearer ${tokens?.acsTkn.tkn}`,
          },
          data: {
            bookAddress: bookMeta.book_address,
            ownerAddress: address,
            readTime: currentReadTime,
          },
        })
          .then((res) => {
            if (res.status === 200) {
              setLastUpdate(res.data.read_time);
            }
          })
          .catch(() => {
            message.error("Something went wrong");
          });
      }
    }
  }, [bookMeta, readTime, WalletAddress, address, lastUpdate, preview, user]);

  return (
    <div className="flex items-center">
      <TbClockHour3 width="3rem" height="3rem" stroke="currentColor" />
      <div className="readtime__time">{toHHMMSS(readTime)}</div>
    </div>
  );
}

export default ReadTime;

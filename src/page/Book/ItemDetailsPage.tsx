import { LuShoppingCart } from "react-icons/lu";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { BOOK } from "../../api/book/book";
import { useEffect, useState } from "react";
import {
  useContractWriteWithWaitForTransaction,
  useUSDCContractAllowanceRead,
  useUSDCContractRead,
} from "../../hooks/useContract";
import { MARKET_CONTRACT_ADDRESS, USDC_ADDRESS } from "../../constant/constant";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import { NALNDA_BOOK_ABI } from "../../constant/abi/NalndaBook";
import { formatUnits, keccak256, parseEther, parseUnits, toBytes } from "viem";
import { useAppSelector } from "../../store/hooks";
import { NALNDA_TOKEN_ABI } from "../../constant/abi/NalndaToken";
import { isUsable } from "../../utils/getUrls";
import { BASE_URL } from "../../api/constant";
import axios from "axios";
import { MARKET_CONTRACT_ABI } from "../../constant/abi/Marketplace";
import BookOffers from "./components/BookOffers";
import { useAuth0 } from "@auth0/auth0-react";
import useProviderOrSigner from "../../hooks/useProviderOrSigner";
import { Helmet } from "react-helmet";
import BookActionButtons from "./components/BookActionButtons";
import { USER } from "../../api/user/user";
import BookTabsSection from "./components/BookTabsSection";
import BookStats from "./components/BookStats";
import BookSocialInfo from "./components/BookSocialInfo";
import BookDetails from "./components/BookDetails";

function ItemDetailsPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { provider } = useProviderOrSigner();
  const [messageApi, contextHolder] = message.useMessage();
  const { isAuthenticated } = useAuth0();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [unListLoading, setUnListLoading] = useState(false);
  const [userCopy, setUserCopy] = useState<any>(null);
  const [listed, setListed] = useState<any>(null);
  const [owner, setOwner] = useState(false);
  const [published, setPublished] = useState(false);

  const { user, tokens } = useAppSelector((state) => state.userManage);
  const [_, setBookID] = useState(null); //bookID
  const { waitForTransactionReceipt } = usePublicClient();
  // console.log(owner, "owner");
  // console.log(published, "published");
  // console.log(listed, sellLoading, "listed");

  const { bookData, bookRefetch } = BOOK.getSpecifBookQuery({
    id: bookId,
    publisherAddress: address,
  });

  const NFT: any = bookData?.[0];
  const headers = {
    address: address,
    "user-id": user?.uid,
    authorization: `Bearer ${tokens?.acsTkn?.tkn}`,
  };

  const usdtDecimal = useUSDCContractRead();
  const { data: usdtAllowance, refetchUsdcAllowance } =
    useUSDCContractAllowanceRead(address, NFT?.book_address);

  const {
    writeAsync: safeMintWriteAsync,
    isLoading: safeMintWriteAsyncLoading,
  } = useContractWriteWithWaitForTransaction({
    address: NFT?.book_address,
    abi: NALNDA_BOOK_ABI,
    functionName: "safeMint",
    args: [
      address,
      [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
      false,
    ],
  });

  const {
    writeAsync: listBookToMarketplace,
    isLoading: listBookToMarketplaceLoading,
  } = useContractWrite({
    address: MARKET_CONTRACT_ADDRESS,
    abi: MARKET_CONTRACT_ABI,
    functionName: "listCover",
  });

  const {
    writeAsync: unListBookToMarketplace,
    isLoading: unListBookToMarketplaceLoading,
  } = useContractWrite({
    address: MARKET_CONTRACT_ADDRESS,
    abi: MARKET_CONTRACT_ABI,
    functionName: "unlistCover",
  });

  const {
    writeAsync: writeAsyncTokenApprove,
    isLoading: writeAsyncTokenApproveLoading,
  } = useContractWriteWithWaitForTransaction({
    address: USDC_ADDRESS,
    abi: NALNDA_TOKEN_ABI,
    functionName: "approve",
  });

  useEffect(() => {
    refetchUsdcAllowance();
  }, [writeAsyncTokenApproveLoading, NFT]);

  const { bookCryptoOrderMutationAsync, bookCryptoOrderLoading } =
    BOOK.bookCryptoOrderMutation();
  const { bookCryptoOrderFailedMutationAsync } =
    BOOK.bookCryptoOrderFailedMutation();

  const { bookReaderReadCountData, bookReaderReadCountRefetch } =
    BOOK.getSpecifBookReaderCountQuery({
      bookAddress: NFT?.book_address,
    });

  const { bookReaderReadTimeData, bookReaderReadTimeRefetch } =
    BOOK.getSpecifBookReaderReadTimeQuery({
      bookAddress: NFT?.book_address,
    });

  const { bookTotalReaderCountData, bookTotalReaderCountRefetch } =
    BOOK.getSpecifBookTotalReaderCountQuery({
      bookAddress: NFT?.book_address,
    });

  const { bookOwnerRefetchMutateAsync, bookOwnerLoading } =
    BOOK.getBookOwnerStatusMutation({
      ownerAddress: address,
      bookAddress: NFT?.book_address,
      headers,
    });
  const { bookLikedStatusDataRefetch, bookLikedStatusData } =
    BOOK.getBookLikedStatusQuery({
      ownerAddress: address,
      bookAddress: NFT?.book_address,
    });

  const { userBookMutationAsync } = USER.userBookMutation();

  const { userBookData, userBookDataRefetch } = BOOK.getUserBookQuery({
    bookAddress: NFT?.book_address,
    walletAddress: address,
    headers,
  });
  const { bookOffersData, bookOffersDataRefetch } = BOOK.getBookOffersQuery({
    bookAddress: NFT?.book_address,
    headers,
  });

  const { userBookReadTimeData, userBookReadTimeDataRefetch } =
    BOOK.getBookReadTimeQuery({
      bookAddress: NFT?.book_address,
      headers,
    });

  useEffect(() => {
    bookRefetch();
  }, [address, bookId]);

  useEffect(() => {
    bookLikedStatusDataRefetch();
  }, [bookData]);

  useEffect(() => {
    bookReaderReadCountRefetch();
    bookReaderReadTimeRefetch;
    bookTotalReaderCountRefetch;
    userBookDataRefetch();
    userBookReadTimeDataRefetch();
  }, [NFT, address, bookId, loading]);

  // book owner and publisher check
  useEffect(() => {
    if (isUsable(address) && isUsable(NFT)) {
      if (NFT?.publisher_address === address) setPublished(true);
      else setPublished(false);
      bookOwnerRefetchMutateAsync()
        .then(() => {
          setOwner(true);
        })
        .catch(() => {
          setOwner(false);
        });
    }
  }, [NFT, address, bookId, loading]);

  useEffect(() => {
    // if (owner) {
    if (user?.uid) {
      userBookMutationAsync({
        walletAddress: address,
        bookAddress: NFT?.book_address,
        uid: user?.uid,
        acsTkn: tokens?.acsTkn?.tkn,
      })
        .then((res) => {
          // if (res.status === 200) {
          setUserCopy(res);
          setListed(res.listed);
          // } else if (res.status === 204) {
          //   console.log();
          // } else message.error("Something went wrong");
        })
        .catch(() => {
          // message.error("Something went wrong");
        });
      // axios({
      //   url: `${BASE_URL}/api/user/book`,
      //   method: "GET",
      //   headers: {
      //     "user-id": user?.uid,
      //     address: address,
      //     authorization: `Bearer ${tokens?.acsTkn?.tkn}`,
      //   },
      //   params: { walletAddress: address, bookAddress: NFT?.book_address },
      // })
      //   .then((res) => {
      //     if (res.status === 200) {
      //       setUserCopy(res.data);
      //       setListed(res.data.listed);
      //     } else if (res.status === 204) {
      //       console.log();
      //     } else message.error("Something went wrong");
      //   })
      //   .catch(() => {
      //     message.error("Something went wrong");
      //   });
    }
  }, [owner, NFT, address, user?.uid]);

  const cryptoPurchaseHandler = async (price = -1) => {
    let orderId = null;
    const PRICE = price > 0 ? price : NFT?.price;
    try {
      const order = await bookCryptoOrderMutationAsync({
        bodyData: { amount: PRICE },
        headers,
      });
      orderId = order?.id;
      const safeMintTransaction = async (orderId: any) => {
        const safeMintTx = await safeMintWriteAsync();
        const trx = await waitForTransactionReceipt({
          hash: safeMintTx?.hash,
        });

        const txHash = trx.transactionHash;

        const eventHash = keccak256(
          toBytes("Transfer(address,address,uint256)"),
        );
        let tidDec = undefined;
        trx.logs.forEach((log: any) => {
          if (
            log?.address?.toLowerCase() === NFT?.book_address?.toLowerCase() &&
            log?.topics[0] === eventHash
          ) {
            const tid = log.topics[3];
            tidDec = parseInt(tid, 16);
            return;
          }
        });

        if (tidDec != null) {
          setBuyLoading(true);
          setLoading(true);

          await axios.post(
            `${BASE_URL}/api/book/crypto/mine`,
            { transactionId: orderId, wallet: address, hash: txHash },
            { headers },
          );

          // const tokenId = parseInt(logs[0].topics[logs[0].topics.length - 1]);
          const tokenId = tidDec;

          axios({
            url: `${BASE_URL}/api/book/copies`,
            method: "POST",
            data: { bookAddress: NFT?.book_address, copies: tokenId },
          })
            .then(() => {})
            .catch(() => {});
          const data = {
            ownerAddress: address,
            bookAddress: NFT?.book_address,
            tokenId,
            purchasePrice: PRICE,
            orderId: orderId,
          };
          const purchase = await axios.post(
            `${BASE_URL}/api/book/purchase`,
            data,
            { headers },
          );
          if (purchase.status === 200) setOwner(true);
          else message.error("Something went wrong");

          await bookOffersDataRefetch();
          setBuyLoading(false);
          setLoading(false);
        }
      };

      if (Number(formatUnits(usdtAllowance, usdtDecimal)) < Number(PRICE)) {
        const approveTx = await writeAsyncTokenApprove({
          args: [NFT?.book_address, parseUnits(String(PRICE), usdtDecimal)], // Need to dynamically
        });
        const approveTxWait = await waitForTransactionReceipt({
          hash: approveTx?.hash,
        });
        if (approveTxWait.status === "success") {
          await safeMintTransaction(orderId);
        }
      } else {
        await safeMintTransaction(orderId);
      }
    } catch (error) {
      const data = await bookCryptoOrderFailedMutationAsync({
        headers,
        bodyData: { transactionId: orderId, error },
      });
      setLoading(false);
      console.log(data, error);
    } finally {
      setLoading(false);
    }
  };

  const unlistHandler = () => {
    if (isUsable(address)) {
      setUnListLoading(true);
      setLoading(true);
      try {
        axios({
          url: BASE_URL + "/api/user/book/listed",
          method: "GET",
          headers: {
            "user-id": user?.uid,
            authorization: `Bearer ${tokens.acsTkn.tkn}`,
          },
          params: {
            ownerAddress: address,
            tokenId: userCopy.token_id,
            bookAddress: NFT.book_address,
          },
        })
          .then(async (res) => {
            if (res.status === 200) {
              setUnListLoading(true);
              setLoading(true);
              const orderId = res.data.order_id;
              console.log("orderId", orderId);
              try {
                const { hash } = await unListBookToMarketplace({
                  args: [orderId],
                });
                const trx = await waitForTransactionReceipt({
                  hash: hash,
                });
                if (trx.status === "success") {
                  axios({
                    url: BASE_URL + "/api/book/unlist",
                    method: "POST",
                    data: {
                      ownerAddress: address,
                      bookAddress: NFT.book_address,
                    },
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        setListed(false);
                        message.warning("Book unlisted from marketplace");
                      } else message.warning("Something went wrong");
                    })
                    .catch(() => {
                      message.warning("Something went wrong");
                    })
                    .finally(() => {
                      setUnListLoading(false);
                      setLoading(false);
                    });
                }
              } catch (error: any) {
                setUnListLoading(false);
                if (isUsable(error)) {
                  if (
                    error?.shortMessage.includes(
                      "NFT not yet listed / already sold",
                    )
                  )
                    message.error("eBook already sold or not listed.");
                }
              }
            }
          })
          .finally(() => {
            setUnListLoading(false);
          });
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const onListHandler = async ({ price }: { price: number }) => {
    const listPrice = price;

    if (!isUsable(address)) return;

    setSellLoading(true);

    try {
      const { hash } = await listBookToMarketplace({
        args: [
          NFT?.book_address,
          userCopy.token_id,
          parseEther(String(listPrice)),
        ],
      });

      const trx = await waitForTransactionReceipt({ hash });

      console.log(
        {
          ownerAddress: address,
          bookAddress: NFT.book_address,
          bookPrice: listPrice,
          bookTokenId: userCopy?.token_id,
        },
        trx,
        "Transaction Details",
      );

      if (trx?.status === "success") {
        const orderId = parseInt(String(trx.logs[1].topics[1]));

        await handleListingSuccess(orderId, listPrice);
      } else {
        throw new Error("Transaction failed.");
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setSellLoading(false);
    }

    await bookOffersDataRefetch();
  };

  const handleListingSuccess = async (orderId: number, listPrice: number) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/book/list`, {
        ownerAddress: address,
        bookAddress: NFT.book_address,
        bookPrice: listPrice,
        bookOrderId: orderId,
        bookTokenId: userCopy?.token_id,
      });

      if (response.status === 200) {
        setListed(true);
        setBookID(response.data);
        showMessage("success", "Book listed on marketplace");
      } else {
        showMessage("error", "Something went wrong");
      }
    } catch (error) {
      showMessage("error", "Something went wrong");
    }
  };

  const handleError = (err: any) => {
    const message = err?.shortMessage || "Something went wrong";

    if (isUsable(message)) {
      if (message.includes("Can't list the cover at this time")) {
        showMessage(
          "warning",
          "Please wait for some more time before listing the book",
        );
      } else if (message.includes("Listing for this book is disabled")) {
        showMessage(
          "warning",
          "Listing this book is not allowed right now. Please try again later.",
        );
      } else if (message.includes("Seller should own the NFT to list")) {
        showMessage(
          "warning",
          "Book is already listed. Please contact us on support@nalnda.com",
        );
      } else {
        showMessage("warning", "Something went wrong");
      }
    } else {
      showMessage("warning", "Something went wrong");
    }
  };

  const showMessage = (
    type: "success" | "error" | "warning",
    content: string,
  ) => {
    messageApi.open({
      type,
      content,
      style: { marginTop: "20vh" },
    });
  };

  const readHandler = async () => {
    setLoading(true);
    try {
      axios({
        url: `${BASE_URL}/api/verify/mobile`,
        method: "POST",
        headers: {
          address: address,
          "user-id": user?.uid,
          authorization: `Bearer ${tokens.acsTkn.tkn}`,
        },
        data: {
          bookAddress: NFT.book_address,
          ownerAddress: address,
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            console.log(NFT, "book: NFT");
            navigate("/book/reader", { state: { book: NFT, preview: true } });
          } else
            messageApi.open({
              type: "error",
              content: "Something went wrong",
              style: {
                marginTop: "20vh",
              },
            });
        })
        .catch((err) => {
          setLoading(false);
          if (err.response?.status === 401)
            messageApi.open({
              type: "warning",
              content: "Please purchase the book first",
              style: {
                marginTop: "20vh",
              },
            });
          else
            messageApi.open({
              type: "error",
              content: "Something went wrong",
              style: {
                marginTop: "20vh",
              },
            });
        });
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <meta name="og:image" content={NFT?.cover_public_url} />
        <meta name="og:url" content={location.href} />
        <meta name="og:site" content="@nalndamktplace" />
        <meta name="og:title" content={NFT?.title} />
        <meta
          name="og:description"
          content={`Just finished reading ${NFT?.title} by ${NFT?.author} and I highly recommend it!`}
        />
        <meta name="twitter:card" content={"summary_large_image"} />
        <meta name="twitter:site" content="@nalndamktplace" />
        <meta name="twitter:title" content={NFT?.title} />
        <meta
          name="twitter:description"
          content={`Just finished reading ${NFT?.title} by ${NFT?.author} and I highly recommend it!`}
        />
        <meta name="twitter:image:alt" content={"image"} />
        <meta name="twitter:image" content={NFT?.cover_public_url} />
      </Helmet>
      {contextHolder}
      <div className="mt-5 ">
        <div className="relative ">
          <div
            className="container relative flex flex-row px-5 py-10 overflow-hidden bg-no-repeat bg-cover md:flex-col rounded-2xl"
            // style={{ backgroundImage: `url(${NFT?.cover_public_url})` }}
          >
            <img
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src =
                  "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg";
              }}
              src={NFT?.cover_public_url}
              className="absolute top-0 bottom-0 left-0 right-0 w-full h-full overflow-hidden blur-xl -z-1"
            />
            <div className="container z-10 flex max-h-full md:min-h-[550px] flex-col gap-10 py-5 md:flex-row">
              {/* // book background */}
              <div className="flex justify-center flex-1 ">
                <div className="bg-gray-100  transition-all cursor-pointer hover:drop-shadow-xl hover:-translate-y-2 min-w-[300px] w-full max-w-[350px]  rounded-2xl">
                  <div className="relative h-full ">
                    <img
                      className="object-cover object-top w-full h-full p-2 rounded-2xl"
                      src={NFT?.cover_public_url}
                    />
                    <div className="bg-white p-0.5 absolute bottom-2 right-2 drop rounded-full">
                      <div className="p-2 rounded-full bg-primary ">
                        <LuShoppingCart size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* // Book Information */}
              <div className="z-10 flex flex-col justify-center flex-1 md:mx-10 ">
                <BookDetails nft={NFT} provider={provider} />

                <BookSocialInfo nft={NFT} />

                <BookStats
                  nft={NFT}
                  bookLikedStatusData={bookLikedStatusData}
                  isConnected={isConnected}
                  address={address}
                  bookRefetch={bookRefetch}
                />

                <BookActionButtons
                  isAuthenticated={isAuthenticated}
                  isConnected={isConnected}
                  listed={listed}
                  published={published}
                  owner={owner}
                  loading={loading}
                  bookOwnerLoading={bookOwnerLoading}
                  unListLoading={unListLoading}
                  unListBookToMarketplaceLoading={
                    unListBookToMarketplaceLoading
                  }
                  sellLoading={sellLoading}
                  listBookToMarketplaceLoading={listBookToMarketplaceLoading}
                  bookReaderReadTimeData={bookReaderReadTimeData}
                  userBookData={userBookData}
                  userBookReadTimeData={userBookReadTimeData}
                  NFT={NFT}
                  onListHandler={onListHandler}
                  readHandler={readHandler}
                  cryptoPurchaseHandler={cryptoPurchaseHandler}
                  bookCryptoOrderLoading={bookCryptoOrderLoading}
                  buyLoading={buyLoading}
                  writeAsyncTokenApproveLoading={writeAsyncTokenApproveLoading}
                  safeMintWriteAsyncLoading={safeMintWriteAsyncLoading}
                  unlistHandler={unlistHandler}
                />
              </div>
            </div>
          </div>
          <div className="container flex flex-col-reverse px-5 mt-5 md:flex-row gap-x-5">
            <div className="flex-1 bg-[#fdfdfd] rounded-md border-gray-200 border p-4">
              <BookTabsSection
                owner={owner}
                nft={NFT}
                address={address}
                published={published}
                synopsis={NFT?.synopsis}
                language={NFT?.language}
                readerReadCount={bookReaderReadCountData?.reader_count}
                readerReadTime={bookReaderReadTimeData?.total_read_time}
                totalReaderCount={bookTotalReaderCountData?.total_readers}
                genres={JSON.parse(NFT?.genres ?? null)}
                ageGroup={JSON.parse(NFT?.age_group ?? null)}
              />
            </div>

            <BookOffers
              isOwner={owner || published}
              isListed={listed}
              bookOffersData={bookOffersData}
              cryptoPurchaseHandler={cryptoPurchaseHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;

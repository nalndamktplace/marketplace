import { useMutation, useQuery } from "@tanstack/react-query";
import { poster } from "../poster";
import { ENDPOINTS } from "../constant";
import { HttpStatusCode } from "axios";

export class Book {
  public getSpecifBookQuery = ({ id, publisherAddress }: any) => {
    const {
      data: bookData,
      isLoading: bookLoading,
      refetch: bookRefetch,
    } = useQuery({
      queryKey: ["getSpecifBookQuery", id],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOKS}?id=${id}&publisherAddress=${publisherAddress}`,
          method: "GET",
        }),
    });
    return {
      bookData,
      bookLoading,
      bookRefetch,
    };
  };

  public getAllBooksQuery = () => {
    const {
      data: booksData,
      isLoading: booksLoading,
      refetch: booksRefetch,
    } = useQuery({
      queryKey: ["getAllBooksQuery"],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOKS}`,
          method: "GET",
        }),
    });
    return {
      booksData,
      booksLoading,
      booksRefetch,
    };
  };

  public getBookOwnerStatusMutation = ({
    ownerAddress,
    bookAddress,
    headers,
  }: any) => {
    const {
      data: bookOwnerData,
      isPending: bookOwnerLoading,
      mutateAsync: bookOwnerRefetchMutateAsync,
    } = useMutation({
      mutationKey: [ownerAddress, bookAddress],
      mutationFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_OWNER}?ownerAddress=${ownerAddress}&bookAddress=${bookAddress}`,
          method: "GET",
          headers,
        }),
    });
    return {
      bookOwnerData,
      bookOwnerLoading,
      bookOwnerRefetchMutateAsync,
    };
  };

  public getBookQuoteStatusMutation = () => {
    const {
      data: bookQuoteData,
      isPending: bookQuoteLoading,
      mutateAsync: bookQuoteRefetchMutateAsync,
    } = useMutation({
      mutationFn: async ({ ownerAddress, bookAddress, headers }: any) =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_QUOTE}?ownerAddress=${ownerAddress}&bookAddress=${bookAddress}`,
          method: "GET",
          headers,
        }),
    });
    return {
      bookQuoteData,
      bookQuoteLoading,
      bookQuoteRefetchMutateAsync,
    };
  };

  public getBookQuotesQuery = ({ bookAddress }: any) => {
    const {
      data: bookQuotesData,
      isPending: bookQuotesLoading,
      refetch: bookQuotesRefetch,
    } = useQuery({
      queryKey: ["getBookQuotesQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_QUOTES}?bookAddress=${bookAddress}`,
          method: "GET",
        }),
    });
    return {
      bookQuotesData,
      bookQuotesLoading,
      bookQuotesRefetch,
    };
  };

  public getBookLikedStatusQuery = ({ bookAddress, ownerAddress }: any) => {
    const {
      data: bookLikedStatusData,
      isPending: bookLikedStatusDataLoading,
      refetch: bookLikedStatusDataRefetch,
    } = useQuery({
      queryKey: ["getBookLikedStatusQuery", bookAddress, ownerAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_LIKED}?bookAddress=${bookAddress}&ownerAddress=${ownerAddress}`,
          method: "GET",
        }),
    });
    return {
      bookLikedStatusData,
      bookLikedStatusDataLoading,
      bookLikedStatusDataRefetch,
    };
  };

  public bookReviewMutation = () => {
    const {
      data: bookReviewData,
      isPending: bookReviewLoading,
      mutateAsync: bookReviewMutateAsync,
    } = useMutation({
      mutationFn: async ({ ownerAddress, bookAddress, review }: any) =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_REVIEWS}`,
          method: "POST",
          bodyData: { ownerAddress, bookAddress, review },
        }),
    });
    return {
      bookReviewData,
      bookReviewLoading,
      bookReviewMutateAsync,
    };
  };

  public getBookReviewsQuery = ({ bookAddress }: any) => {
    const {
      data: bookReviewsData,
      isPending: bookReviewsLoading,
      refetch: bookReviewsRefetch,
    } = useQuery({
      queryKey: ["getBookReviewsQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_REVIEWS}?bookAddress=${bookAddress}`,
          method: "GET",
        }),
    });
    return {
      bookReviewsData,
      bookReviewsLoading,
      bookReviewsRefetch,
    };
  };

  public getSpecifBookTotalReaderCountQuery = ({ bookAddress }: any) => {
    const {
      data: bookTotalReaderCountData,
      isLoading: bookTotalReaderCountLoading,
      refetch: bookTotalReaderCountRefetch,
    } = useQuery({
      queryKey: ["getSpecifBookTotalReaderCountQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_TOTAL_READER_COUNT}?bookAddress=${bookAddress}`,
          method: "GET",
        }),
    });
    return {
      bookTotalReaderCountData,
      bookTotalReaderCountLoading,
      bookTotalReaderCountRefetch,
    };
  };

  public getSpecifBookReaderReadTimeQuery = ({ bookAddress }: any) => {
    const {
      data: bookReaderReadTimeData,
      isLoading: bookReaderReadTimeLoading,
      refetch: bookReaderReadTimeRefetch,
    } = useQuery({
      queryKey: ["getSpecifBookReaderReadTimeQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_READER_READ_TIME}?bookAddress=${bookAddress}`,
          method: "GET",
        }),
    });
    return {
      bookReaderReadTimeData,
      bookReaderReadTimeLoading,
      bookReaderReadTimeRefetch,
    };
  };

  public getSpecifBookReaderCountQuery = ({ bookAddress }: any) => {
    const {
      data: bookReaderReadCountData,
      isLoading: bookReaderReadCountLoading,
      refetch: bookReaderReadCountRefetch,
    } = useQuery({
      queryKey: ["getSpecifBookReaderCountQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_READER_COUNT}?bookAddress=${bookAddress}`,
          method: "GET",
        }),
    });
    return {
      bookReaderReadCountData,
      bookReaderReadCountLoading,
      bookReaderReadCountRefetch,
    };
  };

  public getMediumBlogsQuery = () => {
    const {
      data: mediumBlogsData,
      isLoading: mediumBlogsLoading,
      refetch: mediumBlogsRefetch,
    } = useQuery({
      queryKey: ["getMediumBlogsQuery"],
      queryFn: async () =>
        await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@nalndamktplace",
          {
            mode: "cors",
          }
        )
          .then(async (response) => {
            if (HttpStatusCode.Ok === response.status) {
              return response?.json();
            } else {
              throw new Error("Something went wrong");
            }
          })
          .catch((error) => {
            throw error;
            // Swal.fire('Error', error.message, 'error');
          }),
    });
    return {
      mediumBlogsData,
      mediumBlogsLoading,
      mediumBlogsRefetch,
    };
  };

  public bookSubmarineMutation = () => {
    const {
      data: bookSubmarineData,
      isPending: bookSubmarineLoading,
      mutateAsync: bookSubmarineMutationAsync,
    } = useMutation({
      mutationFn: async ({ uid, walletAddress, acsTkn, bodyData }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_SUBMARINE,
          method: "POST",
          bodyData: bodyData,
          headers: {
            "user-id": uid,
            address: walletAddress,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      bookSubmarineData,
      bookSubmarineLoading,
      bookSubmarineMutationAsync,
    };
  };

  public bookLikeMutation = () => {
    const {
      data: bookLikeData,
      isPending: bookLikeLoading,
      mutateAsync: bookLikeMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_LIKE,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookLikeData,
      bookLikeLoading,
      bookLikeMutationAsync,
    };
  };

  public bookQuoteMutation = () => {
    const {
      data: bookQuotesData,
      isPending: bookQuotesLoading,
      mutateAsync: bookQuotesMutateAsync,
    } = useMutation({
      mutationFn: async ({
        quote,
        bookAddress,
        ownerAddress,
        cfi_range,
      }: any) =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_QUOTES}`,
          method: "POST",
          bodyData: {
            quote,
            bookAddress,
            ownerAddress,
            cfi_range,
          },
        }),
    });
    return {
      bookQuotesData,
      bookQuotesLoading,
      bookQuotesMutateAsync,
    };
  };

  public bookPublishMutation = () => {
    const {
      data: bookPublishData,
      isPending: bookPublishDataLoading,
      mutateAsync: bookPublishDataMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_PUBLISH,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookPublishData,
      bookPublishDataLoading,
      bookPublishDataMutationAsync,
    };
  };

  public getPublishedBookQuery = ({ walletAddress, acsTkn, uid }: any) => {
    const {
      data: publishedBookData,
      isLoading: publishedBookDataLoading,
      refetch: publishedBookDataRefetch,
    } = useQuery({
      queryKey: ["getPublishedBookQuery"],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_PUBLISHED}?userAddress=${walletAddress}`,
          method: "GET",
          headers: {
            "user-id": uid,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      publishedBookData,
      publishedBookDataLoading,
      publishedBookDataRefetch,
    };
  };

  public getListingBookQuery = ({ walletAddress, acsTkn, uid }: any) => {
    const {
      data: listingBookData,
      isLoading: listingBookDataLoading,
      refetch: listingBookDataRefetch,
    } = useQuery({
      queryKey: ["getListingBookQuery", walletAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_LISTING}?userAddress=${walletAddress}`,
          method: "GET",
          headers: {
            "user-id": uid,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      listingBookData,
      listingBookDataLoading,
      listingBookDataRefetch,
    };
  };

  public getOwnedBookQuery = ({ walletAddress, acsTkn, uid }: any) => {
    const {
      data: ownedBookData,
      isLoading: ownedBookDataLoading,
      refetch: ownedBookDataRefetch,
    } = useQuery({
      queryKey: ["getOwnedBookQuery"],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_OWNED}?userAddress=${walletAddress}`,
          method: "GET",
          headers: {
            "user-id": uid,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      ownedBookData,
      ownedBookDataLoading,
      ownedBookDataRefetch,
    };
  };

  public getUserBookQuery = ({ bookAddress, walletAddress, headers }: any) => {
    const {
      data: userBookData,
      isLoading: userBookDataLoading,
      refetch: userBookDataRefetch,
    } = useQuery({
      queryKey: ["getUserBookQuery", bookAddress, walletAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.USER_BOOK}?walletAddress=${walletAddress}&bookAddress=${bookAddress}`,
          method: "GET",
          headers: headers,
        }),
    });
    return {
      userBookData,
      userBookDataLoading,
      userBookDataRefetch,
    };
  };
  public getBookOffersQuery = ({ bookAddress, headers }: any) => {
    const {
      data: bookOffersData,
      isLoading: bookOffersDataLoading,
      refetch: bookOffersDataRefetch,
    } = useQuery({
      queryKey: ["getBookOffersQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.BOOK_OFFERS}?bookAddress=${bookAddress}`,
          method: "GET",
          headers: headers,
        }),
    });
    return {
      bookOffersData,
      bookOffersDataLoading,
      bookOffersDataRefetch,
    };
  };

  public getBookReadTimeQuery = ({ bookAddress, headers }: any) => {
    const {
      data: userBookReadTimeData,
      isLoading: userBookReadTimeDataLoading,
      refetch: userBookReadTimeDataRefetch,
    } = useQuery({
      queryKey: ["getBookReadTimeQuery", bookAddress],
      queryFn: async () =>
        await poster({
          url: `${ENDPOINTS.BOOK.USER_READ_TIME}?bookAddress=${bookAddress}`,
          method: "GET",
          headers: headers,
        }),
    });
    return {
      userBookReadTimeData,
      userBookReadTimeDataLoading,
      userBookReadTimeDataRefetch,
    };
  };

  public bookCryptoOrderMutation = () => {
    const {
      data: bookCryptoOrderData,
      isPending: bookCryptoOrderLoading,
      mutateAsync: bookCryptoOrderMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData, headers }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_CRYPTO_ORDER,
          headers: headers,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookCryptoOrderData,
      bookCryptoOrderLoading,
      bookCryptoOrderMutationAsync,
    };
  };

  public bookCryptoOrderFailedMutation = () => {
    const {
      data: bookCryptoOrderFailedData,
      isPending: bookCryptoOrderFailedLoading,
      mutateAsync: bookCryptoOrderFailedMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData, headers }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_CRYPTO_ORDER_FAILED,
          headers: headers,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookCryptoOrderFailedData,
      bookCryptoOrderFailedLoading,
      bookCryptoOrderFailedMutationAsync,
    };
  };

  public bookCryptoMineMutation = () => {
    const {
      data: bookCryptoMineData,
      isPending: bookCryptoMineLoading,
      mutateAsync: bookCryptoMineMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_CRYPTO_MINE,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookCryptoMineData,
      bookCryptoMineLoading,
      bookCryptoMineMutationAsync,
    };
  };

  public bookCopiesMutation = () => {
    const {
      data: bookCopiesData,
      isPending: bookCopiesLoading,
      mutateAsync: bookCopiesMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_COPIES,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookCopiesData,
      bookCopiesLoading,
      bookCopiesMutationAsync,
    };
  };
  public bookPurchaseMutation = () => {
    const {
      data: bookPurchaseData,
      isPending: bookPurchaseLoading,
      mutateAsync: bookPurchaseMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_CRYPTO_PURCHASE,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      bookPurchaseData,
      bookPurchaseLoading,
      bookPurchaseMutationAsync,
    };
  };

  public bookSearchMutation = () => {
    const {
      data: bookSearchData,
      isPending: bookSearchLoading,
      mutateAsync: bookSearchMutationAsync,
    } = useMutation({
      mutationFn: async ({ search }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_SEARCH + "?query=" + search,
          method: "GET",
        }),
    });
    return {
      bookSearchData,
      bookSearchLoading,
      bookSearchMutationAsync,
    };
  };
  public bookDaScoreMutation = () => {
    const {
      data: bookDaScoreData,
      isPending: bookDaScoreLoading,
      mutateAsync: bookDaScoreMutationAsync,
    } = useMutation({
      mutationFn: async ({ ownerAddress, bookAddress }: any) =>
        await poster({
          url: ENDPOINTS.BOOK.BOOK_DA_SCORE,
          method: "GET",
          bodyData: { ownerAddress, bookAddress },
        }),
    });
    return {
      bookDaScoreData,
      bookDaScoreLoading,
      bookDaScoreMutationAsync,
    };
  };
}

export const BOOK = new Book();

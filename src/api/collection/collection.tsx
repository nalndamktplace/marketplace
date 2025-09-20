import { useMutation, useQuery } from "@tanstack/react-query";
import { poster } from "../poster";
import { ENDPOINTS } from "../constant";

export class Collection {
  // login authentication
  public getCollectionGenresQuery = () => {
    const {
      data: collectionGenresData,
      isLoading: collectionGenresLoading,
      refetch: collectionGenresDataRefetch,
    } = useQuery({
      queryKey: ["getCollectionGenresQuery"],
      queryFn: async () =>
        await poster({
          url: ENDPOINTS.COLLECTION.GENRES,
          method: "GET",
        }),
    });
    return {
      collectionGenresData,
      collectionGenresLoading,
      collectionGenresDataRefetch,
    };
  };

  public getTrendingBooksQuery = () => {
    const {
      data: trendingBooksData,
      isLoading: trendingBooksLoading,
      refetch: trendingBooksRefetch,
    } = useQuery({
      queryKey: ["getTrendingBooksQuery"],
      queryFn: async () =>
        await poster({
          url: ENDPOINTS.BOOK.TRENDING_BOOKS,
          method: "GET",
        }),
    });
    return {
      trendingBooksData,
      trendingBooksLoading,
      trendingBooksRefetch,
    };
  };

  public getCollectionQuery = () => {
    const {
      data: collectionData,
      isLoading: collectionLoading,
      refetch: collectionDataRefetch,
    } = useQuery({
      queryKey: ["getCollectionQuery"],
      queryFn: async () =>
        await poster({
          url: ENDPOINTS.COLLECTION.COLLECTION,
          method: "GET",
        }),
    });

    return {
      collectionData,
      collectionLoading,
      collectionDataRefetch,
    };
  };

  public getSpecificCollectionQuery = (collectionId: any) => {
    const {
      data: specifCollectionData,
      isLoading: specifCollectionLoading,
      refetch: specifCollectionRefetch,
    } = useQuery({
      queryKey: ["getSpecificCollectionQuery"],
      queryFn: async () =>
        await poster({
          url:
            ENDPOINTS.COLLECTION.SPECIFIC_COLLECTION + `?cid=${collectionId}`,
          method: "GET",
        }),
    });

    return {
      specifCollectionData,
      specifCollectionLoading,
      specifCollectionRefetch,
    };
  };

  public getSpecificCollectionMutation = () => {
    const {
      data: specifCollectionData,
      isPending: specifCollectionLoading,
      mutateAsync: specifCollectionMutateAsync,
    } = useMutation({
      mutationFn: async ({ collectionId }: any) =>
        await poster({
          url:
            ENDPOINTS.COLLECTION.SPECIFIC_COLLECTION + `?cid=${collectionId}`,
          method: "GET",
        }),
    });

    return {
      specifCollectionData,
      specifCollectionLoading,
      specifCollectionMutateAsync,
    };
  };

  public trendingBookMutation = () => {
    const {
      data: trendingBookMutationData,
      isPending: trendingBookMutationLoading,
      mutateAsync: trendingBookMutationMutateAsync,
    } = useMutation({
      mutationFn: async ({ bodyData }: any) =>
        await poster({
          url: `${ENDPOINTS.BOOK.TRENDING_BOOKS}`,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      trendingBookMutationData,
      trendingBookMutationLoading,
      trendingBookMutationMutateAsync,
    };
  };

  // public getUserOngoingCoursesQuery = ({ userId }: any) => {
  //   const {
  //     data: coursesData,
  //     isLoading: coursesLoading,
  //     refetch: coursesRefetch,
  //   } = useQuery(
  //     ["getUserOngoingCoursesQuery"],
  //     async () =>
  //       await poster({
  //         url: `/api/courses/get-ongoing-courses?user_ID=${userId}`,
  //         method: "GET",
  //       })
  //   );
  //   return {
  //     coursesRefetch,
  //     coursesLoading,
  //     coursesData,
  //   };
  // };
}

export const COLLECTION = new Collection();

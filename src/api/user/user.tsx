import { useMutation, useQuery } from "@tanstack/react-query";
import { poster } from "../poster";
import { ENDPOINTS } from "../constant";

export class User {
  // login authentication
  public userLoginMutation = () => {
    const {
      data: userLoginData,
      isPending: userLoginLoading,
      mutateAsync: userLoginMutationAsync,
    } = useMutation({
      mutationFn: async (bodyData: any) =>
        await poster({
          url: ENDPOINTS.USER.USER_LOGIN,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      userLoginData,
      userLoginLoading,
      userLoginMutationAsync,
    };
  };

  public userProfileEditMutation = () => {
    const {
      data: userLoginData,
      isPending: userEditLoginLoading,
      mutateAsync: userLoginMutationAsync,
    } = useMutation({
      mutationFn: async (bodyData: any) =>
        await poster({
          url: ENDPOINTS.USER.USER_EDIT_PROFILE,
          headers: {
            "user-id": bodyData.uid,
            authorization: `Bearer ${bodyData?.acsTkn}`,
          },
          method: "PUT",
          bodyData: bodyData,
        }),
    });
    return {
      userLoginData,
      userEditLoginLoading,
      userLoginMutationAsync,
    };
  };

  public getUserProfileQuery = ({ userId, acsTkn }: any) => {
    const {
      data: userProfileData,
      isLoading: userProfileLoading,
      refetch: userProfileDataFetch,
    } = useQuery({
      queryKey: ["getUserProfileQuery"],
      queryFn: async () =>
        await poster({
          url: ENDPOINTS.USER.USER_PROFILE,
          method: "GET",
          headers: {
            "user-id": userId,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      userProfileData,
      userProfileLoading,
      userProfileDataFetch,
    };
  };

  public getUserBooksGenres = ({ userId, acsTkn }: any) => {
    const {
      data: userBooksGenresData,
      isLoading: userBooksGenresLoading,
      refetch: userBooksGenresDataFetch,
    } = useQuery({
      queryKey: ["getUserBooksGenres"],
      queryFn: async () =>
        await poster({
          url: ENDPOINTS.COLLECTION.USER_BOOKS_GENRES,
          method: "GET",
          headers: {
            "user-id": userId,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      userBooksGenresData,
      userBooksGenresLoading,
      userBooksGenresDataFetch,
    };
  };

  public checkUserProfileExistMutation = () => {
    const {
      data: userCheckData,
      isPending: userCheckDataLoading,
      mutateAsync: userCheckDataMutationAsync,
    } = useMutation({
      mutationFn: async (bodyData: any) =>
        await poster({
          url: ENDPOINTS.USER.USER_CHECK_USER,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      userCheckData,
      userCheckDataLoading,
      userCheckDataMutationAsync,
    };
  };

  public userWalletConnectMutation = () => {
    const {
      data: userWalletConnectData,
      isPending: userWalletConnectLoading,
      mutateAsync: userWalletConnectMutationAsync,
    } = useMutation({
      mutationFn: async ({ uid, walletAddress, acsTkn }: any) =>
        await poster({
          url: ENDPOINTS.USER.USER_WALLET_CONNECT,
          method: "POST",
          headers: {
            "user-id": uid,
            address: walletAddress,
            authorization: `Bearer ${acsTkn}`,
          },
        }),
    });
    return {
      userWalletConnectData,
      userWalletConnectLoading,
      userWalletConnectMutationAsync,
    };
  };

  public userProfilePictureEditMutation = () => {
    const {
      data: userProfilePictureData,
      isPending: userProfilePictureLoading,
      mutateAsync: userProfilePictureMutationAsync,
    } = useMutation({
      mutationFn: async ({ formData, uid, acsTkn }: any) =>
        await poster({
          url: ENDPOINTS.USER.USER_PICTURE,
          headers: {
            "user-id": uid,
            authorization: `Bearer ${acsTkn}`,
          },
          method: "PUT",
          bodyData: formData,
        }),
    });
    return {
      userProfilePictureData,
      userProfilePictureLoading,
      userProfilePictureMutationAsync,
    };
  };

  public userSurveyFeedbackMutation = () => {
    const {
      data: userSurveyFeedbackData,
      isPending: userSurveyFeedbackLoading,
      mutateAsync: userSurveyFeedbackMutationAsync,
    } = useMutation({
      mutationFn: async ({ bodyData, uid, acsTkn }: any) =>
        await poster({
          url: ENDPOINTS.USER.USER_SURVEY_FEEDBACK,
          headers: {
            "user-id": uid,
            authorization: `Bearer ${acsTkn}`,
          },
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      userSurveyFeedbackData,
      userSurveyFeedbackLoading,
      userSurveyFeedbackMutationAsync,
    };
  };

  public userBookMutation = () => {
    const {
      data: userBookData,
      isPending: userBookLoading,
      mutateAsync: userBookMutationAsync,
    } = useMutation({
      mutationFn: async ({ uid, acsTkn, walletAddress, bookAddress }: any) =>
        await poster({
          url:
            ENDPOINTS.USER.USER_BOOK +
            `?walletAddress=${walletAddress}&bookAddress=${bookAddress}`,
          headers: {
            "user-id": uid,
            address: walletAddress,
            authorization: `Bearer ${acsTkn}`,
          },
          method: "GET",
        }),
    });
    return {
      userBookData,
      userBookLoading,
      userBookMutationAsync,
    };
  };
}

export const USER = new User();

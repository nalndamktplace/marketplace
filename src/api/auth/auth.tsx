import { useMutation } from "@tanstack/react-query";
import { poster } from "../poster";

export class Authentication {
  // login authentication
  public loginAuth = () => {
    const {
      data: loginAuthData,
      isPending: loginAuthLoading,
      mutateAsync: loginAuthentication,
    } = useMutation({
      mutationFn: async (bodyData: any) =>
        await poster({
          url: `/api/singin/singInEmail`,
          method: "POST",
          bodyData: bodyData,
        }),
    });
    return {
      loginAuthLoading,
      loginAuthData,
      loginAuthentication,
    };
  };

  // Register authentication
  // public registerAuth = () => {
  //   const {
  //     data: registerAuthData,
  //     isLoading: registerAuthLoading,
  //     mutateAsync: registerAuthentication,
  //   } = useMutation(
  //     async (bodyData: any) =>
  //       await poster({
  //         url: `/api/singup/singUpEmail`,
  //         method: "POST",
  //         bodyData: bodyData,
  //       })
  //   );
  //   return {
  //     registerAuthentication,
  //     registerAuthData,
  //     registerAuthLoading,
  //   };
  // };
}

export const AUTH = new Authentication();

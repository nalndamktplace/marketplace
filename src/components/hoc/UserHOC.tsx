import { useAuth0, withAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { isUsable } from "../../utils/getUrls";
import { useAccount } from "wagmi";
import { USER } from "../../api/user/user";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "../../store/slice/userManageReducer";
import {
  hideSpinner,
  showSpinner,
} from "../../store/slice/spinnerManageReducer";
import { UserSueryModal } from "../../page/UserSurveyPage";

function UserHOC({ auth0 }: any) {
  const { address } = useAccount();
  const { isAuthenticated } = useAuth0();
  const { userLoginMutationAsync, userLoginLoading } = USER.userLoginMutation();
  const { userCheckDataMutationAsync } = USER.checkUserProfileExistMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (address) {
      if (isUsable(auth0?.user)) {
        const userInfo = auth0?.user;
        const subSocial = userInfo?.sub?.split("|")[0];
        const sub = subSocial + "|" + userInfo?.email;
        let given_name, family_name;
        if (userInfo.name.search(" ") != -1) {
          given_name = userInfo?.name?.split(" ")[0];
          family_name = userInfo?.name?.split(" ")[1];
        } else {
          given_name = userInfo?.name;
          family_name = "";
        }
        const userData = {
          email: userInfo?.email,
          email_verified: true,
          given_name,
          family_name,
          locale: "en",
          name: userInfo?.name,
          nickName: userInfo?.email?.split("@")[0],
          picture: userInfo?.picture,
          sub,
        };
        userCheckDataMutationAsync({ email: userData?.email }).then(() => {
          // if (!res?.isUserExist) {
          userLoginMutationAsync(userData).then((user: any) => {
            dispatch(setUser({ data: user }));
          });
          // }
        });
      }
    }
  }, [auth0, address, isAuthenticated]);

  useEffect(() => {
    if (userLoginLoading) dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [userLoginLoading, dispatch]);

  return <UserSueryModal />;
  // return null;
}

export default withAuth0(UserHOC);

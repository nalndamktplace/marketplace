import { createSlice } from "@reduxjs/toolkit";
import { isFilled } from "../../utils/getUrls";
import { BASE_URL } from "../../api/constant";
import { USER_STATE } from "../../constant/constant";
import { postData } from "../../utils/storage";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

interface UserManageState {
  user:
    | {
        bio: string | null;
        displayPic: string | null;
        email: string | null;
        name: any;
        socialId: string | null;
        socialPic: string | null;
        socialSub: string | null;
        joinedAt: string | null;
        lastUpdate: string | null;
        locale: string | null;
        type: string | null;
        uid: string | null;
        isUserSurvey: boolean | undefined;
        wallet: string | null;
      }
    | undefined;
  tokens: {
    acsTkn: any | null;
    rfsTkn: any | null;
  };
}

const initialState: UserManageState = {
  user: {
    bio: null,
    displayPic: null,
    email: null,
    name: [],
    socialId: null,
    socialPic: null,
    socialSub: null,
    joinedAt: null,
    lastUpdate: null,
    locale: null,
    type: null,
    uid: null,
    isUserSurvey: undefined,
    wallet: null,
  },
  tokens: {
    acsTkn: null,
    rfsTkn: null,
  },
};

const userManageSlice = createSlice({
  name: "userManage",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { data } = action.payload;
      state.user = {
        bio: data.bio,
        displayPic: isFilled(data.display_pic)
          ? BASE_URL + "/files/" + data.display_pic
          : null,
        email: data.email,
        name: [data.first_name, data.last_name],
        socialId: data.social_id,
        socialPic: data.social_pic,
        socialSub: data.social_sub,
        joinedAt: data.joined_at,
        lastUpdate: data.last_update,
        isUserSurvey: data?.isUserSurvey,
        locale: data.locale,
        type: data.type,
        uid: data.uid,
        wallet: data.wallet_address,
      };
      state.tokens.acsTkn = {
        exp: moment(jwtDecode(data.tokens.acsTkn).exp ?? 0 * 1000),
        tkn: data.tokens.acsTkn,
      };
      state.tokens.rfsTkn = {
        exp: moment(jwtDecode(data.tokens?.rfsTkn)?.exp ?? 0 * 1000),
        tkn: data.tokens.rfsTkn,
      };
      postData(USER_STATE, state);
    },
    setUserOnly: (state, action) => {
      const { data } = action.payload;
      state.user = {
        bio: data.bio,
        displayPic: isFilled(data.display_pic)
          ? BASE_URL + "/files/" + data.display_pic
          : null,
        email: data.email,
        name: [data.first_name, data.last_name],
        socialId: data.social_id,
        socialPic: data.social_pic,
        socialSub: data.social_sub,
        joinedAt: data.joined_at,
        lastUpdate: data.last_update,
        isUserSurvey: data?.isUserSurvey,
        locale: data.locale,
        type: data.type,
        uid: data.uid,
        wallet: data.wallet_address,
      };
      postData(USER_STATE, state);
    },
    foundUser: (state, action) => {
      const { data } = action.payload;
      state.user = {
        bio: data.user.bio,
        displayPic: data.user.displayPic,
        email: data.user.email,
        name: data.user.name,
        socialId: data.user.socialId,
        socialPic: data.user.socialPic,
        socialSub: data.user.socialSub,
        joinedAt: data.user.joinedAt,
        lastUpdate: data.user.lastUpdate,
        isUserSurvey: data?.isUserSurvey,
        locale: data.user.locale,
        type: data.user.type,
        uid: data.user.uid,
        wallet: data.user.wallet,
      };
      state.tokens.acsTkn = {
        exp: data.tokens.acsTkn.exp,
        tkn: data.tokens.acsTkn.tkn,
      };
      state.tokens.rfsTkn = {
        exp: data.tokens.rfsTkn.exp,
        tkn: data.tokens.rfsTkn.tkn,
      };
      postData(USER_STATE, state);
    },
    unsetUser: () => {
      // logout()
      return initialState;
    },
  },
});

export const { setUser, unsetUser } = userManageSlice.actions;

export default userManageSlice.reducer;

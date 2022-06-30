import Constants from "../../config/constants";
import { BASE_URL } from "../../config/env";
import { logout, postData } from "../../helpers/storage";
import { SET_USER, UNSET_USER } from "../actions/user";

const initState = {
	user: {
		uid: null,
		name: [],
		bio: null,
		wallet: null,
		lastUpdate: null,
		joinedAt: null,
		displayPic: null
	},
	token: null
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SET_USER:
			const userState = {
				user: {
					uid: action.data.uid,
					name: [action.data.first_name, action.data.last_name],
					bio: action.data.bio,
					wallet: action.data.wallet_address,
					lastUpdate: action.data.last_update,
					joinedAt: action.data.joined_at,
					displayPic: BASE_URL+'/files/'+action.data.display_pic
				},
				token: action.data.token
			}
			postData(Constants.USER_STATE, userState)
			return {
				...state,
				...userState
			}
		case UNSET_USER:
			logout()
			return {
				...state,
				...initState
			}
		default:
			return state
	}
}

export default handleData
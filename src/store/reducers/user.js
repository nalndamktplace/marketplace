import { USER_STATE } from '../../config/constants'
import jwt_decode from 'jwt-decode'
import { BASE_URL } from '../../config/env'
import { isFilled } from '../../helpers/functions'
import { postData } from '../../helpers/storage'
import { FOUND_USER, SET_USER, SET_USER_ONLY, UNSET_USER } from '../actions/user'
import moment from 'moment'

const initState = {
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
		wallet: null,
	},
	tokens: {
		acsTkn: null,
		rfsTkn: null,
	},
}

const handleData = (state = initState, action) => {
	let userState
	switch (action.type) {
		case SET_USER:
			userState = {
				user: {
					bio: action.data.bio,
					displayPic: isFilled(action.data.display_pic) ? BASE_URL + '/files/' + action.data.display_pic : null,
					email: action.data.email,
					name: [action.data.first_name, action.data.last_name],
					socialId: action.data.social_id,
					socialPic: action.data.social_pic,
					socialSub: action.data.social_sub,
					joinedAt: action.data.joined_at,
					lastUpdate: action.data.last_update,
					locale: action.data.locale,
					type: action.data.type,
					uid: action.data.uid,
					wallet: action.data.wallet_address,
				},
				tokens: {
					acsTkn: {
						exp: moment(jwt_decode(action.data.tokens.acsTkn).exp * 1000),
						tkn: action.data.tokens.acsTkn,
					},
					rfsTkn: {
						exp: moment(jwt_decode(action.data.tokens.rfsTkn).exp * 1000),
						tkn: action.data.tokens.rfsTkn,
					},
				},
			}
			postData(USER_STATE, userState)
			return {
				...state,
				...userState,
			}
		case SET_USER_ONLY:
			userState = {
				...state,
				user: {
					bio: action.data.bio,
					displayPic: isFilled(action.data.display_pic) ? BASE_URL + '/files/' + action.data.display_pic : null,
					email: action.data.email,
					name: [action.data.first_name, action.data.last_name],
					socialId: action.data.social_id,
					socialPic: action.data.social_pic,
					socialSub: action.data.social_sub,
					joinedAt: action.data.joined_at,
					lastUpdate: action.data.last_update,
					locale: action.data.locale,
					type: action.data.type,
					uid: action.data.uid,
					wallet: action.data.wallet_address,
				},
			}
			postData(USER_STATE, userState)
			return {
				...state,
				...userState,
			}
		case FOUND_USER:
			userState = {
				user: {
					bio: action.data.user.bio,
					displayPic: action.data.user.displayPic,
					email: action.data.user.email,
					name: action.data.user.name,
					socialId: action.data.user.socialId,
					socialPic: action.data.user.socialPic,
					socialSub: action.data.user.socialSub,
					joinedAt: action.data.user.joinedAt,
					lastUpdate: action.data.user.lastUpdate,
					locale: action.data.user.locale,
					type: action.data.user.type,
					uid: action.data.user.uid,
					wallet: action.data.user.wallet,
				},
				tokens: {
					acsTkn: {
						exp: action.data.tokens.acsTkn.exp,
						tkn: action.data.tokens.acsTkn.tkn,
					},
					rfsTkn: {
						exp: action.data.tokens.rfsTkn.exp,
						tkn: action.data.tokens.rfsTkn.tkn,
					},
				},
			}
			postData(USER_STATE, userState)
			return {
				...state,
				...userState,
			}
		case UNSET_USER:
			// logout()
			return { ...initState }
		default:
			return state
	}
}

export default handleData

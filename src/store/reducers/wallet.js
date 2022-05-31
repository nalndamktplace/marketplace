import { CLEAR_WALLET, SET_WALLET, WEB3_IS_NOT_SUPPORTED, WEB3_IS_SUPPORTED } from "../actions/wallet"

const initState = {
	wallet: null,
	support: null
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SET_WALLET:
			return {
				...state,
				wallet: action.data,
				support: true
			}
		case CLEAR_WALLET:
			return {
				...state,
				wallet: null
			}
		case WEB3_IS_SUPPORTED:
			return {
				...state,
				support: true
			}
		case WEB3_IS_NOT_SUPPORTED:
			return {
				...state,
				support: false,
				wallet: undefined
			}
		default:
			return state
	}
}

export default handleData
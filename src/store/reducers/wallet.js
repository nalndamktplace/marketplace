import { CLEAR_WALLET, SET_WALLET } from "../actions/wallet"

const initState = {
	wallet: null
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SET_WALLET:
			return {
				...state,
				wallet: action.data
			}
		case CLEAR_WALLET:
			return {
				...state,
				wallet: null
			}
		default:
			return state
	}
}

export default handleData
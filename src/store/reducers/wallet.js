import { CLEAR_WALLET, SET_WALLET, WEB3_IS_NOT_SUPPORTED, WEB3_IS_SUPPORTED } from "../actions/wallet"

const initState = {
	wallet: {
		wallet: null,
		provider: null,
		signer: null,
		address: null
	},
	support: null
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SET_WALLET:
			return {
				...state,
				wallet: {
					wallet: action.data.wallet,
					provider: action.data.provider,
					signer: action.data.signer,
					address: action.data.address
				},
				support: true
			}
		case CLEAR_WALLET:
			localStorage.removeItem("wallet")
			localStorage.removeItem("provider")
			localStorage.removeItem("signer")
			localStorage.removeItem("address")
			return initState
		case WEB3_IS_SUPPORTED:
			return {
				...state,
				support: true
			}
		case WEB3_IS_NOT_SUPPORTED:
			return {
				...initState,
				support: false
			}
		default:
			return state
	}
}

export default handleData
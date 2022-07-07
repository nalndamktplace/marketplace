import { ERR_GENERIC_SNACKBAR, ERR_NOT200_SNACKBAR, SET_SNACKBAR, STT_NOT_LOGGED_IN, UNSET_SNACKBAR } from "../actions/snackbar"

const initState = {
	show: false,
	message: null,
	type: null
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SET_SNACKBAR:
			return {
				...state,
				show: action.state.show,
				message: action.state.message,
				type: action.state.type,
			}
		case UNSET_SNACKBAR:
			return {
				...state,
				// ...initState
				show: false,
				message: null,
				type: null
			}
		case ERR_NOT200_SNACKBAR:
			return {
				...state,
				show: true,
				message: "Couldn't connect to server. Please try again later.",
				type: 3
			}
		case ERR_GENERIC_SNACKBAR:
			return {
				...state,
				show: true,
				message: "Something went wrong.",
				type: 4
			}
		case STT_NOT_LOGGED_IN:
			return {
				...state,
				show: true,
				message: "Please login first.",
				type: 3
			}
		default:
			return state
	}
}

export default handleData
import { HIDE_MODAL, SHOW_LIST_MODAL, SHOW_PURCHASE_MODAL } from "../actions/modal"

const initState = {
	type: null,
	show: false
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SHOW_PURCHASE_MODAL:
			return {
				...state,
				show: true,
				type: SHOW_PURCHASE_MODAL
			}
		case SHOW_LIST_MODAL:
			return {
				...state,
				show: true,
				type: SHOW_LIST_MODAL
			}
		case HIDE_MODAL:
			return {
				...state,
				...initState
			}
		default:
			return state
	}
}

export default handleData
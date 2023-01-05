import {SET_SMARTACCOUNT} from '../actions/bwallet'
const initState = {
	smartAccount: null,
}

const handleData = (state = initState, action) => {
	switch (action.type) {
		case SET_SMARTACCOUNT:
			const smartAccountState = action.data.smartAccount
			return {...state, smartAccount: smartAccountState}
		default:
			return state
	}
}

export default handleData
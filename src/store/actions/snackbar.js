import { isUsable } from '../../helpers/functions'

export const SET_SNACKBAR = "SET_SNACKBAR"
export const UNSET_SNACKBAR = "UNSET_SNACKBAR"
export const ERR_NOT200_SNACKBAR = "ERR_NOT200_SNACKBAR"
export const ERR_GENERIC_SNACKBAR = "ERR_GENERIC_SNACKBAR"
export const STT_NOT_LOGGED_IN = "STT_NOT_LOGGED_IN"

export const setSnackbar = data => {
	if(isUsable(data)){
		if(data === 'NOT200') return {type: ERR_NOT200_SNACKBAR}
		else if (data === 'ERROR') return {type: ERR_GENERIC_SNACKBAR}
		else if (data === 'NOT_LOGGED_IN') return {type: STT_NOT_LOGGED_IN}
		else return {type: SET_SNACKBAR, state: data}
	}
}

export const unsetSnackbar = () => {
	return {type: UNSET_SNACKBAR}
}
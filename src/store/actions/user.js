export const SET_USER = "SET_USER"
export const UNSET_USER = "UNSET_USER"

export const setUser = data => { return {data: data, type: SET_USER}}
export const unsetUser = () => { return {type: UNSET_USER}}
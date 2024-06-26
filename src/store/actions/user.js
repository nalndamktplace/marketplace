export const SET_USER = "SET_USER"
export const SET_USER_ONLY = "SET_USER_ONLY"
export const FOUND_USER = "FOUND_USER"
export const UNSET_USER = "UNSET_USER"

export const setUser = data => { return {data: data, type: SET_USER}}
export const setUserOnly = data => { return {data: data, type: SET_USER_ONLY}}
export const foundUser = data => { return {data: data, type: FOUND_USER}}
export const unsetUser = () => { return {type: UNSET_USER}}
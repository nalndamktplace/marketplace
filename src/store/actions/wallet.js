export const SET_WALLET = "SET_WALLET"
export const CLEAR_WALLET = "CLEAR_WALLET"

export const setWallet = data => {return {data: data, type: SET_WALLET}}
export const clearWallet = () => {return {type: CLEAR_WALLET}}
export const SET_WALLET = "SET_WALLET"
export const CLEAR_WALLET = "CLEAR_WALLET"
export const WEB3_IS_SUPPORTED = "WEB3_IS_SUPPORTED"
export const WEB3_IS_NOT_SUPPORTED = "WEB3_IS_NOT_SUPPORTED"

export const setWallet = data => {
	return {data: data, type: SET_WALLET}
}
export const clearWallet = () => {return {type: CLEAR_WALLET}}
export const web3IsSupported = () => {return {type: WEB3_IS_SUPPORTED}}
export const web3IsNotSupported = () => {return {type: WEB3_IS_NOT_SUPPORTED}}
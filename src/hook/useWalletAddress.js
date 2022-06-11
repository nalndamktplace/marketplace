import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Wallet from "../connections/wallet";
import { isUsable } from "../helpers/functions";
import { setSnackbar } from "../store/actions/snackbar";
import { setWallet } from "../store/actions/wallet";

const useWalletAddress = () => {
	const WalletState = useSelector(state => state.WalletState)
	const [WalletAddress, setWalletAddress] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
		if(isUsable(WalletState.wallet)) setWalletAddress(WalletState.wallet)
		else if(WalletState.support === true) {
			Wallet.connectWallet().then(res => {
				setWalletAddress(res.selectedAddress)
				dispatch(setWallet(res.selectedAddress))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
			})
		}
	}, [WalletState])

    return WalletAddress ;
}
 
export default useWalletAddress;
import axios from "axios"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"

import { BASE_URL } from "../../../config/env"

import { isUsable } from "../../../helpers/functions"
import { toHHMMSS } from "../../../helpers/time-formator"
import { setSnackbar } from "../../../store/actions/snackbar"

import { ReactComponent as ClockIcon } from "../../../assets/icons/clock.svg"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

const ReadTime = ({bookMeta, preview}) => {

	const UserState = useSelector(state => state.UserState)
	const WalletState = useSelector(state => state.WalletState)

	const [readTime, setReadTime] = useState(0)
	const [lastUpdate, setLastUpdate] = useState(0)
	const [WalletAddress, setWalletAddress] = useState(null)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		if(isUsable(preview) && !preview){
			if(isUsable(WalletState.wallet.provider)) setWalletAddress(WalletState.wallet.address)
			else navigate(-1)
		}
	}, [WalletState, navigate, preview])

	useEffect(() => {
		if(!preview && isUsable(bookMeta) && isUsable(WalletAddress)){
			axios({
				url: `${BASE_URL}/api/reader/read-time`,
				method: "GET",
				headers: {
					'address': WalletAddress,
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				params: { bookAddress: bookMeta.book_address }
			})
			.then(res => {
				if(res.status === 200) {
					setReadTime(res.data.read_time)
					setLastUpdate(res.data.read_time)
				}
			}).catch(err => {dispatch(setSnackbar('ERROR'))})
		}
	}, [bookMeta, dispatch, WalletAddress, preview, UserState])

	useEffect(()=>{
		if(!isUsable(bookMeta) && !isUsable(WalletAddress)) return
		const updateReadTime = () => {setReadTime(s => s+1)}
		let intervalHandler = setInterval(updateReadTime,1000)
		return () => { clearInterval(intervalHandler) }
	},[bookMeta,WalletAddress])

	useEffect(()=>{
		if(!preview){
			const currentReadTime = readTime
			if(currentReadTime - lastUpdate > 10) {
				axios({
					url: `${BASE_URL}/api/reader/read-time`,
					method: 'PUT',
					headers: {
						'address': WalletAddress,
						'user-id': UserState.user.uid,
						'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
					},
					data : {
						bid: bookMeta.id,
						bookAddress: bookMeta.book_address,
						readTime: currentReadTime
					}
				}).then(res => {
					if(res.status === 200) { setLastUpdate(res.data.read_time) }
				}).catch(err => {dispatch(setSnackbar('ERROR'))})
			}
		}
	},[bookMeta, readTime, WalletAddress, lastUpdate, dispatch, preview, UserState])

	return ( 
		<div className="readtime">
			<ClockIcon width="3rem" height="3rem" stroke="currentColor"/>
			<div className="readtime__time">{toHHMMSS(readTime)}</div>
		</div> 
	)
}

export default ReadTime
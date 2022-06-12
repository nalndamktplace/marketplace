import { useEffect, useState } from "react";
import { isUsable } from "../../../helpers/functions";
import { toHHMMSS } from "../../../helpers/time-formator";
import { ReactComponent as ClockIcon } from "../../../assets/icons/clock.svg";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../config/env";
import { setSnackbar } from "../../../store/actions/snackbar";
import useWalletAddress from "../../../hook/useWalletAddress";

const ReadTime = ({bookMeta}) => {
	const [readTime, setReadTime] = useState(0);
	const [lastUpdate, setLastUpdate] = useState(0);
	const WalletAddress = useWalletAddress();
	const dispatch = useDispatch();

	useEffect(() => {
		if(isUsable(bookMeta) && isUsable(WalletAddress)){
			axios(`${BASE_URL}/api/reader/read-time?bid=${bookMeta.id}&uid=${WalletAddress}`)
			.then(res => {
				if(res.status === 200) {
					setReadTime(res.data.read_time);
					setLastUpdate(res.data.read_time);
				}
			}).catch(err => {dispatch(setSnackbar('ERROR'))})
		}
	}, [bookMeta, dispatch, WalletAddress])

	useEffect(()=>{
		if(!isUsable(bookMeta) && !isUsable(WalletAddress)) return ;
		const updateReadTime = () => {setReadTime(s => s+1);};
		let intervalHandler = setInterval(updateReadTime,1000);
		return () => { clearInterval(intervalHandler); }
	},[bookMeta,WalletAddress])

	useEffect(()=>{
		const currentReadTime = readTime ;
		if(currentReadTime - lastUpdate > 10) {
			axios({
				url: `${BASE_URL}/api/reader/read-time`,
				method: 'PUT',
				data : {
					uid : WalletAddress,
					bid : bookMeta.id,
					read_time : currentReadTime
				}
			}).then(res => {
				if(res.status === 200) { setLastUpdate(res.data.read_time); }
				else console.error("READ TIME UPDATE ERROR")
			}).catch(err => {dispatch(setSnackbar('ERROR'))})
		}
	},[bookMeta, readTime, WalletAddress, lastUpdate, dispatch])

	return ( 
		<div className="readtime">
			<ClockIcon width="3rem" height="3rem" stroke="currentColor"/>
			<div className="readtime__time">{toHHMMSS(readTime)}</div>
		</div> 
	);
}

export default ReadTime;
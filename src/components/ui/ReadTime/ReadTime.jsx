import { useEffect, useState } from "react";
import { isUsable } from "../../../helpers/functions";
import { toHHMMSS } from "../../../helpers/time-formator";
import { ReactComponent as ClockIcon } from "../../../assets/icons/clock.svg";

const ReadTime = ({bookMeta}) => {
	const [readTime, setReadTime] = useState(0);
	useEffect(()=>{
		if (!isUsable(bookMeta)) return;
		const updateReadTime = () => {
			const bookKey = `${bookMeta.id}:readtime` ;
			let stored = parseInt(localStorage.getItem(bookKey));
			if(!isNaN(stored)){
				localStorage.setItem(bookKey,stored+1);
				setReadTime(stored+1);
			} else {
				localStorage.setItem(bookKey,0);
			}
		};
		let intervalHandler = setInterval(updateReadTime,1000);

		return () => {
			clearInterval(intervalHandler);
		}

	},[bookMeta])

	return ( 
		<div className="readtime">
			<ClockIcon width="3rem" height="3rem" stroke="currentColor"/>
			<div className="readtime__time">{toHHMMSS(readTime)}</div>
		</div> 
	);
}

export default ReadTime;
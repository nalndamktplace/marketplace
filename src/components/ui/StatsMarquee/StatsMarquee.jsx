import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { BASE_URL } from '../../../config/env'
import {  isUsable } from '../../../helpers/functions'

function StatsMarquee(){
    const [Analytics, setAnalytics] = useState(null)

    useEffect(() => {
		axios({
			url: `${BASE_URL}/api/analytics/public`,
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setAnalytics(res.data)
		}).catch(err => {})
	}, [])

    const renderAnalytics = () => {
		let analyticsDOM = []
		if(isUsable(Analytics)){
			analyticsDOM.push(<p className='stats-marquee__item'>Titles Listed: {Analytics.titles.toLocaleString()} </p>)
			analyticsDOM.push(<p className='stats-marquee__item'>Copies Sold: {Analytics.copies.toLocaleString()} </p>)
			analyticsDOM.push(<p className='stats-marquee__item'>Hours Read Time: {Analytics.readTime.toLocaleString()} </p>)
			analyticsDOM.push(<p className='stats-marquee__item'>Active Users: {Analytics.users.toLocaleString()} </p>)
		}
		return analyticsDOM
	}

    return (
        <div className='stats-marquee'>
        <marquee scrollamount="4">
			<div className='stats-marquee__content' >
			{renderAnalytics()}
        
		 </div>
        </marquee>
      </div>
    )
}

export default StatsMarquee
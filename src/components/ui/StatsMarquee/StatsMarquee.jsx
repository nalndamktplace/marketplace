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
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)
			analyticsDOM.push(<p className='stats-marquee__ticker'>Titles Listed: {Analytics.titles.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Copies Sold:  {Analytics.copies.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Hours Read:  {Analytics.readTime.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span> Active Users: {Analytics.users.toLocaleString()} <span className='stats-marquee__item'>&#x2022;</span></p>)

		}
		return analyticsDOM
	}

    return (
        <div className='stats-marquee'>	
		{renderAnalytics()}
      </div>
    )
}

export default StatsMarquee
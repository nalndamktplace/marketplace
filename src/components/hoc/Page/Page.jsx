import React from 'react'
import Footer from '../../nav/Footer/Footer'
import Header from '../../nav/Header/Header'

const Page = props => {
	return (
		<div className='page'>
			<Header/>
				<div className="page__wrapper">
					{props.children}
				</div>
			<Footer/>
		</div>
	)
}

export default Page
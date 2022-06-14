import React from 'react'
import Footer from '../../nav/Footer/Footer'
import Header from '../../nav/Header/Header'

const Page = props => {

	const getClasses = () => {
		let classes = ["page__wrapper"]
		if(props.fluid) classes.push("page__wrapper--fluid")
		if(props.containerClass) classes.push(props.containerClass)
		return classes.join(" ")
	}

	return (
		<div className='page'>
			<Header showRibbion={props.showRibbion} noPadding={props.noPadding}/>
			<div className={getClasses()}>
				{props.children}
			</div>
			{props.noFooter?null:<Footer/>}
		</div>
	)
}

export default Page
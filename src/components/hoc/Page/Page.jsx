import React from 'react'
import { useDispatch } from 'react-redux'
import { showModal, SHOW_FEEDBACK_MODAL } from '../../../store/actions/modal'
import FeedbackModal from '../../modal/Feedback/FeedbackModal'

import Footer from '../../nav/Footer/Footer'
import Header from '../../nav/Header/Header'

const Page = props => {

	const dispatch = useDispatch();

	const getClasses = () => {
		let classes = ["page__wrapper"]
		if(props.fluid) classes.push("page__wrapper--fluid")
		if(props.containerClass) classes.push(props.containerClass)
		return classes.join(" ")
	}

	const onFeedback = () => {
		dispatch(showModal(SHOW_FEEDBACK_MODAL));
	}

	return (
		<div className='page'>
			<Header showRibbion={props.showRibbion} noPadding={props.noPadding}/>
			<div className={getClasses()}>
				{props.children}
			</div>
			<div className="page__feedback" onClick={onFeedback}>
				<div className="page__feedback__label">FEEDBACK</div>
			</div>
			{props.noFooter?null:<Footer/>}
			<FeedbackModal/>
		</div>
	)
}

export default Page
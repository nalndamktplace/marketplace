import React from 'react'

const PrimaryButton = props => {

	const onClickHandler = () => {
		props.onClick()
	}

	return (
		<div className='button button--primary' onClick={()=>onClickHandler()}>
			<p className='typo__act typo__color--white'>{props.label}</p>
		</div>
	)
}

export default PrimaryButton
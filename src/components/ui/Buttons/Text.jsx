import React from 'react'

const TextButton = props => {

	const onClickHandler = () => {
		props.onClick()
	}

	return (
		<div className='button' onClick={()=>onClickHandler()}>
			<p className='typo__act'>{props.label}</p>
		</div>
	)
}

export default TextButton
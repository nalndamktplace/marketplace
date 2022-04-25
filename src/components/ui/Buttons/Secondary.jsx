import React from 'react'

const SecondaryButton = props => {

	const onClickHandler = () => {
		props.onClick()
	}

	const getClasses = () => {
		let classes = ["button button--secondary"]
		if(props.theme === 2) classes.push("button--secondary--2")
		else if (props.type === 3) classes.push("button--secondary--3")
		return classes.join(' ')
	}

	return (
		<div className={getClasses()} onClick={()=>onClickHandler()}>
			<p className='typo__act typo--primary'>{props.label}</p>
		</div>
	)
}

export default SecondaryButton
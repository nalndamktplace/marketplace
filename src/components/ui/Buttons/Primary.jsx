import React from 'react'

const PrimaryButton = props => {

	const onClickHandler = () => {
		props.onClick()
	}

	const getClasses = () => {
		let classes = ['button button--primary']
		if(props.theme === 2) classes.push('button--primary--2')
		return classes.join(' ')
	}

	return (
		<div className={getClasses()} onClick={()=>onClickHandler()}>
			<p className='typo__act'>{props.label}</p>
		</div>
	)
}

export default PrimaryButton
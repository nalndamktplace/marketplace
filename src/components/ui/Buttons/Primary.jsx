import React from 'react'

const PrimaryButton = props => {

	const onClickHandler = () => {
		props.onClick()
	}

	const getClasses = () => {
		let classes = ['button button--primary typo__act']
		if(props.theme === 2) classes.push('button--primary--2')
		else if(props.theme === 3) classes.push('button--primary--white')
		return classes.join(' ')
	}

	return (
		<button className={getClasses()} onClick={()=>onClickHandler()}>
			{props.label}
		</button>
	)
}

export default PrimaryButton
import React from 'react'

const PrimaryButton = ({label,theme,onClick,disabled=false}) => {

	const onClickHandler = () => {
		onClick()
	}

	const getClasses = () => {
		let classes = ['button button--primary typo__act']
		if(disabled) classes.push("button--primary--disabled")
		if(theme === 2) classes.push('button--primary--2')
		else if(theme === 3) classes.push('button--primary--white')
		return classes.join(' ')
	}

	return (
		<button className={getClasses()} onClick={()=>onClickHandler()} disabled={disabled}>
			{label}
		</button>
	)
}

export default PrimaryButton
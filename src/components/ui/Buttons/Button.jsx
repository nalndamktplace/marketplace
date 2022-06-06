import React from 'react'

const Button = ({onClick=()=>{},disabled=false,type="",label=""}) => {

	const getClasses = () => {
		let classes = ['button button--primary']
		switch(type){
			case "primary"   : classes.push('button--primary'); break;
			case "secondary" : classes.push('button--secondary'); break;
			case "outline"   : classes.push('button--outline'); break;
			case "text"      : classes.push('button--text'); break;
			case "hollow"    : classes.push('button--hollow'); break;
		}
		return classes.join(' ')
	}

	return (
		<button className={getClasses()} onClick={e=>onClick(e)} disabled={disabled}>
			{label}
		</button>
	)
}

export default Button
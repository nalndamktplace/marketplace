import React from 'react'

const IconButton = ({icon="",onClick}) => {
	return ( <div className="button button--icon" onClick={onClick}>
		{icon}
	</div> )
}

export default IconButton
import React from 'react'

const IconButton = ({icon="",className="",text="",onClick}) => {
	return ( <div className={"button button--icon "+className} onClick={onClick}>
		{text} {icon}
	</div> );
}

export default IconButton
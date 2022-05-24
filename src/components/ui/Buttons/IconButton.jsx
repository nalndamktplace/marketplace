const IconButton = ({icon="",className="",onClick}) => {
    return ( <div className={"button button--icon "+className} onClick={onClick}>
        {icon}
    </div> );
}
 
export default IconButton;
import {ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg";
import IconButton from "../Buttons/IconButton";

const AnnotationContextMenu = ({onColorSelect=()=>{},onClose=()=>{}}) => {

	const colors = [
		"#e6192a",
		"#0080ff",
		"#14b84b",
		"#ffd500",
		"#aa00ff"
	]

	return (
		<div className="annotation-context-menu">
			<div className="annotation-context-menu__container">
				{
					colors.map(c=>(
						<div style={{"--color":c}} key={c} className="annotation-context-menu__container__item" onClick={()=>onColorSelect(c)}></div>
					))
				}
			</div>
			<div className="annotation-context-menu__close">
				<IconButton icon={<CloseIcon width="24" height="24"/>} onClick={onClose}/>
			</div>
		</div>
	);
};

export default AnnotationContextMenu;

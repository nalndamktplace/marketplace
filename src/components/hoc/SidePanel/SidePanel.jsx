const SidePanel = ({ show = false, position = "right", children }) => {
	const getClasses = () => {
		let classes = ["sidepanel"];
		if(show===true) classes.push("sidepanel--open");
		classes.push(`sidepanel--${position}`);
		return classes.join(" ");
	}
	return <div className={getClasses()}>{children}</div>;
};

export default SidePanel;

import { useState } from "react";

const Dropdown = ({ title = "", options = "" }) => {
    const [DropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = (state) => {
        setDropdownOpen(state);
    };

    const getClasses = () => {
        let classes = ["dropdown__options"];
        if (DropdownOpen) classes.push("dropdown__options--open");
        return classes.join(" ");
    };

    const getDropdownClasses = () => {
        let classes = ["dropdown"];
        if (DropdownOpen) classes.push("dropdown--open");
        return classes.join(" ");
    };

    return (
        <div className={getDropdownClasses()} onMouseEnter={()=>toggleDropdown(true)} onMouseLeave={()=>toggleDropdown(false)}>
            <div className="dropdown__title">
                {title}
            </div>
            <div className={getClasses()}>{options}</div>
        </div>
    );
};

export default Dropdown;

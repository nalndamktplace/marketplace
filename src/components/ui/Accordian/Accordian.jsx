import { useState } from "react";
import {ReactComponent as ChevronDownIcon} from "../../../assets/icons/chevron-down.svg";

const Accordian = ({classNames="",header="",options=""}) => {

    const [Open, setOpen] = useState(false);

    return ( 
        <div className={"accordian " + classNames}>
            <div className="accordian__header" onClick={()=>setOpen(s=>!s)}>
                <div className="accordian__header__custom">{header}</div>
                <div className={"accordian__header__toggle " + (Open ? "accordian__header__toggle--open" : "")}>
                    <ChevronDownIcon width={32} height={32} stroke="currentColor" />
                </div>
            </div>
            {Open && (<div className="accordian__options">{options}</div>)}
        </div> 
    );
}
 
export default Accordian;
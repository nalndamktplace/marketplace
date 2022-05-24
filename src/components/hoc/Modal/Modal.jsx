import { useEffect } from "react";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg";
import IconButton from "../../ui/Buttons/IconButton";
import Backdrop from "../Backdrop/Backdrop";

const Modal = ({ title = "", open = false, toggleModal, children }) => {
    useEffect(() => {
        window.document.documentElement.style.overflowY = open ? "hidden" : "auto";
    }, [open]);

    const getClasses = () => {
        let classes = ["modal__wrapper"];
        if (open) classes.push("modal__wrapper--open");
        else classes.push("modal__wrapper--close");
        return classes.join(" ");
    };

    return (
        <Backdrop show={open} hideOnClick={true}>
            <div className={getClasses()}>
                <div className="modal__wrapper__header">
                    <div className="modal__wrapper__header__title typo__head--5">{title}</div>
                    <div className="modal__wrapper__header__close-button">
                        <IconButton
                            icon={<CloseIcon />}
                            onClick={() => {
                                toggleModal(false);
                            }}
                        />
                    </div>
                </div>
                <div className="modal__wrapper__content">{children}</div>
            </div>
        </Backdrop>
    );
};

export default Modal;

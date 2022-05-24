import {ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg";

const AnnotationContextMenu = () => {
    return (
        <div className="annotation-context-menu">
            <div className="annotation-context-menu__container">
                <div className="annotation-context-menu__container__item annotation-context-menu__container__item--red"></div>
                <div className="annotation-context-menu__container__item annotation-context-menu__container__item--blue"></div>
                <div className="annotation-context-menu__container__item annotation-context-menu__container__item--green"></div>
                <div className="annotation-context-menu__container__item annotation-context-menu__container__item--yellow"></div>
                <div className="annotation-context-menu__container__item annotation-context-menu__container__item--purple"></div>
            </div>
            <div className="annotation-context-menu__close">
                <CloseIcon />
            </div>
        </div>
    );
};

export default AnnotationContextMenu;

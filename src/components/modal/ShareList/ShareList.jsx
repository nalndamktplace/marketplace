import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../hoc/Modal/Modal'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import { ReactComponent as TwitterIcon } from "../../../assets/icons/twitter-colored.svg"
import { ReactComponent as FacebookIcon } from "../../../assets/icons/facebook-colored.svg"
import { ReactComponent as WhatsAppIcon } from "../../../assets/icons/whatsapp-colored.svg"
import { ReactComponent as TelegramIcon } from "../../../assets/icons/telegram-colored.svg"
import { ReactComponent as CopyIcon } from "../../../assets/icons/clipboard-copy.svg"
import { hideModal, SHOW_SHARE_MODAL } from '../../../store/actions/modal'
import GaTracker from '../../../trackers/ga-tracker'


const ShareListModal = ({bookID }) => {
    const dispatch = useDispatch()

    const ModalState = useSelector(state => state.ModalState)
    const [Show, setShow] = useState(false)

    useEffect(() => {
        if (ModalState.show === true && ModalState.type === SHOW_SHARE_MODAL) {
            GaTracker('modal_view_share_list')
            setShow(true)
        }
        else setShow(false)
    }, [ModalState])
   
    const modalCloseHandler = state => { if (state === false) dispatch(hideModal()) }


    return (
        <Backdrop show={Show}>
            <Modal title='Share Listed eBook' open={Show} toggleModal={modalCloseHandler} cancellable>
                <div>
                    Copy Link
                </div>
                <div>https://nalnda.com/list/{bookID}</div>
                <CopyIcon onClick={() => navigator.clipboard.writeText(`https://nalnda.com/listbook/${bookID}`)} />
                Share on Social Media
                <div onClick={() => { GaTracker('social_link_twitter'); window.open(`https://twitter.com/intent/tweet?text=Hey,%20Checkout%20this%20Book%20on%20Nalnda!&url=https://nalnda.com/listbook/${bookID}`, "_blank") }} className="footer__row__item__socials__item">
                    <TwitterIcon />
                </div>
                
                <div onClick={() => { GaTracker('social_link_facebook'); window.open(`https://www.facebook.com/sharer.php?u=https://nalnda.com/listbook/${bookID}`, "_blank") }} className="footer__row__item__socials__item">
                    <FacebookIcon />
                </div>
                
                <div onClick={() => { GaTracker('social_link_whatsapp'); window.open(`https://api.whatsapp.com/send?text=https://nalnda.com/listbook/${bookID}`, "_blank") }} className="footer__row__item__socials__item">
                    <WhatsAppIcon />
                </div>
                <div onClick={() => { GaTracker('social_link_telegram'); window.open(`https://telegram.me/share/url?url=https://nalnda.com/listbook/${bookID}&text=Hey,%20Checkout%20this%20Book%20on%20Nalnda`, "_blank") }} className="footer__row__item__socials__item">
                    <TelegramIcon />
                </div>

            </Modal>
        </Backdrop>
    )
}

export default ShareListModal
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../hoc/Modal/Modal'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import InputField from '../../ui/Input/Input'
import { ReactComponent as TwitterIcon } from "../../../assets/icons/twitter-colored.svg"
import { ReactComponent as FacebookIcon } from "../../../assets/icons/facebook-colored.svg"
import { ReactComponent as WhatsAppIcon } from "../../../assets/icons/whatsapp-colored.svg"
import { ReactComponent as TelegramIcon } from "../../../assets/icons/telegram-colored.svg"
import { ReactComponent as CopyIcon } from "../../../assets/icons/clipboard-copy.svg"
import { hideModal, SHOW_SHARE_MODAL } from '../../../store/actions/modal'
import { setSnackbar } from "../../../store/actions/snackbar"
import GaTracker from '../../../trackers/ga-tracker'


const ShareListModal = ({ bookID }) => {
    const dispatch = useDispatch()

    const ModalState = useSelector(state => state.ModalState)
    const [Show, setShow] = useState(false)

    const modalCloseHandler = state => { if (state === false) dispatch(hideModal()) }

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://nalnda.com/listbook/${bookID}`)
        dispatch(setSnackbar({ show: true, message: "Link Copied", type: 1 }))
    }
    useEffect(() => {
        if (ModalState.show === true && ModalState.type === SHOW_SHARE_MODAL) {
            GaTracker('modal_view_share_list')
            setShow(true)
        }
        else setShow(false)
    }, [ModalState])

    return (
        <Backdrop show={Show}>
            <Modal title='Share Listed eBook' open={Show} toggleModal={modalCloseHandler} cancellable>
                <div className="modal__sharelist">
                    <div className='modal__sharelist__field utils__d__flex'>
                        <div className="modal__sharelist__field__input">
                            <InputField readOnly={true} required={false} type="string" value={`https://nalnda.com/listbook/${bookID}`} />
                        </div>
                        <div className="modal__sharelist__field__iconfield utils__cursor--pointer ">
                            <CopyIcon className="modal__sharelist__field__iconfield__copyicon utils__cursor--pointer" onClick={handleCopy} />
                        </div>
                    </div>
                    <div className="utils__margin__top--m">
                        Share on
                        <div className="utils__d__flex utils__justify__center utils__align__center">
                            <div onClick={() => { GaTracker('social_link_twitter'); window.open(`https://twitter.com/intent/tweet?text=Hey,%20Checkout%20this%20Book%20on%20Nalnda!&url=https://nalnda.com/listbook/${bookID}`, "_blank") }} className="footer__row__item__socials__item">
                                <TwitterIcon />
                            </div>

                            <div onClick={() => { GaTracker('social_link_facebook'); window.open(`https://www.facebook.com/sharer.php?u=https://nalnda.com/listbook/${bookID}`, "_blank") }} className="footer__row__item__socials__item">
                                <FacebookIcon />
                            </div>

                            <div onClick={() => { GaTracker('social_link_whatsapp'); window.open(`https://api.whatsapp.com/send?text=Hey,%20Checkout%20this%20Book%20on%20Nalnda%20https://nalnda.com/listbook/${bookID}`, "_blank") }} className="footer__row__item__socials__item">
                                <WhatsAppIcon />
                            </div>
                            <div onClick={() => { GaTracker('social_link_telegram'); window.open(`https://telegram.me/share/url?url=https://nalnda.com/listbook/${bookID}&text=Hey,%20Checkout%20this%20Book%20on%20Nalnda`, "_blank") }} className="footer__row__item__socials__item">
                                <TelegramIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </Backdrop>
    )
}

export default ShareListModal
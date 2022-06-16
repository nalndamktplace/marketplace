import { useEffect, useState } from "react"

import Page from "../components/hoc/Page/Page"
import Button from "../components/ui/Buttons/Button"
import InputField from "../components/ui/Input/Input"

import {ReactComponent as SaveIcon} from "../assets/icons/save.svg"
import {ReactComponent as CameraIcon} from "../assets/icons/camera.svg"
import {ReactComponent as WalletIcon} from "../assets/icons/wallet.svg"
import {ReactComponent as TwitterIcon} from "../assets/icons/twitter.svg"
import GaTracker from "../trackers/ga-tracker"

const ProfilePage = () => {

    const [FormInput, setFormInput] = useState({})

	useEffect(() => { GaTracker('page_view_profile') }, [])

    return ( 
        <Page containerClass='profile'>
            <div className="profile__container">
                <div className="profile__left">
                    <div className="profile__left__avatar"></div>
                    <Button><CameraIcon/>Change</Button>
                </div>
                <div className="profile__details">
                    <div className="profile__details__header">
                        <div className="typo__head--3">Personal Details</div>
                        <Button><SaveIcon/>Save</Button>
                    </div>
                    <div className="profile__details__field">
                        <div className="profile__details__field__label"></div>
                        <InputField type="string" label="fullname" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} description="Enter your full name"/>
                    </div>
                    <div className="profile__details__field">
                        <div className="profile__details__field__label"></div>
                        <InputField type="text" label="bio" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} description="Enter your bio"/>
                    </div>
                    <div className="profile__details__header">
                        <div className="typo__head--3">Wallet</div>
                    </div>
                    <div className="profile__details__connect">
                        <div className="profile__details__connect__icon">
                            <WalletIcon width={32} height={32} stroke="currentColor"/>
                        </div>
                        <div className="profile__details__connect__label typo__head--6">Connect your wallet</div>
                        <Button type="primary">CONNECT</Button>
                    </div>
                    <div className="profile__details__connect">
                        <div className="profile__details__connect__icon">
                            <TwitterIcon width={32} height={32} stroke="currentColor"/>
                        </div>
                        <div className="profile__details__connect__label typo__head--6">Connect your twitter</div>
                        <Button type="primary">CONNECT</Button>
                    </div>
                </div>
                <div className="profile__spacer"></div>
            </div>
        </Page> 
    )
}
 
export default ProfilePage
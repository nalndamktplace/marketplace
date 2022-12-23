import axios from 'axios'
import React, { useRef, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import Page from "../components/hoc/Page/Page"
import Button from "../components/ui/Buttons/Button"
import InputField from "../components/ui/Input/Input"

import {ReactComponent as SaveIcon} from "../assets/icons/save.svg"
import {ReactComponent as CameraIcon} from "../assets/icons/camera.svg"
import {ReactComponent as WalletIcon} from "../assets/icons/wallet.svg"
import {ReactComponent as TwitterIcon} from "../assets/icons/twitter.svg"
import GaTracker from "../trackers/ga-tracker"
import { isFilled, isUsable, isUserLoggedIn, isWalletConnected } from "../helpers/functions"
import { BASE_URL } from '../config/env'
import { setUser, setUserOnly } from '../store/actions/user'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { setWallet } from '../store/actions/wallet'
import Wallet from '../connections/wallet'

const ProfilePage = () => {

	const dispatch = useDispatch()

	const fileInputRef = useRef()

	const UserState = useSelector(state => state.UserState)
	const WalletState = useSelector(state => state.WalletState)

	const [Loading, setLoading] = useState(false)
	const [FormInput, setFormInput] = useState({fullName: '', bio: '', displayPic: null})
	const [DisplayPicUrl, setDisplayPicUrl] = useState(null)

	const saveHandler = () => {
		GaTracker('event_profile_save')
		if(isFilled(FormInput.fullName) && isFilled(FormInput.bio)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/user/profile',
				method: 'PUT',
				headers: {
					'address': WalletState.wallet.address,
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				data: {
					firstName: FormInput.fullName.split(' ')[0],
					lastName: FormInput.fullName.split(' ')[1],
					bio: FormInput.bio
				}
			}).then(res => {
				if(res.status === 200){
					const user = {...res.data, tokens: {acsTkn: UserState.tokens.acsTkn.tkn, rfsTkn: UserState.tokens.rfsTkn.tkn}}
					dispatch(setUser(user))
					dispatch(setSnackbar({show: true, message: "Profile Updated.", type: 1}))
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally( () => setLoading(false))
		}
		else dispatch(setSnackbar({show: true, message: 'Please fill all the details.', type: 2}))
	}

	const walletHandler = () => {
		if(isUsable(WalletState.wallet.wallet))
			WalletState.wallet.wallet.sequence.openWallet()
	}

	const handleFileChange = (e) => {
		if(isFilled(e.target.files)){
			setFormInput(old => {return {...old, displayPic: e.target.files[0]}})
			const formData = new FormData()
			formData.append('displayPic', e.target.files[0])
			axios({
				url: BASE_URL+'/api/user/profile/pic',
				method: 'PUT',
				headers: {
					'address': WalletState.wallet.address,
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				data: formData
			}).then(res => {
				if(res.status === 200){
					dispatch(setUserOnly(res.data))
					dispatch(setSnackbar({show: true, message: "Profile Pic Updated.", type: 1}))
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				if(isUsable(err.response)){
					if(err.response.status === 413) dispatch(setSnackbar('LIMIT_FILE_SIZE'))
					else if(err.response.status === 415) dispatch(setSnackbar('INVALID_FILE_TYPE'))
				}
				else dispatch(setSnackbar('ERROR'))
			}).finally( () => setLoading(false))
		} else {
			setFormInput(old => {return {...old, displayPic: null}})
		}
	}

	const walletOnClickHandler = () => {
		GaTracker('event_profile_wallet')
		if(isWalletConnected(WalletState)){}
		else{
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
			}).catch(err => { })
		}
	}

	useEffect(() => { GaTracker('page_view_profile') }, [])

	useEffect(() => { if(isUsable(FormInput.displayPic)) setDisplayPicUrl(URL.createObjectURL(FormInput.displayPic)) }, [FormInput.displayPic])

	useEffect(() => {
		if(isUserLoggedIn(UserState)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/user/profile',
				method: 'GET',
				headers: {
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				}
			}).then(res => {
				if(res.status === 200){
					setFormInput(old => {return {...old, fullName: isFilled(res.data.first_name)?`${res.data.first_name} ${res.data.last_name}`:'', bio: res.data.bio}})
					if(isFilled(res.data.display_pic)) setDisplayPicUrl(`${BASE_URL}/files/${res.data.display_pic}`)
					else setDisplayPicUrl(res.data.social_pic)
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [UserState, dispatch, WalletState])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

    return ( 
		<>
			<Helmet>
				<meta name='Profile' content='User Profile' />
			</Helmet>
        <Page containerClass='profile'>
            <div className="profile__container">
                <div className="profile__left">
                    <img src={DisplayPicUrl} alt={'Display Pic'} className="profile__left__avatar"></img>
                    <Button onClick={()=>fileInputRef.current?.click()}><CameraIcon/>Change</Button>
					<input className="file-input__hidden-input" type="file" accept='image/*' onChange={handleFileChange} ref={fileInputRef} />
                </div>
                <div className="profile__details">
                    <div className="profile__details__header">
                        <div className="typo__head--4">Personal Details</div>
                        <Button onClick={()=>saveHandler()}><SaveIcon/>Save</Button>
                    </div>
					<InputField type="string" label="fullname" value={isUsable(FormInput.fullName)?FormInput.fullName:''} onChange={e => setFormInput({ ...FormInput, fullName: e.target.value })} description="Enter your full name"/>
					<InputField type="text" label="bio" value={FormInput.bio} onChange={e => {e.target.value.length<1001?setFormInput({ ...FormInput, bio: e.target.value }):dispatch(setSnackbar({show: true, message: "Bio cannot be longer than 1,000 characters.", type: 3}))}} description={`Enter your bio (${isUsable(FormInput.bio)?FormInput.bio.length:0}/1000)`}/>
                    <div className="profile__details__header">
                        <div className="typo__head--4">Connections</div>
                    </div>
                    <div className="profile__details__connect" onClick={()=>walletHandler()}>
                        <div className="profile__details__connect__icon">
                            <WalletIcon width={32} height={32} stroke="currentColor"/>
                        </div>
                        <div className="profile__details__connect__label typo__head--6">Wallet: {WalletState.wallet.address}</div>
                        <Button type="primary" onClick={()=>walletOnClickHandler()}>{isWalletConnected(WalletState)?"open":"Connect"}</Button>
                    </div>
                    <div className="profile__details__connect">
                        <div className="profile__details__connect__icon">
                            <TwitterIcon width={32} height={32} stroke="currentColor"/>
                        </div>
                        <div className="profile__details__connect__label typo__head--6">Connect your Twitter Account</div>
                        <Button type="primary">CONNECT</Button>
                    </div>
                </div>
                <div className="profile__spacer"></div>
            </div>
        </Page> 
		</>
    )
}

export default ProfilePage
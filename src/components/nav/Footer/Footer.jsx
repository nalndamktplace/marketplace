import React from 'react'
import { useNavigate } from 'react-router'

import { GaExternalTracker, GaSocialTracker } from '../../../trackers/ga-tracker'

import {ReactComponent as MediumIcon} from "../../../assets/icons/medium.svg"
import {ReactComponent as TwitterIcon} from "../../../assets/icons/twitter.svg"
import {ReactComponent as TelegramIcon} from "../../../assets/icons/telegram.svg"
import {ReactComponent as Logo} from "../../../assets/logo/solid-no-padding.svg"

const Footer = props => {

	const navigate = useNavigate()
	
	return (
		<footer className='footer typo__color--white'>
			<div className="footer__row">
				<div className="footer__row__item">
					<div className="footer__row__item__logo">
						<Logo width={48} height={48}/>
						<h3 className='typo__head--3 typo__logo typo__logo--white'>NALNDA</h3>
					</div>
				</div>
			</div>
			<div className="footer__row">
				<div className="footer__row__item">
					<div className="footer__row__item__links">
						<p onClick={()=>{GaExternalTracker('mvp');window.open("https://mvp.nalnda.com", "_blank")}} className='footer__row__item__links__item'>MVP</p>
						<p onClick={()=>navigate('/roadmap')} className='footer__row__item__links__item'>Roadmap</p>
						<p onClick={()=>navigate('/tokenomics')} className='footer__row__item__links__item'>Tokenomics</p>
						<p onClick={()=>{GaExternalTracker('whitepaper');window.open("https://docs.nalnda.com/", "_blank")}} className='footer__row__item__links__item'>Whitepaper</p>
					</div>
				</div>
				<div className="footer__row__item">
					<div className="footer__row__item__links">
						<p className='footer__row__item__links__item'>Privacy Policy</p>
						<p className='footer__row__item__links__item'>Terms &amp; Conditions</p>
						<p onClick={()=>{GaExternalTracker('mail');window.open("mailto:contact@nalnda.com", "_self")}} className='footer__row__item__links__item'>Support</p>
					</div>
				</div>
				<div className="footer__row__item">
					<div className="footer__row__item__socials">
						<div onClick={()=>{GaSocialTracker('twitter');window.open("https://twitter.com/nalndamktplace", "_blank")}} className="footer__row__item__socials__item">
							<TwitterIcon />
						</div>
						<div onClick={()=>{GaSocialTracker('medium');window.open("https://nalndamktplace.medium.com", "_blank")}} className="footer__row__item__socials__item">
							<MediumIcon />
						</div>
						<div onClick={()=>{GaSocialTracker('telegram');window.open("https://t.me/nalndamktplace", "_blank")}} className="footer__row__item__socials__item">
							<TelegramIcon />
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
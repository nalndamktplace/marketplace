import React from 'react'

import { useNavigate } from 'react-router'

import TwitterIcon from '../../../assets/icons/twitter.svg'
import MediumIcon from '../../../assets/icons/medium.svg'
import TelegramIcon from '../../../assets/icons/telegram.svg'
import { GaExternalTracker, GaSocialTracker } from '../../../trackers/ga-tracker'

const Footer = props => {

	const navigate = useNavigate()

	return (
		<footer className='footer typo__color--white'>
			<div className="footer__row">
				<div className="footer__row__item"><h3 className='typo__head--2 typo__logo'>Nalnda</h3></div>
			</div>
			<div className="footer__row">
				<div className="footer__row__item">
					<div className="footer__row__item__links">
						<p onClick={()=>{GaExternalTracker('mvp');window.open("https://mvp.nalnda.com", "_blank")}} className='typo__body footer__row__item__links__item'>MVP</p>
						<p onClick={()=>navigate('/roadmap')} className='typo__body footer__row__item__links__item'>Roadmap</p>
						<p onClick={()=>navigate('/tokenomics')} className='typo__body footer__row__item__links__item'>Tokenomics</p>
						<p onClick={()=>{GaExternalTracker('whitepaper');window.open("https://docs.nalnda.com/", "_blank")}} className='typo__body footer__row__item__links__item'>Whitepaper</p>
					</div>
				</div>
				<div className="footer__row__item">
					<div className="footer__row__item__links">
						<p className='typo__body footer__row__item__links__item'>Privacy Policy</p>
						<p className='typo__body footer__row__item__links__item'>Terms &amp; Conditions</p>
						<p onClick={()=>{GaExternalTracker('mail');window.open("mailto:contact@nalnda.com", "_self")}} className='typo__body footer__row__item__links__item'>Support</p>
					</div>
				</div>
				<div className="footer__row__item">
					<div className="footer__row__item__socials">
						<div onClick={()=>{GaSocialTracker('twitter');window.open("https://twitter.com/nalndamktplace", "_blank")}} className="footer__row__item__socials__item">
							<img src={TwitterIcon} alt={"twitter"}/>
						</div>
						<div onClick={()=>{GaSocialTracker('medium');window.open("https://nalndamktplace.medium.com", "_blank")}} className="footer__row__item__socials__item">
							<img src={MediumIcon} alt={"medium"}/>
						</div>
						<div onClick={()=>{GaSocialTracker('telegram');window.open("https://t.me/nalndamktplace", "_blank")}} className="footer__row__item__socials__item">
							<img src={TelegramIcon} alt={"telegram"}/>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../config/env'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import useWallet from './useWallet'

const useRazorpay = () => {
	const UserState = useSelector(state => state.UserState)

	const wallet = useWallet()
	const dispatch = useDispatch()

	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		if (Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	function loadScript(src) {
		return new Promise(resolve => {
			const script = document.createElement('script')
			script.src = src
			script.onload = () => {
				resolve(true)
			}
			script.onerror = () => {
				resolve(false)
			}
			document.body.appendChild(script)
		})
	}

	return {
		collectPayment: async (transactionAmount, bookName, bookAuthor, bookAddress, buyerName, buyerEmail, buyerNumber, onPurchaseHandler) => {
			setLoading(true)
			const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
			setLoading(false)

			if (!res) {
				alert('Razorpay SDK failed to load. Are you online?')
			}

			// creating a new order
			const result = await axios.post(`${BASE_URL}/api/book/fiat/order`, { amount: transactionAmount * 100, currency: 'INR' }, { headers: {} })

			if (!result) {
				alert('Server error. Are you online?')
			}

			// Getting the order details back
			const { amount, id: order_id, currency } = result.data

			const options = {
				key: 'rzp_test_b6S0NAjuFymj4M', // Enter the Key ID generated from the Dashboard
				amount: amount.toString(),
				currency: currency,
				name: 'Nalnda Marketplace',
				description: `${bookName} by ${bookAuthor}`,
				image: 'https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/779d7e7d-76f3-41e7-8e3c-457d77865300/square160',
				order_id: order_id,
				handler: async function (response) {
					setLoading(true)
					const data = {
						orderCreationId: order_id,
						razorpayPaymentId: response.razorpay_payment_id,
						razorpayOrderId: response.razorpay_order_id,
						razorpaySignature: response.razorpay_signature,
						bookAddress,
						bookPrice: transactionAmount,
					}
					const headers = {
						address: wallet.getAddress(),
						'user-id': UserState.user.uid,
						authorization: `Bearer ${UserState.tokens.acsTkn.tkn}`,
					}

					const minting = await axios.post(`${BASE_URL}/api/book/fiat/mint`, data, { headers })
					if (minting.status === 200) {
						dispatch(setSnackbar({ show: true, message: 'Purchase Successful! Book has been added to your library.', type: 1 }))
						onPurchaseHandler()
					} else dispatch(setSnackbar('NOT200'))
					setLoading(false)
				},
				prefill: {
					name: buyerName,
					email: buyerEmail,
					contact: buyerNumber,
				},
				notes: {
					bookAddress: bookAddress,
				},
				theme: {
					color: '#61dafb',
				},
			}

			const paymentObject = new window.Razorpay(options)
			paymentObject.open()
		},
	}
}

export default useRazorpay

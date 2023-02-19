import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'

import { useAccount } from 'wagmi'

import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { GAS_LIMIT, USDC_ADDRESS } from '../config/constants'
import { useSelector } from 'react-redux'
import { isFilled, isUsable } from '../helpers/functions'
import useWallet from './useWallet'
import { ethers } from 'ethers'
import axios from 'axios'
import { setSnackbar } from '../store/actions/snackbar'
import { BASE_URL } from '../config/env'
import Contracts from '../connections/contracts'
import { hideModal } from '../store/actions/modal'
import { MARKET_CONTRACT_ADDRESS } from '../config/contracts'

const useCryptoTransacts = () => {
	const UserState = useSelector(state => state.UserState)
	const BWalletState = useSelector(state => state.BWalletState)

	const wallet = useWallet()
	const dispatch = useDispatch()
	const w3mAccount = useAccount()

	const [Loading, setLoading] = useState(false)

	const headers = { address: wallet.getAddress(), 'user-id': UserState.user.uid, authorization: `Bearer ${UserState.tokens?.acsTkn?.tkn}` }

	let orderId = null

	const BiconomyTransactions = {
		purchase: async (bookAddress, bookPrice, onPurchaseHandler) => {
			try {
				setLoading(true)

				const order = await axios.post(`${BASE_URL}/api/book/crypto/order/wc`, { amount: bookPrice }, { headers })
				if (order.status === 200) orderId = order.data.id

				const approveErc721Interface = new ethers.utils.Interface(['function approve(address spender, uint256 amount)'])
				const address = wallet.getAddress()
				// const approveData = approveErc721Interface.encodeFunctionData( 'approve', [bookAddress, ethers.utils.parseUnits(bookPrice.toString(), 6)] )
				// const approveData = approveErc721Interface.encodeFunctionData( 'approve', [bookAddress, ethers.utils.parseEther(bookPrice.toString())] )
				const approveData = approveErc721Interface.encodeFunctionData('approve', [bookAddress, ethers.utils.parseEther(bookPrice.toString())])
				const approveTx = { to: USDC_ADDRESS, data: approveData }
				const safeMintErc721Interface = new ethers.utils.Interface(['function safeMint(address to)'])
				// const safeMintErc721Interface = new ethers.utils.Interface(['function privateMint(address to, uint256 _mintPrice, uint256 _authorEarningsPaidout)'])
				const safeMintData = safeMintErc721Interface.encodeFunctionData('safeMint', [address])
				// const safeMintData = safeMintErc721Interface.encodeFunctionData('privateMint', [address, ethers.utils.parseEther(bookPrice.toString()), ethers.utils.parseEther(bookPrice.toString())])
				const safeMintTx = { to: bookAddress, data: safeMintData }
				BWalletState.smartAccount.on('txMined', async response => {
					const txHash = response.receipt.transactionHash
					const logs = response.receipt.logs.filter(
						log =>
							log.address === bookAddress &&
							log.topics.length === 4 &&
							isFilled(log.topics.filter(topic => topic === keccak256(toUtf8Bytes('Transfer(address,address,uint256)')) && isFilled(log.topics[log.topics.length - 1])))
					)
					if (isFilled(logs)) {
						axios.post(`${BASE_URL}/api/book/crypto/mine`, { transactionId: orderId, wallet: wallet.getAddress(), hash: txHash }, { headers })

						const tokenId = parseInt(logs[0].topics[logs[0].topics.length - 1])
						axios({
							url: `${BASE_URL}/api/book/copies`,
							method: 'POST',
							data: { bookAddress: bookAddress, copies: tokenId },
						})
							.then(res => {})
							.catch(err => {})
						const data = { ownerAddress: address, bookAddress: bookAddress, tokenId, purchasePrice: bookPrice }
						const purchase = await axios.post(`${BASE_URL}/api/book/purchase`, data, { headers })
						if (purchase.status === 200) onPurchaseHandler()
						else dispatch(setSnackbar('NOT200'))
						setLoading(false)
					}
				})
				BWalletState.smartAccount.on('error', response => {
					axios.post(`${BASE_URL}/api/book/crypto/error/bc`, { transactionId: orderId, error: response }, { headers })
					setLoading(false)
					dispatch(setSnackbar('ERROR'))
				})
				// const transactions = [approveTx]
				const transactions = [safeMintTx]
				// const transactions = [approveTx, safeMintTx]
				const feeQuotes = await BWalletState.smartAccount.prepareRefundTransactionBatch({ transactions })
				const transaction = await BWalletState.smartAccount.createRefundTransactionBatch({ transactions, feeQuote: feeQuotes[1] })
				await BWalletState.smartAccount.sendTransaction({
					tx: transaction,
					gasLimit: { hex: GAS_LIMIT, type: 'hex' },
				})
			} catch (error) {
				axios.post(`${BASE_URL}/api/book/crypto/error/bc`, { transactionId: orderId, error }, { headers })
				setLoading(false)
				dispatch(setSnackbar('ERROR'))
			}
		},
		publish: async (
			coverUrl,
			price,
			secondaryFromInDays,
			languageId,
			genreIDs,
			preview,
			name,
			author,
			cover,
			bookUrl,
			genres,
			ageGroup,
			pages,
			publication,
			synopsis,
			language,
			published,
			secondaryFrom,
			onPublishHandler
		) => {
			try {
				const erc721Interface = new ethers.utils.Interface([
					'function createNewBook(address _author, string memory _coverURI, uint256 _initialPrice, uint256 _daysForSecondarySales, uint256 _lang, uint256[] memory _genre )',
				])
				const address = BWalletState.smartAccount.address
				const data = erc721Interface.encodeFunctionData(
					// 'createNewBook', [address, coverUrl, ethers.utils.parseUnits(price, 6), secondaryFromInDays, languageId, genreIDs]
					'createNewBook',
					[address, coverUrl, ethers.utils.parseEther(price), secondaryFromInDays, languageId, genreIDs]
				)
				const tx = {
					to: MARKET_CONTRACT_ADDRESS,
					data,
				}
				BWalletState.smartAccount.on('txMined', response => {
					response.receipt.logs.forEach(log => {
						log.topics.forEach(topic => {
							if (topic === keccak256(toUtf8Bytes('OwnershipTransferred(address,address)'))) {
								const bookAddress = log.address
								const txHash = response.receipt.transactionHash
								const status = response.receipt.status
								if (isUsable(bookAddress) && isUsable(status) && status === 1 && isUsable(txHash)) {
									let formData = new FormData()
									formData.append('epub', preview)
									formData.append('name', name)
									formData.append('author', author)
									formData.append('cover', coverUrl)
									formData.append('coverFile', cover)
									formData.append('book', bookUrl)
									formData.append('genres', genres)
									formData.append('ageGroup', ageGroup)
									formData.append('price', price)
									formData.append('pages', pages)
									formData.append('publication', publication)
									formData.append('synopsis', synopsis)
									formData.append('language', language)
									formData.append('published', published)
									formData.append('secondarySalesFrom', secondaryFrom)
									formData.append('publisherAddress', wallet.getAddress())
									formData.append('bookAddress', bookAddress)
									formData.append('txHash', txHash)
									axios({
										url: BASE_URL + '/api/book/publish',
										method: 'POST',
										data: formData,
									})
										.then(res4 => {
											if (res4.status === 200) {
												onPublishHandler()
											} else {
												dispatch(setSnackbar('ERROR'))
											}
										})
										.catch(err => {
											if (isUsable(err.response)) {
												if (err.response.status === 413) dispatch(setSnackbar('LIMIT_FILE_SIZE'))
												else if (err.response.status === 415) dispatch(setSnackbar('INVALID_FILE_TYPE'))
											} else dispatch(setSnackbar('NOT200'))
											setLoading(false)
										})
								} else {
									setLoading(false)
									if (!isUsable(txHash)) dispatch(setSnackbar({ show: true, message: 'The transaction to mint eBook failed.', type: 3 }))
									else dispatch(setSnackbar({ show: true, message: `The transaction to mint eBook failed.\ntxhash: ${txHash}`, type: 3 }))
								}
							}
						})
					})
				})
				BWalletState.smartAccount.on('error', response => {
					setLoading(false)
					dispatch(setSnackbar('ERROR'))
				})
				const feeQuotes = await BWalletState.smartAccount.prepareRefundTransaction({ transaction: tx })
				const transaction = await BWalletState.smartAccount.createRefundTransaction({
					transaction: tx,
					feeQuote: feeQuotes[1],
				})
				const sendtransaction = await BWalletState.smartAccount.sendTransaction({
					tx: transaction,
					gasLimit: {
						hex: GAS_LIMIT,
						type: 'hex',
					},
				})
			} catch (error) {
				setLoading(false)
				dispatch(setSnackbar('ERROR'))
			}
		},
	}

	const WalletConnectTransactions = {
		purchase: async (bookAddress, bookPrice, onPurchaseHandler) => {
			const order = await axios.post(`${BASE_URL}/api/book/crypto/order/wc`, { amount: bookPrice }, { headers })
			if (order.status === 200) orderId = order.data.id

			setLoading(true)
			Contracts.purchaseNft(wallet.getAddress(), bookAddress, bookPrice.toString(), wallet.getSigner())
				.then(res => {
					dispatch(setSnackbar({ show: true, message: 'Book purchased.', type: 1 }))
					dispatch(hideModal())
					const tokenId = Number(res.events.filter(event => event.eventSignature === 'Transfer(address,address,uint256)')[0].args[2]._hex)

					axios.post(`${BASE_URL}/api/book/crypto/mine`, { transactionId: orderId, wallet: wallet.getAddress(), hash: res.transactionHash }, { headers })

					axios({
						url: BASE_URL + '/api/book/purchase',
						method: 'POST',
						data: { ownerAddress: wallet.getAddress(), bookAddress: bookAddress, tokenId, purchasePrice: bookPrice },
					})
						.then(res => {
							if (res.status === 200) onPurchaseHandler()
							else dispatch(setSnackbar('NOT200'))
						})
						.catch(err => {
							dispatch(setSnackbar('ERROR'))
						})
						.finally(() => setLoading(false))
					axios({
						url: BASE_URL + '/api/book/copies',
						method: 'POST',
						data: { bookAddress: bookAddress, copies: tokenId },
					})
						.then(res => {})
						.catch(err => {})
				})
				.catch(err => {
					axios.post(`${BASE_URL}/api/book/crypto/error/bc`, { transactionId: orderId, error: err }, { headers })
					setLoading(false)
					if (err.message) {
						if (err?.message?.indexOf('execution reverted: ERC20: transfer amount exceeds balance') > -1)
							dispatch(setSnackbar({ show: true, message: 'You do not have enough USDC to purchase this book. Please visit the faucet to get some.', type: 3 }))
						else if (err?.message?.indexOf('execution reverted: NalndaBook: Book unapproved from marketplace!') > -1)
							dispatch(setSnackbar({ show: true, message: 'The book has not been approved for sales yet. Please try again later.', type: 3 }))
						else if (err.code === 4001) dispatch(setSnackbar({ show: true, message: 'Transaction denied by user.', type: 3 }))
					} else dispatch(setSnackbar('ERROR'))
				})
		},
		publish: (
			coverUrl,
			price,
			secondaryFromInDays,
			languageId,
			genreIDs,
			preview,
			name,
			author,
			cover,
			bookUrl,
			genres,
			ageGroup,
			pages,
			publication,
			synopsis,
			language,
			published,
			secondaryFrom,
			onPublishHandler
		) => {
			try {
				Contracts.listNftForSales(wallet.getAddress(), coverUrl, price, secondaryFromInDays, languageId, genreIDs, wallet.getSigner())
					.then(tx => {
						const bookAddress = tx.events.filter(event => event['event'] === 'OwnershipTransferred')[0].address
						const status = tx.status
						const txHash = tx.transactionHash
						if (isUsable(bookAddress) && isUsable(status) && status === 1 && isUsable(txHash)) {
							let formData = new FormData()
							formData.append('epub', preview)
							formData.append('name', name)
							formData.append('author', author)
							formData.append('cover', coverUrl)
							formData.append('coverFile', cover)
							formData.append('book', bookUrl)
							formData.append('genres', genres)
							formData.append('ageGroup', ageGroup)
							formData.append('price', price)
							formData.append('pages', pages)
							formData.append('publication', publication)
							formData.append('synopsis', synopsis)
							formData.append('language', language)
							formData.append('published', published)
							formData.append('secondarySalesFrom', secondaryFrom)
							formData.append('publisherAddress', wallet.getAddress())
							formData.append('bookAddress', bookAddress)
							formData.append('txHash', txHash)
							axios({
								url: BASE_URL + '/api/book/publish',
								method: 'POST',
								data: formData,
							})
								.then(res4 => {
									if (res4.status === 200) {
										onPublishHandler()
									} else {
										dispatch(setSnackbar('ERROR'))
									}
								})
								.catch(err => {
									if (isUsable(err.response)) {
										if (err.response.status === 413) dispatch(setSnackbar('LIMIT_FILE_SIZE'))
										else if (err.response.status === 415) dispatch(setSnackbar('INVALID_FILE_TYPE'))
									} else dispatch(setSnackbar('NOT200'))
									setLoading(false)
								})
						} else {
							setLoading(false)
							if (!isUsable(txHash)) dispatch(setSnackbar({ show: true, message: 'The transaction to mint eBook failed.', type: 3 }))
							else dispatch(setSnackbar({ show: true, message: `The transaction to mint eBook failed.\ntxhash: ${txHash}`, type: 3 }))
						}
					})
					.catch(err => {
						dispatch(setSnackbar('NOT200'))
						setLoading(false)
					})
			} catch (error) {
				setLoading(false)
				dispatch(setSnackbar('ERROR'))
			}
		},
	}

	useEffect(() => {
		if (Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	return {
		purchaseBook: (bookAddress, bookPrice, onPurchaseHandler) =>
			w3mAccount.isConnected ? WalletConnectTransactions.purchase(bookAddress, bookPrice, onPurchaseHandler) : BiconomyTransactions.purchase(bookAddress, bookPrice, onPurchaseHandler),
		publishBook: (
			coverUrl,
			price,
			secondaryFromInDays,
			languageId,
			genreIDs,
			preview,
			name,
			author,
			cover,
			bookUrl,
			genres,
			ageGroup,
			pages,
			publication,
			synopsis,
			language,
			published,
			secondaryFrom,
			onPublishHandler
		) =>
			w3mAccount.isConnected
				? WalletConnectTransactions.publish(
						coverUrl,
						price,
						secondaryFromInDays,
						languageId,
						genreIDs,
						preview,
						name,
						author,
						cover,
						bookUrl,
						genres,
						ageGroup,
						pages,
						publication,
						synopsis,
						language,
						published,
						secondaryFrom,
						onPublishHandler
				  )
				: BiconomyTransactions.publish(
						coverUrl,
						price,
						secondaryFromInDays,
						languageId,
						genreIDs,
						preview,
						name,
						author,
						cover,
						bookUrl,
						genres,
						ageGroup,
						pages,
						publication,
						synopsis,
						language,
						published,
						secondaryFrom,
						onPublishHandler
				  ),
	}
}

export default useCryptoTransacts

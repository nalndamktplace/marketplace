
import Wallet from "./wallet"

import { PRIMARY_MARKET_CONTRACT_ADDRESS, SECONDARY_MARKET_CONTRACT_ADDRESS, NALNDA_TOKEN_CONTRACT_ADDRESS } from "../config/contracts"

const { ethers } = require('ethers')

const primaryMarket = require('../artifacts/contracts/NalndaBooksPrimarySales.sol/NalndaBooksPrimarySales.json')
const secondaryMarket = require('../artifacts/contracts/NalndaBooksSecondarySales.sol/NalndaBooksSecondarySales.json')
const nalndaToken = require('../artifacts/contracts/mocks/NALNDA.sol/Nalnda.json')
const book = require('../artifacts/contracts/NalndaBook.sol/NalndaBook.json')

const getBooksCount = async function getBooksCount(){
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	let primaryMarketContract = new ethers.Contract(PRIMARY_MARKET_CONTRACT_ADDRESS, primaryMarket.abi, provider)
	const books = await primaryMarketContract.totalBooksCreated()
	return books.toString()
}

const getBooks = async function getBooks (index){
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	let primaryMarketContract = new ethers.Contract(PRIMARY_MARKET_CONTRACT_ADDRESS, primaryMarket.abi, provider)
	const books = await primaryMarketContract.bookAddresses(index)
	return books
}

const listNftForSales = async function listNftForSale(authorAddress, coverUrl, price){
	const connection = Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	let primaryMarketContract = new ethers.Contract(PRIMARY_MARKET_CONTRACT_ADDRESS, primaryMarket.abi, signer)
	let transaction = await primaryMarketContract.createNewBook(authorAddress, coverUrl, ethers.utils.parseEther(price))
	let tx = await transaction.wait()
	return tx
}

const purchaseNft = async function purchaseNft(buyer, bookAddress, amount){
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	const nalndaTokenContract = new ethers.Contract(NALNDA_TOKEN_CONTRACT_ADDRESS, nalndaToken.abi, signer)
	const approval = await nalndaTokenContract.approve(bookAddress, ethers.utils.parseEther(amount))
	const ap = await approval.wait()
	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const transaction = await bookContract.safeMint(buyer)
	const tx = await transaction.wait()
	return tx
}

const getBookUri = async function getBookUri(bookAddress){
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const uri = await bookContract.uri()
	return uri
}

const listBookToMarketplace = async function listBookToMarketplace(bookAddress, bookTokenId, bookPrice) {
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const approval = await bookContract.setApprovalForAll(SECONDARY_MARKET_CONTRACT_ADDRESS, true)
	const ap = await approval.wait()

	const secondaryMarketContract = new ethers.Contract(SECONDARY_MARKET_CONTRACT_ADDRESS, secondaryMarket.abi, signer)
	const listing = await secondaryMarketContract.listCover(bookAddress, bookTokenId, ethers.utils.parseEther(bookPrice))
	return await listing.wait()
}

const unlistBookFromMarketplace = async function unlistBookFromMarketplace(bookOrderId) {
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const secondaryMarketContract = new ethers.Contract(SECONDARY_MARKET_CONTRACT_ADDRESS, secondaryMarket.abi, signer)
	const unlisting = await secondaryMarketContract.unlistCover(bookOrderId)
	return await unlisting.wait()
}

const buyListedCover = async function buyListedCover(bookOrderId, bookPrice) {
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const nalndaTokenContract = new ethers.Contract(NALNDA_TOKEN_CONTRACT_ADDRESS, nalndaToken.abi, signer)
	const approval = await nalndaTokenContract.approve(SECONDARY_MARKET_CONTRACT_ADDRESS, ethers.utils.parseEther(bookPrice.toString()))
	const ap = await approval.wait()

	const secondaryMarketContract = new ethers.Contract(SECONDARY_MARKET_CONTRACT_ADDRESS, secondaryMarket.abi, signer)
	const transaction = await secondaryMarketContract.buyCover(bookOrderId)
	const tx = await transaction.wait()
	return tx
}

const Contracts = {
	nalndaToken,
	primaryMarket,
	secondaryMarket,
	book,
	getBooksCount,
	getBooks,
	listNftForSales,
	purchaseNft,
	getBookUri,
	listBookToMarketplace,
	unlistBookFromMarketplace,
	buyListedCover
}

export default Contracts
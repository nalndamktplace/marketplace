
import Wallet from "./wallet"

import { NALNDA_TOKEN_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS } from "../config/contracts"

const { ethers } = require('ethers')

const marketplace = require('../artifacts/contracts/NalndaMarketplace.sol/NalndaMarketplace.json')
const nalndaToken = require('../artifacts/contracts/mocks/NALNDA.sol/Nalnda.json')
const book = require('../artifacts/contracts/NalndaBook.sol/NalndaBook.json')

const getBooksCount = async function getBooksCount(){
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	let marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, provider)
	const books = await marketplaceContract.totalBooksCreated()
	return books.toString()
}

const getBooks = async function getBooks (index){
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	let marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, provider)
	const books = await marketplaceContract.bookAddresses(index)
	return books
}

// todo check 90 < daysForSecondarySale < 150
// todo 1 <= language <= 100
// todo 1 <= genre <= 60
const listNftForSales = async function listNftForSales(authorAddress, coverUrl, price, daysForSecondarySale, language, genres){
	await Wallet.connectWallet()
	const signer = Wallet.getSigner()
	let marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	let transaction = await marketplaceContract.createNewBook(authorAddress, coverUrl, ethers.utils.parseEther(price), daysForSecondarySale, language, genres)
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

	// const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	// const approval = await bookContract.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true)
	// const ap = await approval.wait()

	const marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	const listing = await marketplaceContract.listCover(bookAddress, bookTokenId, ethers.utils.parseEther(bookPrice))
	return await listing.wait()
}

const unlistBookFromMarketplace = async function unlistBookFromMarketplace(bookOrderId) {
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	const unlisting = await marketplaceContract.unlistCover(bookOrderId)
	return await unlisting.wait()
}

const buyListedCover = async function buyListedCover(bookOrderId, bookPrice) {
	const connection = await Wallet.web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const nalndaTokenContract = new ethers.Contract(NALNDA_TOKEN_CONTRACT_ADDRESS, nalndaToken.abi, signer)
	const approval = await nalndaTokenContract.approve(MARKET_CONTRACT_ADDRESS, ethers.utils.parseEther(bookPrice.toString()))
	const ap = await approval.wait()

	const marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	const transaction = await marketplaceContract.buyCover(bookOrderId)
	const tx = await transaction.wait()
	return tx
}

const Contracts = {
	nalndaToken,
	marketplace,
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
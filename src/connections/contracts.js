
import GaTracker from '../trackers/ga-tracker'

import { NALNDA_TOKEN_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS } from "../config/contracts"

const { ethers } = require('ethers')

const marketplace = require('../artifacts/contracts/NalndaMarketplace.sol/NalndaMarketplace.json')
const nalndaToken = require('../artifacts/contracts/mocks/NALNDA.sol/Nalnda.json')
const book = require('../artifacts/contracts/NalndaBook.sol/NalndaBook.json')

const getBooksCount = async function getBooksCount(){
	GaTracker('event_contracts_get_books_count')
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	let marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, provider)
	const books = await marketplaceContract.totalBooksCreated()
	return books.toString()
}

const getBooks = async function getBooks (index){
	GaTracker('event_contracts_get_books')
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	let marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, provider)
	const books = await marketplaceContract.bookAddresses(index)
	return books
}

const listNftForSales = async function listNftForSales(authorAddress, coverUrl, price, daysForSecondarySale, language, genres, signer){
	GaTracker('event_contracts_list_nft')
	let marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	let transaction = await marketplaceContract.createNewBook(authorAddress, coverUrl, ethers.utils.parseEther(price), daysForSecondarySale, language, genres)
	let tx = await transaction.wait()
	return tx
}

const purchaseNft = async function purchaseNft(buyer, bookAddress, amount, signer){
	GaTracker('event_contracts_purchase_nft')
	const nalndaTokenContract = new ethers.Contract(NALNDA_TOKEN_CONTRACT_ADDRESS, nalndaToken.abi, signer)
	const approval = await nalndaTokenContract.approve(bookAddress, ethers.utils.parseEther(amount))
	const ap = await approval.wait()
	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const transaction = await bookContract.safeMint(buyer)
	const tx = await transaction.wait()
	return tx
}

const getBookUri = async function getBookUri(bookAddress, signer){
	GaTracker('event_contracts_get_book_uri')
	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const uri = await bookContract.uri()
	return uri
}

const listBookToMarketplace = async function listBookToMarketplace(bookAddress, bookTokenId, bookPrice, signer) {
	GaTracker('event_contracts_list_book')
	const marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	const listing = await marketplaceContract.listCover(bookAddress, bookTokenId, ethers.utils.parseEther(bookPrice))
	return await listing.wait()
}

const unlistBookFromMarketplace = async function unlistBookFromMarketplace(bookOrderId, signer) {
	GaTracker('event_contracts_unlist_book')
	const marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	const unlisting = await marketplaceContract.unlistCover(bookOrderId)
	return await unlisting.wait()
}

const buyListedCover = async function buyListedCover(bookOrderId, bookPrice, signer) {
	GaTracker('event_contracts_buy_cover')
	const nalndaTokenContract = new ethers.Contract(NALNDA_TOKEN_CONTRACT_ADDRESS, nalndaToken.abi, signer)
	const approval = await nalndaTokenContract.approve(MARKET_CONTRACT_ADDRESS, ethers.utils.parseEther(bookPrice.toString()))
	const ap = await approval.wait()
	const marketplaceContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketplace.abi, signer)
	const transaction = await marketplaceContract.buyCover(bookOrderId)
	const tx = await transaction.wait()
	return tx
}

const createNewItoBook = async function createNewBook(authorAddress, idos, coverUrl, price, daysForSecondarySale, language, genres, signer) {
	GaTracker('event_contracts_create_ito')
	
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
	buyListedCover,
	createNewItoBook,
}

export default Contracts
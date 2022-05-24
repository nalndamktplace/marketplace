import Web3Modal from "web3modal"
import { PRIMARY_MARKET_CONTRACT_ADDRESS, SECONDARY_MARKET_CONTRACT_ADDRESS, NALNDA_TOKEN_CONTRACT_ADDRESS } from "../config/contracts"

const {ethers, BigNumber} = require('ethers')

const primaryMarket = require('../artifacts/contracts/NalndaBooksPrimarySales.sol/NalndaBooksPrimarySales.json')
const secondaryMarket = require('../artifacts/contracts/NalndaBooksSecondarySales.sol/NalndaBooksSecondarySales.json')
const nalndaToken = require('../artifacts/contracts/mocks/NALNDA.sol/Nalnda.json')
const book = require('../artifacts/contracts/NalndaBook.sol/NalndaBook.json')

const marketProvider = new ethers.providers.Web3Provider(window.ethereum);

const getBooksCount = async function getBooksCount(){
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	let primaryMarketContract = new ethers.Contract(PRIMARY_MARKET_CONTRACT_ADDRESS, primaryMarket.abi, provider)
	const books = await primaryMarketContract.totalBooksCreated()
	return books.toString()
}

const getBooks = async function getBooks (index){
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	let primaryMarketContract = new ethers.Contract(PRIMARY_MARKET_CONTRACT_ADDRESS, primaryMarket.abi, provider)
	const books = await primaryMarketContract.bookAddresses(index)
	return books
}

const listNftForSales = async function listNftForSale(authorAddress, coverUrl, price){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	let primaryMarketContract = new ethers.Contract(PRIMARY_MARKET_CONTRACT_ADDRESS, primaryMarket.abi, signer)
	let transaction = await primaryMarketContract.createNewBook(authorAddress, coverUrl, ethers.utils.parseEther(price))
	let tx = await transaction.wait()
	return tx
}

const purchaseNft = async function purchaseNft(buyer, bookAddress, amount){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
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

const getWalletAddress = async function getWalletAddress(){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	return signer.getAddress()
}

const connectWallet = async function connectWallet(){
	return await window.ethereum.enable()
}

const getBookUri = async function getBookUri(bookAddress){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const uri = await bookContract.uri()
	return uri
}

const listBookToMarketplace = async function listBookToMarketplace(bookAddress, bookTokenId, bookPrice) {
	console.log({bookAddress, bookTokenId, bookPrice})
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const bookContract = new ethers.Contract(bookAddress, book.abi, signer)
	const approval = await bookContract.setApprovalForAll(SECONDARY_MARKET_CONTRACT_ADDRESS, true);
	console.log({approval})
	const ap = await approval.wait()
	console.log({ap})

	const secondaryMarketContract = new ethers.Contract(SECONDARY_MARKET_CONTRACT_ADDRESS, secondaryMarket.abi, signer)
	const listing = await secondaryMarketContract.listCover(bookAddress, bookTokenId, ethers.utils.parseEther(bookPrice))

	return listing
}

const buyListedCover = async function buyListedCover(bookAddress, bookOrderId, bookPrice) {
	console.log({bookAddress, bookOrderId, bookPrice})

	const anotherSecond = new ethers.Contract(SECONDARY_MARKET_CONTRACT_ADDRESS, secondaryMarket.abi, marketProvider)
	console.log({res: await anotherSecond.ORDER(1)})

	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()

	const nalndaTokenContract = new ethers.Contract(NALNDA_TOKEN_CONTRACT_ADDRESS, nalndaToken.abi, signer)
	const approval = await nalndaTokenContract.approve(SECONDARY_MARKET_CONTRACT_ADDRESS, bookPrice)
	const ap = await approval.wait()

	const secondaryMarketContract = new ethers.Contract(SECONDARY_MARKET_CONTRACT_ADDRESS, secondaryMarket.abi, signer)
	const transaction = await secondaryMarketContract.buyCover(1)
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
	buyListedCover,
	Wallet: {
		getWalletAddress,
		connectWallet
	}
}

export default Contracts
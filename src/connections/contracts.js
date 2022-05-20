import Web3Modal from "web3modal"
import { MARKET_CONTRACT_ADDRESS, NALNDA_CONTRACT_ADDRESS } from "../config/contracts"

const ethers = require('ethers')

const Market = require('../artifacts/contracts/NalndaBooksPrimarySales.sol/NalndaBooksPrimarySales.json')
const Nalnda = require('../artifacts/contracts/mocks/NALNDA.sol/Nalnda.json')
const Book = require('../artifacts/contracts/NalndaBook.sol/NalndaBook.json')

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner()
const marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, Market.abi, provider)
const nalndaContract = new ethers.Contract(NALNDA_CONTRACT_ADDRESS, Nalnda.abi, provider)

const getBooksCount = async function getBooksCount(){
	let _contract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, Market.abi, provider)
	const books = await _contract.totalBooksCreated()
	return books.toString()
}

const getBooks = async function getBooks (index){
	let _contract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, Market.abi, provider)
	const books = await _contract.bookAddresses(index)
	return books
}

const listNftForSales = async function listNftForSale(address, coverUrl, price){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	let contract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, Market.abi, signer)
	let transaction = await contract.createNewBook(address, coverUrl, ethers.utils.parseEther(price))
	let tx = await transaction.wait()
	return tx
}

const purchaseNft = async function purchaseNft(buyer, bookAddress, amount){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	const NalndaContract = new ethers.Contract(NALNDA_CONTRACT_ADDRESS, Nalnda.abi, signer)
	const approval = await NalndaContract.approve(bookAddress, ethers.utils.parseEther(amount))
	const ap = await approval.wait()
	const contract = new ethers.Contract(bookAddress, Book.abi, signer)
	const transaction = await contract.safeMint(buyer)
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

const getBookUri = async function getBookUri(address){
	const web3Modal = new Web3Modal()
	const connection = await web3Modal.connect()
	const provider = new ethers.providers.Web3Provider(connection)
	const signer = provider.getSigner()
	const contract = new ethers.Contract(address, Book.abi, signer)
	const uri = await contract.uri()
	return uri
}

const Contracts = {
	provider,
	signer,
	nalndaContract,
	marketContract,
	Nalnda,
	Market,
	getBooksCount,
	getBooks,
	listNftForSales,
	purchaseNft,
	getBookUri,
	Wallet: {
		getWalletAddress,
		connectWallet
	}
}

export default Contracts
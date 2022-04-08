import axios from 'axios'
// import Wallet from '../helpers/wallet'
import Web3Modal from "web3modal"

const ethers = require('ethers')

const Market = require('../artifacts/contracts/NFTMarket.sol/NFTMarket.json')
const Nft = require('../artifacts/contracts/NFT.sol/NFT.json')

const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_CONTRACTS_URI)
const signer = provider.getSigner()
const tokenContract = new ethers.Contract('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', Nft.abi, provider)
const marketContract =  new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', Market.abi, provider)

const getNfts = marketContract.functions.fetchMarketItems()

const loadNfts = async function loadNFTs() {
    const data = await marketContract.fetchMarketItems()
    const items = await Promise.all(data.map(async i => {
		const tokenUri = await tokenContract.tokenURI(i.tokenId)
		const meta = await axios.get(tokenUri)
		let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
		let item = {
			price,
			tokenId: i.tokenId.toNumber(),
			seller: i.seller,
			owner: i.owner,
			image: meta.data.image,
			name: meta.data.name,
			description: meta.data.description,
		}
		return item
    }))
    return items
}

const buyNft = async function buyNft(nft){
	const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
	// const signer = Wallet.getSigner()
	const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', Market.abi, signer)
	const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
	const transaction = await contract.createMarketSale(nft.tokenId, { value: price })
	await transaction.wait()
}

const listNftForSales = async function listNftForSale(url, formInput){
	const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
	// const signer = Wallet.getSigner()
	let contract = new ethers.Contract('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', Nft.abi, signer)
	let transaction = await contract.createToken(url)
	let tx = await transaction.wait()
	let event = tx.events[0]
	let value = event.args[2]
	let tokenId = value.toNumber()

	const price = ethers.utils.parseUnits(formInput.price, 'ether')
	contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', Market.abi, signer)
	let listingPrice = await contract.getListingPrice()
	listingPrice = listingPrice.toString()
	transaction = await contract.createMarketItem('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', tokenId, price, { value: listingPrice })
	await transaction.wait()
}

const Contracts = {
	provider,
	signer,
	tokenContract,
	marketContract,
	Nft,
	Market,
	getNfts: getNfts,
	loadNfts,
	buyNft,
	listNftForSales
}

export default Contracts
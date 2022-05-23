const { ethers } = require("hardhat")

describe("NFTMarket", function () {
	it("Should create and execute market sales", async function () {
		const Market = await ethers.getContractFactory("NFTMarket")
		const market = await Market.deploy()
		await market.deployed()
		const marketAddress = market.address

		const Cover = await ethers.getContractFactory("Cover")
		const cover = await Cover.deploy(marketAddress)
		await cover.deployed()
		const coverAddress = cover.address

		const Book = await ethers.getContractFactory("Book")
		const book = await Book.deploy(marketAddress)
		await book.deployed()
		const bookAddress = cover.address

		let listingPrice = await market.getListingPrice()
		listingPrice = listingPrice.toString()

		const auctionPrice = ethers.utils.parseUnits('100', 'ether')

		console.log({tokenIds: await cover._tokenIds()})

		await cover.createToken("https://www.mytokenlocation1.com", 10)
		await cover.createToken("https://www.mytokenlocation2.com", 10)

		await book.createToken("https://www.mytokenlocation1.com")
		await book.createToken("https://www.mytokenlocation2.com")

		await market.createMarketItem(coverAddress, bookAddress, 1, 1, auctionPrice, 10, {value: listingPrice},)
		await market.createMarketItem(coverAddress, bookAddress, 2, 2, auctionPrice, 10, {value: listingPrice},)

		const [_, buyersAddress] = await ethers.getSigners()

		console.log({tokenIds: await cover._tokenIds()})

		await market.connect(buyersAddress).createMarketSale(coverAddress, 1, 2, {value: auctionPrice})

		const items = await market.fetchMarketItems()

		console.log({items})

	});
});

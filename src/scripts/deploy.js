const hre = require("hardhat")

async function main() {

	const NalndaBooksPrimarySales = await hre.ethers.getContractFactory("NalndaBooksPrimarySales")
	const primarySales = await NalndaBooksPrimarySales.deploy('0x1Dd5Ee08A759059E0E7734C9d2e4FEde0eD5F865')
	await primarySales.deployed()
	console.log("NalndaBooksPrimarySales deployed to:", primarySales.address)

	const NalndaBooksSecondarySales = await hre.ethers.getContractFactory("NalndaBooksSecondarySales")
	const secondarySales = await NalndaBooksSecondarySales.deploy('0x1Dd5Ee08A759059E0E7734C9d2e4FEde0eD5F865')
	await secondarySales.deployed()
	console.log("NalndaBooksSecondarySales deployed to:", secondarySales.address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

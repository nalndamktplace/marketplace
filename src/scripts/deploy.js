const hre = require("hardhat")
require('dotenv').config()

async function main() {

	const NalndaBooksPrimarySales = await hre.ethers.getContractFactory("NalndaBooksPrimarySales");
    const primarySales = await NalndaBooksPrimarySales.deploy('0x1Dd5Ee08A759059E0E7734C9d2e4FEde0eD5F865');
    await primarySales.deployed();
    console.log("NalndaBooksPrimarySales deployed to:", primarySales.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

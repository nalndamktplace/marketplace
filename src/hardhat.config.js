require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
	networks: {
		hardhat: {
			chainId: 1337
		},
		mumbaiInfura: {
			url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
		},
		mumbaiAlchemy: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_PROJECT_ID}`,
			accounts: [`${process.env.PRIVATE_KEY}`]
		}
	},
	solidity: "0.8.13",
};

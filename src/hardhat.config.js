require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const WALLET_KEY = process.env.PRIVATE_KEY
const ALCHEMY_ID = process.env.ALCHEMY_PROJECT_ID
const INFURA_ID = process.env.INFURA_PROJECT_ID

module.exports = {
	networks: {
		hardhat: {
			chainId: 1337
		},
		mumbaiInfura: {
			url: `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
		},
		mumbaiAlchemy: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`,
			accounts: [WALLET_KEY]
		}
	},
	solidity: "0.8.13",
};

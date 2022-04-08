require("@nomiclabs/hardhat-waffle");

const projectId = process.env.REACT_APP_NET_PROJECT_ID

module.exports = {
	networks: {
		hardhat: {
			chainId: 1337
		},
		mumbai: {
			url: "https://polygon-mumbai.infura.io/v3/"+projectId
		}
	},
	solidity: "0.8.13",
};
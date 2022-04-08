const IpfsClient = require('ipfs-http-client')

const ipfsClient = IpfsClient.create(process.env.REACT_APP_IPFS_ENDPOINT)

module.exports = {
	IpfsClient: ipfsClient
}
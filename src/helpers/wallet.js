import { sequence } from '0xsequence'

const wallet = new sequence.Wallet()

const Wallet = {
	connect : () => {return (
		wallet.connect({
			app: 'Nalnda Marketplace',
			authorize: true,
			settings: {
				theme: "light",
				includedPaymentProviders: ["moonpay", "ramp"],
				defaultFundingCurrency: "matic",
				lockFundingCurrencyToDefault: false,
			}
		}))
	},
	open: () => {
		wallet.openWallet()
	},
	disconnect: () => {
		wallet.disconnect()
	}
}

export default Wallet
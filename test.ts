import { JsonRpcProvider} from '@mysten/sui.js'

async function main () {
	const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io', {
		// you can also skip providing this field if you don't plan to interact with the faucet
		faucetURL: 'https://faucet.devnet.sui.io/gas'
	})
	// get tokens from a custom faucet server
	await provider.requestSuiFromFaucet(
		'0xec20b6f4d83acfe0a8cd0ea1fe3df274c3fb1c74'
	)
}
main()

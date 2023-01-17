import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { Auth0Provider } from '@auth0/auth0-react'

import '@biconomy/web3-auth/dist/src/style.css'

import './main.scss'

import { Grid } from 'react-spinners-css'

import { Web3Modal } from '@web3modal/react'
import { polygonMumbai } from 'wagmi/chains'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'

import Spinner from './components/ui/Spinner/Spinner'
import Snackbar from './components/ui/Snackbar/Snackbar'

import UserReducer from './store/reducers/user'
import ModalReducer from './store/reducers/modal'
import SpinnerReducer from './store/reducers/spinner'
import SnackbarReducer from './store/reducers/snackbar'
import DarkModeReducer from './store/reducers/darkmode'
import BWalletReducer from './store/reducers/bwallet'

import IndexPage from './pages/Index'
//	/*	Page to debug App
//		Uncomment the lines below to activate page	*/
// import InterfaceDebugPage from './Debug/Interface'
// import WalletDebugPage from './Debug/Wallet'

import UserHOC from './components/hoc/User/UserHOC'
import WalletHOC from './components/hoc/Wallet/WalletHOC'
import ScrollToTop from './components/hoc/ScrollToTop/ScrollToTop'
import ProtectedRoute from './components/hoc/ProtectedRoute/ProtectedRoute'
import SelectWalletModal from './components/modal/Wallet/SelectWallet'

const BookPage = React.lazy(() => import('./pages/Book'))
const ReaderPage = React.lazy(() => import('./pages/Reader'))
const ExplorePage = React.lazy(() => import('./pages/Explore'))
const LibraryPage = React.lazy(() => import('./pages/Library'))
const ProfilePage = React.lazy(() => import('./pages/Profile'))
const ItoPublishPage = React.lazy(() => import('./pages/Ito'))
const PublishNftPage = React.lazy(() => import('./pages/Publish'))
const CollectionPage = React.lazy(() => import('./pages/Collection'))
const PrivacyPolicyPage = React.lazy(() => import('./pages/Policies/Privacy'))
const TermsConditionPage = React.lazy(() => import('./pages/Policies/Terms'))
const RefundPolicyPage = React.lazy(() => import('./pages/Policies/Refund'))
const ListedBookPage = React.lazy(() => import('./pages/ListedBook'))

const rootReducer = combineReducers({
	UserState: UserReducer,
	ModalState: ModalReducer,
	// WalletState: WalletReducer,
	SpinnerState: SpinnerReducer,
	SnackbarState: SnackbarReducer,
	DarkModeState: DarkModeReducer,
	BWalletState: BWalletReducer,
})

const store = createStore(rootReducer)

function App() {
	let navigate = useNavigate()

	const onRedirectCallback = appState => {
		navigate(appState?.returnTo || window.location.pathname)
	}

	const chains = [polygonMumbai]
	// Wagmi client
	const { provider } = configureChains(chains, [walletConnectProvider({ projectId: '41001854cb342b1dddae9c5ab115e900' })])
	const wagmiClient = createClient({
		autoConnect: true,
		connectors: modalConnectors({ appName: 'Nalnda Marketplace', chains }),
		provider,
	})
	// Web3Modal Ethereum Client
	const ethereumClient = new EthereumClient(wagmiClient, chains)

	return (
		<>
			<WagmiConfig client={wagmiClient}>
				<Auth0Provider
					domain={process.env.REACT_APP_AUTH0_DOMAIN}
					clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
					redirectUri={window.location.origin}
					onRedirectCallback={onRedirectCallback}>
					<div className='typo'>
						<Provider store={store}>
							<ScrollToTop>
								<Suspense
									fallback={
										<div className={'spinner spinner--show'}>
											<div className='spinner__container'>
												<Grid color='#00a2e8' />
											</div>
										</div>
									}>
									<Routes>
										<Route path='/*' element={<IndexPage />} />
										<Route path='/' element={<IndexPage />} />
										<Route path='/book/:bookID' element={<BookPage />} />
										<Route path='/book/preview' element={<ReaderPage />} />
										<Route path='/listbook/:bookID' element={<ListedBookPage />} />
										<Route path='/publish' element={<ProtectedRoute element={<PublishNftPage />} />} />
										<Route path='/publish/ito' element={<ProtectedRoute element={<ItoPublishPage />} />} />
										<Route path='/explore' element={<ExplorePage />} />
										<Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />} />
										<Route path='/library' element={<ProtectedRoute element={<LibraryPage />} />} />
										<Route path='/collection' element={<CollectionPage />} />
										<Route path='/library/reader' element={<ReaderPage />} />
										<Route path='/policy/terms' element={<TermsConditionPage />} />
										<Route path='/policy/privacy' element={<PrivacyPolicyPage />} />
										<Route path='/policy/refund' element={<RefundPolicyPage />} />
										{/* <Route path='/debug/interface' element={<InterfaceDebugPage />}/> */}
										{/* <Route path='/debug/wallet' element={<WalletDebugPage/>}/> */}
									</Routes>
								</Suspense>
							</ScrollToTop>
							<Snackbar />
							<Spinner />
							<WalletHOC />
							<UserHOC />
							<SelectWalletModal />
						</Provider>
					</div>
				</Auth0Provider>
			</WagmiConfig>
			<Web3Modal projectId='41001854cb342b1dddae9c5ab115e900' ethereumClient={ethereumClient} />
		</>
	)
}

export default App

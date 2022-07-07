import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { GoogleOAuthProvider } from '@react-oauth/google'

import './main.scss'

import Spinner from './components/ui/Spinner/Spinner'
import Snackbar from './components/ui/Snackbar/Snackbar'

import UserReducer from './store/reducers/user'
import ModalReducer from './store/reducers/modal'
import WalletReducer from './store/reducers/wallet'
import SpinnerReducer from './store/reducers/spinner'
import SnackbarReducer from './store/reducers/snackbar'
import DarkModeReducer from './store/reducers/darkmode'

import IndexPage from './pages/Index'
import BookPage from './pages/Book'
import ReaderPage from './pages/Reader'
import LibraryPage from './pages/Library'
import ExplorePage from './pages/Explore'
import ProfilePage from './pages/Profile'
import PublishNftPage from './pages/Publish'
import CollectionPage from './pages/Collection'
//	/*	Page to debug App
//		Uncomment the lines below to activate page	*/
// import InterfaceDebugPage from './Debug/Interface'
// import WalletDebugPage from './Debug/Wallet'

import WalletHOC from './components/hoc/Wallet/WalletHOC'
import ScrollToTop from './components/hoc/ScrollToTop/ScrollToTop'
import ProtectedRoute from './components/hoc/ProtectedRoute/ProtectedRoute'
import LoginModal from './components/modal/Login/Login'

const rootReducer = combineReducers({
	UserState: UserReducer,
	ModalState: ModalReducer,
	WalletState: WalletReducer,
	SpinnerState: SpinnerReducer,
	SnackbarState: SnackbarReducer,
	DarkModeState : DarkModeReducer
})

const store = createStore(rootReducer)

function App() {
	return (
		<div className="typo">
			<Provider store={store}>
				<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
					<Router>
						<ScrollToTop>
							<Routes>
								<Route path='/*' element={<IndexPage/>}/>
								<Route path='/' element={<IndexPage/>}/>
								<Route path='/book' element={<BookPage/>}/>
								<Route path='/book/preview' element={<ReaderPage/>}/>
								<Route path='/publish' element={<ProtectedRoute element={<PublishNftPage/>} />}/>
								<Route path='/explore' element={<ExplorePage/>}/>
								<Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />}/>
								<Route path='/library' element={<ProtectedRoute element={<LibraryPage />} />}/>
								<Route path='/collection' element={<CollectionPage/>}/>
								<Route path='/library/reader' element={<ReaderPage/>}/>
								{/* <Route path='/debug/interface' element={<InterfaceDebugPage />}/> */}
								{/* <Route path='/debug/wallet' element={<WalletDebugPage/>}/> */}
							</Routes>
						</ScrollToTop>
					</Router>
					<Snackbar/>
					<Spinner/>
					<WalletHOC/>
					<LoginModal/>
				</GoogleOAuthProvider>
			</Provider>
		</div>
	)
}

export default App

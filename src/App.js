import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './main.scss'

import Spinner from './components/ui/Spinner/Spinner'
import Snackbar from './components/ui/Snackbar/Snackbar'

import ModalReducer from './store/reducers/modal'
import WalletReducer from './store/reducers/wallet'
import SpinnerReducer from './store/reducers/spinner'
import SnackbarReducer from './store/reducers/snackbar'
import DarkModeReducer from './store/reducers/darkmode'

import IndexPage from './pages/Index'
import BookPage from './pages/Book'
import ReaderPage from './pages/Reader'
import AccountPage from './pages/Account'
import ExplorePage from './pages/Explore'
import ProfilePage from './pages/Profile'
import PublishNftPage from './pages/Publish'
//	/*	Page to debug App
//		Uncomment the line below to activate page	*/
// import DebugPage from './pages/Debug'

import WalletHOC from './components/hoc/Wallet/WalletHOC'
import ProtectedRoute from './components/hoc/ProtectedRoute/ProtectedRoute'

const rootReducer = combineReducers({
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
				<Router>
					<Routes>
						<Route path='/*' element={<IndexPage/>}/>
						<Route path='/' element={<IndexPage/>}/>
						<Route path='/book' element={<BookPage/>}/>
						<Route path='/book/preview' element={<ReaderPage/>}/>
						<Route path='/publish' element={<ProtectedRoute element={<PublishNftPage/>} />}/>
						<Route path='/explore' element={<ExplorePage/>}/>
						<Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />}/>
						<Route path='/account' element={<ProtectedRoute element={<AccountPage />} />}/>
						<Route path='/account/reader' element={<ReaderPage/>}/>
						{/* <Route path='/debug' element={<DebugPage />}/> */}
					</Routes>
				</Router>
				<Snackbar/>
				<Spinner/>
				<WalletHOC/>
			</Provider>
		</div>
	)
}

export default App

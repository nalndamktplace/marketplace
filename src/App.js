import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './main.scss'

import Spinner from './components/ui/Spinner/Spinner'
import Snackbar from './components/ui/Snackbar/Snackbar'

import WalletReducer from './store/reducers/wallet'
import SpinnerReducer from './store/reducers/spinner'
import SnackbarReducer from './store/reducers/snackbar'

import IndexPage from './pages/Index'
import BookPage from './pages/Book'
import ReaderPage from './pages/Reader'
import AccountPage from './pages/Account'
import ExplorePage from './pages/Explore'
import CreateNftPage from './pages/Create'

const rootReducer = combineReducers({
	WalletState: WalletReducer,
	SpinnerState: SpinnerReducer,
	SnackbarState: SnackbarReducer,
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
						<Route path='/create' element={<CreateNftPage/>}/>
						<Route path='/explore' element={<ExplorePage/>}/>
						<Route path='/account' element={<AccountPage/>}/>
						<Route path='/account/reader' element={<ReaderPage/>}/>
					</Routes>
				</Router>
				<Snackbar/>
				<Spinner/>
			</Provider>
		</div>
	);
}

export default App;

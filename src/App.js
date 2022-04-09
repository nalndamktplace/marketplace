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

import IndexPage from './pages'
import ExplorePage from './pages/explore'
import CreateNftPage from './pages/Create'
import ProfilePage from './pages/Profile'
import CreatorsDashboardPage from './pages/Creators/Dashboard'

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
						<Route path='/create' element={<CreateNftPage/>}/>
						<Route path='/profile' element={<ProfilePage/>}/>
						<Route path='/explore' element={<ExplorePage/>}/>
						<Route path='/creators/dashboard' element={<CreatorsDashboardPage/>}/>
					</Routes>
				</Router>
				<Snackbar/>
				<Spinner/>
			</Provider>
		</div>
	);
}

export default App;

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
import { Web3AuthProvider } from './contexts/SocialLoginContext'
import { SmartAccountProvider } from './contexts/SmartAccountContext'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
	<Web3AuthProvider>
		<SmartAccountProvider>
			<Router>
				<App />
			</Router>
		</SmartAccountProvider>
	</Web3AuthProvider>
)

reportWebVitals()

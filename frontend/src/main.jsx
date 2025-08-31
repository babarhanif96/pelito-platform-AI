import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import OverAllStates from './context/OverAllStates.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { polygon , sepolia } from '@reown/appkit/networks'

const queryClient = new QueryClient()


// 1. Get projectId
const projectId = '3bc9b13ede2c46a106c03bfadb9129e8'

// 2. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [polygon],
  defaultNetwork: 'polygon',
  projectId,
  features: {
    email: false,
    socials: false,
  },
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <OverAllStates>
          <App />
        </OverAllStates>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode >,
)

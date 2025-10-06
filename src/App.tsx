import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import './App.css'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

function App() {

  return (
      <ConnectionProvider endpoint='devnet'>
        <WalletProvider wallets={[]}>
          <WalletModalProvider>
            Hello
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )
}

export default App

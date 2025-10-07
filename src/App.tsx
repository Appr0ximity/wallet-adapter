import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import './App.css'
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css';
import { SolanaFaucet } from './components/SolanaFaucet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { Balance } from './components/Balance';

function App() {
  const devnet = "https://solana-devnet.g.alchemy.com/v2/_TgRmevsH5Z1tLVkQ76sd"

  return (
    <ConnectionProvider endpoint={devnet}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black animate-gradient">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl animate-float animate-pulse-glow">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-100 bg-clip-text text-transparent">
                    Solana Wallet Adapter
                  </h1>
                </div>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Connect your wallet and request SOL airdrops on the Solana devnet
                </p>
              </div>

              {/* Main Content */}
              <div className="max-w-4xl mx-auto">
                <Card className="glass border-slate-700 relative z-50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">Wallet Connection</CardTitle>
                    <CardDescription className="text-slate-300">
                      Connect your wallet to start using the faucet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="relative z-50">
                      <WalletMultiButton className="!bg-gradient-to-r !from-slate-700 !to-slate-900 hover:!from-slate-600 hover:!to-slate-800 !border !border-slate-600 !text-white !font-semibold !px-8 !py-3 !rounded-lg !transition-all !duration-200 !transform hover:!scale-105" />
                    </div>
                    <div className="relative z-10">
                      <WalletDisconnectButton className="!bg-gradient-to-r !from-red-700 !to-red-900 hover:!from-red-600 hover:!to-red-800 !border !border-red-600 !text-white !font-semibold !px-6 !py-2 !rounded-lg !transition-all !duration-200 !transform hover:!scale-105" />
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 relative z-10 w-full">
                  <SolanaFaucet />
                </div >
                <div className="mt-8 relative z-10 w-full">
                  <Balance></Balance>
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import './App.css'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css';
import { SolanaFaucet } from './components/SolanaFaucet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

function App() {
  const devnet = "https://solana-devnet.g.alchemy.com/v2/a8jFREom7nUuY3UMsFiAfCjDBILUitvJ"

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
              <div className="max-w-2xl mx-auto">
                <Card className="glass border-slate-700">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">Wallet Connection</CardTitle>
                    <CardDescription className="text-slate-300">
                      Connect your wallet to start using the faucet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <WalletMultiButton className="!bg-gradient-to-r !from-slate-700 !to-slate-900 hover:!from-slate-600 hover:!to-slate-800 !border !border-slate-600 !text-white !font-semibold !px-8 !py-3 !rounded-lg !transition-all !duration-200 !transform hover:!scale-105" />
                  </CardContent>
                </Card>

                <div className="mt-8">
                  <SolanaFaucet />
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

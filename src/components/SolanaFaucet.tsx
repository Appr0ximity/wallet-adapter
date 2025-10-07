import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { type TransactionSignature } from "@solana/web3.js"
import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplets, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export const SolanaFaucet = () => {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [amount, setAmount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const getDrop = async () => {
        if (publicKey === null) {
            setStatus('error')
            setMessage('Please connect your wallet first!')
            return
        }

        if (amount <= 0) {
            setStatus('error')
            setMessage('Please enter a valid amount (minimum 1 SOL)')
            return
        }

        setIsLoading(true)
        setStatus('idle')
        setMessage('')

        if (inputRef.current) {
            inputRef.current.disabled = true
        }

        try {
            const lamports = amount * 1_000_000_000 // Convert SOL to lamports
            const airdropSignature: TransactionSignature = await connection.requestAirdrop(publicKey, lamports)

            // Use a more reliable confirmation method
            const confirmation = await connection.confirmTransaction(airdropSignature)

            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${confirmation.value.err}`)
            }

            setStatus('success')
            setMessage(`Successfully airdropped ${amount} SOL!`)
        } catch (error) {
            console.log(error)
            setStatus('error')
            setMessage(`Failed to request airdrop: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        setIsLoading(false)
        if (inputRef.current) {
            inputRef.current.disabled = false
        }
    }

    return (
        <Card className="glass border-slate-700 w-full">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg">
                        <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">SOL Faucet</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                    Request SOL airdrops on the Solana devnet
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 w-full">
                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-200 font-medium">
                        Amount (SOL)
                    </Label>
                    <Input
                        ref={inputRef}
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                        placeholder="Enter amount in SOL"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400"
                        min="1"
                        max="10"
                        step="0.1"
                    />
                    <p className="text-sm text-slate-400">
                        Maximum 10 SOL per request
                    </p>
                </div>

                {message && (
                    <div className={`flex items-start gap-2 p-4 rounded-lg w-full ${
                        status === 'success' 
                            ? 'bg-green-900/20 border border-green-500/20 text-green-300' 
                            : status === 'error'
                            ? 'bg-red-900/20 border border-red-500/20 text-red-300'
                            : 'bg-blue-900/20 border border-blue-500/20 text-blue-300'
                    }`}>
                        {status === 'success' ? (
                            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        ) : status === 'error' ? (
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        ) : null}
                        <span className="text-sm break-words overflow-wrap-anywhere min-w-0 flex-1">{message}</span>
                    </div>
                )}

                <Button
                    onClick={getDrop}
                    disabled={isLoading || !publicKey}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-slate-600"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Droplets className="mr-2 h-4 w-4" />
                            Request Airdrop
                        </>
                    )}
                </Button>

                {!publicKey && (
                    <p className="text-center text-slate-400 text-sm">
                        Please connect your wallet to use the faucet
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
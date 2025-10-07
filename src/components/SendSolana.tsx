import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { Input } from "./ui/input"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export const SendSolana = () => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [txSignature, setTxSignature] = useState('')

    const sendSol = async () => {
        if (!publicKey) {
            setStatus('error')
            setMessage('Please connect your wallet first!')
            return
        }

        if (!recipient.trim()) {
            setStatus('error')
            setMessage('Please enter a recipient address')
            return
        }

        if (!amount || Number(amount) <= 0) {
            setStatus('error')
            setMessage('Please enter a valid amount (greater than 0)')
            return
        }

        // Validate Solana address
        try {
            new PublicKey(recipient)
        } catch (error) {
            setStatus('error')
            setMessage('Invalid Solana address format')
            return
        }

        setIsLoading(true)
        setStatus('idle')
        setMessage('')

        try {
            const transaction = new Transaction()
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: Number(amount) * LAMPORTS_PER_SOL
                })
            )

            const signature = await sendTransaction(transaction, connection)
            setTxSignature(signature)
            setStatus('success')
            setMessage(`Successfully sent ${amount} SOL! Transaction signature: ${signature}`)
            
            // Clear form on success
            setRecipient("")
            setAmount("")
        } catch (error) {
            console.error('Transaction failed:', error)
            setStatus('error')
            setMessage(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        setIsLoading(false)
    }

    return (
        <Card className="glass border-slate-700 w-full">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
                        <Send className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">Send SOL</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                    Send SOL to another wallet address
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 w-full">
                <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-slate-200 font-medium">
                        Recipient Address
                    </Label>
                    <Input
                        id="recipient"
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter recipient's Solana address"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-slate-400">
                        Enter the public key of the recipient's wallet
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-200 font-medium">
                        Amount (SOL)
                    </Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount in SOL"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400"
                        min="0.000000001"
                        step="0.000000001"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-slate-400">
                        Minimum amount: 0.000000001 SOL
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
                        <div className="flex-1 min-w-0">
                            <span className="text-sm break-words overflow-wrap-anywhere block">{message}</span>
                            {txSignature && status === 'success' && (
                                <a 
                                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-green-400 hover:text-green-300 underline mt-1 block"
                                >
                                    View on Solana Explorer
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <Button
                    onClick={sendSol}
                    disabled={isLoading || !publicKey || !recipient.trim() || !amount}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-blue-600"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Send SOL
                        </>
                    )}
                </Button>

                {!publicKey && (
                    <p className="text-center text-slate-400 text-sm">
                        Please connect your wallet to send SOL
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
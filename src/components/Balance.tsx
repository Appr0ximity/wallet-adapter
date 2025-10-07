import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export const Balance = ()=>{
    
    const inputRef = useRef(null)
    const connection = useConnection()
    const { publicKey } = useWallet()
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const getBalance = async ()=>{
        if (publicKey === null) {
            setStatus('error')
            setMessage('Please connect your wallet first!')
            return
        }

        setIsLoading(true)
        setStatus('idle')
        setMessage('')

        try {
            const bal = (await connection.connection.getBalance(publicKey, "confirmed"))/LAMPORTS_PER_SOL
            setBalance(bal)

            setIsLoading(false)
            setStatus("success")
        } catch (error) {
            setStatus("error")
        }

    }

    return (
        <Card className="glass border-slate-700 w-full">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-800 rounded-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">Wallet Balance</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                    View your current SOL balance
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 w-full">
                <div className="space-y-2">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">
                            {balance.toFixed(4)} SOL
                        </div>
                        <div className="text-sm text-slate-400">
                            {balance.toFixed(9)} SOL (full precision)
                        </div>
                    </div>
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
                    onClick={getBalance}
                    disabled={isLoading || !publicKey}
                    className="w-full bg-gradient-to-r from-green-700 to-emerald-900 hover:from-green-600 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-green-600"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Updating Balance...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Balance!
                        </>
                    )}
                </Button>

                {!publicKey && (
                    <p className="text-center text-slate-400 text-sm">
                        Please connect your wallet to view balance
                    </p>
                )}
            </CardContent>
        </Card>
    )
}


import { useState } from 'react'
import { ethers } from 'ethers'

export default function Wallets() {
  const [address, setAddress] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [phrase, setPhrase] = useState('')
  const [error, setError] = useState('')
  const [generatedMnemonic, setGeneratedMnemonic] = useState('')
  const [balance, setBalance] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateRandomWords = (count: 12 | 24) => {
    const randomMnemonic = ethers.Wallet.createRandom().mnemonic
    if (randomMnemonic && randomMnemonic.phrase) {
      const words = randomMnemonic.phrase.split(' ')
      return words.slice(0, count).join(' ')
    }
    throw new Error('Failed to generate random words')
  }

  const handleRandomWords = (count: 12 | 24) => {
    try {
      const randomPhrase = generateRandomWords(count)
      setPhrase(randomPhrase)
      setError('')
    } catch (err) {
      setError('Error generating random words. Please try again.')
      console.error(err)
    }
  }

  const checkBalance = async (addressToCheck: string) => {
    try {
      // Connect to the Ethereum mainnet
      const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/9caabf78375d4080ab94d20942630c0d')
      
      const balanceWei = await provider.getBalance(addressToCheck)
      const balanceEth = ethers.formatEther(balanceWei)
      setBalance(balanceEth)
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error checking balance: ${err.message}`)
      } else {
        setError('An unexpected error occurred while checking the balance.')
      }
      console.error(err)
    }
  }

  const generateWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setAddress('')
    setPrivateKey('')
    setGeneratedMnemonic('')
    setBalance('')
    setIsLoading(true)

    try {
      let wallet

      if (phrase.trim()) {
        if (!ethers.Mnemonic.isValidMnemonic(phrase.trim())) {
          throw new Error('Invalid mnemonic phrase. Please check your input.')
        }
        wallet = ethers.Wallet.fromPhrase(phrase.trim())
      } else {
        wallet = ethers.Wallet.createRandom()
        setGeneratedMnemonic(wallet.mnemonic?.phrase || '')
      }

      setAddress(wallet.address)
      setPrivateKey(wallet.privateKey)

      // Check balance immediately after generating the wallet
      await checkBalance(wallet.address)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ethereum Wallet Generator</h2>
      <p className="mb-4 text-gray-600">Generate an Ethereum wallet and check its balance</p>
      <form onSubmit={generateWallet} className="mb-4">
        <div className="mb-4">
          <label htmlFor="phrase" className="block mb-2 font-medium">
            Custom Phrase (optional)
          </label>
          <textarea
            id="phrase"
            placeholder="Enter 12 or 24 words separated by spaces"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>
        <div className="mb-4 flex space-x-2">
          <button
            type="button"
            onClick={() => handleRandomWords(12)}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Generate 12 Words
          </button>
          <button
            type="button"
            onClick={() => handleRandomWords(24)}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Generate 24 Words
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Wallet'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {address && (
        <div className="mb-4">
          <h3 className="font-medium mb-1">Address:</h3>
          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{address}</p>
        </div>
      )}
      {privateKey && (
        <div className="mb-4">
          <h3 className="font-medium mb-1">Private Key:</h3>
          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{privateKey}</p>
        </div>
      )}
      {generatedMnemonic && (
        <div className="mb-4">
          <h3 className="font-medium mb-1">Generated Mnemonic:</h3>
          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{generatedMnemonic}</p>
        </div>
      )}
      {balance && (
        <div className="mt-4">
          <h3 className="font-medium mb-1">Balance:</h3>
          <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{balance} ETH</p>
        </div>
      )}
    </div>
  )
}
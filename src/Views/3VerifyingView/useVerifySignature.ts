/**
 * @file useVerifySignature.ts
 * Custom hook for verifying an Ethereum signature with plaintext message and address.
 * This hook separates the verification logic from the UI components.
 */
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

interface UseVerifySignatureReturn {
  address: string
  setAddress: (value: string) => void
  message: string
  setMessage: (value: string) => void
  signature: string
  setSignature: (value: string) => void
  verificationResult: boolean | null
  verify: () => void
}

export function useVerifySignature(): UseVerifySignatureReturn {
  // Store address, message, and signature 
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  const verify = async () => {
    try {
      // Invoke Rust backend verify_ethereum_signature command
      const result = await invoke<boolean>('verify_ethereum_signature', {
        signature: signature.trim(),
        message: message.trim(),
        address: address.trim()
      })
      
      // Set the boolean result directly
      console.log("result", result)
      setVerificationResult(result)
    } catch (error) {
      // If there's an error, we assume verification failed
      setVerificationResult(false)
    }
  }

  return {
    address,
    setAddress,
    message,
    setMessage,
    signature,
    setSignature,
    verificationResult,
    verify,
  }
} 
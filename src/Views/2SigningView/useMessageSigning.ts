import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

interface UseMessageSigningReturn {
  message: string;
  setMessage: (message: string) => void;
  encryptionKey: string;
  setEncryptionKey: (key: string) => void;
  signature: string | null;
  isLoading: boolean;
  signMessage: () => Promise<void>;
}

export const useMessageSigning = (): UseMessageSigningReturn => {
  const [message, setMessage] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signMessage = async () => {
    if (!message || !encryptionKey) return;
    
    setIsLoading(true);
    try {
      const signature = await invoke('generate_ethereum_signature', { enckey: encryptionKey, message: message });
      console.log('signature', signature);
      // TODO: Implement actual signing with the private key
      setSignature(String(signature)); // Temporary for testing
    } catch (error) {
      console.error('Error signing message:', error);
      alert(error);
      setSignature("");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    message,
    setMessage,
    encryptionKey,
    setEncryptionKey,
    signature,
    isLoading,
    signMessage,
  };
}; 
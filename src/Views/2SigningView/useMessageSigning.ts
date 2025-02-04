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
      const privateKey = await invoke('get_private_key', { enckey: encryptionKey });
      console.log('privateKey', privateKey);
      // TODO: Implement actual signing with the private key
      setSignature(String(privateKey)); // Temporary for testing
    } catch (error) {
      console.error('Error signing message:', error);
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
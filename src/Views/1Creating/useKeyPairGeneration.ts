import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
interface KeyPair {
  address: string;
  publicKey: string;
}

export const useKeyPairGeneration = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateKeyPair = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Invoke the Rust backend function to generate key pair
      console.log('password', encryptionKey);
      const response:{address:string, public_key:string} = await invoke('generate_eth_keypair', {
        enckey: encryptionKey
      });

      if (!response) {
        throw new Error('Failed to generate key pair');
      }
      setKeyPair({
        address: response.address,
        publicKey: response.public_key
      });
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    encryptionKey,
    setEncryptionKey,
    keyPair,
    isLoading,
    error,
    generateKeyPair,
  };
}; 
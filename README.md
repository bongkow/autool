# autool

This Tauri application provides local generation, encryption, and management of Ethereum private keys, plus message signing using those keys. The project combines a Rust backend (for secure cryptographic operations via the ethers and aes-gcm crates) with a React + TypeScript frontend for an interactive desktop application experience.

---

## What the App Does

1. **Local Ethereum Key Generation**  
   - On request, the Rust backend uses ethers to generate an Ethereum key pair (public and private key).  
   - The private key is immediately encrypted with a user-supplied passphrase, hashed using SHA-256 for added security.  
   - After encryption (using AES-GCM), the private key is stored locally on the user's machine in a file named private_key.enc under the ".autool" directory in the home folder.

2. **Secure Encryption & Storage**  
   - AES-GCM encryption secures the private key with a 12-byte random nonce.  
   - The encrypted data is Base64-encoded and saved. This ensures no plaintext private key remains on the file system.  
   - When retrieving the key, the passphrase is again hashed with SHA-256, and the resultant 32-byte key decrypts the local file.

3. **Message Signing**  
   - Users can supply the same passphrase, which the backend uses to decrypt the private key.  
   - Once decrypted, it signs a user-provided message using the standard "Ethereum Signed Message" prefix.  
   - The resulting signature is returned to the frontend in hex format (with a 0x prefix).

4. **Verify a Signature**  
   - Input the original message, the signature (0x-prefixed hex), and the signer's Ethereum address
   - The app recovers the signer's address from the signature and message
   - Returns true if the recovered address matches the provided address, false otherwise
   - Handles all common error cases (invalid signature format, recovery failures) gracefully by returning false

The verification process:
1. The message is hashed with the standard Ethereum prefix ("\x19Ethereum Signed Message:\n" + message length)
2. The signature (65 bytes: r + s + v) is parsed from its hex format
3. The signer's address is recovered using the signature and message hash
4. The recovered address is compared with the expected address

5. **Offline & Local-Only**  
   - Everything runs entirely on the user's machine. No server integration is required, so private keys never leave the user's local environment.

6. **Frontend**  
   - Built in React with TypeScript for type-safe component development.  
   - Uses custom React hooks (useKeyPairGeneration, useMessageSigning) so that logic is separated from UI, making the code more maintainable.  
   - Styled with Tailwind CSS classes, keeping design consistent and minimal.

---

## Key Technology Components

1. **Rust + Tauri**  
   - Provides native desktop capabilities (filesystem, dialogs, system integrations) through the Tauri framework.  
   - Commands are defined in Rust, and invoked from the TypeScript frontend.

2. **React + TypeScript**  
   - Renders the UI for generating or signing with keys.  
   - Manages state via Zustand (in "useAppsStateStore"), storing which "app" (view) is active.

3. **AES-GCM**  
   - Symmetric encryption used for securing private keys.  
   - Incorporates a nonce to ensure each encryption is unique.

4. **Ethers**  
   - Ethereum library used for key generation and message signing.  
   - Allows for easy integration with Ethereum standards (e.g. keccak256 hashing, standard message prefix).

---

## Typical Use Cases

1. **Generate Ethereum Keys and Store Them**  
   - Click "Create Keys" → Provide a passphrase → The Rust layer generates and encrypts a private key → The address and public key are displayed in the UI.

2. **Sign a Message**  
   - Click "Sign Message" → Provide the same passphrase → Type a message → The app decrypts the private key and returns a valid Ethereum signature.

3. **Verify a Signature**  
   - Input the original message, the signature (0x-prefixed hex), and the signer's Ethereum address
   - The app recovers the signer's address from the signature and message
   - Returns true if the recovered address matches the provided address, false otherwise
   - Handles all common error cases (invalid signature format, recovery failures) gracefully by returning false

The verification process:
1. The message is hashed with the standard Ethereum prefix ("\x19Ethereum Signed Message:\n" + message length)
2. The signature (65 bytes: r + s + v) is parsed from its hex format
3. The signer's address is recovered using the signature and message hash
4. The recovered address is compared with the expected address

---

## How to Run

1. Install dependencies:  
   ```bash
   npm install
   ```
2. Launch the development environment:  
   ```bash
   npm run tauri dev
   ```
   This will start the frontend (Vite dev server) and the Tauri app (Rust backend).

3. Build for production:  
   ```bash
   npm run tauri build
   ```
   This compiles everything into a desktop executable, which can be found under src-tauri/target.

---

## Contributing

1. Fork and clone the repository.  
2. Make your changes (e.g., new Tauri commands, new React views, extra cryptographic functionality).  
3. Submit a pull request with clear documentation of what was added or changed.

---

Thank you for using autool! This project aims to keep your Ethereum keys secure, purely in a local and offline environment, while allowing smooth development experience thanks to Tauri, React, TypeScript, and Tailwind CSS.



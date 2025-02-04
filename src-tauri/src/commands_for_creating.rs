use ethers::signers::{LocalWallet, Signer};
use ethers::types::Address;
use serde::{Serialize, Deserialize};
use dirs::home_dir;
use std::fs;
use rand;
use ring::digest::{digest, SHA256};
use base64::{engine::general_purpose, Engine};

const PRIVATE_KEY_FILE: &str = "private_key.enc"; // Encrypted private key filename
const NONCE_LEN: usize = 12;                      // ChaCha20-Poly1305 nonce size

#[derive(Serialize, Deserialize)]
pub struct KeyPair {
    pub address: String,
    pub public_key: String,
}

/// Generates an Ethereum key pair and encrypts the private key with a user-supplied passphrase (`enckey`).
#[tauri::command]
pub async fn generate_eth_keypair(enckey: String) -> Result<KeyPair, String> {
    // 1. Generate a new Ethereum wallet
    let wallet = LocalWallet::new(&mut rand::thread_rng());
    let private_key_bytes = wallet.signer().to_bytes(); // raw private key bytes
    let private_key_hex = format!("0x{}", hex::encode(&private_key_bytes)); // hex-encoded private key with 0x prefix
    println!("private_key_hex: {:?}", private_key_hex);

    // 2. Public key (in hex) and address
    let public_key_hex = hex::encode(wallet.signer().verifying_key().to_sec1_bytes());
    let address: Address = wallet.address();

    // 3. Encrypt the hex-encoded private key using AES-GCM
    let encrypted_private_key = encrypt_private_key(&private_key_hex, &enckey)?;

    // 4. Save encrypted private key to ~/.autool/private_key.enc
    let home_dir = home_dir().ok_or("Could not find home directory")?;
    let autool_path = home_dir.join(".autool");
    let file_path = autool_path.join(PRIVATE_KEY_FILE);

    fs::create_dir_all(file_path.parent().unwrap())
        .map_err(|e| e.to_string())?;
    fs::write(&file_path, encrypted_private_key)
        .map_err(|e| e.to_string())?;

    // 5. Return KeyPair (address + public_key)
    Ok(KeyPair {
        address: format!("{:?}", address), // e.g. "0x1234..."
        public_key: public_key_hex,
    })
}

/// Encrypts a `private_key` string using the user's `enckey` (hashed with SHA-256),
/// then Base64-encodes the result: 12-byte random nonce + ciphertext + 16-byte tag.
fn encrypt_private_key(private_key: &str, enckey: &str) -> Result<String, String> {
    use aes_gcm::{
        aead::{Aead, KeyInit},
        Aes256Gcm, Nonce
    };

    // 1. Hash the user-provided enckey => 32-byte key
    let hashed_key = digest(&SHA256, enckey.as_bytes());
    println!("Encryption hashed_key = {:02x?}", hashed_key.as_ref());
    let encryption_key_bytes = hashed_key.as_ref(); // exactly 32 bytes

    // 2. Create the AES-GCM cipher
    let cipher = Aes256Gcm::new_from_slice(encryption_key_bytes)
        .map_err(|_| "Failed to create AES-GCM cipher".to_string())?;

    // 3. Generate a random 12-byte nonce
    let nonce_bytes: [u8; NONCE_LEN] = rand::random();
    let nonce = Nonce::from_slice(&nonce_bytes);

    // 4. Encrypt the private key
    let ciphertext = cipher
        .encrypt(nonce, private_key.as_bytes())
        .map_err(|_| "Encryption failed".to_string())?;

    // 5. Combine nonce + ciphertext
    let mut encrypted_data = nonce_bytes.to_vec();
    encrypted_data.extend_from_slice(&ciphertext);

    // 6. Return Base64-encoded final result
    Ok(general_purpose::STANDARD.encode(encrypted_data))
}
//recover the private key from the encrypted file using the user provided encryption key
use dirs::home_dir;
use std::fs;
use ring::digest::{digest, SHA256};
use base64::{engine::general_purpose, Engine};

const PRIVATE_KEY_FILE: &str = "private_key.enc"; 
const NONCE_LEN: usize = 12; // For ChaCha20-Poly1305

#[tauri::command]
pub async fn get_private_key(enckey: String) -> Result<String, String> {
    use aes_gcm::{
        aead::{Aead, KeyInit},
        Aes256Gcm, Nonce
    };
    // 1. Hash the user-provided enckey => 32-byte key
    let hashed_key = digest(&SHA256, enckey.as_bytes());
    let encryption_key_bytes = hashed_key.as_ref(); // exactly 32 bytes

    // 2. Create the AES-GCM cipher
    let cipher = Aes256Gcm::new_from_slice(encryption_key_bytes)
        .map_err(|_| "Failed to create AES-GCM cipher".to_string())?;
    
    // 3. Read the Base64 ciphertext from ~/.autool/private_key.enc
    let home_dir = home_dir().ok_or("Could not find home directory")?;
    let autool_path = home_dir.join(".autool");
    let file_path = autool_path.join(PRIVATE_KEY_FILE);
    let encrypted_data = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read {:?}: {}", file_path, e))?;
    let encrypted_bytes = general_purpose::STANDARD
        .decode(&encrypted_data)
        .map_err(|e| format!("Base64 decode error: {}", e))?;

    // 4. Ensure we have at least 12 bytes for the nonce
    if encrypted_bytes.len() < NONCE_LEN {
        return Err("Encrypted data is too short to contain a nonce.".to_string());
    }

    // 5. Split the nonce + ciphertext
    let (nonce_bytes, ciphertext) = encrypted_bytes.split_at(NONCE_LEN);
    let nonce = Nonce::from_slice(nonce_bytes);

    // 6. Decrypt the ciphertext
    let decrypted_bytes = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|_| "Decryption failed".to_string())?;

    // 7. Convert the decrypted bytes (hex string) to `String`
    let private_key_hex = String::from_utf8(decrypted_bytes)
        .map_err(|e| format!("Invalid UTF-8 in decrypted data: {}", e))?;

    // Return the hex-encoded private key string
    Ok(private_key_hex)
}
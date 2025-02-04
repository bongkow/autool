use std::str::FromStr;
use ethers::core::types::{Address, Signature};
use ethers::utils::hash_message;

/// Verify an Ethereum signature for a given address and plaintext message.
///
/// Returns a `bool` (no errors). In the event of a parse or recovery failure, 
/// it returns `false`.
///
/// # Arguments
///
/// * `message` - The exact message (plaintext) that was signed.
/// * `signature` - The signature in "0x"-prefixed hex format (65 bytes: r(32) + s(32) + v(1)).
/// * `address` - The "0x"-prefixed Ethereum address of the expected signer.
///
/// # Example
///
/// ```
/// let message = "Hello from Ethereum!";
/// let signature = "0x..."; // 65-byte hex string
/// let address = "0x...";   // 20-byte hex string
/// let result = verify_ethereum_signature(message, signature, address);
/// if result {
///     println!("Signature is valid and was produced by {}", address);
/// } else {
///     println!("Signature is invalid or error occurred");
/// }
/// ```
#[tauri::command]
pub fn verify_ethereum_signature(
    message: &str,
    signature: &str,
    address: &str,
) -> bool {
    // 1. Hash the message with the Ethereum-specific prefix
    let message_hash = hash_message(message);

    // 2. Parse the signature from hex (return false if parsing fails)
    let Ok(signature) = Signature::from_str(signature) else {
        return false;
    };

    // 3. Recover the signer address from the signature + message hash
    let Ok(recovered) = signature.recover(message_hash) else {
        return false;
    };

    // 4. Parse the expected address
    let Ok(expected) = Address::from_str(address) else {
        return false;
    };

    // 5. Compare the recovered address to the expected address
    recovered == expected
}
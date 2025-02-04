mod commands_for_creating;
mod commands_for_signing;
mod commands_for_verifying;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands_for_creating::generate_eth_keypair, 
            commands_for_signing::generate_ethereum_signature, 
            commands_for_verifying::verify_ethereum_signature
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

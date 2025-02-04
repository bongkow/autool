// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// use lazy_static::lazy_static;
// use tokio::sync::Mutex;
// use mistralrs::{GgufModelBuilder, Model, PagedAttentionMetaBuilder, RequestBuilder, TextMessageRole};
// use anyhow::Result;

// lazy_static! {
//     static ref MODEL: Mutex<Option<Model>> = Mutex::new(None);
// }

// // create the error type that represents all errors possible in our program
// #[derive(Debug, thiserror::Error)]
// pub enum Error {
//     #[error(transparent)]
//     Io(#[from] anyhow::Error),
// }

// // we must manually implement serde::Serialize
// impl serde::Serialize for Error {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::ser::Serializer,
//     {
//         serializer.serialize_str(self.to_string().as_ref())
//     }
// }
// #[tauri::command]
// async fn run_gguf_locally(prompts: Vec<String>, model_directory: String, model_filename: String) -> Result<String, Error> {
//     let result = tauri::async_runtime::spawn_blocking(move || {
//         let rt = tokio::runtime::Runtime::new()
//             .map_err(|e| Error::Io(anyhow::anyhow!("Failed to create runtime: {}", e)))?;
        
//         rt.block_on(async move {
//             let model = {
//                 let mut model_guard = MODEL.lock().await;
                
//                 if model_guard.is_none() {
//                     println!("##################### starting to build model.");
//                     let model_path = model_directory.replace("\\", "/");

//                     *model_guard = Some(
//                         GgufModelBuilder::new(
//                             model_path,
//                             vec![model_filename],
//                         )
//                         .with_logging()
//                         .with_paged_attn(|| PagedAttentionMetaBuilder::default().build())
//                         .map_err(|e| Error::Io(e.into()))?
//                         .build()
//                         .await
//                         .map_err(|e| Error::Io(e.into()))?
//                     );
//                     println!("#################### done with building model.");
//                 }
//                 model_guard.take().unwrap()
//             };
            
//             let mut request_builder = RequestBuilder::new().return_logprobs(true);
            
//             // Add each prompt to the request
//             for (i, prompt) in prompts.iter().enumerate() {
//                 let role = if i % 2 == 0 { TextMessageRole::User } else { TextMessageRole::Assistant };
//                 request_builder = request_builder.add_message(role, prompt);
//             }

//             let response = model.send_chat_request(request_builder)
//                 .await
//                 .map_err(|e| {
//                     println!("Error sending chat request: {}", e);
//                     Error::Io(e.into())
//                 })?;
            
//             //println!("#################### request {request:#?}");
//             //println!("#################### response {response:#?}");
//             let content: String = response.choices[0].message.content.clone().unwrap_or_default();
//             //println!("#################### content {}", content);
//             dbg!(
//                 response.usage.avg_prompt_tok_per_sec,
//                 response.usage.avg_compl_tok_per_sec
//             );

//             // Store the model back into the static variable
//             let mut model_guard = MODEL.lock().await;
//             *model_guard = Some(model);

//             Ok(content)
//         }) as Result<String, Error>
//     }).await.map_err(|e| Error::Io(anyhow::anyhow!("{}", e)))??;
//     Ok(result)
// }

// use tokio::net::TcpStream;
// use tokio::io::{AsyncReadExt, AsyncWriteExt};
// use tokio_native_tls::TlsConnector;
// use native_tls::TlsConnector as NativeTlsConnector;




// #[tauri::command]
// async fn fetch_emails_pop(server: &str, port: u16, username: &str, password: &str, howmany: usize) -> Result<Vec<String>, String> {
//         // Connect to the POP3 server via TCP
//         let address = format!("{}:{}", server, port);
//         println!("#################### connecting to {}", address);
//         let stream = TcpStream::connect(&address)
//             .await
//             .map_err(|e| format!("Failed to connect: {}", e))?;
    
//         // Set up TLS for the stream
//         let tls_connector = TlsConnector::from(NativeTlsConnector::new().map_err(|e| e.to_string())?);
//         let mut stream = tls_connector
//             .connect(server, stream)
//             .await
//             .map_err(|e| format!("Failed to establish TLS connection: {}", e))?;
    
//         let mut buffer = vec![0; 1024];
    
//         // Read initial server response (POP3 greeting)
//         let bytes_read = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
//         let server_response = String::from_utf8_lossy(&buffer[..bytes_read]);
//         println!("Server Response: {}", server_response);
    
//         // Send USER command
//         let user_cmd = format!("USER {}\r\n", username);
//         stream
//             .write_all(user_cmd.as_bytes())
//             .await
//             .map_err(|e| e.to_string())?;
//         let bytes_read = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
//         let user_response = String::from_utf8_lossy(&buffer[..bytes_read]);
//         println!("USER Response: {}", user_response);
    
//         // Send PASS command
//         let pass_cmd = format!("PASS {}\r\n", password);
//         stream
//             .write_all(pass_cmd.as_bytes())
//             .await
//             .map_err(|e| e.to_string())?;
//         let bytes_read = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
//         let pass_response = String::from_utf8_lossy(&buffer[..bytes_read]);
//         println!("PASS Response: {}", pass_response);

//     // Send LIST command to get all message IDs
//     // First get LIST to get message numbers and sizes
//     let list_cmd = "LIST\r\n";
//     stream
//         .write_all(list_cmd.as_bytes())
//         .await
//         .map_err(|e| e.to_string())?;

//     // Keep reading until we encounter a line with just "."
//     let mut list_response = String::new();
//     loop {
//         let bytes_read = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
//         if bytes_read == 0 {
//             break;
//         }
//         let partial = String::from_utf8_lossy(&buffer[..bytes_read]);
//         list_response.push_str(&partial);

//         if list_response.contains("\r\n.\r\n") {
//             break;
//         }
//     }

//     // Then get UIDL to get unique IDs for each message
//     let uidl_cmd = "UIDL\r\n";
//     stream
//         .write_all(uidl_cmd.as_bytes())
//         .await
//         .map_err(|e| e.to_string())?;

//     let mut uidl_response = String::new();
//     loop {
//         let bytes_read = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
//         if bytes_read == 0 {
//             break;
//         }
//         let partial = String::from_utf8_lossy(&buffer[..bytes_read]);
//         uidl_response.push_str(&partial);

//         if uidl_response.contains("\r\n.\r\n") {
//             break;
//         }
//     }

//     // println!("LIST Response: {}", list_response);
//     // println!("UIDL Response: {}", uidl_response);

//     // Create a map of message number to UID
//     let uid_map: std::collections::HashMap<String, String> = uidl_response
//         .lines()
//         .filter_map(|line| {
//             let parts: Vec<&str> = line.trim().split_whitespace().collect();
//             if parts.len() == 2 && parts[0] != "+OK" {
//                 Some((parts[0].to_string(), parts[1].to_string()))
//             } else {
//                 None
//             }
//         })
//         .collect();

//     // Parse message IDs (assumes messages are returned in lines containing: "id size")
//     let message_ids: Vec<String> = list_response
//         .lines()
//         .filter_map(|line| {
//             let parts: Vec<&str> = line.trim().split_whitespace().collect();
//             // Each message line generally looks like: "<ID> <size>"
//             // so we'll pick up the ID if we have exactly 2 parts and the first is not +OK or .
//             if parts.len() == 2 && parts[0] != "+OK" {
//                 Some(parts[0].to_string())
//             } else {
//                 None
//             }
//         })
//         .collect();

//     //println!("#################### message_ids {:?}", message_ids);

//     // Get the latest howmany message IDs
//     let latest_ids = message_ids.into_iter().rev().take(howmany).collect::<Vec<String>>();

//     // Fetch messages in parallel using multiple connections
//     let mut handles = Vec::new();
    
//     for message_id in latest_ids {
//         // Clone connection details for each task
//         let server = server.to_string();
//         let username = username.to_string(); 
//         let password = password.to_string();
//         let port = port;
//         let uid = uid_map.get(&message_id).cloned().unwrap_or_default();
        
//         // Spawn a new task for each message
//         let handle = tokio::spawn(async move {
//             // Create new connection for this task
//             let stream = TcpStream::connect((server.as_str(), port)).await
//                 .map_err(|e| e.to_string())?;
//             let mut stream = TlsConnector::from(NativeTlsConnector::new()
//                 .map_err(|e| e.to_string())?)
//                 .connect(server.as_str(), stream)
//                 .await
//                 .map_err(|e| e.to_string())?;
//             let mut buffer = vec![0; 1024];
            
//             // Read greeting
//             stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
            
//             // Login sequence
//             let user_cmd = format!("USER {}\r\n", username);
//             stream.write_all(user_cmd.as_bytes()).await.map_err(|e| e.to_string())?;
//             stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
            
//             let pass_cmd = format!("PASS {}\r\n", password); 
//             stream.write_all(pass_cmd.as_bytes()).await.map_err(|e| e.to_string())?;
//             stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
            
//             // Fetch just the headers of the specific message using TOP command
//             let top_cmd = format!("TOP {} 0\r\n", message_id);
//             stream.write_all(top_cmd.as_bytes()).await.map_err(|e| e.to_string())?;
            
//             let mut top_response = String::new();
//             loop {
//                 let bytes_read = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
//                 if bytes_read == 0 {
//                     break;
//                 }
//                 let partial = String::from_utf8_lossy(&buffer[..bytes_read]);
//                 top_response.push_str(&partial);
//                 if top_response.contains("\r\n.\r\n") {
//                     break;
//                 }
//             }
//             //println!("#################### top_response {:?}", top_response);
//             Ok::<_, String>(format_email_headers(&message_id, &uid, &top_response))
//         });
        
//         handles.push(handle);
//     }

//     // Wait for all tasks to complete and collect results
//     let mut emails = Vec::new();
//     for handle in handles {
//         if let Ok(Ok(email)) = handle.await {
//             emails.push(email);
//         }
//     }

//     println!("#################### emails {:?}", emails);
//     Ok(emails)
// }

// use base64::{engine::general_purpose, Engine as _};
// use encoding_rs::{EUC_KR, UTF_8};
// use regex::Regex;

// /// Decodes a MIME-encoded header (e.g., "=?UTF-8?B?...?=")
// fn decode_mime_header(encoded: &str) -> String {
//     let re = Regex::new(r"=\?([^?]+)\?([QB])\?([^?]+)\?=").unwrap();
//     let mut decoded_string = encoded.to_string();

//     while let Some(cap) = re.find(&decoded_string) {
//         let full_match = cap.as_str();
//         let captures = re.captures(full_match).unwrap();
        
//         let charset = captures.get(1).unwrap().as_str();
//         let encoding = captures.get(2).unwrap().as_str();
//         let encoded_text = captures.get(3).unwrap().as_str();

//         let decoded_bytes = match encoding {
//             "B" => general_purpose::STANDARD.decode(encoded_text).unwrap_or_default(),
//             "Q" => {
//                 // Use the quoted_printable_q crate instead which is specifically for Q-encoding
//                 let decoded = encoded_text.replace("_", " "); // Q-encoding uses _ for spaces
//                 let bytes = decoded.as_bytes().to_vec();
//                 bytes
//             },
//             _ => continue,
//         };

//         let decoded_str = match charset.to_uppercase().as_str() {
//             "UTF-8" => {
//                 let (decoded, _, _) = UTF_8.decode(&decoded_bytes);
//                 decoded.into_owned()
//             },
//             "KS_C_5601-1987" | "EUC-KR" => {
//                 let (decoded, _, _) = EUC_KR.decode(&decoded_bytes);
//                 decoded.into_owned()
//             },
//             _ => String::from_utf8_lossy(&decoded_bytes).into_owned(),
//         };

//         decoded_string = decoded_string.replace(full_match, &decoded_str);
//     }

//     decoded_string.trim().to_string()
// }

// // Helper function to format email headers
// use serde_json::json;
// use chrono::{DateTime, Utc};
// fn format_email_headers(message_id: &str, uid: &str, top_response: &str) -> String {
//     let from = top_response
//         .lines()
//         .find(|line| line.starts_with("From:"))
//         .map(|line| decode_mime_header(line.trim_start_matches("From:")))
//         .unwrap_or_else(|| "Unknown Sender".to_string());

//     // Extract subject without checking importance
//     let subject_lines: Vec<&str> = top_response
//         .lines()
//         .skip_while(|line| !line.starts_with("Subject:")) // Find "Subject:"
//         .take_while(|line| line.starts_with("Subject:") || line.starts_with(" =?")) // Capture multi-line headers
//         .collect::<Vec<&str>>();

//     let subject_content = subject_lines.join(" ").trim_start_matches("Subject:").trim().to_owned();
//     let subject = if subject_content.is_empty() {
//         "No Subject".to_string()
//     } else {
//         decode_mime_header(&subject_content)
//     };

//     let date = top_response
//         .lines()
//         .find(|line| line.starts_with("Date:"))
//         .map(|line| line.trim_start_matches("Date:").trim().to_string())
//         .unwrap_or_else(|| "Unknown Date".to_string());

//     // Extract attachment metadata
//     let attachments = detect_attachments(top_response);
//     // Parse the date string into a DateTime object and convert to timestamp
//     let timestamp = match DateTime::parse_from_rfc2822(&date) {
//         Ok(dt) => dt.timestamp(),
//         Err(_) => 9999999999 // Fallback to 9999999999 if parsing fails
//     };

//     serde_json::json!({
//         "messageId": message_id,
//         "from": from.trim(),
//         "date": date,
//         "subject": subject.trim(),
//         "attachments": attachments,
//         "uid": uid,
//         "timestamp": timestamp, // use this for fetching the unfetched emails only.
//         "isRead": false // if user has read the email, set to true.
//     }).to_string()
// }

// fn detect_attachments(top_response: &str) -> serde_json::Value {
//     let mut has_multipart_mixed = false;
//     let mut attachment_filenames = Vec::new();

//     for line in top_response.lines() {
//         let line = line.trim();

//         // Detect multipart/mixed (indicates potential attachments)
//         if line.starts_with("Content-Type: multipart/mixed") {
//             has_multipart_mixed = true;
//         }

//         // Detect inline filenames (some emails do not use Content-Disposition)
//         if line.starts_with("Content-Type:") && line.contains("name=") {
//             if let Some(start) = line.find("name=") {
//                 let filename = line[start + 5..].trim_matches(&['"', ';', ' '][..]).to_string();
//                 attachment_filenames.push(filename);
//             }
//         }
//     }

//     if has_multipart_mixed {
//         json!({
//             "hasAttachments": true,
//             "filenames": attachment_filenames
//         })
//     } else {
//         json!({
//             "hasAttachments": false,
//             "filenames": []
//         })
//     }
// }

mod commands_for_camel;
mod commands_for_kimchimail;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![commands_for_camel::run_gguf_locally, commands_for_kimchimail::fetch_emails_pop])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

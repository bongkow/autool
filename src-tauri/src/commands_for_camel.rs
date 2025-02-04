use lazy_static::lazy_static;
use tauri::Emitter;
use tokio::sync::Mutex;
use mistralrs::{GgufModelBuilder, Model, PagedAttentionMetaBuilder, RequestBuilder, TextMessageRole, Response};
use anyhow::Result;


lazy_static! {
    static ref MODEL: Mutex<Option<Model>> = Mutex::new(None);
}

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] anyhow::Error),
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
pub async fn run_gguf_locally(
    window: tauri::Window,
    prompts: Vec<String>, 
    model_directory: String, 
    model_filename: String
) -> Result<(), Error> {
    let result = tauri::async_runtime::spawn_blocking(move || {
        let rt = tokio::runtime::Runtime::new()
            .map_err(|e| Error::Io(anyhow::anyhow!("Failed to create runtime: {}", e)))?;
        
        rt.block_on(async move {
            let model = {
                let mut model_guard = MODEL.lock().await;
                
                if model_guard.is_none() {
                    println!("##################### starting to build model.");
                    let model_path = model_directory.replace("\\", "/");

                    *model_guard = Some(
                        GgufModelBuilder::new(
                            model_path,
                            vec![model_filename],
                        )
                        .with_logging()
                        .with_paged_attn(|| PagedAttentionMetaBuilder::default().build())
                        .map_err(|e| Error::Io(e.into()))?
                        .build()
                        .await
                        .map_err(|e| Error::Io(e.into()))?
                    );
                    println!("#################### done with building model.");
                }
                model_guard.take().unwrap()
            };
            
            let mut request_builder = RequestBuilder::new().return_logprobs(true);
            
            // Add each prompt to the request
            for (i, prompt) in prompts.iter().enumerate() {
                let role = if i % 2 == 0 { TextMessageRole::User } else { TextMessageRole::Assistant };
                request_builder = request_builder.add_message(role, prompt);
            }

            let mut stream = model.stream_chat_request(request_builder)
                .await
                .map_err(|e| Error::Io(anyhow::anyhow!("{}", e)))?;
            
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Response::Chunk(chunk) => {
                        let content = &chunk.choices[0].delta.content;
                        println!("Emitting chunk: {}", content); // Debug log
                        
                        // Only emit if content is not empty
                        if !content.is_empty() {
                            window.emit("llm-response", content)
                                .map_err(|e| Error::Io(anyhow::anyhow!("{}", e)))?;
                        }
                    }
                    _ => {}
                }
            }

            // Store the model back into the static variable
            let mut model_guard = MODEL.lock().await;
            *model_guard = Some(model);

            Ok::<(), Error>(())
        })
    }).await.map_err(|e| Error::Io(anyhow::anyhow!("{}", e)))??;
    
    Ok(result)
}
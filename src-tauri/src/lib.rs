// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde_json::{Value, json};

#[tauri::command]
fn api(data: Value) -> Value {
  let api = data["api"].as_str().unwrap_or("");
  if api == "greet" {
    json!(greet(data["name"].as_str().unwrap()))
  } else if api == "bye" {
    json!(bye(data["name"].as_str().unwrap()))
  } else {
    json!({})
  }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn bye(name: &str) -> String {
    format!("Good bye, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![api, greet, bye])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

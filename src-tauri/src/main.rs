// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            app::file::read_file,
            app::key::send_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

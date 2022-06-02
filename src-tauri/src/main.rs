#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod plugins;

fn main() {
    tauri::Builder::default()
        .plugin(plugins::command::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

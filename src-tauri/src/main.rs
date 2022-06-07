#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod plugins;
mod system_tray;

fn main() {
    tauri::Builder::default()
        .plugin(plugins::setting::init())
        .plugin(plugins::command::init())
        .plugin(plugins::store::PluginBuilder::default().build())
        .system_tray(system_tray::init())
        .on_system_tray_event(system_tray::event_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

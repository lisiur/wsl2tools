#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, WindowBuilder, WindowUrl};

mod plugins;

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show".to_string(), "show"))
        .add_item(CustomMenuItem::new("setting".to_string(), "setting"))
        .add_item(CustomMenuItem::new("quit".to_string(), "quit"));
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .plugin(plugins::setting::init())
        .plugin(plugins::command::init())
        .plugin(plugins::store::PluginBuilder::default().build())
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| {
            let show_main_window = || {
                if let Some(window) = app.get_window("main") {
                    window.show().unwrap();
                } else {
                    WindowBuilder::new(app, "main".to_string(), WindowUrl::App("index.html".into()))
                        .title("Wsl2 Tools")
                        .build().unwrap();
                }
            };
            let show_setting_window = || {
                if let Some(window) = app.get_window("setting") {
                    window.show().unwrap();
                } else {
                    WindowBuilder::new(app, "setting".to_string(), WindowUrl::App("index.html/#/setting".into()))
                        .title("Setting")
                        .build().unwrap();
                }
            };
            match event {
                SystemTrayEvent::LeftClick { .. } => {
                    show_main_window();
                }
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "show" => {
                        show_main_window()
                    }
                    "setting" => {
                        show_setting_window()
                    }
                    "quit" => {
                        std::process::exit(0)
                    }
                    _ => {}
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

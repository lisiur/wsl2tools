use tauri::plugin::{TauriPlugin, Builder};
use tauri::{Runtime, Manager};

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("setting")
        .setup(|app_handle| {
            let inner_handle = app_handle.clone();
            app_handle.listen_global("setting-changed", move |event| {
                inner_handle.emit_all("setting-changed", event.payload()).unwrap();
            });
            Ok(())
        })
        .build()
}
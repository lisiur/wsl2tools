#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

use tauri::{
    command,
    plugin::{Builder, TauriPlugin},
    Runtime,
};

use std::process::Command;

const CREATE_NO_WINDOW:u32 = 0x08000000;

#[command]
pub async fn run(command: String, args: Option<Vec<String>>) -> Result<String, String> {
    let mut cmd = Command::new(command);

    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);

    if args.is_some() {
        cmd.args(args.as_ref().unwrap());
    }
    let output = cmd.output().map_err(|e| e.to_string())?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if output.status.success() {
        Ok(stdout.to_string())
    } else {
        let msg = stdout.to_string();
        Ok(msg + &stderr)
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("command")
        .invoke_handler(tauri::generate_handler![
            run
        ])
        .build()
}

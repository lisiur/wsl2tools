import { invoke } from '@tauri-apps/api'

export async function runCommand(command: string, args: string[] = []): Promise<string> {
    const chunks = command.trim().split(/\s+/);
    command = chunks[0]
    args = [...chunks.slice(1), ...args]
    return await invoke<string>("run_command", {
        command,
        args,
    })
}

export async function runScript(script: string, args?: Array<string>): Promise<string> {
    return await invoke<string>("run_script", {
        script,
        args,
    })
}
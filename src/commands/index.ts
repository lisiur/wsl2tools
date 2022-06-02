import { invoke } from '@tauri-apps/api'

export async function runCommand(command: string, args: string[] = []): Promise<string> {
    const chunks = command.trim().split(/\s+/);
    command = chunks[0]
    args = [...chunks.slice(1), ...args]
    return await invoke<string>("plugin:command|run", {
        command,
        args,
    })
}
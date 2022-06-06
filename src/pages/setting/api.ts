import {emit} from '@tauri-apps/api/event'
import {ThemeLiteral} from "@/styles/themes";
import {LangLiteral} from "@/i18n";

export interface Setting {
    theme: ThemeLiteral,
    lang: LangLiteral,
}

export async function broadcastSetting(key: string, value: any) {
    await emit('setting-changed', {key, value})
}
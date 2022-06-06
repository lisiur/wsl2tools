import {ref} from "vue";
import {Store} from '@/utils/store'
import {listen} from "@tauri-apps/api/event";
import {LangLiteral, setLocale} from "@/i18n";
import {setTheme, ThemeLiteral} from "@/styles/themes";

const store = new Store('.settings.dat')
export const theme = ref<ThemeLiteral>('common')
export const lang = ref<LangLiteral>('enUS')


;(async function() {
    await Promise.all([
        store.get<LangLiteral>('lang').then(value => {
            lang.value = value ?? lang.value
            setLocale(lang.value)
        }),
        store.get<ThemeLiteral>('theme').then(value => {
            console.log('theme', value)
            theme.value = value ?? theme.value
            setTheme(theme.value)
        }),
    ])
    await listen('setting-changed', async event => {
        const {key, value} = JSON.parse(event.payload as string) as {key: string, value: any}
        switch (key) {
            case 'theme': {
                theme.value = value
                setTheme(value)
                await store.set('theme', value)
                break
            }
            case 'lang': {
                lang.value = value
                setLocale(value)
                await store.set('lang', value)
                break
            }
            default: {
                break
            }
        }
    })
})()
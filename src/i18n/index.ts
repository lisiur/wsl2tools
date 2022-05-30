import { zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui';
import {ref, computed} from 'vue'
import { createI18n } from 'vue-i18n'
import messages from './messages'

const naiveUiLang = {
    zhCN,
    enUS,
}

const naiveUiDateLang = {
    zhCN: dateZhCN,
    enUS: dateEnUS,
}

export const currentLang = ref<keyof typeof naiveUiLang>('zhCN')
export const currentNaiveUiLang = computed(() => {
    return naiveUiLang[currentLang.value]
})
export const currentNaiveUiDateLang = computed(() => {
    return naiveUiDateLang[currentLang.value]
})

export const i18n = createI18n({
    locale: 'zhCN',
    fallbackLocale: 'enUS',
    globalInjection: true,
    allowComposition: true,
    messages,
})

export function setLocale(lang: keyof typeof naiveUiLang) {
    currentLang.value = lang
    i18n.global.locale = lang;
}

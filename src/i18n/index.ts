import { zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui';
import {ref, computed} from 'vue'
import { createI18n } from 'vue-i18n'
import messages from './messages'

const Lang = {
    zhCN,
    enUS,
}

const DateLang = {
    zhCN: dateZhCN,
    enUS: dateEnUS,
}

export type LangLiteral = keyof typeof Lang

export const currentLang = ref<keyof typeof Lang>('zhCN')
export const currentNaiveUiLang = computed(() => {
    return Lang[currentLang.value]
})
export const currentNaiveUiDateLang = computed(() => {
    return DateLang[currentLang.value]
})

export const i18n = createI18n({
    locale: 'zhCN',
    fallbackLocale: 'enUS',
    globalInjection: true,
    allowComposition: true,
    messages,
})

export function setLocale(lang: LangLiteral) {
    currentLang.value = lang
    i18n.global.locale = lang;
}

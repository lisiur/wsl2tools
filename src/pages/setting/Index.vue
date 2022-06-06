<template>
<div class="p-4">
    <n-form>
        <n-form-item :label="t('Language')">
            <n-select :value="lang" :options="languageOptions" @update:value="(value: string) => broadcastSetting('lang', value)"></n-select>
        </n-form-item>
        <n-form-item :label="t('Theme')">
            <n-select :value="theme" :options="themeOptions" @update:value="(value: string) => broadcastSetting('theme', value)"></n-select>
        </n-form-item>
    </n-form>
</div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {computed} from "vue";
import {theme, lang} from '@/setting'
import {broadcastSetting} from "@/pages/setting/api";

const {t} = useI18n()

const languageOptions = computed(() => {
    return [
        {
            label: t('Chinese'),
            value: 'zhCN'
        },
        {
            label: t('English'),
            value: 'enUS'
        }
    ]
})

const themeOptions = computed(() => {
    return [
        {
            label: t('Light'),
            value: 'common'
        },
        {
            label: t('Dark'),
            value: 'dark'
        }
    ]
})
</script>

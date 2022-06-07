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
import {computed, onMounted} from "vue";
import {theme, lang} from '@/setting'
import {broadcastSetting} from "@/pages/setting/api";
import {appWindow, currentMonitor, PhysicalSize, PhysicalPosition} from '@tauri-apps/api/window'

const {t} = useI18n()

onMounted(async () => {
    await appWindow.listen('tauri://blur', () => {
        appWindow.hide()
    })
    const width = 480;
    const height = 640;
    await appWindow.setSize(new PhysicalSize(width, height))
    const monitor = await currentMonitor()
    if(monitor) {
        const {width: monitorWidth, height: monitorHeight} = monitor.size
        const x = Math.floor(monitorWidth - width) - 2
        const y = Math.floor(monitorHeight - height) - 62
        await appWindow.setPosition(new PhysicalPosition(x, y))
        await appWindow.show()
    }
})

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

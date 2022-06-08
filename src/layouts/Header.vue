<template>
<div class="px-4 py-2 user-select-[none]" v-bind="attrs">
    <n-grid v-bind="attrs" :cols="2">
        <n-gi v-bind="attrs">
            <n-space align="center" class="height-[2rem]" v-bind="attrs">
                <span v-if="show_title">{{title}}</span>
            </n-space>
        </n-gi>
        <n-gi v-bind="attrs">
            <n-space justify="end" align="center" class="height-[2rem]" item-style="display: flex; align-items:center;" v-bind="attrs">
                <n-button quaternary size="tiny">
                    <template #icon>
                        <n-icon :component="WindowMinimize" :depth="iconDepth" class="cursor-pointer" @click="appWindow.minimize()" v-if="min_button"></n-icon>
                    </template>
                </n-button>
                <n-button quaternary size="tiny">
                    <template #icon>
                        <n-icon :component="WindowMaximize" :depth="iconDepth" class="cursor-pointer" @click="appWindow.toggleMaximize()" v-if="max_button"></n-icon>
                    </template>
                </n-button>
                <n-button quaternary size="tiny">
                    <template #icon>
                        <n-icon :component="WindowClose" :depth="iconDepth" class="cursor-pointer" @click="appWindow.hide()" v-if="close_button"></n-icon>
                    </template>
                </n-button>
            </n-space>
        </n-gi>
    </n-grid>
</div>
</template>

<script lang="ts" setup>
import {WindowMinimize, WindowMaximize, WindowClose} from '@vicons/fa'
import {appWindow} from '@tauri-apps/api/window'
import {useRoute} from 'vue-router'
import {computed} from "vue";
import {getTheme} from "@/styles/themes";

const route = useRoute()
const title = route.meta.title ?? ''
const show_title = route.meta.show_title ?? false
const draggable = route.meta.draggable ?? false
const min_button = route.meta.min_button ?? false
const max_button = route.meta.max_button ?? false
const close_button = route.meta.close_button ?? false

const attrs = {
    'data-tauri-drag-region': draggable ? true : undefined,
}

const iconDepth = computed(() => {
    return getTheme() === 'common' ? 3 : 3
})
</script>

<style scoped>
</style>
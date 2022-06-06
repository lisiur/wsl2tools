<template>
<div class="px-4 py-2" v-bind="attrs">
    <n-grid v-bind="attrs" :cols="2">
        <n-gi v-bind="attrs">
            <span v-if="show_title">{{title}}</span>
        </n-gi>
        <n-gi v-bind="attrs">
            <n-space justify="end" align="center" v-bind="attrs">
                <n-icon :component="WindowMinimize" class="cursor-pointer" @click="appWindow.minimize()" v-if="min_button"></n-icon>
                <n-icon :component="WindowMaximize" class="cursor-pointer" @click="appWindow.toggleMaximize()" v-if="max_button"></n-icon>
                <n-icon :component="WindowClose" class="cursor-pointer" @click="appWindow.hide()" v-if="close_button"></n-icon>
            </n-space>
        </n-gi>
    </n-grid>
</div>
</template>

<script lang="ts" setup>
import {WindowMinimize, WindowMaximize, WindowClose} from '@vicons/fa'
import {appWindow} from '@tauri-apps/api/window'
import {useRoute} from 'vue-router'

const route = useRoute()
const title = route.meta.title ?? ''
const show_title = route.meta.show_title ?? false
const draggable = route.meta.draggable ?? false
const min_button = route.meta.min_button ?? false
const max_button = route.meta.max_button ?? false
const close_button = route.meta.close_button ?? false
console.log(close_button)

const attrs = {
    'data-tauri-drag-region': draggable ? true : undefined,
}
</script>

<style scoped>
</style>
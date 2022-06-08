<template>
    <n-layout class="h-full rounded-lg">
        <n-layout-header>
            <Header></Header>
        </n-layout-header>
        <n-layout-content content-style="padding: 1rem">
            <router-view></router-view>
        </n-layout-content>
        <n-layout-footer>
            <Footer></Footer>
        </n-layout-footer>
    </n-layout>
</template>

<script lang="ts" setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

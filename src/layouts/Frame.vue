<template>
    <n-layout class="h-full">
        <Header></Header>
        <router-view></router-view>
        <Footer></Footer>
    </n-layout>
</template>

<script lang="ts" setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

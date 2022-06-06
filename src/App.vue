<template>
<n-config-provider
    :theme="currentNaiveUiTheme"
    :theme-overrides="naiveUiOverrides"
    :locale="currentNaiveUiLang"
    :date-locale="currentNaiveUiDateLang"
    :breakpoints="breakpoints"
>
    <n-dialog-provider>
        <n-message-provider>
            <router-view></router-view>
        </n-message-provider>
    </n-dialog-provider>
</n-config-provider>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {NConfigProvider, darkTheme,} from "naive-ui";
import {breakpoints} from './compositions/breakpoint'
import {currentNaiveUiLang, currentNaiveUiDateLang} from './i18n'
import {setTheme, getTheme, getNaiveUiThemeOverrides} from './styles/themes'

const currentTheme = getTheme()
const naiveUiOverrides = getNaiveUiThemeOverrides()
const currentNaiveUiTheme = computed(() => currentTheme.value === 'dark' ? darkTheme : null);

setTheme('common')

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>

<template lang="pug">
n-form(
    label-placement="left"
    label-width="auto"
)
    n-form-item(:label="t('Listen Address')")
        n-input(v-model:value="model.listenAddress")
    n-form-item(:label="t('Listen Port')")
        n-input-number(v-model:value="model.listenPort" :show-button="false")
    n-form-item(:label="t('Target Address')")
        n-input-group
            n-input(v-model:value="model.targetAddress")
            n-button(
                type="primary"
                :loading="getWslIpLoading"
                @click="fillWithWslIpHandler"
            ) {{t('Fill wsl ip')}}
    n-form-item(:label="t('Target Port')")
        n-input-number(v-model:value="model.targetPort" :show-button="false")
</template>

<script lang="ts" setup>
import {type PortRedirection, getWsl2Ip} from "./api";
import {ref} from "vue";
import {useI18n} from "vue-i18n"
import {useTask} from "@/compositions/task";
import {useMessage} from 'naive-ui'

interface Props {
    model: PortRedirection,
}

interface Events {
}

const props = defineProps<Props>()
const emits = defineEmits<Events>()
defineExpose({})

const {t} = useI18n()
const message = useMessage()

const model = ref<null | PortRedirection>(props.model)

const {exec: doGetWsl2Ip, running: getWslIpLoading} = useTask(getWsl2Ip, message.error)

async function fillWithWslIpHandler() {
    if (model.value) {
        model.value.targetAddress = await doGetWsl2Ip()
    }
}
</script>

<style scoped>
</style>
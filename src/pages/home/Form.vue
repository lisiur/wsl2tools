<template>
<n-form ref="formRef" label-placement="left" label-width="auto" :model="model" :rules="rules">
    <!-- <n-form-item :label="t('Listen Address')" path="listenAddress">
        <n-input v-model:value="model.listenAddress"></n-input>
    </n-form-item> -->
    <n-form-item :label="t('Listen Port')" path="listenPort">
        <n-input-number v-model:value="model.listenPort" :show-button="false"></n-input-number>
    </n-form-item>
    <!-- <n-form-item :label="t('Target Address')" path="targetAddress">
        <n-input-group>
            <n-input v-model:value="model.targetAddress"></n-input>
            <n-button type="primary" :loading="getWslIpLoading" @click="fillWithWslIpHandler">
                {{t('Fill wsl ip')}}
            </n-button>
        </n-input-group>
    </n-form-item> -->
    <n-form-item :label="t('Target Port')" path="targetPort">
        <n-input-number v-model:value="model.targetPort" :show-button="false"></n-input-number>
    </n-form-item>
</n-form>
</template>

<script lang="ts" setup>
import {type PortRedirection, getWsl2Ip} from "./api";
import {computed, ref, toRaw} from "vue";
import {useI18n} from "vue-i18n"
import {useTask} from "@/compositions/task";
import {useMessage} from 'naive-ui'

interface Props {
    model: PortRedirection,
}

const props = defineProps<Props>()

const {t} = useI18n()
const message = useMessage()

const formRef = ref<any>(null)

const sync = ref(false)

const model = ref<null | PortRedirection>(toRaw(props.model))
const rules = computed(() => {
    return {
        listenAddress: [{
            required: true,
            trigger: ['input'],
            message: t('Please input listen address'),
        }],
        listenPort: [{
            type: 'number',
            required: true,
            trigger: ['input'],
            message: t('Please input listen port'),
        }],
        targetAddress: [{
            required: true,
            trigger: ['input'],
            message: t('Please input target address'),
        }],
        targetPort: [{
            type: 'number',
            required: true,
            trigger: ['input'],
            message: t('Please input target port'),
        }],
    }
})

const {exec: doGetWsl2Ip, running: getWslIpLoading} = useTask(getWsl2Ip, message.error)

async function fillWithWslIpHandler() {
    if (model.value) {
        model.value.targetAddress = await doGetWsl2Ip()
        formRef.value?.validate()
    }
}

async function validate() {
    return await formRef.value?.validate().then(() => true).catch(() => false)
}

defineExpose({
    validate,
})
</script>

<style scoped>
</style>
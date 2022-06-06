<template>
<n-modal
    v-model:show="props.config.visible.value"
    preset="dialog"
    :title="props.config.title.value"
    :show-icon="false"
>
    <template #header>
        <n-space class="m-auto">
            <span class="lg font-bold"> {{ props.config.title.value }}</span>
        </n-space>
    </template>
    <template #action>
        <n-space class="m-auto">
            <n-button
                type="default"
                :loading="props.config.negativeLoading.value"
                @click="props.config.negativeHandler"
            >
                {{ props.config.negativeText.value }}
            </n-button>
            <n-button
                type="primary"
                :loading="props.config.positiveLoading.value"
                @click="props.config.positiveHandler"
            >
                {{ props.config.positiveText.value }}
            </n-button>
        </n-space>
    </template>
    <Component ref="formRef" :is="props.component" :model="props.config.model.value"></Component>
</n-modal>
</template>

<script lang="ts" setup>
import {ref, type Ref, watch} from "vue";

interface Props {
    component: any,
    config: {
        formRef: Ref<any>,
        positiveHandler: any,
        negativeHandler: any,
        positiveLoading: Ref<boolean>,
        negativeLoading: Ref<boolean>,
        positiveText: Ref<string>,
        negativeText: Ref<string>,
        model: Ref<any>,
        title: Ref<string>,
        visible: Ref<boolean>
    }
}

const props = defineProps<Props>()
const formRef = ref<any>(null)

watch(formRef, () => {
    props.config.formRef.value = formRef.value
})

</script>
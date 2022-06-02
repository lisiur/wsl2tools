<template lang="pug">
n-modal(
    v-model:show="props.config.visible.value"
    preset="dialog"
    :title="props.config.title.value"
    :show-icon="false"
)
    template(#header)
        n-space.m-auto
            span.lg.font-bold {{props.config.title.value}}

    template(#action)
        n-space.m-auto
            n-button(
                type="default"
                :loading="props.config.negativeLoading.value"
                @click="props.config.negativeHandler"
            )
                | {{props.config.negativeText.value}}
            n-button(
                type="primary"
                :loading="props.config.positiveLoading.value"
                @click="props.config.positiveHandler"
            )
                | {{props.config.positiveText.value}}
    Component(ref="formRef" :is="props.component" :model="props.config.model.value")
</template>

<script lang="ts" setup>
import {ref, type Ref, watch} from "vue";
import clonedeep from 'lodash.clonedeep'

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
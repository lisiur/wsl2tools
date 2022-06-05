<template lang="pug">
.p-4
    n-grid(y-gap="12" :cols="1")
        n-gi
            n-space(justify="end")
                n-button(
                    tertiary
                    type="primary"
                    :loading="refreshLoading"
                    @click="refreshTable"
                )
                    template(#icon)
                        n-icon(:component="RefreshIcon")
                    | {{$t('Refresh')}}
                n-button(
                    type="primary"
                    @click="createHandler"
                )
                    template(#icon)
                        n-icon(:component="AddIcon")
                    | {{ $t('Create') }}
        n-gi
            Table(:wsl-ip="wslIp" @edit="updateHandler")

FormModal(:config="createFormModalConfig" :component="Form")
FormModal(:config="editFormModalConfig" :component="Form")

</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useI18n} from 'vue-i18n'
import {
    type PortRedirection,
    newPortRedirection,
    updatePortRedirection,
    createPortRedirection,
    getWsl2Ip,
} from './api'
import Form from "./Form.vue"
import useTableUi from "./Table"
import {FormModal, useFormModal} from '@/components/formModal'
import {
    Plus as AddIcon,
    Redo as RefreshIcon,
} from '@vicons/fa'
import {useMessage} from "naive-ui";
import {useTask} from "@/compositions/task";

const {t} = useI18n()
const message = useMessage()

const wslIp = ref('')
onMounted(async () => {
    wslIp.value = await getWsl2Ip()
})

const {Table, reload, loading: tableLoading, loadFirstPage} = useTableUi()

const {show: showCreateFormModal, config: createFormModalConfig } = useFormModal()
const {show: showEditFormModal, config: editFormModalConfig } = useFormModal()

const {exec: doGetWsl2Ip, running: getWsl2IpLoading} = useTask(getWsl2Ip)
const refreshLoading = computed(() => {
    return getWsl2IpLoading.value || tableLoading.value
})

async function refreshTable() {
    wslIp.value = await doGetWsl2Ip()
    await reload()
}

async function createHandler() {
    const [positive] = await showCreateFormModal({
        title: t('Create'),
        positiveText: t('Create'),
        negativeText: t('Cancel'),
        model: newPortRedirection(),
        positiveHandler: async (model) => {
            await createPortRedirection(model)
        }
    })
    if (positive) {
        await loadFirstPage()
    }
}

async function updateHandler(model: PortRedirection) {
    const oldPortRedirection = {...model}
    const [positive] = await showEditFormModal({
        title: t('Edit'),
        positiveText: t('Save'),
        negativeText: t('Cancel'),
        model,
        positiveHandler: async (model) => {
            await updatePortRedirection(model, oldPortRedirection)
        }
    })
    if (positive) {
        await loadFirstPage()
    }
}
</script>

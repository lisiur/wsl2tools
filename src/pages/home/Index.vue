<template lang="pug">
.p-4
    n-grid(y-gap="12" :cols="1")
        n-gi
            n-space(justify="end")
                n-button(
                    tertiary
                    type="primary"
                    :loading="tableLoading"
                    @click="reload"
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
            Table(@edit="updateHandler")

FormModal(:config="createFormModalConfig" :component="Form")
FormModal(:config="editFormModalConfig" :component="Form")

</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from 'vue-i18n'
import {
    type PortRedirection,
    newPortRedirection,
    updatePortRedirection,
    createPortRedirection,
} from './api'
import Form from "./Form.vue"
import newTable from "./Table"
import {FormModal, useFormModal} from '@/components/formModal'
import {
    AddSquare24Filled as AddIcon,
    ArrowClockwise24Filled as RefreshIcon,
} from '@vicons/fluent'
import {useMessage} from "naive-ui";

const {t} = useI18n()
const message = useMessage()

const {Table, reload, loading: tableLoading, loadFirstPage} = newTable()

const {show: showCreateFormModal, config: createFormModalConfig } = useFormModal()
const {show: showEditFormModal, config: editFormModalConfig } = useFormModal()

async function createHandler() {
    const [positive] = await showCreateFormModal({
        title: t('Create'),
        positiveText: t('Create'),
        negativeText: t('Cancel'),
        model: newPortRedirection(),
        positiveHandler: async (model) => {
            debugger
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
            await reload()
        }
    })
    if (positive) {
        await loadFirstPage()
    }
}
</script>

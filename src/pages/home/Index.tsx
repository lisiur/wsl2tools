import {computed, defineComponent, onMounted, ref} from "vue";
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
import {useMessage, NGrid, NGi, NSpace, NButton, NIcon} from "naive-ui";
import {useTask} from "@/compositions/task";


export default defineComponent({
    setup() {
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
                model: newPortRedirection(wslIp.value),
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
        return () => (
            <div class="p-4">
                <NGrid y-gap={12} cols={1}>
                    <NGi>
                        <NSpace justify="end">
                            <NButton tertiary type="primary" loading={refreshLoading.value} onClick={refreshTable}>
                                {{
                                    icon: () => <NIcon component={RefreshIcon}></NIcon>,
                                    default: () => t('Refresh'),
                                }}
                            </NButton>
                            <NButton type="primary" onClick={createHandler}>
                                {{
                                    icon: () => <NIcon component={AddIcon}></NIcon>,
                                    default: () => t('Create'),
                                }}
                            </NButton>
                        </NSpace>
                    </NGi>
                    <NGi>
                        <Table wslIp={wslIp.value} onEdit={updateHandler}></Table>
                    </NGi>
                </NGrid>
                <FormModal config={createFormModalConfig} component={Form}></FormModal>
                <FormModal config={editFormModalConfig} component={Form}></FormModal>
            </div>
        )
    },
})

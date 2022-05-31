import mitt from 'mitt'
import {computed, ref} from "vue";
import {i18n} from '@/i18n'
import {PortRedirection, getPortRedirectionList, deletePortRedirection} from './api'
import {chainedTask, useTask} from '@/compositions/task'
import {DataTableColumns, NButton, NSpace, NIcon, NPopconfirm} from 'naive-ui'
import {
    NotepadEdit20Regular as EditIcon,
    Delete20Regular as DeleteIcon,
} from "@vicons/fluent"

const {t} = i18n.global

export function useList() {
    const emitter = mitt<{ edit: PortRedirection, delete: PortRedirection }>()
    const data = ref<Array<any>>([])
    const {exec: fetchList, running: fetchListLoading} = useTask(
        () => getPortRedirectionList()
            .then((value) => {
                data.value = value
            })
    )
    const columns = computed<DataTableColumns<PortRedirection>>(() => {
        const {exec: doDelete, running: deleteLoading} = useTask(deletePortRedirection)
        return [
            {
                title: t('Listen Address'),
                key: 'listenAddress',
            },
            {
                title: t('Listen Port'),
                key: 'listenPort',
            },
            {
                title: t('Target Address'),
                key: 'targetAddress',
            },
            {
                title: t('Target Port'),
                key: 'targetPort',
            },
            {
                title: t('Action'),
                key: 'action',
                render(row) {
                    const deleteAndReload = chainedTask(doDelete.bind(null, row), fetchList)
                    return (<NSpace>
                        <NButton type="primary" size="small" quaternary
                                 onClick={() => emitter.emit('edit', row)}
                        >
                            {{
                                icon: () => (<NIcon component={EditIcon}></NIcon>),
                                default: () => (t('edit'))
                            }}
                        </NButton>

                        <NPopconfirm
                            onPositiveClick={deleteAndReload}
                        >
                            {{
                                trigger: () => (
                                    <NButton type="error" size="small" quaternary loading={deleteLoading.value}>
                                        {{
                                            icon: () => (<NIcon component={DeleteIcon}></NIcon>),
                                            default: () => (t('delete'))
                                        }}
                                    </NButton>
                                ),
                                default: () => t("Confirm to delete?")
                            }}
                        </NPopconfirm>
                    </NSpace>)
                }
            },
        ]
    })
    const newPortRedirection = () => {
        return {
            listenAddress: '0.0.0.0',
            listenPort: null,
            targetAddress: '',
            targetPort: null,
        }
    }
    return {
        columns,
        fetchList,
        fetchListLoading,
        data,
        emitter,
        newPortRedirection,
    }
}
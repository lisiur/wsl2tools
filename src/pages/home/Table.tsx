import {computed, defineComponent, PropType} from "vue";
import {type DataTableColumns, NButton, NIcon, NPopconfirm, NSpace} from "naive-ui";
import {deletePortRedirection, getPortRedirectionList, type PortRedirection} from "@/pages/home/api";
import {chainedTask, useTask} from "@/compositions/task";
import {Delete20Regular as DeleteIcon, NotepadEdit20Regular as EditIcon} from "@vicons/fluent";
import {useI18n} from "vue-i18n";
import {useDataTable, DataTable} from "@/components/dataTable";

async function dataTableService(params: { pageSize: number, pageNum: number }) {
    return await getPortRedirectionList()
}

const props = {
    onEdit: Function as PropType<(v: PortRedirection) => void>,
}

export type TableProps = typeof props

export default function Table() {
    const {loading, reload, loadFirstPage, dataList: data, config} = useDataTable(dataTableService)
    return {
        Table: defineComponent({
            props,
            setup(props) {
                const {t} = useI18n()
                const columns = computed<DataTableColumns<PortRedirection>>(() => {
                    const {exec: doDelete, running: deleteLoading} = useTask(deletePortRedirection)
                    return [
                        {
                            title: t('Listen Address'),
                            key: 'listenAddress',
                            align: 'center',
                        },
                        {
                            title: t('Listen Port'),
                            key: 'listenPort',
                            align: 'center',
                        },
                        {
                            title: t('Target Address'),
                            key: 'targetAddress',
                            align: 'center',
                        },
                        {
                            title: t('Target Port'),
                            key: 'targetPort',
                            align: 'center',
                        },
                        {
                            title: t('Action'),
                            key: 'action',
                            align: 'center',
                            render(row) {
                                const deleteAndReload = chainedTask(doDelete.bind(null, row), reload)
                                return (
                                    <NSpace justify="center">
                                        <NButton type="primary" size="small" quaternary
                                                 onClick={() => props.onEdit?.(row)}
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
                                                    <NButton type="error" size="small" quaternary
                                                             loading={deleteLoading.value}>
                                                        {{
                                                            icon: () => (<NIcon component={DeleteIcon}></NIcon>),
                                                            default: () => (t('delete'))
                                                        }}
                                                    </NButton>
                                                ),
                                                default: () => t("Confirm to delete?")
                                            }}
                                        </NPopconfirm>
                                    </NSpace>
                                )
                            }
                        },
                    ]
                })
                return () => (<DataTable columns={columns.value} data={data.value} config={config}></DataTable>)
            },
        }),
        loading,
        reload,
        loadFirstPage,
        data,
    }
}

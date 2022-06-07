import {computed, defineComponent, PropType} from "vue";
import {
    type DataTableColumns,
    NButton,
    NIcon,
    NPopconfirm,
    NSpace,
    NEl,
    NPopselect,
    NSpin,
    useMessage
} from "naive-ui";
import {
    type PortRedirection,
    deletePortRedirection,
    getPortRedirectionList,
    updatePortRedirectionTargetAddress,
} from "@/pages/home/api";
import {chainedTask, useTask} from "@/compositions/task";
import {
    Trash as DeleteIcon,
    Edit as EditIcon,
    Linux as LinuxIcon,
    Windows as WindowsIcon,
} from "@vicons/fa";
import {useI18n} from "vue-i18n";
import {useDataTable, DataTable} from "@/components/dataTable";

async function dataTableService(params: { pageSize: number, pageNum: number }) {
    return await getPortRedirectionList()
}

const props = {
    wslIp: String,
    onEdit: Function as PropType<(v: PortRedirection) => void>,
}

export type TableProps = typeof props

export default function useTableUi() {
    const {loading, reload, loadFirstPage, dataList: data, config} = useDataTable(dataTableService)
    return {
        Table: defineComponent({
            props,
            setup(props) {
                const {t} = useI18n()
                const message = useMessage()
                const columns = computed<DataTableColumns<PortRedirection>>(() => {
                    return [
                        /* {
                            title: t('Listen Address'),
                            key: 'listenAddress',
                            align: 'center',
                        }, */
                        {
                            title: t('Listen Port'),
                            key: 'listenPort',
                            align: 'center',
                        },
                        {
                            title: t('Target Port'),
                            key: 'targetPort',
                            align: 'center',
                        },
                        {
                            title: t('Target Address'),
                            key: 'targetAddress',
                            align: 'center',
                            render(row) {
                                const {exec: doUpdate, running: updateLoading} = useTask(updatePortRedirectionTargetAddress)
                                const updateAndReload = async () => {
                                    if (!props.wslIp) {
                                        message.warning(t("wsl ip is empty"))
                                        return
                                    }
                                    await doUpdate(row, props.wslIp)
                                    await loadFirstPage()
                                }
                                const isLinux = computed(() => {
                                    return row.targetAddress === props.wslIp
                                })
                                const popSelectOptions = [];
                                const popSelectHandler = async (key: string) => {
                                    if (key === 'updateWslIp') {
                                        await updateAndReload()
                                    }
                                }
                                if (props.wslIp !== row.targetAddress) {
                                    popSelectOptions.push({
                                        label: t("Update wsl ip"),
                                        value: "updateWslIp",
                                    })
                                }
                                let icon;
                                if (isLinux.value) {
                                    icon = <NIcon component={LinuxIcon} depth={1}></NIcon>
                                } else {
                                    icon = <NIcon component={WindowsIcon} depth={1}></NIcon>
                                }
                                let ele = (
                                    <NSpace justify="center" align="center" itemStyle={{display: 'flex', alignItems: 'center'}}>
                                        <NEl tag="span">
                                            {row.targetAddress}
                                        </NEl>
                                        <NSpin show={updateLoading.value}>
                                            <div class="flex-center">
                                                {icon}
                                            </div>
                                        </NSpin>
                                    </NSpace>
                                )
                                if (!isLinux.value) {
                                    ele = (
                                        <NPopselect options={popSelectOptions} onUpdateValue={popSelectHandler}>
                                            {ele}
                                        </NPopselect>
                                    )
                                }

                                return (
                                    <NSpace justify="center" align="center">
                                        {ele}
                                    </NSpace>
                                )
                            }
                        },
                        {
                            title: t('Action'),
                            key: 'action',
                            align: 'right',
                            render(row) {
                                const {exec: doDelete, running: deleteLoading} = useTask(deletePortRedirection)
                                const deleteAndReload = chainedTask(doDelete.bind(null, row), reload)
                                return (
                                    <NSpace justify="end">
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

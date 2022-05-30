import {h} from 'vue'
import mitt from 'mitt'
import {runCommand} from '@/commands'
import {computed, onMounted, ref} from "vue";
import {i18n} from '@/i18n'
import {DataTableColumns, NButton, NSpace, NIcon, NSpin} from 'naive-ui'
import {
    NotepadEdit20Regular as EditIcon,
    Delete20Regular as DeleteIcon,
} from "@vicons/fluent"

const {t} = i18n.global

export interface PortRedirection {
    listenAddress: string
    listenPort: number
    targetAddress: string
    targetPort: number
}

export function useList() {
    const emitter = mitt<{ edit: PortRedirection, delete: PortRedirection }>()
    const data = ref<Array<any>>([])
    const deleteLoading = ref(false)
    const columns = computed<DataTableColumns<PortRedirection>>(() => {
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
                    return (<NSpace>
                        <NButton type="primary" size="small" quaternary
                                 onClick={() => emitter.emit('edit', row)}
                        >
                            {{
                                icon: () => ( <NIcon component={EditIcon}></NIcon> ),
                                default: () => ( t('edit') )
                            }}
                        </NButton>

                        <NButton type="error" size="small" quaternary loading={deleteLoading.value}
                                 onClick={() => emitter.emit('delete', row)}>
                            {{
                                icon: () => ( <NIcon component={DeleteIcon}></NIcon> ),
                                default: () => ( t('delete') )
                            }}
                        </NButton>
                    </NSpace>)
                }
            },
        ]
    })
    const fetchListLoading = ref(false);
    const fetchList = async () => {
        fetchListLoading.value = true
        try {
            data.value = await getPortRedirectionList()
        } finally {
            fetchListLoading.value = false
        }
    }
    const newPortRedirection = () => {
        return {
            listenAddress: '0.0.0.0',
            listenPort: 0,
            targetAddress: '',
            targetPort: 0,
        }
    }
    return {
        columns,
        fetchList,
        fetchListLoading,
        data,
        emitter,
        newPortRedirection,
        deleteLoading,
    }
}

async function execPowershellCommand(script: string) {
    return await runCommand(`PowerShell.exe ${script}`)
}

export async function getPortRedirectionList() {
    let output = await execPowershellCommand("netsh interface portproxy show v4tov4")
    return output.trim().split('\n').slice(4).map(item => {
        const [listenAddress, listenPort, targetAddress, targetPort] = item.split(/\s+/)
        return {
            listenAddress,
            listenPort: Number(listenPort),
            targetAddress,
            targetPort: Number(targetPort),
        }
    })
}

export async function updatePortRedirection(newPr: PortRedirection, oldPr: PortRedirection) {
    await deletePortRedirection(oldPr)
    await createPortRedirection(newPr)
}

export async function createPortRedirection(pr: PortRedirection) {
    const command = `netsh interface portproxy add v4tov4 listenport=${pr.listenPort} listenaddress=${pr.listenAddress} connectport=${pr.targetPort} connectaddress=${pr.targetAddress}`;
    await execPowershellCommand(command)
}

export async function deletePortRedirection(pr: PortRedirection) {
    const command = `netsh interface portproxy delete v4tov4 listenport=${pr.listenPort} listenaddress=${pr.listenAddress}`;
    await execPowershellCommand(command)
}

export async function getWsl2Ip() {
    const command = `wsl -- ip -o -4 -json addr list eth0
                    | ConvertFrom-Json
                    | %{ $_.addr_info.local }
                    | ?{ $_ }`
    let output = await execPowershellCommand(command)
    return output.trim()
}

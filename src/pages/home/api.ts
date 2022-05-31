import {runCommand} from "@/commands";
import {i18n} from '@/i18n'

const {t} = i18n.global

export interface PortRedirection {
    listenAddress: string
    listenPort: number
    targetAddress: string
    targetPort: number
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
    let output = (await execPowershellCommand(command)).trim();
    if (!output) {
        throw new Error(t('Failed to get wsl ip'))
    }
    return output.trim()
}
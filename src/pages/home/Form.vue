<template>
  <n-form
      label-placement="left"
      label-width="auto"
  >
    <n-form-item :label="t('Listen Address')">
      <n-input v-model:value="model.listenAddress"></n-input>
    </n-form-item>
    <n-form-item :label="t('Listen Port')">
      <n-input-number v-model:value="model.listenPort" :show-button="false"></n-input-number>
    </n-form-item>
    <n-form-item :label="t('Target Address')">
      <n-input-group>
        <n-input v-model:value="model.targetAddress"></n-input>
        <n-button @click="fillWithWslIpHandler" type="primary">{{t('Fill wsl ip')}}</n-button>
      </n-input-group>
    </n-form-item>
    <n-form-item :label="t('Target Port')">
      <n-input-number v-model:value="model.targetPort" :show-button="false"></n-input-number>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {PortRedirection, getWsl2Ip} from "@/pages/home/portRedirection";
import {ref, toRaw, watch} from "vue";
import {useI18n} from "vue-i18n"

interface Props {
  model: PortRedirection,
}
interface Events {}
const props = defineProps<Props>()
const emits = defineEmits<Props>()
defineExpose({})

const {t} = useI18n()

const model = ref<null | PortRedirection>(props.model)

async function fillWithWslIpHandler() {
  if (model.value) {
    model.value.targetAddress = await getWsl2Ip()
  }
}

</script>

<style scoped>
</style>
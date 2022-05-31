<template>
  <div class="p-4">
    <n-space vertical>
      <n-space justify="end">
        <n-button tertiary type="primary" :loading="fetchListLoading" @click="() => fetchList()">
          <template #icon>
            <n-icon :component="RefreshIcon"></n-icon>
          </template>
          {{ $t('Refresh') }}
        </n-button>
        <n-button type="primary" @click="showCreateModal(newPortRedirection())">
          <template #icon>
            <n-icon :component="AddIcon"></n-icon>
          </template>
          {{ $t('Create') }}
        </n-button>
      </n-space>
      <n-spin :show="fetchListLoading">
        <n-data-table :columns="columns" :data="data"></n-data-table>
      </n-spin>
    </n-space>
  </div>
  <n-modal
      v-model:show="createModalVisible"
      preset="dialog"
      :title="t('create')"
      :positive-text="t('create')"
      :negative-text="t('cancel')"
      :loading="createLoading"
      @positive-click="createHandler"
  >
    <Form :model="creatingModel" v-if="creatingModel"></Form>
  </n-modal>
  <n-modal
      v-model:show="editModalVisible"
      preset="dialog"
      :title="t('edit')"
      :positive-text="t('modify')"
      :negative-text="t('cancel')"
      :loading="updateLoading"
      @positive-click="updateHandler"
  >
    <Form :model="editingModel" v-if="editingModel"></Form>
  </n-modal>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {useI18n} from 'vue-i18n'
import {
  PortRedirection,
  updatePortRedirection,
  createPortRedirection,
} from './api'
import {chainedTask, useTask} from '@/compositions/task'
import {useList} from './portRedirection'
import Form from "./Form.vue"
import {useModal} from "@/compositions/modal";
import {
  AddSquare24Filled as AddIcon,
  ArrowClockwise24Filled as RefreshIcon,
} from '@vicons/fluent'
import {useMessage} from "naive-ui";

interface Props {
}

interface Events {
}

const props = defineProps<Props>()
const emits = defineEmits<Props>()
defineExpose({})


const {t} = useI18n()
const message = useMessage()

const {
  emitter,
  data,
  columns,
  fetchList,
  fetchListLoading,
  newPortRedirection,
} = useList()

const {
  visible: createModalVisible,
  show: showCreateModal,
  model: creatingModel
} = useModal<PortRedirection>()

const {
  visible: editModalVisible,
  show: showEditModal,
  model: editingModel
} = useModal<PortRedirection>()

const {exec: doUpdate, running: updateLoading} = useTask(updatePortRedirection, message.error)
const {exec: doCreate, running: createLoading} = useTask(createPortRedirection, message.error)

const createPipeline = chainedTask(
    () => doCreate(creatingModel.value as PortRedirection).then(() => {
      createModalVisible.value = false
    }),
    fetchList,
)

const updatePipeline = chainedTask(
    () => doUpdate(editingModel.value as PortRedirection, oldPortRedirection as PortRedirection).then(() => {
      editModalVisible.value = false
    }),
    fetchList,
)


async function createHandler() {
  await createPipeline()
  return false
}
async function updateHandler() {
  await updatePipeline()
  return false
}

onMounted(() => {
  fetchList()
})

// 编辑配置
let oldPortRedirection: PortRedirection | null = null
emitter.on('edit', (row) => {
  oldPortRedirection = {...row}
  showEditModal(row)
})
</script>

<style scoped>
</style>
<template>
  <div class="p-4">
    <n-space vertical>
      <n-space justify="end">
        <n-button type="primary" @click="showCreateModal(newPortRedirection())">
          <template #icon>
            <n-icon :component="AddIcon"></n-icon>
          </template>
          {{ $t('Create') }}
        </n-button>
      </n-space>
      <n-spin :show="tableLoading">
        <n-data-table :columns="columns" :data="data"></n-data-table>
      </n-spin>
    </n-space>
  </div>
  <n-modal
      :positive-text="t('create')"
      :negative-text="t('cancel')"
      :title="t('create')"
      preset="dialog"
      :loading="createLoading"
      v-model:show="createModalVisible"
      @positive-click="createHandler"
  >
    <Form :model="creatingModel"></Form>
  </n-modal>
  <n-modal
      :positive-text="t('modify')"
      :negative-text="t('cancel')"
      :title="t('edit')"
      preset="dialog"
      :loading="updateLoading"
      v-model:show="editModalVisible"
      @positive-click="updateHandler"
  >
    <Form :model="editingModel"></Form>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {useI18n} from 'vue-i18n'
import {setLocale} from '@/i18n'
import {
  PortRedirection,
  useList,
  updatePortRedirection,
  deletePortRedirection,
  createPortRedirection,
  getWsl2Ip
} from './portRedirection'
import Form from "./Form.vue"
import {useModal} from "@/compositions/modal";
import {
  AddSquare24Filled as AddIcon,
} from '@vicons/fluent'

interface Props {
}

interface Events {
}

const props = defineProps<Props>()
const emits = defineEmits<Props>()
defineExpose({})


const {t} = useI18n()
const {
  emitter,
  data,
  columns,
  fetchList,
  fetchListLoading,
  newPortRedirection,
  deleteLoading,
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

const tableLoading = computed(() => {
  return fetchListLoading.value
})
const updateLoading = ref(false)
const createLoading = ref(false)

onMounted(() => {
  fetchList()
  getWsl2Ip()
})

// 编辑配置
let oldPortRedirection: PortRedirection | null = null
emitter.on('edit', (row) => {
  oldPortRedirection = {...row}
  showEditModal(row)
})

// 删除配置
emitter.on('delete', async (row) => {
  deleteLoading.value = true
  try {
    await deletePortRedirection(row)
  } finally {
    deleteLoading.value = false
  }
  await fetchList()
})

// 更新
async function updateHandler() {
  updateLoading.value = true
  try {
    await updatePortRedirection(editingModel.value as PortRedirection, oldPortRedirection as PortRedirection)
  } finally {
    updateLoading.value = false
  }
  await fetchList()
}

// 创建
async function createHandler() {
  createLoading.value = true
  try {
    await createPortRedirection(creatingModel.value as PortRedirection)
  } finally {
    createLoading.value = false
  }
  await fetchList()
}
</script>

<style scoped>
</style>
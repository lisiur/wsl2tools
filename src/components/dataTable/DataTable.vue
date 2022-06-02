<template lang="pug">
n-spin(:show="props.config.loading.value")
    n-data-table(
        v-bind="$attrs"
        :pagination="pagination"
        :paginate-single-page="false"
    )
        template(#empty)
            template(v-if="props.config.loaded.value")
                template(v-if="!hasEmptySlot")
                    slot(name="empty")
                template(v-else)
                    n-empty
            span(v-else)

</template>

<script lang="ts" setup>
import {computed, onMounted, type Ref, useSlots} from 'vue'

interface Props {
    config: {
        loading: Ref<boolean>,
        totalSize: Ref<number>,
        pageSize: Ref<number>,
        pageNum: Ref<number>,
        dataList: Ref<Array<any>>,
        loaded: Ref<boolean>,
        load: any,
        changePage: any,
        changePageSize: any,
    }
}
const props = defineProps<Props>()

const slots = useSlots()
const hasEmptySlot = computed(() => {
    return !!slots.empty
})
const pagination = computed(() => {
    return {
        page: props.config.pageNum.value,
        pageSize: props.config.pageSize.value,
        pageSizes: [10, 20, 50],
        onChange: (page: number) => {
            props.config.changePage(page)
        },
        onUpdatePageSize: (pageSize: number) => {
            props.config.changePageSize(pageSize)
        }
    }
})

onMounted(() => {
    props.config.load()
})

</script>
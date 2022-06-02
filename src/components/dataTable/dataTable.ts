import {type Ref, ref} from "vue";

interface DataTableService<T> {
    (params: {pageSize: number, pageNum: number}): Promise<{
        total: number,
        records: Array<T>
    } | Array<T>>
}

export function useDataTable<T>(service: DataTableService<T>) {
    const loading = ref(false)
    const totalSize = ref(0)
    const pageSize = ref(10)
    const pageNum = ref(1)
    const dataList = ref([]) as Ref<Array<T>>
    const loaded = ref(false)

    async function loadFirstPage() {
        pageNum.value = 1
        await load()
    }

    async function loadMore() {
        pageNum.value += 1
        await load()
    }

    async function changePage(value: number) {
        pageNum.value = value
        await load()
    }

    async function changePageSize(value: number) {
        pageSize.value = value
        pageNum.value = 1
        await load()
    }

    async function load() {
        loading.value = true
        try {
            const res = await service({pageSize: pageSize.value, pageNum: pageNum.value})
            if (Array.isArray(res)) {
                totalSize.value = res.length
                dataList.value = res
            } else {
                totalSize.value = res.total
                dataList.value = res.records
            }
            loaded.value = true
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        totalSize,
        pageSize,
        pageNum,
        dataList,
        loaded,
        load,
        reload: load,
        changePage,
        loadFirstPage,
        loadMore,
        config: {
            loading,
            totalSize,
            pageSize,
            pageNum,
            dataList,
            loaded,
            load,
            changePage,
            changePageSize,
        }
    }
}
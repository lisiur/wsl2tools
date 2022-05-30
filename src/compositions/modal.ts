import {ref, UnwrapRef} from "vue";

interface Config<T> {
}

export function useModal<T>(config?: Config<T>) {
    const model = ref<null | T>(null)
    const visible = ref(false)
    const show = (row?: UnwrapRef<T>) => {
        model.value = row ?? null
        visible.value = true
    }
    const close = () => {
        visible.value = false
        model.value = null
    }
    return {
        show,
        close,
        model,
        visible,
    }
}

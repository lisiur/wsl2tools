import {ref} from "vue";

export interface FormModalConfig<T> {
    title?: string,
    model: T,
    alwaysValidate?: boolean,
    positiveText: string,
    negativeText: string,
    positiveHandler?: (model: T) => Promise<any>,
    negativeHandler?: (model: T) => Promise<any>,
}

type FormModalPositiveReturnType<T extends FormModalConfig<any>> = T['positiveHandler'] extends (arg: T) => Promise<infer U> ? U : T;
type FormModalNegativeReturnType<T extends FormModalConfig<any>> = T['negativeHandler'] extends (arg: T) => Promise<infer U> ? U : T;

export function useFormModal() {
    const formRef = ref<any>(null)

    const visible = ref(false)
    const title = ref('')
    const model = ref<any>(null)
    const userPositiveHandler = ref<any>(null)
    const userNegativeHandler = ref<any>(null)
    const positiveText = ref('')
    const negativeText = ref('')
    const positiveLoading = ref(false)
    const negativeLoading = ref(false)
    const alwaysValidate = ref(false)
    const resolver = ref<any>(null)

    async function positiveHandler() {
        if (!await validate()) {
            return
        }
        if (userPositiveHandler.value) {
            positiveLoading.value = true
            try {
                resolve([true, await userPositiveHandler.value(model.value)])
                visible.value = false
            } catch (err) {
                console.error(err)
            } finally {
                positiveLoading.value = false
            }
        } else {
            visible.value = false
            resolve([true, model.value])
        }
    }

    async function negativeHandler() {
        if (alwaysValidate.value && !await validate()) {
            return
        }
        if (userNegativeHandler.value) {
            negativeLoading.value = true
            try {
                resolve([false, await userNegativeHandler.value(model.value)])
                visible.value = false
            } catch (err) {
                console.error(err)
            } finally {
                negativeLoading.value = false
            }
        }
        visible.value = false
        resolve([false, model.value])
    }

    function resolve(...args: any[]) {
        if (resolver.value) {
            resolver.value(...args)
        }
    }


    async function show<T = any>(config: FormModalConfig<T>): Promise<[true, FormModalPositiveReturnType<typeof config>] | [false, FormModalNegativeReturnType<typeof config>]> {
        title.value = config.title ?? ""
        model.value = config.model
        alwaysValidate.value = config.alwaysValidate ?? false
        positiveText.value = config.positiveText
        negativeText.value = config.negativeText
        userPositiveHandler.value = config.positiveHandler ?? null
        userNegativeHandler.value = config.negativeHandler ?? null
        return new Promise((r) => {
            visible.value = true
            resolver.value = r;
        })
    }

    function hide() {
        visible.value = false
    }

    async function validate(): Promise<boolean> {
        return formRef.value?.validate?.() ?? true
    }

    return {
        show,
        hide,
        config: {
            formRef,
            positiveHandler,
            negativeHandler,
            positiveLoading,
            negativeLoading,
            positiveText,
            negativeText,
            model,
            title,
            visible,
        }
    }
}
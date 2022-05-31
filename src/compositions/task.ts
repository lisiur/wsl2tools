import {ref} from "vue";

type Task = (...args: any) => Promise<any>;
type PureTask = () => Promise<any>;
type TaskResult<T extends Task> = T extends (...args: any) => Promise<infer U> ? U : never;

export function chainedTask<T extends PureTask[]>(...tasks: T) {
    return async () => {
        for await (const task of tasks) {
            await task()
        }
    }
}

export function useTask<T extends Task>(task: T, msg?: (m: string) => void) {
    type Params = Parameters<T>
    type Result = TaskResult<T>

    const running = ref(false)
    const success = ref(false)
    const failed = ref(false)
    const result = ref<Result | null>(null)
    const error = ref<Error | null>(null)

    function exec(...params: Params): Promise<Result> {
        running.value = true
        success.value = false
        failed.value = false
        return task.apply(null, params).then(r => {
            result.value = r
            success.value = true
            return r
        }).catch((e: Error) => {
            error.value = e
            failed.value = true
            if (msg) {
                msg(e.toString())
            }
            throw e
        }).finally(() => {
            running.value = false
        })
    }
    return {
        exec,
        running,
    }
}
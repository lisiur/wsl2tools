import {onMounted, onBeforeUnmount, ref, computed} from 'vue'

export enum Breakpoint {
    default = 0,
    xs = 320,
    sm = 640,
    md = 768,
    lg = 1024,
    xl = 1280,
    xxl = 1536,
}

const Breakpoints = [
    Breakpoint.xxl,
    Breakpoint.xl,
    Breakpoint.lg,
    Breakpoint.md,
    Breakpoint.sm,
    Breakpoint.xs,
    Breakpoint.default,
]

export function useBreakpoint(handler?: (bp: Breakpoint) => void) {
    const bp = ref<Breakpoint>(Breakpoint.default);
    const isMobile = computed(() => bp.value < Breakpoint.md)
    const isPc = computed(() => bp.value >= Breakpoint.md)

    const listener = () => {
        const windowWidth = document.body.clientWidth;
        for (let breakpoint of Breakpoints) {
            if (windowWidth >= breakpoint) {
                bp.value = breakpoint
                break;
            }
        }
        if (handler) {
            handler(bp.value)
        }
    }

    onMounted(() => {
        window.addEventListener('resize', listener)
        listener()
    })

    function removeListener() {
        window.removeEventListener('resize', listener)
    }

    onBeforeUnmount(() => {
        removeListener()
    })

    return {
        breakpoint: bp,
        isMobile,
        isPc,
        removeListener,
    }
}
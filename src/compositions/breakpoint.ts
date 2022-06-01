import {onMounted, onBeforeUnmount, ref, computed} from 'vue'

export enum Breakpoint {
    xs = 0,
    sm = 640,
    md = 1024,
    lg = 1280,
    xl = 1536,
    xxl = 1920,
}

export const breakpoints = {
    xs: Breakpoint.xs,
    sm: Breakpoint.sm,
    md: Breakpoint.md,
    lg: Breakpoint.lg,
    xl: Breakpoint.xl,
    xxl: Breakpoint.xxl,
}

const Breakpoints = [
    Breakpoint.xxl,
    Breakpoint.xl,
    Breakpoint.lg,
    Breakpoint.md,
    Breakpoint.sm,
    Breakpoint.xs,
]

export function useBreakpoint(handler?: (bp: Breakpoint) => void) {
    const bp = ref<Breakpoint>(Breakpoint.xs);
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
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"
import {NaiveUiResolver} from "unplugin-vue-components/resolvers"
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import Unocss from 'unocss/vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import * as path from "path";

const UnocssAlias = {
    bg: 'background-color',
    radius: 'border-radius',
    m: 'margin',
    mt: 'margin-top',
    ml: 'margin-left',
    mr: 'margin-right',
    mb: 'margin-bottom',
    p: 'padding',
    pt: 'padding-top',
    pl: 'padding-left',
    pr: 'padding-right',
    pb: 'padding-bottom',
}

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    },
    plugins: [
        vue(),
        // vueI18n({
        //     include: path.resolve(__dirname, './i18n/**')
        // }),
        Components({
            resolvers: [NaiveUiResolver()],
        }),
        Unocss({
            transformers: [transformerVariantGroup(), transformerDirectives()],
            theme: {
                colors: {
                    primary: "var(--primary-color)",
                    warning: "var(--warning-color)",
                    error: "var(--error-color)",
                    success: "var(--success-color)",
                    info: "var(--info-color)",
                },
                breakpoints: {
                    xs: "320px",
                    sm: "640px",
                    md: "768px",
                    lg: "1024px",
                    xl: "1280px",
                    xxl: "1536px",
                }
            },
            rules: [
                [
                    /^(.*)--(.*)$/,
                    ([, prop, value]) => {
                        prop = UnocssAlias[prop] ?? prop
                        return {[prop]: `var(--${value})`};
                    },
                ],
                [
                    /^(.*)-\[(.*)\]$/,
                    ([, prop, value]) => {
                        prop = UnocssAlias[prop] ?? prop
                        return {[prop]: value};
                    },
                ],
                [
                    /^translate-\[(.*)\]$/,
                    ([, value]) => {
                        return {transform: `translate(${value})`};
                    },
                ],
                [
                    /^text-(primary|warning|error|success|info)$/,
                    ([, c], {theme}) => {
                        if (theme.colors[c]) {
                            return {color: theme.colors[c]};
                        }
                    },
                ],
                [
                    /^bg-(primary|warning|error|success|info)$/,
                    ([, c], {theme}) => {
                        if (theme.colors[c]) {
                            return {"background-color": theme.colors[c]};
                        }
                    },
                ],
            ],
            shortcuts: [{
                "flex-center": "flex items-center justify-center",
                "flex-center-x": "justify-center",
                "flex-center-y": "flex items-center",
                "absolute-center": "absolute left-[50%] top-[50%] translate-[-50%,-50%]",
                "round": "radius-[50%]"
            }]
        })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        port: 13333
    }
})

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"
import {NaiveUiResolver} from "unplugin-vue-components/resolvers"
import Unocss from 'unocss/vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {createHtmlPlugin} from 'vite-plugin-html'
import * as path from "path";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import transformerDirectives from "@unocss/transformer-directives";

const UnocssAlias: Record<string, string> = {
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
    plugins: [
        vue(),
        createHtmlPlugin({
            inject: {
                data: {
                    injectScript: process.env.MODE === 'development' ? `<script src="http://localhost:8098"></script>` :
                        '',
                }
            }
        }),
        vueJsx({}),
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
                        // @ts-ignore
                        if (theme.colors[c]) {
                            // @ts-ignore
                            return {color: theme.colors[c]};
                        }
                    },
                ],
                [
                    /^bg-(primary|warning|error|success|info)$/,
                    ([, c], {theme}) => {
                        // @ts-ignore
                        if (theme.colors[c]) {
                            // @ts-ignore
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
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        port: 13333
    }
})

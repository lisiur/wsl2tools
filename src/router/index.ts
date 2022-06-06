import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layouts/Frame.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "Home",
                    component: () => import("@/pages/home/Index"),
                    meta: {
                        title: "Wsl2 Tools",
                        show_title: true,
                        draggable: true,
                        min_button: true,
                        max_button: true,
                        close_button: true,
                    }
                },
            ],
        },
        {
            path: "/setting",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "Setting",
                    component: () => import("@/pages/setting/Index.vue"),
                    meta: {
                        show_title: false,
                        draggable: false,
                        min_button: false,
                        max_button: false,
                        close_button: false,
                    }
                },
            ],
        },
    ],
});

export default router;

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
                },
            ],
        },
    ],
});

export default router;

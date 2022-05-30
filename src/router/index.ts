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
                    component: () => import("@/pages/home/Index.vue"),
                },
            ],
        },
    ],
});

export default router;

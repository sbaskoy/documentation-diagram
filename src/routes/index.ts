import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";


const routes = [
    {
        path: "/",
        name: "Home",
        components: {
            default: () => import("../views/markdowns/layout.vue")
        },
        children: [
            {
                path: "/",
                name: "Home",
                components: {
                    markdown: () => import("../views/markdowns/show_markdown.vue")
                },
                meta: {
                    title: "Home"
                }
            },
            {
                path: "/:path",
                name: "HomePath",
                components: {
                    markdown: () => import("../views/markdowns/show_markdown.vue")
                },
                meta: {
                    title: "Home"
                }
            },
        ]
    },

    {
        path: "/module",
        name: "Modules",
        components: {
            default: () => import("../views/modules/layout.vue"),
        },
        children: [
            {
                path: "",
                name: "ShowDiagram",
                components: {
                    modules: () => import("../views/modules/module_list.vue")
                },
                meta: {
                    title: "Diagram"
                }
            },
            {
                path: "edit",
                name: "EditModule",
                components: {
                    modules: () => import("../views/modules/module_list.vue")
                },
                meta: {
                    title: "Diagram"
                }
            }
        ]
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = (to.meta.title as string) ?? 'Home';
    return next();
})

export default router;
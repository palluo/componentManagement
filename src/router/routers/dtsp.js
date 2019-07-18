import Layout from "@/Layout";

export default {
    path: "/DTSP",
    name: "DTSP",
    meta:  {
        navTitle: "带图审批"
    },
    redirect: "DTSP/DTSP",
    component: Layout,
    children: [{
        path: "DTSP",
        name: "DTSP",
        meta: {
            navTitle: "带图审批"
        },
        component: () =>import("@/views/DTSP/DTSP"),
        children: [{
            path: "ProjectLocate",
            name: "ProjectLocate",
            meta: {
                navTitle: "项目定位"
            },
            component: () => import("@/views/DTSP/ProjectLocate")
        }]

    }]
} 
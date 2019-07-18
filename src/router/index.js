import Vue from "vue";
import Router from "vue-router";
import iView from "iview";
import routes from "./routers";

Vue.use(Router);

const router = new Router({
    mode: "hash",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
});

export default router;
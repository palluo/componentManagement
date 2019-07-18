import Vue from "vue";
import App from "./App.vue";
import './register';
import router from "./router";
import store from "./store";
import initConfig from "./initConfig";

Vue.config.productionTip = false;

(async() => {
    await initConfig();new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount("#app");
})()


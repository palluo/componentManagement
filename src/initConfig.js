import Vue from 'vue';
import { getStaticConfig } from "@/utils/httpUtil";
import store from "@/store"
import { SET_CONFIG, MAP_INIT_CONFIG } from "@/store/types";
import eyemap3d from "@/components/EyeMap3D/Map"

export default async () => {
    //系统配置文件
    let appConfig = await getStaticConfig('static/appConfig.json');
    store.commit(SET_CONFIG, Object.freeze(appConfig));
    // 系统地图初始化
    let mapinit = await getStaticConfig('static/mapinit.json');
    store.commit(MAP_INIT_CONFIG, mapinit);
    // 初始化eyemap3d
    Vue.use(eyemap3d, {
        load: {
            arcgisUrl: appConfig.ARCGISURL
        }
    });
}
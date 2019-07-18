import { MAP_INIT_CONFIG } from "../types";

export default {
    state: {
        baseLayerUrls: [],
        geometryServerUrl: '',
        extent: {}
    },
    mutations: {
        [MAP_INIT_CONFIG](state, data) {
            state.baseLayerUrls = data.basemaps;
            state.geometryServerUrl = data.geometryServerUrl;
            state.extent = data.extent;
        }
    },
    getters: {
        baseLayerUrls: state => state.baseLayerUrls,
        extent: state => state.extent,
        geometryServerUrl: state => state.geometryServerUrl
    }
}
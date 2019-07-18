import { DTSP_INIT_MAP, DTSP_DRAW_GRAPHIC, DTSP_CURRENT_CONFIG } from "../types";

export default {
    state: {
        dtspMap: null,
        drawGraphic: null,
        dtspConfig:null
    },
    mutations: {
        [DTSP_INIT_MAP](state, mapObj) {
            state.dtspMap = mapObj;
        },
        [DTSP_DRAW_GRAPHIC](state, graphic) {
            state.drawGraphic = graphic;
        },
        [DTSP_CURRENT_CONFIG](state, config) {
            state.dtspConfig = config;
        }
    },
    getters: {
        dtspMap: state => state.dtspMap,
        drawGraphic: state => state.drawGraphic,
        dtspConfig: state => state.dtspConfig
    }
}

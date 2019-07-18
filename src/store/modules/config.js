import { SET_CONFIG } from "../types"

const config = {
    state: {
        config: null
    },

    mutations: {
        [SET_CONFIG](state, config) {
            state.config = config;
        }
    },

    getters: {
        config: state => state.config
    }
};

export default config
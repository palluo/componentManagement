export default {
    created() { },
    data() {
        return {
            showLayers: []
        }
    },
    beforeMount() { },
    mounted() { },
    methods: {
        addLayers(layers) {
            layers.forEach(layer => {
                let arrScenelayer = [];
                if (layer.type == "scenelayer") {
                    arrScenelayer.push(layer);
                }
                this._addlayerToMap(this.map, arrScenelayer);
            });
        },
        _addlayerToMap: function (map, arrScenelayer) {
            arrScenelayer.forEach(objLayer => {
                let layer = this._createLayer(objLayer);
                if (layer) {
                    map.add(layer);
                }
            });
        },
        _createLayer(objLayer) {
            let currlayer;
            if (objLayer.onlineId) {
                currlayer = objLayer.onlineId;
            } else {
                let type = objLayer.type;
                switch (type) {
                    case 'scenelayer': {
                        currlayer = new this.declaredClass.SceneLayer(objLayer.url);
                        break;
                    }
                    case 'tileLayer': {
                        currlayer = new this.declaredClass.TileLayer(objLayer.url);
                        break;
                    }
                    case 'graphicsLayer': {
                        currlayer = new this.declaredClass.GraphicsLayer();
                        break;
                    }
                    case 'imageryLayer': {
                        currlayer = new this.declaredClass.ImageryLayer(objLayer.url);
                        break;
                    }
                }
            }
            return currlayer;
        },
        /**
     * 将graphicLayer图层顺序提到顶层
     * @param {*} graphicLayer
     */
        reorderLayer(graphicLayer) {
            if (graphicLayer) {
                this.map.reorder(graphicLayer, 99);
            }
        },

    }
}
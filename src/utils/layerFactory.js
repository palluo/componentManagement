import loadModules from "@/utils/loadModules";

export default {
    async createLayer(objLayer) {
        let currlayer;
        const { SceneLayer, TileLayer, GraphicsLayer, ImageryLayer} = await loadModules(
            "esri/layers/SceneLayer",
            "esri/layers/TileLayer",
            "esri/layers/GraphicsLayer",
            "esri/layers/ImageryLayer"
          );
        if (objLayer.onlineId) {
            currlayer = objLayer.onlineId;
        } else{
            let type = objLayer.type;
            switch (type) {
                case 'scenelayer': {
                    currlayer = new SceneLayer(objLayer.url);
                    break;
                }
                case 'tileLayer': {
                    currlayer = new TileLayer(objLayer.url);
                    break;
                }
                case 'graphicsLayer': {
                    currlayer = new GraphicsLayer();
                    break;
                }
                case 'imageryLayer': {
                    currlayer = new ImageryLayer(objLayer.url);
                    break;
                }
            }
        }
        return currlayer;
    }
}
/* eslint-disable prettier/prettier */
import SceneLayer from 'esri/layers/SceneLayer'
import TileLayer from "esri/layers/TileLayer"
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import ImageryLayer from 'esri/layers/ImageryLayer'

export default {
    createLayer(objLayer) {
        if (objLayer.onlineId) {
            return objLayer.onlineId;
        } else{
            let currlayer, type = objLayer.type;
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
            return currlayer;
        }
    }
}
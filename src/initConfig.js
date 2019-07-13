import { getStaticConfig } from "./utils/httpUtil";
import layerFactory from "./utils/layerFactory";
import Map from "esri/Map";
import Ground from "esri/Ground";
import Basemap from "esri/Basemap";
import Extent from 'esri/geometry/Extent'
import SceneView from "esri/views/SceneView";

export default async () => {
    (async () => {
        let data = await getStaticConfig('privilege.json');
        if (data.map) {
            let baseLayers = data.map.basemaps;
            let baseMap = _addBaselayer(baseLayers);
            let map = _createMap(baseMap);
            _create3dView(map);
            let operationallayers = data.map.operationallayers;
            operationallayers.forEach(operationallayer => {
                let arrScenelayer = [];
                if (operationallayer.type == "scenelayer") {
                    arrScenelayer.push(operationallayer);
                }
                //_addlayerToMap(map, arrScenelayer);
            });
        }
    })();
}

var _create3dView = function (map) {
    var view = new SceneView({
        container: "map", // Reference to the DOM node that will contain the view
        map: map // References the map object created in step 3
    });
    window.distMap3DView = view;
    view.ui.remove("attribution"); //移除底部ESRI logo
    //   view.goTo({
    //       target: new Extent(45096, 25651, 45245, 26836, view.SpatialReference),
    //       heading: 30,
    //       tilt: 70
    //     })
    return view;
}
var _createMap = function (baseMap) {
    var map = new Map({
        basemap: baseMap,
        Ground: new Ground({
            layers: []
        })
    });
    window.distMap3D = map;
    return map;
}
var _addlayerToMap = function (map, arrScenelayer) {
    arrScenelayer.forEach(objLayer => {
        let layer = layerFactory.createLayer(objLayer);
        if (layer) {
            map.add(layer);
        }
    });
}
/**
 * 加载底图，支持wellId, portalId 和 底图url
 * @param {*} arrObjLayer 
 */
var _addBaselayer = function (arrObjLayer) {
    var baseLayers = [], portalItem = {}, wellId = null, baseMap;
    arrObjLayer.forEach(objLayer => {
        if (objLayer.wellId && objLayer.wellId.length > 0) {
            wellId = objLayer.wellId;
        }
        if (objLayer.portalId && objLayer.portalId.length > 0) {
            portalItem.id = objLayer.wellId;
        }
        if (objLayer.url && objLayer.url.length > 0) {
            let layer = layerFactory.createLayer(objLayer);
            if (layer) {
                baseLayers.push(layer);
            }
        }
    });
    if (wellId) {
        baseMap = Basemap.fromId(wellId);
    } else if (portalItem.id) {
        baseMap = new Basemap({
            portalItem: portalItem
        });
    } else {
        baseMap = Basemap({
            baseLayers: baseLayers
        });
    }
    return baseMap;
};

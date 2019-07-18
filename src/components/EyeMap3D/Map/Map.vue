<template>
  <div class="map-container">
    <div class="eyemap3d-map" ref="map3dNode"></div>
  </div>
</template>
<script>
import Vue from "vue";
import loadModules from "@/utils/loadModules";
import layerUtils from "./layers/layerUtils";
import locateUtils from "./locate/locateUtils";
import drawTool from "./draw/drawTool";
import draw from "./draw/draw";
export default {
  name: "eyemap3d-map",
  mixins: [layerUtils, locateUtils, drawTool, draw],
  components: {},
  props: {
    //地图
    baseLayerUrls: {
      type: Array,
      default: () => []
    },
    //几何服务
    geometryServerUrl: {
      type: String,
      default: () => ""
    },
    //专题
    operationallayers: {
      type: Array,
      default: () => []
    },
    //场景位置
    extent: {
      type: Object,
      default: () => {
        return {};
      }
    },
    //事件管理
    eventBus: {
      type: Object,
      default: () => new Vue()
    }
  },
  data() {
    return {
      map: null,
      mapView: null,
      mapNode: null,
       heading:this.extent.heading,
        tilt:this.extent.tilt,
      declaredClass: {}
    };
  },
  mounted() {
    this.mapNode = this.$refs.map3dNode;
    this.$eyeMapApiPromiseLazy()
      .then(() => {
        this._initDeclaredClass().then(() => {
          this._initMap();
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    async _initDeclaredClass() {
      const {
        Map,
        Ground,
        Basemap,
        SceneView,
        Camera,
        SceneLayer,
        TileLayer,
        GraphicsLayer,
        ImageryLayer,
        Extent,
        lang
      } = await loadModules(
        "esri/Map",
        "esri/Ground",
        "esri/Basemap",
        "esri/views/SceneView",
        "esri/Camera",
        "esri/layers/SceneLayer",
        "esri/layers/TileLayer",
        "esri/layers/GraphicsLayer",
        "esri/layers/ImageryLayer",
        "esri/layers/ImageryLayer",
        "esri/geometry/Extent",
        "dojo/_base/lang"
      );
      this.declaredClass = {
        Map: Map,
        Ground: Ground,
        Basemap: Basemap,
        SceneView: SceneView,
        Camera: Camera,
        SceneLayer: SceneLayer,
        TileLayer: TileLayer,
        GraphicsLayer: GraphicsLayer,
        ImageryLayer: ImageryLayer,
        Extent:Extent,
        lang: lang
      };
    },
    _initMap() {
      let baseMap = this._addBaselayer(this.baseLayerUrls);
      this._createMap(baseMap);
      this._create3dView(this.map);
      if (this.extent) {
        this.setShowExtent(
          this.extent.extent,
          this.extent.heading,
          this.extent.tilt
        );
      }
    },
    /**
     * 设置显示的Camera
     */
    _getShowCamera: function(view, extent) {
      let camera = new this.declaredClass.Camera({
        heading: extent.heading,
        tilt: extent.tilt,
        position: {
          latitude: extent.x,
          longitude: extent.y,
          z: extent.z
        }
      });
      return camera;
    },
    /**
     * 设置显示的extent
     */
    setShowExtent: function(obj, heading, tilt) {
      let extent = new this.declaredClass.Extent(obj.xmin, obj.ymin, obj.xmax, obj.ymax);
      this.mapView.goTo({
        target: extent,
        heading: heading,
        tilt: tilt
      });
    },
    _create3dView: function(map) {
      let camera;
      if (this.extent) {
        camera = this._getShowCamera(this.mapView, this.extent);
      }
      var view = new this.declaredClass.SceneView({
        container: this.mapNode,
        map: map
      });
      window.distMap3DView = view;
      view.ui.remove("attribution"); //移除底部ESRI logo
      this.mapView = view;
      this.mapView.when(
        this.declaredClass.lang.hitch(this, function() {
          this.$emit("map-ready", {
            map,
            view,
            mapDiv: this
          });
        })
      );
    },
    _createMap: function(baseMap) {
      var map = new this.declaredClass.Map({
        basemap: baseMap,
        Ground: new this.declaredClass.Ground({
          layers: []
        })
      });
      this.map = map;
    },
    _addlayerToMap: function(map, arrScenelayer) {
      arrScenelayer.forEach(objLayer => {
        let layer = this._createLayer(objLayer);
        if (layer) {
          map.add(layer);
        }
      });
    },
    /**
     *  加载底图，支持wellId, portalId 和 底图url
     */
    _addBaselayer: function(arrObjLayer) {
      var baseLayerUrls = [],
        portalItem = {},
        wellId = null,
        baseMap;
      arrObjLayer.forEach(objLayer => {
        if (objLayer.wellId && objLayer.wellId.length > 0) {
          wellId = objLayer.wellId;
        }
        if (objLayer.portalId && objLayer.portalId.length > 0) {
          portalItem.id = objLayer.portalId;
        }
        if (objLayer.url && objLayer.url.length > 0) {
          let layer = this._createLayer(objLayer);
          baseLayerUrls.push(layer);
        }
      });
      if (wellId) {
        baseMap = this.declaredClass.Basemap.fromId(wellId);
      } else if (portalItem.id) {
        baseMap = new this.declaredClass.Basemap({
          portalItem: portalItem
        });
      } else {
        baseMap = new this.declaredClass.Basemap({
          baseLayers: baseLayerUrls
        });
      }
      return baseMap;
    }
  }
};
</script>
<style lang="scss">
.map-container {
  position: absolute;
  height: 100%;
  width: 100%;
  .eyemap3d-map {
    width: 100%;
    height: 100%;
  }
}
</style>



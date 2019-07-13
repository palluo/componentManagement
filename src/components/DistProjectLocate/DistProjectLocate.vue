<template>
  <div class="project-locate">
    <div class="project-locate-business-type">
      <span>业务类型：</span>
      <span>{{locatpara.businesstype}}</span>
    </div>
    <div class="project-locate-business-businesscode">
      <span>业务编号：</span>
      <span>{{locatpara.businesscode}}</span>
    </div>
  </div>
</template>
<script>
import { getStaticConfig } from "../../utils/httpUtil";
import { queryTaskExecute } from "../../utils/layerQueryUtil";
import layerFactory from "../../utils/layerFactory";
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import Graphic from 'esri/Graphic';

export default {
  name: "DistProjectLocate",
  props: {
    locatpara: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      currLocatpara: this.locatpara
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      (async () => {
        let data = await getStaticConfig("projectLocateConfig.json");
        let locatset, displaylayers;
        data.locatset.forEach(item => {
            if (this.locatpara.businesscode == item.xmlx) {
                locatset = item
            }
        });
        this._getGeoByParam();
        console.log(data);
      })();
    },
    _getGeoByParam() {
      let url =
        "http://172.30.240.69:6080/arcgis/rest/services/GTGHYWGL/MapServer/37";
      let param = {
        where: "LABH = '2018000000003678'"
      };
      let projectLoacteGraphicsLayer = GraphicsLayer("graphicsLayer");
      window.distMap3D.add(projectLoacteGraphicsLayer);
       let fillSymbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [227, 139, 79, 0.8],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
        };
      queryTaskExecute(url, param)
        .then(result => {
          result.features.forEach(item => {
            var polygonGraphic = new Graphic({
              geometry: item.geometry,
              symbol: fillSymbol
            });
            projectLoacteGraphicsLayer.add(polygonGraphic);
            window.distMap3DView.goTo(polygonGraphic);
          });
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.project-locate {
  width: 20rem;
  height: 10rem;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>




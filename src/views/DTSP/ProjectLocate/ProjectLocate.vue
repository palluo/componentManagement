<template>
  <div class="project-locate">
    <div class="project-locate-business-type">
      <span>业务类型：</span>
      <span>{{locatpara?locatpara.businesstype:''}}</span>
    </div>
    <div class="project-locate-business-businesscode">
      <span>业务编号：</span>
      <span>{{locatpara?locatpara.businesscode:''}}</span>
    </div>
  </div>
</template>
<script>
import loadModules from "@/utils/loadModules";
import EventBus from "@/utils/EventBus";
import {POST_MESSAGE_READ_LINE} from "@/utils/EventBusType";

export default {
  name: "ProjectLocate",
  props: {
    locatpara: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      mapRef: null
    };
  },
  mounted() {
    this._addPostMessageEventListener();
  },
  methods: {
    _addPostMessageEventListener() {
      EventBus.$on(POST_MESSAGE_READ_LINE, this._RedLine)
    },
    async _RedLine (data) {
        const {Polygon, SimpleFillSymbol} = await loadModules ("esri/geometry/Polygon", "esri/symbols/SimpleFillSymbol");
        if (!this.mapRef) {
           this.mapRef=this.$store.getters.dtspMap.mapRef
        }
        data = JSON.parse(data);
        let  fillSymbol = [], arrPolygon = [];
        data.forEach((item, index) => {
            if (item.geometry.type === "polygon") {
                 let geo = new Polygon(data[index].geometry);
                 arrPolygon.push(geo);
                 fillSymbol = new SimpleFillSymbol (data[index].symbol);
            }
        });
         this.mapRef.locateByGeometries(
          arrPolygon,
          true,
          true,
         fillSymbol
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.project-locate {
  display: none;
  width: 20rem;
  height: 10rem;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>




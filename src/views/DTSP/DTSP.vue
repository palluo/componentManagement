<template>
<div id="dtsp">
 <div id="toolShow">
      <ProjectLocate/>
       <ProjectLifeCycle/>
  </div>
  <div id="map" class="map">
      <eyemap-map-3d
      v-if="baseLayerUrls.length > 0"
      ref="eyeMap3d"
      :baseLayerUrls = "baseLayerUrls"
      :extent = "extent"
      @map-ready="_mapReady"
      />
  </div>
</div>
 
</template>

<script>
 import { getPrivilege } from "@/api/dtsp";
 import ProjectLocate from "./ProjectLocate"
  import ProjectLifeCycle from "./ProjectLifeCycle"
 import { setMessageIFrame, setIFrameInit } from "@/utils/postMessageUtil";
 import {
     DTSP_INIT_MAP,
     DTSP_DRAW_GRAPHIC,
     DTSP_CURRENT_CONFIG
 } from "@/store/types";
export default {
  name: "home",
  components: {ProjectLocate, ProjectLifeCycle},
  props: {
  },
  data() {
      return {
          baseLayerUrls: [],
          operationallayers:[],
          extent: {}
      }
  },
  created() {
      this._getPrivilegeData();
  },
  beforeMount() {
      this.baseLayerUrls = this.$store.getters.baseLayerUrls;
      this.extent = this.$store.getters.extent;
  },
  mounted() {
  },
  methods: {
      async _getPrivilegeData() {
          let data = await getPrivilege();
          this.operationallayers = data.map.operationallayers;
          this.$store.commit(DTSP_CURRENT_CONFIG, data);
      },
      _mapReady(param) {
          const obj = {
              map: param.map,
              mapView: param.mapView,
              mapDiv: param.mapDiv,
              mapRef: this.$refs.eyeMap3d
          }
          this.$refs.eyeMap3d.addLayers(this.operationallayers);
          this.$store.commit("DTSP_INIT_MAP", obj);
          setMessageIFrame(top, true);
         setIFrameInit();
      }
  }
};
</script>
<style lang="scss">
#dtsp {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  position:absolute;
  .map{
      height: 100%;
      width: 100%;
      z-index: 0;
      position:absolute;
  }
  #toolShow {
      width: 100%;
      z-index: 100;
      position:absolute;
  }
}
</style>

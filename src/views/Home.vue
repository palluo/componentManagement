<template>
<div id="home">
 <div id="toolShow">
  </div>
  <div id="map" class="map"></div>
</div>
 
</template>

<script>
import initConfig from '../initConfig'
export default {
  name: "home",
  props: {
  },
  components: {},
  mounted() {
      (async() => {
          await initConfig();
      })();
  },
  methods: {
  }
};
</script>
<style lang="scss">
#home {
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

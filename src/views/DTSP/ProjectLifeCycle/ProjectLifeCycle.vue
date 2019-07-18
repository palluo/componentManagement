<template>
</template>
<script>
import loadModules from "@/utils/loadModules";
import EventBus from "@/utils/EventBus";
import {POST_MESSAGE_PROJECT_LIFE_DRAW} from "@/utils/EventBusType";
export default {
    name:"ProjectLifeCycle",
    data() {
        return {
            mapRef:null
        }
    },
    mounted() {
        this._addPostMessageEventListener();
    },
    methods:{
 _addPostMessageEventListener() {
      EventBus.$on(POST_MESSAGE_PROJECT_LIFE_DRAW, this._projectLifeDraw)
    },
    _projectLifeDraw(data) {
        if (!this.mapRef) {
           this.mapRef=this.$store.getters.dtspMap.mapRef
        }
        console.log(data);
    }
    }
}
</script>


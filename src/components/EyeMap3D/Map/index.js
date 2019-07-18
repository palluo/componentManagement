import { loadCss, loadScript } from "esri-loader";

import Map from "./Map";
import lazyValue from "@/utils/lazyValue";

const DEFAULTURL = "https://js.arcgis.com/4.11/";
// let isApiSetUp = false;
export const install = (Vue, opts = {}) => {
  if (install.installed) return;

  install.installed = true;
  let eyeMapApiPromiseLazy = makeEyeMapApiPromiseLazy(opts);

  Vue.mixin({
    created() {
      this.$eyeMapApiPromiseLazy = eyeMapApiPromiseLazy;
    }
  });
  Vue.$eyeMapApiPromiseLazy = eyeMapApiPromiseLazy;

  Vue.component("eyemap-map-3d", Map);
};

// auto install script方式引入加载方式
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

// load EyeMapApi(type:arcgis-js)
const loadEyeMapApi = async url => {
  // await loadEchartsArcGISApi();
  const jsUrl = url + "/init.js";
  const cssUrl = url + "/esri/css/main.css";
  return new Promise((resolve, reject) => {
    try {
      loadCss(cssUrl);
      loadScript({
        url: jsUrl
      }).then(resolve);
    } catch (error) {
      reject(error);
    }
  });
};

const makeEyeMapApiPromiseLazy = options => {
  const { load } = options;
  const onApiLoaded = () => {
    console.log("api has loaded");
  };

  if (load) {
    const { arcgisUrl = DEFAULTURL } = load;
    return lazyValue(() => {
      return new Promise((resolve, reject) => {
        try {
          loadEyeMapApi(arcgisUrl).then(resolve);
        } catch (error) {
          reject(error);
        }
      }).then(onApiLoaded);
    });
  }
};
const plugin = {
  install
};
export default plugin;

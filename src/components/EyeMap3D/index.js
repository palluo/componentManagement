import { loadCss, loadScript } from "esri-loader";

import Map from "./Map";
import lazyValue from "@/utils/lazyValue";

const DEFAULTURL = "https://js.arcgis.com/4.3/";
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

  Vue.component("eyemap-map", Map);
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
// const loadEchartsArcGISApi = () => {
//   const promise = new Promise((resolve, reject) => {
//     if (isApiSetUp) {
//       resolve();
//     } else {
//       const echartsScript = document.createElement("script");
//       let url = "./static/echartsArcGIS.js";
//       echartsScript.setAttribute("src", url);
//       document.head.appendChild(echartsScript);
//       _handleScriptLoad(
//         echartsScript,
//         script => {
//           resolve(script);
//         },
//         reject
//       );
//     }
//   });
//   return promise;
// };
// const _handleScriptLoad = (script, callback, errback) => {
//   let onScriptError;
//   if (errback) {
//     onScriptError = _handleScriptError(script, errback);
//   }
//   const onScriptLoad = () => {
//     callback(script);
//     script.removeEventListener("load", onScriptLoad, false);
//     if (onScriptError) {
//       script.removeEventListener("error", onScriptError, false);
//     }
//   };
//   script.addEventListener("load", onScriptLoad, false);
// };

// const _handleScriptError = (script, callback) => {
//   const onScriptError = e => {
//     callback(
//       e.error ||
//         new Error("There was an error attempting to load " + script.src)
//     );
//     script.removeEventListener("error", onScriptError, false);
//   };
//   script.addEventListener("error", onScriptError, false);
//   return onScriptError;
// };

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

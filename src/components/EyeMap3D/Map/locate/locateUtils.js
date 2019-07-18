import loadModules from "@/utils/loadModules";

export default {
  created() {
    this.fillSymbol = {
      type: "simple-fill",
      color: [255, 0, 0, 0],
      style: "solid",
      outline: {
        color: [0, 255, 255, 1],
        width: 1
      }
    };
    this.regionFillSymbol = {
      type: "simple-fill",
      color: [255, 0, 0, 0],
      style: "solid",
      outline: {
        color: [0, 255, 255, 1],
        width: 3
      }
    };
  },
  data() {
    return {
      fillSymbol: null,
      _locateGraphicLayer: null,
      isRenderRegion: false
    };
  },
  methods: {
    /**
     * 根据区域名称定位
     * @param {*} info
     * @param {*} flag
     */
    async locateByRegionName(info, flag, region = null) {
      const { lang } = await loadModules("dojo/_base/lang");
      if (region) {
        this.isRenderRegion = true;
      }

      let url = info.regionUrl;
      let sql = info.nameField + " = '" + info.regionName + "'";
      let outFields = [info.nameField];
      let queryPromise = this.query(url, sql, outFields);
      queryPromise.then(
        lang.hitch(this, function(results) {
          if (this._locateGraphicLayer) this._locateGraphicLayer.removeAll();
          if (results.features && results.features.length > 0) {
            this.locateByFeatures(results.features, true, flag);
            /* if (flag) {
              setTimeout(
                lang.hitch(this, function() {
                  this._locateGraphicLayer.removeAll();
                }),
                2000
              );
            } */
          } else {
            console.log("查询无结果");
          }
        })
      );
    },

    /**
     * 根据区域code定位
     * @param {*} info
     * @param {*} flag
     */
    async locateByRegionCode(info, flag) {
      const { lang } = await loadModules("dojo/_base/lang");
      let url = info.regionUrl;
      let sql = info.codeField + " = '" + info.regionCode + "'";
      let outFields = [info.codeField];
      let queryPromise = this.query(url, sql, outFields);
      queryPromise.then(
        lang.hitch(this, function(results) {
          if (this._locateGraphicLayer) this._locateGraphicLayer.removeAll();
          if (results.features && results.features.length > 0) {
            this.locateByFeatures(results.features, true, flag);
          } else {
            console.log("查询无结果");
          }
        })
      );
    },

    /**
     * 根据x、y、zoom/scale定位
     * @param {*} x
     * @param {*} y
     * @param {*} zoom
     * @param {*} scale
     */
    async locateByCoordinate(x, y, zoom, scale, isRender = false) {
      const { GraphicsLayer, Graphic, Point } = await loadModules(
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/geometry/Point"
      );
      let mapP = new Point(x, y, this.mapView.spatialReference);
      if (isRender) {
        this._locateGraphicLayer = this.map.findLayerById("locateGraphicLayer");
        if (this._locateGraphicLayer) {
          this._locateGraphicLayer.removeAll();
        } else {
          this._locateGraphicLayer = new GraphicsLayer({
            id: "locateGraphicLayer"
          });
          this.map.add(this._locateGraphicLayer);
        }
        this.reorderLayer(this._locateGraphicLayer);

        let symbol = this.getBubblePictureSymbol("rgba(255,0,0,1)", 20);
        symbol.yoffset = 8;
        let graphic = new Graphic({
          geometry: mapP,
          symbol: symbol
        });
        this._locateGraphicLayer.add(graphic);
      }
      if (zoom !== null) {
        return this.mapView.goTo(
          {
            target: mapP,
            zoom: zoom
          },
          {
            duration: 500
          }
        );
      } else {
        if (scale !== null) {
          return this.mapView.goTo(
            {
              target: mapP,
              scale: scale
            },
            {
              duration: 500
            }
          );
        } else {
          return this.mapView.goTo(
            {
              target: mapP
            },
            {
              duration: 500
            }
          );
        }
      }
    },

    /**
     * 根据graphic or [graphic]定位
     * @param {*} features
     */
    async locateByFeatures(features, isLocate, isRender, isExtend = false) {
      const { GraphicsLayer, Graphic, Extent } = await loadModules(
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/geometry/Extent"
      );
      this._locateGraphicLayer = this.map.findLayerById("locateGraphicLayer");
      if (this._locateGraphicLayer) {
        //
      } else {
        this._locateGraphicLayer = new GraphicsLayer({
          id: "locateGraphicLayer"
        });
        this.map.add(this._locateGraphicLayer);
      }
      this.reorderLayer(this._locateGraphicLayer);
      if (isLocate) {
        let tempExtent;
        if (features[0].geometry.type === "point") {
          // 点
          let xmin = features[0].geometry.x;
          let xmax = features[0].geometry.x;
          let ymin = features[0].geometry.y;
          let ymax = features[0].geometry.y;
          for (let i = 0; i < features.length; i++) {
            if (xmin >= features[i].geometry.x) xmin = features[i].geometry.x;
            if (xmax <= features[i].geometry.x) xmax = features[i].geometry.x;
            if (ymin >= features[i].geometry.y) ymin = features[i].geometry.y;
            if (ymax <= features[i].geometry.y) ymax = features[i].geometry.y;
          }
          tempExtent = new Extent({
            xmin: xmin,
            ymin: ymin,
            xmax: xmax,
            ymax: ymax,
            spatialReference: {
              wkid: this.extent.wkid
            }
          });
        } else {
          // 面
          for (let i = 0; i < features.length; i++) {
            features[
              i
            ].geometry.spatialReference = this.mapView.spatialReference;
            if (i === 0) {
              tempExtent = features[i].geometry.extent;
            } else {
              tempExtent = tempExtent.union(features[i].geometry.extent);
            }
          }
        }
        if (tempExtent) {
          if (isExtend) tempExtent = tempExtent.expand(1.8);
          this.mapView.goTo([tempExtent], {
            duration: 500
          });
        } else {
          console.log("geometry's extent is null");
        }
      }
      if (isRender) {
        if (this._locateGraphicLayer) this._locateGraphicLayer.removeAll();
        for (let i = 0; i < features.length; i++) {
          let gra = new Graphic();
          gra.geometry = features[i].geometry;
          gra.attributes = features[i].attributes;
          if (this.isRenderRegion) {
            gra.symbol = this.regionFillSymbol;
            this.isRenderRegion = false;
          } else {
            gra.symbol = this.fillSymbol;
          }
          this._locateGraphicLayer.add(gra);
        }
      }
    },

    /**
     * 根据geometry or [geometry]定位
     * @param {*} geometries
     * @param {*} isLocate 是否渲染
     * @param {*} isRender 是否定位
     * @param {*} symbol 渲染symbol
     * @param {*} isClearLayer 是否清除graphicslayer
     */
    async locateByGeometries(
      geometries,
      isLocate = true,
      isRender,
      symbol = null,
      isClearLayer = true
    ) {
      return new Promise(async (resolve, reject) => {
        const { GraphicsLayer, Graphic, Extent } = await loadModules(
          "esri/layers/GraphicsLayer",
          "esri/Graphic",
          "esri/geometry/Extent"
        );
        this._locateGraphicLayer = this.map.findLayerById("locateGraphicLayer");
        if (this._locateGraphicLayer) {
          //
        } else {
          this._locateGraphicLayer = new GraphicsLayer({
            id: "locateGraphicLayer"
          });
          this.map.add(this._locateGraphicLayer);
        }
        this.reorderLayer(this._locateGraphicLayer);
        let tempExtent;
        if (geometries[0].type === "point") {
          // 点
          let xmin = geometries[0].x;
          let xmax = geometries[0].x;
          let ymin = geometries[0].y;
          let ymax = geometries[0].y;
          for (let i = 0; i < geometries.length; i++) {
            if (xmin >= geometries[i].x) xmin = geometries[i].x;
            if (xmax <= geometries[i].x) xmax = geometries[i].x;
            if (ymin >= geometries[i].y) ymin = geometries[i].y;
            if (ymax <= geometries[i].y) ymax = geometries[i].y;
          }
          tempExtent = new Extent({
            xmin: xmin,
            ymin: ymin,
            xmax: xmax,
            ymax: ymax,
            spatialReference: {
              wkid: this.extent.wkid
            }
          });
        } else if (geometries[0].type === "extent") {
          // 面
          for (let i = 0; i < geometries.length; i++) {
            geometries[i].spatialReference = this.mapView.spatialReference;
            if (i === 0) {
              tempExtent = geometries[i].extent;
            } else {
              tempExtent = tempExtent.union(geometries[i].extent);
            }
          }
        } else {
          // 面
          for (let i = 0; i < geometries.length; i++) {
            geometries[i].spatialReference = this.mapView.spatialReference;
            if (i === 0) {
              tempExtent = geometries[i].extent;
            } else {
              tempExtent = tempExtent.union(geometries[i].extent);
            }
          }
        }

        if (tempExtent) {
          if (isLocate) {
            tempExtent = tempExtent.expand(2);
            this.mapView
              .goTo({
                  target:tempExtent,
                  heading: this.heading,
                  tilt: this.tilt
              }, {
                duration: 500
              })
              .then(() => {
                resolve(true);
              });
          }
        } else {
          reject(true);
          console.log("geometry's extent is null");
        }

        if (isRender) {
          if (isClearLayer) {
            if (this._locateGraphicLayer) {
              this._locateGraphicLayer.removeAll();
            }
          }

          for (let i = 0; i < geometries.length; i++) {
            let gra = new Graphic();
            gra.geometry = geometries[i];
            if (symbol) {
              gra.symbol = symbol;
            } else {
              gra.symbol = this.fillSymbol;
            }
            this._locateGraphicLayer.add(gra);
          }
        }
      });
    }
  }
};

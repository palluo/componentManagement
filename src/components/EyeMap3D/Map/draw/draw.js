import loadModules from "@/utils/loadModules";

export default {
  created() {},
  data() {
    return {
      mapDraw: null,
      _drawGraphicLayer: null,
      pointerUpHandler: null,
      pointerDownHandler: null,
      drawSize: 9, // "9px",
      drawWidth: 1,
      drawColor: "rgba(255,0,0,1)",
      fillColor: "rgba(255,0,0,0.5)",
      textValue: "",
      redoGraphics: [],

      lastFreeLine: null
    };
  },
  async mounted() {},
  watch: {
    drawColor(val) {
      let str = val.substring(val.lastIndexOf(","), val.lastIndexOf(")"));
      this.fillColor = val.replace(str, ",0.3");
    }
  },
  methods: {
    async initDraw() {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      return this.mapDraw;
    },

    async openDrawMap(drawType, isContinueDraw) {
      /* if (this.mapView.graphics) {
        this.mapView.graphics.removeAll();
      } */
      const { GraphicsLayer } = await loadModules("esri/layers/GraphicsLayer");
      this._drawGraphicLayer = this.map.findLayerById("drawGraphicLayer");
      if (this._drawGraphicLayer) {
        //
      } else {
        this._drawGraphicLayer = new GraphicsLayer({ id: "drawGraphicLayer" });
        this.map.add(this._drawGraphicLayer);
      }
      if (drawType === "point") {
        this.enableCreatePoint(drawType, isContinueDraw);
      } else if (drawType === "multipoint") {
        // todo
      } else if (drawType === "polyline") {
        this.enableCreatePolyline(drawType, isContinueDraw);
      } else if (drawType === "freeline") {
        this.enableCreateFreeline(drawType, isContinueDraw);
      } else if (drawType === "polygon") {
        this.enableCreatePolygon(drawType, isContinueDraw);
      } else if (drawType === "rectangle") {
        this.enableCreateRectangle(drawType, isContinueDraw);
      } else if (drawType === "circle") {
        this.enableCreateCircle(drawType, isContinueDraw);
      } else if (drawType === "ellipse") {
        // todo
      } else if (drawType === "locate") {
        this.enableCreateLocate(drawType, isContinueDraw);
      } else if (drawType === "text") {
        this.enableCreateText(drawType, isContinueDraw);
      } else {
        console.log("error draw type");
      }
    },

    async enableCreatePoint(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType);
      action.on("cursor-update", evt => {
        this.createPointGraphic(evt.coordinates, false, isContinueDraw);
      });
      action.on("draw-complete", evt => {
        this.createPointGraphic(evt.coordinates, true, isContinueDraw);
      });
    },

    async enableCreatePolyline(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType, {
        mode: "click"
      });
      action.on(
        ["vertex-add", "vertex-remove", "cursor-update", "redo", "undo"],
        evt => {
          this.createPolylineGraphic(evt.vertices, false, isContinueDraw);
        }
      );
      action.on("draw-complete", evt => {
        this.createPolylineGraphic(evt.vertices, true, isContinueDraw);
      });
    },

    async enableCreateFreeline(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create("polyline", {
        mode: "freehand"
      });
      action.on(
        ["vertex-add", "vertex-remove", "cursor-update", "redo", "undo"],
        evt => {
          this.createFreelineGraphic(evt.vertices);
        }
      );
      this.pointerUpHandler = this.mapView.on("pointer-up", () => {
        this.closeDraw();
        this.mapView.graphics.removeAll();
        if (this.lastFreeLine) {
          this._drawGraphicLayer.add(this.lastFreeLine);
          this.eventBus.$emit("setUndoRedoStatus", {
            undo: this._drawGraphicLayer.graphics.length,
            redo: this.redoGraphics.length
          });
        }
        if (isContinueDraw) {
          this.openDrawMap(drawType, isContinueDraw);
        }
      });
    },

    async enableCreatePolygon(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType, {
        mode: "click"
      });
      action.on(
        ["vertex-add", "vertex-remove", "cursor-update", "redo", "undo"],
        evt => {
          this.createPolygonGraphic(evt.vertices, false, isContinueDraw);
        }
      );
      action.on("draw-complete", evt => {
        this.createPolygonGraphic(evt.vertices, true, isContinueDraw);
      });
    },

    async enableCreateRectangle(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType);
      action.on(["vertex-add", "cursor-update", "redo", "undo"], evt => {
        this.createRectangleGraphic(evt.vertices, false, isContinueDraw);
      });
      action.on("draw-complete", evt => {
        this.createRectangleGraphic(evt.vertices, true, isContinueDraw);
      });
    },

    async enableCreateCircle(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType, {
        mode: "freehand"
      });

      this.pointerDownHandler = this.mapView.on("pointer-down", () => {
        action.on(["vertex-add", "vertex-remove", "cursor-update"], evt => {
          this.createCircleGraphic(evt.vertices, false, isContinueDraw);
        });
        action.on("draw-complete", evt => {
          this.createCircleGraphic(evt.vertices, true, isContinueDraw);
        });
      });
    },

    async enableCreateLocate(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create("point");
      action.on("cursor-update", evt => {
        this.createLocateGraphic(evt.coordinates, false, isContinueDraw);
      });
      action.on("draw-complete", evt => {
        this.createLocateGraphic(evt.coordinates, true, isContinueDraw);
      });
    },

    async enableCreateText(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create("point");
      action.on("cursor-update", evt => {
        this.createTextGraphic(evt.coordinates, false, isContinueDraw);
      });
      action.on("draw-complete", evt => {
        this.createTextGraphic(evt.coordinates, true, isContinueDraw);
      });
    },

    async createPointGraphic(coordinates, isEnd = false, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      let point = {
        type: "point",
        x: coordinates[0],
        y: coordinates[1],
        spatialReference: this.mapView.spatialReference
      };

      /* let graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: this.drawColor,
          size: this.drawSize,
          outline: {
            color: [255, 255, 0, 0],
            width: 1
          }
        }
      }); */
      let symbol = this.getBubblePictureSymbol("rgba(255,0,0,1)", 20);
      symbol.yoffset = 8;
      let graphic = new Graphic({
        geometry: point,
        symbol: symbol
      });
      if (!isEnd) {
        // this.mapView.graphics.add(graphic);
      } else {
        this._drawGraphicLayer.add(graphic);
        this.$emit("draw-geometry", {
          type: "point",
          graphic: graphic,
          geometry: point
        });
        this.eventBus.$emit("drawGeometry", {
          type: "point",
          graphic: graphic,
          geometry: point
        });
        this.eventBus.$emit("setUndoRedoStatus", {
          undo: this._drawGraphicLayer.graphics.length,
          redo: this.redoGraphics.length
        });
        if (isContinueDraw) {
          this.openDrawMap("point", isContinueDraw);
        }
      }
    },

    async createPolylineGraphic(vertices, isEnd = false, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      if (vertices.length > 1) {
        let polyline = {
          type: "polyline",
          paths: vertices,
          spatialReference: this.mapView.spatialReference
        };

        let graphic = new Graphic({
          geometry: polyline,
          symbol: {
            type: "simple-line",
            color: this.drawColor,
            width: this.drawWidth,
            cap: "round",
            join: "round"
          }
        });
        if (!isEnd) {
          this.mapView.graphics.add(graphic);
        } else {
          this._drawGraphicLayer.add(graphic);
          this.$emit("draw-geometry", {
            type: "polyline",
            graphic: graphic,
            geometry: polyline
          });
          this.eventBus.$emit("drawGeometry", {
            type: "polyline",
            graphic: graphic,
            geometry: polyline
          });
          this.eventBus.$emit("setUndoRedoStatus", {
            undo: this._drawGraphicLayer.graphics.length,
            redo: this.redoGraphics.length
          });
          if (isContinueDraw) {
            this.openDrawMap("polyline", isContinueDraw);
          }
        }
      }
    },

    async createFreelineGraphic(vertices) {
      const { Graphic } = await loadModules("esri/Graphic");
      if (vertices.length > 1) {
        let polyline = {
          type: "polyline",
          paths: vertices,
          spatialReference: this.mapView.spatialReference
        };

        let graphic = new Graphic({
          geometry: polyline,
          symbol: {
            type: "simple-line",
            color: this.drawColor,
            width: this.drawWidth,
            cap: "round",
            join: "round"
          }
        });
        // this._drawGraphicLayer.add(graphic);
        this.lastFreeLine = graphic;
        this.mapView.graphics.add(graphic);
      }
    },

    async createPolygonGraphic(vertices, isEnd = false, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      if (vertices && vertices.length > 1) {
        let polygon = {
          type: "polygon",
          rings: vertices,
          spatialReference: this.mapView.spatialReference
        };

        let graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill",
            color: this.fillColor,
            style: "solid",
            outline: {
              color: this.drawColor,
              width: this.drawWidth
            }
          }
        });
        if (!isEnd) {
          this.mapView.graphics.add(graphic);
        } else {
          this._drawGraphicLayer.add(graphic);
          this.$emit("draw-geometry", {
            type: "polygon",
            graphic: graphic,
            geometry: polygon
          });
          this.eventBus.$emit("drawGeometry", {
            type: "polygon",
            graphic: graphic,
            geometry: polygon
          });
          this.eventBus.$emit("setUndoRedoStatus", {
            undo: this._drawGraphicLayer.graphics.length,
            redo: this.redoGraphics.length
          });
          if (isContinueDraw) {
            this.openDrawMap("polygon", isContinueDraw);
          }
        }
      }
    },

    async createRectangleGraphic(vertices, isEnd = false, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      let geo;
      let symbol;
      let type;
      if (vertices && vertices.length > 1) {
        type = "extent";
        geo = {
          type: type,
          xmin:
            vertices[0][0] > vertices[1][0] ? vertices[1][0] : vertices[0][0],
          ymin:
            vertices[0][1] > vertices[1][1] ? vertices[1][1] : vertices[0][1],
          xmax:
            vertices[0][0] > vertices[1][0] ? vertices[0][0] : vertices[1][0],
          ymax:
            vertices[0][1] > vertices[1][1] ? vertices[0][1] : vertices[1][1],
          spatialReference: this.mapView.spatialReference
        };
        symbol = {
          type: "simple-fill",
          color: this.fillColor,
          style: "solid",
          outline: {
            color: this.drawColor,
            width: this.drawWidth
          }
        };

        let graphic = new Graphic({
          geometry: geo,
          symbol: symbol
        });
        if (!isEnd) {
          this.mapView.graphics.add(graphic);
        } else {
          this._drawGraphicLayer.add(graphic);
          this.$emit("draw-geometry", {
            type: type,
            graphic: graphic,
            geometry: geo
          });
          this.eventBus.$emit("drawGeometry", {
            type: type,
            graphic: graphic,
            geometry: geo
          });
          this.eventBus.$emit("setUndoRedoStatus", {
            undo: this._drawGraphicLayer.graphics.length,
            redo: this.redoGraphics.length
          });
          if (isContinueDraw) this.openDrawMap("rectangle", isContinueDraw);
        }
      } else {
        /* type = "point";
        geo = {
          type: type,
          x: vertices[0][0],
          y: vertices[0][1],
          spatialReference: this.mapView.spatialReference
        };
        symbol = {
          type: "simple-marker",
          style: "circle",
          color: this.drawColor,
          size: this.drawSize,
          outline: {
            color: [255, 255, 0, 0],
            width: 1
          }
        } */
        if (!isEnd) {
          // todo
        } else {
          if (isContinueDraw) this.openDrawMap("rectangle", isContinueDraw);
        }
      }
    },

    async createCircleGraphic(vertices, isEnd = false, isContinueDraw) {
      const {
        Graphic,
        Circle,
        Polyline,
        Point,
        GeometryService,
        LengthsParameters
      } = await loadModules(
        "esri/Graphic",
        "esri/geometry/Circle",
        "esri/geometry/Polyline",
        "esri/geometry/Point",
        "esri/tasks/GeometryService",
        "esri/tasks/support/LengthsParameters"
      );
      // this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      let graphic;
      if (vertices && vertices.length > 1) {
        let centerPoint = new Point({
          hasZ: false,
          hasM: false,
          spatialReference: this.mapView.spatialReference,
          x: vertices[0][0],
          y: vertices[0][1]
        });
        if (
          this.geometryServerUrl === null ||
          this.geometryServerUrl === "" ||
          this.geometryServerUrl === " "
        ) {
          console.log("GeometryService is null");
          return;
        }
        this._geomService = new GeometryService(this.geometryServerUrl);
        let line = new Polyline({
          hasZ: false,
          hasM: false,
          paths: vertices,
          spatialReference: this.mapView.spatialReference
        });
        let lengthParams = new LengthsParameters({
          lengthUnit: 9001,
          geodesic: true,
          calculationType: "geodesic",
          polylines: [line]
        });
        let lengthsPromise = await this._geomService.lengths(lengthParams);
        let result = lengthsPromise.lengths[0];
        this.mapView.graphics.removeAll();

        let circle = new Circle({
          hasZ: false,
          hasM: false,
          /* numberOfPoints: 2000, */
          spatialReference: this.mapView.spatialReference,
          center: centerPoint,
          radius: result // dis*8000
        });
        graphic = new Graphic({
          geometry: circle,
          symbol: {
            type: "simple-fill",
            color: this.fillColor,
            style: "solid",
            outline: {
              color: this.drawColor,
              width: this.drawWidth
            }
          }
        });
        if (!isEnd) {
          this.mapView.graphics.add(graphic);
        } else {
          this._drawGraphicLayer.add(graphic);
          this.$emit("draw-geometry", {
            type: "circle",
            graphic: graphic,
            geometry: graphic.geometry
          });
          this.eventBus.$emit("drawGeometry", {
            type: "circle",
            graphic: graphic,
            geometry: graphic.geometry
          });
          this.eventBus.$emit("setUndoRedoStatus", {
            undo: this._drawGraphicLayer.graphics.length,
            redo: this.redoGraphics.length
          });
          if (this.pointerDownHandler) {
            this.pointerDownHandler.remove();
            this.pointerDownHandler = null;
          }
          if (isContinueDraw) this.openDrawMap("circle", isContinueDraw);
        }
      } else {
        if (!isEnd) {
          // todo
        } else {
          if (this.pointerDownHandler) {
            this.pointerDownHandler.remove();
            this.pointerDownHandler = null;
          }
          if (isContinueDraw) this.openDrawMap("circle", isContinueDraw);
        }
      }
    },

    async createLocateGraphic(coordinates, isEnd = false, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      let point = {
        type: "point",
        x: coordinates[0],
        y: coordinates[1],
        spatialReference: this.mapView.spatialReference
      };

      let symbol = this.getBubblePictureSymbol(this.drawColor, 20);
      symbol.yoffset = 8;
      let graphic = new Graphic({
        geometry: point,
        attributes: { type: "locate" },
        symbol: symbol
      });
      // 气泡下坐标
      let xyStr =
        "(" +
        coordinates[0].toFixed(2) +
        ", " +
        coordinates[1].toFixed(2) +
        ")";
      let corSymbol = this.getBubbleRegionSymbol(xyStr, this.drawSize);
      corSymbol.color = this.drawColor;
      corSymbol.yoffset = -8;
      let corGra = new Graphic({
        geometry: point,
        attributes: { type: "locate" },
        symbol: corSymbol
      });
      if (!isEnd) {
        // this.mapView.graphics.add(graphic);
      } else {
        this._drawGraphicLayer.add(graphic);
        this._drawGraphicLayer.add(corGra);
        this.eventBus.$emit("setUndoRedoStatus", {
          undo: this._drawGraphicLayer.graphics.length,
          redo: this.redoGraphics.length
        });
        if (isContinueDraw) {
          this.openDrawMap("locate", isContinueDraw);
        }
      }
    },

    async createTextGraphic(coordinates, isEnd = false, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      /* if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      } */
      let point = {
        type: "point",
        x: coordinates[0],
        y: coordinates[1],
        spatialReference: this.mapView.spatialReference
      };

      let symbol = this.getBubbleRegionSymbol(this.textValue, this.drawSize);
      symbol.color = this.drawColor;
      symbol.yoffset = 0;
      let graphic = new Graphic({
        geometry: point,
        symbol: symbol
      });
      if (!isEnd) {
        // this.mapView.graphics.add(graphic);
      } else {
        this._drawGraphicLayer.add(graphic);
        this.eventBus.$emit("setUndoRedoStatus", {
          undo: this._drawGraphicLayer.graphics.length,
          redo: this.redoGraphics.length
        });
        if (isContinueDraw) {
          this.openDrawMap("text", isContinueDraw);
        }
      }
    },

    setDrawStyle(info) {
      if (info) {
        if (info.drawColor) this.drawColor = info.drawColor;
        if (info.drawSize) this.drawSize = info.drawSize;
        if (info.drawWidth) this.drawWidth = info.drawWidth;
        if (info.textValue) this.textValue = info.textValue;
      }
    },

    operateDrawGraphics(type) {
      if (type === "undo") {
        if (
          this._drawGraphicLayer &&
          this._drawGraphicLayer.graphics &&
          this._drawGraphicLayer.graphics.length > 0
        ) {
          let firstRemoveGra = this._drawGraphicLayer.graphics.items[
            this._drawGraphicLayer.graphics.length - 1
          ];
          this.redoGraphics.push(firstRemoveGra);
          this._drawGraphicLayer.graphics.removeAt(
            this._drawGraphicLayer.graphics.length - 1
          );

          if (firstRemoveGra.attributes) {
            let secondRemoveGra = null;
            if (this._drawGraphicLayer.graphics.length > 0) {
              secondRemoveGra = this._drawGraphicLayer.graphics.items[
                this._drawGraphicLayer.graphics.length - 1
              ];
            }
            if (secondRemoveGra && secondRemoveGra.attributes) {
              if (
                firstRemoveGra.attributes["type"] ===
                  secondRemoveGra.attributes["type"] &&
                secondRemoveGra.attributes["type"] === "locate"
              ) {
                this.redoGraphics.push(secondRemoveGra);
                this._drawGraphicLayer.graphics.removeAt(
                  this._drawGraphicLayer.graphics.length - 1
                );
              }
            }
          }
        }
        this.eventBus.$emit("setUndoRedoStatus", {
          undo: this._drawGraphicLayer.graphics.length,
          redo: this.redoGraphics.length
        });
      } else if (type === "redo") {
        if (this.redoGraphics.length > 0) {
          let firstAddGra = this.redoGraphics[this.redoGraphics.length - 1];
          this._drawGraphicLayer.graphics.add(firstAddGra);
          this.redoGraphics.pop();
          if (firstAddGra.attributes) {
            let secondAddGra = null;
            if (this.redoGraphics.length > 0) {
              secondAddGra = this.redoGraphics[this.redoGraphics.length - 1];
            }
            if (secondAddGra && secondAddGra.attributes) {
              if (
                firstAddGra.attributes["type"] ===
                  secondAddGra.attributes["type"] &&
                secondAddGra.attributes["type"] === "locate"
              ) {
                this._drawGraphicLayer.graphics.add(secondAddGra);
                this.redoGraphics.pop();
              }
            }
          }
        }
        this.eventBus.$emit("setUndoRedoStatus", {
          undo: this._drawGraphicLayer.graphics.length,
          redo: this.redoGraphics.length
        });
      } else if (type === "clear") {
        if (this._drawGraphicLayer) {
          this._drawGraphicLayer.removeAll();
        }
        this.redoGraphics = [];
      }
    },

    closeDraw() {
      if (this.pointerUpHandler) {
        this.pointerUpHandler.remove();
        this.pointerUpHandler = null;
      }
      if (this.pointerDownHandler) {
        this.pointerDownHandler.remove();
        this.pointerDownHandler = null;
      }
      if (this.mapDraw) {
        this.mapDraw.reset();
      }
    }
  }
};

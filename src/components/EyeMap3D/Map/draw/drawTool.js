import loadModules from "@/utils/loadModules";

export default {
  created() {},
  data() {
    return {
      mapDraw: null,
      _drawGraphicLayer: null
    };
  },
  async mounted() {},
  methods: {
    async initDraw1() {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      return this.mapDraw;
    },

    async openDraw(drawType, isContinueDraw) {
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
        this.enableCreatePoint1(drawType, isContinueDraw);
      } else if (drawType === "polygon") {
        this.enableCreatePolygon1(drawType, isContinueDraw);
      } else if (drawType === "rectangle") {
        this.enableCreateRectangle1(drawType, isContinueDraw);
      } else {
        console.log("error draw type");
      }
    },

    async enableCreatePoint1(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType);
      action.on("cursor-update", evt => {
        this.createMovePointGraphic1(evt.coordinates);
      });
      action.on("draw-complete", evt => {
        this.createDrawPointGraphic1(evt.coordinates, isContinueDraw);
      });
    },

    async enableCreatePolygon1(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType, {
        mode: "click"
      });
      action.on("vertex-add", evt => {
        this.createPolygonGraphic1(evt.vertices);
      });
      action.on("vertex-remove", evt => {
        this.createPolygonGraphic1(evt.vertices);
      });
      action.on("cursor-update", evt => {
        this.createPolygonGraphic1(evt.vertices);
      });
      action.on("draw-complete", evt => {
        this.createDrawPolygonGraphic1(evt.vertices, isContinueDraw);
      });
    },

    async enableCreateRectangle1(drawType, isContinueDraw) {
      const { Draw } = await loadModules("esri/views/3d/draw/Draw");

      this.mapDraw = new Draw({
        view: this.mapView
      });
      let action = this.mapDraw.create(drawType);
      action.on("vertex-add", evt => {
        this.createRectangleGraphic1(evt.vertices);
      });
      action.on("cursor-update", evt => {
        this.createRectangleGraphic1(evt.vertices);
      });
      action.on("redo", evt => {
        this.createRectangleGraphic1(evt.vertices);
      });
      action.on("undo", evt => {
        this.createRectangleGraphic1(evt.vertices);
      });
      action.on("draw-complete", evt => {
        this.createDrawRectangleGraphic1(evt.vertices, isContinueDraw);
      });
    },

    async createMovePointGraphic1(coordinates) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      let point = {
        type: "point",
        x: coordinates[0],
        y: coordinates[1],
        spatialReference: this.mapView.spatialReference
      };

      let graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: "red",
          size: "4px",
          outline: {
            color: [255, 255, 0, 0],
            width: 1
          }
        }
      });
      this.mapView.graphics.add(graphic);
    },

    async createDrawPointGraphic1(coordinates, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      }
      let point = {
        type: "point",
        x: coordinates[0],
        y: coordinates[1],
        spatialReference: this.mapView.spatialReference
      };

      let graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: "red",
          size: "4px",
          outline: {
            color: [255, 255, 0, 0],
            width: 1
          }
        }
      });
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
      if (isContinueDraw) {
        this.openDraw("point", isContinueDraw);
      }
    },

    async createPolygonGraphic1(vertices) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      // if (this._drawGraphicLayer) {
      //   this._drawGraphicLayer.removeAll();
      // }
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
            color: [255, 0, 0, 0.5],
            style: "solid",
            outline: {
              color: [255, 0, 0, 1],
              width: 2
            }
          }
        });
        this.mapView.graphics.add(graphic);
      }
    },

    async createDrawPolygonGraphic1(vertices, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
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
            color: [255, 0, 0, 0.5],
            style: "solid",
            outline: {
              color: [255, 0, 0, 1],
              width: 2
            }
          }
        });
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
        if (isContinueDraw) {
          this.openDraw("polygon", isContinueDraw);
        }
      }
    },

    async createRectangleGraphic1(vertices) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
      if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      }
      if (vertices.length > 1) {
        let geometry = {
          type: "extent",
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
        let graphic = new Graphic({
          geometry: geometry,
          symbol: {
            type: "simple-fill",
            color: "rgba(0,0,0,0.1)",
            style: "solid",
            outline: {
              color: "#1890ff",
              width: 1
            }
          }
        });
        this.mapView.graphics.add(graphic);
      }
    },

    async createDrawRectangleGraphic1(vertices, isContinueDraw) {
      const { Graphic } = await loadModules("esri/Graphic");
      this.mapView.graphics.removeAll();
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
          color: "rgba(0,0,0,0.1)",
          style: "solid",
          outline: {
            color: "#1890ff",
            width: 1
          }
        };
      } else {
        type = "point";
        geo = {
          type: type,
          x: vertices[0][0],
          y: vertices[0][1],
          spatialReference: this.mapView.spatialReference
        };
        symbol = {
          type: "simple-marker",
          style: "circle",
          color: "#1890ff",
          size: "12px",
          outline: {
            color: [255, 255, 0, 0],
            width: 1
          }
        };
      }
      let graphic = new Graphic({
        geometry: geo,
        symbol: symbol
      });
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
      if (isContinueDraw) this.openDraw("rectangle", isContinueDraw);
    },
    closeDrawMap() {
      if (this.mapDraw) {
        this.mapDraw.reset();
      }
      this.mapView.graphics.removeAll();
      if (this._drawGraphicLayer) {
        this._drawGraphicLayer.removeAll();
      }
    }
  }
};

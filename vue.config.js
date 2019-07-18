const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const path = require("path");

const productionGzipExtensions = ["js", "css"];

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  baseUrl: process.env.NODE_ENV === "development" ? "/" : "./",
  devServer: {
    port: 9097,
    open: true
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        data: `@import "@/styles/index.scss";`
      }
    }
  },
  chainWebpack: config => {
    // 别名
    config.resolve.alias
      .set("@", resolve("src"))

    // use svg
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.include
      .add(resolve("src/icon/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    // image exclude svg
    const imagesRule = config.module.rule("images");
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/icon/svg"))
      .end();
  },
  // 生产环境打包去除console.log
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: false,
              drop_debugger: true
            }
          },
          parallel: true,
          sourceMap: true
        })
      ]
    },
    // gzip
    plugins:
      process.env.NODE_ENV === "production"
        ? [
            new CompressionPlugin({
              filename: "[path].gz[query]",
              algorithm: "gzip",
              test: new RegExp(
                "\\.(" + productionGzipExtensions.join("|") + ")$"
              ),
              threshold: 10240,
              minRatio: 0.8
            })
          ]
        : []
  }
};

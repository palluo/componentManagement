const files = require.context(".", true, /\.js$/);
const modules = {};

files.keys().forEach(key => {
  if (key === "./index.js") {
    return;
  }
  const moduleName = key.split("/")[1].split(".")[0];
  modules[moduleName] = files(key).default;
});

export default modules;
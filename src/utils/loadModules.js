import { loadModules } from "esri-loader";

export default async (...args) => {
  const reponseModules = {};
  const res = await loadModules(args);
  res.forEach((module, idx) => {
    let key = args[idx].replace(/.*\/([a-zA-Z]+)/, "$1");
    if (key.indexOf("-") >= 0) {
      key = key.replace(
        key.substr(key.indexOf("-"), 2),
        key.substr(key.indexOf("-") + 1, 1).toUpperCase()
      );
      /* key = key.replace(/\b\w/g, function(word) {
        return word.substring(0,1).toUpperCase()+word.substring(1);
      });
      key = key.replace("-", ""); */
    }
    reponseModules[key] = module;
  });
  return reponseModules;
};

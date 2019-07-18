/* eslint-disable prettier/prettier */
import loadModules from "@/utils/loadModules"

export const queryTaskExecute = async(url, param) => {
    const { QueryTask, Query } = await loadModules(
        "esri/tasks/QueryTask",
        "esri/tasks/support/Query"
      );
    let queryTask = new QueryTask({
        url: url
    });
    let query = new Query();
    query.where = param.where;
    if (query.geometry !== 'undefined'){
        query.geometry = param.geometry;
        query.spatialRelationship = Query.spatialRelationship;
    }
    query.maxAllowableOffset = param.maxAllowableOffset?param.maxAllowableOffset:-1;
    //返回的字段信息：*代表返回全部字段
    query.outFields = param.outFields;
    //是否返回几何形状
    query.returnGeometry = (param.returnGeometry === false)?false:true;
    query.returnDistinctValues = (param.returnDistinctValues)?true:false;
    //是否返回几何形状
    query.orderByFields = param.orderByFields;
    // When resolved, returns features and graphics that satisfy the query.
    return queryTask.execute(query);
}
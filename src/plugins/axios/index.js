/*
 * @Author: raojw
 * @Date: 2018-11-23
 */
import HttpRequest from "./httpRequest";
import axios from "axios";
import iview from "iview";
// axios.defaults.withCredentials = true;

const instanceMap = {
  // 系统基础服务
  base: null,
  // 空间计算服务
  spatial: null,
  // 国土平台登录及验证服务
  authentication: null
};

// 注册实例
export const initInstance = config => {
  const { API, API_FILE_DIR, SPATIAL_API } = config;
  const BASEURL = API + API_FILE_DIR || "";
  const SPATIALURL = SPATIAL_API || "";
  instanceMap.base = new HttpRequest({
    BASEURL
  });
  instanceMap.spatial = new HttpRequest({
    BASEURL: SPATIALURL
  });
  instanceMap.authentication = new HttpRequest({
    BASEURL: API + "/dgpnr-server-web/"
  });
};


/**
 * get方法
 * @param {String} url [请求的url地址]
 * @param {String} serviceName [请求服务名和服务描述(和swagger对应)]
 * @param {Object} params [请求时携带的参数] (可选)
 */
const get = (axiosInstance, url, serviceName = "未知服务", params = {}) => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      method: "get",
      params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        throw new Error(`请求---${serviceName}---接口失败`);
      });
  });
};

/**
 * post方法
 * @param {String} url [请求的url地址]
 * @param {String} serviceName [请求服务名和服务描述(和swagger对应)]
 * @param {Object} params [请求时携带的参数] (可选)
 * @param {Object} headers [请求时的请求头信息] （可选）
 */
const post = (
  axiosInstance,
  url,
  serviceName = "未知服务",
  params = {},
  headers = {}
) => {
  // console.log(params);
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      method: "post",
      // data: qs.stringify(params)
      data: params,
      headers: headers
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        throw new Error(`请求---${serviceName}---接口失败`);
      });
  });
};

/**
 * put方法
 * @param {string} url [请求的url地址]
 * @param {string} serviceName [请求服务名与服务描述(与swagger一致)]
 * @param {Object} params [请求是携带的参数(可选)]
 */
const put = (axiosInstance, url, serviceName = "未知服务", params = {}) => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      method: "put",
      data: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        throw new Error(`请求---${serviceName}---接口失败`);
      });
  });
};

/**
 * delete方法
 * @param {string} url [请求url]
 * @param {string} serviceName [请求服务名和服务描述(与swagger一致)]
 * @param {Object} params [请求携带参数(可选)]
 */

const del = (axiosInstance, url, serviceName = "未知服务", params = {}) => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      method: "delete",
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        throw new Error(`请求---${serviceName}---接口失败`);
      });
  });
};
// 基础get请求
export const GET = (url, serviceName, params) => {
  return get(instanceMap.base, url, serviceName, params);
};

// 单点登录get请求（为了区分其他基础的get请求）
export const LOGINGET = (url, serviceName, params) => {
  return get(instanceMap.authentication, url, serviceName, params);
};


// 基础post请求
export const POST = (url, serviceName, params, headers) => {
  return post(instanceMap.base, url, serviceName, params, headers);
};

// 基础put请求
export const PUT = (url, serviceName, params) => {
  return put(instanceMap.base, url, serviceName, params);
};

// 基础delete请求
export const DELETE = (url, serviceName, params) => {
  return del(instanceMap.base, url, serviceName, params);
};

export const SPOST = (url, serviceName, params, headers) => {
  return post(instanceMap.spatial, url, serviceName, params, headers);
};

export const SGET = (url, serviceName, params, headers) => {
  return get(instanceMap.spatial, url, serviceName, params, headers);
};

export const JGET = async (url, serviceName) => {
  try {
    const res = await HttpRequest.get(url);
    return res.data;
  } catch (error) {
    throw new Error(`请求---${serviceName}---失败`);
  }
};

export const YGET = async (url, serviceName) => {
  try {
    const res = await HttpRequest.get(url);
    return res.data;
  } catch (error) {
    throw new Error(`请求---${serviceName}---失败`);
  }
};

// mockjs get方法
// export const MGET = (url, serviceName) => {
//   return get(mockService, url, serviceName);
// };

// export const MPOST = (url, serviceName, params) => {
//   return post(mockService, url, serviceName, params);
// };

// 静态json get
// export const JGET = async (url, serviceName) => {
//   try {
//     return await jsonService({
//       method: "get",
//       url
//     });
//   } catch (error) {
//     throw new Error(`请求---${serviceName}---失败`);
//   }
// };

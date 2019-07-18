/*
 * @Author: raojw
 * @Date: 2018-11-23
 * @Description: 构造axios实例类
 */

import axios from "axios";
import iview from "iview";
// axios.defaults.withCredentials = true;

/**
 * @class HttpRequest
 * @param {Object} options { BASEURL, TIMEOUT }
 * @description 基于axios二次封装类，提供给不同地址实例使用
 * 目前有三个实例（基础，dataeye，mock），共用一种拦截器
 */
export default class HttpRequest {
  constructor({ BASEURL, TIMEOUT = 60000 * 3 }) {
    this.config = {
      baseURL: BASEURL,
      timeout: TIMEOUT
    };
    this.instance = axios.create(this.config);
    // 安装拦截器
    this.interceptors();
    return this.instance;
  }
  // 拦截器
  interceptors(instance = this.instance) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // TODO: 未来请求可能需要加token
        // if (store.getters.token) {
        // 请求头携带token
        //   config.headers["XZ-Token"] = getToken();
        // }
        return config;
      },
      error => {
        // 请求失败
        Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      response => {
        // console.log(response);
        const { status } = response;
        if (status === 200) {
          const { data } = response;
          const { code, status, message } = data;
          // 和后端约定的状态码
          switch (code) {
            case 1000:
              return Promise.resolve(data);
            case 2000:
              iview.Message.error(`${status} 同步操作不合法`);
              return Promise.reject(message);
            case 3000:
              iview.Message.error(`${status} 系统异常`);
              return Promise.reject(message);
          }
          // if (code !== 1000) {
          //   iview.Message.error(`${status} ${message}`);
          //   return Promise.reject(message);
          // }
          // return Promise.resolve(data);
        } else {
          return iview.Message.error(status);
        }
      },
      error => {
        // axios捕获服务器异常
        iview.Message.error(error.message);
        return Promise.reject(error.response);
      }
    );
  }
  getInstance() {
    return this.instance;
  }
  static get(url) {
    return axios.get(url);
  }
}

import axios from './apiConfig'; // api配置工厂，建议模块化管理
import all from './all' // 首页

let apiConfig = {
  all: all
};

// get请求时拼接参数
function formatParams(params) {
    let str = [];
    for (const key in params) {
      str.push(`${key}=${params[key]}`);
    }
    return str.join("&");
}

// 生成api方法
function toApi(apiConfig) {
    const api = {};
    // 循环模块
    for (const module in apiConfig) {
        api[module] = {};
        // 循环模块下的请求配置
        apiConfig[module].forEach((item) => {
            // 生成对应请求方法
            api[module][item.name] = (params, callback, errorCallback) => {
                let _params = params || {};
                let url = null;
                let headers = {};
                if (process.env.NODE_ENV == "development") {
                    if (item.method === 'get') {
                      url = `${item.prefix}${item.url}?${formatParams(_params)}`;
                    } else {
                      url = `${item.prefix}${item.url}`;
                    }
                } else {
                    let path = process.env.VUE_APP_APIURL;
                    if (item.method === 'get') {
                      url = `${path + item.url}?${formatParams(_params)}`;
                    } else {
                      url = `${path + item.url}`;
                    }
                }
                return axios({
                    method: item.method || 'post',
                    url: url,
                    data: _params,
                    headers,
                }).then(response => {
                    if (callback) callback(response, _params, item);
                    return response ? response.data : { msg: '请求失败，没有返回信息！' };
                }).catch(error => {
                    if (errorCallback) errorCallback(error, _params, item)
                });
            };
        });
    }
    return api;
}

let api = toApi(apiConfig);

export default api;
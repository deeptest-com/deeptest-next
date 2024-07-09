import axios, {AxiosPromise, InternalAxiosRequestConfig, AxiosResponse} from 'axios';
import {router} from '@/router';
import {getToken, setToken} from '@/utils/localToken';
import bus from '@/utils/eventBus';
import settings from '@/config/settings';

export interface ResponseData {
    code: number;
    data?: any;
    msg?: string;
    token?: string;
}

export interface ResultErr {
    httpCode: number;
    resultCode: number;
    resultMsg: string;
}

export const getUrls = () => {
    let serverUrl = import.meta.env.VITE_GLOB_API_SERVER;

    if (!serverUrl) { // deeptest-ui static folder is under deeptest server
        serverUrl = new URL(unescape(window.location.href)).origin
        if (!serverUrl.endsWith('/')) serverUrl += '/'
        serverUrl = serverUrl + 'api/v1'
    }

    console.log(`serverUrl=${serverUrl}`)

    return {serverUrl}
}
const {serverUrl} = getUrls()
const request = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
    timeout: 0
});

// request interceptors
const requestInterceptors = async (config: InternalAxiosRequestConfig & { cType?: boolean, baseURL?: string }) => {
    const jwtToken = await getToken();
    if (jwtToken && config.headers) {
        config.headers[settings.ajaxHeadersTokenKey] = 'Bearer ' + jwtToken;
    }

    // 加随机数清除缓存
    config.params = {...config.params, ts: Date.now()};

    console.log('=== request ===', config.url, config)

    return config;
}
request.interceptors.request.use(
    requestInterceptors,
    /* error=> {} */ // 已在 export default catch
);

// response interceptors
const responseInterceptors = async (axiosResponse: AxiosResponse) => {
  //console.log('=== response ===', axiosResponse.config.url)

  const res: ResponseData = axiosResponse.data;
  const {authorization} = axiosResponse?.headers;
  if (authorization) {
    await setToken(authorization);
  }

  const {code} = res;

  if (code !== 0) {
    return Promise.reject(axiosResponse);
  }

  return axiosResponse;
}
request.interceptors.response.use(
    responseInterceptors,
    /* error => {} */ // 已在 export default catch
);

const errorHandler = (axiosResponse: AxiosResponse) => {
    //console.log('=== ERROR ===', axiosResponse)

    if (!axiosResponse) axiosResponse = {status: 500} as AxiosResponse

    if (axiosResponse.status === 200) {
        const result = {
            httpCode: axiosResponse.status,
            resultCode: axiosResponse.data.code,
            resultMsg: axiosResponse.data.msg
        } as ResultErr

        bus.emit('eventNotify', result)

        const {config, data} = axiosResponse;
        const {url, baseURL} = config;
        const {code, msg} = data

        const reqUrl = (url + '').split("?")[0].replace(baseURL + '', '');
        const noNeedLogin = settings.ajaxResponseNoVerifyUrl.includes(reqUrl);
        const { params: { projectNameAbbr }, fullPath } = router.currentRoute.value;
        if (code === 401 && !noNeedLogin) {
            router.replace('/user/login');
        } else if (code === 403 && fullPath !== '/' && !projectNameAbbr) {
            // 无权限访问系统页面时 返回到首页
            router.replace(`/error/${code}?msg=${msg}`);
        }

    } else {
        bus.emit(settings.eventNotify, {
            httpCode: axiosResponse.status
        })
    }

    return Promise.reject(axiosResponse.data || {})
}

export default function (config: Partial<InternalAxiosRequestConfig>): AxiosPromise<any> {
    return request(config).
    then((response: AxiosResponse) => response.data).
    catch(error => errorHandler(error));
}

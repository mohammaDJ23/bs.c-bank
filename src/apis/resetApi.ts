import axios, { AxiosRequestConfig, CreateAxiosDefaults, AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { history } from '../App';
import { getToken, isUserAuthenticated, LocalStorage, Pathes } from '../lib';
import { Exception } from '../store';

export abstract class RootApi<D = any> implements RootApiObj<D> {
  protected _isInitialApi: boolean = false;

  constructor(public readonly api: AxiosRequestConfig<D>, public readonly config: CreateAxiosDefaults<D> = {}) {
    this.api = api;
    this.config = config;
  }

  get isInitialApi() {
    return this._isInitialApi;
  }

  setInitialApi(value: boolean = true) {
    this._isInitialApi = value;
    return this;
  }
}

export interface RootApiObj<D = any> {
  readonly api: AxiosRequestConfig<D>;
  readonly config?: CreateAxiosDefaults<D>;
}

export class Request<R = any, D = any> implements RootApiObj<D> {
  private readonly axiosInstance: AxiosInstance;
  public readonly api: AxiosRequestConfig<D>;
  public readonly config?: CreateAxiosDefaults<D> | undefined;

  constructor({ api, config = {} }: RootApiObj<D>) {
    this.api = api;
    this.axiosInstance = axios.create(config);

    this.requestInterceptors();
    this.responseInterceptors();
  }

  requestInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (!isUserAuthenticated()) {
          LocalStorage.clear();
          history.push(Pathes.LOGIN);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${getToken()}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  responseInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<Exception>) => {
        if (error.response?.data?.statusCode === 401) {
          LocalStorage.clear();
          history.push(Pathes.LOGIN);
        }

        return Promise.reject(error);
      }
    );
  }

  async build(): Promise<AxiosResponse<R, D>> {
    try {
      return this.axiosInstance.request<R, AxiosResponse<R>, D>(this.api);
    } catch (error) {
      const err = error as AxiosError<Exception, D>;
      throw err;
    }
  }
}

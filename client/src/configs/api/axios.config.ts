/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse } from 'axios';
import camelCaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import LOCAL_STORAGE_KEY from '@/utils/constant/localStorage';

const API_URL: string = import.meta.env.VITE_API_URL as string;

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
  // transformRequest: [(data) => console.log(data)]
});

http.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }

    if (config.data) {
      config.data = JSON.stringify(snakecaseKeys(config.data));
    }

    return config;
  },
  (error) => {
    console.log('Axios-Request-Error:', error);
    Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    let res = response.data;
    if (response && res) {
      res = JSON.parse(
        JSON.stringify(
          camelCaseKeys(res, {
            deep: true
          })
        )
      );
      const { access, refresh, status } = res;

      if (status === '401') {
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
          localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      if (access && refresh) {
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, access);
        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refresh);
      }
      return res;
    }

    return res;
  }
  // async (err) => {
  //   const originalConfig = err.config;

  //   if (originalConfig.url !== 'auth/token' && err.response) {
  //     if (err.response.status === 403 && !originalConfig._retry) {
  //       originalConfig._retry = true;
  //       try {
  //         localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  //         localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
  //       } catch (error) {
  //         return Promise.reject(err);
  //       }
  //     }
  //   }

  //   return Promise.reject(err);
  // }
);

export default http;

import axios from 'axios';
import store from './redux/store';

let API = 'http://3.15.164.228:8082';

export const Instance = axios.create({
  baseURL: API,
});

Instance.defaults.headers.get['Accept'] = 'application/json';
Instance.defaults.headers.post['Accept'] = 'application/json';

Instance.interceptors.request.use(
  (request) => {
    request.headers['Authorization'] = store.getState().user?.token;
    return request;
  },
  (error) => {
    return error;
  }
);
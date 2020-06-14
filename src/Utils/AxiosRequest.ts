import Axios, { Method } from 'axios';
import CustomError from './CustomError';

export default class AxiosService {
  /**
   * Generic method for any http request
   * @param {*} url
   * @param {*} method
   * @param {*} data
   */
  static async request(token: string | null, url: string, method: Method, data: any) {
    return new Promise((resolve, reject) => {
      try {
        const req = { method, url, data };
        if (token) Object.assign(req, { headers: { Authorization: token } });

        Axios(req)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            const { status_code, message } = err.response.data
              ? err.response.data
              : { message: err.message, status_code: 400 };

            reject(new CustomError(status_code, message));
          });
      } catch (error) {
        reject(new CustomError(400, error.message));
      }
    });
  }

  static async requestAuth(url: string, cred: string) {
    return new Promise((resolve, reject) => {
      Axios.post(url, cred)
        .then((response) => {
          const { data } = response;
          resolve(data);
        })
        .catch((err) => {
          reject(new Error(err.message));
        });
    });
  }
}

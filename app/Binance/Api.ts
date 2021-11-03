import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';

export default class API {

    private api: AxiosInstance;

    private key: string;

    private secret: string;

    constructor(key: string, secret: string) {
        this.key = key;
        this.secret = secret;

        this.api = axios.create({
            baseURL: 'https://api.binance.com',
            timeout: 5000,
            headers: {
                'X-MBX-APIKEY': key
            }
        });
    }

    async request(options: AxiosRequestConfig) {
        return await this.api(options);
    }
}

import API from './Api';

export interface MarketDataOptions {
    symbol: string;
    interval: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
}

export default class Market {
    
    private api: API;

    constructor(api: API) {
        this.api = api;
    }

    async testConnectivity() {
        try {
            await this.api.request({
                method: 'GET',
                url: '/api/v3/ping'
            });

            return true;
        } catch (err) {
            console.error(err);

            return false;
        }
    }

    async candleStickData(parameters: MarketDataOptions) {
        const response = await this.api.request({
            method: 'GET',
            url: '/api/v3/klines',
            params: {
                symbol: parameters.symbol,
                interval: parameters.interval,
                startTime: parameters.startTime,
                endTime: parameters.endTime,
                limit: parameters.limit
            }
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    }
}
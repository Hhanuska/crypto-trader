import API from "./Api";

interface MarketDataOptions {
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

    async candleStickData(params: MarketDataOptions) {
        const response = await this.api.request({
            method: 'get',
            url: '/api/v3/klines',
            params: {
                symbol: params.symbol,
                interval: params.interval,
                startTime: params.startTime,
                endTime: params.endTime,
                limit: params.limit
            }
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    }
}
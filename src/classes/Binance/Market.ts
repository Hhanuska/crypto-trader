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

    async candleStickData(marketDataOptions: MarketDataOptions) {
        const response = await this.api.request({
            method: 'get',
            url: '/api/v3/klines',
            params: {
                symbol: marketDataOptions.symbol,
                interval: marketDataOptions.interval,
                startTime: marketDataOptions.startTime,
                endTime: marketDataOptions.endTime,
                limit: marketDataOptions.limit
            }
        });

        if (response.status !== 200) {
            return response.statusText;
        }

        return response.data;
    }
}
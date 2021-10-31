import API from './exchanges/Binance/Api';
import Market from './exchanges/Binance/Market';
import { config } from './resources/config';

import './view/index';

const api = new API(config.Binance.key, config.Binance.secret);
const market = new Market(api);

test()

export async function test() {
    console.log('Last 10 1d candles of BTC/USDT pair:', await market.candleStickData({
        symbol: 'BTCUSDT',
        interval: '1d',
        limit: 10
    }))
}

export async function test2(symbol: string, interval: string, limit: number) {
    console.log('Last 10 1d candles of BTC/USDT pair:', await market.candleStickData({
        symbol: 'BTCUSDT',
        interval: '1d',
        limit: 10
    }))
}

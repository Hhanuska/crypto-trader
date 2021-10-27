import API from './exchanges/Binance/Api';
import Market from './exchanges/Binance/Market';
import { config } from './resources/config';

import './view/index';

const api = new API(config.Binance.key, config.Binance.secret);
const market = new Market(api);

test()

async function test() {
    console.log(await market.candleStickData({
        symbol: 'BTCUSDT',
        interval: '1d',
        limit: 10
    }))
}


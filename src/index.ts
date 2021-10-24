import API from './classes/Binance/Api';
import Market from './classes/Binance/Market';
import { config } from './resources/config';

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


interface Config {
    Binance: {
        key: string;
        secret: string;
    }
}

export const config: Config = require('../files/config.json');

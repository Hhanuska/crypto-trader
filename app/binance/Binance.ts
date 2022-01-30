import API from './Api';
import Market from './Market';

/**
 * Class for interacting with the Binance API
 */
 export default class Binance {

    private key: string;

    private secret: string;

    private api: API;

    public readonly market: Market;

    /**
     * Constructor
     * @param {String} key Binance API key
     * @param {String} secret Binance API key secret
     */
    constructor(key: string, secret: string) {
        this.key = key;
        this.secret = secret;

        this.api = new API(key, secret);
        this.market = new Market(this.api);
    }

    resolutionToMs(resolution: string): number {
        const arr = resolution.match(/[a-zA-Z]+|[0-9]+/g);

        if (arr) {
            return this.resolutionLetterToMs(arr[1]) * Number(arr[0]);
        } else {
            throw new Error(`Invalid resolution: ${resolution}`);
        }
        
    }

    private resolutionLetterToMs(letter: string): number {
        let num: number | null = 1;

        switch (letter) {
            case 'M' || 'w':
                num *= letter === 'M' ? 30 : 7;
            case 'd':
                num *= 24;
            case 'h':
                num *= 60;
            case 'm':
                num *= 1000 * 60;
                break;
        
            default:
                throw new Error(`Invalid resolution letter: ${letter}`);
        }

        return num;
    }
}
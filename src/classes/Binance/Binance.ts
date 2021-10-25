/**
 * Class for interacting with the Binance API
 */
 export default class Binance {

    private key: string;

    private secret: string;

    /**
     * Constructor
     * @param {String} key Binance API key
     * @param {String} secret Binance API key secret
     */
    constructor(key: string, secret: string) {
        this.key = key;
        this.secret = secret;
    }
}
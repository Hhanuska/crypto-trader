import Database from "./Database";
import { InputParsed } from "../../pages/api/marketData";
import Binance from "../binance/Binance";
import { arrayToCandlestick } from "../binance/data/candlestick";

export default class Downloader {

    public static readonly instance = new Downloader(new Binance('a', 'b'));

    public readonly binance: Binance;

    private downloadInProgress: boolean = false;

    private constructor(binance: Binance) {
        this.binance = binance;

        Database.initialize();
    }

    async downloadData(params: InputParsed, initialCall = true): Promise<void> {
        // Shouldn't be possible
        if (!Database.isReady()) {
            Database.initialize();
            return;
        }

        if (this.downloadInProgress && initialCall) {
            return;
        }

        this.downloadInProgress = true;

        const limit = this.calculateAmount(params);

        const marketData = await this.binance.market.candleStickData({
            symbol: params.symbol,
            interval: params.resolution,
            startTime: params.from,
            endTime: params.to,
            limit: 1000
        });

        const tableName = Database.tableNameFromParams(params);

        if (initialCall) {
            await Database.dropTable(tableName);    // For development only
            await Database.createTableForCandles(tableName);
        }
        
        marketData.forEach((e: Array<number | string>) => {
            Database.addCandleToTable(tableName, arrayToCandlestick(e), params);
        });

        if (limit > 1000) {
            // TODO: Make sure to avoid ratelimit
            // Limit is 1200 / minute => 20 / sec => 1 request / 50 ms
            // (Request + write to db will almost always take longer than 50ms, unlikely to ever get rate limited)
            this.downloadData({
                symbol: params.symbol,
                resolution: params.resolution,
                from: marketData[marketData.length - 1][6],
                to: params.to
            }, false);
        } else {
            this.downloadInProgress = false;
        }
    }

    private calculateAmount(params: InputParsed): number {
        return Math.abs(params.from - params.to)
            / this.binance.resolutionToMs(params.resolution);
    }
}

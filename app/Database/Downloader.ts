import Database from "./Database";
import { InputParsed } from "../../pages/api/marketData";
import Binance from "../Binance/Binance";

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

        this.downloadInProgress = true;

        // if (initialCall) {
        //     Database.createTableFromParams();
        // }

        const limit = this.calculateAmount(params);

        const marketData = await this.binance.market.candleStickData({
            symbol: params.symbol,
            interval: params.resolution,
            startTime: params.from,
            endTime: params.to,
            limit: 1000
        });

        // TODO: Save to database...
        console.log(marketData.length);

        if (limit > 1000) {
            // TODO: Avoid ratelimit
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

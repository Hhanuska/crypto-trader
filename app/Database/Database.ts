import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { InputParsed } from '../../pages/api/marketData';
import { Candlestick } from '../binance/data/candlestick';

sqlite3.verbose();

export default class Database {

    public static instance: sqlite3.Database;

    private static ready: boolean = false;

    public static isReady(): boolean {
        return Database.ready;
    }

    public static async initialize(): Promise<void> {
        if (Database.ready) {
            return;
        }

        Database.instance = new sqlite3.Database('files/db');
        Database.instance.on('open', Database.onOpen);
        Database.instance.on('close', Database.onClose);
    }

    private static onOpen() {
        Database.ready = true;
    }

    private static onClose() {
        Database.ready = false;
    }

    public static tableNameFromParams(params: InputParsed): string {
        return `${params.symbol}_${params.resolution}_${params.from}_${params.to}`;
    }

    public static async createTableForCandles(tableName: string): Promise<void> {
        // TODO: Check if table already exists
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
            id TEXT UNIQUE PRIMARY KEY NOT NULL,
            openTime INTEGER UNIQUE NOT NULL,
            closeTime INTEGER UNIQUE NOT NULL,
            open INTEGER NOT NULL,
            close INTEGER NOT NULL,
            high INTEGER NOT NULL,
            low INTEGER NOT NULL,
            volume INTEGER NOT NULL,
            quoteAV INTEGER NOT NULL,
            trades INTEGER NOT NULL,
            buyBaseAV INTEGER NOT NULL,
            buyQuoteAV INTEGER NOT NULL
        );`

        return new Promise((resolve, reject) => {
            Database.instance.run(sql, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        })
    }

    private static generateCandleId(params: InputParsed, candle: Candlestick): string {
        return `${params.symbol}_${params.resolution}_${candle.time.open}`
    }

    public static async addCandleToTable(tableName: string, candle: Candlestick, params: InputParsed): Promise<void> {
        const statement = Database.instance.prepare(
            `INSERT INTO ${tableName}
            (id, openTime, closeTime, open, close, high, low, volume, quoteAV, trades, buyBaseAV, buyQuoteAV)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        statement.run(
            Database.generateCandleId(params, candle),
            candle.time.open,
            candle.time.close,
            candle.open,
            candle.close,
            candle.high,
            candle.low,
            candle.volume,
            candle.quoteAV,
            candle.trades,
            candle.buyBaseAV,
            candle.buyQuoteAV
        );
        statement.finalize();
    }

    public static async dropTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            Database.instance.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            })
        });
    }
}

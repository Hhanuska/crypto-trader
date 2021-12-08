import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { InputParsed } from '../../pages/api/download/marketData';
import { Candlestick } from '../binance/data/candlestick';

sqlite3.verbose();

export default class Database {

    public static instance: Database = new Database();

    private ready: boolean = false;

    private db: sqlite3.Database;

    private constructor() {
        this.db = new sqlite3.Database('files/db');

        this.db.on('open', this.onOpen.bind(this));
        this.db.on('close', this.onClose.bind(this));
    }

    public isReady(): boolean {
        return this.ready;
    }

    private onOpen() {
        this.ready = true;
    }

    private onClose() {
        this.ready = false;
    }

    public static tableNameFromParams(params: InputParsed): string {
        return `${params.symbol}_${params.resolution}_${params.from}_${params.to}`;
    }

    public async createTableForCandles(tableName: string): Promise<void> {
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
            this.db.run(sql, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        })
    }

    private static generateCandleId(params: InputParsed, candle: Candlestick): string {
        return `${params.symbol}_${params.resolution}_${candle.openTime}`
    }

    public async addCandleToTable(tableName: string, candle: Candlestick, params: InputParsed): Promise<void> {
        const statement = this.db.prepare(
            `INSERT INTO ${tableName}
            (id, openTime, closeTime, open, close, high, low, volume, quoteAV, trades, buyBaseAV, buyQuoteAV)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        statement.run(
            Database.generateCandleId(params, candle),
            candle.openTime,
            candle.closeTime,
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

    public async dropTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    public async getTables(): Promise<Array<any>> {
        const sql = `
            SELECT name FROM sqlite_schema
            WHERE type = 'table' AND name not LIKE 'sqlite_%';
        `;
        
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(rows);
            });
        });
    }

    public async getCandles(tableName: string): Promise<Array<any>> {
        const statement =
            `SELECT * FROM ${tableName}`;

        return new Promise((resolve, reject) => {
            this.db.all(statement, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }
}

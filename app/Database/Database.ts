import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { InputParsed } from '../../pages/api/marketData';

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

    public static async createTableFromParams(params: InputParsed) {
        const tableName = `${params.symbol}_${params.resolution}_${params.from}_${params.to}`;
        // TODO: Check if table already exists
        // TODO: Write sql
        const sql = ``
    }
}

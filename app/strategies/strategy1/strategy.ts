import { EmbedHTMLAttributes } from "react";
import { Candlestick } from "../../binance/data/candlestick";
import { OnCandleResult } from "../_helpers/_strategyTemplate";
import { Options } from "./meta";

let options: Options = {
    emaShort: 12,
    emaLong: 50
};

interface Storage {
    emaShort: Ema;
    emaLong: Ema;
}

interface Ema {
    values: number[];
    sum: number;
    length: number;
    current: number;
    last: number;
}

const storage: Storage = {
    emaShort: {
        values: [],
        sum: 0,
        length: 0,
        current: 0,
        last: 0
    },
    emaLong: {
        values: [],
        sum: 0,
        length: 0,
        current: 0,
        last: 0
    }
}

export function init(opts: Options) {
    options = { ...options, ...opts };
    console.log(options);

    storage.emaShort.length = options.emaShort;
    storage.emaLong.length = options.emaLong;
}

export default function onCandle(candle: Candlestick): OnCandleResult {
    progressEma('emaShort', candle.close);
    progressEma('emaLong', candle.close);

    if (!isEmaReady('emaLong')) {
        return null;
    }

    if (storage.emaShort.last <= storage.emaLong.last && storage.emaShort.current > storage.emaLong.current) {
        return 'long';
    }

    if (storage.emaShort.last >= storage.emaLong.last && storage.emaShort.current < storage.emaLong.current) {
        return 'short';
    }

    return null;
}

type EmaName = 'emaShort' | 'emaLong';

function progressEma(ema: EmaName, value: number) {
    storage[ema].sum += value;
    storage[ema].values.push(value);

    if (emaSubtract(ema)) {
        storage[ema].last = storage[ema].current;
        storage[ema].sum -= storage[ema].values.shift() as number;
        storage[ema].current = storage[ema].sum / storage[ema].length;
    }
}

function emaSubtract(ema: EmaName) {
    return storage[ema].values.length > storage[ema].length;
}

function isEmaReady(ema: EmaName) {
    return storage[ema].values.length === storage[ema].length;
}

import type { NextApiRequest, NextApiResponse } from 'next';
import Downloader from '../../../app/database/Downloader';

export interface Response {
    success: boolean;
}

interface ErrorResponse {
    success: boolean;
    reason: string;
}

interface Input {
    symbol: string;
    from: string;
    to: string;
    resolution: string;
}
export interface InputParsed {
    symbol: string;
    from: number;
    to: number;
    resolution: string;
}

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method !== 'POST') {
        const errorCode = 405;
        const res = {
            success: false,
            reason: 'Invalid method'
        };

        return response.status(errorCode).setHeader('Allow', 'POST').json(res);
    }

    const params = parseInput(JSON.parse(request.body) as Input);

    const isBinanceUp = await (Downloader.instance.binance.market.testConnectivity());
    const ready = isBinanceUp && !Downloader.instance.getProgress().inProgress;

    console.log('Got request', params);
    await Downloader.instance.downloadData(params);

    response.status(ready ? 200 : 500).json({ success: ready });
}

function parseInput(input: Input): InputParsed {
    return {
        symbol: input.symbol,
        from: new Date(input.from).valueOf(),
        to: new Date(input.to).valueOf(),
        resolution: input.resolution
    }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import Database from '../../app/database/Database';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const candles = await Database.instance.getCandles(request.query.table as string);
    response.status(200).json({
        success: true,
        candles: candles
    });
}

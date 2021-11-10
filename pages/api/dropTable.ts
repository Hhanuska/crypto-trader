import type { NextApiRequest, NextApiResponse } from 'next';
import Database from '../../app/database/Database';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method !== 'POST') {
        const errorCode = 405;
        const res = {
            success: false,
            errorCode: errorCode,
            reason: 'Invalid method'
        };

        return response.status(errorCode).setHeader('Allow', 'POST').json(res);
    }

    const params = JSON.parse(request.body);

    if (!params.table) {
        return;
    }

    try {
        Database.instance.dropTable(params.table);
        response.status(200).json({ success: true });
    } catch (err) {
        response.status(500).json({
            success: false,
            reason: err
        })
    }
}

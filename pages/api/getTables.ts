import type { NextApiRequest, NextApiResponse } from 'next';
import Database from '../../app/database/Database';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const tables = await Database.instance.getTables();
    response.status(200).json({
        success: true,
        tables: tables.map((e) => e.name)
    });
}

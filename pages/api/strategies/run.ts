import type { NextApiRequest, NextApiResponse } from 'next';
import runStrategy from '../../../app/strategies/_runStrategy';
import { Strategy } from '../../../app/strategies/_strategyTemplate';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const strategy = JSON.parse(request.body) as Strategy;

    runStrategy(strategy)

    response.status(200).json({ success: true });
}

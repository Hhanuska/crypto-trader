import type { NextApiRequest, NextApiResponse } from 'next';
import runStrategy from '../../../app/strategies/_helpers/_runStrategy';
import { RunStrategy } from '../../../app/strategies/_helpers/_strategyTemplate';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const strategy = JSON.parse(request.body) as RunStrategy;

    runStrategy(strategy)

    response.status(200).json({ success: true });
}

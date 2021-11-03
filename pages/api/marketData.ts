import type { NextApiRequest, NextApiResponse } from 'next';

interface Response {
    success: boolean;
}

interface ErrorResponse {
    success: boolean;
    errorCode: number;
    reason: string;
}

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse<Response | ErrorResponse>
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

    const res = {
        success: true
    }

    console.log('Got request', JSON.parse(request.body));
    response.status(200).json(res);
}

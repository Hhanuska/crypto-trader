import type { NextApiRequest, NextApiResponse } from 'next';
import Downloader from '../../../app/database/Downloader';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    response.status(200).json({
        success: true,
        ...Downloader.instance.getProgress()
    });
}
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const rawResponses = await redis.lrange('smartbus-responses', 0, -1);
        const responses = rawResponses.map(r => {
            try {
                return typeof r === 'string' ? JSON.parse(r) : r;
            } catch (e) {
                return r;
            }
        });
        return response.status(200).json(responses);
    } catch (error) {
        console.error('Get error:', error);
        return response.status(500).json({ error: 'Failed to retrieve data' });
    }
}

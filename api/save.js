import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = request.body;
        await redis.lpush('smartbus-responses', JSON.stringify(data));
        return response.status(200).json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return response.status(500).json({ error: 'Failed to save data' });
    }
}

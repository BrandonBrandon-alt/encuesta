import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Retrieve all responses from the Redis list 'smartbus-responses'
        // LRANGE key start stop (0 -1 gets the whole list)
        const rawResponses = await kv.lrange('smartbus-responses', 0, -1);

        // Parse the JSON strings back into objects
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

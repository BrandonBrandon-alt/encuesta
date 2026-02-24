import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = request.body;

        // Push the response data into a Redis list named 'smartbus-responses'
        // We use lpush to have the latest responses at the beginning
        await kv.lpush('smartbus-responses', JSON.stringify(data));

        return response.status(200).json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return response.status(500).json({ error: 'Failed to save data' });
    }
}

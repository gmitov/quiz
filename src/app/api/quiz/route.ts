import { NextResponse } from 'next/server';

// Server-side API route to proxy the request to the external API
export async function GET() {
    try {
        // Fetch data from the external API
        const response = await fetch('https://manual-case-study.herokuapp.com/questionnaires/972423.json', {
            cache: 'no-store', // Ensure we don't cache the response
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Return the data to the client
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying API request:', error);
        return NextResponse.json({ error: 'Failed to fetch quiz data' }, { status: 500 });
    }
}

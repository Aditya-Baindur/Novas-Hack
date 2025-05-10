export const runtime = 'edge'; // optional: if you're using Next.js Edge runtime

interface UnsplashResponse {
    urls?: {
        regular?: string;
        small?: string;
    };
}

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const query: string = searchParams.get('query') || 'random';
    
    const UNSPLASH_ACCESS_KEY: string | undefined = process.env.UNSPLASH_ACCESS_KEY; 

    const unsplashUrl: string = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
        const res: Response = await fetch(unsplashUrl);
        if (!res.ok) {
            console.error('Unsplash API error:', res.statusText);
            return new Response(JSON.stringify({ error: 'Failed to fetch image' }), { status: 500 });
        }

        const data: UnsplashResponse = await res.json();

        return new Response(
            JSON.stringify({
                imageUrl: data.urls?.regular || data.urls?.small || '',
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Unsplash fetch failed:', error);
        return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
    }
}

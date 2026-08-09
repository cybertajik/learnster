import { NextRequest, NextResponse } from 'next/server';
import { selectBestPexelsImage, formatPexelsImage, PexelsSearchResponse } from '@/lib/pexels';
import { ImageMetadata } from '@/types/vocabulary';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    // Graceful fallback when PEXELS_API_KEY is not set in environment
    const fallbackImage: ImageMetadata = {
      enabled: true,
      source: 'pexels',
      url: `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600`,
      photographer: 'Pexels Community',
      photographerUrl: 'https://www.pexels.com',
      pexelsUrl: 'https://www.pexels.com',
    };

    return NextResponse.json({
      success: true,
      warning: 'PEXELS_API_KEY environment variable is not configured. Serving fallback image.',
      image: fallbackImage,
    });
  }

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 86400 }, // Cache Pexels API calls for 24h
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Pexels API Error:', res.status, errorText);
      return NextResponse.json(
        { error: `Pexels API responded with status ${res.status}` },
        { status: res.status }
      );
    }

    const data: PexelsSearchResponse = await res.json();
    const bestPhoto = selectBestPexelsImage(data.photos);

    if (!bestPhoto) {
      return NextResponse.json({
        success: false,
        message: 'No suitable images found for query',
        image: {
          enabled: false,
          source: null,
          url: null,
          photographer: null,
          photographerUrl: null,
          pexelsUrl: null,
        },
      });
    }

    const imageMetadata = formatPexelsImage(bestPhoto);

    return NextResponse.json({
      success: true,
      image: imageMetadata,
    });
  } catch (error: unknown) {
    console.error('Error fetching image from Pexels:', error);
    return NextResponse.json(
      { error: 'Internal server error while querying image service' },
      { status: 500 }
    );
  }
}

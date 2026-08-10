import { NextResponse } from 'next/server';

const MAX_TEXT_LENGTH = 200; // Maximum characters for TTS input (HIGH-2 fix)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    // HIGH-2 fix: Enforce input length limit to prevent abuse
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Sanitize: only allow letters, numbers, spaces, and basic punctuation
    const sanitized = text.trim().replace(/[^\p{L}\p{N}\s.,!?¿¡'-]/gu, '');
    if (!sanitized) {
      return NextResponse.json({ error: 'Text contains no valid characters' }, { status: 400 });
    }

    // Google TTS Endpoint for Spanish pronunciation
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      sanitized
    )}&tl=es&client=tw-ob`;

    const response = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch audio from TTS provider' }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

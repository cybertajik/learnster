import { ImageMetadata } from '@/types/vocabulary';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

/**
 * Custom selection algorithm to pick the best image for vocabulary flashcards.
 * Evaluates aspect ratio, resolution, and relevance position.
 */
export function selectBestPexelsImage(photos: PexelsPhoto[]): PexelsPhoto | null {
  if (!photos || photos.length === 0) {
    return null;
  }

  // Target aspect ratio for cards is around 14:16 (0.875) or square 1:1 (1.0)
  const TARGET_ASPECT = 0.875;

  let bestPhoto: PexelsPhoto | null = null;
  let bestScore = -Infinity;

  photos.forEach((photo, index) => {
    if (!photo.width || !photo.height) return;

    const aspectRatio = photo.width / photo.height;

    // Reject extreme panoramas or ultra-tall slivers
    if (aspectRatio < 0.5 || aspectRatio > 2.2) {
      return;
    }

    // 1. Relevance Score (higher position in search results is better)
    const positionScore = (photos.length - index) * 10;

    // 2. Aspect ratio closeness to target (14/16 ~ 0.875)
    const aspectDiff = Math.abs(aspectRatio - TARGET_ASPECT);
    const aspectScore = Math.max(0, 50 - aspectDiff * 30);

    // 3. Resolution bonus (prefer images at least 600px wide)
    const resolutionScore = photo.width >= 600 && photo.height >= 600 ? 20 : 5;

    // 4. Alt text quality bonus
    const altScore = photo.alt && photo.alt.trim().length > 3 ? 10 : 0;

    const totalScore = positionScore + aspectScore + resolutionScore + altScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPhoto = photo;
    }
  });

  return bestPhoto || photos[0];
}

/**
 * Transform selected Pexels photo into standard ImageMetadata payload
 */
export function formatPexelsImage(photo: PexelsPhoto): ImageMetadata {
  return {
    enabled: true,
    source: 'pexels',
    url: photo.src.medium || photo.src.large || photo.src.original,
    photographer: photo.photographer || 'Pexels Photographer',
    photographerUrl: photo.photographer_url || 'https://www.pexels.com',
    pexelsUrl: photo.url || 'https://www.pexels.com',
  };
}

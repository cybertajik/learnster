'use client';

import React, { useState } from 'react';
import { ExternalLink, Camera, ImageOff } from 'lucide-react';
import { ImageMetadata } from '@/types/vocabulary';

interface ImageDisplayProps {
  image: ImageMetadata;
  wordSpanish: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, wordSpanish }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If image is explicitly disabled for this word (e.g. abstract conjunctions like "pero", "aunque")
  if (!image || !image.enabled || !image.url) {
    return null; // Remove image area entirely per specification
  }

  return (
    <div className="w-full flex flex-col items-center my-2 transition-all">
      {/* Responsive Aspect-Ratio Container (14/16 target ratio) */}
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-[14/16] rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-xl shadow-slate-950/40 group">
        {/* Loading Skeleton Indicator */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex flex-col items-center justify-center gap-2 text-slate-500">
            <Camera className="w-8 h-8 animate-bounce text-slate-600" />
            <span className="text-xs font-medium">Loading image...</span>
          </div>
        )}

        {/* Fallback error display if image URL fails */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-800 text-slate-400 p-4 text-center">
            <ImageOff className="w-8 h-8 text-rose-400/60" />
            <span className="text-sm font-semibold text-slate-300">"{wordSpanish}"</span>
            <span className="text-xs text-slate-500">Visual unavailable</span>
          </div>
        ) : (
          /* Actual Image Element */
          <img
            src={image.url}
            alt={wordSpanish}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } group-hover:scale-105`}
          />
        )}

        {/* Pexels Attribution Badge Overlay */}
        {image.source === 'pexels' && image.photographer && (
          <div className="absolute bottom-2 right-2 backdrop-blur-md bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-[10px] px-2.5 py-1 rounded-full border border-slate-700/80 flex items-center gap-1 transition-all opacity-85 group-hover:opacity-100">
            <Camera className="w-3 h-3 text-slate-400" />
            <span>Photo:</span>
            {image.photographerUrl ? (
              <a
                href={image.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-rose-300 hover:underline flex items-center gap-0.5"
              >
                {image.photographer}
              </a>
            ) : (
              <span className="font-medium text-slate-200">{image.photographer}</span>
            )}
            <span className="text-slate-500">on</span>
            {image.pexelsUrl ? (
              <a
                href={image.pexelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white flex items-center"
              >
                Pexels
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
            ) : (
              <span>Pexels</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

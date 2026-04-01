import { useState, useEffect } from "react";
import { Play, AlertCircle } from "lucide-react";

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export function VideoEmbed({ url, className = "" }: VideoEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return '';
  };

  // Function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string): string => {
    const regExp = /vimeo\.com\/(?:.*\/)?([0-9]+)/;
    const match = url.match(regExp);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
    return '';
  };

  // Function to determine video type and get embed URL
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // Check if it's already an embed URL
    if (url.includes('/embed/') || url.includes('player.vimeo.com')) {
      return url;
    }
    
    // Check for YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url);
    }
    
    // Check for Vimeo
    if (url.includes('vimeo.com')) {
      return getVimeoEmbedUrl(url);
    }
    
    // For direct video URLs (mp4, webm, etc.) or Supabase storage URLs
    if (url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i) || 
        url.includes('supabase.co/storage/') || 
        url.includes('ucgeffmwzzqgdzbykmql.supabase.co')) {
      return url;
    }
    
    return '';
  };

  const embedUrl = getEmbedUrl(url);
  const isDirectVideo = url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i) || 
    url.includes('supabase.co/storage/') || 
    url.includes('ucgeffmwzzqgdzbykmql.supabase.co');

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Auto-hide loading state for iframes after 3 seconds
  useEffect(() => {
    if (!isDirectVideo && embedUrl) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDirectVideo, embedUrl]);

  if (!embedUrl) {
    return (
      <div className={`bg-muted rounded-lg p-6 text-center ${className}`}>
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Unable to embed this video format. 
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline ml-1"
          >
            Click here to view
          </a>
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`bg-muted rounded-lg p-6 text-center ${className}`}>
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Failed to load video. 
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline ml-1"
          >
            Click here to view
          </a>
        </p>
      </div>
    );
  }

  if (isDirectVideo) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
              <span>Loading video...</span>
            </div>
          </div>
        )}
        <video 
          controls 
          className="w-full h-auto rounded-lg"
          onLoadedData={handleLoad}
          onError={handleError}
          preload="metadata"
        >
          <source src={embedUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center z-10">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Play className="h-8 w-8" />
            <span>Loading video...</span>
          </div>
        </div>
      )}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          title="Embedded video"
        />
      </div>
    </div>
  );
}
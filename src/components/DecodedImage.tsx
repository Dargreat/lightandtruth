import { useEffect, useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Shows a soft placeholder until the photo is fully downloaded and decoded,
// then fades it in whole — avoids the top-to-bottom "half picture" paint.
// Page text renders immediately; only the photo box waits.
export function DecodedImage({ src, className, wrapperClassName, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { wrapperClassName?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (!src) return;
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.decode().catch(() => {}).finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", !ready && "animate-pulse", wrapperClassName)}>
      {ready && (
        <img src={src} decoding="async" className={cn("animate-fade-in", className)} {...rest} />
      )}
    </div>
  );
}

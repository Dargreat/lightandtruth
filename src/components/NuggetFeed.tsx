import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/VideoEmbed";
import type { Tables } from "@/integrations/supabase/types";

type Nugget = Tables<"nuggets">;

/** Shows the newest nugget; older ones are reachable with the back arrow. */
export function NuggetFeed() {
  const [nuggets, setNuggets] = useState<Nugget[]>([]);
  const [index, setIndex] = useState(0);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    supabase
      .from("nuggets")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => setNuggets(data ?? []));
  }, []);

  useEffect(() => setImgReady(false), [index]);

  if (!nuggets.length) return null;
  const n = nuggets[index];
  const hasOlder = index < nuggets.length - 1;
  const hasNewer = index > 0;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">
              {hasNewer ? "Past Nugget" : "Today's Nugget"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled={!hasOlder} onClick={() => setIndex(index + 1)} aria-label="View past nugget">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={!hasNewer} onClick={() => setIndex(index - 1)} aria-label="View newer nugget">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <article className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          {n.image_url && (
            <div className="bg-muted">
              <img
                key={n.id}
                src={n.image_url}
                alt={n.title || "Nugget image"}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).finally(() => setImgReady(true));
                }}
                className={`w-full max-h-[480px] object-cover transition-opacity duration-300 ${imgReady ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          )}
          {n.video_url && <VideoEmbed url={n.video_url} />}
          <div className="p-6">
            <p className="text-xs text-muted-foreground mb-2">
              {new Date(n.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            {n.title && <h3 className="text-2xl font-bold mb-3">{n.title}</h3>}
            {n.content && <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{n.content}</p>}
          </div>
        </article>
        {hasOlder && !hasNewer && (
          <p className="text-xs text-muted-foreground mt-3 text-center">Tap ‹ to see past nuggets</p>
        )}
      </div>
    </section>
  );
}

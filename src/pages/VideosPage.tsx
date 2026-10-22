import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Video } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
}

export default function VideosPage() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("videos").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data as VideoItem[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Videos — Light and Truth</title>
        <meta name="description" content="Watch inspiring videos, worship content, and visual teachings from Light and Truth." />
        <link rel="canonical" href="https://lightandtruth.com.ng/videos" />
        <meta property="og:title" content="Videos — Light and Truth" />
        <meta property="og:description" content="Watch inspiring videos, worship content, and visual teachings from Light and Truth." />
        <meta property="og:url" content="https://lightandtruth.com.ng/videos" />
      </Helmet>
      <Navigation />

      <section className="bg-primary py-16">
        <div className="container text-center animate-slide-in-up">
          <Video className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-3">Videos</h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">Watch our collection of inspirational videos and teachings</p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm mt-4">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Videos</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-card">
                  <div className="bg-muted h-48" />
                  <div className="p-5 space-y-3">
                    <div className="bg-muted h-5 w-3/4 rounded" />
                    <div className="bg-muted h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, i) => (
                <AnimatedSection key={video.id} animation={i % 2 === 0 ? "slide-in-left" : "slide-in-right"} delay={((i % 3) + 1) * 100}>
                  <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border/50">
                    <CardContent className="p-0">
                      <div className="rounded-t-lg overflow-hidden">
                        <VideoEmbed url={video.video_url} />
                      </div>
                    </CardContent>
                    <CardHeader className="pt-4">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      {video.description && <CardDescription className="line-clamp-2">{video.description}</CardDescription>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(video.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </CardHeader>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground">There are no videos available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

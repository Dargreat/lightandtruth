import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  published: boolean;
  image_url?: string;
  video_url?: string;
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [commentRefresh, setCommentRefresh] = useState(0);

  useEffect(() => { if (slug) fetchPost(); }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single();
      if (error) { if (error.code === 'PGRST116') setNotFound(true); else throw error; }
      else setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setNotFound(true);
    } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-16">
          <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-80 bg-muted rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) return <Navigate to="/404" replace />;

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} — Light and Truth</title>
        <meta name="description" content={post.content.substring(0, 155).replace(/\n/g, ' ') + '...'} />
        <link rel="canonical" href={`https://lightandtruth.com.ng/post/${post.slug}`} />
        <meta property="og:title" content={`${post.title} — Light and Truth`} />
        <meta property="og:description" content={post.content.substring(0, 155).replace(/\n/g, ' ') + '...'} />
        <meta property="og:url" content={`https://lightandtruth.com.ng/post/${post.slug}`} />
        <meta property="og:type" content="article" />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} — Light and Truth`} />
        <meta name="twitter:description" content={post.content.substring(0, 155).replace(/\n/g, ' ') + '...'} />
      </Helmet>
      <Navigation />

      <article className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" asChild className="mb-8 text-muted-foreground hover:text-foreground">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
            </Button>

            {/* Post header */}
            <header className="mb-8 animate-fade-up">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight tracking-tight">{post.title}</h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formattedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Light and Truth Team
                  </div>
                </div>
                <ShareButton title={post.title} slug={post.slug} variant="button" />
              </div>
            </header>

            {/* Featured Image */}
            {post.image_url && (
              <div className="mb-10 animate-fade-up animation-delay-100">
                <img src={post.image_url} alt={post.title} className="w-full h-auto rounded-2xl shadow-lg" />
              </div>
            )}

            {/* Video Embed */}
            {post.video_url && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-lg animate-fade-up animation-delay-100">
                <VideoEmbed url={post.video_url} />
              </div>
            )}

            {/* Post content */}
            <div className="prose-article animate-fade-up animation-delay-200">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-12" />

            {/* Comments section */}
            <div className="space-y-8 animate-fade-up animation-delay-300">
              <h3 className="text-2xl font-bold">Comments</h3>
              <CommentList postId={post.id} refreshTrigger={commentRefresh} />
              <CommentForm postId={post.id} onCommentAdded={() => setCommentRefresh(prev => prev + 1)} />
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

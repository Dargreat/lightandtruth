import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  image_url?: string;
  categories?: { name: string; slug: string };
}

export default function AllBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`id, title, excerpt, slug, created_at, image_url, categories:category_id ( name, slug )`)
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>All Blog Posts — Light and Truth</title>
        <meta name="description" content="Browse all articles, sermons, and messages from Light and Truth. Scripture teachings and faith-building content for believers." />
        <link rel="canonical" href="https://lightandtruth.com.ng/blogs" />
        <meta property="og:title" content="All Blog Posts — Light and Truth" />
        <meta property="og:description" content="Browse all articles, sermons, and messages from Light and Truth." />
        <meta property="og:url" content="https://lightandtruth.com.ng/blogs" />
      </Helmet>
      <Navigation />

      <section className="bg-primary py-16">
        <div className="container text-center animate-slide-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-3">All Blog Posts</h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">Explore all our inspiring content</p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm mt-4">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-card">
                  <div className="bg-muted h-52" />
                  <div className="p-5 space-y-3">
                    <div className="bg-muted h-5 w-3/4 rounded" />
                    <div className="bg-muted h-4 w-full rounded" />
                    <div className="bg-muted h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} animation={i % 2 === 0 ? "slide-in-left" : "slide-in-right"} delay={((i % 3) + 1) * 100}>
                  <PostCard
                    id={post.id} title={post.title} excerpt={post.excerpt || ""} slug={post.slug}
                    createdAt={post.created_at} imageUrl={post.image_url} categoryName={post.categories?.name}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">New content is coming soon. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

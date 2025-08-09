import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Target, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  image_url?: string;
  categories?: {
    name: string;
    slug: string;
  };
}

interface BibleVerse {
  id: string;
  verse_text: string;
  verse_reference: string;
  date: string;
  active: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [todaysVerse, setTodaysVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchTodaysVerse();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, 
          title, 
          excerpt, 
          slug, 
          created_at, 
          image_url,
          categories:category_id (
            name,
            slug
          )
        `)
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

  const fetchTodaysVerse = async () => {
    try {
      // Get the most recent active verse instead of filtering by today's date
      const { data, error } = await supabase
        .from("bible_verses")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setTodaysVerse(data || null);
    } catch (error) {
      console.error("Error fetching today's verse:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Light and Truth
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Seeing in light, established in truth
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="px-8" onClick={() => {
                document.getElementById('latest-posts')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Heart className="mr-2 h-5 w-5" />
                Explore Posts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bible Verse of the Day Section */}
      {todaysVerse && (
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Verse of the Day</h2>
              <div className="bg-background p-8 rounded-lg shadow-lg border">
                <blockquote className="text-xl md:text-2xl font-medium italic mb-4 text-muted-foreground">
                  &ldquo;{todaysVerse.verse_text}&rdquo;
                </blockquote>
                <cite className="text-lg font-semibold text-primary">
                  — {todaysVerse.verse_reference}
                </cite>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts Section */}
      <section id="latest-posts" className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Posts</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover inspiring content that strengthens faith and encourages spiritual growth
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 5).map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt || ""}
                    slug={post.slug}
                    createdAt={post.created_at}
                    imageUrl={post.image_url}
                    categoryName={post.categories?.name}
                  />
                ))}
              </div>
              {posts.length > 5 && (
                <div className="text-center mt-12">
                  <Link to="/blogs">
                    <Button variant="outline" size="lg" className="px-8">
                      See All Blogs
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                New content is coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl font-bold text-foreground">About Light and Truth</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Welcome to Light and Truth, a digital sanctuary where faith meets life. We are dedicated to 
              sharing the transformative power of God's word through inspiring stories, profound biblical insights, 
              and practical wisdom that illuminates your spiritual journey.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              In a world filled with uncertainty, we believe that God's truth remains constant and His love 
              unchanging. Our community exists to encourage believers, strengthen faith, and provide hope 
              through the timeless wisdom found in Scripture. Every article, devotion, and resource is 
              crafted with prayer and intention to help you grow deeper in your relationship with Christ.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Whether you're a new believer taking your first steps of faith, or a seasoned follower 
              seeking fresh perspective and encouragement, Light and Truth is here to walk alongside 
              you. Our heart is to see lives transformed by the Gospel and communities strengthened 
              through authentic biblical fellowship.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Target className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                To bring truth without fear
              </p>
              <p className="text-muted-foreground">
                To bring truth with hope
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Eye className="h-10 w-10 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground">
                A wholesome Biblical living
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 mt-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Light and Truth</span>
              </div>
              <p className="text-muted-foreground">
                Sharing God's love and wisdom through thoughtful writing and biblical insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-foreground transition-colors" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}>About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-muted-foreground">
                Join our community and stay updated with the latest posts and inspiration.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Light and Truth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
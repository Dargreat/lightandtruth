import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Target, Eye, ArrowRight, Sparkles, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-blog.jpg";
import bibleReadingImg from "@/assets/bible-reading.jpg";
import communityImg from "@/assets/community-prayer.jpg";
import devotionalImg from "@/assets/devotional-hands.jpg";
import sunriseCrossImg from "@/assets/sunrise-cross.jpg";
import scriptureBibleImg from "@/assets/scripture-bible.jpg";
import jesusChildrenImg from "@/assets/jesus-children.jpg";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  image_url?: string;
  categories?: { name: string; slug: string };
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

  const fetchTodaysVerse = async () => {
    try {
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

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section — always visible, no scroll trigger needed */}
      <section className="relative h-[520px] md:h-[600px] overflow-hidden">
        <img src={heroImage} alt="Open Bible with soft light" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto">
              <BookOpen className="h-12 w-12 text-primary-foreground mx-auto mb-6 animate-slide-in-up" />
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-primary-foreground animate-slide-in-up animation-delay-100 tracking-tight leading-tight">
                Light and Truth
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-slide-in-up animation-delay-200 font-light max-w-xl mx-auto">
                Seeing in light, established in truth
              </p>
              <div className="animate-slide-in-up animation-delay-300 flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="px-8 text-base font-semibold" onClick={() => document.getElementById("latest-posts")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore Posts <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 text-base font-semibold bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/devotional">Daily Devotional</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bible Verse of the Day */}
      {todaysVerse && (
        <section className="py-16 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <AnimatedSection animation="slide-in-left">
                <Sparkles className="h-6 w-6 text-primary mb-4" />
                <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-6 block">
                  Verse of the Day
                </span>
                <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-foreground mb-6">
                  &ldquo;{todaysVerse.verse_text}&rdquo;
                </blockquote>
                <cite className="text-base font-semibold text-primary not-italic">
                  — {todaysVerse.verse_reference}
                </cite>
              </AnimatedSection>
              <AnimatedSection animation="slide-in-right" delay={200}>
                <img src={bibleReadingImg} alt="Open Bible in warm light" className="rounded-2xl shadow-lg w-full h-64 lg:h-80 object-cover" loading="lazy" width={1280} height={720} />
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container">
            <AnimatedSection animation="slide-in-up">
              <Link to={`/post/${featuredPost.slug}`} className="block group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl transition-shadow duration-300">
                  <div className="h-64 lg:h-auto overflow-hidden">
                    <img
                      src={featuredPost.image_url || sunriseCrossImg}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Featured</span>
                    {featuredPost.categories?.name && (
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{featuredPost.categories.name}</span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">{featuredPost.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                    <span className="text-primary font-semibold inline-flex items-center gap-2">
                      Read Article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section id="latest-posts" className="py-16 bg-secondary/50">
        <div className="container">
          <AnimatedSection animation="slide-in-up" className="text-center mb-12">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Latest</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Recent Posts</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              Discover inspiring content that strengthens faith and encourages spiritual growth
            </p>
          </AnimatedSection>

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
          ) : recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post, i) => (
                  <AnimatedSection key={post.id} animation={i % 2 === 0 ? "slide-in-left" : "slide-in-right"} delay={((i % 3) + 1) * 100}>
                    <PostCard
                      id={post.id} title={post.title} excerpt={post.excerpt || ""} slug={post.slug}
                      createdAt={post.created_at} imageUrl={post.image_url} categoryName={post.categories?.name}
                    />
                  </AnimatedSection>
                ))}
              </div>
              {posts.length > 7 && (
                <AnimatedSection animation="slide-in-up" delay={400} className="text-center mt-12">
                  <Link to="/blogs">
                    <Button variant="outline" size="lg" className="px-10 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      See All Posts <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </AnimatedSection>
              )}
            </>
          ) : !featuredPost ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">New content is coming soon. Check back later!</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Devotional CTA with Image */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg border border-border/50 max-w-6xl mx-auto">
            <AnimatedSection animation="slide-in-left">
              <img src={devotionalImg} alt="Hands holding Bible during devotional" className="w-full h-64 lg:h-full object-cover" loading="lazy" width={1280} height={720} />
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" className="p-8 lg:p-12 flex flex-col justify-center bg-card">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Daily Devotional</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Start Your Day with God's Word</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Begin each morning with spiritual reflections, prayers, and Scripture that will
                strengthen your faith and guide your steps throughout the day.
              </p>
              <Link to="/devotional">
                <Button className="px-8 text-base font-semibold">
                  Read Today's Devotional <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Videos CTA */}
      <section className="relative py-20 overflow-hidden">
        <img src={scriptureBibleImg} alt="Open Bible with Psalm 119:105 scripture" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-primary/70" />
        <AnimatedSection animation="slide-in-up" className="relative z-10 container text-center">
          <Play className="h-12 w-12 text-primary-foreground mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight mb-4">Watch Inspiring Videos</h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Explore our collection of faith-building videos, worship songs, and visual teachings.
          </p>
          <Link to="/videos">
            <Button size="lg" variant="outline" className="px-8 text-base font-semibold bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Browse Videos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AnimatedSection>
      </section>

      {/* Kids Section CTA */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg border border-border/50 max-w-6xl mx-auto">
            <AnimatedSection animation="slide-in-left">
              <img src={jesusChildrenImg} alt="Jesus talking to happy children in a garden" className="w-full h-64 lg:h-full object-cover" loading="lazy" width={1280} height={720} />
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" className="p-8 lg:p-12 flex flex-col justify-center bg-card">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Kids Corner</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Faith for Little Ones</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fun Bible stories, exciting lessons, and creative activities designed to help children
                grow in their love for God and understanding of His word.
              </p>
              <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary pl-4 mb-6">
                "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these." — Matthew 19:14
              </blockquote>
              <Link to="/kids">
                <Button className="px-8 text-base font-semibold">
                  Explore Kids Corner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <AnimatedSection animation="slide-in-left">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Who We Are</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">About Light and Truth</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Welcome to Light and Truth, a digital sanctuary where faith meets life. We are dedicated to
                sharing the transformative power of God's word through inspiring stories, profound biblical insights,
                and practical wisdom.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're a new believer taking your first steps of faith, or a seasoned follower
                seeking fresh perspective, Light and Truth is here to walk alongside you.
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right">
              <img src={communityImg} alt="Church community gathering in prayer" className="rounded-2xl shadow-lg w-full h-72 lg:h-96 object-cover mb-8" loading="lazy" width={1280} height={720} />
              <div className="grid grid-cols-2 gap-6">
                <AnimatedSection animation="slide-in-left" delay={200} className="bg-secondary p-6 rounded-2xl text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-sm mb-1">Our Mission</h3>
                  <p className="text-muted-foreground text-xs">To bring truth without fear, to bring truth with hope</p>
                </AnimatedSection>
                <AnimatedSection animation="slide-in-right" delay={200} className="bg-secondary p-6 rounded-2xl text-center">
                  <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-sm mb-1">Our Vision</h3>
                  <p className="text-muted-foreground text-xs">A wholesome Biblical living</p>
                </AnimatedSection>
                <AnimatedSection animation="slide-in-left" delay={300} className="bg-secondary p-6 rounded-2xl text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-sm mb-1">Community</h3>
                  <p className="text-muted-foreground text-xs">Building connections through faith</p>
                </AnimatedSection>
                <AnimatedSection animation="slide-in-right" delay={300} className="bg-secondary p-6 rounded-2xl text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-sm mb-1">Content</h3>
                  <p className="text-muted-foreground text-xs">Bible-based articles, sermons, and devotionals</p>
                </AnimatedSection>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

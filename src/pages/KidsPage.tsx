import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PostCard } from "@/components/PostCard";
import { Link } from "react-router-dom";
import { Baby, BookOpen, Heart, Star } from "lucide-react";
import jesusChildrenImg from "@/assets/jesus-children.jpg";
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

export default function KidsPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["kids-posts"],
    queryFn: async () => {
      // Fetch posts that belong to the "kids" category
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "kids")
        .maybeSingle();

      if (!category) return [];

      const { data, error } = await supabase
        .from("posts")
        .select(`id, title, excerpt, slug, created_at, image_url, categories:category_id ( name, slug )`)
        .eq("published", true)
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Kids Corner — Light and Truth</title>
        <meta name="description" content="Fun Bible stories, lessons, and activities for children from Light and Truth. Helping kids grow in faith and love for God." />
        <link rel="canonical" href="https://lightandtruth.com.ng/kids" />
        <meta property="og:title" content="Kids Corner — Light and Truth" />
        <meta property="og:description" content="Fun Bible stories, lessons, and activities for children from Light and Truth." />
        <meta property="og:url" content="https://lightandtruth.com.ng/kids" />
      </Helmet>
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden">
        <img src={jesusChildrenImg} alt="Jesus talking to children" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container text-center">
            <AnimatedSection animation="slide-in-up">
              <Baby className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-3">
                Kids Corner
              </h1>
              <p className="text-primary-foreground/90 text-lg max-w-xl mx-auto">
                Fun Bible stories, lessons, and activities for young believers
              </p>
              <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm mt-4">
                <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
                <span>/</span>
                <span>Kids</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <AnimatedSection animation="slide-in-up" className="text-center mb-12">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">For Little Ones</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Learn About God's Love</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              "Let the little children come to me" — Matthew 19:14
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <AnimatedSection animation="slide-in-left" delay={100}>
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
                <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Bible Stories</h3>
                <p className="text-muted-foreground text-sm">Exciting stories from the Bible told in fun, easy-to-understand ways</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-up" delay={200}>
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Life Lessons</h3>
                <p className="text-muted-foreground text-sm">Practical lessons to help children grow in faith and character</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" delay={300}>
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
                <Star className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Fun Activities</h3>
                <p className="text-muted-foreground text-sm">Engaging activities, memory verses, and creative content for kids</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Kids Posts */}
      <section className="py-16">
        <div className="container">
          <AnimatedSection animation="slide-in-up" className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Kids Articles</h2>
          </AnimatedSection>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-card">
                  <div className="bg-muted h-52" />
                  <div className="p-5 space-y-3">
                    <div className="bg-muted h-5 w-3/4 rounded" />
                    <div className="bg-muted h-4 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
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
              <Baby className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No kids articles yet</h3>
              <p className="text-muted-foreground">Fun Bible stories and activities for kids are coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Scripture Image */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <AnimatedSection animation="slide-in-left">
              <img src={jesusChildrenImg} alt="Jesus with children" className="rounded-2xl shadow-lg w-full h-72 lg:h-96 object-cover" loading="lazy" width={1280} height={720} />
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" delay={200}>
              <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-foreground mb-6">
                &ldquo;Train up a child in the way he should go: and when he is old, he will not depart from it.&rdquo;
              </blockquote>
              <cite className="text-base font-semibold text-primary not-italic">— Proverbs 22:6</cite>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

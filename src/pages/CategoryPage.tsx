import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PostCard } from "@/components/PostCard";
import { BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image_url: string;
  video_url: string;
  created_at: string;
  categories: { name: string; slug: string };
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", category],
    queryFn: async () => {
      const { data: categoryData, error: categoryError } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (categoryError) throw categoryError;
      if (!categoryData) return [];
      const { data, error } = await supabase
        .from("posts")
        .select(`id, title, excerpt, slug, image_url, video_url, created_at, categories:category_id ( name, slug )`)
        .eq("published", true)
        .eq("category_id", categoryData.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
    enabled: !!category,
  });

  const { data: categoryInfo } = useQuery({
    queryKey: ["category", category],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("name, slug, parent_category").eq("slug", category).single();
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  if (!category) return <div>Category not found</div>;

  const categoryName = categoryInfo?.name || category;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{categoryName} — Light and Truth</title>
        <meta name="description" content={`Explore ${categoryName.toLowerCase()} content on Light and Truth. Faith-building articles, teachings, and resources.`} />
        <link rel="canonical" href={`https://lightandtruth.com.ng/category/${category}`} />
        <meta property="og:title" content={`${categoryName} — Light and Truth`} />
        <meta property="og:description" content={`Explore ${categoryName.toLowerCase()} content on Light and Truth.`} />
        <meta property="og:url" content={`https://lightandtruth.com.ng/category/${category}`} />
      </Helmet>
      <Navigation />

      <section className="bg-primary py-16">
        <div className="container text-center animate-slide-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-3 capitalize">{categoryName}</h1>
          <p className="text-primary-foreground/80 text-lg">Explore our {categoryName.toLowerCase()} content</p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm mt-4">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="capitalize">{categoryName}</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground">There are no posts in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

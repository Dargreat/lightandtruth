import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image_url: string;
  video_url: string;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", category],
    queryFn: async () => {
      // First get the category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (categoryError) throw categoryError;
      if (!categoryData) return [];

      // Then get posts for that specific category
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          excerpt,
          slug,
          image_url,
          video_url,
          created_at,
          categories:category_id (
            name,
            slug
          )
        `)
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
      const { data, error } = await supabase
        .from("categories")
        .select("name, slug, parent_category")
        .eq("slug", category)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 capitalize">
            {categoryInfo?.name || category}
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our {categoryInfo?.name?.toLowerCase() || category} content
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt || ""}
                slug={post.slug}
                createdAt={post.created_at}
                imageUrl={post.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              There are no posts in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareButton } from "@/components/ShareButton";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  createdAt: string;
  imageUrl?: string;
  commentCount?: number;
  categoryName?: string;
}

export function PostCard({ id, title, excerpt, slug, createdAt, imageUrl, commentCount = 0, categoryName }: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="h-full group overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-card">
      {imageUrl && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {categoryName && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 shadow-sm">
                {categoryName}
              </Badge>
            </div>
          )}
        </div>
      )}
      <CardContent className="p-5">
        {categoryName && !imageUrl && (
          <Badge variant="secondary" className="text-xs mb-3">{categoryName}</Badge>
        )}
        <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          <Link to={`/post/${slug}`} className="block">{title}</Link>
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formattedDate}
          </div>
          {commentCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {commentCount}
            </div>
          )}
          <ShareButton title={title} slug={slug} />
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
          {excerpt}
        </p>
        <Link
          to={`/post/${slug}`}
          className="story-link text-primary font-semibold text-sm inline-flex items-center gap-1"
        >
          Read more →
        </Link>
      </CardContent>
    </Card>
  );
}

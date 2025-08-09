import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group overflow-hidden">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {categoryName && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {categoryName}
              </Badge>
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors">
          <Link to={`/post/${slug}`} className="block">
            {title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {commentCount} comments
          </div>
        </div>
        {categoryName && !imageUrl && (
          <div className="mb-2">
            <Badge variant="secondary">
              {categoryName}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {excerpt}
        </p>
        <div className="mt-4">
          <Link 
            to={`/post/${slug}`}
            className="text-primary hover:underline font-medium"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
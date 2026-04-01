import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MessageCircle, 
  Users,
  LogOut,
  MoreHorizontal,
  FileText,
  Video,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { VideoManager } from "@/components/VideoManager";
import { NewsletterManager } from "@/components/NewsletterManager";
import { DevotionalManager } from "@/components/DevotionalManager";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published: boolean;
  created_at: string;
  author_id: string;
  category_id?: string;
  categories?: {
    name: string;
    slug: string;
  };
}

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
}

interface BibleVerse {
  id: string;
  verse_text: string;
  verse_reference: string;
  date: string;
  active: boolean;
  created_at: string;
}

export default function AdminDashboard(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bibleVerses, setBibleVerses] = useState<BibleVerse[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newVerse, setNewVerse] = useState({ verse_text: '', verse_reference: '', date: '' });
  const [showVerseForm, setShowVerseForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async (): Promise<void> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || !session.user) {
      console.error("Authentication check failed:", error);
      navigate("/admin");
      return;
    }
    console.log("User authenticated:", session.user.id);
    setUser(session.user);
  };

  const fetchData = async (): Promise<void> => {
    try {
      // Fetch posts with categories
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;

      if (postsError) throw postsError;

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch bible verses
      const { data: versesData, error: versesError } = await supabase
        .from("bible_verses")
        .select("*")
        .order("date", { ascending: false });

      if (versesError) throw versesError;

      setPosts(postsData || []);
      setComments(commentsData || []);
      setBibleVerses(versesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/admin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== id));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const togglePostPublished = async (id: string, published: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ published: !published })
        .eq("id", id);

      if (error) throw error;

      setPosts(prev => 
        prev.map(post => 
          post.id === id ? { ...post, published: !published } : post
        )
      );
      toast({
        title: "Success",
        description: `Post ${!published ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const toggleCommentApproval = async (id: string, approved: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ approved: !approved })
        .eq("id", id);

      if (error) throw error;

      setComments(prev => 
        prev.map(comment => 
          comment.id === id ? { ...comment, approved: !approved } : comment
        )
      );
      toast({
        title: "Success",
        description: `Comment ${!approved ? 'approved' : 'unapproved'} successfully`,
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== id));
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const createBibleVerse = async (): Promise<void> => {
    if (!newVerse.verse_text || !newVerse.verse_reference || !newVerse.date) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bible_verses")
        .insert([newVerse])
        .select();

      if (error) throw error;

      setBibleVerses(prev => [data[0], ...prev]);
      setNewVerse({ verse_text: '', verse_reference: '', date: '' });
      setShowVerseForm(false);
      toast({
        title: "Success",
        description: "Bible verse added successfully",
      });
    } catch (error) {
      console.error("Error creating bible verse:", error);
      toast({
        title: "Error",
        description: "Failed to create bible verse",
        variant: "destructive",
      });
    }
  };

  const toggleVerseActive = async (id: string, active: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from("bible_verses")
        .update({ active })
        .eq("id", id);

      if (error) throw error;

      setBibleVerses(prev => 
        prev.map(verse => 
          verse.id === id ? { ...verse, active } : verse
        )
      );
      toast({
        title: "Success",
        description: `Bible verse ${active ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error("Error updating bible verse:", error);
      toast({
        title: "Error",
        description: "Failed to update bible verse",
        variant: "destructive",
      });
    }
  };

  const deleteBibleVerse = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("bible_verses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setBibleVerses(prev => prev.filter(verse => verse.id !== id));
      toast({
        title: "Success",
        description: "Bible verse deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting bible verse:", error);
      toast({
        title: "Error",
        description: "Failed to delete bible verse",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Light and Truth Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-gray-600">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{comments.length}</p>
                  <p className="text-gray-600">Total Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{comments.filter(c => c.approved).length}</p>
                  <p className="text-gray-600">Approved Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{bibleVerses.length}</p>
                  <p className="text-gray-600">Bible Verses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="posts">Posts & Comments</TabsTrigger>
            <TabsTrigger value="verses">Bible Verses</TabsTrigger>
            <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Posts Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Posts
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <Button asChild>
                      <Link to="/admin/posts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts
                      .filter(post => 
                        selectedCategory === 'all' || 
                        (post.categories && post.categories.slug === selectedCategory)
                      )
                      .slice(0, 10)
                      .map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium truncate">{post.title}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            {post.categories && (
                              <Badge variant="outline" className="text-xs">
                                {post.categories.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/posts/${post.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/post/${post.slug}`} target="_blank">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => togglePostPublished(post.id, post.published)}>
                                {post.published ? "Unpublish" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deletePost(post.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.slice(0, 10).map((comment) => (
                      <div key={comment.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{comment.author_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={comment.approved ? "default" : "secondary"}>
                            {comment.approved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3 line-clamp-2">{comment.content}</p>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleCommentApproval(comment.id, comment.approved)}
                          >
                            {comment.approved ? "Unapprove" : "Approve"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteComment(comment.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Daily Bible Verses
                </CardTitle>
                <Button onClick={() => setShowVerseForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Verse
                </Button>
              </CardHeader>
              <CardContent>
                {showVerseForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="verse_reference">Reference</Label>
                        <Input
                          id="verse_reference"
                          placeholder="John 3:16"
                          value={newVerse.verse_reference}
                          onChange={(e) => setNewVerse(prev => ({ ...prev, verse_reference: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newVerse.date}
                          onChange={(e) => setNewVerse(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="verse_text">Verse Text</Label>
                      <Textarea
                        id="verse_text"
                        placeholder="For God so loved the world..."
                        value={newVerse.verse_text}
                        onChange={(e) => setNewVerse(prev => ({ ...prev, verse_text: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={createBibleVerse}>Save Verse</Button>
                      <Button variant="outline" onClick={() => setShowVerseForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {bibleVerses.map((verse) => (
                    <div key={verse.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{verse.verse_reference}</span>
                            <span className="text-sm text-muted-foreground">{new Date(verse.date).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${verse.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {verse.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm italic">&ldquo;{verse.verse_text}&rdquo;</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant={verse.active ? "outline" : "default"}
                            onClick={() => toggleVerseActive(verse.id, !verse.active)}
                          >
                            {verse.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBibleVerse(verse.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devotionals" className="space-y-6">
            <DevotionalManager />
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <VideoManager />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <NewsletterManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
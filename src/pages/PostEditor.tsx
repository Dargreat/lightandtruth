import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  image_url?: string;
  video_url?: string;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_category: string;
}

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== "new";
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    published: false,
    image_url: "",
    video_url: "",
    category_id: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchCategories();
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("parent_category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || !session.user) {
      console.error("Authentication check failed:", error);
      navigate("/admin");
      return;
    }
    console.log("User authenticated:", session.user.id);
  };

  const fetchPost = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      });
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageUploading(true);
    try {
      // Convert to base64 for now (could be replaced with proper file upload to Supabase Storage later)
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPost(prev => ({ ...prev, image_url: imageUrl }));
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setPost(prev => ({ ...prev, image_url: "" }));
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Error",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "Error",
        description: "Video must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setVideoUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
        setVideoUploading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      setPost(prev => ({ ...prev, video_url: publicUrl }));
      toast({
        title: "Video uploaded",
        description: "Video has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video file.",
        variant: "destructive",
      });
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSave = async () => {
    if (!post.title.trim() || !post.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/admin");
        return;
      }

      if (!session || !session.user || !session.user.id) {
        console.error("No valid session found:", session);
        toast({
          title: "Authentication Error", 
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/admin");
        return;
      }

      console.log("Authenticated user ID:", session.user.id);

      // Prepare post data
      const postData = {
        title: post.title.trim(),
        content: post.content.trim(), 
        excerpt: post.excerpt.trim() || post.content.trim().slice(0, 200) + "...",
        slug: post.slug || generateSlug(post.title),
        published: post.published,
        author_id: session.user.id,
        ...(post.image_url && { image_url: post.image_url }),
        ...(post.video_url && { video_url: post.video_url }),
        ...(post.category_id && { category_id: post.category_id })
      };

      console.log("Saving post with data:", postData);

      let result;
      if (isEdit && id) {
        result = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id)
          .select();
      } else {
        result = await supabase
          .from("posts")
          .insert([postData])
          .select();
      }

      console.log("Database result:", result);

      if (result.error) {
        console.error("Database error:", result.error);
        throw result.error;
      }

      if (!result.data || result.data.length === 0) {
        throw new Error("No data returned from database");
      }

      toast({
        title: "Success",
        description: `Post ${isEdit ? "updated" : "created"} successfully`,
      });

      // Send notification to subscribers only on new published posts
      try {
        if (!isEdit && postData.published) {
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'post',
              title: postData.title,
              url: `https://lightandtruth.com.ng/post/${postData.slug}`,
            },
          });
        }
      } catch (e) {
        console.error('Notification send error:', e);
      }

      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Complete error details:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEdit ? "update" : "create"} post`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-8 gap-4">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">
                {isEdit ? "Edit Post" : "Create New Post"}
              </h1>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Posting..." : "Post Blog"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={post.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title..."
                      className="text-lg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={post.slug}
                      onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="post-url-slug"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={post.excerpt}
                      onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Featured Image (Optional)</Label>
                    <div className="space-y-4">
                      {post.image_url ? (
                        <div className="relative">
                          <img
                            src={post.image_url}
                            alt="Featured image preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Click to upload an image
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                              disabled={imageUploading}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={imageUploading}
                            >
                              {imageUploading ? "Uploading..." : "Choose Image"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="video">Video Upload (Optional)</Label>
                    <div className="space-y-4">
                      {post.video_url ? (
                        <div className="relative">
                          <video
                            src={post.video_url}
                            controls
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setPost(prev => ({ ...prev, video_url: "" }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Click to upload a video file
                            </p>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="hidden"
                              id="video-upload"
                              disabled={videoUploading}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('video-upload')?.click()}
                              disabled={videoUploading}
                            >
                              {videoUploading ? "Uploading..." : "Choose Video"}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supports MP4, MOV, AVI, and other video formats (max 100MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={post.content}
                      onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your post content here..."
                      rows={20}
                      className="font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={post.category_id}
                      onChange={(e) => setPost(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="">Select a category</option>
                      {categories.filter(c => c.parent_category === 'blog').length > 0 && (
                        <>
                          <optgroup label="Blog">
                            {categories
                              .filter(c => c.parent_category === 'blog')
                              .map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))
                            }
                          </optgroup>
                        </>
                      )}
                      {categories.filter(c => c.parent_category === 'lifestyle').length > 0 && (
                        <>
                          <optgroup label="Lifestyle">
                            {categories
                              .filter(c => c.parent_category === 'lifestyle')
                              .map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))
                            }
                          </optgroup>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={post.published}
                      onCheckedChange={(published) => setPost(prev => ({ ...prev, published }))}
                    />
                    <Label htmlFor="published">
                      {post.published ? "Published" : "Draft"}
                    </Label>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {post.published 
                      ? "This post is visible to the public"
                      : "This post is saved as a draft"
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Post Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium">
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">URL:</span>
                    <span className="ml-2 font-mono text-xs break-all">
                      /post/{post.slug || "slug-here"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
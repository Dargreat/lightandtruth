import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoEmbed } from "./VideoEmbed";
import { Play, Edit, Trash2, Plus } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  published: boolean;
  created_at: string;
}

export function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    published: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.video_url) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from("videos")
          .update(formData)
          .eq("id", editingVideo.id);

        if (error) throw error;
        toast({ title: "Success", description: "Video updated successfully" });
      } else {
        const { error } = await supabase
          .from("videos")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Success", description: "Video created successfully" });
      }

      setFormData({
        title: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        published: false,
      });
      setEditingVideo(null);
      setShowForm(false);
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      toast({
        title: "Error",
        description: "Failed to save video",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      published: video.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Video deleted successfully" });
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from("videos")
        .update({ published: !published })
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Video ${!published ? "published" : "unpublished"} successfully`,
      });
      fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
      toast({
        title: "Error",
        description: "Failed to update video",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingVideo(null);
              setFormData({
                title: "",
                description: "",
                video_url: "",
                thumbnail_url: "",
                published: false,
              });
            }
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Video"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVideo ? "Edit Video" : "Add New Video"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="video_url">Video URL *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="YouTube, Vimeo, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <Button type="submit">
                {editingVideo ? "Update Video" : "Create Video"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-0">
              <div className="h-48 bg-muted flex items-center justify-center">
                {video.video_url ? (
                  <VideoEmbed url={video.video_url} />
                ) : (
                  <Play className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
            </CardContent>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  {video.description && (
                    <CardDescription className="mt-2">
                      {video.description.substring(0, 100)}...
                    </CardDescription>
                  )}
                </div>
                <Badge variant={video.published ? "default" : "secondary"}>
                  {video.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={video.published ? "secondary" : "default"}
                  onClick={() => togglePublished(video.id, video.published)}
                >
                  {video.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(video.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
          <p className="text-muted-foreground">Create your first video to get started.</p>
        </div>
      )}
    </div>
  );
}
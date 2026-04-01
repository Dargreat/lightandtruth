import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { Edit, Trash2, Plus, Eye, EyeOff, Mail, Send } from "lucide-react";

interface Devotional {
  id: string;
  title: string;
  content: string;
  scripture_reference?: string;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export function DevotionalManager() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    scripture_reference: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const fetchDevotionals = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("devotionals")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setDevotionals(data || []);
    } catch (error) {
      console.error("Error fetching devotionals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch devotionals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        const { error } = await (supabase as any)
          .from("devotionals")
          .update({
            title: formData.title,
            content: formData.content,
            scripture_reference: formData.scripture_reference || null,
            date: formData.date,
          })
          .eq("id", editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Devotional updated successfully",
        });
      } else {
        const { error } = await (supabase as any)
          .from("devotionals")
          .insert({
            title: formData.title,
            content: formData.content,
            scripture_reference: formData.scripture_reference || null,
            date: formData.date,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Devotional created successfully",
        });
      }

      setFormData({
        title: "",
        content: "",
        scripture_reference: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingId(null);
      fetchDevotionals();
    } catch (error) {
      console.error("Error saving devotional:", error);
      toast({
        title: "Error",
        description: "Failed to save devotional",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (devotional: Devotional) => {
    setFormData({
      title: devotional.title,
      content: devotional.content,
      scripture_reference: devotional.scripture_reference || "",
      date: devotional.date
    });
    setEditingId(devotional.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this devotional?")) return;

    try {
      const { error } = await (supabase as any)
        .from("devotionals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Devotional deleted successfully",
      });
      
      fetchDevotionals();
    } catch (error) {
      console.error("Error deleting devotional:", error);
      toast({
        title: "Error",
        description: "Failed to delete devotional",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from("devotionals")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // If publishing now, notify subscribers
      if (!currentStatus) {
        const devo = devotionals.find(d => d.id === id);
        if (devo) {
          try {
            await supabase.functions.invoke('send-notification', {
              body: {
                type: 'devotional',
                title: devo.title,
                url: 'https://lightandtruth.com.ng/devotional',
              }
            });
          } catch (e) {
            console.error('Notification send error:', e);
          }
        }
      }

      toast({
        title: "Success",
        description: `Devotional ${!currentStatus ? "published" : "unpublished"} successfully`,
      });
      
      fetchDevotionals();
    } catch (error) {
      console.error("Error updating devotional:", error);
      toast({
        title: "Error",
        description: "Failed to update devotional",
        variant: "destructive",
      });
    }
  };

  const sendDevotionalEmail = async (devotionalId: string, title: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-daily-devotional', {
        body: { devotional_id: devotionalId, send_to_all: true }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Devotional "${title}" sent to all subscribers`,
      });
    } catch (error) {
      console.error("Error sending devotional email:", error);
      toast({
        title: "Error",
        description: "Failed to send devotional email",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading devotionals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Devotional Management</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                const { data, error } = await supabase.functions.invoke('send-daily-devotional', {
                  body: { send_to_all: true }
                });

                if (error) throw error;

                toast({
                  title: "Success",
                  description: "Today's devotional sent to all subscribers",
                });
              } catch (error) {
                console.error("Error sending today's devotional:", error);
                toast({
                  title: "Error",
                  description: "Failed to send today's devotional",
                  variant: "destructive",
                });
              }
            }}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Send Today's Devotional
          </Button>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                title: "",
                content: "",
                scripture_reference: "",
                date: new Date().toISOString().split('T')[0]
              });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Devotional
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Devotional" : "Add New Devotional"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter devotional title"
                  required
                />
              </div>

              <div>
                <label htmlFor="scripture" className="block text-sm font-medium mb-1">
                  Scripture Reference (Optional)
                </label>
                <Input
                  id="scripture"
                  value={formData.scripture_reference}
                  onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                  placeholder="e.g., John 3:16, Psalm 23:1-3"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter devotional content"
                  rows={10}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update" : "Create"} Devotional
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {devotionals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No devotionals found. Create your first devotional!</p>
            </CardContent>
          </Card>
        ) : (
          devotionals.map((devotional) => (
            <Card key={devotional.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{devotional.title}</CardTitle>
                      <Badge variant={devotional.published ? "default" : "secondary"}>
                        {devotional.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Date: {format(parseISO(devotional.date), "MMMM d, yyyy")}</p>
                      {devotional.scripture_reference && (
                        <p>Scripture: {devotional.scripture_reference}</p>
                      )}
                      <p>Created: {format(parseISO(devotional.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {devotional.published && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => sendDevotionalEmail(devotional.id, devotional.title)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(devotional.id, devotional.published)}
                    >
                      {devotional.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(devotional)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(devotional.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap line-clamp-3">{devotional.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
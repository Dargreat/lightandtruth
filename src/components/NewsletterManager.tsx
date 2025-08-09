import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Users, Send, Trash2 } from "lucide-react";

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

export function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newsletter, setNewsletter] = useState({
    subject: "",
    content: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .eq("active", true)
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async () => {
    if (!newsletter.subject || !newsletter.content) {
      toast({
        title: "Error",
        description: "Please fill in subject and content",
        variant: "destructive",
      });
      return;
    }

    if (subscribers.length === 0) {
      toast({
        title: "Error",
        description: "No active subscribers found",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: newsletter.subject,
          content: newsletter.content,
          subscribers: subscribers.map(s => s.email),
        },
      });

      if (error) throw error;

      toast({
        title: "Newsletter sent!",
        description: `Newsletter sent to ${subscribers.length} subscribers`,
      });

      setNewsletter({ subject: "", content: "" });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast({
        title: "Error",
        description: "Failed to send newsletter",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Subscriber deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscriber",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading newsletter data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Newsletter Management</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {subscribers.length} Subscribers
        </Badge>
      </div>

      {/* Send Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Newsletter
          </CardTitle>
          <CardDescription>
            Send a newsletter to all active subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newsletter.subject}
              onChange={(e) => setNewsletter(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Newsletter subject..."
              disabled={sending}
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={newsletter.content}
              onChange={(e) => setNewsletter(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your newsletter content here..."
              rows={10}
              disabled={sending}
            />
          </div>
          <Button 
            onClick={sendNewsletter} 
            disabled={sending || subscribers.length === 0}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : `Send to ${subscribers.length} subscribers`}
          </Button>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers ({subscribers.length})</CardTitle>
          <CardDescription>
            Manage your newsletter subscribers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers.length > 0 ? (
            <div className="space-y-2">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscriber.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSubscriber(subscriber.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No subscribers yet</h3>
              <p className="text-muted-foreground">
                When users subscribe to your newsletter, they'll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
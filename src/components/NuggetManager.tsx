import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Nugget = Tables<"nuggets">;
const today = () => new Date().toISOString().slice(0, 10);
const empty = { title: "", content: "", date: today(), image_url: "", video_url: "", published: true };

export function NuggetManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Nugget[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("nuggets").select("*").order("date", { ascending: false }).order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File, field: "image_url" | "video_url") => {
    setBusy(true);
    const ext = file.name.split(".").pop();
    const path = `nuggets/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("videos").upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    const { data } = supabase.storage.from("videos").getPublicUrl(path);
    setForm((f) => ({ ...f, [field]: data.publicUrl }));
  };

  const save = async () => {
    if (!form.title && !form.content && !form.image_url && !form.video_url)
      return toast({ title: "Add some text, a photo or a video", variant: "destructive" });
    setBusy(true);
    const payload = { ...form, image_url: form.image_url || null, video_url: form.video_url || null };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("nuggets").update(payload).eq("id", editingId));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setBusy(false); return toast({ title: "Please sign in again", variant: "destructive" }); }
      ({ error } = await supabase.from("nuggets").insert({ ...payload, author_id: user.id }));
    }
    setBusy(false);
    if (error) return toast({ title: "Could not save", description: error.message, variant: "destructive" });
    toast({ title: editingId ? "Nugget updated" : "Nugget posted" });
    setForm({ ...empty, date: today() });
    setEditingId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this nugget?")) return;
    await supabase.from("nuggets").delete().eq("id", id);
    load();
  };

  const edit = (n: Nugget) => {
    setEditingId(n.id);
    setForm({ title: n.title, content: n.content, date: n.date, image_url: n.image_url ?? "", video_url: n.video_url ?? "", published: n.published });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>{editingId ? "Edit Nugget" : "Post Today's Nugget"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div><Label>Text</Label><Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Photo</Label>
              <Input type="file" accept="image/*" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "image_url")} />
              {form.image_url && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={form.image_url} alt="" className="h-16 rounded object-cover" />
                  <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, image_url: "" })}>Remove</Button>
                </div>
              )}
            </div>
            <div>
              <Label>Video (upload or paste YouTube link)</Label>
              <Input type="file" accept="video/*" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "video_url")} />
              <Input className="mt-2" placeholder="https://youtube.com/..." value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label>Show on site</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={busy}>{busy ? "Working..." : editingId ? "Update" : "Post Nugget"}</Button>
            {editingId && <Button variant="outline" onClick={() => { setEditingId(null); setForm({ ...empty, date: today() }); }}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Nuggets ({items.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 && <p className="text-muted-foreground text-sm">No nuggets yet.</p>}
          {items.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-3 border rounded-lg p-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{n.title || n.content.slice(0, 50) || "(media only)"}</span>
                  <Badge variant={n.published ? "default" : "secondary"}>{n.published ? "Live" : "Hidden"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{n.date}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => edit(n)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

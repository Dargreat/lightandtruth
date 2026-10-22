// One-off: moves base64 post images into storage and replaces image_url with a public URL. Never deletes posts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: posts, error } = await sb.from("posts").select("id").like("image_url", "data:%");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });
  const results: unknown[] = [];
  for (const { id } of posts ?? []) {
    const { data: row } = await sb.from("posts").select("image_url").eq("id", id).single();
    const m = row?.image_url?.match(/^data:([^;]+);base64,(.*)$/s);
    if (!m) { results.push({ id, skipped: true }); continue; }
    const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
    const ext = m[1].split("/")[1]?.split("+")[0] || "jpg";
    const path = `post-images/${id}.${ext}`;
    const up = await sb.storage.from("videos").upload(path, bytes, { contentType: m[1], upsert: true });
    if (up.error) { results.push({ id, error: up.error.message }); continue; }
    const url = sb.storage.from("videos").getPublicUrl(path).data.publicUrl;
    const { error: uErr } = await sb.from("posts").update({ image_url: url }).eq("id", id);
    results.push({ id, url, error: uErr?.message });
  }
  return new Response(JSON.stringify({ migrated: results }), { headers: { ...cors, "Content-Type": "application/json" } });
});

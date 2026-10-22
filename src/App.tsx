import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Non-home pages load on demand so first visit downloads less code
const AllBlogs = lazy(() => import("./pages/AllBlogs"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PostEditor = lazy(() => import("./pages/PostEditor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const VideosPage = lazy(() => import("./pages/VideosPage"));
const DevotionalPage = lazy(() => import("./pages/DevotionalPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const KidsPage = lazy(() => import("./pages/KidsPage"));

// React Query client configuration for data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Main application component for Light and Truth Christian blog
 * Provides routing, state management, and UI components
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <Helmet>
          <title>Light and Truth — Scripture Teachings, Devotionals & Faith Resources</title>
          <meta name="description" content="Light and Truth is a Christian blog sharing scripture teachings, daily devotionals, inspiring articles, and faith-building resources for believers." />
          <meta name="keywords" content="Light and Truth, Christian blog, Bible study, devotionals, Christian articles, faith resources, scripture teachings" />
          <link rel="canonical" href="https://lightandtruth.com.ng" />
          <meta property="og:title" content="Light and Truth — Scripture Teachings, Devotionals & Faith Resources" />
          <meta property="og:description" content="Scripture teachings, daily devotionals, and faith-building resources from Light and Truth." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://lightandtruth.com.ng" />
          <meta property="og:site_name" content="Light and Truth" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Light and Truth — Scripture Teachings, Devotionals & Faith Resources" />
          <meta name="twitter:description" content="Scripture teachings, daily devotionals, and faith-building resources from Light and Truth." />
          <script type="application/ld+json">{`
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Light and Truth",
              "url": "https://lightandtruth.com.ng",
              "description": "A Christian blog sharing scripture teachings, devotionals, and faith-building resources.",
              "inLanguage": "en"
            }
          `}</script>
        </Helmet>
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<AllBlogs />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/kids" element={<KidsPage />} />
            <Route path="/devotional" element={<DevotionalPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/posts/:id/edit" element={<PostEditor />} />
            <Route path="/admin/posts/new" element={<PostEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

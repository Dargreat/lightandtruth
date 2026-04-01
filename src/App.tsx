import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllBlogs from "./pages/AllBlogs";
import PostDetail from "./pages/PostDetail";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import PostEditor from "./pages/PostEditor";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import VideosPage from "./pages/VideosPage";
import DevotionalPage from "./pages/DevotionalPage";
import AboutPage from "./pages/AboutPage";
import KidsPage from "./pages/KidsPage";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



# Complete UI Rebuild -- Light and Truth Blog

## Overview
Rebuild all pages with a clean, modern editorial design inspired by top Christian blogs. Sky-blue and white flat palette, smooth fade-in animations, no gradients. Same content, completely new look.

## Design Direction
- Clean white backgrounds with sky-blue accents
- Large hero sections with full-width imagery
- Card-based layouts with subtle shadows and hover effects
- Generous whitespace and strong typography hierarchy
- Smooth `animate-fade-up` / `animate-fade-in` on scroll-triggered sections
- Consistent Navigation and Footer components shared across all pages

## Files to Create/Modify

### 1. Shared Footer Component (NEW: `src/components/Footer.tsx`)
- Extract footer from Home.tsx into a reusable component
- Sky-blue accent links, social icons, newsletter subscribe inline
- Used on every page

### 2. Navigation (`src/components/Navigation.tsx`)
- Keep existing structure but refine styling
- Slightly taller header (h-16), cleaner font weights
- Add subtle bottom shadow instead of border
- Smooth transition on scroll (background solidifies)

### 3. Home Page (`src/pages/Home.tsx`)
- **Hero**: Full-width section with large centered text over a soft sky-blue background (flat color, no gradient), BookOpen icon, tagline, CTA button
- **Verse of the Day**: White card on light blue-tinted section, large serif quote
- **Featured Post**: If posts exist, show the first post as a large hero-style card (image left, text right)
- **Latest Posts Grid**: 3-column card grid with images, category badges, dates, excerpts
- **About Preview**: Two-column layout -- text left, decorative illustration/icon right
- **Mission & Vision**: Icon cards side by side
- **Newsletter CTA**: Full-width sky-blue section with inline email input
- **Footer**: Shared component

### 4. PostCard (`src/components/PostCard.tsx`)
- Rounded corners, white background, soft shadow
- Image with hover zoom effect
- Category badge overlay on image
- Clean typography with date, comment count
- "Read more" link with underline animation

### 5. All Blogs Page (`src/pages/AllBlogs.tsx`)
- Page header with title and breadcrumb
- Use Navigation component instead of BlogHeader
- 3-column responsive grid
- Fade-in animation on cards

### 6. Post Detail (`src/pages/PostDetail.tsx`)
- Use Navigation instead of BlogHeader
- Large featured image with rounded corners
- Clean article typography (prose styles)
- Sidebar-style metadata (date, author)
- Comments section with better card styling

### 7. About Page (`src/pages/AboutPage.tsx`)
- Hero banner with sky-blue background and title
- Story section with large text
- What We Offer grid with icon cards (sky-blue icon backgrounds)
- Mission/Vision side-by-side cards
- Footer

### 8. Devotional Page (`src/pages/DevotionalPage.tsx`)
- Hero section with sky-blue background
- Today's devotional as a prominent white card
- Date navigator with cleaner styling
- Archive list with card hover effects
- Newsletter CTA section
- Remove gradient from newsletter card

### 9. Videos Page (`src/pages/VideosPage.tsx`)
- Header section with sky-blue background
- Video cards with rounded corners and shadow
- Grid layout matching blog posts style

### 10. Category Page (`src/pages/CategoryPage.tsx`)
- Sky-blue header banner with category name
- Post grid with fade-in animations

### 11. CSS Updates (`src/index.css`)
- Keep existing sky-blue palette (already correct)
- Ensure all animation utilities are present
- Add `.animate-fade-in-up` with intersection observer utility class

### 12. Tailwind Config (`tailwind.config.ts`)
- Add `fade-up` and `fade-in` keyframes/animations to config
- Add `font-serif` for blockquotes

### 13. Remove BlogHeader
- Replace all usages of `BlogHeader` with `Navigation`
- Delete `src/components/BlogHeader.tsx`

## Technical Details
- All pages use `Navigation` at top and `Footer` at bottom for consistency
- Animations use CSS keyframes defined in `index.css` (already partially there)
- No external animation libraries needed
- No gradients anywhere -- flat sky-blue (#2196F3 range) and white only
- Post data fetched from Supabase `posts` table with category joins
- Hero image from existing `src/assets/hero-blog.jpg`

## Implementation Order
1. Update tailwind.config.ts with animation keyframes
2. Update index.css (ensure animations, remove any gradients)
3. Create Footer component
4. Update Navigation component
5. Rebuild Home page
6. Rebuild PostCard
7. Rebuild AllBlogs, PostDetail, AboutPage, DevotionalPage, VideosPage, CategoryPage
8. Remove BlogHeader, update imports


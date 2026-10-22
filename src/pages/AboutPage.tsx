import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { BookOpen, Heart, Users, Video, Target, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import communityImg from "@/assets/community-prayer.jpg";
import bibleReadingImg from "@/assets/bible-reading.jpg";
import { Helmet } from "react-helmet-async";

const offerings = [
  { icon: BookOpen, title: "Bible-Based Content", desc: "Articles, sermons, and messages rooted in Scripture" },
  { icon: Heart, title: "Lifestyle Guidance", desc: "Christian perspectives on health, entertainment, and current events" },
  { icon: Video, title: "Video Content", desc: "Inspiring videos and visual teachings" },
  { icon: Users, title: "Community", desc: "A platform for sharing testimonies and building connections" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About — Light and Truth</title>
        <meta name="description" content="Learn about Light and Truth — a Christian blog dedicated to sharing scripture teachings, devotionals, and faith-building resources." />
        <link rel="canonical" href="https://lightandtruth.com.ng/about" />
        <meta property="og:title" content="About — Light and Truth" />
        <meta property="og:description" content="Learn about Light and Truth — sharing scripture teachings, devotionals, and faith-building resources." />
        <meta property="og:url" content="https://lightandtruth.com.ng/about" />
      </Helmet>
      <Navigation />

      <section className="bg-primary py-20">
        <div className="container text-center animate-slide-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-3">About Light and Truth</h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">A digital sanctuary where faith meets life</p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm mt-4">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>About</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection animation="slide-in-left">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Our Story</span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6">Who We Are</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-5">
                Light and Truth is a Christian blog platform dedicated to sharing the Word of God
                and providing spiritual guidance for believers and seekers alike.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Our content spans various aspects of Christian living, from in-depth biblical studies
                to practical life applications.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a new believer or a seasoned follower, Light and Truth is here to walk alongside you.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right">
              <img src={communityImg} alt="Church community gathering" className="rounded-2xl shadow-lg w-full h-80 object-cover" loading="lazy" width={1280} height={720} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatedSection animation="slide-in-left" className="bg-card p-10 rounded-2xl text-center shadow-sm border border-border/50">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground text-lg">To bring truth without fear</p>
              <p className="text-muted-foreground text-lg">To bring truth with hope</p>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" className="bg-card p-10 rounded-2xl text-center shadow-sm border border-border/50">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground text-lg">A wholesome Biblical living</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection animation="slide-in-left" className="order-2 lg:order-1">
              <img src={bibleReadingImg} alt="Bible reading" className="rounded-2xl shadow-lg w-full h-80 object-cover" loading="lazy" width={1280} height={720} />
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" className="order-1 lg:order-2">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">What We Offer</span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-8">Content That Inspires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {offerings.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 bg-secondary rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

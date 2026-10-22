import { BookOpen, Facebook, Youtube, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsletterSubscribe } from "./NewsletterSubscribe";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter CTA */}
      <div className="bg-primary py-16">
        <div className="container text-center">
          <Mail className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Stay Connected
          </h3>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Get daily devotionals, articles, and spiritual encouragement delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSubscribe variant="footer" />
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Light and Truth</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Seeing in light, established in truth. A digital sanctuary where faith meets life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2.5 text-background/60 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/blogs" className="hover:text-primary transition-colors">All Posts</Link></li>
              <li><Link to="/devotional" className="hover:text-primary transition-colors">Devotional</Link></li>
              <li><Link to="/videos" className="hover:text-primary transition-colors">Videos</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5 text-background/60 text-sm">
              <li><Link to="/category/messages" className="hover:text-primary transition-colors">Messages</Link></li>
              <li><Link to="/category/articles" className="hover:text-primary transition-colors">Articles</Link></li>
              <li><Link to="/category/sermon" className="hover:text-primary transition-colors">Sermons</Link></li>
              <li><Link to="/category/health" className="hover:text-primary transition-colors">Health</Link></li>
              <li><Link to="/category/stories" className="hover:text-primary transition-colors">Stories</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex items-center space-x-3">
              <a href="https://www.facebook.com/share/1BsW3d4wjX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@lightettruth?si=Rww0pm8DTBW598Lk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/lightettruth" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/40 text-sm">
          <p>&copy; {currentYear} Light and Truth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

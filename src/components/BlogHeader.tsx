import { Button } from "@/components/ui/button";
import { BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-lg">
              Light and Truth
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <a
              href="#about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              About
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-2 md:hidden">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold">Light and Truth</span>
            </div>
          </div>
          <nav className="flex items-center">
            {/* Navigation items can be added here if needed */}
          </nav>
        </div>
      </div>
    </header>
  );
}
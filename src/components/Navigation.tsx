import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronDown,
  Menu,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NewsletterSubscribe } from "./NewsletterSubscribe";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/1BsW3d4wjX/?mibextid=wwXIfr",
      icon: Facebook,
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@lightettruth?si=Rww0pm8DTBW598Lk",
      icon: Youtube,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/lightettruth",
      icon: Instagram,
    },
  ];

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link
          to="/"
          className="mr-6 flex items-center space-x-2 shrink-0"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block text-lg">
            Light and Truth
          </span>
        </Link>

        {/* Desktop Navigation (centered) */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="px-3 py-2 text-sm font-medium">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <Link to="/category/messages">Messages</Link>
                    <Link to="/category/articles">Articles</Link>
                    <Link to="/category/sermon">Sermon</Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/devotional" className="px-3 py-2 text-sm font-medium">
                    Devotional
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Lifestyle</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <Link to="/category/health">Health</Link>
                    <Link to="/category/entertainment">Entertainment</Link>
                    <Link to="/category/politics">Politics</Link>
                    <Link to="/category/news">News</Link>
                    <Link to="/category/stories">Stories</Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/videos" className="px-3 py-2 text-sm font-medium">
                    Videos
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/about" className="px-3 py-2 text-sm font-medium">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Social Links (right) */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          {socialLinks.map((social) => (
            <Button key={social.name} variant="ghost" size="sm" asChild>
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                <social.icon className="h-6 w-6" /> {/* bigger icons */}
              </a>
            </Button>
          ))}
        </div>

        {/* Mobile Hamburger (right) */}
        <div className="md:hidden ml-auto">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span>Light and Truth</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col justify-between h-full">
                {/* Nav links */}
                <div className="grid gap-4 py-6">
                  <Link
                    to="/"
                    className="block px-2 py-1 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  {/* Blog Dropdown */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-2 py-1 text-lg"
                      onClick={() => toggleDropdown("blog")}
                    >
                      Blog
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === "blog" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === "blog" && (
                      <div className="pl-6 mt-2 space-y-2">
                        <Link
                          to="/category/messages"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Messages
                        </Link>
                        <Link
                          to="/category/articles"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Articles
                        </Link>
                        <Link
                          to="/category/sermon"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sermon
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/devotional"
                    className="block px-2 py-1 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Devotional
                  </Link>

                  {/* Lifestyle Dropdown */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-2 py-1 text-lg"
                      onClick={() => toggleDropdown("lifestyle")}
                    >
                      Lifestyle
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === "lifestyle" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === "lifestyle" && (
                      <div className="pl-6 mt-2 space-y-2">
                        <Link
                          to="/category/health"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Health
                        </Link>
                        <Link
                          to="/category/entertainment"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Entertainment
                        </Link>
                        <Link
                          to="/category/politics"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Politics
                        </Link>
                        <Link
                          to="/category/news"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          News
                        </Link>
                        <Link
                          to="/category/stories"
                          className="block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Stories
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/videos"
                    className="block px-2 py-1 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Videos
                  </Link>

                  <Link
                    to="/about"
                    className="block px-2 py-1 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  <div className="px-2">
                    <NewsletterSubscribe />
                  </div>
                </div>

                {/* Mobile Social Links */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                  {socialLinks.map((social) => (
                    <Button key={social.name} variant="ghost" size="sm" asChild>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon className="h-7 w-7" /> {/* bigger icons */}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

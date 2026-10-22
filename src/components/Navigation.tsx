import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, Menu, Facebook, Youtube, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NewsletterSubscribe } from "./NewsletterSubscribe";

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/share/1BsW3d4wjX/?mibextid=wwXIfr", icon: Facebook },
  { name: "YouTube", url: "https://youtube.com/@lightettruth?si=Rww0pm8DTBW598Lk", icon: Youtube },
  { name: "Instagram", url: "https://www.instagram.com/lightettruth", icon: Instagram },
];

const blogLinks = [
  { label: "Messages", to: "/category/messages" },
  { label: "Articles", to: "/category/articles" },
  { label: "Sermon", to: "/category/sermon" },
];

const lifestyleLinks = [
  { label: "Health", to: "/category/health" },
  { label: "Entertainment", to: "/category/entertainment" },
  { label: "Politics", to: "/category/politics" },
  { label: "News", to: "/category/news" },
  { label: "Stories", to: "/category/stories" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center min-w-0">
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2.5 min-w-0">
          <BookOpen className="h-7 w-7 text-primary flex-shrink-0 hidden sm:block" />
          {/* Mobile stacked italic logo */}
          <span className="sm:hidden flex flex-col leading-none font-serif italic font-bold text-primary">
            <span className="text-lg">Light &</span>
            <span className="text-lg -mt-1">Truth</span>
          </span>
          <span className="hidden font-bold sm:inline-block text-xl tracking-tight truncate">
            Light and Truth
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center min-w-0">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Blog</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 min-w-[180px]">
                  <div className="flex flex-col space-y-2">
                    {blogLinks.map(link => (
                      <Link key={link.to} to={link.to} className="px-3 py-2 rounded-md hover:bg-secondary text-sm font-medium transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/devotional" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Devotional</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Lifestyle</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 min-w-[180px]">
                  <div className="flex flex-col space-y-2">
                    {lifestyleLinks.map(link => (
                      <Link key={link.to} to={link.to} className="px-3 py-2 rounded-md hover:bg-secondary text-sm font-medium transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/kids" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Kids</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/videos" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Videos</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/about" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Social Links */}
        <div className="hidden lg:flex items-center space-x-1 min-w-0">
          {socialLinks.map((social) => (
            <Button key={social.name} variant="ghost" size="icon" className="h-9 w-9" asChild>
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                <social.icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden ml-auto">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[380px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span>Light and Truth</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col justify-between h-full">
                <div className="grid gap-1 py-6">
                  <Link to="/" className="block px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>

                  {/* Blog Dropdown */}
                  <div>
                    <button className="flex items-center justify-between w-full px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => toggleDropdown("blog")}>
                      Blog
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "blog" ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === "blog" && (
                      <div className="pl-6 mt-1 space-y-1 animate-fade-in">
                        {blogLinks.map(link => (
                          <Link key={link.to} to={link.to} className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link to="/devotional" className="block px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Devotional</Link>

                  {/* Lifestyle Dropdown */}
                  <div>
                    <button className="flex items-center justify-between w-full px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => toggleDropdown("lifestyle")}>
                      Lifestyle
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "lifestyle" ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === "lifestyle" && (
                      <div className="pl-6 mt-1 space-y-1 animate-fade-in">
                        {lifestyleLinks.map(link => (
                          <Link key={link.to} to={link.to} className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link to="/kids" className="block px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Kids</Link>
                  <Link to="/videos" className="block px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Videos</Link>
                  <Link to="/about" className="block px-3 py-2.5 text-base font-medium rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>

                  <div className="px-3 pt-4">
                    <NewsletterSubscribe />
                  </div>
                </div>

                {/* Mobile Social Links */}
                <div className="flex items-center justify-center space-x-3 py-6 border-t">
                  {socialLinks.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <social.icon className="h-5 w-5" />
                    </a>
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

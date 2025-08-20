import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, Menu, X, Facebook, Youtube, Instagram } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-lg">
              Light and Truth
            </span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    <div className="row-span-3">
                      <Link
                        to="/category/messages"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Messages
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Inspiring messages and teachings
                        </p>
                      </Link>
                    </div>
                    <Link
                      to="/category/articles"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Articles</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        In-depth articles on faith and life
                      </p>
                    </Link>
                    <Link
                      to="/category/sermon"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Sermon</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Weekly sermons and teachings
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/devotional" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Devotional
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Lifestyle</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <Link
                      to="/category/health"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Health</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Health and wellness from a Christian perspective
                      </p>
                    </Link>
                    <Link
                      to="/category/entertainment"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Entertainment</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Christian entertainment and media
                      </p>
                    </Link>
                    <Link
                      to="/category/politics"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Politics</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Faith and politics discussions
                      </p>
                    </Link>
                    <Link
                      to="/category/news"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">News</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Christian news and updates
                      </p>
                    </Link>
                    <Link
                      to="/category/stories"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Stories</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Personal testimonies and stories
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/videos" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Videos
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  About
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NewsletterSubscribe />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile Logo */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-2 md:hidden">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold">Light and Truth</span>
            </div>
          </div>

          {/* Desktop Social Links */}
          <div className="hidden md:flex items-center space-x-2">
            {socialLinks.map((social) => (
              <Button key={social.name} variant="ghost" size="sm" asChild>
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
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
              <div className="grid gap-4 py-6">
                <Link
                  to="/"
                  className="block px-2 py-1 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                <div className="space-y-2">
                  <p className="font-medium text-sm text-muted-foreground px-2">Blog</p>
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/category/messages"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link
                      to="/category/articles"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Articles
                    </Link>
                    <Link
                      to="/category/sermon"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sermon
                    </Link>
                  </div>
                </div>

                <Link
                  to="/devotional"
                  className="block px-2 py-1 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Devotional
                </Link>

                <div className="space-y-2">
                  <p className="font-medium text-sm text-muted-foreground px-2">Lifestyle</p>
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/category/health"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Health
                    </Link>
                    <Link
                      to="/category/entertainment"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Entertainment
                    </Link>
                    <Link
                      to="/category/politics"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Politics
                    </Link>
                    <Link
                      to="/category/news"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      News
                    </Link>
                    <Link
                      to="/category/stories"
                      className="block px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Stories
                    </Link>
                  </div>
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

                {/* Mobile Social Links */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                  {socialLinks.map((social) => (
                    <Button key={social.name} variant="ghost" size="sm" asChild>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <social.icon className="h-5 w-5" />
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

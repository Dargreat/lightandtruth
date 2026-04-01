import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isToday } from "date-fns";
import { Calendar, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import devotionalImg from "@/assets/devotional-hands.jpg";
import { Helmet } from "react-helmet-async";

interface Devotional {
  id: string;
  title: string;
  content: string;
  scripture_reference?: string;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function DevotionalPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [todaysDevotional, setTodaysDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => { fetchDevotionals(); }, []);

  const fetchDevotionals = async () => {
    try {
      const { data, error } = await (supabase as any).from("devotionals").select("*").eq("published", true).order("date", { ascending: false });
      if (error) throw error;
      setDevotionals(data || []);
      const today = format(new Date(), 'yyyy-MM-dd');
      setTodaysDevotional(data?.find((d: Devotional) => d.date === today) || null);
    } catch (error) {
      console.error("Error fetching devotionals:", error);
      toast({ title: "Error", description: "Failed to load devotionals", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    setSelectedDate(newDate);
  };

  const getDevotionalForDate = (date: Date) => {
    return devotionals.find(d => d.date === format(date, 'yyyy-MM-dd'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Daily Devotional — Light and Truth</title>
        <meta name="description" content="Start your day with daily devotionals from Light and Truth. Spiritual reflections, prayers, and Scripture to strengthen your faith." />
        <link rel="canonical" href="https://lightandtruth.com.ng/devotional" />
        <meta property="og:title" content="Daily Devotional — Light and Truth" />
        <meta property="og:description" content="Start your day with daily devotionals, spiritual reflections, and Scripture from Light and Truth." />
        <meta property="og:url" content="https://lightandtruth.com.ng/devotional" />
      </Helmet>
      <Navigation />

      <section className="relative py-20 overflow-hidden">
        <img src={devotionalImg} alt="Devotional time" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 container text-center animate-slide-in-up">
          <BookOpen className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-3">Daily Devotional</h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Start your day with spiritual reflections, prayers, and God's word.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm mt-4">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Devotional</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl mx-auto space-y-10">
          {todaysDevotional && (
            <AnimatedSection animation="slide-in-left">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <Badge className="bg-primary text-primary-foreground text-sm">Today's Devotional</Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">{todaysDevotional.title}</CardTitle>
                  {todaysDevotional.scripture_reference && (
                    <p className="text-primary font-medium mt-2">{todaysDevotional.scripture_reference}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose-article whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: todaysDevotional.content.replace(/\n/g, '<br>') }} />
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          <AnimatedSection animation="slide-in-up" className="flex items-center justify-center gap-4 py-4">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4 mr-1" />Previous
            </Button>
            <div className="text-center px-4">
              <p className="font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              {isToday(selectedDate) && <Badge variant="secondary" className="mt-1 text-xs">Today</Badge>}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              Next<ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </AnimatedSection>

          {!isToday(selectedDate) && (
            <AnimatedSection animation="slide-in-right">
              <Card>
                {(() => {
                  const devotional = getDevotionalForDate(selectedDate);
                  if (!devotional) return (
                    <CardContent className="text-center py-10">
                      <p className="text-muted-foreground">No devotional for {format(selectedDate, 'MMMM d, yyyy')}</p>
                    </CardContent>
                  );
                  return (
                    <>
                      <CardHeader>
                        <CardTitle className="text-xl">{devotional.title}</CardTitle>
                        {devotional.scripture_reference && <p className="text-primary font-medium">{devotional.scripture_reference}</p>}
                      </CardHeader>
                      <CardContent>
                        <div className="prose-article whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: devotional.content.replace(/\n/g, '<br>') }} />
                      </CardContent>
                    </>
                  );
                })()}
              </Card>
            </AnimatedSection>
          )}

          <AnimatedSection animation="slide-in-up">
            <h2 className="text-2xl font-bold mb-6 text-center">Recent Devotionals</h2>
            <div className="grid gap-4">
              {devotionals.slice(0, 10).map((devotional, i) => (
                <AnimatedSection key={devotional.id} animation={i % 2 === 0 ? "slide-in-left" : "slide-in-right"}>
                  <Card className="hover:shadow-md transition-shadow border border-border/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{devotional.title}</CardTitle>
                          {devotional.scripture_reference && (
                            <p className="text-sm text-primary mt-1">{devotional.scripture_reference}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">{format(parseISO(devotional.date), 'MMM d')}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-2">{devotional.content.substring(0, 200)}...</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}

              {devotionals.length === 0 && (
                <Card>
                  <CardContent className="text-center py-10">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Devotionals Yet</h3>
                    <p className="text-muted-foreground">Daily devotionals will appear here once they are published.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}

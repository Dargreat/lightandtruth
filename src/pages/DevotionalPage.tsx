import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isToday, startOfDay } from "date-fns";
import { Calendar, Heart, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";

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

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const fetchDevotionals = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("devotionals")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });

      if (error) throw error;
      
      setDevotionals(data || []);
      
      // Find today's devotional
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysDevo = data?.find(d => d.date === today);
      setTodaysDevotional(todaysDevo || null);
      
    } catch (error) {
      console.error("Error fetching devotionals:", error);
      toast({
        title: "Error",
        description: "Failed to load devotionals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const getDevotionalForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return devotionals.find(d => d.date === dateStr);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Daily Devotional
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start your day with spiritual reflections, prayers, and God's word. 
            Subscribe to receive daily devotionals in your inbox.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Today's Featured Devotional */}
          {todaysDevotional && (
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <Badge variant="default" className="text-sm">
                    Today's Devotional
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{todaysDevotional.title}</CardTitle>
                {todaysDevotional.scripture_reference && (
                  <p className="text-primary font-medium">
                    {todaysDevotional.scripture_reference}
                  </p>
                )}
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: todaysDevotional.content.replace(/\n/g, '<br>')
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-4 py-4">
            <Button variant="outline" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
              Previous Day
            </Button>
            <div className="text-center">
              <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              {isToday(selectedDate) && (
                <Badge variant="secondary" className="mt-1">Today</Badge>
              )}
            </div>
            <Button variant="outline" onClick={() => navigateDate('next')}>
              Next Day
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Date Devotional */}
          {!isToday(selectedDate) && (
            <Card>
              {(() => {
                const devotional = getDevotionalForDate(selectedDate);
                if (!devotional) {
                  return (
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        No devotional available for {format(selectedDate, 'MMMM d, yyyy')}
                      </p>
                    </CardContent>
                  );
                }
                return (
                  <>
                    <CardHeader>
                      <CardTitle className="text-xl">{devotional.title}</CardTitle>
                      {devotional.scripture_reference && (
                        <p className="text-primary font-medium">
                          {devotional.scripture_reference}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: devotional.content.replace(/\n/g, '<br>')
                        }}
                      />
                    </CardContent>
                  </>
                );
              })()}
            </Card>
          )}

          {/* Newsletter Subscription */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Never Miss a Devotional
              </CardTitle>
              <p className="text-muted-foreground">
                Subscribe to receive daily devotionals and spiritual reflections in your inbox
              </p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <NewsletterSubscribe />
            </CardContent>
          </Card>

          {/* Recent Devotionals Archive */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Recent Devotionals</h2>
            <div className="grid gap-4">
              {devotionals.slice(0, 10).map((devotional) => (
                <Card key={devotional.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{devotional.title}</CardTitle>
                        {devotional.scripture_reference && (
                          <p className="text-sm text-primary mt-1">
                            {devotional.scripture_reference}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {format(parseISO(devotional.date), 'MMM d')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="line-clamp-3">
                        {devotional.content.substring(0, 200)}...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {devotionals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Devotionals Yet</h3>
                  <p className="text-muted-foreground">
                    Daily devotionals will appear here once they are published.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
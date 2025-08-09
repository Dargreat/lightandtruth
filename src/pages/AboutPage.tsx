import { Navigation } from "@/components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Light and Truth</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                A wholesome Biblical living
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  To bring truth without fear
                </p>
                <p className="text-lg text-muted-foreground">
                  To bring truth with hope
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Light and Truth is a Christian blog platform dedicated to sharing the Word of God 
                  and providing spiritual guidance for believers and seekers alike. We believe in the 
                  power of Scripture to transform lives and communities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our content spans various aspects of Christian living, from in-depth biblical studies 
                  to practical life applications. We strive to create a community where faith meets 
                  everyday life, offering hope, encouragement, and truth in a world that desperately needs it.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Bible-Based Content</h3>
                  <p className="text-muted-foreground">
                    Articles, sermons, and messages rooted in Scripture
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Lifestyle Guidance</h3>
                  <p className="text-muted-foreground">
                    Christian perspectives on health, entertainment, and current events
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Video Content</h3>
                  <p className="text-muted-foreground">
                    Inspiring videos and visual teachings
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Community</h3>
                  <p className="text-muted-foreground">
                    A platform for sharing testimonies and building connections
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
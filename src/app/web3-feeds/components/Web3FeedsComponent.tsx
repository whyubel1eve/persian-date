'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

interface RSSFeed {
  title: string;
  description: string;
  items: NewsItem[];
}

export default function Web3FeedsComponent() {
  const [feed, setFeed] = useState<RSSFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rss-feed');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFeed(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch RSS feed');
      } finally {
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading news feed: {error}</p>
      </div>
    );
  }

  if (!feed || !feed.items.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No news items available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Web3 News
        </h1>
        <p className="text-muted-foreground">
          Latest updates from the blockchain world
        </p>
      </div>

      {/* News Grid */}
      <div className="space-y-4">
        {feed.items.map((item, index) => (
          <article 
            key={item.guid || index} 
            className="group bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl hover:bg-card/80 hover:border-border/60 transition-all duration-200 hover:shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-2"
                      >
                        {item.title}
                      </a>
                    </h2>
                    <time className="text-xs text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-1 rounded-md font-mono">
                      {new Date(item.pubDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                  
                  <div 
                    className="text-sm text-muted-foreground leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: item.description
                        .replace(/BlockBeats 消息，\d+\s*月\s*\d+\s*日，/g, '')
                        .replace(/<p>BlockBeats 消息，[\s\S]*?日，/g, '')
                        .replace(/<\/?p>/g, '')
                        .replace(/<br\s*\/?>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                    }}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
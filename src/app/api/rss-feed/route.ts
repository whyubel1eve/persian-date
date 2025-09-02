import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    const response = await fetch('https://api.theblockbeats.news/v2/rss/all', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Persian-Date-Converter/1.0)',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Simple regex-based XML parsing for RSS with CDATA support
    const parseXMLTag = (xml: string, tag: string): string => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const match = xml.match(regex);
      if (!match) return '';
      
      let content = match[1].trim();
      
      // Handle CDATA sections
      const cdataRegex = /<!\[CDATA\[([\s\S]*?)\]\]>/;
      const cdataMatch = content.match(cdataRegex);
      if (cdataMatch) {
        content = cdataMatch[1].trim();
      }
      
      return content;
    };

    // Extract channel info
    const channelMatch = xmlText.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    if (!channelMatch) {
      throw new Error('Invalid RSS feed format - no channel found');
    }
    
    const channelContent = channelMatch[1];
    const title = parseXMLTag(channelContent, 'title') || 'TheBlockBeats News';
    const description = parseXMLTag(channelContent, 'description') || 'Latest Web3 and cryptocurrency news';
    
    // Extract items
    const itemMatches = channelContent.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || [];
    
    const items: NewsItem[] = itemMatches.slice(0, 20).map((itemXml): NewsItem => {
      return {
        title: parseXMLTag(itemXml, 'title') || '',
        link: parseXMLTag(itemXml, 'link') || '',
        description: parseXMLTag(itemXml, 'description') || '',
        pubDate: parseXMLTag(itemXml, 'pubDate') || '',
        guid: parseXMLTag(itemXml, 'guid') || '',
      };
    });

    const feedData: RSSFeed = {
      title,
      description,
      items,
    };

    return NextResponse.json(feedData);
  } catch (error) {
    console.error('RSS feed fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    );
  }
}
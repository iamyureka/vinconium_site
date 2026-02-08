import { XMLParser } from 'fast-xml-parser';

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    views: string;
    published: string;
    url: string;
}

export async function fetchLatestVideos(channelId: string): Promise<YouTubeVideo[]> {
    try {
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error('Failed to fetch RSS feed');

        const xmlData = await response.text();
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: ""
        });

        const jsonObj = parser.parse(xmlData);
        const entries = jsonObj.feed.entry || [];

        const entriesArray = Array.isArray(entries) ? entries : [entries];

        return entriesArray.map((entry: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
            id: entry['yt:videoId'],
            title: entry.title,
            thumbnail: entry['media:group']['media:thumbnail'].url,
            views: entry['media:group']['media:community']['media:statistics'].views,
            published: entry.published,
            url: `https://www.youtube.com/watch?v=${entry['yt:videoId']}`
        }));
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

export function formatViews(views: string): string {
    const num = parseInt(views, 10);
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return views;
}

export function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays >= 365) return `${Math.floor(diffInDays / 365)}Y AGO`;
    if (diffInDays >= 30) return `${Math.floor(diffInDays / 30)}M AGO`;
    if (diffInDays >= 7) return `${Math.floor(diffInDays / 7)}W AGO`;
    if (diffInDays > 0) return `${diffInDays}D AGO`;
    return 'TODAY';
}

export async function fetchChannelStats(_channelId: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
        const response = await fetch(`https://www.youtube.com/@vinconium`, {
            next: { revalidate: 3600 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch channel page');
        const html = await response.text();

        const subMatch = html.match(/"text":\s?\{\s?"content":\s?"([\d.kKmM]+)\s+subscribers"/) ||
            html.match(/"accessibilityLabel":\s?"([\d.kKmM]+)\s+subscribers"/);

        const videoMatch = html.match(/"text":\s?\{\s?"content":\s?"([\d,.]+)\s+videos"/);

        const viewMatch = html.match(/"viewCountText":\s?\{\s?"simpleText":\s?"(.*?)"\}/) ||
            html.match(/"text":\s?"([\d,.]+)\s+views"/);

        const subscribers = subMatch ? subMatch[1].toUpperCase() : 'SCANNING...';
        const videoCount = videoMatch ? videoMatch[1] : '---';
        const totalViews = viewMatch ? formatViews(viewMatch[1].replace(/[^\d]/g, '')) : 'SCANNING...';

        return {
            subscribers,
            totalViews,
            videoCount
        };
    } catch (error) {
        console.error('Error fetching YouTube stats:', error);
        return { subscribers: 'OFFLINE', totalViews: 'OFFLINE', videoCount: '---' };
    }
}

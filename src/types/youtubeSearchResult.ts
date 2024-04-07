// YouTube SearchResult Interface
export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: YouTubeVideoId | string;
  snippet: YouTubeVideoSnippet;
}

// YouTube Video ID Interface
interface YouTubeVideoId {
  kind: string;
  videoId: string;
}

// YouTube Video Snippet Interface
interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YouTubeThumbnails;
  channelTitle: string;
  liveBroadcastContent: 'live' | 'none';
  publishTime: string;
}

// YouTube Thumbnails Interface
interface YouTubeThumbnails {
  default: YouTubeThumbnail;
  medium: YouTubeThumbnail;
  high: YouTubeThumbnail;
}

// YouTube Thumbnail Interface
interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

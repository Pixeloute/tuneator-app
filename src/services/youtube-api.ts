
// YouTube API Integration for Tuneator
// Documentation: https://developers.google.com/youtube/v3/docs

const YOUTUBE_API_KEY = 'AIzaSyAAYKx9JatdsiDM6dPIT90nN-WI7EQ3maE';

// Types for YouTube API responses
export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

// Search for videos on YouTube
export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API error:', data.error);
      return [];
    }
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails
    }));
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return [];
  }
};

// Get video details from YouTube
export const getVideoDetails = async (videoId: string): Promise<YouTubeVideo | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error || !data.items || data.items.length === 0) {
      return null;
    }
    
    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      viewCount: item.statistics?.viewCount,
      likeCount: item.statistics?.likeCount,
      commentCount: item.statistics?.commentCount
    };
  } catch (error) {
    console.error('Error getting YouTube video details:', error);
    return null;
  }
};

// Get channel details from YouTube
export const getChannelDetails = async (channelId: string): Promise<YouTubeChannel | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error || !data.items || data.items.length === 0) {
      return null;
    }
    
    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails,
      subscriberCount: item.statistics?.subscriberCount,
      videoCount: item.statistics?.videoCount,
      viewCount: item.statistics?.viewCount
    };
  } catch (error) {
    console.error('Error getting YouTube channel details:', error);
    return null;
  }
};

// Find music videos for an artist/track
export const findMusicVideos = async (artist: string, track?: string): Promise<YouTubeVideo[]> => {
  try {
    const query = track ? `${artist} - ${track} official music video` : `${artist} official music video`;
    return await searchYouTubeVideos(query);
  } catch (error) {
    console.error('Error finding music videos:', error);
    return [];
  }
};

export default {
  searchYouTubeVideos,
  getVideoDetails,
  getChannelDetails,
  findMusicVideos
};

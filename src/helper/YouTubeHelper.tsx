const getThumbnail = (url: string) => {
  if (url.trim().toLowerCase().includes('youtube') || url.trim().toLowerCase().includes('youtu.be')) {
    try {
      const parsedUrl = new URL(url);
      const videoId = parsedUrl.searchParams.get('v');

      if (!videoId) {
        return url;
      }

      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } catch (error) {
      // console.error('Error parsing URL:', error);
      return url;
    }
  }

  return url;
}

const YouTubeHelper = {
  getThumbnail,
}

export default YouTubeHelper;

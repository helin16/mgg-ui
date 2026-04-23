import LocalMediaHelper from './LocalMediaHelper';
import YouTubeHelper from './YouTubeHelper';

const getThumbnail = (url: string) => {
  const localUrl = LocalMediaHelper.getThumbnail(url);
  if (localUrl !== url) {
    return localUrl;
  }

  const youtubeUrl = YouTubeHelper.getThumbnail(url);
  if (youtubeUrl !== url) {
    return youtubeUrl;
  }

  return url;
}

const AssetHelper = {
  getThumbnail
}

export default AssetHelper;

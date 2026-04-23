import {useState, useEffect} from 'react';
import moment from 'moment-timezone';


type iYouTubePlayer = {
  src: string;
  className?: string;
  onStart?: () => void;
  onEnd?: () => void;
}
const YouTubePlayer = ({src, className, onEnd, onStart}: iYouTubePlayer) => {
  const [htmlId, ] = useState(`youtube_${moment().unix()}`);

  useEffect(() => {
    const player: HTMLIFrameElement | null = document.querySelector(`iframe#${htmlId}`);
    if (player) {
      const messageListener = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') {
          switch (data.info) {
            case 1: // Playing
              onStart && onStart();
              break;
            case 0: // Ended
              onEnd && onEnd();
              break;
            default:
              break;
          }
        }
      };

      window.addEventListener('message', messageListener);

      return () => {
        window.removeEventListener('message', messageListener);
      };
    }
  }, [onStart, onEnd, htmlId]);

  return (
    <iframe
      className={className}
      id={htmlId}
      title="YouTube Video"
      src={src}
      frameBorder="0"
      // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  )
};

export default YouTubePlayer;

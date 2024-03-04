import React, { useRef, useEffect, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
export type VideoPlayer = ReactPlayer;

export type iVideoWithPlaceholder = ReactPlayerProps & {
  className?: string;
  src?: string;
  coverImg?: any;
  thumbnail?: boolean;
  placeHolder?: any;
};

const VideoWithPlaceholder = ({
  autoPlay,
  src,
  thumbnail,
  coverImg,
  className,
  ...props
}: iVideoWithPlaceholder) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [scriptUrl, setScriptUrl] = useState('');

  useEffect(() => {
    const fetchAssetManifest = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL || ''}/asset-manifest.json`);
        if (response.ok) {
          const data = await response.json();
          // Assuming the file you need is named reactPlayerFilePlayer.js
          const scriptUrl = data['reactPlayerFilePlayer.js'];
          setScriptUrl(scriptUrl);
        } else {
          console.error('Failed to fetch asset manifest');
        }
      } catch (error) {
        console.error('Error fetching asset manifest:', error);
      }
    };

    fetchAssetManifest();

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (scriptUrl) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [scriptUrl]);

  const getContent = () => {
    if (!src || src.trim() === "") {
      return null;
    }

    if (thumbnail === true) {
      return coverImg || null;
    }
    return (
      // @ts-ignore
      <ReactPlayer
        className={className}
        ref={playerRef}
        url={src}
        {...props}
      />
    );
  };

  return getContent();
};

export default VideoWithPlaceholder;

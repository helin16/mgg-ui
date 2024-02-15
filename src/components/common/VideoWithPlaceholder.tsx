import React, { useEffect, useRef, useState, useCallback } from "react";

interface VideoWithPlaceholderProps {
  autoPlay?: boolean;
  mimeType?: string;
  className?: string;
  src: string;
  coverImg?: any;
  thumbnail?: boolean;
  placeHolder?: any;
}

const VideoWithPlaceholder: React.FC<VideoWithPlaceholderProps> = ({
  mimeType,
  autoPlay,
  src,
  thumbnail,
  coverImg,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setIsPlaying] = useState<boolean>(false);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.paused) {
        video
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing video:", error);
          });
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  useEffect(() => {
    if (autoPlay === true) {
      togglePlay();
    }
  }, [autoPlay, togglePlay]);

  const getContent = () => {
    if (!src || src.trim() === "") {
      return null;
    }

    if (thumbnail === true) {
      return coverImg || null;
    }

    return (
      <video className={className} ref={videoRef} controls onClick={togglePlay}>
        <source src={src} type={mimeType || "video/mp4"} />
        Your browser does not support the video tag.
      </video>
    );
  };

  return getContent();
};

export default VideoWithPlaceholder;

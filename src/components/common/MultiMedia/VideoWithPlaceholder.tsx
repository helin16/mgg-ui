import React, { useRef } from "react";
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

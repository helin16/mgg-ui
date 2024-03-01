import React, { useRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import styled from "styled-components";

const Wrapper = styled.div``;
export type VideoPlayer = ReactPlayer;

export type iVideoWithPlaceholder = ReactPlayerProps & {
  autoPlay?: boolean;
  className?: string;
  src?: string;
  coverImg?: any;
  thumbnail?: boolean;
  placeHolder?: any;
  controls?: boolean;
};

const VideoWithPlaceholder = ({
  autoPlay,
  src,
  thumbnail,
  coverImg,
  controls = true,
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
      <Wrapper className={className}>
        {/*// @ts-ignore*/}
        <ReactPlayer
          ref={playerRef}
          url={src}
          width="100%"
          height="100%"
          {...props}
        />
      </Wrapper>
    );
  };

  return getContent();
};

export default VideoWithPlaceholder;

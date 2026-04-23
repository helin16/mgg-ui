import React, {useRef} from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
export type VideoPlayer = ReactPlayer;

export type iVideoWithPlaceholder = ReactPlayerProps & {
  className?: string;
  src?: string;
  coverImg?: any;
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
  // const [isBuffering, setIsBuffering] = useState(true);

  const getContent = () => {
    if (!src || src.trim() === "") {
      return null;
    }

    return (
      <>
        {/*// @ts-ignore*/}
        <ReactPlayer
          className={className}
          ref={playerRef}
          url={src}
          // onBuffer={() => {
          //   setIsBuffering(true);
          // }}
          // onBufferEnd={() => {
          //   setIsBuffering(false);
          // }}
          {...props}
        />
        {/*{isBuffering === true ? (coverImg || null) : null}*/}
      </>
    );
  };

  return getContent();
};

export default VideoWithPlaceholder;

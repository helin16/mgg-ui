import iAsset from "../../types/asset/iAsset";
import styled from "styled-components";
import ImageWithPlaceholder from "../common/MultiMedia/ImageWithPlaceholder";
import { FlexContainer } from "../../styles";
import { Spinner } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import VideoWithPlaceholder from "../common/MultiMedia/VideoWithPlaceholder";

type iAssetThumbnail = {
  asset: iAsset;
  className?: string;
  onClick?: (asset: iAsset) => void;
};

const Wrapper = styled.div`
  height: 100%;
  min-width: 12rem;
  min-height: 8rem;
  border: 4px solid white;
  background-color: white;
  position: relative;

  .asset-img,
  .img-placeholder,
  .video-thumb,
  .video-tag-bg {
    position: absolute;
    left: 0px;
    right: 0px;
    height: 100%;
    width: 100%;
  }

  .video-thumb {
    z-index: 9;
  }

  .asset-img {
    object-fit: contain;
  }
  .video-tag-bg {
    font-size: 42px;
    color: white;
    z-index: 10;
    background-color: rgba(100, 100, 100, 0.75);
  }
`;
const AssetThumbnail = ({ asset, className, onClick }: iAssetThumbnail) => {
  const getImagePlaceHolder = () => {
    return (
      <FlexContainer
        className={
          "img-placeholder flex-column justify-content-center align-items-center"
        }
      >
        <Spinner animation={"border"} />
      </FlexContainer>
    );
  };

  const getThumbnail = () => {
    if (
      `${asset.mimeType}`
        .trim()
        .toLowerCase()
        .startsWith("video")
    ) {
      return (
        <>
          <VideoWithPlaceholder
            coverImg={getImagePlaceHolder()}
            src={asset.url || ""}
            width={"100%"}
            height={"100%"}
            className={"video-thumb"}
          />
          <FlexContainer
            className={
              "video-tag-bg justify-content-center align-items-center flex-column"
            }
          >
            <Icons.Play />
          </FlexContainer>
        </>
      );
    }

    return (
      <ImageWithPlaceholder
        src={asset.url || ""}
        className={"asset-img"}
        placeholder={getImagePlaceHolder()}
      />
    );
  };

  return (
    <Wrapper
      className={`${className || ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={() => {
        onClick && onClick(asset);
      }}
    >
      {getThumbnail()}
    </Wrapper>
  );
};

export default AssetThumbnail;

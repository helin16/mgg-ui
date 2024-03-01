import iAsset from "../../types/asset/iAsset";
import styled from "styled-components";
import ImageWithPlaceholder from "../common/MultiMedia/ImageWithPlaceholder";
import { FlexContainer } from "../../styles";
import { Spinner } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";

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
  .video-tag-bg {
    position: absolute;
    left: 0px;
    right: 0px;
    height: 100%;
    width: 100%;
  }

  .asset-img {
    object-fit: contain;
  }
  .video-tag-bg {
    font-size: 42px;
    color: white;
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

  const getVideoTag = () => {
    if (
      `${asset.mimeType}`
        .trim()
        .toLowerCase()
        .startsWith("video")
    ) {
      return (
        <FlexContainer
          className={
            "video-tag-bg justify-content-center align-items-center flex-column"
          }
        >
          <Icons.Play />
        </FlexContainer>
      );
    }

    return null;
  };

  return (
    <Wrapper
      className={`${className || ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={() => {
        onClick && onClick(asset);
      }}
    >
      <ImageWithPlaceholder
        src={asset.url || ""}
        className={"asset-img"}
        placeholder={getImagePlaceHolder()}
      />
      {getVideoTag()}
    </Wrapper>
  );
};

export default AssetThumbnail;

import { Image, ImageProps } from "react-bootstrap";
import React, { useState } from "react";
import PageLoadingSpinner from "./PageLoadingSpinner";

interface iImageWithPlaceholder extends ImageProps {
  placeholder?: any;
}

export const getImagePlaceHolder = (className?: string) => {
  return (
    <PageLoadingSpinner className={`img-placeholder ${className || ""}`} />
  );
};

const ImageWithPlaceholder = ({
  placeholder,
  onLoad,
  ...props
}: iImageWithPlaceholder) => {
  const [isLoading, setIsLoading] = useState(true);

  const getPlaceholder = () => {
    if (isLoading !== true) {
      return null;
    }
    return placeholder;
  };

  return (
    <>
      {getPlaceholder()}
      <Image
        {...props}
        onLoad={(e) => {
          setIsLoading(false);
          onLoad && onLoad(e);
        }}
        style={{ display: isLoading === true ? "none" : "block" }}
      />
    </>
  );
};

export default ImageWithPlaceholder;

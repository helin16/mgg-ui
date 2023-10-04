import {Image, ImageProps} from 'react-bootstrap';
import {useState} from 'react';

interface iImageWithPlaceholder extends ImageProps {
  placeholder?: any;
}

const ImageWithPlaceholder = ({placeholder, ...props}: iImageWithPlaceholder) => {
  const [isLoading, setIsLoading] = useState(true);

  const getPlaceholder = () => {
    if (isLoading !== true) {
      return null;
    }
    return placeholder;
  }

  return (
    <>
      {getPlaceholder()}
      <Image {...props} onLoad={() => setIsLoading(false)} style={{display: isLoading === true ? 'none' : 'block'}}/>
    </>
  )
}

export default ImageWithPlaceholder;

const getImgUrl = (assetUrl: string) => {
  return `${assetUrl || ''}`.trim().replace('.mp4', '.jpg');
}

type iImgScale = {
  width?: number;
  height?: number;
  quality?: number;
  showThumb?: boolean;
  showFit?: boolean;
  showFill?: boolean;
}
const getScaledImgUrl = (assetUrl: string, scale: iImgScale = {} ) => {
  const url = getImgUrl(assetUrl);
  const scaleParams = [
    ...(scale.showThumb !== true ? [] : [`c_thumb`]),
    ...(scale.showFit !== true ? [] : [`c_fit`]),
    ...(scale.showFill !== true ? [] : [`c_fill`]),
    ...(`${scale.width || ''}`.trim() === '' ? [] : [`w_${`${(scale.width || '')}`.trim()}`]),
    ...(`${scale.height || ''}`.trim() === '' ? [] : [`h_${`${(scale.height || '')}`.trim()}`]),
    ...(`${scale.quality || ''}`.trim() === '' ? ['q_auto'] : [`q_${`${(scale.quality || '')}`.trim()}`]),
  ]

  if (scaleParams.length <= 0) {
    return url;
  }
  const urlParts = getImgUrl(url).split('/');
  urlParts.splice(urlParts.length - 3 , 0, scaleParams.join(','));
  urlParts.splice(urlParts.length - 3 , 0, 'f_auto');
  return urlParts.join('/');
}

const getThumbnailUrl = (assetUrl: string) => {
  return getScaledImgUrl(assetUrl, {
    height: 200,
    width: 300,
    showFit: true
  })
}

const CloudinaryHelper = {
  getImgUrl,
  getScaledImgUrl,
  getThumbnailUrl,
}

export default CloudinaryHelper;

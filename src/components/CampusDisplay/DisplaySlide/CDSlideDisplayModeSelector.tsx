import Select from 'react-select';
import {iSelectBox} from '../../common/SelectBox';

type iCDSlideDisplayModeSelector = iSelectBox & {
  options?: any[],
}

export const CD_DISPLAY_MODE_FULL_SCREEN_FIT = 'fullscreen_contain';
export const CD_DISPLAY_MODE_FULL_SCREEN_FILL = 'fullscreen_cover';
const CDSlideDisplayModeSelector = ({options, value, ...props}: iCDSlideDisplayModeSelector) => {

  const opts = [{
    label: <div><b>Full Screen Fit</b><div><small>Showing the whole image to fit the screen, will not lose any part of the image</small></div></div>,
    value: CD_DISPLAY_MODE_FULL_SCREEN_FIT,
  }, {
    label: <div><b>Full Screen Fill</b>
      <div><small>Showing the whole image to fill the screen, may lose any part of the image</small></div>
    </div>,
    value: CD_DISPLAY_MODE_FULL_SCREEN_FILL,
  }, {
    label: <div><b>Fit with blurry background</b>
      <div><small>Default style, will not lose any part of the image</small></div>
    </div>,
    value: '',
  }];

  const getSelectedValue = () => {
    const selectedOptions = opts.filter(opt => value === opt.value);
    return selectedOptions.length <= 0 ? null : selectedOptions[0];
  }

  return (
    <Select
      options={opts}
      value={getSelectedValue()}
      {...props}
    />
  )
}

export default CDSlideDisplayModeSelector;

import AsyncSelect, {AsyncProps} from 'react-select/async';
import {iSelectOptionProps} from './SelectBox';

type iAsyncSelectBox = AsyncProps<any, any, any>
const AsyncSelectBox = (props: iAsyncSelectBox) => {
  return <AsyncSelect<iSelectOptionProps> {...props} />
}

export default AsyncSelectBox

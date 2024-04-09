
import * as Icons from 'react-bootstrap-icons';

type iIconDisplay = Icons.IconProps & {
  name: string;
}
const IconDisplay = ({name, ...props}: iIconDisplay) => {
  // @ts-ignore
  const Component = (name in Icons) ? Icons[name] : null;

  if (Component === null) {
    return <Icons.Star {...props} />
  }

  return <Component {...props} />
}

export default IconDisplay;

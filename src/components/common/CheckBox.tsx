import {Form} from 'react-bootstrap';

type iCheckBox = any;
const CheckBox = ( props: iCheckBox) => {
  return <Form.Check {...props} />
}

export default CheckBox;

import {Spinner} from 'react-bootstrap';
import styled from 'styled-components';


const Wrapper = styled.div`
  text-align: center;
`;

type iPageLoadingSpinner = {
  text?: any;
  spinner?: any;
  className?: string;
}
const PageLoadingSpinner = ({className, text, spinner}: iPageLoadingSpinner) => {
  return (
    <Wrapper className={className}>
      {text || <h5>Loading...</h5>}
      {spinner || <Spinner animation={'border'} />}
    </Wrapper>
  )
}

export default PageLoadingSpinner

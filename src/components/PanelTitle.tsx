import styled from 'styled-components';
import {mainBlue} from '../AppWrapper';

const Wrapper = styled.div`
  color: #fff;
  background-color: ${mainBlue};
  padding: 10px 15px;
  border-radius: 4px;
`

const PanelTitle = ({children}: {children: any}) => {
  return (
    <Wrapper>{children}</Wrapper>
  )
};

export default PanelTitle

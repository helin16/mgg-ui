import styled from 'styled-components';
import {mainBlue} from '../AppWrapper';

const Wrapper = styled.div`
  color: #fff;
  background-color: ${mainBlue};
  padding: 10px 15px;
  border-radius: 4px;
`
type iPanelTitle = {children: any, className?: string};
const PanelTitle = ({children, className}: iPanelTitle) => {
  return (
    <Wrapper className={`${className || ''} panel-title`}>{children}</Wrapper>
  )
};

export default PanelTitle

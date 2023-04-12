import styled from 'styled-components';
import {mainBlue} from '../../AppWrapper';

type iPanel = {
  title: any;
  children: any;
  className?: string;
}

const Wrapper = styled.div`
  border: 1px ${mainBlue} solid;
  border-radius: 4px;
  
  .panel-title {
    padding: 4px 8px;
    color: #fff;
    background-color: ${mainBlue};
  }
  .panel-body {
    padding: 0.6rem;
  }
`
const Panel = ({title, children, className}: iPanel) => {
  return (
    <Wrapper className={className}>
      <div className={'panel-title'}>{title}</div>
      <div className={'panel-body'}>{children}</div>
    </Wrapper>
  )
}

export default Panel;

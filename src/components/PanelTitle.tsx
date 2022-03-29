import styled from 'styled-components';

const Wrapper = styled.div`
  color: #fff;
  background-color: #337ab7;
  border-color: #337ab7;
  padding: 10px 15px;
  border-radius: 4px;
`

const PanelTitle = ({children}: {children: any}) => {
  return (
    <Wrapper>{children}</Wrapper>
  )
};

export default PanelTitle

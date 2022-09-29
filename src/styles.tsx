import styled from 'styled-components';

export const FlexContainer = styled.div`
  display: flex;
  
  &.withGap {
    > * {
      padding: 2px;
    }
  }
  
  &.justify-content {
    &.space-between {
      justify-content: space-between;
    }
  }
`

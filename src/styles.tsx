import styled from 'styled-components';

export const FlexContainer = styled.div`
  display: flex;
  //width: 100%;
  &.withGap {
    > * {
      padding: 2px;
      margin: 2px;
    }
  }
  
  &.flex-wrap {
    &.wrap {
      flex-wrap: wrap;
    }
  }
  
  &.justify-content {
    &.space-between {
      justify-content: space-between;
    }
    &.flex-end {
      justify-content: flex-end;
    }
  }
  
  &.align-items {
    &.center {
      align-items: center;
    }
  }

  &.space-below {
    margin-bottom: 0.8rem;
  }

  &.wrap {
    flex-wrap: wrap;
  }
  &.full-width {
    width: 100%;
  }
  
  .full-width {
    width: 100%;
  }
`

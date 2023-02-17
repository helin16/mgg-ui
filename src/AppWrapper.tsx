import styled from 'styled-components';

export const mainBlue = `#0066b0`;
export const lightBlue = `#d9edf7`;
export const mainRed = `#a50000`;
export const mainGapInPx = 10;

const AppWrapper = styled.div`
  &.test-app {
    background-color: rgba(0, 0, 0, 0.1);
    min-height: 100vh;
    :before {
      z-index: 999999;
      display: inline-block;
      content: 'Test Mode';
      position: fixed;
      right: 0px;
      bottom: 0px;
      background-color: ${mainRed};
      opacity: 70%;
      color: white;
      padding: 8px;
    }
  }
  
  font-size: 13px;
  
  .flexbox {
    display: flex;
    
    &.space-between{
      justify-content: space-between;
    }
    
    &.align-items-stretch {
      align-items: stretch;
    }
  }

  .flexbox-inline {
    display: inline-flex;
  }

  .flexbox-align-items-center {
    align-items: center;
  }

  .btn-primary {
    background-color: ${mainBlue};
    border-color: #2e6da4;
  }

  .text-uppercase {
    text-transform: uppercase;
  }
  
  .text-left {
    text-align: left;
  }
  
  .text-right {
    text-align: right;
  }
  
  .text-center {
    text-align: center;
  }

  .text-italic {
    font-style: italic;
  }

  .text-danger {
    color: ${mainRed} !important;
  }

  .pull-left {
    float: left !important;
  }

  .pull-right {
    float: right !important;
  }

  a {
    text-decoration: none !important;
  }
  
  button {
    min-height: auto;
    &.btn-link:hover {
      background-color: transparent;
    }
  }

  .btn-link {
    text-decoration: none !important;
    color: ${mainBlue} !important;
  }

  .btn-link:focus {
    box-shadow: none !important;
  }

  ol,
  ul {
    padding-left: 4px !important;
    margin-left: 18px;
  }
  
  .form-control {
    border: 1px solid #ced4da;
  }
  
  .space {
    &.bottom {
      margin-bottom: ${mainGapInPx}px;
    }

    &.top {
      margin-top: ${mainGapInPx}px;
    }
  }
  
  .cursor {
    cursor: pointer;
  }
  
`
export default AppWrapper;

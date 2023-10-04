import styled from 'styled-components';

export const mainBlue = `#0066b0`;
export const lightBlue = `#d9edf7`;
export const mainRed = `#a50000`;
export const mainGreen = `#198754`;
export const lightGreen = `#3AC1CD`;
export const submitBtnBg = lightGreen;
export const submitBtnHoverBg = 'rgb(97, 205, 215)';
export const submitBtnTextColor = '#ffffff';
export const mainGapInPx = 10;
export const tableStripeBgColor = '#f9f9f9';
export const tableStripHoverBgColor = '#f5f5f5';

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

    &.space-between {
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

    &.is-invalid,
    &:invalid {
      border-color: #dc3545;
    }
  }

  .space {
    &.bottom {
      margin-bottom: ${mainGapInPx}px;
    }

    &.bottom-lg {
      margin-bottom: 1rem;
    }

    &.top {
      margin-top: ${mainGapInPx}px;
    }
  }

  .padding-space {
    &.bottom {
      padding-bottom: ${mainGapInPx}px;
    }

    &.top {
      padding-top: ${mainGapInPx}px;
    }
  }

  .cursor {
    cursor: pointer;
  }
  
  .stripe:nth-child(2n+1) {
    background-color: ${tableStripeBgColor};
  }

  .hover:hover {
    background-color: ${tableStripHoverBgColor};
  }

  .border {
    &.bottom {
      border-bottom: 1px #ddd solid;
    }
  }

  .space-below {
    margin-bottom: 0.8rem;
  }
  
  .space-above {
    margin-top: 0.8rem;
  }
`
export default AppWrapper;

import styled from "styled-components";

export const mainBlue = `#0066b0`;
export const lightBlue = `#d9edf7`;
export const mainRed = `#a50000`;
export const mainGray = `#cecece`;
export const mainGreen = `#198754`;
export const lightGreen = `#3AC1CD`;
export const dangerRed = `#dc3545`;
export const borderGrey = "#ced4da";
export const submitBtnBg = lightGreen;
export const submitBtnHoverBg = "rgb(97, 205, 215)";
export const submitBtnTextColor = "#ffffff";
export const mainGapInPx = 10;
export const tableStripeBgColor = "#f9f9f9";
export const tableStripHoverBgColor = "#f5f5f5";

const AppWrapper = styled.div`
  font-family: "DM Serif Display", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
    Noto Color Emoji;

  color: #000;
  font-size: 0.865rem;
  line-height: 1.45;

  label {
    font-weight: 600;
  }

  &.test-app {
    background-color: rgba(0, 0, 0, 0.1);
    min-height: 100vh;

    :before {
      z-index: 999999;
      display: inline-block;
      content: "Test Mode";
      position: fixed;
      right: 0px;
      bottom: 0px;
      background-color: ${mainRed};
      opacity: 70%;
      color: white;
      padding: 8px;
    }
  }

  .highcharts-credits {
    display: none;
  }

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
    border: 1px solid ${borderGrey};

    &.is-invalid,
    &:invalid {
      border-color: ${dangerRed};
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

  .stripe:nth-child(2n + 1) {
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

  .mconnect-heading {
    color: rgb(0, 82, 137);
    font-size: 2.5rem;
    font-weight: 400;
    letter-spacing: -0.05em;
    padding-top: 0.5rem;
    margin-top: 0;
  }
  @media only screen and (min-width: 1024px) {
    .mconnect-heading {
      font-size: 3rem;
      line-height: 46px;
      line-height: 1;
    }
  }
  .mconnect-heading:before {
    background-color: rgb(229, 39, 37);
    border-radius: 0.5rem;
    content: "";
    height: 5px;
    left: 0;
    position: relative;
    top: -0.4rem;
    width: 3.5rem;
    display: block;
  }

  .mconnect_submit_button,
  .mconnect_submit_button:focus,
  .mconnect_submit_button:visited {
    font-family: Gill Sans, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
      sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
      Noto Color Emoji;
    border-radius: 0.25rem;
    background-color: rgb(246, 242, 236);
    color: rgb(0, 49, 82);
    cursor: pointer;
    font-weight: 500;
    font-size: 17px;
    line-height: 21px;
    padding: 15px;
    white-space: nowrap;
    text-decoration: none;
  }
  .mconnect_submit_button (min-width: 1024px) {
    font-size: 1.25rem;
    line-height: 1.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
  .mconnect_submit_button (min-width: 768px) {
    text-align: center;
  }
  .mconnect_submit_button:hover {
    background-color: rgb(229, 39, 37);
    color: rgb(255, 254, 252);
    text-decoration: none;
  }
  .mconnect_selectbox {
    > [class$="-control"] {
      appearance: none !important;
      background-color: #fff;
      border-style: solid;
      border-width: 0.0625rem;
      border-color: rgb(0, 82, 137);
      color: #000;
      font-size: 0.8125rem;
      padding: 0.25rem;
      border-radius: 0;
      height: 2.75rem;
    }
  }
  .mconnect_textarea {
      appearance: none;
      border-radius: 0;
      border-style: solid;
      border-width: .0625rem;
      display: block;
      font-size: .8125rem;
      height: auto;
      margin: 0 0 1rem 0;
      padding: .5rem .7rem;
  }
`;
export default AppWrapper;

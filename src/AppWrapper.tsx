import styled from 'styled-components';

export const mainBlue = `#0066b0`;
export const mainRed = `#a50000`;

const AppWrapper = styled.div`
  font-size: 13px;
  
  .flexbox {
    display: flex;
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
`
export default AppWrapper;

import styled from 'styled-components';

const AppWrapper = styled.div`
  font-size: 13px;

  .btn-primary {
    background-color: #337ab7;
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
    color: #a94442 !important;
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

  .btn-primary {
    background-color: #337ab7 !important;
    border-color: #2e6da4 !important;
  }

  .btn-link {
    text-decoration: none !important;
    color: #337ab7 !important;
  }

  .btn-link:focus {
    box-shadow: none !important;
  }

  ol,
  ul {
    padding-left: 4px !important;
    margin-left: 18px;
  }
`
export default AppWrapper;

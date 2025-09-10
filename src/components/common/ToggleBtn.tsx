import Switch from 'react-switch'
import styled, {CSSProperties} from 'styled-components';

type iToggle = {
  className?: string;
  isDisabled?: boolean;
  style?: CSSProperties;
  btnStyle?: string;
  size?: 'lg' | 'sm' | 'xs';
  on: any;
  off: any;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
const Wrapper = styled.div`
  display: inline-block;
    
  input[type="checkbox"] {
      display: none;
  }
  
  &.disabled {
    .btn {
      cursor: initial !important;
    }
    .btn-success {
      background-color: #777 !important;
      border-color:  #777 !important;
    }
  }
  
  .switch {
    span {
      position: absolute;
      line-height: 1.5;
      font-weight: 300;
      text-transform: none;
      font-size: 12px;
      transition: opacity 0.15s ease-out 0s;
      top: 0px;
      text-align: center;
      color: white;
      opacity: 100%;
      padding: 6px;

      &.switch-on {
        padding-right: 0.8rem;
      }
      &.switch-off {
        padding-left: 0.8rem;
        color: #777 !important;
      }
    }
  }
  
  .switch-handle {
    background-color: white !important;
    position: relative !important;
    right: 0px !important;
  }
  .switch-off {
    background-color: #ccc !important;
  }
  
  .btn {
    margin: 0px; 
  }
`
const ToggleBtn = ({
  size, on, off, checked, onChange, className, style, btnStyle, isDisabled
}: iToggle) => {

  return (
    <Wrapper className={`${className || ''} ${isDisabled === true ? 'disabled' : ''}`} style={style}>
      {/*// @ts-ignore*/}
      <Switch
        disabled={isDisabled}
        checked={checked}
        style={btnStyle}
        onstyle={'success'}
        size={size}
        onlabel={on}
        offlabel={off}
        onChange={onChange}
      />
    </Wrapper>
  )
}

export default ToggleBtn;

import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import styled, {CSSProperties} from 'styled-components';

type iToggle = {
  className?: string;
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
  size, on, off, checked, onChange, className, style, btnStyle
}: iToggle) => {

  return (
    <Wrapper className={className} style={style}>
      <BootstrapSwitchButton
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

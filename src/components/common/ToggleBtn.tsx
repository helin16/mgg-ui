import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import styled from 'styled-components';

type iToggle = {
  size?: 'lg' | 'sm' | 'xs';
  on: any;
  off: any;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
const Wrapper = styled.div`
  display: inline-block;
  .btn-xs {
    font-size: 12px;
    padding: 1px;
    &.switch-on {
      padding-right: 0.8rem;
    }
    &.switch-off {
      padding-left: 0.8rem;
    }
  }
  .switch-handle {
    background-color: white !important;
  }
  .switch-off {
    background-color: #ccc !important;
  }
`
const ToggleBtn = ({
  size, on, off, checked, onChange
}: iToggle) => {

  return (
    <Wrapper>
      <BootstrapSwitchButton
        checked={checked}
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

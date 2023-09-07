import styled from 'styled-components';

type iPopupPanel = {
  header?: any;
  children: any;
  footer?: any;
  className?: string;
}


const Wrapper = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  background-color: rgba(100, 100, 100, 0.76);
  z-index: 1002; // fixing it for school box
  
  .popup-panel {
    border-radius: 6px;
    background-color: white;
    padding: 1.5rem;
  }
`;

const PopupPanel = ({header, children, footer, className}: iPopupPanel) => {
  return (
    <Wrapper className={`popup-panel-mask ${className}`}>
      <div className={'popup-panel'}>
        {header ? <div className={'popup-panel-header'}>{header}</div> : null}
        <div className={'popup-panel-body'}>{children}</div>
        {footer ? <div className={'popup-panel-footer'}>{footer}</div> : null}
      </div>
    </Wrapper>
  )
}

export default PopupPanel;

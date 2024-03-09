import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const Popup = styled.div<{ $timeout: number }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: background-color ${props => props.$timeout}ms ease;

  &.popup--open {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &:not(.popup--open) {
    pointer-events: none;
  }

  .popup__child-enter {
    opacity: 0;
    transform: scale(0.25);
  }

  .popup__child-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: all ${props => props.$timeout}ms;
  }

  .popup__child-exit {
    opacity: 1;
    transform: scale(1);
  }

  .popup__child-exit-active {
    opacity: 0;
    transform: scale(0.25);
    transition: all ${props => props.$timeout}ms;
  }
`;

type VPopupProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  timeout?: number;
};

export const VPopup: React.FC<VPopupProps> = props => {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef(null);

  const timeout = props.timeout ?? 150;

  useEffect(() => setOpen(props.open), [props.open]);

  return (
    <Popup $timeout={timeout} className={open ? 'popup--open' : ''} onClick={() => setOpen(false)}>
      <CSSTransition
        in={open}
        timeout={timeout}
        mountOnEnter
        unmountOnExit
        onExited={props.onClose}
        classNames="popup__child"
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="popup__child" onClick={event => event.stopPropagation()}>
          {props.children}
        </div>
      </CSSTransition>
    </Popup>
  );
};

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const TIMEOUT = 250;

const StyledVDrawerContainer = styled.div<{ $width: string }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  transition: background-color ${TIMEOUT}ms ease;

  &.drawerContainer--open {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &:not(.drawerContainer--open) {
    pointer-events: none;
  }

  .drawerContainer__drawer {
    width: ${props => props.$width};
    height: 100%;
    background-color: #2c2c2c;
    display: flex;
    flex-direction: column;
    box-shadow: -3px 6px 12px rgba(0, 0, 0, 0.1);

    .drawer__header {
      display: flex;
      justify-content: center;
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 24px;
      padding: 18px;
      border-bottom: 1px solid #585858;
    }
  }

  .drawerContainer__drawer-enter {
    transform: translateX(${props => props.$width});
  }

  .drawerContainer__drawer-enter-active {
    transform: translateX(0);
    transition: transform ease ${TIMEOUT}ms;
  }

  .drawerContainer__drawer-exit {
    transform: scale(1);
  }

  .drawerContainer__drawer-exit-active {
    transform: translateX(${props => props.$width});
    transition: transform ease ${TIMEOUT}ms;
  }
`;

const FrozenScrollStyle = createGlobalStyle`
  body {
    overflow: hidden;
    padding-right: 18px;
  }
`;

export type VDrawerProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  width: number;
  header?: ReactNode;
  className?: string;
};

export const VDrawer: React.FC<VDrawerProps> = props => {
  const [open, setOpen] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => setOpen(props.open), [props.open]);

  return (
    <StyledVDrawerContainer
      $width={`${props.width}px`}
      className={`${props.className ?? ''} ${open ? 'drawerContainer--open' : ''}`}
      onClick={() => setOpen(false)}
    >
      {open && <FrozenScrollStyle />}
      <CSSTransition
        in={open}
        timeout={TIMEOUT}
        mountOnEnter
        unmountOnExit
        onExited={props.onClose}
        classNames="drawerContainer__drawer"
        nodeRef={nodeRef}
      >
        <div
          ref={nodeRef}
          className="drawerContainer__drawer"
          onClick={event => event.stopPropagation()}
        >
          {props.header && <div className="drawer__header">{props.header}</div>}
          {props.children}
        </div>
      </CSSTransition>
    </StyledVDrawerContainer>
  );
};

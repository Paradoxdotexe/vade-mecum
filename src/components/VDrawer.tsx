import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useFrozenScroll } from '@/utils/useFrozenScroll';

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
    background-color: ${props => props.theme.color.background.backdrop};
  }

  &:not(.drawerContainer--open) {
    pointer-events: none;
  }

  .drawerContainer__drawer {
    width: ${props => props.$width};
    height: 100%;
    background-color: ${props => props.theme.color.background.default};
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 16px ${props => props.theme.color.shadow.default};

    .drawer__header {
      display: flex;
      justify-content: center;
      font-family: ${props => props.theme.variable.fontFamily.display};
      font-size: ${props => props.theme.variable.fontSize.xl};
      padding: ${props => props.theme.variable.gap.lg};
      border-bottom: 1px solid ${props => props.theme.color.border.default};
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

  useFrozenScroll(open);

  return (
    <StyledVDrawerContainer
      $width={`${props.width}px`}
      className={`${props.className ?? ''} ${open ? 'drawerContainer--open' : ''}`}
      onMouseDown={() => setOpen(false)}
    >
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
          onMouseDown={event => event.stopPropagation()}
        >
          {props.header && <div className="drawer__header">{props.header}</div>}
          {props.children}
        </div>
      </CSSTransition>
    </StyledVDrawerContainer>
  );
};

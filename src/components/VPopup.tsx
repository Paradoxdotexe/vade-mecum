import React, { ReactNode, useEffect, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { VTransition } from './VTransition';

const StyledVPopup = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: background-color 150ms ease;

  &.popup--open {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &:not(.popup--open) {
    pointer-events: none;
  }
`;

const FrozenScrollStyle = createGlobalStyle`
  body {
    overflow: hidden;
    padding-right: 18px;
  }
`;

type VPopupProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
};

export const VPopup: React.FC<VPopupProps> = props => {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(props.open), [props.open]);

  return (
    <StyledVPopup className={open ? 'popup--open' : ''} onClick={() => setOpen(false)}>
      {open && <FrozenScrollStyle />}
      <VTransition
        in={open}
        outStyle={css`
          opacity: 0;
          transform: scale(0.25);
        `}
        inStyle={css`
          opacity: 1;
          transform: scale(1);
        `}
        onExited={props.onClose}
      >
        {props.children}
      </VTransition>
    </StyledVPopup>
  );
};

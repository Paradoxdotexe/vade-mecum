import React, { ReactNode, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { VTransition } from './VTransition';
import { FrozenGlobalStyle } from '@/common/PageWrapper';

const StyledVPopup = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
  transition: background-color 150ms ease;
  padding: ${props => props.theme.variable.gap.xxl};

  &.popup--open {
    background-color: ${props => props.theme.color.background.backdrop};
  }

  &:not(.popup--open) {
    pointer-events: none;
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
    <StyledVPopup className={open ? 'popup--open' : ''} onMouseDown={() => setOpen(false)}>
      {open && <FrozenGlobalStyle />}
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
        <div onMouseDown={event => event.stopPropagation()}>{props.children}</div>
      </VTransition>
    </StyledVPopup>
  );
};

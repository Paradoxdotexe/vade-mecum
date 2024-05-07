import React, { ReactNode } from 'react';
import { VPopup } from './VPopup';
import styled from 'styled-components';

const StyledVModal = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.color.background.default};
  box-shadow: 4px 2px 16px ${props => props.theme.color.shadow.default};
  border-radius: ${props => props.theme.variable.borderRadius};

  .modal__header {
    display: flex;
    justify-content: center;
    font-family: ${props => props.theme.variable.fontFamily.display};
    font-size: ${props => props.theme.variable.fontSize.xl};
    padding: ${props => props.theme.variable.gap.lg};
    border-bottom: 1px solid ${props => props.theme.color.border.default};
  }
`;

type VModalProps = {
  open: boolean;
  onClose?: () => void;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  width?: string | number;
};

export const VModal: React.FC<VModalProps> = props => {
  return (
    <VPopup open={props.open} onClose={props.onClose}>
      <StyledVModal className={props.className} style={{ width: props.width }}>
        {props.header && <div className="modal__header">{props.header}</div>}
        {props.children}
      </StyledVModal>
    </VPopup>
  );
};

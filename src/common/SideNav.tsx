import React from 'react';
import styled from 'styled-components';
import { ReactComponent as VadeMecumLogo } from '@/icons/VadeMecumLogo.svg';

export const SIDE_NAV_WIDTH = '260px';

const StyledSideNav = styled.div`
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  width: ${SIDE_NAV_WIDTH};
  height: 100vh;
  background: ${props => props.theme.color.background.default};
  border-right: 1px solid ${props => props.theme.color.border.default};

  .sideNav__logo {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    padding: ${props => props.theme.variable.gap.lg} ${props => props.theme.variable.gap.xl};
    background-color: ${props => props.theme.color.brand.default};
    color: ${props => props.theme.color.text.contrast};
    margin-right: -1px;
    font-family: ${props => props.theme.variable.fontFamily.bold};
    font-size: 20px;

    svg {
      height: 20px;
    }
  }
`;

export const SideNav: React.FC = () => {
  return (
    <StyledSideNav>
      <div className="sideNav__logo">
        <VadeMecumLogo />
        Vade Mecum
      </div>
    </StyledSideNav>
  );
};

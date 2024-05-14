import React from 'react';
import styled from 'styled-components';
import { ReactComponent as VadeMecumLogo } from '@/icons/VadeMecumLogo.svg';
import { useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from './SideNav';
import { opacify } from 'polished';

export const TOP_NAV_HEIGHT = '50px';

const StyledTopNav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.variable.gap.xl};
  height: ${TOP_NAV_HEIGHT};
  width: 100%;
  background-color: ${props => props.theme.color.brand.default};
  box-shadow: 0 4px 16px ${props => props.theme.color.shadow.default};
  z-index: 500;
  padding: 0 ${props => props.theme.variable.gap.lg};
  color: ${props => props.theme.color.text.contrast};

  .topNav__logo {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    font-family: ${props => props.theme.variable.fontFamily.display};
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;

    svg {
      height: 18px;
      flex-shrink: 0;
    }
  }

  .topNav__items {
    display: flex;

    .items__item {
      display: flex;
      align-items: center;
      height: ${TOP_NAV_HEIGHT};
      padding: 0 ${props => props.theme.variable.gap.lg};
      font-size: 18px;
      cursor: pointer;

      &:hover {
        background-color: ${opacify(-0.95, '#000')};
      }

      &.item--active {
        background-color: ${opacify(-0.9, '#000')};
      }
    }
  }
`;

export const TopNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledTopNav id="top-nav">
      <div className="topNav__logo" onClick={() => navigate('/')}>
        <VadeMecumLogo />
        Vade Mecum
      </div>

      <div className="topNav__items">
        {NAV_ITEMS.filter(item => item.prefix === '/docs').map((navItem, i) => {
          const active = navItem.prefix
            ? location.pathname.startsWith(navItem.prefix)
            : location.pathname === '/';

          return (
            <div
              key={i}
              className={`items__item ${active ? 'item--active' : ''}`}
              onClick={() => navigate(navItem.children![0].path)}
            >
              {navItem.icon}
            </div>
          );
        })}
      </div>
    </StyledTopNav>
  );
};

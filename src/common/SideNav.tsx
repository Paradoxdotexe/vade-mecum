import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ReactComponent as VadeMecumLogo } from '@/icons/VadeMecumLogo.svg';
import { ReactComponent as HomeIcon } from '@/icons/Home.svg';
import { ReactComponent as BookIcon } from '@/icons/Book.svg';
import { ReactComponent as DieIcon } from '@/icons/Die.svg';
import { ReactComponent as UserIcon } from '@/icons/User.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVTTUser } from './VTTUser';

export const SIDE_NAV_WIDTH = '200px';

const StyledSideNav = styled.div`
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.variable.gap.xl};
  width: ${SIDE_NAV_WIDTH};
  height: 100vh;
  background: ${props => props.theme.color.background.default};
  border-right: 1px solid ${props => props.theme.color.border.default};
  box-shadow: 4px 0 16px ${props => props.theme.color.shadow.default};

  .sideNav__logo {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    padding: ${props => props.theme.variable.gap.lg};
    background-color: ${props => props.theme.color.brand.default};
    color: ${props => props.theme.color.text.contrast};
    margin-right: -1px;
    font-family: ${props => props.theme.variable.fontFamily.bold};
    font-size: 18px;

    svg {
      height: 18px;
    }
  }

  .sideNav__items {
    display: flex;
    flex-direction: column;

    .items__item {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.lg};
      padding: ${props => props.theme.variable.gap.lg};
      font-size: ${props => props.theme.variable.fontSize.sm};
      cursor: pointer;
      opacity: 0.6;

      &.item--active,
      &:has(.subItem--active) {
        background-color: ${props => props.theme.color.background.raised};
        opacity: 1;
      }

      .item__header {
        display: flex;
        align-items: center;
        gap: ${props => props.theme.variable.gap.md};
        font-weight: 500;

        svg {
          font-size: 18px;
        }
      }

      .item__subItems {
        display: flex;
        flex-direction: column;
        gap: ${props => props.theme.variable.gap.sm};
        border-left: 1px solid ${props => props.theme.color.border.default};
        margin-left: ${props => props.theme.variable.gap.md};
        padding-left: ${props => props.theme.variable.gap.md};

        .subItems__subItem {
          padding: ${props => props.theme.variable.gap.md};
          font-size: ${props => props.theme.variable.fontSize.sm};
          opacity: 0.6;

          &.subItem--active,
          &:hover {
            border-radius: ${props => props.theme.variable.borderRadius};
            opacity: 1;
          }

          &:hover {
            background-color: ${props => props.theme.color.background.hovered};
          }

          &.subItem--active {
            background-color: ${props => props.theme.color.background.active};
          }
        }
      }
    }
  }

  .sideNav__user {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    padding: ${props => props.theme.variable.gap.lg};
    background-color: ${props => props.theme.color.background.raised};
    width: 100%;
    font-size: ${props => props.theme.variable.fontSize.xs};
    overflow: hidden;

    svg {
      background-color: ${props => props.theme.color.background.active};
      padding-top: 6px;
      font-size: 24px;
      border-radius: 100%;
      flex-shrink: 0;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: ${props => props.theme.variable.lineHeight};
    }
  }
`;

type NavItem = {
  icon: ReactNode;
  label: string;
  path?: string;
  children?: {
    label: string;
    path: string;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    icon: <HomeIcon />,
    label: 'Home',
    path: '/'
  },
  {
    icon: <BookIcon />,
    label: 'Documentation',
    children: [
      {
        label: 'Core Rules',
        path: '/docs'
      },
      {
        label: 'Vale of Myths',
        path: '/docs/vale-of-myths'
      }
    ]
  },
  {
    icon: <DieIcon />,
    label: 'Virtual Tabletop',
    children: [
      {
        label: 'Characters',
        path: '/vtt/characters'
      },
      {
        label: 'Sessions',
        path: '/vtt/sessions'
      }
    ]
  }
];

export const SideNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useVTTUser();

  return (
    <StyledSideNav>
      <div className="sideNav__logo">
        <VadeMecumLogo />
        Vade Mecum
      </div>

      <div className="sideNav__items">
        {NAV_ITEMS.map((navItem, i) => (
          <div
            key={i}
            className={`items__item ${location.pathname === navItem.path ? 'item--active' : ''}`}
            onClick={() => navigate(navItem.path ?? navItem.children?.[0]?.path ?? '')}
          >
            <div className="item__header">
              {navItem.icon}
              {navItem.label}
            </div>
            {navItem.children && (
              <div className="item__subItems">
                {navItem.children.map((child, j) => (
                  <div
                    key={j}
                    className={`subItems__subItem ${location.pathname === child.path ? 'subItem--active' : ''}`}
                    onClick={event => {
                      event.stopPropagation();
                      navigate(child.path);
                    }}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {user.authenticated && (
        <div className="sideNav__user">
          <UserIcon />
          <span>{user.email}</span>
        </div>
      )}
    </StyledSideNav>
  );
};

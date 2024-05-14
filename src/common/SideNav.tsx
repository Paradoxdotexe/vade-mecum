import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as VadeMecumLogo } from '@/icons/VadeMecumLogo.svg';
import { ReactComponent as HomeIcon } from '@/icons/Home.svg';
import { ReactComponent as BookIcon } from '@/icons/Book.svg';
import { ReactComponent as DieIcon } from '@/icons/Die.svg';
import { ReactComponent as UserIcon } from '@/icons/User.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVTTUser } from './VTTUser';
import { VModal } from '@/components/VModal';
import { VButton } from '@/components/VButton';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from './VTheme';
import { useClientMutation } from './useClientMutation';

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
  z-index: 500;

  .sideNav__logo {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    padding: ${props => props.theme.variable.gap.lg};
    background-color: ${props => props.theme.color.brand.default};
    color: ${props => props.theme.color.text.contrast};
    margin-right: -1px;
    font-family: ${props => props.theme.variable.fontFamily.display};
    font-size: 18px;
    cursor: pointer;

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
      transition: all ease 150ms;

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
          transition: all ease 150ms;

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
    cursor: pointer;

    &:hover {
      background-color: ${props => props.theme.color.background.hovered};
    }

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
  prefix?: string; // we only expect Home to not have a prefix
  children?: {
    label: string;
    path: string;
  }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    icon: <HomeIcon />,
    label: 'Home'
  },
  {
    icon: <BookIcon />,
    label: 'Documentation',
    prefix: '/docs',
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
    prefix: '/vtt',
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
  const theme = useVTheme();

  const user = useVTTUser();
  const [userModalOpen, setUserModalOpen] = useState(false);

  const logout = useClientMutation('POST', '/auth/logout');

  const onLogout = () => {
    logout.mutateAsync().then(() => {
      user.update(undefined);
      setUserModalOpen(false);
    });
  };

  return (
    <StyledSideNav id="side-nav">
      <div className="sideNav__logo" onClick={() => navigate('/')}>
        <VadeMecumLogo />
        Vade Mecum
      </div>

      <div className="sideNav__items">
        {NAV_ITEMS.map((navItem, i) => {
          const active = navItem.prefix
            ? location.pathname.startsWith(navItem.prefix)
            : location.pathname === '/';

          return (
            <div
              key={i}
              className={`items__item ${active ? 'item--active' : ''}`}
              onClick={() => navigate(navItem.children?.[0].path ?? '/')}
            >
              <div className="item__header">
                {navItem.icon}
                {navItem.label}
              </div>
              {navItem.children && (
                <div className="item__subItems">
                  {navItem.children.map((child, j) => {
                    const active = location.pathname === child.path;

                    return (
                      <div
                        key={j}
                        className={`subItems__subItem ${active ? 'subItem--active' : ''}`}
                        onClick={event => {
                          event.stopPropagation();
                          navigate(child.path);
                        }}
                      >
                        {child.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {user.authenticated && (
        <div className="sideNav__user" onClick={() => setUserModalOpen(true)}>
          <UserIcon />
          <span>{user.email}</span>
        </div>
      )}

      <VModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        header="User Account"
        width={320}
        closable={!logout.isLoading}
      >
        <VFlex vertical style={{ padding: theme.variable.gap.lg }}>
          <VButton onClick={onLogout} loading={logout.isLoading}>
            Logout
          </VButton>
        </VFlex>
      </VModal>
    </StyledSideNav>
  );
};

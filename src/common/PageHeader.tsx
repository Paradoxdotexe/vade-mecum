import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledPageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: ${props => props.theme.variable.gap.lg};
  border-bottom: 1px solid ${props => props.theme.color.border.default};
  margin-bottom: ${props => props.theme.variable.gap.xl};

  .header__left {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};

    .left__breadcrumbs {
      display: flex;
      gap: ${props => props.theme.variable.gap.md};
      font-size: ${props => props.theme.variable.fontSize.sm};
      color: ${props => props.theme.color.text.secondary};

      .breadcrumbs__breadcrumb {
        &.breadcrumb--clickable {
          cursor: pointer;

          &:hover {
            color: ${props => props.theme.color.text.primary};
          }
        }
      }
    }

    .left__title {
      font-size: ${props => props.theme.variable.fontSize.xl};
      font-family: ${props => props.theme.variable.fontFamily.display};
      height: ${props => props.theme.variable.fontSize.xl};
    }
  }

  .header__right {
    display: flex;
    align-items: flex-end;
    gap: ${props => props.theme.variable.gap.md};
  }
`;

type PageHeaderBreadcrumb = {
  label: string;
  path: string;
};

type PageHeaderProps = {
  title: ReactNode;
  breadcrumbs: (string | PageHeaderBreadcrumb)[];
  extra?: ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = props => {
  const navigate = useNavigate();

  return (
    <StyledPageHeader>
      <div className="header__left">
        <div className="left__breadcrumbs">
          {props.breadcrumbs.map((breadcrumb, i) => {
            const isClickable = typeof breadcrumb === 'object';
            return (
              <React.Fragment key={i}>
                {i > 0 && '>'}
                <span
                  onClick={isClickable ? () => navigate(breadcrumb.path) : undefined}
                  className={classNames('breadcrumbs__breadcrumb', {
                    'breadcrumb--clickable': isClickable
                  })}
                >
                  {isClickable ? breadcrumb.label : breadcrumb}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        <div className="left__title">{props.title}</div>
      </div>
      <div className="header__right">{props.extra}</div>
    </StyledPageHeader>
  );
};

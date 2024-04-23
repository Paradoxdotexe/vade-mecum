import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledPageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: ${props => props.theme.variable.gap.xl} 0;
  border-bottom: 1px solid ${props => props.theme.color.border.default};

  .header__left {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.md};

    .left__breadcrumbs {
      font-size: ${props => props.theme.variable.fontSize.sm};
      color: ${props => props.theme.color.text.secondary};
    }

    .left__title {
      font-size: ${props => props.theme.variable.fontSize.xl};
      font-family: ${props => props.theme.variable.fontFamily.bold};
    }
  }

  .header__right {
    display: flex;
    gap: ${props => props.theme.variable.gap.md};
  }
`;

type PageHeaderProps = {
  title: string;
  breadcrumbs: string[];
  extra?: ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = props => {
  return (
    <StyledPageHeader>
      <div className="header__left">
        <div className="left__breadcrumbs">{props.breadcrumbs.join('  >  ')}</div>
        <div className="left__title">{props.title}</div>
      </div>
      <div className="header__right">{props.extra}</div>
    </StyledPageHeader>
  );
};

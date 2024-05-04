import React from 'react';
import styled from 'styled-components';
import versionJson from '../version.json';
import { useNavigate } from 'react-router-dom';
import { VButton } from '@/components/VButton';
import { ReactComponent as VadeMecumLogo } from '@/icons/VadeMecumLogo.svg';
import { ReactComponent as BookIcon } from '@/icons/Book.svg';
import { ReactComponent as DieIcon } from '@/icons/Die.svg';
import { PageLayout } from '@/common/PageLayout';

const StyledHomePage = styled(PageLayout)`
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.variable.gap.xxl};

  .page__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.theme.variable.gap.lg};

    svg {
      height: ${props => props.theme.variable.fontSize.xxl};
    }

    .header__title {
      font-family: ${props => props.theme.variable.fontFamily.display};
      font-size: ${props => props.theme.variable.fontSize.xxl};
    }

    .header__slogan {
      color: ${props => props.theme.color.text.secondary};
    }
  }

  .page__routes {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${props => props.theme.variable.gap.lg};
  }

  .page__version {
    position: absolute;
    bottom: 0;
    background: ${props => props.theme.color.background.hovered};
    width: fit-content;
    padding: ${props => props.theme.variable.gap.md};
    border-radius: ${props => props.theme.variable.borderRadius};
    float: right;
    font-family: ${props => props.theme.variable.fontFamily.mono};
    font-size: ${props => props.theme.variable.fontSize.xs};
  }
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledHomePage>
      <div className="page__header">
        <VadeMecumLogo />
        <div className="header__title">Vade Mecum</div>
        <div className="header__slogan">
          A universe-agnostic, hyper-generalized, d6-based RPG system.
        </div>
      </div>

      <div className="page__routes">
        <VButton type="primary" size="large" onClick={() => navigate('/docs')}>
          <BookIcon />
          Documentation
        </VButton>
        <VButton size="large" onClick={() => navigate('/vtt/characters')}>
          <DieIcon /> Virtual Tabletop
        </VButton>
      </div>

      <div className="page__version">ALPHA v{versionJson.version}</div>
    </StyledHomePage>
  );
};

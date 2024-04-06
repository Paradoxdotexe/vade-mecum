import React from 'react';
import styled from 'styled-components';
import versionJson from '../version.json';
import { useNavigate } from 'react-router-dom';
import { VButton } from '@/components/VButton';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 48px;

  .page__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .header__title {
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 48px;
    }

    .header__version {
      background: #585858;
      width: fit-content;
      padding: 6px;
      border-radius: 6px;
      float: right;
      font-family: 'Noto Sans Mono', monospace;
      font-size: 14px;
    }
  }

  .page__slogan {
    color: #a0a0a0;
  }

  .page__routes {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 200px;
  }
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className="page__header">
        <div className="header__title">Vade Mecum</div>
        <div className="header__version">Alpha v{versionJson.version}</div>
      </div>

      <div className="page__slogan">
        A universe-agnostic, hyper-generalized, d6-based RPG system.
      </div>

      <div className="page__routes">
        <VButton type="primary" size="large" onClick={() => navigate('/docs')}>
          Documentation
        </VButton>
        <VButton size="large" onClick={() => navigate('/engine')}>
          Game Engine
        </VButton>
      </div>
    </Page>
  );
};

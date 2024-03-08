import React from 'react';
import styled from 'styled-components';
import versionJson from '../version.json';
import { useNavigate } from 'react-router-dom';

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

    button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1697f4;
      border: none;
      cursor: pointer;
      color: #fff;
      border-radius: 4px;
      padding: 9px 0;
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 16px;
      width: 100%;
      z-index: 1;
      box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        background-color: rgba(0, 0, 0, 0.15);
        z-index: -1;
        transition: width ease 450ms;
      }

      &:hover::before {
        width: 100%;
      }

      &:not(:first-child) {
        background-color: transparent;
        border: 1px solid #585858;
      }
    }
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
        <button onClick={() => navigate('/docs')}>Documentation</button>
        <button onClick={() => navigate('/engine')}>Game Engine</button>
      </div>
    </Page>
  );
};

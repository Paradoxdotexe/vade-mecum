import React from 'react';
import docs from './docs.md';
import { Markdown } from '../../components/Markdown';
import styled from 'styled-components';

const Page = styled.div`
  padding: 64px;
  width: 900px;

  h1,
  h2 {
    font-family: 'Noto Sans Display', sans-serif;
  }

  h1 {
    margin-block: 32px;
  }

  h2,
  p,
  blockquote {
    margin-block: 24px;
  }

  h1 {
    font-size: 48px;
    font-weight: 800;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
  }

  p {
    line-height: 1.5;
  }

  blockquote {
    background-color: #3b3b3b;
    border-radius: 0 8px 8px 8px;
    margin-inline: 0;
    padding: 16px;

    p {
      margin: 0;

      &:first-child {
        margin-block-end: 8px;
        font-family: 'Noto Sans Display', sans-serif;
      }
    }
  }

  table {
    border-spacing: 0;
    width: 100%;

    tr {
      th,
      td {
        padding: 16px;
      }

      th {
        text-align: left;
        font-family: 'Noto Sans Display', sans-serif;
        padding-top: 0;
      }
    }

    tbody {
      tr:nth-child(2n-1) {
        background-color: #3b3b3b;

        td:first-child {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        td:last-child {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
  }
`;

export const DocsPage: React.FC = () => {
  return (
    <Page>
      <Markdown src={docs} />
    </Page>
  );
};

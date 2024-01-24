import React from 'react';
import { Markdown, MarkdownProps } from '../../components/Markdown';
import styled from 'styled-components';

const StyledComponent = styled.div`
  h1,
  h2,
  h3 {
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

  h3 {
    font-size: 20px;
    font-weight: 700;
  }

  p {
    line-height: 1.5;
  }

  blockquote {
    background-color: #3b3b3b;
    border-radius: 0 8px 8px 8px;
    margin-inline: 0;
    padding: 12px;

    p {
      margin: 0;

      &:first-child:not(:last-child) {
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
        padding: 12px;
        line-height: 150%;

        &:not(:last-child) {
          white-space: nowrap;
        }
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

export const DocsMarkdown: React.FC<MarkdownProps> = props => {
  return (
    <StyledComponent>
      <Markdown {...props} />
    </StyledComponent>
  );
};

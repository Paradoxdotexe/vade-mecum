import React from 'react';
import { Markdown, MarkdownProps } from '../../components/Markdown';
import styled from 'styled-components';

const StyledComponent = styled.div`
  padding: 64px;
  width: 100%;
  max-width: 964px;

  @media only screen and (max-width: 800px) {
    padding: 32px;
  }

  @media print {
    padding: 0;
    width: 742px;

    h1 {
      page-break-before: always;
    }

    h2,
    h4 {
      page-break-after: avoid;
    }

    tr,
    blockquote {
      page-break-inside: avoid;
    }
  }

  h1,
  h2,
  h3 {
    font-family: 'Noto Sans Display', sans-serif;
  }

  h1 {
    padding-block: 16px;
    margin-block: 16px;
    border-bottom: 1px solid white;
    font-size: 48px;
    font-weight: 800;
  }

  h2 {
    padding-block: 12px;
    margin-block: 12px;
    border-bottom: 1px solid white;
    font-size: 24px;
    font-weight: 700;
  }

  h3 {
    margin-block: 12px;
    font-size: 20px;
    font-weight: 700;
  }

  p {
    line-height: 1.5;
    margin-block: 24px;

    &:has(+ ol, + ul) {
      margin-bottom: 0px;
    }
  }

  ul,
  ol {
    line-height: 150%;
    padding-inline-start: 32px;
    margin-block: 6px;

    // checkbox list
    &:has(input[type='checkbox']) {
      list-style-type: none;
      padding-inline-start: 0;

      input[type='checkbox'] {
        border: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background-color: #585858;
        margin: 0 3px -1px 0;
      }
    }

    li {
      margin-block: 2px;
    }
  }

  li > ul {
    margin: 0;
  }

  code {
    font-family: 'Noto Sans';
    background: #585858;
    border-radius: 8px;
    padding: 1px 5px;
  }

  img {
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 0 0 2px #5f5f5f;
  }

  a {
    color: #03a9f7;
  }

  blockquote {
    background-color: #3b3b3b;
    border-radius: 0 8px 8px 8px;
    margin-inline: 0;
    padding: 12px;
    margin-block: 24px;

    p {
      margin: 0;
    }
  }

  table {
    border-spacing: 0;
    width: 100%;
    margin-block: 24px;

    tr {
      th,
      td {
        padding: 12px;
        line-height: 150%;

        &:not(:last-child) {
          white-space: nowrap;
          vertical-align: baseline;
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

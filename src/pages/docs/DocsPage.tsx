import React from 'react';
import docs from './docs.md';
import styled from 'styled-components';
import { DocsMarkdown } from './DocsMarkdown';

const Page = styled.div`
  padding: 64px;
  width: 964px;

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
`;

export const DocsPage: React.FC = () => {
  return (
    <Page>
      <DocsMarkdown src={docs} />
    </Page>
  );
};

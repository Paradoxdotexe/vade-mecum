import React from 'react';
import docs from './docs.md';
import styled from 'styled-components';
import { DocsMarkdown } from './DocsMarkdown';

const Page = styled.div`
  padding: 64px;
  width: 900px;
`;

export const DocsPage: React.FC = () => {
  return (
    <Page>
      <DocsMarkdown src={docs} />
    </Page>
  );
};

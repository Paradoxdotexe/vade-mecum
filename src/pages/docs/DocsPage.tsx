import React from 'react';
import styled from 'styled-components';
import { DocsMarkdown } from './DocsMarkdown';

const Page = styled.div`
  display: flex;
  justify-content: center;
`;

type DocsPageProps = {
  docs: string;
};

export const DocsPage: React.FC<DocsPageProps> = props => {
  return (
    <Page>
      <DocsMarkdown src={props.docs} />
    </Page>
  );
};

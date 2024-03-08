import React from 'react';
import styled from 'styled-components';
import { DocsMarkdown } from './DocsMarkdown';

const Page = styled.div`
  display: flex;
  justify-content: center;

  .page__docs {
    padding: 64px;
    max-width: 964px;
    width: 100%;

    @media only screen and (max-width: 800px) {
      padding: 32px;
    }

    @media print {
      padding: 0;
      max-width: 742px;
    }
  }
`;

type DocsPageProps = {
  docs: string;
};

export const DocsPage: React.FC<DocsPageProps> = props => {
  return (
    <Page>
      <div className="page__docs">
        <DocsMarkdown src={props.docs} />
      </div>
    </Page>
  );
};

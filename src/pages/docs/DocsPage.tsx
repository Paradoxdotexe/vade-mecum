import React from 'react';
import styled from 'styled-components';
import { DocsMarkdown } from './DocsMarkdown';
import versionJson from '../../version.json';

const Page = styled.div`
  display: flex;
  justify-content: center;

  .page__docs {
    padding: 64px;
    max-width: 964px;

    .docs__version {
      background: #585858;
      width: fit-content;
      padding: 6px;
      border-radius: 6px;
      float: right;
      font-family: 'Noto Sans Mono', monospace;
      font-size: 14px;
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
        <div className="docs__version">Vade Mecum v{versionJson.version}</div>
        <DocsMarkdown src={props.docs} />
      </div>
    </Page>
  );
};

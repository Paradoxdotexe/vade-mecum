import React from 'react';
import { DocsMarkdown } from './DocsMarkdown';
import { PageLayout } from '@/common/PageLayout';

type DocsPageProps = {
  docs: string;
};

export const DocsPage: React.FC<DocsPageProps> = props => {
  return (
    <PageLayout style={{ maxWidth: 900 }}>
      <DocsMarkdown src={props.docs} />
    </PageLayout>
  );
};

import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';

export const CharactersPage: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader breadcrumbs={['Virtual Tabletop']} title="Characters" />
    </PageLayout>
  );
};

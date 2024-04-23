import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';

export const CharactersPage: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={['Virtual Tabletop']}
        title="Characters"
        extra={
          <VButton>
            <PlusIcon /> Add character
          </VButton>
        }
      />
    </PageLayout>
  );
};

import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';

export const CharacterPage: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Characters']}
        title="Valros Witherin"
        extra={
          <VButton>
            <TrashCanIcon /> Delete character
          </VButton>
        }
      />
    </PageLayout>
  );
};

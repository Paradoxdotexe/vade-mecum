import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { useGetQuery } from '@/common/useGetQuery';
import { useParams } from 'react-router-dom';

export const CharacterPage: React.FC = () => {
  const { characterId } = useParams();

  const { data: character } = useGetQuery(
    ['GET_CHARACTER', characterId],
    `/character/${characterId}`
  );

  console.log(character);

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

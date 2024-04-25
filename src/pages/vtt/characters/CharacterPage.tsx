import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { useGetQuery } from '@/common/useGetQuery';
import { useParams } from 'react-router-dom';
import { Character } from '../types/Character';

export const CharacterPage: React.FC = () => {
  const { characterId } = useParams();

  const { data: character } = useGetQuery<Character>(
    ['GET_CHARACTER', characterId],
    `/character/${characterId}`
  );

  console.log(character);

  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Characters']}
        title={character?.name || 'Unnamed Character'}
        extra={
          <VButton>
            <TrashCanIcon /> Delete character
          </VButton>
        }
      />
    </PageLayout>
  );
};

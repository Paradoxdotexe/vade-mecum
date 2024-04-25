import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { usePostMutation } from '@/common/usePostMutation';
import { useNavigate } from 'react-router-dom';
import { useGetQuery } from '@/common/useGetQuery';

export const CharactersPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: characters } = useGetQuery(['GET_CHARACTERS'], `/characters`);

  const createCharacter = usePostMutation<{ characterId: string }>('/character');

  const onCreateCharacter = () => {
    createCharacter.mutateAsync({}).then(response => {
      navigate(`/vtt/characters/${response.characterId}`);
    });
  };

  console.log(characters);

  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={['Virtual Tabletop']}
        title="Characters"
        extra={
          <VButton onClick={onCreateCharacter} loading={createCharacter.isLoading}>
            <PlusIcon /> Create character
          </VButton>
        }
      />
    </PageLayout>
  );
};

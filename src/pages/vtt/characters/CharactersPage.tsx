import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { useMutation } from 'react-query';

export const CharactersPage: React.FC = () => {
  const createCharacter = useMutation(() =>
    fetch('https://api.vademecum.thenjk.com/character', {
      method: 'POST',
      credentials: 'include'
    }).then(response => response.json())
  );

  const onCreateCharacter = () => {
    createCharacter.mutateAsync();
  };

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

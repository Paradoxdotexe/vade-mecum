import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { useMutation } from 'react-query';
import { useVTTUser } from '@/common/VTTUser';

export const CharactersPage: React.FC = () => {
  const user = useVTTUser();

  const createCharacter = useMutation(() =>
    fetch('https://api.vademecum.thenjk.com/character', {
      method: 'POST',
      credentials: 'include'
    }).then(response => {
      const json = response.json();
      if (response.status === 403) {
        user.update(undefined);
      } else {
        return json;
      }
    })
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

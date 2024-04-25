import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { usePostMutation } from '@/common/usePostMutation';
import { useNavigate } from 'react-router-dom';
import { useGetQuery } from '@/common/useGetQuery';
import { CharacterCard } from './CharacterCard';
import { Character } from '../types/Character';
import styled from 'styled-components';

const StyledCharactersPage = styled(PageLayout)`
  gap: ${props => props.theme.variable.gap.xl};

  .page__characters {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${props => props.theme.variable.gap.lg};
  }
`;

export const CharactersPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: characters } = useGetQuery<Character[]>(['GET_CHARACTERS'], `/characters`);

  const createCharacter = usePostMutation<{ characterId: string }>('/character');

  const onCreateCharacter = () => {
    createCharacter.mutateAsync({}).then(response => {
      navigate(`/vtt/characters/${response.characterId}`);
    });
  };

  console.log(characters);

  return (
    <StyledCharactersPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop']}
        title="Characters"
        extra={
          <VButton onClick={onCreateCharacter} loading={createCharacter.isLoading}>
            <PlusIcon /> Create character
          </VButton>
        }
      />

      <div className="page__characters">
        {characters?.map(character => <CharacterCard key={character.id} character={character} />)}
      </div>
    </StyledCharactersPage>
  );
};

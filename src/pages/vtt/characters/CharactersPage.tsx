import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { useNavigate } from 'react-router-dom';
import { CharacterCard } from './CharacterCard';
import styled from 'styled-components';
import { useCharactersQuery } from '../queries/useCharactersQuery';
import { VFlex } from '@/components/VFlex';
import { VLoader } from '@/components/VLoader';
import { useCreateCharacterMutation } from '../queries/useCreateCharacterMutation';
import { VHelmetTitle } from '@/components/VHelmetTitle';

const StyledCharactersPage = styled(PageLayout)`
  .page__characters {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${props => props.theme.variable.gap.lg};
  }
`;

export const CharactersPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: characters } = useCharactersQuery();

  const createCharacter = useCreateCharacterMutation();

  const onCreateCharacter = () => {
    createCharacter.mutateAsync().then(response => {
      navigate(`/vtt/characters/${response.characterId}`);
    });
  };

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
      <VHelmetTitle>VTT | Characters</VHelmetTitle>
      {!characters ? (
        <VFlex justify="center">
          <VLoader />
        </VFlex>
      ) : (
        <div className="page__characters">
          {characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => navigate(`/vtt/characters/${character.id}`)}
            />
          ))}
        </div>
      )}
    </StyledCharactersPage>
  );
};

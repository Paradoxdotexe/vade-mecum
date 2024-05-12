import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { VModal, VModalProps } from '@/components/VModal';
import React, { useEffect, useState } from 'react';
import { CharacterCard } from '@/pages/vtt/characters/CharacterCard';
import { useGetCharactersQuery } from '@/pages/vtt/queries/useGetCharactersQuery';
import { VLoader } from '@/components/VLoader';
import { useGetSessionQuery } from '@/pages/vtt/queries/useGetSessionQuery';
import { useAddSessionCharacter } from '../../queries/useAddSessionCharacter';

type AddSessionCharacterModalProps = Pick<VModalProps, 'open' | 'onClose'> & {
  sessionId: string | undefined;
};

export const AddSessionCharacterModal: React.FC<AddSessionCharacterModalProps> = props => {
  const theme = useVTheme();

  const { data: session } = useGetSessionQuery(props.sessionId);
  const { data: characters } = useGetCharactersQuery({ enabled: props.open });

  const [characterId, setCharacterId] = useState<string>();

  const addSessionCharacter = useAddSessionCharacter(props.sessionId, characterId);

  useEffect(() => {
    if (characterId) {
      addSessionCharacter.mutateAsync().then(props.onClose);
    }
  }, [characterId]);

  return (
    <VModal
      open={props.open}
      onClose={props.onClose}
      header="Add Character"
      width={320}
      closable={!addSessionCharacter.isLoading}
    >
      <VFlex vertical gap={theme.variable.gap.lg} style={{ padding: theme.variable.gap.lg }}>
        {characters ? (
          characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              disabled={
                session?.characterIds.includes(character.id) || addSessionCharacter.isLoading
              }
              loading={characterId === character.id && addSessionCharacter.isLoading}
              onClick={() => {
                setCharacterId(character.id);
              }}
            />
          ))
        ) : (
          <VLoader />
        )}
      </VFlex>
    </VModal>
  );
};

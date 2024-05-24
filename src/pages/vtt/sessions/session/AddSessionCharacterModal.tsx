import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { VModal, VModalProps } from '@/components/VModal';
import React, { useEffect, useState } from 'react';
import { CharacterCard } from '@/pages/vtt/characters/CharacterCard';
import { useCharactersQuery } from '@/pages/vtt/queries/useCharactersQuery';
import { VLoader } from '@/components/VLoader';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useAddSessionCharacter } from '../../queries/useAddSessionCharacter';

type AddSessionCharacterModalProps = Pick<VModalProps, 'open' | 'onClose'> & {
  sessionId: string | undefined;
};

export const AddSessionCharacterModal: React.FC<AddSessionCharacterModalProps> = props => {
  const theme = useVTheme();

  const { data: session } = useSessionQuery(props.sessionId);
  const { data: characters } = useCharactersQuery({ enabled: props.open });

  const [addedCharacterId, setAddedCharacterId] = useState<string>();

  const addSessionCharacter = useAddSessionCharacter(props.sessionId, addedCharacterId);

  useEffect(() => {
    if (addedCharacterId) {
      addSessionCharacter.mutateAsync().then(() => {
        setAddedCharacterId(undefined);
        props.onClose?.();
      });
    }
  }, [addedCharacterId]);

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
              loading={addedCharacterId === character.id && addSessionCharacter.isLoading}
              onClick={() => {
                setAddedCharacterId(character.id);
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

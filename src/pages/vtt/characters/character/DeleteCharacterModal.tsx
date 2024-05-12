import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { VModal, VModalProps } from '@/components/VModal';
import React from 'react';
import { VButton } from '@/components/VButton';
import { useNavigate } from 'react-router-dom';
import { useDeleteCharacterMutation } from '@/pages/vtt/queries/useDeleteCharacterMutation';
import { useGetCharacterQuery } from '@/pages/vtt/queries/useGetCharacterQuery';

type DeleteCharacterModalProps = Pick<VModalProps, 'open' | 'onClose'> & {
  characterId: string | undefined;
};

export const DeleteCharacterModal: React.FC<DeleteCharacterModalProps> = props => {
  const navigate = useNavigate();
  const theme = useVTheme();

  const { data: character } = useGetCharacterQuery(props.characterId);

  const deleteCharacter = useDeleteCharacterMutation(props.characterId);

  return (
    <VModal
      open={props.open}
      onClose={props.onClose}
      header="Delete Character"
      width={320}
      closable={!deleteCharacter.isLoading}
    >
      <VFlex
        vertical
        gap={theme.variable.gap.lg}
        style={{ padding: theme.variable.gap.lg, lineHeight: theme.variable.lineHeight }}
      >
        <span>
          Are you sure you want to delete{' '}
          {character?.name ? <strong>{character.name}</strong> : 'this character'}?
        </span>
        <VButton
          type="primary"
          onClick={() => deleteCharacter.mutateAsync().then(() => navigate('/vtt/characters'))}
          loading={deleteCharacter.isLoading}
        >
          Delete
        </VButton>
      </VFlex>
    </VModal>
  );
};

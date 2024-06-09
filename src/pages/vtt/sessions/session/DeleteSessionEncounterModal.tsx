import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { VModal, VModalProps } from '@/components/VModal';
import React from 'react';
import { VButton } from '@/components/VButton';
import { useNavigate } from 'react-router-dom';
import { useSessionEncounterQuery } from '../../queries/useSessionEncounterQuery';
import { useDeleteSessionEncounterMutation } from '../../queries/useDeleteSessionEncounterMutation';

type DeleteSessionEncounterModalProps = Pick<VModalProps, 'open' | 'onClose'> & {
  sessionId: string | undefined;
  encounterId: string | undefined;
};

export const DeleteSessionEncounterModal: React.FC<DeleteSessionEncounterModalProps> = props => {
  const navigate = useNavigate();
  const theme = useVTheme();

  const { data: encounter } = useSessionEncounterQuery(props.sessionId, props.encounterId);

  const deleteSessionEncounter = useDeleteSessionEncounterMutation(
    props.sessionId,
    props.encounterId
  );

  return (
    <VModal
      open={props.open}
      onClose={props.onClose}
      header="Delete Encounter"
      width={320}
      closable={!deleteSessionEncounter.isLoading}
    >
      <VFlex
        vertical
        gap={theme.variable.gap.lg}
        style={{ padding: theme.variable.gap.lg, lineHeight: theme.variable.lineHeight }}
      >
        <span>
          Are you sure you want to delete{' '}
          {encounter?.name ? <strong>{encounter.name}</strong> : 'this encounter'}?
        </span>
        <VButton
          type="primary"
          onClick={() =>
            deleteSessionEncounter
              .mutateAsync()
              .then(() => navigate(`/vtt/sessions/${props.sessionId}`))
          }
          loading={deleteSessionEncounter.isLoading}
        >
          Delete
        </VButton>
      </VFlex>
    </VModal>
  );
};

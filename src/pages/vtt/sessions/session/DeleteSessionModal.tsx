import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { VModal, VModalProps } from '@/components/VModal';
import React from 'react';
import { useGetSessionQuery } from '@/pages/vtt/queries/useGetSessionQuery';
import { VButton } from '@/components/VButton';
import { useNavigate } from 'react-router-dom';
import { useDeleteSessionMutation } from '@/pages/vtt/queries/useDeleteSessionMutation';

type DeleteSessionModalProps = Pick<VModalProps, 'open' | 'onClose'> & {
  sessionId: string | undefined;
};

export const DeleteSessionModal: React.FC<DeleteSessionModalProps> = props => {
  const navigate = useNavigate();
  const theme = useVTheme();

  const { data: session } = useGetSessionQuery(props.sessionId);

  const deleteSession = useDeleteSessionMutation(props.sessionId);

  return (
    <VModal
      open={props.open}
      onClose={props.onClose}
      header="Delete Session"
      width={320}
      closable={!deleteSession.isLoading}
    >
      <VFlex
        vertical
        gap={theme.variable.gap.lg}
        style={{ padding: theme.variable.gap.lg, lineHeight: theme.variable.lineHeight }}
      >
        <span>
          Are you sure you want to delete{' '}
          {session?.name ? <strong>{session.name}</strong> : 'this session'}?
        </span>
        <VButton
          type="primary"
          onClick={() => deleteSession.mutateAsync().then(() => navigate('/vtt/sessions'))}
          loading={deleteSession.isLoading}
        >
          Delete
        </VButton>
      </VFlex>
    </VModal>
  );
};

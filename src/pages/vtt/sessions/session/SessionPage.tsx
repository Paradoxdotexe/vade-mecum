import React, { useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { useGetSessionQuery } from '@/pages/vtt/queries/useGetSessionQuery';
import { useNavigate, useParams } from 'react-router-dom';
import { useVTTUser } from '@/common/VTTUser';
import { VModal } from '@/components/VModal';
import { useDeleteSessionMutation } from '../../queries/useDeleteSessionMutation';

const StyledSessionPage = styled(PageLayout)``;

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const theme = useVTheme();
  const user = useVTTUser();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: session } = useGetSessionQuery(sessionId);

  const deleteSession = useDeleteSessionMutation(sessionId);

  const onDelete = () => {
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    deleteSession.mutateAsync().then(() => navigate('/vtt/sessions'));
  };

  return (
    <StyledSessionPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Sessions']}
        title={session ? session.name || 'Unnamed Session' : ''}
        extra={
          user.authenticated &&
          user.id === session?.userId && (
            <VButton onClick={onDelete}>
              <TrashCanIcon /> Delete session
            </VButton>
          )
        }
      />

      <VModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
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
          <VButton type="primary" onClick={onConfirmDelete} loading={deleteSession.isLoading}>
            Delete
          </VButton>
        </VFlex>
      </VModal>
    </StyledSessionPage>
  );
};

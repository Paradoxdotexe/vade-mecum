import React, { useEffect, useMemo, useState } from 'react';
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
import { Session } from '../../types/Session';
import { debounce, isEqual } from 'lodash-es';
import { useUpdateSessionMutation } from '../../queries/useUpdateSessionMutation';
import { SavedStatus } from '../../SavedStatus';

const StyledSessionPage = styled(PageLayout)`
  .page__pageHeader__titleInput {
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    height: 100%;

    &::placeholder {
      color: ${props => props.theme.color.text.tertiary};
    }
  }
`;

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const theme = useVTheme();
  const user = useVTTUser();

  const [session, setSession] = useState<Session>();
  const [saved, setSaved] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: savedSession } = useGetSessionQuery(sessionId);
  useMemo(() => {
    if (savedSession && !session) {
      setSession(savedSession);
    }
  }, [savedSession]);

  const deleteSession = useDeleteSessionMutation(sessionId);

  const { mutateAsync: _updateSession } = useUpdateSessionMutation(sessionId);
  const updateSession = useMemo(
    () => debounce((session: Session) => _updateSession({ session }), 2000),
    []
  );

  // updated saved state and debounce save query when needed
  useEffect(() => {
    if (session && savedSession) {
      const saved = isEqual(session, savedSession);
      setSaved(saved);
      if (saved) {
        updateSession.cancel();
      } else {
        updateSession(session);
      }
    }
  }, [session, savedSession]);

  const onDelete = () => {
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    deleteSession.mutateAsync().then(() => navigate('/vtt/sessions'));
  };

  const canEdit = user.authenticated && user.id === session?.userId;

  return (
    <StyledSessionPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Sessions']}
        title={
          <input
            value={session?.name ?? ''}
            placeholder="Unnamed Session"
            onChange={event =>
              setSession(session => session && { ...session, name: event.target.value })
            }
            className="page__pageHeader__titleInput"
            disabled={!canEdit}
          />
        }
        extra={
          canEdit && (
            <VFlex vertical align="end" gap={theme.variable.gap.md}>
              <SavedStatus saved={saved} />
              <VButton onClick={onDelete}>
                <TrashCanIcon /> Delete session
              </VButton>
            </VFlex>
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

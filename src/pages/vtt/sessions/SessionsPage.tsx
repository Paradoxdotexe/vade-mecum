import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { VLoader } from '@/components/VLoader';
import { SessionCard } from './SessionCard';
import { useSessionsQuery } from '../queries/useSessionsQuery';
import { useCreateSessionMutation } from '../queries/useCreateSessionMutation';
import { useNavigate } from 'react-router-dom';
import { VHelmetTitle } from '@/components/VHelmetTitle';

const StyledSessionsPage = styled(PageLayout)`
  .page__sessions {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};
  }
`;

export const SessionsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: sessions } = useSessionsQuery();

  const createSession = useCreateSessionMutation();

  const onCreateSession = () => {
    createSession.mutateAsync().then(response => {
      navigate(`/vtt/sessions/${response.sessionId}`);
    });
  };

  return (
    <StyledSessionsPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop']}
        title="Sessions"
        extra={
          <VButton onClick={onCreateSession} loading={createSession.isLoading}>
            <PlusIcon /> Create session
          </VButton>
        }
      />
      <VHelmetTitle>VTT | Sessions</VHelmetTitle>

      {!sessions ? (
        <VFlex justify="center">
          <VLoader />
        </VFlex>
      ) : (
        <div className="page__sessions">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </StyledSessionsPage>
  );
};

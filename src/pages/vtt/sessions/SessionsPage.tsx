import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { VLoader } from '@/components/VLoader';
import { Session } from '../types/Session';
import { SessionCard } from './SessionCard';

const StyledSessionsPage = styled(PageLayout)`
  .page__sessions {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};
  }
`;

export const SessionsPage: React.FC = () => {
  const sessions: Session[] = [
    {
      id: '34d0990a-1c81-4545-b6c0-cae3bc68a59c',
      userId: 'ec3300eb-d45e-4865-b152-6131cbd1d5bc',
      name: "The World's End",
      characterIds: ['a3efa38b-a2e4-4446-94c8-448456e9549c', 'a3efa38b-a2e4-4446-94c8-448456e9549c']
    }
  ];

  return (
    <StyledSessionsPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop']}
        title="Sessions"
        extra={
          <VButton>
            <PlusIcon /> Create session
          </VButton>
        }
      />
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

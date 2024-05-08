import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { VLoader } from '@/components/VLoader';
import { SessionCard } from './SessionCard';
import { useGetSessionsQuery } from '../queries/useGetSessionsQuery';

const StyledSessionsPage = styled(PageLayout)`
  .page__sessions {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};
  }
`;

export const SessionsPage: React.FC = () => {
  const { data: sessions } = useGetSessionsQuery();

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

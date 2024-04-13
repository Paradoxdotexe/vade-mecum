import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VTable } from '@/components/VTable';
import React, { useState } from 'react';
import styled from 'styled-components';
import { VHeader } from '@/components/VHeader';
import { useQuery } from 'react-query';
import { VInput } from '@/components/VInput';
import { searchObjects } from '@/utils/searchObjects';
import { VLoader } from '@/components/VLoader';
import { Session, useSession } from './useSession';

const StyledSessionsDrawer = styled(VDrawer)`
  .drawer__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 6px 24px 24px;
    overflow: auto;
    scrollbar-gutter: stable;

    .content__section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
`;

type SessionsDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'>;

export const SessionsDrawer: React.FC<SessionsDrawerProps> = props => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setSessionId } = useSession();

  const { data: _sessions } = useQuery<Session[]>(
    ['GET_SESSIONS'],
    () => fetch('https://api.vademecum.thenjk.com/sessions').then(response => response.json()),
    {
      enabled: props.open
    }
  );

  const sessions = searchObjects(_sessions ?? [], ['name'], searchQuery);

  return (
    <StyledSessionsDrawer {...props} width={500} header={'Join Game Session'}>
      {!_sessions && <VLoader />}
      {_sessions && (
        <div className="drawer__content">
          <VCard style={{ padding: 0 }}>
            <VInput
              placeholder="Search game sessions..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </VCard>
          <div className="content__section">
            <VHeader>Game Sessions</VHeader>
            <VCard style={{ padding: 0, overflow: 'hidden' }}>
              <VTable
                columns={[
                  {
                    key: 'name',
                    render: session => (
                      <span>
                        {session.name}{' '}
                        <span style={{ fontWeight: 400 }}>(#{session.id.split('-')[2]})</span>
                      </span>
                    ),
                    width: '100%'
                  }
                ]}
                rows={sessions}
                rowKey="id"
                emptyMessage={
                  _sessions.length
                    ? 'No game sessions match your query.'
                    : 'There are no game sessions available.'
                }
                onRowClick={session => {
                  setSessionId(session.id);
                  props.onClose?.();
                }}
              />
            </VCard>
          </div>
        </div>
      )}
    </StyledSessionsDrawer>
  );
};

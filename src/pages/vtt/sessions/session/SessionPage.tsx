import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { Session } from '@/pages/vtt/types/Session';
import { useVTheme } from '@/common/VTheme';

const StyledSessionPage = styled(PageLayout)``;

export const SessionPage: React.FC = () => {
  const theme = useVTheme();
  //const { sessionId } = useParams();

  const session: Session = {
    id: '34d0990a-1c81-4545-b6c0-cae3bc68a59c',
    userId: 'ec3300eb-d45e-4865-b152-6131cbd1d5bc',
    name: "The World's End",
    characterIds: ['a3efa38b-a2e4-4446-94c8-448456e9549c', 'a3efa38b-a2e4-4446-94c8-448456e9549c']
  };

  return (
    <StyledSessionPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Sessions']}
        title={session ? session.name || 'Unnamed Session' : ''}
        extra={
          <VFlex vertical align="end" gap={theme.variable.gap.md}>
            <VButton>
              <TrashCanIcon /> Delete session
            </VButton>
          </VFlex>
        }
      />
    </StyledSessionPage>
  );
};

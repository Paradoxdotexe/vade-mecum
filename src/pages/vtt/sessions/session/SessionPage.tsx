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

  const session = undefined as Session | undefined;

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

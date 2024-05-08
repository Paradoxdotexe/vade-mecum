import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { useGetSessionQuery } from '../../queries/useGetSessionQuery';
import { useParams } from 'react-router-dom';

const StyledSessionPage = styled(PageLayout)``;

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const theme = useVTheme();

  const { data: session } = useGetSessionQuery(sessionId);

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

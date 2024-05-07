import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { VLoader } from '@/components/VLoader';

const StyledSessionsPage = styled(PageLayout)``;

export const SessionsPage: React.FC = () => {
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
      <VFlex justify="center">
        <VLoader />
      </VFlex>
    </StyledSessionsPage>
  );
};

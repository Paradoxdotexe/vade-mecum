import React from 'react';
import styled from 'styled-components';
import { SkillCheckCard } from './SkillCheckCard';

const Page = styled.div`
  padding: 48px;
`;

export const EncounterEnginePage: React.FC = () => {
  return (
    <Page>
      <SkillCheckCard
        name="Gage"
        diceFactors={[
          { type: 'A', label: 'Strength', value: 4, max: 6 },
          { type: 'A', label: 'Power', value: 1, max: 3 }
        ]}
      />
    </Page>
  );
};

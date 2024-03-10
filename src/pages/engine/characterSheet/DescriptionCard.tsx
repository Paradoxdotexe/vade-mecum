import React from 'react';
import { VTextArea } from '@/components/VTextArea';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';

const StyledDescriptionCard = styled(VCard)`
  padding: 0;
  flex: 1;

  > div {
    height: 100%;

    textarea {
      min-height: 100%;
    }
  }
`;

export const DescriptionCard: React.FC = () => {
  const { currentCharacter } = useCharacters();

  return (
    <StyledDescriptionCard>
      <VTextArea
        placeholder="Description"
        value={currentCharacter.description}
        onChange={currentCharacter.setDescription}
        minRows={3}
        maxRows={3}
      />
    </StyledDescriptionCard>
  );
};

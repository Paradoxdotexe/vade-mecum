import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';

const Styled = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const LevelInput: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  return (
    <Styled>
      <VNumberInput
        size={48}
        min={1}
        max={24}
        value={character.level}
        onChange={level => updateCharacter({ level })}
      />
    </Styled>
  );
};

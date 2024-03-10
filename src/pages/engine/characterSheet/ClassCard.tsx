import { VSelect } from '@/components/VSelect';
import React from 'react';
import { CLASSES, useEngineState } from '../EngineStateContext';
import { VCard } from '@/components/VCard';

export const ClassCard: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  const classes = CLASSES.vale_of_myths;

  return (
    <VCard style={{ padding: 0 }}>
      <VSelect
        placeholder="Class"
        options={classes.map(c => ({
          value: c.label,
          label: c.label
        }))}
        value={character.class?.label}
        onChange={classLabel => {
          const currentClass = character.class;

          const newClass = classes.find(c => c.label === classLabel);
          const newAttributes = [...character.attributes];

          // remove current class skill
          if (currentClass) {
            const currentClassAttribute = newAttributes.find(
              a => a.label === currentClass.attribute
            );
            currentClassAttribute?.skills.splice(3, 1);
          }

          // add new class skill
          if (newClass) {
            const newClassAttribute = newAttributes.find(a => a.label === newClass.attribute);
            newClassAttribute?.skills.push({
              label: newClass.skill,
              value: 0
            });
          }

          updateCharacter({ class: newClass, attributes: newAttributes });
        }}
      />
    </VCard>
  );
};

import React, { ReactElement } from 'react';
import valeOfMythsDocs from './vale_of_myths.md';
import { PageLayout } from '@/common/PageLayout';
import { DocsMarkdown } from './DocsMarkdown';
import { Class } from '../vtt/types/Class';
import { startCase } from 'lodash-es';
import { WORLD_KITS } from '../vtt/types/WorldKit';
import { ClassAbilityRequirement } from '../vtt/characters/character/drawers/ClassAbilitiesDrawer';
import reactStringReplace from 'react-string-replace';

export const ValeOfMythsDocsPage: React.FC = () => {
  const markdownComponents: { [id: string]: ReactElement } = {};
  for (const c of WORLD_KITS.vale_of_myths.classes) {
    markdownComponents[`ClassAbilityTable_${c.name}_Innate`] = (
      <ClassAbilityTable class={c} innate />
    );
    markdownComponents[`ClassAbilityTable_${c.name}`] = <ClassAbilityTable class={c} />;
  }

  return (
    <PageLayout style={{ maxWidth: 900 }}>
      <DocsMarkdown src={valeOfMythsDocs} components={markdownComponents} />
    </PageLayout>
  );
};

const ClassAbilityTable: React.FC<{ class: Class; innate?: boolean }> = props => {
  return (
    <table>
      <thead>
        <tr>
          <th>Class Ability</th>
          <th>Type</th>
          {!props.innate && <th>Requirement</th>}
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.class.classAbilities
          .filter(
            classAbility => (classAbility.requirement === 'INNATE') === (props.innate ?? false)
          )
          .map(classAbility => (
            <tr key={classAbility.key}>
              <td>
                <strong>{classAbility.name}</strong>
              </td>
              <td>{startCase(classAbility.type.toLowerCase())}</td>
              {!props.innate && (
                <td>
                  <ClassAbilityRequirement class={props.class} classAbility={classAbility} />
                </td>
              )}
              <td>
                {reactStringReplace(classAbility.description, /`(.*?)`/g, match => (
                  <code>{match}</code>
                ))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

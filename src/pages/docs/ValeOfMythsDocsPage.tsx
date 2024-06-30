import React, { ReactElement } from 'react';
import valeOfMythsDocs from './vale_of_myths.md';
import { PageLayout } from '@/common/PageLayout';
import { DocsMarkdown } from './DocsMarkdown';
import { Class } from '../vtt/types/Class';
import { capitalize, startCase } from 'lodash-es';
import { WORLD_KITS } from '../vtt/types/WorldKit';
import { ClassAbilityRequirement } from '../vtt/characters/character/drawers/ClassAbilitiesDrawer';
import reactStringReplace from 'react-string-replace';
import { ItemType } from '../vtt/types/Item';

export const ValeOfMythsDocsPage: React.FC = () => {
  const markdownComponents: { [id: string]: ReactElement } = {};
  for (const c of WORLD_KITS.vale_of_myths.classes) {
    markdownComponents[`ClassAbilityTable_${c.name}_Innate`] = (
      <ClassAbilityTable class={c} innate />
    );
    markdownComponents[`ClassAbilityTable_${c.name}`] = <ClassAbilityTable class={c} />;
  }

  for (const itemType of Object.keys(ItemType)) {
    markdownComponents[`ItemsTable_${itemType}`] = <ItemsTable itemType={itemType as ItemType} />;
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

const ItemsTable: React.FC<{ itemType: ItemType }> = props => {
  const items = WORLD_KITS.vale_of_myths.items.filter(item => item.type === props.itemType);
  const showWeight = items.some(item => item.weight);

  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Cost</th>
          {showWeight && <th>Size</th>}
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.key}>
            <td>
              <strong>{item.name}</strong>
            </td>
            <td>
              <code>{item.cost}</code>
            </td>
            {item.weight ? (
              <td>
                {formatWeight(item.weight)} slot{item.weight > 1 && 's'}
              </td>
            ) : (
              showWeight && <td />
            )}
            <td>
              {item.bonus && (
                <>
                  <code>
                    {item.bonus.skillBonus >= 0 && '+'}
                    {item.bonus.skillBonus}
                  </code>{' '}
                  {capitalize(item.bonus.skillKey)}
                  {item.damage || item.notes ? ', ' : ''}
                </>
              )}
              {item.damage && (
                <>
                  <code>{item.damage}D6</code> damage{item.notes ? ', ' : ''}
                </>
              )}
              {item.notes}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const formatWeight = (weight: number) => {
  if (weight === 1 / 2) return '1/2';
  if (weight === 1 / 4) return '1/4';
  if (weight === 1 / 20) return '1/20';
  return weight;
};

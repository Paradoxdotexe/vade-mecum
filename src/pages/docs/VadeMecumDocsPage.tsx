import React from 'react';
import vadeMecumDocs from './vade_mecum.md';
import { PageLayout } from '@/common/PageLayout';
import { DocsMarkdown } from './DocsMarkdown';
import { PERKS } from '../vtt/types/Perk';
import { capitalize } from 'lodash-es';
import reactStringReplace from 'react-string-replace';
import { VHelmetTitle } from '@/components/VHelmetTitle';

export const VadeMecumDocsPage: React.FC = () => (
  <PageLayout style={{ maxWidth: 900 }}>
    <VHelmetTitle>Docs | Core Rules</VHelmetTitle>
    <DocsMarkdown
      src={vadeMecumDocs}
      components={{
        PerksTable: <PerksTable />
      }}
    />
  </PageLayout>
);

const PerksTable: React.FC = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Name</th>
          <th>Requirement</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {PERKS.map(perk => (
          <tr key={perk.key}>
            <td>{capitalize(perk.requirement.attributeKey)}</td>
            <td>
              <strong>{perk.name}</strong>
            </td>
            <td>
              {capitalize(perk.requirement.skillKey)} {perk.requirement.skillRequirement}
            </td>
            <td>
              {reactStringReplace(perk.description, /`(.*?)`/g, match => (
                <code>{match}</code>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

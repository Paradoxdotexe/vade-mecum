import React from 'react';
import vadeMecumDocs from './vade_mecum.md';
import { DocsPage } from './DocsPage';

export const VadeMecumDocsPage: React.FC = () => (
  <div>
    <DocsPage docs={vadeMecumDocs} />
  </div>
);

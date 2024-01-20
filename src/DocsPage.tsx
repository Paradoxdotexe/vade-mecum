import React from 'react';
import section1 from './docs/section1.md';
import { Markdown } from './components/Markdown';

export const DocsPage: React.FC = () => {
  return <Markdown src={section1} />;
};

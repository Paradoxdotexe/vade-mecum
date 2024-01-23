import React, { useEffect, useState } from 'react';
import * as marked from 'marked';

export type MarkdownProps = {
  src: string;
};

export const Markdown: React.FC<MarkdownProps> = props => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(props.src)
      .then(response => response.text())
      .then(marked.parse)
      .then(setMarkdown);
  }, [props.src]);

  return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
};

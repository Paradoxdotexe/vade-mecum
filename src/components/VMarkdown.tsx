import React, { useEffect, useState } from 'react';
import * as marked from 'marked';

export type VMarkdownProps = {
  src: string;
};

const headerRegex = /<h(\d)>(.*?)<\/h\1>/g;

const processMarkdown = (markdown: string) => {
  let match: RegExpExecArray | null;
  while ((match = headerRegex.exec(markdown))) {
    const id = match[2].replace(/ /g, '-');
    markdown = markdown.slice(0, match.index + 3) + ` id='${id}'` + markdown.slice(match.index + 3);
  }
  return markdown;
};

export const VMarkdown: React.FC<VMarkdownProps> = props => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(props.src)
      .then(response => response.text())
      .then(marked.parse)
      .then(markdown => setMarkdown(processMarkdown(markdown)));
  }, [props.src]);

  return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
};

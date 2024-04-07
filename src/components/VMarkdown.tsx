import React, { useEffect, useState } from 'react';
import * as marked from 'marked';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    fetch(props.src)
      .then(response => response.text())
      .then(marked.parse)
      .then(markdown => setMarkdown(processMarkdown(markdown)));
  }, [props.src]);

  useEffect(() => {
    if (markdown && location.hash) {
      setTimeout(() => {
        const anchor = document.getElementById(location.hash.slice(1));
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth' });
        }
      }, 10);
    }
  }, [markdown]);

  return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
};

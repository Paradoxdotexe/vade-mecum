import React, { ReactElement, useEffect, useState } from 'react';
import * as marked from 'marked';
import parse from 'html-react-parser';
import { useLocation } from 'react-router-dom';

const processMarkdown = (markdown: string) => {
  let match: RegExpExecArray | null;
  const headerRegex = /<h(\d)>(.*?)<\/h\1>/g;

  while ((match = headerRegex.exec(markdown))) {
    const id = match[2].replace(/ /g, '-');
    markdown = markdown.slice(0, match.index + 3) + ` id='${id}'` + markdown.slice(match.index + 3);
  }
  return markdown;
};

export type VMarkdownProps = {
  src: string;
  components?: {
    [id: string]: ReactElement;
  };
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
    if (markdown) {
      setTimeout(() => {
        if (location.hash) {
          const anchor = document.getElementById(location.hash.slice(1));
          if (anchor) {
            anchor.scrollIntoView();
          }
        } else {
          window.scrollTo({ top: 0 });
        }
      }, 10);
    }
  }, [markdown, location]);

  return (
    <>
      {parse(markdown, {
        replace:
          props.components &&
          (node => {
            const id = (node as { attribs: { id?: string } }).attribs?.id;
            return id && props.components![id];
          })
      })}
    </>
  );
};

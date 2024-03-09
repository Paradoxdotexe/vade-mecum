import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TextArea = styled.div`
  textarea {
    padding: 6px 12px;
    border: none;
    color: #fff;
    outline: none;
    background: transparent;
    font-size: 16px;
    font-family: 'Noto Sans';
    resize: none;
    width: 100%;
    height: 100%;

    &::placeholder {
      color: #868686;
    }
  }
`;

type VTextAreaProps = {
  placeholder: string;
  value?: string;
  onChange?: (value?: string) => void;
  style?: React.CSSProperties;
};

export const VTextArea: React.FC<VTextAreaProps> = props => {
  const [value, setValue] = useState<string | undefined>(props.value);

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (value !== props.value) {
      props.onChange?.(value);
    }
  }, [value]);

  return (
    <TextArea style={props.style}>
      <textarea
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder={props.placeholder}
        spellCheck="false"
      />
    </TextArea>
  );
};

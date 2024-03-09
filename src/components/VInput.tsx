import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Input = styled.div`
  background: #3b3b3b;
  border-radius: 4px;
  padding: 6px 12px;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);
  line-height: 1.4;

  input {
    padding: 0;
    border: none;
    color: #fff;
    outline: none;
    background: transparent;
    font-size: 16px;
    font-family: 'Noto Sans';

    &::placeholder {
      color: #868686;
    }
  }
`;

type VInputProps = {
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (value?: string) => void;
};

export const VInput: React.FC<VInputProps> = props => {
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
    <Input className={props.className}>
      <input
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder={props.placeholder}
      />
    </Input>
  );
};

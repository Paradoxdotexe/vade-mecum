import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as ChevronDownIcon } from '@/icons/ChevronDown.svg';
import { ReactComponent as CheckMarkIcon } from '@/icons/CheckMark.svg';
import { CSSTransition } from 'react-transition-group';

const TIMEOUT = 100;

const Select = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  user-select: none;
  background: #3b3b3b;
  border-radius: 4px;
  padding: 9px 12px;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);

  &.select--empty {
    color: #868686;
  }

  svg {
    font-size: 12px;
    color: #a3a3a3;
  }

  .select__dropdown {
    position: absolute;
    background-color: #3b3b3b;
    border-radius: 4px;
    box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);
    top: calc(100% + 6px);
    left: 0;
    z-index: 500;
    width: 100%;
    overflow: hidden;
    color: #fff;
    border: 1px solid #585858;

    .dropdown__item {
      padding: 9px 12px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:not(:last-child) {
        border-bottom: 1px solid #585858;
      }

      &.item--selected {
        font-weight: 600;
        background-color: rgba(255, 255, 255, 0.05);
      }

      &:hover {
        background-color: #585858;
      }

      svg {
        font-size: 14px;
        color: #fff;
      }
    }
  }

  .select__dropdown-enter {
    opacity: 0;
    transform: translateY(-6px) scaleY(0);
    transform-origin: top;
  }

  .select__dropdown-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all ${TIMEOUT}ms ease;
  }

  .select__dropdown-exit {
    opacity: 1;
    transform: translateY(0);
    transform-origin: top;
  }

  .select__dropdown-exit-active {
    opacity: 0;
    transform: translateY(-6px) scaleY(0);
    transition: all ${TIMEOUT}ms ease;
  }
`;

type VSelectOption = {
  value: string;
  label: string;
};

type VSelectProps = {
  placeholder: string;
  options: VSelectOption[];
  className?: string;
  value?: string;
  onChange?: (value?: string) => void;
};

export const VSelect: React.FC<VSelectProps> = props => {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState<string | undefined>(props.value);
  const dropdownRef = useRef(null);

  const option = props.options.find(option => option.value === value);

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
    <Select
      onClick={() => setActive(!active)}
      onBlur={() => setActive(false)}
      tabIndex={1}
      className={`${props.className} ${!value ? 'select--empty' : ''}`}
    >
      {option?.label ?? props.placeholder}
      <ChevronDownIcon />
      <CSSTransition
        in={active}
        timeout={TIMEOUT}
        mountOnEnter
        unmountOnExit
        classNames="select__dropdown"
        nodeRef={dropdownRef}
      >
        <div ref={dropdownRef} className="select__dropdown">
          {props.options.map(option => (
            <div
              key={option.value}
              className={`dropdown__item ${option.value === value ? 'item--selected' : ''}`}
              onClick={() => setValue(option.value)}
            >
              {option.label}
              {option.value === value && <CheckMarkIcon />}
            </div>
          ))}
        </div>
      </CSSTransition>
    </Select>
  );
};

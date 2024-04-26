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
  user-select: none;
  outline: none;
  gap: ${props => props.theme.variable.gap.md};
  padding: ${props => props.theme.variable.gap.md};

  &.select--placeholder {
    color: ${props => props.theme.color.text.tertiary};
  }

  svg {
    font-size: ${props => props.theme.variable.fontSize.xs};
    color: ${props => props.theme.color.text.tertiary};
  }

  .select__dropdown {
    position: absolute;
    background-color: ${props => props.theme.color.background.raised};
    border-radius: ${props => props.theme.variable.borderRadius};
    box-shadow: 2px 4px 16px ${props => props.theme.color.shadow.default};
    top: calc(100% + ${props => props.theme.variable.gap.md});
    left: 0;
    z-index: 500;
    width: 100%;
    overflow: hidden;
    border: 1px solid ${props => props.theme.color.border.default};
    color: ${props => props.theme.color.text.primary};
    min-width: fit-content;

    .dropdown__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: ${props => props.theme.variable.gap.md};
      gap: ${props => props.theme.variable.gap.md};

      &:not(:last-child) {
        border-bottom: 1px solid ${props => props.theme.color.border.default};
      }

      &:hover {
        background-color: ${props => props.theme.color.background.hovered};
      }

      &.item--selected {
        background-color: ${props => props.theme.color.background.active};
      }

      svg {
        color: ${props => props.theme.color.text.primary};
      }
    }
  }

  .select__dropdown-enter {
    opacity: 0;
    transform: translateY(-${props => props.theme.variable.gap.md}) scaleY(0);
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
    transform: translateY(-${props => props.theme.variable.gap.md}) scaleY(0);
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
      className={` ${!value ? 'select--placeholder' : ''}`}
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

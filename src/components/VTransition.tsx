import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled, { RuleSet } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const StyledVTransition = styled.div<{
  $timeout: number;
  $outStyle: RuleSet<object>;
  $inStyle: RuleSet<object>;
}>`
  .transition__child-enter {
    ${props => props.$outStyle}
  }

  .transition__child-enter-active {
    ${props => props.$inStyle}
    transition: all ${props => props.$timeout}ms;
  }

  .transition__child-exit {
    ${props => props.$inStyle}
  }

  .transition__child-exit-active {
    ${props => props.$outStyle}
    transition: all ${props => props.$timeout}ms;
  }
`;

type VTransitionProps = {
  in: boolean;
  timeout?: number;
  onExited?: () => void;
  children: ReactNode;
  outStyle: RuleSet<object>;
  inStyle: RuleSet<object>;
  initialTransition?: boolean;
};

export const VTransition: React.FC<VTransitionProps> = props => {
  const [show, setShow] = useState(props.initialTransition ? !props.in : props.in);

  const nodeRef = useRef(null);

  const timeout = props.timeout ?? 150;

  useEffect(() => setShow(props.in), [props.in]);

  return (
    <StyledVTransition $timeout={timeout} $outStyle={props.outStyle} $inStyle={props.inStyle}>
      <CSSTransition
        in={show}
        timeout={timeout}
        mountOnEnter
        unmountOnExit
        onExited={props.onExited}
        classNames="transition__child"
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="transition__child" onClick={event => event.stopPropagation()}>
          {props.children}
        </div>
      </CSSTransition>
    </StyledVTransition>
  );
};

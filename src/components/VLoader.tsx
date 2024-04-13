import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;

  .loader__dots {
    height: 24px;
    aspect-ratio: 2.5;
    --_g: no-repeat radial-gradient(farthest-side, #a1a1a1 75%, #0000);
    background: var(--_g), var(--_g), var(--_g), var(--_g);
    background-size: 20% 50%;
    animation: l43 1s infinite linear;
  }

  @keyframes l43 {
    0% {
      background-position:
        calc(0 * 100% / 3) 50%,
        calc(1 * 100% / 3) 50%,
        calc(2 * 100% / 3) 50%,
        calc(3 * 100% / 3) 50%;
    }
    16.67% {
      background-position:
        calc(0 * 100% / 3) 0,
        calc(1 * 100% / 3) 50%,
        calc(2 * 100% / 3) 50%,
        calc(3 * 100% / 3) 50%;
    }
    33.33% {
      background-position:
        calc(0 * 100% / 3) 100%,
        calc(1 * 100% / 3) 0,
        calc(2 * 100% / 3) 50%,
        calc(3 * 100% / 3) 50%;
    }
    50% {
      background-position:
        calc(0 * 100% / 3) 50%,
        calc(1 * 100% / 3) 100%,
        calc(2 * 100% / 3) 0,
        calc(3 * 100% / 3) 50%;
    }
    66.67% {
      background-position:
        calc(0 * 100% / 3) 50%,
        calc(1 * 100% / 3) 50%,
        calc(2 * 100% / 3) 100%,
        calc(3 * 100% / 3) 0;
    }
    83.33% {
      background-position:
        calc(0 * 100% / 3) 50%,
        calc(1 * 100% / 3) 50%,
        calc(2 * 100% / 3) 50%,
        calc(3 * 100% / 3) 100%;
    }
    100% {
      background-position:
        calc(0 * 100% / 3) 50%,
        calc(1 * 100% / 3) 50%,
        calc(2 * 100% / 3) 50%,
        calc(3 * 100% / 3) 50%;
    }
  }
`;

type VLoaderProps = {
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export const VLoader: React.FC<VLoaderProps> = props => {
  return (
    <StyledVLoader style={props.style} className={props.className}>
      <div className="loader__dots" />
    </StyledVLoader>
  );
};

import { useVTheme } from '@/common/VTheme';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVLoader = styled.div<{ $color: string; $size: number }>`
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.variable.gap.xl};

  .loader__dots {
    height: ${props => props.$size}px;
    aspect-ratio: 2.5;
    --_g: no-repeat radial-gradient(farthest-side, ${props => props.$color} 75%, #0000);
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
  color?: string;
  size?: number;
};

export const VLoader: React.FC<VLoaderProps> = props => {
  const theme = useVTheme();

  return (
    <StyledVLoader
      $color={props.color ?? theme.color.text.secondary}
      $size={props.size ?? 24}
      style={props.style}
      className={props.className}
    >
      <div className="loader__dots" />
    </StyledVLoader>
  );
};

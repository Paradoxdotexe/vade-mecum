import { css } from 'styled-components';

export const pulsingBackground = css`
  position: relative;
  background: #3485fe !important;
  z-index: 1;
  overflow: hidden;
  animation: pulseBackground linear 2s infinite;

  &:after {
    content: '';
    display: block;
    z-index: -1;
    position: absolute;
    background: linear-gradient(
      90deg,
      rgba(52, 212, 254, 0) 0%,
      rgba(52, 212, 254, 1) 50%,
      rgba(52, 212, 254, 0) 100%
    );
    width: 400%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;
    animation: pulseBackgroundGradient linear 2s infinite;

    @keyframes pulseBackgroundGradient {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(25%);
      }
    }
  }

  @keyframes pulseBackground {
    50% {
      background: #34a9fe !important;
    }
  }
`;

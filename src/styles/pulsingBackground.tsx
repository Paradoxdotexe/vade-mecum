import { css } from 'styled-components';

export const pulsingBackground = (color: string, lightColor: string, darkColor: string) => css`
  position: relative;
  background: ${darkColor} !important;
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
      ${lightColor + '00'} 0%,
      ${lightColor} 50%,
      ${lightColor + '00'} 100%
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
      background: ${color} !important;
    }
  }
`;

export const pulsingSuccess = pulsingBackground('#34a9fe', '#34d6fe', '#3485fe');
export const pulsingFailure = pulsingBackground('#F48E16', '#f4d316', '#f45516');

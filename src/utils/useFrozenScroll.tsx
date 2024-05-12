import { useVTheme } from '@/common/VTheme';
import { useEffect } from 'react';

export const useFrozenScroll = (frozen: boolean) => {
  const theme = useVTheme();

  useEffect(() => {
    const html = document.documentElement;
    const rollLog = document.getElementById('roll-log');

    const hasScrollbar = html.scrollHeight > html.clientHeight;

    if (frozen) {
      html.style.overflow = 'hidden';

      if (hasScrollbar) {
        html.style.paddingRight = theme.variable.gap.lg;

        if (rollLog) {
          rollLog.style.right = theme.variable.gap.lg;
        }
      }
    } else {
      html.style.overflow = '';
      html.style.paddingRight = '';

      if (rollLog) {
        rollLog.style.right = '';
      }
    }
  }, [frozen]);
};

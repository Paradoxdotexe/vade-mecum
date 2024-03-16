import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import React from 'react';

type EditPerksDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'>;

export const EditPerksDrawer: React.FC<EditPerksDrawerProps> = props => {
  return (
    <VDrawer {...props} width={800} header={'Edit Perks'}>
      Hello world!
    </VDrawer>
  );
};

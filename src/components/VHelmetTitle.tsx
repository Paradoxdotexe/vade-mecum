import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

type VHelmetTitleProps = {
  children: ReactNode;
};

export const VHelmetTitle: React.FC<VHelmetTitleProps> = props => (
  <Helmet>
    <title>{props.children}</title>
  </Helmet>
);

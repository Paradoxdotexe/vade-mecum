import React from 'react';
import { useVTTUser } from '../../common/VTTUser';
import { Outlet } from 'react-router-dom';
import { LoginPage } from './LoginPage';

export const VTT: React.FC = () => {
  const user = useVTTUser();

  if (!user.authenticated) {
    return <LoginPage />;
  }

  return <Outlet />;
};

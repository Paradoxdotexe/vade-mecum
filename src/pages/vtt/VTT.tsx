import React, { useMemo } from 'react';
import { useVTTUser } from '../../common/VTTUser';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const VTT: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useVTTUser();

  const forwardToLogin = !user.authenticated && location.pathname != '/vtt/login';

  useMemo(() => {
    if (forwardToLogin) {
      navigate('/vtt/login');
    }
  }, [user, location]);

  if (forwardToLogin) {
    return null;
  }

  return <Outlet />;
};

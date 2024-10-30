import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectAuthenticatedTo }) => {
  const user = useSelector((state) => state.user.user);

  if (user && redirectAuthenticatedTo) {
    return <Navigate to={redirectAuthenticatedTo}  />;
  }

  if (!user && !redirectAuthenticatedTo) {
    return <Navigate to="/login" replace={false} />;
  }

  return children;
};

export default ProtectedRoute;

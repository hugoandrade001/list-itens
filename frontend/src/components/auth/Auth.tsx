import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchToRegister = () => setIsLoginMode(false);
  const switchToLogin = () => setIsLoginMode(true);

  return (
    <>
      {isLoginMode ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default Auth;
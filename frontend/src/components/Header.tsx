import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
<header className="app-header">
                <h1 className="app-title">Choosy</h1>
                <div className="header-buttons">
                    {
                     (
                        <>
                            <button className="login-button">
                                Log in
                            </button>
                            <button className="register-button">
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </header>
  );
};

export default Header; 